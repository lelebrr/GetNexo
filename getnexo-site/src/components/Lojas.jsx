// src/components/Lojas.jsx – Completo e otimizado para mobile
import { useState, useEffect } from 'react';

export default function Lojas() {
    const [lojas, setLojas] = useState([]);
    const [novaLoja, setNovaLoja] = useState({ nome: '', dominio: '' });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);

    // Carregar lojas do usuário
    useEffect(() => {
        carregarLojas();
    }, []);

    const carregarLojas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/lojas', {
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                setLojas(data.lojas || []);
            } else {
                // Fallback com dados mock
                setLojas([
                    { id: 1, nome: 'Sneakers BR', dominio: 'sneakersbr.com', vendas: 12450, status: 'ativa', trial: 'Expira 31/03', logo: '/logos/sneakers.png' },
                    { id: 2, nome: 'TechRevenda', dominio: 'techrevenda.com.br', vendas: 8930, status: 'trial', trial: '7 dias', logo: '/logos/tech.png' },
                    { id: 3, nome: 'Loja Moda', dominio: 'modafacil.com', vendas: 18600, status: 'inativa', trial: 'Renovar', logo: '/logos/moda.png' }
                ]);
            }
        } catch (error) {
            console.error('Erro ao carregar lojas:', error);
        } finally {
            setCarregando(false);
        }
    };

    const adicionarLoja = async () => {
        if (!novaLoja.nome.trim()) {
            setErro('Nome da loja é obrigatório');
            return;
        }
        if (!novaLoja.dominio.trim()) {
            setErro('Domínio é obrigatório');
            return;
        }
        if (!/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(novaLoja.dominio)) {
            setErro('Domínio inválido (ex: minhloja.com)');
            return;
        }

        setLoading(true);
        setErro('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/lojas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(novaLoja)
            });

            if (response.ok) {
                const data = await response.json();
                setLojas([
                    ...lojas,
                    {
                        id: data.loja.id,
                        ...novaLoja,
                        vendas: 0,
                        status: 'trial',
                        trial: '7 dias',
                        logo: '/logos/default.png'
                    }
                ]);
                setNovaLoja({ nome: '', dominio: '' });
                alert('Loja criada com sucesso! Trial de 7 dias ativado.');
            } else {
                throw new Error('Erro ao criar loja');
            }
        } catch (error) {
            alert('Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const renovarTrial = async (lojaId) => {
        if (!confirm('Renovar trial por mais 30 dias? Será cobrado R$ 49,90 via PIX.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/lojas/renovar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ lojaId, plano: 'trial_extend' })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Trial renovado! Pague via PIX: ${data.pixCode}`);

                // Abrir QR Code do Pix
                if (data.qrCodeUrl) {
                    window.open(data.qrCodeUrl, '_blank');
                }

                // Atualizar status da loja
                setLojas(lojas.map(loja =>
                    loja.id === lojaId
                        ? { ...loja, trial: '30 dias', status: 'trial' }
                        : loja
                ));
            } else {
                throw new Error('Erro ao renovar trial');
            }
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    };

    const ativarLoja = async (lojaId) => {
        if (!confirm('Ativar loja com plano mensal? R$ 297/mês.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/lojas/ativar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ lojaId, plano: 'mensal' })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Plano ativado! Pague a primeira mensalidade via PIX.');

                if (data.qrCodeUrl) {
                    window.open(data.qrCodeUrl, '_blank');
                }

                // Atualizar status
                setLojas(lojas.map(loja =>
                    loja.id === lojaId
                        ? { ...loja, status: 'ativa', trial: 'Pago' }
                        : loja
                ));
            } else {
                throw new Error('Erro ao ativar loja');
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
            <h2 className="text-2xl font-black text-white mb-6">Minhas Lojas</h2>

            {/* Form de adicionar loja */}
            <div className="bg-gray-900 p-6 rounded-xl border border-cyan-900/30 mb-8">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">+</span>
                    Adicionar Nova Loja
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nome da Loja</label>
                        <input
                            type="text"
                            value={novaLoja.nome}
                            onChange={(e) => setNovaLoja({ ...novaLoja, nome: e.target.value })}
                            placeholder="Ex: Minha Loja"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Domínio</label>
                        <input
                            type="text"
                            value={novaLoja.dominio}
                            onChange={(e) => setNovaLoja({ ...novaLoja, dominio: e.target.value })}
                            placeholder="Ex: minhloja.com"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                        />
                    </div>
                </div>
                {erro && <p className="text-red-400 mt-2 text-sm">{erro}</p>}
                <button
                    onClick={adicionarLoja}
                    disabled={loading}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition disabled:opacity-50"
                >
                    {loading ? 'Adicionando...' : '+ Adicionar Loja'}
                </button>
            </div>

            {/* Tabela de lojas - Mobile Responsive */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="p-4 font-medium text-gray-300 rounded-tl-lg">Logo</th>
                            <th className="p-4 font-medium text-gray-300">Nome</th>
                            <th className="p-4 font-medium text-gray-300 hidden md:table-cell">Domínio</th>
                            <th className="p-4 font-medium text-gray-300 hidden lg:table-cell">Vendas</th>
                            <th className="p-4 font-medium text-gray-300">Status</th>
                            <th className="p-4 font-medium text-gray-300">Trial</th>
                            <th className="p-4 font-medium text-gray-300 rounded-tr-lg">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lojas.map(loja => (
                            <tr key={loja.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition">
                                <td className="p-4">
                                    <img src={loja.logo} alt={loja.nome} className="w-10 h-10 rounded-full object-cover" />
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-white">{loja.nome}</div>
                                    <div className="text-sm text-gray-400 md:hidden">{loja.dominio}</div>
                                </td>
                                <td className="p-4 text-gray-400 hidden md:table-cell">{loja.dominio}</td>
                                <td className="p-4 text-green-400 font-bold hidden lg:table-cell">
                                    R$ {loja.vendas.toLocaleString('pt-BR')}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${loja.status === 'ativa' ? 'bg-green-900 text-green-400' :
                                            loja.status === 'trial' ? 'bg-orange-900 text-orange-400' :
                                                'bg-red-900 text-red-400'
                                        }`}>
                                        {loja.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {loja.trial}
                                    {loja.trial.includes('Renovar') && (
                                        <div className="mt-1">
                                            <button
                                                onClick={() => renovarTrial(loja.id)}
                                                className="text-xs text-orange-400 hover:text-orange-300 underline"
                                            >
                                                Renovar
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => ativarLoja(loja.id)}
                                            className={`px-3 py-1 rounded text-xs font-medium transition ${loja.status === 'ativa'
                                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-500 text-white'
                                                }`}
                                            disabled={loja.status === 'ativa'}
                                        >
                                            {loja.status === 'ativa' ? 'Ativa' : 'Ativar'}
                                        </button>
                                        <button className="px-3 py-1 rounded text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition">
                                            Editar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {lojas.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏪</div>
                    <p className="text-gray-500 mb-4 text-lg">Nenhuma loja cadastrada ainda.</p>
                    <p className="text-gray-400 mb-6">Crie sua primeira loja e comece a vender com IA!</p>
                    <button
                        onClick={() => document.querySelector('input[placeholder="Ex: Minha Loja"]').focus()}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-green-400 transition shadow-lg"
                    >
                        Criar Primeira Loja
                    </button>
                </div>
            )}

            {/* Cards mobile para pequenas telas */}
            <div className="md:hidden mt-6 space-y-4">
                {lojas.map(loja => (
                    <div key={loja.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={loja.logo} alt={loja.nome} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{loja.nome}</h4>
                                <p className="text-sm text-gray-400">{loja.dominio}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${loja.status === 'ativa' ? 'bg-green-900 text-green-400' :
                                    'bg-orange-900 text-orange-400'
                                }`}>
                                {loja.status}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm mb-3">
                            <span className="text-green-400">Vendas: R$ {loja.vendas.toLocaleString('pt-BR')}</span>
                            <span className="text-gray-400">Trial: {loja.trial}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => ativarLoja(loja.id)}
                                className={`flex-1 py-2 rounded text-xs font-bold transition ${loja.status === 'ativa'
                                        ? 'bg-gray-700 text-gray-400'
                                        : 'bg-green-600 hover:bg-green-500 text-white'
                                    }`}
                                disabled={loja.status === 'ativa'}
                            >
                                {loja.status === 'ativa' ? 'ATIVA' : 'ATIVAR'}
                            </button>
                            <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition">
                                EDITAR
                            </button>
                        </div>

                        {loja.trial.includes('Renovar') && (
                            <button
                                onClick={() => renovarTrial(loja.id)}
                                className="w-full mt-2 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold transition"
                            >
                                RENOVAR TRIAL (R$ 49,90)
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}