const MagicReply = require('../models/MagicReply');
const ERPIntegrationService = require('./ERPIntegrationService');
const SentimentAnalysisService = require('./SentimentAnalysisService');

class MagicReplyService {

    // Buscar sugestões de resposta baseadas no contexto
    static async getSuggestions(ticketId, message, customerData = {}) {
        try {
            // Buscar todos os Magic Replies ativos
            const magicReplies = await MagicReply.find({ isActive: true });

            const suggestions = [];
            const sentiment = await this.analyzeMessageSentiment(message);

            for (const magicReply of magicReplies) {
                if (magicReply.matchesContext(message, sentiment.score, customerData)) {
                    const replySuggestions = magicReply.getSuggestions();

                    for (const suggestion of replySuggestions) {
                        // Personalizar sugestão com dados do ERP se necessário
                        const personalizedSuggestion = await this.personalizeSuggestion(
                            suggestion,
                            customerData,
                            magicReply.erpConfigs
                        );

                        suggestions.push({
                            id: suggestion._id,
                            text: personalizedSuggestion,
                            type: suggestion.type,
                            priority: suggestion.priority,
                            magicReplyId: magicReply._id,
                            mlScore: suggestion.mlScore,
                            erpActions: suggestion.erpActions
                        });
                    }
                }
            }

            // Ordenar por prioridade e ML score
            suggestions.sort((a, b) => {
                // Primeiro por ML score se disponível
                if (a.mlScore && b.mlScore) {
                    return b.mlScore - a.mlScore;
                }
                // Senão por prioridade
                return b.priority - a.priority;
            });

            // Registrar que as sugestões foram mostradas
            await this.logSuggestionsShown(ticketId, suggestions);

            return suggestions.slice(0, 5); // Retornar no máximo 5 sugestões

        } catch (error) {
            console.error('Erro ao buscar sugestões Magic Reply:', error);
            return [];
        }
    }

    // Registrar uso de uma sugestão
    static async logSuggestionUsed(ticketId, magicReplyId, suggestionText, effectiveness = null) {
        try {
            const magicReply = await MagicReply.findById(magicReplyId);
            if (magicReply) {
                await magicReply.logUsage(ticketId, suggestionText, effectiveness);

                // Executar ações no ERP se configuradas
                const suggestion = magicReply.suggestions.find(s => s.text === suggestionText);
                if (suggestion && suggestion.erpActions) {
                    await this.executeERPActions(suggestion.erpActions, ticketId);
                }

                // Atualizar modelo de ML se habilitado
                if (magicReply.mlConfig.enabled) {
                    await this.updateMLModel(magicReply, suggestionText, effectiveness);
                }
            }
        } catch (error) {
            console.error('Erro ao registrar uso da sugestão:', error);
        }
    }

    // Analisar sentimento da mensagem
    static async analyzeMessageSentiment(message) {
        try {
            const analysis = await SentimentAnalysisService.analyzeText(message);
            return {
                score: analysis.sentiment || 0,
                sentiment: analysis.sentimentType || 'neutral',
                confidence: analysis.confidence || 0.5
            };
        } catch (error) {
            console.error('Erro ao analisar sentimento:', error);
            return { score: 0, sentiment: 'neutral', confidence: 0.5 };
        }
    }

