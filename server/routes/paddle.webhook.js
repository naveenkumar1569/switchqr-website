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
// Replace these with your actual Paddle price IDs from the dashboard
const PRICE_PLAN_MAP = {
    'pri_01jh...': 'starter',
    'pri_02jh...': 'pro'
};

// Note: In index.js, this router is registered at /api/paddle/webhook
// with express.raw({ type: '*/*' }), so we use '/' here.
router.post('/', async (req, res) => {
    logger.info('[PADDLE_WEBHOOK_RECEIVED]', {
        url: req.originalUrl,
        method: req.method
    });

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

    /**
     * Helper to find a user by user_id in custom_data or paddle_customer_id in profile
     */
    const findUserId = async (data) => {
        // 1. Try custom_data.user_id (preferred for new signups)
        const customUserId = data.custom_data?.user_id;
        if (customUserId) return customUserId;

        // 2. Try falling back to paddle_customer_id lookup (important for renewals/updates)
        const customerId = data.customer_id;
        if (customerId) {
            const { data: profile, error } = await admin
                .from('profiles')
                .select('id')
                .eq('paddle_customer_id', customerId)
                .maybeSingle();

            if (profile) return profile.id;
        }

        return null;
    };

    try {
        switch (eventType) {
            case 'subscription.created':
            case 'subscription.updated': {
                const userId = await findUserId(data);
                if (!userId) {
                    logger.warn('[PADDLE_WEBHOOK_SKIP] Could not map user', { eventId, customerId: data.customer_id });
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
                logger.info('[PADDLE_PROFILE_UPDATED]', { userId, status, plan, type: eventType });
                break;
            }

            case 'subscription.canceled': {
                const { error } = await admin
                    .from('profiles')
                    .update({
                        subscription_status: 'canceled',
                        updated_at: new Date().toISOString()
                    })
                    .eq('subscription_id', data.id);

                if (error) throw error;
                logger.info('[PADDLE_PROFILE_UPDATED] (Canceled)', { subscriptionId: data.id });
                break;
            }

            case 'transaction.completed': {
                const userId = await findUserId(data);
                if (!userId) {
                    logger.warn('[PADDLE_WEBHOOK_SKIP] Could not map user for transaction', { eventId });
                    break;
                }

                // Paddle sends total in minor units string (e.g. "900")
                const amountMinor = parseInt(data.details.totals.total);

                const { error } = await admin
                    .from('transactions')
                    .insert({
                        id: data.id,
                        user_id: userId,
                        subscription_id: data.subscription_id,
                        amount_minor: amountMinor,
                        currency: data.currency_code,
                        status: 'completed',
                        created_at: data.created_at
                    });

                if (error) throw error;
                logger.info('[PADDLE_TRANSACTION_RECORDED]', { userId, transactionId: data.id });
                break;
            }

            default:
                logger.info(`[PADDLE_WEBHOOK_IGNORED] Unhandled event type: ${eventType}`);
        }

        // Return 200 and processed status only after successful work
        return res.status(200).json({ status: 'processed' });

    } catch (err) {
        logger.error('[PADDLE_WEBHOOK_ERROR] Processing failed', {
            eventType,
            eventId,
            error: err.message
        });
        // We still return 200 to Paddle but with "error" status to help us debug 
        // without triggering infinite retries from Paddle for bugs.
        return res.status(200).json({ status: 'error', message: 'Internal processing error' });
    }
});

module.exports = router;
