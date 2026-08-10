// src/components/LeadsPerdidos.jsx - Sistema Inteligente de Leads Perdidos
import { useState, useEffect } from 'react';

export default function LeadsPerdidos() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [filtro, setFiltro] = useState('todos');
    const [pagina, setPagina] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);
    const [leadSelecionado, setLeadSelecionado] = useState(null);
    const [mensagemPersonalizada, setMensagemPersonalizada] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Carregar leads
    useEffect(() => {
        carregarLeads();
    }, [filtro, pagina]);

    const carregarLeads = async () => {
        try {
            const params = new URLSearchParams({
                filtro,
                pagina: pagina.toString(),
                limite: '50'
            });

            const response = await fetch(`/api/admin/leads?${params}`);
            const data = await response.json();

            setLeads(data.leads || []);
            setStats(data.stats || {});
        } catch (error) {
            console.error('Erro ao carregar leads:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtros disponíveis
    const filtrosDisponiveis = [
        { value: 'todos', label: 'Todos', emoji: '📋' },
        { value: 'nao_lidas', label: 'Não Reenviados', emoji: '🔔' },
        { value: 'urgentes', label: 'Alta Intenção', emoji: '🚨' },
        { value: 'recentes', label: 'Últimos 7 dias', emoji: '🕒' },
        { value: 'preco_alto', label: 'Preço Alto', emoji: '💰' },
        { value: 'atendimento', label: 'Atendimento', emoji: '🎧' },
        { value: 'duvida_estoque', label: 'Estoque', emoji: '📦' },
        { value: 'so_consulta', label: 'Só Consulta', emoji: '👀' },
        { value: 'desistiu', label: 'Desistiu', emoji: '🙅' }
    ];

    // Abrir modal de reenvio
    const abrirModal = (lead) => {
        setLeadSelecionado(lead);
        setMensagemPersonalizada(gerarMensagemAutomatica(lead));
        setModalAberto(true);
    };

    // Fechar modal
    const fecharModal = () => {
        setModalAberto(false);
        setLeadSelecionado(null);
        setMensagemPersonalizada('');
    };

    // Gerar mensagem automática baseada no motivo
    const gerarMensagemAutomatica = (lead) => {
        const { produto, preco, motivo_perda, interesse, tags } = lead;
        const primeiraTag = tags && tags.length > 0 ? tags[0] : '';

        const templates = {
            'preco_alto': `Oi! O ${produto} que você viu tá com R$ ${(preco * 0.9).toFixed(2)} hoje (10% off)! ⏰ Quer fechar agora?`,
            'atendimento': `Oi! Agora tô aqui 24h por dia. O ${produto} que você viu ainda tá disponível – quer ver de novo?`,
            'duvida_estoque': `Oi! Acabei de ver: o ${produto} ${interesse ? `(${interesse})` : ''} voltou pro estoque. Quer reservar antes que acabe?`,
            'so_consulta': `Vi que olhou o ${produto}. Chegou uma novidade e preço abaixou. Quer foto atualizada?`,
            'desistiu': `Ei, tudo bem? Fiquei pensando... se desistiu por qualquer motivo, posso mandar uma oferta especial. Só falar.`,
            'urgente': `FLASH SALE! 30% OFF em ${produto} - só hoje! Não perca: R$ ${(preco * 0.7).toFixed(2)}`,
            'outro': `Oi! Seu ${produto} ainda tá aqui. Tá na dúvida? Posso ajudar com frete grátis.`
        };

        return templates[motivo_perda] || templates.outro;
    };

    // Reenviar oferta
    const reenviarOferta = async () => {
        if (!mensagemPersonalizada.trim()) return;

        setEnviando(true);
        try {
            const response = await fetch('/api/admin/leads/reenviar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: leadSelecionado.id,
                    tipoMensagem: leadSelecionado.motivo_perda || 'personalizada',
                    conteudo: mensagemPersonalizada
                })
            });

            if (response.ok) {
                alert('✅ Oferta reenviada com sucesso!');

                // Atualizar status do lead na lista
                setLeads(leads.map(lead =>
                    lead.id === leadSelecionado.id
                        ? { ...lead, status: 'reenviado', enviado_reengajamento: true }
                        : lead
                ));

                fecharModal();
            } else {
                throw new Error('Erro ao reenviar');
            }
        } catch (error) {
            alert('❌ Erro ao reenviar oferta: ' + error.message);
        } finally {
            setEnviando(false);
        }
    };

    // Formatar moeda
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    // Badge de status
    const BadgeStatus = ({ status, urgente }) => {
        const cores = {
            'reenviado': 'bg-blue-900 text-blue-400',
            'fechado': 'bg-green-900 text-green-400',
            'urgente': 'bg-red-900 text-red-400 animate-pulse',
            'perdido': urgente ? 'bg-orange-900 text-orange-400' : 'bg-gray-900 text-gray-400'
        };

        return (
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${cores[status] || cores.perdido}`}>
                {urgente && '🚨 '}
                {status === 'reenviado' ? 'Reenviado' : status === 'fechado' ? 'Convertido' : status === 'perdido' ? 'Perdido' : status}
            </span>
        );
    };

    // Badge de score
    const BadgeScore = ({ score }) => {
        const cor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
        return <span className={`font-bold ${cor}`}>{score}%</span>;
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-black text-white">Leads Perdidos Inteligentes</h2>
                    <p className="text-gray-400 mt-1">Clientes que mostraram interesse mas não compraram</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-cyan-400">{stats.total || 0}</div>
                    <div className="text-sm text-gray-500">Total de leads</div>
                </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-cyan-900/30">
                    <div className="text-cyan-400 text-sm mb-1">Média Score</div>
                    <div className="text-2xl font-bold">{stats.mediaScore || 0}%</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-blue-900/30">
                    <div className="text-blue-400 text-sm mb-1">Reenviados</div>
                    <div className="text-2xl font-bold">{stats.reenviados || 0}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-green-900/30">
                    <div className="text-green-400 text-sm mb-1">Convertidos</div>
                    <div className="text-2xl font-bold">{stats.convertidos || 0}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-purple-900/30">
                    <div className="text-purple-400 text-sm mb-1">Taxa Conversão</div>
                    <div className="text-2xl font-bold">{stats.taxaConversao || 0}%</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filtrosDisponiveis.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFiltro(f.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filtro === f.value
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {f.emoji} {f.label}
                    </button>
                ))}
            </div>

            {/* Tabela de leads */}
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Cliente</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Produto</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Valor</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Motivo</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Score</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Tags</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Data</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {leads.map(lead => (
                            <tr key={lead.id} className="hover:bg-gray-800/50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{lead.nome || lead.numero}</div>
                                    <div className="text-sm text-gray-400">{lead.numero}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{lead.produto}</div>
                                    <div className="text-sm text-gray-400">{lead.interesse}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-green-400">
                                    {formatarMoeda(lead.preco)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${lead.motivo_perda === 'preco_alto' ? 'bg-red-900 text-red-400' :
                                            lead.motivo_perda === 'atendimento' ? 'bg-blue-900 text-blue-400' :
                                                lead.motivo_perda === 'duvida_estoque' ? 'bg-yellow-900 text-yellow-400' :
                                                    'bg-gray-900 text-gray-400'
                                        }`}>
                                        {lead.motivo_perda ? lead.motivo_perda.replace('_', ' ') : 'Não analisado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <BadgeScore score={lead.score_intencao} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {lead.tags && lead.tags.map((tag, i) => (
                                            <span key={i} className="inline-flex px-2 py-1 rounded text-xs bg-purple-900/50 text-purple-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <BadgeStatus status={lead.status} urgente={lead.score_intencao > 80} />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {lead.data_captura}
                                </td>
                                <td className="px-6 py-4">
                                    {lead.status === 'perdido' && !lead.enviado_reengajamento && (
                                        <button
                                            onClick={() => abrirModal(lead)}
                                            className="text-cyan-400 hover:text-cyan-300 text-sm underline font-medium"
                                        >
                                            Reenviar oferta
                                        </button>
                                    )}
                                    {lead.enviado_reengajamento && (
                                        <span className="text-green-400 text-sm">✅ Reenviado</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            {stats.total > 50 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setPagina(Math.max(1, pagina - 1))}
                        disabled={pagina === 1}
                        className="px-4 py-2 bg-gray-800 text-white rounded-l hover:bg-gray-700 disabled:opacity-50"
                    >
                        ← Anterior
                    </button>
                    <span className="px-4 py-2 bg-gray-900 text-white">
                        Página {pagina}
                    </span>
                    <button
                        onClick={() => setPagina(pagina + 1)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-r hover:bg-gray-700"
                    >
                        Próxima →
                    </button>
                </div>
            )}

            {/* Modal de reenvio */}
            {modalAberto && leadSelecionado && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-800">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Reenviar Oferta</h3>
                                <button onClick={fecharModal} aria-label="Fechar" className="text-gray-400 hover:text-white text-2xl">×</button>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-400">Cliente: <strong>{leadSelecionado.numero}</strong></p>
                                <p className="text-sm text-gray-400">Produto: <strong>{leadSelecionado.produto}</strong></p>
                                <p className="text-sm text-gray-400">
                                    Motivo: <strong className="text-yellow-400">{leadSelecionado.motivo_perda?.replace('_', ' ') || 'Não analisado'}</strong>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Score: <BadgeScore score={leadSelecionado.score_intencao} />
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Mensagem personalizada</label>
                                <textarea
                                    value={mensagemPersonalizada}
                                    onChange={(e) => setMensagemPersonalizada(e.target.value)}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                                    rows="4"
                                    placeholder="Digite sua mensagem..."
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={fecharModal}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-200 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={reenviarOferta}
                                    disabled={enviando || !mensagemPersonalizada.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {enviando ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <span>📱</span>
                                            Enviar WhatsApp
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}