import React, { useState, useEffect } from 'react';
import { Button, Card, Loading, Toast } from '../../design-system';

const GameContainer = ({
    gameType,
    userId,
    conversationId,
    onGameComplete,
    onPointsEarned,
    onClose,
    style = {}
}) => {
    const [session, setSession] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        initializeGame();
    }, [gameType, userId]);

    const initializeGame = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/minigames/session/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    gameType,
                    channel: 'widget',
                    conversationId
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao iniciar jogo');
            }

            const data = await response.json();
            setSession(data.session);
            setGameState({
                status: 'ready',
                score: 0,
                attempts: 0,
                gameData: {}
            });
        } catch (err) {
            setError(err.message);
            showToastMessage('Erro ao iniciar jogo');
        } finally {
            setLoading(false);
        }
    };

    const playGame = async (action, userInput = null) => {
        if (!session) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/minigames/${gameType}/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: session.sessionId,
                    action,
                    userInput
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao jogar');
            }

            const data = await response.json();

            // Atualizar estado do jogo
            setGameState(prev => ({
                ...prev,
                ...data.result,
                completed: data.completed
            }));

            // Notificar pontos ganhos
            if (data.pointsEarned > 0) {
                onPointsEarned?.(data.pointsEarned);
                showToastMessage(`+${data.pointsEarned} pontos!`);
            }

            // Verificar se jogo terminou
            if (data.completed) {
                onGameComplete?.(data.result);
            }

            return data.result;
        } catch (err) {
            setError(err.message);
            showToastMessage('Erro durante o jogo');
            return null;
        }
    };

    const abandonGame = async () => {
        if (!session) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/minigames/session/${session.sessionId}/abandon`, {
                method: 'POST'
            });
            onClose?.();
        } catch (err) {
            console.error('Erro ao abandonar jogo:', err);
        }
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const renderGameContent = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Loading />
                    <p>Iniciando jogo...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <Button onClick={initializeGame}>Tentar Novamente</Button>
                </div>
            );
        }

        if (!gameState) {
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Jogo não inicializado</p>
                </div>
            );
        }

        // Renderizar jogo específico baseado no gameType
        switch (gameType) {
            case 'roleta':
                return <RouletteGame gameState={gameState} onPlay={playGame} session={session} />;
            case 'raspadinha':
                return <ScratchCardGame gameState={gameState} onPlay={playGame} session={session} />;
            case 'caca_preco':
                return <PriceGuessGame gameState={gameState} onPlay={playGame} session={session} />;
            case 'quiz':
                return <QuizGame gameState={gameState} onPlay={playGame} session={session} />;
            case 'monte_kit':
                return <KitChoiceGame gameState={gameState} onPlay={playGame} session={session} />;
            default:
                return <div>Jogo não suportado</div>;
        }
    };

    return (
        <Card style={{
            position: 'relative',
            maxWidth: '400px',
            margin: '10px auto',
            ...style
        }}>
            {/* Header do jogo */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
            }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>
                    {getGameTitle(gameType)}
                </h3>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={abandonGame}
                    style={{ fontSize: '12px' }}
                >
                    ✕
                </Button>
            </div>

            {/* Status do jogo */}
            {gameState && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    <span>Pontuação: {gameState.score || 0}</span>
                    <span>Tentativas: {gameState.attempts || 0}</span>
                </div>
            )}

            {/* Conteúdo do jogo */}
            <div style={{ minHeight: '200px' }}>
                {renderGameContent()}
            </div>

            {/* Toast de notificações */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1000
                    }}
                />
            )}
        </Card>
    );
};

// Componentes específicos dos jogos (placeholders por enquanto)
const RouletteGame = ({ gameState, onPlay }) => {
    const [spinning, setSpinning] = useState(false);

    const handleSpin = async () => {
        setSpinning(true);
        const result = await onPlay('spin');
        setTimeout(() => setSpinning(false), 2000);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '150px',
                height: '150px',
                border: '3px solid #007bff',
                borderRadius: '50%',
                margin: '20px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                background: spinning ? '#f0f8ff' : '#ffffff',
                transform: spinning ? 'rotate(360deg)' : 'none',
                transition: 'transform 2s ease-out'
            }}>
                🎰
            </div>
            <Button
                onClick={handleSpin}
                disabled={spinning}
                style={{ marginTop: '10px' }}
            >
                {spinning ? 'Girando...' : 'Girar Roleta'}
            </Button>
            {gameState.lastSpin !== undefined && (
                <p style={{ marginTop: '10px' }}>
                    Resultado: <strong>{gameState.lastSpin}</strong> pontos!
                </p>
            )}
        </div>
    );
};

const ScratchCardGame = ({ gameState, onPlay }) => {
    const [scratched, setScratched] = useState(false);

    const handleScratch = async () => {
        const result = await onPlay('scratch');
        setScratched(true);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '200px',
                height: '120px',
                border: '2px solid #28a745',
                borderRadius: '10px',
                margin: '20px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: scratched ? '#f8fff8' : '#e9ecef',
                cursor: scratched ? 'default' : 'pointer'
            }} onClick={!scratched ? handleScratch : undefined}>
                {scratched ? (
                    <div>
                        {gameState.grid?.map((symbol, index) => (
                            <span key={index} style={{ fontSize: '20px', margin: '2px' }}>
                                {symbol}
                            </span>
                        ))}
                        {gameState.winner && (
                            <p style={{ color: 'green', marginTop: '10px' }}>
                                Você ganhou {gameState.prize} pontos!
                            </p>
                        )}
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '24px' }}>🧽</div>
                        <p>Clique para raspar!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PriceGuessGame = ({ gameState, onPlay }) => {
    const [guess, setGuess] = useState('');

    const handleGuess = async () => {
        const result = await onPlay('guess', guess);
        setGuess('');
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p>Qual é o preço do produto?</p>
            <div style={{ margin: '20px 0' }}>
                <input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Digite seu palpite (R$)"
                    style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '150px',
                        textAlign: 'center'
                    }}
                />
            </div>
            <Button onClick={handleGuess} disabled={!guess}>
                Adivinhar
            </Button>
            {gameState.lastGuess !== undefined && (
                <div style={{ marginTop: '15px' }}>
                    <p>Seu palpite: R$ {gameState.lastGuess}</p>
                    <p>Diferença: {gameState.difference} pontos de diferença</p>
                    {gameState.points > 0 && (
                        <p style={{ color: 'green' }}>
                            Você ganhou {gameState.points} pontos!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

const QuizGame = ({ gameState, onPlay }) => {
    const [answer, setAnswer] = useState('');

    const handleAnswer = async () => {
        const result = await onPlay('answer', answer);
        setAnswer('');
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p>📚 Quiz da GetNexo</p>
            {gameState.question ? (
                <div>
                    <p style={{ margin: '15px 0', fontWeight: 'bold' }}>
                        {gameState.question}
                    </p>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Sua resposta"
                        style={{
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            width: '200px',
                            marginBottom: '10px'
                        }}
                    />
                    <br />
                    <Button onClick={handleAnswer} disabled={!answer}>
                        Responder
                    </Button>
                    {gameState.correct !== undefined && (
                        <div style={{ marginTop: '15px' }}>
                            <p style={{ color: gameState.correct ? 'green' : 'red' }}>
                                {gameState.correct ? 'Correto!' : 'Incorreto'}
                            </p>
                            {gameState.points > 0 && (
                                <p>Você ganhou {gameState.points} pontos!</p>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>Aguardando pergunta...</p>
            )}
        </div>
    );
};

const KitChoiceGame = ({ gameState, onPlay }) => {
    const kits = [
        { name: 'Kit Básico', description: 'Para iniciantes', value: 100 },
        { name: 'Kit Premium', description: 'Recursos avançados', value: 300 },
        { name: 'Kit Deluxe', description: 'Tudo incluído', value: 500 }
    ];

    const handleChoose = async (choiceIndex) => {
        await onPlay('choose', choiceIndex.toString());
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p>🎁 Escolha o melhor kit!</p>
            <div style={{ margin: '15px 0' }}>
                {kits.map((kit, index) => (
                    <Button
                        key={index}
                        onClick={() => handleChoose(index)}
                        style={{
                            display: 'block',
                            width: '100%',
                            margin: '5px 0',
                            padding: '10px'
                        }}
                        variant="secondary"
                    >
                        <strong>{kit.name}</strong><br />
                        <small>{kit.description}</small>
                    </Button>
                ))}
            </div>
            {gameState.won !== undefined && (
                <div style={{ marginTop: '15px' }}>
                    <p style={{ color: gameState.won ? 'green' : 'red' }}>
                        {gameState.won ? 'Parabéns! Você ganhou!' : 'Não foi dessa vez'}
                    </p>
                    {gameState.won && (
                        <p>Você ganhou {gameState.kitValue} pontos!</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Função utilitária para títulos dos jogos
const getGameTitle = (gameType) => {
    const titles = {
        roleta: '🎰 Roleta Virtual',
        raspadinha: '🧽 Raspadinha',
        caca_preco: '💰 Caça-Preço',
        quiz: '📚 Quiz',
        monte_kit: '🎁 Monte seu Kit'
    };
    return titles[gameType] || 'Minigame';
};

export default GameContainer;