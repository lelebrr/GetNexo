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
            const res = await request(app)
                .post('/api/a2a/identities')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test Identity', setDefault: true });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBeDefined();
            identityId = res.body.id;
        });

        test('GET /api/a2a/identities lists identities', async () => {
            const res = await request(app)
                .get('/api/a2a/identities')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/a2a/identities/:id/export exports public key', async () => {
            if (!identityId) return;
            const res = await request(app)
                .get(`/api/a2a/identities/${identityId}/export`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.publicKey).toBeDefined();
        });
    });

    describe('Message Operations', () => {
        test('POST /api/a2a/message:send processes message', async () => {
            const res = await request(app)
                .post('/api/a2a/message:send')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    message: { text: 'Hello, this is a test message' },
                    senderId: 'test-agent-123'
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('text');
            expect(res.body.context.handledBy).toMatch(/GetNexo/);
        });

        test('POST /api/a2a/message:send requires message.text', async () => {
            const res = await request(app)
                .post('/api/a2a/message:send')
                .set('Authorization', `Bearer ${token}`)
                .send({ senderId: 'test' });
            expect(res.status).toBe(400);
        });
    });

    describe('Task Management', () => {
        test('POST /api/a2a/tasks creates task', async () => {
            const res = await request(app)
                .post('/api/a2a/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'message', input: { text: 'Test task' } });
            expect(res.status).toBe(202);
            expect(res.body).toHaveProperty('id');
            expect(res.body.status).toBe('pending');
        });

        test('GET /api/a2a/tasks lists tasks', async () => {
            const res = await request(app)
                .get('/api/a2a/tasks')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('Peer Management', () => {
        let peerId;

        test('POST /api/a2a/peers adds peer', async () => {
            const res = await request(app)
                .post('/api/a2a/peers')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Test Peer', endpoint: 'https://example.com/api/a2a/message:send' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            peerId = res.body.id;
        });

        test('GET /api/a2a/peers lists peers', async () => {
            const res = await request(app)
                .get('/api/a2a/peers')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('DELETE /api/a2a/peers/:id removes peer', async () => {
            if (!peerId) return;
            const res = await request(app)
                .delete(`/api/a2a/peers/${peerId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });

    describe('Statistics', () => {
        test('GET /api/a2a/stats returns stats', async () => {
            // stats endpoint is public as per server.js: '/api/a2a/stats'
            const res = await request(app).get('/api/a2a/stats');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('messages');
            expect(res.body).toHaveProperty('tasks');
            expect(res.body).toHaveProperty('peers');
        });
    });
});
