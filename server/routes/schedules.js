const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');
const validateDestinationUrl = require('../middleware/validateUrl');

const router = express.Router();

// Helper function to check Starter plan or higher
const requireStarterOrHigher = (req, res, next) => {
    const userId = req.user.id;
    const userStmt = db.prepare('SELECT plan FROM users WHERE id = ?');
    const user = userStmt.get(userId);
    const plan = user?.plan || 'free';

    if (plan === 'free') {
        return res.status(403).json({
            error: 'Scheduled redirects are available on Starter and Pro plans',
            upgrade_required: true,
            required_plan: 'starter'
        });
    }

    next();
};

// Helper function to validate no overlapping schedules
function validateNoOverlap(newRule, existingRules, excludeId = null) {
    const newStart = new Date(newRule.start_time);
    const newEnd = newRule.end_time ? new Date(newRule.end_time) : null;

    for (const rule of existingRules) {
        // Skip the rule being updated
        if (excludeId && rule.id === excludeId) continue;

        const ruleStart = new Date(rule.start_time);
        const ruleEnd = rule.end_time ? new Date(rule.end_time) : null;

        // Check for overlap
        // Two time ranges overlap if: start1 < end2 AND start2 < end1
        const start1 = newStart;
        const end1 = newEnd || new Date('9999-12-31'); // Treat null as infinity
        const start2 = ruleStart;
        const end2 = ruleEnd || new Date('9999-12-31');

        if (start1 < end2 && start2 < end1) {
            return {
                valid: false,
                conflictsWith: rule
            };
        }
    }

    return { valid: true };
}

