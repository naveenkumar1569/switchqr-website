const express = require('express');
const { db } = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const stmt = db.prepare('SELECT id, email, first_name, last_name, job_title, bio FROM users WHERE id = ?');
        const user = stmt.get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
    const { first_name, last_name, email, job_title, bio } = req.body;

    try {
        const stmt = db.prepare(`
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?, job_title = ?, bio = ?
            WHERE id = ?
        `);

        stmt.run(first_name, last_name, email, job_title, bio, req.user.id);

        res.json({
            message: 'Profile updated successfully',
            user: { first_name, last_name, email, job_title, bio }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
