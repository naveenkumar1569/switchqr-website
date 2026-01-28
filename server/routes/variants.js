const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');
const validateDestinationUrl = require('../middleware/validateUrl');
const logger = require('../utils/logger');

const router = express.Router();

// Helper function to check Pro plan
const requireProPlan = (req, res, next) => {
    const userId = req.user.id;
    const userStmt = db.prepare('SELECT plan FROM users WHERE id = ?');
    const user = userStmt.get(userId);
    const plan = user?.plan || 'free';

    if (plan !== 'pro') {
        return res.status(403).json({
            error: 'A/B testing is only available on the Pro plan',
            upgrade_required: true,
            required_plan: 'pro'
        });
    }

    next();
};

// Get all variants for a QR
router.get('/:id/variants', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;

        // Verify ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Get variants with scan counts
        const variantsStmt = db.prepare(`
            SELECT 
                v.id,
                v.destination_url,
                v.weight,
                v.label,
                v.created_at,
                COUNT(s.id) as scan_count
            FROM qr_variants v
            LEFT JOIN scans s ON s.variant_id = v.id
            WHERE v.qr_id = ?
            GROUP BY v.id
            ORDER BY v.created_at ASC
        `);

        const variants = variantsStmt.all(qrId);

        // Calculate total scans and percentages
        const totalScans = variants.reduce((sum, v) => sum + v.scan_count, 0);
        variants.forEach(v => {
            v.percentage_of_traffic = totalScans > 0 ? ((v.scan_count / totalScans) * 100).toFixed(1) : 0;
        });

        res.json({
            ab_testing_enabled: qr.ab_testing_enabled === 1,
            variants,
            total_scans: totalScans
        });
    } catch (error) {
        console.error('Error fetching variants:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new variant (Pro only)
router.post('/:id/variants', authenticateToken, requireProPlan, validateDestinationUrl, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const { destination_url, weight = 50, label } = req.body;

        if (!destination_url) {
            return res.status(400).json({ error: 'Destination URL is required' });
        }

        if (weight < 0 || weight > 100) {
            return res.status(400).json({ error: 'Weight must be between 0 and 100' });
        }

        // Verify ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Check total weight sum with new variant
        const existingWeightStmt = db.prepare('SELECT SUM(weight) as total FROM qr_variants WHERE qr_id = ?');
        const { total: existingTotal } = existingWeightStmt.get(qrId) || { total: 0 };
        const newTotal = (existingTotal || 0) + weight;

        if (newTotal > 100) {
            return res.status(400).json({
                error: 'Total variant weights cannot exceed 100%',
                current_total: existingTotal || 0,
                requested_weight: weight,
                max_allowed: 100 - (existingTotal || 0)
            });
        }

        // Create variant
        const insertStmt = db.prepare(`
            INSERT INTO qr_variants (qr_id, destination_url, weight, label)
            VALUES (?, ?, ?, ?)
        `);

        const result = insertStmt.run(qrId, destination_url, weight, label || null);

        res.status(201).json({
            id: result.lastInsertRowid,
            qr_id: qrId,
            destination_url,
            weight,
            label,
            scan_count: 0,
            percentage_of_traffic: 0,
            created_at: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error creating variant', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

// Update variant (Pro only)
router.put('/:id/variants/:variantId', authenticateToken, requireProPlan, validateDestinationUrl, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const variantId = req.params.variantId;
        const { destination_url, weight, label } = req.body;

        // Verify QR ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Verify variant belongs to this QR
        const variantStmt = db.prepare('SELECT * FROM qr_variants WHERE id = ? AND qr_id = ?');
        const variant = variantStmt.get(variantId, qrId);

        if (!variant) {
            return res.status(404).json({ error: 'Variant not found' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (destination_url !== undefined) {
            updates.push('destination_url = ?');
            values.push(destination_url);
        }

        if (weight !== undefined) {
            if (weight < 0 || weight > 100) {
                return res.status(400).json({ error: 'Weight must be between 0 and 100' });
            }
            updates.push('weight = ?');
            values.push(weight);
        }

        if (label !== undefined) {
            updates.push('label = ?');
            values.push(label);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(variantId);

        const updateStmt = db.prepare(`
            UPDATE qr_variants 
            SET ${updates.join(', ')}
            WHERE id = ?
        `);

        updateStmt.run(...values);

        // Return updated variant
        const updatedVariant = variantStmt.get(variantId, qrId);
        res.json(updatedVariant);
    } catch (error) {
        console.error('Error updating variant:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete variant (Pro only)
router.delete('/:id/variants/:variantId', authenticateToken, requireProPlan, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const variantId = req.params.variantId;

        // Verify QR ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Check if variant exists
        const variantStmt = db.prepare('SELECT * FROM qr_variants WHERE id = ? AND qr_id = ?');
        const variant = variantStmt.get(variantId, qrId);

        if (!variant) {
            return res.status(404).json({ error: 'Variant not found' });
        }

        // Delete variant
        const deleteStmt = db.prepare('DELETE FROM qr_variants WHERE id = ?');
        deleteStmt.run(variantId);

        res.json({
            deleted: true,
            message: 'Variant deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting variant:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle A/B testing (Pro only)
router.post('/:id/ab-testing/toggle', authenticateToken, requireProPlan, (req, res) => {
    try {
        const userId = req.user.id;
        const qrId = req.params.id;
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'enabled must be a boolean' });
        }

        // Verify ownership
        const qrStmt = db.prepare('SELECT * FROM qrs WHERE id = ? AND user_id = ?');
        const qr = qrStmt.get(qrId, userId);

        if (!qr) {
            return res.status(404).json({ error: 'QR code not found' });
        }

        // Check for variants
        const variantsStmt = db.prepare('SELECT COUNT(*) as count FROM qr_variants WHERE qr_id = ?');
        const { count } = variantsStmt.get(qrId);

        // With control group support, A/B testing works with any number of variants (even 0)
        // Control automatically gets remaining percentage
        if (enabled && count === 0) {
            logger.info('A/B testing enabled with 0 variants', { qr_id: qrId, note: '100% traffic to control' });
        }

        // Mutual exclusivity: disable scheduling when enabling A/B testing
        let schedulingDisabled = false;
        if (enabled && qr.scheduling_enabled) {
            const disableSchedulingStmt = db.prepare('UPDATE qrs SET scheduling_enabled = 0 WHERE id = ?');
            disableSchedulingStmt.run(qrId);
            schedulingDisabled = true;
        }

        // Update QR
        const updateStmt = db.prepare('UPDATE qrs SET ab_testing_enabled = ? WHERE id = ?');
        updateStmt.run(enabled ? 1 : 0, qrId);

        res.json({
            ab_testing_enabled: enabled,
            scheduling_disabled: schedulingDisabled,
            message: enabled ? 'A/B testing enabled' : 'A/B testing disabled'
        });
    } catch (error) {
        logger.error('Error toggling A/B testing', { error: error.message });
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
