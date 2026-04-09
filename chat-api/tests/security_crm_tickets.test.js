process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('CRM Security Vulnerabilities', () => {
  beforeAll(() => {
    // Seed some data
    db.prepare("INSERT OR IGNORE INTO contacts (id, name, funnel_stage) VALUES ('c1', 'Test Client', 'lead')").run();
    db.prepare("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, contact_id TEXT, subject TEXT, status TEXT)").run();
    db.prepare("INSERT INTO tickets (contact_id, subject, status) VALUES ('c1', 'Test Ticket', 'open')").run();
  });

  afterAll(() => {
    db.close();
  });

  test('GET /api/crm/customers should be protected', async () => {
    const res = await request(app).get('/api/crm/customers');
    expect(res.status).toBe(401);
  });

  test('DELETE /api/crm/customers/:id should be protected', async () => {
    const res = await request(app).delete('/api/crm/customers/c1');
    expect(res.status).toBe(401);

    // Verify it wasn't deleted
    const contact = db.prepare("SELECT * FROM contacts WHERE id = 'c1'").get();
    expect(contact).toBeDefined();
  });

  test('GET /api/tickets should be protected', async () => {
    const res = await request(app).get('/api/tickets');
    expect(res.status).toBe(401);
  });
});
