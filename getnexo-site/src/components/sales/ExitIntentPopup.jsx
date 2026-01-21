import React, { useEffect, useState } from 'react';

const ExitIntentPopup = ({
    discount = 5,
    title = 'Espere!',
    message = 'Não vá embora sem este desconto especial!',
    buttonText = 'Pegar Desconto',
    couponCode = 'EXIT5OFF',
    imageUrl = '',
    triggerDelay = 5000,
    showOncePerSession = true,
    onAccept = () => { },
    style = {}
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        if (hasShown && showOncePerSession) return;

        let timeoutId;
        let mouseLeaveHandler;

        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 && !hasShown) {
                timeoutId = setTimeout(() => {
                    setIsVisible(true);
                    setHasShown(true);
                }, triggerDelay);
            }
        };

        const handleMouseEnter = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [triggerDelay, hasShown, showOncePerSession]);

    const handleAccept = () => {
        onAccept(couponCode);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.3s ease',
            ...style
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '90%',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                animation: 'slideUp 0.3s ease'
            }}>
                {/* Botão fechar */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    ×
                </button>

                {/* Imagem */}
                {imageUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img
                            src={imageUrl}
                            alt="Desconto especial"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                )}

                {/* Conteúdo */}
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '16px'
                    }}>
                        {title}
                    </h2>

                    <p style={{
                        fontSize: '18px',
                        color: '#666',
                        marginBottom: '24px',
                        lineHeight: '1.5'
                    }}>
                        {message}
                    </p>

                    {/* Desconto */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            {discount}% OFF
                        </div>
                        <div style={{ fontSize: '16px' }}>
                            Código: <strong>{couponCode}</strong>
                        </div>
                    </div>

                    {/* Botão */}
                    <button
                        onClick={handleAccept}
                        style={{
                            background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                            color: 'white',
                            border: 'none',
                            padding: '16px 32px',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ExitIntentPopup;