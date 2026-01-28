const express = require('express');
const router = express.Router();
const db = require('../db');
const jwtAuth = require('../middleware/jwtAuth');

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

    // Monthly Revenue (Assuming it's based on commissions / rate)
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
        growth_rate: '+0%', // Dynamic calculation requires history
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

    const clients = db.prepare(`
        SELECT u.id, u.name as nome, u.email, u.created_at as data
        FROM users u
        WHERE u.reseller_id = ?
    `).all(userId);

    const enrichedClients = clients.map(c => {
        const totalCommission = db.prepare('SELECT sum(amount) as total FROM commissions WHERE source_user_id = ?').get(c.id).total || 0;
        return {
            id: c.id,
            nome: c.nome,
            email: c.email,
            dominio: 'N/A', // Not stored yet
            plano: 'Standard',
            status: 'active',
            receita: formatCurrency(totalCommission * 10), // Mock revenue
            comissao: formatCurrency(totalCommission),
            data: new Date(c.data).toLocaleDateString('pt-BR')
        };
    });

    res.json(enrichedClients);
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

    const formattedHistory = history.map(h => ({
        description: h.description,
        date: new Date(h.date).toLocaleDateString('pt-BR'),
        amount: formatCurrency(h.amount),
        status: h.status
    }));

    res.json({
        balance: formatCurrency(profile ? profile.balance : 0),
        next_payout: '15/02/2026', // Static for now
        history: formattedHistory,
        statements: []
    });
});

// Marketing (Static)
router.get('/marketing', (req, res) => {
    res.json({
        links: [
            { name: 'Página Inicial (GetNexo)', url: 'https://getnexo.com.br/?ref=REV123', clicks: 1240 },
            { name: 'Planos & Preços', url: 'https://getnexo.com.br/precos/?ref=REV123', clicks: 850 },
            { name: 'Demo Grátis', url: 'https://getnexo.com.br/trial/?ref=REV123', clicks: 420 }
        ],
        assets: [
            { name: 'Banner 728x90 (Horizontal)', type: 'Image', url: '/assets/marketing/banner-h.png' },
            { name: 'Criativo Instagram (1080x1080)', type: 'Image', url: '/assets/marketing/insta-post.png' },
            { name: 'Apresentação PDF (2026)', type: 'PDF', url: '/assets/marketing/apresentacao.pdf' }
        ],
        landings: [
            { id: 1, name: 'Landing Page Black Friday', status: 'active', url: 'https://seunome.getnexo.com.br/blackfriday' },
            { id: 2, name: 'Página de Vendas Direta', status: 'active', url: 'https://seunome.getnexo.com.br/vendas' }
        ]
    });
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
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash(pass, 10);

        const insert = db.prepare('INSERT INTO users (email, password, name, role, role_id, reseller_id) VALUES (?, ?, ?, ?, ?, ?)');
        const result = insert.run(email, hash, nome, 'client', 3, userId);

        res.json({ ok: true, message: 'Cliente criado com sucesso.', clientId: result.lastInsertRowid });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao criar cliente' });
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
