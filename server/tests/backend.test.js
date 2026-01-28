/**
 * Backend Correctness Test Suite
 * Run with: node tests/backend.test.js
 */

const assert = require('assert');

// Mock database for testing
const mockDb = {
    qrs: [],
    variants: [],
    schedules: [],
    scans: []
};

// ============================================
// ROUTING SELECTION TESTS
// ============================================

console.log('\n=== Routing Selection Tests ===\n');

// Test 1: Basic redirect (no schedule, no A/B)
function testBasicRedirect() {
    const qr = {
        id: 1,
        destination_url: 'https://example.com',
        scheduling_enabled: false,
        ab_testing_enabled: false
    };

    const result = determineDestination(qr, [], []);
    assert.strictEqual(result.url, 'https://example.com');
    assert.strictEqual(result.mode, 'basic');
    console.log('✓ Basic redirect returns destination_url');
}

// Test 2: Scheduled redirect active
function testScheduledRedirectActive() {
    const qr = {
        id: 1,
        destination_url: 'https://fallback.com',
        scheduling_enabled: true,
        ab_testing_enabled: false
    };

    const now = new Date();
    const schedules = [{
        id: 1,
        destination_url: 'https://scheduled.com',
        start_time: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        end_time: new Date(now.getTime() + 3600000).toISOString(),   // 1 hour from now
        recurrence_type: 'once'
    }];

    const result = determineDestination(qr, schedules, []);
    assert.strictEqual(result.url, 'https://scheduled.com');
    assert.strictEqual(result.mode, 'scheduled');
    assert.strictEqual(result.scheduleRuleId, 1);
    console.log('✓ Active schedule overrides default destination');
}

// Test 3: Scheduled redirect inactive (fallback)
function testScheduledRedirectInactive() {
    const qr = {
        id: 1,
        destination_url: 'https://fallback.com',
        scheduling_enabled: true,
        ab_testing_enabled: false
    };

    const now = new Date();
    const schedules = [{
        id: 1,
        destination_url: 'https://scheduled.com',
        start_time: new Date(now.getTime() + 3600000).toISOString(),  // 1 hour from now
        end_time: new Date(now.getTime() + 7200000).toISOString(),    // 2 hours from now
        recurrence_type: 'once'
    }];

    const result = determineDestination(qr, schedules, []);
    assert.strictEqual(result.url, 'https://fallback.com');
    assert.strictEqual(result.mode, 'basic');
    console.log('✓ Inactive schedule falls back to default destination');
}

// Test 4: A/B testing with variants
function testABTestingWithVariants() {
    const qr = {
        id: 1,
        destination_url: 'https://control.com',
        scheduling_enabled: false,
        ab_testing_enabled: true
    };

    const variants = [
        { id: 1, destination_url: 'https://variant-a.com', weight: 50 },
        { id: 2, destination_url: 'https://variant-b.com', weight: 50 }
    ];

    // Run multiple times to verify distribution
    const results = { control: 0, variantA: 0, variantB: 0 };
    for (let i = 0; i < 1000; i++) {
        const result = determineDestination(qr, [], variants);
        if (result.url === 'https://control.com') results.control++;
        else if (result.url === 'https://variant-a.com') results.variantA++;
        else if (result.url === 'https://variant-b.com') results.variantB++;
    }

    // With 50/50 split and no control weight, should see roughly even distribution
    assert.strictEqual(results.control, 0); // No weight left for control
    assert.ok(results.variantA > 400 && results.variantA < 600, `Variant A: ${results.variantA}`);
    assert.ok(results.variantB > 400 && results.variantB < 600, `Variant B: ${results.variantB}`);
    console.log('✓ A/B testing distributes traffic by weights');
}

// Test 5: Mutual exclusivity (scheduling enabled blocks A/B)
function testMutualExclusivity() {
    const qr = {
        id: 1,
        destination_url: 'https://default.com',
        scheduling_enabled: true,
        ab_testing_enabled: true // Should be blocked by design
    };

    const schedules = [{
        id: 1,
        destination_url: 'https://scheduled.com',
        start_time: new Date(Date.now() - 3600000).toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        recurrence_type: 'once'
    }];

    const variants = [
        { id: 1, destination_url: 'https://variant.com', weight: 100 }
    ];

    // When both are enabled, scheduling takes priority
    const result = determineDestination(qr, schedules, variants);
    assert.strictEqual(result.mode, 'scheduled');
    assert.strictEqual(result.url, 'https://scheduled.com');
    console.log('✓ Scheduling takes priority over A/B when both enabled');
}

// ============================================
// URL VALIDATION TESTS
// ============================================

console.log('\n=== URL Validation Tests ===\n');

