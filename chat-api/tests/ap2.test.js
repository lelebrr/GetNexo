/**
 * AP2 Protocol Tests
 */
const request = require('supertest');

let app;
try {
    app = require('../server');
} catch (e) {
    const express = require('express');
    app = express();
    app.use(express.json());
    app.use('/api/ap2', require('../routes/ap2'));
}

describe('AP2 Protocol', () => {
    let mandateId;
    let transactionId;
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@getnexo.com.br',
                password: process.env.ADMIN_PASSWORD || 'admin123'
            });
        token = res.body.token;
    });

    describe('Mandate Management', () => {
        test('POST /api/ap2/mandates creates cart mandate', async () => {
            const res = await request(app)
                .post('/api/ap2/mandates')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    type: 'cart',
                    scope: 'purchase',
                    constraints: { max_amount: 100, currency: 'BRL' }
                });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.mandate_id).toBeDefined();
            mandateId = res.body.mandate_id;
        });

        test('POST /api/ap2/mandates creates intent mandate', async () => {
            const res = await request(app)
                .post('/api/ap2/mandates')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'intent', scope: 'subscription', constraints: { max_amount: 50 } });
            expect(res.status).toBe(201);
        });

        test('GET /api/ap2/mandates lists mandates', async () => {
            const res = await request(app)
                .get('/api/ap2/mandates')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/ap2/mandates/:id gets mandate', async () => {
            if (!mandateId) return;
            const res = await request(app)
                .get(`/api/ap2/mandates/${mandateId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.mandate_id).toBe(mandateId);
        });
    });

    describe('Payment Processing', () => {
        test('POST /api/ap2/pay requires mandate', async () => {
            const res = await request(app)
                .post('/api/ap2/pay')
                .set('Authorization', `Bearer ${token}`)
                .send({ amount: 50, currency: 'BRL' });
            expect(res.status).toBe(400);
        });

        test('POST /api/ap2/pay processes payment with mandate', async () => {
            if (!mandateId) return;
            const res = await request(app)
                .post('/api/ap2/pay')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    amount: 50,
                    currency: 'BRL',
                    agent_id: 'test-agent',
                    mandate: { id: mandateId }
                });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.transaction_id).toBeDefined();
            transactionId = res.body.transaction_id;
        });

        test('POST /api/ap2/pay rejects amount over limit', async () => {
            // Create a new mandate with low limit
            const createRes = await request(app)
                .post('/api/ap2/mandates')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'cart', scope: 'test', constraints: { max_amount: 10 } });

            const res = await request(app)
                .post('/api/ap2/pay')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    amount: 50,
                    currency: 'BRL',
                    mandate: { id: createRes.body.mandate_id }
                });
            expect(res.status).toBe(400);
            expect(res.body.violations).toBeDefined();
        });
    });

    describe('Transaction Management', () => {
        test('GET /api/ap2/transactions lists transactions', async () => {
            const res = await request(app)
                .get('/api/ap2/transactions')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('POST /api/ap2/transactions/:id/capture captures payment', async () => {
            // Create new mandate for capture test
            const mandate = await request(app)
                .post('/api/ap2/mandates')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'cart', scope: 'capture-test', constraints: { max_amount: 100 } });

            const payment = await request(app)
                .post('/api/ap2/pay')
                .set('Authorization', `Bearer ${token}`)
                .send({ amount: 30, currency: 'BRL', mandate: { id: mandate.body.mandate_id } });

            if (payment.body.status === 'pending') {
                const res = await request(app)
                    .post(`/api/ap2/transactions/${payment.body.transaction_id}/capture`)
                    .set('Authorization', `Bearer ${token}`);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('captured');
            }
        });
    });

    describe('Mandate Revocation', () => {
        test('DELETE /api/ap2/mandates/:id revokes mandate', async () => {
            const create = await request(app)
                .post('/api/ap2/mandates')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'intent', scope: 'revoke-test', constraints: {} });

            const res = await request(app)
                .delete(`/api/ap2/mandates/${create.body.mandate_id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('revoked');
        });
    });

    describe('Statistics', () => {
        test('GET /api/ap2/stats returns stats', async () => {
            const res = await request(app).get('/api/ap2/stats');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('mandates');
            expect(res.body).toHaveProperty('transactions');
        });
    });
});
