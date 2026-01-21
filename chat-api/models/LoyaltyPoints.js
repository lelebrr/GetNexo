const mongoose = require('mongoose');

const loyaltyPointsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    totalPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    availablePoints: {
        type: Number,
        default: 0,
        min: 0
    },
    level: {
        type: Number,
        default: 1,
        min: 1
    },
    levelName: {
        type: String,
        default: 'Bronze'
    },
    levelThresholds: {
        bronze: { min: 0, max: 499 },
        silver: { min: 500, max: 1499 },
        gold: { min: 1500, max: 2999 },
        platinum: { min: 3000, max: 4999 },
        diamond: { min: 5000, max: Infinity }
    },
    badges: [{
        id: String,
        name: String,
        description: String,
        icon: String,
        earnedAt: {
            type: Date,
            default: Date.now
        },
        category: {
            type: String,
            enum: ['games', 'loyalty', 'achievements', 'special']
        }
    }],
    transactions: [{
        id: String,
        type: {
            type: String,
            enum: ['earned', 'spent', 'expired', 'bonus', 'penalty'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        gameType: {
            type: String,
            enum: ['roleta', 'raspadinha', 'caca_preco', 'quiz', 'monte_kit']
        },
        orderId: String, // Para compras/redemptions
        expiresAt: Date, // Para pontos que expiram
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    stats: {
        totalEarned: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
        totalExpired: {
            type: Number,
            default: 0
        },
        gamesPlayed: {
            type: Number,
            default: 0
        },
        averagePointsPerGame: {
            type: Number,
            default: 0
        },
        redemptionRate: {
            type: Number,
            default: 0
        },
        lastActivity: Date,
        firstActivity: Date
    },
    preferences: {
        autoRedeem: {
            type: Boolean,
            default: false
        },
        notifications: {
            levelUp: {
                type: Boolean,
                default: true
            },
            pointsExpiry: {
                type: Boolean,
                default: true
            },
            specialOffers: {
                type: Boolean,
                default: true
            }
        },
        favoriteCategories: [String]
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
loyaltyPointsSchema.index({ userId: 1 });
loyaltyPointsSchema.index({ level: 1 });
loyaltyPointsSchema.index({ totalPoints: -1 });
loyaltyPointsSchema.index({ 'stats.lastActivity': -1 });

// Virtual para pontos expirados em breve
loyaltyPointsSchema.virtual('expiringSoon').get(function () {
    const soon = new Date();
    soon.setDate(soon.getDate() + 30); // 30 dias

    return this.transactions.filter(t =>
        t.type === 'earned' &&
        t.expiresAt &&
        t.expiresAt <= soon &&
        t.expiresAt > new Date()
    ).length;
});

// Método para adicionar pontos
loyaltyPointsSchema.methods.addPoints = function (amount, reason, gameType = null, metadata = {}, expiresInDays = 365) {
    if (amount <= 0) {
        throw new Error('Quantidade de pontos deve ser positiva');
    }

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null;

    this.totalPoints += amount;
    this.availablePoints += amount;
    this.stats.totalEarned += amount;
    this.stats.lastActivity = new Date();
    this.stats.gamesPlayed += 1;

    // Calcular média de pontos por jogo
    this.stats.averagePointsPerGame = this.stats.totalEarned / this.stats.gamesPlayed;

    // Verificar mudança de nível
    this.checkLevelUp();

    // Adicionar transação
    this.transactions.push({
        id: transactionId,
        type: 'earned',
        amount,
        reason,
        gameType,
        expiresAt,
        metadata,
        createdAt: new Date()
    });

    // Limitar histórico de transações (últimas 1000)
    if (this.transactions.length > 1000) {
        this.transactions = this.transactions.slice(-1000);
    }

    return this.save();
};

// Método para gastar pontos
loyaltyPointsSchema.methods.spendPoints = function (amount, reason, orderId = null, metadata = {}) {
    if (amount <= 0) {
        throw new Error('Quantidade de pontos deve ser positiva');
    }

    if (this.availablePoints < amount) {
        throw new Error('Pontos insuficientes');
    }

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.availablePoints -= amount;
    this.stats.totalSpent += amount;
    this.stats.redemptionRate = this.stats.totalSpent / this.stats.totalEarned;
    this.stats.lastActivity = new Date();

    // Adicionar transação
    this.transactions.push({
        id: transactionId,
        type: 'spent',
        amount: -amount, // Negativo para gastos
        reason,
        orderId,
        metadata,
        createdAt: new Date()
    });

    // Verificar se deve descer de nível
    this.checkLevelDown();

    return this.save();
};

// Método para verificar mudança de nível
loyaltyPointsSchema.methods.checkLevelUp = function () {
    const levels = Object.entries(this.levelThresholds);
    let newLevel = 1;
    let newLevelName = 'Bronze';

    for (const [levelName, threshold] of levels) {
        if (this.totalPoints >= threshold.min) {
            newLevel = levels.indexOf([levelName, threshold]) + 1;
            newLevelName = levelName.charAt(0).toUpperCase() + levelName.slice(1);
        } else {
            break;
        }
    }

    if (newLevel > this.level) {
        const oldLevel = this.level;
        this.level = newLevel;
        this.levelName = newLevelName;

        // Adicionar badge de nível
        this.addBadge(`level_${newLevel}`, `Nível ${newLevelName}`, `Alcançou o nível ${newLevelName}`, 'loyalty');
    }
};

// Método para verificar se deve descer de nível
loyaltyPointsSchema.methods.checkLevelDown = function () {
    const levels = Object.entries(this.levelThresholds);
    let currentThreshold = this.levelThresholds.bronze;

    for (let i = levels.length - 1; i >= 0; i--) {
        const [levelName, threshold] = levels[i];
        if (this.totalPoints >= threshold.min) {
            currentThreshold = threshold;
            break;
        }
    }

    if (this.totalPoints < currentThreshold.min) {
        // Recalcular nível
        this.checkLevelUp();
    }
};

// Método para adicionar badge
loyaltyPointsSchema.methods.addBadge = function (badgeId, name, description, category = 'achievements') {
    // Verificar se já tem o badge
    if (this.badges.some(b => b.id === badgeId)) {
        return false;
    }

    this.badges.push({
        id: badgeId,
        name,
        description,
        category,
        earnedAt: new Date()
    });

    return true;
};

// Método para expirar pontos
loyaltyPointsSchema.methods.expirePoints = function () {
    const now = new Date();
    let expiredAmount = 0;

    // Encontrar transações expiradas
    const expiredTransactions = this.transactions.filter(t =>
        t.type === 'earned' &&
        t.expiresAt &&
        t.expiresAt <= now &&
        !t.metadata.expired // Não expirar novamente
    );

    for (const transaction of expiredTransactions) {
        const amount = transaction.amount;
        this.availablePoints = Math.max(0, this.availablePoints - amount);
        this.stats.totalExpired += amount;
        transaction.metadata.expired = true;
        transaction.metadata.expiredAt = now;
    }

    if (expiredTransactions.length > 0) {
        return this.save();
    }

    return Promise.resolve(this);
};

// Método para obter resumo
loyaltyPointsSchema.methods.getSummary = function () {
    return {
        userId: this.userId,
        totalPoints: this.totalPoints,
        availablePoints: this.availablePoints,
        level: this.level,
        levelName: this.levelName,
        badgesCount: this.badges.length,
        expiringSoon: this.expiringSoon,
        stats: this.stats,
        lastActivity: this.stats.lastActivity
    };
};

// Método estático para leaderboard
loyaltyPointsSchema.statics.getLeaderboard = function (limit = 10, period = null) {
    let match = {};

    if (period) {
        const startDate = new Date();
        switch (period) {
            case 'monthly':
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                startDate.setDate(startDate.getDate() - startDate.getDay());
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'daily':
                startDate.setHours(0, 0, 0, 0);
                break;
        }
        match['stats.lastActivity'] = { $gte: startDate };
    }

    return this.aggregate([
        { $match: match },
        {
            $project: {
                userId: 1,
                totalPoints: 1,
                level: 1,
                levelName: 1,
                badgesCount: { $size: '$badges' },
                lastActivity: '$stats.lastActivity'
            }
        },
        { $sort: { totalPoints: -1, level: -1 } },
        { $limit: limit }
    ]);
};

// Método estático para estatísticas globais
loyaltyPointsSchema.statics.getGlobalStats = function () {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                totalPoints: { $sum: '$totalPoints' },
                avgPointsPerUser: { $avg: '$totalPoints' },
                avgLevel: { $avg: '$level' },
                totalBadges: { $sum: { $size: '$badges' } },
                levelDistribution: {
                    $push: '$level'
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalUsers: 1,
                totalPoints: 1,
                avgPointsPerUser: 1,
                avgLevel: 1,
                totalBadges: 1,
                levelDistribution: {
                    bronze: { $size: { $filter: { input: '$levels', cond: { $eq: ['$this', 1] } } } },
                    silver: { $size: { $filter: { input: '$levels', cond: { $eq: ['$this', 2] } } } },
                    gold: { $size: { $filter: { input: '$levels', cond: { $eq: ['$this', 3] } } } },
                    platinum: { $size: { $filter: { input: '$levels', cond: { $eq: ['$this', 4] } } } },
                    diamond: { $size: { $filter: { input: '$levels', cond: { $gte: ['$this', 5] } } } }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('LoyaltyPoints', loyaltyPointsSchema);