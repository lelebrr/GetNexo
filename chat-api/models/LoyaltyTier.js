const mongoose = require('mongoose');

const loyaltyTierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minPoints: {
        type: Number,
        required: true,
        min: 0
    },
    maxPoints: {
        type: Number,
        default: null // null significa infinito
    },
    level: {
        type: Number,
        required: true,
        min: 1
    },
    benefits: {
        multiplier: {
            type: Number,
            default: 1.0,
            min: 0.1
        },
        bonusPoints: {
            type: Number,
            default: 0,
            min: 0
        },
        exclusiveOffers: [{
            title: String,
            description: String,
            discountPercentage: Number,
            validUntil: Date
        }],
        freeShipping: {
            type: Boolean,
            default: false
        },
        prioritySupport: {
            type: Boolean,
            default: false
        },
        birthdayBonus: {
            type: Number,
            default: 0
        },
        earlyAccess: {
            type: Boolean,
            default: false
        }
    },
    requirements: {
        purchases: {
            minAmount: {
                type: Number,
                default: 0
            },
            count: {
                type: Number,
                default: 0
            }
        },
        referrals: {
            type: Number,
            default: 0
        },
        daysActive: {
            type: Number,
            default: 0
        }
    },
    rewards: {
        welcomeBonus: {
            type: Number,
            default: 0
        },
        monthlyBonus: {
            type: Number,
            default: 0
        },
        anniversaryBonus: {
            type: Number,
            default: 0
        },
        milestoneRewards: [{
            points: Number,
            reward: {
                type: String,
                enum: ['discount', 'free_item', 'points_bonus', 'vip_access']
            },
            value: Number, // valor do desconto ou pontos
            description: String
        }]
    },
    visualConfig: {
        color: {
            type: String,
            default: '#6B7280'
        },
        icon: String,
        badgeUrl: String,
        progressBarColor: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
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

// Indexes
loyaltyTierSchema.index({ level: 1 });
loyaltyTierSchema.index({ minPoints: 1 });
loyaltyTierSchema.index({ isActive: 1 });
loyaltyTierSchema.index({ order: 1 });

// Virtual para verificar se tier aceita um número de pontos
loyaltyTierSchema.virtual('acceptsPoints').get(function (points) {
    return points >= this.minPoints &&
        (this.maxPoints === null || points <= this.maxPoints);
});

// Método para verificar se usuário qualifica
loyaltyTierSchema.methods.qualifies = function (userStats) {
    const { totalSpent, referralCount, daysActive, currentPoints } = userStats;

    // Verificar pontos
    if (currentPoints < this.minPoints) return false;
    if (this.maxPoints !== null && currentPoints > this.maxPoints) return false;

    // Verificar compras
    if (this.requirements.purchases.minAmount > 0 &&
        (!totalSpent || totalSpent < this.requirements.purchases.minAmount)) {
        return false;
    }

    if (this.requirements.purchases.count > 0 &&
        (!userStats.purchaseCount || userStats.purchaseCount < this.requirements.purchases.count)) {
        return false;
    }

    // Verificar indicações
    if (this.requirements.referrals > 0 &&
        (!referralCount || referralCount < this.requirements.referrals)) {
        return false;
    }

    // Verificar dias ativos
    if (this.requirements.daysActive > 0 &&
        (!daysActive || daysActive < this.requirements.daysActive)) {
        return false;
    }

    return true;
};

// Método para calcular progresso para próximo tier
loyaltyTierSchema.methods.getProgressToNext = function (currentPoints, nextTier) {
    if (!nextTier) return null;

    const pointsNeeded = nextTier.minPoints - currentPoints;
    const totalPointsNeeded = nextTier.minPoints - this.minPoints;

    return {
        currentPoints,
        pointsNeeded,
        totalPointsNeeded,
        percentage: totalPointsNeeded > 0 ?
            ((currentPoints - this.minPoints) / totalPointsNeeded) * 100 : 100,
        nextTier: nextTier.name
    };
};

// Método estático para encontrar tier apropriado
loyaltyTierSchema.statics.findAppropriateTier = function (points, userStats = {}) {
    // Primeiro, encontrar tiers ativos ordenados por level
    const tiers = await this.find({ isActive: true }).sort({ level: 1 });

    let appropriateTier = tiers[0]; // tier mais baixo como fallback

    for (const tier of tiers) {
        if (tier.qualifies({ ...userStats, currentPoints: points })) {
            appropriateTier = tier;
        } else {
            break; // tiers são ordenados, se não qualifica para este, não qualifica para próximos
        }
    }

    return appropriateTier;
};

// Método estático para obter todos tiers ativos
loyaltyTierSchema.statics.getActiveTiers = function () {
    return this.find({ isActive: true }).sort({ order: 1, level: 1 });
};

// Método estático para criar tiers padrão
loyaltyTierSchema.statics.createDefaultTiers = async function () {
    const defaultTiers = [
        {
            name: 'bronze',
            displayName: 'Bronze',
            description: 'Tier inicial do programa de fidelidade',
            minPoints: 0,
            maxPoints: 499,
            level: 1,
            benefits: {
                multiplier: 1.0,
                bonusPoints: 0
            },
            visualConfig: {
                color: '#CD7F32',
                icon: '🥉'
            },
            isDefault: true,
            order: 1
        },
        {
            name: 'silver',
            displayName: 'Prata',
            description: 'Cliente fiel com benefícios exclusivos',
            minPoints: 500,
            maxPoints: 1499,
            level: 2,
            benefits: {
                multiplier: 1.1,
                bonusPoints: 5,
                freeShipping: false
            },
            rewards: {
                monthlyBonus: 10
            },
            visualConfig: {
                color: '#C0C0C0',
                icon: '🥈'
            },
            order: 2
        },
        {
            name: 'gold',
            displayName: 'Ouro',
            description: 'Cliente VIP com vantagens premium',
            minPoints: 1500,
            maxPoints: 2999,
            level: 3,
            benefits: {
                multiplier: 1.25,
                bonusPoints: 10,
                freeShipping: true,
                prioritySupport: true
            },
            rewards: {
                monthlyBonus: 25,
                anniversaryBonus: 50
            },
            visualConfig: {
                color: '#FFD700',
                icon: '🥇'
            },
            order: 3
        },
        {
            name: 'platinum',
            displayName: 'Platina',
            description: 'Cliente elite com benefícios exclusivos',
            minPoints: 3000,
            maxPoints: 4999,
            level: 4,
            benefits: {
                multiplier: 1.5,
                bonusPoints: 15,
                freeShipping: true,
                prioritySupport: true,
                earlyAccess: true,
                birthdayBonus: 100
            },
            rewards: {
                monthlyBonus: 50,
                anniversaryBonus: 100
            },
            visualConfig: {
                color: '#E5E4E2',
                icon: '💎'
            },
            order: 4
        },
        {
            name: 'diamond',
            displayName: 'Diamante',
            description: 'Cliente lendário com benefícios máximos',
            minPoints: 5000,
            level: 5,
            benefits: {
                multiplier: 2.0,
                bonusPoints: 25,
                freeShipping: true,
                prioritySupport: true,
                earlyAccess: true,
                birthdayBonus: 200
            },
            rewards: {
                monthlyBonus: 100,
                anniversaryBonus: 200
            },
            visualConfig: {
                color: '#B9F2FF',
                icon: '👑'
            },
            order: 5
        }
    ];

    const createdTiers = [];
    for (const tierData of defaultTiers) {
        const existing = await this.findOne({ name: tierData.name });
        if (!existing) {
            createdTiers.push(await this.create(tierData));
        }
    }

    return createdTiers;
};

module.exports = mongoose.model('LoyaltyTier', loyaltyTierSchema);