const Referral = require('../models/Referral');
const LoyaltyService = require('./LoyaltyService');
const LoyaltyConfig = require('../models/LoyaltyConfig');

class ReferralService {

    // Gerar código único de indicação
    static generateReferralCode() {
        return Referral.generateReferralCode();
    }

    // Criar nova indicação
    static async createReferral(referrerId, referredId = null, metadata = {}) {
        const config = await LoyaltyService.getActiveConfig();
        if (!config.referralConfig.enabled) {
            throw new Error('Sistema de indicações não está habilitado');
        }

        // Verificar limite de indicações por usuário
        const existingReferrals = await Referral.countDocuments({
            referrerId,
            status: { $ne: 'cancelled' }
        });

        if (existingReferrals >= config.referralConfig.maxReferralsPerUser) {
            throw new Error('Limite máximo de indicações atingido');
        }

        const referralCode = this.generateReferralCode();

        // Verificar unicidade do código
        let existing = await Referral.findOne({ referralCode });
        let attempts = 0;
        while (existing && attempts < 10) {
            const newCode = this.generateReferralCode();
            existing = await Referral.findOne({ referralCode: newCode });
            if (!existing) {
                referralCode = newCode;
                break;
            }
            attempts++;
        }

        if (existing) {
            throw new Error('Não foi possível gerar código único');
        }

        const referral = new Referral({
            referrerId,
            referredId,
            referralCode,
            metadata
        });

        await referral.save();

        return referral;
    }

    // Vincular indicação a um usuário (quando alguém usa o código)
    static async linkReferral(referralCode, referredId) {
        const referral = await Referral.findOne({
            referralCode,
            status: 'pending'
        });

        if (!referral) {
            throw new Error('Código de indicação inválido ou já utilizado');
        }

        if (referral.referrerId === referredId) {
            throw new Error('Não é possível usar o próprio código de indicação');
        }

        // Verificar se o referido já foi indicado por outra pessoa
        const existingReferral = await Referral.findOne({
            referredId,
            status: { $in: ['pending', 'completed'] }
        });

        if (existingReferral) {
            throw new Error('Usuário já foi indicado por outra pessoa');
        }

        referral.referredId = referredId;
        await referral.save();

        return referral;
    }

    // Obter indicação por código
    static async getReferralByCode(referralCode) {
        return await Referral.findOne({ referralCode });
    }

    // Obter indicações do usuário
    static async getUserReferrals(userId, status = null) {
        const query = {
            $or: [
                { referrerId: userId },
                { referredId: userId }
            ]
        };

        if (status) {
            query.status = status;
        }

        return await Referral.find(query).sort({ createdAt: -1 });
    }

    // Processar conclusão de indicação baseada em eventos
    static async processReferralCompletion(referralId, eventType, eventData = {}) {
        const referral = await Referral.findById(referralId);
        if (!referral || referral.status !== 'pending') {
            return;
        }

        const config = await LoyaltyService.getActiveConfig();
        let shouldComplete = false;

        switch (eventType) {
            case 'registration':
                if (config.referralConfig.requirements.registration) {
                    shouldComplete = true;
                }
                break;

            case 'firstPurchase':
                if (config.referralConfig.requirements.firstPurchase) {
                    shouldComplete = true;
                }
                break;

            case 'firstLoyaltyPoints':
                if (config.referralConfig.requirements.firstLoyaltyPoints) {
                    // Verificar se o usuário já ganhou pontos de fidelidade
                    const profile = await LoyaltyService.getOrCreateUserProfile(referral.referredId);
                    if (profile.totalPoints > 0) {
                        shouldComplete = true;
                    }
                }
                break;

            case 'daysActive':
                if (config.referralConfig.requirements.daysActive > 0) {
                    // TODO: Implementar verificação de dias ativos
                    shouldComplete = true; // Placeholder
                }
                break;
        }

        if (shouldComplete) {
            await LoyaltyService.processReferralCompletion(referralId, eventType);
        }

        return referral;
    }

    // Reivindicar recompensa
    static async claimReward(referralId, userType) {
        return await LoyaltyService.claimReferralReward(referralId, userType);
    }

