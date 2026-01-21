const express = require('express');
const router = express.Router();
const userClusteringService = require('../services/UserClusteringService');
const UserBehavior = require('../models/UserBehavior');
const BehavioralTag = require('../models/BehavioralTag');
const BehaviorRule = require('../models/BehaviorRule');

/**
 * POST /api/clustering/run
 * Executa clustering completo dos usuários
 */
router.post('/run', async (req, res) => {
    try {
        const options = req.body || {};

        console.log('[ClusteringAPI] Running clustering with options:', options);

        const result = await userClusteringService.performClustering(options);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error running clustering:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/clustering/stats
 * Obtém estatísticas do último clustering
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = userClusteringService.getLastClusteringStats();

        if (!stats) {
            return res.json({
                success: true,
                data: null,
                message: 'No clustering data available'
            });
        }

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error getting stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/clustering/clusters
 * Lista estatísticas de todos os clusters
 */
router.get('/clusters', async (req, res) => {
    try {
        const clusterStats = await UserBehavior.getClusterStats();

        res.json({
            success: true,
            data: clusterStats
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error getting cluster stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/clustering/clusters/:clusterId
 * Detalhes de um cluster específico
 */
router.get('/clusters/:clusterId', async (req, res) => {
    try {
        const clusterId = parseInt(req.params.clusterId);
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const users = await UserBehavior.findByCluster(clusterId, { limit, offset });
        const stats = await UserBehavior.getClusterStats();
        const clusterStat = stats.find(s => s.cluster_id === clusterId);

        res.json({
            success: true,
            data: {
                clusterId,
                stats: clusterStat,
                users: users.map(u => ({
                    user_id: u.user_id,
                    engagement_score: u.engagement_score,
                    conversion_probability: u.conversion_probability,
                    churn_risk: u.churn_risk,
                    total_sessions: u.total_sessions,
                    total_time_spent: u.total_time_spent
                })),
                totalUsers: users.length
            }
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error getting cluster details:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/clustering/predict
 * Prediz cluster para um novo perfil de usuário
 */
router.post('/predict', async (req, res) => {
    try {
        const { userProfile } = req.body;

        if (!userProfile) {
            return res.status(400).json({
                success: false,
                error: 'userProfile is required'
            });
        }

        const prediction = userClusteringService.predictCluster(userProfile);

        if (!prediction) {
            return res.status(400).json({
                success: false,
                error: 'Unable to predict cluster for this profile'
            });
        }

        res.json({
            success: true,
            data: prediction
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error predicting cluster:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/clustering/optimize
 * Otimiza número de clusters usando método do cotovelo
 */
router.post('/optimize', async (req, res) => {
    try {
        const options = req.body || {};

        console.log('[ClusteringAPI] Optimizing clusters with options:', options);

        const result = await userClusteringService.optimizeClusters();

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error optimizing clusters:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/clustering/high-conversion
 * Busca usuários com alta probabilidade de conversão
 */
router.get('/high-conversion', async (req, res) => {
    try {
        const minProbability = parseInt(req.query.minProbability) || 70;
        const limit = parseInt(req.query.limit) || 50;

        const users = await UserBehavior.findHighConversionProbability(minProbability, limit);

        res.json({
            success: true,
            data: users.map(u => ({
                user_id: u.user_id,
                engagement_score: u.engagement_score,
                conversion_probability: u.conversion_probability,
                churn_risk: u.churn_risk,
                total_sessions: u.total_sessions,
                total_time_spent: u.total_time_spent,
                interests: u.interests,
                favorite_pages: u.favorite_pages
            })),
            count: users.length
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error getting high conversion users:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/clustering/behavioral-tags
 * Lista todas as tags comportamentais ativas
 */
router.get('/behavioral-tags', async (req, res) => {
    try {
        const tags = await BehavioralTag.findAll();

        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error getting behavioral tags:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/clustering/behavioral-tags
 * Cria nova tag comportamental
 */
router.post('/behavioral-tags', async (req, res) => {
    try {
        const tagData = req.body;

        if (!tagData.name || !tagData.rules) {
            return res.status(400).json({
                success: false,
                error: 'name and rules are required'
            });
        }

        const tag = await BehavioralTag.create(tagData);

        res.json({
            success: true,
            data: tag
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error creating behavioral tag:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/clustering/behavioral-tags/:id
 * Atualiza tag comportamental
 */
router.put('/behavioral-tags/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        const updateData = req.body;

        const success = await BehavioralTag.update(tagId, updateData);

        if (success) {
            const updatedTag = await BehavioralTag.findById(tagId);
            res.json({
                success: true,
                data: updatedTag
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Tag not found'
            });
        }
    } catch (error) {
        console.error('[ClusteringAPI] Error updating behavioral tag:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/clustering/behavioral-tags/:id
 * Remove tag comportamental
 */
router.delete('/behavioral-tags/:id', async (req, res) => {
    try {
        const tagId = req.params.id;

        const success = await BehavioralTag.delete(tagId);

        res.json({
            success: success,
            message: success ? 'Tag deleted successfully' : 'Tag not found'
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error deleting behavioral tag:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/clustering/behavior-rules
 * Lista regras de comportamento
 */
router.get('/behavior-rules', async (req, res) => {
    try {
        const rules = await BehaviorRule.findAll();

        res.json({
            success: true,
            data: rules
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error getting behavior rules:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/clustering/behavior-rules
 * Cria nova regra de comportamento
 */
router.post('/behavior-rules', async (req, res) => {
    try {
        const ruleData = req.body;

        if (!ruleData.name || !ruleData.conditions) {
            return res.status(400).json({
                success: false,
                error: 'name and conditions are required'
            });
        }

        const rule = await BehaviorRule.create(ruleData);

        res.json({
            success: true,
            data: rule
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error creating behavior rule:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /api/clustering/behavior-rules/:id
 * Atualiza regra de comportamento
 */
router.put('/behavior-rules/:id', async (req, res) => {
    try {
        const ruleId = req.params.id;
        const updateData = req.body;

        const success = await BehaviorRule.update(ruleId, updateData);

        if (success) {
            const updatedRule = await BehaviorRule.findById(ruleId);
            res.json({
                success: true,
                data: updatedRule
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Rule not found'
            });
        }
    } catch (error) {
        console.error('[ClusteringAPI] Error updating behavior rule:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * DELETE /api/clustering/behavior-rules/:id
 * Remove regra de comportamento
 */
router.delete('/behavior-rules/:id', async (req, res) => {
    try {
        const ruleId = req.params.id;

        const success = await BehaviorRule.delete(ruleId);

        res.json({
            success: success,
            message: success ? 'Rule deleted successfully' : 'Rule not found'
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error deleting behavior rule:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/clustering/apply-tags
 * Aplica tags comportamentais automaticamente
 */
router.post('/apply-tags', async (req, res) => {
    try {
        const { userIds } = req.body;

        if (!Array.isArray(userIds)) {
            return res.status(400).json({
                success: false,
                error: 'userIds must be an array'
            });
        }

        // Importar serviço de tracking comportamental
        const BehavioralTrackingService = require('../services/BehavioralTrackingService');

        let appliedCount = 0;
        const results = [];

        for (const userId of userIds) {
            try {
                const result = await BehavioralTrackingService.applyBehavioralTags(userId);
                results.push({ userId, success: true, tagsApplied: result.tagsApplied });
                appliedCount += result.tagsApplied.length;
            } catch (error) {
                results.push({ userId, success: false, error: error.message });
            }
        }

        res.json({
            success: true,
            data: {
                processedUsers: results.length,
                totalTagsApplied: appliedCount,
                results
            }
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error applying tags:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/clustering/trigger-offers
 * Dispara ofertas baseadas em tags comportamentais
 */
router.post('/trigger-offers', async (req, res) => {
    try {
        const { tagNames, offerType, offerData } = req.body;

        if (!Array.isArray(tagNames) || !offerType) {
            return res.status(400).json({
                success: false,
                error: 'tagNames (array) and offerType are required'
            });
        }

        // Importar serviço de tracking comportamental
        const BehavioralTrackingService = require('../services/BehavioralTrackingService');

        const results = await BehavioralTrackingService.triggerOffersByTags(tagNames, offerType, offerData);

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('[ClusteringAPI] Error triggering offers:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;