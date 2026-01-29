const express = require('express');
const { db } = require('../database');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for redirect endpoint
// Allows 100 requests per minute per IP
const redirectLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // Max 100 requests per window per IP
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Weighted random selection algorithm
function selectVariant(variants) {
    if (!variants || variants.length === 0) return null;
    if (variants.length === 1) return variants[0];

    // Calculate total weight
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);

    // Generate random number 0-totalWeight
    const random = Math.random() * totalWeight;

    // Select variant based on cumulative weight
    let cumulative = 0;
    for (const variant of variants) {
        cumulative += variant.weight;
        if (random <= cumulative) {
            return variant;
        }
    }

    // Fallback to first variant (should never reach here)
    return variants[0];
}

// Helper: Check if a schedule is currently active
function isScheduleActive(schedule, now = new Date()) {
    // One-time schedule (legacy behavior)
    if (!schedule.recurrence_type || schedule.recurrence_type === 'once') {
        const start = new Date(schedule.start_time);
        const end = schedule.end_time ? new Date(schedule.end_time) : null;
        return now >= start && (!end || now <= end);
    }

    // Recurring schedule
    // Check if recurrence has ended
    if (schedule.recurrence_end_date) {
        const endDate = new Date(schedule.recurrence_end_date);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (now > endDate) return false;
    }

    // Check day of week
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'lowercase', timeZone: 'UTC' });

    if (schedule.recurrence_type === 'daily') {
        // Active every day - continue to time check
    } else if (schedule.recurrence_type === 'weekdays') {
        if (!['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(dayOfWeek)) {
            return false;
        }
    } else if (schedule.recurrence_type === 'weekends') {
        if (!['saturday', 'sunday'].includes(dayOfWeek)) {
            return false;
        }
    } else if (schedule.recurrence_type === 'weekly') {
        const allowedDays = schedule.recurrence_days ? JSON.parse(schedule.recurrence_days) : [];
        if (!allowedDays.includes(dayOfWeek)) {
            return false;
        }
    }

    // Check time of day for recurring schedules
    // start_time and end_time are stored as "HH:MM" for recurring schedules
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    const startTime = schedule.start_time; // "HH:MM" for recurring
    const endTime = schedule.end_time;     // "HH:MM" for recurring

    return currentTime >= startTime && (!endTime || currentTime <= endTime);
}

// Find the currently active schedule from a list
function findActiveSchedule(schedules) {
    const now = new Date();

    // Find all active schedules
    const activeSchedules = schedules.filter(s => isScheduleActive(s, now));

    if (activeSchedules.length === 0) return null;

    // If multiple active schedules, prioritize by:
    // 1. One-time schedules over recurring
    // 2. Most recently started
    const oneTimeActive = activeSchedules.filter(s => !s.recurrence_type || s.recurrence_type === 'once');
    if (oneTimeActive.length > 0) {
        // Return the most recently started one-time schedule
        return oneTimeActive.sort((a, b) => new Date(b.start_time) - new Date(a.start_time))[0];
    }

    // All active are recurring, return first one
    return activeSchedules[0];
}

router.get('/:shortCode', redirectLimiter, (req, res) => {
    const { shortCode } = req.params;

    // specific exclusion for API routes if they conflict (though mounting order handles this usually)
    if (shortCode === 'api' || shortCode === 'favicon.ico') {
        return res.status(404).end(); // Pass to next router or just 404
    }

    const stmt = db.prepare('SELECT id, destination_url, ab_testing_enabled, scheduling_enabled FROM qrs WHERE short_code = ? AND status = "active"');
    const qr = stmt.get(shortCode);

    if (qr) {
        let destinationUrl = qr.destination_url;
        let variantId = null;
        let scheduleRuleId = null;

        // Priority 1: Check if scheduling is enabled
        if (qr.scheduling_enabled) {
            const schedulesStmt = db.prepare('SELECT id, destination_url, start_time, end_time, recurrence_type, recurrence_days, recurrence_end_date FROM qr_schedule_rules WHERE qr_id = ? ORDER BY start_time ASC');
            const schedules = schedulesStmt.all(qr.id);

            if (schedules && schedules.length > 0) {
                const activeSchedule = findActiveSchedule(schedules);
                if (activeSchedule) {
                    destinationUrl = activeSchedule.destination_url;
                    scheduleRuleId = activeSchedule.id;
                }
            }
        }
        // Priority 2: Check if A/B testing is enabled (only if scheduling didn't apply)
        else if (qr.ab_testing_enabled) {
            const variantsStmt = db.prepare('SELECT id, destination_url, weight FROM qr_variants WHERE qr_id = ? ORDER BY created_at ASC');
            const variants = variantsStmt.all(qr.id);

            if (variants && variants.length > 0) {
                // Calculate control weight (remaining percentage after variants)
                const totalVariantWeight = variants.reduce((sum, v) => sum + v.weight, 0);
                const controlWeight = Math.max(0, 100 - totalVariantWeight);

                // Create control "variant" object for weighted selection
                const control = {
                    id: null, // null indicates control
                    destination_url: qr.destination_url,
                    weight: controlWeight
                };

                // Combine control + variants for weighted selection
                const allOptions = controlWeight > 0 ? [control, ...variants] : variants;

                const selectedVariant = selectVariant(allOptions);
                if (selectedVariant) {
                    destinationUrl = selectedVariant.destination_url;
                    variantId = selectedVariant.id; // Will be null for control
                }
            }
        }

        // Log Scan (Async - fire and forget for speed)
        const scanStmt = db.prepare(`
            INSERT INTO scans (qr_id, variant_id, schedule_rule_id, ip, user_agent, device_type, os, country, city, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Basic extraction (can use user-agent parser lib later for device/os)
        const ip = req.ip || req.connection.remoteAddress;
        const ua = req.get('User-Agent');
        const referrer = req.get('Referrer');

        try {
            scanStmt.run(qr.id, variantId, scheduleRuleId, ip, ua, 'unknown', 'unknown', 'unknown', 'unknown', referrer);
        } catch (e) {
            console.error('Scan logging failed', e);
        }

        return res.redirect(destinationUrl);
    } else {
        return res.status(404).send('QR Code not found or inactive');
    }
});

module.exports = router;
