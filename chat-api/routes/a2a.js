const express = require('express');
const router = express.Router();

const db = require('../db');
const crypto = require('crypto');

// Helper to get config
const getConfig = (key) => {
    try {
        const row = db.prepare('SELECT value FROM a2a_config WHERE key = ?').get(key);
        return row ? row.value : null;
    } catch (e) {
        return null;
    }
};

// Helper to set config
const setConfig = (key, value) => {
    db.prepare('INSERT OR REPLACE INTO a2a_config (key, value) VALUES (?, ?)').run(key, value);
};

// GET /manifest - Public Discovery Endpoint
// This endpoint follows the A2A protocol for agent discovery
router.get('/manifest', (req, res) => {
    try {
        const name = getConfig('agent_name') || 'GetNexo Agent';
        const description = getConfig('agent_description') || 'A GetNexo automated sales agent.';
        const capabilitiesStr = getConfig('agent_capabilities');
        const capabilities = capabilitiesStr ? JSON.parse(capabilitiesStr) : ['chat', 'commerce'];
        const agentId = getConfig('agent_id') || 'unknown';

        // Construct Manifest
        const manifest = {
            id: agentId,
            name,
            description,
            capabilities,
            endpoints: {
                webhook: `${process.env.API_URL || 'http://localhost:3006'}/api/a2a/webhook`
            },
            version: "1.0.0"
        };
        res.json(manifest);
    } catch (error) {
        console.error('A2A Manifest Error:', error);
        res.status(500).json({ error: 'Failed to generate manifest' });
    }
});

// GET /config - Admin: Get Config
router.get('/config', (req, res) => {
    try {
        const config = db.prepare('SELECT key, value FROM a2a_config').all();
        const configMap = {};
        config.forEach(c => configMap[c.key] = c.value);
        res.json(configMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /config - Admin: Update Config
router.post('/config', (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ error: 'Key is required' });

        setConfig(key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /peers - Admin: List Peers
router.get('/peers', (req, res) => {
    try {
        const peers = db.prepare('SELECT * FROM a2a_peers ORDER BY created_at DESC').all();
        res.json(peers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /peers - Admin: Add Peer
router.post('/peers', (req, res) => {
    try {
        const { name, endpoint, capabilities } = req.body;

        if (!name || !endpoint) {
            return res.status(400).json({ error: 'Name and Endpoint are required' });
        }

        const id = crypto.randomUUID();
        db.prepare('INSERT INTO a2a_peers (id, name, endpoint, capabilities, trusted) VALUES (?, ?, ?, ?, ?)')
          .run(id, name, endpoint, JSON.stringify(capabilities || []), 1);

        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /peers/:id - Admin: Remove Peer
router.delete('/peers/:id', (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM a2a_peers WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /webhook - Handle incoming A2A messages
router.post('/webhook', (req, res) => {
    try {
        // In a real implementation, this would verify signatures (VDC) and process the message
        // A2A uses JSON-RPC like messages or specific envelopes.
        // We log it and return success for now.
        console.log('Received A2A Message:', JSON.stringify(req.body, null, 2));

        // Basic echo/ack
        res.json({
            status: 'received',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;