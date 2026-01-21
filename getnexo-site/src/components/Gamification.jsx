import React, { useState, useEffect } from 'react';

const Gamification = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGamificationData();
    }, []);

    const fetchGamificationData = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/gamification', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data);
            } else {
                setError(data.error || 'Erro ao carregar dados de gamificação.');
            }
        } catch (err) {
            setError('Erro de conexão.');
            console.error('Erro ao buscar gamificação:', err);
        } finally {
            setLoading(false);
        }
    };

    const addPoints = async (action) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/gamification', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action })
            });

            if (response.ok) {
                fetchGamificationData(); // Recarregar dados
            }
        } catch (err) {
            console.error('Erro ao adicionar pontos:', err);
        }
    };

    if (loading) {
        return (
            <div className="gamification-container p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Sistema de Gamificação</h3>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gamification-container p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Sistema de Gamificação</h3>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!userData) return null;

    const { user, availableAchievements, progress, leaderboard } = userData;
    const progressToNextLevel = ((user.points % 100) / 100) * 100;

    return (
        <div className="gamification-container p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6">Sistema de Gamificação</h3>

            {/* Status do Usuário */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{user.points}</div>
                    <div className="text-sm">Pontos Totais</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{user.level}</div>
                    <div className="text-sm">Nível Atual</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{progress.completionPercentage}%</div>
                    <div className="text-sm">Conquistas</div>
                </div>
            </div>

            {/* Barra de Progresso para Próximo Nível */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span>Progresso para Nível {user.level + 1}</span>
                    <span>{user.points % 100}/{100} pontos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progressToNextLevel}%` }}
                    ></div>
                </div>
            </div>

            {/* Ações para Ganhar Pontos */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Ganhar Pontos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        onClick={() => addPoints('files_uploaded')}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                    >
                        📁 Simular Upload de Arquivo (+5 pontos)
                    </button>
                    <button
                        onClick={() => addPoints('map_views')}
                        className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded text-sm"
                    >
                        🗺️ Simular Uso do Mapa (+5 pontos)
                    </button>
                    <button
                        onClick={() => addPoints('analytics_used')}
                        className="bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded text-sm"
                    >
                        📊 Simular Análise de Dados (+5 pontos)
                    </button>
                    <button
                        onClick={() => addPoints('social_shares')}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm"
                    >
                        📱 Simular Compartilhamento (+5 pontos)
                    </button>
                </div>
            </div>

            {/* Conquistas */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">
                    Conquistas ({user.achievements.length}/{availableAchievements.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableAchievements.map((achievement) => {
                        const isUnlocked = user.achievements.some(a => a.id === achievement.id);
                        return (
                            <div
                                key={achievement.id}
                                className={`border rounded-lg p-3 ${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{achievement.icon}</span>
                                    <div className="flex-1">
                                        <h5 className={`font-medium ${isUnlocked ? 'text-green-800' : 'text-gray-600'}`}>
                                            {achievement.title}
                                        </h5>
                                        <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                                            {achievement.description}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium">
                                            +{achievement.points} pontos
                                        </p>
                                    </div>
                                    {isUnlocked && (
                                        <span className="text-green-500 text-xl">✓</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Leaderboard */}
            <div>
                <h4 className="text-lg font-semibold mb-3">Leaderboard</h4>
                <div className="space-y-2">
                    {leaderboard.map((player, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-3 rounded-lg ${player.name === 'Você' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className={`font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600'}`}>
                                    #{index + 1}
                                </span>
                                <span className="font-medium">{player.name}</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">{player.points} pts</div>
                                <div className="text-sm text-gray-500">Nível {player.level}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gamification;