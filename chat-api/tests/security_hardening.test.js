const request = require('supertest');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Setup App similar to server.js
const app = express();

app.use(helmet());

// CORS Logic
const CORS_ORIGIN = 'http://localhost:4321';
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (CORS_ORIGIN.split(',').includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Rate Limit Logic
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2, // Low limit for testing
    message: { error: 'Too many login attempts' }
});

app.post('/api/login', loginLimiter, (req, res) => {
    res.json({ success: true });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

describe('Security Hardening', () => {

    it('HELMET: should have security headers', async () => {
        const res = await request(app).get('/api/health');
        expect(res.headers['x-dns-prefetch-control']).toBe('off');
        expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(res.headers['strict-transport-security']).toBeDefined();
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('CORS: should allow allowed origin', async () => {
        const res = await request(app)
            .get('/api/health')
            .set('Origin', 'http://localhost:4321');
        expect(res.headers['access-control-allow-origin']).toBe('http://localhost:4321');
    });

    it('CORS: should block disallowed origin', async () => {
        const res = await request(app)
            .get('/api/health')
            .set('Origin', 'http://evil.com');
        expect(res.status).toBe(500); // CORS middleware throws error
    });

    it('RATE LIMIT: should block excessive requests', async () => {
        // 1st attempt
        await request(app).post('/api/login');
        // 2nd attempt
        await request(app).post('/api/login');
        // 3rd attempt (should fail)
        const res = await request(app).post('/api/login');

        expect(res.status).toBe(429);
        expect(res.body.error).toBe('Too many login attempts');
    });
});
