const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'omnichat.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const initSchema = () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'client',
      role_id INTEGER DEFAULT 3,
      reseller_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS reseller_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      balance REAL DEFAULT 0.0,
      commission_rate REAL DEFAULT 0.10,
      referral_code TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS marketing_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reseller_id INTEGER NOT NULL,
      source_user_id INTEGER,
      amount REAL NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(reseller_id) REFERENCES users(id)
    )`,
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
    // Tables from MAIN branch (A2A/AP2)
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
    )`,
    // Tables from RESELLER branch
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'client',
      role_id INTEGER DEFAULT 3,
      reseller_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(reseller_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS reseller_profiles (
      user_id INTEGER PRIMARY KEY,
      balance REAL DEFAULT 0,
      commission_rate REAL DEFAULT 0.10,
      referral_code TEXT UNIQUE,
      bank_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reseller_id INTEGER NOT NULL,
      source_user_id INTEGER,
      amount REAL NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      FOREIGN KEY(reseller_id) REFERENCES users(id),
      FOREIGN KEY(source_user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS marketing_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS payout_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reseller_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY(reseller_id) REFERENCES users(id)
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

  // Seed Users if empty
  // Seed Users if empty
  const usersCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (usersCount === 0) {
    console.log('Seeding initial users...');
    const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, email, password, name, role, role_id, reseller_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    // Admin
    insertUser.run(1, 'admin@getnexo.com.br', bcrypt.hashSync('admin123', 10), 'Administrador', 'superadmin', 1, null);
    
    // Reseller
    insertUser.run(2, 'revendedor@getnexo.com', bcrypt.hashSync('demo123', 10), 'Revendedor', 'reseller', 2, null);
    
    // Client (Linked to Reseller 2)
    insertUser.run(3, 'cliente@getnexo.com', bcrypt.hashSync('demo123', 10), 'Cliente', 'client', 3, 2);
    
    // Extra Admin (teu login)
    insertUser.run(4, 'lelebrr@gmail.com', bcrypt.hashSync('master2026', 10), 'Lele', 'superadmin', 1, null);
    
    // Seed Reseller Profile
    const insertProfile = db.prepare('INSERT OR IGNORE INTO reseller_profiles (user_id, balance, commission_rate, referral_code) VALUES (?, ?, ?, ?)');
    insertProfile.run(2, 12450.00, 0.15, 'NEXO-REV-2026');
    
    // Seed Commissions
    const insertCommission = db.prepare('INSERT OR IGNORE INTO commissions (reseller_id, source_user_id, amount, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    insertCommission.run(2, 3, 450.00, 'Comissão Assinatura Cliente', 'paid', new Date(Date.now() - 5 * 3600 * 1000).toISOString());
    
    console.log('Users seeded successfully.');
  }

  // Seed Marketing Assets if empty
  const assetsCount = db.prepare('SELECT count(*) as count FROM marketing_assets').get().count;
  if (assetsCount === 0) {
    console.log('Seeding marketing assets...');
    const insertAsset = db.prepare('INSERT INTO marketing_assets (type, name, url, active) VALUES (?, ?, ?, ?)');
    insertAsset.run('Image', 'Banner 728x90 (Horizontal)', '/assets/marketing/banner-h.png', 1);
    insertAsset.run('Image', 'Criativo Instagram (1080x1080)', '/assets/marketing/insta-post.png', 1);
    insertAsset.run('PDF', 'Apresentação PDF (2026)', '/assets/marketing/apresentacao.pdf', 1);
    insertAsset.run('Link', 'Página Inicial (GetNexo)', 'https://getnexo.com.br/?ref=REV123', 1);
    insertAsset.run('Link', 'Planos & Preços', 'https://getnexo.com.br/precos/?ref=REV123', 1);
    insertAsset.run('Link', 'Demo Grátis', 'https://getnexo.com.br/trial/?ref=REV123', 1);
  }

  // Seed Coupons if empty
  const couponsCount = db.prepare('SELECT count(*) as count FROM coupons').get().count;
  if (couponsCount === 0) {
    console.log('Seeding coupons...');
    const insertCoupon = db.prepare('INSERT INTO coupons (code, discount_type, discount_value, expires_at, active) VALUES (?, ?, ?, ?, ?)');
    insertCoupon.run('NEXO20', 'percentage', 20, '2026-12-31', 1);
    insertCoupon.run('REV50', 'fixed', 50, '2026-06-01', 1);
  }

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