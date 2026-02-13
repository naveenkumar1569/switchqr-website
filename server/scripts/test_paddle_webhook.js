const crypto = require('crypto');
const http = require('http');

const WEBHOOK_SECRET = 'pdl_ntf_01jn1v0w5f5g1p6c0f8w7z9z9z_placeholder';
const WEBHOOK_URL = 'http://localhost:5001/api/paddle/webhook';

function sendWebhook(payload, signature) {
    return new Promise((resolve, reject) => {
        const req = http.request(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Paddle-Signature': signature,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function testWebhook() {
    const payload = JSON.stringify({
        event_type: 'subscription.created',
        event_id: 'evt_01hx...',
        data: { id: 'sub_01hx...' }
    });

    const ts = Math.floor(Date.now() / 1000).toString();
    const message = `${ts}:${payload}`;
    const h = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(message)
        .digest('hex');

    const signature = `h1=${h};ts=${ts}`;

    console.log('--- Testing Valid Signature ---');
    try {
        const res = await sendWebhook(payload, signature);
        console.log('Response Status:', res.status);
        console.log('Response Data:', res.data);
    } catch (err) {
        console.error('Error:', err.message);
    }

    console.log('\n--- Testing Invalid Signature ---');
    try {
        const res = await sendWebhook(payload, `h1=wrong;ts=${ts}`);
        console.log('Response Status:', res.status);
        console.log('Response Data:', res.data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testWebhook();
