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

        // Taxa de Conversão: (Vendas / Total Sessões ou Interações) * 100
        // Como não temos sessões, usaremos Total Vendas / Total Clientes Ativos como proxy
        const conversionRate = activeCustomers.count > 0
            ? ((salesCount24h.count / activeCustomers.count) * 100).toFixed(2)
            : 0;

        res.json({
            revenue24h: revenue24h.total || 0,
            salesCount24h: salesCount24h.count || 0,
            activeCustomers: activeCustomers.count || 0,
            conversionRate: parseFloat(conversionRate),
            growth: 15.2 // TODO: Calcular comparando com dia anterior real
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

// Analytics Avançado: Clustering (RFM)
router.get('/clustering', (req, res) => {
    try {
        // RFM: Recency (days since last order), Frequency (count), Monetary (sum amount)
        const query = `
            SELECT
                c.id,
                c.name,
                COUNT(t.id) as purchases,
                SUM(t.amount) as income, -- usando total gasto como proxy de renda/valor
                CAST((julianday('now') - julianday(MAX(t.created_at))) AS INTEGER) as recency
            FROM contacts c
            JOIN transactions t ON c.id = t.contact_id
            WHERE t.status = 'paid'
            GROUP BY c.id
        `;
        const data = db.prepare(query).all();

        // Se não houver dados reais, retornar vazio ou fallback inteligente
        if (data.length === 0) {
            return res.json([]);
        }

        // Clustering simplificado (K-means naive ou apenas buckets)
        // Buckets: VIP (> 5 compras), Regular (2-5), New (1)
        const clusters = data.map(u => {
            let clusterId = 0; // New
            if (u.purchases > 5) clusterId = 2; // VIP
            else if (u.purchases >= 2) clusterId = 1; // Regular

            return {
                id: u.id,
                name: u.name,
                age: u.recency, // Usando recencia como 'idade' do cliente na base para visualização
                income: u.income,
                purchases: u.purchases,
                cluster: clusterId
            };
        });

        res.json(clusters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar clusters' });
    }
});

// Analytics Avançado: Tendências
router.get('/trends', (req, res) => {
    try {
        // Vendas por Categoria (baseado em produtos vendidos nas transações)
        // Assumindo que transactions não tem link direto pra produto item a item no modelo simplificado,
        // vamos usar products.category se tivéssemos items_order.
        // Como simplificação, vamos agrupar por payment_method ou status por enquanto,
        // OU se tivermos products na transaction.
        // Vamos simular categorias baseadas em products existentes se possível, ou retornar dados reais de transações.

        // Melhor: Tendência de vendas nos últimos 7 dias
        const query = `
            SELECT
                strftime('%Y-%m-%d', created_at) as date,
                COUNT(*) as count,
                SUM(amount) as total
            FROM transactions
            WHERE created_at >= datetime('now', '-7 days')
            GROUP BY date
            ORDER BY date ASC
        `;
        const salesTrend = db.prepare(query).all();

        const trends = salesTrend.map(t => ({
            category: t.date, // Usando data como categoria x-axis
            averagePurchases: t.total / t.count,
            trend: 0, // Pode calcular inclinação
            count: t.count
        }));

        res.json(trends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar tendências' });
    }
});

// Analytics Avançado: Predição
router.get('/prediction', (req, res) => {
    try {
        const { income } = req.query; // Input do usuario (ex: meta de venda)

        // Regressão simples baseada em histórico de todos os users
        const avgTicket = db.prepare('SELECT AVG(amount) as val FROM transactions WHERE status="paid"').get().val || 0;

        // Se investirmos X (income no parametro do front é tratado como variavel independente), quanto retorna?
        // Lógica real: Retorno = Investimento * (Receita Total / Gasto Total)
        // Se não houver dados, assumimos retorno igual ao investimento (ROI 0%)

        const totalRevenue = db.prepare('SELECT SUM(amount) as val FROM transactions WHERE status="paid"').get().val || 0;
        // Precisamos saber quanto foi "gasto" para gerar essa receita. Como não temos tabela de custos de ads,
        // vamos usar o número de campanhas (campaigns table) ou apenas uma heurística baseada no tempo se não tivermos dados de custo.
        // Para ser "real" com os dados que temos: vamos assumir que o "investimento" é proporcional ao número de contatos adquiridos.
        // Custo por Lead (CPL) é desconhecido, mas podemos projetar baseado na receita média por contato.

        const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count || 1;
        const revenuePerContact = totalRevenue / totalContacts;

        // Se investirmos 'income' (R$), quantos contatos isso traria? (Assumindo CPL de R$ 5,00 padrão de mercado se não tiver histórico)
        const assumedCPL = 5.0;
        const projectedNewContacts = parseFloat(income || 0) / assumedCPL;
        const prediction = projectedNewContacts * revenuePerContact;

        res.json({
            prediction: Math.round(prediction)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro na predição' });
    }
});

module.exports = router;
