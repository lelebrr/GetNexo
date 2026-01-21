/**
 * Auto-Restart Engine - GetNexo Platform
 *
 * @description Sistema inteligente de restart automático baseado em condições
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class AutoRestartEngine {
    constructor() {
        this.restartRules = new Map();
        this.restartHistory = [];
        this.circuitBreaker = {
            enabled: false,
            failures: 0,
            lastFailure: null,
            recoveryTime: 300000 // 5 minutos
        };

        this.initialize();
    }

    async initialize() {
        this.loadDefaultRules();
        this.startMonitoring();

        console.log('🔄 Auto-Restart Engine inicializado');
    }

    // Regras padrão de restart
    loadDefaultRules() {
        // Restart baseado em health checks falhando
        this.addRule({
            id: 'health_check_failure',
            name: 'Falha de Health Check',
            condition: (metrics) => metrics.healthCheckFailures > 3,
            action: 'rolling_restart',
            cooldown: 300000, // 5 minutos
            maxRestarts: 3,
            strategy: 'rolling'
        });

        // Restart baseado em memória alta
        this.addRule({
            id: 'memory_high_restart',
            name: 'Restart por Memória Alta',
            condition: (metrics) => metrics.memory > 95 && metrics.memoryGrowthRate > 10,
            action: 'force_restart',
            cooldown: 600000, // 10 minutos
            maxRestarts: 2,
            strategy: 'force'
        });

        // Restart baseado em deadlock detection
        this.addRule({
            id: 'deadlock_restart',
            name: 'Restart por Deadlock',
            condition: (metrics) => metrics.deadlocks > 5,
            action: 'graceful_restart',
            cooldown: 180000, // 3 minutos
            maxRestarts: 5,
            strategy: 'graceful'
        });

        // Restart baseado em conexão pool exhausted
        this.addRule({
            id: 'connection_pool_exhausted',
            name: 'Restart por Pool de Conexões Exausto',
            condition: (metrics) => metrics.connectionPoolUsage > 98,
            action: 'rolling_restart',
            cooldown: 120000, // 2 minutos
            maxRestarts: 3,
            strategy: 'rolling'
        });
    }

    // Adicionar nova regra de restart
    addRule(rule) {
        this.restartRules.set(rule.id, {
            ...rule,
            created: new Date(),
            active: true,
            restartCount: 0,
            lastRestart: null
        });
    }

    // Verificar condições e executar restarts
    async checkAndRestart(metrics) {
        if (this.circuitBreaker.enabled) {
            if (Date.now() - this.circuitBreaker.lastFailure < this.circuitBreaker.recoveryTime) {
                console.warn('🔌 Circuit breaker ativo - restarts bloqueados');
                return;
            } else {
                this.circuitBreaker.enabled = false;
                console.log('🔌 Circuit breaker desativado - restarts liberados');
            }
        }

        for (const [ruleId, rule] of this.restartRules) {
            if (!rule.active) continue;

            try {
                // Verificar cooldown
                if (rule.lastRestart && Date.now() - rule.lastRestart < rule.cooldown) {
                    continue;
                }

                // Verificar limite de restarts
                if (rule.restartCount >= rule.maxRestarts) {
                    console.warn(`🚫 Regra ${ruleId} atingiu limite máximo de restarts (${rule.maxRestarts})`);
                    continue;
                }

                // Verificar condição
                const shouldRestart = await rule.condition(metrics);
                if (shouldRestart) {
                    console.log(`🔄 Condição atendida para restart: ${rule.name}`);

                    const success = await this.executeRestart(rule, metrics);
                    if (success) {
                        rule.restartCount++;
                        rule.lastRestart = Date.now();

                        this.restartHistory.push({
                            ruleId,
                            timestamp: new Date(),
                            strategy: rule.strategy,
                            reason: rule.name,
                            metrics: { ...metrics }
                        });

                        console.log(`✅ Restart executado com sucesso: ${rule.name}`);
                        break; // Só um restart por vez
                    } else {
                        this.handleRestartFailure(rule);
                    }
                }
            } catch (error) {
                console.error(`Erro na verificação da regra ${ruleId}:`, error);
                this.handleRestartFailure(rule);
            }
        }
    }

    // Executar restart baseado na estratégia
    async executeRestart(rule, metrics) {
        try {
            switch (rule.strategy) {
                case 'rolling':
                    return await this.rollingRestart(rule, metrics);
                case 'force':
                    return await this.forceRestart(rule, metrics);
                case 'graceful':
                    return await this.gracefulRestart(rule, metrics);
                default:
                    return await this.rollingRestart(rule, metrics);
            }
        } catch (error) {
            console.error(`Erro durante restart ${rule.strategy}:`, error);
            return false;
        }
    }

    // Restart rolling (gradual)
    async rollingRestart(rule, metrics) {
        console.log('🔄 Executando rolling restart...');

        const deployments = await this.getDeployments();
        let success = true;

        for (const deployment of deployments) {
            try {
                // Verificar se deployment está saudável antes do restart
                const healthy = await this.checkDeploymentHealth(deployment);
                if (!healthy) {
                    console.warn(`⚠️ Deployment ${deployment} não está saudável, pulando restart`);
                    continue;
                }

                // Executar rolling update
                const command = `kubectl rollout restart deployment/${deployment}`;
                await this.executeCommand(command, 120000);

                // Aguardar rollout completar
                await this.waitForRollout(deployment);

                // Verificar saúde pós-restart
                const postRestartHealthy = await this.checkDeploymentHealth(deployment);
                if (!postRestartHealthy) {
                    console.error(`❌ Deployment ${deployment} não ficou saudável após restart`);
                    success = false;
                }

            } catch (error) {
                console.error(`Erro no restart do deployment ${deployment}:`, error);
                success = false;
            }
        }

        return success;
    }

    // Restart forçado
    async forceRestart(rule, metrics) {
        console.log('💥 Executando force restart...');

        const command = `kubectl delete pods -l app=getnexo-app --force --grace-period=0`;
        await this.executeCommand(command, 30000);

        // Aguardar pods subirem
        await this.waitForPodsReady(180000); // 3 minutos

        // Verificar se tudo está funcionando
        return await this.checkSystemHealth();
    }

    // Restart graceful
    async gracefulRestart(rule, metrics) {
        console.log('😴 Executando graceful restart...');

        // Primeiro, parar de aceitar novas conexões
        await this.setMaintenanceMode(true);

        // Aguardar conexões existentes terminarem (até 60 segundos)
        await this.waitForConnectionsDrain(60000);

        // Executar restart
        const success = await this.rollingRestart(rule, metrics);

        // Voltar ao modo normal
        await this.setMaintenanceMode(false);

        return success;
    }

    // Verificar saúde do deployment
    async checkDeploymentHealth(deployment) {
        try {
            const command = `kubectl get deployment/${deployment} -o jsonpath='{.status.readyReplicas}'`;
            const result = await this.executeCommand(command, 10000);

            const readyReplicas = parseInt(result.output || '0');
            const desiredReplicas = await this.getDesiredReplicas(deployment);

            return readyReplicas === desiredReplicas && readyReplicas > 0;
        } catch (error) {
            console.error(`Erro ao verificar saúde do deployment ${deployment}:`, error);
            return false;
        }
    }

    // Verificar saúde geral do sistema
    async checkSystemHealth() {
        try {
            // Verificar health endpoint
            const healthResponse = await fetch('/health', { timeout: 5000 });
            if (!healthResponse.ok) return false;

            // Verificar métricas básicas
            const metrics = await this.getCurrentMetrics();
            return metrics.cpu < 90 && metrics.memory < 90 && metrics.errorRate < 5;
        } catch (error) {
            console.error('Erro ao verificar saúde do sistema:', error);
            return false;
        }
    }

    // Aguardar rollout completar
    async waitForRollout(deployment, timeout = 300000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const healthy = await this.checkDeploymentHealth(deployment);
            if (healthy) {
                return true;
            }
            await this.sleep(5000); // Aguardar 5 segundos
        }

        throw new Error(`Timeout aguardando rollout do deployment ${deployment}`);
    }

    // Aguardar pods ficarem ready
    async waitForPodsReady(timeout = 180000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                const command = `kubectl get pods -l app=getnexo-app --no-headers | grep -c Running`;
                const result = await this.executeCommand(command, 5000);

                const runningPods = parseInt(result.output || '0');
                const desiredPods = await this.getDesiredReplicas('getnexo-app');

                if (runningPods >= desiredPods) {
                    return true;
                }
            } catch (error) {
                console.error('Erro ao verificar pods:', error);
            }

            await this.sleep(10000); // Aguardar 10 segundos
        }

        throw new Error('Timeout aguardando pods ficarem ready');
    }

    // Aguardar conexões serem drenadas
    async waitForConnectionsDrain(timeout = 60000) {
        const startTime = Date.now();
        const initialConnections = await this.getActiveConnections();

        while (Date.now() - startTime < timeout) {
            const currentConnections = await this.getActiveConnections();
            const drainRate = (initialConnections - currentConnections) / initialConnections;

            if (drainRate > 0.95) { // 95% das conexões drenadas
                return true;
            }

            await this.sleep(2000); // Aguardar 2 segundos
        }

        console.warn('Timeout aguardando drain de conexões, prosseguindo mesmo assim');
        return true;
    }

    // Manipular falha de restart
    handleRestartFailure(rule) {
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailure = Date.now();

        if (this.circuitBreaker.failures >= 3) {
            this.circuitBreaker.enabled = true;
            console.error('🔌 Circuit breaker ativado devido a múltiplas falhas de restart');

            // Notificar equipe
            this.notifyRestartFailures();
        }
    }

    // Iniciar monitoramento
    startMonitoring() {
        // Verificar condições de restart a cada 30 segundos
        setInterval(async () => {
            try {
                const metrics = await this.getCurrentMetrics();
                await this.checkAndRestart(metrics);
            } catch (error) {
                console.error('Erro no monitoramento de restart:', error);
            }
        }, 30000);

        // Limpar histórico antigo (manter últimos 100)
        setInterval(() => {
            if (this.restartHistory.length > 100) {
                this.restartHistory = this.restartHistory.slice(-100);
            }
        }, 3600000); // A cada hora
    }

    // Métodos auxiliares (implementações simuladas)
    async getDeployments() {
        return ['getnexo-app', 'getnexo-worker'];
    }

    async getDesiredReplicas(deployment) {
        // Simulação - em produção consultaria Kubernetes API
        return deployment === 'getnexo-app' ? 3 : 2;
    }

    async getCurrentMetrics() {
        // Simulação - em produção consultaria Prometheus/CloudWatch
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            healthCheckFailures: Math.floor(Math.random() * 10),
            deadlocks: Math.floor(Math.random() * 10),
            connectionPoolUsage: Math.random() * 100,
            errorRate: Math.random() * 10,
            memoryGrowthRate: Math.random() * 20
        };
    }

    async getActiveConnections() {
        // Simulação
        return Math.floor(Math.random() * 1000);
    }

    async executeCommand(command, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout após ${timeout}ms`));
            }, timeout);

            console.log(`💻 Executando: ${command}`);

            // Simular execução
            setTimeout(() => {
                clearTimeout(timer);
                resolve({
                    success: true,
                    output: 'Command executed successfully',
                    exitCode: 0
                });
            }, Math.random() * 2000 + 1000);
        });
    }

    async setMaintenanceMode(enabled) {
        console.log(`${enabled ? '🛠️' : '✅'} Modo manutenção ${enabled ? 'ativado' : 'desativado'}`);
    }

    notifyRestartFailures() {
        console.error('🚨 Múltiplas falhas de restart detectadas - intervenção necessária');
        // Em produção, notificaria on-call team
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // API pública
    getRestartHistory(limit = 50) {
        return this.restartHistory.slice(-limit);
    }

    getRestartRules() {
        return Array.from(this.restartRules.values());
    }

    disableRule(ruleId) {
        const rule = this.restartRules.get(ruleId);
        if (rule) {
            rule.active = false;
            console.log(`🚫 Regra de restart desativada: ${ruleId}`);
        }
    }

    enableRule(ruleId) {
        const rule = this.restartRules.get(ruleId);
        if (rule) {
            rule.active = true;
            console.log(`✅ Regra de restart ativada: ${ruleId}`);
        }
    }

    getCircuitBreakerStatus() {
        return { ...this.circuitBreaker };
    }

    resetCircuitBreaker() {
        this.circuitBreaker.enabled = false;
        this.circuitBreaker.failures = 0;
        this.circuitBreaker.lastFailure = null;
        console.log('🔌 Circuit breaker resetado');
    }
}

// Instância global
window.AutoRestartEngine = new AutoRestartEngine();

export default AutoRestartEngine;