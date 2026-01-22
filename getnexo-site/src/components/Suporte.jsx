// src/components/Suporte.jsx - Chat completo com backend real
import { useState, useEffect, useRef } from 'react';

export default function Suporte() {
    const [mensagens, setMensagens] = useState([]);
    const [mensagemAtual, setMensagemAtual] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [conectado, setConectado] = useState(false);
    const chatRef = useRef(null);

    // Carregar histórico de mensagens
    useEffect(() => {
        carregarMensagens();
        // Simular conexão
        setTimeout(() => setConectado(true), 1000);
    }, []);

    // Scroll automático para a última mensagem
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [mensagens]);

    const carregarMensagens = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/suporte/mensagens', {
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                setMensagens(data.mensagens || []);
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    };

    const enviarMensagem = async () => {
        if (!mensagemAtual.trim() || enviando) return;

        const novaMsg = {
            id: Date.now(),
            de: 'eu',
            texto: mensagemAtual.trim(),
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        // Adicionar mensagem localmente primeiro
        setMensagens(prev => [...prev, novaMsg]);
        setMensagemAtual('');
        setEnviando(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/suporte/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    mensagem: novaMsg.texto,
                    timestamp: novaMsg.timestamp
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Adicionar resposta do suporte
                if (data.resposta) {
                    const respostaBot = {
                        id: Date.now() + 1,
                        de: 'bot',
                        texto: data.resposta,
                        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        timestamp: Date.now()
                    };
                    setMensagens(prev => [...prev, respostaBot]);
                }
            } else {
                // Mostrar erro na conversa
                const erroMsg = {
                    id: Date.now() + 1,
                    de: 'bot',
                    texto: 'Desculpe, houve um erro. Tente novamente ou abra um ticket.',
                    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    timestamp: Date.now(),
                    erro: true
                };
                setMensagens(prev => [...prev, erroMsg]);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            const erroMsg = {
                id: Date.now() + 1,
                de: 'bot',
                texto: 'Erro de conexão. Verifique sua internet.',
                hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
                erro: true
            };
            setMensagens(prev => [...prev, erroMsg]);
        } finally {
            setEnviando(false);
        }
    };

    const abrirTicket = async () => {
        const descricao = prompt('Descreva o problema detalhadamente:');
        if (!descricao?.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/suporte/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    titulo: 'Suporte Técnico',
                    descricao: descricao,
                    prioridade: 'normal'
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Ticket #${data.ticketId} criado com sucesso! Nossa equipe responderá em até 4 horas.`);
            } else {
                throw new Error('Erro ao criar ticket');
            }
        } catch (error) {
            alert('Erro ao criar ticket: ' + error.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    };

    return (
        <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white">Suporte GetNexo</h2>
                    <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-400">
                        {conectado ? 'Online' : 'Conectando...'}
                    </span>
                </div>
                <button
                    onClick={abrirTicket}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Novo Ticket
                </button>
            </div>

            {/* Área de chat */}
            <div
                ref={chatRef}
                className="flex-1 overflow-y-auto bg-gray-900 rounded-xl border border-gray-800 p-4 mb-4 space-y-4"
            >
                {mensagens.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Nenhuma conversa ainda.</p>
                        <p className="text-gray-600 text-sm">Envie uma mensagem para começar!</p>
                    </div>
                ) : (
                    mensagens.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.de === 'eu' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-xl ${msg.de === 'eu'
                                        ? 'bg-gradient-to-r from-cyan-600 to-green-600 text-black'
                                        : msg.erro
                                            ? 'bg-red-900/50 text-red-200 border border-red-700'
                                            : 'bg-gray-800 text-white'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">{msg.hora}</p>
                                {msg.erro && (
                                    <p className="text-xs text-red-300 mt-1">⚠️ Mensagem não enviada</p>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {enviando && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-xl">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input de mensagem */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={mensagemAtual}
                    onChange={(e) => setMensagemAtual(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    disabled={enviando}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                />
                <button
                    onClick={enviarMensagem}
                    disabled={enviando || !mensagemAtual.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {enviando ? '...' : 'Enviar'}
                </button>
            </div>

            {/* Rodapé de suporte */}
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center text-sm text-gray-400">
                    <div>
                        <p><strong>Suporte humano:</strong> seg-sex 9h-18h</p>
                        <p><strong>Resposta média:</strong> 2-4h</p>
                    </div>
                    <div className="text-right">
                        <p><strong>WhatsApp direto:</strong></p>
                        <a
                            href="https://wa.me/5511999999999?text=Olá! Preciso de suporte urgente"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 font-medium"
                        >
                            (51) 99999-9999
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}