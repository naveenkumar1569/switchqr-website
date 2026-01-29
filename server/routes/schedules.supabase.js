/**
 * Schedules Routes - Supabase Version
 * 
 * Handles time-based redirects for QRs.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');

const router = express.Router();

const supabaseAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    req.supabase = getAuthenticatedClient(token);
    next();
};

// GET /api/qrs/:id/schedules
router.get('/:id/schedules', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

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

        const mappedSchedules = (schedules || []).map(s => ({
            ...s,
            is_active: s.active,
            label: s.destination_url, // Use URL as fallback label
            recurrence_type: (s.days && s.days.length > 0) ? 'weekly' : 'once',
            recurrence_days: s.days ? JSON.stringify(s.days.map(d => {
                const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                return map[d];
            })) : '[]'
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
router.post('/:id/schedules', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time, destination_url, days, timezone } = req.body;

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

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

// DELETE /api/qrs/:id/schedules/:scheduleId
router.delete('/:id/schedules/:scheduleId', supabaseAuth, async (req, res) => {
    const { id, scheduleId } = req.params;
    console.log(`🗑️ [DELETE] Attempting to delete schedule ${scheduleId} for QR ${id}`);

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

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
