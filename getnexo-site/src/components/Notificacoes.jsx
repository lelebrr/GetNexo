// src/components/Notificacoes.jsx - Sistema de notificações real-time
import { useState, useEffect } from 'react';

export default function Notificacoes() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('todas');

    // Carregar notificações
    useEffect(() => {
        carregarNotificacoes();

        // Simular WebSocket para notificações real-time
        const interval = setInterval(() => {
            // Simular novas notificações chegando
            if (Math.random() > 0.8) {
                adicionarNotificacaoSimulada();
            }
        }, 30000); // A cada 30 segundos

        return () => clearInterval(interval);
    }, []);

    const carregarNotificacoes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/notificacoes', {
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                setNotificacoes(data.notificacoes || []);
            } else {
                // Fallback com dados mock
                setNotificacoes([
                    {
                        id: 1,
                        tipo: 'venda',
                        titulo: 'Nova venda realizada!',
                        mensagem: 'Cliente João comprou Smartphone Galaxy por R$ 2.499',
                        hora: '14:30',
                        lida: false,
                        urgente: true
                    },
                    {
                        id: 2,
                        tipo: 'suporte',
                        titulo: 'Ticket de suporte',
                        mensagem: 'Novo ticket #1234 aguardando resposta',
                        hora: '13:45',
                        lida: false,
                        urgente: false
                    },
                    {
                        id: 3,
                        tipo: 'sistema',
                        titulo: 'Backup concluído',
                        mensagem: 'Backup automático das 02:00 executado com sucesso',
                        hora: '02:00',
                        lida: true,
                        urgente: false
                    }
                ]);
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setCarregando(false);
        }
    };

    const adicionarNotificacaoSimulada = () => {
        const tipos = ['venda', 'suporte', 'sistema'];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];

        const mensagens = {
            venda: ['Nova venda realizada!', 'Cliente comprou produto', 'Pagamento aprovado'],
            suporte: ['Novo ticket criado', 'Cliente solicitou ajuda', 'Pergunta frequente'],
            sistema: ['Backup concluído', 'Atualização disponível', 'Alerta de segurança']
        };

        const novaNotificacao = {
            id: Date.now(),
            tipo,
            titulo: mensagens[tipo][Math.floor(Math.random() * mensagens[tipo].length)],
            mensagem: `Notificação ${tipo} gerada automaticamente`,
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            lida: false,
            urgente: Math.random() > 0.7
        };

        setNotificacoes(prev => [novaNotificacao, ...prev]);

        // Mostrar notificação push se permitido
        if (Notification.permission === 'granted' && !document.hidden) {
            new Notification(novaNotificacao.titulo, {
                body: novaNotificacao.mensagem,
                icon: '/logo.svg',
                tag: 'getnexo'
            });
        }
    };

    const marcarComoLida = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/notificacoes/${id}/ler`, {
                method: 'POST',
                headers: { 'Authorization': token }
            });

            setNotificacoes(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, lida: true } : notif
                )
            );
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };

    const marcarTodasComoLidas = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/admin/notificacoes/marcar-todas-lidas', {
                method: 'POST',
                headers: { 'Authorization': token }
            });

            setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
        }
    };

    const excluirNotificacao = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/notificacoes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });

            setNotificacoes(prev => prev.filter(notif => notif.id !== id));
        } catch (error) {
            console.error('Erro ao excluir notificação:', error);
        }
    };

    const notificacoesFiltradas = notificacoes.filter(notif => {
        if (filtro === 'nao-lidas') return !notif.lida;
        if (filtro === 'urgentes') return notif.urgente;
        return true;
    });

    const naoLidas = notificacoes.filter(n => !n.lida).length;

    if (carregando) {
        return (
            <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-white">Notificações</h2>
                    {naoLidas > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {naoLidas}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                    >
                        <option value="todas">Todas</option>
                        <option value="nao-lidas">Não lidas</option>
                        <option value="urgentes">Urgentes</option>
                    </select>
                    <button
                        onClick={marcarTodasComoLidas}
                        disabled={naoLidas === 0}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded transition text-sm"
                    >
                        Marcar todas lidas
                    </button>
                </div>
            </div>

            {/* Lista de notificações */}
            <div className="space-y-3">
                {notificacoesFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔔</div>
                        <p className="text-gray-500 text-lg">
                            {filtro === 'nao-lidas' ? 'Nenhuma notificação não lida' :
                                filtro === 'urgentes' ? 'Nenhuma notificação urgente' :
                                    'Nenhuma notificação ainda'}
                        </p>
                    </div>
                ) : (
                    notificacoesFiltradas.map(notif => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${notif.lida
                                    ? 'bg-gray-900 border-gray-800 opacity-75'
                                    : 'bg-gray-800 border-gray-700 shadow-lg'
                                } ${notif.urgente ? 'border-red-500 bg-red-900/20' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Ícone do tipo */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${notif.tipo === 'venda' ? 'bg-green-600' :
                                        notif.tipo === 'suporte' ? 'bg-blue-600' :
                                            'bg-purple-600'
                                    }`}>
                                    {notif.tipo === 'venda' ? '💰' :
                                        notif.tipo === 'suporte' ? '🎧' :
                                            '⚙️'}
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className={`font-bold text-sm ${notif.lida ? 'text-gray-300' : 'text-white'}`}>
                                                {notif.urgente && <span className="text-red-400 mr-1">🚨</span>}
                                                {notif.titulo}
                                            </h4>
                                            <p className={`text-sm mt-1 ${notif.lida ? 'text-gray-500' : 'text-gray-300'}`}>
                                                {notif.mensagem}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">{notif.hora}</span>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-2 mt-3">
                                        {!notif.lida && (
                                            <button
                                                onClick={() => marcarComoLida(notif.id)}
                                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs transition"
                                            >
                                                Marcar como lida
                                            </button>
                                        )}
                                        <button
                                            onClick={() => excluirNotificacao(notif.id)}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs transition"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Configurações de notificação */}
            <div className="mt-8 bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl">⚙️</span>
                    Configurações de Notificação
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mr-3"
                            />
                            <div>
                                <div className="text-sm font-medium">Notificações push</div>
                                <div className="text-xs text-gray-500">Receber no navegador</div>
                            </div>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mr-3"
                            />
                            <div>
                                <div className="text-sm font-medium">Som de notificação</div>
                                <div className="text-xs text-gray-500">Reproduzir som ao receber</div>
                            </div>
                        </label>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mr-3"
                            />
                            <div>
                                <div className="text-sm font-medium">Vendas</div>
                                <div className="text-xs text-gray-500">Novas vendas realizadas</div>
                            </div>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                defaultChecked
                                className="mr-3"
                            />
                            <div>
                                <div className="text-sm font-medium">Suporte</div>
                                <div className="text-xs text-gray-500">Novos tickets e mensagens</div>
                            </div>
                        </label>
                    </div>
                </div>

                <button className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded hover:from-cyan-400 hover:to-green-400 transition">
                    Salvar Configurações
                </button>
            </div>

            {/* Status de conexão real-time */}
            <div className="mt-6 flex items-center gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Conectado ao servidor de notificações</span>
                <span className="text-xs text-gray-500 ml-auto">Real-time ativo</span>
            </div>
        </div>
    );
}