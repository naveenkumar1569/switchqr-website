/**
 * Shared Supabase Authentication Middleware
 */

const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');

const supabaseAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    try {
        // Create client scoped to this user
        const supabase = getAuthenticatedClient(token);

        // Fetch user once and cache on request object
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            logger.warn('[SUPABASE_AUTH] Token verification failed', { error: authError });
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        // Attach to request for downstream middlewares (like planEnforcement) and handlers
        req.supabase = supabase;
        req.user = user;

        next();
    } catch (error) {
        logger.error('[SUPABASE_AUTH] Unexpected error', { error: error.message });
        res.status(500).json({ error: 'Authentication internal error' });
    }
};

module.exports = supabaseAuth;
