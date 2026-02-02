
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import OrderBuilder from './OrderBuilder';
import MeetingScheduler from './MeetingScheduler';

const API_URL = '';

const socket = io(API_URL);

const MessageItem = React.memo(({ message: m }) => (
    <div className={`flex ${m.from_me ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] p-4 rounded-2xl shadow-lg backdrop-blur-sm border ${m.type === 'note'
            ? 'bg-yellow-900/40 border-yellow-600 text-yellow-100' // Internal Note Style
            : m.from_me
                ? 'bg-neon-blue/20 border-neon-blue/30 text-white rounded-tr-none'
                : 'bg-gray-800/80 border-gray-700 text-gray-200 rounded-tl-none'
            }`}>
            {m.type === 'note' && <div className="text-[10px] uppercase font-bold text-yellow-500 mb-1 flex items-center gap-1">🔒 Nota Interna</div>}
            <p className="whitespace-pre-wrap leading-relaxed text-sm">{m.body}</p>
            <span className="text-[10px] opacity-50 mt-2 block text-right">{new Date().toLocaleTimeString().slice(0, 5)}</span>
        </div>
    </div>
));

const ContactItem = React.memo(({ contact: c, isActive, onClick, onDragStart }) => (
    <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(c)}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.key === ' ') e.preventDefault();
                onClick(c);
            }
        }}
        aria-selected={isActive}
        aria-label={`Conversa com ${c.name || c.phone}. Status: ${c.stage || 'Novo'}. ${c.last_message?.body ? 'Última mensagem: ' + c.last_message.body : ''}`}
        draggable
        onDragStart={(e) => onDragStart(e, c)}
        className={`p-3 rounded-xl cursor-pointer transition-all border ${isActive ? 'bg-neon-blue/10 border-neon-blue' : 'bg-transparent border-transparent hover:bg-gray-800'} flex items-center gap-3 group`}
    >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-gray-600">
            {c.name ? c.name[0].toUpperCase() : '#'}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-200 truncate group-hover:text-white transition-colors">{c.name || c.phone}</h4>
                <span className="text-[10px] text-gray-500 bg-gray-900 px-1 rounded uppercase tracking-wider">{c.stage || 'NEW'}</span>
            </div>
            <p className="text-xs text-gray-500 truncate">{c.last_message?.body || 'Inicie a conversa...'}</p>
        </div>
    </div>
));

