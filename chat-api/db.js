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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'client',
      role_id INTEGER DEFAULT 3,
      reseller_id INTEGER,
      plan TEXT DEFAULT 'Standard',
      domain TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(reseller_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS reseller_profiles (
      user_id INTEGER PRIMARY KEY,
      balance REAL DEFAULT 0.0,
      commission_rate REAL DEFAULT 0.10,
      referral_code TEXT UNIQUE,
      bank_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
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
    `CREATE TABLE IF NOT EXISTS payout_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reseller_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
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
      type TEXT DEFAULT 'whatsapp',
      message_template TEXT,
      target_tags TEXT,
      total_leads INTEGER DEFAULT 0,
      sent_count INTEGER DEFAULT 0,
      read_count INTEGER DEFAULT 0,
      reply_count INTEGER DEFAULT 0,
      progress INTEGER DEFAULT 0,
      paused BOOLEAN DEFAULT 0,
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
    `CREATE TABLE IF NOT EXISTS ticket_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
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
    `CREATE TABLE IF NOT EXISTS a2a_identities (
      id TEXT PRIMARY KEY,
      name TEXT,
      private_key TEXT,
      public_key TEXT,
      is_default BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_peers (
      id TEXT PRIMARY KEY,
      name TEXT,
      endpoint TEXT,
      identity_key TEXT, -- Public key of the peer
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
      mandate_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ap2_mandates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mandate_id TEXT UNIQUE,
      type TEXT, -- cart, intent, payment
      scope TEXT,
      constraints TEXT,
      raw_payload TEXT, -- Original signed VDC
      signature TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS analytics_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      method TEXT,
      path TEXT,
      status_code INTEGER,
      user_agent TEXT,
      duration INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS security_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      ip TEXT,
      severity TEXT DEFAULT 'low',
      description TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ip_rules (
      ip TEXT PRIMARY KEY,
      rule TEXT DEFAULT 'allow',
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS support_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      priority INTEGER DEFAULT 0,
      attachments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      admin_note TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS ticket_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER,
      sender TEXT NOT NULL,
      message TEXT,
      attachment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id)
    )`,
    `CREATE TABLE IF NOT EXISTS ia_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      message TEXT,
      reply TEXT,
      ia_used TEXT,
      success INTEGER DEFAULT 1,
      timestamp INTEGER,
      tokens_used INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS settings_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      key TEXT,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT DEFAULT 'cliente'
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT,
      role TEXT DEFAULT 'user',
      content TEXT NOT NULL,
      intent TEXT,
      metadata TEXT,
      status TEXT DEFAULT 'delivered',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_tasks (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      input TEXT,
      output TEXT,
      error TEXT,
      progress INTEGER DEFAULT 0,
      sender_id TEXT,
      callback_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_callbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id TEXT,
      url TEXT NOT NULL,
      payload TEXT,
      status TEXT DEFAULT 'pending',
      attempts INTEGER DEFAULT 0,
      last_attempt DATETIME,
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(task_id) REFERENCES a2a_tasks(id)
    )`,
    `CREATE TABLE IF NOT EXISTS a2a_conversations (
      id TEXT PRIMARY KEY,
      peer_id TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_message_at DATETIME,
      message_count INTEGER DEFAULT 0,
      metadata TEXT
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
    const resellerPass = process.env.RESELLER_DEFAULT_PASSWORD || require('crypto').randomBytes(16).toString('hex');
    insertUser.run(2, 'revendedor@getnexo.com', bcrypt.hashSync(resellerPass, 10), 'Revendedor', 'reseller', 2, null);

    // Client (Linked to Reseller 2)
    const clientPass = process.env.CLIENT_DEFAULT_PASSWORD || require('crypto').randomBytes(16).toString('hex');
    insertUser.run(3, 'cliente@getnexo.com', bcrypt.hashSync(clientPass, 10), 'Cliente', 'client', 3, 2);

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

    // Check for users columns
    const usersInfo = db.pragma('table_info(users)');
    const hasPlan = usersInfo.some(col => col.name === 'plan');
    const hasDomain = usersInfo.some(col => col.name === 'domain');
    const hasStatus = usersInfo.some(col => col.name === 'status');

    if (!hasPlan) {
      console.log('Migrating users table: Adding plan column...');
      db.prepare("ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'Standard'").run();
    }
    if (!hasDomain) {
      console.log('Migrating users table: Adding domain column...');
      db.prepare("ALTER TABLE users ADD COLUMN domain TEXT").run();
    }
    if (!hasStatus) {
      console.log('Migrating users table: Adding status column...');
      db.prepare("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'").run();
    }

    // Check for marketing_assets columns
    const marketingInfo = db.pragma('table_info(marketing_assets)');
    const hasClicks = marketingInfo.some(col => col.name === 'clicks');
    if (!hasClicks) {
      console.log('Migrating marketing_assets table: Adding clicks column...');
      db.prepare("ALTER TABLE marketing_assets ADD COLUMN clicks INTEGER DEFAULT 0").run();
    }

    // WhatsApp Integration - Contacts columns
    const contactsInfo = db.pragma('table_info(contacts)');
    const hasPhone = contactsInfo.some(col => col.name === 'phone');
    const hasSource = contactsInfo.some(col => col.name === 'source');

    if (!hasPhone) {
      console.log('Migrating contacts table: Adding phone column...');
      db.prepare("ALTER TABLE contacts ADD COLUMN phone TEXT").run();
    }
    if (!hasSource) {
      console.log('Migrating contacts table: Adding source column...');
      db.prepare("ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'manual'").run();
    }

    // WhatsApp Integration - Messages columns
    const messagesInfo = db.pragma('table_info(messages)');
    const hasMediaUrl = messagesInfo.some(col => col.name === 'media_url');
    const hasMediaType = messagesInfo.some(col => col.name === 'media_type');
    const hasWaMessageId = messagesInfo.some(col => col.name === 'wa_message_id');

    if (!hasMediaUrl) {
      console.log('Migrating messages table: Adding media_url column...');
      db.prepare("ALTER TABLE messages ADD COLUMN media_url TEXT").run();
    }
    if (!hasMediaType) {
      console.log('Migrating messages table: Adding media_type column...');
      db.prepare("ALTER TABLE messages ADD COLUMN media_type TEXT").run();
    }
    if (!hasWaMessageId) {
      console.log('Migrating messages table: Adding wa_message_id column...');
      db.prepare("ALTER TABLE messages ADD COLUMN wa_message_id TEXT").run();
    }

    // AP2 Migrations - ap2_mandates
    const mandatesInfo = db.pragma('table_info(ap2_mandates)');
    const hasMandateStatus = mandatesInfo.some(col => col.name === 'status');
    const hasRawPayload = mandatesInfo.some(col => col.name === 'raw_payload');
    const hasSignature = mandatesInfo.some(col => col.name === 'signature');

    if (!hasMandateStatus) {
      console.log('Migrating ap2_mandates: Adding status column...');
      db.prepare("ALTER TABLE ap2_mandates ADD COLUMN status TEXT DEFAULT 'active'").run();
    }
    if (!hasRawPayload) {
      console.log('Migrating ap2_mandates: Adding raw_payload column...');
      db.prepare("ALTER TABLE ap2_mandates ADD COLUMN raw_payload TEXT").run();
    }
    if (!hasSignature) {
      console.log('Migrating ap2_mandates: Adding signature column...');
      db.prepare("ALTER TABLE ap2_mandates ADD COLUMN signature TEXT").run();
    }

    // AP2 Migrations - ap2_transactions
    const transInfo = db.pragma('table_info(ap2_transactions)');
    const hasMandateIdInTx = transInfo.some(col => col.name === 'mandate_id');
    if (!hasMandateIdInTx) {
      console.log('Migrating ap2_transactions: Adding mandate_id column...');
      db.prepare("ALTER TABLE ap2_transactions ADD COLUMN mandate_id TEXT").run();
    }
    // Security Events Migrations
    const securityInfo = db.pragma('table_info(security_events)');
    const hasSecurityStatus = securityInfo.some(col => col.name === 'status');
    if (!hasSecurityStatus) {
      console.log('Migrating security_events: Adding status column...');
      db.prepare("ALTER TABLE security_events ADD COLUMN status TEXT DEFAULT 'open'").run();
    }
    // Transactions Migration - Add product_id
    const transTableInfo = db.pragma('table_info(transactions)');
    const hasProductId = transTableInfo.some(col => col.name === 'product_id');
    if (!hasProductId) {
      console.log('Migrating transactions: Adding product_id column...');
      db.prepare("ALTER TABLE transactions ADD COLUMN product_id INTEGER").run();
    }
    // Ticket Migrations
    const ticketsInfo = db.pragma('table_info(tickets)');
    const hasChannel = ticketsInfo.some(col => col.name === 'channel');
    const hasSentiment = ticketsInfo.some(col => col.name === 'sentiment');
    const hasLastMessage = ticketsInfo.some(col => col.name === 'last_message');
    const hasLastMessageAt = ticketsInfo.some(col => col.name === 'last_message_at');
    const hasAssignedAgent = ticketsInfo.some(col => col.name === 'assigned_agent_id');

    if (!hasChannel) {
      console.log('Migrating tickets: Adding channel column...');
      db.prepare("ALTER TABLE tickets ADD COLUMN channel TEXT DEFAULT 'whatsapp'").run();
    }
    if (!hasSentiment) {
      console.log('Migrating tickets: Adding sentiment column...');
      db.prepare("ALTER TABLE tickets ADD COLUMN sentiment TEXT").run();
    }
    if (!hasLastMessage) {
      console.log('Migrating tickets: Adding last_message column...');
      db.prepare("ALTER TABLE tickets ADD COLUMN last_message TEXT").run();
    }
    if (!hasLastMessageAt) {
      console.log('Migrating tickets: Adding last_message_at column...');
      db.prepare("ALTER TABLE tickets ADD COLUMN last_message_at DATETIME").run();
    }
    if (!hasAssignedAgent) {
      console.log('Migrating tickets: Adding assigned_agent_id column...');
      db.prepare("ALTER TABLE tickets ADD COLUMN assigned_agent_id INTEGER").run();
    }

    // Campaigns Migrations
    const campaignInfo = db.pragma('table_info(campaigns)');
    const hasTotalLeads = campaignInfo.some(col => col.name === 'total_leads');
    if (!hasTotalLeads) {
      console.log('Migrating campaigns: Adding new columns...');
      try {
        db.prepare('ALTER TABLE campaigns ADD COLUMN type TEXT DEFAULT "whatsapp"').run();
        db.prepare('ALTER TABLE campaigns ADD COLUMN total_leads INTEGER DEFAULT 0').run();
        db.prepare('ALTER TABLE campaigns ADD COLUMN sent_count INTEGER DEFAULT 0').run();
        db.prepare('ALTER TABLE campaigns ADD COLUMN read_count INTEGER DEFAULT 0').run();
        db.prepare('ALTER TABLE campaigns ADD COLUMN reply_count INTEGER DEFAULT 0').run();
        db.prepare('ALTER TABLE campaigns ADD COLUMN progress INTEGER DEFAULT 0').run();
        db.prepare('ALTER TABLE campaigns ADD COLUMN paused BOOLEAN DEFAULT 0').run();
      } catch (e) { console.log('Columns likely exist'); }
    }

    // ⚡ Bolt: Adding indexes to avoid O(N) full table scans on analytical endpoints, reducing query times from O(N) full scans to O(log N) index lookups.
    console.log('Creating performance indexes...');
    db.prepare('CREATE INDEX IF NOT EXISTS idx_transactions_created_at_status ON transactions(created_at, status)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_contacts_updated_at ON contacts(updated_at)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_messages_contact_id ON messages(contact_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_analytics_logs_created_at ON analytics_logs(created_at)').run();

  } catch (err) {
    console.error('Migration error:', err);
  }
};

initSchema();

module.exports = db;