import React, { useState, useEffect } from 'react';
import useSentimentAnalysis from '../../hooks/useSentimentAnalysis';

/**
 * Componente SentimentConfig
 * Interface para configurar thresholds de alertas de sentimento
 */
const SentimentConfig = () => {
    const {
        getThresholds,
        updateThresholds,
        getRewardTypes,
        updateRewardTypes,
        getSentimentRanges,
        loading,
        error
    } = useSentimentAnalysis();

    const [thresholds, setThresholds] = useState({
        escalation: { min: 1, max: 2, label: 'Escalonamento Urgente' },
        warning: { min: 3, max: 4, label: 'Atenção Necessária' },
        reward: { min: 9, max: 10, label: 'Recompensa' },
        none: { min: 5, max: 8, label: 'Normal' }
    });

    const [rewardTypes, setRewardTypes] = useState({
        cafe: { label: 'Café', description: 'Cupom de café' },
        brinde: { label: 'Brinde', description: 'Brinde especial' },
        desconto: { label: 'Desconto', description: 'Desconto em compra' },
        upgrade: { label: 'Upgrade', description: 'Upgrade de serviço' },
        none: { label: 'Nenhum', description: 'Sem recompensa' }
    });

    const [sentimentRanges] = useState({
        very_negative: { min: 1, max: 2, label: 'Muito Negativo', category: 'raiva' },
        negative: { min: 3, max: 4, label: 'Negativo', category: 'frustracao' },
        neutral: { min: 5, max: 6, label: 'Neutro', category: 'neutro' },
        positive: { min: 7, max: 8, label: 'Positivo', category: 'satisfacao' },
        very_positive: { min: 9, max: 10, label: 'Muito Positivo', category: 'empolgação' }
    });

    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('thresholds');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const [currentThresholds, currentRewardTypes] = await Promise.all([
                getThresholds(),
                getRewardTypes()
            ]);

            if (currentThresholds) setThresholds(currentThresholds);
            if (currentRewardTypes) setRewardTypes(currentRewardTypes);
        } catch (err) {
            console.error('Erro ao carregar configuração:', err);
        }
    };

    const handleSaveThresholds = async () => {
        setSaving(true);
        try {
            await updateThresholds(thresholds);
            alert('Thresholds salvos com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar thresholds:', err);
            alert('Erro ao salvar thresholds');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveRewardTypes = async () => {
        setSaving(true);
        try {
            await updateRewardTypes(rewardTypes);
            alert('Tipos de recompensa salvos com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar tipos de recompensa:', err);
            alert('Erro ao salvar tipos de recompensa');
        } finally {
            setSaving(false);
        }
    };

    const handleThresholdChange = (key, field, value) => {
        setThresholds(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const handleRewardTypeChange = (key, field, value) => {
        setRewardTypes(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const ThresholdConfigurator = () => (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Configuração de Thresholds
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Defina os intervalos de score que disparam diferentes tipos de alerta:</p>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                                <li><strong>Escalonamento:</strong> Clientes muito insatisfeitos que precisam de atenção imediata</li>
                                <li><strong>Aviso:</strong> Clientes insatisfeitos que precisam de atenção</li>
                                <li><strong>Recompensa:</strong> Clientes muito satisfeitos que merecem reconhecimento</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(thresholds).map(([key, config]) => (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-medium capitalize">
                                {key === 'escalation' ? '🚨 Escalonamento Urgente' :
                                    key === 'warning' ? '⚠️ Atenção Necessária' :
                                        key === 'reward' ? '🎉 Recompensa' : '✅ Normal'}
                            </h4>
                            <span className="text-sm text-gray-500">
                                Scores {config.min} - {config.max}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Score Mínimo
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={config.min}
                                    onChange={(e) => handleThresholdChange(key, 'min', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Score Máximo
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={config.max}
                                    onChange={(e) => handleThresholdChange(key, 'max', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição do Alerta
                            </label>
                            <input
                                type="text"
                                value={config.label}
                                onChange={(e) => handleThresholdChange(key, 'label', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Descrição do tipo de alerta"
                            />
                        </div>

                        {/* Visualização dos scores */}
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Raiva (1)</span>
                                <span>Empolgação (10)</span>
                            </div>
                            <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${key === 'escalation' ? 'bg-red-500' :
                                                key === 'warning' ? 'bg-orange-500' :
                                                    key === 'reward' ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                        style={{
                                            marginLeft: `${(config.min - 1) * 11.11}%`,
                                            width: `${(config.max - config.min + 1) * 11.11}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveThresholds}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {saving ? 'Salvando...' : 'Salvar Thresholds'}
                </button>
            </div>
        </div>
    );

    const RewardConfigurator = () => (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                            Configuração de Recompensas
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>Configure os tipos de recompensa para clientes muito satisfeitos:</p>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                                <li>Recompensas são dadas automaticamente quando o score ≥ 9</li>
                                <li>O tipo de recompensa é escolhido aleatoriamente entre café e brinde</li>
                                <li>Pode ser personalizado conforme a política da empresa</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {Object.entries(rewardTypes).map(([key, config]) => (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <span className="text-2xl mr-3">
                                {key === 'cafe' ? '☕' :
                                    key === 'brinde' ? '🎁' :
                                        key === 'desconto' ? '💰' :
                                            key === 'upgrade' ? '⬆️' : '🚫'}
                            </span>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={config.label}
                                    onChange={(e) => handleRewardTypeChange(key, 'label', e.target.value)}
                                    className="text-lg font-medium border-none p-0 focus:outline-none focus:ring-0 w-full"
                                    placeholder="Nome da recompensa"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                value={config.description}
                                onChange={(e) => handleRewardTypeChange(key, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                rows="2"
                                placeholder="Descrição da recompensa"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveRewardTypes}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {saving ? 'Salvando...' : 'Salvar Recompensas'}
                </button>
            </div>
        </div>
    );

    const SentimentRangesDisplay = () => (
        <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-purple-800">
                            Ranges de Sentimento
                        </h3>
                        <div className="mt-2 text-sm text-purple-700">
                            <p>Referência dos intervalos de score para cada categoria de sentimento:</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sentimentRanges).map(([key, range]) => (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-2xl ${key === 'very_negative' ? 'filter hue-rotate-15' :
                                    key === 'negative' ? 'filter hue-rotate-45' :
                                        key === 'neutral' ? 'grayscale' :
                                            key === 'positive' ? 'filter hue-rotate-120' : 'filter hue-rotate-180'
                                }`}>
                                {key === 'very_negative' ? '😡' :
                                    key === 'negative' ? '😠' :
                                        key === 'neutral' ? '😐' :
                                            key === 'positive' ? '😊' : '🤩'}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                                {range.min}-{range.max}
                            </span>
                        </div>
                        <h4 className="font-medium text-gray-900">{range.label}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                            Categoria: {range.category}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Sistema de Pontuação</h4>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>• <strong>1-2:</strong> Muito negativo (Raiva) - Escalonamento urgente</p>
                    <p>• <strong>3-4:</strong> Negativo (Frustração) - Atenção necessária</p>
                    <p>• <strong>5-6:</strong> Neutro - Sem ação específica</p>
                    <p>• <strong>7-8:</strong> Positivo (Satisfação) - Bom atendimento</p>
                    <p>• <strong>9-10:</strong> Muito positivo (Empolgação) - Recompensa automática</p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Configuração de Sentimentos</h1>
                        <p className="text-gray-600">Configure thresholds de alertas e tipos de recompensa</p>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Erro ao carregar configuração
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                {error}
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={loadConfig}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {[
                            { id: 'thresholds', label: 'Thresholds', icon: '⚙️' },
                            { id: 'rewards', label: 'Recompensas', icon: '🎁' },
                            { id: 'ranges', label: 'Referência', icon: '📊' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'thresholds' && <ThresholdConfigurator />}
            {activeTab === 'rewards' && <RewardConfigurator />}
            {activeTab === 'ranges' && <SentimentRangesDisplay />}
        </div>
    );
};

export default SentimentConfig;
