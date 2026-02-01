const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = './bench.db';
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Initialize Schema
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      body TEXT,
      timestamp INTEGER
    );
`);

console.log('Seeding data (1000 contacts, 50k transactions, 100k messages)...');
const contacts = [];
for(let i=0; i<1000; i++) contacts.push(`contact_${i}`);

db.exec('BEGIN TRANSACTION');

// Contacts
const insertContact = db.prepare('INSERT INTO contacts (id, name) VALUES (?, ?)');
contacts.forEach(c => insertContact.run(c, 'Client ' + c));

// Transactions
const insertTx = db.prepare('INSERT INTO transactions (contact_id, amount, status, created_at) VALUES (?, ?, ?, ?)');
for(let i=0; i<50000; i++) {
     const cid = contacts[Math.floor(Math.random() * contacts.length)];
     const status = Math.random() > 0.5 ? 'paid' : 'pending';
     const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)).toISOString();
     insertTx.run(cid, Math.random() * 100, status, date);
}

// Messages
const insertMsg = db.prepare('INSERT INTO messages (id, contact_id, body, timestamp) VALUES (?, ?, ?, ?)');
for(let i=0; i<100000; i++) {
    const cid = contacts[Math.floor(Math.random() * contacts.length)];
    const ts = Math.floor(Date.now()/1000) - Math.floor(Math.random() * 30 * 24 * 3600);
    insertMsg.run(`msg_${i}`, cid, 'Hello', ts);
}

db.exec('COMMIT');
console.log('Seeding done.');

function runBenchmark(label) {
    console.log(`\n--- Benchmarking: ${label} ---`);
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;

    // 1. Transactions status + date
    const start1 = process.hrtime();
    db.prepare("SELECT COUNT(*) FROM transactions WHERE status = 'paid' AND created_at >= datetime('now', '-7 day')").get();
    const end1 = process.hrtime(start1);
    console.log(`Query 1 (Transactions): ${(end1[0] * 1000 + end1[1]/1e6).toFixed(2)}ms`);

    // 2. Messages Range
    const start2 = process.hrtime();
    db.prepare("SELECT COUNT(DISTINCT contact_id) FROM messages WHERE timestamp >= ?").get(oneDayAgo);
    const end2 = process.hrtime(start2);
    console.log(`Query 2 (Messages Range): ${(end2[0] * 1000 + end2[1]/1e6).toFixed(2)}ms`);

    // 3. Active Chats (Correlated Subquery)
    const start3 = process.hrtime();
    db.prepare(`
        SELECT
            c.id,
            m.body as last_message
        FROM contacts c
        JOIN messages m ON c.id = m.contact_id
        WHERE m.timestamp = (
            SELECT MAX(timestamp)
            FROM messages m2
            WHERE m2.contact_id = c.id
        )
        AND m.timestamp >= ?
    `).all(oneDayAgo);
    const end3 = process.hrtime(start3);
    console.log(`Query 3 (Active Chats): ${(end3[0] * 1000 + end3[1]/1e6).toFixed(2)}ms`);
}

// Run Before
runBenchmark('BEFORE INDEXES');

// Add Indexes
console.log('\nAdding Indexes...');
db.exec(`
    CREATE INDEX idx_transactions_status_created_at ON transactions(status, created_at);
    CREATE INDEX idx_messages_timestamp ON messages(timestamp);
    CREATE INDEX idx_messages_contact_id_timestamp ON messages(contact_id, timestamp);
    CREATE INDEX idx_contacts_updated_at ON contacts(updated_at);
`);

// Run After
runBenchmark('AFTER INDEXES');

// Clean up
fs.unlinkSync(dbPath);
