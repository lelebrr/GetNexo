const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar clientes
router.get('/customers', (req, res) => {
    try {
        const { search, status } = req.query;
        let query = `
            SELECT 
                id, 
                name, 
                funnel_stage as status, 
                created_at,
                (SELECT COUNT(*) FROM messages WHERE contact_id = contacts.id) as message_count
            FROM contacts
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (name LIKE ? OR id LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (status && status !== 'all') {
            query += ` AND funnel_stage = ?`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC`;

        const customers = db.prepare(query).all(...params);

        // Se não houver clientes, retorna mock para teste inicial
        if (customers.length === 0) {
            return res.json({
                customers: [
                    { id: '5511999999999', name: 'João Silva (Demo)', status: 'lead', created_at: new Date().toISOString() },
                    { id: '5511888888888', name: 'Maria Souza (Demo)', status: 'qualified', created_at: new Date().toISOString() }
                ]
            });
        }

        res.json({ customers });
    } catch (error) {
        console.error('CRM Fetch error:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes no banco de dados' });
    }
});

// Atualizar cliente
router.patch('/customers/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const info = db.prepare(`
            UPDATE contacts 
            SET name = COALESCE(?, name), funnel_stage = COALESCE(?, funnel_stage), updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(name, status, id);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ success: true, message: 'Cliente atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

// Deletar cliente
router.delete('/customers/:id', (req, res) => {
    try {
        const { id } = req.params;

        const info = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ success: true, message: 'Cliente removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover cliente' });
    }
});

// Exportar como CSV
router.get('/export', (req, res) => {
    try {
        const contacts = db.prepare('SELECT * FROM contacts').all();

        if (contacts.length === 0) {
            return res.status(404).send('Nenhum dado para exportar');
        }

        const headers = Object.keys(contacts[0]).join(',');
        const rows = contacts.map(c => Object.values(c).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=crm_export.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).send('Erro ao exportar dados');
    }
});

// Importar clientes (Bulk)
router.post('/customers/import', (req, res) => {
    try {
        const { customers } = req.body;
        if (!Array.isArray(customers)) {
            return res.status(400).json({ error: 'Formato inválido. Esperado array de clientes.' });
        }

        const insert = db.prepare(`
            INSERT OR IGNORE INTO contacts (id, name, funnel_stage, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `);

        const transaction = db.transaction((list) => {
            for (const c of list) {
                insert.run(c.id, c.name, c.status || 'lead');
            }
        });

        transaction(customers);
        res.json({ success: true, count: customers.length });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao importar clientes' });
    }
});

module.exports = router;
