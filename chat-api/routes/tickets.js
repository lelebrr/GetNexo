const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar tickets
router.get('/', (req, res) => {
    try {
        const tickets = db.prepare(`
            SELECT 
                t.id, 
                t.subject, 
                t.status, 
                t.priority,
                t.created_at as date,
                c.name as customer_name
            FROM tickets t
            LEFT JOIN contacts c ON t.contact_id = c.id
            ORDER BY t.created_at DESC
        `).all();

        // Fallback for demo
        if (tickets.length === 0) {
            return res.json({
                tickets: [
                    { id: 1, subject: "Dúvida sobre integração Shopify", status: "open", priority: "normal", date: new Date().toISOString(), customer_name: "Demo User" },
                    { id: 2, subject: "Erro no checkout", status: "pending", priority: "high", date: new Date().toISOString(), customer_name: "Demo User" }
                ]
            });
        }

        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tickets' });
    }
});

// Criar ticket
router.post('/', (req, res) => {
    try {
        const { contact_id, subject, priority } = req.body;
        const info = db.prepare('INSERT INTO tickets (contact_id, subject, priority) VALUES (?, ?, ?)')
            .run(contact_id || null, subject, priority || 'normal');

        res.status(201).json({ id: info.lastInsertRowid, message: 'Ticket criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar ticket' });
    }
});

module.exports = router;
