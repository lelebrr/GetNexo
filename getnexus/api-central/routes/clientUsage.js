const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const authClient = (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Token não enviado' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'getnexo_client_key_2026');
        req.clientId = payload.client_id;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

router.get('/usage', authClient, (req, res) => {
    const clientId = req.clientId;

    const uso = db.prepare(`
        SELECT memory_used, messages_last_24h, last_update
        FROM client_usage WHERE client_id = ?
    `).get(clientId.toString());

    if (!uso) {
        return res.json({
            memory: 128,
            messages: 0,
            status: 'inativo',
            msg: 'Container recém-criado'
        });
    }

    res.json({
        memory: uso.memory_used,
        messages: uso.messages_last_24h,
        status: 'ativo',
        last_update: uso.last_update
    });
});

module.exports = router;
