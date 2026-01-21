const mongoose = require('mongoose');

const loyaltyConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    description: String,

    // Configurações de pontos
    pointsConfig: {
        basePointsPerReal: {
            type: Number,
            default: 1,
            min: 0.1
        },
        pointsExpiryDays: {
            type: Number,
            default: 365,
            min: 30
        },
        maxPointsPerPurchase: {
            type: Number,
            default: 10000
        },
        minPurchaseForPoints: {
            type: Number,
            default: 10
        }
    },

    // Configurações de login diário
    dailyLoginConfig: {
        enabled: {
            type: Boolean,
            default: true
        },
        maxStreak: {
            type: Number,
            default: 7,
            min: 1
        },
        resetOnMiss: {
            type: Boolean,
            default: true
        },
        rewards: [{
            day: {
                type: Number,
                required: true,
                min: 1
            },
            points: {
                type: Number,
                default: 10,
                min: 0
            },
            bonus: {
                type: Boolean,
                default: false
            },
            description: String
        }],
        bonusCycleReward: {
            points: {
                type: Number,
                default: 100
            },
            description: {
                type: String,
                default: 'Bônus por completar ciclo de 7 dias!'
            }
        }
    },

    // Configurações de referral
    referralConfig: {
        enabled: {
            type: Boolean,
            default: true
        },
        referrerReward: {
            type: Number,
            default: 10
        },
        referredReward: {
            type: Number,
            default: 10
        },
        expiryDays: {
            type: Number,
            default: 30,
            min: 7
        },
        maxReferralsPerUser: {
            type: Number,
            default: 100
        },
        requirements: {
            registration: {
                type: Boolean,
                default: true
            },
            firstPurchase: {
                type: Boolean,
                default: false
            },
            daysActive: {
                type: Number,
                default: 0
            }
        }
    },

    // Configurações de tiers
    tierConfig: {
        enabled: {
            type: Boolean,
            default: true
        },
        autoUpgrade: {
            type: Boolean,
            default: true
        },
        downgradeEnabled: {
            type: Boolean,
            default: false
        },
        monthlyBonuses: {
            type: Boolean,
            default: true
        }
    },

    // Configurações de gamificação
    gamificationConfig: {
        badgesEnabled: {
            type: Boolean,
            default: true
        },
        achievementsEnabled: {
            type: Boolean,
            default: true
        },
        leaderboardsEnabled: {
            type: Boolean,
            default: true
        },
        challengesEnabled: {
            type: Boolean,
            default: false
        }
    },

    // Integrações
    integrations: {
        erpEnabled: {
            type: Boolean,
            default: false
        },
        erpConfig: {
            endpoint: String,
            apiKey: String,
            syncInterval: {
                type: Number,
                default: 3600 // segundos
            },
            lastSync: Date
        },
        emailEnabled: {
            type: Boolean,
            default: true
        },
        whatsappEnabled: {
            type: Boolean,
            default: true
        }
    },

    // Notificações
    notifications: {
        levelUp: {
            email: {
                type: Boolean,
                default: true
            },
            whatsapp: {
                type: Boolean,
                default: true
            },
            inApp: {
                type: Boolean,
                default: true
            }
        },
        pointsExpiry: {
            email: {
                type: Boolean,
                default: true
            },
            whatsapp: {
                type: Boolean,
                default: false
            },
            daysBefore: {
                type: Number,
                default: 7
            }
        },
        referralCompleted: {
            email: {
                type: Boolean,
                default: true
            },
            whatsapp: {
                type: Boolean,
                default: true
            }
        },
        dailyRewards: {
            email: {
                type: Boolean,
                default: false
            },
            whatsapp: {
                type: Boolean,
                default: true
            }
        }
    },

    // Regras especiais
    specialRules: {
        blackoutDates: [{
            start: Date,
            end: Date,
            reason: String,
            pointsMultiplier: {
                type: Number,
                default: 1
            }
        }],
        promotionalPeriods: [{
            name: String,
            start: Date,
            end: Date,
            pointsMultiplier: {
                type: Number,
                default: 1
            },
            description: String
        }],
        categoryMultipliers: [{
            category: String,
            multiplier: {
                type: Number,
                default: 1,
                min: 0.1
            }
        }]
    },

    // Limites e restrições
    limits: {
        maxPointsPerDay: {
            type: Number,
            default: 1000
        },
        maxPointsPerMonth: {
            type: Number,
            default: 10000
        },
        maxRedemptionsPerDay: {
            type: Number,
            default: 5
        }
    },

    // Status e controle
    isActive: {
        type: Boolean,
        default: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },

    // Metadados
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Logs de mudanças
    changeLog: [{
        action: String,
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        changedBy: String,
        changedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
loyaltyConfigSchema.index({ name: 1 });
loyaltyConfigSchema.index({ isActive: 1 });

// Método para verificar se está em período promocional
loyaltyConfigSchema.methods.isPromotionalPeriod = function (date = new Date()) {
    return this.specialRules.promotionalPeriods.some(period =>
        date >= period.start && date <= period.end
    );
};

// Método para obter multiplicador atual
loyaltyConfigSchema.methods.getCurrentMultiplier = function (category = null, date = new Date()) {
    let multiplier = 1;

    // Multiplicador promocional
    const promotionalPeriod = this.specialRules.promotionalPeriods.find(period =>
        date >= period.start && date <= period.end
    );
    if (promotionalPeriod) {
        multiplier *= promotionalPeriod.pointsMultiplier;
    }

    // Multiplicador de categoria
    if (category) {
        const categoryMultiplier = this.specialRules.categoryMultipliers.find(cm =>
            cm.category === category
        );
        if (categoryMultiplier) {
            multiplier *= categoryMultiplier.multiplier;
        }
    }

    return multiplier;
};

// Método para verificar limites
loyaltyConfigSchema.methods.checkLimits = function (userId, pointsToAdd, period = 'day') {
    // Implementar verificação de limites por usuário
    // Isso pode precisar de dados adicionais do usuário
    return true; // Placeholder
};

// Método para log de mudanças
loyaltyConfigSchema.methods.logChange = function (action, field, oldValue, newValue, changedBy) {
    this.changeLog.push({
        action,
        field,
        oldValue,
        newValue,
        changedBy,
        changedAt: new Date()
    });

    // Limitar histórico
    if (this.changeLog.length > 100) {
        this.changeLog = this.changeLog.slice(-100);
    }
};

// Método estático para obter configuração ativa
loyaltyConfigSchema.statics.getActiveConfig = function () {
    return this.findOne({ isActive: true });
};

// Método estático para criar configuração padrão
loyaltyConfigSchema.statics.createDefaultConfig = async function () {
    const defaultConfig = {
        name: 'default',
        displayName: 'Configuração Padrão',
        description: 'Configuração padrão do sistema de fidelidade',

        pointsConfig: {
            basePointsPerReal: 1,
            pointsExpiryDays: 365,
            maxPointsPerPurchase: 10000,
            minPurchaseForPoints: 10
        },

        dailyLoginConfig: {
            enabled: true,
            maxStreak: 7,
            resetOnMiss: true,
            rewards: [
                { day: 1, points: 5, description: 'Dia 1' },
                { day: 2, points: 10, description: 'Dia 2' },
                { day: 3, points: 15, description: 'Dia 3' },
                { day: 4, points: 20, description: 'Dia 4' },
                { day: 5, points: 25, description: 'Dia 5' },
                { day: 6, points: 30, description: 'Dia 6' },
                { day: 7, points: 50, description: 'Dia 7 - Bônus!' }
            ],
            bonusCycleReward: {
                points: 100,
                description: 'Bônus por completar ciclo de 7 dias!'
            }
        },

        referralConfig: {
            enabled: true,
            referrerReward: 10,
            referredReward: 10,
            expiryDays: 30,
            maxReferralsPerUser: 100,
            requirements: {
                registration: true,
                firstPurchase: false,
                daysActive: 0
            }
        },

        tierConfig: {
            enabled: true,
            autoUpgrade: true,
            downgradeEnabled: false,
            monthlyBonuses: true
        },

        gamificationConfig: {
            badgesEnabled: true,
            achievementsEnabled: true,
            leaderboardsEnabled: true,
            challengesEnabled: false
        },

        notifications: {
            levelUp: {
                email: true,
                whatsapp: true,
                inApp: true
            },
            pointsExpiry: {
                email: true,
                whatsapp: false,
                daysBefore: 7
            },
            referralCompleted: {
                email: true,
                whatsapp: true
            },
            dailyRewards: {
                email: false,
                whatsapp: true
            }
        },

        limits: {
            maxPointsPerDay: 1000,
            maxPointsPerMonth: 10000,
            maxRedemptionsPerDay: 5
        }
    };

    const existing = await this.findOne({ name: 'default' });
    if (!existing) {
        return await this.create(defaultConfig);
    }

    return existing;
};

module.exports = mongoose.model('LoyaltyConfig', loyaltyConfigSchema);