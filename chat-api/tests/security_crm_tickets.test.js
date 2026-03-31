const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Security: CRM & Sensitive Endpoints Access Control', () => {
    beforeAll(() => {
        // Create contacts table if it doesn't exist (it might not be in the test setup)
        db.exec(`CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            name TEXT,
            profile_pic_url TEXT,
            tags TEXT,
            funnel_stage TEXT DEFAULT 'lead',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert a sensitive contact
        db.prepare('INSERT OR IGNORE INTO contacts (id, name, funnel_stage) VALUES (?, ?, ?)').run('secure-123', 'Sensitive Customer', 'client');
    });

    afterAll(() => {
        db.prepare('DELETE FROM contacts WHERE id = ?').run('secure-123');
    });

    test('GET /api/crm/customers should return 401 Unauthorized', async () => {
        const response = await request(app).get('/api/crm/customers');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    test('GET /api/tickets should return 401 Unauthorized', async () => {
        const response = await request(app).get('/api/tickets');
        expect(response.status).toBe(401);
    });

    test('GET /api/settings should return 401 Unauthorized', async () => {
        const response = await request(app).get('/api/settings');
        expect(response.status).toBe(401);
    });

    test('GET /api/analytics/dashboard-stats should return 401 Unauthorized', async () => {
        const response = await request(app).get('/api/analytics/dashboard-stats');
        expect(response.status).toBe(401);
    });
});
