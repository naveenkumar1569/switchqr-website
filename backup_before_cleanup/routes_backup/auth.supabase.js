/**
 * Auth Routes - Supabase Version
 * 
 * Handles Registration and Login using Supabase Auth.
 * Adapts Supabase response format to match legacy API contract ({ token, user }).
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { getAdminClient } = require('../utils/supabase');
const logger = require('../utils/logger');

const router = express.Router();

let supabase;

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    } catch (e) {
        logger.error('Failed to init Supabase in auth route', e);
    }
} else {
    logger.warn('Supabase credentials missing in auth route. Auth endpoints will fail.');
}

// Register
router.post('/register', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Auth service misconfigured' });
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        console.log(`[Auth] Attempting register for ${email}`);

        // 1. Sign Up User
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name || '' // Metadata
                }
            }
        });

        if (error) {
            console.error('[Auth] Supabase SignUp Error:', error);
            // Translate Supabase Exists error if needed, but Supabase usually returns pretty clear messages
            return res.status(400).json({ error: error.message });
        }

        if (!data.session) {
            // If email confirmation is enabled, session might be null
            return res.status(200).json({
                message: 'Registration successful! Please check your email to confirm your account.'
            });
        }

        // 2. Apply 7-day Pro trial using Admin client
        try {
            const adminClient = getAdminClient();
            const trialExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

            const { error: profileError } = await adminClient
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    plan: 'pro',
                    plan_expires_at: trialExpiresAt.toISOString(),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

            if (profileError) {
                console.error('[TRIAL_APPLY_FAILED]', data.user.id, profileError.message);
                logger.error('[TRIAL_ERROR] Failed to apply trial', {
                    userId: data.user.id,
                    error: profileError.message
                });
                // Don't fail registration, just log the error
            } else {
                console.log('[TRIAL_APPLIED]', data.user.id, trialExpiresAt.toISOString());
            }
        } catch (trialError) {
            console.error('[TRIAL_APPLY_FAILED]', data.user.id, trialError.message);
            logger.error('[TRIAL_ERROR] Exception applying trial', {
                userId: data.user.id,
                error: trialError.message
            });
            // Don't fail registration
        }

        // Helper to split full_name
        const fullName = data.user.user_metadata?.full_name || name || '';
        const parts = fullName.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        // 3. Return Legacy Format
        res.status(201).json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                first_name: firstName,
                last_name: lastName
            }
        });

    } catch (e) {
        console.error('[Auth] Server Error:', e);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Auth service misconfigured' });
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('[Auth] Login Error:', error.message);
            return res.status(400).json({ error: error.message === 'Invalid login credentials' ? 'Invalid credentials' : error.message });
        }

        // Helper to split full_name
        const fullName = data.user.user_metadata?.full_name || '';
        const parts = fullName.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                first_name: firstName,
                last_name: lastName
            }
        });
    } catch (e) {
        console.error('[Auth] Server Login Error:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
