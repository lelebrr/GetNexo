const SalesTemplate = require('../models/SalesTemplate');
const SalesTemplateExecution = require('../models/SalesTemplateExecution');

class SalesTemplateService {

    // Fluxos prontos predefinidos
    static getPredefinedFlows() {
        return {
            'abandoned-cart': {
                name: 'Recuperação de Carrinho Abandonado',
                description: 'Fluxo otimizado para recuperar vendas perdidas por abandono de carrinho',
                category: 'abandoned-cart',
                triggers: [{
                    event: 'cart-abandoned',
                    delay: 30, // 30 minutos
                    conditions: []
                }],
                flow: {
                    components: [
                        {
                            id: 'msg1',
                            type: 'message',
                            position: { x: 100, y: 100 },
                            data: {
                                content: 'Olá {{customer_name}}! 👋\n\nNotamos que você deixou alguns itens incríveis no carrinho da nossa loja. Que tal dar uma segunda olhada?\n\n🎁 {{product_name}}\n💰 De: R$ {{original_price}} Por: R$ {{discounted_price}}\n\nOferta válida por 24 horas!',
                                media: [],
                                buttons: [
                                    { type: 'url', text: 'Ver Carrinho', value: '{{cart_url}}' },
                                    { type: 'quick_reply', text: 'Preciso de Ajuda', value: 'support' }
                                ]
                            },
                            connections: [{ targetId: 'delay1', condition: 'sent' }]
                        },
                        {
                            id: 'delay1',
                            type: 'delay',
                            position: { x: 100, y: 250 },
                            data: { minutes: 1440 }, // 24 horas
                            connections: [{ targetId: 'condition1', condition: 'timeout' }]
                        },
                        {
                            id: 'condition1',
                            type: 'condition',
                            position: { x: 100, y: 400 },
                            data: {
                                conditions: [{ field: 'clicked', operator: '==', value: true }]
                            },
                            connections: [
                                { targetId: 'msg2', condition: 'false' },
                                { targetId: 'end', condition: 'true' }
                            ]
                        },
                        {
                            id: 'msg2',
                            type: 'message',
                            position: { x: 300, y: 400 },
                            data: {
                                content: 'Ei {{customer_name}}, ainda interessado em {{product_name}}?\n\n🔥 Última chance! Oferta especial termina em 12 horas.\n\n🎯 Cupom: ABANDONO10 (10% OFF)',
                                media: [],
                                buttons: [
                                    { type: 'url', text: 'Comprar Agora', value: '{{cart_url}}?coupon=ABANDONO10' }
                                ]
                            },
                            connections: []
                        },
                        {
                            id: 'end',
                            type: 'action',
                            position: { x: 100, y: 550 },
                            data: { action: 'end_flow' }
                        }
                    ],
                    startComponentId: 'msg1'
                },
                placeholders: [
                    { key: 'customer_name', description: 'Nome do cliente', type: 'text', defaultValue: 'Cliente' },
                    { key: 'product_name', description: 'Nome do produto abandonado', type: 'erp-field', erpMapping: 'product_name' },
                    { key: 'original_price', description: 'Preço original', type: 'erp-field', erpMapping: 'original_price' },
                    { key: 'discounted_price', description: 'Preço com desconto', type: 'erp-field', erpMapping: 'discounted_price' },
                    { key: 'cart_url', description: 'URL do carrinho', type: 'erp-field', erpMapping: 'cart_url' }
                ],
                settings: {
                    channels: ['whatsapp'],
                    audience: { segments: ['abandoned_cart'] }
                }
            },

            'upsell': {
                name: 'Upsell Pós-Compra',
                description: 'Sugira produtos complementares após uma compra',
                category: 'upsell',
                triggers: [{
                    event: 'order-completed',
                    delay: 7200, // 5 dias
                    conditions: []
                }],
                flow: {
                    components: [
                        {
                            id: 'msg1',
                            type: 'message',
                            position: { x: 100, y: 100 },
                            data: {
                                content: 'Olá {{customer_name}}! Obrigado pela compra! 🎉\n\nQue tal potencializar ainda mais sua experiência com {{upsell_product}}?\n\n✨ Complemento perfeito para {{purchased_product}}\n💰 Apenas R$ {{upsell_price}}\n\nMuitos clientes adoram esta combinação!',
                                media: [],
                                buttons: [
                                    { type: 'url', text: 'Adicionar ao Carrinho', value: '{{upsell_url}}' },
                                    { type: 'quick_reply', text: 'Não, obrigado', value: 'decline' }
                                ]
                            },
                            connections: [{ targetId: 'split1', condition: 'response' }]
                        },
                        {
                            id: 'split1',
                            type: 'split-test',
                            position: { x: 100, y: 250 },
                            data: {
                                variants: [
                                    { name: 'A', weight: 50 },
                                    { name: 'B', weight: 50 }
                                ]
                            },
                            connections: [
                                { targetId: 'msg2a', condition: 'variant_A' },
                                { targetId: 'msg2b', condition: 'variant_B' }
                            ]
                        },
                        {
                            id: 'msg2a',
                            type: 'message',
                            position: { x: 300, y: 250 },
                            data: {
                                content: '🎁 Bônus especial: Compre {{upsell_product}} hoje e ganhe FRETE GRÁTIS na próxima compra!',
                                buttons: []
                            }
                        },
                        {
                            id: 'msg2b',
                            type: 'message',
                            position: { x: 500, y: 250 },
                            data: {
                                content: '⏰ Oferta limitada: 15% OFF em {{upsell_product}} por tempo limitado!',
                                buttons: []
                            }
                        }
                    ],
                    startComponentId: 'msg1'
                },
                placeholders: [
                    { key: 'customer_name', description: 'Nome do cliente', type: 'text', defaultValue: 'Cliente' },
                    { key: 'purchased_product', description: 'Produto comprado', type: 'erp-field', erpMapping: 'purchased_product' },
                    { key: 'upsell_product', description: 'Produto sugerido', type: 'erp-field', erpMapping: 'upsell_product' },
                    { key: 'upsell_price', description: 'Preço do upsell', type: 'erp-field', erpMapping: 'upsell_price' },
                    { key: 'upsell_url', description: 'URL do produto upsell', type: 'erp-field', erpMapping: 'upsell_url' }
                ],
                abTest: {
                    enabled: true,
                    variants: [
                        { name: 'A', weight: 50 },
                        { name: 'B', weight: 50 }
                    ],
                    targetMetric: 'conversion'
                },
                settings: {
                    channels: ['whatsapp'],
                    audience: { segments: ['recent_purchasers'] }
                }
            },

            'cross-sell': {
                name: 'Cross-Sell Baseado em Comportamento',
                description: 'Sugira produtos relacionados baseado no histórico de navegação',
                category: 'cross-sell',
                triggers: [{
                    event: 'product-viewed',
                    delay: 60, // 1 hora
                    conditions: [{ field: 'view_count', operator: '>=', value: 3 }]
                }],
                flow: {
                    components: [
                        {
                            id: 'msg1',
                            type: 'message',
                            position: { x: 100, y: 100 },
                            data: {
                                content: 'Olá! Vimos que você está interessado em {{category_name}}. Que tal conhecer estes produtos que outros clientes também adoraram?\n\n🔥 {{recommended_product_1}}\n💰 R$ {{price_1}}\n\n⭐ {{recommended_product_2}}\n💰 R$ {{price_2}}',
                                media: [],
                                buttons: [
                                    { type: 'url', text: 'Ver Recomendações', value: '{{recommendations_url}}' },
                                    { type: 'quick_reply', text: 'Talvez Depois', value: 'later' }
                                ]
                            },
                            connections: []
                        }
                    ],
                    startComponentId: 'msg1'
                },
                placeholders: [
                    { key: 'category_name', description: 'Categoria visualizada', type: 'erp-field', erpMapping: 'category_name' },
                    { key: 'recommended_product_1', description: 'Produto recomendado 1', type: 'erp-field', erpMapping: 'recommended_product_1' },
                    { key: 'price_1', description: 'Preço produto 1', type: 'erp-field', erpMapping: 'price_1' },
                    { key: 'recommended_product_2', description: 'Produto recomendado 2', type: 'erp-field', erpMapping: 'recommended_product_2' },
                    { key: 'price_2', description: 'Preço produto 2', type: 'erp-field', erpMapping: 'price_2' },
                    { key: 'recommendations_url', description: 'URL das recomendações', type: 'erp-field', erpMapping: 'recommendations_url' }
                ],
                settings: {
                    channels: ['whatsapp'],
                    audience: { segments: ['browsers'] }
                }
            },

            'win-back': {
                name: 'Win-Back Clientes Inativos',
                description: 'Reative clientes que não compram há muito tempo',
                category: 'win-back',
                triggers: [{
                    event: 'user-inactive',
                    delay: 43200, // 30 dias
                    conditions: [{ field: 'days_since_last_purchase', operator: '>=', value: 90 }]
                }],
                flow: {
                    components: [
                        {
                            id: 'msg1',
                            type: 'message',
                            position: { x: 100, y: 100 },
                            data: {
                                content: 'Olá {{customer_name}}! 😊\n\nFaz tempo que não vemos você por aqui. Sentimos sua falta!\n\n🎁 Temos uma surpresa especial preparada para você: 20% OFF em qualquer produto!\n\nCupom: VOLTE20',
                                media: [],
                                buttons: [
                                    { type: 'url', text: 'Ver Ofertas', value: '{{store_url}}?coupon=VOLTE20' },
                                    { type: 'quick_reply', text: 'Me Desinscreva', value: 'unsubscribe' }
                                ]
                            },
                            connections: [{ targetId: 'delay1', condition: 'sent' }]
                        },
                        {
                            id: 'delay1',
                            type: 'delay',
                            position: { x: 100, y: 250 },
                            data: { minutes: 10080 }, // 7 dias
                            connections: [{ targetId: 'condition1', condition: 'timeout' }]
                        },
                        {
                            id: 'condition1',
                            type: 'condition',
                            position: { x: 100, y: 400 },
                            data: {
                                conditions: [{ field: 'purchased', operator: '==', value: true }]
                            },
                            connections: [
                                { targetId: 'msg2', condition: 'false' },
                                { targetId: 'end', condition: 'true' }
                            ]
                        },
                        {
                            id: 'msg2',
                            type: 'message',
                            position: { x: 300, y: 400 },
                            data: {
                                content: '{{customer_name}}, esta é sua ÚLTIMA CHANCE de usar o cupom VOLTE20!\n\n⏰ Expira em 24 horas.\n\nNão perca esta oportunidade! 🏃‍♂️',
                                media: [],
                                buttons: [
                                    { type: 'url', text: 'Comprar Agora', value: '{{store_url}}?coupon=VOLTE20' }
                                ]
                            },
                            connections: []
                        },
                        {
                            id: 'end',
                            type: 'action',
                            position: { x: 100, y: 550 },
                            data: { action: 'end_flow' }
                        }
                    ],
                    startComponentId: 'msg1'
                },
                placeholders: [
                    { key: 'customer_name', description: 'Nome do cliente', type: 'text', defaultValue: 'Cliente' },
                    { key: 'store_url', description: 'URL da loja', type: 'text', defaultValue: 'https://sualoja.com' }
                ],
                settings: {
                    channels: ['whatsapp'],
                    audience: { segments: ['inactive_90_days'] }
                }
            }
        };
    }

