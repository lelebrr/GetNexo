import React, { useState, useEffect } from 'react';

const CartRecoveryWhatsApp = ({
    whatsappNumber = '5511999999999',
    messageTemplate = 'Olá! Vi que você abandonou seu carrinho. Que tal finalizar sua compra?',
    sendPhoto = true,
    photoUrl = '',
    delayHours = 2,
    maxAttempts = 3,
    onRecoverySent = () => { },
    style = {}
}) => {
    const [cartData, setCartData] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Simular detecção de carrinho abandonado
        const checkAbandonedCart = () => {
            const cart = localStorage.getItem('cart');
            if (cart && JSON.parse(cart).items?.length > 0) {
                setCartData(JSON.parse(cart));
                setIsActive(true);
            }
        };

        checkAbandonedCart();

        // Timer para enviar recuperação após delay
        if (isActive && attempts < maxAttempts) {
            const timer = setTimeout(() => {
                sendRecoveryMessage();
            }, delayHours * 60 * 60 * 1000); // converter horas para ms

            return () => clearTimeout(timer);
        }
    }, [isActive, attempts, delayHours, maxAttempts]);

    const sendRecoveryMessage = () => {
        if (!cartData || attempts >= maxAttempts) return;

        const message = messageTemplate
            .replace('{{cartValue}}', `R$ ${cartData.total || '0'}`)
            .replace('{{itemCount}}', cartData.items?.length || 0);

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        if (sendPhoto && photoUrl) {
            // Simular envio com foto (em produção, usaria API do WhatsApp)
            console.log('Enviando recuperação com foto:', photoUrl);
        }

        // Abrir WhatsApp (ou simular envio)
        window.open(whatsappUrl, '_blank');

        setAttempts(prev => prev + 1);
        onRecoverySent(cartData, attempts + 1);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    if (!isActive || !cartData) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxWidth: '300px',
            cursor: 'pointer',
            animation: 'slideInLeft 0.5s ease',
            ...style
        }} onClick={sendRecoveryMessage}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Ícone WhatsApp */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                }}>
                    📱
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                    }}>
                        Recuperamos seu carrinho!
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                        {cartData.items?.length || 0} itens • {formatCurrency(cartData.total)}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        opacity: 0.8,
                        marginTop: '4px'
                    }}>
                        Clique para finalizar no WhatsApp
                    </div>
                </div>
            </div>

            {/* Preview da mensagem */}
            <div style={{
                marginTop: '12px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                fontSize: '11px',
                lineHeight: '1.4'
            }}>
                💬 {messageTemplate}
            </div>

            <style jsx>{`
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default CartRecoveryWhatsApp;