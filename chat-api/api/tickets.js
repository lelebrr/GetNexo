const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, '../omninchat.db');
const db = new Database(dbPath);

// Middleware para validar dados
const validateTicketData = (req, res, next) => {
    const { customer_phone, customer_name, channel } = req.body;

    if (!customer_phone || !customer_name || !channel) {
        return res.status(400).json({
            error: 'Dados obrigatórios ausentes',
            required: ['customer_phone', 'customer_name', 'channel']
        });
    }

    next();
};

// GET /api/tickets - Listar tickets com filtros
router.get('/', (req, res) => {
    try {
        const {
            status,
            priority,
            assigned_agent_id,
            human_agent,
            sentiment,
            page = 1,
            limit = 50
        } = req.query;

        let query = 'SELECT * FROM tickets WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }

        if (assigned_agent_id) {
            query += ' AND assigned_agent_id = ?';
            params.push(parseInt(assigned_agent_id));
        }

        if (human_agent !== undefined) {
            query += ' AND human_agent = ?';
            params.push(parseInt(human_agent));
        }

        if (sentiment) {
            query += ' AND sentiment = ?';
            params.push(sentiment);
        }

        // Ordenar por prioridade e data
        query += ' ORDER BY priority DESC, created_at DESC';

        // Paginação
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const tickets = db.prepare(query).all(...params);

        // Contar total
        let countQuery = 'SELECT COUNT(*) as total FROM tickets WHERE 1=1';
        const countParams = [];

        if (status) {
            countQuery += ' AND status = ?';
            countParams.push(status);
        }

        if (priority) {
            countQuery += ' AND priority = ?';
            countParams.push(priority);
        }

        if (assigned_agent_id) {
            countQuery += ' AND assigned_agent_id = ?';
            countParams.push(parseInt(assigned_agent_id));
        }

        if (human_agent !== undefined) {
            countQuery += ' AND human_agent = ?';
            countParams.push(parseInt(human_agent));
        }

        if (sentiment) {
            countQuery += ' AND sentiment = ?';
            countParams.push(sentiment);
        }

        const totalResult = db.prepare(countQuery).get(...countParams);
        const total = totalResult ? totalResult.total : 0;

        res.json({
            tickets,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Erro ao listar tickets:', error);
        res.status(500).json({ error: 'Erro ao listar tickets', message: error.message });
    }
});

// GET /api/tickets/:id - Obter ticket por ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        // Obter mensagens do ticket
        const messages = db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC').all(id);

        // Obter notas internas
        const notes = db.prepare('SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at DESC').all(id);

        // Obter histórico de sentimentos
        const sentiments = db.prepare('SELECT * FROM ticket_sentiments WHERE ticket_id = ? ORDER BY detected_at DESC').all(id);

        res.json({
            ticket,
            messages,
            notes,
            sentiments
        });

    } catch (error) {
        console.error('Erro ao obter ticket:', error);
        res.status(500).json({ error: 'Erro ao obter ticket', message: error.message });
    }
});

