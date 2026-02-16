/**
 * Centralized Error Handling Utility
 * 
 * Provides consistent error response formatting across all API routes.
 * Supports development vs production error details.
 */

/**
 * Custom Application Error Class
 * Extends native Error with HTTP status code and metadata support
 */
class AppError extends Error {
    constructor(message, statusCode = 500, meta = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.meta = meta; // For upgrade_required, details, etc.
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Standardized Error Response Handler
 * @param {Response} res - Express response object
 * @param {Error} error - Error object (AppError or native Error)
 */
const errorResponse = (res, error) => {
    const statusCode = error.statusCode || 500;

    // Base response with error message
    const response = {
        error: error.message || 'An unexpected error occurred'
    };

    // Include metadata if present (upgrade_required, etc.)
    if (error.meta && Object.keys(error.meta).length > 0) {
        Object.assign(response, error.meta);
    }

    // Include stack trace in development only (not production)
    if (process.env.NODE_ENV !== 'production' && error.stack) {
        response.stack = error.stack;
    }

    res.status(statusCode).json(response);
};

/**
 * Common HTTP Status Codes for Quick Reference
 */
const StatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

module.exports = {
    AppError,
    errorResponse,
    StatusCodes
};
