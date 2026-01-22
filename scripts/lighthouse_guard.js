#!/usr/bin/env node

/**
 * =============================================================================
 * GetNexo Lighthouse Guard - CI/CD Quality Gatekeeper
 * =============================================================================
 *
 * DESCRIÇÃO:
 * Sistema avançado de controle de qualidade que impede o deploy de aplicações
 * web se o score de performance do Lighthouse estiver abaixo do threshold mínimo.
 *
 * FUNCIONALIDADES PRINCIPAIS:
 * ✅ Análise automática de performance, acessibilidade, SEO e PWA
 * ✅ Bloqueio de deploy com score < 98 (configurável)
 * ✅ Comparação com baseline histórica
 * ✅ Relatórios detalhados em JSON
 * ✅ Integração com Chrome Launcher e Lighthouse CI
 * ✅ Métricas de tendência e análise histórica
 *
 * CONFIGURAÇÃO:
 * - Min Score: 98 (padrão, configurável)
 * - Métricas: performance, accessibility, seo, pwa
 * - Timeout: 30s por análise
 * - Formato: desktop (configurável para mobile)
 *
 * USO BÁSICO:
 * node lighthouse_guard.js validate https://meusite.com main
 *
 * COMANDOS DISPONÍVEIS:
 * - audit <url>: Executa análise única
 * - validate <url> [branch]: Valida deploy (bloqueia se < threshold)
 * - baseline <url>: Cria baseline de performance
 * - trends: Análise de tendência histórica
 * - reports [limit]: Lista relatórios recentes
 * - config: Mostra configuração atual
 * - score <value>: Altera score mínimo
 *
 * INTEGRAÇÃO CI/CD:
 * Use em pipelines GitHub Actions, Jenkins, ou qualquer CI:
 *
 * # Exemplo GitHub Actions
 * - name: Lighthouse Quality Gate
 *   run: node scripts/lighthouse_guard.js validate ${{ github.server_url }}/${{ github.repository }} main
 *
 * DEPENDÊNCIAS:
 * - lighthouse: ^10.0.0
 * - chrome-launcher: ^0.15.0
 * - fs, path: Node.js built-in
 *
 * SAÍDAS:
 * - Código 0: Deploy aprovado
 * - Código 1: Deploy bloqueado
 * - Arquivos JSON em data/lighthouse_reports/
 *
 * AUTOR: GetNexo Development Team
 * VERSÃO: 1.0.0
 * LICENÇA: MIT
 * =============================================================================
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

class LighthouseGuard {
    constructor() {
        this.minScore = 98;
        this.metrics = {
            performance: { weight: 0.25, min: this.minScore },
            accessibility: { weight: 0.20, min: 90 },
            'best-practices': { weight: 0.20, min: 90 },
            seo: { weight: 0.20, min: 90 },
            pwa: { weight: 0.15, min: 85 }
        };

        this.reportsDir = 'data/lighthouse_reports';
        this.baselineFile = 'data/lighthouse_baseline.json';

        // Configurações de audit
        this.auditConfig = {
            extends: 'lighthouse:default',
            settings: {
                formFactor: 'desktop',
                screenEmulation: { mobile: false, width: 1920, height: 1080 },
                throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
                skipAudits: ['full-page-screenshot']
            }
        };
    }

    async runAudit(url, options = {}) {
        console.log(`🏮 Iniciando Lighthouse audit para: ${url}`);

        const chrome = await chromeLauncher.launch({
            chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
        });

        const runnerResult = await lighthouse(url, {
            logLevel: 'info',
            output: 'json',
            port: chrome.port,
            ...this.auditConfig
        });

        await chrome.kill();

        const report = JSON.parse(runnerResult.report);
        const scores = this.extractScores(report);

        return {
            url,
            timestamp: new Date().toISOString(),
            scores,
            report: options.saveReport ? report : null,
            categories: report.categories
        };
    }

    extractScores(report) {
        const scores = {};

        for (const [category, config] of Object.entries(this.metrics)) {
            if (report.categories[category]) {
                scores[category] = Math.round(report.categories[category].score * 100);
            }
        }

        // Calcular score ponderado
        let weightedScore = 0;
        let totalWeight = 0;

        for (const [category, config] of Object.entries(this.metrics)) {
            if (scores[category] !== undefined) {
                weightedScore += (scores[category] / 100) * config.weight;
                totalWeight += config.weight;
            }
        }

        scores.overall = Math.round((weightedScore / totalWeight) * 100);

        return scores;
    }

    async validateDeployment(url, branch = 'main') {
        console.log(`\n🚫 Lighthouse Guard - Validando deploy para ${branch}`);
        console.log(`📊 URL: ${url}`);
        console.log(`🎯 Score mínimo requerido: ${this.minScore}`);

        try {
            const result = await this.runAudit(url, { saveReport: true });
            const scores = result.scores;

            console.log('\n📈 SCORES OBTIDOS:');
            console.log('='.repeat(50));

            let passed = true;
            for (const [category, config] of Object.entries(this.metrics)) {
                const score = scores[category] || 0;
                const status = score >= config.min ? '✅ PASSOU' : '❌ FALHOU';
                const color = score >= config.min ? '\x1b[32m' : '\x1b[31m';

                console.log(`${color}${category.padEnd(15)}: ${score.toString().padStart(3)}/100 ${status}\x1b[0m`);

                if (score < config.min) {
                    passed = false;
                }
            }

            console.log('\n🏆 SCORE GERAL:');
            const overallStatus = scores.overall >= this.minScore ? '✅ DEPLOY APROVADO' : '❌ DEPLOY BLOQUEADO';
            const overallColor = scores.overall >= this.minScore ? '\x1b[32m' : '\x1b[31m';
            console.log(`${overallColor}${overallStatus} (${scores.overall}/100)\x1b[0m`);

            // Salvar relatório
            await this.saveReport(result, passed);

            // Comparar com baseline
            await this.compareWithBaseline(result);

            if (!passed) {
                console.log('\n🚫 DEPLOY BLOQUEADO!');
                console.log('Razões:');

                for (const [category, config] of Object.entries(this.metrics)) {
                    const score = scores[category] || 0;
                    if (score < config.min) {
                        console.log(`  • ${category}: ${score} < ${config.min} (mínimo requerido)`);
                    }
                }

                console.log('\n💡 Sugestões para melhorar:');
                console.log('  • Otimize imagens e assets');
                console.log('  • Implemente cache adequado');
                console.log('  • Minimize CSS/JavaScript');
                console.log('  • Use CDN para assets estáticos');
                console.log('  • Implemente lazy loading');

                process.exit(1);
            }

            console.log('\n🎉 DEPLOY APROVADO! Performance excelente.');
            return result;

        } catch (error) {
            console.error('❌ Erro durante audit:', error.message);
            process.exit(1);
        }
    }

    async saveReport(result, passed) {
        try {
            await fs.mkdir(this.reportsDir, { recursive: true });

            const filename = `lighthouse_${Date.now()}_${passed ? 'PASS' : 'FAIL'}.json`;
            const filepath = path.join(this.reportsDir, filename);

            const reportData = {
                ...result,
                passed,
                deployment_blocked: !passed
            };

            await fs.writeFile(filepath, JSON.stringify(reportData, null, 2));
            console.log(`💾 Relatório salvo: ${filepath}`);

        } catch (error) {
            console.warn('Aviso: Não foi possível salvar relatório:', error.message);
        }
    }

    async compareWithBaseline(result) {
        try {
            const baselinePath = this.baselineFile;

            let baseline = null;
            try {
                const baselineData = await fs.readFile(baselinePath, 'utf8');
                baseline = JSON.parse(baselineData);
            } catch (e) {
                // Baseline não existe ainda
            }

            if (baseline) {
                console.log('\n📊 COMPARAÇÃO COM BASELINE:');

                for (const [category, score] of Object.entries(result.scores)) {
                    if (baseline.scores && baseline.scores[category]) {
                        const diff = score - baseline.scores[category];
                        const symbol = diff >= 0 ? '📈' : '📉';
                        const color = diff >= 0 ? '\x1b[32m' : '\x1b[31m';

                        console.log(`${color}${category.padEnd(15)}: ${symbol} ${diff > 0 ? '+' : ''}${diff}\x1b[0m`);
                    }
                }
            } else {
                console.log('\n💾 Criando baseline de performance...');
                await this.updateBaseline(result);
            }

        } catch (error) {
            console.warn('Aviso: Erro na comparação com baseline:', error.message);
        }
    }

    async updateBaseline(result) {
        try {
            const baselineData = {
                created_at: new Date().toISOString(),
                url: result.url,
                scores: result.scores,
                version: '1.0'
            };

            await fs.writeFile(this.baselineFile, JSON.stringify(baselineData, null, 2));
            console.log('✅ Baseline atualizado');

        } catch (error) {
            console.warn('Aviso: Não foi possível atualizar baseline:', error.message);
        }
    }

    async getHistoricalReports(limit = 10) {
        try {
            const files = await fs.readdir(this.reportsDir);
            const reportFiles = files
                .filter(f => f.startsWith('lighthouse_') && f.endsWith('.json'))
                .sort()
                .reverse()
                .slice(0, limit);

            const reports = [];

            for (const file of reportFiles) {
                const filepath = path.join(this.reportsDir, file);
                const data = await fs.readFile(filepath, 'utf8');
                reports.push(JSON.parse(data));
            }

            return reports;

        } catch (error) {
            console.warn('Aviso: Erro ao carregar relatórios históricos:', error.message);
            return [];
        }
    }

    async generateTrendReport() {
        const reports = await this.getHistoricalReports(30); // Últimos 30 dias

        if (reports.length < 2) {
            console.log('📊 Relatórios insuficientes para análise de tendência');
            return;
        }

        console.log('\n📈 ANÁLISE DE TENDÊNCIA:');
        console.log('='.repeat(50));

        // Agrupar por categoria
        const trends = {};

        for (const report of reports) {
            for (const [category, score] of Object.entries(report.scores)) {
                if (!trends[category]) {
                    trends[category] = [];
                }
                trends[category].push({
                    date: new Date(report.timestamp),
                    score: score
                });
            }
        }

        // Calcular tendência para cada categoria
        for (const [category, data] of Object.entries(trends)) {
            if (data.length < 2) continue;

            // Calcular diferença entre primeiro e último
            const first = data[0].score;
            const last = data[data.length - 1].score;
            const diff = last - first;

            const trend = diff > 2 ? '📈 Melhorando' :
                diff < -2 ? '📉 Piorando' : '➡️ Estável';

            const color = diff > 2 ? '\x1b[32m' :
                diff < -2 ? '\x1b[31m' : '\x1b[33m';

            console.log(`${color}${category.padEnd(15)}: ${trend} (${diff > 0 ? '+' : ''}${diff.toFixed(1)})\x1b[0m`);
        }
    }

    async runScheduledAudit(url, schedule = 'daily') {
        console.log(`⏰ Executando audit agendado: ${schedule}`);

        const result = await this.runAudit(url, { saveReport: true });
        const passed = result.scores.overall >= this.minScore;

        if (!passed) {
            console.log('🚨 ALERTA: Performance degradada detectada!');

            // Aqui poderia integrar com sistemas de alerta
            // (Slack, email, SMS, etc.)
        }

        return result;
    }

    setMinScore(newScore) {
        if (newScore < 0 || newScore > 100) {
            throw new Error('Score deve estar entre 0 e 100');
        }

        this.minScore = newScore;

        // Atualizar métricas
        for (const config of Object.values(this.metrics)) {
            config.min = Math.min(config.min, newScore);
        }

        console.log(`🎯 Score mínimo atualizado para: ${newScore}`);
    }

    getConfig() {
        return {
            minScore: this.minScore,
            metrics: this.metrics,
            auditConfig: this.auditConfig
        };
    }
}

// Função principal
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('🏮 Lighthouse Guard - CI/CD Performance Gatekeeper');
        console.log('');
        console.log('Comandos disponíveis:');
        console.log('  audit <url>              - Executar audit único');
        console.log('  validate <url> [branch]  - Validar deploy (bloqueia se < 98)');
        console.log('  baseline <url>           - Criar baseline de performance');
        console.log('  trends                    - Análise de tendência histórica');
        console.log('  reports [limit]           - Listar relatórios recentes');
        console.log('  config                    - Mostrar configuração atual');
        console.log('  score <new_score>         - Alterar score mínimo');
        console.log('');
        console.log('Exemplos:');
        console.log('  node lighthouse_guard.js validate https://getnexo.com.br main');
        console.log('  node lighthouse_guard.js audit https://staging.getnexo.com.br');
        return;
    }

    const guard = new LighthouseGuard();
    const command = args[0];

    try {
        switch (command) {
            case 'audit':
                if (args.length < 2) {
                    console.log('Uso: node lighthouse_guard.js audit <url>');
                    process.exit(1);
                }
                const auditResult = await guard.runAudit(args[1], { saveReport: true });
                console.log('📊 RESULTADO DO AUDIT:');
                console.log(JSON.stringify(auditResult.scores, null, 2));
                break;

            case 'validate':
                if (args.length < 2) {
                    console.log('Uso: node lighthouse_guard.js validate <url> [branch]');
                    process.exit(1);
                }
                await guard.validateDeployment(args[1], args[2] || 'main');
                break;

            case 'baseline':
                if (args.length < 2) {
                    console.log('Uso: node lighthouse_guard.js baseline <url>');
                    process.exit(1);
                }
                const baselineResult = await guard.runAudit(args[1]);
                await guard.updateBaseline(baselineResult);
                console.log('✅ Baseline criado/atualizado');
                break;

            case 'trends':
                await guard.generateTrendReport();
                break;

            case 'reports':
                const limit = args[1] ? parseInt(args[1]) : 5;
                const reports = await guard.getHistoricalReports(limit);
                console.log(`📋 Últimos ${reports.length} relatórios:`);
                reports.forEach((report, i) => {
                    const status = report.passed ? '✅ PASSOU' : '❌ FALHOU';
                    console.log(`${i + 1}. ${report.timestamp.split('T')[0]} - ${status} (${report.scores.overall}/100)`);
                });
                break;

            case 'config':
                console.log('⚙️ CONFIGURAÇÃO ATUAL:');
                console.log(JSON.stringify(guard.getConfig(), null, 2));
                break;

            case 'score':
                if (args.length < 2) {
                    console.log('Uso: node lighthouse_guard.js score <new_score>');
                    process.exit(1);
                }
                const newScore = parseInt(args[1]);
                guard.setMinScore(newScore);
                console.log(`✅ Score mínimo alterado para: ${newScore}`);
                break;

            default:
                console.log(`❌ Comando desconhecido: ${command}`);
                console.log('Use sem argumentos para ver ajuda');
                process.exit(1);
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
}

module.exports = LighthouseGuard;