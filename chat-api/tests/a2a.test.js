/**
 * A2A Protocol Tests
 */
const request = require('supertest');

// Get app - adjust path as needed
let app;
try {
    app = require('../server');
} catch (e) {
    const express = require('express');
    app = express();
    app.use(express.json());
    app.use('/api/a2a', require('../routes/a2a'));
}

describe('A2A Protocol', () => {
    let authToken;

    beforeAll(async () => {
        // Login to get auth token if using full app
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
            // Ignore if login fails (e.g. using fallback app without auth)
        }
    });

    describe('Agent Card Discovery', () => {
        test('GET /api/a2a/agent-card.json returns valid agent card', async () => {
            const res = await request(app).get('/api/a2a/agent-card.json');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('supportedInterfaces');
            expect(res.body).toHaveProperty('capabilities');
            expect(res.body.protocol).toBe('A2A');
        });
    });

    describe('Identity Management', () => {
        let identityId;

        test('POST /api/a2a/identities creates identity', async () => {
            const req = request(app).post('/api/a2a/identities');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);

            const res = await req.send({ name: 'Test Identity', setDefault: true });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBeDefined();
            identityId = res.body.id;
        });

        test('GET /api/a2a/identities lists identities', async () => {
            const req = request(app).get('/api/a2a/identities');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/a2a/identities/:id/export exports public key', async () => {
            if (!identityId) return;
            const req = request(app).get(`/api/a2a/identities/${identityId}/export`);
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(res.body.publicKey).toBeDefined();
        });
    });

    describe('Message Operations', () => {
        test('POST /api/a2a/message:send processes message', async () => {
            const req = request(app).post('/api/a2a/message:send');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({
                    message: { text: 'Hello, this is a test message' },
                    senderId: 'test-agent-123'
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('text');
            expect(res.body.context.handledBy).toMatch(/GetNexo/);
        });

        test('POST /api/a2a/message:send requires message.text', async () => {
            const req = request(app).post('/api/a2a/message:send');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({ senderId: 'test' });
            expect(res.status).toBe(400);
        });
    });

    describe('Task Management', () => {
        test('POST /api/a2a/tasks creates task', async () => {
            const req = request(app).post('/api/a2a/tasks');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({ type: 'message', input: { text: 'Test task' } });
            expect(res.status).toBe(202);
            expect(res.body).toHaveProperty('id');
            expect(res.body.status).toBe('pending');
        });

        test('GET /api/a2a/tasks lists tasks', async () => {
            const req = request(app).get('/api/a2a/tasks');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('Peer Management', () => {
        let peerId;

        test('POST /api/a2a/peers adds peer', async () => {
            const req = request(app).post('/api/a2a/peers');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req.send({ name: 'Test Peer', endpoint: 'https://example.com/api/a2a/message:send' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            peerId = res.body.id;
        });

        test('GET /api/a2a/peers lists peers', async () => {
            const req = request(app).get('/api/a2a/peers');
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('DELETE /api/a2a/peers/:id removes peer', async () => {
            if (!peerId) return;
            const req = request(app).delete(`/api/a2a/peers/${peerId}`);
            if (authToken) req.set('Authorization', `Bearer ${authToken}`);
            const res = await req;
            expect(res.status).toBe(200);
        });
    });

    describe('Statistics', () => {
        test('GET /api/a2a/stats returns stats', async () => {
            const res = await request(app).get('/api/a2a/stats');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('messages');
            expect(res.body).toHaveProperty('tasks');
            expect(res.body).toHaveProperty('peers');
        });
    });
});
