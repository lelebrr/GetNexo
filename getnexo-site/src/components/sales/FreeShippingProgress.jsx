import React, { useState, useEffect } from 'react';

const FreeShippingProgress = ({
    threshold = 100, // R$
    currentCartValue = 0,
    progressBarColor = '#4CAF50',
    text = 'Faltam R$ {{amount}} para frete grátis!',
    successText = '🎉 Frete grátis liberado!',
    showAmount = true,
    position = 'cart', // 'cart', 'header', 'product'
    onThresholdReached = () => { },
    style = {}
}) => {
    const [progress, setProgress] = useState(0);
    const [remaining, setRemaining] = useState(threshold - currentCartValue);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const newRemaining = Math.max(0, threshold - currentCartValue);
        const newProgress = Math.min(100, (currentCartValue / threshold) * 100);

        setRemaining(newRemaining);
        setProgress(newProgress);

        const newIsCompleted = currentCartValue >= threshold;
        if (newIsCompleted && !isCompleted) {
            setIsCompleted(true);
            onThresholdReached();
        } else if (!newIsCompleted && isCompleted) {
            setIsCompleted(false);
        }
    }, [currentCartValue, threshold, isCompleted, onThresholdReached]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getProgressBarStyle = () => {
        return {
            width: '100%',
            height: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            ...style
        };
    };

    const getFillStyle = () => {
        const baseStyle = {
            height: '100%',
            background: progressBarColor,
            borderRadius: '6px',
            transition: 'width 0.5s ease-in-out',
            position: 'relative'
        };

        // Adicionar brilho quando está completo
        if (isCompleted) {
            return {
                ...baseStyle,
                width: '100%',
                background: `linear-gradient(90deg, ${progressBarColor}, #66BB6A)`,
                boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
                animation: 'pulse 2s infinite'
            };
        }

        return {
            ...baseStyle,
            width: `${progress}%`
        };
    };

    const renderCartStyle = () => (
        <div style={{
            padding: '16px',
            background: isCompleted ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' : 'linear-gradient(135deg, #2196F3, #21CBF3)',
            borderRadius: '8px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            ...style
        }}>
            {/* Fundo com padrão sutil */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z"/%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.1
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}>
                    <span style={{ marginRight: '8px' }}>
                        {isCompleted ? '🚚' : '📦'}
                    </span>
                    <span>
                        {isCompleted ? successText : 'Frete Grátis'}
                    </span>
                </div>

                <div style={getProgressBarStyle()}>
                    <div style={getFillStyle()}>
                        {progress > 50 && (
                            <div style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}>
                                {Math.round(progress)}%
                            </div>
                        )}
                    </div>
                </div>

                <div style={{
                    marginTop: '12px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {isCompleted ? (
                        <span style={{ color: '#E8F5E8', fontWeight: 'bold' }}>
                            Parabéns! Você ganhou frete grátis!
                        </span>
                    ) : (
                        <span>
                            {text.replace('{{amount}}', showAmount ? formatCurrency(remaining) : remaining.toString())}
                        </span>
                    )}
                </div>

                {!isCompleted && (
                    <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        opacity: 0.9,
                        textAlign: 'center'
                    }}>
                        {formatCurrency(currentCartValue)} de {formatCurrency(threshold)}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
                    }
                }
            `}</style>
        </div>
    );

    const renderHeaderStyle = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: isCompleted ? '#4CAF50' : '#2196F3',
            color: 'white',
            padding: '8px 16px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transform: isCompleted ? 'translateY(0)' : 'translateY(0)',
            transition: 'all 0.3s ease',
            ...style
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}>
                <span>{isCompleted ? '🎉' : '🚚'}</span>
                <span style={{ fontWeight: 'bold' }}>
                    {isCompleted
                        ? successText
                        : text.replace('{{amount}}', showAmount ? formatCurrency(remaining) : remaining.toString())
                    }
                </span>
            </div>

            {!isCompleted && (
                <div style={getProgressBarStyle()}>
                    <div style={getFillStyle()} />
                </div>
            )}
        </div>
    );

    const renderProductStyle = () => (
        <div style={{
            display: 'inline-block',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: `2px solid ${progressBarColor}`,
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            ...style
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px'
            }}>
                <span>🚚</span>
                <span>
                    {isCompleted
                        ? successText
                        : 'Frete Grátis'
                    }
                </span>
            </div>

            {!isCompleted && (
                <>
                    <div style={getProgressBarStyle()}>
                        <div style={getFillStyle()} />
                    </div>
                    <div style={{
                        marginTop: '4px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        {text.replace('{{amount}}', showAmount ? formatCurrency(remaining) : remaining.toString())}
                    </div>
                </>
            )}
        </div>
    );

    switch (position) {
        case 'header':
            return renderHeaderStyle();
        case 'product':
            return renderProductStyle();
        case 'cart':
        default:
            return renderCartStyle();
    }
};

export default FreeShippingProgress;