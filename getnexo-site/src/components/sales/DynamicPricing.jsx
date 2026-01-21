import React, { useState, useEffect } from 'react';

const DynamicPricing = ({
    basePrice = 100,
    minDiscount = 5, // %
    maxDiscount = 20, // %
    negotiationSteps = 3,
    aiPersonality = 'aggressive', // 'aggressive', 'moderate', 'conservative'
    responseDelay = 2000, // ms
    inputPlaceholder = 'Digite sua proposta...',
    acceptText = 'Aceitar proposta',
    counterText = 'Fazer contra-proposta',
    onAccept = () => { },
    onCounter = () => { },
    onFinalPrice = () => { },
    style = {}
}) => {
    const [currentPrice, setCurrentPrice] = useState(basePrice);
    const [userOffer, setUserOffer] = useState('');
    const [negotiationHistory, setNegotiationHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [finalPrice, setFinalPrice] = useState(null);
    const [showAcceptButton, setShowAcceptButton] = useState(false);

    // Lógica de negociação baseada na personalidade da IA
    const generateCounterOffer = (userOfferValue) => {
        const discountRange = maxDiscount - minDiscount;
        const baseDiscount = minDiscount + (discountRange * getPersonalityMultiplier());

        // Calcular desconto baseado na oferta do usuário e personalidade
        let discount = baseDiscount;

        if (userOfferValue >= basePrice * 0.9) {
            // Oferta muito boa, dar desconto maior
            discount = Math.min(maxDiscount, baseDiscount + 5);
        } else if (userOfferValue >= basePrice * 0.8) {
            // Oferta boa, desconto normal
            discount = baseDiscount;
        } else if (userOfferValue >= basePrice * 0.7) {
            // Oferta razoável, desconto menor
            discount = Math.max(minDiscount, baseDiscount - 3);
        } else {
            // Oferta muito baixa, desconto mínimo
            discount = minDiscount;
        }

        // Adicionar variação aleatória pequena
        const variation = (Math.random() - 0.5) * 2; // -1% a +1%
        discount = Math.max(minDiscount, Math.min(maxDiscount, discount + variation));

        return Math.round(basePrice * (1 - discount / 100));
    };

    const getPersonalityMultiplier = () => {
        switch (aiPersonality) {
            case 'aggressive': return 0.8; // Mais desconto
            case 'moderate': return 0.5;  // Desconto médio
            case 'conservative': return 0.2; // Menos desconto
            default: return 0.5;
        }
    };

    const getNegotiationMessage = (counterOffer, userOfferValue) => {
        const discount = ((basePrice - counterOffer) / basePrice) * 100;
        const messages = {
            aggressive: [
                `Posso oferecer R$ ${counterOffer} (${discount.toFixed(0)}% de desconto)! É uma oferta excelente!`,
                `Que tal R$ ${counterOffer}? É o melhor preço que posso dar!`,
                `Especialmente para você: R$ ${counterOffer}! Não perca esta oportunidade!`
            ],
            moderate: [
                `Posso aceitar R$ ${counterOffer} com ${discount.toFixed(0)}% de desconto.`,
                `Que tal R$ ${counterOffer}? É um bom negócio para ambos.`,
                `Posso oferecer R$ ${counterOffer}. É uma proposta justa.`
            ],
            conservative: [
                `O mínimo que posso oferecer é R$ ${counterOffer}.`,
                `Posso chegar até R$ ${counterOffer}, mas é meu limite.`,
                `R$ ${counterOffer} é o melhor que posso fazer.`
            ]
        };

        const personalityMessages = messages[aiPersonality] || messages.moderate;
        return personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
    };

    const handleSubmitOffer = async () => {
        const offerValue = parseFloat(userOffer);
        if (isNaN(offerValue) || offerValue <= 0) return;

        setIsNegotiating(true);

        // Adicionar oferta do usuário ao histórico
        const newHistory = [...negotiationHistory, {
            type: 'user',
            value: offerValue,
            message: `Sua proposta: R$ ${offerValue}`,
            timestamp: new Date()
        }];
        setNegotiationHistory(newHistory);

        // Simular delay de resposta da IA
        setTimeout(() => {
            const counterOffer = generateCounterOffer(offerValue);
            const aiMessage = getNegotiationMessage(counterOffer, offerValue);

            const updatedHistory = [...newHistory, {
                type: 'ai',
                value: counterOffer,
                message: aiMessage,
                timestamp: new Date()
            }];

            setNegotiationHistory(updatedHistory);
            setCurrentPrice(counterOffer);
            setCurrentStep(prev => prev + 1);
            setIsNegotiating(false);
            setShowAcceptButton(true);

            onCounter(offerValue, counterOffer);
        }, responseDelay);
    };

    const handleAccept = () => {
        setFinalPrice(currentPrice);
        onAccept(currentPrice);
        onFinalPrice(currentPrice);
    };

    const canNegotiate = currentStep < negotiationSteps && !finalPrice;

    if (finalPrice) {
        return (
            <div style={{
                padding: '20px',
                background: '#f0f9ff',
                border: '2px solid #0ea5e9',
                borderRadius: '8px',
                textAlign: 'center',
                ...style
            }}>
                <div style={{ fontSize: '24px', color: '#0ea5e9', marginBottom: '10px' }}>
                    🎉 Preço Final Acordado!
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>
                    R$ {finalPrice}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
                    Você economizou R$ {(basePrice - finalPrice)}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            background: 'white',
            ...style
        }}>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Preço Original: <span style={{ textDecoration: 'line-through', color: '#6b7280' }}>R$ {basePrice}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                    Preço Atual: R$ {currentPrice}
                </div>
                <div style={{ fontSize: '14px', color: '#059669' }}>
                    Economize R$ {basePrice - currentPrice} ({(((basePrice - currentPrice) / basePrice) * 100).toFixed(0)}% de desconto)
                </div>
            </div>

            {/* Histórico de negociação */}
            <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '20px',
                padding: '10px',
                background: '#f9fafb',
                borderRadius: '4px'
            }}>
                {negotiationHistory.map((item, index) => (
                    <div key={index} style={{
                        marginBottom: '10px',
                        padding: '8px',
                        borderRadius: '4px',
                        background: item.type === 'user' ? '#e0f2fe' : '#f0fdf4',
                        borderLeft: `3px solid ${item.type === 'user' ? '#0284c7' : '#16a34a'}`
                    }}>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: item.type === 'user' ? '#0284c7' : '#16a34a',
                            marginBottom: '4px'
                        }}>
                            {item.type === 'user' ? 'Você' : 'Vendedor IA'}
                        </div>
                        <div style={{ fontSize: '14px' }}>{item.message}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {item.timestamp.toLocaleTimeString('pt-BR')}
                        </div>
                    </div>
                ))}

                {isNegotiating && (
                    <div style={{
                        padding: '8px',
                        textAlign: 'center',
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>
                        💭 O vendedor está pensando na sua proposta...
                    </div>
                )}
            </div>

            {/* Formulário de negociação */}
            {canNegotiate && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            placeholder={inputPlaceholder}
                            value={userOffer}
                            onChange={(e) => setUserOffer(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                            disabled={isNegotiating}
                        />
                        <button
                            onClick={handleSubmitOffer}
                            disabled={isNegotiating || !userOffer}
                            style={{
                                padding: '10px 20px',
                                background: isNegotiating ? '#6b7280' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isNegotiating ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isNegotiating ? '...' : counterText}
                        </button>
                    </div>
                </div>
            )}

            {/* Botão de aceitar */}
            {showAcceptButton && (
                <button
                    onClick={handleAccept}
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#047857'}
                    onMouseOut={(e) => e.target.style.background = '#059669'}
                >
                    {acceptText} - R$ {currentPrice}
                </button>
            )}

            {/* Status da negociação */}
            <div style={{
                marginTop: '15px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#6b7280'
            }}>
                {currentStep < negotiationSteps
                    ? `Rodada ${currentStep + 1} de ${negotiationSteps}`
                    : 'Última oferta disponível'
                }
            </div>
        </div>
    );
};

export default DynamicPricing;