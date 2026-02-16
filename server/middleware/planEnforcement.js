const { resolveUserPlan } = require('../utils/planManager');
const logger = require('../utils/logger');

/**
 * Middleware factory to require a specific feature
 * Usage: router.get('/api/campaigns', requireFeature('campaigns'), ...)
 * 
 * @param {string} featureName - The feature key to check (e.g., 'campaigns', 'ab_testing')
 * @returns {Function} Express middleware function
 */
function requireFeature(featureName) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                logger.warn('[PLAN_ENFORCEMENT] Unauthorized access attempt', { featureName });
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const planInfo = await resolveUserPlan(userId);
            const hasFeature = planInfo.features[featureName];

            if (!hasFeature) {
                logger.info('[PLAN_ENFORCEMENT] Feature access denied', {
                    userId,
                    featureName,
                    currentPlan: planInfo.effectivePlan
                });

                return res.status(403).json({
                    error: `This feature requires a higher plan`,
                    feature: featureName,
                    currentPlan: planInfo.effectivePlan,
                    requiredPlan: getRequiredPlan(featureName)
                });
            }

            // Attach planInfo to request for downstream use
            req.planInfo = planInfo;
            next();
        } catch (error) {
            logger.error('[PLAN_ENFORCEMENT] Error checking feature access', {
                featureName,
                error: error.message
            });
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

/**
 * Helper function to determine required plan for a feature
 */
function getRequiredPlan(featureName) {
    const featurePlanMap = {
        'campaigns': 'pro',
        'ab_testing': 'pro',
        'csv_export': 'pro',
        'branding': 'pro',
        'scheduling': 'starter',
        'svg_pdf_downloads': 'starter',
        'advanced_analytics': 'pro'
    };

    return featurePlanMap[featureName] || 'pro';
}

/**
 * Middleware to attach plan info to request without enforcing
 * Useful for routes that need plan info but don't require specific features
 */
async function attachPlanInfo(req, res, next) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return next();
        }

        const planInfo = await resolveUserPlan(userId);
        req.planInfo = planInfo;
        next();
    } catch (error) {
        logger.error('[PLAN_ENFORCEMENT] Error attaching plan info', {
            error: error.message
        });
        next(); // Continue even if plan resolution fails
    }
}

module.exports = {
    requireFeature,
    attachPlanInfo
};
