/**
 * QR Routes - Supabase Version
 * 
 * Handles reading/writing QRs via Supabase Client (RLS Enforced).
 * DOES NOT use critical paths from legacy 'qrs.js'.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Middleware: Attach authenticated Supabase client to request
 */
const supabaseAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    // Create client scoped to this user
    req.supabase = getAuthenticatedClient(token);
    next();
};

// ============================================
// CRUD Routes
// ============================================

// LIST all QRs for the user
router.get('/', supabaseAuth, async (req, res) => {
    try {
        console.log('🔎 [DEBUG] GET /api/qrs Hit');
        const { data: { user }, error: userError } = await req.supabase.auth.getUser();

        if (userError || !user) {
            console.log('❌ [DEBUG] User auth failed:', userError);
            return res.status(401).json({ error: 'Invalid authentication', details: userError });
        }

        console.log(`✅ [DEBUG] User ID: ${user.id}`);

        const { data: qrs, error } = await req.supabase
            .from('qrs')
            .select('*')
            .eq('owner_id', user.id) // Ensure RLS matches this
            .neq('status', 'deleted')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ [DEBUG] Supabase Select Error:', error);
            throw error;
        }

        console.log(`✅ [DEBUG] Found ${qrs?.length} QRs`);
        res.json(qrs);
    } catch (error) {
        console.error('❌ [DEBUG] Server Error in GET /api/qrs:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// GET single QR
router.get('/:id', supabaseAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { data: qr, error } = await req.supabase
            .from('qrs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return res.status(404).json({ error: 'QR not found' });
        res.json(qr);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Helper to get user plan info
async function getUserPlan(user_id, client) {
    // 1. Get Profile
    const { data: profile } = await client
        .from('profiles')
        .select('plan')
        .eq('id', user_id)
        .maybeSingle();

    const plan = profile?.plan || 'free';

    // Limits Config (Matched with PLAN_CONFIG)
    const LIMITS = {
        free: 5,
        starter: 100,
        pro: 1000
    };

    const FEATURES = {
        free: { scheduling: false, ab_testing: false, campaigns: false },
        starter: { scheduling: true, ab_testing: false, campaigns: false },
        pro: { scheduling: true, ab_testing: true, campaigns: true }
    };

    return {
        type: plan,
        limit: LIMITS[plan],
        features: FEATURES[plan]
    };
}

// CREATE QR
router.post('/', supabaseAuth, async (req, res) => {
    try {
        // Validation (basic)
        const { name, destination_url, routing_mode = 'basic', scheduling_enabled, ab_testing_enabled, campaign_id } = req.body;

        if (!destination_url) {
            return res.status(400).json({ error: 'Destination URL is required' });
        }

        // Get User explicitly
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // PLAN ENFORCEMENT
        const plan = await getUserPlan(user.id, req.supabase);

        // 1. Check Feature Access
        if (scheduling_enabled && !plan.features.scheduling) {
            return res.status(403).json({ error: 'Scheduling not available on your plan', upgrade_required: true });
        }
        if (ab_testing_enabled && !plan.features.ab_testing) {
            return res.status(403).json({ error: 'A/B Testing not available on your plan', upgrade_required: true });
        }

        // 2. Check QR Limit
        const { count, error: countError } = await req.supabase
            .from('qrs')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id)
            .neq('status', 'deleted');

        if (countError) throw countError;

        if (count >= plan.limit) {
            return res.status(403).json({
                error: `QR Limit Reached (${count}/${plan.limit}). Please upgrade.`,
                upgrade_required: true
            });
        }

        // Generate Short Code
        const short_code = Math.random().toString(36).substring(2, 8);

        const newQR = {
            name: name || 'Untitled QR',
            destination_url,
            short_code,
            routing_mode,
            scheduling_enabled: !!scheduling_enabled,
            ab_testing_enabled: !!ab_testing_enabled,
            campaign_id: campaign_id || null,
            status: 'active',
            owner_id: user.id,
            created_at: new Date().toISOString()
        };

        const { data, error } = await req.supabase
            .from('qrs')
            .insert(newQR)
            .select()
            .single();

        if (error) {
            logger.error('Supabase Insert Error', error);
            return res.status(400).json({ error: error.message, details: error });
        }

        res.status(201).json(data);
    } catch (error) {
        logger.error('Server error creating QR', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// UPDATE QR
router.put('/:id', supabaseAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Get User
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // PLAN ENFORCEMENT
        const plan = await getUserPlan(user.id, req.supabase);

        if (updates.scheduling_enabled && !plan.features.scheduling) {
            return res.status(403).json({ error: 'Scheduling not available on your plan' });
        }
        if (updates.ab_testing_enabled && !plan.features.ab_testing) {
            return res.status(403).json({ error: 'A/B Testing not available on your plan' });
        }

        // Sanitize inputs
        // Fix: Empty string for campaign_id causes UUID error
        if (updates.campaign_id === '') {
            updates.campaign_id = null;
        }

        // Prevent updating immutable fields
        delete updates.id;
        delete updates.owner_id;
        delete updates.created_at;

        const { data, error } = await req.supabase
            .from('qrs')
            .update(updates)
            .eq('id', id)
            .eq('owner_id', user.id) // Ensure ownership
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE QR (Soft delete)
router.delete('/:id', supabaseAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await req.supabase
            .from('qrs')
            .update({ status: 'deleted' })
            .eq('id', id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
