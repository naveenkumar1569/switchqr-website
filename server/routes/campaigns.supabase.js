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

const normalizeTimezone = (tz) => {
    if (!tz) return null;
    // Common typo from client (Asia/Kolcata -> Asia/Kolkata)
    if (tz.includes('Kolcata')) return 'Asia/Kolkata';
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return tz;
    } catch (e) {
        logger.warn(`Invalid timezone provided: ${tz}, falling back to system time`);
        return null;
    }
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
            const { days: daysQuery, tz } = req.query;
            const days = parseInt(daysQuery) || 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            let query = req.supabase
                .from('scans')
                .select('qr_id, device_type, os, country, scanned_at, ip_address')
                .in('qr_id', qrIds);

            // Apply date filter
            query = query.gte('scanned_at', startDate.toISOString());

            const { data: fetchedScans, error: scansError } = await query;

            if (!scansError) scans = fetchedScans || [];
        }

        // 4. Aggregation Logic & Device Stats
        const hourCounts = {};
        const dayCounts = {};
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Normalize timezone early
        const normalizedTz = normalizeTimezone(req.query.tz);

        // CREATE INTEL OBJECTS ONCE (Optimization)
        let hourFormatter = null;
        if (normalizedTz) {
            try {
                hourFormatter = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    hour12: false,
                    timeZone: normalizedTz
                });
            } catch (e) {
                logger.error('Failed to create hourFormatter', e);
            }
        }

        const formatHour = (h) => {
            if (h === null || h === undefined) return 'N/A';
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h12 = hour % 12 || 12;
            return `${h12} ${ampm}`;
        };

        const qrStats = (qrs || []).map(qr => {
            const qrScans = scans.filter(s => s.qr_id === qr.id);
            const uniqueIps = new Set(qrScans.map(s => s.ip_address));

            // Per QR Peak hour
            const qrHourCounts = {};
            qrScans.forEach(s => {
                const scanDate = new Date(s.scanned_at);
                let hour;

                if (hourFormatter) {
                    try {
                        const parts = hourFormatter.formatToParts(scanDate);
                        hour = parseInt(parts.find(p => p.type === 'hour').value) % 24;
                    } catch (e) {
                        hour = scanDate.getHours();
                    }
                } else {
                    hour = scanDate.getHours();
                }
                qrHourCounts[hour] = (qrHourCounts[hour] || 0) + 1;
            });
            const peakHour = Object.keys(qrHourCounts).length > 0
                ? Object.keys(qrHourCounts).reduce((a, b) => qrHourCounts[a] > qrHourCounts[b] ? a : b)
                : null;

            return {
                ...qr,
                scan_count: qrScans.length,
                unique_scans: uniqueIps.size,
                peak_hour: formatHour(peakHour),
                trend: [0, 0, 0, 0, 0, 0, qrScans.length] // Mock 7-day trend
            };
        });

        const totalScans = scans.length;
        const totalUniques = new Set(scans.map(s => s.ip_address)).size;

        const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0, iOS: 0, Android: 0 };
        const osCounts = {};

        scans.forEach(s => {
            const type = s.device_type || 'Desktop';
            const os = (s.os || '').toLowerCase();

            if (type.includes('Mobile') || type.includes('Phone')) {
                deviceCounts.Mobile++;
                if (os.includes('ios')) deviceCounts.iOS++;
                else if (os.includes('android')) deviceCounts.Android++;
            }
            else if (type.includes('Tablet') || type.includes('iPad')) deviceCounts.Tablet++;
            else deviceCounts.Desktop++;

            if (s.os && s.os !== 'null' && s.os !== 'Other 0.0.0') {
                osCounts[s.os] = (osCounts[s.os] || 0) + 1;
            }

            // Peak Activity
            const scanDate = new Date(s.scanned_at);
            let hour, day;

            if (normalizedTz) {
                try {
                    const dateStr = scanDate.toLocaleString('en-US', { timeZone: normalizedTz });
                    const tzDate = new Date(dateStr);
                    hour = tzDate.getHours();
                    day = tzDate.getDay();
                } catch (e) {
                    hour = scanDate.getHours();
                    day = scanDate.getDay();
                }
            } else {
                hour = scanDate.getHours();
                day = scanDate.getDay();
            }

            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        const deviceStats = {
            Mobile: totalScans > 0 ? Math.round(((deviceCounts.Mobile || 0) / totalScans) * 100) : 0,
            Desktop: totalScans > 0 ? Math.round(((deviceCounts.Desktop || 0) / totalScans) * 100) : 0,
            Tablet: totalScans > 0 ? Math.round(((deviceCounts.Tablet || 0) / totalScans) * 100) : 0,
            iOS: totalScans > 0 ? Math.round(((deviceCounts.iOS || 0) / totalScans) * 100) : 0,
            Android: totalScans > 0 ? Math.round(((deviceCounts.Android || 0) / totalScans) * 100) : 0
        };

        const dominantOS = Object.keys(osCounts).length > 0
            ? Object.keys(osCounts).reduce((a, b) => osCounts[a] > osCounts[b] ? a : b)
            : 'N/A';

        const peakHourVal = Object.keys(hourCounts).length > 0
            ? Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b)
            : null;
        const peakDayVal = Object.keys(dayCounts).length > 0
            ? Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b)
            : null;

        const peakActivity = {
            hour: formatHour(peakHourVal),
            day: peakDayVal !== null ? daysOfWeek[peakDayVal] : 'N/A'
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
            unique_visitors: totalUniques,
            device_stats: deviceStats,
            dominantOS: dominantOS,
            peak_activity: peakActivity,
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
