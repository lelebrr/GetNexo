const express = require('express');
const router = express.Router();
const Series = require('../models/Series');
const Message = require('../models/Message');
const SeriesExecution = require('../models/SeriesExecution');
const ABTest = require('../models/ABTest');

/**
 * @route GET /api/series
 * @description Lista todas as séries
 * @access Private/Admin
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, createdBy } = req.query;

        const query = {};
        if (status) query.status = status;
        if (createdBy) query.createdBy = createdBy;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const series = await Series.find(query)
            .populate('createdBy', 'name email')
            .populate('abTest')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Series.countDocuments(query);

        res.json({
            success: true,
            data: series,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            },
            message: 'Séries encontradas com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar séries',
            error: error.message
        });
    }
});

/**
 * @route POST /api/series
 * @description Cria uma nova série
 * @access Private/Admin
 */
router.post('/', async (req, res) => {
    try {
        const seriesData = req.body;

        // Validação básica
        if (!seriesData.name || !seriesData.channels || seriesData.channels.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nome e canais são obrigatórios'
            });
        }

        // Define createdBy se não fornecido
        if (!seriesData.createdBy) {
            seriesData.createdBy = req.user ? req.user.id : null;
        }

        const series = new Series(seriesData);
        await series.save();

        await series.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            data: series,
            message: 'Série criada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao criar série:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar série',
            error: error.message
        });
    }
});

/**
 * @route GET /api/series/:id
 * @description Obtém uma série por ID
 * @access Private/Admin
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const series = await Series.findById(id)
            .populate('createdBy', 'name email')
            .populate('abTest')
            .populate({
                path: 'messages',
                populate: {
                    path: 'seriesId',
                    select: 'name'
                }
            });

        if (!series) {
            return res.status(404).json({
                success: false,
                message: 'Série não encontrada'
            });
        }

        res.json({
            success: true,
            data: series,
            message: 'Série encontrada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar série:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar série',
            error: error.message
        });
    }
});

/**
 * @route PUT /api/series/:id
 * @description Atualiza uma série
 * @access Private/Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const series = await Series.findById(id);
        if (!series) {
            return res.status(404).json({
                success: false,
                message: 'Série não encontrada'
            });
        }

        // Atualiza apenas campos permitidos
        const allowedUpdates = [
            'name', 'description', 'status', 'channels', 'targetAudience',
            'schedule', 'settings', 'n8nWorkflowId'
        ];

        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                series[field] = updates[field];
            }
        });

        await series.save();
        await series.populate('createdBy', 'name email');

        res.json({
            success: true,
            data: series,
            message: 'Série atualizada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar série:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar série',
            error: error.message
        });
    }
});

/**
 * @route DELETE /api/series/:id
 * @description Deleta uma série
 * @access Private/Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const series = await Series.findById(id);
        if (!series) {
            return res.status(404).json({
                success: false,
                message: 'Série não encontrada'
            });
        }

        // Verifica se há execuções ativas
        const activeExecutions = await SeriesExecution.countDocuments({
            seriesId: id,
            status: { $in: ['active', 'paused'] }
        });

        if (activeExecutions > 0) {
            return res.status(400).json({
                success: false,
                message: 'Não é possível deletar série com execuções ativas'
            });
        }

        // Remove mensagens associadas
        await Message.deleteMany({ seriesId: id });

        // Remove execuções
        await SeriesExecution.deleteMany({ seriesId: id });

        // Remove testes A/B
        await ABTest.deleteMany({ seriesId: id });

        // Remove a série
        await Series.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Série deletada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar série:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar série',
            error: error.message
        });
    }
});

/**
 * @route POST /api/series/:id/clone
 * @description Clona uma série
 * @access Private/Admin
 */
