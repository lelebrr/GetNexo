import React, { useState, useEffect, useCallback } from 'react';

export default function InteractiveGame() {
    // Game State
    const [gameState, setGameState] = useState('menu'); // menu, countdown, playing, paused, result, leaderboard
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [combo, setCombo] = useState(0);
    const [powerUps, setPowerUps] = useState({ multiplier: 1, autoClick: 0, freeze: false });
    const [particles, setParticles] = useState([]);

    // Records
    const [personalBest, setPersonalBest] = useState(parseInt(localStorage.getItem('game_personal_best') || '0'));
    const [globalRecords, setGlobalRecords] = useState([]);
    const [playerName, setPlayerName] = useState(localStorage.getItem('game_player_name') || '');

    // Game Settings
    const gameLevels = [
        { id: 1, name: 'Iniciante', duration: 30, multiplier: 1, target: 150 },
        { id: 2, name: 'Intermediário', duration: 25, multiplier: 1.5, target: 200 },
        { id: 3, name: 'Avançado', duration: 20, multiplier: 2, target: 300 },
        { id: 4, name: 'Mestre', duration: 15, multiplier: 2.5, target: 400 },
        { id: 5, name: 'Lenda', duration: 10, multiplier: 3, target: 500 }
    ];

    const currentLevel = gameLevels.find(l => l.id === level);

    // Particle System for Visual Effects
    const createParticle = useCallback((x, y, type) => {
        const newParticle = {
            id: Date.now() + Math.random(),
            x,
            y,
            type,
            life: 100,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4
        };
        setParticles(prev => [...prev, newParticle]);
    }, []);

    // Update particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev
                .map(p => ({ ...p, life: p.life - 1, x: p.x + p.vx, y: p.y + p.vy }))
                .filter(p => p.life > 0)
            );
        }, 16);
        return () => clearInterval(interval);
    }, []);

    // Game Timer
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame();
        }
        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    // Auto-click effect
    useEffect(() => {
        let autoClickInterval;
        if (powerUps.autoClick > 0 && gameState === 'playing') {
            autoClickInterval = setInterval(() => {
                handleClick({ clientX: Math.random() * 300 + 50, clientY: Math.random() * 200 + 100 }, true);
            }, 1000 / powerUps.autoClick);
        }
        return () => clearInterval(autoClickInterval);
    }, [powerUps.autoClick, gameState]);

    // Load global records
    useEffect(() => {
        loadGlobalRecords();
    }, []);

    const loadGlobalRecords = async () => {
        try {
            const response = await fetch('/api/game/records');
            if (response.ok) {
                const records = await response.json();
                setGlobalRecords(records);
            }
        } catch (error) {
            console.error('Failed to load global records:', error);
        }
    };

    const saveScore = async (finalScore, finalClicks) => {
        if (!playerName.trim()) return;

        try {
            const response = await fetch('/api/game/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName,
                    score: finalScore,
                    clicks: finalClicks,
                    level: level,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                loadGlobalRecords(); // Refresh records
            }
        } catch (error) {
            console.error('Failed to save score:', error);
        }
    };

    const startGame = () => {
        setGameState('countdown');
        setTimeout(() => setGameState('playing'), 3000);
    };

    const handleClick = useCallback((e, isAuto = false) => {
        if (gameState !== 'playing') return;

        const rect = e.target.getBoundingClientRect();
        const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
        const y = (e.clientY || rect.top + rect.height / 2) - rect.top;

        // Create particles
        createParticle(x, y, 'click');

        // Update clicks and score
        setClicks(prev => {
            const newClicks = prev + 1;
            const basePoints = 10 * (powerUps.multiplier || 1) * (1 + combo * 0.1);
            const newScore = score + Math.floor(basePoints);

            setScore(newScore);
            setCombo(prevCombo => prevCombo + 1);

            // Check for power-ups
            if (newClicks % 50 === 0) {
                // Activate random power-up
                const powerUpTypes = ['multiplier', 'autoClick', 'freeze'];
                const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

                switch (randomPowerUp) {
                    case 'multiplier':
                        setPowerUps(prev => ({ ...prev, multiplier: prev.multiplier + 0.5 }));
                        createParticle(x, y, 'powerup');
                        break;
                    case 'autoClick':
                        setPowerUps(prev => ({ ...prev, autoClick: prev.autoClick + 1 }));
                        createParticle(x, y, 'powerup');
                        break;
                    case 'freeze':
                        setPowerUps(prev => ({ ...prev, freeze: true }));
                        setTimeout(() => setPowerUps(prev => ({ ...prev, freeze: false })), 3000);
                        createParticle(x, y, 'freeze');
                        break;
                }
            }

            return newClicks;
        });

        // Reset combo timer
        setTimeout(() => setCombo(0), 2000);
    }, [gameState, score, combo, powerUps, createParticle]);

    const endGame = () => {
        setGameState('result');

        const finalScore = score;
        const finalClicks = clicks;

        // Save personal best
        if (finalClicks > personalBest) {
            setPersonalBest(finalClicks);
            localStorage.setItem('game_personal_best', finalClicks.toString());
        }

        // Save to global leaderboard if player has a name
        if (playerName.trim()) {
            saveScore(finalScore, finalClicks);
        }
    };

    const nextLevel = () => {
        if (level < gameLevels.length) {
            setLevel(prev => prev + 1);
        }
        resetGame();
    };

    const resetGame = () => {
        setGameState('menu');
        setScore(0);
        setClicks(0);
        setTimeLeft(currentLevel.duration);
        setCombo(0);
        setPowerUps({ multiplier: 1, autoClick: 0, freeze: false });
        setParticles([]);
    };

    const selectLevel = (levelId) => {
        setLevel(levelId);
        setTimeLeft(gameLevels.find(l => l.id === levelId).duration);
    };

    const renderParticles = () => {
        return particles.map(particle => (
            <div
                key={particle.id}
                className={`absolute pointer-events-none text-2xl animate-bounce ${particle.type === 'click' ? 'text-yellow-400' :
                        particle.type === 'powerup' ? 'text-purple-500' :
                            particle.type === 'freeze' ? 'text-blue-400' : 'text-green-400'
                    }`}
                style={{
                    left: particle.x,
                    top: particle.y,
                    opacity: particle.life / 100,
                    transform: `scale(${particle.life / 100})`
                }}
            >
                {particle.type === 'click' ? '⭐' :
                    particle.type === 'powerup' ? '⚡' :
                        particle.type === 'freeze' ? '❄️' : '💎'}
            </div>
        ));
    };

    return (
        <div className="interactive-game bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-2xl p-6 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 animate-pulse"></div>

            {renderParticles()}

            {/* Header */}
            <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🕹️ GetNexo Click Game
                </h2>
                <p className="text-center mb-6 text-gray-600">Jogo interativo com timer, pontuação e recordes globais!</p>
            </div>

            {/* Player Name Input */}
            {gameState !== 'playing' && gameState !== 'countdown' && (
                <div className="mb-4 relative z-10">
                    <input
                        type="text"
                        placeholder="Seu nome para o ranking"
                        value={playerName}
                        onChange={(e) => {
                            setPlayerName(e.target.value);
                            localStorage.setItem('game_player_name', e.target.value);
                        }}
                        className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                        maxLength={20}
                    />
                </div>
            )}

            {/* Level Selection */}
            {gameState === 'menu' && (
                <div className="space-y-3 mb-6 relative z-10">
                    <h3 className="text-xl font-semibold text-center mb-4">Selecione o Nível</h3>
                    {gameLevels.map(lvl => (
                        <button
                            key={lvl.id}
                            onClick={() => selectLevel(lvl.id)}
                            className={`w-full p-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${level === lvl.id
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                    : 'bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-700'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{lvl.name}</span>
                                <span className="text-sm">
                                    {lvl.duration}s • Meta: {lvl.target} • x{lvl.multiplier}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Countdown */}
            {gameState === 'countdown' && (
                <div className="text-center py-12 relative z-10">
                    <div className="text-6xl font-bold text-blue-600 animate-bounce mb-4">
                        {Math.ceil(timeLeft / 1000) || 3}
                    </div>
                    <p className="text-xl text-gray-600">Prepare-se!</p>
                </div>
            )}

            {/* Game Playing */}
            {gameState === 'playing' && (
                <div className="text-center relative z-10">
                    {/* HUD */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
                            <div className="text-sm text-gray-600">Tempo</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-bold text-green-600">{clicks}</div>
                            <div className="text-sm text-gray-600">Cliques</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-bold text-purple-600">{score.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Pontos</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-md">
                            <div className="text-2xl font-bold text-orange-600">x{combo}</div>
                            <div className="text-sm text-gray-600">Combo</div>
                        </div>
                    </div>

                    {/* Power-ups Display */}
                    <div className="flex justify-center space-x-4 mb-6">
                        {powerUps.multiplier > 1 && (
                            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-3 py-1">
                                <span className="text-yellow-800 font-semibold">x{powerUps.multiplier} Multiplicador</span>
                            </div>
                        )}
                        {powerUps.autoClick > 0 && (
                            <div className="bg-green-100 border-2 border-green-400 rounded-lg px-3 py-1">
                                <span className="text-green-800 font-semibold">Auto-click: {powerUps.autoClick}/s</span>
                            </div>
                        )}
                        {powerUps.freeze && (
                            <div className="bg-blue-100 border-2 border-blue-400 rounded-lg px-3 py-1">
                                <span className="text-blue-800 font-semibold">Tempo Congelado!</span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-6 relative overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                            style={{ width: `${(timeLeft / currentLevel.duration) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>

                    {/* Click Button */}
                    <button
                        onClick={handleClick}
                        disabled={powerUps.freeze}
                        className={`px-12 py-8 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 active:scale-95 shadow-xl ${powerUps.freeze
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white'
                            }`}
                    >
                        🚀 CLIQUE AQUI!
                    </button>

                    {/* Target Indicator */}
                    <div className="mt-6">
                        <div className="text-sm text-gray-600 mb-2">
                            Meta do nível: {currentLevel.target} cliques
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((clicks / currentLevel.target) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Result */}
            {gameState === 'result' && (
                <div className="text-center relative z-10">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">
                            {clicks >= currentLevel.target ? '🎉 Parabéns!' : '⏰ Tempo Esgotado!'}
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="text-xl font-bold text-blue-600">{clicks}</div>
                                <div className="text-sm text-gray-600">Cliques Totais</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="text-xl font-bold text-purple-600">{score.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Pontuação Final</div>
                            </div>
                        </div>

                        {clicks >= currentLevel.target && level < gameLevels.length && (
                            <div className="mb-4">
                                <p className="text-green-600 font-semibold mb-2">Meta atingida! Próximo nível desbloqueado!</p>
                                <button
                                    onClick={nextLevel}
                                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
                                >
                                    Próximo Nível
                                </button>
                            </div>
                        )}

                        {clicks > personalBest && (
                            <p className="text-yellow-600 font-bold mb-4">🏆 Novo recorde pessoal!</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={resetGame}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Jogar Novamente
                        </button>
                        <button
                            onClick={() => setGameState('leaderboard')}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Ver Ranking
                        </button>
                    </div>
                </div>
            )}

            {/* Leaderboard */}
            {gameState === 'leaderboard' && (
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">🏅 Ranking Global</h3>

                    <div className="space-y-2 mb-6 max-h-80 overflow-y-auto">
                        {globalRecords.slice(0, 10).map((record, index) => (
                            <div key={record.id} className={`flex justify-between items-center p-3 rounded-lg ${index < 3 ? 'bg-gradient-to-r from-yellow-100 to-orange-100' : 'bg-white'
                                } shadow-md`}>
                                <div className="flex items-center space-x-3">
                                    <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-500' :
                                            index === 1 ? 'text-gray-400' :
                                                index === 2 ? 'text-orange-600' : 'text-gray-600'
                                        }`}>
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <div className="font-semibold">{record.player_name}</div>
                                        <div className="text-sm text-gray-500">Nível {record.level}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-blue-600">{record.clicks} cliques</div>
                                    <div className="text-sm text-gray-500">{record.score.toLocaleString()} pts</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setGameState('menu')}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Voltar ao Menu
                    </button>
                </div>
            )}

            {/* Start Button */}
            {(gameState === 'menu' || gameState === 'leaderboard') && (
                <div className="text-center mt-6 relative z-10">
                    <button
                        onClick={startGame}
                        disabled={!playerName.trim()}
                        className={`px-8 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-xl ${playerName.trim()
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                                : 'bg-gray-400 cursor-not-allowed text-gray-200'
                            }`}
                    >
                        🎮 Iniciar Jogo - Nível {level}
                    </button>
                    {!playerName.trim() && (
                        <p className="text-red-500 text-sm mt-2">Digite seu nome para jogar</p>
                    )}
                </div>
            )}

            {/* Personal Best */}
            {personalBest > 0 && gameState !== 'playing' && gameState !== 'countdown' && (
                <div className="text-center mt-4 text-sm text-gray-600 relative z-10">
                    Seu melhor: {personalBest} cliques
                </div>
            )}
        </div>
    );
}