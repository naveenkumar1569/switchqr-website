/**
 * Centralized API Client
 * All API calls should use this module to ensure consistent base URL handling
 */

// API Base URL - defaults to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://switchqr-backend.onrender.com';

/**
 * Makes an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/api/qrs')
 * @param {Object} options - Fetch options
 * @param {string} token - Optional auth token
 * @returns {Promise<Response>}
 */
export const apiRequest = async (endpoint, options = {}, token = null) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};

/**
 * GET request helper
 */
export const apiGet = (endpoint, token = null) => {
    return apiRequest(endpoint, { method: 'GET' }, token);
};

/**
 * POST request helper
 */
export const apiPost = (endpoint, data, token = null) => {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }, token);
};

/**
 * PUT request helper
 */
export const apiPut = (endpoint, data, token = null) => {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    }, token);
};

/**
 * DELETE request helper
 */
export const apiDelete = (endpoint, token = null) => {
    return apiRequest(endpoint, { method: 'DELETE' }, token);
};

/**
 * Get the short code URL for a QR
 * @param {string} shortCode 
 * @returns {string}
 */
export const getShortCodeUrl = (shortCode) => {
    return `${API_BASE_URL}/${shortCode}`;
};

export { API_BASE_URL };
