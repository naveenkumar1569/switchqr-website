/**
 * Analytics Routes - Supabase Version
 * 
 * Handles stats and scan data.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');
const { getContinent } = require('../utils/geoMapping');

const router = express.Router();

const supabaseAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    req.supabase = getAuthenticatedClient(token);
    next();
};

/**
 * Resolve timezone for analytics aggregation
 * Priority: campaign.timezone → workspace.timezone → 'UTC'
 * 
 * @param {Object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {string|null} campaignId - Optional campaign ID
 * @returns {Promise<string>} IANA timezone string
 */
async function resolveAnalyticsTimezone(supabase, userId, campaignId = null) {
    // Priority 1: campaign timezone override
    if (campaignId) {
        const { data: campaign } = await supabase
            .from('campaigns')
            .select('timezone, workspace_id')
            .eq('id', campaignId)
            .single();

        if (campaign?.timezone) {
            logger.info('[ANALYTICS_TZ_USED]', {
                source: 'campaign',
                tz: campaign.timezone,
                campaignId
            });
            return campaign.timezone;
        }

        if (campaign?.workspace_id) {
            const { data: workspace } = await supabase
                .from('workspaces')
                .select('timezone')
                .eq('id', campaign.workspace_id)
                .single();

            if (workspace?.timezone) {
                logger.info('[ANALYTICS_TZ_USED]', {
                    source: 'workspace',
                    tz: workspace.timezone,
                    workspaceId: campaign.workspace_id
                });
                return workspace.timezone;
            }
        }
    }

    // Priority 2: workspace timezone via profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('workspace_id')
        .eq('id', userId)
        .single();

    if (profile?.workspace_id) {
        const { data: workspace } = await supabase
            .from('workspaces')
            .select('timezone')
            .eq('id', profile.workspace_id)
            .single();

        if (workspace?.timezone) {
            logger.info('[ANALYTICS_TZ_USED]', {
                source: 'workspace',
                tz: workspace.timezone,
                workspaceId: profile.workspace_id
            });
            return workspace.timezone;
        }
    }

    logger.info('[ANALYTICS_TZ_USED]', {
        source: 'fallback',
        tz: 'UTC'
    });

    return 'UTC';
}

const normalizeTimezone = (tz) => {
    if (!tz) return null;
    if (tz.includes('Kolcata')) return 'Asia/Kolkata';
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return tz;
    } catch (e) {
        return null;
    }
};

