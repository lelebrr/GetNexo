const express = require('express');
const router = express.Router();
const db = require('../db');
const jwtAuth = require('../middleware/jwtAuth');
const bcrypt = require('bcryptjs');

router.use(jwtAuth);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

// Statistics per Reseller
router.get('/stats', (req, res) => {
    const userId = req.userId;

    // Get Reseller Profile
    const profile = db.prepare('SELECT * FROM reseller_profiles WHERE user_id = ?').get(userId);

    if (!profile) {
        // If no profile, try to create one or return defaults
        return res.json({
            total_clients: 0,
            active_subscriptions: 0,
            monthly_revenue: formatCurrency(0),
            commissions_pending: formatCurrency(0),
            growth_rate: '+0%',
            code: 'N/A',
            clientsCount: 0,
            recent_activity: []
        });
    }

    // Get Clients Count
    const clientsCount = db.prepare('SELECT count(*) as count FROM users WHERE reseller_id = ?').get(userId).count;

    // Get Commissions
    const pendingCommissions = db.prepare("SELECT sum(amount) as total FROM commissions WHERE reseller_id = ? AND status = 'pending'").get(userId).total || 0;

    // Monthly Revenue (Based on commissions and rate)
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0,0,0,0);
    const monthStartStr = currentMonthStart.toISOString();

    const monthlyCommissions = db.prepare("SELECT sum(amount) as total FROM commissions WHERE reseller_id = ? AND created_at >= ?").get(userId, monthStartStr).total || 0;

    const revenue = profile.commission_rate > 0 ? (monthlyCommissions / profile.commission_rate) : 0;

    // Recent Activity
    const recentActivity = db.prepare(`
        SELECT 'commission' as type, description as message, created_at as time
        FROM commissions
        WHERE reseller_id = ?
        ORDER BY created_at DESC
        LIMIT 5
    `).all(userId);

    res.json({
        total_clients: clientsCount,
        active_subscriptions: clientsCount, // Assuming all active for now
        monthly_revenue: formatCurrency(revenue), // Sales volume
        commissions_pending: formatCurrency(pendingCommissions),
        growth_rate: '+0%', // Real value implies 0 if no history
        code: profile.referral_code,
        clientsCount: clientsCount,
        recent_activity: recentActivity.map(a => ({
            ...a,
            time: new Date(a.time).toLocaleString('pt-BR')
        }))
    });
});

// Clients List
router.get('/clientes', (req, res) => {
    const userId = req.userId;

    // Get Reseller Rate for revenue calc
    const profile = db.prepare('SELECT commission_rate FROM reseller_profiles WHERE user_id = ?').get(userId);
    const rate = profile ? profile.commission_rate : 0.10; // Default 10% if missing

    // Optimized query with LEFT JOIN and aggregation to avoid N+1 problem
    const clients = db.prepare(`
        SELECT
            u.id,
            u.name as nome,
            u.email,
            u.created_at as data,
            COALESCE(SUM(c.amount), 0) as total_commission
        FROM users u
        LEFT JOIN commissions c ON u.id = c.source_user_id
        WHERE u.reseller_id = ?
        GROUP BY u.id
    `).all(userId);

    const formattedClients = clients.map(c => {
        const estimatedRevenue = rate > 0 ? (c.total_commission / rate) : 0;
        return {
            id: c.id,
            nome: c.nome,
            email: c.email,
            dominio: 'N/A', // Not stored yet
            plano: 'Standard',
            status: 'active',
            receita: formatCurrency(estimatedRevenue),
            comissao: formatCurrency(c.total_commission),
            data: new Date(c.data).toLocaleDateString('pt-BR')
        };
    });

    res.json(formattedClients);
});

// Financial Data
router.get('/financeiro', (req, res) => {
    const userId = req.userId;
    const profile = db.prepare('SELECT balance FROM reseller_profiles WHERE user_id = ?').get(userId);

    const history = db.prepare(`
        SELECT description, created_at as date, amount, status
        FROM commissions
        WHERE reseller_id = ?
        ORDER BY created_at DESC
    `).all(userId);

    const requests = db.prepare(`
        SELECT amount, status, requested_at as date
        FROM payout_requests
        WHERE reseller_id = ?
        ORDER BY requested_at DESC
    `).all(userId);

    const formattedHistory = history.map(h => ({
        description: h.description,
        date: new Date(h.date).toLocaleDateString('pt-BR'),
        amount: formatCurrency(h.amount),
        status: h.status
    }));

    // Add Payout Requests to history for visibility
    const formattedRequests = requests.map(r => ({
        description: 'Solicitação de Saque',
        date: new Date(r.date).toLocaleDateString('pt-BR'),
        amount: `-${formatCurrency(r.amount)}`,
        status: r.status
    }));

    // Calculate next payout date (15th of next month)
    const now = new Date();
    let nextPayoutDate = new Date(now.getFullYear(), now.getMonth() + 1, 15);

    res.json({
        balance: formatCurrency(profile ? profile.balance : 0),
        next_payout: nextPayoutDate.toLocaleDateString('pt-BR'),
        history: [...formattedRequests, ...formattedHistory],
        statements: []
    });
});

