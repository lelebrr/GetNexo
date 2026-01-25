import React, { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';

const IntegrationsManager = () => {
    const [integrations, setIntegrations] = useState({
        whatsapp: { enabled: true, apiKey: 'whapi_****************', status: 'connected' },
        openai: { enabled: true, apiKey: 'sk-****************', model: 'gpt-4' },
        stripe: { enabled: false, publishableKey: '', secretKey: '' },
        mercadopago: { enabled: true, accessToken: 'APP_USR-****************' },
        facebook: { enabled: false, pixelId: '' }
    });

    const [loading, setLoading] = useState(false);

    const handleToggle = (key) => {
        setIntegrations(prev => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled }
        }));
    };

    const handleChange = (key, field, value) => {
        setIntegrations(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Integrações salvas com sucesso!');
        }, 1000);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">🧩 Gerenciador de Integrações</h1>
                    <p className="text-gray-400">Conecte e configure serviços externos para expandir o Nexus.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WhatsApp Business */}
                <Card className="p-6 border border-gray-800 bg-gray-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📱</span>
                            <div>
                                <h3 className="font-bold text-lg text-white">WhatsApp Business API</h3>
                                <p className="text-xs text-gray-500">Comunicação oficial</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.whatsapp.enabled} onChange={() => handleToggle('whatsapp')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                    {integrations.whatsapp.enabled && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">API Key / Access Token</label>
                                <Input
                                    type="password"
                                    value={integrations.whatsapp.apiKey}
                                    onChange={(e) => handleChange('whatsapp', 'apiKey', e.target.value)}
                                    placeholder="EAAB..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-xs text-green-500 font-bold">CONECTADO</span>
                            </div>
                        </div>
                    )}
                </Card>

                {/* OpenAI / AI Core */}
                <Card className="p-6 border border-gray-800 bg-gray-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🧠</span>
                            <div>
                                <h3 className="font-bold text-lg text-white">OpenAI / LLM Core</h3>
                                <p className="text-xs text-gray-500">Inteligência conversacional</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.openai.enabled} onChange={() => handleToggle('openai')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                    </div>
                    {integrations.openai.enabled && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">API Key</label>
                                <Input
                                    type="password"
                                    value={integrations.openai.apiKey}
                                    onChange={(e) => handleChange('openai', 'apiKey', e.target.value)}
                                    placeholder="sk-..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Modelo Padrão</label>
                                <select
                                    value={integrations.openai.model}
                                    onChange={(e) => handleChange('openai', 'model', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyan-500 outline-none"
                                >
                                    <option value="gpt-4">GPT-4 Turbo (Recomendado)</option>
                                    <option value="gpt-3.5">GPT-3.5 Turbo (Econômico)</option>
                                    <option value="claude-3">Claude 3 Opus</option>
                                </select>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Mercado Pago */}
                <Card className="p-6 border border-gray-800 bg-gray-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">💳</span>
                            <div>
                                <h3 className="font-bold text-lg text-white">Mercado Pago</h3>
                                <p className="text-xs text-gray-500">Pagamentos Nacionais (PIX/Card)</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.mercadopago.enabled} onChange={() => handleToggle('mercadopago')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>
                    {integrations.mercadopago.enabled && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Access Token (Produção)</label>
                                <Input
                                    type="password"
                                    value={integrations.mercadopago.accessToken}
                                    onChange={(e) => handleChange('mercadopago', 'accessToken', e.target.value)}
                                    placeholder="APP_USR-..."
                                />
                            </div>
                        </div>
                    )}
                </Card>

                {/* Stripe */}
                <Card className="p-6 border border-gray-800 bg-gray-900/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🌎</span>
                            <div>
                                <h3 className="font-bold text-lg text-white">Stripe Payments</h3>
                                <p className="text-xs text-gray-500">Pagamentos Internacionais</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={integrations.stripe.enabled} onChange={() => handleToggle('stripe')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                        </label>
                    </div>
                    {integrations.stripe.enabled && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Publishable Key</label>
                                <Input
                                    type="text"
                                    value={integrations.stripe.publishableKey}
                                    onChange={(e) => handleChange('stripe', 'publishableKey', e.target.value)}
                                    placeholder="pk_live_..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Secret Key</label>
                                <Input
                                    type="password"
                                    value={integrations.stripe.secretKey}
                                    onChange={(e) => handleChange('stripe', 'secretKey', e.target.value)}
                                    placeholder="sk_live_..."
                                />
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default IntegrationsManager;
