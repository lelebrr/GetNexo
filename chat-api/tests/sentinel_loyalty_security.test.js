const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock external services to avoid DB errors in service layer
jest.mock('../services/LoyaltyService', () => ({
    getOrCreateUserProfile: jest.fn().mockResolvedValue({ getSummary: () => ({ points: 100 }) }),
    getGlobalStats: jest.fn().mockResolvedValue({}),
    getActiveConfig: jest.fn().mockResolvedValue({}),
}));

// Mock MultiAIService to avoid setInterval hanging tests
jest.mock('../services/MultiAIService', () => ({
    getReply: jest.fn().mockResolvedValue({ reply: 'Mock reply' }),
    getAccuracyStats: jest.fn().mockReturnValue({}),
    getDailyAccuracy: jest.fn().mockReturnValue([]),
    getComparativeDaily: jest.fn().mockReturnValue([]),
}));

// We need to use the SAME db instance as the server
const db = require('../db');
const app = require('../server');

describe('Sentinel Security: Loyalty Routes', () => {
    let userToken;
    let adminToken;
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_2026';

    beforeAll(() => {
        // Seed users directly into the app's DB instance
        const userPass = bcrypt.hashSync('user123', 10);
        const adminPass = bcrypt.hashSync('admin123', 10);

        // Clean up
        db.prepare('DELETE FROM users WHERE email IN (?, ?)').run('sentinel_user@test.com', 'sentinel_admin@test.com');

        // Insert Regular User
        const userResult = db.prepare(`
            INSERT INTO users (email, password, name, role, role_id)
            VALUES (?, ?, ?, ?, ?)
        `).run('sentinel_user@test.com', userPass, 'Sentinel User', 'client', 3);
        const userId = userResult.lastInsertRowid;

        // Insert Admin User
        const adminResult = db.prepare(`
            INSERT INTO users (email, password, name, role, role_id)
            VALUES (?, ?, ?, ?, ?)
        `).run('sentinel_admin@test.com', adminPass, 'Sentinel Admin', 'admin', 1);
        const adminId = adminResult.lastInsertRowid;

        // Generate Tokens manually to ensure they are valid for the server
        userToken = jwt.sign(
            { id: userId, email: 'sentinel_user@test.com', role: 'client', role_id: 3 },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        adminToken = jwt.sign(
            { id: adminId, email: 'sentinel_admin@test.com', role: 'admin', role_id: 1 },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    afterAll(() => {
        // Clean up
        db.prepare('DELETE FROM users WHERE email IN (?, ?)').run('sentinel_user@test.com', 'sentinel_admin@test.com');
    });

    test('Should reject unauthenticated access to /api/loyalty/points (formerly public)', async () => {
        const res = await request(app).get('/api/loyalty/points');
        expect(res.status).toBe(401);
        expect(res.body.error).toMatch(/Token não fornecido|Token inválido/);
    });

    test('Should reject bypass attempt using user-id header without token', async () => {
        const res = await request(app)
            .get('/api/loyalty/points')
            .set('user-id', '1'); // Trying to bypass

        expect(res.status).toBe(401); // Should be blocked by global auth middleware
    });

    test('Should allow access with valid user token', async () => {
        const res = await request(app)
            .get('/api/loyalty/points')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ points: 100 }); // Mocked response
    });

    test('Should reject admin access for regular user even with admin header', async () => {
        const res = await request(app)
            .get('/api/loyalty/admin/stats')
            .set('Authorization', `Bearer ${userToken}`)
            .set('admin', 'true'); // Trying to escalate privilege

        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Acesso negado');
    });

    test('Should allow admin access for actual admin user', async () => {
        const res = await request(app)
            .get('/api/loyalty/admin/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
    });
});
