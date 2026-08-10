const SeriesExecution = require('../models/SeriesExecution');
const Message = require('../models/Message');
const Series = require('../models/Series');
const MultichannelService = require('./MultichannelService');

class SeriesScheduler {
    constructor() {
        this.scheduledJobs = new Map();
        this.intervalId = null;
        this.isRunning = false;
    }

    /**
     * Inicia o scheduler
     */
    start() {
        // if (this.isRunning) return;

        // console.log('[SERIES SCHEDULER] Iniciando scheduler...');
        // this.isRunning = true;

        // // Verifica jobs pendentes a cada 30 segundos
        // this.intervalId = setInterval(() => {
        //     this.processPendingJobs();
        // }, 30000);

        // // Processa jobs imediatamente na inicialização
        // this.processPendingJobs();
        console.log('[SERIES SCHEDULER] Disabled due to stability issues.');
    }

    /**
     * Para o scheduler
     */
    stop() {
        if (!this.isRunning) return;

        console.log('[SERIES SCHEDULER] Parando scheduler...');
        this.isRunning = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Cancela todos os jobs agendados
        this.scheduledJobs.clear();
    }

    /**
     * Agenda uma mensagem para envio futuro
     */
    async scheduleMessage(executionId, messageId, delayMs) {
        try {
            const execution = await SeriesExecution.findById(executionId);
            if (!execution) {
                console.error(`[SCHEDULER] Execution ${executionId} não encontrada`);
                return;
            }

            const message = await Message.findById(messageId);
            if (!message) {
                console.error(`[SCHEDULER] Message ${messageId} não encontrada`);
                return;
            }

            const scheduledTime = new Date(Date.now() + delayMs);
            const jobId = `${executionId}_${messageId}`;

            // Atualiza a execução com o horário agendado
            execution.schedule.nextMessageAt = scheduledTime;
            await execution.save();

            // Armazena o job
            this.scheduledJobs.set(jobId, {
                executionId,
                messageId,
                scheduledTime,
                createdAt: new Date()
            });

            console.log(`[SCHEDULER] Mensagem ${messageId} agendada para ${scheduledTime.toISOString()}`);

        } catch (error) {
            console.error('[SCHEDULER] Erro ao agendar mensagem:', error);
        }
    }

    /**
     * Processa jobs pendentes
     */
    async processPendingJobs() {
        if (!this.isRunning) return;

        const now = new Date();
        const jobsToProcess = [];

        // Coleta jobs que devem ser executados
        for (const [jobId, job] of this.scheduledJobs) {
            if (job.scheduledTime <= now) {
                jobsToProcess.push({ jobId, job });
            }
        }

        // Remove jobs antigos (mais de 24 horas)
        for (const [jobId, job] of this.scheduledJobs) {
            const age = now - job.createdAt;
            if (age > 24 * 60 * 60 * 1000) { // 24 horas
                this.scheduledJobs.delete(jobId);
            }
        }

        // Processa jobs
        for (const { jobId, job } of jobsToProcess) {
            try {
                await this.processJob(job);
                this.scheduledJobs.delete(jobId);
            } catch (error) {
                console.error(`[SCHEDULER] Erro ao processar job ${jobId}:`, error);
                // Mantém o job para tentar novamente
            }
        }

        // Também verifica execuções ativas que podem ter mensagens pendentes
        await this.checkActiveExecutions();
    }

    /**
     * Processa um job individual
     */
    async processJob(job) {
        const { executionId, messageId } = job;

        try {
            const execution = await SeriesExecution.findById(executionId)
                .populate('seriesId');

            if (!execution || execution.status !== 'active') {
                return;
            }

            const message = await Message.findById(messageId);

            if (!message) {
                return;
            }

            // Verifica se é a vez desta mensagem
            const currentMessageIndex = execution.messages.findIndex(
                m => m.messageId.toString() === messageId
            );

            if (currentMessageIndex === -1) {
                return; // Mensagem não faz parte desta execução
            }

            // Envia a mensagem
            const result = await this.sendScheduledMessage(execution, message);

            // Agenda próxima mensagem se houver
            if (result.success && execution.progress.currentStep < execution.progress.totalSteps) {
                await this.scheduleNextMessage(execution);
            }

        } catch (error) {
            console.error(`[SCHEDULER] Erro ao processar job ${executionId}_${messageId}:`, error);
        }
    }

