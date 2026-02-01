const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'getnexo.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'client'
  );

  CREATE TABLE IF NOT EXISTS container_registry (
      client_id TEXT PRIMARY KEY,
      container_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS client_usage (
    client_id TEXT PRIMARY KEY,
    memory_used INTEGER,
    messages_last_24h INTEGER,
    status TEXT,
    last_update TEXT
  );

  CREATE TABLE IF NOT EXISTS client_installs (
    client_id TEXT PRIMARY KEY,
    site_url TEXT,
    installed_at TEXT,
    last_seen TEXT
  );

  CREATE TABLE IF NOT EXISTS billing_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,
    mes TEXT,
    valor_extra REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
