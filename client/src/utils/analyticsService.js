/**
 * Analytics Service
 * 
 * Centralized module for all analytics/scan data fetching.
 * CRITICAL: All analytics data fetching MUST use this module to ensure consistency.
 */

import { apiGet } from './api';

/**
 * Build date range query parameters for API calls
 * @param {Object} dateRange - Date range configuration
 * @param {string} dateRange.type - 'days', 'current_month', 'last_month', 'this_year', 'last_year', 'custom'
 * @param {number|string} dateRange.value - Number of days (for 'days' type)
 * @param {string} customStartDate - Custom start date (YYYY-MM-DD)
 * @param {string} customEndDate - Custom end date (YYYY-MM-DD)
 * @returns {string} Query string parameters
 */
export const buildDateRangeParams = (dateRange, customStartDate = null, customEndDate = null) => {
    // Simple number means "days" type
    if (typeof dateRange === 'number') {
        return `days=${dateRange}`;
    }

    const now = new Date();
    let startDate, endDate;

    const formatDate = (d) => d.toISOString().split('T')[0];

    switch (dateRange.type) {
        case 'days':
            return `days=${dateRange.value}`;

        case 'current_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            break;

        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;

        case 'this_year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = now;
            break;

        case 'last_year':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31);
            break;

        case 'custom':
            if (customStartDate && customEndDate) {
                return `start=${customStartDate}&end=${customEndDate}`;
            }
            return 'days=7'; // fallback

        default:
            return 'days=7';
    }

    return `start=${formatDate(startDate)}&end=${formatDate(endDate)}`;
};

/**
 * Fetch dashboard overview stats (total scans, top QR, etc.)
 * Used by: Dashboard.jsx
 * @param {string} token - Auth token
 * @returns {Promise<Object|null>} Stats data or null on error
 */
export const fetchDashboardStats = async (token) => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await apiGet(`/api/stats?tz=${encodeURIComponent(tz)}`, token);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return null;
    }
};

/**
 * Fetch global analytics with date range filtering
 * Used by: GlobalAnalytics.jsx
 * @param {string} token - Auth token
 * @param {Object} dateRange - Date range configuration
 * @param {string} customStartDate - Custom start date (for 'custom' type)
 * @param {string} customEndDate - Custom end date (for 'custom' type)
 * @returns {Promise<Object|null>} Stats data or null on error
 */
export const fetchGlobalStats = async (token, dateRange, customStartDate = null, customEndDate = null) => {
    try {
        const params = buildDateRangeParams(dateRange, customStartDate, customEndDate);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await apiGet(`/api/stats?${params}&tz=${encodeURIComponent(tz)}`, token);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch global stats:', error);
        return null;
    }
};

/**
 * Fetch stats for a specific QR code
 * Used by: QRDetails.jsx
 * @param {string} token - Auth token
 * @param {string} qrId - QR code ID
 * @param {number} days - Number of days to fetch (default: 7)
 * @returns {Promise<Object|null>} Stats data or null on error
 */
export const fetchQRStats = async (token, qrId, days = 7) => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await apiGet(`/api/stats/${qrId}?days=${days}&tz=${encodeURIComponent(tz)}`, token);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch QR stats for ${qrId}:`, error);
        return null;
    }
};

/**
 * Fetch detailed analytics for a specific QR code (includes scan list)
 * Used by: Analytics.jsx
 * @param {string} token - Auth token
 * @param {string} qrId - QR code ID
 * @returns {Promise<Object|null>} Analytics data or null on error
 */
export const fetchQRAnalytics = async (token, qrId) => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await apiGet(`/api/analytics/${qrId}?tz=${encodeURIComponent(tz)}`, token);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch QR analytics for ${qrId}:`, error);
        return null;
    }
};

/**
 * Default stats object structure
 * Use this when initializing state to ensure consistent shape
 */
export const DEFAULT_STATS = {
    totalScans: 0,
    uniqueScans: 0,
    scansOverTime: [],
    deviceStats: { Mobile: 0, Desktop: 0, Tablet: 0 },
    recentScans: [],
    topQr: null,
    topLocation: null,
    locationStats: [],
    browserStats: []
};

export default {
    buildDateRangeParams,
    fetchDashboardStats,
    fetchGlobalStats,
    fetchQRStats,
    fetchQRAnalytics,
    DEFAULT_STATS
};
