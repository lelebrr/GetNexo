/**
 * Rotas de IA para chat inteligente
 * Endpoints:
 * - POST /reply - Resposta inteligente com fallback
 * - GET /acerto-stats - Estatísticas por IA (pizza chart)
 * - GET /acerto-diario - Taxa por dia (line chart)
 * - GET /comparativo-diario - Comparativo entre IAs
 */

const express = require('express');
const router = express.Router();
const MultiAIService = require('../services/MultiAIService');

// Middleware para extrair client_id do JWT
const getClientId = (req) => {
    return req.user?.id || req.user?.email || req.body?.client_id || 'anonymous';
};

/**
 * POST /api/ia/reply
 * Resposta inteligente com fallback automático
 */
router.post('/reply', async (req, res) => {
    try {
        const { message } = req.body;
        const clientId = getClientId(req);

        if (!message) {
            return res.status(400).json({ error: 'Campo message é obrigatório' });
        }

        const result = await MultiAIService.getReply(message, clientId);
        res.json(result);
    } catch (err) {
        console.error('Erro /ia/reply:', err);
        res.status(500).json({ error: 'Erro ao processar resposta IA', details: err.message });
    }
});

/**
 * GET /api/ia/acerto-stats
 * Estatísticas de acerto por IA (pizza chart)
 */
router.get('/acerto-stats', (req, res) => {
    try {
        const clientId = getClientId(req);
        const stats = MultiAIService.getAccuracyStats(clientId);
        res.json(stats);
    } catch (err) {
        console.error('Erro /ia/acerto-stats:', err);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

/**
 * GET /api/ia/acerto-diario
 * Taxa de acerto por dia (line chart)
 */
router.get('/acerto-diario', (req, res) => {
    try {
        const clientId = getClientId(req);
        const data = MultiAIService.getDailyAccuracy(clientId);
        res.json(data);
    } catch (err) {
        console.error('Erro /ia/acerto-diario:', err);
        res.status(500).json({ error: 'Erro ao buscar estatísticas diárias' });
    }
});

/**
 * GET /api/ia/comparativo-diario
 * Comparativo de acerto por IA por dia
 */
router.get('/comparativo-diario', (req, res) => {
    try {
        const clientId = getClientId(req);
        const data = MultiAIService.getComparativeDaily(clientId);
        res.json(data);
    } catch (err) {
        console.error('Erro /ia/comparativo-diario:', err);
        res.status(500).json({ error: 'Erro ao buscar comparativo' });
    }
});

module.exports = router;
