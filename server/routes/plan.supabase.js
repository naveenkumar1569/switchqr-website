/**
 * Plan & Limits Routes - Supabase Version
 * 
 * Handles plan details, feature gating, and usage limits.
 * Uses authenticated Supabase client.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');

console.log('✅ [DEBUG] Loading routes/plan.supabase.js');

const router = express.Router();

// Plan Limits & Features Configuration
const PLAN_CONFIG = {
    limits: {
        free: 5,
        starter: 100,
        pro: 1000
    },
    features: {
        free: {
            advanced_analytics: false,
            campaigns: false,
            branding: false,
            ab_testing: false,
            scheduling: false,
            csv_export: false,
            svg_pdf_downloads: false
        },
        starter: {
            advanced_analytics: true,
            campaigns: false,
            branding: false,
            ab_testing: false,
            scheduling: true,
            csv_export: false,
            svg_pdf_downloads: true
        },
        pro: {
            advanced_analytics: true,
            campaigns: true,
            branding: true,
            ab_testing: true,
            scheduling: true,
            csv_export: true,
            svg_pdf_downloads: true
        }
    }
};

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

        const response = {
            ...planInfo,
            qr_count: count || 0
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
