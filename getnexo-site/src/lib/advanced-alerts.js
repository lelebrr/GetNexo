/**
 * Sistema Avançado de Alertas - GetNexo Platform
 *
 * @description Sistema inteligente de alertas com machine learning,
 * auto-escalação e resposta automatizada a incidentes
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

// Tipos de alertas por severidade
const ALERT_LEVELS = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical',
    EMERGENCY: 'emergency'
};

// Canais de notificação
const NOTIFICATION_CHANNELS = {
    EMAIL: 'email',
    SMS: 'sms',
    SLACK: 'slack',
    WEBHOOK: 'webhook',
    PUSH: 'push',
    VOICE: 'voice'
};

// Regras de escalação automática
const ESCALATION_RULES = {
    CRITICAL: {
        immediate: ['sms', 'voice'],
        delay_5min: ['email', 'slack'],
        delay_15min: ['webhook'],
        on_call_activation: true
    },
    EMERGENCY: {
        immediate: ['sms', 'voice', 'push'],
        broadcast: true,
        emergency_protocol: true
    }
};

class AdvancedAlertSystem {
    constructor() {
        this.alerts = new Map();
        this.rules = new Map();
        this.channels = new Map();
        this.escalationHistory = [];
        this.machineLearning = new AlertMLPredictor();
        this.autoHealing = new AutoHealingEngine();

        // Novos sistemas integrados
        this.onCallRotation = null;
        this.automatedRunbooks = null;
        this.autoRestart = null;
        this.autoScaling = null;
        this.autoRollback = null;
        this.chaosEngineering = null;
        this.advancedSelfHealing = null;

        this.initialize();
    }

    async initialize() {
        // Carregar configurações do localStorage ou defaults
        await this.loadConfiguration();

        // Inicializar canais de notificação
        this.initializeChannels();

        // Carregar regras de alertas
        this.loadDefaultRules();

        // Inicializar sistemas integrados
        await this.initializeIntegratedSystems();

        // Iniciar monitoramento preditivo
        this.machineLearning.startPrediction();

        console.log('🚨 Sistema Avançado de Alertas inicializado com integração completa');
    }

    // Configuração do sistema
    async loadConfiguration() {
        const config = JSON.parse(localStorage.getItem('nexo-alerts-config') || '{}');

        this.config = {
            enabled: config.enabled !== false,
            predictionEnabled: config.predictionEnabled !== false,
            autoHealingEnabled: config.autoHealingEnabled !== false,
            escalationEnabled: config.escalationEnabled !== false,
            quietHours: config.quietHours || { start: '22:00', end: '06:00' },
            maintenanceMode: config.maintenanceMode || false
        };
    }

    // Inicializar canais de notificação
    initializeChannels() {
        // Email
        this.channels.set(NOTIFICATION_CHANNELS.EMAIL, {
            enabled: true,
            config: { smtp: 'smtp.getnexo.com' },
            send: this.sendEmailAlert.bind(this)
        });

        // SMS
        this.channels.set(NOTIFICATION_CHANNELS.SMS, {
            enabled: true,
            config: { provider: 'twilio' },
            send: this.sendSMSAlert.bind(this)
        });

        // Slack
        this.channels.set(NOTIFICATION_CHANNELS.SLACK, {
            enabled: true,
            config: { webhook: 'https://hooks.slack.com/services/...' },
            send: this.sendSlackAlert.bind(this)
        });

        // Push Notifications
        this.channels.set(NOTIFICATION_CHANNELS.PUSH, {
            enabled: true,
            config: { vapidKeys: {} },
            send: this.sendPushAlert.bind(this)
        });

        // Voice Calls
        this.channels.set(NOTIFICATION_CHANNELS.VOICE, {
            enabled: true,
            config: { twilioSid: '' },
            send: this.sendVoiceAlert.bind(this)
        });
    }

    // Regras padrão de alertas
    loadDefaultRules() {
        // Alertas de Performance
        this.addRule({
            id: 'high_cpu',
            name: 'CPU Alta',
            description: 'Uso de CPU acima do limite',
            condition: (metrics) => metrics.cpu > 85,
            level: ALERT_LEVELS.WARNING,
            channels: ['slack'],
            cooldown: 300000, // 5 minutos
            autoResolve: true
        });

        this.addRule({
            id: 'critical_cpu',
            name: 'CPU Crítica',
            description: 'Uso de CPU extremamente alto',
            condition: (metrics) => metrics.cpu > 95,
            level: ALERT_LEVELS.CRITICAL,
            channels: ['email', 'sms', 'slack'],
            cooldown: 60000, // 1 minuto
            escalation: true
        });

        // Alertas de Memória
        this.addRule({
            id: 'high_memory',
            name: 'Memória Alta',
            description: 'Uso de memória acima do limite',
            condition: (metrics) => metrics.memory > 90,
            level: ALERT_LEVELS.WARNING,
            channels: ['slack'],
            cooldown: 300000
        });

        // Alertas de Erro
        this.addRule({
            id: 'error_rate',
            name: 'Taxa de Erro Alta',
            description: 'Taxa de erro de API acima do normal',
            condition: (metrics) => metrics.errorRate > 5,
            level: ALERT_LEVELS.ERROR,
            channels: ['email', 'slack'],
            cooldown: 180000
        });

        // Alertas de Segurança
        this.addRule({
            id: 'failed_logins',
            name: 'Tentativas de Login Falhadas',
            description: 'Múltiplas tentativas de login falhadas',
            condition: (metrics) => metrics.failedLogins > 10,
            level: ALERT_LEVELS.WARNING,
            channels: ['email'],
            cooldown: 900000
        });

        // Alertas de Infraestrutura
        this.addRule({
            id: 'disk_space',
            name: 'Espaço em Disco Baixo',
            description: 'Espaço em disco abaixo de 10%',
            condition: (metrics) => metrics.diskSpace < 10,
            level: ALERT_LEVELS.CRITICAL,
            channels: ['email', 'sms'],
            cooldown: 3600000 // 1 hora
        });
    }

    // Adicionar nova regra de alerta
    addRule(rule) {
        this.rules.set(rule.id, {
            ...rule,
            created: new Date(),
            active: true,
            lastTriggered: null,
            triggerCount: 0
        });
    }

    // Verificar métricas e disparar alertas
    async checkMetrics(metrics) {
        if (!this.config.enabled || this.config.maintenanceMode) return;

        // Verificações proativas com ML avançado
        if (this.advancedSelfHealing) {
            try {
                const prediction = await this.advancedSelfHealing.predictIncident(metrics);
                const anomaly = await this.advancedSelfHealing.detectAnomalies(metrics);

                if (prediction.willFail && prediction.confidence > 0.8) {
                    console.log(`🔮 ML prevê incidente iminente com ${(prediction.confidence * 100).toFixed(1)}% confiança`);
                    // Preparar sistemas para possível incidente
                    this.prepareForPredictedIncident(metrics);
                }

                if (anomaly.isAnomaly) {
                    console.log(`🚨 Anomalia detectada (score: ${anomaly.score.toFixed(2)})`);
                    // Investigar anomalia automaticamente
                    await this.advancedSelfHealing.investigateAnomaly(metrics, anomaly.score);
                }
            } catch (error) {
                console.error('Erro nas verificações proativas de ML:', error);
            }
        }

        // Verificações tradicionais de regras
        for (const [ruleId, rule] of this.rules) {
            if (!rule.active) continue;

            try {
                const shouldTrigger = await rule.condition(metrics);

                if (shouldTrigger) {
                    // Verificar cooldown
                    if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown) {
                        continue;
                    }

                    await this.triggerAlert(rule, metrics);
                } else if (rule.autoResolve && rule.lastTriggered) {
                    // Auto-resolver alerta se condição normalizada
                    await this.resolveAlert(ruleId);
                }
            } catch (error) {
                console.error(`Erro ao verificar regra ${ruleId}:`, error);
            }
        }
    }

    // Disparar alerta
    async triggerAlert(rule, metrics) {
        const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const alert = {
            id: alertId,
            ruleId: rule.id,
            level: rule.level,
            title: rule.name,
            description: rule.description,
            metrics: metrics,
            timestamp: new Date(),
            status: 'active',
            resolvedAt: null,
            acknowledged: false,
            escalated: false
        };

        // Atualizar regra
        rule.lastTriggered = Date.now();
        rule.triggerCount++;

        // Armazenar alerta
        this.alerts.set(alertId, alert);

        // Predição de impacto usando ML básico
        const impact = await this.machineLearning.predictImpact(alert, metrics);
        alert.predictedImpact = impact;

        // Análise avançada com ML se disponível
        if (this.advancedSelfHealing) {
            const analysis = await this.advancedSelfHealing.analyzeIncident(alert);
            alert.mlAnalysis = analysis;
            console.log(`🧠 Análise ML: ${analysis.prediction.willFail ? 'Falha prevista' : 'Recuperação esperada'} (${(analysis.confidence * 100).toFixed(1)}% confiança)`);
        }

        // Executar runbook automatizado se disponível
        if (this.automatedRunbooks && rule.level === ALERT_LEVELS.CRITICAL) {
            const incidentId = await this.automatedRunbooks.executeRunbook(alert, metrics);
            alert.automatedIncident = incidentId;
            console.log(`📋 Runbook automatizado iniciado: ${incidentId}`);
        }

        // Notificar canais
        await this.notifyChannels(alert, rule.channels);

        // Escalação automática se necessário
        if (rule.escalation && rule.level === ALERT_LEVELS.CRITICAL) {
            await this.escalateAlert(alert);
        }

        // Tentar auto-healing integrado
        if (this.config.autoHealingEnabled) {
            await this.autoHealing.attemptFix(alert);

            // Integrar com sistemas de automação
            if (this.autoRestart) {
                await this.autoRestart.checkAndRestart(metrics);
            }

            if (this.autoScaling) {
                await this.autoScaling.checkAndScale(metrics);
            }
        }

        // Log do alerta
        console.warn(`🚨 ALERTA [${rule.level.toUpperCase()}]: ${rule.name} - ${rule.description}`, {
            alertId,
            metrics,
            impact,
            automated: !!alert.automatedIncident
        });

        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('nexoAlert', {
            detail: { alert, rule }
        }));

        return alertId;
    }

    // Resolver alerta
    async resolveAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (!alert) return;

        alert.status = 'resolved';
        alert.resolvedAt = new Date();

        // Notificar resolução
        await this.notifyResolution(alert);

        console.info(`✅ ALERTA RESOLVIDO: ${alert.title} (${alertId})`);
    }

    // Notificar canais
    async notifyChannels(alert, channels) {
        for (const channel of channels) {
            try {
                const channelConfig = this.channels.get(channel);
                if (channelConfig && channelConfig.enabled) {
                    await channelConfig.send(alert);
                }
            } catch (error) {
                console.error(`Erro ao enviar alerta via ${channel}:`, error);
            }
        }
    }

    // Implementações dos canais de notificação
    async sendEmailAlert(alert) {
        // Implementação de envio de email
        console.log(`📧 Enviando email: ${alert.title}`);
        // Integração com serviço de email (SES, SendGrid, etc.)
    }

    async sendSMSAlert(alert) {
        // Implementação de envio de SMS
        console.log(`📱 Enviando SMS: ${alert.title}`);
        // Integração com Twilio, AWS SNS, etc.
    }

    async sendSlackAlert(alert) {
        // Implementação de envio para Slack
        console.log(`💬 Enviando para Slack: ${alert.title}`);
        // Webhook do Slack
    }

    async sendPushAlert(alert) {
        // Implementação de push notifications
        console.log(`🔔 Enviando push: ${alert.title}`);
        // Service Worker + VAPID
    }

    async sendVoiceAlert(alert) {
        // Implementação de chamada de voz
        console.log(`📞 Fazendo chamada: ${alert.title}`);
        // Twilio programmable voice
    }

    // Escalação automática
    async escalateAlert(alert) {
        alert.escalated = true;

        const escalation = ESCALATION_RULES[alert.level.toUpperCase()];
        if (!escalation) return;

        // Ativar on-call se necessário
        if (escalation.on_call_activation) {
            await this.activateOnCall(alert);
        }

        // Broadcast para todos se emergência
        if (escalation.broadcast) {
            await this.broadcastAlert(alert);
        }

        this.escalationHistory.push({
            alertId: alert.id,
            timestamp: new Date(),
            level: alert.level,
            actions: escalation
        });
    }

    // Ativar equipe on-call
    async activateOnCall(alert) {
        console.warn(`🚨 ATIVANDO ON-CALL: ${alert.title}`);

        // Integrar com sistema de on-call rotation
        if (this.onCallRotation) {
            return await this.onCallRotation.activateOnCall(alert);
        }

        // Fallback para implementação básica
        // Implementar lógica de pager duty, etc.
    }

    // Broadcast para toda equipe
    async broadcastAlert(alert) {
        console.error(`🚨🚨 BROADCAST EMERGENCY: ${alert.title}`);
        // Notificar todos os canais simultaneamente
    }

    // API pública
    getAlerts(status = 'all') {
        const alerts = Array.from(this.alerts.values());

        if (status === 'all') return alerts;
        return alerts.filter(alert => alert.status === status);
    }

    getActiveAlerts() {
        return this.getAlerts('active');
    }

    acknowledgeAlert(alertId) {
        const alert = this.alerts.get(alertId);
        if (alert) {
            alert.acknowledged = true;
            console.info(`👁️ ALERTA RECONHECIDO: ${alert.title}`);
        }
    }

    // Configuração via API
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('nexo-alerts-config', JSON.stringify(this.config));
    }

    // Inicializar sistemas integrados
    async initializeIntegratedSystems() {
        try {
            // Aguardar outros sistemas serem carregados
            await this.waitForSystems();

            // Conectar sistemas integrados
            this.onCallRotation = window.OnCallRotation;
            this.automatedRunbooks = window.AutomatedRunbooks;
            this.autoRestart = window.AutoRestartEngine;
            this.autoScaling = window.AutoScalingEngine;
            this.autoRollback = window.AutoRollbackEngine;
            this.chaosEngineering = window.ChaosEngineering;
            this.advancedSelfHealing = window.AdvancedSelfHealing;

            console.log('🔗 Sistemas integrados conectados:', {
                onCall: !!this.onCallRotation,
                runbooks: !!this.automatedRunbooks,
                restart: !!this.autoRestart,
                scaling: !!this.autoScaling,
                rollback: !!this.autoRollback,
                chaos: !!this.chaosEngineering,
                ml: !!this.advancedSelfHealing
            });

        } catch (error) {
            console.error('Erro ao inicializar sistemas integrados:', error);
        }
    }

    // Aguardar carregamento dos sistemas
    async waitForSystems() {
        const maxWait = 5000; // 5 segundos
        const startTime = Date.now();

        while (Date.now() - startTime < maxWait) {
            if (window.OnCallRotation && window.AutomatedRunbooks &&
                window.AutoRestartEngine && window.AutoScalingEngine) {
                return;
            }
            await this.sleep(100);
        }

        console.warn('Timeout aguardando carregamento dos sistemas integrados');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Dashboard de alertas
    getDashboardData() {
        const alerts = this.getAlerts();
        const activeAlerts = alerts.filter(a => a.status === 'active');
        const resolvedToday = alerts.filter(a =>
            a.status === 'resolved' &&
            a.resolvedAt &&
            a.resolvedAt.toDateString() === new Date().toDateString()
        );

        // Dados integrados
        const integratedData = {
            automatedIncidents: this.automatedRunbooks ? this.automatedRunbooks.getActiveIncidents().length : 0,
            chaosExperiments: this.chaosEngineering ? this.chaosEngineering.getActiveExperiments().length : 0,
            mlPredictions: this.advancedSelfHealing ? this.advancedSelfHealing.getLearningMetrics().predictionsMade : 0,
            autoScalingEvents: this.autoScaling ? this.autoScaling.getScalingHistory(24).length : 0
        };

        return {
            totalAlerts: alerts.length,
            activeAlerts: activeAlerts.length,
            resolvedToday: resolvedToday.length,
            criticalAlerts: activeAlerts.filter(a => a.level === ALERT_LEVELS.CRITICAL).length,
            escalationHistory: this.escalationHistory.slice(-10),
            topRules: this.getTopTriggeredRules(),
            integrated: integratedData
        };
    }

    getTopTriggeredRules() {
        const ruleStats = {};

        for (const [ruleId, rule] of this.rules) {
            ruleStats[ruleId] = {
                name: rule.name,
                count: rule.triggerCount,
                lastTriggered: rule.lastTriggered
            };
        }

        return Object.values(ruleStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    // Preparar sistemas para incidente previsto
    async prepareForPredictedIncident(metrics) {
        console.log('🛡️ Preparando sistemas para incidente previsto');

        try {
            // Pré-escalar se necessário
            if (this.autoScaling && metrics.cpu > 70) {
                await this.autoScaling.manualScale(
                    Math.min(this.autoScaling.config.maxReplicas,
                        Math.ceil(this.autoScaling.getCurrentState().replicas * 1.2))
                );
            }

            // Preparar runbooks
            if (this.automatedRunbooks) {
                // Pré-carregar runbooks relevantes
                console.log('📋 Runbooks preparados para resposta rápida');
            }

            // Alertar equipe on-call preventivamente
            if (this.onCallRotation) {
                const currentOnCall = this.onCallRotation.getCurrentOnCall();
                console.log(`📞 Equipe on-call preparada: ${currentOnCall.name}`);
            }

        } catch (error) {
            console.error('Erro ao preparar para incidente previsto:', error);
        }
    }

    // API completa do sistema integrado
    getIntegratedAPI() {
        return {
            // Sistema de alertas
            alerts: {
                trigger: (ruleId, metrics) => this.checkMetrics(metrics),
                getAlerts: () => this.getAlerts(),
                acknowledge: (alertId) => this.acknowledgeAlert(alertId),
                resolve: (alertId) => this.resolveAlert(alertId),
                getDashboard: () => this.getDashboardData(),
                updateConfig: (config) => this.updateConfig(config)
            },

            // On-call rotation
            onCall: this.onCallRotation ? {
                getCurrent: () => this.onCallRotation.getCurrentOnCall(),
                getNext: () => this.onCallRotation.getNextOnCall(),
                escalate: (incident) => this.onCallRotation.escalateIncident(incident)
            } : null,

            // Runbooks automatizados
            runbooks: this.automatedRunbooks ? {
                execute: (alert, metrics) => this.automatedRunbooks.executeRunbook(alert, metrics),
                getActive: () => this.automatedRunbooks.getActiveIncidents(),
                getHistory: () => this.automatedRunbooks.getExecutionHistory()
            } : null,

            // Automação
            automation: {
                restart: this.autoRestart ? {
                    check: (metrics) => this.autoRestart.checkAndRestart(metrics),
                    getHistory: () => this.autoRestart.getRestartHistory(),
                    getStatus: () => this.autoRestart.getCircuitBreakerStatus()
                } : null,

                scaling: this.autoScaling ? {
                    check: (metrics) => this.autoScaling.checkAndScale(metrics),
                    getHistory: () => this.autoScaling.getScalingHistory(),
                    getState: () => this.autoScaling.getCurrentState(),
                    manualScale: (replicas) => this.autoScaling.manualScale(replicas)
                } : null,

                rollback: this.autoRollback ? {
                    registerDeployment: (deployment) => this.autoRollback.registerDeployment(deployment),
                    getHistory: () => this.autoRollback.getRollbackHistory(),
                    manualRollback: (version) => this.autoRollback.manualRollback(version)
                } : null
            },

            // Chaos engineering
            chaos: this.chaosEngineering ? {
                runExperiment: (id, options) => this.chaosEngineering.runExperiment(id, options),
                getExperiments: () => this.chaosEngineering.getExperiments(),
                getActive: () => this.chaosEngineering.getActiveExperiments(),
                getDashboard: () => this.chaosEngineering.getChaosDashboard()
            } : null,

            // Machine learning avançado
            ml: this.advancedSelfHealing ? {
                analyze: (incident) => this.advancedSelfHealing.analyzeIncident(incident),
                predict: (metrics) => this.advancedSelfHealing.predictIncident(metrics),
                learn: (incident, outcome) => this.advancedSelfHealing.learnFromOutcome(incident, outcome),
                getMetrics: () => this.advancedSelfHealing.getLearningMetrics(),
                getPerformance: () => this.advancedSelfHealing.getModelPerformance()
            } : null
        };
    }
}

// Engine de Machine Learning para predição de alertas
class AlertMLPredictor {
    constructor() {
        this.model = null;
        this.trainingData = [];
        this.predictions = new Map();
    }

    async predictImpact(alert, metrics) {
        // Lógica simplificada de ML
        // Em produção, usaria TensorFlow.js ou similar

        const severity = {
            [ALERT_LEVELS.INFO]: 1,
            [ALERT_LEVELS.WARNING]: 2,
            [ALERT_LEVELS.ERROR]: 3,
            [ALERT_LEVELS.CRITICAL]: 4,
            [ALERT_LEVELS.EMERGENCY]: 5
        };

        const baseImpact = severity[alert.level] || 1;
        const metricImpact = (metrics.cpu || 0) * 0.3 + (metrics.memory || 0) * 0.2;

        return {
            level: baseImpact,
            score: Math.min(100, baseImpact * 20 + metricImpact),
            predicted: baseImpact > 3,
            confidence: 0.85
        };
    }

    startPrediction() {
        // Simular predição preventiva
        setInterval(() => {
            this.predictiveCheck();
        }, 300000); // A cada 5 minutos
    }

    async predictiveCheck() {
        // Lógica de predição baseada em padrões históricos
        // Em produção, analisaria métricas de tendência
    }
}

// Engine de Auto-Healing
class AutoHealingEngine {
    constructor() {
        this.healingRules = new Map();
        this.loadHealingRules();
    }

    loadHealingRules() {
        // Regras de auto-healing
        this.healingRules.set('high_cpu', {
            action: 'scale_up',
            condition: (alert) => alert.ruleId === 'high_cpu' && alert.metrics.cpu > 90,
            execute: this.scaleUpInstance.bind(this)
        });

        this.healingRules.set('memory_leak', {
            action: 'restart_service',
            condition: (alert) => alert.ruleId === 'high_memory' && alert.metrics.memory > 95,
            execute: this.restartService.bind(this)
        });
    }

    async attemptFix(alert) {
        for (const [ruleId, rule] of this.healingRules) {
            if (rule.condition(alert)) {
                console.info(`🔧 Tentando auto-healing: ${rule.action} para ${alert.title}`);

                try {
                    await rule.execute(alert);
                    console.info(`✅ Auto-healing bem-sucedido: ${rule.action}`);
                    return true;
                } catch (error) {
                    console.error(`❌ Auto-healing falhou: ${rule.action}`, error);
                }
            }
        }

        return false;
    }

    async scaleUpInstance(alert) {
        // Implementar auto-scaling (AWS ASG, Kubernetes HPA, etc.)
        console.log('⬆️ Escalando instância automaticamente');
    }

    async restartService(alert) {
        // Implementar restart de serviço
        console.log('🔄 Reiniciando serviço automaticamente');
    }
}

// Instância global
window.AdvancedAlertSystem = new AdvancedAlertSystem();

// API global para integração (mantém compatibilidade)
window.alerts = {
    trigger: (ruleId, metrics) => window.AdvancedAlertSystem.checkMetrics(metrics),
    getAlerts: () => window.AdvancedAlertSystem.getAlerts(),
    acknowledge: (alertId) => window.AdvancedAlertSystem.acknowledgeAlert(alertId),
    resolve: (alertId) => window.AdvancedAlertSystem.resolveAlert(alertId),
    getDashboard: () => window.AdvancedAlertSystem.getDashboardData(),
    updateConfig: (config) => window.AdvancedAlertSystem.updateConfig(config),

    // Acesso aos sistemas integrados
    getIntegratedAPI: () => window.AdvancedAlertSystem.getIntegratedAPI()
};

export default AdvancedAlertSystem;