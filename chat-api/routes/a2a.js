/**
 * A2A Protocol Routes - Enterprise Implementation
 * 
 * Implements the full A2A (Agent-to-Agent) protocol:
 * - Agent Card discovery with JWS signing
 * - Message operations (sync and stream)
 * - Task management (async operations)
 * - Identity management with real RSA keys
 * - Peer discovery and verification
 * - Message history and conversations
 * - Callback receiver for async notifications
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// Import services
let a2aCrypto, a2aAI;
try {
    a2aCrypto = require('../services/a2a-crypto');
    a2aAI = require('../services/a2a-ai');
} catch (e) {
    console.warn('[A2A] Services not available:', e.message);
}

// ============================================================================
// HELPERS
// ============================================================================

const getConfig = (key) => {
    try {
        const row = db.prepare('SELECT value FROM a2a_config WHERE key = ?').get(key);
        return row ? row.value : null;
    } catch (e) { return null; }
};

const setConfig = (key, value) => {
    db.prepare('INSERT OR REPLACE INTO a2a_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
        .run(key, value);
};

const getDefaultIdentity = () => {
    try {
        return db.prepare('SELECT * FROM a2a_identities WHERE is_default = 1').get();
    } catch { return null; }
};

// ============================================================================
// MIDDLEWARE
// ============================================================================

const versionMiddleware = (req, res, next) => {
    const version = req.headers['a2a-version'] || '1.0';
    res.setHeader('A2A-Version', '1.0');
    req.a2aVersion = version;
    next();
};

router.use(versionMiddleware);

// ============================================================================
// DISCOVERY ENDPOINTS
// ============================================================================

/**
 * GET /agent-card.json - Public Agent Card Discovery
 * Standard: /.well-known/agent-card.json
 */
router.get('/agent-card.json', (req, res) => {
    try {
        const name = getConfig('agent_name') || 'GetNexo Agent';
        const description = getConfig('agent_description') || 'Advanced Sales & Support AI Agent';
        const agentId = getConfig('agent_id') || crypto.randomUUID();
        const baseUrl = process.env.API_URL || process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;

        // Build Agent Card
        const agentCard = {
            id: agentId,
            name: name,
            description: description,
            version: "1.0.0",
            protocol: "A2A",
            protocolVersion: "1.0",
            supportedInterfaces: [
                {
                    type: "REST",
                    url: `${baseUrl}/api/a2a/message:send`,
                    method: "POST",
                    preferred: true
                },
                {
                    type: "REST_STREAM",
                    url: `${baseUrl}/api/a2a/message:stream`,
                    method: "POST"
                },
                {
                    type: "TASK",
                    url: `${baseUrl}/api/a2a/tasks`,
                    method: "POST"
                }
            ],
            capabilities: JSON.parse(getConfig('agent_capabilities') || '["chat", "commerce", "support", "payments"]'),
            extensions: [
                "https://ap2-protocol.org/extension/v1"
            ],
            authentication: {
                type: "bearer",
                required: false
            },
            rateLimit: {
                requestsPerMinute: 60
            },
            contact: {
                email: "suporte@getnexo.com.br",
                url: "https://getnexo.com.br"
            },
            created_at: new Date().toISOString()
        };

        // Sign the Agent Card if identity exists
        const identity = getDefaultIdentity();
        if (identity && identity.private_key && a2aCrypto && !identity.private_key.includes('MOCK')) {
            try {
                const signed = a2aCrypto.signAgentCard(agentCard, identity.private_key, identity.id);
                return res.json({
                    ...agentCard,
                    signature: {
                        algorithm: 'RS256',
                        keyId: identity.id,
                        value: signed.signature
                    }
                });
            } catch (signError) {
                console.warn('[A2A] Failed to sign agent card:', signError.message);
            }
        }

        res.json(agentCard);
    } catch (error) {
        console.error('[A2A] Discovery Error:', error);
        res.status(500).json({ error: 'Failed to generate agent card' });
    }
});

