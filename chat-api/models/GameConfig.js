const mongoose = require('mongoose');

const gameConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    games: {
        roleta: {
            enabled: { type: Boolean, default: true },
            maxSpinsPerDay: { type: Number, default: 3, min: 1, max: 10 },
            pointRange: {
                min: { type: Number, default: 10, min: 0 },
                max: { type: Number, default: 100, min: 1 }
            },
            specialPrizeChance: { type: Number, default: 5, min: 0, max: 100 },
            specialPrizePoints: { type: Number, default: 500, min: 0 }
        },
        raspadinha: {
            enabled: { type: Boolean, default: true },
            gridSize: { type: String, enum: ['3x3', '4x4', '5x5'], default: '3x3' },
            symbols: { type: [String], default: ['🍒', '🍋', '🍊', '⭐', '💎'] },
            winPatterns: { type: [String], default: ['3x3', 'diagonal', 'row'] },
            prizeMultiplier: { type: Number, default: 2, min: 1 }
        },
        caca_preco: {
            enabled: { type: Boolean, default: true },
            productPool: { type: [String], default: [] },
            priceRange: {
                min: { type: Number, default: 50, min: 0 },
                max: { type: Number, default: 1000, min: 1 }
            },
            tolerance: { type: Number, default: 10, min: 0, max: 100 },
            pointMultiplier: { type: Number, default: 1.5, min: 0.1 }
        },
        quiz: {
            enabled: { type: Boolean, default: true },
            questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
            timeLimit: { type: Number, default: 30, min: 5, max: 300 },
            hintsEnabled: { type: Boolean, default: true },
            categories: { type: [String], default: ['empresa', 'produtos', 'geral'] }
        },
        monte_kit: {
            enabled: { type: Boolean, default: true },
            kits: { type: [mongoose.Schema.Types.Mixed], default: [] },
            winChance: { type: Number, default: 25, min: 0, max: 100 },
            maxSelectionsPerDay: { type: Number, default: 1, min: 1, max: 5 }
        }
    },
    loyalty: {
        enabled: { type: Boolean, default: true },
        pointsPerGame: { type: Number, default: 10, min: 0 },
        levelThresholds: {
            type: [{
                level: { type: Number, required: true },
                name: { type: String, required: true },
                minPoints: { type: Number, required: true, min: 0 }
            }],
            default: [
                { level: 1, name: 'Bronze', minPoints: 0 },
                { level: 2, name: 'Prata', minPoints: 500 },
                { level: 3, name: 'Ouro', minPoints: 1500 },
                { level: 4, name: 'Platina', minPoints: 3000 },
                { level: 5, name: 'Diamante', minPoints: 5000 }
            ]
        },
        redemptionOptions: {
            type: [{
                name: { type: String, required: true },
                points: { type: Number, required: true, min: 0 },
                type: { type: String, enum: ['discount', 'shipping', 'product'], required: true }
            }],
            default: [
                { name: '10% de desconto', points: 200, type: 'discount' },
                { name: 'Frete grátis', points: 150, type: 'shipping' },
                { name: 'Produto bônus', points: 300, type: 'product' }
            ]
        }
    },
    analytics: {
        trackSessions: { type: Boolean, default: true },
        trackEngagement: { type: Boolean, default: true },
        trackConversions: { type: Boolean, default: true },
        realTimeDashboard: { type: Boolean, default: true },
        customReports: { type: [mongoose.Schema.Types.Mixed], default: [] }
    },
    settings: {
        targetChannels: {
            type: [String],
            enum: ['whatsapp', 'facebook', 'email', 'chat', 'phone', 'widget'],
            default: ['whatsapp', 'facebook', 'chat', 'widget']
        },
        dailyLimits: {
            maxSessionsPerUser: { type: Number, default: 10, min: 1 },
            maxPointsPerDay: { type: Number, default: 500, min: 0 }
        },
        cooldowns: {
            betweenGames: { type: Number, default: 60, min: 0 },
            dailyReset: { type: String, default: '00:00' }
        },
        notifications: {
            levelUp: { type: Boolean, default: true },
            pointsEarned: { type: Boolean, default: true },
            achievements: { type: Boolean, default: true }
        }
    },
    createdBy: {
        type: String,
        required: true,
        index: true
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
gameConfigSchema.index({ createdBy: 1 });
gameConfigSchema.index({ isActive: 1 });
gameConfigSchema.index({ 'games.roleta.enabled': 1 });
gameConfigSchema.index({ 'games.raspadinha.enabled': 1 });
gameConfigSchema.index({ 'games.caca_preco.enabled': 1 });
gameConfigSchema.index({ 'games.quiz.enabled': 1 });
gameConfigSchema.index({ 'games.monte_kit.enabled': 1 });

// Virtual para jogos ativos
gameConfigSchema.virtual('activeGames').get(function () {
    const active = [];
    Object.entries(this.games).forEach(([gameType, config]) => {
        if (config.enabled) {
            active.push(gameType);
        }
    });
    return active;
});

// Método para obter configuração de um jogo específico
gameConfigSchema.methods.getGameConfig = function (gameType) {
    if (!this.games[gameType]) {
        throw new Error(`Jogo ${gameType} não encontrado na configuração`);
    }
    return this.games[gameType];
};

// Método para atualizar configuração de um jogo
gameConfigSchema.methods.updateGameConfig = function (gameType, updates) {
    if (!this.games[gameType]) {
        throw new Error(`Jogo ${gameType} não encontrado na configuração`);
    }

    Object.assign(this.games[gameType], updates);
    return this.save();
};

// Método para obter níveis de fidelidade
gameConfigSchema.methods.getLoyaltyLevels = function () {
    return this.loyalty.levelThresholds.sort((a, b) => a.minPoints - b.minPoints);
};

// Método para obter opções de resgate
gameConfigSchema.methods.getRedemptionOptions = function () {
    return this.loyalty.redemptionOptions.sort((a, b) => a.points - b.points);
};

// Método para verificar limites diários
gameConfigSchema.methods.checkDailyLimits = function (userId, gameType) {
    // Esta verificação seria feita no contexto de sessões do usuário
    // Por enquanto, retorna sempre true (lógica seria implementada com cache Redis em produção)
    return {
        canPlay: true,
        remainingSessions: this.settings.dailyLimits.maxSessionsPerUser,
        remainingPoints: this.settings.dailyLimits.maxPointsPerDay
    };
};

// Método estático para buscar configurações ativas
gameConfigSchema.statics.getActiveConfigs = function (createdBy = null) {
    const query = { isActive: true };
    if (createdBy) {
        query.createdBy = createdBy;
    }
    return this.find(query).sort({ createdAt: -1 });
};

// Método estático para buscar configuração por jogo ativo
gameConfigSchema.statics.getConfigForGame = function (gameType, createdBy = null) {
    const query = {
        isActive: true,
        [`games.${gameType}.enabled`]: true
    };

    if (createdBy) {
        query.createdBy = createdBy;
    }

    return this.findOne(query);
};

// Validação pré-save
gameConfigSchema.pre('save', function (next) {
    // Validar que pelo menos um jogo está ativo
    const activeGames = Object.values(this.games).filter(game => game.enabled);
    if (activeGames.length === 0) {
        return next(new Error('Pelo menos um jogo deve estar ativo'));
    }

    // Validar range de pontos
    if (this.games.roleta.pointRange.min >= this.games.roleta.pointRange.max) {
        return next(new Error('Range de pontos da roleta inválido'));
    }

    // Validar preço caça-preço
    if (this.games.caca_preco.priceRange.min >= this.games.caca_preco.priceRange.max) {
        return next(new Error('Range de preços caça-preço inválido'));
    }

    // Validar limites diários
    if (this.settings.dailyLimits.maxSessionsPerUser < 1) {
        return next(new Error('Limite mínimo de sessões deve ser pelo menos 1'));
    }

    next();
});

module.exports = mongoose.model('GameConfig', gameConfigSchema);