#!/usr/bin/env node

// Script de Análise de Logs para o Bot GetNexo
// Uso: node log-analyzer.js [opção]
// Opções: --today, --yesterday, --last-hour, --errors, --stats

const fs = require('fs');
const path = require('path');

class LogAnalyzer {
    constructor() {
        this.logDir = path.join(__dirname, '..', 'bot', 'logs');
        this.today = new Date().toISOString().split('T')[0];
        this.yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            console.log('Diretório de logs não encontrado. Nenhum log para analisar.');
            process.exit(0);
        }
    }

    getLogFiles() {
        this.ensureLogDirectory();
        return fs.readdirSync(this.logDir)
            .filter(file => file.startsWith('bot-') && file.endsWith('.log'))
            .sort()
            .reverse();
    }

    readLogFile(filename) {
        const filePath = path.join(this.logDir, filename);
        if (!fs.existsSync(filePath)) return [];

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return content.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    try {
                        return JSON.parse(line);
                    } catch {
                        return null;
                    }
                })
                .filter(entry => entry !== null);
        } catch (error) {
            console.error(`Erro ao ler arquivo ${filename}:`, error.message);
            return [];
        }
    }

    getTodayLogs() {
        const filename = `bot-${this.today}.log`;
        return this.readLogFile(filename);
    }

    getYesterdayLogs() {
        const filename = `bot-${this.yesterday}.log`;
        return this.readLogFile(filename);
    }

    getLastHourLogs() {
        const oneHourAgo = Date.now() - 3600000;
        const allLogs = this.getLogFiles().flatMap(file => this.readLogFile(file));
        return allLogs.filter(entry =>
            new Date(entry.timestamp).getTime() > oneHourAgo
        );
    }

    getErrors() {
        const allLogs = this.getLogFiles().flatMap(file => this.readLogFile(file));
        return allLogs.filter(entry => entry.level === 'ERROR');
    }

    generateStats(logs) {
        const stats = {
            total: logs.length,
            byLevel: {},
            byHour: {},
            users: new Set(),
            products: new Set(),
            errors: [],
            apiCalls: 0,
            botEvents: 0
        };

        logs.forEach(entry => {
            // Por nível
            stats.byLevel[entry.level] = (stats.byLevel[entry.level] || 0) + 1;

            // Por hora
            const hour = new Date(entry.timestamp).getHours();
            stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;

            // Usuários
            if (entry.data) {
                try {
                    const data = JSON.parse(entry.data);
                    if (data.userId) stats.users.add(data.userId);
                    if (data.produto) stats.products.add(data.produto);
                    if (entry.message.includes('USER_INTERACTION')) stats.apiCalls++;
                    if (entry.message.includes('BOT_EVENT')) stats.botEvents++;
                    if (entry.level === 'ERROR') stats.errors.push(data);
                } catch (e) {
                    // Ignorar parsing errors
                }
            }
        });

        return {
            ...stats,
            uniqueUsers: stats.users.size,
            uniqueProducts: stats.products.size
        };
    }

    printStats(stats) {
        console.log('\n=== ESTATÍSTICAS GERAIS ===');
        console.log(`Total de logs: ${stats.total}`);
        console.log(`Usuários únicos: ${stats.uniqueUsers}`);
        console.log(`Produtos únicos: ${stats.uniqueProducts}`);
        console.log(`Chamadas de API: ${stats.apiCalls}`);
        console.log(`Eventos do bot: ${stats.botEvents}`);

        console.log('\n=== POR NÍVEL ===');
        Object.entries(stats.byLevel).forEach(([level, count]) => {
            console.log(`${level}: ${count}`);
        });

        console.log('\n=== POR HORA (últimas 24h) ===');
        for (let i = 0; i < 24; i++) {
            const count = stats.byHour[i] || 0;
            const bar = '█'.repeat(Math.ceil(count / Math.max(1, Math.max(...Object.values(stats.byHour))) * 20));
            console.log(`${i.toString().padStart(2, '0')}:00 ${bar} ${count}`);
        }

        if (stats.errors.length > 0) {
            console.log('\n=== ERROS RECENTES ===');
            stats.errors.slice(0, 5).forEach((error, index) => {
                console.log(`${index + 1}. ${error.error || 'Erro desconhecido'}`);
                if (error.userId) console.log(`   Usuário: ${error.userId}`);
                if (error.produto) console.log(`   Produto: ${error.produto}`);
                console.log('');
            });
        }
    }

    printErrors() {
        const errors = this.getErrors();
        console.log(`\n=== ${errors.length} ERROS ENCONTRADOS ===`);

        errors.forEach((error, index) => {
            console.log(`${index + 1}. [${error.timestamp}] ${error.level}: ${error.message}`);
            if (error.data) {
                try {
                    const data = JSON.parse(error.data);
                    Object.entries(data).forEach(([key, value]) => {
                        console.log(`   ${key}: ${value}`);
                    });
                } catch (e) {
                    console.log(`   Data: ${error.data}`);
                }
            }
            console.log('');
        });
    }

    run(option = '--today') {
        let logs = [];

        switch (option) {
            case '--today':
                logs = this.getTodayLogs();
                break;
            case '--yesterday':
                logs = this.getYesterdayLogs();
                break;
            case '--last-hour':
                logs = this.getLastHourLogs();
                break;
            case '--errors':
                this.printErrors();
                return;
            case '--stats':
                // Mostra estatísticas completas
                const todayLogs = this.getTodayLogs();
                const yesterdayLogs = this.getYesterdayLogs();
                const allLogs = [...todayLogs, ...yesterdayLogs];
                const stats = this.generateStats(allLogs);
                this.printStats(stats);
                return;
            default:
                console.log('Opção inválida. Use: --today, --yesterday, --last-hour, --errors, --stats');
                return;
        }

        if (logs.length === 0) {
            console.log('Nenhum log encontrado para o período selecionado.');
            return;
        }

        const stats = this.generateStats(logs);
        this.printStats(stats);
    }
}

// Execução via linha de comando
if (require.main === module) {
    const analyzer = new LogAnalyzer();
    const option = process.argv[2] || '--today';
    analyzer.run(option);
}

module.exports = LogAnalyzer;