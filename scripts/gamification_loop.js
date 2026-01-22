#!/usr/bin/env node
/**
 * GetNexo Gamification Loop - Sistema de Pontos e Recompensas
 * Backend de gamificação para equipe e administração
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

class GamificationLoop extends EventEmitter {
    constructor() {
        super();
        this.pointsDb = 'data/gamification_points.json';
        this.achievementsDb = 'data/gamification_achievements.json';
        this.leaderboardDb = 'data/gamification_leaderboard.json';

        // Sistema de pontos
        this.pointSystem = {
            // Ações básicas
            login: 5,
            message_sent: 1,
            ticket_closed: 10,
            customer_satisfaction_high: 25,
            deploy_successful: 50,
            bug_fixed: 30,
            feature_implemented: 100,

            // Bônus por streaks
            daily_login_streak: 10, // por dia consecutivo
            weekly_goal_achieved: 50,
            monthly_champion: 200,

            // Penalizações
            ticket_reopened: -5,
            deploy_failed: -20,
            customer_complaint: -10
        };

        // Conquistas (achievements)
        this.achievements = {
            first_login: { name: 'Primeiro Login', points: 10, icon: '🎯' },
            ticket_master: { name: 'Mestre dos Tickets', points: 50, requirement: 10, icon: '🎫' },
            deploy_hero: { name: 'Herói do Deploy', points: 100, requirement: 5, icon: '🚀' },
            satisfaction_guru: { name: 'Guru da Satisfação', points: 75, requirement: 20, icon: '⭐' },
            streak_master: { name: 'Mestre das Sequências', points: 150, requirement: 30, icon: '🔥' },
            bug_hunter: { name: 'Caçador de Bugs', points: 60, requirement: 15, icon: '🐛' }
        };

        // Rankings e níveis
        this.levels = [
            { name: 'Novato', minPoints: 0, multiplier: 1.0 },
            { name: 'Iniciante', minPoints: 100, multiplier: 1.1 },
            { name: 'Intermediário', minPoints: 500, multiplier: 1.2 },
            { name: 'Avançado', minPoints: 1500, multiplier: 1.3 },
            { name: 'Especialista', minPoints: 3000, multiplier: 1.4 },
            { name: 'Mestre', minPoints: 5000, multiplier: 1.5 },
            { name: 'Lenda', minPoints: 7500, multiplier: 1.6 },
            { name: 'Mítico', minPoints: 10000, multiplier: 1.7 }
        ];

        // Cache de dados
        this.pointsData = {};
        this.achievementsData = {};
        this.leaderboardData = {};

        this.loadData();
    }

    async loadData() {
        try {
            // Carregar pontos
            if (await this.fileExists(this.pointsDb)) {
                const data = await fs.readFile(this.pointsDb, 'utf8');
                this.pointsData = JSON.parse(data);
            }

            // Carregar conquistas
            if (await this.fileExists(this.achievementsDb)) {
                const data = await fs.readFile(this.achievementsDb, 'utf8');
                this.achievementsData = JSON.parse(data);
            }

            // Carregar leaderboard
            if (await this.fileExists(this.leaderboardDb)) {
                const data = await fs.readFile(this.leaderboardDb, 'utf8');
                this.leaderboardData = JSON.parse(data);
            }

            console.log('🎮 Dados de gamificação carregados');

        } catch (error) {
            console.error('❌ Erro ao carregar dados de gamificação:', error.message);
        }
    }

    async saveData() {
        try {
            await fs.mkdir(path.dirname(this.pointsDb), { recursive: true });

            await fs.writeFile(this.pointsDb, JSON.stringify(this.pointsData, null, 2));
            await fs.writeFile(this.achievementsDb, JSON.stringify(this.achievementsData, null, 2));
            await fs.writeFile(this.leaderboardDb, JSON.stringify(this.leaderboardData, null, 2));

        } catch (error) {
            console.error('❌ Erro ao salvar dados de gamificação:', error.message);
        }
    }

    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    getUserProfile(userId) {
        if (!this.pointsData[userId]) {
            this.pointsData[userId] = {
                totalPoints: 0,
                level: 1,
                currentLevelPoints: 0,
                nextLevelPoints: 100,
                achievements: [],
                stats: {
                    logins: 0,
                    ticketsClosed: 0,
                    deploys: 0,
                    bugsFixed: 0,
                    lastLogin: null,
                    loginStreak: 0,
                    longestStreak: 0
                },
                history: []
            };
        }
        return this.pointsData[userId];
    }

    calculateLevel(points) {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (points >= this.levels[i].minPoints) {
                const currentLevel = i + 1;
                const currentLevelMin = this.levels[i].minPoints;
                const nextLevelMin = i < this.levels.length - 1 ? this.levels[i + 1].minPoints : this.levels[i].minPoints + 5000;

                return {
                    level: currentLevel,
                    name: this.levels[i].name,
                    currentLevelPoints: points - currentLevelMin,
                    nextLevelPoints: nextLevelMin - currentLevelMin,
                    progress: ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100,
                    multiplier: this.levels[i].multiplier
                };
            }
        }
        return { level: 1, name: 'Novato', currentLevelPoints: 0, nextLevelPoints: 100, progress: 0, multiplier: 1.0 };
    }

    async awardPoints(userId, action, metadata = {}) {
        const points = this.pointSystem[action];
        if (!points) {
            console.warn(`⚠️ Ação desconhecida: ${action}`);
            return 0;
        }

        const profile = this.getUserProfile(userId);

        // Aplicar multiplicador de nível
        const levelInfo = this.calculateLevel(profile.totalPoints);
        const actualPoints = Math.round(points * levelInfo.multiplier);

        // Registrar ação
        const actionRecord = {
            timestamp: new Date().toISOString(),
            action,
            basePoints: points,
            actualPoints,
            multiplier: levelInfo.multiplier,
            metadata
        };

        profile.history.push(actionRecord);
        profile.totalPoints += actualPoints;

        // Atualizar estatísticas específicas
        this.updateStats(profile, action, metadata);

        // Verificar conquistas
        await this.checkAchievements(userId);

        // Atualizar leaderboard
        this.updateLeaderboard();

        // Salvar dados
        await this.saveData();

        // Emitir evento
        this.emit('pointsAwarded', { userId, action, points: actualPoints, total: profile.totalPoints });

        console.log(`🎮 ${userId} ganhou ${actualPoints} pontos por ${action} (total: ${profile.totalPoints})`);

        return actualPoints;
    }

    updateStats(profile, action, metadata) {
        switch (action) {
            case 'login':
                profile.stats.logins++;
                profile.stats.lastLogin = new Date().toISOString();

                // Calcular streak de login
                const today = new Date().toDateString();
                const lastLogin = profile.stats.lastLogin ? new Date(profile.stats.lastLogin).toDateString() : null;

                if (lastLogin === today) {
                    // Já logou hoje, não incrementar streak
                } else if (lastLogin && this.isConsecutiveDay(lastLogin, today)) {
                    profile.stats.loginStreak++;
                } else {
                    profile.stats.loginStreak = 1;
                }

                profile.stats.longestStreak = Math.max(profile.stats.longestStreak, profile.stats.loginStreak);
                break;

            case 'ticket_closed':
                profile.stats.ticketsClosed++;
                break;

            case 'deploy_successful':
                profile.stats.deploys++;
                break;

            case 'bug_fixed':
                profile.stats.bugsFixed++;
                break;
        }
    }

    isConsecutiveDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    async checkAchievements(userId) {
        const profile = this.getUserProfile(userId);
        const userAchievements = profile.achievements || [];

        for (const [achievementId, achievement] of Object.entries(this.achievements)) {
            if (userAchievements.includes(achievementId)) continue;

            let unlocked = false;

            switch (achievementId) {
                case 'first_login':
                    unlocked = profile.stats.logins >= 1;
                    break;
                case 'ticket_master':
                    unlocked = profile.stats.ticketsClosed >= achievement.requirement;
                    break;
                case 'deploy_hero':
                    unlocked = profile.stats.deploys >= achievement.requirement;
                    break;
                case 'bug_hunter':
                    unlocked = profile.stats.bugsFixed >= achievement.requirement;
                    break;
                case 'streak_master':
                    unlocked = profile.stats.longestStreak >= achievement.requirement;
                    break;
                case 'satisfaction_guru':
                    // Esta seria baseada em feedback de clientes
                    unlocked = profile.stats.customerSatisfaction >= achievement.requirement;
                    break;
            }

            if (unlocked) {
                userAchievements.push(achievementId);
                profile.totalPoints += achievement.points;

                // Registrar conquista
                if (!this.achievementsData[userId]) {
                    this.achievementsData[userId] = [];
                }
                this.achievementsData[userId].push({
                    achievement: achievementId,
                    unlockedAt: new Date().toISOString(),
                    points: achievement.points
                });

                this.emit('achievementUnlocked', { userId, achievement: achievementId, points: achievement.points });
                console.log(`🏆 ${userId} desbloqueou conquista: ${achievement.name} (+${achievement.points} pontos)`);
            }
        }

        profile.achievements = userAchievements;
    }

    updateLeaderboard() {
        const users = Object.entries(this.pointsData)
            .map(([userId, profile]) => ({
                userId,
                totalPoints: profile.totalPoints,
                level: this.calculateLevel(profile.totalPoints).level,
                achievements: profile.achievements?.length || 0
            }))
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, 100); // Top 100

        this.leaderboardData = {
            updated: new Date().toISOString(),
            topUsers: users
        };
    }

    getLeaderboard(limit = 10) {
        return this.leaderboardData.topUsers?.slice(0, limit) || [];
    }

    getUserRank(userId) {
        const leaderboard = this.leaderboardData.topUsers || [];
        const userIndex = leaderboard.findIndex(user => user.userId === userId);
        return userIndex >= 0 ? userIndex + 1 : null;
    }

    getUserStats(userId) {
        const profile = this.getUserProfile(userId);
        const levelInfo = this.calculateLevel(profile.totalPoints);
        const rank = this.getUserRank(userId);

        return {
            userId,
            totalPoints: profile.totalPoints,
            level: levelInfo,
            rank,
            achievements: profile.achievements || [],
            stats: profile.stats,
            recentActions: profile.history.slice(-10) // Últimas 10 ações
        };
    }

    getGlobalStats() {
        const users = Object.values(this.pointsData);
        const totalUsers = users.length;
        const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0);
        const avgPoints = totalUsers > 0 ? totalPoints / totalUsers : 0;

        const levelDistribution = {};
        users.forEach(user => {
            const level = this.calculateLevel(user.totalPoints).level;
            levelDistribution[level] = (levelDistribution[level] || 0) + 1;
        });

        return {
            totalUsers,
            totalPoints,
            avgPoints: Math.round(avgPoints),
            levelDistribution,
            topAchievements: this.getMostCommonAchievements()
        };
    }

    getMostCommonAchievements() {
        const achievementCounts = {};

        Object.values(this.pointsData).forEach(profile => {
            (profile.achievements || []).forEach(achievement => {
                achievementCounts[achievement] = (achievementCounts[achievement] || 0) + 1;
            });
        });

        return Object.entries(achievementCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([achievement, count]) => ({ achievement, count }));
    }

    // Método para teste/simulação
    async simulateActivity(userId, days = 7) {
        console.log(`🎮 Simulando atividade para ${userId} por ${days} dias...`);

        const actions = ['login', 'ticket_closed', 'bug_fixed', 'deploy_successful'];

        for (let day = 0; day < days; day++) {
            // Login diário
            await this.awardPoints(userId, 'login');

            // Ações aleatórias
            const numActions = Math.floor(Math.random() * 5) + 1;
            for (let i = 0; i < numActions; i++) {
                const action = actions[Math.floor(Math.random() * actions.length)];
                await this.awardPoints(userId, action);
            }
        }

        console.log(`✅ Simulação concluída para ${userId}`);
    }
}

// CLI Interface
async function main() {
    const gamification = new GamificationLoop();

    const args = process.argv.slice(2);
    const command = args[0];

    try {
        switch (command) {
            case 'award':
                if (args.length < 3) {
                    console.log('Uso: node gamification_loop.js award <userId> <action>');
                    process.exit(1);
                }
                const userId = args[1];
                const action = args[2];
                const points = await gamification.awardPoints(userId, action);
                console.log(`✅ ${points} pontos atribuídos a ${userId} por ${action}`);
                break;

            case 'stats':
                const targetUser = args[1] || 'global';
                if (targetUser === 'global') {
                    const stats = gamification.getGlobalStats();
                    console.log('🎮 Estatísticas Globais:');
                    console.log(JSON.stringify(stats, null, 2));
                } else {
                    const userStats = gamification.getUserStats(targetUser);
                    console.log(`🎮 Estatísticas de ${targetUser}:`);
                    console.log(JSON.stringify(userStats, null, 2));
                }
                break;

            case 'leaderboard':
                const limit = parseInt(args[1]) || 10;
                const leaderboard = gamification.getLeaderboard(limit);
                console.log(`🏆 Top ${limit} Usuários:`);
                leaderboard.forEach((user, index) => {
                    console.log(`${index + 1}. ${user.userId}: ${user.totalPoints} pontos (Nível ${user.level})`);
                });
                break;

            case 'simulate':
                if (args.length < 2) {
                    console.log('Uso: node gamification_loop.js simulate <userId> [days]');
                    process.exit(1);
                }
                const simUserId = args[1];
                const simDays = parseInt(args[2]) || 7;
                await gamification.simulateActivity(simUserId, simDays);
                break;

            case 'achievements':
                console.log('🏆 Conquistas Disponíveis:');
                Object.entries(gamification.achievements).forEach(([id, achievement]) => {
                    console.log(`${achievement.icon} ${id}: ${achievement.name} (${achievement.points} pontos)`);
                    if (achievement.requirement) {
                        console.log(`   Requisito: ${achievement.requirement}`);
                    }
                });
                break;

            default:
                console.log('🎮 GetNexo Gamification Loop');
                console.log('Comandos disponíveis:');
                console.log('  award <userId> <action>    - Atribuir pontos por ação');
                console.log('  stats [userId]            - Ver estatísticas (global ou usuário)');
                console.log('  leaderboard [limit]       - Ver ranking');
                console.log('  simulate <userId> [days]  - Simular atividade');
                console.log('  achievements              - Listar conquistas disponíveis');
                console.log('\nAções disponíveis:', Object.keys(gamification.pointSystem).join(', '));
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = GamificationLoop;