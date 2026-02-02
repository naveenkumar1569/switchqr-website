/**
 * SwitchQR Smoke Test Script
 * 
 * Run this after deployment to verify core functionality.
 * Usage: node smoke_tests.js
 * 
 * Requires: Node.js 18+, SUPABASE_URL, SUPABASE_ANON_KEY env vars
 */

const API_BASE = process.env.API_BASE_URL || 'https://switchqr-backend.onrender.com';
const APP_URL = process.env.APP_URL || 'https://app.switch-qr.com';

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    tests.push({ name, fn });
}

async function runTests() {
    console.log('\n🧪 SwitchQR Smoke Tests\n');
    console.log('═'.repeat(50));

    for (const t of tests) {
        try {
            await t.fn();
            console.log(`✅ ${t.name}`);
            passed++;
        } catch (e) {
            console.log(`❌ ${t.name}`);
            console.log(`   Error: ${e.message}`);
            failed++;
        }
    }

    console.log('═'.repeat(50));
    console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
    process.exit(failed > 0 ? 1 : 0);
}

// ============================================
// TESTS
// ============================================

test('Backend health check returns OK', async () => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Health status: ${data.status}`);
});

test('Backend root endpoint reachable', async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const text = await res.text();
    if (!text.includes('SwitchQR')) throw new Error('Unexpected response');
});

test('Redirect endpoint returns 404 for unknown code', async () => {
    const res = await fetch(`${API_BASE}/r/nonexistent_code_12345`, { redirect: 'manual' });
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
});

test('SPA routing - /login returns HTML (not 404)', async () => {
    const res = await fetch(`${APP_URL}/login`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const text = await res.text();
    if (!text.includes('<!DOCTYPE html>') && !text.includes('<!doctype html>')) {
        throw new Error('Expected HTML response');
    }
});

test('SPA routing - /dashboard returns HTML (not 404)', async () => {
    const res = await fetch(`${APP_URL}/dashboard`);
    // May redirect to login, but should not 404
    if (res.status === 404) throw new Error('Got 404');
});

test('API returns 401 for unauthenticated plan request', async () => {
    const res = await fetch(`${API_BASE}/api/plan`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

test('API returns 401 for unauthenticated QR list', async () => {
    const res = await fetch(`${API_BASE}/api/qrs`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

test('QR image URL construction uses redirect pattern', async () => {
    // Test that the pattern we expect works
    const shortCode = 'test123';
    const expectedRedirectUrl = `${API_BASE}/r/${shortCode}`;
    const encodedData = encodeURIComponent(expectedRedirectUrl);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;

    // Verify the external QR API responds
    const res = await fetch(qrApiUrl);
    if (!res.ok) throw new Error(`QR API status: ${res.status}`);
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('image')) throw new Error(`Expected image, got ${contentType}`);
});

// Run all tests
runTests();
