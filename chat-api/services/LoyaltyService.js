const LoyaltyPoints = require('../models/LoyaltyPoints');
const DailyLogin = require('../models/DailyLogin');
const Referral = require('../models/Referral');
const LoyaltyTier = require('../models/LoyaltyTier');
const LoyaltyConfig = require('../models/LoyaltyConfig');
const ERPIntegrationService = require('./ERPIntegrationService');

class LoyaltyService {

    // Obter configuração ativa
    static async getActiveConfig() {
        return await LoyaltyConfig.getActiveConfig();
    }

    // Criar ou obter perfil de fidelidade do usuário
    static async getOrCreateUserProfile(userId) {
        let profile = await LoyaltyPoints.findOne({ userId });
        if (!profile) {
            profile = new LoyaltyPoints({ userId });
            await profile.save();
        }
        return profile;
    }

    // Adicionar pontos ao usuário
    static async addPoints(userId, amount, reason, gameType = null, metadata = {}) {
        const config = await this.getActiveConfig();
        const profile = await this.getOrCreateUserProfile(userId);

        // Aplicar multiplicadores da configuração
        let finalAmount = amount;
        if (metadata.category) {
            finalAmount *= config.getCurrentMultiplier(metadata.category);
        }

        // Verificar limites
        if (!config.checkLimits(userId, finalAmount)) {
            throw new Error('Limite de pontos excedido');
        }

        await profile.addPoints(finalAmount, reason, gameType, metadata);

        // Sincronizar com ERP se configurado
        if (config.integrations.erpEnabled) {
            await this.syncPointsWithERP(userId, profile);
        }

        return profile;
    }

    // Gastar pontos
    static async spendPoints(userId, amount, reason, orderId = null, metadata = {}) {
        const profile = await this.getOrCreateUserProfile(userId);

        await profile.spendPoints(amount, reason, orderId, metadata);

        // Sincronizar com ERP
        const config = await this.getActiveConfig();
        if (config.integrations.erpEnabled) {
            await this.syncPointsWithERP(userId, profile);
        }

        return profile;
    }

    // Processar login diário
    static async processDailyLogin(userId) {
        const config = await this.getActiveConfig();
        if (!config.dailyLoginConfig.enabled) {
            throw new Error('Login diário não está habilitado');
        }

        let dailyLogin = await DailyLogin.findOne({ userId });
        if (!dailyLogin) {
            dailyLogin = new DailyLogin({ userId });
        }

        if (!dailyLogin.canLoginToday) {
            throw new Error('Não é possível realizar login hoje');
        }

        // Calcular pontos baseado no dia
        const dayInSequence = dailyLogin.nextDayInSequence;
        const dayReward = config.dailyLoginConfig.rewards.find(r => r.day === dayInSequence);
        const pointsToAdd = dayReward ? dayReward.points : 10; // fallback

        // Verificar se é bônus de ciclo completo
        let isBonus = false;
        let bonusPoints = 0;
        if (dayInSequence === config.dailyLoginConfig.maxStreak) {
            isBonus = true;
            bonusPoints = config.dailyLoginConfig.bonusCycleReward.points;
        }

        await dailyLogin.recordDailyLogin(pointsToAdd, isBonus);

        // Adicionar pontos ao perfil
        const totalPoints = pointsToAdd + (isBonus ? bonusPoints : 0);
        await this.addPoints(userId, totalPoints, `Login diário - Dia ${dayInSequence}`, null, {
            type: 'daily_login',
            day: dayInSequence,
            bonus: isBonus
        });

        return {
            dailyLogin,
            pointsEarned: totalPoints,
            dayInSequence,
            isBonus
        };
    }

    // Criar referral
    static async createReferral(referrerId, referralCode, referredId = null, metadata = {}) {
        const config = await this.getActiveConfig();
        if (!config.referralConfig.enabled) {
            throw new Error('Sistema de indicações não está habilitado');
        }

        // Verificar limites
        const existingReferrals = await Referral.countDocuments({
            referrerId,
            status: { $ne: 'cancelled' }
        });

        if (existingReferrals >= config.referralConfig.maxReferralsPerUser) {
            throw new Error('Limite máximo de indicações atingido');
        }

        const referral = new Referral({
            referrerId,
            referralCode,
            referredId,
            metadata
        });

        await referral.save();

        return referral;
    }

