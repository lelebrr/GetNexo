const mongoose = require('mongoose');

const gameAnalyticsSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        enum: ['roleta', 'raspadinha', 'caca_preco', 'quiz', 'monte_kit'],
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    // Métricas básicas
    totalSessions: {
        type: Number,
        default: 0
    },
    completedSessions: {
        type: Number,
        default: 0
    },
    abandonedSessions: {
        type: Number,
        default: 0
    },
    // Métricas de engajamento
    totalPlayTime: {
        type: Number, // em segundos
        default: 0
    },
    avgSessionDuration: {
        type: Number, // em segundos
        default: 0
    },
    // Métricas de pontos
    totalPointsEarned: {
        type: Number,
        default: 0
    },
    avgPointsPerSession: {
        type: Number,
        default: 0
    },
    totalPointsSpent: {
        type: Number,
        default: 0
    },
    // Métricas de conversão
    sessionsWithPoints: {
        type: Number,
        default: 0
    },
    conversionToPurchaseRate: {
        type: Number, // %
        default: 0
    },
    // Métricas por canal
    channelStats: [{
        channel: {
            type: String,
            enum: ['whatsapp', 'facebook', 'email', 'chat', 'phone', 'widget']
        },
        sessions: { type: Number, default: 0 },
        completions: { type: Number, default: 0 },
        pointsEarned: { type: Number, default: 0 }
    }],
    // Métricas por período do dia
    hourlyStats: [{
        hour: {
            type: Number,
            min: 0,
            max: 23
        },
        sessions: { type: Number, default: 0 },
        completions: { type: Number, default: 0 },
        avgPoints: { type: Number, default: 0 }
    }],
    // Métricas de fidelidade
    newPlayers: {
        type: Number,
        default: 0
    },
    returningPlayers: {
        type: Number,
        default: 0
    },
    levelUps: {
        type: Number,
        default: 0
    },
    // Métricas de retenção
    retentionRate: {
        type: Number, // % de jogadores que retornaram no dia seguinte
        default: 0
    },
    // Métricas de receita
    revenue: {
        type: Number,
        default: 0
    },
    avgRevenuePerSession: {
        type: Number,
        default: 0
    },
    // Métricas de engajamento social
    shares: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    // Dados demográficos
    locationStats: [{
        country: String,
        region: String,
        sessions: { type: Number, default: 0 },
        avgPoints: { type: Number, default: 0 }
    }],
    // Dados de dispositivo
    deviceStats: [{
        deviceType: {
            type: String,
            enum: ['mobile', 'tablet', 'desktop']
        },
        sessions: { type: Number, default: 0 },
        completions: { type: Number, default: 0 }
    }],
    // Configuração do jogo usada
    gameConfig: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Métricas calculadas
    completionRate: {
        type: Number, // %
        default: 0
    },
    abandonmentRate: {
        type: Number, // %
        default: 0
    },
    engagementScore: {
        type: Number, // 0-100
        default: 0
    },
    // Insights automáticos
    insights: [{
        type: {
            type: String,
            enum: ['success', 'warning', 'info', 'danger']
        },
        title: String,
        description: String,
        metric: String,
        value: Number,
        recommendation: String,
        generatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Metadados
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes compostos para queries eficientes
gameAnalyticsSchema.index({ gameType: 1, date: -1 });
gameAnalyticsSchema.index({ date: -1, gameType: 1 });
gameAnalyticsSchema.index({ gameType: 1, date: -1, completionRate: -1 });

// Virtual para CTR calculado
gameAnalyticsSchema.virtual('clickThroughRate').get(function () {
    if (this.totalSessions > 0) {
        return ((this.completedSessions + this.abandonedSessions) / this.totalSessions) * 100;
    }
    return 0;
});

// Método para calcular métricas derivadas
gameAnalyticsSchema.methods.calculateDerivedMetrics = function () {
    // Taxa de conclusão
    if (this.totalSessions > 0) {
        this.completionRate = (this.completedSessions / this.totalSessions) * 100;
        this.abandonmentRate = (this.abandonedSessions / this.totalSessions) * 100;
    }

    // Média de pontos por sessão
    if (this.completedSessions > 0) {
        this.avgPointsPerSession = this.totalPointsEarned / this.completedSessions;
    }

    // Média de duração da sessão
    if (this.totalSessions > 0) {
        this.avgSessionDuration = this.totalPlayTime / this.totalSessions;
    }

    // Score de engajamento (0-100)
    const completionWeight = 0.4;
    const timeWeight = 0.3;
    const pointsWeight = 0.3;

    const completionScore = Math.min(this.completionRate / 100, 1);
    const timeScore = Math.min(this.avgSessionDuration / 300, 1); // 5 minutos = score máximo
    const pointsScore = Math.min(this.avgPointsPerSession / 100, 1); // 100 pontos = score máximo

    this.engagementScore = (completionScore * completionWeight +
        timeScore * timeWeight +
        pointsScore * pointsWeight) * 100;
};

// Método para gerar insights automáticos
gameAnalyticsSchema.methods.generateInsights = function () {
    this.insights = [];

    // Insight sobre conclusão
    if (this.completionRate < 30) {
        this.insights.push({
            type: 'warning',
            title: 'Taxa de Conclusão Baixa',
            description: `Apenas ${this.completionRate.toFixed(1)}% dos jogadores completam o jogo`,
            metric: 'completionRate',
            value: this.completionRate,
            recommendation: 'Considere simplificar o jogo ou melhorar a experiência'
        });
    } else if (this.completionRate > 80) {
        this.insights.push({
            type: 'success',
            title: 'Excelente Taxa de Conclusão',
            description: `${this.completionRate.toFixed(1)}% dos jogadores completam o jogo`,
            metric: 'completionRate',
            value: this.completionRate,
            recommendation: 'Continue com a boa experiência atual'
        });
    }

    // Insight sobre engajamento
    if (this.avgSessionDuration < 60) {
        this.insights.push({
            type: 'info',
            title: 'Sessões Muito Curtas',
            description: `Tempo médio de ${Math.round(this.avgSessionDuration)} segundos`,
            metric: 'avgSessionDuration',
            value: this.avgSessionDuration,
            recommendation: 'Adicione mais elementos interativos para aumentar o engajamento'
        });
    } else if (this.avgSessionDuration > 300) {
        this.insights.push({
            type: 'success',
            title: 'Excelente Engajamento',
            description: `Tempo médio de ${Math.round(this.avgSessionDuration)} segundos`,
            metric: 'avgSessionDuration',
            value: this.avgSessionDuration,
            recommendation: 'Os jogadores estão muito engajados!'
        });
    }

    // Insight sobre pontos
    if (this.avgPointsPerSession < 10) {
        this.insights.push({
            type: 'info',
            title: 'Pontuação Baixa',
            description: `Média de ${this.avgPointsPerSession.toFixed(1)} pontos por sessão`,
            metric: 'avgPointsPerSession',
            value: this.avgPointsPerSession,
            recommendation: 'Aumente as recompensas ou torne o jogo mais fácil'
        });
    }

    // Insight sobre conversão
    if (this.conversionToPurchaseRate > 5) {
        this.insights.push({
            type: 'success',
            title: 'Boa Conversão',
            description: `${this.conversionToPurchaseRate.toFixed(1)}% dos jogadores fazem compras`,
            metric: 'conversionToPurchaseRate',
            value: this.conversionToPurchaseRate,
            recommendation: 'O jogo está gerando boas vendas!'
        });
    }
};

// Método para agregar dados de sessões
gameAnalyticsSchema.statics.aggregateFromSessions = function (gameType, date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.aggregate([
        {
            $match: {
                gameType,
                startedAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: 1 },
                completedSessions: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                abandonedSessions: {
                    $sum: { $cond: [{ $eq: ['$status', 'abandoned'] }, 1, 0] }
                },
                totalPointsEarned: { $sum: '$pointsEarned' },
                totalPointsSpent: {
                    $sum: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$transactions',
                                        cond: { $eq: ['$$this.type', 'spent'] }
                                    }
                                },
                                as: 'txn',
                                in: '$$txn.amount'
                            }
                        }
                    }
                },
                totalPlayTime: { $sum: '$duration' },
                sessionsWithPoints: {
                    $sum: { $cond: [{ $gt: ['$pointsEarned', 0] }, 1, 0] }
                },
                // Agrupar por canal
                channelStats: {
                    $push: {
                        channel: '$channel',
                        session: 1,
                        completed: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                        pointsEarned: '$pointsEarned'
                    }
                },
                // Agrupar por hora
                hourlyStats: {
                    $push: {
                        hour: { $hour: '$startedAt' },
                        session: 1,
                        completed: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                        pointsEarned: '$pointsEarned'
                    }
                }
            }
        },
        {
            $project: {
                totalSessions: 1,
                completedSessions: 1,
                abandonedSessions: 1,
                totalPointsEarned: 1,
                totalPointsSpent: 1,
                totalPlayTime: 1,
                sessionsWithPoints: 1,
                channelStats: {
                    $reduce: {
                        input: '$channelStats',
                        initialValue: [],
                        in: {
                            $concatArrays: ['$$value', ['$$this']]
                        }
                    }
                },
                hourlyStats: {
                    $reduce: {
                        input: '$hourlyStats',
                        initialValue: [],
                        in: {
                            $concatArrays: ['$$value', ['$$this']]
                        }
                    }
                }
            }
        }
    ]);
};

