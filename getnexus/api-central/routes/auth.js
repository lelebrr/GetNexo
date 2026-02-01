const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'getnexo_client_key_2026';

// Login do cliente
router.post('/api/v1/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            {
                client_id: user.id,
                email: user.email,
                nome_loja: user.name || 'Loja do Cliente',
                role: user.role || 'client'
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            user: {
                client_id: user.id,
                email: user.email,
                nome_loja: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Erro login:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Registro rápido
router.post('/api/v1/register', async (req, res) => {
    try {
        const { email, password, nome_loja } = req.body;
        if (!email || !password || !nome_loja) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const info = db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
            email, hashed, nome_loja, 'client'
        );

        const clientId = info.lastInsertRowid;

        const token = jwt.sign(
            {
                client_id: clientId,
                email,
                nome_loja,
                role: 'client'
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Mock container creation
        console.log(`Criando container Docker para ${clientId} - ${nome_loja}`);
        try {
            // In a real scenario, this would call Docker
            // For now we populate the usage table so the dashboard isn't empty
            db.prepare(`
            INSERT OR IGNORE INTO client_usage 
            (client_id, memory_used, messages_last_24h, status, last_update) 
            VALUES (?, 128, 0, 'ativo', ?)
        `).run(clientId.toString(), new Date().toISOString());
        } catch (e) {
            console.error("Failed to seed usage:", e);
        }


        res.status(201).json({
            success: true,
            token,
            client_id: clientId,
            message: 'Conta criada e container iniciado'
        });
    } catch (err) {
        console.error('Erro registro:', err);
        res.status(500).json({ error: 'Erro ao criar conta' });
    }
});

module.exports = router;
