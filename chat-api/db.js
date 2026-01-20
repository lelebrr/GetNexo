const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'omnichat.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const initSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY, -- Phone number (remoteJid)
      name TEXT,
      profile_pic_url TEXT,
      tags TEXT, -- JSON array
      funnel_stage TEXT DEFAULT 'lead', -- lead, qualified, proposal, closed
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, -- Evolution ID
      contact_id TEXT NOT NULL,
      from_me BOOLEAN DEFAULT 0,
      type TEXT DEFAULT 'text', -- text, image, audio
      body TEXT,
      status TEXT DEFAULT 'sent', -- sent, delivered, read, failed
      timestamp INTEGER,
      FOREIGN KEY(contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'draft', -- draft, running, completed
      message_template TEXT,
      target_tags TEXT, -- JSON array of tags to target
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS integrations_config (
      id TEXT PRIMARY KEY,
      name TEXT,
      enabled BOOLEAN DEFAULT 0,
      config TEXT, -- JSON config
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

initSchema();

module.exports = db;
