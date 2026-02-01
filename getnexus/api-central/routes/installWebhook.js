const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/api/v1/install', (req, res) => {
    try {
        const { client_id, site_url, timestamp } = req.body;

        if (!client_id || !site_url) {
            return res.status(400).json({ error: 'client_id e site_url obrigatórios' });
        }

        db.prepare(`
      INSERT OR REPLACE INTO client_installs 
      (client_id, site_url, installed_at, last_seen) 
      VALUES (?, ?, ?, ?)
    `).run(client_id.toString(), site_url, timestamp || new Date().toISOString(), new Date().toISOString());

        // Se usage não existe, cria inicial
        db.prepare(`
      INSERT OR IGNORE INTO client_usage 
      (client_id, memory_used, messages_last_24h, status, last_update) 
      VALUES (?, 128, 0, 'ativo', ?)
    `).run(client_id.toString(), new Date().toISOString());

        console.log(`Instalação registrada: ${client_id} em ${site_url}`);

        res.json({ success: true, message: 'Instalação registrada' });
    } catch (err) {
        console.error('Erro webhook install:', err);
        res.status(500).json({ error: 'Erro ao registrar instalação' });
    }
});

module.exports = router;
