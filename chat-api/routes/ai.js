const express = require('express');
const router = express.Router();
const db = require('../db');
const SeoAnalyzer = require('../services/SeoAnalyzer');
const SecurityMonitor = require('../services/SecurityMonitor');
const LLMService = require('../services/LLMService');

// SEO Analysis Endpoint
router.get('/seo/stats', async (req, res) => {
    try {
        // 1. Fetch Real Site Data
        const siteUrl = process.env.SITE_URL || 'http://localhost:4321'; // URL do frontend
        const analysis = await SeoAnalyzer.analyze(siteUrl);

        // 2. Enhance with AI (DeepSeek)
        const aiAnalysis = await LLMService.analyzeSEO(analysis);

        // 3. Combine Data
        const seoData = {
            score: analysis.score,
            health_status: analysis.health_status,
            metrics: {
                performance: Math.max(0, 100 - (analysis.loadTime / 100)), // Crude metric
                accessibility: 100 - (analysis.images.missing_alt * 5),
                best_practices: 95,
                seo: analysis.score
            },
            keywords: [
                { term: 'getnexo', volume: 'N/A', difficulty: 'Low', trend: 'stable' },
                { term: analysis.title ? analysis.title.split(' ')[0] : 'platform', volume: 'Est.', difficulty: 'Medium', trend: 'up' }
            ],
            recommendations: aiAnalysis.recommendations.map((rec, i) => ({ ...rec, id: i + 1 })),
            summary: aiAnalysis.summary
        };

        res.json(seoData);
    } catch (error) {
        console.error('SEO Route Error:', error);
        res.status(500).json({ error: 'Erro ao processar análise de SEO' });
    }
});

// Security AI Scan Endpoint
router.get('/security/audit', async (req, res) => {
    try {
        // 1. Get Real Security Snapshot
        const snapshot = SecurityMonitor.getSecuritySnapshot();

        // 2. Enhance with AI (Google/Gemini)
        const aiInsight = await LLMService.analyzeSecurity(snapshot);

        const auditData = {
            ...snapshot,
            ai_insights: aiInsight
        };

        res.json(auditData);
    } catch (error) {
        console.error('Security Route Error:', error);
        res.status(500).json({ error: 'Erro ao processar auditoria de segurança' });
    }
});

module.exports = router;
