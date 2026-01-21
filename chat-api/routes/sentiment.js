const express = require('express');
const router = express.Router();
const SentimentAnalysisService = require('../services/SentimentAnalysisService');
const SentimentAnalysis = require('../models/SentimentAnalysis');
const Ticket = require('../models/Ticket');

/**
 * @route POST /api/sentiment/analyze
 * @description Analisa texto e retorna pontuação de sentimento
 * @access Public
 */
router.post('/analyze', async (req, res) => {
    try {
        const { text, ticketId, messageId, options = {} } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Texto é obrigatório'
            });
        }

        let result;

        if (ticketId) {
            result = await SentimentAnalysisService.analyzeTicket(ticketId, text, options);
        } else if (messageId) {
            result = await SentimentAnalysisService.analyzeMessage(messageId, text, null, options);
        } else {
            result = await SentimentAnalysisService.analyzeText(text, options);
        }

        res.json({
            success: true,
            data: result,
            message: 'Análise de sentimento realizada com sucesso'
        });
    } catch (error) {
        console.error('Erro na análise de sentimento:', error);
        res.status(500).json({
            success: false,
            message: 'Erro na análise de sentimento',
            error: error.message
        });
    }
});

/**
 * @route POST /api/sentiment/analyze/batch
 * @description Analisa múltiplos textos em lote
 * @access Public
 */