// GET /api/stats (Overview)
router.get('/', supabaseAuth, async (req, res) => {
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // Resolve workspace timezone for aggregation
        const workspaceTz = await resolveAnalyticsTimezone(req.supabase, user.id);

        // Parse date range parameters
        const { days, start, end } = req.query;
        let startDate, endDate;

        if (start && end) {
            // Custom date range
            startDate = new Date(start);
            endDate = new Date(end);
        } else {
            // Default to last 30 days (standardized)
            const numDays = parseInt(days) || 30;
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - (numDays - 1));
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
            uniqueVisitors: 0,
            topQr: 'N/A',
            recentScans: [],
            deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
            scansOverTime: [],
            locationStats: [],
            hourlyStats: []
        };

        if (qrIds.length > 0) {
            // Calculate comparison period
            const periodMs = endDate.getTime() - startDate.getTime();
            const prevStartDate = new Date(startDate.getTime() - periodMs);

            // Fetch scans within the date range (including comparison period)
            const { data: allScans, error: scanError } = await req.supabase
                .from('scans')
                .select('*')
                .in('qr_id', qrIds)
                .gte('scanned_at', prevStartDate.toISOString())
                .lte('scanned_at', endDate.toISOString())
                .order('scanned_at', { ascending: false })
                .limit(10000);

            if (scanError) throw scanError;

            // Separate current and previous scans
            const scans = allScans.filter(s => new Date(s.scanned_at) >= startDate);
            const prevScans = allScans.filter(s => new Date(s.scanned_at) < startDate);

            if (scans && scans.length > 0) {
                stats.totalScans = scans.length;

                // Unique IPs (renamed to Unique Visitors)
                const uniqueIps = new Set(scans.map(s => s.ip_address));
                stats.uniqueVisitors = uniqueIps.size;

                // Recent Scans (Top 5)
                stats.recentScans = scans.slice(0, 5).map(s => ({
                    id: s.id,
                    qr_name: qrMap[s.qr_id] || 'Unknown QR',
                    timestamp: s.scanned_at,
                    user_agent: s.browser || 'Unknown',
                    city: s.city || 'Unknown',
                    country: s.country || 'Unknown',
                    ip_address: s.ip_address
                }));

                // Top QR
                const qrCounts = {};
                scans.forEach(s => {
                    qrCounts[s.qr_id] = (qrCounts[s.qr_id] || 0) + 1;
                });
                const topQrId = Object.keys(qrCounts).reduce((a, b) => qrCounts[a] > qrCounts[b] ? a : b, null);
                stats.topQr = topQrId ? { name: qrMap[topQrId] || 'Untitled QR' } : 'N/A';

                // Device Stats & OS
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
                });

                const total = scans.length;
                stats.deviceStats = {
                    Mobile: Math.round((deviceCounts.Mobile / total) * 100) || 0,
                    Tablet: Math.round((deviceCounts.Tablet / total) * 100) || 0,
                    Desktop: Math.round((deviceCounts.Desktop / total) * 100) || 0,
                    iOS: Math.round((deviceCounts.iOS / total) * 100) || 0,
                    Android: Math.round((deviceCounts.Android / total) * 100) || 0
                };

                stats.dominantOS = Object.keys(osCounts).reduce((a, b) => osCounts[a] > osCounts[b] ? a : b, 'N/A');

                // Location Stats (Aggregated) with Trends
                const locationMap = {};
                const prevLocationMap = {};

                scans.forEach(s => {
                    const country = s.country || 'Unknown';
                    const city = s.city || 'Unknown';
                    const key = `${country}:${city}`;
                    if (!locationMap[key]) {
                        locationMap[key] = { country, city, count: 0 };
                    }
                    locationMap[key].count++;
                });

                prevScans.forEach(s => {
                    const country = s.country || 'Unknown';
                    const city = s.city || 'Unknown';
                    const key = `${country}:${city}`;
                    if (!prevLocationMap[key]) {
                        prevLocationMap[key] = { count: 0 };
                    }
                    prevLocationMap[key].count++;
                });

                const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
                stats.locationStats = Object.values(locationMap)
                    .sort((a, b) => b.count - a.count)
                    .map(loc => {
                        const key = `${loc.country || 'Unknown'}:${loc.city || 'Unknown'}`;
                        const prevCount = prevLocationMap[key]?.count || 0;
                        let trend = 0;
                        if (prevCount === 0 && loc.count > 0) trend = 100;
                        else if (prevCount > 0) trend = Math.round(((loc.count - prevCount) / prevCount) * 100);

                        let countryName = loc.country;
                        if (loc.country && loc.country !== 'Unknown') {
                            try {
                                countryName = regionNames.of(loc.country.toUpperCase());
                            } catch (e) {
                                // Fallback to code
                            }
                        }
                        return { ...loc, countryName, trend };
                    });

                // Region / Continent Stats
                const regionMap = {};
                scans.forEach(s => {
                    const continent = getContinent(s.country);
                    if (!regionMap[continent]) regionMap[continent] = 0;
                    regionMap[continent]++;
                });

                stats.regionStats = Object.keys(regionMap)
                    .map(name => ({
                        name,
                        count: regionMap[name],
                        percentage: Math.round((regionMap[name] / scans.length) * 100)
                    }))
                    .sort((a, b) => b.count - a.count);

                // Scans Over Time - Intelligent aggregation based on date range
                const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                const timeline = {};
                if (daysDiff <= 31) {
                    // Daily aggregation for up to 31 days
                    try {
                        const dailyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: workspaceTz });
                        for (let i = 0; i < daysDiff; i++) {
                            const d = new Date(startDate);
                            d.setDate(d.getDate() + i);
                            const key = dailyFormatter.format(d);
                            timeline[key] = 0;
                        }
                        scans.forEach(s => {
                            const key = dailyFormatter.format(new Date(s.scanned_at));
                            if (timeline[key] !== undefined) timeline[key]++;
                        });
                    } catch (e) {
                        logger.error('[ANALYTICS_TZ_ERROR]', { tz: workspaceTz, error: e.message });
                        // Fallback to UTC
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
                    }

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

            // Hourly Stats (Peak Scanning Times) - runs for all date ranges if user has QRs
            const hourlyMap = {};
            for (let h = 0; h < 24; h++) {
                hourlyMap[h] = 0;
            }

            if (scans && scans.length > 0) {
                let hourFormat = null;
                try {
                    hourFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: workspaceTz });
                } catch (e) {
                    logger.error('[ANALYTICS_TZ_ERROR]', { tz: workspaceTz, error: e.message });
                }

                scans.forEach(s => {
                    const scanDate = new Date(s.scanned_at);
                    let hour;
                    if (hourFormat) {
                        try {
                            const parts = hourFormat.formatToParts(scanDate);
                            const hourPart = parts.find(p => p.type === 'hour');
                            hour = parseInt(hourPart.value) % 24;
                        } catch (e) {
                            hour = scanDate.getHours();
                        }
                    } else {
                        hour = scanDate.getHours();
                    }
                    hourlyMap[hour]++;
                });
            }

            stats.hourlyStats = Object.keys(hourlyMap).map(h => ({
                hour: parseInt(h),
                count: hourlyMap[h]
            }));


            // Hourly Heatmap (Day × Hour) - v2 feature
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const heatmapData = {};

            // Initialize all days with 24 hours of zeros
            daysOfWeek.forEach(day => {
                heatmapData[day] = Array(24).fill(0);
            });

            if (scans && scans.length > 0) {
                let heatFormatter = null;
                try {
                    heatFormatter = new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        hour12: false,
                        weekday: 'short',
                        timeZone: workspaceTz
                    });
                } catch (e) {
                    logger.error('[ANALYTICS_TZ_ERROR]', { tz: workspaceTz, error: e.message });
                }

                scans.forEach(s => {
                    const scanDate = new Date(s.scanned_at);
                    let dayName, hour;

                    if (heatFormatter) {
                        try {
                            const parts = heatFormatter.formatToParts(scanDate);
                            hour = parseInt(parts.find(p => p.type === 'hour').value) % 24;
                            dayName = parts.find(p => p.type === 'weekday').value;
                        } catch (e) {
                            dayName = daysOfWeek[scanDate.getDay()];
                            hour = scanDate.getHours();
                        }
                    } else {
                        dayName = daysOfWeek[scanDate.getDay()];
                        hour = scanDate.getHours();
                    }

                    if (heatmapData[dayName]) {
                        heatmapData[dayName][hour]++;
                    }
                });
            }

            stats.hourlyHeatmap = heatmapData;

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
            uniqueVisitors: 0,
            topQr: qr.name,
            recentScans: [],
            deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
            scansOverTime: []
        };

        // Parse date range
        const numDays = parseInt(days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (numDays - 1));
        startDate.setHours(0, 0, 0, 0);

        const { data: scans, error: scanError } = await req.supabase
            .from('scans')
            .select('*')
            .eq('qr_id', qr_id)
            .gte('scanned_at', startDate.toISOString())
            .order('scanned_at', { ascending: false })
            .limit(10000);

        if (scanError) throw scanError;

        if (scans && scans.length > 0) {
            stats.totalScans = scans.length;
            const uniqueIps = new Set(scans.map(s => s.ip_address));
            stats.uniqueVisitors = uniqueIps.size;

            // Calculate Top Location from ALL scans
            const locationCounts = {};
            scans.forEach(s => {
                if (s.country && s.country !== 'Unknown') {
                    const locKey = s.city && s.city !== 'Unknown'
                        ? `${s.city}, ${s.country}`
                        : s.country;
                    locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
                }
            });

            const topLocationEntry = Object.entries(locationCounts)
                .sort((a, b) => b[1] - a[1])[0];

            stats.topLocation = topLocationEntry ? topLocationEntry[0] : 'N/A';

            stats.recentScans = scans.slice(0, 5).map(s => ({
                id: s.id,
                qr_name: qr.name,
                timestamp: s.scanned_at,
                user_agent: s.browser || 'Unknown',
                city: s.city || 'Unknown',
                country: s.country || 'Unknown',
                location: s.city && s.city !== 'Unknown' ? `${s.city}, ${s.country}` : (s.country || 'Unknown'),
                ip_address: s.ip_address
            }));

            // Device Stats & OS
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
            });

            const total = scans.length;
            stats.deviceStats = {
                Mobile: Math.round((deviceCounts.Mobile / total) * 100) || 0,
                Tablet: Math.round((deviceCounts.Tablet / total) * 100) || 0,
                Desktop: Math.round((deviceCounts.Desktop / total) * 100) || 0,
                iOS: Math.round((deviceCounts.iOS / total) * 100) || 0,
                Android: Math.round((deviceCounts.Android / total) * 100) || 0
            };

            stats.dominantOS = Object.keys(osCounts).reduce((a, b) => osCounts[a] > osCounts[b] ? a : b, 'N/A');

            // Scans Over Time
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
        } else {
            stats.topLocation = 'N/A';
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
            .order('scanned_at', { ascending: false })
            .limit(10000);

        if (scanError) throw scanError;

        // Initialize stats
        const stats = {
            totalScans: 0,
            uniqueVisitors: 0,
            deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
            scansOverTime: []
        };

        if (scans && scans.length > 0) {
            stats.totalScans = scans.length;
            const uniqueIps = new Set(scans.map(s => s.ip_address));
            stats.uniqueVisitors = uniqueIps.size;

            // Device Stats & OS
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
            });

            const total = scans.length;
            stats.deviceStats = {
                Mobile: Math.round((deviceCounts.Mobile / total) * 100) || 0,
                Tablet: Math.round((deviceCounts.Tablet / total) * 100) || 0,
                Desktop: Math.round((deviceCounts.Desktop / total) * 100) || 0,
                iOS: Math.round((deviceCounts.iOS / total) * 100) || 0,
                Android: Math.round((deviceCounts.Android / total) * 100) || 0
            };

            stats.dominantOS = Object.keys(osCounts).reduce((a, b) => osCounts[a] > osCounts[b] ? a : b, 'N/A');

            // Scans Over Time (Last 7 days or custom)
            const numDays = parseInt(days) || 30;
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
