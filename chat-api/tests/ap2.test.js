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
    let authToken;

    beforeAll(async () => {
        try {
            const loginResponse = await request(app)
                .post('/api/login')
                .send({
                    email: 'admin@test.com',
                    password: 'test123'
                });

            if (loginResponse.status === 200) {
                authToken = loginResponse.body.token;
            }
        } catch (e) {
            // Ignore
        }
    });

    describe('Mandate Management', () => {
        test('POST /api/ap2/mandates creates cart mandate', async () => {
            const req = request(app).post('/api/ap2/mandates');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({
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
            const req = request(app).post('/api/ap2/mandates');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({ type: 'intent', scope: 'subscription', constraints: { max_amount: 50 } });
            expect(res.status).toBe(201);
        });

        test('GET /api/ap2/mandates lists mandates', async () => {
            const req = request(app).get('/api/ap2/mandates');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/ap2/mandates/:id gets mandate', async () => {
            if (!mandateId) return;
            const req = request(app).get(`/api/ap2/mandates/${mandateId}`);
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(res.body.mandate_id).toBe(mandateId);
        });
    });

    describe('Payment Processing', () => {
        test('POST /api/ap2/pay requires mandate', async () => {
            const req = request(app).post('/api/ap2/pay');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({ amount: 50, currency: 'BRL' });
            expect(res.status).toBe(400);
        });

        test('POST /api/ap2/pay processes payment with mandate', async () => {
            if (!mandateId) return;
            const req = request(app).post('/api/ap2/pay');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({
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
            const reqCreate = request(app).post('/api/ap2/mandates');
            if (authToken) reqCreate.set('Authorization', `Bearer ${authToken}`);
            const createRes = await reqCreate.send({ type: 'cart', scope: 'test', constraints: { max_amount: 10 } });

            const reqPay = request(app).post('/api/ap2/pay');
            if (authToken) reqPay.set('Authorization', `Bearer ${authToken}`);
            const res = await reqPay.send({
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
            const req = request(app).get('/api/ap2/transactions');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('POST /api/ap2/transactions/:id/capture captures payment', async () => {
            // Create new mandate for capture test
            const reqMandate = request(app).post('/api/ap2/mandates');
            if (authToken) reqMandate.set('Authorization', `Bearer ${authToken}`);
            const mandate = await reqMandate.send({ type: 'cart', scope: 'capture-test', constraints: { max_amount: 100 } });

            const reqPay = request(app).post('/api/ap2/pay');
            if (authToken) reqPay.set('Authorization', `Bearer ${authToken}`);
            const payment = await reqPay.send({ amount: 30, currency: 'BRL', mandate: { id: mandate.body.mandate_id } });

            if (payment.body.status === 'pending') {
                const reqCapture = request(app).post(`/api/ap2/transactions/${payment.body.transaction_id}/capture`);
                if (authToken) reqCapture.set('Authorization', `Bearer ${authToken}`);
                const res = await reqCapture;
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('captured');
            }
        });
    });

    describe('Mandate Revocation', () => {
        test('DELETE /api/ap2/mandates/:id revokes mandate', async () => {
            const reqCreate = request(app).post('/api/ap2/mandates');
            if (authToken) reqCreate.set('Authorization', `Bearer ${authToken}`);
            const create = await reqCreate.send({ type: 'intent', scope: 'revoke-test', constraints: {} });

            const reqDelete = request(app).delete(`/api/ap2/mandates/${create.body.mandate_id}`);
            if (authToken) reqDelete.set('Authorization', `Bearer ${authToken}`);
            const res = await reqDelete;
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
