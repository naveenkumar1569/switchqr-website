const crypto = require('crypto');
const http = require('http');

const WEBHOOK_SECRET = 'pdl_ntf_01jn1v0w5f5g1p6c0f8w7z9z9z_placeholder';
const WEBHOOK_URL = 'http://localhost:5001/api/paddle/webhook';
const TEST_USER_ID = '31b9c792-706f-4cbe-b472-87034c44917a'; // Replace with a valid user ID from your profiles table

function sendWebhook(payloadString, signature) {
    return new Promise((resolve, reject) => {
        const req = http.request(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Paddle-Signature': signature,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payloadString)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });

        req.on('error', reject);
        req.write(payloadString);
        req.end();
    });
}

function createPaddleSignature(payloadString) {
    const ts = Math.floor(Date.now() / 1000).toString();
    const message = `${ts}:${payloadString}`;
    const h = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(message)
        .digest('hex');
    return `h1=${h};ts=${ts}`;
}

async function runTests() {
    console.log('Starting Paddle Event Handler Tests...\n');

    // 1. Test subscription.created
    const subCreatedPayload = JSON.stringify({
        event_type: 'subscription.created',
        event_id: 'evt_sub_created_123',
        data: {
            id: 'sub_test_123',
            customer_id: 'ctm_test_123',
            status: 'trialing',
            items: [{ price: { id: 'pri_01jh...' } }], // Map to 'starter'
            current_billing_period: { ends_at: '2026-03-13T00:00:00Z' },
            custom_data: { user_id: TEST_USER_ID }
        }
    });
    console.log('Sending subscription.created...');
    const res1 = await sendWebhook(subCreatedPayload, createPaddleSignature(subCreatedPayload));
    console.log('Result:', res1.status, res1.data);

    // 2. Test transaction.completed
    const transCompletedPayload = JSON.stringify({
        event_type: 'transaction.completed',
        event_id: 'evt_trans_comp_123',
        data: {
            id: 'tra_test_123',
            subscription_id: 'sub_test_123',
            currency_code: 'USD',
            details: { totals: { total: '900' } }, // $9.00
            created_at: new Date().toISOString(),
            custom_data: { user_id: TEST_USER_ID }
        }
    });
    console.log('\nSending transaction.completed...');
    const res2 = await sendWebhook(transCompletedPayload, createPaddleSignature(transCompletedPayload));
    console.log('Result:', res2.status, res2.data);

    // 3. Test subscription.canceled
    const subCanceledPayload = JSON.stringify({
        event_type: 'subscription.canceled',
        event_id: 'evt_sub_canceled_123',
        data: {
            id: 'sub_test_123'
        }
    });
    console.log('\nSending subscription.canceled...');
    const res3 = await sendWebhook(subCanceledPayload, createPaddleSignature(subCanceledPayload));
    console.log('Result:', res3.status, res3.data);
}

runTests().catch(console.error);
