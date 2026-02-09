/**
 * QR Code Helpers
 * 
 * Centralized utility for generating QR code URLs.
 * CRITICAL: All QR generation MUST use this module to ensure immutability.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://r.switch-qr.com';

/**
 * Get the redirect URL for a QR code.
 * This is what gets encoded INTO the QR image.
 * @param {string} shortCode - The QR's short_code
 * @returns {string} The full redirect URL
 */
export const getRedirectUrl = (shortCode) => {
    if (!shortCode) {
        throw new Error('Cannot generate redirect URL without short_code');
    }
    return `${API_BASE_URL}/r/${shortCode}`;
};

/**
 * Get the QR code image URL from the external API.
 * @param {string} shortCode - The QR's short_code
 * @param {Object} options - Configuration options
 * @param {number} options.size - Image size in pixels (default: 200)
 * @param {string} options.format - Image format: 'png', 'svg', 'eps' (default: 'png')
 * @param {string} options.color - Hex color without # (default: '000000')
 * @returns {string} The full QR image URL
 */
export const getQRImageUrl = (shortCode, options = {}) => {
    if (!shortCode) {
        throw new Error('Cannot generate QR image without short_code');
    }

    const { size = 200, format = 'png', color = '000000' } = options;
    const redirectUrl = getRedirectUrl(shortCode);
    const encodedData = encodeURIComponent(redirectUrl);

    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&format=${format}&color=${color.replace('#', '')}`;
};

/**
 * Get the preview QR code image URL (for pre-creation preview only).
 * This uses the destination URL directly and should ONLY be used for preview.
 * @param {string} destinationUrl - The destination URL to encode
 * @param {Object} options - Configuration options  
 * @returns {string} The preview QR image URL
 */
export const getPreviewQRImageUrl = (destinationUrl, options = {}) => {
    const { size = 200, color = '000000' } = options;
    const urlToEncode = destinationUrl || 'https://example.com';
    const encodedData = encodeURIComponent(urlToEncode);

    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&color=${color.replace('#', '')}`;
};

export default {
    getRedirectUrl,
    getQRImageUrl,
    getPreviewQRImageUrl
};