    // Criar template pré-definido
    static async createPredefinedTemplate(flowType, userId, customizations = {}) {
        const flows = this.getPredefinedFlows();
        const flowData = flows[flowType];

        if (!flowData) {
            throw new Error(`Tipo de fluxo não encontrado: ${flowType}`);
        }

        const templateData = {
            ...flowData,
            ...customizations,
            createdBy: userId,
            isPublic: false,
            usageCount: 0
        };

        const template = new SalesTemplate(templateData);
        await template.save();

        return template;
    }

    // Executar template para um usuário
    static async executeTemplate(templateId, userId, context = {}, channel = 'whatsapp') {
        const template = await SalesTemplate.findById(templateId);
        if (!template) {
            throw new Error('Template não encontrado');
        }

        // Verificar se template está ativo
        if (!template.isActive) {
            throw new Error('Template está inativo');
        }

        // Criar execução
        const execution = new SalesTemplateExecution({
            templateId,
            userId,
            context,
            channel,
            status: 'active'
        });

        await execution.save();

        // Incrementar contador de uso
        await template.incrementUsage();

        // Iniciar execução do fluxo
        await this.startFlowExecution(execution, template);

        return execution;
    }

    // Iniciar execução do fluxo
    static async startFlowExecution(execution, template) {
        const startComponent = template.flow.components.find(c => c.id === template.flow.startComponentId);

        if (!startComponent) {
            throw new Error('Componente inicial não encontrado');
        }

        execution.currentStep = { componentId: startComponent.id, position: 0 };
        execution.steps.push({
            componentId: startComponent.id,
            componentType: startComponent.type,
            executedAt: new Date(),
            status: 'executing'
        });

        await execution.save();

        // Processar componente inicial
        await this.processComponent(execution, template, startComponent);
    }

