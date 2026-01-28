const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../omninchat.db');

// Caminho para os arquivos de migração
const migrationsPath = path.join(__dirname, 'migrations');

function runMigration() {
    try {
        console.log('Iniciando migração do banco de dados...');

        // Conectar ao banco de dados
        const db = new Database(dbPath, { verbose: console.log });

        // Listar arquivos de migração com ordem forçada
        let migrationFiles = fs.readdirSync(migrationsPath)
            .filter(file => file.endsWith('.sql'));

        // Forçar ordem: create antes de alter
        migrationFiles.sort((a, b) => {
            if (a.includes('create')) return -1;
            if (b.includes('create')) return 1;
            return a.localeCompare(b);
        });

        console.log(`Encontradas ${migrationFiles.length} migrações`);

        // Executar cada migração
        for (const file of migrationFiles) {
            console.log(`\nExecutando migração: ${file}`);
            const migrationPath = path.join(migrationsPath, file);
            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
            db.exec(migrationSQL);
            console.log(`✅ ${file} executada com sucesso`);
        }

        console.log('\n✅ Migrações concluídas com sucesso!');
        console.log('✅ Tabelas de tickets criadas/atualizadas');

        // Fechar conexão
        db.close();

    } catch (error) {
        console.error('❌ Erro ao executar migração:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Executar migração
runMigration();
