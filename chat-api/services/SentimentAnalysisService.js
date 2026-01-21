const SentimentAnalysis = require('../models/SentimentAnalysis');
const Ticket = require('../models/Ticket');
const axios = require('axios');

/**
 * Serviço de Análise de Sentimentos
 * Analisa textos de clientes e pontua de 1-10
 * Detecta sentimentos: Raiva (1-2), Frustração (3-4), Neutro (5-6), Satisfação (7-8), Empolgação (9-10)
 */
class SentimentAnalysisService {
    constructor() {
        this.llmEndpoint = process.env.LLM_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
        this.llmApiKey = process.env.LLM_API_KEY;
        this.llmModel = process.env.LLM_MODEL || 'gpt-4o-mini';

        // Thresholds configuráveis via admin
        this.thresholds = {
            escalation: { min: 1, max: 2, label: 'Escalonamento Urgente' },
            warning: { min: 3, max: 4, label: 'Atenção Necessária' },
            reward: { min: 9, max: 10, label: 'Recompensa' },
            none: { min: 5, max: 8, label: 'Normal' }
        };

        // Reward types
        this.rewardTypes = {
            cafe: { label: 'Café', description: 'Cupom de café' },
            brinde: { label: 'Brinde', description: 'Brinde especial' },
            desconto: { label: 'Desconto', description: 'Desconto em compra' },
            upgrade: { label: 'Upgrade', description: 'Upgrade de serviço' },
            none: { label: 'Nenhum', description: 'Sem recompensa' }
        };

        // Sentiment ranges
        this.sentimentRanges = {
            very_negative: { min: 1, max: 2, label: 'Muito Negativo', category: 'raiva' },
            negative: { min: 3, max: 4, label: 'Negativo', category: 'frustracao' },
            neutral: { min: 5, max: 6, label: 'Neutro', category: 'neutro' },
            positive: { min: 7, max: 8, label: 'Positivo', category: 'satisfacao' },
            very_positive: { min: 9, max: 10, label: 'Muito Positivo', category: 'empolgação' }
        };
    }

    /**
     * Analisa texto e retorna pontuação de sentimento
     * @param {string} text - Texto a ser analisado
     * @param {Object} options - Opções de análise
     * @returns {Promise<Object>} Resultado da análise
     */
    async analyzeText(text, options = {}) {
        const startTime = Date.now();

        try {
            // Se não tiver API key, usa análise baseada em regras
            if (!this.llmApiKey) {
                return this.analyzeWithRules(text, options);
            }

            // Usa LLM para análise avançada
            const llmResult = await this.analyzeWithLLM(text, options);
            const processingTime = Date.now() - startTime;

            return {
                ...llmResult,
                processingTime,
                analyzedBy: 'ai'
            };
        } catch (error) {
            console.error('Erro na análise de sentimento:', error.message);

            // Fallback para análise baseada em regras
            const ruleResult = this.analyzeWithRules(text, options);
            const processingTime = Date.now() - startTime;

            return {
                ...ruleResult,
                processingTime,
                analyzedBy: 'ai',
                error: error.message,
                fallback: true
            };
        }
    }

