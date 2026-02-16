/**
 * Variants Routes - Supabase Version
 * 
 * Handles A/B testing variants for QRs.
 */

const express = require('express');
const supabaseAuth = require('../middleware/supabaseAuth');
const logger = require('../utils/logger');
const { requireFeature } = require('../middleware/planEnforcement');

const router = express.Router();

// GET /api/qrs/:id/variants
router.get('/:id/variants', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id, ab_testing_enabled, destination_url, ab_control_weight')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        // Fetch variants
        const { data: variants, error } = await req.supabase
            .from('variants')
            .select('*')
            .eq('qr_id', id);

        if (error) throw error;

        // Fetch scan counts per variant
        // Fetch all scans for this QR to count both variants and the control (null variant_id)
        const { data: scanCounts } = await req.supabase
            .from('scans')
            .select('variant_id')
            .eq('qr_id', id);

        const countsMap = { _control: 0 };
        (scanCounts || []).forEach(s => {
            if (s.variant_id) {
                countsMap[s.variant_id] = (countsMap[s.variant_id] || 0) + 1;
            } else {
                countsMap._control++;
            }
        });

        const mappedVariants = (variants || []).map(v => ({
            ...v,
            is_active: v.is_enabled,
            label: v.name,
            scan_count: countsMap[v.id] || 0
        }));

        res.json({
            variants: mappedVariants,
            control_scan_count: countsMap._control,
            ab_testing_enabled: qr.ab_testing_enabled,
            destination_url: qr.destination_url,
            ab_control_weight: qr.ab_control_weight || 0
        });
    } catch (e) {
        logger.error('Error fetching variants', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/qrs/:id/variants
router.post('/:id/variants', supabaseAuth, requireFeature('ab_testing'), async (req, res) => {
    const { id } = req.params;
    const { name, destination_url, weight } = req.body;
    const user = req.user;

    try {
        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        const { data: variant, error } = await req.supabase
            .from('variants')
            .insert({
                qr_id: id,
                name,
                destination_url,
                weight: weight || 50,
                is_enabled: true
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(variant);
    } catch (e) {
        logger.error('Error creating variant', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/qrs/:id/variants/:variantId
router.put('/:id/variants/:variantId', supabaseAuth, requireFeature('ab_testing'), async (req, res) => {
    const { id, variantId } = req.params;
    const { name, destination_url, weight, is_enabled } = req.body;
    const user = req.user;

    try {
        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (destination_url !== undefined) updates.destination_url = destination_url;
        if (weight !== undefined) updates.weight = weight;
        if (is_enabled !== undefined) updates.is_enabled = is_enabled;

        const { data: variant, error } = await req.supabase
            .from('variants')
            .update(updates)
            .eq('id', variantId)
            .eq('qr_id', id)
            .select()
            .single();

        if (error) {
            logger.error('Error updating variant', error);
            throw error;
        }

        res.json(variant);
    } catch (e) {
        logger.error('Error in variant update route', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/qrs/:id/variants (Bulk Update)
router.put('/:id/variants', supabaseAuth, requireFeature('ab_testing'), async (req, res) => {
    const { id } = req.params;
    const { variants, ab_control_weight } = req.body; // Expect array of variants and optional control weight
    const user = req.user;

    if (!Array.isArray(variants)) {
        return res.status(400).json({ error: 'Variants must be an array' });
    }

    try {
        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) return res.status(404).json({ error: 'QR not found' });

        // Perform updates. Supabase doesn't have a built-in "bulk update different rows with different values" 
        // in one simple call easily that returns everything nicely without UPSERT.
        // But we can use multiple updates in a loop or a sophisticated upsert if we have unique IDs.
        // For simplicity and safety (since variants are usually < 10), we'll do individual updates.

        const results = [];
        for (const v of variants) {
            const { data, error } = await req.supabase
                .from('variants')
                .update({
                    name: v.name,
                    destination_url: v.destination_url,
                    weight: v.weight,
                    is_enabled: v.is_enabled
                })
                .eq('id', v.id)
                .eq('qr_id', id)
                .select()
                .single();

            if (!error && data) results.push(data);
        }

        if (ab_control_weight !== undefined) {
            await req.supabase
                .from('qrs')
                .update({ ab_control_weight })
                .eq('id', id);
        }

        res.json({ variants: results, ab_control_weight });
    } catch (e) {
        logger.error('Error in bulk variant update', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/qrs/:id/variants/:variantId
router.delete('/:id/variants/:variantId', supabaseAuth, requireFeature('ab_testing'), async (req, res) => {
    const { id, variantId } = req.params;
    const user = req.user;

    try {
        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

        if (qrError || !qr) {
            console.error(`🗑️ [DELETE] QR Ownership check failed for variant:`, qrError);
            return res.status(404).json({ error: 'QR not found' });
        }

        const { error, count, status } = await req.supabase
            .from('variants')
            .delete({ count: 'exact' })
            .eq('id', Number(variantId))
            .eq('qr_id', Number(id));


        if (error) {
            console.error(`🗑️ [DELETE] Variant Supabase Error:`, error);
            throw error;
        }

        if (count === 0) {
            console.warn(`🗑️ [DELETE] No variant found with ID ${variantId} for QR ${id}`);
            return res.status(404).json({ error: 'Variant not found' });
        }

        res.json({ message: 'Variant deleted' });
    } catch (e) {
        logger.error('Error deleting variant', e);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
