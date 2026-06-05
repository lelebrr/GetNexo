const express = require('express');
const router = express.Router();
const db = require('../db');

// Métricas do Dashboard
router.get('/dashboard-stats', (req, res) => {
    try {
        // Performance optimization: Combined sequential SUM and COUNT queries into one, reducing database roundtrips from 2 to 1 and avoiding redundant table scans.
        const stats24h = db.prepare(`
            SELECT SUM(amount) as total, COUNT(*) as count
            FROM transactions 
            WHERE created_at >= datetime('now', '-1 day') AND status = 'paid'
        `).get() || { total: 0, count: 0 };

        const revenue24h = { total: stats24h.total || 0 };
        const salesCount24h = { count: stats24h.count || 0 };

        // Clientes Ativos
        const activeCustomers = db.prepare(`
            SELECT COUNT(*) as count FROM contacts WHERE updated_at >= datetime('now', '-7 days')
        `).get();

        // Conversas Ativas (Últimas 24h)
        // Usando timestamp (se for unix seconds) ou created_at se houver
        // Assumindo timestamp em seconds como padrão do WA. Se for ms, ajustar.
        const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
        const activeChats = db.prepare(`
            SELECT COUNT(DISTINCT contact_id) as count 
            FROM messages 
            WHERE timestamp >= ?
        `).get(oneDayAgo);

        // Taxa de Conversão
        const conversionRate = activeCustomers.count > 0
            ? ((salesCount24h.count / activeCustomers.count) * 100).toFixed(2)
            : 0;

        // Chart Data (Hourly for last 24h)
        // 0-23h based on current time is complex in SQL alone for filling gaps.
        // We will fetch grouped data and fill gaps in JS.
        const trafficQuery = `
            SELECT strftime('%H', created_at) as hour, COUNT(*) as count
            FROM analytics_logs
            WHERE created_at >= datetime('now', '-1 day')
            GROUP BY hour
        `;
        const salesQuery = `
            SELECT strftime('%H', created_at) as hour, SUM(amount) as total
            FROM transactions
            WHERE created_at >= datetime('now', '-1 day') AND status = 'paid'
            GROUP BY hour
        `;

        const trafficData = db.prepare(trafficQuery).all();
        const salesData = db.prepare(salesQuery).all();

        // Merge and fill 24h
        const chartData = [];
        const currentHour = new Date().getHours();
        for (let i = 23; i >= 0; i--) {
            // Calculate hour label (e.g., if now is 14:00, i=0 -> 14:00, i=1 -> 13:00...)
            // Actually, let's just do 00-23 fixed or rolling 24h?
            // "24h Overview" usually implies rolling.
            // But simplified: 00 to 23 of "today" might be easier if matching UI expectations.
            // The UI shows 00:00 - 23:59. So it's a daily view.

            // Let's stick to 0-23h of the day logic for simplicity matching UI labels
            const hourStr = i.toString().padStart(2, '0');
            const tf = trafficData.find(d => d.hour === hourStr);
            const sl = salesData.find(d => d.hour === hourStr);

            chartData.unshift({
                hour: hourStr,
                visits: tf ? tf.count : 0,
                sales: sl ? sl.total : 0,
                height: tf ? Math.min(tf.count * 10, 100) : 0 // Simulated height relative to max? Handled in frontend usually
            });
        }

        // Recent Activity (Union of Sales and Leads)
        const recentActivity = db.prepare(`
            SELECT 'sale' as type, amount as value, created_at, 'Venda Aprovada' as title
            FROM transactions 
            WHERE status='paid' 
            ORDER BY created_at DESC LIMIT 5
        `).all();

        // Add some leads if needed or mix them
        const recentLeads = db.prepare(`
             SELECT 'lead' as type, 0 as value, created_at, 'Novo Lead' as title
             FROM contacts
             ORDER BY created_at DESC LIMIT 5
        `).all();

        // Combine and sort
        const activity = [...recentActivity, ...recentLeads]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);

        res.json({
            revenue24h: revenue24h.total || 0,
            salesCount24h: salesCount24h.count || 0,
            activeCustomers: activeCustomers.count || 0,
            activeChats: activeChats ? activeChats.count : 0,
            conversionRate: parseFloat(conversionRate),
            chartData,
            recentActivity: activity
        });
    } catch (error) {
        console.error('Stats error:', error);
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

// Listar Conversas Ativas
router.get('/active-chats', (req, res) => {
    try {
        // Obter conversas com mensagens nas últimas 24h
        // Assumindo timestamp em seconds
        const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;

        const query = `
            SELECT 
                c.id, c.name, c.profile_pic_url, c.funnel_stage, c.source,
                m.body as last_message, 
                m.timestamp as last_message_time,
                m.from_me
            FROM contacts c
            JOIN messages m ON c.id = m.contact_id
            WHERE m.timestamp = (
                SELECT MAX(timestamp) 
                FROM messages m2 
                WHERE m2.contact_id = c.id
            )
            AND m.timestamp >= ?
            ORDER BY m.timestamp DESC
        `;

        const chats = db.prepare(query).all(oneDayAgo);

        // Formatar dados para o frontend
        const formattedChats = chats.map(chat => {
            const now = Math.floor(Date.now() / 1000);
            const diff = now - chat.last_message_time;

            // Format wait time MM:SS
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const waitTime = `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;

            return {
                id: chat.id,
                name: chat.name || 'Desconhecido',
                avatar: chat.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || 'U')}&background=random`,
                last_message: chat.last_message,
                source: chat.source || (chat.id.length > 15 ? 'WhatsApp' : 'Web'), // Heuristic
                wait_time: waitTime,
                status: chat.from_me ? 'waiting_client' : 'waiting_agent', // Se última msg foi minha, espero cliente. Se foi dele, espera agente.
                agent: null // TODO: Implementar assignment
            };
        });

        res.json({ chats: formattedChats });
    } catch (error) {
        console.error('Active chats error:', error);
        res.status(500).json({ error: 'Erro ao carregar conversas ativas' });
    }
});

// Top Produtos
router.get('/top-products', (req, res) => {
    try {
        const { period = 'week' } = req.query; // Default to week to show more data potentially
        let dateFilter;

        if (period === 'month') dateFilter = '-30 days';
        else if (period === 'week') dateFilter = '-7 days';
        else dateFilter = '-1 day'; // today

        const query = `
            SELECT 
                p.id, p.name, p.category, p.image_url, p.stock,
                COUNT(t.id) as sales_count,
                SUM(t.amount) as revenue
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            WHERE t.created_at >= datetime('now', ?)
            AND t.status = 'paid'
            GROUP BY p.id
            ORDER BY sales_count DESC
            LIMIT 10
        `;

        try {
            // Validate if products table and transactions have correct relation
            // (Might fail if migration didn't run effectively in same process cycle, but usually ok)
            const products = db.prepare(query).all(dateFilter);
            res.json({ products });
        } catch (dbErr) {
            console.error('DB Query Error:', dbErr);
            // Fallback if transaction product_id not populated (legacy data)
            // We can return empty list
            res.json({ products: [] });
        }
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ error: 'Erro ao carregar top produtos' });
    }
});

module.exports = router;