    // Cancelar indicação
    static async cancelReferral(referralId, reason) {
        const referral = await Referral.findById(referralId);
        if (!referral) {
            throw new Error('Indicação não encontrada');
        }

        await referral.cancelReferral(reason);

        return referral;
    }

    // Obter estatísticas de indicações do usuário
    static async getUserReferralStats(userId) {
        return await Referral.getReferralStats(userId);
    }

    // Obter leaderboard de indicações
    static async getReferralLeaderboard(limit = 10) {
        return await Referral.getReferralLeaderboard(limit);
    }

    // Processar expiração de indicações
    static async processExpiredReferrals() {
        const expiredReferrals = await Referral.find({
            status: 'pending',
            expiresAt: { $lt: new Date() }
        });

        for (const referral of expiredReferrals) {
            await referral.cancelReferral('Expirado');
        }

        return expiredReferrals.length;
    }

    // Gerar link de indicação
    static generateReferralLink(referralCode, baseUrl = process.env.FRONTEND_URL || 'https://app.getnexo.com') {
        return `${baseUrl}/register?ref=${referralCode}`;
    }

    // Validar código de indicação
    static async validateReferralCode(referralCode) {
        const referral = await Referral.findOne({
            referralCode,
            status: 'pending',
            expiresAt: { $gt: new Date() }
        });

        if (!referral) {
            return { valid: false, reason: 'Código inválido ou expirado' };
        }

        return {
            valid: true,
            referral: referral.getSummary()
        };
    }

    // Obter estatísticas globais de indicações
    static async getGlobalReferralStats() {
        const stats = await Referral.aggregate([
            {
                $group: {
                    _id: null,
                    totalReferrals: { $sum: 1 },
                    pendingReferrals: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedReferrals: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    expiredReferrals: {
                        $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
                    },
                    cancelledReferrals: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    },
                    totalRewardsPaid: {
                        $sum: {
                            $add: [
                                { $cond: ['$rewards.referrerClaimed', '$rewards.referrerReward', 0] },
                                { $cond: ['$rewards.referredClaimed', '$rewards.referredReward', 0] }
                            ]
                        }
                    }
                }
            }
        ]);

        return stats.length > 0 ? stats[0] : {
            totalReferrals: 0,
            pendingReferrals: 0,
            completedReferrals: 0,
            expiredReferrals: 0,
            cancelledReferrals: 0,
            totalRewardsPaid: 0
        };
    }

    // Enviar notificação de indicação completada
    static async sendReferralNotification(referralId, notificationType = 'referral_completed') {
        const referral = await Referral.findById(referralId);
        if (!referral || referral.status !== 'completed') {
            return;
        }

        const config = await LoyaltyService.getActiveConfig();

        // Notificar indicador
        if (config.notifications.referralCompleted.email || config.notifications.referralCompleted.whatsapp) {
            // TODO: Implementar envio de notificações por email/WhatsApp
            console.log(`Notificação de indicação enviada para ${referral.referrerId}`);
        }

        // Notificar indicado
        if (config.notifications.referralCompleted.email || config.notifications.referralCompleted.whatsapp) {
            console.log(`Notificação de boas-vindas enviada para ${referral.referredId}`);
        }
    }

    // Integrar com sistema de templates de vendas
    static async triggerReferralTemplates(referralId, eventType) {
        const referral = await Referral.findById(referralId);
        if (!referral) return;

        const SalesTemplateService = require('./SalesTemplateService');

        // Buscar templates relacionados a indicações
        const templates = await SalesTemplateService.find({
            category: 'referral',
            isActive: true,
            'triggers.event': eventType
        });

        for (const template of templates) {
            try {
                const targetUser = eventType === 'referral_completed' ? referral.referrerId : referral.referredId;
                await SalesTemplateService.executeTemplate(
                    template._id,
                    targetUser,
                    { referral },
                    'whatsapp'
                );
            } catch (error) {
                console.error(`Erro ao executar template de indicação ${template._id}:`, error);
            }
        }
    }

    // Método auxiliar para encontrar SalesTemplate (placeholder - implementar conforme necessário)
    static async find(query) {
        // Placeholder - implementar busca real de templates
        return [];
    }
}

module.exports = ReferralService;