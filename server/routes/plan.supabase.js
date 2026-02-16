/**
 * Plan & Limits Routes - Supabase Version
 * 
 * Handles plan details, feature gating, and usage limits.
 * Uses authenticated Supabase client.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');
const { PLAN_CONFIG } = require('../utils/planManager');

console.log('✅ [DEBUG] Loading routes/plan.supabase.js');

const router = express.Router();

/**
 * Middleware to create authenticated Supabase client
 */
const supabaseAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    req.supabase = getAuthenticatedClient(token);
    next();
};

const { resolveUserPlan } = require('../utils/planManager');

// ============================================
// GET PLAN DETAILS
// ============================================
router.get('/', supabaseAuth, async (req, res) => {
    try {
        // 1. Get User ID
        const { data: { user }, error: userError } = await req.supabase.auth.getUser();

        if (userError || !user) {
            return res.status(401).json({ error: 'Invalid authentication' });
        }

        // 2. Resolve Plan using Admin Client (Bypasses RLS)
        const planInfo = await resolveUserPlan(user.id);

        // 3. Get QR Count (This can stay with authenticated client as QRs should have RLS)
        const { count, error: countError } = await req.supabase
            .from('qrs')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id)
            .neq('status', 'deleted')
            .eq('status', 'active');

        if (countError) {
            logger.error('Error counting QRs', { error: countError.message });
        }

        // 4. Get usage stats (scans and link updates)
        const { data: usageStats, error: statsError } = await req.supabase
            .from('user_usage_stats')
            .select('total_scans, link_updates_count')
            .eq('user_id', user.id)
            .maybeSingle();

        if (statsError) {
            logger.error('Error fetching usage stats', { error: statsError.message });
        }

        const response = {
            ...planInfo,
            qr_count: count || 0,
            scan_count: usageStats?.total_scans || 0,
            link_update_count: usageStats?.link_updates_count || 0,
            scan_limit: PLAN_CONFIG.scanLimits[planInfo.effectivePlan],
            link_update_limit: PLAN_CONFIG.linkUpdateLimits[planInfo.effectivePlan]
        };

        console.log('[PLAN_RESOLVE_FINAL]', user.id, response);
        res.json(response);

    } catch (error) {
        logger.error('Error in plan route', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================
// UPDATE PLAN (PUT)
// ============================================
router.put('/', supabaseAuth, async (req, res) => {
    const { plan } = req.body;

    // Validate plan
    if (!['free', 'starter', 'pro'].includes(plan)) {
        return res.status(400).json({ error: 'Invalid plan type' });
    }

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Update Profile
        const { error: updateError } = await req.supabase
            .from('profiles')
            .update({ plan: plan, updated_at: new Date() })
            .eq('id', user.id);

        if (updateError) {
            logger.error('Error updating plan', { error: updateError.message });
            return res.status(500).json({ error: 'Failed to update plan' });
        }

        res.json({ message: 'Plan updated successfully', plan });

    } catch (e) {
        logger.error('Server error updating plan', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================
// ENFORCE LIMITS (POST)
// ============================================
router.post('/enforce-limits', supabaseAuth, async (req, res) => {
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // This is a simple stub to prevent 404s and handle basic limit checking if needed.
        // The real enforcement happens in the creation/update routes.
        res.json({ success: true, message: 'Limits enforced' });
    } catch (e) {
        logger.error('Error enforcing limits', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
