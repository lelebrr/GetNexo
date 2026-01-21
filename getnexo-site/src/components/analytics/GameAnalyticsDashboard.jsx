import React, { useState, useEffect } from 'react';
import { Card } from '../design-system/components/Card';

const GameAnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState('all');
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30000); // Atualizar a cada 30 segundos
        return () => clearInterval(interval);
    }, [selectedGame, timeRange]);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            let url = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/games/analytics/dashboard`;

            const params = new URLSearchParams({
                gameType: selectedGame,
                timeRange: timeRange
            });

            url += `?${params.toString()}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (err) {
            console.error('Erro ao carregar analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatPercentage = (num) => {
        return (num || 0).toFixed(1) + '%';
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <div>Carregando dados de analytics...</div>;
    }

    const { summary, games, realtime } = analytics;

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                        📊 Analytics dos Minigames
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Métricas em tempo real dos jogos interativos
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    >
                        <option value="all">Todos os Jogos</option>
                        <option value="roleta">🎰 Roleta</option>
                        <option value="raspadinha">🧽 Raspadinha</option>
                        <option value="caca_preco">💰 Caça-Preço</option>
                        <option value="quiz">📚 Quiz</option>
                        <option value="monte_kit">🎁 Monte Kit</option>
                    </select>

                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    >
                        <option value="1h">Última Hora</option>
                        <option value="24h">Últimas 24h</option>
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                    </select>
                </div>
            </div>

            {/* Métricas Principais */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎮</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {formatNumber(summary?.totalSessions || 0)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Sessões Totais</div>
                </Card>

                <Card style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {formatNumber(summary?.totalPoints || 0)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Pontos Distribuídos</div>
                </Card>

                <Card style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>📈</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {formatPercentage(summary?.completionRate || 0)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Taxa de Conclusão</div>
                </Card>

                <Card style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>💰</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                        R$ {formatNumber(summary?.revenue || 0)}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Receita Gerada</div>
                </Card>
            </div>

            {/* Dados em Tempo Real */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                    ⚡ Tempo Real
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <Card style={{ padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                            {realtime?.activeSessions || 0}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Sessões Ativas</div>
                    </Card>

                    <Card style={{ padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                            {realtime?.gamesPerMinute || 0}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Jogos/Minuto</div>
                    </Card>

                    <Card style={{ padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                            {formatTime(realtime?.avgSessionDuration || 0)}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Tempo Médio</div>
                    </Card>

                    <Card style={{ padding: '16px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                            {formatNumber(realtime?.pointsLastHour || 0)}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Pontos (última hora)</div>
                    </Card>
                </div>
            </div>

            {/* Performance por Jogo */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                    🎯 Performance por Jogo
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {games?.map(game => (
                        <Card key={game.gameType} style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {getGameEmoji(game.gameType)} {getGameName(game.gameType)}
                                </h3>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    background: game.isActive ? '#10b981' : '#6b7280',
                                    color: 'white'
                                }}>
                                    {game.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                        {formatNumber(game.totalSessions)}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Sessões</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                        {formatPercentage(game.completionRate)}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Conclusão</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                        {formatNumber(game.totalPoints)}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Pontos</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                        {formatTime(game.avgDuration)}
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '12px' }}>Tempo Médio</div>
                                </div>
                            </div>

                            {/* Barra de progresso */}
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Engajamento</span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{game.engagementScore?.toFixed(1)}/100</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                                    <div
                                        style={{
                                            width: `${Math.min(game.engagementScore || 0, 100)}%`,
                                            height: '100%',
                                            background: getEngagementColor(game.engagementScore || 0),
                                            borderRadius: '4px',
                                            transition: 'width 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Insights Automáticos */}
            {analytics.insights && analytics.insights.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                        💡 Insights Automáticos
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {analytics.insights.map((insight, index) => (
                            <Card key={index} style={{
                                padding: '16px',
                                borderLeft: `4px solid ${getInsightColor(insight.type)}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '18px', marginRight: '8px' }}>
                                        {getInsightIcon(insight.type)}
                                    </span>
                                    <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {insight.title}
                                    </h4>
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                                    {insight.description}
                                </p>
                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                    Recomendação: {insight.recommendation}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const getGameEmoji = (gameType) => {
    const emojis = {
        roleta: '🎰',
        raspadinha: '🧽',
        caca_preco: '💰',
        quiz: '📚',
        monte_kit: '🎁'
    };
    return emojis[gameType] || '🎮';
};

const getGameName = (gameType) => {
    const names = {
        roleta: 'Roleta Virtual',
        raspadinha: 'Raspadinha',
        caca_preco: 'Caça-Preço',
        quiz: 'Quiz',
        monte_kit: 'Monte seu Kit'
    };
    return names[gameType] || gameType;
};

const getEngagementColor = (score) => {
    if (score >= 80) return '#10b981'; // Verde
    if (score >= 60) return '#f59e0b'; // Amarelo
    if (score >= 40) return '#f97316'; // Laranja
    return '#ef4444'; // Vermelho
};

const getInsightColor = (type) => {
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6',
        danger: '#ef4444'
    };
    return colors[type] || '#6b7280';
};

const getInsightIcon = (type) => {
    const icons = {
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
        danger: '🚨'
    };
    return icons[type] || '💡';
};

export default GameAnalyticsDashboard;