/**
 * Standardized Error Messages
 * 
 * User-friendly error messages used throughout the application.
 * Centralized to ensure consistency and easy maintenance.
 */

module.exports = {
    // ========================================
    // Authentication & Authorization
    // ========================================
    AUTH_REQUIRED: 'Authentication required',
    AUTH_SERVICE_ERROR: 'Authentication service misconfigured',
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_TOKEN: 'Invalid or expired token',

    // Registration
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',

    // ========================================
    // Resources - Not Found (404)
    // ========================================
    QR_NOT_FOUND: 'QR code not found',
    CAMPAIGN_NOT_FOUND: 'Campaign not found',
    VARIANT_NOT_FOUND: 'Variant not found',
    SCHEDULE_NOT_FOUND: 'Schedule not found',
    USER_NOT_FOUND: 'User not found',

    // ========================================
    // Validation Errors (400)
    // ========================================
    INVALID_URL: 'Destination URL is required',
    INVALID_WEIGHT: 'Weight must be between 0 and 100',
    INVALID_TIMEZONE: 'Invalid timezone format',
    TIMEZONE_REQUIRED: 'Timezone is required',
    NO_FIELDS_TO_UPDATE: 'No fields to update',
    INVALID_TIME_RANGE: 'end_time must be after start_time',
    INVALID_BOOLEAN: 'Value must be a boolean',

    // ========================================
    // Plan Enforcement & Limits (403)
    // ========================================
    FEATURE_UNAVAILABLE: 'This feature is not available on your plan',
    SCHEDULING_UNAVAILABLE: 'Scheduling not available on your plan',
    AB_TESTING_UNAVAILABLE: 'A/B Testing not available on your plan',
    ANALYTICS_UNAVAILABLE: 'Advanced analytics not available on your plan',

    LIMIT_REACHED: 'Plan limit reached. Please upgrade.',
    QR_LIMIT_REACHED: 'QR code limit reached. Please upgrade to create more.',
    SCAN_LIMIT_REACHED: 'Scan limit reached for your plan.',

    UPGRADE_REQUIRED: 'Upgrade required to access this feature',

    // ========================================
    // Server Errors (500)
    // ========================================
    SERVER_ERROR: 'An unexpected error occurred. Please try again.',
    FAILED_TO_UPDATE: 'Failed to update. Please try again.',
    FAILED_TO_CREATE: 'Failed to create. Please try again.',
    FAILED_TO_DELETE: 'Failed to delete. Please try again.',

    // ========================================
    // Webhook & External Services
    // ========================================
    INVALID_SIGNATURE: 'Invalid signature',
    WEBHOOK_PROCESSING_FAILED: 'Webhook processing failed',
};
