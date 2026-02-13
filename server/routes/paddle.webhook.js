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

const { getAdminClient } = require('../utils/supabase');

// Map Paddle price IDs to our plan names
// Replace these with your actual Paddle price IDs
const PRICE_PLAN_MAP = {
    'pri_01jh...': 'starter',
    'pri_02jh...': 'pro'
};

// Note: In index.js, this router is registered at /api/paddle/webhook
// with express.raw({ type: '*/*' }), so we use '/' here.
router.post('/', async (req, res) => {
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
    const data = event.data;

    logger.info(`[PADDLE_WEBHOOK_VERIFIED] ${eventType} ${eventId}`, {
        eventType,
        eventId
    });

    const admin = getAdminClient();

    try {
        switch (eventType) {
            case 'subscription.created':
            case 'subscription.updated': {
                const userId = data.custom_data?.user_id;
                if (!userId) {
                    logger.warn('[PADDLE_WEBHOOK_SKIP] No user_id in custom_data', { eventId });
                    break;
                }

                const priceId = data.items[0]?.price?.id;
                const plan = PRICE_PLAN_MAP[priceId] || 'free';
                const status = data.status; // 'active', 'trialing', 'past_due', 'paused', 'deleted'
                const currentPeriodEnd = data.current_billing_period?.ends_at;

                const { error } = await admin
                    .from('profiles')
                    .update({
                        subscription_id: data.id,
                        paddle_customer_id: data.customer_id,
                        subscription_status: status,
                        plan: plan,
                        current_period_end: currentPeriodEnd,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (error) throw error;
                logger.info('[PADDLE_WEBHOOK_PROCESSED] Subscription updated', { userId, status, plan });
                break;
            }

            case 'subscription.canceled': {
                // When canceled, it stays active until the end of the period.
                // Paddle marks status as 'canceled' but we only want to update the status column.
                const { error } = await admin
                    .from('profiles')
                    .update({
                        subscription_status: 'canceled',
                        updated_at: new Date().toISOString()
                    })
                    .eq('subscription_id', data.id);

                if (error) throw error;
                logger.info('[PADDLE_WEBHOOK_PROCESSED] Subscription canceled', { subscriptionId: data.id });
                break;
            }

            case 'transaction.completed': {
                const userId = data.custom_data?.user_id;
                if (!userId) {
                    logger.warn('[PADDLE_WEBHOOK_SKIP] No user_id in transaction custom_data', { eventId });
                    break;
                }

                const { error } = await admin
                    .from('transactions')
                    .insert({
                        id: data.id,
                        user_id: userId,
                        subscription_id: data.subscription_id,
                        amount: parseFloat(data.details.totals.total) / 100,
                        currency: data.currency_code,
                        status: 'completed',
                        created_at: data.created_at
                    });

                if (error) throw error;
                logger.info('[PADDLE_WEBHOOK_PROCESSED] Transaction recorded', { userId, transactionId: data.id });
                break;
            }

            default:
                logger.info(`[PADDLE_WEBHOOK_IGNORED] Unhandled event type: ${eventType}`);
        }
    } catch (err) {
        logger.error('[PADDLE_WEBHOOK_ERROR] Processing failed', {
            eventType,
            eventId,
            error: err.message
        });
    }

    // Return 200 to Paddle immediately
    res.status(200).json({ status: 'received' });
});

module.exports = router;