    // Personalizar sugestão com dados do ERP
    static async personalizeSuggestion(suggestion, customerData, erpConfigs) {
        let text = suggestion.text;

        // Substituir placeholders com dados do cliente
        if (customerData.name) {
            text = text.replace(/\{customer_name\}/g, customerData.name);
        }

        if (customerData.lastOrderValue) {
            text = text.replace(/\{last_order_value\}/g, this.formatCurrency(customerData.lastOrderValue));
        }

        // Buscar dados adicionais do ERP se necessário
        if (text.includes('{product_name}') && customerData.lastOrderId) {
            try {
                const erpConfig = this.getERPConfigForAction(erpConfigs, 'getOrder');
                if (erpConfig) {
                    const orderData = await ERPIntegrationService.getOrderData(erpConfig, customerData.lastOrderId);
                    if (orderData && orderData.items && orderData.items.length > 0) {
                        text = text.replace(/\{product_name\}/g, orderData.items[0].name);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados do pedido para personalização:', error);
            }
        }

        return text;
    }

    // Formatar moeda
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Obter configuração ERP para uma ação
    static getERPConfigForAction(erpConfigs, action) {
        for (const [erpType, config] of Object.entries(erpConfigs)) {
            if (config.enabled) {
                return {
                    type: erpType,
                    credentials: config.credentials,
                    baseUrl: config.baseUrl
                };
            }
        }
        return null;
    }

    // Executar ações no ERP
    static async executeERPActions(erpActions, ticketId) {
        for (const action of erpActions) {
            try {
                switch (action.action) {
                    case 'apply_discount':
                        await this.applyDiscount(action, ticketId);
                        break;
                    case 'create_coupon':
                        await this.createCoupon(action, ticketId);
                        break;
                    case 'update_customer':
                        await this.updateCustomer(action, ticketId);
                        break;
                    default:
                        console.log(`Ação ERP não suportada: ${action.action}`);
                }
            } catch (error) {
                console.error(`Erro ao executar ação ERP ${action.action}:`, error);
            }
        }
    }

    // Aplicar desconto
    static async applyDiscount(action, ticketId) {
        // Implementar lógica para aplicar desconto no ERP
        console.log(`Aplicando desconto: ${action.data.discount}% para ticket ${ticketId}`);
        // Integração específica com ERP seria implementada aqui
    }

    // Criar cupom
    static async createCoupon(action, ticketId) {
        // Implementar lógica para criar cupom no ERP
        console.log(`Criando cupom: ${action.data.couponCode} para ticket ${ticketId}`);
        // Integração específica com ERP seria implementada aqui
    }

    // Atualizar cliente
    static async updateCustomer(action, ticketId) {
        // Implementar lógica para atualizar dados do cliente
        console.log(`Atualizando cliente com dados:`, action.data);
        // Integração específica com ERP seria implementada aqui
    }

    // Registrar que sugestões foram mostradas
    static async logSuggestionsShown(ticketId, suggestions) {
        try {
            const magicReplyIds = [...new Set(suggestions.map(s => s.magicReplyId))];

            await MagicReply.updateMany(
                { _id: { $in: magicReplyIds } },
                {
                    $inc: { 'effectivenessMetrics.totalShown': 1 },
                    $set: { 'effectivenessMetrics.lastCalculated': new Date() }
                }
            );
        } catch (error) {
            console.error('Erro ao registrar visualização de sugestões:', error);
        }
    }

    // Atualizar modelo de Machine Learning
    static async updateMLModel(magicReply, suggestionText, effectiveness) {
        try {
            // Encontrar a sugestão no treinamento
            const trainingItem = magicReply.mlConfig.trainingData.find(
                item => item.output === suggestionText
            );

            if (trainingItem) {
                // Atualizar efetividade baseada no feedback
                trainingItem.effectiveness = effectiveness || 0.5;
                trainingItem.usedCount += 1;

                await magicReply.save();
            }
        } catch (error) {
            console.error('Erro ao atualizar modelo ML:', error);
        }
    }

    // Treinar modelo de ML com novos dados
    static async trainMLModel(magicReplyId) {
        try {
            const magicReply = await MagicReply.findById(magicReplyId);
            if (!magicReply || !magicReply.mlConfig.enabled) return;

            // Implementar lógica de treinamento simples baseada em efetividade
            for (const suggestion of magicReply.suggestions) {
                const trainingItems = magicReply.mlConfig.trainingData.filter(
                    item => item.output === suggestion.text
                );

                if (trainingItems.length > 0) {
                    // Calcular score baseado na média de efetividade e uso
                    const avgEffectiveness = trainingItems.reduce((sum, item) => sum + item.effectiveness, 0) / trainingItems.length;
                    const totalUsage = trainingItems.reduce((sum, item) => sum + item.usedCount, 0);

                    suggestion.mlScore = (avgEffectiveness * 0.7) + (Math.min(totalUsage / 100, 1) * 0.3);
                }
            }

            await magicReply.save();
        } catch (error) {
            console.error('Erro ao treinar modelo ML:', error);
        }
    }

    // Obter estatísticas de efetividade
    static async getEffectivenessStats(magicReplyId) {
        try {
            const magicReply = await MagicReply.findById(magicReplyId);
            if (!magicReply) return null;

            const metrics = magicReply.effectivenessMetrics;
            const totalShown = metrics.totalShown || 0;
            const totalUsed = metrics.totalUsed || 0;
            const totalEffective = metrics.totalEffective || 0;

            return {
                conversionRate: totalShown > 0 ? totalUsed / totalShown : 0,
                effectivenessRate: totalUsed > 0 ? totalEffective / totalUsed : 0,
                averageRating: metrics.averageRating || 0,
                totalSuggestions: totalShown,
                totalUsed,
                totalEffective
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas de efetividade:', error);
            return null;
        }
    }
}

module.exports = MagicReplyService;