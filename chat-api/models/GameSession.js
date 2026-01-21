const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    gameType: {
        type: String,
        required: true,
        enum: ['roleta', 'raspadinha', 'caca_preco', 'quiz', 'monte_kit'],
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned', 'timeout'],
        default: 'active',
        index: true
    },
    score: {
        type: Number,
        default: 0
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    attempts: {
        type: Number,
        default: 1
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    rewards: [{
        type: {
            type: String,
            enum: ['points', 'discount', 'free_item', 'bonus_game']
        },
        value: mongoose.Schema.Types.Mixed, // Pode ser número, string, objeto
        description: String
    }],
    gameData: {
        type: mongoose.Schema.Types.Mixed, // Dados específicos do jogo (posição roleta, etc)
        default: {}
    },
    configSnapshot: {
        type: mongoose.Schema.Types.Mixed, // Configuração usada no jogo
        default: {}
    },
    channel: {
        type: String,
        enum: ['whatsapp', 'facebook', 'email', 'chat', 'phone', 'widget'],
        default: 'widget'
    },
    conversationId: {
        type: String,
        index: true
    },
    startedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    completedAt: {
        type: Date,
        index: true
    },
    duration: {
        type: Number, // em milissegundos
        default: 0
    },
    userAgent: String,
    ipAddress: String,
    location: {
        country: String,
        region: String,
        city: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes para performance
gameSessionSchema.index({ userId: 1, gameType: 1 });
gameSessionSchema.index({ status: 1, startedAt: -1 });
gameSessionSchema.index({ gameType: 1, status: 1 });
gameSessionSchema.index({ startedAt: -1 });
gameSessionSchema.index({ channel: 1 });

// Virtual para verificar se o jogo pode ser continuado
gameSessionSchema.virtual('canContinue').get(function () {
    return this.status === 'active' && this.attempts < this.maxAttempts;
});

// Virtual para verificar se o jogo venceu
gameSessionSchema.virtual('isWinner').get(function () {
    return this.pointsEarned > 0 || this.rewards.length > 0;
});

// Método para completar o jogo
gameSessionSchema.methods.complete = function (finalScore = 0, points = 0, rewards = []) {
    this.status = 'completed';
    this.completedAt = new Date();
    this.duration = this.completedAt - this.startedAt;
    this.score = finalScore;
    this.pointsEarned = points;
    if (rewards.length > 0) {
        this.rewards = rewards;
    }
    return this.save();
};

// Método para abandonar o jogo
gameSessionSchema.methods.abandon = function () {
    this.status = 'abandoned';
    this.completedAt = new Date();
    this.duration = this.completedAt - this.startedAt;
    return this.save();
};

// Método para timeout
gameSessionSchema.methods.timeout = function () {
    this.status = 'timeout';
    this.completedAt = new Date();
    this.duration = this.completedAt - this.startedAt;
    return this.save();
};

// Método para incrementar tentativas
gameSessionSchema.methods.incrementAttempts = function () {
    this.attempts += 1;
    return this.save();
};

// Método estático para buscar sessões ativas do usuário
gameSessionSchema.statics.getActiveSessions = function (userId, gameType = null) {
    const query = { userId, status: 'active' };
    if (gameType) {
        query.gameType = gameType;
    }
    return this.find(query).sort({ startedAt: -1 });
};

// Método estático para estatísticas por jogo
gameSessionSchema.statics.getGameStats = function (gameType, startDate = null, endDate = null) {
    const match = { gameType };
    if (startDate || endDate) {
        match.startedAt = {};
        if (startDate) match.startedAt.$gte = startDate;
        if (endDate) match.startedAt.$lte = endDate;
    }

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$gameType',
                totalSessions: { $sum: 1 },
                completedSessions: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                totalPoints: { $sum: '$pointsEarned' },
                avgScore: { $avg: '$score' },
                avgDuration: { $avg: '$duration' },
                totalRewards: { $sum: { $size: '$rewards' } },
                completionRate: {
                    $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                }
            }
        }
    ]);
};

// Método estático para leaderboard
gameSessionSchema.statics.getLeaderboard = function (gameType, limit = 10, period = null) {
    const match = { gameType, status: 'completed', pointsEarned: { $gt: 0 } };

    if (period) {
        const now = new Date();
        const startDate = new Date();

        switch (period) {
            case 'daily':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                startDate.setDate(now.getDate() - now.getDay());
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            default:
                break;
        }

        match.startedAt = { $gte: startDate };
    }

    return this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$userId',
                totalPoints: { $sum: '$pointsEarned' },
                sessionsPlayed: { $sum: 1 },
                bestScore: { $max: '$score' },
                avgScore: { $avg: '$score' },
                lastPlayed: { $max: '$completedAt' }
            }
        },
        {
            $sort: { totalPoints: -1, sessionsPlayed: -1 }
        },
        { $limit: limit }
    ]);
};

module.exports = mongoose.model('GameSession', gameSessionSchema);