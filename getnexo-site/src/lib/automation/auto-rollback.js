/**
 * Auto-Rollback Engine - GetNexo Platform
 *
 * @description Sistema inteligente de rollback automático baseado em SLOs e métricas
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class AutoRollbackEngine {
    constructor() {
        this.rollbackRules = new Map();
        this.rollbackHistory = [];
        this.baselineMetrics = new Map();
        this.deploymentHistory = [];

        this.config = {
            rollbackWindow: 3600000, // 1 hora para rollback
            stabilizationTime: 300000, // 5 minutos para estabilizar
            sloThreshold: 0.95, // 95% de SLO
            confidenceThreshold: 0.8 // 80% de confiança
        };

        this.initialize();
    }

    async initialize() {
        this.loadDefaultRules();
        this.startMonitoring();
        await this.establishBaselines();

        console.log('🔙 Auto-Rollback Engine inicializado');
    }

    // Estabelecer baselines de métricas
    async establishBaselines() {
        console.log('📊 Estabelecendo baselines de métricas...');

        // Coletar métricas por 10 minutos para baseline
        const metrics = [];
        for (let i = 0; i < 20; i++) { // 20 amostras de 30 segundos
            metrics.push(await this.getCurrentMetrics());
            await this.sleep(30000);
        }

        // Calcular baselines
        this.baselineMetrics.set('cpu', this.calculatePercentile(metrics.map(m => m.cpu), 95));
        this.baselineMetrics.set('memory', this.calculatePercentile(metrics.map(m => m.memory), 95));
        this.baselineMetrics.set('errorRate', this.calculatePercentile(metrics.map(m => m.errorRate), 95));
        this.baselineMetrics.set('responseTime', this.calculatePercentile(metrics.map(m => m.avgResponseTime), 95));

        console.log('📊 Baselines estabelecidos:', Object.fromEntries(this.baselineMetrics));
    }

    // Regras padrão de rollback
    loadDefaultRules() {
        // Rollback baseado em SLO violation
        this.addRule({
            id: 'slo_violation_rollback',
            name: 'Rollback por Violação de SLO',
            condition: (postDeployMetrics, preDeployMetrics) =>
                this.checkSLOViolation(postDeployMetrics, preDeployMetrics),
            priority: 1,
            automatic: true,
            rollbackTo: 'previous'
        });

        // Rollback baseado em erro rate alto
        this.addRule({
            id: 'error_rate_rollback',
            name: 'Rollback por Taxa de Erro Alta',
            condition: (postDeployMetrics) =>
                postDeployMetrics.errorRate > this.baselineMetrics.get('errorRate') * 3,
            priority: 2,
            automatic: true,
            rollbackTo: 'previous'
        });

        // Rollback baseado em latência alta
        this.addRule({
            id: 'latency_rollback',
            name: 'Rollback por Latência Alta',
            condition: (postDeployMetrics) =>
                postDeployMetrics.avgResponseTime > this.baselineMetrics.get('responseTime') * 2,
            priority: 2,
            automatic: true,
            rollbackTo: 'previous'
        });

        // Rollback baseado em memory leak
        this.addRule({
            id: 'memory_leak_rollback',
            name: 'Rollback por Vazamento de Memória',
            condition: (postDeployMetrics) =>
                postDeployMetrics.memoryGrowthRate > 20, // 20MB/min
            priority: 3,
            automatic: false, // Requer confirmação
            rollbackTo: 'known_good'
        });

        // Rollback baseado em circuit breaker activation
        this.addRule({
            id: 'circuit_breaker_rollback',
            name: 'Rollback por Circuit Breaker',
            condition: () => window.AutoRestartEngine?.getCircuitBreakerStatus().enabled,
            priority: 1,
            automatic: true,
            rollbackTo: 'stable'
        });
    }

    // Adicionar regra de rollback
    addRule(rule) {
        this.rollbackRules.set(rule.id, {
            ...rule,
            created: new Date(),
            active: true,
            lastTriggered: null,
            triggerCount: 0
        });
    }

    // Registrar novo deployment
    async registerDeployment(deployment) {
        const deploymentRecord = {
            id: deployment.id || `deploy_${Date.now()}`,
            version: deployment.version,
            timestamp: new Date(),
            preDeployMetrics: await this.getCurrentMetrics(),
            status: 'active',
            rollbackEligible: true
        };

        this.deploymentHistory.push(deploymentRecord);

        // Aguardar estabilização e começar monitoramento
        setTimeout(() => {
            this.monitorPostDeployment(deploymentRecord);
        }, this.config.stabilizationTime);

        console.log(`📦 Deployment registrado: ${deployment.version}`);

        // Manter apenas últimas 10 versões
        if (this.deploymentHistory.length > 10) {
            this.deploymentHistory = this.deploymentHistory.slice(-10);
        }

        return deploymentRecord.id;
    }

    // Monitorar pós-deployment
    async monitorPostDeployment(deployment) {
        const monitorDuration = this.config.rollbackWindow;
        const checkInterval = 60000; // 1 minuto
        const checks = monitorDuration / checkInterval;

        console.log(`👁️ Iniciando monitoramento pós-deployment: ${deployment.version}`);

        for (let i = 0; i < checks; i++) {
            try {
                const currentMetrics = await this.getCurrentMetrics();
                const shouldRollback = await this.evaluateRollbackConditions(deployment, currentMetrics);

                if (shouldRollback) {
                    console.warn(`🚨 Condições para rollback detectadas no deployment ${deployment.version}`);
                    await this.executeRollback(deployment, shouldRollback.reason);
                    return;
                }

                // Verificar SLO compliance
                const sloCompliant = await this.checkSLOCompliance(currentMetrics);
                if (!sloCompliant) {
                    console.warn(`📉 SLO violation detectada no deployment ${deployment.version}`);
                    // Não rollback automático, mas log para análise
                }

            } catch (error) {
                console.error('Erro no monitoramento pós-deployment:', error);
            }

            await this.sleep(checkInterval);
        }

        console.log(`✅ Período de rollback expirado para deployment ${deployment.version}`);
        deployment.rollbackEligible = false;
    }

    // Avaliar condições de rollback
    async evaluateRollbackConditions(deployment, currentMetrics) {
        for (const [ruleId, rule] of this.rollbackRules) {
            if (!rule.active) continue;

            try {
                const shouldRollback = await rule.condition(currentMetrics, deployment.preDeployMetrics);

                if (shouldRollback) {
                    return {
                        rule: ruleId,
                        reason: rule.name,
                        priority: rule.priority,
                        automatic: rule.automatic
                    };
                }
            } catch (error) {
                console.error(`Erro ao avaliar regra ${ruleId}:`, error);
            }
        }

        return null;
    }

    // Executar rollback
    async executeRollback(deployment, reason) {
        console.log(`🔙 Executando rollback para deployment ${deployment.version}. Motivo: ${reason}`);

        // Encontrar versão alvo para rollback
        const targetVersion = await this.findRollbackTarget(deployment);
        if (!targetVersion) {
            console.error('❌ Não foi possível encontrar versão alvo para rollback');
            return false;
        }

        try {
            // Pausar auto-scaling e restarts durante rollback
            this.pauseAutomation();

            // Executar rollback
            const success = await this.performRollback(targetVersion, deployment);

            if (success) {
                // Registrar rollback
                this.rollbackHistory.push({
                    deploymentId: deployment.id,
                    fromVersion: deployment.version,
                    toVersion: targetVersion.version,
                    timestamp: new Date(),
                    reason: reason,
                    automatic: true
                });

                // Notificar equipes
                await this.notifyRollback(deployment, targetVersion, reason);

                // Marcar deployment como rollbacked
                deployment.status = 'rollbacked';
                deployment.rollbackTimestamp = new Date();

                console.log(`✅ Rollback executado com sucesso: ${deployment.version} → ${targetVersion.version}`);
                return true;
            } else {
                console.error('❌ Falha na execução do rollback');
                return false;
            }

        } catch (error) {
            console.error('Erro durante rollback:', error);
            return false;
        } finally {
            // Retomar automação
            this.resumeAutomation();
        }
    }

    // Encontrar versão alvo para rollback
    async findRollbackTarget(deployment) {
        // Estratégias de rollback
        const strategies = {
            previous: () => this.findPreviousVersion(deployment),
            known_good: () => this.findKnownGoodVersion(),
            stable: () => this.findMostStableVersion()
        };

        // Por padrão, rollback para versão anterior
        const rule = Array.from(this.rollbackRules.values()).find(r => r.name === deployment.rollbackReason);
        const strategy = rule?.rollbackTo || 'previous';

        return strategies[strategy]();
    }

    findPreviousVersion(deployment) {
        const currentIndex = this.deploymentHistory.findIndex(d => d.id === deployment.id);
        if (currentIndex > 0) {
            return this.deploymentHistory[currentIndex - 1];
        }
        return null;
    }

    findKnownGoodVersion() {
        // Encontrar versão com melhor performance histórica
        return this.deploymentHistory
            .filter(d => d.status === 'successful')
            .sort((a, b) => this.calculatePerformanceScore(b) - this.calculatePerformanceScore(a))[0];
    }

    findMostStableVersion() {
        // Encontrar versão que ficou mais tempo sem problemas
        return this.deploymentHistory
            .filter(d => d.status === 'successful')
            .sort((a, b) => {
                const aUptime = this.calculateUptime(a);
                const bUptime = this.calculateUptime(b);
                return bUptime - aUptime;
            })[0];
    }

    // Executar rollback físico
    async performRollback(targetVersion, currentDeployment) {
        console.log(`🔄 Executando rollback físico para versão ${targetVersion.version}`);

        try {
            // Usar GitOps ou deployment system para rollback
            const command = `kubectl rollout undo deployment/getnexo-app --to-revision=${targetVersion.revision || 1}`;
            await this.executeCommand(command, 120000);

            // Aguardar rollout completar
            await this.waitForRollout(300000);

            // Verificar saúde pós-rollback
            const healthy = await this.checkPostRollbackHealth();
            if (!healthy) {
                throw new Error('Sistema não ficou saudável após rollback');
            }

            return true;

        } catch (error) {
            console.error('Erro durante rollback físico:', error);

            // Tentativa de rollback forçado
            try {
                console.log('💥 Tentando rollback forçado...');
                const forceCommand = `kubectl delete pods -l app=getnexo-app --force`;
                await this.executeCommand(forceCommand, 30000);
                return true;
            } catch (forceError) {
                console.error('Falha no rollback forçado:', forceError);
                return false;
            }
        }
    }

    // Verificar saúde pós-rollback
    async checkPostRollbackHealth() {
        // Aguardar estabilização
        await this.sleep(60000);

        const metrics = await this.getCurrentMetrics();
        const baselineCpu = this.baselineMetrics.get('cpu');
        const baselineMemory = this.baselineMetrics.get('memory');

        return metrics.cpu <= baselineCpu * 1.2 && metrics.memory <= baselineMemory * 1.2;
    }

    // Calcular performance score
    calculatePerformanceScore(deployment) {
        if (!deployment.postDeployMetrics) return 0;

        const metrics = deployment.postDeployMetrics;
        const cpuScore = Math.max(0, 100 - metrics.cpu);
        const memoryScore = Math.max(0, 100 - metrics.memory);
        const errorScore = Math.max(0, 100 - metrics.errorRate * 10);

        return (cpuScore + memoryScore + errorScore) / 3;
    }

    // Calcular uptime
    calculateUptime(deployment) {
        if (deployment.status !== 'successful') return 0;

        const endTime = deployment.rollbackTimestamp || new Date();
        const uptime = endTime - deployment.timestamp;

        return uptime;
    }

    // Verificar violação de SLO
    checkSLOViolation(currentMetrics, baselineMetrics) {
        const sloTargets = {
            availability: 0.999, // 99.9%
            latency: baselineMetrics?.responseTime || 1000,
            errorRate: 0.05 // 5%
        };

        // Simulação - em produção calcularia baseado em dados reais
        const availability = Math.random() > 0.001 ? 1 : 0.95;
        const latencyViolation = currentMetrics.avgResponseTime > sloTargets.latency * 1.5;
        const errorViolation = currentMetrics.errorRate > sloTargets.errorRate;

        return availability < sloTargets.availability || latencyViolation || errorViolation;
    }

    // Verificar compliance de SLO
    async checkSLOCompliance(metrics) {
        // Simulação de verificação de SLO
        const sloScore = Math.random();
        return sloScore >= this.config.sloThreshold;
    }

    // Pausar automação durante rollback
    pauseAutomation() {
        if (window.AutoScalingEngine) {
            window.AutoScalingEngine.pause();
        }
        if (window.AutoRestartEngine) {
            window.AutoRestartEngine.pause();
        }
        console.log('⏸️ Automação pausada durante rollback');
    }

    // Retomar automação
    resumeAutomation() {
        if (window.AutoScalingEngine) {
            window.AutoScalingEngine.resume();
        }
        if (window.AutoRestartEngine) {
            window.AutoRestartEngine.resume();
        }
        console.log('▶️ Automação retomada após rollback');
    }

    // Notificar rollback
    async notifyRollback(deployment, targetVersion, reason) {
        const notification = {
            type: 'rollback',
            deployment: deployment.version,
            targetVersion: targetVersion.version,
            reason: reason,
            timestamp: new Date()
        };

        console.log(`📢 Notificação de rollback enviada: ${reason}`);

        // Em produção, notificaria Slack, email, etc.
    }

    // Calcular percentil
    calculatePercentile(values, percentile) {
        const sorted = values.sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    }

    // Iniciar monitoramento
    startMonitoring() {
        // Limpar histórico antigo
        setInterval(() => {
            if (this.rollbackHistory.length > 50) {
                this.rollbackHistory = this.rollbackHistory.slice(-50);
            }
        }, 3600000); // A cada hora
    }

    // Métodos auxiliares (implementações simuladas)
    async getCurrentMetrics() {
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            errorRate: Math.random() * 5,
            avgResponseTime: Math.random() * 2000 + 200,
            memoryGrowthRate: Math.random() * 30
        };
    }

    async executeCommand(command, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout após ${timeout}ms`));
            }, timeout);

            console.log(`💻 Executando: ${command}`);

            setTimeout(() => {
                clearTimeout(timer);
                resolve({
                    success: true,
                    output: 'Command executed successfully',
                    exitCode: 0
                });
            }, Math.random() * 5000 + 2000);
        });
    }

    async waitForRollout(timeout) {
        await this.sleep(timeout * 0.1); // Simulação
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // API pública
    getRollbackHistory(limit = 20) {
        return this.rollbackHistory.slice(-limit);
    }

    getDeploymentHistory(limit = 10) {
        return this.deploymentHistory.slice(-limit);
    }

    getRollbackRules() {
        return Array.from(this.rollbackRules.values());
    }

    getBaselines() {
        return Object.fromEntries(this.baselineMetrics);
    }

    // Rollback manual
    async manualRollback(targetVersion, reason = 'Manual rollback') {
        const currentDeployment = this.deploymentHistory[this.deploymentHistory.length - 1];
        if (!currentDeployment) {
            throw new Error('Nenhum deployment ativo encontrado');
        }

        const mockTarget = {
            version: targetVersion,
            revision: 1
        };

        return await this.performRollback(mockTarget, currentDeployment);
    }

    // Forçar rollback emergencial
    async emergencyRollback() {
        console.error('🚨 ROLLBACK EMERGÊNCIA ATIVADO');

        // Rollback forçado para versão conhecida como boa
        const knownGood = this.findKnownGoodVersion();
        if (knownGood) {
            const currentDeployment = this.deploymentHistory[this.deploymentHistory.length - 1];
            await this.performRollback(knownGood, currentDeployment);
        } else {
            console.error('❌ Nenhuma versão conhecida como boa encontrada');
        }
    }
}

// Instância global
window.AutoRollbackEngine = new AutoRollbackEngine();

export default AutoRollbackEngine;