/**
 * WhatsApp Business Cloud API Configuration
 * @module config/whatsapp
 */

module.exports = {
    // API Version - atualizado para 2026
    API_VERSION: process.env.WA_API_VERSION || 'v20.0',

    // Identificadores da conta
    PHONE_NUMBER_ID: process.env.WA_PHONE_NUMBER_ID,
    ACCESS_TOKEN: process.env.WA_ACCESS_TOKEN,
    APP_SECRET: process.env.WA_APP_SECRET,
    BUSINESS_ACCOUNT_ID: process.env.WA_BUSINESS_ACCOUNT_ID,

    // Webhook
    WEBHOOK_VERIFY_TOKEN: process.env.WA_WEBHOOK_VERIFY_TOKEN || 'getnexo_verify_2026',

    // URLs base
    get BASE_URL() {
        return `https://graph.facebook.com/${this.API_VERSION}`;
    },

    get MESSAGES_URL() {
        return `${this.BASE_URL}/${this.PHONE_NUMBER_ID}/messages`;
    },

    get MEDIA_URL() {
        return `${this.BASE_URL}/${this.PHONE_NUMBER_ID}/media`;
    },

    // Headers padrão
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        };
    },

    // Rate limiting config
    RATE_LIMIT: {
        windowMs: 60 * 1000, // 1 minuto
        maxRequests: 80 // Meta permite ~80 msg/min
    },

    // Delay humanizado para respostas (ms)
    REPLY_DELAY: {
        min: 1000,
        max: 2500
    },

    // Mensagens padrão
    DEFAULT_MESSAGES: {
        greeting: 'Olá! Sou o assistente virtual da GetNexo. Como posso ajudar?',
        unavailable: 'No momento não posso processar sua mensagem. Tente novamente em instantes.',
        error: 'Desculpe, ocorreu um erro. Por favor, tente novamente.'
    },

    // Validação de configuração
    isConfigured() {
        return !!(this.PHONE_NUMBER_ID && this.ACCESS_TOKEN);
    }
};
