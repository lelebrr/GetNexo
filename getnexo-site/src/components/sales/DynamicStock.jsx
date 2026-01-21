import React, { useState, useEffect } from 'react';

const DynamicStock = ({
    mode = 'real', // 'real', 'fake', 'hybrid'
    realStock = 10,
    fakeStockRange = { min: 5, max: 20 },
    updateInterval = 30, // segundos
    lowStockThreshold = 5,
    lowStockText = 'Poucos itens restantes!',
    outOfStockText = 'Esgotado',
    showProgressBar = true,
    progressBarColor = '#ff6b35',
    position = 'inline', // 'inline', 'badge', 'overlay'
    style = {},
    onStockChange = () => { }
}) => {
    const [currentStock, setCurrentStock] = useState(realStock);
    const [displayStock, setDisplayStock] = useState(realStock);
    const [isLowStock, setIsLowStock] = useState(false);
    const [isOutOfStock, setIsOutOfStock] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Função para gerar estoque falso
    const generateFakeStock = () => {
        const { min, max } = fakeStockRange;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Função para atualizar o estoque baseado no modo
    const updateStock = () => {
        let newStock;

        switch (mode) {
            case 'fake':
                newStock = generateFakeStock();
                setDisplayStock(newStock);
                break;
            case 'hybrid':
                // Modo híbrido: mostra estoque real, mas adiciona variação
                const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
                newStock = Math.max(0, currentStock + variation);
                setCurrentStock(newStock);
                setDisplayStock(newStock);
                break;
            case 'real':
            default:
                // Modo real: usa o estoque real fornecido
                setDisplayStock(currentStock);
                break;
        }

        // Verificar estados
        const newIsOutOfStock = displayStock <= 0;
        const newIsLowStock = displayStock > 0 && displayStock <= lowStockThreshold;

        setIsOutOfStock(newIsOutOfStock);
        setIsLowStock(newIsLowStock);
        setLastUpdate(Date.now());

        onStockChange(displayStock, { isLowStock: newIsLowStock, isOutOfStock: newIsOutOfStock });
    };

    useEffect(() => {
        // Atualização inicial
        updateStock();

        // Configurar atualização automática
        if (updateInterval > 0) {
            const interval = setInterval(updateStock, updateInterval * 1000);
            return () => clearInterval(interval);
        }
    }, [mode, realStock, updateInterval, lowStockThreshold]);

    useEffect(() => {
        setCurrentStock(realStock);
        setDisplayStock(mode === 'real' ? realStock : generateFakeStock());
    }, [realStock, mode]);

    const getStockText = () => {
        if (isOutOfStock) {
            return outOfStockText;
        }
        if (isLowStock) {
            return lowStockText;
        }
        return `${displayStock} ${displayStock === 1 ? 'item' : 'itens'} disponível${displayStock === 1 ? '' : 'is'}`;
    };

    const getStockColor = () => {
        if (isOutOfStock) return '#dc2626'; // vermelho
        if (isLowStock) return '#ea580c'; // laranja
        return '#16a34a'; // verde
    };

    const getProgressPercentage = () => {
        if (isOutOfStock) return 0;
        // Assumindo que o estoque máximo é 100 para cálculo de progresso
        return Math.min(100, (displayStock / 100) * 100);
    };

    const renderInline = () => (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: getStockColor(),
            ...style
        }}>
            <span>📦</span>
            <span>{getStockText()}</span>
            {mode !== 'real' && (
                <span style={{
                    fontSize: '10px',
                    color: '#6b7280',
                    fontStyle: 'italic'
                }}>
                    (atualizado há {Math.floor((Date.now() - lastUpdate) / 1000)}s)
                </span>
            )}
        </div>
    );

    const renderBadge = () => (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            ...style
        }}>
            <span style={{
                background: getStockColor(),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <span>📦</span>
                {isOutOfStock ? outOfStockText : displayStock}
            </span>
        </div>
    );

    const renderOverlay = () => (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            ...style
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📦</span>
                <span>{getStockText()}</span>
            </div>

            {showProgressBar && (
                <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    marginTop: '6px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${getProgressPercentage()}%`,
                        height: '100%',
                        background: progressBarColor,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            )}

            {mode !== 'real' && (
                <div style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    marginTop: '4px',
                    textAlign: 'center'
                }}>
                    Atualizado agora
                </div>
            )}
        </div>
    );

    switch (position) {
        case 'badge':
            return renderBadge();
        case 'overlay':
            return renderOverlay();
        case 'inline':
        default:
            return renderInline();
    }
};

export default DynamicStock;