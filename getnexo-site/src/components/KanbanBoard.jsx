
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const STAGES = {
    'lead': { label: 'Novo Lead', color: 'text-cyan-400', bg: 'bg-cyan-500/10', gradient: 'from-cyan-500 to-blue-600', icon: '✨' },
    'qualified': { label: 'Qualificado', color: 'text-purple-400', bg: 'bg-purple-500/10', gradient: 'from-purple-500 to-pink-500', icon: '🎯' },
    'proposal': { label: 'Em Negociação', color: 'text-orange-400', bg: 'bg-orange-500/10', gradient: 'from-orange-500 to-red-500', icon: '🔥' },
    'closed': { label: 'Venda Fechada', color: 'text-green-400', bg: 'bg-green-500/10', gradient: 'from-green-500 to-emerald-600', icon: '🏆' }
};

// Lead Temperature Scoring (Random mock for demo, in prod would use last_interaction)
const getLeadScore = (contact) => {
    // Mock logic: active leads get higher score
    const score = Math.floor(Math.random() * 100);
    if (score > 80) return { label: 'Quente', color: 'text-red-500', icon: '🔥', bg: 'bg-red-500/10' };
    if (score > 40) return { label: 'Morno', color: 'text-yellow-500', icon: '☀️', bg: 'bg-yellow-500/10' };
    return { label: 'Frio', color: 'text-blue-500', icon: '❄️', bg: 'bg-blue-500/10' };
};

// Avatar Color Generator
const getAvatarColor = (name) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

const KanbanBoard = ({ onSelectContact }) => {
    const [contacts, setContacts] = useState([]);
    const [draggedId, setDraggedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiInsights, setAiInsights] = useState({});
    const [insightLoading, setInsightLoading] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/contacts`);
            // Ensure all contacts have a funnel_stage
            const processed = (res.data || []).map(c => ({
                ...c,
                funnel_stage: c.funnel_stage || 'lead'
            }));
            setContacts(processed);
        } catch (error) {
            console.error('Erro ao buscar contatos:', error);
            // Mock Fallback
            setContacts([
                { id: '1', name: 'João Silva', phone: '5511999999999', funnel_stage: 'lead', value: 1500, last_message: { body: 'Tenho interesse no plano Enterprise' } },
                { id: '2', name: 'Maria Santos', phone: '5511888888888', funnel_stage: 'qualified', value: 3200, last_message: { body: 'Podemos agendar uma call?' } },
                { id: '3', name: 'Carlos Oliveira', phone: '5511777777777', funnel_stage: 'proposal', value: 5000, last_message: { body: 'Aguardando contrato.' } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e, id) => {
        setDraggedId(id);
    };

    const handleDrop = async (e, stage) => {
        e.preventDefault();
        if (!draggedId) return;

        // Optimistic Update
        setContacts(prev => prev.map(c => c.id === draggedId ? { ...c, funnel_stage: stage } : c));

        await axios.post(`${API_URL}/update-stage`, { phone: draggedId, stage });
        setDraggedId(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const toggleAIInsight = async (contactId, phone, name) => {
        if (insightLoading === contactId) return;
        if (aiInsights[contactId]) {
            setAiInsights(prev => { const n = { ...prev }; delete n[contactId]; return n; });
            return;
        }

        setInsightLoading(contactId);
        try {
            const res = await axios.post(`${API_URL}/api/ai/lead-insight`, { phone, name });
            setAiInsights(prev => ({ ...prev, [contactId]: res.data.insight }));
        } catch (e) {
            alert('Erro ao gerar insight.');
        } finally {
            setInsightLoading(null);
        }
    };

    return (
        <div className="flex h-full gap-6 overflow-x-auto pb-4 p-6">
            {Object.entries(STAGES).map(([stageId, stage]) => {
                const columnContacts = contacts.filter(c => (c.funnel_stage || 'lead') === stageId);
                const totalValue = columnContacts.reduce((acc, c) => acc + (c.value || 0), 0);

                return (
                    <div
                        key={stageId}
                        className="min-w-[320px] w-[320px] flex flex-col rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stageId)}
                    >
                        {/* Column Header */}
                        <div className={`p-4 rounded-t-2xl border-b border-gray-800 bg-gradient-to-r ${stage.gradient} bg-opacity-10`}>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={`font-bold text-sm ${stage.color} flex items-center gap-2`}>
                                    <span className="text-xl">{stage.icon}</span> {stage.label}
                                </h3>
                                <span className="bg-black/30 px-2 py-1 rounded-full text-xs font-mono text-gray-400">
                                    {columnContacts.length}
                                </span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono tracking-wider">
                                POTENCIAL: R$ {totalValue.toLocaleString('pt-BR')}
                            </div>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                            {columnContacts.map(contact => {
                                const score = getLeadScore(contact);
                                const hasInsight = aiInsights[contact.id];

                                return (
                                    <div
                                        key={contact.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, contact.id)}
                                        className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-move hover:border-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-200"
                                    >
                                        {/* Contact Header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(contact.name || '?')} flex items-center justify-center text-white font-bold shadow-lg`}>
                                                {(contact.name?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white text-sm truncate">{contact.name || contact.phone}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${score.color} ${score.bg} border-${score.color}/20 flex items-center gap-1`}>
                                                        {score.icon} {score.label}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">2h atrás</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions (Hover) */}
                                        <div className="flex gap-2 mb-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                            <button onClick={() => onSelectContact && onSelectContact(contact)} className="flex-1 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 py-1 rounded text-xs font-bold transition-colors">
                                                💬 Chat
                                            </button>
                                            <button className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 py-1 rounded text-xs font-bold transition-colors">
                                                📞 Ligar
                                            </button>
                                        </div>

                                        {/* AI Insight Section */}
                                        {hasInsight && (
                                            <div className="mb-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg animate-fade-in">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[10px] font-bold text-purple-400">🧠 NEXO AI INSIGHT</span>
                                                    <button onClick={() => toggleAIInsight(contact.id)} className="text-[10px] text-gray-500 hover:text-white">✕</button>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed italic">
                                                    "{hasInsight}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer Actions */}
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                            <button
                                                onClick={() => toggleAIInsight(contact.id, contact.phone, contact.name)}
                                                className={`text-[10px] flex items-center gap-1 transition-colors ${hasInsight ? 'text-purple-400' : 'text-gray-500 hover:text-purple-400'}`}
                                            >
                                                <span className={insightLoading === contact.id ? 'animate-spin' : ''}>
                                                    {insightLoading === contact.id ? '⏳' : '✨'}
                                                </span>
                                                {insightLoading === contact.id ? 'Analizando...' : (hasInsight ? 'Ver Insight' : 'Gerar Insight')}
                                            </button>
                                            <div className="flex -space-x-2">
                                                {/* Mock user markers */}
                                                <div className="w-5 h-5 rounded-full bg-gray-700 border border-gray-900"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanBoard;
