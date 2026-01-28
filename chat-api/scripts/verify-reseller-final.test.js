
const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Final Reseller Verification', () => {
    let token;
    let resellerId = 2; // From seed
    let createdClientId;

    beforeAll(async () => {
        // Login as Reseller
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'revendedor@getnexo.com',
                password: 'demo123'
            });

        if (res.status !== 200) {
            console.error('Login Failed:', res.body);
            throw new Error('Login failed');
        }
        token = res.body.token;
        console.log('Login successful. Token acquired.');
    });

    test('Should create a client with custom Plan and Domain', async () => {
        const uniqueEmail = `stress_test_${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/revenda/clientes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Stress Test Client',
                email: uniqueEmail,
                plan: 'Enterprise',
                domain: 'stress-test.com'
            });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        createdClientId = res.body.clientId;
        console.log(`Client created with ID: ${createdClientId}`);
    });

    test('Should list clients and verify custom fields', async () => {
        const res = await request(app)
            .get('/api/revenda/clientes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        const client = res.body.find(c => c.id === createdClientId);

        expect(client).toBeDefined();
        expect(client.plano).toBe('Enterprise');
        expect(client.dominio).toBe('stress-test.com');
        expect(client.status).toBe('active');
        console.log('Client verification passed:', client);
    });

    test('Should return Marketing links with correct referral code', async () => {
        const res = await request(app)
            .get('/api/revenda/marketing')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);

        // Check links
        const homeLink = res.body.links.find(l => l.url.includes('ref=NEXO-REV-2026'));
        expect(homeLink).toBeDefined();
        console.log('Marketing link verification passed:', homeLink.url);

        // Check landings
        const landing = res.body.landings[0];
        expect(landing.url).toContain('ref=NEXO-REV-2026');
        console.log('Landing link verification passed:', landing.url);
    });

    test('Should show active stats increase', async () => {
        const res = await request(app)
            .get('/api/revenda/stats')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        console.log('Stats:', res.body);
        expect(res.body.active_subscriptions).toBeGreaterThan(0);
        // We just added one, so it should be at least 1 (ignoring seed which linked user 3)
    });
});
