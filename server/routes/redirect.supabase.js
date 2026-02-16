/**
 * Redirect Service - Supabase Version
 * 
 * Handles public redirect endpoints using Supabase for data lookup.
 * Implements Advanced Routing: Schedules -> A/B Testing -> Basic Fallback.
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const requestIp = require('request-ip');
const ua = require('useragent');
const geoip = require('geoip-lite');
const logger = require('../utils/logger');
const { resolveUserPlan, PLAN_CONFIG } = require('../utils/planManager');

const router = express.Router();

// Initialize Supabase Client (Admin Client for Bypass RLS)
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error('CRITICAL: Missing SUPABASE_SERVICE_ROLE_KEY. Redirects will fail if RLS is enabled.');
}

// Use Service Key if available, otherwise fall back to Anon (Unsafe for production with RLS)
let supabaseAdmin;
try {
    if (process.env.SUPABASE_URL) {
        supabaseAdmin = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
            { auth: { persistSession: false } }
        );
    } else {
        logger.warn('Redirect Service: SUPABASE_URL missing. Redirects will fail.');
    }
} catch (e) {
    logger.error('CRITICAL: Failed to init Supabase Admin client', e);
}

router.get('/r/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    if (!supabaseAdmin) {
        return res.status(503).send('Redirect service unavailable');
    }

    try {
        // 1. Lookup QR
        // We select all fields to check feature flags
        const { data: qr, error } = await supabaseAdmin
            .from('qrs')
            .select('*')
            .eq('short_code', shortCode)
            .single();

        if (error || !qr) {
            logger.warn(`QR not found: ${shortCode}`);
            return res.status(404).send('QR Code not found');
        }

        if (qr.status !== 'active') {
            return res.status(410).send('This QR Code is inactive');
        }

        // --- PLAN RESOLUTION & SCAN LIMIT ENFORCEMENT ---
        let ownerPlan = null;
        try {
            // 1. Resolve owner's plan (used for both limits and feature access)
            ownerPlan = await resolveUserPlan(qr.owner_id);
            const scanLimit = PLAN_CONFIG.scanLimits[ownerPlan.effectivePlan];

            // 2. If plan has a limit, check total usage
            if (scanLimit !== null) {
                // Get all QR IDs for this user
                const { data: userQrs } = await supabaseAdmin
                    .from('qrs')
                    .select('id')
                    .eq('owner_id', qr.owner_id);

                if (userQrs && userQrs.length > 0) {
                    const qrIds = userQrs.map(q => q.id);
                    // Count total scans across all user's QRs
                    const { count, error: countError } = await supabaseAdmin
                        .from('scans')
                        .select('*', { count: 'exact', head: true })
                        .in('qr_id', qrIds);

                    if (!countError && count >= scanLimit) {
                        logger.warn(`Scan limit reached for user ${qr.owner_id} (${count}/${scanLimit})`);
                        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
                        const host = req.get('host');
                        return res.redirect(`${protocol}://${host}/scan-limit-reached`);
                    }
                }
            }
        } catch (planError) {
            logger.error('Plan resolution failed (falling back to free plan defaults)', planError);
            // Fallback to free plan if resolution fails
            ownerPlan = { effectivePlan: 'free', features: PLAN_CONFIG.features.free };
        }
        // --- END PLAN RESOLUTION & SCAN LIMIT ENFORCEMENT ---

        // Initialize Routing Variables
        let destination_url = qr.destination_url;
        let routing_mode = 'basic';
        let variant_id = null;
        let schedule_rule_id = null;
        const now = new Date();


        // 2. Evaluate Schedules (Priority 1) - Only if plan supports it
        if (qr.scheduling_enabled && ownerPlan?.features?.scheduling) {
            // Fetch active schedules
            const { data: schedules } = await supabaseAdmin
                .from('schedules')
                .select('*')
                .eq('qr_id', qr.id)
                .eq('active', true);

            if (schedules && schedules.length > 0) {
                // Filter matching schedules
                const matchingSchedule = schedules.find(schedule => {
                    // Check Time Window (UTC)
                    const startTime = new Date(schedule.start_time);
                    if (startTime > now) {
                        return false;
                    }

                    if (schedule.end_time) {
                        const endTime = new Date(schedule.end_time);
                        if (endTime < now) {
                            return false;
                        }
                    }

                    // Check Days (Timezone aware)
                    if (schedule.days && schedule.days.length > 0) {
                        try {
                            const targetTz = schedule.timezone || 'UTC';
                            const formatter = new Intl.DateTimeFormat('en-US', {
                                timeZone: targetTz,
                                weekday: 'short'
                            });
                            const dayName = formatter.format(now);
                            const map = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
                            const currentDayIndex = map[dayName];

                            if (!schedule.days.includes(currentDayIndex)) {
                                return false;
                            }
                        } catch (err) {
                            logger.error('Timezone calculation error', err);
                            return false;
                        }
                    }

                    return true;
                });

                if (matchingSchedule) {
                    destination_url = matchingSchedule.destination_url;
                    routing_mode = 'scheduled';
                    schedule_rule_id = matchingSchedule.id;
                }
            } else {
            }
        }

        // 3. Evaluate A/B Variants (Priority 2, only if not scheduled) - Only if plan supports it
        if (routing_mode === 'basic' && qr.ab_testing_enabled && ownerPlan?.features?.ab_testing) {
            const { data: variants, error: vErr } = await supabaseAdmin
                .from('variants')
                .select('*')
                .eq('qr_id', qr.id)
                .eq('is_enabled', true);

            if (vErr) {
                console.error(`🧪 [REDIRECT] Variants query error:`, vErr);
            }

            if (variants && variants.length > 0) {
                const realTotal = variants.reduce((sum, v) => sum + (v.weight || 0), 0);

                if (realTotal > 0) {
                    let cursor = 0;
                    const pickedRandom = Math.random() * 100;

                    for (const v of variants) {
                        cursor += v.weight;
                        if (pickedRandom <= cursor) {
                            destination_url = v.destination_url;
                            variant_id = v.id;
                            routing_mode = 'ab';
                            break;
                        }
                    }
                    if (routing_mode === 'basic') {
                        routing_mode = 'ab';
                        variant_id = null; // Explicitly null for Control
                    }
                }
            } else {
            }
        }


        // 4. Log Scan (Async)
        // Never block response on logging
        logScan(supabaseAdmin, qr.id, req, {
            destination_url,
            routing_mode,
            variant_id,
            schedule_rule_id
        }).catch(err => {
            logger.error(`❌ [REDIRECT] Scan logging failed for code ${shortCode}:`, {
                error: err.message,
                details: err.details,
                code: err.code
            });
        });

        // 6. Increment Total Scans in Usage Stats (Async)
        supabaseAdmin.rpc('increment_total_scans', {
            user_id_param: qr.owner_id,
            qr_id_param: qr.id,
            inc_param: 1
        })
            .then(({ error }) => {
                if (error) console.error(`[USAGE] Failed to increment scan count for user ${qr.owner_id}`, error);
            });

        // 7. Redirect with Hardened Fallback
        // Force text/html to prevent "download" behavior in some browsers/proxies
        res.setHeader('Content-Type', 'text/html');
        res.status(302);
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="refresh" content="0;url=${destination_url}">
                <title>Redirecting...</title>
                <script>window.location.href = "${destination_url}";</script>
            </head>
            <body>
                <p>Redirecting you to <a href="${destination_url}">${destination_url}</a>...</p>
            </body>
            </html>
        `);

    } catch (e) {
        logger.error('Redirect error', e);
        res.status(500).send('Server Error');
    }
});

/**
 * Helper to insert scan record
 */
async function logScan(client, qrId, req, attribution) {
    const ip = requestIp.getClientIp(req);
    const agent = ua.parse(req.headers['user-agent']);
    const geo = geoip.lookup(ip);

    const scanData = {
        qr_id: qrId,
        ip_address: ip,
        user_agent: agent.toString(),
        device_type: (agent.device.toString() === 'Other 0.0.0' ? 'Desktop' : agent.device.toString()) || 'Desktop',
        os: agent.os.toString(),
        browser: agent.toAgent(),
        city: geo ? geo.city : null,
        country: geo ? geo.country : null,
        scanned_at: new Date().toISOString(),
        referrer: req.get('Referrer') || null,

        // Attribution
        destination_url: attribution.destination_url,
        routing_mode: attribution.routing_mode,
        variant_id: attribution.variant_id || null,
        schedule_rule_id: attribution.schedule_rule_id || null
    };

    const { error } = await client.from('scans').insert(scanData);
    if (error) {
        // Just throw to satisfy catch block in caller
        throw error;
    }
}

module.exports = router;
