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
        }

        // Fallback name logic from Auth metadata (e.g. Google or Register form)
        let firstName = profile?.first_name || '';
        let lastName = profile?.last_name || '';

        if (!firstName && !lastName) {
            const fullName = user.user_metadata?.full_name || '';
            if (fullName) {
                const parts = fullName.trim().split(' ');
                firstName = parts[0] || '';
                lastName = parts.slice(1).join(' ') || '';
            }
        }

        const responseData = {
            id: user.id,
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            job_title: profile?.job_title || '',
            bio: profile?.bio || '',
            company: profile?.company || '',
            website: profile?.website || '',
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
        const allowed = ['first_name', 'last_name', 'job_title', 'bio', 'company', 'website'];
        const cleanUpdates = {};

        allowed.forEach(field => {
            if (updates[field] !== undefined) cleanUpdates[field] = updates[field];
        });

        logger.info('Profile update request', { userId: user.id, fields: Object.keys(cleanUpdates) });

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

        // Update auth metadata with full name if first/last name changed
        if (cleanUpdates.first_name || cleanUpdates.last_name) {
            const fullName = `${cleanUpdates.first_name || data.first_name || ''} ${cleanUpdates.last_name || data.last_name || ''}`.trim();
            if (fullName) {
                const { error: metaError } = await req.supabase.auth.updateUser({
                    data: { full_name: fullName }
                });
                if (metaError) logger.warn('Failed to update auth metadata', metaError);
            }
        }

        res.json(data);
    } catch (e) {
        logger.error('Profile update error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
