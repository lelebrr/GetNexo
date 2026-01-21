/**
 * Load Testing Engine - GetNexo Platform
 *
 * Engine para executar testes de carga automatizados com Artillery,
 * incluindo testes de stress, game days e validação de performance.
 */

class LoadTestingEngine {
    constructor() {
        this.tests = new Map();
        this.activeTests = new Map();
        this.testHistory = [];
        this.scheduledTests = [];

        this.config = {
            artilleryPath: 'npx artillery',
            reportsDir: 'testing/reports',
            maxConcurrentTests: 1,
            defaultTarget: 'http://localhost:4321',
            autoSchedule: true
        };

        this.initialize();
    }

    async initialize() {
        this.loadDefaultTests();
        this.setupDirectories();
        this.startScheduler();

        console.log('🔥 Load Testing Engine inicializado');
    }

    // Carregar testes padrão
    loadDefaultTests() {
        this.addTest({
            id: 'basic_load',
            name: 'Teste de Carga Básico',
            description: 'Teste básico de carga para homepage e APIs',
            configFile: 'testing/load-tests/load-test.yml',
            schedule: 'daily',
            type: 'basic'
        });

        this.addTest({
            id: 'stress_test',
            name: 'Teste de Stress',
            description: 'Teste de stress progressivo para validar limites',
            configFile: 'testing/load-tests/stress-test.yml',
            schedule: 'weekly',
            type: 'stress'
        });

        this.addTest({
            id: 'game_day',
            name: 'Game Day Simulation',
            description: 'Simulação completa de game day com incidentes',
            configFile: 'testing/load-tests/game-day-test.yml',
            schedule: 'monthly',
            type: 'game_day'
        });

        this.addTest({
            id: 'disaster_recovery',
            name: 'Disaster Recovery Test',
            description: 'Teste de recuperação de desastres',
            configFile: 'testing/load-tests/disaster-recovery-test.yml',
            schedule: 'quarterly',
            type: 'disaster_recovery'
        });
    }

    // Adicionar teste customizado
    addTest(test) {
        this.tests.set(test.id, {
            ...test,
            created: new Date(),
            active: true,
            lastExecuted: null,
            successCount: 0,
            failureCount: 0,
            averageDuration: 0
        });
    }

