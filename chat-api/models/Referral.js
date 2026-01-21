const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerId: {
        type: String,
        required: true,
        index: true
    },
    referredId: {
        type: String,
        required: true,
        index: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'expired', 'cancelled'],
        default: 'pending'
    },
    rewards: {
        referrerReward: {
            type: Number,
            default: 10 // R$10
        },
        referredReward: {
            type: Number,
            default: 10 // R$10
        },
        referrerClaimed: {
            type: Boolean,
            default: false
        },
        referredClaimed: {
            type: Boolean,
            default: false
        },
        referrerClaimedAt: Date,
        referredClaimedAt: Date
    },
    metadata: {
        source: {
            type: String,
            enum: ['link', 'code', 'qr', 'widget'],
            default: 'link'
        },
        campaign: String,
        channel: String, // whatsapp, email, etc.
        userAgent: String,
        ipAddress: String,
        referrerUrl: String
    },
    completionCriteria: {
        registration: {
            type: Boolean,
            default: false
        },
        firstPurchase: {
            type: Boolean,
            default: false
        },
        firstLoyaltyPoints: {
            type: Boolean,
            default: false
        },
        daysActive: {
            type: Number,
            default: 0
        },
        completedAt: Date
    },
    expiresAt: {
        type: Date,
        default: function () {
            const date = new Date();
            date.setDate(date.getDate() + 30); // 30 dias para expirar
            return date;
        }
    },
    notes: [{
        text: String,
        createdBy: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes para performance
referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ referredId: 1 });
referralSchema.index({ referralCode: 1 });
referralSchema.index({ expiresAt: 1 });

// Virtual para verificar se está expirado
referralSchema.virtual('isExpired').get(function () {
    return this.expiresAt < new Date();
});

// Virtual para verificar se está elegível para recompensa
referralSchema.virtual('isEligibleForReward').get(function () {
    return this.status === 'completed' &&
        this.completionCriteria.registration &&
        !this.isExpired;
});

// Método para completar referral
referralSchema.methods.completeReferral = function (criteriaType) {
    if (this.status === 'completed') {
        throw new Error('Referral já foi completada');
    }

    if (this.isExpired) {
        this.status = 'expired';
        return this.save();
    }

    // Atualizar critérios de conclusão
    switch (criteriaType) {
        case 'registration':
            this.completionCriteria.registration = true;
            break;
        case 'firstPurchase':
            this.completionCriteria.firstPurchase = true;
            break;
        case 'firstLoyaltyPoints':
            this.completionCriteria.firstLoyaltyPoints = true;
            break;
    }

    // Verificar se todos os critérios foram atendidos
    if (this.completionCriteria.registration) {
        this.status = 'completed';
        this.completionCriteria.completedAt = new Date();
    }

    return this.save();
};

// Método para reivindicar recompensa
referralSchema.methods.claimReward = function (userType) {
    if (this.status !== 'completed') {
        throw new Error('Referral não foi completada');
    }

    if (this.isExpired) {
        throw new Error('Referral expirou');
    }

    if (userType === 'referrer') {
        if (this.rewards.referrerClaimed) {
            throw new Error('Recompensa do indicador já foi reivindicada');
        }
        this.rewards.referrerClaimed = true;
        this.rewards.referrerClaimedAt = new Date();
    } else if (userType === 'referred') {
        if (this.rewards.referredClaimed) {
            throw new Error('Recompensa do indicado já foi reivindicada');
        }
        this.rewards.referredClaimed = true;
        this.rewards.referredClaimedAt = new Date();
    } else {
        throw new Error('Tipo de usuário inválido');
    }

    return this.save();
};

// Método para cancelar referral
referralSchema.methods.cancelReferral = function (reason) {
    if (this.status === 'completed') {
        throw new Error('Não é possível cancelar referral completada');
    }

    this.status = 'cancelled';
    this.notes.push({
        text: `Cancelado: ${reason}`,
        createdBy: 'system',
        createdAt: new Date()
    });

    return this.save();
};

// Método para obter resumo
referralSchema.methods.getSummary = function () {
    return {
        id: this._id,
        referrerId: this.referrerId,
        referredId: this.referredId,
        referralCode: this.referralCode,
        status: this.status,
        rewards: this.rewards,
        completionCriteria: this.completionCriteria,
        expiresAt: this.expiresAt,
        isExpired: this.isExpired,
        isEligibleForReward: this.isEligibleForReward,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

// Método estático para gerar código único
referralSchema.statics.generateReferralCode = function () {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Método estático para obter estatísticas de referrals
referralSchema.statics.getReferralStats = function (userId) {
    return this.aggregate([
        {
            $match: {
                $or: [
                    { referrerId: userId },
                    { referredId: userId }
                ]
            }
        },
        {
            $group: {
                _id: null,
                totalReferrals: { $sum: 1 },
                completedReferrals: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                pendingReferrals: {
                    $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                },
                totalRewardsEarned: {
                    $sum: {
                        $cond: [
                            { $eq: ['$referrerId', userId] },
                            { $cond: ['$rewards.referrerClaimed', '$rewards.referrerReward', 0] },
                            { $cond: ['$rewards.referredClaimed', '$rewards.referredReward', 0] }
                        ]
                    }
                },
                totalRewardsAvailable: {
                    $sum: {
                        $cond: [
                            { $eq: ['$referrerId', userId] },
                            {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$status', 'completed'] },
                                            { $ne: ['$rewards.referrerClaimed', true] },
                                            { $gt: ['$expiresAt', new Date()] }
                                        ]
                                    },
                                    '$rewards.referrerReward',
                                    0
                                ]
                            },
                            {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$status', 'completed'] },
                                            { $ne: ['$rewards.referredClaimed', true] },
                                            { $gt: ['$expiresAt', new Date()] }
                                        ]
                                    },
                                    '$rewards.referredReward',
                                    0
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ]);
};

// Método estático para leaderboard de referrals
referralSchema.statics.getReferralLeaderboard = function (limit = 10) {
    return this.aggregate([
        {
            $match: { status: 'completed' }
        },
        {
            $group: {
                _id: '$referrerId',
                totalReferrals: { $sum: 1 },
                totalRewards: { $sum: '$rewards.referrerReward' },
                lastReferral: { $max: '$createdAt' }
            }
        },
        {
            $sort: { totalReferrals: -1, totalRewards: -1 }
        },
        { $limit: limit }
    ]);
};

module.exports = mongoose.model('Referral', referralSchema);