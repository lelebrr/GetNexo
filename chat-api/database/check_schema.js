const Database = require('better-sqlite3');
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../omninchat.db');

function checkSchema() {
    try {
        console.log('Verificando estrutura do banco de dados...\n');

        // Conectar ao banco de dados
        const db = new Database(dbPath);

        // Verificar todas as tabelas
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

        console.log('Tabelas existentes:');
        tables.forEach(table => {
            console.log(`  - ${table.name}`);
        });

        console.log('\n--- Estrutura da tabela tickets ---');
        const ticketColumns = db.prepare("PRAGMA table_info(tickets)").all();
        ticketColumns.forEach(col => {
            console.log(`  ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
        });

        console.log('\n--- Estrutura da tabela ticket_messages ---');
        const messagesColumns = db.prepare("PRAGMA table_info(ticket_messages)").all();
        messagesColumns.forEach(col => {
            console.log(`  ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
        });

        console.log('\n--- Estrutura da tabela ticket_notes ---');
        const notesColumns = db.prepare("PRAGMA table_info(ticket_notes)").all();
        notesColumns.forEach(col => {
            console.log(`  ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
        });

        console.log('\n--- Estrutura da tabela ticket_sentiments ---');
        const sentimentsColumns = db.prepare("PRAGMA table_info(ticket_sentiments)").all();
        sentimentsColumns.forEach(col => {
            console.log(`  ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
        });

        // Verificar índices
        console.log('\n--- Índices ---');
        const indices = db.prepare("SELECT name FROM sqlite_master WHERE type='index' ORDER BY name").all();
        indices.forEach(idx => {
            console.log(`  - ${idx.name}`);
        });

        // Fechar conexão
        db.close();

    } catch (error) {
        console.error('❌ Erro ao verificar schema:', error.message);
        console.error(error.stack);
    }
}

checkSchema();
