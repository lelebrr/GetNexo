const request = require('supertest');
const app = require('../server');

describe('Security: Sensitive Endpoints Access Control', () => {

    it('should NOT allow unauthenticated access to CRM customers (FIXED)', async () => {
        const res = await request(app).get('/api/crm/customers');
        // Currently it should return 401 because it was removed from publicRoutes
        expect(res.statusCode).toBe(401);
    });

    it('should NOT allow unauthenticated access to tickets (FIXED)', async () => {
        const res = await request(app).get('/api/tickets');
        // Currently it should return 401 because it was removed from publicRoutes
        expect(res.statusCode).toBe(401);
    });
});