router.post('/:id/clone', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const originalSeries = await Series.findById(id);
        if (!originalSeries) {
            return res.status(404).json({
                success: false,
                message: 'Série não encontrada'
            });
        }

        // Clona a série
        const clonedSeries = new Series({
            ...originalSeries.toObject(),
            _id: undefined,
            name: name || `${originalSeries.name} (Cópia)`,
            description: description || originalSeries.description,
            status: 'draft',
            createdBy: req.user ? req.user.id : originalSeries.createdBy,
            analytics: {
                totalSent: 0,
                totalDelivered: 0,
                totalOpened: 0,
                totalClicked: 0,
                totalConverted: 0,
                conversionRate: 0
            }
        });

        await clonedSeries.save();

        // Clona as mensagens
        const messages = await Message.find({ seriesId: id });
        const clonedMessages = messages.map(msg => ({
            ...msg.toObject(),
            _id: undefined,
            seriesId: clonedSeries._id
        }));

        if (clonedMessages.length > 0) {
            await Message.insertMany(clonedMessages);
        }

        await clonedSeries.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            data: clonedSeries,
            message: 'Série clonada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao clonar série:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao clonar série',
            error: error.message
        });
    }
});

/**
 * @route POST /api/series/:id/start
 * @description Inicia uma série para usuários específicos
 * @access Private/Admin
 */
router.post('/:id/start', async (req, res) => {
    try {
        const { id } = req.params;
        const { userIds, variables } = req.body;

        const series = await Series.findById(id);
        if (!series) {
            return res.status(404).json({
                success: false,
                message: 'Série não encontrada'
            });
        }

        if (series.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Série deve estar ativa para ser iniciada'
            });
        }

        const executions = [];

        for (const userId of userIds) {
            // Verifica se já existe execução ativa
            const existingExecution = await SeriesExecution.findOne({
                seriesId: id,
                userId,
                status: { $in: ['active', 'paused'] }
            });

            if (existingExecution) {
                continue; // Pula se já existe execução ativa
            }

            const execution = new SeriesExecution({
                seriesId: id,
                userId,
                variables: variables || {},
                progress: {
                    totalSteps: series.messages.length
                }
            });

            await execution.save();
            executions.push(execution);
        }

        res.json({
            success: true,
            data: executions,
            message: `${executions.length} execuções iniciadas`
        });
    } catch (error) {
        console.error('Erro ao iniciar série:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao iniciar série',
            error: error.message
        });
    }
});

/**
 * @route GET /api/series/:id/analytics
 * @description Obtém analytics da série
 * @access Private/Admin
 */
router.get('/:id/analytics', async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        const series = await Series.findById(id);
        if (!series) {
            return res.status(404).json({
                success: false,
                message: 'Série não encontrada'
            });
        }

        const matchConditions = { seriesId: id };
        if (startDate || endDate) {
            matchConditions.createdAt = {};
            if (startDate) matchConditions.createdAt.$gte = new Date(startDate);
            if (endDate) matchConditions.createdAt.$lte = new Date(endDate);
        }

        const analytics = await SeriesExecution.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: null,
                    totalExecutions: { $sum: 1 },
                    activeExecutions: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    completedExecutions: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    convertedExecutions: {
                        $sum: { $cond: ['$analytics.converted', 1, 0] }
                    },
                    totalMessagesSent: { $sum: '$analytics.sentMessages' },
                    totalMessagesDelivered: { $sum: '$analytics.deliveredMessages' },
                    totalMessagesOpened: { $sum: '$analytics.openedMessages' },
                    totalMessagesClicked: { $sum: '$analytics.clickedMessages' },
                    avgEngagementRate: { $avg: '$engagementRate' },
                    totalConversionValue: { $sum: '$analytics.conversionValue' }
                }
            }
        ]);

        const result = analytics[0] || {
            totalExecutions: 0,
            activeExecutions: 0,
            completedExecutions: 0,
            convertedExecutions: 0,
            totalMessagesSent: 0,
            totalMessagesDelivered: 0,
            totalMessagesOpened: 0,
            totalMessagesClicked: 0,
            avgEngagementRate: 0,
            totalConversionValue: 0
        };

        result.conversionRate = result.totalExecutions > 0 ?
            (result.convertedExecutions / result.totalExecutions) * 100 : 0;

        res.json({
            success: true,
            data: result,
            message: 'Analytics obtidos com sucesso'
        });
    } catch (error) {
        console.error('Erro ao buscar analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar analytics',
            error: error.message
        });
    }
});

module.exports = router;