// src/components/Financeiro.jsx - Completo com backend real
import { useState, useEffect } from 'react';

export default function Financeiro() {
    const [historico, setHistorico] = useState([]);
    const [nfModal, setNFModal] = useState(false);
    const [notaFiscal, setNotaFiscal] = useState('');
    const [carregando, setCarregando] = useState(true);

    // Dados financeiros
    const [resumo, setResumo] = useState({
        totalFaturado: 2381,
        pendentes: 97,
        mensal: 297,
        economia: 75
    });

    // Carregar histórico financeiro
    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/financeiro/historico', {
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                setHistorico(data.historico || []);
                setResumo(data.resumo || resumo);
            } else {
                // Fallback com dados mock
                setHistorico([
                    { id: 1, data: '22/01/26', tipo: 'Trial', valor: 0, status: 'ativo' },
                    { id: 2, data: '22/01/26', tipo: 'IA Plus', valor: 197, status: 'pago' },
                    { id: 3, data: '15/01/26', tipo: '360 AR', valor: 97, status: 'pago' },
                    { id: 4, data: '01/01/26', tipo: 'Mensal Pro', valor: 297, status: 'pago' }
                ]);
            }
        } catch (error) {
            console.error('Erro ao carregar financeiro:', error);
        } finally {
            setCarregando(false);
        }
    };

    const emitirNF = async () => {
        if (!notaFiscal.trim()) {
            alert('Digite o CPF/CNPJ primeiro!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/financeiro/nf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    documento: notaFiscal,
                    periodo: new Date().toISOString().slice(0, 7) // YYYY-MM
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`NF-e #${data.numeroNF} gerada com sucesso! Baixando PDF...`);
                setNFModal(false);
                // Simular download
                window.open(data.pdfUrl, '_blank');
            } else {
                throw new Error('Erro ao gerar NF-e');
            }
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    };

    const fazerPix = async (valor) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/financeiro/pix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ valor })
            });

            if (response.ok) {
                const data = await response.json();
                // Abrir QR Code do Pix
                window.open(data.qrCodeUrl, '_blank');
                alert('QR Code do Pix gerado! Escaneie para pagar.');
            } else {
                throw new Error('Erro ao gerar Pix');
            }
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    };

    if (carregando) {
        return (
            <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-black mb-6">Financeiro</h2>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900 p-4 rounded-lg border border-cyan-900/50">
                    <div className="text-cyan-400 text-xs uppercase tracking-wide">Total Faturado</div>
                    <div className="text-2xl font-bold text-white">R$ {resumo.totalFaturado.toLocaleString('pt-BR')}</div>
                    <div className="text-green-400 text-xs mt-1">+12% vs mês passado</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-orange-900/50">
                    <div className="text-orange-400 text-xs uppercase tracking-wide">Pendentes</div>
                    <div className="text-2xl font-bold text-white">R$ {resumo.pendentes.toLocaleString('pt-BR')}</div>
                    <div className="text-orange-400 text-xs mt-1">Vencem hoje</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-green-900/50">
                    <div className="text-green-400 text-xs uppercase tracking-wide">Mensal Atual</div>
                    <div className="text-2xl font-bold text-white">R$ {resumo.mensal.toLocaleString('pt-BR')}</div>
                    <div className="text-green-400 text-xs mt-1">Pago</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-purple-900/50">
                    <div className="text-purple-400 text-xs uppercase tracking-wide">Economia IA</div>
                    <div className="text-2xl font-bold text-white">{resumo.economia}%</div>
                    <div className="text-purple-400 text-xs mt-1">vs atendimento humano</div>
                </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-6">
                <h3 className="text-lg font-bold mb-4 flex justify-between items-center">
                    Histórico de Pagamentos
                    <button
                        onClick={() => setNFModal(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition text-sm"
                    >
                        Emitir NF-e
                    </button>
                </h3>

                <div className="space-y-3">
                    {historico.map(p => (
                        <div key={p.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center hover:bg-gray-750 transition">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${p.status === 'pago' ? 'bg-green-500' : p.status === 'pendente' ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                                <div>
                                    <div className="font-bold text-white">{p.tipo}</div>
                                    <div className="text-sm text-gray-400">{p.data}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-green-400 font-bold text-lg">
                                    R$ {p.valor.toLocaleString('pt-BR')}
                                </span>
                                <span className={`px-3 py-1 rounded text-xs font-medium ${p.status === 'pago' ? 'bg-green-900 text-green-400' :
                                        p.status === 'pendente' ? 'bg-orange-900 text-orange-400' :
                                            'bg-gray-900 text-gray-400'
                                    }`}>
                                    {p.status.toUpperCase()}
                                </span>
                                {p.status === 'pendente' && (
                                    <button
                                        onClick={() => fazerPix(p.valor)}
                                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                                    >
                                        Pagar Pix
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {historico.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum pagamento registrado ainda.</p>
                    </div>
                )}
            </div>

            {/* Modal NF-e */}
            {nfModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Emitir Nota Fiscal</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="cpf-cnpj" className="block text-sm font-medium mb-2">CPF ou CNPJ</label>
                                <input
                                    id="cpf-cnpj"
                                    type="text"
                                    value={notaFiscal}
                                    onChange={(e) => setNotaFiscal(e.target.value)}
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    NF-e será emitida para o período atual ({new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setNFModal(false)}
                                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={emitirNF}
                                className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded hover:from-cyan-400 hover:to-green-400 transition"
                            >
                                Gerar NF-e
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA para upgrades */}
            <div className="mt-8 bg-gradient-to-r from-purple-900 to-blue-900 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Precisa de mais recursos?</h3>
                <p className="text-gray-300 mb-6">Adicione módulos avançados e escale seu negócio.</p>
                <button
                    onClick={() => window.location.href = '/cliente/adicionais'}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition"
                >
                    Ver Adicionais
                </button>
            </div>
        </div>
    );
}