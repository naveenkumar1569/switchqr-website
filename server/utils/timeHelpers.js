/**
 * Time and Timezone Helper Utilities
 */

const logger = require('./logger');

/**
 * Normalizes a timezone string and validates it
 * @param {string} tz - Timezone string (e.g., 'UTC', 'Asia/Kolkata')
 * @returns {string|null} Validated timezone or null
 */
const normalizeTimezone = (tz) => {
    if (!tz) return null;

    // Core correction for common typos or legacy inputs
    let normalized = tz;
    if (tz.includes('Kolcata')) normalized = 'Asia/Kolkata';

    try {
        // Validate against Intl API
        Intl.DateTimeFormat(undefined, { timeZone: normalized });
        return normalized;
    } catch (e) {
        logger.warn(`[TIME_HELPERS] Invalid timezone provided: ${tz}, falling back to null`);
        return null;
    }
};

module.exports = {
    normalizeTimezone
};
