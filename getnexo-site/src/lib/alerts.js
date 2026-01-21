const nodemailer = require('nodemailer');

// Configuração do transporte de email
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Thresholds para alertas automáticos
const ALERT_THRESHOLDS = {
    highResponseTime: 5000, // 5 segundos
    errorRate: 0.05, // 5% de erro
    memoryUsage: 0.8, // 80% de uso de memória
    cpuUsage: 0.9, // 90% de uso de CPU
    lowUsers: 100, // Menos de 100 usuários ativos
    revenueDecline: -10000 // Declínio de R$ 10k
};

// Alertas ativos para evitar spam
const activeAlerts = new Map();

// Função principal para verificar e enviar alertas
async function checkAndSendAlerts(metrics, kpis, io) {
    const alerts = [];

    // Verificar performance do sistema
    if (metrics.avgResponseTime > ALERT_THRESHOLDS.highResponseTime) {
        alerts.push({
            type: 'system_performance',
            level: 'warning',
            title: 'Alto tempo de resposta',
            message: `Tempo médio de resposta: ${metrics.avgResponseTime}ms`,
            action: 'Verificar performance do servidor'
        });
    }

    if (metrics.errorRate > ALERT_THRESHOLDS.errorRate) {
        alerts.push({
            type: 'error_rate',
            level: 'error',
            title: 'Alta taxa de erro',
            message: `Taxa de erro: ${(metrics.errorRate * 100).toFixed(2)}%`,
            action: 'Investigar erros no sistema'
        });
    }

    // Verificar uso de recursos
    const memoryUsagePercent = metrics.memoryUsage / metrics.totalMemory;
    if (memoryUsagePercent > ALERT_THRESHOLDS.memoryUsage) {
        alerts.push({
            type: 'memory_usage',
            level: 'warning',
            title: 'Uso alto de memória',
            message: `Memória utilizada: ${(memoryUsagePercent * 100).toFixed(1)}%`,
            action: 'Otimizar uso de memória'
        });
    }

    // Verificar KPIs de negócio
    if (kpis.activeUsers < ALERT_THRESHOLDS.lowUsers) {
        alerts.push({
            type: 'low_users',
            level: 'warning',
            title: 'Poucos usuários ativos',
            message: `Usuários ativos: ${kpis.activeUsers}`,
            action: 'Revisar estratégia de engajamento'
        });
    }

    if (kpis.revenueGrowth < ALERT_THRESHOLDS.revenueDecline) {
        alerts.push({
            type: 'revenue_decline',
            level: 'error',
            title: 'Declínio de receita',
            message: `Crescimento mensal: R$ ${kpis.revenueGrowth}`,
            action: 'Analisar causas do declínio'
        });
    }

    // Enviar alertas não duplicados
    for (const alert of alerts) {
        const alertKey = `${alert.type}_${Date.now()}`;
        if (!activeAlerts.has(alertKey)) {
            activeAlerts.set(alertKey, alert);
            await sendAlert(alert, io);

            // Remover alerta ativo após 1 hora
            setTimeout(() => activeAlerts.delete(alertKey), 3600000);
        }
    }
}

// Enviar alerta por email e WebSocket
async function sendAlert(alert, io) {
    try {
        // Log do alerta
        console.warn(`ALERT: ${alert.title} - ${alert.message}`, {
            type: alert.type,
            level: alert.level,
            action: alert.action
        });

        // Enviar por email se configurado
        if (process.env.SMTP_USER) {
            await sendEmailAlert(alert);
        }

        // Enviar por WebSocket para admin
        if (io) {
            io.to('admin_room').emit('system_alert', {
                ...alert,
                timestamp: new Date().toISOString()
            });
        }

        // Enviar notificação push se disponível
        await sendPushNotification(alert);

    } catch (error) {
        console.error('Erro ao enviar alerta', { error: error.message, alert });
    }
}

// Enviar alerta por email
async function sendEmailAlert(alert) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || 'admin@getnexo.com.br',
        subject: `[${alert.level.toUpperCase()}] Alerta GetNexo: ${alert.title}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${alert.level === 'error' ? '#dc2626' : '#d97706'};">${alert.title}</h2>
        <p><strong>Mensagem:</strong> ${alert.message}</p>
        <p><strong>Ação recomendada:</strong> ${alert.action}</p>
        <p><small>Enviado em: ${new Date().toLocaleString('pt-BR')}</small></p>
      </div>
    `
    };

    await emailTransporter.sendMail(mailOptions);
}

// Enviar notificação push (placeholder para implementação futura)
async function sendPushNotification(alert) {
    // Implementar integração com serviço de push notifications
    console.info('Push notification would be sent', { alert });
}

// Alerta manual para admins
async function sendManualAlert(title, message, level = 'info', io) {
    const alert = {
        type: 'manual',
        level,
        title,
        message,
        action: 'Verificar dashboard'
    };

    await sendAlert(alert, io);
}

// Verificar alertas periodicamente
function startAlertMonitoring(io) {
    setInterval(async () => {
        try {
            // Simular coleta de métricas (em produção, usar dados reais)
            const mockMetrics = {
                avgResponseTime: Math.random() * 3000 + 500,
                errorRate: Math.random() * 0.1,
                memoryUsage: Math.random() * 1000000000 + 500000000,
                totalMemory: 2000000000
            };

            const mockKPIs = {
                activeUsers: Math.floor(Math.random() * 1000 + 200),
                revenueGrowth: (Math.random() - 0.5) * 20000
            };

            await checkAndSendAlerts(mockMetrics, mockKPIs, io);
        } catch (error) {
            console.error('Erro no monitoramento de alertas', { error: error.message });
        }
    }, 300000); // A cada 5 minutos
}

module.exports = {
    checkAndSendAlerts,
    sendManualAlert,
    sendAlert,
    startAlertMonitoring,
    ALERT_THRESHOLDS
};