/**
 * Sistema de On-Call Rotation - GetNexo Platform
 *
 * @description Gerenciamento automático de escalação de equipe e rotação on-call
 * @version 1.0.0
 * @author GetNexo SRE Team
 */

class OnCallRotation {
    constructor() {
        this.schedules = new Map();
        this.currentOnCall = null;
        this.escalationLevels = new Map();
        this.notifications = new Map();
        this.holidays = new Set();

        this.initialize();
    }

    async initialize() {
        await this.loadSchedules();
        await this.loadEscalationLevels();
        this.startRotationCheck();

        console.log('🔄 Sistema de On-Call Rotation inicializado');
    }

    // Carregar schedules de rotação
    async loadSchedules() {
        // Schedule semanal padrão
        this.schedules.set('primary', {
            name: 'Equipe Primária',
            rotation: [
                { engineer: 'alice@getnexo.com', name: 'Alice Silva', phone: '+5511999999999', slack: '@alice' },
                { engineer: 'bob@getnexo.com', name: 'Bob Santos', phone: '+5511988888888', slack: '@bob' },
                { engineer: 'carol@getnexo.com', name: 'Carol Oliveira', phone: '+5511977777777', slack: '@carol' },
                { engineer: 'david@getnexo.com', name: 'David Costa', phone: '+5511966666666', slack: '@david' }
            ],
            timezone: 'America/Sao_Paulo',
            shiftDuration: 7 * 24 * 60 * 60 * 1000, // 7 dias
            startDate: new Date('2024-01-01T00:00:00-03:00')
        });

        // Schedule secundário (backup)
        this.schedules.set('secondary', {
            name: 'Equipe Secundária',
            rotation: [
                { engineer: 'eve@getnexo.com', name: 'Eve Pereira', phone: '+5511955555555', slack: '@eve' },
                { engineer: 'frank@getnexo.com', name: 'Frank Lima', phone: '+5511944444444', slack: '@frank' }
            ],
            timezone: 'America/Sao_Paulo',
            shiftDuration: 24 * 60 * 60 * 1000, // 1 dia
            startDate: new Date('2024-01-01T00:00:00-03:00')
        });
    }

    // Carregar níveis de escalação
    async loadEscalationLevels() {
        this.escalationLevels.set(1, {
            level: 1,
            name: 'L1 - Suporte Inicial',
            schedule: 'primary',
            responseTime: 300000, // 5 minutos
            channels: ['email', 'slack']
        });

        this.escalationLevels.set(2, {
            level: 2,
            name: 'L2 - Engenharia Senior',
            schedule: 'primary',
            responseTime: 900000, // 15 minutos
            channels: ['sms', 'slack', 'phone']
        });

        this.escalationLevels.set(3, {
            level: 3,
            name: 'L3 - Liderança Técnica',
            schedule: 'secondary',
            responseTime: 1800000, // 30 minutos
            channels: ['phone', 'emergency']
        });
    }

    // Obter engenheiro on-call atual
    getCurrentOnCall(scheduleName = 'primary') {
        const schedule = this.schedules.get(scheduleName);
        if (!schedule) return null;

        const now = new Date();
        const startTime = schedule.startDate.getTime();
        const elapsed = now.getTime() - startTime;
        const shiftIndex = Math.floor(elapsed / schedule.shiftDuration) % schedule.rotation.length;

        return {
            ...schedule.rotation[shiftIndex],
            schedule: scheduleName,
            shiftStart: new Date(startTime + (Math.floor(elapsed / schedule.shiftDuration) * schedule.shiftDuration)),
            shiftEnd: new Date(startTime + ((Math.floor(elapsed / schedule.shiftDuration) + 1) * schedule.shiftDuration))
        };
    }

