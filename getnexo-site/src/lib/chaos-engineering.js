/**
 * Chaos Engineering Engine - GetNexo Platform
 *
 * @description Sistema de engenharia do caos para testar resiliência e melhorar confiabilidade
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class ChaosEngineering {
    constructor() {
        this.experiments = new Map();
        this.activeExperiments = new Map();
        this.experimentHistory = [];
        this.chaosMonkeyHistory = [];
        this.safetyRules = new Map();

        this.config = {
            maxConcurrentExperiments: 1,
            safetyEnabled: true,
            autoRollbackOnFailure: true,
            experimentTimeout: 1800000, // 30 minutos
            steadyStateCheck: 300000, // 5 minutos
            chaosMonkeyEnabled: false, // Desabilitado por padrão - muito perigoso!
            chaosMonkeyHistory: []
        };

        this.initialize();
    }

    async initialize() {
        // Carregar configuração persistida
        const savedConfig = JSON.parse(localStorage.getItem('nexo-chaos-config') || '{}');
        this.config = { ...this.config, ...savedConfig };

        // Carregar histórico do Chaos Monkey
        this.chaosMonkeyHistory = JSON.parse(localStorage.getItem('nexo-chaos-monkey-history') || '[]');

        this.loadDefaultExperiments();
        this.loadSafetyRules();
        this.startScheduler();

        console.log('🎭 Chaos Engineering Engine inicializado');
        if (this.config.chaosMonkeyEnabled) {
            console.warn('🐒 ⚠️ Chaos Monkey está ATIVADO - Falhas aleatórias serão injetadas!');
        }
    }

    // Experimentos padrão
    loadDefaultExperiments() {
        // Pod kill experiment
        this.addExperiment({
            id: 'pod_kill',
            name: 'Pod Kill Chaos',
            description: 'Mata pods aleatoriamente para testar auto-healing',
            type: 'kubernetes',
            blastRadius: 'single_pod',
            duration: 300000, // 5 minutos
            cooldown: 3600000, // 1 hora
            safetyChecks: ['steady_state', 'auto_healing_enabled'],
            execution: this.podKillExperiment.bind(this)
        });

        // Network latency injection
        this.addExperiment({
            id: 'network_latency',
            name: 'Network Latency Injection',
            description: 'Adiciona latência de rede entre serviços',
            type: 'network',
            blastRadius: 'service_mesh',
            duration: 600000, // 10 minutos
            cooldown: 7200000, // 2 horas
            safetyChecks: ['service_mesh_healthy', 'circuit_breakers_enabled'],
            execution: this.networkLatencyExperiment.bind(this)
        });

        // Resource exhaustion
        this.addExperiment({
            id: 'resource_exhaustion',
            name: 'Resource Exhaustion',
            description: 'Simula exaustão de recursos (CPU/Memória)',
            type: 'resource',
            blastRadius: 'node',
            duration: 600000, // 10 minutos
            cooldown: 14400000, // 4 horas
            safetyChecks: ['auto_scaling_enabled', 'resource_limits_set'],
            execution: this.resourceExhaustionExperiment.bind(this)
        });

        // Database connection loss
        this.addExperiment({
            id: 'db_connection_loss',
            name: 'Database Connection Loss',
            description: 'Simula perda temporária de conexão com banco',
            type: 'database',
            blastRadius: 'application',
            duration: 120000, // 2 minutos
            cooldown: 3600000, // 1 hora
            safetyChecks: ['connection_pool_enabled', 'db_circuit_breaker'],
            execution: this.databaseConnectionLossExperiment.bind(this)
        });

        // Service degradation
        this.addExperiment({
            id: 'service_degradation',
            name: 'Service Degradation',
            description: 'Degrada performance de serviço específico',
            type: 'application',
            blastRadius: 'single_service',
            duration: 300000, // 5 minutos
            cooldown: 7200000, // 2 horas
            safetyChecks: ['health_checks_enabled', 'degradation_tolerance'],
            execution: this.serviceDegradationExperiment.bind(this)
        });

        // Node failure simulation
        this.addExperiment({
            id: 'node_failure',
            name: 'Node Failure Simulation',
            description: 'Simula falha completa de node',
            type: 'infrastructure',
            blastRadius: 'node',
            duration: 180000, // 3 minutos
            cooldown: 14400000, // 4 horas
            safetyChecks: ['multi_az_enabled', 'pod_disruption_budget'],
            execution: this.nodeFailureExperiment.bind(this)
        });

        // Chaos Monkey-style random experiments
        this.loadChaosMonkeyExperiments();
    }

    // Experimentos estilo Chaos Monkey - falhas aleatórias
    loadChaosMonkeyExperiments() {
        // Random service termination
        this.addExperiment({
            id: 'chaos_monkey_service_kill',
            name: 'Chaos Monkey - Random Service Kill',
            description: 'Mata serviço aleatório em horário imprevisível',
            type: 'chaos_monkey',
            blastRadius: 'single_service',
            duration: 60000, // 1 minuto (tempo para restart)
            cooldown: 0, // Aleatório
            safetyChecks: ['steady_state', 'auto_healing_enabled'],
            execution: this.chaosMonkeyServiceKill.bind(this)
        });

        // Random network partition
        this.addExperiment({
            id: 'chaos_monkey_network_partition',
            name: 'Chaos Monkey - Network Partition',
            description: 'Isola serviço aleatório da rede',
            type: 'chaos_monkey',
            blastRadius: 'service_mesh',
            duration: 300000, // 5 minutos
            cooldown: 0, // Aleatório
            safetyChecks: ['service_mesh_healthy', 'circuit_breakers_enabled'],
            execution: this.chaosMonkeyNetworkPartition.bind(this)
        });

        // Random disk space exhaustion
        this.addExperiment({
            id: 'chaos_monkey_disk_full',
            name: 'Chaos Monkey - Disk Space Exhaustion',
            description: 'Preenche disco aleatório até limite crítico',
            type: 'chaos_monkey',
            blastRadius: 'node',
            duration: 180000, // 3 minutos
            cooldown: 0, // Aleatório
            safetyChecks: ['disk_monitoring_enabled', 'auto_scaling_enabled'],
            execution: this.chaosMonkeyDiskFull.bind(this)
        });

        // Random API endpoint failure
        this.addExperiment({
            id: 'chaos_monkey_api_failure',
            name: 'Chaos Monkey - API Endpoint Failure',
            description: 'Faz endpoint aleatório retornar 500',
            type: 'chaos_monkey',
            blastRadius: 'api_endpoint',
            duration: 120000, // 2 minutos
            cooldown: 0, // Aleatório
            safetyChecks: ['api_monitoring_enabled', 'circuit_breakers_enabled'],
            execution: this.chaosMonkeyApiFailure.bind(this)
        });

        // Random container resource limits
        this.addExperiment({
            id: 'chaos_monkey_resource_limits',
            name: 'Chaos Monkey - Resource Limits',
            description: 'Reduz drasticamente limites de recursos de container aleatório',
            type: 'chaos_monkey',
            blastRadius: 'container',
            duration: 240000, // 4 minutos
            cooldown: 0, // Aleatório
            safetyChecks: ['auto_scaling_enabled', 'resource_limits_set'],
            execution: this.chaosMonkeyResourceLimits.bind(this)
        });

        // Random database corruption
        this.addExperiment({
            id: 'chaos_monkey_db_corruption',
            name: 'Chaos Monkey - Database Corruption',
            description: 'Simula corrupção de dados em tabela aleatória',
            type: 'chaos_monkey',
            blastRadius: 'database',
            duration: 60000, // 1 minuto
            cooldown: 0, // Aleatório
            safetyChecks: ['db_backups_enabled', 'db_monitoring_enabled'],
            execution: this.chaosMonkeyDbCorruption.bind(this)
        });

        // Random configuration change
        this.addExperiment({
            id: 'chaos_monkey_config_change',
            name: 'Chaos Monkey - Configuration Chaos',
            description: 'Altera configuração aleatória para valor problemático',
            type: 'chaos_monkey',
            blastRadius: 'configuration',
            duration: 180000, // 3 minutos
            cooldown: 0, // Aleatório
            safetyChecks: ['config_validation_enabled', 'rollback_enabled'],
            execution: this.chaosMonkeyConfigChange.bind(this)
        });
    }

    // Regras de segurança
    loadSafetyRules() {
        this.safetyRules.set('steady_state', {
            check: async () => {
                const metrics = await this.getSteadyStateMetrics();
                return metrics.errorRate < 5 && metrics.avgResponseTime < 2000;
            },
            description: 'Sistema deve estar em estado estável',
            blocking: true
        });

        this.safetyRules.set('auto_healing_enabled', {
            check: () => window.AutoRestartEngine && !window.AutoRestartEngine.getCircuitBreakerStatus().enabled,
            description: 'Auto-healing deve estar funcional',
            blocking: true
        });

        this.safetyRules.set('auto_scaling_enabled', {
            check: () => window.AutoScalingEngine && window.AutoScalingEngine.getCurrentState().replicas > 1,
            description: 'Auto-scaling deve estar habilitado',
            blocking: true
        });

        this.safetyRules.set('business_hours_only', {
            check: () => {
                const hour = new Date().getHours();
                return hour >= 9 && hour <= 18; // 9h às 18h
            },
            description: 'Experimentos apenas em horário comercial',
            blocking: false
        });

        this.safetyRules.set('low_traffic_period', {
            check: async () => {
                const metrics = await this.getCurrentMetrics();
                return metrics.requestRate < 1000; // Menos de 1000 req/min
            },
            description: 'Tráfego deve estar baixo',
            blocking: false
        });
    }

    // Adicionar experimento
    addExperiment(experiment) {
        this.experiments.set(experiment.id, {
            ...experiment,
            created: new Date(),
            active: false,
            lastExecuted: null,
            successCount: 0,
            failureCount: 0
        });
    }

    // Executar experimento
    async runExperiment(experimentId, options = {}) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            throw new Error(`Experimento não encontrado: ${experimentId}`);
        }

        // Verificar limites
        if (this.activeExperiments.size >= this.config.maxConcurrentExperiments) {
            throw new Error('Limite de experimentos concorrentes atingido');
        }

        // Verificar cooldown
        if (experiment.lastExecuted && Date.now() - experiment.lastExecuted < experiment.cooldown) {
            const remaining = Math.ceil((experiment.cooldown - (Date.now() - experiment.lastExecuted)) / 60000);
            throw new Error(`Experimento em cooldown. Restam ${remaining} minutos.`);
        }

        // Verificar regras de segurança
        const safetyCheck = await this.checkSafetyRules(experiment.safetyChecks);
        if (!safetyCheck.safe) {
            throw new Error(`Regras de segurança falharam: ${safetyCheck.failedRules.join(', ')}`);
        }

        console.log(`🎭 Iniciando experimento: ${experiment.name}`);

        const experimentRun = {
            id: `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            experimentId,
            startTime: new Date(),
            status: 'running',
            options,
            baselineMetrics: await this.captureBaseline(),
            safetyChecks: safetyCheck
        };

        this.activeExperiments.set(experimentRun.id, experimentRun);

        try {
            // Executar experimento
            const result = await this.executeExperiment(experiment, experimentRun, options);

            experimentRun.status = 'completed';
            experimentRun.endTime = new Date();
            experimentRun.result = result;
            experimentRun.duration = experimentRun.endTime - experimentRun.startTime;

            // Verificar se sistema se recuperou
            const recovered = await this.verifyRecovery(experimentRun);

            if (recovered) {
                experiment.successCount++;
                console.log(`✅ Experimento concluído com sucesso: ${experiment.name}`);
            } else {
                experiment.failureCount++;
                console.error(`❌ Experimento falhou - sistema não se recuperou: ${experiment.name}`);

                if (this.config.autoRollbackOnFailure) {
                    await this.emergencyRollback(experiment);
                }
            }

            // Registrar resultado
            this.experimentHistory.push(experimentRun);

        } catch (error) {
            experimentRun.status = 'failed';
            experimentRun.endTime = new Date();
            experimentRun.error = error.message;
            experiment.failureCount++;

            console.error(`💥 Experimento falhou com erro: ${error.message}`);

            // Rollback automático
            await this.rollbackExperiment(experiment, experimentRun);

        } finally {
            experiment.lastExecuted = Date.now();
            this.activeExperiments.delete(experimentRun.id);
        }

        return experimentRun;
    }

    // Verificar regras de segurança
    async checkSafetyRules(requiredChecks) {
        const results = { safe: true, failedRules: [] };

        for (const checkId of requiredChecks) {
            const rule = this.safetyRules.get(checkId);
            if (!rule) {
                console.warn(`Regra de segurança não encontrada: ${checkId}`);
                continue;
            }

            try {
                const passed = await rule.check();
                if (!passed) {
                    if (rule.blocking) {
                        results.safe = false;
                    }
                    results.failedRules.push(rule.description);
                }
            } catch (error) {
                console.error(`Erro ao verificar regra de segurança ${checkId}:`, error);
                if (rule.blocking) {
                    results.safe = false;
                    results.failedRules.push(`${rule.description} (erro)`);
                }
            }
        }

        return results;
    }

    // Executar experimento específico
    async executeExperiment(experiment, run, options) {
        // Criar hipótese
        const hypothesis = {
            steadyState: 'Sistema responde normalmente',
            chaosAction: experiment.description,
            prediction: `Sistema deve se recuperar automaticamente em ${experiment.duration / 60000} minutos`
        };

        run.hypothesis = hypothesis;

        // Executar ação caótica
        const chaosResult = await experiment.execution(options);

        // Aguardar duração do experimento
        await this.sleep(experiment.duration);

        // Parar experimento
        await this.stopExperiment(experiment, run);

        return chaosResult;
    }

    // Capturar métricas baseline
    async captureBaseline() {
        console.log('📊 Capturando métricas baseline...');

        const metrics = [];
        for (let i = 0; i < 5; i++) { // 5 amostras
            metrics.push(await this.getCurrentMetrics());
            await this.sleep(10000); // 10 segundos entre amostras
        }

        return {
            avgCpu: this.average(metrics.map(m => m.cpu)),
            avgMemory: this.average(metrics.map(m => m.memory)),
            avgErrorRate: this.average(metrics.map(m => m.errorRate)),
            avgResponseTime: this.average(metrics.map(m => m.avgResponseTime)),
            timestamp: new Date()
        };
    }

    // Verificar recuperação
    async verifyRecovery(run) {
        console.log('🔍 Verificando recuperação do sistema...');

        // Aguardar período de steady state
        await this.sleep(this.config.steadyStateCheck);

        const currentMetrics = await this.getCurrentMetrics();
        const baseline = run.baselineMetrics;

        // Comparar com baseline (com tolerância)
        const tolerance = 0.2; // 20% de tolerância

        const cpuOk = Math.abs(currentMetrics.cpu - baseline.avgCpu) / baseline.avgCpu <= tolerance;
        const memoryOk = Math.abs(currentMetrics.memory - baseline.avgMemory) / baseline.avgMemory <= tolerance;
        const errorOk = currentMetrics.errorRate <= baseline.avgErrorRate * (1 + tolerance);
        const latencyOk = currentMetrics.avgResponseTime <= baseline.avgResponseTime * (1 + tolerance);

        return cpuOk && memoryOk && errorOk && latencyOk;
    }

    // Experimentos específicos

    async podKillExperiment(options) {
        const targetPods = options.targetPods || 1;
        console.log(`💀 Matando ${targetPods} pod(s) aleatoriamente...`);

        // Selecionar pods aleatoriamente
        const pods = await this.getRunningPods();
        const targetPodList = this.shuffleArray(pods).slice(0, targetPods);

        for (const pod of targetPodList) {
            const command = `kubectl delete pod ${pod} --force --grace-period=0`;
            await this.executeCommand(command, 30000);
            console.log(`💀 Pod killed: ${pod}`);
        }

        return { killedPods: targetPodList };
    }

    async networkLatencyExperiment(options) {
        const latency = options.latency || 500; // 500ms
        const targetService = options.targetService || 'getnexo-app';

        console.log(`⏱️ Injetando ${latency}ms de latência no serviço ${targetService}...`);

        // Usar istio ou linkerd para injetar latência
        const command = `kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: chaos-latency-${targetService}
spec:
  http:
  - fault:
      delay:
        percentage:
          value: 100
        fixedDelay: ${latency}ms
    route:
    - destination:
        host: ${targetService}
EOF`;

        await this.executeCommand(command, 30000);
        return { injectedLatency: latency, targetService };
    }

    async resourceExhaustionExperiment(options) {
        const resource = options.resource || 'cpu'; // cpu ou memory
        const percentage = options.percentage || 80;

        console.log(`🔥 Simulando exaustão de ${resource} (${percentage}%)...`);

        // Usar stress-ng ou similar para consumir recursos
        const command = resource === 'cpu'
            ? `kubectl run stress-cpu --image=alexeiled/stress-ng -- stress-ng --cpu 0 --timeout 600`
            : `kubectl run stress-mem --image=alexeiled/stress-ng -- stress-ng --vm 1 --vm-bytes 1G --timeout 600`;

        await this.executeCommand(command, 30000);
        return { resource, percentage };
    }

    async databaseConnectionLossExperiment(options) {
        const duration = options.duration || 60000; // 1 minuto

        console.log(`🔌 Simulando perda de conexão com banco por ${duration / 1000}s...`);

        // Usar network policies ou iptables para bloquear conexões
        const command = `kubectl apply -f chaos-db-network-policy.yaml`;
        await this.executeCommand(command, 30000);

        // Aguardar duração
        await this.sleep(duration);

        // Remover policy
        const removeCommand = `kubectl delete -f chaos-db-network-policy.yaml`;
        await this.executeCommand(removeCommand, 30000);

        return { duration };
    }

    async serviceDegradationExperiment(options) {
        const degradation = options.degradation || 0.5; // 50% degradation
        const targetService = options.targetService || 'getnexo-worker';

        console.log(`🐌 Degradando serviço ${targetService} em ${degradation * 100}%...`);

        // Usar CPU limits para degradar performance
        const command = `kubectl patch deployment ${targetService} -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","resources":{"limits":{"cpu":"100m"}}}]}}}'`;
        await this.executeCommand(command, 30000);

        return { degradation, targetService };
    }

    async nodeFailureExperiment(options) {
        const targetNode = options.targetNode || await this.selectRandomNode();

        console.log(`💥 Simulando falha do node ${targetNode}...`);

        // Drain node (simulação)
        const drainCommand = `kubectl drain ${targetNode} --ignore-daemonsets --force`;
        await this.executeCommand(drainCommand, 120000);

        // Aguardar período de falha
        await this.sleep(180000); // 3 minutos

        // Uncordon node
        const uncordonCommand = `kubectl uncordon ${targetNode}`;
        await this.executeCommand(uncordonCommand, 30000);

        return { targetNode };
    }

    // Experimentos Chaos Monkey - Implementações

    async chaosMonkeyServiceKill(options) {
        const services = await this.getRunningServices();
        const randomService = services[Math.floor(Math.random() * services.length)];

        console.log(`🐒 Chaos Monkey: Matando serviço aleatório - ${randomService}`);

        // Usar diferentes métodos de kill baseados no tipo de serviço
        const killMethods = ['kubectl delete deployment', 'kubectl scale deployment --replicas=0', 'docker kill'];

        const killCommand = `${killMethods[Math.floor(Math.random() * killMethods.length)]} ${randomService}`;
        await this.executeCommand(killCommand, 30000);

        return { killedService: randomService, method: killCommand };
    }

    async chaosMonkeyNetworkPartition(options) {
        const services = await this.getRunningServices();
        const sourceService = services[Math.floor(Math.random() * services.length)];
        const targetService = services.filter(s => s !== sourceService)[Math.floor(Math.random() * (services.length - 1))];

        console.log(`🐒 Chaos Monkey: Particionando rede entre ${sourceService} e ${targetService}`);

        // Criar network policy para bloquear comunicação
        const policyYaml = `
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: chaos-network-partition-${Date.now()}
spec:
  podSelector:
    matchLabels:
      app: ${targetService}
  policyTypes:
  - Ingress
  ingress: []
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: chaos-network-partition-egress-${Date.now()}
spec:
  podSelector:
    matchLabels:
      app: ${sourceService}
  policyTypes:
  - Egress
  egress: []
`;

        const command = `echo '${policyYaml}' | kubectl apply -f -`;
        await this.executeCommand(command, 30000);

        return { sourceService, targetService, partitionType: 'network_policy' };
    }

    async chaosMonkeyDiskFull(options) {
        const nodes = await this.getClusterNodes();
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];

        console.log(`🐒 Chaos Monkey: Preenchendo disco do node ${randomNode}`);

        // Criar pod que consome espaço em disco
        const stressPod = `
apiVersion: v1
kind: Pod
metadata:
  name: chaos-disk-stress-${Date.now()}
  namespace: default
spec:
  nodeName: ${randomNode}
  containers:
  - name: disk-stresser
    image: busybox
    command: ["dd", "if=/dev/zero", "of=/tmp/filldisk", "bs=1M", "count=1024"]
    volumeMounts:
    - name: disk-vol
      mountPath: /tmp
  volumes:
  - name: disk-vol
    hostPath:
      path: /var/lib/docker
      type: Directory
  restartPolicy: Never
`;

        const command = `echo '${stressPod}' | kubectl apply -f -`;
        await this.executeCommand(command, 30000);

        return { targetNode: randomNode, fillSize: '1GB' };
    }

    async chaosMonkeyApiFailure(options) {
        const endpoints = await this.getApiEndpoints();
        const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

        console.log(`🐒 Chaos Monkey: Fazendo endpoint ${randomEndpoint} falhar`);

        // Injetar falha usando istio fault injection
        const faultInjection = `
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: chaos-api-failure-${Date.now()}
spec:
  http:
  - match:
    - uri:
        prefix: "${randomEndpoint}"
    fault:
      abort:
        percentage:
          value: 100
        httpStatus: 500
    route:
    - destination:
        host: getnexo-app
`;

        const command = `echo '${faultInjection}' | kubectl apply -f -`;
        await this.executeCommand(command, 30000);

        return { failedEndpoint: randomEndpoint, errorCode: 500 };
    }

    async chaosMonkeyResourceLimits(options) {
        const containers = await this.getRunningContainers();
        const randomContainer = containers[Math.floor(Math.random() * containers.length)];

        console.log(`🐒 Chaos Monkey: Reduzindo limites de recursos do container ${randomContainer}`);

        // Reduzir drasticamente os limites de CPU e memória
        const patchCommand = `kubectl patch deployment ${randomContainer} --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/limits/cpu", "value": "10m"}, {"op": "replace", "path": "/spec/template/spec/containers/0/resources/limits/memory", "value": "32Mi"}]'`;

        await this.executeCommand(patchCommand, 30000);

        return { container: randomContainer, newLimits: { cpu: '10m', memory: '32Mi' } };
    }

    async chaosMonkeyDbCorruption(options) {
        const tables = await this.getDatabaseTables();
        const randomTable = tables[Math.floor(Math.random() * tables.length)];

        console.log(`🐒 Chaos Monkey: Corrompendo tabela ${randomTable}`);

        // Simular corrupção (em produção seria mais sofisticado)
        // Aqui apenas logamos, mas em produção poderia fazer alterações controladas
        console.warn(`⚠️ SIMULAÇÃO: Tabela ${randomTable} "corrompida"`);

        // Criar backup antes da "corrupção"
        const backupCommand = `mysqldump getnexo_db ${randomTable} > /tmp/${randomTable}_backup.sql`;
        await this.executeCommand(backupCommand, 30000);

        return { corruptedTable: randomTable, backupCreated: true };
    }

    async chaosMonkeyConfigChange(options) {
        const configs = await this.getServiceConfigurations();
        const randomConfig = configs[Math.floor(Math.random() * configs.length)];

        console.log(`🐒 Chaos Monkey: Alterando configuração ${randomConfig.key}`);

        // Alterar configuração para valor problemático
        const badValue = this.generateBadConfigValue(randomConfig.type);

        // Em produção, isso alteraria ConfigMaps, environment variables, etc.
        const configMapPatch = `kubectl patch configmap ${randomConfig.configMap} -p '{"data":{"${randomConfig.key}":"${badValue}"}}'`;

        await this.executeCommand(configMapPatch, 30000);

        // Rolling restart para aplicar mudanças
        const restartCommand = `kubectl rollout restart deployment ${randomConfig.service}`;
        await this.executeCommand(restartCommand, 30000);

        return { configKey: randomConfig.key, oldValue: randomConfig.value, newValue: badValue };
    }

    // Métodos auxiliares para Chaos Monkey

    async getRunningServices() {
        // Simulação - em produção consultaria Kubernetes API
        return ['getnexo-app', 'getnexo-worker', 'getnexo-api', 'getnexo-cache'];
    }

    async getClusterNodes() {
        // Simulação
        return ['ip-10-0-1-123.ec2.internal', 'ip-10-0-1-124.ec2.internal'];
    }

    async getApiEndpoints() {
        // Simulação
        return ['/api/users', '/api/orders', '/api/payments', '/api/notifications'];
    }

    async getRunningContainers() {
        // Simulação
        return ['getnexo-app', 'getnexo-worker', 'getnexo-api'];
    }

    async getDatabaseTables() {
        // Simulação
        return ['users', 'orders', 'payments', 'logs'];
    }

    async getServiceConfigurations() {
        // Simulação
        return [
            { key: 'DB_CONNECTION_TIMEOUT', value: '30', type: 'number', configMap: 'getnexo-config', service: 'getnexo-app' },
            { key: 'CACHE_TTL', value: '3600', type: 'number', configMap: 'getnexo-config', service: 'getnexo-app' },
            { key: 'API_RATE_LIMIT', value: '1000', type: 'number', configMap: 'getnexo-config', service: 'getnexo-api' }
        ];
    }

    generateBadConfigValue(type) {
        switch (type) {
            case 'number':
                return '0'; // Valor muito baixo
            case 'string':
                return ''; // String vazia
            case 'boolean':
                return 'false'; // Desabilitar
            default:
                return 'invalid';
        }
    }

    // Parar experimento
    async stopExperiment(experiment, run) {
        console.log(`� Parando experimento: ${experiment.name}`);

        // Cleanup específico por tipo de experimento
        switch (experiment.id) {
            case 'network_latency':
                await this.executeCommand('kubectl delete virtualservice chaos-latency-getnexo-app', 30000);
                break;
            case 'resource_exhaustion':
                await this.executeCommand('kubectl delete pod stress-cpu stress-mem --ignore-not-found', 30000);
                break;
            case 'chaos_monkey_network_partition':
                await this.executeCommand('kubectl delete networkpolicy -l chaos=network-partition', 30000);
                break;
            case 'chaos_monkey_disk_full':
                await this.executeCommand('kubectl delete pod -l chaos=disk-stress', 30000);
                break;
            case 'chaos_monkey_api_failure':
                await this.executeCommand('kubectl delete virtualservice -l chaos=api-failure', 30000);
                break;
            case 'chaos_monkey_resource_limits':
                // Restaurar limites originais (simulação)
                console.log('🔄 Restaurando limites de recursos originais');
                break;
            case 'chaos_monkey_config_change':
                // Reverter configuração (simulação)
                console.log('🔄 Revertendo alterações de configuração');
                break;
        }
    }

    // Rollback de emergência
    async emergencyRollback(experiment) {
        console.error('🚨 Executando rollback de emergência devido a falha no experimento');

        if (window.AutoRollbackEngine) {
            await window.AutoRollbackEngine.emergencyRollback();
        }
    }

    // Scheduler para experimentos automatizados
    startScheduler() {
        // Executar experimentos seguros diariamente durante baixa carga
        setInterval(async () => {
            if (this.shouldRunAutomatedExperiments()) {
                const safeExperiment = this.selectSafeExperiment();
                if (safeExperiment) {
                    try {
                        await this.runExperiment(safeExperiment.id);
                    } catch (error) {
                        console.error('Erro no experimento automatizado:', error);
                    }
                }
            }
        }, 86400000); // A cada 24 horas

        // Chaos Monkey scheduler - experimentos aleatórios imprevisíveis
        this.startChaosMonkeyScheduler();
    }

    // Chaos Monkey Scheduler
    startChaosMonkeyScheduler() {
        // Executar experimentos aleatórios em intervalos imprevisíveis
        const scheduleNextMonkey = () => {
            // Intervalo aleatório entre 1 e 24 horas
            const randomDelay = Math.random() * 86400000 + 3600000; // 1h a 25h

            setTimeout(async () => {
                await this.runChaosMonkeyExperiment();
                scheduleNextMonkey(); // Agendar próximo
            }, randomDelay);
        };

        // Agendar primeiro experimento
        scheduleNextMonkey();

        console.log('🐒 Chaos Monkey scheduler iniciado - experimentos aleatórios em intervalos imprevisíveis');
    }

    async runChaosMonkeyExperiment() {
        if (!this.config.chaosMonkeyEnabled) return;

        // Verificar se estamos em período seguro
        if (!this.isChaosMonkeySafePeriod()) {
            console.log('🐒 Chaos Monkey: Pulando experimento - período não seguro');
            return;
        }

        // Selecionar experimento aleatório
        const chaosExperiments = Array.from(this.experiments.values())
            .filter(exp => exp.type === 'chaos_monkey' && exp.active);

        if (chaosExperiments.length === 0) return;

        const randomExperiment = chaosExperiments[Math.floor(Math.random() * chaosExperiments.length)];

        try {
            console.log(`🐒 Chaos Monkey ativado! Executando: ${randomExperiment.name}`);

            // Executar com timeout reduzido para Chaos Monkey
            const result = await this.runExperiment(randomExperiment.id, {
                chaosMonkey: true,
                randomTrigger: true
            });

            console.log(`🐒 Chaos Monkey concluído: ${randomExperiment.name}`);

            // Log para auditoria
            this.logChaosMonkeyEvent('success', randomExperiment, result);

        } catch (error) {
            console.error(`🐒 Chaos Monkey falhou: ${error.message}`);

            // Log de falha
            this.logChaosMonkeyEvent('failure', randomExperiment, null, error.message);
        }
    }

    isChaosMonkeySafePeriod() {
        const hour = new Date().getHours();
        const day = new Date().getDay();

        // Evitar fins de semana e horários de pico
        if (day === 0 || day === 6) return false; // Fins de semana
        if (hour >= 9 && hour <= 18) return false; // Horário comercial

        // Verificar métricas atuais
        const currentMetrics = this.getCurrentMetrics();
        if (currentMetrics.cpu > 80 || currentMetrics.errorRate > 5) return false;

        return true;
    }

    logChaosMonkeyEvent(type, experiment, result, error = null) {
        const event = {
            timestamp: new Date(),
            type: 'chaos_monkey',
            eventType: type,
            experimentId: experiment.id,
            experimentName: experiment.name,
            result: result,
            error: error,
            systemState: this.getCurrentMetrics()
        };

        // Armazenar em histórico
        if (!this.chaosMonkeyHistory) this.chaosMonkeyHistory = [];
        this.chaosMonkeyHistory.push(event);

        // Limitar histórico a 1000 entradas
        if (this.chaosMonkeyHistory.length > 1000) {
            this.chaosMonkeyHistory.shift();
        }

        // Persistir em localStorage
        try {
            localStorage.setItem('nexo-chaos-monkey-history',
                JSON.stringify(this.chaosMonkeyHistory.slice(-100)));
        } catch (e) {
            console.warn('Erro ao persistir histórico do Chaos Monkey:', e);
        }
    }

    shouldRunAutomatedExperiments() {
        const hour = new Date().getHours();
        return hour >= 2 && hour <= 4; // 2h às 4h da manhã - período de baixa carga
    }

    selectSafeExperiment() {
        const safeExperiments = ['pod_kill']; // Apenas experimentos muito seguros
        const randomId = safeExperiments[Math.floor(Math.random() * safeExperiments.length)];
        return this.experiments.get(randomId);
    }

    // Métodos auxiliares
    async getRunningPods() {
        // Simulação
        return ['getnexo-app-12345', 'getnexo-app-67890', 'getnexo-worker-abcde'];
    }

    async getSteadyStateMetrics() {
        return await this.getCurrentMetrics();
    }

    async getCurrentMetrics() {
        // Simulação
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            errorRate: Math.random() * 10,
            avgResponseTime: Math.random() * 2000 + 200,
            requestRate: Math.random() * 2000
        };
    }

    async selectRandomNode() {
        // Simulação
        return 'ip-10-0-1-123.ec2.internal';
    }

    async executeCommand(command, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout após ${timeout}ms`));
            }, timeout);

            console.log(`💻 Executando comando caos: ${command}`);

            setTimeout(() => {
                clearTimeout(timer);
                resolve({
                    success: true,
                    output: 'Chaos command executed successfully',
                    exitCode: 0
                });
            }, Math.random() * 2000 + 500);
        });
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    average(numbers) {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // API pública
    getExperiments() {
        return Array.from(this.experiments.values());
    }

    getActiveExperiments() {
        return Array.from(this.activeExperiments.values());
    }

    getExperimentHistory(limit = 20) {
        return this.experimentHistory.slice(-limit);
    }

    getSafetyRules() {
        return Array.from(this.safetyRules.values());
    }

    // Experiment manual
    async runManualExperiment(experimentId, options) {
        return await this.runExperiment(experimentId, { ...options, manual: true });
    }

    // Parar experimento ativo
    async stopExperimentById(runId) {
        const run = this.activeExperiments.get(runId);
        if (run) {
            const experiment = this.experiments.get(run.experimentId);
            await this.stopExperiment(experiment, run);
            run.status = 'stopped';
            run.endTime = new Date();
            this.activeExperiments.delete(runId);
            console.log(`🛑 Experimento parado manualmente: ${runId}`);
        }
    }

    // Dashboard de chaos engineering
    getChaosDashboard() {
        const experiments = this.getExperiments();
        const history = this.getExperimentHistory(50);

        return {
            totalExperiments: experiments.length,
            activeExperiments: this.activeExperiments.size,
            successfulRuns: history.filter(h => h.status === 'completed').length,
            failedRuns: history.filter(h => h.status === 'failed').length,
            successRate: history.length > 0 ? (history.filter(h => h.status === 'completed').length / history.length * 100) : 0,
            recentExperiments: history.slice(-10),
            topExperiments: experiments
                .sort((a, b) => (b.successCount + b.failureCount) - (a.successCount + a.failureCount))
                .slice(0, 5),
            chaosMonkeyStats: this.getChaosMonkeyStats()
        };
    }

    // Estatísticas do Chaos Monkey
    getChaosMonkeyStats() {
        if (!this.chaosMonkeyHistory) return null;

        const chaosHistory = this.chaosMonkeyHistory;
        const successful = chaosHistory.filter(h => h.eventType === 'success').length;
        const failed = chaosHistory.filter(h => h.eventType === 'failure').length;

        return {
            enabled: this.config.chaosMonkeyEnabled,
            totalEvents: chaosHistory.length,
            successfulEvents: successful,
            failedEvents: failed,
            successRate: chaosHistory.length > 0 ? (successful / chaosHistory.length * 100) : 0,
            recentEvents: chaosHistory.slice(-5),
            nextScheduled: this.chaosMonkeyNextRun || null
        };
    }

    // Controlar Chaos Monkey
    enableChaosMonkey() {
        this.config.chaosMonkeyEnabled = true;
        this.saveConfig();
        console.warn('🐒 ⚠️ Chaos Monkey ATIVADO! Falhas aleatórias serão injetadas automaticamente.');
        return true;
    }

    disableChaosMonkey() {
        this.config.chaosMonkeyEnabled = false;
        this.saveConfig();
        console.info('🐒 Chaos Monkey DESATIVADO. Falhas aleatórias interrompidas.');
        return true;
    }

    // Executar experimento Chaos Monkey manual
    async triggerChaosMonkey() {
        if (!this.config.chaosMonkeyEnabled) {
            throw new Error('Chaos Monkey está desabilitado');
        }

        console.log('🐒 Chaos Monkey manualmente acionado!');
        return await this.runChaosMonkeyExperiment();
    }

    // Salvar configuração
    saveConfig() {
        localStorage.setItem('nexo-chaos-config', JSON.stringify(this.config));
    }
}

// Instância global
window.ChaosEngineering = new ChaosEngineering();

export default ChaosEngineering;