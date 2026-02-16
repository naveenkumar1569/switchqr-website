/**
 * URL Formatter Utility
 * 
 * Implements strict normalization rules for link update comparison.
 */

/**
 * Normalizes a URL for comparison.
 * - Trims whitespace
 * - Lowercases hostname
 * - Removes trailing slash for http/https URLs
 * - Keeps querystring and path case as-is
 * 
 * @param {string} urlString 
 * @returns {string} Normalized URL
 */
function normalizeUrl(urlString) {
    if (!urlString) return '';

    let url = urlString.trim();

    try {
        // Attempt to parse to handle host lowercasing and trailing slashes correctly
        const parsed = new URL(url);

        // URL constructor already lowercases the host
        let normalized = parsed.origin + parsed.pathname;

        // Remove trailing slash if present in pathname and it's not just '/'
        if (normalized.endsWith('/') && parsed.pathname.length > 1) {
            normalized = normalized.slice(0, -1);
        }

        // Add back search and hash (case preserved by URL constructor)
        normalized += parsed.search + parsed.hash;

        return normalized;
    } catch (e) {
        // Fallback for non-standard or partial URLs
        // Basic trimming and trailing slash removal
        let fallback = url;
        if (fallback.endsWith('/') && fallback.length > 1) {
            fallback = fallback.slice(0, -1);
        }
        return fallback;
    }
}

/**
 * Compares two URLs for functional equality.
 * 
 * @param {string} url1 
 * @param {string} url2 
 * @returns {boolean} True if functionally identical
 */
function isSameUrl(url1, url2) {
    return normalizeUrl(url1) === normalizeUrl(url2);
}

module.exports = {
    normalizeUrl,
    isSameUrl
};