// Aliases
router.get('/manifest', (req, res) => res.redirect('agent-card.json'));
router.get('/.well-known/agent-card.json', (req, res) => res.redirect('agent-card.json'));

// ============================================================================
// MESSAGE OPERATIONS
// ============================================================================

/**
 * POST /message:send - Synchronous message operation
 */
router.post('/message:send', async (req, res) => {
    try {
        const { message, context, senderId } = req.body;

        if (!message || !message.text) {
            return res.status(400).json({ error: 'Missing message.text' });
        }

        console.log(`[A2A] Message from ${senderId || 'anonymous'}: ${message.text.substring(0, 100)}`);

        let response;

        // Use AI service if available
        if (a2aAI) {
            response = await a2aAI.processMessage(message, senderId || 'anonymous', context || {});
        } else {
            // Fallback response
            response = {
                id: crypto.randomUUID(),
                text: `Mensagem recebida: "${message.text}". Serviço AI não configurado.`,
                timestamp: new Date().toISOString(),
                context: { handledBy: 'GetNexo-A2A-Fallback' }
            };
        }

        // Store message in history
        try {
            const conversationId = response.conversation_id || `conv_${Date.now()}`;

            // Store incoming message
            db.prepare(`
                INSERT INTO a2a_messages (id, conversation_id, sender_id, role, content, intent, created_at)
                VALUES (?, ?, ?, 'user', ?, ?, CURRENT_TIMESTAMP)
            `).run(crypto.randomUUID(), conversationId, senderId || 'anonymous', message.text, response.intent?.intent || null);

            // Store response
            db.prepare(`
                INSERT INTO a2a_messages (id, conversation_id, sender_id, role, content, created_at)
                VALUES (?, ?, 'system', 'assistant', ?, CURRENT_TIMESTAMP)
            `).run(response.id, conversationId, response.text);

        } catch (dbError) {
            console.warn('[A2A] Failed to store message:', dbError.message);
        }

        res.json(response);
    } catch (error) {
        console.error('[A2A] Message Error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

/**
 * POST /message:stream - Streaming message operation (SSE)
 */
router.post('/message:stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    const { message, senderId } = req.body;

    if (a2aAI) {
        await a2aAI.streamResponse(message || { text: '' }, senderId || 'anonymous', res);
    } else {
        const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
        sendEvent({ type: 'start', id: crypto.randomUUID() });
        sendEvent({ type: 'chunk', role: 'assistant', content: 'Serviço de streaming não configurado.' });
        sendEvent({ type: 'end' });
    }

    res.end();
});

// ============================================================================
// TASK MANAGEMENT
// ============================================================================

/**
 * POST /tasks - Create async task
 */
router.post('/tasks', async (req, res) => {
    try {
        const { type, input, callbackUrl, senderId } = req.body;

        if (!type || !input) {
            return res.status(400).json({ error: 'Missing type or input' });
        }

        const taskId = `task_${crypto.randomBytes(12).toString('hex')}`;

        db.prepare(`
            INSERT INTO a2a_tasks (id, type, status, input, sender_id, callback_url, created_at, updated_at)
            VALUES (?, ?, 'pending', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(taskId, type, JSON.stringify(input), senderId, callbackUrl);

        // Process task asynchronously
        setImmediate(async () => {
            try {
                db.prepare(`UPDATE a2a_tasks SET status = 'running', updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
                    .run(taskId);

                let output;
                if (type === 'message' && a2aAI) {
                    output = await a2aAI.processMessage({ text: input.text }, senderId || 'system', input.context || {});
                } else {
                    output = { result: 'Task processed', type };
                }

                db.prepare(`
                    UPDATE a2a_tasks 
                    SET status = 'completed', output = ?, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `).run(JSON.stringify(output), taskId);

                // Send callback if URL provided
                if (callbackUrl) {
                    db.prepare(`
                        INSERT INTO a2a_callbacks (task_id, url, payload, status, created_at)
                        VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP)
                    `).run(taskId, callbackUrl, JSON.stringify({ taskId, status: 'completed', output }));

                    // TODO: Actually send callback via HTTP
                }
            } catch (taskError) {
                db.prepare(`
                    UPDATE a2a_tasks 
                    SET status = 'failed', error = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `).run(taskError.message, taskId);
            }
        });

        res.status(202).json({
            id: taskId,
            status: 'pending',
            type,
            created_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('[A2A] Task Error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

/**
 * GET /tasks/:id - Get task status
 */
router.get('/tasks/:id', (req, res) => {
    try {
        const task = db.prepare('SELECT * FROM a2a_tasks WHERE id = ?').get(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({
            id: task.id,
            type: task.type,
            status: task.status,
            progress: task.progress,
            output: task.output ? JSON.parse(task.output) : null,
            error: task.error,
            created_at: task.created_at,
            completed_at: task.completed_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /tasks/:id:cancel - Cancel a running task
 */
router.post('/tasks/:id\\:cancel', (req, res) => {
    try {
        const taskId = req.params.id;
        const task = db.prepare('SELECT * FROM a2a_tasks WHERE id = ?').get(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.status === 'completed' || task.status === 'failed') {
            return res.status(400).json({ error: 'Task already finished' });
        }

        db.prepare(`
            UPDATE a2a_tasks 
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(taskId);

        res.json({ success: true, id: taskId, status: 'cancelled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /tasks - List tasks
 */
router.get('/tasks', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const status = req.query.status;

        let query = 'SELECT * FROM a2a_tasks';
        const params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        const tasks = db.prepare(query).all(...params);

        res.json(tasks.map(t => ({
            id: t.id,
            type: t.type,
            status: t.status,
            progress: t.progress,
            created_at: t.created_at,
            completed_at: t.completed_at
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// IDENTITY MANAGEMENT
// ============================================================================

/**
 * GET /identities - List identities
 */
router.get('/identities', (req, res) => {
    try {
        const identities = db.prepare('SELECT id, name, public_key, is_default, created_at FROM a2a_identities').all();
        res.json(identities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /identities - Create new identity with real RSA keys
 */
router.post('/identities', (req, res) => {
    try {
        const { name, setDefault } = req.body;
        const id = `identity_${crypto.randomBytes(8).toString('hex')}`;

        let privateKey, publicKey;

        if (a2aCrypto) {
            // Generate real RSA keys
            const keyPair = a2aCrypto.generateKeyPair();
            privateKey = keyPair.privateKey;
            publicKey = keyPair.publicKey;
        } else {
            throw new Error('Crypto service not available for real key generation');
        }

        // If setDefault, unset other defaults first
        if (setDefault) {
            db.prepare('UPDATE a2a_identities SET is_default = 0').run();
        }

        // Check if this is the first identity
        const count = db.prepare('SELECT COUNT(*) as cnt FROM a2a_identities').get();
        const isDefault = setDefault || count.cnt === 0;

        db.prepare(`
            INSERT INTO a2a_identities (id, name, private_key, public_key, is_default, created_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(id, name || 'New Identity', privateKey, publicKey, isDefault ? 1 : 0);

        res.json({
            success: true,
            id,
            publicKey: publicKey.substring(0, 100) + '...',
            isDefault
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /identities/:id - Update identity
 */
router.put('/identities/:id', (req, res) => {
    try {
        const { name, setDefault } = req.body;

        if (setDefault) {
            db.prepare('UPDATE a2a_identities SET is_default = 0').run();
            db.prepare('UPDATE a2a_identities SET is_default = 1 WHERE id = ?').run(req.params.id);
        }

        if (name) {
            db.prepare('UPDATE a2a_identities SET name = ? WHERE id = ?').run(name, req.params.id);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /identities/:id - Delete identity
 */
router.delete('/identities/:id', (req, res) => {
    try {
        const identity = db.prepare('SELECT is_default FROM a2a_identities WHERE id = ?').get(req.params.id);

        if (!identity) {
            return res.status(404).json({ error: 'Identity not found' });
        }

        db.prepare('DELETE FROM a2a_identities WHERE id = ?').run(req.params.id);

        // If deleted was default, set another as default
        if (identity.is_default) {
            const first = db.prepare('SELECT id FROM a2a_identities LIMIT 1').get();
            if (first) {
                db.prepare('UPDATE a2a_identities SET is_default = 1 WHERE id = ?').run(first.id);
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /identities/:id/export - Export public key
 */
router.get('/identities/:id/export', (req, res) => {
    try {
        const identity = db.prepare('SELECT id, name, public_key FROM a2a_identities WHERE id = ?').get(req.params.id);

        if (!identity) {
            return res.status(404).json({ error: 'Identity not found' });
        }

        res.json({
            id: identity.id,
            name: identity.name,
            publicKey: identity.public_key,
            format: 'PEM',
            algorithm: 'RSA-2048'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// PEER MANAGEMENT
// ============================================================================

/**
 * GET /peers - List peers
 */
router.get('/peers', (req, res) => {
    try {
        const peers = db.prepare('SELECT * FROM a2a_peers ORDER BY created_at DESC').all();
        res.json(peers.map(p => ({
            ...p,
            capabilities: p.capabilities ? JSON.parse(p.capabilities) : []
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /peers - Add peer
 */
router.post('/peers', (req, res) => {
    try {
        const { name, endpoint, identityKey } = req.body;

        if (!name || !endpoint) {
            return res.status(400).json({ error: 'Missing name or endpoint' });
        }

        const id = `peer_${crypto.randomBytes(8).toString('hex')}`;

        db.prepare(`
            INSERT INTO a2a_peers (id, name, endpoint, identity_key, trusted, created_at, updated_at)
            VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(id, name, endpoint, identityKey || null);

        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /discover - Discover peer from URL
 */
router.post('/discover', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Missing URL' });
        }

        // Try to fetch agent card
        const discoveryUrl = url.endsWith('agent-card.json') ? url : `${url.replace(/\/$/, '')}/.well-known/agent-card.json`;

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(discoveryUrl, { timeout: 10000 });

        if (!response.ok) {
            return res.status(400).json({ error: 'Failed to fetch agent card', status: response.status });
        }

        const agentCard = await response.json();

        // Extract message endpoint
        const messageInterface = agentCard.supportedInterfaces?.find(i => i.type === 'REST' && i.preferred);
        const endpoint = messageInterface?.url || `${url}/api/a2a/message:send`;

        // Store peer
        const id = `peer_${crypto.randomBytes(8).toString('hex')}`;

        db.prepare(`
            INSERT INTO a2a_peers (id, name, endpoint, capabilities, trusted, created_at, updated_at)
            VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(id, agentCard.name || 'Unknown Agent', endpoint, JSON.stringify(agentCard.capabilities || []));

        res.json({
            success: true,
            id,
            agentCard,
            endpoint
        });
    } catch (error) {
        console.error('[A2A] Discover Error:', error);
        res.status(500).json({ error: 'Discovery failed: ' + error.message });
    }
});

/**
 * GET /peers/:id/verify - Verify peer
 */
router.get('/peers/:id/verify', async (req, res) => {
    try {
        const peer = db.prepare('SELECT * FROM a2a_peers WHERE id = ?').get(req.params.id);

        if (!peer) {
            return res.status(404).json({ error: 'Peer not found' });
        }

        // Try to ping the peer
        try {
            const fetch = (await import('node-fetch')).default;
            const pingUrl = peer.endpoint.replace('/message:send', '/agent-card.json');
            const response = await fetch(pingUrl, { timeout: 5000 });

            const status = response.ok ? 'online' : 'unreachable';

            db.prepare('UPDATE a2a_peers SET trusted = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(response.ok ? 1 : 0, peer.id);

            res.json({ id: peer.id, status, verified: response.ok });
        } catch (pingError) {
            db.prepare('UPDATE a2a_peers SET trusted = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(peer.id);
            res.json({ id: peer.id, status: 'offline', verified: false, error: pingError.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /peers/:id - Delete peer
 */
router.delete('/peers/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM a2a_peers WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// MESSAGE HISTORY
// ============================================================================

/**
 * GET /messages - List messages
 */
router.get('/messages', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const conversationId = req.query.conversation_id;

        let query = 'SELECT * FROM a2a_messages';
        const params = [];

        if (conversationId) {
            query += ' WHERE conversation_id = ?';
            params.push(conversationId);
        }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        const messages = db.prepare(query).all(...params);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /conversations - List conversations
 */
router.get('/conversations', (req, res) => {
    try {
        const conversations = db.prepare(`
            SELECT conversation_id, 
                   COUNT(*) as message_count,
                   MIN(created_at) as started_at,
                   MAX(created_at) as last_message_at
            FROM a2a_messages 
            GROUP BY conversation_id 
            ORDER BY last_message_at DESC 
            LIMIT 50
        `).all();

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * GET /config - Get configuration
 */
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

/**
 * POST /config - Set configuration
 */
router.post('/config', (req, res) => {
    try {
        const { key, value } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'Missing key' });
        }

        setConfig(key, value);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// CALLBACKS
// ============================================================================

/**
 * POST /callback - Receive callback from another agent
 */
router.post('/callback', (req, res) => {
    try {
        const { taskId, status, output, error } = req.body;

        console.log(`[A2A] Callback received for task ${taskId}: ${status}`);

        // Store callback
        db.prepare(`
            INSERT INTO a2a_callbacks (task_id, url, payload, status, created_at)
            VALUES (?, 'incoming', ?, 'received', CURRENT_TIMESTAMP)
        `).run(taskId, JSON.stringify(req.body));

        res.json({ received: true, taskId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// STATS
// ============================================================================

/**
 * GET /stats - Get A2A statistics
 */
router.get('/stats', (req, res) => {
    try {
        // ⚡ Bolt: [performance improvement] Combined multiple sequential COUNT queries into a single table scan.
        // Impact: Reduces database queries from 2 to 1 for messages.
        const { total: messageCount, today: todayMessages } = db.prepare(`
            SELECT
                COUNT(*) as total,
                COALESCE(SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END), 0) as today
            FROM a2a_messages
        `).get() || { total: 0, today: 0 };

        const { total: taskCount, completed: tasksCompleted, pending: tasksPending } = db.prepare(`
            SELECT
                COUNT(*) as total,
                COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed,
                COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending
            FROM a2a_tasks
        `).get() || { total: 0, completed: 0, pending: 0 };

        const { total: peerCount, trusted: trustedPeers } = db.prepare(`
            SELECT
                COUNT(*) as total,
                COALESCE(SUM(CASE WHEN trusted = 1 THEN 1 ELSE 0 END), 0) as trusted
            FROM a2a_peers
        `).get() || { total: 0, trusted: 0 };

        const identityCount = db.prepare('SELECT COUNT(*) as cnt FROM a2a_identities').get()?.cnt || 0;

        const aiStatus = a2aAI ? a2aAI.getStatus() : { active: false };

        res.json({
            // Bolt Performance Optimization: Combined sequential COUNT queries into single table scans using conditional aggregation.
            // Expected Impact: Reduces database queries from 9 to 4, decreasing latency on the a2a/stats endpoint.
            messages: {
                total: messageCount || 0,
                today: todayMessages || 0
            },
            tasks: {
                total: taskCount || 0,
                completed: tasksCompleted || 0,
                pending: tasksPending || 0
            },
            peers: {
                total: peerCount || 0,
                trusted: trustedPeers || 0
            },
            identities: identityCount,
            ai: aiStatus,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;