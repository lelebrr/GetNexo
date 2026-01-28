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
  const tables = [
    `CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT,
      profile_pic_url TEXT,
      tags TEXT,
      funnel_stage TEXT DEFAULT 'lead',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      from_me BOOLEAN DEFAULT 0,
      type TEXT DEFAULT 'text',
      body TEXT,
      status TEXT DEFAULT 'sent',
      timestamp INTEGER,
      FOREIGN KEY(contact_id) REFERENCES contacts(id)
    )`,
    `CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      message_template TEXT,
      target_tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS integrations_config (
      id TEXT PRIMARY KEY,
      name TEXT,
      enabled BOOLEAN DEFAULT 0,
      config TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'normal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(contact_id) REFERENCES contacts(id)
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      image_url TEXT,
      description TEXT,
      category TEXT,
      sku TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(contact_id) REFERENCES contacts(id)
    )`,
    `CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_order_value REAL DEFAULT 0,
      max_uses INTEGER DEFAULT 0,
      uses_count INTEGER DEFAULT 0,
      expires_at DATETIME,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS automations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      trigger_id TEXT NOT NULL,
      action_id TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      executions INTEGER DEFAULT 0,
      success_rate TEXT DEFAULT '0%',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_config (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_peers (
      id TEXT PRIMARY KEY,
      name TEXT,
      endpoint TEXT,
      capabilities TEXT,
      trusted BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ap2_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT UNIQUE,
      agent_id TEXT,
      amount REAL,
      currency TEXT,
      status TEXT,
      vdc_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ap2_mandates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mandate_id TEXT UNIQUE,
      type TEXT,
      scope TEXT,
      constraints TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  tables.forEach(sql => db.prepare(sql).run());

  // Inicializar configurações padrão
  const defaults = [
    ['store_name', 'Minha Loja Nexus'],
    ['base_url', 'https://loja.exemplo.com.br'],
    ['seo_description', 'A melhor loja de produtos exclusivos com atendimento via IA.'],
    ['maintenance_mode', 'false'],
    ['debug_mode', 'true']
  ];

  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  defaults.forEach(d => insertSetting.run(d[0], d[1]));

  // Migrations
  try {
    const productsInfo = db.pragma('table_info(products)');
    const hasSku = productsInfo.some(col => col.name === 'sku');
    if (!hasSku) {
      console.log('Migrating products table: Adding sku column...');
      db.prepare('ALTER TABLE products ADD COLUMN sku TEXT').run();
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
};

initSchema();

module.exports = db;
