const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const Docker = require('dockerode');
const docker = new Docker();

const authAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Admin token não enviado' });

    try {
        const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'getnexo_admin_key_2026');
        if (payload.role !== 'superadmin') {
            return res.status(403).json({ error: 'Acesso negado - apenas admin' });
        }
        next();
    } catch (e) {
        res.status(401).json({ error: 'Token admin inválido' });
    }
};

// 1. Get all clients with Usage + REAL Docker Status (Legacy Dashboard)
router.get('/all-clients', authAdmin, async (req, res) => {
    try {
        const clients = db.prepare(`
            SELECT 
                u.id as client_id, u.name as nome_loja,
                cu.memory_used, cu.messages_last_24h, cu.status as db_status, cu.last_update
            FROM users u
            LEFT JOIN client_usage cu ON CAST(u.id AS TEXT) = cu.client_id
            ORDER BY cu.last_update DESC
        `).all();

        // Integrate with real docker list
        const containers = await docker.listContainers({ all: true });

        const enrichedClients = clients.map(client => {
            const containerName = `${client.client_id}-bot`;
            const dContainer = containers.find(c => c.Names.some(n => n.includes(containerName)));

            return {
                ...client,
                docker_status: dContainer ? dContainer.State : 'not_found',
                docker_id: dContainer ? dContainer.Id : null
            };
        });

        res.json(enrichedClients);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Falha ao carregar clientes' });
    }
});

// 1.1 Direct Docker Containers List (New Docker Manager)
router.get('/docker/containers', authAdmin, async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });

        // Map to frontend friendly format
        const mapped = containers.map(c => ({
            id: c.Id,
            name: c.Names[0].replace('/', ''), // Remove leading slash
            status: c.State, // running, exited, etc
            memoryUsage: 'N/A', // Would need docker stats for real-time
            memoryLimit: '512MB', // Placeholder or from Labels
            cpuUsage: 0,
            uptime: c.Status
        }));

        res.json({ containers: mapped });
    } catch (e) {
        console.error('Docker list error:', e);
        res.status(500).json({ error: 'Failed to list containers' });
    }
});

// 2. Get Docker Logs
router.get('/docker/logs/:name', authAdmin, async (req, res) => {
    const { name } = req.params;

    try {
        const container = docker.getContainer(name);
        // Quick check if exists
        try {
            await container.inspect();
        } catch (e) {
            return res.status(404).json({ error: 'Container não encontrado' });
        }

        const logs = await container.logs({
            stdout: true,
            stderr: true,
            tail: 200,
            timestamps: true
        });

        // Dockerode returns Buffer. Convert.
        res.json({ logs: logs.toString('utf8') });
    } catch (e) {
        res.status(500).json({ error: `Erro ao obter logs: ${e.message}` });
    }
});

// 3. Billing History
router.get('/billing/history', authAdmin, (req, res) => {
    try {
        const history = db.prepare(`
            SELECT bh.*, u.name as nome_loja 
            FROM billing_history bh
            JOIN users u ON CAST(u.id AS TEXT) = bh.client_id
            ORDER BY bh.created_at DESC
        `).all();
        res.json(history);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 4. Auto-scale Settings (Global/Client)
router.get('/settings/auto-scale', authAdmin, (req, res) => {
    // For now returning defaults or from a config table (need to create)
    res.json({
        cpu_threshold: 70,
        mem_step_mb: 512,
        mem_max_gb: 4,
        check_interval_min: 5
    });
});

// 5. Aggregated Metrics for Charts (Historical Usage)
router.get('/metrics/summary', authAdmin, (req, res) => {
    // Mocking historical data for the dashboard charts
    const now = new Date();
    const data = [];
    for (let i = 12; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600 * 1000);
        data.push({
            time: time.toISOString(),
            mem: Math.floor(Math.random() * 2000) + 500,
            cpu: Math.floor(Math.random() * 50) + 10,
            messages: Math.floor(Math.random() * 100)
        });
    }
    res.json(data);
});

// Docker Actions
router.post('/docker/:action', authAdmin, async (req, res) => {
    const { action } = req.params; // restart, stop, start
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Container name required' });

    try {
        const container = docker.getContainer(name);

        if (action === 'restart') await container.restart();
        else if (action === 'stop') await container.stop();
        else if (action === 'start') await container.start();
        else return res.status(400).json({ error: 'Invalid action' });

        res.json({ success: true, message: `Container ${name} ${action}ed successfully.` });
    } catch (e) {
        res.status(500).json({ error: `Failed to ${action}: ${e.message}` });
    }
});

module.exports = router;
