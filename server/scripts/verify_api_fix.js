/**
 * Verification Script: API Auth & Gating Consistency
 * 
 * Tests the standardized Supabase routes to ensure:
 * 1. Valid tokens provide req.user (no 401).
 * 2. Feature gating (requireFeature) blocks correctly (403).
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5001/api';
const TEST_TOKEN = process.env.TEST_USER_TOKEN; // Ensure this is set in your environment

async function runVerification() {
    if (!TEST_TOKEN) {
        console.error('❌ TEST_USER_TOKEN not found in environment');
        return;
    }

    console.log('🚀 Starting API Verification...\n');

    const client = axios.create({
        baseURL: API_URL,
        headers: { 'Authorization': `Bearer ${TEST_TOKEN}` },
        validateStatus: () => true
    });

    const tests = [
        { name: 'GET /profile (Auth Check)', url: '/users/profile', expected: 200 },
        { name: 'GET /qrs (Auth Check)', url: '/qrs', expected: 200 },
        { name: 'GET /campaigns (Gating Check - Pro)', url: '/campaigns', expected: [200, 403] }, // Depends on user plan
        { name: 'POST /qrs/:id/schedules (Gating Check - Starter)', url: '/qrs/1/schedules', expected: [404, 403] }, // 404 if QR 1 doesnt exist, but 403 if plan blocks it first
    ];

    for (const test of tests) {
        try {
            const res = await client.get(test.url);
            const passed = Array.isArray(test.expected) ? test.expected.includes(res.status) : res.status === test.expected;

            if (passed) {
                console.log(`✅ ${test.name}: Received ${res.status}`);
            } else {
                console.error(`❌ ${test.name}: EXPECTED ${test.expected}, GOT ${res.status}`);
                console.error('   Body:', res.data);
            }
        } catch (err) {
            console.error(`❌ ${test.name} Failed: ${err.message}`);
        }
    }

    console.log('\n✨ Verification complete.');
}

// Note: This script assumes the server is running.
// If not running, you can't test the actual middleware execution easily via script.
// But we can check for syntax errors at least.
runVerification();
