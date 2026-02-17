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
            return res.status(400).json({ error: error.message });
        }

        // 2. Apply 7-day Pro trial using Admin client
        // IMPORTANT: This MUST run before the email confirmation check below,
        // otherwise users needing email confirmation never get their trial.
        try {
            const adminClient = getAdminClient();
            const trialExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

            logger.info('[TRIAL_START] Applying 7-day Pro trial', {
                userId: data.user.id,
                email: email,
                expiresAt: trialExpiresAt.toISOString()
            });

            // Check if profile already exists
            const { data: existingProfile, error: fetchError } = await adminClient
                .from('profiles')
                .select('id, plan, plan_expires_at')
                .eq('id', data.user.id)
                .maybeSingle();

            if (fetchError) {
                logger.error('[TRIAL_FETCH_ERROR] Error checking for existing profile', {
                    userId: data.user.id,
                    error: fetchError.message
                });
            }

            if (!existingProfile) {
                // Profile doesn't exist - CREATE with trial
                logger.info('[TRIAL_CREATE] Creating new profile with Pro trial', {
                    userId: data.user.id
                });

                const { data: newProfile, error: createError } = await adminClient
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        plan: 'pro',
                        plan_expires_at: trialExpiresAt.toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (createError) {
                    logger.error('[TRIAL_CREATE_FAILED] Failed to create profile with trial', {
                        userId: data.user.id,
                        error: createError.message,
                        code: createError.code,
                        details: createError.details
                    });
                } else {
                    logger.info('[TRIAL_APPLIED] ✅ 7-day Pro trial successfully applied (new profile)', {
                        userId: data.user.id,
                        plan: newProfile.plan,
                        expiresAt: newProfile.plan_expires_at
                    });
                }
            } else {
                // Profile exists - UPDATE with trial
                logger.info('[TRIAL_UPDATE] Updating existing profile with Pro trial', {
                    userId: data.user.id,
                    currentPlan: existingProfile.plan
                });

                const { error: updateError } = await adminClient
                    .from('profiles')
                    .update({
                        plan: 'pro',
                        plan_expires_at: trialExpiresAt.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', data.user.id);

                if (updateError) {
                    logger.error('[TRIAL_UPDATE_FAILED] Failed to update profile with trial', {
                        userId: data.user.id,
                        error: updateError.message,
                        code: updateError.code
                    });
                } else {
                    logger.info('[TRIAL_APPLIED] ✅ 7-day Pro trial successfully applied (updated)', {
                        userId: data.user.id,
                        plan: 'pro',
                        expiresAt: trialExpiresAt.toISOString()
                    });
                }
            }
        } catch (trialError) {
            logger.error('[TRIAL_EXCEPTION] Exception during trial application', {
                userId: data.user.id,
                error: trialError.message,
                stack: trialError.stack
            });
            // Don't fail registration even if trial fails
        }

        // 3. Check if email confirmation is required
        if (!data.session) {
            // Email confirmation is enabled - session will be null
            return res.status(200).json({
                message: 'Registration successful! Please check your email to confirm your account.'
            });
        }

        // 4. Return session (email confirmation disabled / auto-confirmed)
        // Helper to split full_name
        const fullName = data.user.user_metadata?.full_name || name || '';
        const parts = fullName.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

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
