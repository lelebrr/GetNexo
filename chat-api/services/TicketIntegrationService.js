const SentimentAnalysisService = require('./SentimentAnalysisService');
const Ticket = require('../models/Ticket');
const SentimentAnalysis = require('../models/SentimentAnalysis');

/**
 * Serviço de Integração de Tickets com Análise de Sentimentos
 * Integra automaticamente a análise de sentimentos com o sistema de tickets
 */
class TicketIntegrationService {
    constructor() {
        this.sentimentService = SentimentAnalysisService;
    }

    /**
     * Processa ticket recém-criado e analisa sentimento
     * @param {Object} ticket - Objeto do ticket criado
     * @returns {Promise<Object>} Ticket com análise de sentimento
     */
    async processNewTicket(ticket) {
        try {
            console.log(`[TICKET INTEGRATION] Processando ticket ${ticket._id} para análise de sentimento`);

            // Analisa o sentimento da descrição do ticket
            const sentimentAnalysis = await this.sentimentService.analyzeTicket(
                ticket._id,
                ticket.description,
                { analysisType: 'initial', analyzedBy: 'auto' }
            );

            // Atualiza o ticket com informações de análise de sentimento
            await Ticket.findByIdAndUpdate(ticket._id, {
                'aiAnalysis.sentiment': {
                    score: sentimentAnalysis.score,
                    sentiment: sentimentAnalysis.sentiment,
                    confidence: sentimentAnalysis.confidence,
                    category: sentimentAnalysis.category
                },
                'aiAnalysis.suggestedTags': sentimentAnalysis.keywords || [],
                'aiAnalysis.prioritySuggestion': this.suggestPriority(sentimentAnalysis.score),
                'aiAnalysis.categorySuggestion': this.suggestCategory(sentimentAnalysis.text, sentimentAnalysis.keywords)
            });

            // Ajusta prioridade automaticamente se necessário
            if (sentimentAnalysis.score <= 2 && ticket.priority === 'medium') {
                await Ticket.findByIdAndUpdate(ticket._id, {
                    priority: 'high',
                    'aiAnalysis.autoAssigned': true
                });
                console.log(`[TICKET INTEGRATION] Prioridade do ticket ${ticket._id} ajustada automaticamente para 'high'`);
            }

            // Verifica se deve disparar alertas
            await this.checkAndTriggerAlerts(sentimentAnalysis, ticket);

            console.log(`[TICKET INTEGRATION] Análise de sentimento concluída para ticket ${ticket._id}`);
            return { ...ticket, sentimentAnalysis };

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao processar ticket ${ticket._id}:`, error.message);
            // Não falha o processo de criação do ticket por causa da análise
            return ticket;
        }
    }

    /**
     * Processa atualização de ticket e analisa sentimento se necessário
     * @param {Object} ticket - Objeto do ticket atualizado
     * @param {Object} changes - Mudanças realizadas
     * @returns {Promise<Object>} Ticket com análise atualizada
     */
    async processTicketUpdate(ticket, changes = {}) {
        try {
            // Se a descrição foi alterada, reanalisa o sentimento
            if (changes.description) {
                console.log(`[TICKET INTEGRATION] Reanalisando sentimento do ticket ${ticket._id} devido a mudança na descrição`);

                const sentimentAnalysis = await this.sentimentService.analyzeTicket(
                    ticket._id,
                    changes.description,
                    { analysisType: 'ongoing', analyzedBy: 'auto' }
                );

                // Atualiza análise
                await Ticket.findByIdAndUpdate(ticket._id, {
                    'aiAnalysis.sentiment': {
                        score: sentimentAnalysis.score,
                        sentiment: sentimentAnalysis.sentiment,
                        confidence: sentimentAnalysis.confidence,
                        category: sentimentAnalysis.category
                    }
                });

                // Verifica alertas
                await this.checkAndTriggerAlerts(sentimentAnalysis, ticket);
            }

            // Se o status mudou para resolvido, faz análise final
            if (changes.status === 'resolved' || changes.status === 'closed') {
                console.log(`[TICKET INTEGRATION] Fazendo análise final do ticket ${ticket._id}`);

                const finalAnalysis = await this.sentimentService.analyzeTicket(
                    ticket._id,
                    ticket.description,
                    { analysisType: 'final', analyzedBy: 'auto' }
                );

                // Atualiza métricas finais
                await Ticket.findByIdAndUpdate(ticket._id, {
                    'aiAnalysis.finalSentiment': {
                        score: finalAnalysis.score,
                        sentiment: finalAnalysis.sentiment,
                        confidence: finalAnalysis.confidence
                    }
                });
            }

            return ticket;

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao processar atualização do ticket ${ticket._id}:`, error.message);
            return ticket;
        }
    }

    /**
     * Processa nova mensagem em um ticket
     * @param {string} ticketId - ID do ticket
     * @param {string} messageText - Texto da mensagem
     * @param {string} messageId - ID da mensagem
     * @param {boolean} isFromUser - Se a mensagem é do usuário
     * @returns {Promise<Object>} Resultado da análise
     */
    async processNewMessage(ticketId, messageText, messageId, isFromUser = true) {
        try {
            console.log(`[TICKET INTEGRATION] Processando mensagem ${messageId} do ticket ${ticketId}`);

            // Só analisa mensagens do usuário (não do agente)
            if (!isFromUser) {
                return null;
            }

            const sentimentAnalysis = await this.sentimentService.analyzeMessage(
                messageId,
                messageText,
                ticketId,
                { analysisType: 'ongoing', analyzedBy: 'auto' }
            );

            const ticket = await Ticket.findById(ticketId);

            // Verifica alertas para mensagens
            await this.checkAndTriggerAlerts(sentimentAnalysis, ticket, messageId);

            // Atualiza sentimento atual do ticket
            await Ticket.findByIdAndUpdate(ticketId, {
                'aiAnalysis.currentSentiment': {
                    score: sentimentAnalysis.score,
                    sentiment: sentimentAnalysis.sentiment,
                    confidence: sentimentAnalysis.confidence,
                    lastUpdate: new Date()
                }
            });

            console.log(`[TICKET INTEGRATION] Análise de mensagem ${messageId} concluída`);
            return sentimentAnalysis;

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao processar mensagem ${messageId}:`, error.message);
            return null;
        }
    }

    /**
     * Sugere prioridade baseada no score de sentimento
     * @param {number} score - Score de sentimento
     * @returns {string} Prioridade sugerida
     */
    suggestPriority(score) {
        if (score <= 2) return 'urgent';
        if (score <= 4) return 'high';
        if (score <= 6) return 'medium';
        if (score <= 8) return 'low';
        return 'low'; // Clientes muito satisfeitos podem ter prioridade baixa
    }

    /**
     * Sugere categoria baseada no texto e palavras-chave
     * @param {string} text - Texto a ser analisado
     * @param {string[]} keywords - Palavras-chave encontradas
     * @returns {string} Categoria sugerida
     */
    suggestCategory(text, keywords = []) {
        const lowerText = text.toLowerCase();
        const keywordText = keywords.join(' ').toLowerCase();

        const categoryKeywords = {
            'Suporte Técnico': ['erro', 'bug', 'não funciona', 'quebrado', 'problema técnico', 'sistema'],
            'Cobrança': ['pagamento', 'cobrança', 'valor', 'preço', 'custo', 'fatura', 'boleto'],
            'Conta/Registro': ['login', 'senha', 'conta', 'cadastro', 'registrar', 'acesso'],
            'Produto': ['produto', 'item', 'compra', 'entrega', 'qualidade', 'defeito'],
            'Atendimento': ['atendente', 'espera', 'demora', 'resposta', 'tratamento']
        };

        for (const [category, words] of Object.entries(categoryKeywords)) {
            if (words.some(word => lowerText.includes(word) || keywordText.includes(word))) {
                return category;
            }
        }

        return 'Geral';
    }

    /**
     * Verifica e dispara alertas baseados na análise de sentimento
     * @param {Object} sentimentAnalysis - Resultado da análise
     * @param {Object} ticket - Objeto do ticket
     * @param {string} messageId - ID da mensagem (opcional)
     */
    async checkAndTriggerAlerts(sentimentAnalysis, ticket, messageId = null) {
        try {
            // Verifica se deve alertar baseado nos thresholds
            const alertCheck = this.sentimentService.shouldTriggerAlert(sentimentAnalysis.score);

            if (alertCheck.shouldTrigger) {
                console.log(`[TICKET INTEGRATION] Alerta disparado para ticket ${ticket._id}: ${alertCheck.type}`);

                // Atualiza análise com informações de alerta
                await SentimentAnalysis.findByIdAndUpdate(sentimentAnalysis._id, {
                    alertTriggered: true,
                    alertType: alertCheck.type,
                    alertMessage: alertCheck.message
                });

                // Aqui você pode integrar com sistema de notificações
                // Por exemplo: enviar email, SMS, notificação push, etc.
                await this.sendAlertNotification(alertCheck, ticket, sentimentAnalysis, messageId);

                // Para scores muito altos, prepara recompensa
                if (alertCheck.type === 'reward') {
                    const rewardType = this.sentimentService.determineRewardType(sentimentAnalysis.score);
                    await SentimentAnalysis.findByIdAndUpdate(sentimentAnalysis._id, {
                        rewardType,
                        rewardGiven: true,
                        rewardDetails: this.sentimentService.getRewardTypes()[rewardType].description
                    });
                }
            }
        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao verificar alertas:`, error.message);
        }
    }

    /**
     * Envia notificação de alerta
     * @param {Object} alertCheck - Informações do alerta
     * @param {Object} ticket - Ticket relacionado
     * @param {Object} sentimentAnalysis - Análise de sentimento
     * @param {string} messageId - ID da mensagem (opcional)
     */
    async sendAlertNotification(alertCheck, ticket, sentimentAnalysis, messageId = null) {
        try {
            // Implementação básica de notificação
            // Em produção, isso seria integrado com serviços de email/SMS/push

            const notification = {
                type: alertCheck.type,
                ticketId: ticket._id,
                ticketTitle: ticket.title,
                score: sentimentAnalysis.score,
                sentiment: sentimentAnalysis.sentiment,
                message: alertCheck.message,
                timestamp: new Date(),
                messageId
            };

            console.log(`[ALERT NOTIFICATION] ${alertCheck.message}`, notification);

            // Aqui você poderia:
            // 1. Enviar email para o agente responsável
            // 2. Enviar SMS para equipe de escalação
            // 3. Criar notificação no painel admin
            // 4. Integrar com sistemas externos (Slack, Teams, etc.)

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao enviar notificação:`, error.message);
        }
    }

    /**
     * Obtém estatísticas de integração para dashboard
     * @param {Object} filters - Filtros para as estatísticas
     * @returns {Promise<Object>} Estatísticas de integração
     */
    async getIntegrationStats(filters = {}) {
        try {
            const match = {};

            if (filters.startDate && filters.endDate) {
                match.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate)
                };
            }

            // Estatísticas de tickets analisados
            const analyzedTickets = await Ticket.countDocuments({
                ...match,
                'aiAnalysis.sentiment.score': { $exists: true }
            });

            const totalTickets = await Ticket.countDocuments(match);
            const analysisRate = totalTickets > 0 ? (analyzedTickets / totalTickets) * 100 : 0;

            // Estatísticas de alertas
            const alertStats = await SentimentAnalysis.aggregate([
                { $match: { ...match, alertTriggered: true } },
                {
                    $group: {
                        _id: '$alertType',
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Estatísticas de recompensas
            const rewardStats = await SentimentAnalysis.aggregate([
                { $match: { ...match, rewardGiven: true } },
                {
                    $group: {
                        _id: '$rewardType',
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Média de scores por tipo de análise
            const scoreStats = await SentimentAnalysis.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: '$analysisType',
                        avgScore: { $avg: '$score' },
                        count: { $sum: 1 },
                        minScore: { $min: '$score' },
                        maxScore: { $max: '$score' }
                    }
                }
            ]);

            return {
                overview: {
                    totalTickets,
                    analyzedTickets,
                    analysisRate: Math.round(analysisRate * 100) / 100,
                    unanalyzedTickets: totalTickets - analyzedTickets
                },
                alerts: alertStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                rewards: rewardStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                scores: scoreStats.reduce((acc, stat) => {
                    acc[stat._id] = {
                        average: Math.round(stat.avgScore * 100) / 100,
                        count: stat.count,
                        range: `${stat.minScore}-${stat.maxScore}`
                    };
                    return acc;
                }, {})
            };

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao obter estatísticas:`, error.message);
            return {};
        }
    }

    /**
     * Limpa análises antigas (manutenção)
     * @param {number} daysOld - Dias de idade para considerar antigo
     * @returns {Promise<number>} Número de análises removidas
     */
    async cleanupOldAnalyses(daysOld = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await SentimentAnalysis.deleteMany({
                createdAt: { $lt: cutoffDate },
                isArchived: true
            });

            console.log(`[TICKET INTEGRATION] ${result.deletedCount} análises antigas removidas`);
            return result.deletedCount;

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao limpar análises antigas:`, error.message);
            return 0;
        }
    }

    /**
     * Reanalisa tickets sem análise de sentimento
     * @param {number} limit - Limite de tickets para reanalisar
     * @returns {Promise<number>} Número de tickets reanalisados
     */
    async reanalyzeMissingTickets(limit = 100) {
        try {
            const ticketsWithoutAnalysis = await Ticket.find({
                'aiAnalysis.sentiment.score': { $exists: false }
            }).limit(limit);

            let reanalyzedCount = 0;

            for (const ticket of ticketsWithoutAnalysis) {
                try {
                    await this.processNewTicket(ticket);
                    reanalyzedCount++;
                } catch (error) {
                    console.error(`[TICKET INTEGRATION] Erro ao reanalisar ticket ${ticket._id}:`, error.message);
                }
            }

            console.log(`[TICKET INTEGRATION] ${reanalyzedCount} tickets reanalisados`);
            return reanalyzedCount;

        } catch (error) {
            console.error(`[TICKET INTEGRATION] Erro ao reanalisar tickets:`, error.message);
            return 0;
        }
    }
}

module.exports = new TicketIntegrationService();