    /**
     * Análise baseada em regras (fallback)
     */
    analyzeWithRules(text, options = {}) {
        const lowerText = text.toLowerCase();

        // Palavras-chave para cada sentimento
        const keywords = {
            very_negative: ['odeio', 'detesto', 'nojo', 'horror', 'pior', 'péssimo', 'desastre', 'fracasso', 'inútil', 'lixo', 'desgosto', 'raiva', 'furia', 'indignado'],
            negative: ['ruim', 'mal', 'frustrado', 'decepcionado', 'insatisfeito', 'problema', 'dificuldade', 'complicado', 'demorou', 'atrasou', 'errado', 'falha'],
            neutral: ['ok', 'normal', 'tudo bem', 'certo', 'entendi', 'compreendo', 'vou ver', 'analiso', 'verifico', 'entendido'],
            positive: ['bom', 'bem', 'satisfeito', 'contente', 'feliz', 'gostei', 'aprovei', 'recomendo', 'otimo', 'excelente', 'maravilhoso'],
            very_positive: ['amei', 'adoro', 'fantástico', 'incrível', 'maravilha', 'perfeito', 'excelente', 'super', 'top', '10', 'notas', 'parabéns', 'obrigado', 'agradeço']
        };

        // Palavras de urgência/escalonamento
        const urgencyKeywords = ['urgente', 'imediato', 'agora', 'rápido', 'correr', 'emergência', 'crise', 'problema grave'];

        // Palavras de recompensa
        const rewardKeywords = ['obrigado', 'agradeço', 'parabéns', 'excelente', 'maravilhoso', 'incrível'];

        let score = 5; // Score padrão neutro
        let sentiment = 'neutral';
        let category = 'neutro';
        let confidence = 0.7;
        let keywordsFound = [];
        let entities = [];

        // Verifica palavras-chave de cada sentimento
        for (const [sentimentKey, words] of Object.entries(keywords)) {
            for (const word of words) {
                if (lowerText.includes(word)) {
                    keywordsFound.push(word);

                    // Ajusta score baseado no sentimento
                    if (sentimentKey === 'very_negative') {
                        score = Math.max(1, score - 3);
                    } else if (sentimentKey === 'negative') {
                        score = Math.max(1, score - 2);
                    } else if (sentimentKey === 'positive') {
                        score = Math.min(10, score + 2);
                    } else if (sentimentKey === 'very_positive') {
                        score = Math.min(10, score + 3);
                    }
                }
            }
        }

        // Verifica palavras de urgência
        for (const word of urgencyKeywords) {
            if (lowerText.includes(word)) {
                score = Math.max(1, score - 2);
                keywordsFound.push(word);
            }
        }

        // Verifica palavras de recompensa
        for (const word of rewardKeywords) {
            if (lowerText.includes(word)) {
                score = Math.min(10, score + 1);
                keywordsFound.push(word);
            }
        }

        // Determina sentimento baseado no score
        for (const [key, range] of Object.entries(this.sentimentRanges)) {
            if (score >= range.min && score <= range.max) {
                sentiment = key;
                category = range.category;
                break;
            }
        }

        // Ajusta confiança baseada no número de palavras-chave encontradas
        confidence = Math.min(0.95, 0.5 + (keywordsFound.length * 0.1));

        // Extrai entidades simples (números, emails, etc.)
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const phoneRegex = /\b\d{2}\s?\d{4,5}-?\d{4}\b/g;
        const numberRegex = /\b\d+\b/g;

        const emails = lowerText.match(emailRegex) || [];
        const phones = lowerText.match(phoneRegex) || [];
        const numbers = lowerText.match(numberRegex) || [];

        emails.forEach(email => entities.push({ text: email, type: 'email', confidence: 0.9 }));
        phones.forEach(phone => entities.push({ text: phone, type: 'phone', confidence: 0.9 }));
        numbers.forEach(num => entities.push({ text: num, type: 'number', confidence: 0.8 }));

        // Detecta sarcasmo (exclamações excessivas, interrogações)
        const exclamationCount = (text.match(/!/g) || []).length;
        const questionCount = (text.match(/\?/g) || []).length;
        const sarcasmDetected = exclamationCount > 3 || questionCount > 2;

        // Calcula intensidade da emoção
        const emotionIntensity = Math.min(1, keywordsFound.length * 0.15);

        // Calcula urgência
        const urgencyScore = urgencyKeywords.some(word => lowerText.includes(word)) ? 0.8 : 0.3;

        return {
            score,
            sentiment,
            category,
            confidence,
            keywords: keywordsFound,
            entities,
            metadata: {
                language: 'pt',
                sentimentTrend: score > 5 ? 'improving' : score < 5 ? 'deteriorating' : 'stable',
                emotionIntensity,
                sarcasmDetected,
                urgencyScore
            }
        };
    }

