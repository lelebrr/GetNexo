const express = require('express');
const router = express.Router();
const db = require('../db');
const jwtAuth = require('../middleware/jwtAuth');

router.use(jwtAuth);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

// Client Dashboard Stats
router.get('/dashboard', (req, res) => {
    const userId = req.userId; // Assuming Client ID is extracted from token

    try {
        // 1. Sales Today (Assuming 'transactions' table has 'user_id' or we link via contacts)
        // For a specific client user context, we might filter by their own purchases if they are an end-user,
        // OR if this "Client Dashboard" is for a business owner using the SaaS:
        // "Client" here seems to be the "Business Owner" using our SaaS.
        // So we filter data by... nothing? Or by their 'tenant_id'?
        // The current schema seems single-tenant or shared without strict separation in some queries seen earlier.
        // But let's assume 'transactions' are global for the SaaS owner/client.

        // If this is a Tenant Dashboard (User is a generic Client of GetNexo):
        // We link data to them. Assuming global for now based on 'analytics.js' patterns.

        // Sales Today
        const salesToday = db.prepare(`
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE created_at >= datetime('now', 'start of day') AND status = 'paid'
        `).get().total || 0;

        // Sales Yesterday (for trend)
        const salesYesterday = db.prepare(`
            SELECT SUM(amount) as total 
            FROM transactions 
            WHERE created_at >= datetime('now', 'start of day', '-1 day') 
            AND created_at < datetime('now', 'start of day') 
            AND status = 'paid'
        `).get().total || 0;

        const salesTrend = salesYesterday > 0
            ? Math.round(((salesToday - salesYesterday) / salesYesterday) * 100)
            : (salesToday > 0 ? 100 : 0);

        // 2. Active Chats (Last 24h)
        const activeChats = db.prepare(`
            SELECT COUNT(DISTINCT contact_id) as count 
            FROM messages 
            WHERE timestamp >= ?
        `).get(Math.floor(Date.now() / 1000) - 86400).count || 0;

        // 3. New Leads (Last 7 days vs Previous 7 days)
        const newLeads = db.prepare(`
            SELECT COUNT(*) as count 
            FROM contacts 
            WHERE created_at >= datetime('now', '-7 days')
        `).get().count || 0;

        const prevLeads = db.prepare(`
            SELECT COUNT(*) as count 
            FROM contacts 
            WHERE created_at >= datetime('now', '-14 days') AND created_at < datetime('now', '-7 days')
        `).get().count || 0;

        const leadsTrend = prevLeads > 0
            ? Math.round(((newLeads - prevLeads) / prevLeads) * 100)
            : (newLeads > 0 ? 100 : 0);

        // 4. ROI (Mock calculation for now as we don't have ad spend cost)
        // Using average order value as a proxy? Or fixed 0 for now.
        const roi = 0;

        // 5. Recent Activity
        const recentActivity = db.prepare(`
            SELECT 'sale' as type, amount as value, created_at as time, 'Nova Venda' as text, '💰' as icon
            FROM transactions 
            WHERE status='paid' 
            ORDER BY created_at DESC LIMIT 5
        `).all();

        // 6. Active Modules (Mocked or simple check if we have toggles)
        const modules = [
            { id: 1, icon: '🤖', name: 'Chatbot IA', description: 'Ativo', status: 'active' },
            { id: 2, icon: '💬', name: 'Multi-Atendimento', description: 'Ativo', status: 'active' }
        ];

        // 7. Alerts
        const alerts = [];
        if (activeChats > 50) alerts.push({ id: 1, type: 'warning', icon: '⚠️', message: 'Volume alto de conversas' });

        res.json({
            stats: {
                salesToday: salesToday,
                activeChats: activeChats,
                newLeads: newLeads,
                roi: roi,
                trends: {
                    sales: salesTrend,
                    leads: leadsTrend
                }
            },
            recentActivity: recentActivity.map(a => ({
                ...a,
                time: new Date(a.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            })),
            modules,
            alerts
        });

    } catch (error) {
        console.error('Client dashboard error:', error);
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
});

module.exports = router;