    /**
     * Envia mensagem agendada
     */
    async sendScheduledMessage(execution, message) {
        try {
            // Prepara dados da mensagem
            const messageData = {
                messageId: message._id,
                userId: execution.userId,
                channel: message.channel,
                content: {
                    subject: message.content.subject,
                    body: this.interpolateVariables(message.content.body, execution.variables),
                    variables: execution.variables
                },
                recipient: await this.getUserContact(execution.userId, message.channel),
                executionId: execution._id
            };

            // Envia via serviço multicanal
            const result = await MultichannelService.sendMessage(messageData);

            // Atualiza progresso da execução
            execution.progress.currentStep += 1;
            execution.currentMessage = message._id;
            execution.messages.push({
                messageId: message._id,
                status: result.success ? 'sent' : 'failed',
                sentAt: result.success ? new Date() : null,
                abVariant: execution.abTest?.variant || 'A',
                failureReason: result.success ? null : result.error
            });

            await execution.save();

            return result;

        } catch (error) {
            console.error('[SCHEDULER] Erro ao enviar mensagem agendada:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Agenda próxima mensagem na sequência
     */
    async scheduleNextMessage(execution) {
        try {
            const nextStep = execution.progress.currentStep + 1;
            const series = await Series.findById(execution.seriesId);

            if (!series || nextStep > series.messages.length) {
                // Série completa
                execution.status = 'completed';
                execution.schedule.completedAt = new Date();
                await execution.save();
                return;
            }

            const nextMessageId = series.messages[nextStep - 1]; // Ajuste para índice baseado em 0
            const nextMessage = await Message.findById(nextMessageId);

            if (!nextMessage) {
                console.error(`[SCHEDULER] Próxima mensagem ${nextMessageId} não encontrada`);
                return;
            }

            // Calcula delay
            const delayMs = this.calculateDelay(nextMessage.delay, execution);

            if (delayMs > 0) {
                await this.scheduleMessage(execution._id, nextMessageId, delayMs);
            } else {
                // Envia imediatamente
                await this.processJob({
                    executionId: execution._id,
                    messageId: nextMessageId,
                    scheduledTime: new Date()
                });
            }

        } catch (error) {
            console.error('[SCHEDULER] Erro ao agendar próxima mensagem:', error);
        }
    }

    /**
     * Calcula delay baseado na configuração
     */
    calculateDelay(delayConfig, execution) {
        if (!delayConfig || delayConfig.type === 'fixed') {
            const value = delayConfig?.value || 0;
            const unit = delayConfig?.unit || 'hours';

            switch (unit) {
                case 'milliseconds': return value;
                case 'seconds': return value * 1000;
                case 'minutes': return value * 60 * 1000;
                case 'hours': return value * 60 * 60 * 1000;
                case 'days': return value * 24 * 60 * 60 * 1000;
                default: return value * 60 * 60 * 1000; // horas por padrão
            }
        }

        // Delay condicional (implementação simplificada)
        if (delayConfig.type === 'conditional' && delayConfig.condition) {
            // Aqui poderia implementar lógica condicional baseada em respostas anteriores
            return delayConfig.value * 60 * 60 * 1000; // fallback
        }

        return 0;
    }

    /**
     * Verifica execuções ativas para mensagens pendentes
     */
    async checkActiveExecutions() {
        try {
            const activeExecutions = await SeriesExecution.find({
                status: 'active',
                'schedule.nextMessageAt': { $lte: new Date() }
            }).populate('seriesId');

            // Otimização de performance: Reduzindo queries de N para 1 usando busca em lote (batch fetch com $in)
            const uniqueMessageIds = new Set();
            for (const execution of activeExecutions) {
                if (execution.progress.currentStep < execution.progress.totalSteps) {
                    const nextMessageId = execution.seriesId?.messages?.[execution.progress.currentStep];
                    if (nextMessageId) {
                        uniqueMessageIds.add(nextMessageId.toString());
                    }
                }
            }

            const messagesMap = new Map();
            if (uniqueMessageIds.size > 0) {
                const messages = await Message.find({ _id: { $in: Array.from(uniqueMessageIds) } });
                for (const msg of messages) {
                    messagesMap.set(msg._id.toString(), msg);
                }
            }

            for (const execution of activeExecutions) {
                if (execution.progress.currentStep >= execution.progress.totalSteps) {
                    // Série completa
                    execution.status = 'completed';
                    execution.schedule.completedAt = new Date();
                    await execution.save();
                    continue;
                }

                // Encontra próxima mensagem
                const series = execution.seriesId;
                const nextMessageId = series.messages[execution.progress.currentStep];

                if (nextMessageId) {
                    const nextMessage = messagesMap.get(nextMessageId.toString());
                    if (nextMessage) {
                        await this.sendScheduledMessage(execution, nextMessage);
                        await this.scheduleNextMessage(execution);
                    }
                }
            }

        } catch (error) {
            console.error('[SCHEDULER] Erro ao verificar execuções ativas:', error);
        }
    }

    /**
     * Pausa execução de série
     */
    async pauseExecution(executionId, reason = null) {
        try {
            const execution = await SeriesExecution.findById(executionId);
            if (!execution) return false;

            execution.pause(reason);
            await execution.save();

            // Remove jobs agendados para esta execução
            for (const [jobId, job] of this.scheduledJobs) {
                if (job.executionId === executionId) {
                    this.scheduledJobs.delete(jobId);
                }
            }

            return true;
        } catch (error) {
            console.error('[SCHEDULER] Erro ao pausar execução:', error);
            return false;
        }
    }

    /**
     * Retoma execução de série
     */
    async resumeExecution(executionId) {
        try {
            const execution = await SeriesExecution.findById(executionId);
            if (!execution || execution.status !== 'paused') return false;

            execution.resume();
            await execution.save();

            // Reagenda próxima mensagem
            await this.scheduleNextMessage(execution);

            return true;
        } catch (error) {
            console.error('[SCHEDULER] Erro ao retomar execução:', error);
            return false;
        }
    }

    /**
     * Cancela execução de série
     */
    async cancelExecution(executionId, reason = null) {
        try {
            const execution = await SeriesExecution.findById(executionId);
            if (!execution) return false;

            execution.cancel(reason);
            await execution.save();

            // Remove jobs agendados
            for (const [jobId, job] of this.scheduledJobs) {
                if (job.executionId === executionId) {
                    this.scheduledJobs.delete(jobId);
                }
            }

            return true;
        } catch (error) {
            console.error('[SCHEDULER] Erro ao cancelar execução:', error);
            return false;
        }
    }

    /**
     * Obtém contato do usuário para o canal
     */
    async getUserContact(userId, channel) {
        // Implementação simplificada - em produção, buscar do banco de dados do usuário
        // Por enquanto, retorna dados mockados
        const mockContacts = {
            [userId]: {
                email: 'user@example.com',
                whatsapp: '+5511999999999',
                sms: '+5511999999999'
            }
        };

        const contacts = mockContacts[userId] || {};
        return contacts[channel] || contacts.email;
    }

    /**
     * Interpola variáveis no conteúdo da mensagem
     */
    interpolateVariables(template, variables = {}) {
        if (!template || typeof template !== 'string') return template;

        let result = template;

        // Substitui variáveis no formato {{variable}}
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value || '');
        }

        // Variáveis padrão
        const defaultVars = {
            '{{first_name}}': 'Cliente',
            '{{last_name}}': '',
            '{{email}}': 'cliente@exemplo.com',
            '{{date}}': new Date().toLocaleDateString('pt-BR'),
            '{{time}}': new Date().toLocaleTimeString('pt-BR')
        };

        for (const [key, value] of Object.entries(defaultVars)) {
            result = result.replace(new RegExp(key, 'g'), value);
        }

        return result;
    }

    /**
     * Determina próxima ação baseada na resposta
     */
    determineNextAction(execution, response) {
        const responseText = response.text || response;
        const responseData = response;

        // Primeiro, verifica condições específicas da mensagem atual
        const currentMessage = execution.messages[execution.messages.length - 1];
        if (currentMessage && this.evaluateMessageConditions(currentMessage, responseData)) {
            return { action: 'continue_series' };
        }

        // Lógica baseada em conteúdo da resposta
        const lowerResponse = responseText.toLowerCase();

        // Palavras que indicam interesse positivo
        const positiveWords = ['sim', 'yes', 'quero', 'interessado', 'gostei', 'ok', 'beleza', 'claro'];
        if (positiveWords.some(word => lowerResponse.includes(word))) {
            return { action: 'continue_series' };
        }

        // Palavras que indicam recusa
        const negativeWords = ['não', 'nao', 'não quero', 'depois', 'agora não', 'passo'];
        if (negativeWords.some(word => lowerResponse.includes(word))) {
            return { action: 'pause_series', reason: 'User declined' };
        }

        // Palavras que indicam confusão ou necessidade de esclarecimento
        const confusedWords = ['não entendi', 'como', 'por quê', 'porque', 'explique'];
        if (confusedWords.some(word => lowerResponse.includes(word))) {
            return { action: 'send_clarification' };
        }

        // Se não conseguiu determinar, continua normalmente
        return { action: 'continue_series' };
    }

    /**
     * Avalia condições da mensagem
     */
    evaluateMessageConditions(messageEntry, response) {
        const message = messageEntry.messageId; // Assume que é populated
        if (!message || !message.conditions || message.conditions.length === 0) {
            return true; // Sem condições = continua
        }

        for (const condition of message.conditions) {
            if (!this.evaluateCondition(condition, response)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Avalia uma condição individual
     */
    evaluateCondition(condition, response) {
        const { field, operator, value, logic } = condition;
        let fieldValue;

        // Extrai valor do campo da resposta
        switch (field) {
            case 'text':
                fieldValue = response.text || response;
                break;
            case 'sentiment':
                fieldValue = response.sentiment || this.analyzeSentiment(response.text || response);
                break;
            case 'length':
                fieldValue = (response.text || response).length;
                break;
            case 'contains_keyword':
                fieldValue = this.containsKeyword(response.text || response, value);
                break;
            case 'time_to_respond':
                fieldValue = response.timeToRespond || 0;
                break;
            default:
                fieldValue = response[field] || null;
        }

        // Aplica operador
        let result;
        switch (operator) {
            case 'equals':
                result = fieldValue === value;
                break;
            case 'not_equals':
                result = fieldValue !== value;
                break;
            case 'contains':
                result = typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(value.toLowerCase());
                break;
            case 'greater_than':
                result = Number(fieldValue) > Number(value);
                break;
            case 'less_than':
                result = Number(fieldValue) < Number(value);
                break;
            case 'after':
                result = new Date(fieldValue) > new Date(value);
                break;
            case 'before':
                result = new Date(fieldValue) < new Date(value);
                break;
            default:
                result = false;
        }

        return result;
    }

    /**
     * Análise simples de sentimento
     */
    analyzeSentiment(text) {
        if (!text) return 'neutral';

        const positiveWords = ['bom', 'ótimo', 'gostei', 'amei', 'perfeito', 'excelente'];
        const negativeWords = ['ruim', 'péssimo', 'odeio', 'horrível', 'terrível'];

        const lowerText = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    /**
     * Verifica se texto contém palavra-chave
     */
    containsKeyword(text, keyword) {
        if (!text || !keyword) return false;
        return text.toLowerCase().includes(keyword.toLowerCase());
    }

    /**
     * Obtém estatísticas do scheduler
     */
    getStats() {
        return {
            isRunning: this.isRunning,
            scheduledJobs: this.scheduledJobs.size,
            activeJobs: Array.from(this.scheduledJobs.values()).filter(
                job => job.scheduledTime > new Date()
            ).length,
            overdueJobs: Array.from(this.scheduledJobs.values()).filter(
                job => job.scheduledTime <= new Date()
            ).length
        };
    }
}

module.exports = new SeriesScheduler();