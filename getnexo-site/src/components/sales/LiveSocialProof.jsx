import React, { useState, useEffect } from 'react';

const LiveSocialProof = ({
    notifications = [],
    mode = 'live', // 'live', 'static', 'hybrid'
    updateInterval = 30, // segundos
    textTemplate = '{{name}} {{location}} comprou',
    animationDuration = 5000, // ms
    maxNotifications = 10,
    position = 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    onNotificationShown = () => { },
    style = {}
}) => {
    const [currentNotification, setCurrentNotification] = useState(null);
    const [notificationQueue, setNotificationQueue] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    // Lista de notificações simuladas se nenhuma for fornecida
    const defaultNotifications = [
        { name: 'João Silva', location: 'SP', product: 'iPhone 15', timeAgo: 'agora' },
        { name: 'Maria Santos', location: 'RJ', product: 'Samsung S24', timeAgo: '2 min atrás' },
        { name: 'Pedro Oliveira', location: 'MG', product: 'MacBook Pro', timeAgo: '5 min atrás' },
        { name: 'Ana Costa', location: 'RS', product: 'iPad Air', timeAgo: '8 min atrás' },
        { name: 'Carlos Lima', location: 'BA', product: 'AirPods Pro', timeAgo: '12 min atrás' },
        { name: 'Fernanda Rocha', location: 'PR', product: 'Apple Watch', timeAgo: '15 min atrás' },
        { name: 'Roberto Alves', location: 'CE', product: 'iPhone SE', timeAgo: '18 min atrás' },
        { name: 'Juliana Pereira', location: 'PE', product: 'Samsung Galaxy', timeAgo: '22 min atrás' },
        { name: 'Marcos Vieira', location: 'GO', product: 'Mac Mini', timeAgo: '25 min atrás' },
        { name: 'Camila Santos', location: 'SC', product: 'iPhone 14', timeAgo: '28 min atrás' }
    ];

    // Função para gerar uma notificação aleatória
    const generateRandomNotification = () => {
        const availableNotifications = notifications.length > 0 ? notifications : defaultNotifications;
        const randomIndex = Math.floor(Math.random() * availableNotifications.length);
        const notification = availableNotifications[randomIndex];

        // Adicionar variação de tempo se for live
        if (mode === 'live') {
            notification.timeAgo = 'agora';
        }

        return {
            ...notification,
            id: Date.now() + Math.random(),
            enabled: true
        };
    };

    // Função para mostrar próxima notificação
    const showNextNotification = () => {
        if (notificationQueue.length === 0) {
            // Gerar nova notificação se a fila estiver vazia
            const newNotification = generateRandomNotification();
            setNotificationQueue([newNotification]);
        }

        const nextNotification = notificationQueue[0];
        setCurrentNotification(nextNotification);
        setIsVisible(true);

        // Remover da fila após mostrar
        setNotificationQueue(prev => prev.slice(1));

        onNotificationShown(nextNotification);

        // Esconder após a duração da animação
        setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentNotification(null);
            }, 300); // Tempo para animação de saída
        }, animationDuration);
    };

    useEffect(() => {
        if (mode === 'static' && notifications.length > 0) {
            // Modo estático: mostrar notificações da lista fornecida
            setNotificationQueue(notifications.slice(0, maxNotifications));
        }
    }, [mode, notifications, maxNotifications]);

    useEffect(() => {
        if (mode === 'live' || mode === 'hybrid') {
            // Iniciar timer para mostrar notificações
            const interval = setInterval(() => {
                showNextNotification();
            }, updateInterval * 1000);

            // Mostrar primeira notificação imediatamente (com delay pequeno)
            setTimeout(() => {
                showNextNotification();
            }, 2000);

            return () => clearInterval(interval);
        } else if (mode === 'static') {
            // Modo estático: mostrar notificações sequencialmente
            let index = 0;
            const staticInterval = setInterval(() => {
                if (index < notificationQueue.length) {
                    const notification = { ...notificationQueue[index], id: Date.now() };
                    setCurrentNotification(notification);
                    setIsVisible(true);

                    setTimeout(() => {
                        setIsVisible(false);
                        setTimeout(() => {
                            setCurrentNotification(null);
                        }, 300);
                    }, animationDuration);

                    index++;
                } else {
                    clearInterval(staticInterval);
                }
            }, updateInterval * 1000);

            return () => clearInterval(staticInterval);
        }
    }, [mode, updateInterval, animationDuration, notificationQueue]);

    const getPositionStyle = () => {
        const baseStyle = {
            position: 'fixed',
            zIndex: 9999,
            maxWidth: '300px',
            transition: 'all 0.3s ease-in-out',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
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
            default:
                return { ...baseStyle, bottom: '20px', right: '20px' };
        }
    };

    if (!currentNotification) return null;

    const notificationText = textTemplate
        .replace('{{name}}', currentNotification.name)
        .replace('{{location}}', currentNotification.location)
        .replace('{{product}}', currentNotification.product || '')
        .replace('{{timeAgo}}', currentNotification.timeAgo);

    return (
        <div style={getPositionStyle()}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Fundo animado sutil */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    animation: 'moveBackground 20s linear infinite'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Avatar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            marginRight: '10px',
                            color: 'white'
                        }}>
                            {currentNotification.name.charAt(0)}
                        </div>
                        <div>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginBottom: '2px'
                            }}>
                                {currentNotification.name}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                opacity: 0.9
                            }}>
                                {currentNotification.location} • {currentNotification.timeAgo}
                            </div>
                        </div>
                    </div>

                    {/* Mensagem */}
                    <div style={{
                        fontSize: '14px',
                        lineHeight: '1.4',
                        marginBottom: '8px'
                    }}>
                        {notificationText}
                        {currentNotification.product && (
                            <span style={{
                                fontWeight: 'bold',
                                color: '#ffd700'
                            }}>
                                {' ' + currentNotification.product}
                            </span>
                        )}
                    </div>

                    {/* Badge de verificação */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                    }}>
                        <span style={{ marginRight: '4px' }}>✓</span>
                        Verificado
                    </div>
                </div>

                {/* Barra de progresso */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '0 0 12px 12px',
                    animation: `progressBar ${animationDuration}ms linear forwards`
                }} />
            </div>

            <style jsx>{`
                @keyframes progressBar {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                @keyframes moveBackground {
                    from {
                        transform: translateX(0) translateY(0);
                    }
                    to {
                        transform: translateX(60px) translateY(60px);
                    }
                }
            `}</style>
        </div>
    );
};

export default LiveSocialProof;