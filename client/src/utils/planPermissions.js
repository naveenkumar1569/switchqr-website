export const PLANS = {
    FREE: 'free',
    STARTER: 'starter',
    PRO: 'pro'
};

export const FEATURES = {
    // Dashboard
    EXPORT_DATA: 'export_data',

    // QR Details Widgets
    QR_ANALYTICS_CHART: 'qr_analytics_chart',
    QR_DEVICE_DISTRIBUTION: 'qr_device_distribution',
    QR_RECENT_SCANS: 'qr_recent_scans',
    QR_SCHEDULES: 'qr_schedules',
    QR_AB_TESTING: 'qr_ab_testing',

    // Global Analytics Page
    ANALYTICS_PAGE: 'analytics_page',
    ANALYTICS_PEAK_TIME: 'analytics_peak_time',
    ANALYTICS_DEVICES: 'analytics_devices',
    ANALYTICS_LOCATIONS: 'analytics_locations',

    // Creation
    CREATE_SCAN_TRACKING: 'create_scan_tracking',
    CREATE_AB_TESTING: 'create_ab_testing',

    // Campaigns
    CAMPAIGNS_ACCESS: 'campaigns_access'
};

const PLAN_FEATURES = {
    [PLANS.FREE]: {
        [FEATURES.EXPORT_DATA]: false,

        [FEATURES.QR_ANALYTICS_CHART]: false,
        [FEATURES.QR_DEVICE_DISTRIBUTION]: false,
        [FEATURES.QR_RECENT_SCANS]: false,
        [FEATURES.QR_SCHEDULES]: false,
        [FEATURES.QR_AB_TESTING]: false,

        [FEATURES.ANALYTICS_PAGE]: false,

        [FEATURES.CREATE_SCAN_TRACKING]: false,
        [FEATURES.CREATE_AB_TESTING]: false,

        [FEATURES.CAMPAIGNS_ACCESS]: false
    },
    [PLANS.STARTER]: {
        [FEATURES.EXPORT_DATA]: false,          // CSV export is Pro-only

        [FEATURES.QR_ANALYTICS_CHART]: false,   // Pro-only
        [FEATURES.QR_DEVICE_DISTRIBUTION]: false, // Pro-only
        [FEATURES.QR_RECENT_SCANS]: false,      // Pro-only
        [FEATURES.QR_SCHEDULES]: true,          // Available on Starter
        [FEATURES.QR_AB_TESTING]: false,        // Pro-only

        [FEATURES.ANALYTICS_PAGE]: true,        // Basic analytics available
        [FEATURES.ANALYTICS_PEAK_TIME]: false,  // Pro-only
        [FEATURES.ANALYTICS_DEVICES]: false,    // Pro-only
        [FEATURES.ANALYTICS_LOCATIONS]: false,  // Pro-only

        [FEATURES.CREATE_SCAN_TRACKING]: true,  // Available on Starter
        [FEATURES.CREATE_AB_TESTING]: false,    // Pro-only

        [FEATURES.CAMPAIGNS_ACCESS]: false      // Pro-only
    },
    [PLANS.PRO]: {
        // All features enabled
        [FEATURES.EXPORT_DATA]: true,

        [FEATURES.QR_ANALYTICS_CHART]: true,
        [FEATURES.QR_DEVICE_DISTRIBUTION]: true,
        [FEATURES.QR_RECENT_SCANS]: true,
        [FEATURES.QR_SCHEDULES]: true,
        [FEATURES.QR_AB_TESTING]: true,

        [FEATURES.ANALYTICS_PAGE]: true,
        [FEATURES.ANALYTICS_PEAK_TIME]: true,
        [FEATURES.ANALYTICS_DEVICES]: true,
        [FEATURES.ANALYTICS_LOCATIONS]: true,

        [FEATURES.CREATE_SCAN_TRACKING]: true,
        [FEATURES.CREATE_AB_TESTING]: true,

        [FEATURES.CAMPAIGNS_ACCESS]: true
    }
};

/**
 * Checks if a feature is enabled for a given plan
 * @param {string} plan - The user's current plan (free, starter, pro)
 * @param {string} feature - The feature key from FEATURES
 * @returns {boolean} - True if enabled, false if locked
 */
export const isFeatureEnabled = (plan, feature) => {
    const normalizePlan = (plan || 'free').toLowerCase();
    const planConfig = PLAN_FEATURES[normalizePlan] || PLAN_FEATURES[PLANS.FREE];
    return planConfig[feature] === true; // Strict check
};

/**
 * Returns the lock details (title, description) for a feature
 */
export const getLockDetails = (feature) => {
    switch (feature) {
        case FEATURES.EXPORT_DATA:
            return { title: 'Export Locked', description: 'Exporting data is available on Starter and Pro plans.' };
        case FEATURES.QR_ANALYTICS_CHART:
            return { title: 'Performance Chart', description: 'Detailed scan performance charts are available on the Pro plan.' };
        case FEATURES.QR_DEVICE_DISTRIBUTION:
        case FEATURES.ANALYTICS_DEVICES:
            return { title: 'Device Analytics', description: 'Device distribution data is available on the Pro plan.' };
        case FEATURES.QR_RECENT_SCANS:
            return { title: 'Recent Scans', description: 'Recent scan logs are available on the Pro plan.' };
        case FEATURES.QR_SCHEDULES:
            return { title: 'Scheduling Locked', description: 'Scheduled redirects are available on Starter and Pro plans.' };
        case FEATURES.QR_AB_TESTING:
        case FEATURES.CREATE_AB_TESTING:
            return { title: 'A/B Testing', description: 'A/B testing is exclusively available on the Pro plan.' };
        case FEATURES.ANALYTICS_PAGE:
            return { title: 'Analytics Dashboard', description: 'Global analytics are available on Starter and Pro plans.' };
        case FEATURES.ANALYTICS_PEAK_TIME:
            return { title: 'Peak Timing', description: 'Peak scan timing analysis is available on the Pro plan.' };
        case FEATURES.ANALYTICS_LOCATIONS:
            return { title: 'Location Analytics', description: 'Top location data is available on the Pro plan.' };
        case FEATURES.CREATE_SCAN_TRACKING:
            return { title: 'Scan Tracking', description: 'Advanced scan tracking controls are available on Starter and Pro plans.' };
        case FEATURES.CAMPAIGNS_ACCESS:
            return { title: 'Campaigns', description: 'Campaign management is available on the Pro plan.' };
        default:
            return { title: 'Premium Feature', description: 'Upgrade to access this feature.' };
    }
};
