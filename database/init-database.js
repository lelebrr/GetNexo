#!/usr/bin/env node

// Script para inicializar o banco de dados de leads
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Inicializando banco de dados de leads...');

// Criar diretório se não existir
const dbDir = path.join(__dirname, 'leads.db');
if (!fs.existsSync(dbDir)) {
    console.log('📁 Criando banco de dados...');
    execSync(`sqlite3 ${dbDir} < ${path.join(__dirname, 'leads-schema.sql')}`);
    console.log('✅ Banco de dados criado e schema executado com sucesso!');
} else {
    console.log('ℹ️  Banco de dados já existe. Verificando schema...');

    // Verificar se as tabelas existem
    const sqlite3 = require('better-sqlite3');
    const db = new sqlite3(dbDir);

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('leads_perdidos', 'historico_reengajamento', 'config_reengajamento')").all();

    if (tables.length === 3) {
        console.log('✅ Todas as tabelas já existem e estão corretas.');
    } else {
        console.log('⚠️  Algumas tabelas estão faltando. Recriando...');
        execSync(`rm ${dbDir}`);
        execSync(`sqlite3 ${dbDir} < ${path.join(__dirname, 'leads-schema.sql')}`);
        console.log('✅ Banco de dados recriado com sucesso!');
    }

    db.close();
}

console.log('🎉 Banco de dados pronto para uso!');
console.log('📍 Arquivo criado:', dbDir);
console.log('📊 Tabelas disponíveis:');
console.log('   - leads_perdidos');
console.log('   - historico_reengajamento');
console.log('   - config_reengajamento');
console.log('   - leads_por_motivo (view)');
console.log('   - performance_reengajamento (view)');