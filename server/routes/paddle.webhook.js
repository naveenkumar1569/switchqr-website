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
// Map Paddle product/price IDs to our plan names
const PRODUCT_PLAN_MAP = {
    'pro_01kh970benywx13cg51pj46w3j': 'starter',
    'pro_01kh970zxeg023hv5sdsyzq2eb': 'pro'
};

const PRICE_PLAN_MAP = {
    'pri_01khbh3scr6cq2frtjb97vxmyg': 'starter',
    'pri_01khbh5212q78zrty8wddme54a': 'starter',
    'pri_01khbgknm5vx91dmn5qt98p6wq': 'pro',
    'pri_01khbgdrrk40e9v4w5jpq96jn8': 'pro'
};

// Note: In index.js, this router is registered at /api/paddle/webhook
// with express.raw({ type: '*/*' }), so we use '/' here.
router.post('/', async (req, res) => {
    // [TAG] RECEIVED
    logger.info('[PADDLE_WEBHOOK_RECEIVED]', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    const signature = req.get('Paddle-Signature');
    const rawBodyBuffer = req.body; // Buffer from express.raw

    // Verify Signature
    if (!verifyPaddleSignature(signature, rawBodyBuffer, config.paddleWebhookSecret)) {
        logger.warn('[PADDLE_WEBHOOK_REJECTED] Invalid signature', {
            signature: signature ? 'present' : 'missing'
        });
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // [TAG] VERIFIED
    logger.info('[PADDLE_WEBHOOK_VERIFIED]');

    let event;
    try {
        event = JSON.parse(rawBodyBuffer.toString());
    } catch (e) {
        logger.error('[PADDLE_WEBHOOK_ERROR] Failed to parse body', { error: e.message });
        return res.status(200).json({ status: 'error', message: 'Invalid JSON' }); // 200 to stop retries
    }

    const eventType = event.event_type;
    const eventId = event.event_id;
    // Normalize payload (simulation events sometimes put fields at root)
    const payload = event.data || event;

    const admin = getAdminClient();

    /**
     * Helper to find a user by user_id in custom_data or paddle_customer_id in profile
     */
    const findUser = async (data) => {
        // 1. Try custom_data.user_id
        const customUserId = data.custom_data?.user_id;
        if (customUserId) {
            // Validate it exists
            const { data: profile } = await admin.from('profiles').select('id, email').eq('id', customUserId).maybeSingle();
            if (profile) return { id: profile.id, email: profile.email, method: 'custom_data.user_id' };
        }

        // 2. Try falling back to paddle_customer_id lookup
        const customerId = data.customer_id;
        if (customerId) {
            const { data: profile } = await admin
                .from('profiles')
                .select('id, email')
                .eq('paddle_customer_id', customerId)
                .maybeSingle();

            if (profile) return { id: profile.id, email: profile.email, method: 'paddle_customer_id' };
        }

        return null;
    };

    try {
        switch (eventType) {
            case 'subscription.created':
            case 'subscription.updated': {
                const user = await findUser(payload);

                if (!user) {
                    logger.warn('[PADDLE_USER_RESOLVE_FAILED]', { eventId, customerId: payload.customer_id });
                    return res.status(200).json({ status: 'ignored', message: 'User not found' });
                }

                // [TAG] USER_RESOLVED
                logger.info('[PADDLE_USER_RESOLVED]', {
                    method: user.method,
                    profileId: user.id,
                    email: user.email
                });

                const item = payload.items?.[0];
                const productId = item?.price?.product_id || item?.product?.id;
                const priceId = item?.price?.id;

                const plan =
                    PRODUCT_PLAN_MAP[productId] ||
                    PRICE_PLAN_MAP[priceId] ||
                    'free';

                const status = payload.status;
                // Use next_billed_at or current_billing_period.ends_at
                // Paddle docs: current_billing_period.ends_at is standard for expiry logic
                const currentPeriodEnd = payload.current_billing_period?.ends_at || payload.next_billed_at;

                // [TAG] PLAN_RESOLVED
                logger.info('[PADDLE_PLAN_RESOLVED]', {
                    productId,
                    priceId,
                    resolvedPlan: plan
                });

                const { error } = await admin
                    .from('profiles')
                    .update({
                        subscription_id: payload.id,
                        paddle_customer_id: payload.customer_id,
                        subscription_status: status,
                        plan: plan,
                        current_period_end: currentPeriodEnd, // Maps to either current_period_end or plan_expires_at based on schema preference. Using current_period_end per user request.
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (error) throw error;

                // [TAG] PROFILE_UPDATED
                logger.info('[PADDLE_PROFILE_UPDATED]', {
                    userId: user.id,
                    status,
                    plan,
                    subscriptionId: payload.id
                });
                break;
            }

            case 'subscription.canceled': {
                // When canceled, update status to canceled immediately
                // Do NOT wipe current_period_end (user maintains access until then)
                const { error } = await admin
                    .from('profiles')
                    .update({
                        subscription_status: 'canceled',
                        updated_at: new Date().toISOString()
                    })
                    .eq('subscription_id', payload.id);

                if (error) throw error;

                // [TAG] PROFILE_UPDATED
                logger.info('[PADDLE_PROFILE_UPDATED]', {
                    status: 'canceled',
                    subscriptionId: payload.id
                });
                break;
            }

            case 'transaction.completed': {
                const user = await findUser(payload);

                if (!user) {
                    logger.warn('[PADDLE_USER_RESOLVE_FAILED]', { eventId, transactionId: payload.id });
                    return res.status(200).json({ status: 'ignored', message: 'User not found' });
                }

                // [TAG] USER_RESOLVED
                logger.info('[PADDLE_USER_RESOLVED]', {
                    method: user.method,
                    profileId: user.id,
                    email: user.email
                });

                // Paddle sends total in minor units string (e.g. "900")
                const amountMinor = payload.details?.totals?.total ? parseInt(payload.details.totals.total) : 0;

                // Idempotent Insert (ON CONFLICT DO NOTHING implied by if check or specific upsert)
                // Since we want to log RECORDED only if new, we check existence first or use upsert with return

                // Using upsert to be safe
                const { error } = await admin
                    .from('transactions')
                    .upsert({
                        id: payload.id,
                        user_id: user.id,
                        subscription_id: payload.subscription_id,
                        amount_minor: amountMinor,
                        currency: payload.currency_code,
                        status: payload.status || 'completed',
                        created_at: payload.created_at
                    }, { onConflict: 'id' });

                if (error) throw error;

                // [TAG] TRANSACTION_RECORDED
                logger.info('[PADDLE_TRANSACTION_RECORDED]', {
                    userId: user.id,
                    transactionId: payload.id,
                    amountMinor
                });
                break;
            }

            default:
                logger.info(`[PADDLE_WEBHOOK_IGNORED] Unhandled event type: ${eventType}`);
                return res.status(200).json({ status: 'ignored' });
        }

        // [TAG] DONE
        logger.info('[PADDLE_WEBHOOK_DONE]', { eventType, eventId });

        // Return 200 and processed status
        return res.status(200).json({ status: 'processed' });

    } catch (err) {
        // [TAG] ERROR
        logger.error('[PADDLE_WEBHOOK_ERROR] Processing failed', {
            eventType,
            eventId,
            error: err.message,
            stack: err.stack
        });
        return res.status(200).json({ status: 'error', message: 'Internal processing error' });
    }
});

module.exports = router;
