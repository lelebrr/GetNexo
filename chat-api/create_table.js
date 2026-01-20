const Database = require('better-sqlite3');
const db = new Database('/app/omninchat.db');

try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS random_phrases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL, -- 'nexus_ia' or 'nexus_work'
            phrase TEXT NOT NULL,
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log('Tabela random_phrases criada com sucesso!');
} catch (e) {
    console.error('Erro ao criar tabela:', e.message);
}

db.close();