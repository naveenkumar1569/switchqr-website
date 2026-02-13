const http = require('http');
const crypto = require('crypto');

// Configuration
const HOST = 'localhost';
const PORT = 5001; // Ensure this matches your running server port
const PATH = '/api/paddle-webhook'; // Testing the alias
const SECRET = process.env.WEBHOOK_SECRET || 'test_secret'; // Ensure server uses this too or verify logic is mocked/bypassed if needed. 
// Actually, the server likely uses a real secret from env.
// For local testing, if I don't have the real secret, I might fail signature verification unless I mock it or use the real one.
// I'll try to pick up the secret from .env if possible, or just send a dummy signature and see if server accepts it (it won't).

// If running against local server, I need to know the secret the server is using.
// intricate: The server loads .env. I can load .env too.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
    console.warn('Warning: PADDLE_WEBHOOK_SECRET not found in .env. Signature verification might fail on server.');
}


// Event Data
const subscriptionCreatedEvent = {
    event_type: 'subscription.created',
    event_id: 'evt_test_sub_created_' + Date.now(),
    notification_id: 'notif_test_' + Date.now(),
    occurred_at: new Date().toISOString(),
    data: {
        id: 'sub_test_' + Date.now(),
        status: 'active',
        customer_id: 'ctm_01hv6y1jedq4p1n0yqn5ba3ky4', // REAL CUSTOMER ID
        address_id: 'add_test_123',
        business_id: null,
        currency_code: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
            {
                price: {
                    id: 'pri_01jh...', // Mock price ID
                    product_id: 'pro_test_123'
                },
                quantity: 1,
                recurring: true
            }
        ],
        custom_data: {
            user_id: '263cea49-2265-4c1c-b2cd-04c36e8b57eb' // REAL USER ID
        },
        current_billing_period: {
            starts_at: new Date().toISOString(),
            ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

const transactionCompletedEvent = {
    event_type: 'transaction.completed',
    event_id: 'evt_test_txn_' + Date.now(),
    notification_id: 'notif_txn_' + Date.now(),
    occurred_at: new Date().toISOString(),
    data: {
        id: 'txn_test_' + Date.now(),
        status: 'completed',
        customer_id: 'ctm_01hv6y1jedq4p1n0yqn5ba3ky4',
        subscription_id: subscriptionCreatedEvent.data.id,
        currency_code: 'USD',
        details: {
            totals: {
                total: '2900', // $29.00
                subtotal: '2900',
                tax: '0'
            }
        },
        custom_data: {
            user_id: '263cea49-2265-4c1c-b2cd-04c36e8b57eb'
        }
    }
}


function createSignature(body, secret) {
    const ts = Math.floor(Date.now() / 1000);
    const payload = ts + ":" + body;
    const h1 = crypto.createHmac('sha256', secret || 'test_secret').update(payload).digest('hex');
    return `ts=${ts};h1=${h1}`;
}

async function sendEvent(eventData) {
    const postData = JSON.stringify(eventData);
    const signature = createSignature(postData, WEBHOOK_SECRET);

    const options = {
        hostname: HOST,
        port: PORT,
        path: PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Paddle-Signature': signature
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Response Status: ${res.statusCode}`);
                console.log(`Response Body: ${data}`);
                resolve({ statusCode: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log('Sending subscription.created...');
    await sendEvent(subscriptionCreatedEvent);

    console.log('Sending transaction.completed...');
    await sendEvent(transactionCompletedEvent);
}

run();