// Método estático para obter relatório semanal
gameAnalyticsSchema.statics.getWeeklyReport = function (gameType, startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return this.find({
        gameType,
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
};

// Método estático para comparar com período anterior
gameAnalyticsSchema.statics.compareWithPreviousPeriod = function (gameType, currentDate, days = 7) {
    const currentStart = new Date(currentDate);
    currentStart.setDate(currentStart.getDate() - days + 1);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);

    const currentPeriod = this.aggregate([
        {
            $match: {
                gameType,
                date: { $gte: currentStart, $lte: currentDate }
            }
        },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: '$totalSessions' },
                completedSessions: { $sum: '$completedSessions' },
                totalPointsEarned: { $sum: '$totalPointsEarned' },
                avgSessionDuration: { $avg: '$avgSessionDuration' }
            }
        }
    ]);

    const previousPeriod = this.aggregate([
        {
            $match: {
                gameType,
                date: { $gte: previousStart, $lte: currentStart }
            }
        },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: '$totalSessions' },
                completedSessions: { $sum: '$completedSessions' },
                totalPointsEarned: { $sum: '$totalPointsEarned' },
                avgSessionDuration: { $avg: '$avgSessionDuration' }
            }
        }
    ]);

    return Promise.all([currentPeriod, previousPeriod]).then(([current, previous]) => ({
        current: current[0] || {},
        previous: previous[0] || {},
        growth: {
            sessions: calculateGrowth(current[0]?.totalSessions, previous[0]?.totalSessions),
            completions: calculateGrowth(current[0]?.completedSessions, previous[0]?.completedSessions),
            points: calculateGrowth(current[0]?.totalPointsEarned, previous[0]?.totalPointsEarned),
            duration: calculateGrowth(current[0]?.avgSessionDuration, previous[0]?.avgSessionDuration)
        }
    }));
};

function calculateGrowth(current, previous) {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

module.exports = mongoose.model('GameAnalytics', gameAnalyticsSchema);