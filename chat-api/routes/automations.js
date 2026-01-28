const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar automações
router.get('/', (req, res) => {
    try {
        const automations = db.prepare('SELECT * FROM automations ORDER BY created_at DESC').all();
        res.json(automations);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar automações' });
    }
});

// Criar automação
router.post('/', (req, res) => {
    try {
        const { name, trigger_id, action_id } = req.body;
        const info = db.prepare(`
            INSERT INTO automations (name, trigger_id, action_id)
            VALUES (?, ?, ?)
        `).run(name, trigger_id, action_id);

        res.status(201).json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar automação' });
    }
});

// Alternar status (Ativar/Desativar)
router.patch('/:id/toggle', (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        db.prepare('UPDATE automations SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(active ? 1 : 0, id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao alternar status' });
    }
});

// Deletar automação
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM automations WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar automação' });
    }
});

module.exports = router;