// Payout Request
router.post('/saque', (req, res) => {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valor inválido' });
    }

    try {
        const profile = db.prepare('SELECT balance FROM reseller_profiles WHERE user_id = ?').get(userId);

        if (!profile || profile.balance < amount) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        const insert = db.prepare('INSERT INTO payout_requests (reseller_id, amount, status) VALUES (?, ?, ?)');

        // Transaction to deduct balance safely
        const deduct = db.transaction(() => {
            insert.run(userId, amount, 'pending');
            db.prepare('UPDATE reseller_profiles SET balance = balance - ? WHERE user_id = ?').run(amount, userId);
        });

        deduct();

        res.json({ ok: true, message: 'Solicitação realizada com sucesso' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao processar saque' });
    }
});

// Profile Update
router.put('/perfil', (req, res) => {
    const userId = req.userId;
    const { bank_info } = req.body; // Expecting JSON string or object

    if (!bank_info) {
        return res.status(400).json({ error: 'Dados bancários obrigatórios' });
    }

    try {
        const infoStr = typeof bank_info === 'object' ? JSON.stringify(bank_info) : bank_info;

        db.prepare('UPDATE reseller_profiles SET bank_info = ? WHERE user_id = ?').run(infoStr, userId);
        res.json({ ok: true, message: 'Perfil atualizado com sucesso' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});

// Marketing
router.get('/marketing', (req, res) => {
    try {
        const assets = db.prepare('SELECT type, name, url, clicks FROM marketing_assets WHERE active = 1').all();

        const links = assets.filter(a => a.type === 'Link');
        const media = assets.filter(a => a.type !== 'Link');

        res.json({
            links: links.map(l => ({ name: l.name, url: l.url, clicks: l.clicks })),
            assets: media.map(m => ({ name: m.name, type: m.type, url: m.url })),
            landings: [
                // Still keeping these as separate concept if needed, or could be in DB too
                { id: 1, name: 'Landing Page Black Friday', status: 'active', url: 'https://seunome.getnexo.com.br/blackfriday' }
            ]
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao carregar marketing' });
    }
});

// Client Creation (Reseller creates client)
router.post('/clientes', async (req, res) => {
    const { nome, email, password } = req.body;
    const userId = req.userId;

    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    try {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Default password if not provided
        const pass = password || 'mudar123';
        const hash = await bcrypt.hash(pass, 10);

        const insert = db.prepare('INSERT INTO users (email, password, name, role, role_id, reseller_id) VALUES (?, ?, ?, ?, ?, ?)');
        const result = insert.run(email, hash, nome, 'client', 3, userId);

        res.json({ ok: true, message: 'Cliente criado com sucesso.', clientId: result.lastInsertRowid });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});

// Support Ticket
router.post('/suporte', (req, res) => {
    const userId = req.userId;
    const user = req.user;
    const { subject, message } = req.body;

    if (!subject || !message) return res.status(400).json({ error: 'Assunto e mensagem obrigatórios' });

    try {
        // 1. Find or Create Contact
        let contact = db.prepare('SELECT id FROM contacts WHERE id = ?').get(user.email); // Using email as ID for simplicity or check if using numeric

        // Check schema of contacts. id is TEXT.
        // Let's use user.id as contact.id or user.email?
        // Existing contacts schema: id TEXT PRIMARY KEY.

        if (!contact) {
            const insertContact = db.prepare('INSERT INTO contacts (id, name, profile_pic_url, tags) VALUES (?, ?, ?, ?)');
            insertContact.run(user.email, user.name, '', 'reseller');
            contact = { id: user.email };
        }

        // 2. Create Ticket
        const insertTicket = db.prepare('INSERT INTO tickets (contact_id, subject, status, priority) VALUES (?, ?, ?, ?)');
        insertTicket.run(contact.id, `[REVENDA] ${subject} - ${message.substring(0, 50)}...`, 'open', 'high');

        res.json({ ok: true, message: 'Ticket de suporte criado' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao criar ticket' });
    }
});

// Codes
router.get('/codigos', (req, res) => {
    // Check if coupons table exists and use it, otherwise return mock/empty
    try {
        const codes = db.prepare('SELECT * FROM coupons').all();
        // format for frontend
        const formatted = codes.map(c => ({
            id: c.id,
            codigo: c.code,
            desconto: c.discount_type === 'percentage' ? `${c.discount_value}%` : `R$ ${c.discount_value}`,
            validade: c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : 'Indeterminado',
            status: c.active ? 'ATIVO' : 'INATIVO'
        }));
        res.json(formatted);
    } catch (e) {
        res.json([]);
    }
});

module.exports = router;
