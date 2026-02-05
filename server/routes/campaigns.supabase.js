/**
 * Campaigns Routes - Supabase Version
 * 
 * Handles campaign management using Supabase.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');

const router = express.Router();

const supabaseAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    req.supabase = getAuthenticatedClient(token);
    next();
};

// GET /api/campaigns - List user's campaigns
router.get('/', supabaseAuth, async (req, res) => {
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: campaigns, error } = await req.supabase
            .from('campaigns')
            .select('*')
            .eq('owner_id', user.id)
            .neq('status', 'deleted')
            .order('created_at', { ascending: false });

        if (error) {
            logger.error('Supabase Query Error', error);
            throw error;
        }

        // Fetch QR counts and aggregate scan stats for each campaign
        const campaignIds = (campaigns || []).map(c => c.id);
        const campaignStats = {}; // { id: { count: 0, total: 0, trend: [0,0,0,0,0,0,0] } }

        if (campaignIds.length > 0) {
            try {
                // 1. Get all QRs in these campaigns
                const { data: qrs, error: qrError } = await req.supabase
                    .from('qrs')
                    .select('id, campaign_id')
                    .in('campaign_id', campaignIds)
                    .neq('status', 'deleted');

                if (!qrError && qrs) {
                    // Initialize stats
                    qrs.forEach(q => {
                        if (!campaignStats[q.campaign_id]) {
                            campaignStats[q.campaign_id] = { count: 0, total: 0, trend: [0, 0, 0, 0, 0, 0, 0] };
                        }
                        campaignStats[q.campaign_id].count++;
                    });

                    // 2. Get all scans for these QRs
                    const qrIds = qrs.map(q => q.id);
                    if (qrIds.length > 0) {
                        const { data: scans, error: scanError } = await req.supabase
                            .from('scans')
                            .select('qr_id, scanned_at')
                            .in('qr_id', qrIds);

                        if (!scanError && scans) {
                            const now = new Date();
                            // Use UTC midnight for today to be consistent
                            const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

                            scans.forEach(scan => {
                                const qr = qrs.find(q => q.id === scan.qr_id);
                                if (!qr) return;

                                const stats = campaignStats[qr.campaign_id];
                                if (stats) {
                                    stats.total++;

                                    // Calculate trend bucket based on UTC days
                                    const sDate = new Date(scan.scanned_at);
                                    const scanDayUTC = Date.UTC(sDate.getUTCFullYear(), sDate.getUTCMonth(), sDate.getUTCDate());
                                    const diffDays = Math.floor((todayUTC - scanDayUTC) / (1000 * 60 * 60 * 24));

                                    if (diffDays >= 0 && diffDays < 7) {
                                        const index = 6 - diffDays;
                                        if (index >= 0 && index <= 6) {
                                            stats.trend[index]++;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            } catch (err) {
                console.warn('[Campaigns] Stats logic failed', err);
            }
        }

        const enrichedCampaigns = (campaigns || []).map(c => {
            const stats = campaignStats[c.id] || { count: 0, total: 0, trend: [0, 0, 0, 0, 0, 0, 0] };
            console.log(`[Trend Debug] Folder: ${c.name}, Trend: ${stats.trend.join(',')}`);
            return {
                ...c,
                qr_count: stats.count,
                total_scans: stats.total,
                recent_scans_7d: stats.trend
            };
        });

        res.json(enrichedCampaigns);
    } catch (e) {
        logger.error('Error fetching campaigns', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/campaigns/:id - Get detailed campaign info
router.get('/:id', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // 1. Fetch Campaign
        const { data: campaign, error: campaignError } = await req.supabase
            .from('campaigns')
            .select('*')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (campaignError || !campaign) return res.status(404).json({ error: 'Campaign not found' });

        // 2. Fetch associated QRs
        const { data: qrs, error: qrsError } = await req.supabase
            .from('qrs')
            .select('id, name, short_code, destination_url')
            .eq('campaign_id', id)
            .neq('status', 'deleted');

        const qrIds = (qrs || []).map(q => q.id);

        // 3. Fetch Scans for all QRs in this campaign for aggregation (with time filtering)
        let scans = [];
        if (qrIds.length > 0) {
            const days = parseInt(req.query.days) || 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            let query = req.supabase
                .from('scans')
                .select('qr_id, device_type, country, scanned_at')
                .in('qr_id', qrIds);

            // Apply date filter
            query = query.gte('scanned_at', startDate.toISOString());

            const { data: fetchedScans, error: scansError } = await query;

            if (!scansError) scans = fetchedScans || [];
        }

        // 4. Aggregation Logic
        const qrStats = (qrs || []).map(qr => {
            const qrScans = scans.filter(s => s.qr_id === qr.id);

            return {
                ...qr,
                scan_count: qrScans.length,
                unique_scans: qrScans.length, // Fallback as we don't have IP Tracking yet
                trend: [0, 0, 0, 0, 0, 0, qrScans.length] // Mock 7-day trend
            };
        });

        const totalScans = scans.length;
        const deviceStats = { Mobile: 0, Desktop: 0, Tablet: 0 };
        scans.forEach(s => {
            const type = (s.device_type || 'Desktop').toLowerCase();
            if (type.includes('iphone') || type.includes('android') || type.includes('mobile')) {
                deviceStats.Mobile++;
            } else if (type.includes('ipad') || type.includes('tablet')) {
                deviceStats.Tablet++;
            } else {
                deviceStats.Desktop++;
            }
        });

        // Convert device counts to percentages for the frontend
        const devicePercents = {
            Mobile: totalScans > 0 ? Math.round(((deviceStats.Mobile || 0) / totalScans) * 100) : 0,
            Desktop: totalScans > 0 ? Math.round(((deviceStats.Desktop || 0) / totalScans) * 100) : 0,
            Tablet: totalScans > 0 ? Math.round(((deviceStats.Tablet || 0) / totalScans) * 100) : 0
        };

        const geoStatsMap = scans.reduce((acc, s) => {
            if (s.country) {
                acc[s.country] = (acc[s.country] || 0) + 1;
            }
            return acc;
        }, {});

        const geoStats = Object.entries(geoStatsMap)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const responseData = {
            ...campaign,
            qrs: qrStats,
            qr_count: qrStats.length,
            total_scans: totalScans,
            unique_visitors: totalScans, // Fallback
            device_stats: devicePercents,
            geo_stats: geoStats
        };

        res.json(responseData);
    } catch (e) {
        logger.error('Error fetching campaign details', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/campaigns - Create a new campaign
router.post('/', supabaseAuth, async (req, res) => {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: 'Campaign name is required' });

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const { data: campaign, error } = await req.supabase
            .from('campaigns')
            .insert({
                name,
                description,
                owner_id: user.id,
                status: 'active'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(campaign);
    } catch (e) {
        logger.error('Error creating campaign', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/campaigns/:id - Rename campaign
router.put('/:id', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Campaign name is required' });

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        const { data, error } = await req.supabase
            .from('campaigns')
            .update({ name, updated_at: new Date() })
            .eq('id', id)
            .eq('owner_id', user.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (e) {
        logger.error('Error updating campaign', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/campaigns/:id - Soft delete campaign
router.delete('/:id', supabaseAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // 1. Unassign QRs (Set campaign_id to NULL)
        await req.supabase
            .from('qrs')
            .update({ campaign_id: null })
            .eq('campaign_id', id)
            .eq('owner_id', user.id);

        // 2. Soft Delete Campaign
        const { error } = await req.supabase
            .from('campaigns')
            .update({ status: 'deleted', updated_at: new Date() })
            .eq('id', id)
            .eq('owner_id', user.id);

        if (error) throw error;

        res.json({ message: 'Campaign deleted successfully' });
    } catch (e) {
        logger.error('Error deleting campaign', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
