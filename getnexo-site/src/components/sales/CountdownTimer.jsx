import React, { useState, useEffect } from 'react';

const CountdownTimer = ({
    duration = 59, // minutos
    format = 'MM:SS',
    text = 'Expira em',
    color = '#ff4444',
    position = 'top-right',
    onExpire = () => { },
    autoRestart = true,
    style = {}
}) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60); // converter para segundos
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            onExpire();
            if (autoRestart) {
                // Reiniciar o timer
                setTimeLeft(duration * 60);
                setIsExpired(false);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, duration, onExpire, autoRestart]);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        if (format === 'HH:MM:SS') {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getPositionStyle = () => {
        const baseStyle = {
            position: 'fixed',
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: `2px solid ${color}`,
            animation: isExpired ? 'pulse 1s infinite' : 'none',
            ...style
        };

        switch (position) {
            case 'top-left':
                return { ...baseStyle, top: '20px', left: '20px' };
            case 'top-right':
                return { ...baseStyle, top: '20px', right: '20px' };
            case 'bottom-left':
                return { ...baseStyle, bottom: '20px', left: '20px' };
            case 'bottom-right':
                return { ...baseStyle, bottom: '20px', right: '20px' };
            case 'center':
                return {
                    ...baseStyle,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                };
            default:
                return { ...baseStyle, top: '20px', right: '20px' };
        }
    };

    if (isExpired && !autoRestart) {
        return null; // Não mostrar se expirou e não reinicia automaticamente
    }

    return (
        <div style={getPositionStyle()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: color }}>⏰</span>
                <span>{text}</span>
                <span style={{
                    color: color,
                    fontFamily: 'monospace',
                    fontSize: '16px'
                }}>
                    {formatTime()}
                </span>
                {isExpired && autoRestart && (
                    <span style={{ color: '#ff6b35', fontSize: '12px' }}>
                        (reiniciando...)
                    </span>
                )}
            </div>

            {/* Barra de progresso visual */}
            <div style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                marginTop: '6px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${(timeLeft / (duration * 60)) * 100}%`,
                    height: '100%',
                    background: color,
                    transition: 'width 1s linear',
                    borderRadius: '2px'
                }} />
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.05);
                    }
                }
            `}</style>
        </div>
    );
};

export default CountdownTimer;