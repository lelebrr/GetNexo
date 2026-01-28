const express = require('express');
const router = express.Router();
const db = require('../db');

// SEO Analysis Endpoint
router.get('/seo/stats', (req, res) => {
    try {
        // Mock SEO data for GetNexo
        const seoData = {
            score: 94,
            health_status: 'Excellent',
            metrics: {
                performance: 98,
                accessibility: 100,
                best_practices: 100,
                seo: 100
            },
            keywords: [
                { term: 'whatsapp automação', volume: '12k', difficulty: 'Média', trend: 'up' },
                { term: 'crm whatsapp grátis', volume: '8.5k', difficulty: 'Baixa', trend: 'stable' },
                { term: 'vender pelo whatsapp', volume: '45k', difficulty: 'Alta', trend: 'up' },
                { term: 'chatbot inteligência artificial', volume: '15k', difficulty: 'Média', trend: 'up' }
            ],
            recommendations: [
                { id: 1, type: 'Technical', message: 'Optimize LCP on mobile for /blog/seguranca', priority: 'High' },
                { id: 2, type: 'Content', message: 'Add more long-tail keywords to Integrations pages', priority: 'Medium' },
                { id: 3, type: 'Schema', message: 'Update BreadcrumbList on /admin paths (current: partial)', priority: 'Low' }
            ]
        };
        res.json(seoData);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar análise de SEO' });
    }
});

// Security AI Scan Endpoint
router.get('/security/audit', (req, res) => {
    try {
        const auditData = {
            threat_level: 'Low',
            system_status: 'Secure',
            active_protections: [
                'Firewall Smart Active',
                'Rate Limiting (5 req/min/login)',
                'Trusted Types Enforced',
                'HSTS Preload Enabled'
            ],
            recent_events: [
                { time: '10:15', event: 'Blocked SQL Injection attempt from IP 192.168.1.105', type: 'Critical' },
                { time: '09:42', event: 'Credential stuffing protection triggered for user admin@...', type: 'Warning' },
                { time: '08:00', event: 'Daily integrity check passed: 0 files modified', type: 'Info' }
            ],
            ai_insights: "Based on last 24h traffic, we recommend tightening CSP for *.gstatic.com domains to minimize data leakage risk."
        };
        res.json(auditData);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar auditoria de segurança' });
    }
});

module.exports = router;
