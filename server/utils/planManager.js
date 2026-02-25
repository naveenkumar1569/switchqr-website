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
        free: 3,        // Updated from 5
        starter: 100,
        pro: 1000
    },
    scanLimits: {
        free: 1000,
        starter: 100000,
        pro: null  // Unlimited
    },
    linkUpdateLimits: {
        free: 10,
        starter: 500,
        pro: null  // Unlimited
    },
    analyticsHistoryDays: {
        free: 7,
        starter: 90,
        pro: null  // Unlimited
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
            advanced_analytics: false,  // Starter gets "Basic" analytics, not "Advanced"
            campaigns: false,
            branding: false,
            ab_testing: false,
            scheduling: true,
            csv_export: false,          // CSV export is Pro-only
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
            .select('plan, plan_expires_at, subscription_status, current_period_end')
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

        let storedPlan = profile.plan || 'free';
        let planExpiresAt = profile.plan_expires_at;
        const subscriptionStatus = profile.subscription_status;
        const currentPeriodEnd = profile.current_period_end || null;

        // --- AUTO-TRIAL FOR NEW USERS (OAuth/Supabase bypass) ---
        // If on free plan with NO expiry and NO subscription status, they likely missed the trial.
        if (storedPlan === 'free' && !planExpiresAt && !subscriptionStatus) {
            try {
                const trialExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                logger.info('[PLAN_MANAGER] Auto-applying 7-day Pro trial (Lazy)', { userId, expiresAt: trialExpiresAt.toISOString() });

                const { error: updateError } = await admin
                    .from('profiles')
                    .update({
                        plan: 'pro',
                        plan_expires_at: trialExpiresAt.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (updateError) {
                    logger.error('[PLAN_MANAGER] Failed to auto-apply trial', { userId, error: updateError.message });
                } else {
                    // Update variables so the current request returns the trial info immediately
                    storedPlan = 'pro';
                    planExpiresAt = trialExpiresAt.toISOString();
                    logger.info('[PLAN_MANAGER] ✅ Auto-trial applied successfully', { userId });
                }
            } catch (err) {
                logger.error('[PLAN_MANAGER] Error in auto-trial logic', { userId, error: err.message });
            }
        }

        let effectivePlan = storedPlan;

        // Compute expiration logic
        let daysRemaining = null;
        let isTrial = false;

        // 1. Active Subscription: Always Pro, No Expiry Banner
        if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
            effectivePlan = storedPlan;
            isTrial = false;

            if (subscriptionStatus === 'trialing' && planExpiresAt) {
                isTrial = true;
                const expiryDate = new Date(planExpiresAt);
                const now = new Date();
                const diffTime = expiryDate - now;
                daysRemaining = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;
            }
        }
        // 2. Fixed Term / Manual Trial / Canceled Subscription (Run-out phase)
        else if (planExpiresAt) {
            const expiryDate = new Date(planExpiresAt);
            const now = new Date();

            if (expiryDate <= now) {
                effectivePlan = 'free';
                logger.info('[PLAN_MANAGER] Plan expired', { userId, storedPlan, planExpiresAt });
            } else {
                // If it has an expiry date and is NOT expired, it's a trial (or term-limited plan)
                // This covers the current manual "Pro Trial" case.
                isTrial = true;
                const diffTime = expiryDate - now;
                daysRemaining = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;
            }
        }
        // 3. Lifetime / Manual Paid (No expiry, No sub status) -> Remains Stored Plan (Pro)

        const planInfo = {
            plan: storedPlan,
            effectivePlan: effectivePlan,
            plan_expires_at: planExpiresAt || null,
            subscription_status: subscriptionStatus || null,
            current_period_end: currentPeriodEnd,
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
