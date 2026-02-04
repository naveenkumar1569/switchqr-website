/**
 * Analytics Routes - Supabase Version
 * 
 * Handles stats and scan data.
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

// GET /api/stats (Overview)
router.get('/', supabaseAuth, async (req, res) => {
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // Parse date range parameters
        const { days, start, end } = req.query;
        let startDate, endDate;

        if (start && end) {
            // Custom date range
            startDate = new Date(start);
            endDate = new Date(end);
        } else if (days) {
            // Days-based range
            const numDays = parseInt(days) || 7;
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - (numDays - 1));
        } else {
            // Default to last 7 days
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 6);
        }

        // Normalize to start of day for startDate and end of day for endDate
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        // Get total scans for user's QRs
        const { data: qrs, error: qrError } = await req.supabase
            .from('qrs')
            .select('id, name')
            .eq('owner_id', user.id);

        if (qrError) throw qrError;

        const qrIds = qrs.map(q => q.id);
        const qrMap = qrs.reduce((acc, q) => ({ ...acc, [q.id]: q.name }), {});

        // Default Stats
        const stats = {
            totalScans: 0,
            uniqueScans: 0,
            topQr: 'N/A',
            recentScans: [],
            deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
            scansOverTime: []
        };

        if (qrIds.length > 0) {
            // Fetch scans within the date range
            const { data: scans, error: scanError } = await req.supabase
                .from('scans')
                .select('*')
                .in('qr_id', qrIds)
                .gte('scanned_at', startDate.toISOString())
                .lte('scanned_at', endDate.toISOString())
                .order('scanned_at', { ascending: false });

            if (scanError) throw scanError;

            if (scans && scans.length > 0) {
                stats.totalScans = scans.length;

                // Unique IPs
                const uniqueIps = new Set(scans.map(s => s.ip_address));
                stats.uniqueScans = uniqueIps.size;

                // Recent Scans (Top 5)
                stats.recentScans = scans.slice(0, 5).map(s => ({
                    id: s.id,
                    qr_name: qrMap[s.qr_id] || 'Unknown QR',
                    timestamp: s.scanned_at,
                    user_agent: s.browser || 'Unknown',
                    location: s.city ? `${s.city}, ${s.country}` : 'Unknown',
                    ip_address: s.ip_address
                }));

                // Top QR
                const qrCounts = {};
                scans.forEach(s => {
                    qrCounts[s.qr_id] = (qrCounts[s.qr_id] || 0) + 1;
                });
                const topQrId = Object.keys(qrCounts).reduce((a, b) => qrCounts[a] > qrCounts[b] ? a : b);
                stats.topQr = qrMap[topQrId] || 'N/A';

                // Device Stats
                const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
                scans.forEach(s => {
                    // Simple heuristic mapping
                    const type = s.device_type || 'Desktop';
                    if (type.includes('Mobile') || type.includes('Phone')) deviceCounts.Mobile++;
                    else if (type.includes('Tablet') || type.includes('iPad')) deviceCounts.Tablet++;
                    else deviceCounts.Desktop++;
                });
                // Calculate percentages
                const total = scans.length;
                stats.deviceStats = {
                    Mobile: Math.round((deviceCounts.Mobile / total) * 100),
                    Tablet: Math.round((deviceCounts.Tablet / total) * 100),
                    Desktop: Math.round((deviceCounts.Desktop / total) * 100)
                };

                // Scans Over Time - Intelligent aggregation based on date range
                const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                if (daysDiff <= 31) {
                    // Daily aggregation for up to 31 days
                    const timeline = {};
                    for (let i = 0; i < daysDiff; i++) {
                        const d = new Date(startDate);
                        d.setDate(d.getDate() + i);
                        const key = d.toISOString().split('T')[0];
                        timeline[key] = 0;
                    }

                    scans.forEach(s => {
                        const key = s.scanned_at.split('T')[0];
                        if (timeline[key] !== undefined) timeline[key]++;
                    });

                    stats.scansOverTime = Object.keys(timeline).sort().map(date => ({
                        date,
                        count: timeline[date]
                    }));

                } else if (daysDiff <= 90) {
                    // Weekly aggregation for 32-90 days
                    const weeks = {};

                    // Get week key (year-week format)
                    const getWeekKey = (date) => {
                        const d = new Date(date);
                        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
                        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
                        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                        return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                    };

                    // Initialize weeks in range
                    for (let i = 0; i < daysDiff; i++) {
                        const d = new Date(startDate);
                        d.setDate(d.getDate() + i);
                        const weekKey = getWeekKey(d);
                        if (!weeks[weekKey]) {
                            weeks[weekKey] = { count: 0, startDate: d };
                        }
                    }

                    // Count scans per week
                    scans.forEach(s => {
                        const weekKey = getWeekKey(s.scanned_at);
                        if (weeks[weekKey] !== undefined) weeks[weekKey].count++;
                    });

                    stats.scansOverTime = Object.keys(weeks).sort().map(weekKey => ({
                        date: weekKey,
                        count: weeks[weekKey].count
                    }));

                } else {
                    // Monthly aggregation for > 90 days
                    const months = {};

                    // Initialize months in range
                    let currentDate = new Date(startDate);
                    while (currentDate <= endDate) {
                        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                        months[monthKey] = 0;
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }

                    // Count scans per month
                    scans.forEach(s => {
                        const scanDate = new Date(s.scanned_at);
                        const monthKey = `${scanDate.getFullYear()}-${String(scanDate.getMonth() + 1).padStart(2, '0')}`;
                        if (months[monthKey] !== undefined) months[monthKey]++;
                    });

                    stats.scansOverTime = Object.keys(months).sort().map(monthKey => ({
                        date: monthKey,
                        count: months[monthKey]
                    }));
                }
            } else {
                // No scans in range, still create timeline with zeros using same aggregation logic
                const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                if (daysDiff <= 31) {
                    // Daily
                    const timeline = {};
                    for (let i = 0; i < daysDiff; i++) {
                        const d = new Date(startDate);
                        d.setDate(d.getDate() + i);
                        const key = d.toISOString().split('T')[0];
                        timeline[key] = 0;
                    }
                    stats.scansOverTime = Object.keys(timeline).sort().map(date => ({ date, count: 0 }));

                } else if (daysDiff <= 90) {
                    // Weekly
                    const weeks = {};
                    const getWeekKey = (date) => {
                        const d = new Date(date);
                        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
                        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
                        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                        return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                    };
                    for (let i = 0; i < daysDiff; i++) {
                        const d = new Date(startDate);
                        d.setDate(d.getDate() + i);
                        const weekKey = getWeekKey(d);
                        if (!weeks[weekKey]) weeks[weekKey] = 0;
                    }
                    stats.scansOverTime = Object.keys(weeks).sort().map(weekKey => ({ date: weekKey, count: 0 }));

                } else {
                    // Monthly
                    const months = {};
                    let currentDate = new Date(startDate);
                    while (currentDate <= endDate) {
                        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                        months[monthKey] = 0;
                        currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                    stats.scansOverTime = Object.keys(months).sort().map(monthKey => ({ date: monthKey, count: 0 }));
                }
            }
        }

        res.json(stats);

    } catch (e) {
        logger.error('Stats error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/stats/:qr_id (Single QR Stats - for QR Details page)
router.get('/:qr_id', supabaseAuth, async (req, res) => {
    const { qr_id } = req.params;
    const { days } = req.query; // Handle date filtering if needed

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id, name')
            .eq('id', qr_id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        // Default Stats
        const stats = {
            totalScans: 0,
            uniqueScans: 0,
            topQr: qr.name,
            recentScans: [],
            deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
            scansOverTime: []
        };

        const { data: scans, error: scanError } = await req.supabase
            .from('scans')
            .select('*')
            .eq('qr_id', qr_id)
            .order('scanned_at', { ascending: false });

        if (scanError) throw scanError;

        if (scans && scans.length > 0) {
            stats.totalScans = scans.length;
            const uniqueIps = new Set(scans.map(s => s.ip_address));
            stats.uniqueScans = uniqueIps.size;

            stats.recentScans = scans.slice(0, 5).map(s => ({
                id: s.id,
                qr_name: qr.name,
                timestamp: s.scanned_at,
                user_agent: s.browser || 'Unknown',
                location: s.city ? `${s.city}, ${s.country}` : 'Unknown',
                ip_address: s.ip_address
            }));

            // Device Stats
            const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
            scans.forEach(s => {
                const type = s.device_type || 'Desktop';
                if (type.includes('Mobile') || type.includes('Phone')) deviceCounts.Mobile++;
                else if (type.includes('Tablet') || type.includes('iPad')) deviceCounts.Tablet++;
                else deviceCounts.Desktop++;
            });
            const total = scans.length;
            stats.deviceStats = {
                Mobile: Math.round((deviceCounts.Mobile / total) * 100),
                Tablet: Math.round((deviceCounts.Tablet / total) * 100),
                Desktop: Math.round((deviceCounts.Desktop / total) * 100)
            };

            // Scans Over Time (Last 7 days or custom)
            const numDays = parseInt(days) || 7;
            const timeline = {};
            for (let i = numDays - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split('T')[0];
                timeline[key] = 0;
            }

            scans.forEach(s => {
                const key = s.scanned_at.split('T')[0];
                if (timeline[key] !== undefined) timeline[key]++;
            });

            stats.scansOverTime = Object.keys(timeline).sort().map(date => ({
                date,
                count: timeline[date]
            }));
        }

        res.json(stats);
    } catch (e) {
        logger.error('Stats error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/analytics/:qr_id (Full Analytics Data - for Analytics page)
router.get('/analytics/:qr_id', supabaseAuth, async (req, res) => {
    const { qr_id } = req.params;
    const { days } = req.query;

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // Verify ownership and get QR details
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id, name, destination_url')
            .eq('id', qr_id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        // Fetch all scans
        const { data: scans, error: scanError } = await req.supabase
            .from('scans')
            .select('*')
            .eq('qr_id', qr_id)
            .order('scanned_at', { ascending: false });

        if (scanError) throw scanError;

        // Initialize stats
        const stats = {
            totalScans: 0,
            uniqueScans: 0,
            deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
            scansOverTime: []
        };

        if (scans && scans.length > 0) {
            stats.totalScans = scans.length;
            const uniqueIps = new Set(scans.map(s => s.ip_address));
            stats.uniqueScans = uniqueIps.size;

            // Device Stats
            const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
            scans.forEach(s => {
                const type = s.device_type || 'Desktop';
                if (type.includes('Mobile') || type.includes('Phone')) deviceCounts.Mobile++;
                else if (type.includes('Tablet') || type.includes('iPad')) deviceCounts.Tablet++;
                else deviceCounts.Desktop++;
            });
            const total = scans.length;
            stats.deviceStats = {
                Mobile: Math.round((deviceCounts.Mobile / total) * 100),
                Tablet: Math.round((deviceCounts.Tablet / total) * 100),
                Desktop: Math.round((deviceCounts.Desktop / total) * 100)
            };

            // Scans Over Time (Last 7 days or custom)
            const numDays = parseInt(days) || 7;
            const timeline = {};
            for (let i = numDays - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split('T')[0];
                timeline[key] = 0;
            }

            scans.forEach(s => {
                const key = s.scanned_at.split('T')[0];
                if (timeline[key] !== undefined) timeline[key]++;
            });

            stats.scansOverTime = Object.keys(timeline).sort().map(date => ({
                date,
                count: timeline[date]
            }));
        }

        // Return new structure with qr, scans, and stats
        res.json({
            qr: {
                id: qr.id,
                name: qr.name,
                destination_url: qr.destination_url
            },
            scans: scans || [],
            stats
        });
    } catch (e) {
        logger.error('Analytics error', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
