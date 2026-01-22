// src/pages/api/admin/leads.js - API para Leads Perdidos Inteligentes (Mock Data)

export default async function handler(req, res) {
    // Autenticação básica (melhore isso em produção)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação necessário' });
    }

    try {
        switch (req.method) {
            case 'GET':
                return await listarLeads(req, res);
            case 'POST':
                return await reenviarLead(req, res);
            case 'PUT':
                return await atualizarLead(req, res);
            case 'DELETE':
                return await excluirLead(req, res);
            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API de leads:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Mock data para leads perdidos
const mockLeads = [
    {
        id: 1,
        numero: '5511999999999',
        nome: 'João Silva',
        produto: 'Smartphone Galaxy S24',
        preco: 8999.99,
        data_captura: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        interesse: 'alta',
        ultima_msg: 'Quanto custa mesmo?',
        link_compra: 'https://loja.exemplo.com/produto/1',
        foto_360: '/360/produto1/',
        motivo_perda: 'preco_alto',
        score_intencao: 85,
        tags: ['eletrônicos', 'celular', 'premium'],
        status: 'reenviado',
        enviado_reengajamento: 1,
        tentativas_reengajamento: 2,
        ultima_interacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        valor_perdido: 8999.99
    },
    {
        id: 2,
        numero: '5511988888888',
        nome: 'Maria Santos',
        produto: 'Notebook Gamer',
        preco: 4599.99,
        data_captura: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        interesse: 'média',
        ultima_msg: 'Tem garantia?',
        link_compra: 'https://loja.exemplo.com/produto/2',
        foto_360: '/360/produto2/',
        motivo_perda: 'atendimento',
        score_intencao: 72,
        tags: ['informática', 'gamer', 'notebook'],
        status: 'pendente',
        enviado_reengajamento: 0,
        tentativas_reengajamento: 0,
        ultima_interacao: null,
        valor_perdido: 4599.99
    },
    {
        id: 3,
        numero: '5511977777777',
        nome: 'Pedro Costa',
        produto: 'Smart TV 55"',
        preco: 3299.99,
        data_captura: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        interesse: 'baixa',
        ultima_msg: 'Vou pensar melhor...',
        link_compra: 'https://loja.exemplo.com/produto/3',
        foto_360: null,
        motivo_perda: 'so_consulta',
        score_intencao: 45,
        tags: ['eletrônicos', 'tv', '55polegadas'],
        status: 'ativo',
        enviado_reengajamento: 1,
        tentativas_reengajamento: 1,
        ultima_interacao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        valor_perdido: 3299.99
    }
];

// GET /api/admin/leads - Listar leads com filtros
async function listarLeads(req, res) {
    const {
        filtro = 'todos',
        pagina = 1,
        limite = 50,
        ordenarPor = 'data_captura',
        ordem = 'DESC'
    } = req.query;

    let filteredLeads = [...mockLeads];

    // Aplicar filtros
    if (filtro !== 'todos') {
        if (filtro === 'nao_lidas') {
            filteredLeads = filteredLeads.filter(lead => lead.enviado_reengajamento === 0);
        } else if (filtro === 'urgentes') {
            filteredLeads = filteredLeads.filter(lead => lead.score_intencao > 70);
        } else if (filtro === 'recentes') {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            filteredLeads = filteredLeads.filter(lead => new Date(lead.data_captura) > sevenDaysAgo);
        } else {
            // Filtro por motivo de perda
            filteredLeads = filteredLeads.filter(lead => lead.motivo_perda === filtro);
        }
    }

    // Paginação
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    const paginatedLeads = filteredLeads.slice(offset, offset + parseInt(limite));

    // Estatísticas rápidas
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentLeads = mockLeads.filter(lead => new Date(lead.data_captura) > thirtyDaysAgo);

    const stats = {
        total_leads: recentLeads.length,
        media_score: recentLeads.reduce((acc, lead) => acc + lead.score_intencao, 0) / recentLeads.length,
        reenviados: recentLeads.filter(lead => lead.enviado_reengajamento === 1).length,
        convertidos: recentLeads.filter(lead => lead.status === 'fechado').length,
        valor_total_perdido: recentLeads.reduce((acc, lead) => acc + (lead.valor_perdido || 0), 0)
    };

    // Processar dados para resposta
    const leadsProcessados = paginatedLeads.map(lead => ({
        ...lead,
        tags: lead.tags || [],
        data_captura: new Date(lead.data_captura).toLocaleString('pt-BR'),
        ultima_interacao: lead.ultima_interacao ?
            new Date(lead.ultima_interacao).toLocaleString('pt-BR') : null,
        preco: lead.preco ? lead.preco.toFixed(2) : '0.00',
        valor_perdido: lead.valor_perdido ? lead.valor_perdido.toFixed(2) : '0.00'
    }));

    res.json({
        leads: leadsProcessados,
        stats: {
            total: stats.total_leads || 0,
            mediaScore: Math.round(stats.media_score || 0),
            reenviados: stats.reenviados || 0,
            convertidos: stats.convertidos || 0,
            valorTotalPerdido: stats.valor_total_perdido || 0,
            taxaConversao: stats.reenviados > 0 ?
                Math.round((stats.convertidos / stats.reenviados) * 100) : 0
        },
        paginacao: {
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            total: filteredLeads.length,
            paginas: Math.ceil(filteredLeads.length / parseInt(limite))
        }
    });
}

// POST /api/admin/leads/reenviar - Reenviar oferta para lead
async function reenviarLead(req, res) {
    const { leadId, tipoMensagem = 'personalizada' } = req.body;

    if (!leadId) {
        return res.status(400).json({ error: 'ID do lead necessário' });
    }

    try {
        // Buscar dados do lead (mock)
        const lead = mockLeads.find(l => l.id === parseInt(leadId));

        if (!lead) {
            return res.status(404).json({ error: 'Lead não encontrado' });
        }

        // Verificar se já foi reenviado demais
        if (lead.tentativas_reengajamento >= 3) {
            return res.status(400).json({ error: 'Máximo de tentativas atingido' });
        }

        // Obter template de mensagem baseado no motivo
        const template = obterTemplatePorMotivo(lead.motivo_perda || 'outro');

        // Personalizar mensagem
        const mensagem = template
            .replace('{{produto}}', lead.produto)
            .replace('{{preco}}', `R$ ${(lead.preco * 0.9).toFixed(2)}`)
            .replace('{{link}}', lead.link_compra || '#')
            .replace('{{interesse}}', lead.interesse || '');

        // Atualizar lead (mock)
        lead.enviado_reengajamento = 1;
        lead.tentativas_reengajamento += 1;
        lead.status = 'reenviado';

        console.log(`📤 Reenviando oferta para ${lead.numero}: ${mensagem}`);

        res.json({
            success: true,
            mensagem: 'Oferta reenviada com sucesso',
            leadId,
            tipoMensagem,
            conteudo: mensagem
        });

    } catch (error) {
        console.error('Erro ao reenviar lead:', error);
        res.status(500).json({ error: 'Erro ao reenviar oferta' });
    }
}

// PUT /api/admin/leads/:id - Atualizar lead
async function atualizarLead(req, res) {
    const { id } = req.query;
    const updates = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID do lead necessário' });
    }

    try {
        const camposPermitidos = [
            'nome', 'produto', 'preco', 'motivo_perda', 'score_intencao',
            'tags', 'status', 'interesse', 'link_compra'
        ];

        // Encontrar e atualizar lead mock
        const leadIndex = mockLeads.findIndex(l => l.id === parseInt(id));
        if (leadIndex === -1) {
            return res.status(404).json({ error: 'Lead não encontrado' });
        }

        // Aplicar apenas campos permitidos
        Object.keys(updates).forEach(key => {
            if (camposPermitidos.includes(key)) {
                if (key === 'tags' && Array.isArray(updates[key])) {
                    mockLeads[leadIndex][key] = updates[key];
                } else {
                    mockLeads[leadIndex][key] = updates[key];
                }
            }
        });

        res.json({
            success: true,
            mensagem: 'Lead atualizado com sucesso',
            leadId: id
        });

    } catch (error) {
        console.error('Erro ao atualizar lead:', error);
        res.status(500).json({ error: 'Erro ao atualizar lead' });
    }
}

// DELETE /api/admin/leads/:id - Excluir lead
async function excluirLead(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'ID do lead necessário' });
    }

    try {
        // Encontrar e remover lead mock
        const leadIndex = mockLeads.findIndex(l => l.id === parseInt(id));
        if (leadIndex === -1) {
            return res.status(404).json({ error: 'Lead não encontrado' });
        }

        mockLeads.splice(leadIndex, 1);

        res.json({
            success: true,
            mensagem: 'Lead excluído com sucesso'
        });

    } catch (error) {
        console.error('Erro ao excluir lead:', error);
        res.status(500).json({ error: 'Erro ao excluir lead' });
    }
}

// Função auxiliar para templates de mensagem
function obterTemplatePorMotivo(motivo) {
    const templates = {
        'preco_alto': 'Ei! O {{produto}} que você viu tá R$ {{preco}} com desconto hoje! ⏰ Corre: {{link}}',
        'duvida_estoque': 'Boa notícia! Chegou mais {{produto}} no {{interesse}}. Reserva o seu? {{link}}',
        'atendimento': 'Oi! Agora tô aqui 24h por dia. O que precisa sobre o {{produto}}? {{link}}',
        'so_consulta': 'Lembrou do {{produto}}? Temos frete grátis hoje! {{link}}',
        'desistiu': 'Ei, voltou! O {{produto}} tá esperando você: {{link}}',
        'outro': 'Oi! Vimos que você gostou do {{produto}}. Temos uma surpresa: {{link}}'
    };

    return templates[motivo] || templates.outro;
}