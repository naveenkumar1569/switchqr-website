const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Verifies the Paddle webhook signature.
 * Paddle docs: https://developer.paddle.com/webhooks/signature-verification
 */
function verifyPaddleSignature(signatureHeader, rawBody, secret) {
    if (!signatureHeader || !rawBody || !secret) return false;

    // Extract ts and h from header (format: h=...;ts=...)
    const parts = signatureHeader.split(';');
    const h = parts.find(p => p.startsWith('h='))?.split('=')[1];
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];

    if (!h || !ts) return false;

    // Construct the payload to sign: timestamp + ":" + rawBody
    const payload = `${ts}:${rawBody}`;

    // Create HMAC-SHA256 hash
    const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    // Constant time comparison
    const hBuffer = Buffer.from(h);
    const expectedBuffer = Buffer.from(expectedHash);

    if (hBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(hBuffer, expectedBuffer);
}

router.post('/webhook', (req, res) => {
    const signature = req.get('Paddle-Signature');
    const rawBody = req.rawBody; // Populated by custom middleware in index.js

    if (!verifyPaddleSignature(signature, rawBody, config.paddleWebhookSecret)) {
        logger.warn('[PADDLE_WEBHOOK_REJECTED] Invalid signature', {
            signature: signature ? 'present' : 'missing'
        });
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
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
