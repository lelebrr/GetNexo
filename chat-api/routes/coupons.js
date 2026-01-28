const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar cupons
router.get('/', (req, res) => {
    try {
        const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cupons' });
    }
});

// Criar cupom
router.post('/', (req, res) => {
    try {
        const { code, discount_type, discount_value, min_order_value, max_uses, expires_at, active } = req.body;
        const info = db.prepare(`
            INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, expires_at, active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(code, discount_type, discount_value, min_order_value || 0, max_uses || 0, expires_at || null, active ? 1 : 0);

        res.status(201).json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Código de cupom já existe' });
        }
        res.status(500).json({ error: 'Erro ao criar cupom' });
    }
});

// Atualizar cupom
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { code, discount_type, discount_value, min_order_value, max_uses, expires_at, active } = req.body;

        db.prepare(`
            UPDATE coupons 
            SET code = ?, discount_type = ?, discount_value = ?, min_order_value = ?, max_uses = ?, expires_at = ?, active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(code, discount_type, discount_value, min_order_value, max_uses, expires_at, active ? 1 : 0, id);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cupom' });
    }
});

// Deletar cupom
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cupom' });
    }
});

module.exports = router;