    // Próximo engenheiro na rotação
    getNextOnCall(scheduleName = 'primary') {
        const schedule = this.schedules.get(scheduleName);
        if (!schedule) return null;

        const current = this.getCurrentOnCall(scheduleName);
        const currentIndex = schedule.rotation.findIndex(e => e.engineer === current.engineer);
        const nextIndex = (currentIndex + 1) % schedule.rotation.length;

        return schedule.rotation[nextIndex];
    }

    // Verificar se engenheiro está disponível (não em férias)
    isEngineerAvailable(engineer) {
        const today = new Date().toISOString().split('T')[0];
        return !this.holidays.has(`${engineer.email}_${today}`);
    }

    // Adicionar férias/blockout
    addHoliday(engineer, startDate, endDate, reason = '') {
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0];
            this.holidays.add(`${engineer}_${dateStr}`);
        }

        console.log(`📅 Férias adicionadas para ${engineer} de ${startDate} até ${endDate}`);
    }

    // Escalar para nível apropriado
    async escalateIncident(incident, currentLevel = 1) {
        const level = this.escalationLevels.get(currentLevel);
        if (!level) return null;

        const onCall = this.getCurrentOnCall(level.schedule);

        // Verificar disponibilidade
        if (!this.isEngineerAvailable(onCall.engineer)) {
            console.warn(`⚠️ ${onCall.name} não disponível, escalando para backup`);
            return await this.escalateToBackup(incident, level);
        }

        console.log(`📞 Escalando incidente ${incident.id} para ${level.name}: ${onCall.name}`);

        // Notificar engenheiro on-call
        await this.notifyOnCallEngineer(onCall, incident, level);

        return {
            level: currentLevel,
            engineer: onCall,
            notifiedAt: new Date(),
            responseDeadline: new Date(Date.now() + level.responseTime)
        };
    }

    // Escalar para backup se principal indisponível
    async escalateToBackup(incident, level) {
        const backupOnCall = this.getCurrentOnCall('secondary');

        console.log(`🔄 Escalando para backup: ${backupOnCall.name}`);

        await this.notifyOnCallEngineer(backupOnCall, incident, level);

        return {
            level: level.level,
            engineer: backupOnCall,
            notifiedAt: new Date(),
            responseDeadline: new Date(Date.now() + level.responseTime),
            backup: true
        };
    }

    // Notificar engenheiro on-call
    async notifyOnCallEngineer(engineer, incident, level) {
        const notification = {
            incidentId: incident.id,
            engineer: engineer.engineer,
            level: level.name,
            channels: level.channels,
            timestamp: new Date(),
            status: 'sent'
        };

        // Implementar notificações reais aqui
        for (const channel of level.channels) {
            try {
                await this.sendNotification(channel, engineer, incident, level);
            } catch (error) {
                console.error(`Erro ao enviar notificação ${channel}:`, error);
            }
        }

        this.notifications.set(`${incident.id}_${engineer.engineer}`, notification);
    }

    // Implementar envio de notificações
    async sendNotification(channel, engineer, incident, level) {
        switch (channel) {
            case 'email':
                await this.sendEmailNotification(engineer, incident, level);
                break;
            case 'sms':
                await this.sendSMSNotification(engineer, incident, level);
                break;
            case 'slack':
                await this.sendSlackNotification(engineer, incident, level);
                break;
            case 'phone':
                await this.sendVoiceNotification(engineer, incident, level);
                break;
        }
    }

    async sendEmailNotification(engineer, incident, level) {
        const subject = `[${level.name}] Incidente ${incident.id} - Ação Requerida`;
        const body = `
            <h2>Você foi escalado para um incidente</h2>
            <p><strong>Incidente:</strong> ${incident.title}</p>
            <p><strong>Descrição:</strong> ${incident.description}</p>
            <p><strong>Severidade:</strong> ${incident.level}</p>
            <p><strong>Tempo de resposta:</strong> ${level.responseTime / 60000} minutos</p>
            <p><a href="${this.getIncidentUrl(incident)}">Ver detalhes do incidente</a></p>
        `;

        console.log(`📧 Email enviado para ${engineer.name}: ${subject}`);
        // Implementar envio real de email
    }

    async sendSMSNotification(engineer, incident, level) {
        const message = `${level.name}: Incidente ${incident.id} - ${incident.title}. Resp. em ${level.responseTime / 60000}min. ${this.getIncidentUrl(incident)}`;

        console.log(`📱 SMS enviado para ${engineer.name}: ${message}`);
        // Implementar envio real de SMS
    }

    async sendSlackNotification(engineer, incident, level) {
        const message = {
            text: `🚨 *${level.name}* - Incidente ${incident.id}`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*${incident.title}*\n${incident.description}\n\n*Severidade:* ${incident.level}\n*Tempo de resposta:* ${level.responseTime / 60000} minutos`
                    }
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: { type: 'plain_text', text: 'Ver Incidente' },
                            url: this.getIncidentUrl(incident)
                        },
                        {
                            type: 'button',
                            text: { type: 'plain_text', text: 'Marcar como Reconhecido' },
                            action_id: `acknowledge_${incident.id}`
                        }
                    ]
                }
            ]
        };

        console.log(`💬 Slack enviado para ${engineer.slack}`);
        // Implementar envio real para Slack
    }

    async sendVoiceNotification(engineer, incident, level) {
        const message = `Alerta crítico. Incidente ${incident.id}: ${incident.title}. Por favor, verifique imediatamente.`;

        console.log(`📞 Chamada para ${engineer.name}`);
        // Implementar chamada de voz
    }

    getIncidentUrl(incident) {
        return `https://getnexo.com/admin/incidents/${incident.id}`;
    }

    // Verificar timeouts de resposta
    checkResponseTimeouts() {
        const now = new Date();

        for (const [key, notification] of this.notifications) {
            if (notification.status === 'sent') {
                const deadline = new Date(notification.timestamp.getTime() + this.escalationLevels.get(notification.level.split(' ')[0].replace('L', '')).responseTime);

                if (now > deadline) {
                    console.warn(`⏰ Timeout de resposta para ${notification.engineer} no incidente ${notification.incidentId}`);
                    // Escalar para próximo nível
                    this.escalateToNextLevel(notification);
                }
            }
        }
    }

    // Escalar para próximo nível
    async escalateToNextLevel(notification) {
        const currentLevel = parseInt(notification.level.split(' ')[0].replace('L', ''));
        const nextLevel = currentLevel + 1;

        if (this.escalationLevels.has(nextLevel)) {
            const incident = { id: notification.incidentId }; // Buscar incidente real
            await this.escalateIncident(incident, nextLevel);
        } else {
            console.error(`🚨 ESCALAÇÃO MÁXIMA ATINGIDA para incidente ${notification.incidentId}`);
        }
    }

    // Iniciar verificação periódica
    startRotationCheck() {
        // Verificar timeouts a cada minuto
        setInterval(() => {
            this.checkResponseTimeouts();
        }, 60000);

        // Log da rotação atual
        setInterval(() => {
            const onCall = this.getCurrentOnCall();
            console.log(`🔄 On-Call atual: ${onCall.name} (${onCall.engineer}) até ${onCall.shiftEnd.toLocaleString('pt-BR')}`);
        }, 3600000); // A cada hora
    }

    // API pública
    getSchedule(scheduleName = 'primary') {
        return this.schedules.get(scheduleName);
    }

    getAllSchedules() {
        return Array.from(this.schedules.values());
    }

    getEscalationLevels() {
        return Array.from(this.escalationLevels.values());
    }

    // Override do método activateOnCall do alert system
    async activateOnCall(alert) {
        const escalation = await this.escalateIncident({
            id: alert.id,
            title: alert.title,
            description: alert.description,
            level: alert.level
        });

        return escalation;
    }
}

// Instância global
window.OnCallRotation = new OnCallRotation();

export default OnCallRotation;