/**
 * Redirect Service - Supabase Version
 * 
 * Handles public redirect endpoints using Supabase for data lookup.
 * Implements Advanced Routing: Schedules -> A/B Testing -> Basic Fallback.
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const requestIp = require('request-ip');
const ua = require('useragent');
const geoip = require('geoip-lite');
const logger = require('../utils/logger');

const router = express.Router();

// Initialize Supabase Client (Admin Client for Bypass RLS)

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error('CRITICAL: Missing SUPABASE_SERVICE_ROLE_KEY. Redirects will fail if RLS is enabled.');
}

// Use Service Key if available, otherwise fall back to Anon (Unsafe for production with RLS)
// Use Service Key if available, otherwise fall back to Anon (Unsafe for production with RLS)
let supabaseAdmin;
try {
    if (SUPABASE_URL) {
        supabaseAdmin = createClient(
            SUPABASE_URL,
            SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY,
            { auth: { persistSession: false } }
        );
    } else {
        logger.warn('Redirect Service: SUPABASE_URL missing. Redirects will fail.');
    }
} catch (e) {
    logger.error('CRITICAL: Failed to init Supabase Admin client', e);
}

router.get('/r/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    if (!supabaseAdmin) {
        return res.status(503).send('Redirect service unavailable');
    }

    try {
        // 1. Lookup QR
        // We select all fields to check feature flags
        const { data: qr, error } = await supabaseAdmin
            .from('qrs')
            .select('*')
            .eq('short_code', shortCode)
            .single();

        if (error || !qr) {
            logger.warn(`QR not found: ${shortCode}`);
            return res.status(404).send('QR Code not found');
        }

        if (qr.status !== 'active') {
            return res.status(410).send('This QR Code is inactive');
        }

        // Initialize Routing Variables
        let destination_url = qr.destination_url;
        let routing_mode = 'basic';
        let variant_id = null;
        let schedule_rule_id = null;
        const now = new Date();

        console.log(`🚀 [REDIRECT] Routing started for code: ${shortCode} (ID: ${qr.id})`);
        console.log(`📍 [REDIRECT] Fallback URL: ${qr.destination_url}`);

        // 2. Evaluate Schedules (Priority 1)
        if (qr.scheduling_enabled) {
            console.log(`📅 [REDIRECT] Scheduling enabled. Checking rules...`);
            // Fetch active schedules
            const { data: schedules } = await supabaseAdmin
                .from('schedules')
                .select('*')
                .eq('qr_id', qr.id)
                .eq('active', true);

            if (schedules && schedules.length > 0) {
                console.log(`📅 [REDIRECT] Found ${schedules.length} active schedule rules.`);
                // Filter matching schedules
                const matchingSchedule = schedules.find(schedule => {
                    // Check Time Window (UTC)
                    const startTime = new Date(schedule.start_time);
                    if (startTime > now) {
                        console.log(`   - Rule ${schedule.id} skipped: Not started yet (Starts: ${schedule.start_time})`);
                        return false;
                    }

                    if (schedule.end_time) {
                        const endTime = new Date(schedule.end_time);
                        if (endTime < now) {
                            console.log(`   - Rule ${schedule.id} skipped: Already ended (Ended: ${schedule.end_time})`);
                            return false;
                        }
                    }

                    // Check Days (Timezone aware)
                    if (schedule.days && schedule.days.length > 0) {
                        try {
                            const targetTz = schedule.timezone || 'UTC';
                            const formatter = new Intl.DateTimeFormat('en-US', {
                                timeZone: targetTz,
                                weekday: 'short'
                            });
                            const dayName = formatter.format(now);
                            const map = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
                            const currentDayIndex = map[dayName];

                            if (!schedule.days.includes(currentDayIndex)) {
                                console.log(`   - Rule ${schedule.id} skipped: Day mismatch (Current: ${dayName}/${currentDayIndex}, Allowed: ${schedule.days})`);
                                return false;
                            }
                        } catch (err) {
                            logger.error('Timezone calculation error', err);
                            return false;
                        }
                    }

                    console.log(`   ✅ Rule ${schedule.id} matched!`);
                    return true;
                });

                if (matchingSchedule) {
                    destination_url = matchingSchedule.destination_url;
                    routing_mode = 'scheduled';
                    schedule_rule_id = matchingSchedule.id;
                    console.log(`🎯 [REDIRECT] Schedule match found: ${destination_url}`);
                }
            } else {
                console.log(`📅 [REDIRECT] No active schedule rules found for this QR.`);
            }
        }

        // 3. Evaluate A/B Variants (Priority 2, only if not scheduled)
        if (routing_mode === 'basic' && qr.ab_testing_enabled) {
            console.log(`🧪 [REDIRECT] A/B Testing enabled. Checking variants for QR ${qr.id}...`);
            const { data: variants, error: vErr } = await supabaseAdmin
                .from('variants')
                .select('*')
                .eq('qr_id', qr.id)
                .eq('is_enabled', true);

            if (vErr) {
                console.error(`🧪 [REDIRECT] Variants query error:`, vErr);
            }

            if (variants && variants.length > 0) {
                const realTotal = variants.reduce((sum, v) => sum + (v.weight || 0), 0);
                console.log(`🧪 [REDIRECT] Found ${variants.length} active variants. Total Weight: ${realTotal}%`);

                if (realTotal > 0) {
                    let cursor = 0;
                    const pickedRandom = Math.random() * 100;
                    console.log(`🧪 [REDIRECT] Random number: ${pickedRandom.toFixed(2)}`);

                    for (const v of variants) {
                        cursor += v.weight;
                        if (pickedRandom <= cursor) {
                            destination_url = v.destination_url;
                            variant_id = v.id;
                            routing_mode = 'ab';
                            console.log(`🎯 [REDIRECT] A/B Variant matched: ${v.name} (${destination_url})`);
                            break;
                        }
                    }
                    if (routing_mode === 'basic') {
                        console.log(`🧪 [REDIRECT] No variant matched (Random exceeded total weight). Falling back to basic.`);
                    }
                }
            } else {
                console.log(`🧪 [REDIRECT] No active variants found.`);
            }
        }

        console.log(`🏁 [REDIRECT] Final Decision: Mode=${routing_mode}, URL=${destination_url}`);

        // 4. Log Scan (Async)
        // Never block response on logging
        logScan(supabaseAdmin, qr.id, req, {
            destination_url,
            routing_mode,
            variant_id,
            schedule_rule_id
        }).catch(err => logger.error('Failed to log scan', err));

        // 5. Redirect
        res.redirect(destination_url);

    } catch (e) {
        logger.error('Redirect error', e);
        res.status(500).send('Server Error');
    }
});

/**
 * Helper to insert scan record
 */
async function logScan(client, qrId, req, attribution) {
    const ip = requestIp.getClientIp(req);
    const agent = ua.parse(req.headers['user-agent']);
    const geo = geoip.lookup(ip);

    const scanData = {
        qr_id: qrId,
        ip_address: ip,
        user_agent: agent.toString(),
        device_type: (agent.device.toString() === 'Other 0.0.0' ? 'Desktop' : agent.device.toString()) || 'Desktop',
        os: agent.os.toString(),
        browser: agent.toAgent(),
        city: geo ? geo.city : null,
        country: geo ? geo.country : null,
        scanned_at: new Date().toISOString(),
        referrer: req.get('Referrer') || null,

        // Attribution
        destination_url: attribution.destination_url,
        routing_mode: attribution.routing_mode,
        variant_id: attribution.variant_id || null,
        schedule_rule_id: attribution.schedule_rule_id || null
    };

    const { error } = await client.from('scans').insert(scanData);
    if (error) {
        // Just throw to satisfy catch block in caller
        throw error;
    }
}

module.exports = router;