    // Processar completion de referral
    static async processReferralCompletion(referralId, criteriaType) {
        const referral = await Referral.findById(referralId);
        if (!referral) {
            throw new Error('Indicação não encontrada');
        }

        await referral.completeReferral(criteriaType);

        if (referral.status === 'completed') {
            const config = await this.getActiveConfig();

            // Adicionar pontos para o indicador
            await this.addPoints(referral.referrerId, config.referralConfig.referrerReward,
                `Indicação completada - ${referral.referredId}`, null, {
                type: 'referral',
                referralId: referral._id,
                role: 'referrer'
            });

            // Adicionar pontos para o indicado (se ainda não recebeu)
            if (!referral.rewards.referredClaimed) {
                await this.addPoints(referral.referredId, config.referralConfig.referredReward,
                    `Bem-vindo! Indicação aceita`, null, {
                    type: 'referral',
                    referralId: referral._id,
                    role: 'referred'
                });
            }
        }

        return referral;
    }

    // Reivindicar recompensa de referral
    static async claimReferralReward(referralId, userType) {
        const referral = await Referral.findById(referralId);
        if (!referral) {
            throw new Error('Indicação não encontrada');
        }

        await referral.claimReward(userType);

        // Adicionar pontos se ainda não foram adicionados
        const config = await this.getActiveConfig();
        if (userType === 'referrer' && !referral.rewards.referrerClaimed) {
            await this.addPoints(referral.referrerId, config.referralConfig.referrerReward,
                `Recompensa de indicação`, null, {
                type: 'referral_claim',
                referralId: referral._id
            });
        } else if (userType === 'referred' && !referral.rewards.referredClaimed) {
            await this.addPoints(referral.referredId, config.referralConfig.referredReward,
                `Recompensa de indicação`, null, {
                type: 'referral_claim',
                referralId: referral._id
            });
        }

        return referral;
    }

    // Obter tier apropriado para o usuário
    static async getUserTier(userId) {
        const profile = await this.getOrCreateUserProfile(userId);
        const userStats = await this.getUserStats(userId);

        const tier = await LoyaltyTier.findAppropriateTier(profile.totalPoints, userStats);
        return tier;
    }

    // Obter estatísticas do usuário
    static async getUserStats(userId) {
        const profile = await this.getOrCreateUserProfile(userId);

        // Buscar dados adicionais
        const referrals = await Referral.find({
            $or: [{ referrerId: userId }, { referredId: userId }],
            status: 'completed'
        });

        const referralCount = referrals.filter(r => r.referrerId === userId).length;

        // TODO: Buscar dados de compras do ERP
        const totalSpent = 0; // Placeholder
        const purchaseCount = 0; // Placeholder
        const daysActive = 0; // Placeholder - calcular baseado em atividade

        return {
            totalSpent,
            referralCount,
            daysActive,
            purchaseCount,
            currentPoints: profile.totalPoints
        };
    }

    // Obter progresso para próximo tier
    static async getTierProgress(userId) {
        const profile = await this.getOrCreateUserProfile(userId);
        const currentTier = await this.getUserTier(userId);

        const nextTier = await LoyaltyTier.findOne({
            level: currentTier.level + 1,
            isActive: true
        }).sort({ level: 1 });

        if (!nextTier) return null;

        return currentTier.getProgressToNext(profile.totalPoints, nextTier);
    }

    // Sincronizar pontos com ERP
    static async syncPointsWithERP(userId, profile = null) {
        const config = await this.getActiveConfig();
        if (!config.integrations.erpEnabled || !config.integrations.erpConfig.endpoint) return;

        if (!profile) {
            profile = await this.getOrCreateUserProfile(userId);
        }

        try {
            const ERPIntegrationService = require('./ERPIntegrationService');
            const erpConfig = {
                type: config.integrations.erpConfig.type || 'custom',
                credentials: config.integrations.erpConfig,
                baseUrl: config.integrations.erpConfig.endpoint
            };

            const pointsData = {
                totalPoints: profile.totalPoints,
                availablePoints: profile.availablePoints,
                level: profile.level,
                levelName: profile.levelName,
                lastActivity: profile.stats.lastActivity,
                transactions: profile.transactions.slice(-10) // últimas 10 transações
            };

            const result = await ERPIntegrationService.syncLoyaltyPoints(erpConfig, userId, pointsData);

            if (result.success) {
                config.integrations.erpConfig.lastSync = new Date();
                await config.save();
                console.log(`Pontos sincronizados com sucesso para usuário ${userId}`);
            } else {
                console.error('Falha na sincronização com ERP:', result);
            }
        } catch (error) {
            console.error('Erro ao sincronizar pontos com ERP:', error);
        }
    }