// POST /api/tickets - Criar novo ticket
router.post('/', validateTicketData, (req, res) => {
    try {
        const {
            customer_phone,
            customer_name,
            customer_email,
            channel,
            status = 'open',
            priority = 0,
            assigned_agent_id,
            assigned_agent_name,
            human_agent = 0,
            tags,
            metadata
        } = req.body;

        const result = db.prepare(`
            INSERT INTO tickets (
                customer_phone, customer_name, customer_email, channel, status, priority,
                assigned_agent_id, assigned_agent_name, human_agent, tags, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            customer_phone, customer_name, customer_email, channel, status, priority,
            assigned_agent_id, assigned_agent_name, human_agent, tags, metadata
        );

        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(ticket);

    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        res.status(500).json({ error: 'Erro ao criar ticket', message: error.message });
    }
});

// PUT /api/tickets/:id - Atualizar ticket
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        // Construir query dinâmica
        const fields = [];
        const values = [];

        Object.keys(updates).forEach(key => {
            if (key !== 'id' && key !== 'created_at') {
                fields.push(`${key} = ?`);
                values.push(updates[key]);
            }
        });

        if (fields.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        values.push(id);

        const query = `UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`;
        db.prepare(query).run(...values);

        const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);

        res.json(updatedTicket);

    } catch (error) {
        console.error('Erro ao atualizar ticket:', error);
        res.status(500).json({ error: 'Erro ao atualizar ticket', message: error.message });
    }
});

// POST /api/tickets/:id/messages - Adicionar mensagem ao ticket
router.post('/:id/messages', (req, res) => {
    try {
        const { id } = req.params;
        const {
            sender_id,
            sender_name,
            sender_type,
            message_type,
            content,
            media_url,
            media_type
        } = req.body;

        if (!sender_type || !message_type || !content) {
            return res.status(400).json({
                error: 'Dados obrigatórios ausentes',
                required: ['sender_type', 'message_type', 'content']
            });
        }

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const result = db.prepare(`
            INSERT INTO ticket_messages (
                ticket_id, sender_id, sender_name, sender_type, message_type,
                content, media_url, media_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, sender_id, sender_name, sender_type, message_type, content, media_url, media_type);

        // Atualizar last_message e last_message_at no ticket
        db.prepare('UPDATE tickets SET last_message = ?, last_message_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(content.substring(0, 200), id);

        const message = db.prepare('SELECT * FROM ticket_messages WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(message);

    } catch (error) {
        console.error('Erro ao adicionar mensagem:', error);
        res.status(500).json({ error: 'Erro ao adicionar mensagem', message: error.message });
    }
});

// GET /api/tickets/:id/messages - Listar mensagens do ticket
router.get('/:id/messages', (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const messages = db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC').all(id);

        res.json(messages);

    } catch (error) {
        console.error('Erro ao listar mensagens:', error);
        res.status(500).json({ error: 'Erro ao listar mensagens', message: error.message });
    }
});

// POST /api/tickets/:id/notes - Adicionar nota interna
router.post('/:id/notes', (req, res) => {
    try {
        const { id } = req.params;
        const { agent_id, agent_name, note, is_internal = 1 } = req.body;

        if (!agent_id || !agent_name || !note) {
            return res.status(400).json({
                error: 'Dados obrigatórios ausentes',
                required: ['agent_id', 'agent_name', 'note']
            });
        }

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const result = db.prepare(`
            INSERT INTO ticket_notes (
                ticket_id, agent_id, agent_name, note, is_internal
            ) VALUES (?, ?, ?, ?, ?)
        `).run(id, agent_id, agent_name, note, is_internal);

        const noteRecord = db.prepare('SELECT * FROM ticket_notes WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(noteRecord);

    } catch (error) {
        console.error('Erro ao adicionar nota:', error);
        res.status(500).json({ error: 'Erro ao adicionar nota', message: error.message });
    }
});

// GET /api/tickets/:id/notes - Listar notas do ticket
router.get('/:id/notes', (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const notes = db.prepare('SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at DESC').all(id);

        res.json(notes);

    } catch (error) {
        console.error('Erro ao listar notas:', error);
        res.status(500).json({ error: 'Erro ao listar notas', message: error.message });
    }
});

// POST /api/tickets/:id/sentiment - Analisar sentimento
router.post('/:id/sentiment', (req, res) => {
    try {
        const { id } = req.params;
        const { sentiment, sentiment_score, message_id } = req.body;

        if (!sentiment) {
            return res.status(400).json({
                error: 'Dados obrigatórios ausentes',
                required: ['sentiment']
            });
        }

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const result = db.prepare(`
            INSERT INTO ticket_sentiments (
                ticket_id, sentiment, sentiment_score, message_id
            ) VALUES (?, ?, ?, ?)
        `).run(id, sentiment, sentiment_score, message_id);

        // Atualizar sentimento no ticket
        db.prepare('UPDATE tickets SET sentiment = ?, sentiment_score = ? WHERE id = ?')
            .run(sentiment, sentiment_score, id);

        const sentimentRecord = db.prepare('SELECT * FROM ticket_sentiments WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json(sentimentRecord);

    } catch (error) {
        console.error('Erro ao analisar sentimento:', error);
        res.status(500).json({ error: 'Erro ao analisar sentimento', message: error.message });
    }
});

// GET /api/tickets/:id/sentiment - Obter histórico de sentimentos
router.get('/:id/sentiment', (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const sentiments = db.prepare('SELECT * FROM ticket_sentiments WHERE ticket_id = ? ORDER BY detected_at DESC').all(id);

        res.json(sentiments);

    } catch (error) {
        console.error('Erro ao obter sentimentos:', error);
        res.status(500).json({ error: 'Erro ao obter sentimentos', message: error.message });
    }
});

// GET /api/tickets/:id/export - Exportar conversa
router.get('/:id/export', (req, res) => {
    try {
        const { id } = req.params;
        const { format = 'json' } = req.query;

        // Verificar se ticket existe
        const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        // Obter mensagens
        const messages = db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC').all(id);

        // Obter notas
        const notes = db.prepare('SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at DESC').all(id);

        const exportData = {
            ticket,
            messages,
            notes,
            exported_at: new Date().toISOString()
        };

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=ticket_${id}_export.json`);
            res.json(exportData);
        } else if (format === 'txt') {
            let text = `=== TICKET #${ticket.id} ===\n`;
            text += `Cliente: ${ticket.customer_name} (${ticket.customer_phone})\n`;
            text += `Canal: ${ticket.channel}\n`;
            text += `Status: ${ticket.status}\n`;
            text += `Prioridade: ${ticket.priority}\n`;
            text += `Criado em: ${ticket.created_at}\n`;
            text += `Agente: ${ticket.assigned_agent_name || 'Não atribuído'}\n`;
            text += `Humano: ${ticket.human_agent ? 'Sim' : 'Não'}\n`;
            text += `Sentimento: ${ticket.sentiment || 'N/A'}\n\n`;

            text += `=== MENSAGENS ===\n`;
            messages.forEach(msg => {
                text += `[${msg.created_at}] ${msg.sender_name} (${msg.sender_type}): ${msg.content}\n`;
            });

            text += `\n=== NOTAS INTERNAS ===\n`;
            notes.forEach(note => {
                text += `[${note.created_at}] ${note.agent_name}: ${note.note}\n`;
            });

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename=ticket_${id}_export.txt`);
            res.send(text);
        } else {
            res.status(400).json({ error: 'Formato não suportado. Use json ou txt' });
        }

    } catch (error) {
        console.error('Erro ao exportar conversa:', error);
        res.status(500).json({ error: 'Erro ao exportar conversa', message: error.message });
    }
});

// GET /api/tickets/stats/overview - Estatísticas gerais
router.get('/stats/overview', (req, res) => {
    try {
        // ⚡ Bolt: Optimize stats by combining 8 sequential SELECT COUNT(*) queries into 1 conditional aggregation query
        const row = db.prepare(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
                SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waiting,
                SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
                SUM(CASE WHEN priority > 0 THEN 1 ELSE 0 END) as priority,
                SUM(CASE WHEN human_agent = 1 THEN 1 ELSE 0 END) as human,
                SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as today,
                SUM(CASE WHEN status = 'closed' AND DATE(closed_at) = DATE('now') THEN 1 ELSE 0 END) as closed_today
            FROM tickets
        `).get();

        const stats = {
            total: row.total || 0,
            open: row.open || 0,
            waiting: row.waiting || 0,
            closed: row.closed || 0,
            priority: row.priority || 0,
            human: row.human || 0,
            today: row.today || 0,
            closed_today: row.closed_today || 0
        };

        res.json(stats);

    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro ao obter estatísticas', message: error.message });
    }
});

// GET /api/tickets/stats/agent/:agent_id - Estatísticas por agente
router.get('/stats/agent/:agent_id', (req, res) => {
    try {
        const { agent_id } = req.params;

        // ⚡ Bolt: Optimize agent stats by combining 7 sequential SELECT COUNT(*) queries into 1 conditional aggregation query
        const row = db.prepare(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
                SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waiting,
                SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
                SUM(CASE WHEN priority > 0 THEN 1 ELSE 0 END) as priority,
                SUM(CASE WHEN human_agent = 1 THEN 1 ELSE 0 END) as human,
                SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as today
            FROM tickets
            WHERE assigned_agent_id = ?
        `).get(agent_id);

        const stats = {
            total: row?.total || 0,
            open: row?.open || 0,
            waiting: row?.waiting || 0,
            closed: row?.closed || 0,
            priority: row?.priority || 0,
            human: row?.human || 0,
            today: row?.today || 0
        };

        res.json(stats);

    } catch (error) {
        console.error('Erro ao obter estatísticas do agente:', error);
        res.status(500).json({ error: 'Erro ao obter estatísticas do agente', message: error.message });
    }
});

module.exports = router;
