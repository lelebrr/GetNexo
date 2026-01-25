'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente SentimentIndicator
 * Exibe ícone de sentimento baseado na pontuação (1-10)
 * Mostra emoji, badge e tooltip com informações detalhadas
 */
const SentimentIndicator = ({
    score = 5,
    sentiment = 'neutral',
    category = 'neutro',
    confidence = 0.8,
    showBadge = true,
    showTooltip = true,
    size = 'medium'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        if (import.meta.env.DEV) console.log('SentimentIndicator Fixed v1.2.0 Loaded');
        // Animação de entrada
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Prevent hydration mismatch by returning null or skeleton until mounted
    if (!isLoaded) return <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>;

    // Determina o emoji baseado no score
    const getEmoji = () => {
        if (score <= 2) return '😡'; // Muito raiva
        if (score <= 4) return '😠'; // Raiva
        if (score <= 6) return '😐'; // Neutro
        if (score <= 8) return '😊'; // Satisfeito
        return '🤩'; // Muito satisfeito
    };

    // Determina a cor baseada no score
    const getColor = () => {
        if (score <= 2) return '#ef4444'; // red-500
        if (score <= 4) return '#f97316'; // orange-500
        if (score <= 6) return '#eab308'; // yellow-500
        if (score <= 8) return '#22c55e'; // green-500
        return '#10b981'; // emerald-500
    };

    // Determina o tamanho
    const getSize = () => {
        switch (size) {
            case 'small': return 'w-6 h-6 text-sm';
            case 'large': return 'w-12 h-12 text-2xl';
            default: return 'w-8 h-8 text-lg';
        }
    };

    // Determina o nível de sentimento
    const getSentimentLevel = () => {
        if (score <= 2) return 'Muito Negativo';
        if (score <= 4) return 'Negativo';
        if (score <= 6) return 'Neutro';
        if (score <= 8) return 'Positivo';
        return 'Muito Positivo';
    };

    // Determina a categoria
    const getCategoryLabel = () => {
        switch (category) {
            case 'raiva': return 'Raiva';
            case 'frustracao': return 'Frustração';
            case 'neutro': return 'Neutro';
            case 'satisfacao': return 'Satisfação';
            case 'empolgação': return 'Empolgação';
            default: return 'Desconhecido';
        }
    };

    // Determina se deve alertar
    const shouldAlert = () => {
        return score <= 2 || score >= 9;
    };

    return (
        <div className={`relative inline-flex items-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Ícone principal */}
            <div
                className={`${getSize()} flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110`}
                style={{
                    backgroundColor: showBadge ? `${getColor()}15` : 'transparent',
                    border: showBadge ? `2px solid ${getColor()}` : 'none'
                }}
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
                title={showTooltip ? `${getSentimentLevel()} (${score}/10)` : ''}
            >
                <span className="select-none">{getEmoji()}</span>
            </div>

            {/* Badge de alerta */}
            {shouldAlert() && (
                <div className="absolute -top-1 -right-1">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${score <= 2 ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                </div>
            )}

            {/* Tooltip detalhado */}
            {showTooltip && showDetails && (
                <div className="absolute z-50 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 min-w-max -top-16 left-1/2 transform -translate-x-1/2">
                    {/* Seta do tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>

                    <div className="space-y-1">
                        <div className="font-semibold text-center">
                            {getSentimentLevel()} ({score}/10)
                        </div>
                        <div className="text-xs text-gray-300 text-center">
                            Categoria: {getCategoryLabel()}
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                            Confiança: {Math.round(confidence * 100)}%
                        </div>

                        {/* Barra de progresso */}
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${score * 10}%`,
                                    backgroundColor: getColor()
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Badge numérico opcional */}
            {showBadge && (
                <span
                    className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full"
                    style={{
                        backgroundColor: getColor(),
                        color: 'white'
                    }}
                >
                    {score}
                </span>
            )}
        </div>
    );
};

SentimentIndicator.propTypes = {
    score: PropTypes.number.isRequired,
    sentiment: PropTypes.string,
    category: PropTypes.string,
    confidence: PropTypes.number,
    showBadge: PropTypes.bool,
    showTooltip: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default SentimentIndicator;
