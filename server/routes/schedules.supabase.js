/**
 * Schedules Routes - Supabase Version
 * 
 * Handles time-based redirects for QRs.
 */

const express = require('express');
const supabaseAuth = require('../middleware/supabaseAuth');
const logger = require('../utils/logger');
const { requireFeature } = require('../middleware/planEnforcement');

const router = express.Router();

// GET /api/qrs/:id/schedules
router.get('/:id/schedules', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        // Verify ownership of QR
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id, scheduling_enabled')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        // Fetch schedules
        const { data: schedules, error } = await req.supabase
            .from('schedules')
            .select('*')
            .eq('qr_id', id)
            .order('start_time', { ascending: true });

        if (error) throw error;

        // Fetch scan counts per schedule
        const { data: scanCounts } = await req.supabase
            .from('scans')
            .select('schedule_rule_id')
            .eq('qr_id', id)
            .not('schedule_rule_id', 'is', null);

        const countsMap = (scanCounts || []).reduce((acc, s) => {
            acc[s.schedule_rule_id] = (acc[s.schedule_rule_id] || 0) + 1;
            return acc;
        }, {});

        const mappedSchedules = (schedules || []).map(s => ({
            ...s,
            is_active: s.active,
            label: s.destination_url, // Use URL as fallback label
            recurrence_type: (s.days && s.days.length > 0) ? 'weekly' : 'once',
            recurrence_days: s.days ? JSON.stringify(s.days.map(d => {
                const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                return map[d];
            })) : '[]',
            scan_count: countsMap[s.id] || 0
        }));

        res.json({
            schedules: mappedSchedules,
            scheduling_enabled: qr.scheduling_enabled
        });
    } catch (e) {
        logger.error('Error fetching schedules', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/qrs/:id/schedules
router.post('/:id/schedules', supabaseAuth, requireFeature('scheduling'), async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time, destination_url, days, timezone } = req.body;
    const user = req.user;

    try {
        // Verify QR ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        const { data: schedule, error } = await req.supabase
            .from('schedules')
            .insert({
                qr_id: id,
                destination_url,
                start_time,
                end_time: end_time || null,
                is_enabled: true,
                days: days || [],
                timezone: timezone || 'UTC'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(schedule);
    } catch (e) {
        logger.error('Error creating schedule', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/qrs/:id/schedules/:scheduleId
router.put('/:id/schedules/:scheduleId', supabaseAuth, requireFeature('scheduling'), async (req, res) => {
    const { id, scheduleId } = req.params;
    const { start_time, end_time, destination_url, days, timezone } = req.body;
    const user = req.user;

    try {
        // Verify QR ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        // Build updates object
        const updates = {};
        if (destination_url !== undefined) updates.destination_url = destination_url;
        if (start_time !== undefined) updates.start_time = start_time;
        if (end_time !== undefined) updates.end_time = end_time || null;
        if (days !== undefined) updates.days = days || [];
        if (timezone !== undefined) updates.timezone = timezone || 'UTC';

        const { data: schedule, error } = await req.supabase
            .from('schedules')
            .update(updates)
            .eq('id', scheduleId)
            .eq('qr_id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(schedule);
    } catch (e) {
        logger.error('Error updating schedule', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/qrs/:id/schedules/:scheduleId
router.delete('/:id/schedules/:scheduleId', supabaseAuth, requireFeature('scheduling'), async (req, res) => {
    const { id, scheduleId } = req.params;
    const user = req.user;
    console.log(`🗑️ [DELETE] Attempting to delete schedule ${scheduleId} for QR ${id}`);

    try {
        // Verify QR ownership first
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) {
            console.error(`🗑️ [DELETE] QR Ownership check failed:`, qrError);
            return res.status(404).json({ error: 'QR not found' });
        }

        const { error, count, status } = await req.supabase
            .from('schedules')
            .delete({ count: 'exact' })
            .eq('id', Number(scheduleId))
            .eq('qr_id', Number(id));

        console.log(`🗑️ [DELETE] Supabase Response: Status=${status}, DeletedCount=${count}`);

        if (error) {
            console.error(`🗑️ [DELETE] Supabase Error:`, error);
            throw error;
        }

        if (count === 0) {
            console.warn(`🗑️ [DELETE] No schedule found with ID ${scheduleId} for QR ${id}`);
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.json({ message: 'Schedule deleted' });
    } catch (e) {
        logger.error('Error deleting schedule', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
