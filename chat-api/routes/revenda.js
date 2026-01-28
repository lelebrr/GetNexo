const express = require('express');
const router = express.Router();

// Mock Statistics per Reseller
router.get('/stats', (req, res) => {
    res.json({
        total_clients: 42,
        active_subscriptions: 38,
        monthly_revenue: 'R$ 12.450,00',
        commissions_pending: 'R$ 2.490,00',
        growth_rate: '+12.5%',
        code: 'NEXO-REV-2026',
        clientsCount: 42,
        recent_activity: [
            { id: 1, type: 'new_client', message: 'Novo cliente "Loja Fashion" cadastrado.', time: 'há 2 horas' },
            { id: 2, type: 'payment', message: 'Comissão de R$ 450,00 aprovada.', time: 'há 5 horas' },
            { id: 3, type: 'alert', message: 'Assinatura de "Auto Parts" expirando em 3 dias.', time: 'há 1 dia' }
        ]
    });
});

// Mock Clients List
router.get('/clientes', (req, res) => {
    const clients = [
        { id: 1, nome: 'João Silva', dominio: 'joaosilva.com', plataforma: 'woocommerce', status: 'active', receita: 'R$ 299,00', comissao: 'R$ 59,80', data: '20/01/2026' },
        { id: 2, nome: 'Tech Solutions Ltda', dominio: 'techsolutions.com.br', plataforma: 'shopify', status: 'active', receita: 'R$ 599,00', comissao: 'R$ 119,80', data: '15/01/2026' },
        { id: 3, nome: 'Mercado Local', dominio: 'mercadolocal.net', plataforma: 'cartpanda', status: 'trial', receita: 'R$ 0,00', comissao: 'R$ 0,00', data: '25/01/2026' },
        { id: 4, nome: 'Ana Doces', dominio: 'anadoces.com', plataforma: 'nuvemshop', status: 'inactive', receita: 'R$ 299,00', comissao: 'R$ 0,00', data: '05/01/2026' },
        { id: 5, nome: 'Barbearia VIP', dominio: 'barbeariavip.com.br', plataforma: 'yampi', status: 'active', receita: 'R$ 199,00', comissao: 'R$ 39,80', data: '18/01/2026' }
    ];

    const { status } = req.query;
    if (status === 'active') {
        return res.json(clients.filter(c => c.status === 'active'));
    } else if (status === 'inactive') {
        return res.json(clients.filter(c => c.status === 'inactive' || c.status === 'trial'));
    }

    res.json(clients);
});

// Mock Financial Data
router.get('/financeiro', (req, res) => {
    res.json({
        balance: 'R$ 3.840,00',
        next_payout: '05/02/2026',
        history: [
            { id: 1, type: 'commission', description: 'Comissão Mensal - Janeiro', amount: 'R$ 1.250,00', status: 'paid', date: '05/01/2026' },
            { id: 2, type: 'referral', description: 'Indicação - Tech Solutions', amount: 'R$ 100,00', status: 'paid', date: '15/01/2026' },
            { id: 3, type: 'commission', description: 'Comissão Mensal - Dezembro', amount: 'R$ 1.100,00', status: 'paid', date: '05/12/2025' }
        ],
        statements: [
            { month: 'Janeiro 2026', total: 'R$ 1.350,00', clients: 42, url: '#' },
            { month: 'Dezembro 2025', total: 'R$ 1.100,00', clients: 38, url: '#' }
        ]
    });
});

// Mock Marketing Assets
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

// Mock Client Creation
router.post('/clientes', (req, res) => {
    const { nome, domain } = req.body;
    if (!nome || !domain) {
        return res.status(400).json({ error: 'Nome e domínio são obrigatórios' });
    }
    res.json({ ok: true, message: 'Cliente criado com sucesso e plugin enviado.' });
});

// Mock Team Management
router.get('/equipe', (req, res) => {
    res.json([
        { id: 1, nome: 'Ana Silva', email: 'ana@getnexo.com', permissao: 'EDITOR' },
        { id: 2, nome: 'Carlos Souza', email: 'carlos@getnexo.com', permissao: 'VISUAL' }
    ]);
});

router.post('/equipe', (req, res) => {
    res.json({ ok: true });
});

router.delete('/equipe', (req, res) => {
    res.json({ ok: true });
});

router.patch('/equipe', (req, res) => {
    res.json({ ok: true });
});

// Mock Codes
router.get('/codigos', (req, res) => {
    res.json([
        { id: 1, codigo: 'NEXO20', desconto: '20%', validade: '31/12/2026', status: 'ATIVO' },
        { id: 2, codigo: 'REV50', desconto: '50% Off 1º Mês', validade: '01/06/2026', status: 'ATIVO' }
    ]);
});

module.exports = router;