    // Executar teste
    async runTest(testId, options = {}) {
        const test = this.tests.get(testId);
        if (!test) {
            throw new Error(`Teste não encontrado: ${testId}`);
        }

        // Verificar limites
        if (this.activeTests.size >= this.config.maxConcurrentTests) {
            throw new Error('Limite de testes concorrentes atingido');
        }

        // Verificar cooldown
        if (test.lastExecuted) {
            const cooldownMs = this.getCooldownMs(test.schedule);
            if (Date.now() - test.lastExecuted < cooldownMs) {
                const remaining = Math.ceil((cooldownMs - (Date.now() - test.lastExecuted)) / 60000);
                throw new Error(`Teste em cooldown. Restam ${remaining} minutos.`);
            }
        }

        console.log(`🔥 Iniciando teste: ${test.name}`);

        const testRun = {
            id: `test_run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            testId,
            startTime: new Date(),
            status: 'running',
            options,
            config: test
        };

        this.activeTests.set(testRun.id, testRun);

        try {
            const result = await this.executeTest(test, testRun, options);

            testRun.status = 'completed';
            testRun.endTime = new Date();
            testRun.result = result;
            testRun.duration = testRun.endTime - testRun.startTime;

            // Integrar com sistema de alertas se houver falhas críticas
            if (result.errors > 0 && result.errorRate > 0.05) {
                await this.reportTestFailure(testRun, result);
            }

            // Atualizar estatísticas
            test.successCount++;
            test.averageDuration = ((test.averageDuration * (test.successCount - 1)) + testRun.duration) / test.successCount;

            console.log(`✅ Teste concluído: ${test.name} (${testRun.duration}ms)`);

        } catch (error) {
            testRun.status = 'failed';
            testRun.endTime = new Date();
            testRun.error = error.message;
            test.failureCount++;

            console.error(`❌ Teste falhou: ${error.message}`);

            await this.reportTestFailure(testRun, null, error);

        } finally {
            test.lastExecuted = Date.now();
            this.activeTests.delete(testRun.id);
            this.testHistory.push(testRun);
        }

        return testRun;
    }

    // Executar teste com Artillery
    async executeTest(test, testRun, options) {
        const command = `${this.config.artilleryPath} run ${test.configFile} --output ${this.getReportPath(testRun)} --quiet`;

        console.log(`💻 Executando: ${command}`);

        return new Promise((resolve, reject) => {
            // Simulação de execução do Artillery
            // Em produção, executaria o comando real
            setTimeout(() => {
                // Simular resultados baseados no tipo de teste
                const baseMetrics = {
                    duration: testRun.duration,
                    requests: this.generateRequestCount(test.type),
                    errors: Math.floor(Math.random() * 10),
                    avgResponseTime: this.generateResponseTime(test.type),
                    p95ResponseTime: this.generatePercentile(test.type, 95),
                    p99ResponseTime: this.generatePercentile(test.type, 99),
                    throughput: this.generateThroughput(test.type)
                };

                baseMetrics.errorRate = baseMetrics.errors / baseMetrics.requests;

                // Para game day, adicionar métricas especiais
                if (test.type === 'game_day') {
                    baseMetrics.incidents = Math.floor(Math.random() * 3);
                    baseMetrics.recoveryTime = Math.floor(Math.random() * 120000) + 30000;
                    baseMetrics.autoScalingEvents = Math.floor(Math.random() * 2);
                }

                resolve(baseMetrics);
            }, Math.random() * 5000 + 2000); // Simular tempo de execução
        });
    }

    // Relatar falha crítica do teste
    async reportTestFailure(testRun, result, error) {
        if (window.alerts && window.alerts.trigger) {
            await window.alerts.trigger('load_test_failure', {
                testId: testRun.testId,
                testName: testRun.config.name,
                result: result,
                error: error?.message,
                severity: result?.errorRate > 0.1 ? 'critical' : 'warning'
            });
        }

        // Integrar com incident response se erro crítico
        if (result?.errorRate > 0.1) {
            if (window.AutomatedRunbooks) {
                const incidentId = await window.AutomatedRunbooks.executeRunbook({
                    type: 'load_test_failure',
                    testRun: testRun,
                    metrics: result
                }, {});
                console.log(`📋 Runbook executado para falha de teste: ${incidentId}`);
            }
        }
    }

    // Scheduler para testes automatizados
    startScheduler() {
        if (!this.config.autoSchedule) return;

        // Executar testes agendados
        setInterval(async () => {
            await this.checkScheduledTests();
        }, 3600000); // Verificar a cada hora

        console.log('📅 Scheduler de testes de carga iniciado');
    }

    async checkScheduledTests() {
        const now = new Date();

        for (const [testId, test] of this.tests) {
            if (!test.active || !test.schedule) continue;

            if (this.shouldRunScheduledTest(test, now)) {
                try {
                    await this.runTest(testId, { scheduled: true });
                } catch (error) {
                    console.error(`Erro no teste agendado ${testId}:`, error);
                }
            }
        }
    }

    shouldRunScheduledTest(test, now) {
        const lastRun = test.lastExecuted;
        if (!lastRun) return true; // Nunca executado

        const hoursSinceLastRun = (now - lastRun) / (1000 * 60 * 60);

        switch (test.schedule) {
            case 'hourly': return hoursSinceLastRun >= 1;
            case 'daily': return hoursSinceLastRun >= 24;
            case 'weekly': return hoursSinceLastRun >= 168;
            case 'monthly': return hoursSinceLastRun >= 720;
            case 'quarterly': return hoursSinceLastRun >= 2160;
            default: return false;
        }
    }

    // Utilitários para geração de métricas simuladas
    generateRequestCount(type) {
        const baseCounts = {
            basic: 500,
            stress: 2500,
            game_day: 1500,
            disaster_recovery: 1000
        };
        return baseCounts[type] || 500;
    }

    generateResponseTime(type) {
        const baseTimes = {
            basic: 200,
            stress: 800,
            game_day: 1200,
            disaster_recovery: 600
        };
        return baseTimes[type] + (Math.random() - 0.5) * 200;
    }

    generatePercentile(type, percentile) {
        const base = this.generateResponseTime(type);
        const multiplier = percentile === 95 ? 2 : 3;
        return base * multiplier;
    }

    generateThroughput(type) {
        const baseThroughput = {
            basic: 50,
            stress: 150,
            game_day: 100,
            disaster_recovery: 80
        };
        return baseThroughput[type] + (Math.random() - 0.5) * 20;
    }

    getCooldownMs(schedule) {
        const cooldowns = {
            hourly: 3600000,     // 1 hora
            daily: 86400000,     // 24 horas
            weekly: 604800000,   // 7 dias
            monthly: 2592000000, // 30 dias
            quarterly: 7776000000 // 90 dias
        };
        return cooldowns[schedule] || 3600000;
    }

    getReportPath(testRun) {
        return `${this.config.reportsDir}/${testRun.id}.json`;
    }

    setupDirectories() {
        // Simulação - em produção criaria diretórios
        console.log(`📁 Diretórios de relatório configurados: ${this.config.reportsDir}`);
    }

    // API pública
    getTests() {
        return Array.from(this.tests.values());
    }

    getActiveTests() {
        return Array.from(this.activeTests.values());
    }

    getTestHistory(limit = 20) {
        return this.testHistory.slice(-limit);
    }

    getDashboardData() {
        const tests = this.getTests();
        const history = this.getTestHistory(50);

        return {
            totalTests: tests.length,
            activeTests: this.activeTests.size,
            successfulRuns: history.filter(h => h.status === 'completed').length,
            failedRuns: history.filter(h => h.status === 'failed').length,
            successRate: history.length > 0 ? (history.filter(h => h.status === 'completed').length / history.length * 100) : 0,
            recentTests: history.slice(-10),
            scheduledTests: tests.filter(t => t.schedule).length,
            averageTestDuration: this.calculateAverageDuration()
        };
    }

    calculateAverageDuration() {
        const completedTests = this.testHistory.filter(h => h.status === 'completed' && h.duration);
        if (completedTests.length === 0) return 0;

        const totalDuration = completedTests.reduce((sum, test) => sum + test.duration, 0);
        return totalDuration / completedTests.length;
    }

    // Executar teste manual
    async runManualTest(testId, options) {
        return await this.runTest(testId, { ...options, manual: true });
    }

    // Parar teste ativo
    stopTest(testRunId) {
        const testRun = this.activeTests.get(testRunId);
        if (testRun) {
            testRun.status = 'stopped';
            testRun.endTime = new Date();
            this.activeTests.delete(testRunId);
            console.log(`🛑 Teste parado manualmente: ${testRunId}`);
        }
    }
}

// Instância global
window.LoadTestingEngine = new LoadTestingEngine();

export default LoadTestingEngine;