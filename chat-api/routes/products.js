const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar produtos
router.get('/', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();

        // Demo fallback
        if (products.length === 0) {
            return res.json([
                { id: 1, name: 'Produto Exemplo 1', price: 99.90, stock: 10, image_url: '', description: '...' },
                { id: 2, name: 'Produto Exemplo 2', price: 149.00, stock: 5, image_url: '', description: '...' }
            ]);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Criar produto
router.post('/', (req, res) => {
    try {
        const { name, price, stock, image_url, description, category, sku } = req.body;
        const info = db.prepare(`
            INSERT INTO products (name, price, stock, image_url, description, category, sku)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(name, price, stock || 0, image_url, description, category, sku);

        res.status(201).json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Atualizar produto
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        const updates = [];
        const values = [];

        // Whitelist allowed fields to prevent SQL injection or unwanted updates
        const allowedFields = ['name', 'price', 'stock', 'image_url', 'description', 'category', 'sku'];

        for (const key of Object.keys(fields)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(fields[key]);
            }
        }

        if (updates.length === 0) {
             return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');

        const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);

        db.prepare(sql).run(...values);

        res.json({ success: true });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// Deletar produto
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;