    // Obter leaderboard de pontos
    static async getPointsLeaderboard(limit = 10, period = null) {
        return await LoyaltyPoints.getLeaderboard(limit, period);
    }

    // Obter leaderboard de logins diários
    static async getDailyLoginLeaderboard(limit = 10) {
        return await DailyLogin.getStreakLeaderboard(limit);
    }

    // Obter leaderboard de indicações
    static async getReferralLeaderboard(limit = 10) {
        return await Referral.getReferralLeaderboard(limit);
    }

    // Obter estatísticas globais
    static async getGlobalStats() {
        const pointsStats = await LoyaltyPoints.getGlobalStats();

        const referralStats = await Referral.aggregate([
            {
                $group: {
                    _id: null,
                    totalReferrals: { $sum: 1 },
                    completedReferrals: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    totalRewards: { $sum: '$rewards.referrerReward' }
                }
            }
        ]);

        const dailyLoginStats = await DailyLogin.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    avgStreak: { $avg: '$currentStreak' },
                    maxStreak: { $max: '$longestStreak' },
                    totalLogins: { $sum: '$stats.totalLogins' }
                }
            }
        ]);

        return {
            points: pointsStats.length > 0 ? pointsStats[0] : {},
            referrals: referralStats.length > 0 ? referralStats[0] : {},
            dailyLogins: dailyLoginStats.length > 0 ? dailyLoginStats[0] : {}
        };
    }

    // Obter dashboard de retenção de cliente
    static async getRetentionDashboard(period = { months: 12 }) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - period.months);

        // Usuários ativos (com atividade nos últimos 30 dias)
        const activeUsers = await LoyaltyPoints.countDocuments({
            'stats.lastActivity': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        // Usuários inativos (sem atividade há mais de 30 dias)
        const inactiveUsers = await LoyaltyPoints.countDocuments({
            'stats.lastActivity': { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        // Taxa de retenção mensal (usuários que retornaram)
        const monthlyRetention = await this.calculateMonthlyRetention(period.months);

        // Churn rate (taxa de cancelamento/evasão)
        const churnRate = inactiveUsers / (activeUsers + inactiveUsers) * 100;

        // Segmentação por tier
        const tierDistribution = await LoyaltyTier.aggregate([
            {
                $lookup: {
                    from: 'loyaltypoints',
                    localField: '_id',
                    foreignField: 'level', // Ajustar conforme necessário
                    as: 'users'
                }
            },
            {
                $project: {
                    name: 1,
                    displayName: 1,
                    userCount: { $size: '$users' },
                    avgPoints: { $avg: '$users.totalPoints' }
                }
            }
        ]);

        // Atividade diária média
        const dailyActivity = await DailyLogin.aggregate([
            {
                $match: {
                    lastLoginDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$lastLoginDate' }
                    },
                    activeUsers: { $sum: 1 },
                    totalLogins: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            },
            {
                $group: {
                    _id: null,
                    dailyData: {
                        $push: {
                            date: '$_id',
                            activeUsers: '$activeUsers',
                            totalLogins: '$totalLogins'
                        }
                    },
                    avgDailyActive: { $avg: '$activeUsers' },
                    totalDays: { $sum: 1 }
                }
            }
        ]);

        // Lifetime Value estimado baseado em pontos
        const lifetimeValue = await LoyaltyPoints.aggregate([
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: '$totalPoints' },
                    totalUsers: { $sum: 1 },
                    avgPointsPerUser: { $avg: '$totalPoints' }
                }
            }
        ]);

        // Previsão de retenção (simples baseada em tendência)
        const retentionPrediction = this.predictRetention(monthlyRetention);

        return {
            overview: {
                activeUsers,
                inactiveUsers,
                totalUsers: activeUsers + inactiveUsers,
                churnRate: Math.round(churnRate * 100) / 100,
                retentionRate: Math.round((100 - churnRate) * 100) / 100
            },
            monthlyRetention,
            tierDistribution,
            dailyActivity: dailyActivity.length > 0 ? dailyActivity[0] : { dailyData: [], avgDailyActive: 0 },
            lifetimeValue: lifetimeValue.length > 0 ? lifetimeValue[0] : {},
            retentionPrediction,
            period,
            generated_at: new Date().toISOString()
        };
    }

    // Calcular retenção mensal
    static async calculateMonthlyRetention(months) {
        const retentionData = [];

        for (let i = months - 1; i >= 0; i--) {
            const targetMonth = new Date();
            targetMonth.setMonth(targetMonth.getMonth() - i);

            const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
            const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

            // Usuários que estavam ativos no mês anterior
            const prevMonthEnd = new Date(monthStart);
            prevMonthEnd.setDate(prevMonthEnd.getDate() - 1);

            const cohortUsers = await LoyaltyPoints.find({
                'stats.firstActivity': { $lte: prevMonthEnd },
                'stats.lastActivity': { $gte: new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), 1) }
            }).countDocuments();

            // Usuários que retornaram neste mês
            const retainedUsers = await LoyaltyPoints.find({
                'stats.firstActivity': { $lte: prevMonthEnd },
                'stats.lastActivity': { $gte: monthStart, $lte: monthEnd }
            }).countDocuments();

            const retentionRate = cohortUsers > 0 ? (retainedUsers / cohortUsers) * 100 : 0;

            retentionData.push({
                month: targetMonth.toISOString().slice(0, 7),
                cohortUsers,
                retainedUsers,
                retentionRate: Math.round(retentionRate * 100) / 100
            });
        }

        return retentionData;
    }

    // Previsão simples de retenção baseada em tendência
    static predictRetention(historicalData) {
        if (historicalData.length < 3) return null;

        // Calcular tendência linear simples
        const recent = historicalData.slice(-3);
        const avgRetention = recent.reduce((sum, item) => sum + item.retentionRate, 0) / recent.length;

        // Projeção para os próximos 3 meses com leve declínio natural
        const projection = [];
        for (let i = 1; i <= 3; i++) {
            const projectedRate = Math.max(0, avgRetention - (i * 2)); // Declínio de 2% por mês
            projection.push({
                month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
                projectedRate: Math.round(projectedRate * 100) / 100
            });
        }

        return {
            currentTrend: avgRetention > historicalData[0].retentionRate ? 'improving' : 'declining',
            projectedRetention: projection,
            confidence: 0.75
        };
    }

    // Processar expiração de pontos
    static async processExpiredPoints() {
        const profiles = await LoyaltyPoints.find({ 'stats.lastActivity': { $exists: true } });

        for (const profile of profiles) {
            await profile.expirePoints();
        }
    }

    // Processar bônus mensais de tiers
    static async processMonthlyTierBonuses() {
        const config = await this.getActiveConfig();
        if (!config.tierConfig.monthlyBonuses) return;

        const tiers = await LoyaltyTier.find({ isActive: true });
        const usersByTier = {};

        // Agrupar usuários por tier
        for (const tier of tiers) {
            const users = await LoyaltyPoints.find({
                totalPoints: { $gte: tier.minPoints, $lte: tier.maxPoints || Infinity }
            }).select('userId');

            usersByTier[tier._id] = users.map(u => u.userId);
        }

        // Distribuir bônus
        for (const [tierId, userIds] of Object.entries(usersByTier)) {
            const tier = tiers.find(t => t._id.toString() === tierId);
            if (tier.rewards.monthlyBonus > 0) {
                for (const userId of userIds) {
                    try {
                        await this.addPoints(userId, tier.rewards.monthlyBonus,
                            `Bônus mensal - Tier ${tier.displayName}`, null, {
                            type: 'monthly_bonus',
                            tier: tier.name
                        });
                    } catch (error) {
                        console.error(`Erro ao distribuir bônus mensal para usuário ${userId}:`, error);
                    }
                }
            }
        }
    }

    // Obter resumo completo do usuário
    static async getUserSummary(userId) {
        const profile = await this.getOrCreateUserProfile(userId);
        const dailyLogin = await DailyLogin.findOne({ userId });
        const tier = await this.getUserTier(userId);
        const tierProgress = await this.getTierProgress(userId);
        const referralStats = await Referral.getReferralStats(userId);
        const config = await this.getActiveConfig();

        return {
            profile: profile.getSummary(),
            dailyLogin: dailyLogin ? dailyLogin.getCurrentProgress() : null,
            tier: tier ? {
                name: tier.name,
                displayName: tier.displayName,
                level: tier.level,
                benefits: tier.benefits
            } : null,
            tierProgress,
            referralStats,
            config: {
                dailyLoginEnabled: config.dailyLoginConfig.enabled,
                referralEnabled: config.referralConfig.enabled,
                tierEnabled: config.tierConfig.enabled
            }
        };
    }
}

module.exports = LoyaltyService;