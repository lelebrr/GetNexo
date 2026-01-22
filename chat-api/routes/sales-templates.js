const express = require('express');
const router = express.Router();
const SalesTemplate = require('../models/SalesTemplate');
const SalesTemplateService = require('../services/SalesTemplateService');
const adminAuth = require('../middleware/adminAuth');

// Middleware para verificar autenticação
const requireAuth = adminAuth;

// Listar todos os templates
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const category = req.query.category;
        const search = req.query.search;

        let query = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Se não for admin, mostrar apenas templates próprios ou públicos
        if (!req.user?.isAdmin && !req.userId?.endsWith('_admin')) {
            query.$or = [
                { createdBy: userId },
                { isPublic: true }
            ];
        }

        const templates = await SalesTemplate.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .populate('createdBy', 'name email');

        const total = await SalesTemplate.countDocuments(query);

        res.json({
            templates,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao listar templates:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter templates pré-definidos
router.get('/predefined', requireAuth, async (req, res) => {
    try {
        const predefinedFlows = SalesTemplateService.getPredefinedFlows();

        // Converter para formato de template
        const predefinedTemplates = Object.keys(predefinedFlows).map(type => ({
            id: type,
            name: predefinedFlows[type].name,
            description: predefinedFlows[type].description,
            category: predefinedFlows[type].category,
            placeholders: predefinedFlows[type].placeholders || []
        }));

        res.json({ templates: predefinedTemplates });
    } catch (error) {
        console.error('Erro ao obter templates pré-definidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Criar template a partir de pré-definido
router.post('/predefined/:type', requireAuth, async (req, res) => {
    try {
        const { type } = req.params;
        const userId = req.user?.id || req.userId;
        const customizations = req.body;

        const template = await SalesTemplateService.createPredefinedTemplate(type, userId, customizations);

        res.status(201).json(template);
    } catch (error) {
        console.error('Erro ao criar template pré-definido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter template específico
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const template = await SalesTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        // Verificar permissões
        if (!req.user?.isAdmin && !req.userId?.endsWith('_admin') &&
            template.createdBy.toString() !== userId && !template.isPublic) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json(template);
    } catch (error) {
        console.error('Erro ao obter template:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Criar novo template personalizado
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const templateData = {
            ...req.body,
            createdBy: userId
        };

        const template = new SalesTemplate(templateData);
        await template.save();

        res.status(201).json(template);
    } catch (error) {
        console.error('Erro ao criar template:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar template
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const template = await SalesTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        // Verificar permissões
        if (!req.user?.isAdmin && !req.userId?.endsWith('_admin') &&
            template.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const updates = req.body;
        const updatedTemplate = await SalesTemplate.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json(updatedTemplate);
    } catch (error) {
        console.error('Erro ao atualizar template:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Excluir template
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const template = await SalesTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        // Verificar permissões
        if (!req.user?.isAdmin && !req.userId?.endsWith('_admin') &&
            template.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        await SalesTemplate.findByIdAndDelete(req.params.id);

        res.json({ message: 'Template excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir template:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Clonar template
router.post('/:id/clone', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const originalTemplate = await SalesTemplate.findById(req.params.id);

        if (!originalTemplate) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        const clonedData = {
            ...originalTemplate.toObject(),
            _id: undefined,
            name: `${originalTemplate.name} (Cópia)`,
            createdBy: userId,
            createdAt: undefined,
            updatedAt: undefined,
            usageCount: 0
        };

        const clonedTemplate = new SalesTemplate(clonedData);
        await clonedTemplate.save();

        res.json(clonedTemplate);
    } catch (error) {
        console.error('Erro ao clonar template:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Exportar template
router.get('/:id/export', requireAuth, async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const template = await SalesTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        // Verificar permissões
        if (!req.user?.isAdmin && !req.userId?.endsWith('_admin') &&
            template.createdBy.toString() !== userId && !template.isPublic) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Preparar dados para exportação (remover campos sensíveis)
        const exportData = {
            name: template.name,
            description: template.description,
            category: template.category,
            flow: template.flow,
            placeholders: template.placeholders,
            settings: template.settings,
            exportedAt: new Date()
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="template_${template._id}.json"`);
        res.json(exportData);
    } catch (error) {
        console.error('Erro ao exportar template:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Executar template
router.post('/:id/execute', requireAuth, async (req, res) => {
    try {
        const { userId, context = {}, channel = 'whatsapp' } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId é obrigatório' });
        }

        const execution = await SalesTemplateService.executeTemplate(
            req.params.id,
            userId,
            context,
            channel
        );

        res.json(execution);
    } catch (error) {
        console.error('Erro ao executar template:', error);

        if (error.message === 'Template não encontrado' || error.message === 'Template está inativo') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter analytics do template
router.get('/:id/analytics', requireAuth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user?.id || req.userId;

        const template = await SalesTemplate.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ error: 'Template não encontrado' });
        }

        // Verificar permissões
        if (!req.user?.isAdmin && !req.userId?.endsWith('_admin') &&
            template.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
        const end = endDate ? new Date(endDate) : new Date();

        const analytics = await SalesTemplateService.getTemplateAnalytics(
            req.params.id,
            start,
            end
        );

        res.json(analytics);
    } catch (error) {
        console.error('Erro ao obter analytics:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;