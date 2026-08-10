const request = require('supertest');
const crypto = require('crypto');

// Set env BEFORE requiring anything else that might use it
process.env.WA_APP_SECRET = 'test_secret_123';
const APP_SECRET = process.env.WA_APP_SECRET;

// Mock db BEFORE importing app
jest.mock('../db', () => ({
    prepare: jest.fn(() => ({
        run: jest.fn(),
        get: jest.fn(),
        all: jest.fn(),
    })),
    transaction: jest.fn((cb) => cb),
    pragma: jest.fn(),
}));

// Also mock whatsappService to avoid external calls
jest.mock('../services/whatsappService', () => ({
    markAsRead: jest.fn(),
    sendTextMessage: jest.fn(),
    sendMediaMessage: jest.fn(),
}));

// Mock chat-loader to avoid file system or other issues
jest.mock('../chat-loader', () => ({
    carregaConversa: jest.fn(),
    salvaConversa: jest.fn(),
    geraRespostaBot: jest.fn(),
    processaComandos: jest.fn(),
}));

// Mock MultiAIService to avoid external API calls
jest.mock('../services/MultiAIService', () => ({
    getReply: jest.fn().mockResolvedValue({
        reply: 'Mocked AI Response',
        source: 'mock',
        provider: 'mock'
    })
}));

const app = require('../server');

describe('WhatsApp Webhook Signature Verification', () => {

    const payload = JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
            id: '123456789',
            changes: [{
                value: {
                    messaging_product: 'whatsapp',
                    metadata: {
                        display_phone_number: '5511999999999',
                        phone_number_id: '123456789'
                    },
                    messages: [{
                        from: '5511888888888',
                        id: 'wamid.test',
                        timestamp: '1709000000',
                        type: 'text',
                        text: { body: 'Hello' }
                    }]
                },
                field: 'messages'
            }]
        }]
    });

    const sign = (body, secret) => {
        return crypto.createHmac('sha256', secret).update(body).digest('hex');
    };

    it('should reject request without signature', async () => {
        const res = await request(app)
            .post('/api/whatsapp/webhook')
            .set('Content-Type', 'application/json')
            .send(JSON.parse(payload));

        expect(res.status).toBe(401);
    });

    it('should reject request with invalid signature', async () => {
        const signature = sign(payload, 'wrong_secret');
        const res = await request(app)
            .post('/api/whatsapp/webhook')
            .set('Content-Type', 'application/json')
            .set('X-Hub-Signature-256', `sha256=${signature}`)
            .send(JSON.parse(payload));

        expect(res.status).toBe(401);
    });

    it('should accept request with valid signature', async () => {
        const signature = sign(payload, APP_SECRET);
        const res = await request(app)
            .post('/api/whatsapp/webhook')
            .set('Content-Type', 'application/json')
            .set('X-Hub-Signature-256', `sha256=${signature}`)
            .send(JSON.parse(payload));

        expect(res.status).toBe(200);
    });
});
