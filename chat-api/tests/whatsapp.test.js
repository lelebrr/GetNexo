/**
 * WhatsApp Business API Tests
 * @module tests/whatsapp.test.js
 */

const request = require('supertest');

// Mock axios before requiring app
jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({
        data: {
            messages: [{ id: 'wamid.test123' }]
        }
    })),
    get: jest.fn(() => Promise.resolve({ data: {} }))
}));

// Mock verifyWebhook middleware to skip signature verification in these tests
jest.mock('../middleware/verifyWebhook', () => (req, res, next) => next());

const app = require('../server');
const db = require('../db');

describe('WhatsApp Business API Integration', () => {

    describe('GET /api/whatsapp/webhook (Verification)', () => {

        it('should verify webhook with correct token', async () => {
            const verifyToken = process.env.WA_WEBHOOK_VERIFY_TOKEN || 'getnexo_verify_2026';
            const challenge = 'test_challenge_12345';

            const response = await request(app)
                .get('/api/whatsapp/webhook')
                .query({
                    'hub.mode': 'subscribe',
                    'hub.verify_token': verifyToken,
                    'hub.challenge': challenge
                });

            expect(response.status).toBe(200);
            expect(response.text).toBe(challenge);
        });

        it('should reject webhook with incorrect token', async () => {
            const response = await request(app)
                .get('/api/whatsapp/webhook')
                .query({
                    'hub.mode': 'subscribe',
                    'hub.verify_token': 'wrong_token',
                    'hub.challenge': 'test_challenge'
                });

            expect(response.status).toBe(403);
        });

        it('should reject webhook without subscribe mode', async () => {
            const response = await request(app)
                .get('/api/whatsapp/webhook')
                .query({
                    'hub.mode': 'unsubscribe',
                    'hub.verify_token': 'getnexo_verify_2026',
                    'hub.challenge': 'test_challenge'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('POST /api/whatsapp/webhook (Message Receiving)', () => {

        it('should handle incoming text message', async () => {
            const webhookPayload = {
                object: 'whatsapp_business_account',
                entry: [{
                    id: 'BUSINESS_ACCOUNT_ID',
                    changes: [{
                        value: {
                            messaging_product: 'whatsapp',
                            metadata: {
                                display_phone_number: '5511999999999',
                                phone_number_id: '123456789'
                            },
                            contacts: [{
                                profile: { name: 'Test User' },
                                wa_id: '5511888888888'
                            }],
                            messages: [{
                                from: '5511888888888',
                                id: 'wamid.incoming123',
                                timestamp: '1709000000',
                                type: 'text',
                                text: { body: 'Olá, teste!' }
                            }]
                        },
                        field: 'messages'
                    }]
                }]
            };

            const response = await request(app)
                .post('/api/whatsapp/webhook')
                .send(webhookPayload);

            expect(response.status).toBe(200);
        });

        it('should handle status update', async () => {
            const statusPayload = {
                object: 'whatsapp_business_account',
                entry: [{
                    id: 'BUSINESS_ACCOUNT_ID',
                    changes: [{
                        value: {
                            messaging_product: 'whatsapp',
                            metadata: {
                                display_phone_number: '5511999999999',
                                phone_number_id: '123456789'
                            },
                            statuses: [{
                                id: 'wamid.sent123',
                                status: 'delivered',
                                timestamp: '1709000100',
                                recipient_id: '5511888888888'
                            }]
                        },
                        field: 'messages'
                    }]
                }]
            };

            const response = await request(app)
                .post('/api/whatsapp/webhook')
                .send(statusPayload);

            expect(response.status).toBe(200);
        });

        it('should return 200 for non-whatsapp objects', async () => {
            const response = await request(app)
                .post('/api/whatsapp/webhook')
                .send({ object: 'page' });

            expect(response.status).toBe(200);
        });
    });

    describe('GET /api/whatsapp/status', () => {

        it('should require authentication', async () => {
            const response = await request(app)
                .get('/api/whatsapp/status');

            expect(response.status).toBe(401);
        });

        it('should return status with valid token', async () => {
            // Login first to get token
            const loginResponse = await request(app)
                .post('/api/login')
                .send({
                    email: 'admin@getnexo.com.br',
                    password: 'admin123'
                });

            const token = loginResponse.body.token;

            const response = await request(app)
                .get('/api/whatsapp/status')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('configured');
            expect(response.body).toHaveProperty('apiVersion');
        });
    });

    describe('Database Schema', () => {

        it('should have phone column in contacts table', () => {
            const info = db.pragma('table_info(contacts)');
            const hasPhone = info.some(col => col.name === 'phone');
            expect(hasPhone).toBe(true);
        });

        it('should have source column in contacts table', () => {
            const info = db.pragma('table_info(contacts)');
            const hasSource = info.some(col => col.name === 'source');
            expect(hasSource).toBe(true);
        });

        it('should have media_url column in messages table', () => {
            const info = db.pragma('table_info(messages)');
            const hasMediaUrl = info.some(col => col.name === 'media_url');
            expect(hasMediaUrl).toBe(true);
        });

        it('should have wa_message_id column in messages table', () => {
            const info = db.pragma('table_info(messages)');
            const hasWaMessageId = info.some(col => col.name === 'wa_message_id');
            expect(hasWaMessageId).toBe(true);
        });
    });
});
