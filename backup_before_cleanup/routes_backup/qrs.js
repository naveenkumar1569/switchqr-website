const express = require('express');
const crypto = require('crypto');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');
const validateDestinationUrl = require('../middleware/validateUrl');

const router = express.Router();

// Generate random short code
const generateShortCode = async () => {
    // Simple 6-char random string
    return crypto.randomBytes(3).toString('hex');
};

// Create QR
router.post('/', authenticateToken, validateDestinationUrl, async (req, res) => {
    const { name, destination_url, campaign_id } = req.body;

    if (!destination_url) {
        return res.status(400).json({ error: 'Destination URL is required' });
    }

    try {
        let short_code = await generateShortCode();
        // Check uniqueness loop could be added here, but for now simple retry or rely on unique constraint

        const stmt = db.prepare('INSERT INTO qrs (user_id, campaign_id, name, destination_url, short_code) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(req.user.id, campaign_id || null, name || 'Untitled QR', destination_url, short_code);

        res.status(201).json({
            id: info.lastInsertRowid,
            short_code,
            destination_url,
            name: name || 'Untitled QR'
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            // Basic retry logic in real app
            return res.status(500).json({ error: 'Error generating unique code, please try again' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// List QRs
router.get('/', authenticateToken, (req, res) => {
    const stmt = db.prepare('SELECT * FROM qrs WHERE user_id = ? ORDER BY created_at DESC');
    const qrs = stmt.all(req.user.id);
    res.json(qrs);
});

// Get Single QR
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare(`
        SELECT qrs.*, campaigns.name as campaign_name 
        FROM qrs 
        LEFT JOIN campaigns ON qrs.campaign_id = campaigns.id 
        WHERE qrs.id = ? AND qrs.user_id = ?
    `);
    const qr = stmt.get(id, req.user.id);

    if (!qr) {
        return res.status(404).json({ error: 'QR not found' });
    }
    res.json(qr);
});

// Update QR
router.put('/:id', authenticateToken, validateDestinationUrl, (req, res) => {
    const { name, destination_url, status, campaign_id } = req.body;
    const { id } = req.params;

    const stmt = db.prepare(`
        UPDATE qrs 
        SET name = COALESCE(?, name), 
            destination_url = COALESCE(?, destination_url), 
            status = COALESCE(?, status),
            campaign_id = COALESCE(?, campaign_id)
        WHERE id = ? AND user_id = ?
    `);

    const info = stmt.run(name, destination_url, status, campaign_id, id, req.user.id);

    if (info.changes === 0) {
        return res.status(404).json({ error: 'QR not found or permission denied' });
    }

    res.json({ message: 'QR updated successfully' });
});

// Delete QR
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM qrs WHERE id = ? AND user_id = ?');
    const info = stmt.run(id, req.user.id);

    if (info.changes === 0) {
        return res.status(404).json({ error: 'QR not found or permission denied' });
    }

    res.json({ message: 'QR deleted successfully' });
});

module.exports = router;
