/**
 * URL Helper Utilities
 * Provides smart URL normalization and validation
 */

/**
 * Normalizes a URL by adding https:// if no protocol is present
 * @param {string} url - The URL to normalize
 * @returns {string} - Normalized URL with protocol
 */
export const normalizeUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    const trimmed = url.trim();
    if (!trimmed) return trimmed;

    // Check if protocol already exists (http:// or https://)
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    // Add https:// by default
    return `https://${trimmed}`;
};

/**
 * Validates URL format (after normalization)
 * Blocks unsafe schemes like javascript:, data:, file:, etc.
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid HTTP/HTTPS URL
 */
export const validateUrl = (url) => {
    if (!url) return true; // Let required attribute handle empty

    // Block unsafe schemes before normalization
    const unsafeSchemes = /^(javascript|data|file|vbscript|blob):/i;
    if (unsafeSchemes.test(url.trim())) {
        return false;
    }

    try {
        const normalized = normalizeUrl(url);
        const parsed = new URL(normalized);
        // Only allow http and https protocols
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};
