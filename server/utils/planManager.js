/**
 * Plan Manager Utility
 * 
 * Centralizes plan resolution and limit checking.
 * Uses the Service Role (Admin) client to bypass RLS issues 
 * when resolving internal business logic.
 */

const { getAdminClient } = require('./supabase');
const logger = require('./logger');

const PLAN_CONFIG = {
    limits: {
        free: 5,
        starter: 100,
        pro: 1000
    },
    features: {
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
    }
};

/**
 * Resolves the effective plan for a user.
 * Bypasses RLS by using the Admin Client.
 * 
 * @param {string} userId 
 * @returns {Promise<Object>} Plan info
 */
async function resolveUserPlan(userId) {
    const admin = getAdminClient();

    try {
        // Fetch profile with admin client (Bypasses RLS)
        const { data: profile, error } = await admin
            .from('profiles')
            .select('plan, plan_expires_at')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            logger.error('[PLAN_MANAGER] Error fetching profile', { userId, error: error.message });
            return getDefaultPlan('free');
        }

        if (!profile) {
            logger.info('[PLAN_MANAGER] No profile found, using free defaults', { userId });
            return getDefaultPlan('free');
        }

        const storedPlan = profile.plan || 'free';
        const planExpiresAt = profile.plan_expires_at;

        let effectivePlan = storedPlan;

        // Compute expiration logic
        let daysRemaining = null;
        let isTrial = false;

        if (planExpiresAt) {
            const expiryDate = new Date(planExpiresAt);
            const now = new Date();

            if (expiryDate <= now) {
                effectivePlan = 'free';
                logger.info('[PLAN_MANAGER] Plan expired', { userId, storedPlan, planExpiresAt });
            } else {
                // If it has an expiry date and is NOT expired, it's a trial (or term-limited plan)
                isTrial = true;
                const diffTime = Math.abs(expiryDate - now);
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        }

        const planInfo = {
            plan: storedPlan,
            effectivePlan: effectivePlan,
            plan_expires_at: planExpiresAt || null,
            is_trial: isTrial,
            days_remaining: daysRemaining,
            qr_limit: PLAN_CONFIG.limits[effectivePlan] || 5,
            features: PLAN_CONFIG.features[effectivePlan] || PLAN_CONFIG.features.free
        };

        return planInfo;

    } catch (err) {
        logger.error('[PLAN_MANAGER] Critical error', { userId, error: err.message });
        return getDefaultPlan('free');
    }
}

function getDefaultPlan(planType) {
    return {
        plan: planType,
        effectivePlan: planType,
        plan_expires_at: null,
        qr_limit: PLAN_CONFIG.limits[planType] || 5,
        features: PLAN_CONFIG.features[planType] || PLAN_CONFIG.features.free
    };
}

module.exports = {
    resolveUserPlan,
    PLAN_CONFIG
};
