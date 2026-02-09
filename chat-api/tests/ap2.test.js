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
    let token = '';

    beforeAll(async () => {
        try {
            const res = await request(app)
                .post('/api/login')
                .send({
                    email: 'admin@getnexo.com.br',
                    password: 'admin123'
                });

            if (res.status === 200) {
                token = res.body.token;
            }
        } catch (e) {}
    });

    describe('Mandate Management', () => {
        test('POST /api/ap2/mandates creates cart mandate', async () => {
            const req = request(app).post('/api/ap2/mandates');
            if (token) req.set('Authorization', `Bearer ${token}`);

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
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.send({ type: 'intent', scope: 'subscription', constraints: { max_amount: 50 } });
            expect(res.status).toBe(201);
        });

        test('GET /api/ap2/mandates lists mandates', async () => {
            const req = request(app).get('/api/ap2/mandates');
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/ap2/mandates/:id gets mandate', async () => {
            if (!mandateId) return;
            const req = request(app).get(`/api/ap2/mandates/${mandateId}`);
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.expect(200);
            expect(res.body.mandate_id).toBe(mandateId);
        });
    });

    describe('Payment Processing', () => {
        test('POST /api/ap2/pay requires mandate', async () => {
            const req = request(app).post('/api/ap2/pay');
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.send({ amount: 50, currency: 'BRL' });
            expect(res.status).toBe(400);
        });

        test('POST /api/ap2/pay processes payment with mandate', async () => {
            if (!mandateId) return;
            const req = request(app).post('/api/ap2/pay');
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.send({
                    amount: 50,
                    currency: 'BRL',
                    agent_id: 'test-agent',
                    mandate: { id: mandateId }
                });
            if (res.status !== 200) console.log('AP2 Pay Error:', JSON.stringify(res.body));
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.transaction_id).toBeDefined();
            transactionId = res.body.transaction_id;
        });

        test('POST /api/ap2/pay rejects amount over limit', async () => {
            // Create a new mandate with low limit
            const createReq = request(app).post('/api/ap2/mandates');
            if (token) createReq.set('Authorization', `Bearer ${token}`);

            const createRes = await createReq.send({ type: 'cart', scope: 'test', constraints: { max_amount: 10 } });

            const req = request(app).post('/api/ap2/pay');
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.send({
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
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('POST /api/ap2/transactions/:id/capture captures payment', async () => {
            // Create new mandate for capture test
            const mandateReq = request(app).post('/api/ap2/mandates');
            if (token) mandateReq.set('Authorization', `Bearer ${token}`);
            const mandate = await mandateReq.send({ type: 'cart', scope: 'capture-test', constraints: { max_amount: 100 } });

            const payReq = request(app).post('/api/ap2/pay');
            if (token) payReq.set('Authorization', `Bearer ${token}`);
            const payment = await payReq.send({ amount: 30, currency: 'BRL', mandate: { id: mandate.body.mandate_id } });

            if (payment.body.status === 'pending') {
                const req = request(app).post(`/api/ap2/transactions/${payment.body.transaction_id}/capture`);
                if (token) req.set('Authorization', `Bearer ${token}`);
                const res = await req.send();

                expect(res.status).toBe(200);
                expect(res.body.status).toBe('captured');
            }
        });
    });

    describe('Mandate Revocation', () => {
        test('DELETE /api/ap2/mandates/:id revokes mandate', async () => {
            const createReq = request(app).post('/api/ap2/mandates');
            if (token) createReq.set('Authorization', `Bearer ${token}`);

            const create = await createReq.send({ type: 'intent', scope: 'revoke-test', constraints: {} });

            const req = request(app).delete(`/api/ap2/mandates/${create.body.mandate_id}`);
            if (token) req.set('Authorization', `Bearer ${token}`);

            const res = await req.expect(200);
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