    /**
     * Análise usando LLM (OpenAI, Claude, etc.)
     */
    async analyzeWithLLM(text, options = {}) {
        const prompt = `
Análise de Sentimentos - Sistema de Suporte ao Cliente

Texto do cliente:
"${text}"

Instruções:
1. Analise o sentimento do cliente
2. Atribua um score de 1 a 10 (1 = Muito Negativo/Raiva, 10 = Muito Positivo/Empolgação)
3. Identifique o sentimento principal
4. Extraia palavras-chave e entidades
5. Calcule confiança da análise (0-1)
6. Detecte sarcasmo se presente
7. Avalie urgência

Retorne em formato JSON:
{
  "score": number (1-10),
  "sentiment": "very_negative" | "negative" | "neutral" | "positive" | "very_positive",
  "category": "raiva" | "frustracao" | "neutro" | "satisfacao" | "empolgação",
  "confidence": number (0-1),
  "keywords": string[],
  "entities": [{text: string, type: string, confidence: number}],
  "metadata": {
    "language": "pt",
    "sentimentTrend": "improving" | "deteriorating" | "stable",
    "emotionIntensity": number (0-1),
    "sarcasmDetected": boolean,
    "urgencyScore": number (0-1)
  }
}

Análise:
`;

        try {
            const response = await axios.post(
                this.llmEndpoint,
                {
                    model: this.llmModel,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um especialista em análise de sentimentos para suporte ao cliente. Analise textos de clientes e retorne resultados precisos em formato JSON.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.llmApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            const result = JSON.parse(response.data.choices[0].message.content);

            // Valida e ajusta o resultado
            result.score = Math.max(1, Math.min(10, result.score || 5));
            result.confidence = Math.max(0, Math.min(1, result.confidence || 0.7));

            // Valida sentimento
            if (!this.sentimentRanges[result.sentiment]) {
                result.sentiment = this.determineSentimentFromScore(result.score);
                result.category = this.sentimentRanges[result.sentiment].category;
            }

            return result;
        } catch (error) {
            throw new Error(`Erro na análise LLM: ${error.message}`);
        }
    }

    /**
     * Determina sentimento baseado no score
     */
    determineSentimentFromScore(score) {
        for (const [key, range] of Object.entries(this.sentimentRanges)) {
            if (score >= range.min && score <= range.max) {
                return key;
            }
        }
        return 'neutral';
    }

    /**
     * Analisa sentimento de um ticket
     */
    async analyzeTicket(ticketId, text, options = {}) {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket não encontrado');
        }

        const analysis = await this.analyzeText(text, options);

        // Verifica se há análise anterior para comparar
        const previousAnalysis = await SentimentAnalysis.findOne({
            ticketId,
            isProcessed: true
        }).sort({ createdAt: -1 });

        const sentimentData = {
            ticketId,
            text,
            ...analysis,
            analysisType: options.analysisType || 'ongoing',
            analyzedBy: options.analyzedBy || 'ai',
            agentId: ticket.assignee?.userId,
            productId: ticket.productId,
            department: ticket.department,
            tags: ticket.tags,
            responseTime: ticket.firstResponseTime,
            resolutionTime: ticket.resolutionTime,
            satisfactionScore: ticket.npsScore,
            npsScore: ticket.npsScore,
            csatScore: ticket.csatScore
        };

        if (previousAnalysis) {
            sentimentData.previousScore = previousAnalysis.score;
            sentimentData.scoreChange = analysis.score - previousAnalysis.score;
        }

        // Verifica se deve disparar alerta
        const alertCheck = this.shouldTriggerAlert(analysis.score);
        if (alertCheck.shouldTrigger) {
            sentimentData.alertTriggered = true;
            sentimentData.alertType = alertCheck.type;
            sentimentData.alertMessage = alertCheck.message;

            // Determina recompensa se for score alto
            if (alertCheck.type === 'reward') {
                sentimentData.rewardType = this.determineRewardType(analysis.score);
                sentimentData.rewardDetails = this.rewardTypes[sentimentData.rewardType].description;
                sentimentData.rewardGiven = true;
            }
        }

        // Salva análise
        const sentimentAnalysis = new SentimentAnalysis(sentimentData);
        await sentimentAnalysis.save();

        // Atualiza ticket com análise de IA
        if (!ticket.aiAnalysis) {
            ticket.aiAnalysis = {};
        }

        ticket.aiAnalysis.sentiment = {
            score: analysis.score,
            sentiment: analysis.sentiment,
            confidence: analysis.confidence
        };

        await ticket.save();

        return sentimentAnalysis;
    }

    /**
     * Analisa sentimento de uma mensagem
     */
    async analyzeMessage(messageId, text, ticketId, options = {}) {
        const sentimentData = await this.analyzeText(text, options);

        const analysis = new SentimentAnalysis({
            messageId,
            ticketId,
            text,
            ...sentimentData,
            analysisType: options.analysisType || 'ongoing',
            analyzedBy: options.analyzedBy || 'ai'
        });

        await analysis.save();

        return analysis;
    }

    /**
     * Verifica se deve disparar alerta
     */
    shouldTriggerAlert(score) {
        if (score <= this.thresholds.escalation.max) {
            return {
                shouldTrigger: true,
                type: 'escalation',
                message: `🚨 ESCALONAMENTO URGENTE: Cliente muito insatisfeito (Score: ${score})`
            };
        }

        if (score <= this.thresholds.warning.max) {
            return {
                shouldTrigger: true,
                type: 'warning',
                message: `⚠️ ATENÇÃO: Cliente insatisfeito (Score: ${score})`
            };
        }

        if (score >= this.thresholds.reward.min) {
            return {
                shouldTrigger: true,
                type: 'reward',
                message: `🎉 RECOMPENSA: Cliente muito satisfeito (Score: ${score})`
            };
        }

        return {
            shouldTrigger: false,
            type: 'none',
            message: ''
        };
    }

    /**
     * Determina tipo de recompensa
     */
    determineRewardType(score) {
        if (score >= 9) {
            const rewards = ['cafe', 'brinde'];
            return rewards[Math.floor(Math.random() * rewards.length)];
        }
        return 'none';
    }

    /**
     * Obtém métricas de dashboard
     */
    async getDashboardMetrics(filters = {}) {
        return await SentimentAnalysis.getDashboardMetrics(filters);
    }

    /**
     * Obtém métricas por agente
     */
    async getMetricsByAgent(filters = {}) {
        return await SentimentAnalysis.getMetricsByAgent(filters);
    }

    /**
     * Obtém métricas por produto
     */
    async getMetricsByProduct(filters = {}) {
        return await SentimentAnalysis.getMetricsByProduct(filters);
    }

    /**
     * Obtém relatório de eficácia do suporte
     */
    async getSupportEffectivenessReport(filters = {}) {
        return await SentimentAnalysis.getSupportEffectivenessReport(filters);
    }

    /**
     * Obtém dados de série temporal
     */
    async getTimeSeriesData(filters = {}) {
        return await SentimentAnalysis.getTimeSeriesData(filters);
    }

    /**
     * Obtém distribuição de sentimentos
     */
    async getSentimentDistribution(filters = {}) {
        return await SentimentAnalysis.getSentimentDistribution(filters);
    }

    /**
     * Obtém estatísticas de alertas
     */
    async getAlertStatistics(filters = {}) {
        return await SentimentAnalysis.getAlertStatistics(filters);
    }

    /**
     * Obtém estatísticas de recompensas
     */
    async getRewardStatistics(filters = {}) {
        return await SentimentAnalysis.getRewardStatistics(filters);
    }

    /**
     * Obtém tendência de sentimentos
     */
    async getSentimentTrend(filters = {}) {
        return await SentimentAnalysis.getSentimentTrend(filters);
    }

    /**
     * Atualiza thresholds configuráveis
     */
    updateThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
        return this.thresholds;
    }

