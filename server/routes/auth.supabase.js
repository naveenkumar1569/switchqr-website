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
        const adminClient = getAdminClient();

        // 1. Create user via Admin API with auto-confirmation
        //    This bypasses email confirmation entirely so users can sign in immediately.
        const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,  // Auto-confirm the email
            user_metadata: {
                full_name: name || ''
            }
        });

        if (createError) {
            logger.error('[Auth] Admin createUser failed', { email, error: createError.message });

            // Handle "user already exists" gracefully
            if (createError.message?.toLowerCase().includes('already') ||
                createError.message?.toLowerCase().includes('exists') ||
                createError.message?.toLowerCase().includes('duplicate')) {
                return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
            }

            return res.status(400).json({ error: createError.message });
        }

        const userId = createData.user.id;
        logger.info('[Auth] User created successfully', { userId, email });

        // 2. Apply 7-day Pro trial
        try {
            const trialExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            logger.info('[TRIAL_START] Applying 7-day Pro trial', {
                userId,
                email,
                expiresAt: trialExpiresAt.toISOString()
            });

            const { data: existingProfile } = await adminClient
                .from('profiles')
                .select('id, plan')
                .eq('id', userId)
                .maybeSingle();

            if (!existingProfile) {
                const { data: newProfile, error: profileError } = await adminClient
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: email,
                        full_name: name || '',
                        plan: 'pro',
                        plan_expires_at: trialExpiresAt.toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (profileError) {
                    logger.error('[TRIAL_CREATE_FAILED]', { userId, error: profileError.message, code: profileError.code });
                } else {
                    logger.info('[TRIAL_APPLIED] ✅ Pro trial applied (new profile)', { userId, plan: newProfile.plan });
                }
            } else {
                const { error: updateError } = await adminClient
                    .from('profiles')
                    .update({
                        plan: 'pro',
                        plan_expires_at: trialExpiresAt.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (updateError) {
                    logger.error('[TRIAL_UPDATE_FAILED]', { userId, error: updateError.message });
                } else {
                    logger.info('[TRIAL_APPLIED] ✅ Pro trial applied (updated)', { userId });
                }
            }
        } catch (trialError) {
            logger.error('[TRIAL_EXCEPTION]', { userId, error: trialError.message });
            // Don't fail registration if trial fails
        }

        // 3. Sign in the user to get a session token
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            logger.error('[Auth] Post-registration sign-in failed', { userId, error: signInError.message });
            // User was created but we couldn't sign them in automatically
            // They can still use the login page
            return res.status(201).json({
                message: 'Account created successfully! Please sign in with your credentials.'
            });
        }

        // 4. Return session
        const fullName = createData.user.user_metadata?.full_name || name || '';
        const parts = fullName.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        logger.info('[Auth] Registration complete', { userId, email });

        res.status(201).json({
            token: signInData.session.access_token,
            user: {
                id: userId,
                email: createData.user.email,
                first_name: firstName,
                last_name: lastName
            }
        });

    } catch (e) {
        logger.error('[Auth] Server error during registration', { error: e.message, stack: e.stack });
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