    // Processar componente do fluxo
    static async processComponent(execution, template, component) {
        try {
            switch (component.type) {
                case 'message':
                    await this.processMessageComponent(execution, template, component);
                    break;
                case 'delay':
                    await this.processDelayComponent(execution, template, component);
                    break;
                case 'condition':
                    await this.processConditionComponent(execution, template, component);
                    break;
                case 'action':
                    await this.processActionComponent(execution, template, component);
                    break;
            }

            // Marcar passo como completo
            const currentStep = execution.steps[execution.steps.length - 1];
            currentStep.status = 'completed';
            await execution.save();

        } catch (error) {
            execution.log('error', `Erro ao processar componente ${component.id}`, { error: error.message });
            await execution.markAsFailed(error);
        }
    }

    // Processar componente de mensagem
    static async processMessageComponent(execution, template, component) {
        const processedData = template.processPlaceholders(execution.context, execution.context.erpData);

        // Aqui seria integrada com o serviço de mensagens (WhatsApp, etc.)
        console.log(`Enviando mensagem via ${execution.channel}:`, processedData.content);

        // Simular envio
        await execution.recordMetric('sentAt');
        execution.log('info', 'Mensagem enviada', { componentId: component.id });
    }

    // Processar componente de delay
    static async processDelayComponent(execution, template, component) {
        const delayMinutes = component.data.minutes;
        const nextExecution = new Date(Date.now() + delayMinutes * 60 * 1000);

        execution.scheduledFor = nextExecution;
        execution.status = 'paused';

        execution.log('info', `Aguardando ${delayMinutes} minutos`, { nextExecution });
        await execution.save();
    }

