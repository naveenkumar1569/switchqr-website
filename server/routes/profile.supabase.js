/**
 * Profile Routes - Supabase Version
 * 
 * Handles user profile operations including timezone capture.
 */

const express = require('express');
const supabaseAuth = require('../middleware/supabaseAuth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * POST /api/profile/timezone
 * Capture and store user's browser timezone
 * Updates both profile and workspace timezone (if workspace is still at default UTC)
 */
router.post('/timezone', supabaseAuth, async (req, res) => {
    try {
        const user = req.user;

        const { timezone } = req.body;

        if (!timezone) {
            return res.status(400).json({ error: 'Timezone is required' });
        }

        // Validate timezone format (basic check)
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
        } catch (e) {
            return res.status(400).json({ error: 'Invalid timezone format' });
        }

        // Update profile timezone
        const { error: profileError } = await req.supabase
            .from('profiles')
            .update({ timezone })
            .eq('id', user.id);

        if (profileError) {
            logger.error('[TIMEZONE_CAPTURE_ERROR]', { userId: user.id, error: profileError });
            throw profileError;
        }

        // Get user's workspace_id
        const { data: profile } = await req.supabase
            .from('profiles')
            .select('workspace_id')
            .eq('id', user.id)
            .single();

        // Update workspace timezone ONLY if it's currently UTC or NULL
        if (profile?.workspace_id) {
            const { error: workspaceError } = await req.supabase
                .from('workspaces')
                .update({ timezone })
                .eq('id', profile.workspace_id)
                .in('timezone', ['UTC', null]);

            if (workspaceError) {
                logger.warn('[TIMEZONE_WORKSPACE_UPDATE_FAILED]', {
                    workspaceId: profile.workspace_id,
                    error: workspaceError
                });
                // Don't fail the request if workspace update fails
            }
        }

        logger.info('[TIMEZONE_CAPTURED]', { userId: user.id, timezone });

        res.json({ success: true, timezone });

    } catch (error) {
        logger.error('[TIMEZONE_CAPTURE_ERROR]', error);
        res.status(500).json({ error: 'Failed to update timezone' });
    }
});

module.exports = router;
