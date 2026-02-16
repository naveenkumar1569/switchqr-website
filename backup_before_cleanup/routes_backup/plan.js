const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get user's plan and feature access
router.get('/', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's plan
        const userStmt = db.prepare('SELECT plan, plan_expires_at FROM users WHERE id = ?');
        const user = userStmt.get(userId);
        const plan = user?.plan || 'free';

        // Define plan limits
        const planLimits = {
            free: 5,
            starter: 100,
            pro: 1000
        };

        // Define plan features
        const planFeatures = {
            free: {
                advanced_analytics: false,
                campaigns: false,
                branding: false,
                ab_testing: false,
                scheduling: false,
                csv_export: false,
                svg_pdf_downloads: false
            },
            starter: {
                advanced_analytics: true,
                campaigns: false,
                branding: false,
                ab_testing: false,
                scheduling: true,
                csv_export: false,
                svg_pdf_downloads: true
            },
            pro: {
                advanced_analytics: true,
                campaigns: true,
                branding: true,
                ab_testing: true,
                scheduling: true,
                csv_export: true,
                svg_pdf_downloads: true
            }
        };

        // Get QR count
        const qrCountStmt = db.prepare('SELECT COUNT(*) as count FROM qrs WHERE user_id = ? AND status = ?');
        const qrCount = qrCountStmt.get(userId, 'active');

        res.json({
            plan,
            plan_expires_at: user?.plan_expires_at,
            qr_limit: planLimits[plan] || 5,
            qr_count: qrCount.count,
            features: planFeatures[plan] || planFeatures.free
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Enforce plan limits - deactivate QRs beyond plan limit
router.post('/enforce-limits', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's plan (default to free for now)
        const userStmt = db.prepare('SELECT plan FROM users WHERE id = ?');
        const user = userStmt.get(userId);
        const plan = user?.plan || 'free';

        // Define plan limits
        const planLimits = {
            free: 5,
            starter: 100,
            pro: 1000
        };

        const limit = planLimits[plan] || 5;

        // Get all QRs for this user, ordered by creation date (newest first)
        const qrsStmt = db.prepare('SELECT id, status FROM qrs WHERE user_id = ? ORDER BY created_at DESC');
        const qrs = qrsStmt.all(userId);

        let deactivatedCount = 0;

        // If user has more QRs than their limit, deactivate the extras (oldest ones)
        // Since we ordered DESC (newest first), slice(limit) gives us the oldest QRs to pause
        if (qrs.length > limit) {
            const qrsToDeactivate = qrs.slice(limit); // Get QRs beyond the limit

            const updateStmt = db.prepare('UPDATE qrs SET status = ? WHERE id = ?');

            qrsToDeactivate.forEach(qr => {
                if (qr.status !== 'paused') {
                    updateStmt.run('paused', qr.id);
                    deactivatedCount++;
                }
            });
        }

        res.json({
            success: true,
            plan,
            limit,
            totalQRs: qrs.length,
            deactivatedCount,
            message: deactivatedCount > 0
                ? `${deactivatedCount} QR(s) have been deactivated due to plan limits.`
                : 'All QRs are within plan limits.'
        });
    } catch (error) {
        console.error('Error enforcing plan limits:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user plan (Admin/Dev only - LOCKED DOWN IN PRODUCTION)
router.put('/', authenticateToken, (req, res) => {
    try {
        // SECURITY: Only allow plan override in development OR for admin users
        const isDevMode = process.env.NODE_ENV !== 'production';
        const isAdmin = req.user?.is_admin === true;

        if (!isDevMode && !isAdmin) {
            return res.status(403).json({
                error: 'Plan changes via API are disabled in production. Please use the billing system.'
            });
        }

        const userId = req.user.id;
        const { plan } = req.body;

        if (!['free', 'starter', 'pro'].includes(plan)) {
            return res.status(400).json({ error: 'Invalid plan. Must be free, starter, or pro.' });
        }

        // Update user plan
        const updateStmt = db.prepare('UPDATE users SET plan = ? WHERE id = ?');
        updateStmt.run(plan, userId);

        res.json({
            success: true,
            plan,
            message: `Plan updated to ${plan}${isDevMode ? ' (DEV MODE)' : ''}`
        });
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
