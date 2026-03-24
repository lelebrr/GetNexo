
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const BroadcastManager = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [name, setName] = useState('');
    const [template, setTemplate] = useState('');
    const [contacts, setContacts] = useState([]);
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        stage: 'all',
        lastMessage: 'all',
        tags: []
    });
    const [error, setError] = useState(null);
    const [campaignStats, setCampaignStats] = useState({
        totalSent: 15420,
        totalDelivered: 14280,
        totalClicked: 2150,
        totalConverted: 387,
        avgOpenRate: 23.4,
        avgClickRate: 15.1,
        avgConversionRate: 2.5
    });

    useEffect(() => {
        fetchContacts();
        fetchCampaigns();
        fetchTemplates();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('/api/contacts');
            setContacts(res.data || []);
        } catch (e) {
            console.error('Erro ao buscar contatos:', e);
            setError('Não foi possível carregar contatos. Usando dados de exemplo.');
            // Dados de exemplo
            setContacts([
                { id: 1, name: 'João Silva', phone: '5511999999999', stage: 'lead', lastMessage: '2026-01-20' },
                { id: 2, name: 'Maria Santos', phone: '5511988888888', stage: 'cliente', lastMessage: '2026-01-22' },
                { id: 3, name: 'Pedro Costa', phone: '5511977777777', stage: 'inativo', lastMessage: '2026-01-15' },
                { id: 4, name: 'Ana Oliveira', phone: '5511966666666', stage: 'lead', lastMessage: '2026-01-23' },
                { id: 5, name: 'Carlos Lima', phone: '5511955555555', stage: 'cliente', lastMessage: '2026-01-21' },
                { id: 6, name: 'Fernanda Souza', phone: '5511944444444', stage: 'lead', lastMessage: '2026-01-24' }
            ]);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get('/api/campaigns');
            setCampaigns(res.data || []);
        } catch (e) {
            console.error('Erro ao buscar campanhas:', e);
            setError('Não foi possível carregar campanhas. Usando dados de exemplo.');
            // Dados de exemplo
            setCampaigns([
                { id: 1, name: 'Campanha de Boas Vindas', message: 'Olá! Bem-vindo ao nosso atendimento!', status: 'completed', sent: 150, delivered: 142, createdAt: '2026-01-20' },
                { id: 2, name: 'Promoção de Janeiro', message: '🎉 30% de desconto em todos os produtos!', status: 'completed', sent: 280, delivered: 265, createdAt: '2026-01-22' },
                { id: 3, name: 'Lembrete de Agendamento', message: 'Lembrete do seu agendamento amanhã!', status: 'completed', sent: 95, delivered: 92, createdAt: '2026-01-23' }
            ]);
        }
    };

    const fetchTemplates = async () => {
        setTemplates([
            { id: 1, name: 'Boas Vindas', content: 'Olá {nome}! Bem-vindo ao nosso atendimento! Como posso ajudar você hoje?' },
            { id: 2, name: 'Promoção Especial', content: '🎉 Promoção especial! Aproveite 30% de desconto em todos os produtos por tempo limitado!' },
            { id: 3, name: 'Lembrete de Agendamento', content: 'Olá {nome}, lembrete do seu agendamento amanhã às {hora}. Estamos ansiosos para atendê-lo!' }
        ]);
    };

    const toggleSelect = (phone) => {
        if (selectedPhones.includes(phone)) {
            setSelectedPhones(prev => prev.filter(p => p !== phone));
        } else {
            setSelectedPhones(prev => [...prev, phone]);
        }
    };

    const selectAll = () => setSelectedPhones(contacts.map(c => c.phone));
    const selectNone = () => setSelectedPhones([]);

    const handleSend = async () => {
        if (!name || !template || selectedPhones.length === 0) {
            alert('Preencha o nome, mensagem e selecione contatos.');
            return;
        }

        if (!confirm(`Enviar para ${selectedPhones.length} contatos?`)) return;

        try {
            const res = await fetch(`${API_URL}/campaign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, template, phones: selectedPhones })
            });
            const data = await res.json();
            if (data.ok) {
                alert(`🚀 Disparo iniciado para ${data.queued} números!`);
                setName('');
                setTemplate('');
                setSelectedPhones([]);
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (e) {
            alert('Erro de conexão');
        }
    };

    // ⚡ Bolt: wrap derived collection in useMemo to prevent expensive recalculations on unrelated state changes (e.g. typing in name/template)
    const filteredContacts = useMemo(() => {
        return contacts.filter(c => {
            if (filters.stage !== 'all' && c.stage !== filters.stage) return false;
            return true;
        });
    }, [contacts, filters.stage]);

    return (
        <div className="h-full flex flex-col">
            {/* Header Stats - Same as other admin tabs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                    <div className="text-2xl mb-1">📢</div>
                    <div className="text-xl font-bold text-neon-blue">{campaigns.length}</div>
                    <div className="text-xs text-gray-400">Campanhas Totais</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                    <div className="text-2xl mb-1">📤</div>
                    <div className="text-xl font-bold text-neon-green">{campaignStats.totalSent.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Mensagens Enviadas</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                    <div className="text-2xl mb-1">✅</div>
                    <div className="text-xl font-bold text-green-500">{((campaignStats.totalDelivered / campaignStats.totalSent) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">Taxa de Entrega</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xl font-bold text-yellow-500">{campaignStats.totalConverted}</div>
                    <div className="text-xs text-gray-400">Conversões Totais</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-xl font-bold text-purple-500">471%</div>
                    <div className="text-xs text-gray-400">ROI Médio</div>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-500 font-medium">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-400">
                        Mostrando dados de exemplo para demonstração. As APIs podem não estar disponíveis.
                    </p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                {[
                    { id: 'create', icon: '📝', label: 'Criar Campanha' },
                    { id: 'history', icon: '📊', label: 'Histórico' },
                    { id: 'templates', icon: '📋', label: 'Templates' },
                    { id: 'analytics', icon: '📈', label: 'Analytics' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-neon-blue text-black' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'create' && (
                    <div className="flex gap-6 h-full">
                        {/* Left: Input */}
                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="glass-panel p-4 rounded-xl border border-gray-800">
                                <h3 className="text-xl font-bold text-neon-blue mb-4">📢 Nova Campanha</h3>

                                <label className="text-gray-400 text-sm">Nome da Campanha</label>
                                <input className="w-full bg-black/40 border border-gray-700 p-2 rounded text-white mb-4 outline-none focus:border-neon-blue" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Aviso Importante" />

                                <label className="text-gray-400 text-sm">Mensagem</label>
                                <textarea className="w-full h-32 bg-black/40 border border-gray-700 p-2 rounded text-white mb-4 outline-none focus:border-neon-blue resize-none" value={template} onChange={e => setTemplate(e.target.value)} placeholder="Olá!..." />

                                <div className="text-sm text-gray-500 mb-4">
                                    Selecionados: <span className="text-neon-green font-bold">{selectedPhones.length}</span>
                                </div>

                                <button onClick={handleSend} disabled={loading} className="w-full bg-neon-green text-black font-bold p-3 rounded hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all disabled:opacity-50">
                                    {loading ? 'ENVIANDO...' : '🚀 INICIAR DISPARO'}
                                </button>
                            </div>

                            {/* Templates Quick Access */}
                            <div className="glass-panel p-4 rounded-xl border border-gray-800">
                                <h4 className="text-white font-bold mb-3">📋 Templates Rápidos</h4>
                                <div className="space-y-2">
                                    {templates.slice(0, 3).map(t => (
                                        <button key={t.id} onClick={() => setTemplate(t.content)} className="w-full text-left p-2 bg-gray-800/50 rounded hover:bg-gray-700 transition-colors text-sm text-gray-300">
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Selector */}
                        <div className="flex-1 glass-panel p-4 rounded-xl border border-gray-800 flex flex-col h-full overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">👥 Selecionar Público</h3>
                                <div className="flex gap-2">
                                    <select value={filters.stage} onChange={e => setFilters({ ...filters, stage: e.target.value })} className="text-xs bg-gray-700 px-2 py-1 rounded outline-none">
                                        <option value="all">Todos</option>
                                        <option value="lead">Leads</option>
                                        <option value="cliente">Clientes</option>
                                        <option value="inativo">Inativos</option>
                                    </select>
                                    <button onClick={selectAll} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors">Todos</button>
                                    <button onClick={selectNone} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors">Nenhum</button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {filteredContacts.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => toggleSelect(c.phone)}
                                        className={`p-3 rounded cursor-pointer border transition-all hover:shadow-lg ${selectedPhones.includes(c.phone) ? 'bg-neon-blue/20 border-neon-blue shadow-neon-blue/20' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}
                                    >
                                        <div className="font-bold text-white truncate">{c.name || 'Desconhecido'}</div>
                                        <div className="text-xs text-gray-400">{c.phone}</div>
                                        <div className="text-xs text-gray-500 mt-1 uppercase">{c.stage}</div>
                                        {c.lastMessage && <div className="text-xs text-gray-600 mt-1">Última msg: {new Date(c.lastMessage).toLocaleDateString('pt-BR')}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="glass-panel p-6 rounded-xl border border-gray-800 h-full overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-6">📊 Histórico de Campanhas</h3>
                        <div className="space-y-4">
                            {campaigns.length === 0 ? (
                                <div className="text-center text-gray-500 py-12">
                                    <div className="text-4xl mb-4 opacity-50">📭</div>
                                    <p>Nenhuma campanha enviada ainda</p>
                                </div>
                            ) : (
                                campaigns.map(campaign => (
                                    <div key={campaign.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-white font-bold">{campaign.name}</h4>
                                            <span className={`px-2 py-1 rounded text-xs ${campaign.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2">{campaign.message}</p>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Enviados: {campaign.sent}</span>
                                            <span>Entregues: {campaign.delivered}</span>
                                            <span>Data: {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="glass-panel p-6 rounded-xl border border-gray-800 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">📋 Templates de Mensagem</h3>
                            <button className="bg-neon-blue text-black px-4 py-2 rounded font-bold hover:bg-neon-green transition-colors">+ Novo Template</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templates.map(template => (
                                <div key={template.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                    <h4 className="text-white font-bold mb-2">{template.name}</h4>
                                    <p className="text-gray-400 text-sm mb-4">{template.content}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setTemplate(template.content)} className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">Usar</button>
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500 transition-colors">Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6 h-full overflow-y-auto">
                        {/* Header Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                                <div className="text-2xl mb-1">📤</div>
                                <div className="text-xl font-bold text-neon-blue">{campaignStats.totalSent.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">Mensagens Enviadas</div>
                            </div>
                            <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                                <div className="text-2xl mb-1">✅</div>
                                <div className="text-xl font-bold text-neon-green">{((campaignStats.totalDelivered / campaignStats.totalSent) * 100).toFixed(1)}%</div>
                                <div className="text-xs text-gray-400">Taxa de Entrega</div>
                            </div>
                            <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                                <div className="text-2xl mb-1">👁️</div>
                                <div className="text-xl font-bold text-yellow-500">{campaignStats.avgOpenRate}%</div>
                                <div className="text-xs text-gray-400">Taxa de Abertura</div>
                            </div>
                            <div className="glass-panel p-4 rounded-xl border border-gray-800 text-center">
                                <div className="text-2xl mb-1">🎯</div>
                                <div className="text-xl font-bold text-purple-500">{campaignStats.avgConversionRate}%</div>
                                <div className="text-xs text-gray-400">Taxa de Conversão</div>
                            </div>
                        </div>

                        {/* Performance Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel p-6 rounded-xl border border-gray-800">
                                <h4 className="text-white font-bold mb-4">📈 Performance por Hora</h4>
                                <div className="h-48 bg-gray-900/50 rounded flex items-end justify-center gap-1 p-4">
                                    {[45, 67, 89, 72, 91, 54, 38, 76, 83, 65, 42, 58, 71, 63, 79, 55, 68, 74, 61, 82, 49, 73, 57, 69].map((height, i) => (
                                        <div key={i} className="flex-1 bg-neon-blue rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }} title={`${height}%`}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                                    <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-xl border border-gray-800">
                                <h4 className="text-white font-bold mb-4">📊 Conversões por Dia da Semana</h4>
                                <div className="space-y-3">
                                    {[
                                        { day: 'Segunda', conversions: 89, percentage: 85 },
                                        { day: 'Terça', conversions: 76, percentage: 72 },
                                        { day: 'Quarta', conversions: 94, percentage: 89 },
                                        { day: 'Quinta', conversions: 82, percentage: 78 },
                                        { day: 'Sexta', conversions: 105, percentage: 100 },
                                        { day: 'Sábado', conversions: 67, percentage: 64 },
                                        { day: 'Domingo', conversions: 58, percentage: 55 }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-16 text-xs text-gray-400">{item.day.slice(0, 3)}</div>
                                            <div className="flex-1 bg-gray-800 rounded-full h-2">
                                                <div className="bg-neon-green h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                            </div>
                                            <div className="w-12 text-xs text-gray-400 text-right">{item.conversions}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Campaign Performance Table */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h4 className="text-white font-bold mb-4">📋 Performance das Campanhas</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-2 text-gray-400">Campanha</th>
                                            <th className="text-center py-2 text-gray-400">Enviadas</th>
                                            <th className="text-center py-2 text-gray-400">Entregues</th>
                                            <th className="text-center py-2 text-gray-400">Cliques</th>
                                            <th className="text-center py-2 text-gray-400">Conversões</th>
                                            <th className="text-center py-2 text-gray-400">Taxa CTR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.map(campaign => (
                                            <tr key={campaign.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                                                <td className="py-3 text-white font-medium">{campaign.name}</td>
                                                <td className="py-3 text-center text-gray-300">{campaign.sent}</td>
                                                <td className="py-3 text-center text-green-400">{campaign.delivered}</td>
                                                <td className="py-3 text-center text-blue-400">{Math.floor(campaign.delivered * 0.15)}</td>
                                                <td className="py-3 text-center text-purple-400">{Math.floor(campaign.delivered * 0.025)}</td>
                                                <td className="py-3 text-center text-yellow-400">{(campaign.delivered * 0.15 / campaign.sent * 100).toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ROI Calculator */}
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h4 className="text-white font-bold mb-4">💰 Calculadora de ROI</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-900/50 rounded">
                                    <div className="text-lg font-bold text-green-500">R$ 12.450</div>
                                    <div className="text-xs text-gray-400">Receita Gerada</div>
                                </div>
                                <div className="text-center p-4 bg-gray-900/50 rounded">
                                    <div className="text-lg font-bold text-blue-500">R$ 2.180</div>
                                    <div className="text-xs text-gray-400">Custo das Campanhas</div>
                                </div>
                                <div className="text-center p-4 bg-gray-900/50 rounded">
                                    <div className="text-lg font-bold text-neon-green">471%</div>
                                    <div className="text-xs text-gray-400">ROI Total</div>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <div className="text-sm text-gray-400">
                                    Cada R$ 1 investido em campanhas gera R$ 4,71 em retorno
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BroadcastManager;
