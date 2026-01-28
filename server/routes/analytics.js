const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Get detailed stats for a specific QR
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // Verify ownership
    const qrStmt = db.prepare('SELECT id FROM qrs WHERE id = ? AND user_id = ?');
    const qr = qrStmt.get(id, req.user.id);

    if (!qr) {
        return res.status(404).json({ error: 'QR not found' });
    }

    try {
        // 1. Total Scans
        const totalScansStmt = db.prepare('SELECT COUNT(*) as count FROM scans WHERE qr_id = ?');
        const totalScans = totalScansStmt.get(id).count;

        // 2. Unique Scans
        const uniqueScansStmt = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM scans WHERE qr_id = ?');
        const uniqueScans = uniqueScansStmt.get(id).count;

        // 3. Scans Over Time
        const days = parseInt(req.query.days) || 7;
        const scansOverTimeStmt = db.prepare(`
            SELECT date(timestamp) as date, COUNT(*) as count
            FROM scans
            WHERE qr_id = ? AND timestamp >= date('now', '-' || ? || ' days')
            GROUP BY date(timestamp)
            ORDER BY date(timestamp) ASC
        `);
        const scansOverTime = scansOverTimeStmt.all(id, days);

        // 4. Device Split (Fetch user agents)
        const userAgentsStmt = db.prepare('SELECT user_agent FROM scans WHERE qr_id = ?');
        const userAgents = userAgentsStmt.all(id);

        const deviceStats = { Mobile: 0, Desktop: 0, Tablet: 0 };
        userAgents.forEach(scan => {
            const ua = (scan.user_agent || '').toLowerCase();
            if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
                deviceStats.Mobile++;
            } else if (ua.includes('tablet') || ua.includes('ipad')) {
                deviceStats.Tablet++;
            } else {
                deviceStats.Desktop++;
            }
        });

        // 5. Recent Scans
        const recentScansStmt = db.prepare('SELECT * FROM scans WHERE qr_id = ? ORDER BY timestamp DESC LIMIT 20');
        const recentScans = recentScansStmt.all(id);

        res.json({
            totalScans,
            uniqueScans,
            scansOverTime,
            deviceStats,
            recentScans
        });

    } catch (error) {
        logger.error('Analytics error', { endpoint: 'GET /:id', error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

// Get global stats for the user
router.get('/', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Scans
        const totalScansStmt = db.prepare(`
            SELECT COUNT(*) as count 
            FROM scans 
            JOIN qrs ON scans.qr_id = qrs.id 
            WHERE qrs.user_id = ?
        `);
        const totalScans = totalScansStmt.get(userId).count;

        // 2. Unique Scans
        const uniqueScansStmt = db.prepare(`
            SELECT COUNT(DISTINCT ip) as count
            FROM scans
            JOIN qrs ON scans.qr_id = qrs.id
            WHERE qrs.user_id = ?
        `);
        const uniqueScans = uniqueScansStmt.get(userId).count;

        // 3. Top Performing QR
        const topQrStmt = db.prepare(`
            SELECT qrs.name, COUNT(scans.id) as scan_count
            FROM scans
            JOIN qrs ON scans.qr_id = qrs.id
            WHERE qrs.user_id = ?
            GROUP BY qrs.id
            ORDER BY scan_count DESC
            LIMIT 1
        `);
        const topQr = topQrStmt.get(userId);

        // 4. Scans Over Time
        const days = parseInt(req.query.days) || 7;
        const scansOverTimeStmt = db.prepare(`
            SELECT date(scans.timestamp) as date, COUNT(*) as count
            FROM scans
            JOIN qrs ON scans.qr_id = qrs.id
            WHERE qrs.user_id = ? AND scans.timestamp >= date('now', '-' || ? || ' days')
            GROUP BY date(scans.timestamp)
            ORDER BY date(scans.timestamp) ASC
        `);
        const scansOverTime = scansOverTimeStmt.all(userId, days);

        // 5. Device Split (Fetch user agents to process in JS)
        const userAgentsStmt = db.prepare(`
            SELECT user_agent
            FROM scans
            JOIN qrs ON scans.qr_id = qrs.id
            WHERE qrs.user_id = ?
        `);
        const userAgents = userAgentsStmt.all(userId);

        const deviceSplit = { Mobile: 0, Desktop: 0, Tablet: 0 };
        userAgents.forEach(scan => {
            const ua = (scan.user_agent || '').toLowerCase();
            if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
                deviceSplit.Mobile++;
            } else if (ua.includes('ipad') || ua.includes('tablet')) {
                deviceSplit.Tablet++;
            } else {
                deviceSplit.Desktop++;
            }
        });

        // Calculate percentages
        const totalDevices = userAgents.length || 1;
        const deviceStats = {
            Mobile: Math.round((deviceSplit.Mobile / totalDevices) * 100),
            Desktop: Math.round((deviceSplit.Desktop / totalDevices) * 100),
            Tablet: Math.round((deviceSplit.Tablet / totalDevices) * 100),
        };

        // Recent Activity
        const recentScansStmt = db.prepare(`
            SELECT scans.*, qrs.name as qr_name 
            FROM scans 
            JOIN qrs ON scans.qr_id = qrs.id 
            WHERE qrs.user_id = ? 
            ORDER BY scans.timestamp DESC 
            LIMIT 10
        `);
        const recentScans = recentScansStmt.all(userId);

        res.json({
            totalScans,
            uniqueScans,
            topQr: topQr ? topQr.name : 'N/A',
            scansOverTime,
            deviceStats,
            recentScans
        });
    } catch (error) {
        logger.error('Error fetching global stats', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
