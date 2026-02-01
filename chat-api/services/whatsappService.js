/**
 * WhatsApp Business Cloud API Service
 * Wrapper completo para envio/recebimento de mensagens
 * @module services/whatsappService
 */

const axios = require('axios');
const config = require('../config/whatsapp');

// Rate limiting simples em memória
let requestCount = 0;
let windowStart = Date.now();

const checkRateLimit = () => {
    const now = Date.now();
    if (now - windowStart > config.RATE_LIMIT.windowMs) {
        requestCount = 0;
        windowStart = now;
    }
    if (requestCount >= config.RATE_LIMIT.maxRequests) {
        throw new Error('Rate limit exceeded. Please wait before sending more messages.');
    }
    requestCount++;
};

// Delay humanizado
const humanDelay = () => {
    const { min, max } = config.REPLY_DELAY;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Enviar mensagem de texto
 * @param {string} to - Número do destinatário (formato internacional sem +)
 * @param {string} text - Texto da mensagem
 * @param {boolean} humanize - Se deve adicionar delay humanizado
 * @returns {Promise<object>} Resposta da API
 */
const sendTextMessage = async (to, text, humanize = true) => {
    if (!config.isConfigured()) {
        throw new Error('WhatsApp API not configured. Check WA_PHONE_NUMBER_ID and WA_ACCESS_TOKEN.');
    }

    checkRateLimit();

    if (humanize) await humanDelay();

    try {
        const response = await axios.post(config.MESSAGES_URL, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
                preview_url: true,
                body: text
            }
        }, {
            headers: config.getHeaders(),
            timeout: 10000
        });

        console.log(`[WA-SEND] Texto enviado para ${to}: ${text.substring(0, 50)}...`);
        return response.data;
    } catch (error) {
        console.error('[WA-SEND ERROR]:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Enviar mensagem com mídia
 * @param {string} to - Número do destinatário
 * @param {string} type - Tipo: image, audio, document, video, sticker
 * @param {string} mediaUrl - URL pública da mídia
 * @param {string} caption - Legenda (opcional, não suportado em audio/sticker)
 * @param {string} filename - Nome do arquivo (para documents)
 * @returns {Promise<object>} Resposta da API
 */
const sendMediaMessage = async (to, type, mediaUrl, caption = '', filename = '') => {
    if (!config.isConfigured()) {
        throw new Error('WhatsApp API not configured.');
    }

    checkRateLimit();

    const mediaPayload = {
        link: mediaUrl
    };

    // Caption é suportado apenas para image, video e document
    if (caption && ['image', 'video', 'document'].includes(type)) {
        mediaPayload.caption = caption;
    }

    // Filename apenas para documents
    if (filename && type === 'document') {
        mediaPayload.filename = filename;
    }

    try {
        const response = await axios.post(config.MESSAGES_URL, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: type,
            [type]: mediaPayload
        }, {
            headers: config.getHeaders(),
            timeout: 15000
        });

        console.log(`[WA-SEND] ${type} enviado para ${to}`);
        return response.data;
    } catch (error) {
        console.error('[WA-SEND MEDIA ERROR]:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Enviar mensagem de template (pré-aprovado pelo Meta)
 * @param {string} to - Número do destinatário
 * @param {string} templateName - Nome do template
 * @param {string} language - Código do idioma (ex: pt_BR)
 * @param {Array} components - Parâmetros do template
 * @returns {Promise<object>} Resposta da API
 */
const sendTemplateMessage = async (to, templateName, language = 'pt_BR', components = []) => {
    if (!config.isConfigured()) {
        throw new Error('WhatsApp API not configured.');
    }

    checkRateLimit();

    try {
        const response = await axios.post(config.MESSAGES_URL, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: language },
                components: components
            }
        }, {
            headers: config.getHeaders(),
            timeout: 10000
        });

        console.log(`[WA-SEND] Template ${templateName} enviado para ${to}`);
        return response.data;
    } catch (error) {
        console.error('[WA-SEND TEMPLATE ERROR]:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Marcar mensagem como lida
 * @param {string} messageId - ID da mensagem recebida
 * @returns {Promise<object>} Resposta da API
 */
const markAsRead = async (messageId) => {
    if (!config.isConfigured()) return;

    try {
        await axios.post(config.MESSAGES_URL, {
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId
        }, {
            headers: config.getHeaders()
        });

        console.log(`[WA-READ] Mensagem ${messageId} marcada como lida`);
    } catch (error) {
        // Não precisa falhar se não conseguir marcar como lida
        console.warn('[WA-READ WARN]:', error.response?.data?.error?.message || error.message);
    }
};

/**
 * Enviar ação de digitação (indica que está "digitando")
 * @param {string} to - Número do destinatário
 * @returns {Promise<void>}
 */
const sendTypingIndicator = async (to) => {
    // WhatsApp Cloud API não suporta "typing" diretamente, mas podemos simular
    // com um pequeno delay antes de enviar a resposta
    console.log(`[WA-TYPING] Simulando digitação para ${to}...`);
};

/**
 * Baixar mídia recebida
 * @param {string} mediaId - ID da mídia no WhatsApp
 * @returns {Promise<Buffer>} Conteúdo da mídia
 */
const downloadMedia = async (mediaId) => {
    if (!config.isConfigured()) {
        throw new Error('WhatsApp API not configured.');
    }

    try {
        // Primeiro, obter URL da mídia
        const urlResponse = await axios.get(`${config.BASE_URL}/${mediaId}`, {
            headers: config.getHeaders()
        });

        const mediaUrl = urlResponse.data.url;

        // Baixar o conteúdo
        const mediaResponse = await axios.get(mediaUrl, {
            headers: config.getHeaders(),
            responseType: 'arraybuffer'
        });

        console.log(`[WA-DOWNLOAD] Mídia ${mediaId} baixada com sucesso`);
        return Buffer.from(mediaResponse.data);
    } catch (error) {
        console.error('[WA-DOWNLOAD ERROR]:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Verificar status da configuração
 * @returns {object} Status da API
 */
const getStatus = () => {
    return {
        configured: config.isConfigured(),
        phoneNumberId: config.PHONE_NUMBER_ID ? '***' + config.PHONE_NUMBER_ID.slice(-4) : null,
        apiVersion: config.API_VERSION,
        rateLimitRemaining: config.RATE_LIMIT.maxRequests - requestCount
    };
};

module.exports = {
    sendTextMessage,
    sendMediaMessage,
    sendTemplateMessage,
    markAsRead,
    sendTypingIndicator,
    downloadMedia,
    getStatus,
    humanDelay
};
