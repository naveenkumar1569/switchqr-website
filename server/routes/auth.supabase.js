/**
 * Auth Routes - Supabase Version
 * 
 * Handles Registration and Login using Supabase Auth.
 * Adapts Supabase response format to match legacy API contract ({ token, user }).
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const router = express.Router();

// Initialize Supabase Client (Anon Key is fine for Auth)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    logger.error('Supabase credentials missing in auth route');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Register
router.post('/register', async (req, res) => {
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

        // 2. Return Legacy Format
        res.status(201).json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || name
            }
        });

    } catch (e) {
        console.error('[Auth] Server Error:', e);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
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

        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name
            }
        });
    } catch (e) {
        console.error('[Auth] Server Login Error:', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
