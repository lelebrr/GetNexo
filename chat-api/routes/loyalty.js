const express = require('express');
const router = express.Router();
const LoyaltyService = require('../services/LoyaltyService');
const ReferralService = require('../services/ReferralService');
const LoyaltyConfig = require('../models/LoyaltyConfig');
const LoyaltyTier = require('../models/LoyaltyTier');

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    // Global middleware verifies JWT and sets req.user
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    req.userId = req.user.id;
    next();
};

// Middleware para verificar permissões admin
const requireAdmin = (req, res, next) => {
    // Verifica permissões baseadas no token JWT
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin' || req.user.role_id === 1);
    if (!isAdmin) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
};

// === ROTAS PÚBLICAS ===

// Validar código de indicação
router.get('/referral/validate/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const result = await ReferralService.validateReferralCode(code);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Gerar link de indicação
router.get('/referral/link/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const referral = await ReferralService.getReferralByCode(code);
        if (!referral) {
            return res.status(404).json({ error: 'Código não encontrado' });
        }

        const link = ReferralService.generateReferralLink(code);
        res.json({ link, referral: referral.getSummary() });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// === ROTAS AUTENTICADAS ===

// Obter resumo completo de fidelidade do usuário
router.get('/summary', requireAuth, async (req, res) => {
    try {
        const summary = await LoyaltyService.getUserSummary(req.userId);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter perfil de pontos
router.get('/points', requireAuth, async (req, res) => {
    try {
        const profile = await LoyaltyService.getOrCreateUserProfile(req.userId);
        res.json(profile.getSummary());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Adicionar pontos (para testes/admin)
router.post('/points/add', requireAuth, async (req, res) => {
    try {
        const { amount, reason, gameType, metadata } = req.body;
        const profile = await LoyaltyService.addPoints(req.userId, amount, reason, gameType, metadata);
        res.json(profile.getSummary());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Gastar pontos
router.post('/points/spend', requireAuth, async (req, res) => {
    try {
        const { amount, reason, orderId, metadata } = req.body;
        const profile = await LoyaltyService.spendPoints(req.userId, amount, reason, orderId, metadata);
        res.json(profile.getSummary());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// === LOGIN DIÁRIO ===

// Processar login diário
router.post('/daily-login', requireAuth, async (req, res) => {
    try {
        const result = await LoyaltyService.processDailyLogin(req.userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter status de login diário
router.get('/daily-login/status', requireAuth, async (req, res) => {
    try {
        const dailyLogin = await LoyaltyService.getOrCreateUserProfile(req.userId);
        // TODO: Obter dados específicos de daily login
        res.json({ message: 'Endpoint em desenvolvimento' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === SISTEMA DE INDICAÇÕES ===

// Criar código de indicação
router.post('/referral/create', requireAuth, async (req, res) => {
    try {
        const referral = await ReferralService.createReferral(req.userId);
        res.json(referral.getSummary());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Vincular indicação
router.post('/referral/link', requireAuth, async (req, res) => {
    try {
        const { referralCode } = req.body;
        const referral = await ReferralService.linkReferral(referralCode, req.userId);
        res.json(referral.getSummary());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter indicações do usuário
router.get('/referral', requireAuth, async (req, res) => {
    try {
        const { status } = req.query;
        const referrals = await ReferralService.getUserReferrals(req.userId, status);
        res.json(referrals.map(r => r.getSummary()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reivindicar recompensa de indicação
router.post('/referral/claim/:referralId', requireAuth, async (req, res) => {
    try {
        const { referralId } = req.params;
        const { userType } = req.body; // 'referrer' ou 'referred'

        const referral = await ReferralService.claimReward(referralId, userType);

        // Verificar se o usuário tem permissão
        if (userType === 'referrer' && referral.referrerId !== req.userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        if (userType === 'referred' && referral.referredId !== req.userId) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json(referral.getSummary());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter estatísticas de indicações do usuário
router.get('/referral/stats', requireAuth, async (req, res) => {
    try {
        const stats = await ReferralService.getUserReferralStats(req.userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === TIERS DE FIDELIDADE ===

// Obter tier atual do usuário
router.get('/tier', requireAuth, async (req, res) => {
    try {
        const tier = await LoyaltyService.getUserTier(req.userId);
        const progress = await LoyaltyService.getTierProgress(req.userId);

        res.json({
            currentTier: tier ? {
                name: tier.name,
                displayName: tier.displayName,
                level: tier.level,
                benefits: tier.benefits,
                rewards: tier.rewards
            } : null,
            progress
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter todos tiers ativos
router.get('/tiers', async (req, res) => {
    try {
        const tiers = await LoyaltyTier.getActiveTiers();
        res.json(tiers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === LEADERBOARDS ===

// Leaderboard de pontos
router.get('/leaderboard/points', async (req, res) => {
    try {
        const { limit = 10, period } = req.query;
        const leaderboard = await LoyaltyService.getPointsLeaderboard(parseInt(limit), period);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leaderboard de logins diários
router.get('/leaderboard/daily-logins', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const leaderboard = await LoyaltyService.getDailyLoginLeaderboard(parseInt(limit));
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leaderboard de indicações
router.get('/leaderboard/referrals', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const leaderboard = await ReferralService.getReferralLeaderboard(parseInt(limit));
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === ROTAS ADMIN ===

// Obter estatísticas globais
router.get('/admin/stats', requireAdmin, async (req, res) => {
    try {
        const stats = await LoyaltyService.getGlobalStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gerenciar configuração de fidelidade
router.get('/admin/config', requireAdmin, async (req, res) => {
    try {
        const config = await LoyaltyService.getActiveConfig();
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/admin/config', requireAdmin, async (req, res) => {
    try {
        const updates = req.body;
        const config = await LoyaltyService.getActiveConfig();

        // Aplicar atualizações
        Object.assign(config, updates);
        config.logChange('update', 'config', config.toObject(), updates, req.userId || 'admin');

        await config.save();
        res.json(config);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Gerenciar tiers
router.get('/admin/tiers', requireAdmin, async (req, res) => {
    try {
        const tiers = await LoyaltyTier.find({}).sort({ order: 1 });
        res.json(tiers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/admin/tiers', requireAdmin, async (req, res) => {
    try {
        const tierData = req.body;
        const tier = new LoyaltyTier(tierData);
        await tier.save();
        res.json(tier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/admin/tiers/:tierId', requireAdmin, async (req, res) => {
    try {
        const { tierId } = req.params;
        const updates = req.body;

        const tier = await LoyaltyTier.findByIdAndUpdate(tierId, updates, { new: true });
        if (!tier) {
            return res.status(404).json({ error: 'Tier não encontrado' });
        }

        res.json(tier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/admin/tiers/:tierId', requireAdmin, async (req, res) => {
    try {
        const { tierId } = req.params;
        await LoyaltyTier.findByIdAndDelete(tierId);
        res.json({ message: 'Tier removido com sucesso' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Processar tarefas agendadas (para ser chamado por cron)
router.post('/admin/process-expired', requireAdmin, async (req, res) => {
    try {
        await LoyaltyService.processExpiredPoints();
        const expiredReferrals = await ReferralService.processExpiredReferrals();

        res.json({
            message: 'Processamento concluído',
            expiredReferrals
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/admin/process-monthly-bonuses', requireAdmin, async (req, res) => {
    try {
        await LoyaltyService.processMonthlyTierBonuses();
        res.json({ message: 'Bônus mensais processados com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard de retenção de cliente
router.get('/admin/retention-dashboard', requireAdmin, async (req, res) => {
    try {
        const { months = 12 } = req.query;
        const dashboard = await LoyaltyService.getRetentionDashboard({ months: parseInt(months) });
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;