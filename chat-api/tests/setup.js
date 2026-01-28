// Setup file for Jest tests
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';
// Use in-memory DB for tests to avoid I/O conflicts and ensure isolation
process.env.DB_PATH = ':memory:';

const db = new Database(':memory:');
global.testDb = db;

// Initialize schema with basic tables
const tables = [
    `CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT UNIQUE, permissions TEXT)`,
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, role_id INTEGER, two_fa_secret TEXT, two_fa_enabled BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (role_id) REFERENCES roles (id))`,
    `CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER, created_at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, status TEXT DEFAULT 'open', isDraft BOOLEAN DEFAULT 0, priority TEXT DEFAULT 'medium', category TEXT, tags TEXT, requester_userId TEXT, requester_name TEXT, requester_email TEXT, requester_phone TEXT, assignee_userId TEXT, assignee_name TEXT, assignee_email TEXT, agentFolder TEXT, parentTicket TEXT, subTickets TEXT, sla_initialResponseTime INTEGER DEFAULT 86400000, sla_resolutionTime INTEGER DEFAULT 604800000, sla_paused BOOLEAN DEFAULT 0, sla_pauseReason TEXT, sla_pauseStartTime TIMESTAMP, sla_totalPausedTime INTEGER DEFAULT 0, sla_breached BOOLEAN DEFAULT 0, sla_breachTime TIMESTAMP, checklist TEXT, attachments TEXT, reminders TEXT, costTimer TEXT, template TEXT, mergedInto TEXT, duplicates TEXT, automationRules TEXT, aiAnalysis TEXT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS agent_folders (id INTEGER PRIMARY KEY AUTOINCREMENT, agent_id INTEGER NOT NULL, name TEXT NOT NULL, parent_id INTEGER, color TEXT, icon TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_checklist_items (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'pending', assigned_to INTEGER, due_date TIMESTAMP, completed_at TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_history (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, action TEXT NOT NULL, old_value TEXT, new_value TEXT, user_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_transfers (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, from_agent_id INTEGER, to_agent_id INTEGER NOT NULL, reason TEXT, transferred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS sla_pauses (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, paused_by INTEGER, reason TEXT, paused_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, resumed_at TIMESTAMP, duration INTEGER)`,
    `CREATE TABLE IF NOT EXISTS ticket_merges (id INTEGER PRIMARY KEY AUTOINCREMENT, source_ticket_id TEXT NOT NULL, target_ticket_id TEXT NOT NULL, merged_by INTEGER, reason TEXT, merged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_duplicates (id INTEGER PRIMARY KEY AUTOINCREMENT, original_ticket_id TEXT NOT NULL, duplicate_ticket_id TEXT NOT NULL, reported_by INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_tags (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, tag TEXT NOT NULL, added_by INTEGER, added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT, title_template TEXT, description_template TEXT, priority TEXT DEFAULT 'medium', tags TEXT, checklist_items TEXT, is_public BOOLEAN DEFAULT 0, created_by INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS attachments (id TEXT PRIMARY KEY, ticket_id TEXT, filename TEXT NOT NULL, original_name TEXT NOT NULL, type TEXT, size INTEGER, path TEXT, hash TEXT, uploaded_by INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS ticket_reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT, reminder_date TIMESTAMP NOT NULL, is_recurring BOOLEAN DEFAULT 0, recurrence_pattern TEXT, is_completed BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS cost_timers (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT NOT NULL, user_id INTEGER NOT NULL, hourly_rate REAL DEFAULT 50, started_at TIMESTAMP, ended_at TIMESTAMP, duration INTEGER DEFAULT 0, total_cost REAL DEFAULT 0, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS automation_rules (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, trigger_event TEXT NOT NULL, conditions TEXT, actions TEXT, is_active BOOLEAN DEFAULT 1, created_by INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS agent_feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, agent_id INTEGER NOT NULL, ticket_id TEXT, evaluator_id INTEGER NOT NULL, rating INTEGER, comments TEXT, categories TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS system_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, level TEXT, message TEXT, details TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS audit_trail (id INTEGER PRIMARY KEY AUTOINCREMENT, table_name TEXT NOT NULL, record_id TEXT NOT NULL, action TEXT NOT NULL, user_id INTEGER, old_values TEXT, new_values TEXT, ip_address TEXT, user_agent TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
];

tables.forEach(table => db.exec(table));

// Init basic data
db.prepare('INSERT OR IGNORE INTO roles (name, permissions) VALUES (?, ?)').run('Admin', 'all');
db.prepare('INSERT OR IGNORE INTO roles (name, permissions) VALUES (?, ?)').run('Reseller', 'sales');
db.prepare('INSERT OR IGNORE INTO roles (name, permissions) VALUES (?, ?)').run('User', 'basic');

// Create test admin user (force insert for tests)
const bcrypt = require('bcryptjs');
const adminPass = bcrypt.hashSync('test123', 10);

// Delete existing user first to ensure clean state
db.prepare('DELETE FROM users WHERE email = ?').run('admin@test.com');
db.prepare('INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)').run('admin@test.com', adminPass, 1);

// Make db available globally for tests
global.db = db;

// Cleanup after each test
afterEach(() => {
    // Clean up test data if needed
});

// Cleanup after all tests
afterAll(() => {
    if (db) {
        db.close();
    }
});