import React, { useState, useEffect } from 'react';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Card } from '../../design-system/components/Card';

const SalesGamificationAdmin = () => {
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estado para configuração
    const [configData, setConfigData] = useState({
        name: '',
        description: '',
        isActive: true,
        countdown: {
            enabled: true,
            duration: 59,
            format: 'MM:SS',
            text: 'Expira em',
            color: '#ff4444',
            position: 'top-right',
            showOnProducts: [],
            autoRestart: true
        },
        stock: {
            enabled: true,
            mode: 'real',
            fakeStockRange: { min: 5, max: 20 },
            updateInterval: 30,
            lowStockThreshold: 5,
            lowStockText: 'Poucos itens restantes!',
            outOfStockText: 'Esgotado',
            showProgressBar: true,
            progressBarColor: '#ff6b35'
        },
        pricing: {
            enabled: true,
            basePrice: 100,
            minDiscount: 5,
            maxDiscount: 20,
            negotiationSteps: 3,
            aiPersonality: 'aggressive',
            responseDelay: 2000,
            inputPlaceholder: 'Digite sua proposta...',
            acceptText: 'Aceitar proposta',
            counterText: 'Fazer contra-proposta'
        },
        freeShipping: {
            enabled: true,
            threshold: 100,
            progressBarColor: '#4CAF50',
            text: 'Faltam R$ {{amount}} para frete grátis!',
            successText: '🎉 Frete grátis liberado!',
            showAmount: true,
            position: 'cart'
        },
        socialProof: {
            enabled: true,
            mode: 'live',
            updateInterval: 30,
            textTemplate: '{{name}} {{location}} comprou',
            animationDuration: 5000,
            maxNotifications: 10,
            position: 'bottom-right',
            notifications: []
        },
        exitPopup: {
            enabled: true,
            discount: 5,
            title: 'Espere!',
            message: 'Não vá embora sem este desconto especial!',
            buttonText: 'Pegar Desconto',
            couponCode: '',
            triggerDelay: 5000,
            showOncePerSession: true
        },
        cartRecovery: {
            enabled: true,
            whatsappNumber: '',
            messageTemplate: 'Olá! Vi que você abandonou seu carrinho. Que tal finalizar sua compra?',
            sendPhoto: true,
            photoUrl: '',
            delayHours: 2,
            maxAttempts: 3
        },
        competitorComparison: {
            enabled: true,
            competitors: [],
            ourAdvantages: ['Suporte 24/7', 'Garantia Estendida', 'Entrega Grátis'],
            highlightColor: '#4CAF50',
            showRatings: true,
            comparisonTable: {
                enabled: true,
                columns: ['Preço', 'Qualidade', 'Suporte', 'Garantia']
            }
        },
        settings: {
            targetProducts: [],
            targetCategories: [],
            userSegments: [],
            geolocation: {
                enabled: false,
                countries: [],
                regions: []
            },
            schedule: {
                enabled: false,
                daysOfWeek: [],
                startTime: '',
                endTime: ''
            },
            analytics: {
                trackImpressions: true,
                trackClicks: true,
                trackConversions: true,
                customEvents: []
            }
        }
    });

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setConfigs(data.configs || []);
            }
        } catch (err) {
            console.error('Erro ao carregar configurações:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const method = selectedConfig ? 'PUT' : 'POST';
            const url = selectedConfig
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification/${selectedConfig._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configData),
            });

            if (response.ok) {
                fetchConfigs();
                setIsEditing(false);
                setSelectedConfig(null);
                resetForm();
            }
        } catch (err) {
            console.error('Erro ao salvar configuração:', err);
        }
    };

    const handleEdit = (config) => {
        setSelectedConfig(config);
        setConfigData(config);
        setIsEditing(true);
    };

    const handleDelete = async (configId) => {
        if (!confirm('Tem certeza que deseja excluir esta configuração?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-gamification/${configId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchConfigs();
            }
        } catch (err) {
            console.error('Erro ao excluir configuração:', err);
        }
    };

    const resetForm = () => {
        setConfigData({
            name: '',
            description: '',
            isActive: true,
            countdown: { enabled: true, duration: 59, format: 'MM:SS', text: 'Expira em', color: '#ff4444', position: 'top-right', showOnProducts: [], autoRestart: true },
            stock: { enabled: true, mode: 'real', fakeStockRange: { min: 5, max: 20 }, updateInterval: 30, lowStockThreshold: 5, lowStockText: 'Poucos itens restantes!', outOfStockText: 'Esgotado', showProgressBar: true, progressBarColor: '#ff6b35' },
            pricing: { enabled: true, basePrice: 100, minDiscount: 5, maxDiscount: 20, negotiationSteps: 3, aiPersonality: 'aggressive', responseDelay: 2000, inputPlaceholder: 'Digite sua proposta...', acceptText: 'Aceitar proposta', counterText: 'Fazer contra-proposta' },
            freeShipping: { enabled: true, threshold: 100, progressBarColor: '#4CAF50', text: 'Faltam R$ {{amount}} para frete grátis!', successText: '🎉 Frete grátis liberado!', showAmount: true, position: 'cart' },
            socialProof: { enabled: true, mode: 'live', updateInterval: 30, textTemplate: '{{name}} {{location}} comprou', animationDuration: 5000, maxNotifications: 10, position: 'bottom-right', notifications: [] },
            exitPopup: { enabled: true, discount: 5, title: 'Espere!', message: 'Não vá embora sem este desconto especial!', buttonText: 'Pegar Desconto', couponCode: '', triggerDelay: 5000, showOncePerSession: true },
            cartRecovery: { enabled: true, whatsappNumber: '', messageTemplate: 'Olá! Vi que você abandonou seu carrinho. Que tal finalizar sua compra?', sendPhoto: true, photoUrl: '', delayHours: 2, maxAttempts: 3 },
            competitorComparison: { enabled: true, competitors: [], ourAdvantages: ['Suporte 24/7', 'Garantia Estendida', 'Entrega Grátis'], highlightColor: '#4CAF50', showRatings: true, comparisonTable: { enabled: true, columns: ['Preço', 'Qualidade', 'Suporte', 'Garantia'] } },
            settings: { targetProducts: [], targetCategories: [], userSegments: [], geolocation: { enabled: false, countries: [], regions: [] }, schedule: { enabled: false, daysOfWeek: [], startTime: '', endTime: '' }, analytics: { trackImpressions: true, trackClicks: true, trackConversions: true, customEvents: [] } }
        });
    };

    const updateConfigData = (section, field, value) => {
        setConfigData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const updateNestedConfigData = (section, subsection, field, value) => {
        setConfigData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };

    if (loading) {
        return <div>Carregando configurações...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Gamificação de Vendas
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Configure elementos de conversão para aumentar suas vendas
                    </p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsEditing(true);
                        setSelectedConfig(null);
                    }}
                    style={{ background: '#4CAF50', color: 'white' }}
                >
                    + Nova Configuração
                </Button>
            </div>

            {!isEditing ? (
                // Lista de configurações
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {configs.map(config => (
                        <Card key={config._id} style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {config.name}
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                        {config.description}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    background: config.isActive ? '#4CAF50' : '#6b7280',
                                    color: 'white'
                                }}>
                                    {config.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#6b7280' }}>
                                    {config.countdown.enabled && <span>⏰ Contador</span>}
                                    {config.stock.enabled && <span>📦 Estoque</span>}
                                    {config.pricing.enabled && <span>💰 Preço</span>}
                                    {config.freeShipping.enabled && <span>🚚 Frete</span>}
                                    {config.socialProof.enabled && <span>👥 Social</span>}
                                    {config.exitPopup.enabled && <span>🚪 Exit</span>}
                                    {config.cartRecovery.enabled && <span>🛒 Recovery</span>}
                                    {config.competitorComparison.enabled && <span>⚖️ Comparação</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button size="sm" variant="secondary" onClick={() => handleEdit(config)}>
                                    Editar
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(config._id)}>
                                    Excluir
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                // Formulário de edição
                <div style={{ spaceY: '24px' }}>
                    <Card style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                            {selectedConfig ? 'Editar Configuração' : 'Nova Configuração'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Nome</label>
                                <Input
                                    value={configData.name}
                                    onChange={(e) => setConfigData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nome da configuração"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Descrição</label>
                                <Input
                                    value={configData.description}
                                    onChange={(e) => setConfigData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Descrição da configuração"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={configData.isActive}
                                    onChange={(e) => setConfigData(prev => ({ ...prev, isActive: e.target.checked }))}
                                />
                                <span style={{ fontWeight: 'bold' }}>Configuração Ativa</span>
                            </label>
                        </div>
                    </Card>

                    {/* Contador Regressivo */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            ⏰ Contador Regressivo
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                <input
                                    type="checkbox"
                                    checked={configData.countdown.enabled}
                                    onChange={(e) => updateConfigData('countdown', 'enabled', e.target.checked)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Duração (min)</label>
                                <Input
                                    type="number"
                                    value={configData.countdown.duration}
                                    onChange={(e) => updateConfigData('countdown', 'duration', parseInt(e.target.value))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Texto</label>
                                <Input
                                    value={configData.countdown.text}
                                    onChange={(e) => updateConfigData('countdown', 'text', e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Cor</label>
                                <Input
                                    type="color"
                                    value={configData.countdown.color}
                                    onChange={(e) => updateConfigData('countdown', 'color', e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Estoque Dinâmico */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            📦 Estoque Dinâmico
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                <input
                                    type="checkbox"
                                    checked={configData.stock.enabled}
                                    onChange={(e) => updateConfigData('stock', 'enabled', e.target.checked)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Modo</label>
                                <select
                                    value={configData.stock.mode}
                                    onChange={(e) => updateConfigData('stock', 'mode', e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                >
                                    <option value="real">Real</option>
                                    <option value="fake">Falso</option>
                                    <option value="hybrid">Híbrido</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Texto Pouco Estoque</label>
                                <Input
                                    value={configData.stock.lowStockText}
                                    onChange={(e) => updateConfigData('stock', 'lowStockText', e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Preço Dinâmico */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            💰 Preço Dinâmico
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                <input
                                    type="checkbox"
                                    checked={configData.pricing.enabled}
                                    onChange={(e) => updateConfigData('pricing', 'enabled', e.target.checked)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Preço Base (R$)</label>
                                <Input
                                    type="number"
                                    value={configData.pricing.basePrice}
                                    onChange={(e) => updateConfigData('pricing', 'basePrice', parseFloat(e.target.value))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Personalidade IA</label>
                                <select
                                    value={configData.pricing.aiPersonality}
                                    onChange={(e) => updateConfigData('pricing', 'aiPersonality', e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                >
                                    <option value="aggressive">Agressiva</option>
                                    <option value="moderate">Moderada</option>
                                    <option value="conservative">Conservadora</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Frete Grátis */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            🚚 Frete Grátis
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                <input
                                    type="checkbox"
                                    checked={configData.freeShipping.enabled}
                                    onChange={(e) => updateConfigData('freeShipping', 'enabled', e.target.checked)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Valor Mínimo (R$)</label>
                                <Input
                                    type="number"
                                    value={configData.freeShipping.threshold}
                                    onChange={(e) => updateConfigData('freeShipping', 'threshold', parseFloat(e.target.value))}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Texto Progresso</label>
                                <Input
                                    value={configData.freeShipping.text}
                                    onChange={(e) => updateConfigData('freeShipping', 'text', e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Social Proof */}
                    <Card style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            👥 Social Proof
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Habilitado</label>
                                <input
                                    type="checkbox"
                                    checked={configData.socialProof.enabled}
                                    onChange={(e) => updateConfigData('socialProof', 'enabled', e.target.checked)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Modo</label>
                                <select
                                    value={configData.socialProof.mode}
                                    onChange={(e) => updateConfigData('socialProof', 'mode', e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                >
                                    <option value="live">Ao Vivo</option>
                                    <option value="static">Estático</option>
                                    <option value="hybrid">Híbrido</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Intervalo (seg)</label>
                                <Input
                                    type="number"
                                    value={configData.socialProof.updateInterval}
                                    onChange={(e) => updateConfigData('socialProof', 'updateInterval', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Ações */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedConfig(null);
                                resetForm();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} style={{ background: '#4CAF50', color: 'white' }}>
                            {selectedConfig ? 'Atualizar' : 'Criar'} Configuração
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesGamificationAdmin;