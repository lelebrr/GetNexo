const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /active - List active campaigns (sending or paused)
router.get('/active', (req, res) => {
    try {
        const campaigns = db.prepare(`
            SELECT * FROM campaigns 
            WHERE status IN ('sending', 'paused') 
            ORDER BY created_at DESC
        `).all();
        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching active campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// POST /:id/pause - Pause a campaign
router.post('/:id/pause', (req, res) => {
    try {
        const { id } = req.params;
        const info = db.prepare("UPDATE campaigns SET status = 'paused', paused = 1 WHERE id = ?").run(id);
        if (info.changes === 0) return res.status(404).json({ error: 'Campaign not found' });
        res.json({ success: true, status: 'paused' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to pause campaign' });
    }
});

// POST /:id/resume - Resume a campaign
router.post('/:id/resume', (req, res) => {
    try {
        const { id } = req.params;
        const info = db.prepare("UPDATE campaigns SET status = 'sending', paused = 0 WHERE id = ?").run(id);
        if (info.changes === 0) return res.status(404).json({ error: 'Campaign not found' });
        res.json({ success: true, status: 'sending' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resume campaign' });
    }
});

// POST /:id/cancel - Cancel (archive) a campaign
router.post('/:id/cancel', (req, res) => {
    try {
        const { id } = req.params;
        const info = db.prepare("UPDATE campaigns SET status = 'cancelled', paused = 0 WHERE id = ?").run(id);
        if (info.changes === 0) return res.status(404).json({ error: 'Campaign not found' });
        res.json({ success: true, status: 'cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel campaign' });
    }
});

// GET /:id/stats - Get specific stats
router.get('/:id/stats', (req, res) => {
    try {
        const { id } = req.params;
        const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id);
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
