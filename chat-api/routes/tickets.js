const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar tickets
router.get('/', (req, res) => {
    try {
        const { status, priority, channel, sentiment, search, date } = req.query;
        let query = `
            SELECT 
                t.*,
                c.name as customer_name,
                c.phone as customer_phone,
                u.name as assigned_agent_name
            FROM tickets t
            LEFT JOIN contacts c ON t.contact_id = c.id
            LEFT JOIN users u ON t.assigned_agent_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            if (Array.isArray(status)) {
                query += ` AND t.status IN (${status.map(() => '?').join(',')})`;
                params.push(...status);
            } else {
                query += ` AND t.status = ?`;
                params.push(status);
            }
        }

        if (priority) {
            query += ` AND t.priority = ?`;
            params.push(priority);
        }

        if (channel) {
            query += ` AND t.channel = ?`;
            params.push(channel);
        }

        if (sentiment) {
            if (Array.isArray(sentiment)) {
                query += ` AND t.sentiment IN (${sentiment.map(() => '?').join(',')})`;
                params.push(...sentiment);
            } else {
                query += ` AND t.sentiment = ?`;
                params.push(sentiment);
            }
        }

        if (search) {
            query += ` AND (c.name LIKE ? OR t.subject LIKE ? OR t.last_message LIKE ?)`;
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        if (date && Array.isArray(date) && date.length === 2) {
            query += ` AND t.created_at BETWEEN ? AND ?`;
            params.push(date[0], date[1]);
        }

        query += ` ORDER BY t.last_message_at DESC, t.created_at DESC`;

        const tickets = db.prepare(query).all(params);
        res.json({ success: true, tickets });
    } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar tickets' });
    }
});

// Criar ticket
router.post('/', (req, res) => {
    try {
        const { contact_id, subject, priority, channel, sentiment } = req.body;
        const info = db.prepare(`
            INSERT INTO tickets (contact_id, subject, priority, channel, sentiment, status, created_at, updated_at, last_message_at) 
            VALUES (?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(contact_id || null, subject, priority || 'normal', channel || 'whatsapp', sentiment || 'neutral');

        res.status(201).json({ success: true, id: info.lastInsertRowid, message: 'Ticket criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar ticket' });
    }
});

// GET /notes - Listar notas
router.get('/notes', (req, res) => {
    try {
        const notes = db.prepare(`
            SELECT tn.*, t.subject as ticket_subject 
            FROM ticket_notes tn
            JOIN tickets t ON tn.ticket_id = t.id
            ORDER BY tn.created_at DESC
        `).all();
        res.json({ success: true, notes });
    } catch (error) {
        console.error('Erro ao buscar notas:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar notas' });
    }
});

// POST /notes - Criar nota
router.post('/notes', (req, res) => {
    try {
        const { ticket_id, content } = req.body;
        if (!ticket_id || !content) {
            return res.status(400).json({ success: false, message: 'Ticket ID e conteúdo são obrigatórios' });
        }

        const info = db.prepare('INSERT INTO ticket_notes (ticket_id, content) VALUES (?, ?)').run(ticket_id, content);
        res.json({ success: true, id: info.lastInsertRowid, message: 'Nota criada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar nota:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar nota' });
    }
});

// PUT /notes/:id - Atualizar nota
router.put('/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const info = db.prepare('UPDATE ticket_notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(content, id);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, message: 'Nota não encontrada' });
        }

        res.json({ success: true, message: 'Nota atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar nota:', error);
        res.status(500).json({ success: false, error: 'Erro ao atualizar nota' });
    }
});

// DELETE /notes/:id - Excluir nota
router.delete('/notes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const info = db.prepare('DELETE FROM ticket_notes WHERE id = ?').run(id);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, message: 'Nota não encontrada' });
        }

        res.json({ success: true, message: 'Nota excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir nota:', error);
        res.status(500).json({ success: false, error: 'Erro ao excluir nota' });
    }
});

// GET /export - Exportar tickets
router.get('/export', (req, res) => {
    try {
        const { status, sentiment, date } = req.query;
        let query = `
            SELECT 
                t.id, t.subject, t.status, t.priority, t.channel, t.sentiment, t.created_at,
                c.name as customer_name, c.phone as customer_phone
            FROM tickets t
            LEFT JOIN contacts c ON t.contact_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ` AND t.status = ?`;
            params.push(status);
        }
        if (sentiment) {
            query += ` AND t.sentiment = ?`;
            params.push(sentiment);
        }
        if (date && Array.isArray(date) && date.length === 2) {
            query += ` AND t.created_at BETWEEN ? AND ?`;
            params.push(date[0], date[1]);
        }

        const tickets = db.prepare(query).all(params);

        // Generate CSV
        const header = 'ID,Cliente,Telefone,Assunto,Status,Prioridade,Canal,Sentimento,Data\n';
        const rows = tickets.map(t => {
            return `${t.id},"${t.customer_name || ''}","${t.customer_phone || ''}","${t.subject || ''}",${t.status},${t.priority},${t.channel},${t.sentiment},${t.created_at}`;
        }).join('\n');

        const csvContent = header + rows;

        res.json({
            success: true,
            filename: `tickets_export_${Date.now()}.csv`,
            content: csvContent
        });

    } catch (error) {
        console.error('Erro ao exportar tickets:', error);
        res.status(500).json({ success: false, error: 'Erro ao exportar tickets' });
    }
});

module.exports = router;
