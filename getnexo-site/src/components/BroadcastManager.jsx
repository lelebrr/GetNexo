
import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        fetchContacts();
        fetchCampaigns();
        fetchTemplates();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('/api/contacts');
            setContacts(res.data || []);
        } catch (e) { console.error('Erro ao buscar contatos:', e); }
    };

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get('/api/campaigns');
            setCampaigns(res.data || []);
        } catch (e) { console.error('Erro ao buscar campanhas:', e); }
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

    const filteredContacts = contacts.filter(c => {
        if (filters.stage !== 'all' && c.stage !== filters.stage) return false;
        return true;
    });

    return (
        <div className="h-full flex flex-col">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-panel p-6 rounded-xl border border-gray-800 text-center">
                                <div className="text-3xl mb-2">📤</div>
                                <div className="text-2xl font-bold text-neon-blue">2.847</div>
                                <div className="text-gray-400 text-sm">Mensagens Enviadas</div>
                            </div>
                            <div className="glass-panel p-6 rounded-xl border border-gray-800 text-center">
                                <div className="text-3xl mb-2">✅</div>
                                <div className="text-2xl font-bold text-neon-green">94.2%</div>
                                <div className="text-gray-400 text-sm">Taxa de Entrega</div>
                            </div>
                            <div className="glass-panel p-6 rounded-xl border border-gray-800 text-center">
                                <div className="text-3xl mb-2">👁️</div>
                                <div className="text-2xl font-bold text-yellow-500">23.1%</div>
                                <div className="text-gray-400 text-sm">Taxa de Abertura</div>
                            </div>
                        </div>
                        <div className="glass-panel p-6 rounded-xl border border-gray-800">
                            <h4 className="text-white font-bold mb-4">📈 Performance por Hora</h4>
                            <div className="h-64 bg-gray-900/50 rounded flex items-end justify-center gap-2 p-4">
                                {[45, 67, 89, 72, 91, 54, 38, 76, 83, 65, 42, 58].map((height, i) => (
                                    <div key={i} className="flex-1 bg-neon-blue rounded-t" style={{ height: `${height}%` }}></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
                                <span>06h</span><span>18h</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BroadcastManager;