const ChatInterface = () => {
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // New State for "Pro" Features
    const [isNote, setIsNote] = useState(false);
    const [macros, setMacros] = useState([]);
    const [showMacros, setShowMacros] = useState(false);
    const [showCsat, setShowCsat] = useState(false);

    // Enterprise V2 State
    const [inboxTab, setInboxTab] = useState('all'); // 'all', 'mine', 'resolved'
    const [agents, setAgents] = useState([]);
    const [ticket, setTicket] = useState(null); // { status, assigned_to }
    const [showOrderBuilder, setShowOrderBuilder] = useState(false);
    const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);
    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('omnichat_user') || '{}');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchContacts();
        fetchMacros();
        fetchAgents();
        socket.on('new-message', handleNewMessage);
        socket.on('ticket:update', (data) => {
            // Real-time update of ticket status if viewing that contact
            if (activeContactRef.current && activeContactRef.current.phone === data.phone) {
                fetchTicket(data.phone);
            }
            fetchContacts(); // Refresh lists
        });
        socket.on('contact:new', fetchContacts);
        socket.on('contact-updated', fetchContacts);

        return () => {
            socket.off('new-message');
            socket.off('contact:new');
            socket.off('contact-updated');
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${API_URL}/contacts`);
            setContacts(res.data);
            setLoading(false);
        } catch (err) { console.error("Error fetching contacts", err); }
    };

    const fetchMacros = async () => {
        try {
            const res = await axios.get(`${API_URL}/macros`);
            setMacros(res.data);
        } catch (e) { }
    };
    const fetchAgents = async () => {
        try { const res = await axios.get(`${API_URL}/users`); setAgents(res.data); } catch (e) { }
    };

    const fetchTicket = useCallback(async (phone) => {
        try {
            const res = await axios.get(`${API_URL}/ticket/${phone}`);
            setTicket(res.data);
        } catch (e) { setTicket(null); }
    }, []);

    const handleAssign = async (agentId) => {
        if (!activeContact) return;
        await axios.post(`${API_URL}/ticket/assign`, { phone: activeContact.phone, agent_id: agentId });
        fetchTicket(activeContact.phone);
    };

    const handleResolve = async () => {
        if (!activeContact) return;
        await axios.post(`${API_URL}/ticket/resolve`, { phone: activeContact.phone });
        setTicket({ ...ticket, status: 'resolved' });
    };

    const activeContactRef = useRef(activeContact);
    useEffect(() => { activeContactRef.current = activeContact; }, [activeContact]);

    const handleNewMessage = (msg) => {
        if (activeContactRef.current && activeContactRef.current.phone === msg.phone) {
            setMessages(prev => [...prev, msg]);
        }
        fetchContacts();
    };

    const selectContact = useCallback(async (contact) => {
        setActiveContact(contact);
        fetchTicket(contact.phone);
        try {
            const res = await axios.get(`${API_URL}/messages?phone=${contact.phone}`);
            setMessages(res.data);
        } catch (err) { console.error(err); }
    }, [fetchTicket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeContact) return;

        setIsSending(true);
        try {
            // Support Internal Notes
            const endpoint = `${API_URL}/send`;
            await axios.post(endpoint, {
                phone: activeContact.phone,
                body: input,
                type: isNote ? 'note' : 'text'
            });
            setInput('');
            setIsNote(false); // Reset to normal mode
            setShowMacros(false);
        } catch (err) { alert('Failed to send'); }
        finally { setIsSending(false); }
    };

    // Drag and Drop (Kanban Stage Update) Mock
    const handleDragStart = useCallback((e, contact) => { e.dataTransfer.setData("contactPhone", contact.phone); }, []);

    const insertMacro = (text) => {
        setInput(text);
        setShowMacros(false);
    };

    const suggestAI = async () => {
        if (!activeContact) return;
        setAiSuggesting(true);
        try {
            const res = await axios.post(`${API_URL}/api/ai/suggest`, {
                history: messages,
                currentMessage: messages[messages.length - 1]?.body,
                context: activeContact.name || activeContact.phone
            });
            if (res.data.suggestion) {
                setInput(res.data.suggestion);
            }
        } catch (e) {
            alert('Erro ao gerar sugestão da IA.');
        } finally {
            setAiSuggesting(false);
        }
    };

    const handleRate = async (nota) => {
        try {
            await axios.post(`${API_URL}/csat`, { phone: activeContact.phone, nota });
            alert('Obrigado pela avaliação!');
            setShowCsat(false);
        } catch (e) { }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[80vh] gap-6">

            {/* Sidebar - Contact List */}
            <div className={`flex flex-col glass-panel rounded-2xl border border-gray-800 overflow-hidden ${activeContact ? 'hidden lg:flex w-full lg:w-1/3' : 'w-full lg:w-1/3 flex'}`}>
                <div className="p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-10 space-y-3">
                    {/* Multichannel Mock Tabs */}
                    <div className="flex gap-1 bg-gray-900 p-1 rounded-lg">
                        <button className="flex-1 bg-gray-800 text-white text-xs py-1 rounded shadow text-center">WhatsApp</button>
                        <button className="flex-1 text-gray-500 hover:text-white text-xs py-1 text-center">Instagram</button>
                        <button className="flex-1 text-gray-500 hover:text-white text-xs py-1 text-center">Messenger</button>
                    </div>
                    {/* Inbox Filters */}
                    <div className="flex justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                        <button aria-pressed={inboxTab === 'mine'} onClick={() => setInboxTab('mine')} className={`${inboxTab === 'mine' ? 'text-neon-blue font-bold border-b-2 border-neon-blue' : 'hover:text-white'}`}>Meus</button>
                        <button aria-pressed={inboxTab === 'all'} onClick={() => setInboxTab('all')} className={`${inboxTab === 'all' ? 'text-white font-bold border-b-2 border-white' : 'hover:text-white'}`}>Todos</button>
                        <button aria-pressed={inboxTab === 'resolved'} onClick={() => setInboxTab('resolved')} className={`${inboxTab === 'resolved' ? 'text-green-500 font-bold border-b-2 border-green-500' : 'hover:text-white'}`}>Resolvidos</button>
                    </div>

                    <input placeholder="Buscar..." aria-label="Buscar contatos" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-neon-blue" />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {loading ? <div className="text-center text-gray-500 mt-10">Carregando...</div> : contacts.map(c => (
                        <ContactItem
                            key={c.id}
                            contact={c}
                            isActive={activeContact?.id === c.id}
                            onClick={selectContact}
                            onDragStart={handleDragStart}
                        />
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex flex-col glass-panel rounded-2xl border border-gray-800 overflow-hidden relative ${activeContact ? 'flex w-full lg:flex-1' : 'hidden lg:flex lg:flex-1'}`}>
                {activeContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md flex justify-between items-center z-10">
                            <div className="flex items-center gap-3">
                                {/* Back Button Mobile */}
                                <button
                                    onClick={() => setActiveContact(null)}
                                    className="lg:hidden text-gray-400 hover:text-white mr-2"
                                >
                                    ←
                                </button>
                                <div>
                                    <h3 className="font-bold text-xl text-white flex items-center gap-2">
                                        {activeContact.name || activeContact.phone}
                                        {ticket?.status === 'resolved' && <span className="text-xs bg-green-900 text-green-300 px-2 rounded-full border border-green-700">RESOLVIDO</span>}
                                    </h3>
                                    <div className="text-xs flex gap-3 text-gray-400">
                                        <select
                                            className="bg-transparent border-none outline-none cursor-pointer hover:text-neon-blue transition-colors"
                                            value={ticket?.assigned_to || ""}
                                            onChange={(e) => handleAssign(e.target.value)}
                                        >
                                            <option value="">👤 Atribuir a...</option>
                                            {agents.map(a => <option key={a.id} value={a.id}>{a.email}</option>)}
                                        </select>
                                        {ticket?.status !== 'resolved' && (
                                            <button onClick={handleResolve} className="hover:text-green-400">✅ Resolver</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex gap-2 relative">
                                    <button onClick={() => setShowOrderBuilder(true)} className="text-xs bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-black px-3 py-1 rounded border border-neon-blue transition-colors font-bold">
                                        🛍️ Venda Assistida
                                    </button>
                                    <button onClick={() => setShowMeetingScheduler(true)} className="text-xs bg-purple-900/20 text-purple-400 hover:bg-purple-800 hover:text-white px-3 py-1 rounded border border-purple-800 transition-colors font-bold">
                                        📅 Agendar Reunião
                                    </button>
                                    <button onClick={() => setShowCsat(!showCsat)} className="text-xs bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-1 rounded border border-gray-600 transition-colors">
                                        ⭐ CSAT
                                    </button>
                                    {showCsat && (
                                        <div className="absolute top-10 right-0 w-64 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl z-50">
                                            <p className="text-gray-300 mb-3 text-sm font-bold text-center">Nota de 1 a 5:</p>
                                            <div className="flex gap-2 justify-center">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button key={n} aria-label={`Avaliar com ${n} estrela${n > 1 ? 's' : ''}`} onClick={() => handleRate(n)} className="w-8 h-8 rounded-full bg-gray-800 hover:bg-neon-blue hover:text-black text-white font-bold transition-colors border border-gray-600 hover:border-neon-blue">{n}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-dots-pattern">
                            {messages.map((m, i) => (
                                <MessageItem key={i} message={m} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className={`p-4 border-t border-gray-800 ${isNote ? 'bg-yellow-900/20' : 'bg-black/40'} relative transition-all duration-300`}>

                            {/* Quick Actions Bar */}
                            <div className="flex items-center gap-3 mb-2 px-1">
                                <button
                                    onClick={() => setIsNote(!isNote)}
                                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${isNote ? 'bg-yellow-500 text-black border-yellow-500' : 'text-gray-400 border-gray-700 hover:border-gray-500'}`}
                                >
                                    🔒 NOTA INTERNA
                                </button>
                                <button
                                    onClick={() => setShowMacros(!showMacros)}
                                    className="text-[10px] font-bold px-3 py-1 rounded-full text-neon-blue border border-gray-700 hover:border-neon-blue transition-all"
                                >
                                    ⚡ RESPOSTA RÁPIDA
                                </button>
                                <button
                                    onClick={suggestAI}
                                    disabled={aiSuggesting}
                                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${aiSuggesting ? 'bg-gray-700 text-gray-500 border-gray-600' : 'bg-purple-900/20 text-purple-400 border-purple-800 hover:bg-purple-800 hover:text-white'}`}
                                >
                                    🤖 {aiSuggesting ? 'GERANDO...' : 'IA SUGERIR'}
                                </button>
                            </div>

                            <form onSubmit={sendMessage} className="flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        className={`w-full bg-gray-900/50 border p-4 pr-12 rounded-2xl text-white outline-none transition-all ${isNote ? 'border-yellow-600 focus:shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-gray-800 focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]'}`}
                                        placeholder={isNote ? "Escreva uma nota interna (invisível para o cliente)..." : "Digite sua mensagem..."}
                                        aria-label="Digite sua mensagem"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                        <button type="button" aria-label="Anexar arquivo" className="text-gray-500 hover:text-white transition-colors">📎</button>
                                        <button type="button" aria-label="Inserir emoji" className="text-gray-500 hover:text-white transition-colors">😊</button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className={`px-8 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center gap-2 ${isNote ? 'bg-yellow-600 text-black hover:bg-yellow-500 shadow-[0_4px_15px_rgba(234,179,8,0.3)]' : 'bg-neon-blue text-black hover:bg-white shadow-[0_4px_15px_rgba(0,212,255,0.3)]'} ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {isSending ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            ENVIANDO
                                        </div>
                                    ) : (
                                        <>
                                            {isNote ? 'SALVAR' : 'ENVIAR'}
                                            <span className="text-lg">🚀</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 bg-dots-pattern">
                        <div className="w-24 h-24 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-6 animate-pulse shadow-2xl">
                            <span className="text-5xl">💬</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mb-2">Central de Atendimento</h3>
                        <p className="text-sm opacity-60">Selecione uma conversa para começar a vender</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Contact Details */}
            {activeContact && showRightSidebar && (
                <div className="w-1/4 flex flex-col glass-panel rounded-2xl border border-gray-800 animate-slide-in-right">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h4 className="font-bold text-gray-300">Detalhes do Lead</h4>
                        <button onClick={() => setShowRightSidebar(false)} aria-label="Fechar detalhes do contato" className="text-gray-500 hover:text-white">✕</button>
                    </div>
                    <div className="p-6 flex flex-col items-center border-b border-gray-800">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                            {activeContact.name ? activeContact.name[0].toUpperCase() : '?'}
                        </div>
                        <h3 className="text-lg font-bold text-white text-center">{activeContact.name || 'Sem Nome'}</h3>
                        <p className="text-sm text-gray-400">{activeContact.phone}</p>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto space-y-6">
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Tags</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-neon-blue/10 text-neon-blue text-[10px] px-2 py-1 rounded border border-neon-blue/20">🔥 Lead Quente</span>
                                <span className="bg-purple-900/20 text-purple-400 text-[10px] px-2 py-1 rounded border border-purple-800">🤖 IA Ativa</span>
                                <button aria-label="Adicionar nova tag" className="text-[10px] text-gray-500 border border-dashed border-gray-700 px-2 py-1 rounded hover:border-gray-500">+ Add</button>
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Histórico de Pedidos</span>
                            <div className="text-xs text-gray-600 italic p-4 bg-black/20 rounded-xl border border-gray-800 text-center">
                                Nenhum pedido encontrado.
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Notas Rápidas</span>
                            <textarea
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 outline-none focus:border-neon-blue min-h-[100px]"
                                placeholder="Anotações sobre este cliente..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            )}


            {
                showOrderBuilder && (
                    <OrderBuilder
                        onClose={() => setShowOrderBuilder(false)}
                        onSendOrder={(text) => {
                            setInput(text);
                            setShowOrderBuilder(false);
                        }}
                    />
                )
            }
            {
                showMeetingScheduler && (
                    <MeetingScheduler
                        contact={activeContact}
                        onClose={() => setShowMeetingScheduler(false)}
                        onScheduled={(text) => {
                            setInput(text);
                            setShowMeetingScheduler(false);
                        }}
                    />
                )
            }
        </div >
    );
};

export default ChatInterface;
