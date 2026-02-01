const request = require('supertest');
const app = require('../server');

describe('Security: CRM Access Control', () => {
    let authToken;

    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@getnexo.com.br',
                password: 'admin123'
            });

        if (loginResponse.status !== 200) {
             console.error('Login failed:', loginResponse.body);
        }
        authToken = loginResponse.body.token;
    });

    test('should DENY unauthenticated access to /api/crm/customers', async () => {
        const response = await request(app).get('/api/crm/customers');
        expect(response.status).toBe(401);
    });

    test('should allow authenticated access to /api/crm/customers', async () => {
        const response = await request(app)
            .get('/api/crm/customers')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.customers).toBeDefined();
    });
});
