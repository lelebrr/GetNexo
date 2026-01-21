const mongoose = require('mongoose');

const dailyLoginSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    currentStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    longestStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    lastLoginDate: {
        type: Date,
        default: null
    },
    nextRewardDate: {
        type: Date,
        default: null
    },
    stamps: [{
        date: {
            type: Date,
            required: true
        },
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 7
        },
        reward: {
            type: Number,
            default: 0 // Pontos ganhos no dia
        },
        bonus: {
            type: Boolean,
            default: false // Se foi bônus por completar 7 dias
        },
        claimed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    stats: {
        totalLogins: {
            type: Number,
            default: 0
        },
        totalRewards: {
            type: Number,
            default: 0
        },
        completedCycles: {
            type: Number,
            default: 0 // Quantas vezes completou 7 dias
        },
        lastResetDate: Date,
        resetCount: {
            type: Number,
            default: 0
        }
    },
    settings: {
        enabled: {
            type: Boolean,
            default: true
        },
        resetOnMiss: {
            type: Boolean,
            default: true
        },
        maxStreak: {
            type: Number,
            default: 7
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes para performance
dailyLoginSchema.index({ userId: 1 });
dailyLoginSchema.index({ lastLoginDate: -1 });
dailyLoginSchema.index({ currentStreak: -1 });

// Virtual para verificar se pode logar hoje
dailyLoginSchema.virtual('canLoginToday').get(function () {
    if (!this.lastLoginDate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = new Date(this.lastLoginDate);
    lastLogin.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastLogin.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Já logou hoje
    if (diffDays === 0) return false;

    // Ontem - continua streak
    if (diffDays === 1) return true;

    // Mais de 1 dia - reseta se resetOnMiss estiver ativo
    if (diffDays > 1) return true;

    return false;
});

// Virtual para próximo dia na sequência
dailyLoginSchema.virtual('nextDayInSequence').get(function () {
    const todayStamps = this.getStampsForDate(new Date());
    if (todayStamps.length > 0) return null; // Já logou hoje

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStamps = this.getStampsForDate(yesterday);

    if (yesterdayStamps.length === 0) return 1; // Novo ciclo

    const lastStamp = yesterdayStamps[yesterdayStamps.length - 1];
    return lastStamp.day + 1;
});

// Método para registrar login diário
dailyLoginSchema.methods.recordDailyLogin = function (rewardPoints = 0, bonus = false) {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Verificar se já logou hoje
    const todayStamps = this.stamps.filter(stamp => {
        const stampDate = new Date(stamp.date);
        stampDate.setHours(0, 0, 0, 0);
        return stampDate.getTime() === today.getTime();
    });

    if (todayStamps.length > 0) {
        throw new Error('Já realizou login hoje');
    }

    // Calcular streak
    const yesterdayStamps = this.stamps.filter(stamp => {
        const stampDate = new Date(stamp.date);
        stampDate.setHours(0, 0, 0, 0);
        return stampDate.getTime() === yesterday.getTime();
    });

    let newStreak = 1;
    let reset = false;

    if (yesterdayStamps.length > 0) {
        // Logou ontem - continua streak
        newStreak = this.currentStreak + 1;
    } else if (this.currentStreak > 0) {
        // Não logou ontem - reseta se configurado
        if (this.settings.resetOnMiss) {
            reset = true;
            this.stats.resetCount += 1;
            this.stats.lastResetDate = now;
            newStreak = 1;
        }
    }

    // Calcular dia na sequência (1-7)
    const dayInSequence = yesterdayStamps.length > 0 ? yesterdayStamps[0].day + 1 : 1;
    const actualDay = dayInSequence > this.settings.maxStreak ? 1 : dayInSequence;

    // Criar novo stamp
    const newStamp = {
        date: now,
        day: actualDay,
        reward: rewardPoints,
        bonus: bonus,
        claimed: false
    };

    this.stamps.push(newStamp);
    this.currentStreak = newStreak;
    this.longestStreak = Math.max(this.longestStreak, newStreak);
    this.lastLoginDate = now;
    this.stats.totalLogins += 1;
    this.stats.totalRewards += rewardPoints;

    // Verificar se completou ciclo de 7 dias
    if (actualDay === this.settings.maxStreak && !bonus) {
        this.stats.completedCycles += 1;
    }

    // Calcular próxima data de recompensa
    this.nextRewardDate = new Date(now);
    this.nextRewardDate.setDate(now.getDate() + 1);
    this.nextRewardDate.setHours(0, 0, 0, 0);

    // Limitar histórico de stamps (últimos 60 dias)
    if (this.stamps.length > 60) {
        this.stamps = this.stamps.slice(-60);
    }

    return this.save();
};

// Método para obter stamps de uma data específica
dailyLoginSchema.methods.getStampsForDate = function (date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return this.stamps.filter(stamp => {
        const stampDate = new Date(stamp.date);
        stampDate.setHours(0, 0, 0, 0);
        return stampDate.getTime() === targetDate.getTime();
    });
};

// Método para obter progresso atual
dailyLoginSchema.methods.getCurrentProgress = function () {
    const today = new Date();
    const todayStamps = this.getStampsForDate(today);

    return {
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        loggedToday: todayStamps.length > 0,
        nextDay: this.nextDayInSequence,
        canLoginToday: this.canLoginToday,
        nextRewardDate: this.nextRewardDate,
        stats: this.stats,
        settings: this.settings
    };
};

// Método estático para leaderboard de streaks
dailyLoginSchema.statics.getStreakLeaderboard = function (limit = 10) {
    return this.aggregate([
        {
            $project: {
                userId: 1,
                currentStreak: 1,
                longestStreak: 1,
                lastLoginDate: 1,
                totalLogins: '$stats.totalLogins'
            }
        },
        { $sort: { currentStreak: -1, longestStreak: -1 } },
        { $limit: limit }
    ]);
};

module.exports = mongoose.model('DailyLogin', dailyLoginSchema);