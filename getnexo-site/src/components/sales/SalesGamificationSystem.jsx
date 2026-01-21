import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import DynamicStock from './DynamicStock';
import DynamicPricing from './DynamicPricing';
import FreeShippingProgress from './FreeShippingProgress';
import LiveSocialProof from './LiveSocialProof';
import ExitIntentPopup from './ExitIntentPopup';
import CartRecoveryWhatsApp from './CartRecoveryWhatsApp';
import CompetitorComparison from './CompetitorComparison';

const SalesGamificationSystem = ({
    productId,
    category,
    userSegment,
    cartValue = 0,
    style = {}
}) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        fetchGamificationConfig();
        detectUserLocation();
    }, [productId, category, userSegment]);

    const fetchGamificationConfig = async () => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                productId: productId || '',
                category: category || '',
                userSegment: userSegment || ''
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification/config?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const configData = await response.json();
                // Verificar se a configuração está disponível para este usuário
                if (configData && configData.isAvailableForUser({ location: userLocation })) {
                    setConfig(configData);
                }
            }
        } catch (err) {
            console.error('Erro ao carregar configuração de gamificação:', err);
        } finally {
            setLoading(false);
        }
    };

    const detectUserLocation = () => {
        // Simulação de detecção de localização (em produção, usar geolocation API ou IP)
        setUserLocation({
            country: 'BR',
            region: 'SP'
        });
    };

    const recordImpression = async (componentType) => {
        if (!config) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification/${config._id}/impression`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ componentType }),
            });
        } catch (err) {
            console.error('Erro ao registrar impressão:', err);
        }
    };

    const recordClick = async (componentType) => {
        if (!config) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification/${config._id}/click`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ componentType }),
            });
        } catch (err) {
            console.error('Erro ao registrar clique:', err);
        }
    };

    const recordConversion = async (componentType, revenue = 0) => {
        if (!config) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification/${config._id}/conversion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ componentType, revenue }),
            });
        } catch (err) {
            console.error('Erro ao registrar conversão:', err);
        }
    };

    useEffect(() => {
        if (config) {
            // Registrar impressão quando a configuração é carregada
            recordImpression('system');
        }
    }, [config]);

    if (loading) {
        return <div>Carregando gamificação...</div>;
    }

    if (!config) {
        return null; // Não mostrar nada se não houver configuração aplicável
    }

    return (
        <div style={{ position: 'relative', ...style }}>
            {/* Contador Regressivo */}
            {config.countdown.enabled && (
                <CountdownTimer
                    duration={config.countdown.duration}
                    format={config.countdown.format}
                    text={config.countdown.text}
                    color={config.countdown.color}
                    position={config.countdown.position}
                    autoRestart={config.countdown.autoRestart}
                    onExpire={() => recordImpression('countdown_expired')}
                />
            )}

            {/* Estoque Dinâmico */}
            {config.stock.enabled && (
                <DynamicStock
                    mode={config.stock.mode}
                    realStock={10} // Em produção, buscar do backend
                    fakeStockRange={config.stock.fakeStockRange}
                    updateInterval={config.stock.updateInterval}
                    lowStockThreshold={config.stock.lowStockThreshold}
                    lowStockText={config.stock.lowStockText}
                    outOfStockText={config.stock.outOfStockText}
                    showProgressBar={config.stock.showProgressBar}
                    progressBarColor={config.stock.progressBarColor}
                    onStockChange={(stock, status) => {
                        if (status.isLowStock) recordImpression('low_stock');
                        if (status.isOutOfStock) recordImpression('out_of_stock');
                    }}
                />
            )}

            {/* Preço Dinâmico com IA */}
            {config.pricing.enabled && (
                <DynamicPricing
                    basePrice={config.pricing.basePrice}
                    minDiscount={config.pricing.minDiscount}
                    maxDiscount={config.pricing.maxDiscount}
                    negotiationSteps={config.pricing.negotiationSteps}
                    aiPersonality={config.pricing.aiPersonality}
                    responseDelay={config.pricing.responseDelay}
                    inputPlaceholder={config.pricing.inputPlaceholder}
                    acceptText={config.pricing.acceptText}
                    counterText={config.pricing.counterText}
                    onAccept={(price) => recordConversion('dynamic_pricing', price)}
                    onCounter={(userOffer, aiOffer) => recordClick('pricing_negotiation')}
                    onFinalPrice={(price) => recordConversion('dynamic_pricing_final', price)}
                />
            )}

            {/* Barra de Progresso Frete Grátis */}
            {config.freeShipping.enabled && (
                <FreeShippingProgress
                    threshold={config.freeShipping.threshold}
                    currentCartValue={cartValue}
                    progressBarColor={config.freeShipping.progressBarColor}
                    text={config.freeShipping.text}
                    successText={config.freeShipping.successText}
                    showAmount={config.freeShipping.showAmount}
                    position={config.freeShipping.position}
                    onThresholdReached={() => recordConversion('free_shipping_unlocked')}
                />
            )}

            {/* Social Proof ao Vivo */}
            {config.socialProof.enabled && (
                <LiveSocialProof
                    notifications={config.socialProof.notifications}
                    mode={config.socialProof.mode}
                    updateInterval={config.socialProof.updateInterval}
                    textTemplate={config.socialProof.textTemplate}
                    animationDuration={config.socialProof.animationDuration}
                    maxNotifications={config.socialProof.maxNotifications}
                    position={config.socialProof.position}
                    onNotificationShown={(notification) => recordImpression('social_proof')}
                />
            )}

            {/* Pop-up de Saída */}
            {config.exitPopup.enabled && (
                <ExitIntentPopup
                    discount={config.exitPopup.discount}
                    title={config.exitPopup.title}
                    message={config.exitPopup.message}
                    buttonText={config.exitPopup.buttonText}
                    couponCode={config.exitPopup.couponCode}
                    imageUrl={config.exitPopup.imageUrl}
                    triggerDelay={config.exitPopup.triggerDelay}
                    showOncePerSession={config.exitPopup.showOncePerSession}
                    onAccept={(coupon) => recordConversion('exit_popup', 0)}
                />
            )}

            {/* Recuperação de Carrinho WhatsApp */}
            {config.cartRecovery.enabled && (
                <CartRecoveryWhatsApp
                    whatsappNumber={config.cartRecovery.whatsappNumber}
                    messageTemplate={config.cartRecovery.messageTemplate}
                    sendPhoto={config.cartRecovery.sendPhoto}
                    photoUrl={config.cartRecovery.photoUrl}
                    delayHours={config.cartRecovery.delayHours}
                    maxAttempts={config.cartRecovery.maxAttempts}
                    onRecoverySent={(cart, attempt) => recordConversion('cart_recovery', cart.total)}
                />
            )}

            {/* Comparativo Concorrente */}
            {config.competitorComparison.enabled && (
                <CompetitorComparison
                    competitors={config.competitorComparison.competitors}
                    ourAdvantages={config.competitorComparison.ourAdvantages}
                    highlightColor={config.competitorComparison.highlightColor}
                    showRatings={config.competitorComparison.showRatings}
                    comparisonTable={config.competitorComparison.comparisonTable}
                    onCompetitorClick={(competitor) => recordClick('competitor_comparison')}
                />
            )}
        </div>
    );
};

export default SalesGamificationSystem;