// Get all schedule rules for a QR
router.get('/:id/schedules', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;

        // Verify ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Get schedule rules
        const schedulesStmt = db.prepare(`
            SELECT 
                id,
                destination_url,
                start_time,
                end_time,
                label,
                recurrence_type,
                recurrence_days,
                recurrence_end_date,
                created_at
            FROM qr_schedule_rules
            WHERE qr_id = ?
            ORDER BY start_time ASC
        `);

        const schedules = schedulesStmt.all(qrId);

        // Determine which schedule is currently active
        const now = new Date();
        schedules.forEach(schedule => {
            // For one-time schedules
            if (!schedule.recurrence_type || schedule.recurrence_type === 'once') {
                const isActive = new Date(schedule.start_time) <= now &&
                    (!schedule.end_time || new Date(schedule.end_time) > now);
                schedule.is_active = isActive;
            } else {
                // For recurring schedules, use the same logic as redirect.js
                schedule.is_active = false; // Will be calculated on frontend or during redirect
            }
        });

        res.json({
            scheduling_enabled: qr.scheduling_enabled === 1,
            schedules
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new schedule rule (Starter+)
router.post('/:id/schedules', authenticateToken, requireStarterOrHigher, validateDestinationUrl, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const { destination_url, start_time, end_time, label, recurrence_type, recurrence_days, recurrence_end_date } = req.body;

        if (!destination_url || !start_time) {
            return res.status(400).json({ error: 'destination_url and start_time are required' });
        }

        // Verify ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Add logging to debug
        console.log('[Schedules POST] Received data:', {
            destination_url,
            start_time,
            end_time,
            label,
            recurrence_type,
            recurrence_days,
            recurrence_end_date
        });

        // Validate end_time is after start_time
        if (end_time) {
            if (recurrence_type === 'once') {
                // For one-time schedules, validate full datetime
                if (new Date(end_time) <= new Date(start_time)) {
                    return res.status(400).json({ error: 'end_time must be after start_time' });
                }
            } else {
                // For recurring schedules, validate time-only (HH:MM format)
                if (end_time <= start_time) {
                    return res.status(400).json({ error: 'end_time must be after start_time' });
                }
            }
        }

        // Get existing schedules
        const existingStmt = db.prepare('SELECT * FROM qr_schedule_rules WHERE qr_id = ?');
        const existing = existingStmt.all(qrId);

        // Only validate overlap for one-time schedules
        // Recurring schedules can coexist with different day patterns
        if (recurrence_type === 'once') {
            const validation = validateNoOverlap({ start_time, end_time }, existing.filter(s => !s.recurrence_type || s.recurrence_type === 'once'));
            if (!validation.valid) {
                // Check if the conflicting schedule has no end_time (ongoing schedule)
                const conflictingSchedule = validation.conflictsWith;

                if (conflictingSchedule && !conflictingSchedule.end_time) {
                    // Automatically set the end_time of the ongoing schedule to the new schedule's start_time
                    const updateStmt = db.prepare(`
                        UPDATE qr_schedule_rules 
                        SET end_time = ? 
                        WHERE id = ?
                    `);

                    updateStmt.run(start_time, conflictingSchedule.id);

                    console.log(`[Schedules] Auto-set end_time for schedule ${conflictingSchedule.id} to ${start_time}`);
                } else {
                    // Real overlap conflict - both schedules have defined end times that conflict
                    return res.status(400).json({
                        error: 'Schedule overlaps with existing rule',
                        conflicts_with: validation.conflictsWith
                    });
                }
            }
        }

        // Create schedule
        const insertStmt = db.prepare(`
            INSERT INTO qr_schedule_rules (qr_id, destination_url, start_time, end_time, label, recurrence_type, recurrence_days, recurrence_end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = insertStmt.run(
            qrId,
            destination_url,
            start_time,
            end_time || null,
            label || null,
            recurrence_type || 'once',
            recurrence_days || null,
            recurrence_end_date || null
        );

        const responseData = {
            id: result.lastInsertRowid,
            qr_id: qrId,
            destination_url,
            start_time,
            end_time: end_time || null,
            label: label || null,
            recurrence_type: recurrence_type || 'once',
            recurrence_days: recurrence_days || null,
            recurrence_end_date: recurrence_end_date || null,
            created_at: new Date().toISOString()
        };

        console.log('[Schedules POST] Created schedule:', responseData);

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update schedule rule (Starter+)
router.put('/:id/schedules/:scheduleId', authenticateToken, requireStarterOrHigher, validateDestinationUrl, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const scheduleId = req.params.scheduleId;
        const { destination_url, start_time, end_time, label, recurrence_type, recurrence_days, recurrence_end_date } = req.body;

        // Verify QR ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Verify schedule belongs to this QR
        const scheduleStmt = db.prepare('SELECT * FROM qr_schedule_rules WHERE id = ? AND qr_id = ?');
        const schedule = scheduleStmt.get(scheduleId, qrId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Build update
        const updates = [];
        const values = [];

        if (destination_url !== undefined) {
            updates.push('destination_url = ?');
            values.push(destination_url);
        }

        if (start_time !== undefined) {
            updates.push('start_time = ?');
            values.push(start_time);
        }

        if (end_time !== undefined) {
            updates.push('end_time = ?');
            values.push(end_time || null);
        }

        if (label !== undefined) {
            updates.push('label = ?');
            values.push(label);
        }

        if (recurrence_type !== undefined) {
            updates.push('recurrence_type = ?');
            values.push(recurrence_type || 'once');
        }

        if (recurrence_days !== undefined) {
            updates.push('recurrence_days = ?');
            values.push(recurrence_days || null);
        }

        if (recurrence_end_date !== undefined) {
            updates.push('recurrence_end_date = ?');
            values.push(recurrence_end_date || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        // Validate no overlap if times are being updated
        if (start_time !== undefined || end_time !== undefined) {
            const newRule = {
                start_time: start_time || schedule.start_time,
                end_time: end_time !== undefined ? end_time : schedule.end_time
            };

            const existingStmt = db.prepare('SELECT * FROM qr_schedule_rules WHERE qr_id = ?');
            const existing = existingStmt.all(qrId);

            const validation = validateNoOverlap(newRule, existing, scheduleId);
            if (!validation.valid) {
                // Check if the conflicting schedule has no end_time (ongoing schedule)
                const conflictingSchedule = validation.conflictsWith;

                if (conflictingSchedule && !conflictingSchedule.end_time) {
                    // Automatically set the end_time of the ongoing schedule to the updated schedule's start_time
                    const updateConflictStmt = db.prepare(`
                        UPDATE qr_schedule_rules 
                        SET end_time = ? 
                        WHERE id = ?
                    `);

                    updateConflictStmt.run(newRule.start_time, conflictingSchedule.id);

                    console.log(`[Schedules] Auto-set end_time for schedule ${conflictingSchedule.id} to ${newRule.start_time}`);
                } else {
                    // Real overlap conflict - both schedules have defined end times that conflict
                    return res.status(400).json({
                        error: 'Schedule overlaps with existing rule',
                        conflicts_with: validation.conflictsWith
                    });
                }
            }
        }

        values.push(scheduleId);

        const updateStmt = db.prepare(`
            UPDATE qr_schedule_rules 
            SET ${updates.join(', ')}
            WHERE id = ?
        `);

        updateStmt.run(...values);

        // Return updated schedule with is_active field
        const updated = scheduleStmt.get(scheduleId, qrId);

        // Calculate is_active (same logic as GET endpoint)
        const now = new Date().toISOString();
        updated.is_active = updated.start_time <= now && (!updated.end_time || updated.end_time > now);

        res.json(updated);
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete schedule rule (Starter+)
router.delete('/:id/schedules/:scheduleId', authenticateToken, requireStarterOrHigher, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const scheduleId = req.params.scheduleId;

        // Verify QR ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Verify schedule exists
        const scheduleStmt = db.prepare('SELECT * FROM qr_schedule_rules WHERE id = ? AND qr_id = ?');
        const schedule = scheduleStmt.get(scheduleId, qrId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Delete schedule
        const deleteStmt = db.prepare('DELETE FROM qr_schedule_rules WHERE id = ?');
        deleteStmt.run(scheduleId);

        res.json({
            deleted: true,
            message: 'Schedule deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle scheduling (Starter+)
router.post('/:id/scheduling/toggle', authenticateToken, requireStarterOrHigher, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'enabled must be a boolean' });
        }

        // Verify ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // If enabling, check if schedules exist
        if (enabled) {
            const schedulesStmt = db.prepare('SELECT COUNT(*) as count FROM qr_schedule_rules WHERE qr_id = ?');
            const { count } = schedulesStmt.get(qrId);

            if (count === 0) {
                return res.status(400).json({
                    error: 'Scheduling requires at least 1 schedule rule',
                    hint: 'Create schedule rules first before enabling scheduling'
                });
            }

            // Disable A/B testing if enabling scheduling (mutual exclusivity)
            if (qr.ab_testing_enabled) {
                const disableABStmt = db.prepare('UPDATE qrs SET ab_testing_enabled = 0 WHERE id = ?');
                disableABStmt.run(qrId);
            }
        }

        // Update QR
        const updateStmt = db.prepare('UPDATE qrs SET scheduling_enabled = ? WHERE id = ?');
        updateStmt.run(enabled ? 1 : 0, qrId);

        res.json({
            scheduling_enabled: enabled,
            ab_testing_disabled: enabled && qr.ab_testing_enabled,
            message: enabled ? 'Scheduling enabled' : 'Scheduling disabled'
        });
    } catch (error) {
        console.error('Error toggling scheduling:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
