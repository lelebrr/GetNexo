const express = require('express');
const router = express.Router();
const db = require('../db');

// Obter todas as configurações
router.get('/', (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM settings').all();
        const config = {};
        settings.forEach(s => {
            config[s.key] = s.value;
        });
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
});

// Atualizar configurações
router.post('/', (req, res) => {
    try {
        const { settings } = req.body; // { key: value, ... }

        const update = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');

        const transaction = db.transaction((config) => {
            for (const [key, value] of Object.entries(config)) {
                update.run(key, String(value));
            }
        });

        transaction(settings);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar configurações' });
    }
});

module.exports = router;
