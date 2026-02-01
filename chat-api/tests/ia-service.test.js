/**
 * Testes para o serviço Multi-IA
 * npm test -- tests/ia-service.test.js
 */

const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Multi-IA Service API', () => {
    let authToken;

    beforeAll(async () => {
        // Login para obter token
        const loginRes = await request(app)
            .post('/api/login')
            .send({ email: 'cliente@getnexo.com', password: 'demo123' });

        authToken = loginRes.body.token;
    });

    describe('POST /api/ia/reply', () => {
        it('deve retornar resposta com source', async () => {
            const res = await request(app)
                .post('/api/ia/reply')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: 'Olá, quanto custa o plano básico?' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('reply');
            expect(res.body).toHaveProperty('source');
            expect(['deepseek', 'grok', 'gemini', 'fallback']).toContain(res.body.source);
        });

        it('deve retornar erro sem mensagem', async () => {
            const res = await request(app)
                .post('/api/ia/reply')
                .set('Authorization', `Bearer ${authToken}`)
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/ia/acerto-stats', () => {
        it('deve retornar estatísticas por IA', async () => {
            const res = await request(app)
                .get('/api/ia/acerto-stats')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('deepseek');
            expect(res.body).toHaveProperty('grok');
            expect(res.body).toHaveProperty('gemini');
            expect(typeof res.body.deepseek).toBe('number');
        });
    });

    describe('GET /api/ia/acerto-diario', () => {
        it('deve retornar dados para gráfico de linha', async () => {
            const res = await request(app)
                .get('/api/ia/acerto-diario')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('dias');
            expect(res.body).toHaveProperty('taxas');
            expect(Array.isArray(res.body.dias)).toBe(true);
            expect(Array.isArray(res.body.taxas)).toBe(true);
        });
    });

    describe('GET /api/ia/comparativo-diario', () => {
        it('deve retornar dados comparativos por IA', async () => {
            const res = await request(app)
                .get('/api/ia/comparativo-diario')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('dias');
            expect(res.body).toHaveProperty('deepseek');
            expect(res.body).toHaveProperty('grok');
            expect(res.body).toHaveProperty('gemini');
        });
    });

    describe('Settings - Prompt', () => {
        it('GET /api/settings/prompt - deve retornar prompt atual', async () => {
            const res = await request(app)
                .get('/api/settings/prompt')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('custom_prompt');
        });

        it('POST /api/settings/prompt - deve salvar novo prompt', async () => {
            const testPrompt = 'Responda como vendedor brasileiro, foque em PIX. Seja amigável.';

            const res = await request(app)
                .post('/api/settings/prompt')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ custom_prompt: testPrompt });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.custom_prompt).toBe(testPrompt);
        });

        it('POST /api/settings/prompt - deve rejeitar prompt curto', async () => {
            const res = await request(app)
                .post('/api/settings/prompt')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ custom_prompt: 'curto' });

            expect(res.statusCode).toBe(400);
        });

        it('GET /api/settings/prompts-history - deve retornar histórico', async () => {
            const res = await request(app)
                .get('/api/settings/prompts-history')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('history');
            expect(Array.isArray(res.body.history)).toBe(true);
        });
    });

    describe('Settings - IA Preferida', () => {
        it('GET /api/settings/preferred-ia - deve retornar IA preferida', async () => {
            const res = await request(app)
                .get('/api/settings/preferred-ia')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('preferred_ia');
            expect(['deepseek', 'grok', 'gemini']).toContain(res.body.preferred_ia);
        });

        it('POST /api/settings/preferred-ia - deve salvar IA preferida', async () => {
            const res = await request(app)
                .post('/api/settings/preferred-ia')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ preferred_ia: 'gemini' });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.preferred_ia).toBe('gemini');
        });

        it('POST /api/settings/preferred-ia - deve rejeitar IA inválida', async () => {
            const res = await request(app)
                .post('/api/settings/preferred-ia')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ preferred_ia: 'chatgpt' });

            expect(res.statusCode).toBe(400);
        });
    });
});