router.post('/analyze/batch', async (req, res) => {
    try {
        const { texts, options = {} } = req.body;

        if (!Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Array de textos é obrigatório'
            });
        }

        const results = await SentimentAnalysisService.batchAnalyze(texts, options);

        res.json({
            success: true,
            data: results,
            message: 'Análise em lote realizada com sucesso'
        });
    } catch (error) {
        console.error('Erro na análise em lote:', error);
        res.status(500).json({
            success: false,
            message: 'Erro na análise em lote',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/analysis/:id
 * @description Obtém análise de sentimento por ID
 * @access Public
 */
router.get('/analysis/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const analysis = await SentimentAnalysis.findById(id)
            .populate('ticketId')
            .populate('agentId')
            .populate('productId');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada'
            });
        }

        res.json({
            success: true,
            data: analysis,
            message: 'Análise encontrada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar análise:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar análise',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/analysis/ticket/:ticketId
 * @description Obtém análises de sentimento de um ticket
 * @access Public
 */
router.get('/analysis/ticket/:ticketId', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        const analyses = await SentimentAnalysis.find({ ticketId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('agentId')
            .populate('productId');

        const total = await SentimentAnalysis.countDocuments({ ticketId });

        res.json({
            success: true,
            data: analyses,
            pagination: {
                total,
                limit: parseInt(limit),
                skip: parseInt(skip),
                pages: Math.ceil(total / parseInt(limit))
            },
            message: 'Análises encontradas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar análises do ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar análises do ticket',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/metrics
 * @description Obtém métricas de dashboard
 * @access Public
 */
router.get('/dashboard/metrics', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department, sentiment } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;
        if (sentiment) filters.sentiment = sentiment;

        const metrics = await SentimentAnalysisService.getDashboardMetrics(filters);

        res.json({
            success: true,
            data: metrics,
            message: 'Métricas de dashboard obtidas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar métricas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar métricas',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/metrics-by-agent
 * @description Obtém métricas por agente
 * @access Public
 */
router.get('/dashboard/metrics-by-agent', async (req, res) => {
    try {
        const { startDate, endDate, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const metrics = await SentimentAnalysisService.getMetricsByAgent(filters);

        res.json({
            success: true,
            data: metrics,
            message: 'Métricas por agente obtidas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar métricas por agente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar métricas por agente',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/metrics-by-product
 * @description Obtém métricas por produto
 * @access Public
 */
router.get('/dashboard/metrics-by-product', async (req, res) => {
    try {
        const { startDate, endDate, agentId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (department) filters.department = department;

        const metrics = await SentimentAnalysisService.getMetricsByProduct(filters);

        res.json({
            success: true,
            data: metrics,
            message: 'Métricas por produto obtidas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar métricas por produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar métricas por produto',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/effectiveness
 * @description Obtém relatório de eficácia do suporte
 * @access Public
 */
router.get('/dashboard/effectiveness', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const report = await SentimentAnalysisService.getSupportEffectivenessReport(filters);

        res.json({
            success: true,
            data: report,
            message: 'Relatório de eficácia obtido com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar relatório de eficácia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar relatório de eficácia',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/time-series
 * @description Obtém dados de série temporal
 * @access Public
 */
router.get('/dashboard/time-series', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const timeSeries = await SentimentAnalysisService.getTimeSeriesData(filters);

        res.json({
            success: true,
            data: timeSeries,
            message: 'Dados de série temporal obtidos com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar série temporal:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar série temporal',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/distribution
 * @description Obtém distribuição de sentimentos
 * @access Public
 */
router.get('/dashboard/distribution', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const distribution = await SentimentAnalysisService.getSentimentDistribution(filters);

        res.json({
            success: true,
            data: distribution,
            message: 'Distribuição de sentimentos obtida com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar distribuição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar distribuição',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/alerts
 * @description Obtém estatísticas de alertas
 * @access Public
 */
router.get('/dashboard/alerts', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const alerts = await SentimentAnalysisService.getAlertStatistics(filters);

        res.json({
            success: true,
            data: alerts,
            message: 'Estatísticas de alertas obtidas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas de alertas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas de alertas',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/rewards
 * @description Obtém estatísticas de recompensas
 * @access Public
 */
router.get('/dashboard/rewards', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const rewards = await SentimentAnalysisService.getRewardStatistics(filters);

        res.json({
            success: true,
            data: rewards,
            message: 'Estatísticas de recompensas obtidas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas de recompensas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas de recompensas',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/trend
 * @description Obtém tendência de sentimentos
 * @access Public
 */
router.get('/dashboard/trend', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const trend = await SentimentAnalysisService.getSentimentTrend(filters);

        res.json({
            success: true,
            data: trend,
            message: 'Tendência de sentimentos obtida com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar tendência:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar tendência',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/dashboard/general-stats
 * @description Obtém estatísticas gerais
 * @access Public
 */
router.get('/dashboard/general-stats', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;

        const stats = await SentimentAnalysisService.getGeneralStats(filters);

        res.json({
            success: true,
            data: stats,
            message: 'Estatísticas gerais obtidas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas gerais:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas gerais',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/config/thresholds
 * @description Obtém thresholds configuráveis
 * @access Public
 */
router.get('/config/thresholds', async (req, res) => {
    try {
        const thresholds = SentimentAnalysisService.getThresholds();

        res.json({
            success: true,
            data: thresholds,
            message: 'Thresholds obtidos com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar thresholds:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar thresholds',
            error: error.message
        });
    }
});

/**
 * @route PUT /api/sentiment/config/thresholds
 * @description Atualiza thresholds configuráveis
 * @access Public
 */
router.put('/config/thresholds', async (req, res) => {
    try {
        const { thresholds } = req.body;

        if (!thresholds) {
            return res.status(400).json({
                success: false,
                message: 'Thresholds são obrigatórios'
            });
        }

        const updatedThresholds = SentimentAnalysisService.updateThresholds(thresholds);

        res.json({
            success: true,
            data: updatedThresholds,
            message: 'Thresholds atualizados com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar thresholds:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar thresholds',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/config/reward-types
 * @description Obtém tipos de recompensa configuráveis
 * @access Public
 */
router.get('/config/reward-types', async (req, res) => {
    try {
        const rewardTypes = SentimentAnalysisService.getRewardTypes();

        res.json({
            success: true,
            data: rewardTypes,
            message: 'Tipos de recompensa obtidos com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar tipos de recompensa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar tipos de recompensa',
            error: error.message
        });
    }
});

/**
 * @route PUT /api/sentiment/config/reward-types
 * @description Atualiza tipos de recompensa configuráveis
 * @access Public
 */
router.put('/config/reward-types', async (req, res) => {
    try {
        const { rewardTypes } = req.body;

        if (!rewardTypes) {
            return res.status(400).json({
                success: false,
                message: 'Tipos de recompensa são obrigatórios'
            });
        }

        const updatedRewardTypes = SentimentAnalysisService.updateRewardTypes(rewardTypes);

        res.json({
            success: true,
            data: updatedRewardTypes,
            message: 'Tipos de recompensa atualizados com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar tipos de recompensa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar tipos de recompensa',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/config/sentiment-ranges
 * @description Obtém ranges de sentimentos
 * @access Public
 */
router.get('/config/sentiment-ranges', async (req, res) => {
    try {
        const sentimentRanges = SentimentAnalysisService.getSentimentRanges();

        res.json({
            success: true,
            data: sentimentRanges,
            message: 'Ranges de sentimentos obtidos com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar ranges de sentimentos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar ranges de sentimentos',
            error: error.message
        });
    }
});

/**
 * @route GET /api/sentiment/export
 * @description Exporta dados de análise para relatório
 * @access Public
 */
router.get('/export', async (req, res) => {
    try {
        const { startDate, endDate, agentId, productId, department, sentiment } = req.query;

        const filters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (agentId) filters.agentId = agentId;
        if (productId) filters.productId = productId;
        if (department) filters.department = department;
        if (sentiment) filters.sentiment = sentiment;

        const data = await SentimentAnalysisService.exportData(filters);

        res.json({
            success: true,
            data: data,
            message: 'Dados exportados com sucesso'
        });
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao exportar dados',
            error: error.message
        });
    }
});

/**
 * @route PUT /api/sentiment/analysis/:id
 * @description Atualiza análise de sentimento
 * @access Public
 */
router.put('/analysis/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const analysis = await SentimentAnalysis.findById(id);
        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada'
            });
        }

        const updatedAnalysis = await analysis.updateAnalysis(updates);

        res.json({
            success: true,
            data: updatedAnalysis,
            message: 'Análise atualizada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar análise:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar análise',
            error: error.message
        });
    }
});

/**
 * @route DELETE /api/sentiment/analysis/:id
 * @description Deleta análise de sentimento
 * @access Public
 */
router.delete('/analysis/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const analysis = await SentimentAnalysis.findById(id);
        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada'
            });
        }

        analysis.isArchived = true;
        await analysis.save();

        res.json({
            success: true,
            data: { id },
            message: 'Análise arquivada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar análise:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar análise',
            error: error.message
        });
    }
});

module.exports = router;
