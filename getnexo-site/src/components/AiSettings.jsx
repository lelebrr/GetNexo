import React, { useState, useEffect } from 'react';

const API_URL = 'https://api.getnexo.com.br';

const AI_PROVIDERS = [
    { id: 'deepseek', name: 'DeepSeek AI', icon: '🧠', color: '#00D4FF', models: ['deepseek-chat', 'deepseek-coder'], defaultKey: '' },
    { id: 'openai', name: 'OpenAI', icon: '🤖', color: '#10A37F', models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'], defaultKey: '' },
    { id: 'anthropic', name: 'Anthropic Claude', icon: '🎭', color: '#CC785C', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], defaultKey: '' },
    { id: 'gemini', name: 'Google Gemini', icon: '✨', color: '#4285F4', models: ['gemini-pro', 'gemini-pro-vision'], defaultKey: '' },
    { id: 'groq', name: 'Groq', icon: '⚡', color: '#F55036', models: ['mixtral-8x7b', 'llama2-70b'], defaultKey: '' },
];

const AiSettings = () => {
    const [activeTab, setActiveTab] = useState('providers');
    const [context, setContext] = useState('');
    const [saved, setSaved] = useState(false);
    const [providers, setProviders] = useState(
        AI_PROVIDERS.reduce((acc, p) => ({
            ...acc,
            [p.id]: {
                enabled: p.id === 'deepseek',
                apiKey: p.defaultKey,
                model: p.models[0],
                tokensUsed: 0,
                tokensLimit: 100000,
                purpose: p.id === 'deepseek' ? 'chat' : 'backup'
            }
        }), {})
    );
    const [globalUsage, setGlobalUsage] = useState({ totalTokens: 0, totalCost: 0, requestsToday: 0 });
    const [tokenLimits, setTokenLimits] = useState({
        perMessage: 4096,
        perConversation: 16000,
        daily: 500000,
        monthly: 10000000
    });

    useEffect(() => {
        fetchContext();
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const res = await fetch(`${API_URL}/ai-usage`);
            const data = await res.json();
            setGlobalUsage({
                totalTokens: data.tokens_used || 0,
                totalCost: data.cost || 0,
                requestsToday: data.requests || 0
            });
        } catch (e) { }
    };

    const fetchContext = async () => {
        try {
            const res = await fetch(`${API_URL}/ai-context`);
            const data = await res.json();
            setContext(data.content || '');
        } catch (e) { }
    };

    const handleSaveProvider = async (providerId) => {
        const providerConfig = providers[providerId];
        await fetch(`${API_URL}/ai-settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: providerId,
                api_key: providerConfig.apiKey,
                model: providerConfig.model,
                enabled: providerConfig.enabled,
                purpose: providerConfig.purpose,
                context
            })
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchUsage();
    };

    const updateProvider = (id, field, value) => {
        setProviders(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const tabs = [
        { id: 'providers', label: '🔌 Provedores', icon: '🔌' },
        { id: 'usage', label: '📊 Uso & Custos', icon: '📊' },
        { id: 'limits', label: '⚙️ Limites', icon: '⚙️' },
        { id: 'training', label: '🎓 Treinamento', icon: '🎓' },
    ];

    return (
        <div className="h-full overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-2xl border border-blue-500/30">
                            <span className="text-4xl">🤖</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Central de IA</h1>
                            <p className="text-gray-400">Gerencie todos os provedores de IA em um só lugar</p>
                        </div>
                    </div>
                    {saved && (
                        <div className="bg-green-500/20 border border-green-500/50 px-6 py-3 rounded-xl animate-pulse">
                            <span className="text-green-400 font-bold">✅ Configuração salva!</span>
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="glass-panel p-4 rounded-xl border border-gray-700/50">
                        <div className="text-gray-400 text-sm">Tokens Usados (Hoje)</div>
                        <div className="text-2xl font-bold text-white">{globalUsage.totalTokens.toLocaleString()}</div>
                        <div className="text-xs text-neon-blue">↗ DeepSeek AI ativo</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700/50">
                        <div className="text-gray-400 text-sm">Custo Estimado</div>
                        <div className="text-2xl font-bold text-green-400">R$ {(globalUsage.totalCost || 0).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Este mês</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700/50">
                        <div className="text-gray-400 text-sm">Requisições Hoje</div>
                        <div className="text-2xl font-bold text-white">{globalUsage.requestsToday}</div>
                        <div className="text-xs text-gray-500">Média: 2.3k tokens/req</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-gray-700/50">
                        <div className="text-gray-400 text-sm">Provedores Ativos</div>
                        <div className="text-2xl font-bold text-neon-blue">{Object.values(providers).filter(p => p.enabled).length}</div>
                        <div className="text-xs text-gray-500">de {AI_PROVIDERS.length} disponíveis</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                                ? 'bg-neon-blue text-black'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Providers Tab */}
                {activeTab === 'providers' && (
                    <div className="space-y-4">
                        {AI_PROVIDERS.map(provider => (
                            <div
                                key={provider.id}
                                className={`glass-panel p-6 rounded-2xl border transition-all ${providers[provider.id].enabled
                                    ? 'border-green-500/50 bg-green-500/5'
                                    : 'border-gray-700/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: `${provider.color}20` }}
                                        >
                                            {provider.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                {provider.name}
                                                {provider.id === 'deepseek' && (
                                                    <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">RECOMENDADO</span>
                                                )}
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                {provider.models.join(' • ')}
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={providers[provider.id].enabled}
                                            onChange={(e) => updateProvider(provider.id, 'enabled', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                {providers[provider.id].enabled && (
                                    <div className="mt-6 grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Chave da API</label>
                                            <input
                                                type="password"
                                                value={providers[provider.id].apiKey}
                                                onChange={(e) => updateProvider(provider.id, 'apiKey', e.target.value)}
                                                className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue"
                                                placeholder={provider.defaultKey || 'sk-...'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Modelo</label>
                                            <select
                                                value={providers[provider.id].model}
                                                onChange={(e) => updateProvider(provider.id, 'model', e.target.value)}
                                                className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue"
                                            >
                                                {provider.models.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Uso Principal</label>
                                            <select
                                                value={providers[provider.id].purpose}
                                                onChange={(e) => updateProvider(provider.id, 'purpose', e.target.value)}
                                                className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue"
                                            >
                                                <option value="chat">💬 Chat Principal</option>
                                                <option value="backup">🔄 Fallback/Backup</option>
                                                <option value="analysis">📊 Análise de Dados</option>
                                                <option value="code">💻 Geração de Código</option>
                                                <option value="voice">🎤 Transcrição/Voz</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Limite de Tokens</label>
                                            <input
                                                type="number"
                                                value={providers[provider.id].tokensLimit}
                                                onChange={(e) => updateProvider(provider.id, 'tokensLimit', parseInt(e.target.value))}
                                                className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <button
                                                onClick={() => handleSaveProvider(provider.id)}
                                                className="bg-neon-blue hover:bg-neon-green text-black font-bold px-6 py-2 rounded-lg transition-all"
                                            >
                                                💾 Salvar {provider.name}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Usage Tab */}
                {activeTab === 'usage' && (
                    <div className="glass-panel p-6 rounded-2xl border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">📊 Consumo por Provedor</h3>
                        <div className="space-y-4">
                            {AI_PROVIDERS.filter(p => providers[p.id].enabled).map(provider => (
                                <div key={provider.id} className="bg-gray-800/50 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-bold">{provider.icon} {provider.name}</span>
                                        <span className="text-gray-400 text-sm">
                                            {providers[provider.id].tokensUsed.toLocaleString()} / {providers[provider.id].tokensLimit.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${(providers[provider.id].tokensUsed / providers[provider.id].tokensLimit) * 100}%`,
                                                backgroundColor: provider.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Limits Tab */}
                {activeTab === 'limits' && (
                    <div className="glass-panel p-6 rounded-2xl border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-6">⚙️ Configuração de Limites</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Tokens por Mensagem</label>
                                <input
                                    type="number"
                                    value={tokenLimits.perMessage}
                                    onChange={(e) => setTokenLimits({ ...tokenLimits, perMessage: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
                                />
                                <span className="text-xs text-gray-500">Limite máximo por resposta da IA</span>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Tokens por Conversa</label>
                                <input
                                    type="number"
                                    value={tokenLimits.perConversation}
                                    onChange={(e) => setTokenLimits({ ...tokenLimits, perConversation: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
                                />
                                <span className="text-xs text-gray-500">Limite de contexto por chat</span>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Limite Diário</label>
                                <input
                                    type="number"
                                    value={tokenLimits.daily}
                                    onChange={(e) => setTokenLimits({ ...tokenLimits, daily: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
                                />
                                <span className="text-xs text-gray-500">Máximo de tokens por dia</span>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Limite Mensal</label>
                                <input
                                    type="number"
                                    value={tokenLimits.monthly}
                                    onChange={(e) => setTokenLimits({ ...tokenLimits, monthly: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
                                />
                                <span className="text-xs text-gray-500">Orçamento mensal de tokens</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="bg-neon-blue text-black font-bold px-6 py-3 rounded-lg">
                                Salvar Limites
                            </button>
                        </div>
                    </div>
                )}

                {/* Training Tab */}
                {activeTab === 'training' && (
                    <div className="glass-panel p-6 rounded-2xl border border-gray-700/50">
                        <h3 className="text-xl font-bold text-white mb-4">🎓 Treinamento do Agente</h3>
                        <p className="text-gray-400 mb-6">Adicione informações sobre sua empresa para personalizar as respostas da IA.</p>
                        <textarea
                            className="w-full h-64 bg-black/40 border border-gray-600 p-4 rounded-xl text-white font-mono text-sm leading-relaxed focus:border-neon-blue outline-none resize-none"
                            placeholder="Ex: A GetNexo é uma empresa de software... Nosso horário de atendimento é das 9h às 18h... Produtos: OmniChat, ZapFlow..."
                            value={context}
                            onChange={e => setContext(e.target.value)}
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-gray-500 text-sm">{context.length} caracteres</span>
                            <button
                                onClick={() => handleSaveProvider('deepseek')}
                                className="bg-neon-blue hover:bg-neon-green text-black font-bold px-8 py-3 rounded-lg transition-all"
                            >
                                💾 Salvar Treinamento
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiSettings;