function testUrlValidation() {
    assert.strictEqual(isValidRedirectUrl('https://example.com'), true);
    assert.strictEqual(isValidRedirectUrl('http://example.com'), true);
    assert.strictEqual(isValidRedirectUrl('ftp://example.com'), false);
    assert.strictEqual(isValidRedirectUrl('javascript:alert(1)'), false);
    assert.strictEqual(isValidRedirectUrl(''), false);
    assert.strictEqual(isValidRedirectUrl(null), false);
    console.log('✓ URL validation blocks non-http/https schemes');
}

// ============================================
// WEIGHT SUM VALIDATION TESTS
// ============================================

console.log('\n=== Weight Sum Validation Tests ===\n');

function testWeightSumValidation() {
    // Should allow weights that sum to <= 100
    assert.strictEqual(validateWeightSum([{ weight: 50 }, { weight: 30 }], 20), true);
    assert.strictEqual(validateWeightSum([{ weight: 50 }, { weight: 50 }], 0), true);

    // Should reject weights that exceed 100
    assert.strictEqual(validateWeightSum([{ weight: 50 }, { weight: 40 }], 20), false);
    assert.strictEqual(validateWeightSum([{ weight: 100 }], 1), false);

    console.log('✓ Weight sum validation prevents exceeding 100%');
}

// ============================================
// SCHEDULE OVERLAP TESTS
// ============================================

console.log('\n=== Schedule Overlap Tests ===\n');

function testScheduleOverlapDetection() {
    const existing = [
        {
            id: 1,
            start_time: '2026-01-28T10:00:00Z',
            end_time: '2026-01-28T12:00:00Z'
        }
    ];

    // Should reject overlapping schedule
    const overlapping = {
        start_time: '2026-01-28T11:00:00Z',
        end_time: '2026-01-28T13:00:00Z'
    };
    assert.strictEqual(detectOverlap(existing, overlapping), true);

    // Should allow non-overlapping schedule
    const nonOverlapping = {
        start_time: '2026-01-28T13:00:00Z',
        end_time: '2026-01-28T15:00:00Z'
    };
    assert.strictEqual(detectOverlap(existing, nonOverlapping), false);

    console.log('✓ Schedule overlap detection works correctly');
}

// ============================================
// HELPER FUNCTIONS (Extracted from redirect.js)
// ============================================

function isValidRedirectUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function selectVariant(variants) {
    if (!variants || variants.length === 0) return null;
    if (variants.length === 1) return variants[0];

    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    const random = Math.random() * totalWeight;

    let cumulative = 0;
    for (const variant of variants) {
        cumulative += variant.weight;
        if (random <= cumulative) {
            return variant;
        }
    }
    return variants[0];
}

function isScheduleActive(schedule, now = new Date()) {
    if (!schedule.recurrence_type || schedule.recurrence_type === 'once') {
        const start = new Date(schedule.start_time);
        const end = schedule.end_time ? new Date(schedule.end_time) : null;
        return now >= start && (!end || now <= end);
    }
    return false; // Simplified for tests
}

function determineDestination(qr, schedules, variants) {
    let url = qr.destination_url;
    let mode = 'basic';
    let variantId = null;
    let scheduleRuleId = null;

    if (qr.scheduling_enabled && schedules.length > 0) {
        const now = new Date();
        const active = schedules.find(s => isScheduleActive(s, now));
        if (active) {
            url = active.destination_url;
            mode = 'scheduled';
            scheduleRuleId = active.id;
        }
    } else if (qr.ab_testing_enabled && variants.length > 0) {
        const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
        const controlWeight = Math.max(0, 100 - totalWeight);

        const control = { id: null, destination_url: qr.destination_url, weight: controlWeight };
        const allOptions = controlWeight > 0 ? [control, ...variants] : variants;

        const selected = selectVariant(allOptions);
        if (selected) {
            url = selected.destination_url;
            variantId = selected.id;
            mode = 'ab';
        }
    }

    return { url, mode, variantId, scheduleRuleId };
}

function validateWeightSum(existing, newWeight) {
    const total = existing.reduce((sum, v) => sum + v.weight, 0) + newWeight;
    return total <= 100;
}

function detectOverlap(existing, newSchedule) {
    const newStart = new Date(newSchedule.start_time);
    const newEnd = newSchedule.end_time ? new Date(newSchedule.end_time) : new Date('9999-12-31');

    for (const rule of existing) {
        const ruleStart = new Date(rule.start_time);
        const ruleEnd = rule.end_time ? new Date(rule.end_time) : new Date('9999-12-31');

        if (newStart < ruleEnd && ruleStart < newEnd) {
            return true;
        }
    }
    return false;
}

// ============================================
// RUN ALL TESTS
// ============================================

try {
    testBasicRedirect();
    testScheduledRedirectActive();
    testScheduledRedirectInactive();
    testABTestingWithVariants();
    testMutualExclusivity();
    testUrlValidation();
    testWeightSumValidation();
    testScheduleOverlapDetection();

    console.log('\n=== All Tests Passed! ===\n');
    process.exit(0);
} catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
}
