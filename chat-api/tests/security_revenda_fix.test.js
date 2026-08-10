const request = require('supertest');
const express = require('express');

// Mock the db module BEFORE requiring it
jest.mock('../db', () => {
    const Database = require('better-sqlite3');
    return new Database(':memory:');
});

// Require the mocked db
const db = require('../db');

// Initialize Schema for Revenda
db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'client',
      role_id INTEGER DEFAULT 3,
      reseller_id INTEGER,
      plan TEXT,
      domain TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE reseller_profiles (
      user_id INTEGER PRIMARY KEY,
      balance REAL DEFAULT 0.0,
      commission_rate REAL DEFAULT 0.10,
      referral_code TEXT UNIQUE,
      bank_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reseller_id INTEGER,
        source_user_id INTEGER,
        amount REAL,
        description TEXT,
        status TEXT,
        created_at DATETIME
    );
    CREATE TABLE payout_requests (
        id INTEGER PRIMARY KEY,
        reseller_id INTEGER,
        amount REAL,
        status TEXT,
        requested_at DATETIME
    );
    CREATE TABLE contacts (
      id TEXT PRIMARY KEY,
      name TEXT,
      profile_pic_url TEXT,
      tags TEXT,
      funnel_stage TEXT DEFAULT 'lead',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'normal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Insert Test Data
db.prepare("INSERT INTO users (id, email, password, name, role, role_id) VALUES (2, 'reseller@test.com', 'pass', 'Reseller', 'reseller', 2)").run();
db.prepare("INSERT INTO reseller_profiles (user_id, balance) VALUES (2, 1000)").run();

db.prepare("INSERT INTO users (id, email, password, name, role, role_id) VALUES (3, 'client@test.com', 'pass', 'Client', 'client', 3)").run();

// Mock Auth Middleware
jest.mock('../middleware/jwtAuth', () => (req, res, next) => {
    const userId = req.headers['x-test-user-id'];
    if (userId) {
        req.userId = parseInt(userId);
        // We need to fetch the user from the db to get the role
        // Since we can't access 'db' here directly if we want to be safe with scope,
        // we can require it again or assume it works because require cache.
        // But simpler: just mock the user object based on ID since we know what we inserted.

        if (req.userId === 2) {
             req.user = { id: 2, role: 'reseller', role_id: 2 };
        } else if (req.userId === 3) {
             req.user = { id: 3, role: 'client', role_id: 3 };
        }
        return next();
    }
    res.status(401).json({ error: 'Auth required' });
});

const revendaRoutes = require('../routes/revenda');

const app = express();
app.use(express.json());
app.use('/api/revenda', revendaRoutes);

describe('Security: Revenda Routes Access Control', () => {

    test('Reseller should be able to create client', async () => {
        const res = await request(app)
            .post('/api/revenda/clientes')
            .set('X-Test-User-Id', '2') // Reseller ID
            .send({
                nome: 'New Client',
                email: 'new@client.com',
                password: '123'
            });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    test('Client should NOT be able to create client (Privilege Escalation)', async () => {
        const res = await request(app)
            .post('/api/revenda/clientes')
            .set('X-Test-User-Id', '3') // Client ID
            .send({
                nome: 'Hack Client',
                email: 'hack@client.com',
                password: '123'
            });

        // Currently this fails because there is no check, so it returns 200.
        // We expect 403 Forbidden.
        if (res.status === 200) {
            console.warn('VULNERABILITY CONFIRMED: Client was able to create a user via reseller API.');
        }
        expect(res.status).toBe(403);
    });

    test('Client should NOT be able to access stats', async () => {
        const res = await request(app)
            .get('/api/revenda/stats')
            .set('X-Test-User-Id', '3'); // Client ID

        // Currently returns 200 with empty data or nulls
        // Should be 403
         if (res.status === 200) {
            console.warn('VULNERABILITY CONFIRMED: Client was able to access reseller stats.');
        }
        expect(res.status).toBe(403);
    });
});
