const request = require('supertest');

// Mock dependencies to prevent side effects and ensure app loads
jest.mock('../db', () => {
    return {
        prepare: jest.fn().mockReturnThis(),
        run: jest.fn().mockReturnThis(),
        get: jest.fn(),
        all: jest.fn().mockReturnValue([]),
        transaction: jest.fn((cb) => cb),
        pragma: jest.fn(),
        exec: jest.fn()
    };
});

// Mock MultiAIService to prevent setInterval
jest.mock('../services/MultiAIService', () => {
    return {
        getReply: jest.fn().mockResolvedValue({ reply: 'mock', source: 'test' })
    };
});

const app = require('../server');

describe('Security Access Control Tests', () => {

    const vulnerableEndpoints = [
        '/api/crm/customers',
        '/api/crm/stats',
        '/api/products',
        '/api/settings',
        '/api/tickets',
        '/api/alert'
    ];

    vulnerableEndpoints.forEach(endpoint => {
        test(`should return 401 Unauthorized for ${endpoint}`, async () => {
            const response = await request(app).get(endpoint);
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Token não fornecido');
        });
    });

    test('should return 401 Unauthorized for /api/crm/customers/import (POST)', async () => {
        const response = await request(app)
            .post('/api/crm/customers/import')
            .send({ customers: [] });
        expect(response.status).toBe(401);
    });

    test('should return 401 Unauthorized for /api/settings (POST)', async () => {
        const response = await request(app)
            .post('/api/settings')
            .send({ settings: {} });
        expect(response.status).toBe(401);
    });
});
