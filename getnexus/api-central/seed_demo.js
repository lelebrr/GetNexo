const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

async function seed() {
    console.log("Seeding data...");

    // Create Admin
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    db.prepare('INSERT OR REPLACE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(
        1, 'admin@getnexo.com', hashedAdmin, 'Super Admin', 'superadmin'
    );

    // Create Test Clients
    const hashedClient = await bcrypt.hash('123456', 10);
    const clients = [
        { id: 101, email: 'lele@teste.com', name: 'Loja do Lele' },
        { id: 102, email: 'maria@teste.com', name: 'Boutique Maria' },
        { id: 103, email: 'tech@teste.com', name: 'Tech Store' }
    ];

    for (const c of clients) {
        db.prepare('INSERT OR REPLACE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(
            c.id, c.email, hashedClient, c.name, 'client'
        );

        // Usage
        db.prepare('INSERT OR REPLACE INTO client_usage (client_id, memory_used, messages_last_24h, status, last_update) VALUES (?, ?, ?, ?, ?)').run(
            c.id.toString(), Math.floor(Math.random() * 1500) + 128, Math.floor(Math.random() * 200), 'ativo', new Date().toISOString()
        );

        // Billing history
        db.prepare('INSERT INTO billing_history (client_id, mes, valor_extra) VALUES (?, ?, ?)').run(
            c.id.toString(), '2026-01', (Math.random() * 50).toFixed(2)
        );
    }

    const adminToken = jwt.sign(
        { id: 1, email: 'admin@getnexo.com', role: 'superadmin' },
        'getnexo_admin_key_2026'
    );

    console.log("\n✅ Dados semeados com sucesso!");
    console.log("------------------------------------------");
    console.log("Portal Admin: admin-panel/index.html");
    console.log(`JWT Admin (cole no prompt): \n${adminToken}`);
    console.log("------------------------------------------");
}

seed();
