const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Verifies the Paddle webhook signature (v2).
 * Paddle docs: https://developer.paddle.com/webhooks/signature-verification
 */
function verifyPaddleSignature(signatureHeader, rawBodyBuffer, secret) {
    if (!signatureHeader || !rawBodyBuffer || !secret) return false;

    // Extract ts and h1 from header (format: h1=...;ts=...)
    const parts = signatureHeader.split(';');
    const h1 = parts.find(p => p.startsWith('h1='))?.split('=')[1];
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];

    if (!h1 || !ts) return false;

    // Construct the payload to sign: timestamp + ":" + rawBody
    // Note: rawBodyBuffer is expected to be the raw Buffer from express.raw
    const payload = ts + ":" + rawBodyBuffer.toString();

    // Create HMAC-SHA256 hash
    const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    // Constant time comparison
    const h1Buffer = Buffer.from(h1);
    const expectedBuffer = Buffer.from(expectedHash);

    if (h1Buffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(h1Buffer, expectedBuffer);
}

// Note: In index.js, this router is registered at /api/paddle/webhook
// with express.raw({ type: '*/*' }), so we use '/' here.
router.post('/', (req, res) => {
    const signature = req.get('Paddle-Signature');
    const rawBodyBuffer = req.body; // Buffer from express.raw

    if (!verifyPaddleSignature(signature, rawBodyBuffer, config.paddleWebhookSecret)) {
        logger.warn('[PADDLE_WEBHOOK_REJECTED] Invalid signature', {
            signature: signature ? 'present' : 'missing'
        });
        return res.status(401).json({ error: 'Invalid signature' });
    }

    let event;
    try {
        event = JSON.parse(rawBodyBuffer.toString());
    } catch (e) {
        logger.error('[PADDLE_WEBHOOK_ERROR] Failed to parse body', { error: e.message });
        return res.status(400).json({ error: 'Invalid JSON' });
    }

    const eventType = event.event_type;
    const eventId = event.event_id;

    logger.info(`[PADDLE_WEBHOOK_VERIFIED] ${eventType} ${eventId}`, {
        eventType,
        eventId
    });

    // Return 200 to Paddle immediately
    res.status(200).json({ status: 'received' });
});

module.exports = router;
