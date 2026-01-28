const express = require('express');
const router = express.Router();
const db = require('../db');

// Métricas do Dashboard
router.get('/dashboard-stats', (req, res) => {
    try {
        // Receita Total (24h)
        const revenue24h = db.prepare(`
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE created_at >= datetime('now', '-1 day') AND status = 'paid'
        `).get();

        // Total de Vendas (24h)
        const salesCount24h = db.prepare(`
            SELECT COUNT(*) as count 
            FROM transactions 
            WHERE created_at >= datetime('now', '-1 day') AND status = 'paid'
        `).get();

        // Clientes Ativos
        const activeCustomers = db.prepare(`
            SELECT COUNT(*) as count FROM contacts WHERE updated_at >= datetime('now', '-7 days')
        `).get();

        res.json({
            revenue24h: revenue24h.total || 0,
            salesCount24h: salesCount24h.count || 0,
            activeCustomers: activeCustomers.count || 0,
            conversionRate: 12.5, // Mock por enquanto
            growth: 15.2
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar estatísticas' });
    }
});

// Listar Vendas Recentes
router.get('/recent-sales', (req, res) => {
    try {
        const { search, limit = 10, offset = 0 } = req.query;
        let query = `
            SELECT 
                t.*, 
                c.name as customer_name, 
                c.id as customer_id
            FROM transactions t
            LEFT JOIN contacts c ON t.contact_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (c.name LIKE ? OR t.id LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const sales = db.prepare(query).all(...params);
        res.json({ sales });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar vendas recentes' });
    }
});

// Exportar Vendas (CSV)
router.get('/export-sales', (req, res) => {
    try {
        const sales = db.prepare(`
            SELECT 
                t.id, t.amount, t.status, t.payment_method, t.created_at,
                c.name as customer_name
            FROM transactions t
            LEFT JOIN contacts c ON t.contact_id = c.id
            ORDER BY t.created_at DESC
        `).all();

        if (sales.length === 0) {
            return res.status(404).send('Sem dados para exportar');
        }

        const headers = ['ID', 'Valor', 'Status', 'Metodo', 'Data', 'Cliente'].join(',');
        const rows = sales.map(s => [
            s.id, s.amount, s.status, s.payment_method, s.created_at, s.customer_name
        ].join(',')).join('\n');

        const csv = `${headers}\n${rows}`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_export.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).send('Erro ao exportar vendas');
    }
});

module.exports = router;
