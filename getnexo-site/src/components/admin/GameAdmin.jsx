import React, { useState, useEffect } from 'react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Card } from '../design-system/components/Card';

const GameAdmin = () => {
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estado para configuração de jogos
    const [gameConfig, setGameConfig] = useState({
        name: '',
        description: '',
        isActive: true,
        games: {
            roleta: {
                enabled: true,
                maxSpinsPerDay: 3,
                pointRange: { min: 10, max: 100 },
                specialPrizeChance: 5, // %
                specialPrizePoints: 500
            },
            raspadinha: {
                enabled: true,
                gridSize: '3x3',
                symbols: ['🍒', '🍋', '🍊', '⭐', '💎'],
                winPatterns: ['3x3', 'diagonal', 'row'],
                prizeMultiplier: 2
            },
            caca_preco: {
                enabled: true,
                productPool: [],
                priceRange: { min: 50, max: 1000 },
                tolerance: 10, // % de tolerância para acerto
                pointMultiplier: 1.5
            },
            quiz: {
                enabled: true,
                questions: [],
                timeLimit: 30, // segundos
                hintsEnabled: true,
                categories: ['empresa', 'produtos', 'geral']
            },
            monte_kit: {
                enabled: true,
                kits: [],
                winChance: 25, // %
                maxSelectionsPerDay: 1
            }
        },
        loyalty: {
            enabled: true,
            pointsPerGame: 10,
            levelThresholds: [
                { level: 1, name: 'Bronze', minPoints: 0 },
                { level: 2, name: 'Prata', minPoints: 500 },
                { level: 3, name: 'Ouro', minPoints: 1500 },
                { level: 4, name: 'Platina', minPoints: 3000 },
                { level: 5, name: 'Diamante', minPoints: 5000 }
            ],
            redemptionOptions: [
                { name: '10% de desconto', points: 200, type: 'discount' },
                { name: 'Frete grátis', points: 150, type: 'shipping' },
                { name: 'Produto bônus', points: 300, type: 'product' }
            ]
        },
        analytics: {
            trackSessions: true,
            trackEngagement: true,
            trackConversions: true,
            realTimeDashboard: true,
            customReports: []
        },
        settings: {
            targetChannels: ['whatsapp', 'facebook', 'chat', 'widget'],
            dailyLimits: {
                maxSessionsPerUser: 10,
                maxPointsPerDay: 500
            },
            cooldowns: {
                betweenGames: 60, // segundos
                dailyReset: '00:00'
            },
            notifications: {
                levelUp: true,
                pointsEarned: true,
                achievements: true
            }
        }
    });

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/games/config`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setConfigs(data.configs || []);
            }
        } catch (err) {
            console.error('Erro ao carregar configurações:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const method = selectedConfig ? 'PUT' : 'POST';
            const url = selectedConfig
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/games/config/${selectedConfig._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/games/config`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameConfig),
            });

            if (response.ok) {
                fetchConfigs();
                setIsEditing(false);
                setSelectedConfig(null);
                resetForm();
            }
        } catch (err) {
            console.error('Erro ao salvar configuração:', err);
        }
    };

    const handleEdit = (config) => {
        setSelectedConfig(config);
        setGameConfig(config);
        setIsEditing(true);
    };

    const handleDelete = async (configId) => {
        if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/games/config/${configId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchConfigs();
            }
        } catch (err) {
            console.error('Erro ao excluir configuração:', err);
        }
    };

    const resetForm = () => {
        setGameConfig({
            name: '',
            description: '',
            isActive: true,
            games: {
                roleta: { enabled: true, maxSpinsPerDay: 3, pointRange: { min: 10, max: 100 }, specialPrizeChance: 5, specialPrizePoints: 500 },
                raspadinha: { enabled: true, gridSize: '3x3', symbols: ['🍒', '🍋', '🍊', '⭐', '💎'], winPatterns: ['3x3', 'diagonal', 'row'], prizeMultiplier: 2 },
                caca_preco: { enabled: true, productPool: [], priceRange: { min: 50, max: 1000 }, tolerance: 10, pointMultiplier: 1.5 },
                quiz: { enabled: true, questions: [], timeLimit: 30, hintsEnabled: true, categories: ['empresa', 'produtos', 'geral'] },
                monte_kit: { enabled: true, kits: [], winChance: 25, maxSelectionsPerDay: 1 }
            },
            loyalty: {
                enabled: true,
                pointsPerGame: 10,
                levelThresholds: [
                    { level: 1, name: 'Bronze', minPoints: 0 },
                    { level: 2, name: 'Prata', minPoints: 500 },
                    { level: 3, name: 'Ouro', minPoints: 1500 },
                    { level: 4, name: 'Platina', minPoints: 3000 },
                    { level: 5, name: 'Diamante', minPoints: 5000 }
                ],
                redemptionOptions: [
                    { name: '10% de desconto', points: 200, type: 'discount' },
                    { name: 'Frete grátis', points: 150, type: 'shipping' },
                    { name: 'Produto bônus', points: 300, type: 'product' }
                ]
            },
            analytics: { trackSessions: true, trackEngagement: true, trackConversions: true, realTimeDashboard: true, customReports: [] },
            settings: {
                targetChannels: ['whatsapp', 'facebook', 'chat', 'widget'],
                dailyLimits: { maxSessionsPerUser: 10, maxPointsPerDay: 500 },
                cooldowns: { betweenGames: 60, dailyReset: '00:00' },
                notifications: { levelUp: true, pointsEarned: true, achievements: true }
            }
        });
    };

    const updateGameConfig = (section, field, value) => {
        setGameConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateNestedGameConfig = (section, subsection, field, value) => {
        setGameConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };

    const updateGameTypeConfig = (gameType, field, value) => {
        setGameConfig(prev => ({
            ...prev,
            games: {
                ...prev.games,
                [gameType]: {
                    ...prev.games[gameType],
                    [field]: value
                }
            }
        }));
    };

    if (loading) {
        return <div>Carregando configurações de jogos...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                        🎮 Minigames no Chat
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Configure jogos interativos para engajar seus clientes no chat
                    </p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsEditing(true);
                        setSelectedConfig(null);
                    }}
                    style={{ background: '#4CAF50', color: 'white' }}
                >
                    + Nova Configuração
                </Button>
            </div>

            {!isEditing ? (
                // Lista de configurações
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {configs.map(config => (
                        <Card key={config._id} style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {config.name}
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                        {config.description}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    background: config.isActive ? '#4CAF50' : '#6b7280',
                                    color: 'white'
                                }}>
                                    {config.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#6b7280' }}>
                                    {config.games.roleta.enabled && <span>🎰 Roleta</span>}
                                    {config.games.raspadinha.enabled && <span>🧽 Raspadinha</span>}
                                    {config.games.caca_preco.enabled && <span>💰 Caça-Preço</span>}
                                    {config.games.quiz.enabled && <span>📚 Quiz</span>}
                                    {config.games.monte_kit.enabled && <span>🎁 Monte Kit</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button size="sm" variant="secondary" onClick={() => handleEdit(config)}>
                                    Editar
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(config._id)}>
                                    Excluir
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                // Formulário de edição
                <div style={{ spaceY: '24px' }}>
                    <Card style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                            {selectedConfig ? 'Editar Configuração' : 'Nova Configuração'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Nome</label>
                                <Input
                                    value={gameConfig.name}
                                    onChange={(e) => setGameConfig(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nome da configuração"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Descrição</label>
                                <Input
                                    value={gameConfig.description}
                                    onChange={(e) => setGameConfig(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Descrição da configuração"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={gameConfig.isActive}
                                    onChange={(e) => setGameConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                                />
                                <span style={{ fontWeight: 'bold' }}>Configuração Ativa</span>
                            </label>
                        </div>
                    </Card>

                    {/* Jogos Individuais */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            🎮 Configuração dos Jogos
                        </h3>

                        {/* Roleta */}
                        <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🎰 Roleta Virtual</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                    <input
                                        type="checkbox"
                                        checked={gameConfig.games.roleta.enabled}
                                        onChange={(e) => updateGameTypeConfig('roleta', 'enabled', e.target.checked)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Giros/Dia</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.roleta.maxSpinsPerDay}
                                        onChange={(e) => updateGameTypeConfig('roleta', 'maxSpinsPerDay', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Pontos Mín</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.roleta.pointRange.min}
                                        onChange={(e) => updateNestedGameConfig('games', 'roleta', 'pointRange', { ...gameConfig.games.roleta.pointRange, min: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Pontos Máx</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.roleta.pointRange.max}
                                        onChange={(e) => updateNestedGameConfig('games', 'roleta', 'pointRange', { ...gameConfig.games.roleta.pointRange, max: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Raspadinha */}
                        <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🧽 Raspadinha</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                    <input
                                        type="checkbox"
                                        checked={gameConfig.games.raspadinha.enabled}
                                        onChange={(e) => updateGameTypeConfig('raspadinha', 'enabled', e.target.checked)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Grade</label>
                                    <select
                                        value={gameConfig.games.raspadinha.gridSize}
                                        onChange={(e) => updateGameTypeConfig('raspadinha', 'gridSize', e.target.value)}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                    >
                                        <option value="3x3">3x3</option>
                                        <option value="4x4">4x4</option>
                                        <option value="5x5">5x5</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Multiplicador</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.raspadinha.prizeMultiplier}
                                        onChange={(e) => updateGameTypeConfig('raspadinha', 'prizeMultiplier', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Caça-Preço */}
                        <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>💰 Caça-Preço</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                    <input
                                        type="checkbox"
                                        checked={gameConfig.games.caca_preco.enabled}
                                        onChange={(e) => updateGameTypeConfig('caca_preco', 'enabled', e.target.checked)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tolerância (%)</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.caca_preco.tolerance}
                                        onChange={(e) => updateGameTypeConfig('caca_preco', 'tolerance', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Multiplicador</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={gameConfig.games.caca_preco.pointMultiplier}
                                        onChange={(e) => updateGameTypeConfig('caca_preco', 'pointMultiplier', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quiz */}
                        <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>📚 Quiz</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                    <input
                                        type="checkbox"
                                        checked={gameConfig.games.quiz.enabled}
                                        onChange={(e) => updateGameTypeConfig('quiz', 'enabled', e.target.checked)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tempo Limite (seg)</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.quiz.timeLimit}
                                        onChange={(e) => updateGameTypeConfig('quiz', 'timeLimit', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Dicas</label>
                                    <input
                                        type="checkbox"
                                        checked={gameConfig.games.quiz.hintsEnabled}
                                        onChange={(e) => updateGameTypeConfig('quiz', 'hintsEnabled', e.target.checked)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Monte Kit */}
                        <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>🎁 Monte seu Kit</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                    <input
                                        type="checkbox"
                                        checked={gameConfig.games.monte_kit.enabled}
                                        onChange={(e) => updateGameTypeConfig('monte_kit', 'enabled', e.target.checked)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Chance de Vitória (%)</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.monte_kit.winChance}
                                        onChange={(e) => updateGameTypeConfig('monte_kit', 'winChance', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Máx/Dia</label>
                                    <Input
                                        type="number"
                                        value={gameConfig.games.monte_kit.maxSelectionsPerDay}
                                        onChange={(e) => updateGameTypeConfig('monte_kit', 'maxSelectionsPerDay', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Sistema de Fidelidade */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            💎 Sistema de Fidelidade
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                <input
                                    type="checkbox"
                                    checked={gameConfig.loyalty.enabled}
                                    onChange={(e) => updateGameConfig('loyalty', 'enabled', e.target.checked)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Pontos/Jogo</label>
                                <Input
                                    type="number"
                                    value={gameConfig.loyalty.pointsPerGame}
                                    onChange={(e) => updateGameConfig('loyalty', 'pointsPerGame', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Níveis</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                                {gameConfig.loyalty.levelThresholds.map((level, index) => (
                                    <div key={index} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '6px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{level.name}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{level.minPoints} pts</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Configurações Gerais */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            ⚙️ Configurações Gerais
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Máx Sessões/Dia</label>
                                <Input
                                    type="number"
                                    value={gameConfig.settings.dailyLimits.maxSessionsPerUser}
                                    onChange={(e) => updateNestedGameConfig('settings', 'dailyLimits', 'maxSessionsPerUser', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Máx Pontos/Dia</label>
                                <Input
                                    type="number"
                                    value={gameConfig.settings.dailyLimits.maxPointsPerDay}
                                    onChange={(e) => updateNestedGameConfig('settings', 'dailyLimits', 'maxPointsPerDay', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Cooldown (seg)</label>
                                <Input
                                    type="number"
                                    value={gameConfig.settings.cooldowns.betweenGames}
                                    onChange={(e) => updateNestedGameConfig('settings', 'cooldowns', 'betweenGames', parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Canais Habilitados</h4>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {['whatsapp', 'facebook', 'chat', 'widget'].map(channel => (
                                    <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input
                                            type="checkbox"
                                            checked={gameConfig.settings.targetChannels.includes(channel)}
                                            onChange={(e) => {
                                                const channels = e.target.checked
                                                    ? [...gameConfig.settings.targetChannels, channel]
                                                    : gameConfig.settings.targetChannels.filter(c => c !== channel);
                                                updateGameConfig('settings', 'targetChannels', channels);
                                            }}
                                        />
                                        <span style={{ textTransform: 'capitalize' }}>{channel}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Ações */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedConfig(null);
                                resetForm();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} style={{ background: '#4CAF50', color: 'white' }}>
                            {selectedConfig ? 'Atualizar' : 'Criar'} Configuração
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameAdmin;