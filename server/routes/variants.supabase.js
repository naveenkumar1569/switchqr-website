/**
 * Variants Routes - Supabase Version
 * 
 * Handles A/B testing variants for QRs.
 */

const express = require('express');
const { getAuthenticatedClient } = require('../utils/supabase');
const logger = require('../utils/logger');

const router = express.Router();

const supabaseAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    req.supabase = getAuthenticatedClient(token);
    next();
};

// GET /api/qrs/:id/variants
router.get('/:id/variants', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

        // Verify ownership
        const { data: qr, error: qrError } = await req.supabase
            .from('qrs')
            .select('id, ab_testing_enabled')
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
        const { data: scanCounts } = await req.supabase
            .from('scans')
            .select('variant_id')
            .eq('qr_id', id)
            .not('variant_id', 'is', null);

        const countsMap = (scanCounts || []).reduce((acc, s) => {
            acc[s.variant_id] = (acc[s.variant_id] || 0) + 1;
            return acc;
        }, {});

        const mappedVariants = (variants || []).map(v => ({
            ...v,
            is_active: v.is_enabled,
            label: v.name,
            scan_count: countsMap[v.id] || 0
        }));

        res.json({
            variants: mappedVariants,
            ab_testing_enabled: qr.ab_testing_enabled
        });
    } catch (e) {
        logger.error('Error fetching variants', e);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/qrs/:id/variants
router.post('/:id/variants', supabaseAuth, async (req, res) => {
    const { id } = req.params;
    const { name, destination_url, weight } = req.body;

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

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

// DELETE /api/qrs/:id/variants/:variantId
router.delete('/:id/variants/:variantId', supabaseAuth, async (req, res) => {
    const { id, variantId } = req.params;

    try {
        const { data: { user }, error: authError } = await req.supabase.auth.getUser();
        if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

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

        console.log(`🗑️ [DELETE] Variant Supabase Response: Status=${status}, DeletedCount=${count}`);

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
