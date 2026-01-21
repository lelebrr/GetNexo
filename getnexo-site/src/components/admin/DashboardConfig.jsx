import React, { useState, useEffect } from 'react';

const DashboardConfig = () => {
    const [config, setConfig] = useState({
        enabledCharts: {
            ticket_peaks: true,
            channel_distribution: true,
            ai_resolution: true,
            sales: true,
            agent_clicks: true,
            conversion_funnel: true,
            nps: true,
            response_times: true,
            top_complaints: true,
            brazil_heatmap: true,
            queue_abandonment: true
        },
        chartOrder: [
            'ticket_peaks',
            'channel_distribution',
            'ai_resolution',
            'sales',
            'agent_clicks',
            'conversion_funnel',
            'nps',
            'response_times',
            'top_complaints',
            'brazil_heatmap',
            'queue_abandonment'
        ]
    });

    const [activeTab, setActiveTab] = useState('analytics');
    const [whiteLabelConfig, setWhiteLabelConfig] = useState({
        branding: {
            logo: null,
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            botName: 'Assistente IA',
            customBackground: '',
            customCss: ''
        },
        behavior: {
            activeChannels: {
                whatsapp: true,
                telegram: false,
                instagram: false,
                facebook: false,
                email: true
            },
            terminology: {
                agentLabel: 'Atendente',
                botLabel: 'Bot',
                chatLabel: 'Chat'
            },
            favicon: null
        },
        widget: {
            position: 'bottom-right',
            width: 350,
            height: 500,
            animation: true,
            sound: true
        }
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const chartLabels = {
        ticket_peaks: 'Picos de Tickets por Hora',
        channel_distribution: 'Distribuição por Canal',
        ai_resolution: 'Taxa de Resolução IA vs Humano',
        sales: 'Vendas no Chat',
        agent_clicks: 'Cliques de Agentes',
        conversion_funnel: 'Funil de Conversão',
        nps: 'NPS Semanal',
        response_times: 'Tempo Médio de Resposta',
        top_complaints: 'Top Reclamações por Produto',
        brazil_heatmap: 'Chamados por Região do Brasil',
        queue_abandonment: 'Abandono de Fila'
    };

    const handleToggleChart = (chartId) => {
        setConfig(prev => ({
            ...prev,
            enabledCharts: {
                ...prev.enabledCharts,
                [chartId]: !prev.enabledCharts[chartId]
            }
        }));
    };

    const handleMoveUp = (index) => {
        if (index > 0) {
            const newOrder = [...config.chartOrder];
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
            setConfig(prev => ({ ...prev, chartOrder: newOrder }));
        }
    };

    const handleMoveDown = (index) => {
        if (index < config.chartOrder.length - 1) {
            const newOrder = [...config.chartOrder];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            setConfig(prev => ({ ...prev, chartOrder: newOrder }));
        }
    };

    const saveConfig = async () => {
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/config/analytics_dashboard', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            if (response.ok) {
                setMessage('Configuração salva com sucesso!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Erro ao salvar configuração.');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setMessage('Erro de conexão.');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefault = () => {
        setConfig({
            enabledCharts: {
                ticket_peaks: true,
                channel_distribution: true,
                ai_resolution: true,
                sales: true,
                agent_clicks: true,
                conversion_funnel: true,
                nps: true,
                response_times: true,
                top_complaints: true,
                brazil_heatmap: true,
                queue_abandonment: true
            },
            chartOrder: [
                'ticket_peaks',
                'channel_distribution',
                'ai_resolution',
                'sales',
                'agent_clicks',
                'conversion_funnel',
                'nps',
                'response_times',
                'top_complaints',
                'brazil_heatmap',
                'queue_abandonment'
            ]
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Configurações do Sistema</h2>
            </div>

            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'analytics'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    📊 Analytics
                </button>
                <button
                    onClick={() => setActiveTab('branding')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'branding'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    🎨 Branding
                </button>
                <button
                    onClick={() => setActiveTab('behavior')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'behavior'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    ⚙️ Comportamento
                </button>
                <button
                    onClick={() => setActiveTab('widget')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'widget'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    💬 Widget Chat
                </button>
            </div>

            {activeTab === 'analytics' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Configuração do Dashboard Analytics</h3>
                        <div className="space-x-3">
                            <button
                                onClick={resetToDefault}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                🔄 Resetar
                            </button>
                            <button
                                onClick={saveConfig}
                                disabled={saving}
                                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? 'Salvando...' : '💾 Salvar Configuração'}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-4 p-3 rounded ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Ordem dos Gráficos</h3>
                            <div className="space-y-2">
                                {config.chartOrder.map((chartId, index) => (
                                    <div key={chartId} className="flex items-center justify-between p-3 bg-white rounded border">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={config.enabledCharts[chartId]}
                                                onChange={() => handleToggleChart(chartId)}
                                                className="rounded"
                                            />
                                            <span className={`${config.enabledCharts[chartId] ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {chartLabels[chartId]}
                                            </span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0}
                                                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                                title="Mover para cima"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === config.chartOrder.length - 1}
                                                className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                                title="Mover para baixo"
                                            >
                                                ↓
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-md font-medium text-blue-800 mb-2">💡 Dicas de Configuração</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Desmarque gráficos que não são relevantes para seu negócio</li>
                                <li>• Organize os gráficos mais importantes no topo da lista</li>
                                <li>• Clique em "Salvar Configuração" para aplicar as mudanças</li>
                                <li>• As mudanças afetam todos os usuários do dashboard</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'branding' && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Configurações de Branding</h3>
                    <div className="space-y-6">
                        {/* Logo Upload */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setWhiteLabelConfig(prev => ({
                                        ...prev,
                                        branding: { ...prev.branding, logo: file }
                                    }));
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>

                        {/* Color Pickers */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                                <input
                                    type="color"
                                    value={whiteLabelConfig.branding.primaryColor}
                                    onChange={(e) => setWhiteLabelConfig(prev => ({
                                        ...prev,
                                        branding: { ...prev.branding, primaryColor: e.target.value }
                                    }))}
                                    className="w-full h-10 border rounded"
                                />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                                <input
                                    type="color"
                                    value={whiteLabelConfig.branding.secondaryColor}
                                    onChange={(e) => setWhiteLabelConfig(prev => ({
                                        ...prev,
                                        branding: { ...prev.branding, secondaryColor: e.target.value }
                                    }))}
                                    className="w-full h-10 border rounded"
                                />
                            </div>
                        </div>

                        {/* Bot Name */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Bot</label>
                            <input
                                type="text"
                                value={whiteLabelConfig.branding.botName}
                                onChange={(e) => setWhiteLabelConfig(prev => ({
                                    ...prev,
                                    branding: { ...prev.branding, botName: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Ex: Assistente IA"
                            />
                        </div>

                        {/* Custom Background */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fundo Personalizado (CSS)</label>
                            <textarea
                                value={whiteLabelConfig.branding.customBackground}
                                onChange={(e) => setWhiteLabelConfig(prev => ({
                                    ...prev,
                                    branding: { ...prev.branding, customBackground: e.target.value }
                                }))}
                                rows={4}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Ex: background: linear-gradient(45deg, #007bff, #6610f2);"
                            />
                        </div>

                        {/* Custom CSS */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">CSS Personalizado</label>
                            <textarea
                                value={whiteLabelConfig.branding.customCss}
                                onChange={(e) => setWhiteLabelConfig(prev => ({
                                    ...prev,
                                    branding: { ...prev.branding, customCss: e.target.value }
                                }))}
                                rows={6}
                                className="w-full px-3 py-2 border rounded font-mono text-sm"
                                placeholder="CSS personalizado para o widget..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'behavior' && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Configurações de Comportamento</h3>
                    <div className="space-y-6">
                        {/* Active Channels */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Canais Ativos</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(whiteLabelConfig.behavior.activeChannels).map(([channel, isActive]) => (
                                    <label key={channel} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setWhiteLabelConfig(prev => ({
                                                ...prev,
                                                behavior: {
                                                    ...prev.behavior,
                                                    activeChannels: {
                                                        ...prev.behavior.activeChannels,
                                                        [channel]: e.target.checked
                                                    }
                                                }
                                            }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm capitalize">{channel}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Custom Terminology */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Terminologia Personalizada</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Rótulo do Atendente</label>
                                    <input
                                        type="text"
                                        value={whiteLabelConfig.behavior.terminology.agentLabel}
                                        onChange={(e) => setWhiteLabelConfig(prev => ({
                                            ...prev,
                                            behavior: {
                                                ...prev.behavior,
                                                terminology: {
                                                    ...prev.behavior.terminology,
                                                    agentLabel: e.target.value
                                                }
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Rótulo do Bot</label>
                                    <input
                                        type="text"
                                        value={whiteLabelConfig.behavior.terminology.botLabel}
                                        onChange={(e) => setWhiteLabelConfig(prev => ({
                                            ...prev,
                                            behavior: {
                                                ...prev.behavior,
                                                terminology: {
                                                    ...prev.behavior.terminology,
                                                    botLabel: e.target.value
                                                }
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Rótulo do Chat</label>
                                    <input
                                        type="text"
                                        value={whiteLabelConfig.behavior.terminology.chatLabel}
                                        onChange={(e) => setWhiteLabelConfig(prev => ({
                                            ...prev,
                                            behavior: {
                                                ...prev.behavior,
                                                terminology: {
                                                    ...prev.behavior.terminology,
                                                    chatLabel: e.target.value
                                                }
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Favicon Upload */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setWhiteLabelConfig(prev => ({
                                        ...prev,
                                        behavior: { ...prev.behavior, favicon: file }
                                    }));
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'widget' && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Configurações do Widget de Chat</h3>
                    <div className="space-y-6">
                        {/* Position */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Posição do Widget</label>
                            <select
                                value={whiteLabelConfig.widget.position}
                                onChange={(e) => setWhiteLabelConfig(prev => ({
                                    ...prev,
                                    widget: { ...prev.widget, position: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="bottom-right">Inferior Direito</option>
                                <option value="bottom-left">Inferior Esquerdo</option>
                                <option value="top-right">Superior Direito</option>
                                <option value="top-left">Superior Esquerdo</option>
                            </select>
                        </div>

                        {/* Dimensions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Largura (px)</label>
                                <input
                                    type="number"
                                    min="200"
                                    max="800"
                                    value={whiteLabelConfig.widget.width}
                                    onChange={(e) => setWhiteLabelConfig(prev => ({
                                        ...prev,
                                        widget: { ...prev.widget, width: parseInt(e.target.value) }
                                    }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Altura (px)</label>
                                <input
                                    type="number"
                                    min="300"
                                    max="1000"
                                    value={whiteLabelConfig.widget.height}
                                    onChange={(e) => setWhiteLabelConfig(prev => ({
                                        ...prev,
                                        widget: { ...prev.widget, height: parseInt(e.target.value) }
                                    }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Animation and Sound */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Opções do Widget</h4>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={whiteLabelConfig.widget.animation}
                                        onChange={(e) => setWhiteLabelConfig(prev => ({
                                            ...prev,
                                            widget: { ...prev.widget, animation: e.target.checked }
                                        }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Animação de entrada</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={whiteLabelConfig.widget.sound}
                                        onChange={(e) => setWhiteLabelConfig(prev => ({
                                            ...prev,
                                            widget: { ...prev.widget, sound: e.target.checked }
                                        }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Sons de notificação</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardConfig;