import React, { useState, useEffect } from 'react';

export default function GamificationDashboard() {
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Load user gamification data
        loadGamificationData();
        loadLeaderboard();
    }, []);

    const loadGamificationData = () => {
        // Mock data - in real app, fetch from API
        setPoints(1250);
        setLevel(5);
        setAchievements([
            { id: 1, name: 'Primeiro Login', icon: '🎯', unlocked: true },
            { id: 2, name: 'Chatbot Expert', icon: '🤖', unlocked: true },
            { id: 3, name: 'AR Explorer', icon: '📱', unlocked: false },
            { id: 4, name: 'Game Master', icon: '🎮', unlocked: true },
            { id: 5, name: 'Backup Guardian', icon: '💾', unlocked: false }
        ]);
    };

    const loadLeaderboard = () => {
        // Mock leaderboard
        setLeaderboard([
            { rank: 1, name: 'João Silva', points: 2450, level: 8 },
            { rank: 2, name: 'Maria Santos', points: 2100, level: 7 },
            { rank: 3, name: 'Pedro Lima', points: 1950, level: 7 },
            { rank: 4, name: 'Ana Costa', points: 1800, level: 6 },
            { rank: 5, name: 'Você', points: 1250, level: 5 }
        ]);
    };

    const getProgressToNextLevel = () => {
        const pointsForCurrentLevel = level * 250;
        const pointsForNextLevel = (level + 1) * 250;
        const progress = ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
        return Math.min(progress, 100);
    };

    return (
        <div className="gamification-dashboard bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">🏆 Dashboard de Gamificação</h2>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{points}</div>
                    <div className="text-sm opacity-90">Pontos Totais</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">Nível {level}</div>
                    <div className="text-sm opacity-90">Seu Nível</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
                    <div className="text-sm opacity-90">Conquistas</div>
                </div>
            </div>

            {/* Level Progress */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-4">Progresso para Nível {level + 1}</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressToNextLevel()}%` }}
                    ></div>
                </div>
                <div className="text-sm text-gray-600">
                    {Math.round(getProgressToNextLevel())}% concluído • {level * 250 + Math.round(getProgressToNextLevel() / 100 * 250)} / {(level + 1) * 250} pontos
                </div>
            </div>

            {/* Achievements */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">🏅 Conquistas</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {achievements.map(achievement => (
                        <div
                            key={achievement.id}
                            className={`p-4 rounded-lg text-center transition-all ${achievement.unlocked
                                    ? 'bg-yellow-100 border-2 border-yellow-400'
                                    : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                                }`}
                        >
                            <div className="text-3xl mb-2">{achievement.icon}</div>
                            <div className="text-sm font-semibold">{achievement.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div>
                <h3 className="text-xl font-bold mb-4">🏆 Ranking Global</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {leaderboard.map((user, index) => (
                        <div
                            key={user.rank}
                            className={`flex items-center justify-between p-4 border-b border-gray-200 ${user.name === 'Você' ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-400 text-black' :
                                        index === 1 ? 'bg-gray-400 text-white' :
                                            index === 2 ? 'bg-orange-400 text-white' :
                                                'bg-blue-500 text-white'
                                    }`}>
                                    {user.rank}
                                </div>
                                <div>
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-sm text-gray-600">Nível {user.level}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">{user.points.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">pontos</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}