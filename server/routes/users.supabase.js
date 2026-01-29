/**
 * User Routes - Supabase Version
 * 
 * Handles user profile management.
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

    if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

    req.supabase = getAuthenticatedClient(token);
    next();
};

// GET /api/users/profile
router.get('/profile', supabaseAuth, async (req, res) => {
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // Get Profile
        const { data: profile, error } = await req.supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (error) {
            logger.error('Error fetching profile', error);
            // If internal error, return 500. If just missing, return user object with default plan
        }

        const responseData = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || '',
            ...profile,
            // Fallback defaults if profile is missing
            plan: profile?.plan || 'free'
        };

        res.json(responseData);
    } catch (e) {
        logger.error('Profile error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/users/profile
router.put('/profile', supabaseAuth, async (req, res) => {
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const updates = req.body;
        // Whitelist allowed fields
        const allowed = ['name', 'company', 'website'];
        const cleanUpdates = {};

        allowed.forEach(field => {
            if (updates[field] !== undefined) cleanUpdates[field] = updates[field];
        });

        // Upsert profile
        const { data, error } = await req.supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...cleanUpdates,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // Also update auth metadata if name changed
        if (cleanUpdates.name) {
            const { error: metaError } = await req.supabase.auth.updateUser({
                data: { full_name: cleanUpdates.name }
            });
            if (metaError) logger.warn('Failed to update auth metadata', metaError);
        }

        res.json(data);
    } catch (e) {
        logger.error('Profile update error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
