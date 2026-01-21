import React, { useState, useEffect } from 'react';

export default function InteractiveGame() {
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [clicks, setClicks] = useState(0);
    const [bestScore, setBestScore] = useState(localStorage.getItem('game_best_score') || 0);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState('result');
            if (clicks > bestScore) {
                setBestScore(clicks);
                localStorage.setItem('game_best_score', clicks);
            }
        }
        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(10);
        setClicks(0);
    };

    const handleClick = () => {
        if (gameState === 'playing') {
            setClicks(clicks + 1);
            setScore(score + 10);
        }
    };

    const resetGame = () => {
        setGameState('waiting');
        setScore(0);
        setTimeLeft(10);
        setClicks(0);
    };

    return (
        <div className="interactive-game bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Jogo Interativo GetNexo</h2>
            <p className="text-center mb-4 text-gray-600">Clique o máximo possível em 10 segundos!</p>

            {gameState === 'waiting' && (
                <div className="text-center">
                    <button
                        onClick={startGame}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Iniciar Jogo
                    </button>
                    {bestScore > 0 && (
                        <p className="mt-4 text-sm text-gray-500">Melhor pontuação: {bestScore} cliques</p>
                    )}
                </div>
            )}

            {gameState === 'playing' && (
                <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-4">{timeLeft}</div>
                    <div className="text-xl mb-4">Cliques: {clicks}</div>
                    <button
                        onClick={handleClick}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-colors transform hover:scale-105"
                    >
                        CLIQUE AQUI!
                    </button>
                </div>
            )}

            {gameState === 'result' && (
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-4">Fim de Jogo!</h3>
                    <p className="text-lg mb-2">Cliques: {clicks}</p>
                    <p className="text-lg mb-4">Pontuação: {score}</p>
                    {clicks > bestScore && <p className="text-green-600 font-bold">Novo recorde!</p>}
                    <button
                        onClick={resetGame}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mr-2"
                    >
                        Jogar Novamente
                    </button>
                </div>
            )}
        </div>
    );
}