/**
 * Supabase Client Configuration
 * Supports both creating clients for specific tokens (per-request)
 * and checking connection health.
 */

const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let hasWarned = false;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (!hasWarned) {
        logger.warn('Supabase credentials missing in environment variables');
        hasWarned = true;
    }
}

/**
 * Creates a Supabase client for a specific authenticated user
 * @param {string} accessToken - JWT from the client
 */
const getAuthenticatedClient = (accessToken) => {
    // We use the anon key but inject the user's access token
    // This allows RLS to work correctly for that user
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    return client;
};

/**
 * Creates a Service Role client (Admin)
 * WARNING: Bypasses RLS. Use with caution.
 */
const getAdminClient = () => {
    if (!SUPABASE_SERVICE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin actions');
    }
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });
};

/**
 * Health check for Supabase connection
 */
const healthCheck = async () => {
    try {
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await client.from('qrs').select('count').limit(1).maybeSingle();

        if (error) {
            // If table doesn't exist or RLS blocks, that's "connected" but maybe not fully functional.
            // But for connectivity check, error usually implies network or credential issue unless it's a 4xx.
            logger.error('Supabase health check error', { error });
            return { ok: false, error: error.message };
        }

        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message };
    }
};

logger.info('Supabase clients initialized', {
    service: 'switchqr-api',
    url: SUPABASE_URL,
    hasAnonKey: !!SUPABASE_ANON_KEY,
    hasServiceKey: !!SUPABASE_SERVICE_KEY
});

module.exports = {
    getAuthenticatedClient,
    getAdminClient,
    healthCheck
};
