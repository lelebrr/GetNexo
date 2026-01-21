const nodemailer = require('nodemailer');
const axios = require('axios');
const Message = require('../models/Message');
const SeriesExecution = require('../models/SeriesExecution');

class MultichannelService {
    constructor() {
        this.emailTransporters = new Map();
        this.whatsappConfigs = new Map();
        this.smsConfigs = new Map();
        this.pushConfigs = new Map();
    }

    /**
     * Configura provedor de email
     */
    configureEmailProvider(clientId, config) {
        const transporter = nodemailer.createTransporter({
            host: config.host,
            port: config.port,
            secure: config.secure || false,
            auth: {
                user: config.user,
                pass: config.pass
            }
        });

        this.emailTransporters.set(clientId, {
            transporter,
            config
        });

        return transporter;
    }

    /**
     * Configura provedor WhatsApp
     */
    configureWhatsAppProvider(clientId, config) {
        this.whatsappConfigs.set(clientId, config);
    }

    /**
     * Configura provedor SMS
     */
    configureSMSProvider(clientId, config) {
        this.smsConfigs.set(clientId, config);
    }

    /**
     * Configura provedor Push
     */
    configurePushProvider(clientId, config) {
        this.pushConfigs.set(clientId, config);
    }

    /**
     * Envia mensagem através do canal apropriado
     */
    async sendMessage(messageData, executionId = null) {
        const {
            messageId,
            userId,
            channel,
            content,
            variables = {},
            clientId = 'default'
        } = messageData;

        try {
            let result;

            switch (channel) {
                case 'email':
                    result = await this.sendEmail(messageData, clientId);
                    break;
                case 'whatsapp':
                    result = await this.sendWhatsAppMessage(messageData, clientId);
                    break;
                case 'sms':
                    result = await this.sendSMS(messageData, clientId);
                    break;
                case 'push':
                    result = await this.sendPushNotification(messageData, clientId);
                    break;
                default:
                    throw new Error(`Canal não suportado: ${channel}`);
            }

            // Atualiza analytics da mensagem se executionId fornecido
            if (executionId) {
                await this.updateMessageAnalytics(messageId, executionId, 'sent');
            }

            return {
                success: true,
                channel,
                messageId,
                result,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error(`Erro ao enviar mensagem ${channel}:`, error);

            // Registra falha
            if (executionId) {
                await this.updateMessageAnalytics(messageId, executionId, 'failed', error.message);
            }

            return {
                success: false,
                channel,
                messageId,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Envia email
     */
    async sendEmail({ recipient, subject, body, attachments = [], clientId = 'default' }, clientIdParam) {
        const client = clientIdParam || clientId;
        const emailConfig = this.emailTransporters.get(client);

        if (!emailConfig) {
            throw new Error(`Configuração de email não encontrada para cliente: ${client}`);
        }

        const { transporter, config } = emailConfig;

        const mailOptions = {
            from: `"${config.fromName || 'GetNexo'}" <${config.user}>`,
            to: recipient,
            subject,
            html: body,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response
        };
    }

    /**
     * Envia mensagem WhatsApp
     */
    async sendWhatsAppMessage({ recipient, body, media = null, clientId = 'default' }, clientIdParam) {
        const client = clientIdParam || clientId;
        const config = this.whatsappConfigs.get(client);

        if (!config) {
            throw new Error(`Configuração WhatsApp não encontrada para cliente: ${client}`);
        }

        // Implementação baseada no provedor (Twilio, 360Dialog, etc.)
        if (config.provider === 'twilio') {
            return this.sendWhatsAppTwilio(recipient, body, media, config);
        } else if (config.provider === '360dialog') {
            return this.sendWhatsApp360Dialog(recipient, body, media, config);
        } else {
            // Simulação para desenvolvimento
            console.log(`[WHATSAPP SIMULATION] Enviando para ${recipient}: ${body}`);
            return {
                messageId: `wa_${Date.now()}`,
                status: 'sent',
                simulated: true
            };
        }
    }

    /**
     * Envia WhatsApp via Twilio
     */
    async sendWhatsAppTwilio(recipient, body, media, config) {
        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
            new URLSearchParams({
                From: `whatsapp:${config.fromNumber}`,
                To: `whatsapp:${recipient}`,
                Body: body
            }),
            {
                auth: {
                    username: config.accountSid,
                    password: config.authToken
                }
            }
        );

        return {
            messageId: response.data.sid,
            status: response.data.status,
            price: response.data.price
        };
    }

    /**
     * Envia WhatsApp via 360Dialog
     */
    async sendWhatsApp360Dialog(recipient, body, media, config) {
        const payload = {
            to: recipient,
            type: media ? 'image' : 'text',
            recipient_type: 'individual'
        };

        if (media) {
            payload.image = {
                link: media.url,
                caption: body
            };
        } else {
            payload.text = { body };
        }

        const response = await axios.post(
            `https://waba.360dialog.io/v1/messages`,
            payload,
            {
                headers: {
                    'D360-API-KEY': config.apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            messageId: response.data.messages[0].id,
            status: 'sent'
        };
    }

    /**
     * Envia SMS
     */
    async sendSMS({ recipient, body, clientId = 'default' }, clientIdParam) {
        const client = clientIdParam || clientId;
        const config = this.smsConfigs.get(client);

        if (!config) {
            throw new Error(`Configuração SMS não encontrada para cliente: ${client}`);
        }

        if (config.provider === 'twilio') {
            return this.sendSMSTwilio(recipient, body, config);
        } else {
            // Simulação
            console.log(`[SMS SIMULATION] Enviando para ${recipient}: ${body}`);
            return {
                messageId: `sms_${Date.now()}`,
                status: 'sent',
                simulated: true
            };
        }
    }

    /**
     * Envia SMS via Twilio
     */
    async sendSMSTwilio(recipient, body, config) {
        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
            new URLSearchParams({
                From: config.fromNumber,
                To: recipient,
                Body: body
            }),
            {
                auth: {
                    username: config.accountSid,
                    password: config.authToken
                }
            }
        );

        return {
            messageId: response.data.sid,
            status: response.data.status,
            price: response.data.price
        };
    }

    /**
     * Envia notificação push
     */
    async sendPushNotification({ recipient, title, body, data = {}, clientId = 'default' }, clientIdParam) {
        const client = clientIdParam || clientId;
        const config = this.pushConfigs.get(client);

        if (!config) {
            throw new Error(`Configuração Push não encontrada para cliente: ${client}`);
        }

        if (config.provider === 'firebase') {
            return this.sendPushFirebase(recipient, title, body, data, config);
        } else {
            // Simulação
            console.log(`[PUSH SIMULATION] Enviando para ${recipient}: ${title} - ${body}`);
            return {
                messageId: `push_${Date.now()}`,
                status: 'sent',
                simulated: true
            };
        }
    }

    /**
     * Envia Push via Firebase
     */
    async sendPushFirebase(recipient, title, body, data, config) {
        const payload = {
            message: {
                token: recipient,
                notification: {
                    title,
                    body
                },
                data: data,
                android: {
                    priority: 'high'
                },
                apns: {
                    payload: {
                        aps: {
                            alert: { title, body },
                            sound: 'default'
                        }
                    }
                }
            }
        };

        const response = await axios.post(
            `https://fcm.googleapis.com/v1/projects/${config.projectId}/messages:send`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${config.serverKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            messageId: response.data.name,
            status: 'sent'
        };
    }

    /**
     * Atualiza analytics da mensagem
     */
    async updateMessageAnalytics(messageId, executionId, status, error = null) {
        try {
            const execution = await SeriesExecution.findById(executionId);
            if (!execution) return;

            const messageIndex = execution.messages.findIndex(m => m.messageId.toString() === messageId);
            if (messageIndex === -1) return;

            const message = execution.messages[messageIndex];

            switch (status) {
                case 'sent':
                    message.status = 'sent';
                    message.sentAt = new Date();
                    execution.analytics.sentMessages += 1;
                    break;
                case 'delivered':
                    message.status = 'delivered';
                    message.deliveredAt = new Date();
                    execution.analytics.deliveredMessages += 1;
                    break;
                case 'opened':
                    message.status = 'opened';
                    message.openedAt = new Date();
                    execution.analytics.openedMessages += 1;
                    break;
                case 'clicked':
                    message.status = 'clicked';
                    message.clickedAt = new Date();
                    execution.analytics.clickedMessages += 1;
                    break;
                case 'responded':
                    message.status = 'responded';
                    message.respondedAt = new Date();
                    execution.analytics.respondedMessages += 1;
                    break;
                case 'failed':
                    message.status = 'failed';
                    message.failedAt = new Date();
                    message.failureReason = error;
                    break;
            }

            await execution.save();

        } catch (error) {
            console.error('Erro ao atualizar analytics:', error);
        }
    }

    /**
     * Processa resposta do usuário
     */
    async processUserResponse(executionId, response) {
        try {
            const execution = await SeriesExecution.findById(executionId);
            if (!execution) return;

            // Atualiza a última mensagem como respondida
            const lastMessage = execution.messages[execution.messages.length - 1];
            if (lastMessage) {
                lastMessage.status = 'responded';
                lastMessage.respondedAt = new Date();
                lastMessage.response = response;
                execution.analytics.respondedMessages += 1;
            }

            await execution.save();

            return {
                success: true,
                executionId,
                response,
                nextAction: this.determineNextAction(execution, response)
            };

        } catch (error) {
            console.error('Erro ao processar resposta:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Determina próxima ação baseada na resposta
     */
    determineNextAction(execution, response) {
        // Lógica simples - pode ser expandida com regras condicionais
        const responseText = response.text || response;

        if (responseText.toLowerCase().includes('não') || responseText.toLowerCase().includes('nao')) {
            return { action: 'pause_series', reason: 'User declined' };
        }

        if (responseText.toLowerCase().includes('sim') || responseText.toLowerCase().includes('yes')) {
            return { action: 'continue_series' };
        }

        return { action: 'wait_next_message' };
    }

    /**
     * Envio em lote
     */
    async sendBatch(messages, clientId = 'default') {
        const results = [];

        for (const message of messages) {
            try {
                const result = await this.sendMessage({ ...message, clientId }, message.executionId);
                results.push(result);
            } catch (error) {
                results.push({
                    success: false,
                    messageId: message.messageId,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Valida configuração de canal
     */
    validateChannelConfig(channel, config) {
        const validations = {
            email: ['host', 'port', 'user', 'pass'],
            whatsapp: ['provider', 'apiKey'],
            sms: ['provider', 'accountSid', 'authToken', 'fromNumber'],
            push: ['provider', 'serverKey', 'projectId']
        };

        const required = validations[channel];
        if (!required) return { valid: false, error: 'Canal não suportado' };

        const missing = required.filter(field => !config[field]);
        if (missing.length > 0) {
            return { valid: false, error: `Campos obrigatórios faltando: ${missing.join(', ')}` };
        }

        return { valid: true };
    }
}

module.exports = new MultichannelService();