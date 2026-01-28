const express = require('express');
const router = express.Router();
const SeoAnalyzer = require('../services/SeoAnalyzer');
const SecurityMonitor = require('../services/SecurityMonitor');
const LLMService = require('../services/LLMService');

// SEO Analysis Endpoint
router.get('/seo/stats', async (req, res) => {
    try {
        // 1. Fetch Real Site Data
        const siteUrl = process.env.SITE_URL || 'http://localhost:4321';
        const analysis = await SeoAnalyzer.analyze(siteUrl);

        // 2. Enhance with AI
        const aiAnalysis = await LLMService.analyzeSEO(analysis);

        // 3. Combine Data
        const seoData = {
            ...analysis,
            ...aiAnalysis,
            // Ensure compatibility with frontend if needed
            recommendations: aiAnalysis.recommendations.map((rec, i) => ({ ...rec, id: i + 1 }))
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

        // 2. Enhance with AI
        const aiResult = await LLMService.analyzeSecurity(snapshot);

        // 3. Combine Data
        const auditData = {
            ...snapshot,
            ...aiResult
        };

        res.json(auditData);
    } catch (error) {
        console.error('Security Route Error:', error);
        res.status(500).json({ error: 'Erro ao processar auditoria de segurança' });
    }
});

module.exports = router;
