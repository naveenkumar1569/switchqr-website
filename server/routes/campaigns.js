const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get all campaigns for authenticated user with stats
router.get('/', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        // Check user's plan - only Pro users can access campaigns
        const userStmt = db.prepare('SELECT plan FROM users WHERE id = ?');
        const user = userStmt.get(userId);
        const plan = user?.plan || 'free';

        // Return empty array for non-Pro users
        if (plan !== 'pro') {
            return res.json([]);
        }

        // Get all campaigns for this user
        const campaignsStmt = db.prepare(`
            SELECT 
                c.id,
                c.name,
                c.created_at,
                COUNT(DISTINCT q.id) as qr_count,
                COALESCE(SUM(
                    (SELECT COUNT(*) FROM scans WHERE scans.qr_id = q.id)
                ), 0) as total_scans
            FROM campaigns c
            LEFT JOIN qrs q ON q.campaign_id = c.id AND q.user_id = ?
            WHERE c.user_id = ?
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);

        const campaigns = campaignsStmt.all(userId, userId);

        // Get 7-day scan activity for each campaign
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        campaigns.forEach(campaign => {
            // Get daily scans for last 7 days
            const activityStmt = db.prepare(`
                SELECT 
                    DATE(s.timestamp) as scan_date,
                    COUNT(*) as scan_count
                FROM scans s
                INNER JOIN qrs q ON s.qr_id = q.id
                WHERE q.campaign_id = ? 
                    AND q.user_id = ?
                    AND s.timestamp >= ?
                GROUP BY DATE(s.timestamp)
                ORDER BY scan_date ASC
            `);

            const activity = activityStmt.all(campaign.id, userId, sevenDaysAgo.toISOString());

            // Create array of 7 days with counts
            const sparklineData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayData = activity.find(a => a.scan_date === dateStr);
                sparklineData.push(dayData ? dayData.scan_count : 0);
            }

            campaign.recent_scans_7d = sparklineData;
        });

        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new campaign (Starter+ only)
router.post('/', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Campaign name is required' });
        }

        // Check user's plan
        const userStmt = db.prepare('SELECT plan FROM users WHERE id = ?');
        const user = userStmt.get(userId);
        const plan = user?.plan || 'free';

        if (plan !== 'pro') {
            return res.status(403).json({
                error: 'Campaigns are only available on the Pro plan',
                upgrade_required: true,
                required_plan: 'pro'
            });
        }

        // Create campaign
        const insertStmt = db.prepare('INSERT INTO campaigns (user_id, name) VALUES (?, ?)');
        const result = insertStmt.run(userId, name.trim());

        res.status(201).json({
            id: result.lastInsertRowid,
            name: name.trim(),
            created_at: new Date().toISOString(),
            qr_count: 0,
            total_scans: 0,
            recent_scans_7d: [0, 0, 0, 0, 0, 0, 0]
        });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single campaign with details
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const campaignId = req.params.id;

        // Get campaign
        const campaignStmt = db.prepare('SELECT * FROM campaigns WHERE id = ? AND user_id = ?');
        const campaign = campaignStmt.get(campaignId, userId);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Get QRs in this campaign
        const qrsStmt = db.prepare(`
            SELECT 
                q.id,
                q.name,
                q.destination_url,
                q.short_code,
                q.status,
                q.created_at,
                COUNT(s.id) as scan_count
            FROM qrs q
            LEFT JOIN scans s ON s.qr_id = q.id
            WHERE q.campaign_id = ? AND q.user_id = ?
            GROUP BY q.id
            ORDER BY q.created_at DESC
        `);

        const qrs = qrsStmt.all(campaignId, userId);

        // Get aggregated analytics for the campaign (Last 30 days)
        const days = 30;

        // 1. Total Scans & Uniques for Campaign
        const statsStmt = db.prepare(`
            SELECT 
                COUNT(s.id) as total_scans,
                COUNT(DISTINCT s.ip) as unique_visitors
            FROM scans s
            JOIN qrs q ON s.qr_id = q.id
            WHERE q.campaign_id = ?
        `);
        const stats = statsStmt.get(campaignId);

        // 2. Scans Over Time (30 days)
        const timelineStmt = db.prepare(`
            SELECT date(s.timestamp) as date, COUNT(*) as count
            FROM scans s
            JOIN qrs q ON s.qr_id = q.id
            WHERE q.campaign_id = ? 
                AND s.timestamp >= date('now', '-' || ? || ' days')
            GROUP BY date(s.timestamp)
            ORDER BY date(s.timestamp) ASC
        `);
        const scansOverTime = timelineStmt.all(campaignId, days);

        // 3. Device Split
        const deviceStmt = db.prepare(`
            SELECT s.user_agent
            FROM scans s
            JOIN qrs q ON s.qr_id = q.id
            WHERE q.campaign_id = ?
        `);
        const userAgents = deviceStmt.all(campaignId);

        const deviceSplit = { Mobile: 0, Desktop: 0, Tablet: 0 };
        userAgents.forEach(row => {
            const ua = (row.user_agent || '').toLowerCase();
            if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
                deviceSplit.Mobile++;
            } else if (ua.includes('tablet') || ua.includes('ipad')) {
                deviceSplit.Tablet++;
            } else {
                deviceSplit.Desktop++;
            }
        });
        const totalDevices = userAgents.length || 1;
        const deviceStats = {
            Mobile: Math.round((deviceSplit.Mobile / totalDevices) * 100),
            Desktop: Math.round((deviceSplit.Desktop / totalDevices) * 100),
            Tablet: Math.round((deviceSplit.Tablet / totalDevices) * 100)
        };

        // 4. Geo Distribution (Country)
        // Since we don't have country data implemented yet (it's null), we'll simulate or return empty
        // In a real app we'd use GeoIP. For now, we'll placeholder it if data is empty.
        const geoStmt = db.prepare(`
            SELECT country, COUNT(*) as count
            FROM scans s
            JOIN qrs q ON s.qr_id = q.id
            WHERE q.campaign_id = ? AND s.country IS NOT NULL
            GROUP BY country
            ORDER BY count DESC
            LIMIT 5
        `);
        const geoStats = geoStmt.all(campaignId);

        // 5. Enrich QRs with last 7 days sparkline for the table
        const sparklineStmt = db.prepare(`
            SELECT qr_id, date(timestamp) as date, COUNT(*) as count
            FROM scans
            WHERE qr_id = ? AND timestamp >= date('now', '-7 days')
            GROUP BY date(timestamp)
        `);

        const uniqueQrStmt = db.prepare('SELECT COUNT(DISTINCT ip) as count FROM scans WHERE qr_id = ?');

        const enrichedQrs = qrs.map(qr => {
            const sparkdata = sparklineStmt.all(qr.id);
            const trend = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const ds = d.toISOString().split('T')[0];
                const found = sparkdata.find(r => r.date === ds);
                trend.push(found ? found.count : 0);
            }

            const uniqueData = uniqueQrStmt.get(qr.id);

            return {
                ...qr,
                trend,
                unique_scans: uniqueData ? uniqueData.count : 0
            };
        });

        res.json({
            ...campaign,
            qr_count: qrs.length,
            total_scans: stats.total_scans,
            unique_visitors: stats.unique_visitors,
            avg_conversion: 0,
            scans_over_time: scansOverTime,
            device_stats: deviceStats,
            geo_stats: geoStats,
            qrs: enrichedQrs
        });
    } catch (error) {
        console.error('Error fetching campaign details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update campaign name
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const campaignId = req.params.id;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Campaign name is required' });
        }

        // Verify ownership
        const campaignStmt = db.prepare('SELECT * FROM campaigns WHERE id = ? AND user_id = ?');
        const campaign = campaignStmt.get(campaignId, userId);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Update campaign
        const updateStmt = db.prepare('UPDATE campaigns SET name = ? WHERE id = ?');
        updateStmt.run(name.trim(), campaignId);

        res.json({
            id: campaignId,
            name: name.trim(),
            updated: true
        });
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete campaign (QRs remain, campaign_id set to NULL)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const campaignId = req.params.id;

        // Verify ownership
        const campaignStmt = db.prepare('SELECT * FROM campaigns WHERE id = ? AND user_id = ?');
        const campaign = campaignStmt.get(campaignId, userId);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Set campaign_id to NULL for all QRs in this campaign
        const updateQRsStmt = db.prepare('UPDATE qrs SET campaign_id = NULL WHERE campaign_id = ?');
        updateQRsStmt.run(campaignId);

        // Delete campaign
        const deleteStmt = db.prepare('DELETE FROM campaigns WHERE id = ?');
        deleteStmt.run(campaignId);

        res.json({
            deleted: true,
            message: 'Campaign deleted. QR codes have been unassigned.'
        });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