    // Processar componente de condição
    static async processConditionComponent(execution, template, component) {
        // Avaliar condições
        const conditionsMet = this.evaluateConditions(component.data.conditions, execution.context);

        const connection = component.connections.find(c => c.condition === (conditionsMet ? 'true' : 'false'));
        if (connection) {
            const nextComponent = template.flow.components.find(c => c.id === connection.targetId);
            if (nextComponent) {
                await this.processComponent(execution, template, nextComponent);
            }
        }
    }

    // Avaliar condições
    static evaluateConditions(conditions, context) {
        return conditions.every(condition => {
            const value = context[condition.field];
            switch (condition.operator) {
                case '==': return value == condition.value;
                case '!=': return value != condition.value;
                case '>': return value > condition.value;
                case '<': return value < condition.value;
                case '>=': return value >= condition.value;
                case '<=': return value <= condition.value;
                default: return false;
            }
        });
    }

    // Processar componente de ação
    static async processActionComponent(execution, template, component) {
        switch (component.data.action) {
            case 'end_flow':
                await execution.markAsCompleted();
                break;
        }
    }

    // Obter estatísticas de template
    static async getTemplateAnalytics(templateId, startDate, endDate) {
        const executions = await SalesTemplateExecution.find({
            templateId,
            createdAt: { $gte: startDate, $gte: endDate }
        });

        const stats = {
            totalSent: executions.length,
            totalDelivered: executions.filter(e => e.metrics.deliveredAt).length,
            totalOpened: executions.filter(e => e.metrics.openedAt).length,
            totalClicked: executions.filter(e => e.metrics.clickedAt).length,
            totalConverted: executions.filter(e => e.metrics.convertedAt).length,
            totalRevenue: executions.reduce((sum, e) => sum + (e.metrics.revenue || 0), 0)
        };

        stats.conversionRate = stats.totalSent > 0 ? (stats.totalConverted / stats.totalSent) * 100 : 0;
        stats.avgOrderValue = stats.totalConverted > 0 ? stats.totalRevenue / stats.totalConverted : 0;

        return stats;
    }
}

module.exports = SalesTemplateService;