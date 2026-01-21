const express = require('express');
const router = express.Router();
const MagicReply = require('../models/MagicReply');
const MagicReplyService = require('../services/MagicReplyService');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Buscar sugestões para um ticket
router.get('/suggestions/:ticketId', auth, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message, customerData } = req.query;

        // Buscar dados do cliente do banco se não fornecidos
        let customerInfo = customerData ? JSON.parse(customerData) : {};

        if (!customerInfo.name && req.user) {
            // Buscar dados do usuário logado como cliente
            customerInfo = {
                userId: req.user._id,
                name: req.user.name,
                email: req.user.email,
                value: 'medium' // Valor padrão
            };
        }

        const suggestions = await MagicReplyService.getSuggestions(ticketId, message, customerInfo);

        res.json(suggestions);
    } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Registrar uso de sugestão
router.post('/use/:ticketId', auth, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { magicReplyId, suggestionText, effectiveness } = req.body;

        await MagicReplyService.logSuggestionUsed(ticketId, magicReplyId, suggestionText, effectiveness);

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao registrar uso:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ADMIN ROUTES - abaixo requer autenticação de admin

// Listar todos os Magic Replies
router.get('/', adminAuth, async (req, res) => {
    try {
        const magicReplies = await MagicReply.find({})
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(magicReplies);
    } catch (error) {
        console.error('Erro ao listar Magic Replies:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Buscar Magic Reply por ID
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const magicReply = await MagicReply.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!magicReply) {
            return res.status(404).json({ error: 'Magic Reply não encontrado' });
        }

        res.json(magicReply);
    } catch (error) {
        console.error('Erro ao buscar Magic Reply:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Criar novo Magic Reply
router.post('/', adminAuth, async (req, res) => {
    try {
        const magicReplyData = {
            ...req.body,
            createdBy: req.user._id,
            lastModifiedBy: req.user._id
        };

        const magicReply = new MagicReply(magicReplyData);
        await magicReply.save();

        res.status(201).json(magicReply);
    } catch (error) {
        console.error('Erro ao criar Magic Reply:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar Magic Reply
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            lastModifiedBy: req.user._id
        };

        const magicReply = await MagicReply.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!magicReply) {
            return res.status(404).json({ error: 'Magic Reply não encontrado' });
        }

        res.json(magicReply);
    } catch (error) {
        console.error('Erro ao atualizar Magic Reply:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Excluir Magic Reply
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const magicReply = await MagicReply.findByIdAndDelete(req.params.id);

        if (!magicReply) {
            return res.status(404).json({ error: 'Magic Reply não encontrado' });
        }

        res.json({ message: 'Magic Reply excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir Magic Reply:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter estatísticas de efetividade
router.get('/:id/stats', adminAuth, async (req, res) => {
    try {
        const stats = await MagicReplyService.getEffectivenessStats(req.params.id);

        if (!stats) {
            return res.status(404).json({ error: 'Magic Reply não encontrado' });
        }

        res.json(stats);
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Treinar modelo de ML
router.post('/:id/train', adminAuth, async (req, res) => {
    try {
        await MagicReplyService.trainMLModel(req.params.id);
        res.json({ message: 'Modelo treinado com sucesso' });
    } catch (error) {
        console.error('Erro ao treinar modelo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Criar Magic Reply padrão para contexto de preço
router.post('/create-default/price-context', adminAuth, async (req, res) => {
    try {
        const defaultReply = {
            name: 'Cliente reclamando de preço',
            description: 'Sugestões para clientes que reclamam do preço do produto',
            isActive: true,
            context: {
                keywords: ['caro', 'preço', 'valor', 'custo', 'barato', 'desconto', 'promoção'],
                sentimentThreshold: { min: -0.7, max: 0.2 },
                customerValue: 'medium',
                erpData: {
                    orderValue: { min: 50, max: 1000 },
                    lastPurchaseDays: { max: 180 }
                }
            },
            suggestions: [
                {
                    text: 'Olá {customer_name}! Entendo sua preocupação com o preço. Que tal parcelar em até 12x sem juros? Podemos ajustar isso para você! 💳',
                    type: 'parcelamento',
                    priority: 9,
                    mlScore: 0.8,
                    erpActions: [{
                        erpType: 'bling',
                        action: 'apply_discount',
                        data: { discount: 0 }
                    }]
                },
                {
                    text: 'Oi {customer_name}! Temos uma condição especial: cupom de 5% OFF para você! Use o código: DESCONTO5. Quer que eu aplique na sua compra? 🎁',
                    type: 'cupom',
                    priority: 8,
                    mlScore: 0.7,
                    erpActions: [{
                        erpType: 'bling',
                        action: 'create_coupon',
                        data: { couponCode: 'DESCONTO5', discount: 5 }
                    }]
                },
                {
                    text: 'Olá {customer_name}! Que tal frete grátis na sua compra? Podemos liberar isso para você e deixar ainda mais atrativo! 🚚',
                    type: 'frete_gratis',
                    priority: 7,
                    mlScore: 0.6,
                    erpActions: [{
                        erpType: 'bling',
                        action: 'apply_discount',
                        data: { discount: 'frete_gratis' }
                    }]
                }
            ],
            erpConfigs: {
                bling: {
                    enabled: true,
                    credentials: {},
                    mappings: {
                        customerIdField: 'id',
                        productIdField: 'codigo',
                        orderValueField: 'totalvenda'
                    }
                },
                vtex: {
                    enabled: false,
                    credentials: {},
                    mappings: {
                        customerIdField: 'id',
                        productIdField: 'productId',
                        orderValueField: 'value'
                    }
                },
                tiny: {
                    enabled: false,
                    credentials: {},
                    mappings: {
                        customerIdField: 'id',
                        productIdField: 'codigo',
                        orderValueField: 'total'
                    }
                }
            },
            mlConfig: {
                enabled: true,
                modelVersion: 'v1',
                trainingData: [],
                hyperparameters: {
                    learningRate: 0.01,
                    epochs: 100
                }
            },
            createdBy: req.user._id
        };

        const magicReply = new MagicReply(defaultReply);
        await magicReply.save();

        res.status(201).json(magicReply);
    } catch (error) {
        console.error('Erro ao criar Magic Reply padrão:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;