    /**
     * Obtém thresholds atuais
     */
    getThresholds() {
        return this.thresholds;
    }

    /**
     * Atualiza tipos de recompensa
     */
    updateRewardTypes(newRewardTypes) {
        this.rewardTypes = { ...this.rewardTypes, ...newRewardTypes };
        return this.rewardTypes;
    }

    /**
     * Obtém tipos de recompensa atuais
     */
    getRewardTypes() {
        return this.rewardTypes;
    }

    /**
     * Obtém ranges de sentimentos
     */
    getSentimentRanges() {
        return this.sentimentRanges;
    }

    /**
     * Processa análise em lote
     */
    async batchAnalyze(texts, options = {}) {
        const results = [];

        for (const text of texts) {
            try {
                const result = await this.analyzeText(text, options);
                results.push(result);
            } catch (error) {
                results.push({
                    error: error.message,
                    text,
                    score: 5,
                    sentiment: 'neutral',
                    category: 'neutro',
                    confidence: 0.5
                });
            }
        }

        return results;
    }

    /**
     * Exporta dados de análise para relatório
     */
    async exportData(filters = {}) {
        const analyses = await SentimentAnalysis.find({
            ...filters,
            isArchived: false
        }).populate('ticketId').populate('agentId').populate('productId');

        return analyses.map(analysis => ({
            id: analysis._id,
            ticketId: analysis.ticketId?._id,
            ticketTitle: analysis.ticketId?.title,
            agentName: analysis.agentId?.name,
            productName: analysis.productId?.name,
            text: analysis.text,
            score: analysis.score,
            sentiment: analysis.sentiment,
            category: analysis.category,
            confidence: analysis.confidence,
            keywords: analysis.keywords,
            alertTriggered: analysis.alertTriggered,
            alertType: analysis.alertType,
            rewardType: analysis.rewardType,
            rewardGiven: analysis.rewardGiven,
            createdAt: analysis.createdAt,
            processedAt: analysis.processedAt
        }));
    }

    /**
     * Obtém estatísticas gerais
     */
    async getGeneralStats(filters = {}) {
        const total = await SentimentAnalysis.countDocuments({
            ...filters,
            isArchived: false
        });

        const withAlerts = await SentimentAnalysis.countDocuments({
            ...filters,
            alertTriggered: true,
            isArchived: false
        });

        const withRewards = await SentimentAnalysis.countDocuments({
            ...filters,
            rewardGiven: true,
            isArchived: false
        });

        const avgScore = await SentimentAnalysis.aggregate([
            { $match: { ...filters, isArchived: false } },
            { $group: { _id: null, avg: { $avg: '$score' } } }
        ]);

        const avgConfidence = await SentimentAnalysis.aggregate([
            { $match: { ...filters, isArchived: false } },
            { $group: { _id: null, avg: { $avg: '$confidence' } } }
        ]);

        return {
            total,
            withAlerts,
            withRewards,
            avgScore: avgScore[0]?.avg || 0,
            avgConfidence: avgConfidence[0]?.avg || 0,
            alertRate: total > 0 ? (withAlerts / total) * 100 : 0,
            rewardRate: total > 0 ? (withRewards / total) * 100 : 0
        };
    }
}

module.exports = new SentimentAnalysisService();
