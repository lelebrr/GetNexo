import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';

const SystemConfig = () => {
    const [config, setConfig] = useState({
        brandName: 'Nexus Enterprise',
        primaryColor: '#00f7ff',
        secondaryColor: '#ffc400',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        maintenanceMode: false,
        seoTitle: 'Nexus - Automação e IA',
        seoDescription: 'Plataforma líder em automação de atendimento com IA generativa.'
    });

    const [logoPreview, setLogoPreview] = useState(null);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        alert('Configurações do sistema atualizadas!');
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-white mb-2">⚙️ Configurações do Sistema</h1>
                <p className="text-gray-400">Personalize a aparência e comportamento global da plataforma.</p>
            </header>

            {/* White Label & Branding */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#ffc400] uppercase tracking-wider">White Label & Branding</h2>
                <Card className="p-6 bg-gray-900 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Nome da Plataforma</label>
                                <Input
                                    value={config.brandName}
                                    onChange={(e) => handleChange('brandName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Domínio Customizado (CNAME)</label>
                                <Input
                                    value={config.customDomain || ''}
                                    onChange={(e) => handleChange('customDomain', e.target.value)}
                                    placeholder="app.suaagencia.com.br"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Cor Primária</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={config.primaryColor}
                                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                                            className="h-10 w-10 rounded bg-transparent border-none cursor-pointer"
                                        />
                                        <Input
                                            value={config.primaryColor}
                                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Cor Secundária</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={config.secondaryColor}
                                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                            className="h-10 w-10 rounded bg-transparent border-none cursor-pointer"
                                        />
                                        <Input
                                            value={config.secondaryColor}
                                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-cyan-500 transition-colors">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="max-h-32 mb-4" />
                            ) : (
                                <div className="text-4xl mb-4">🖼️</div>
                            )}
                            <label className="cursor-pointer">
                                <span className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Upload Logo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">Recomendado: PMG transparente 200x50px</p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Regional & SEO */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold text-[#ffc400] uppercase tracking-wider">Regional & SEO</h2>
                <Card className="p-6 bg-gray-900 border border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Idioma Padrão</label>
                            <select
                                value={config.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500"
                            >
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (US)</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Fuso Horário</label>
                            <select
                                value={config.timezone}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500"
                            >
                                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">New York (EST)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-300 mb-2">Título SEO Global</label>
                            <Input
                                value={config.seoTitle}
                                onChange={(e) => handleChange('seoTitle', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-300 mb-2">Descrição Meta Global</label>
                            <textarea
                                value={config.seoDescription}
                                onChange={(e) => handleChange('seoDescription', e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 h-24"
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold text-red-500 uppercase tracking-wider">Zona de Perigo</h2>
                <Card className="p-6 bg-red-900/10 border border-red-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white">Modo de Manutenção</h3>
                            <p className="text-sm text-gray-400">Torna o site inacessível para visitantes, exibindo uma página de manutenção.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={config.maintenanceMode} onChange={() => handleChange('maintenanceMode', !config.maintenanceMode)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </Card>
            </section>

            <div className="flex justify-end pt-6 border-t border-gray-800">
                <Button onClick={handleSave} className="bg-[#ffc400] text-black font-bold px-8 py-3 text-lg hover:bg-yellow-400">
                    Salvar Configurações
                </Button>
            </div>
        </div>
    );
};

export default SystemConfig;
