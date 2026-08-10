// src/components/Adicionais.jsx - Completo com backend real
import { useState, useEffect } from 'react';

export default function Adicionais() {
    const [itens, setItens] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [trialMode, setTrialMode] = useState(true);
    const [nexoChave, setNexoChave] = useState({ ar: true, '360': true });

    // Carregar adicionais disponíveis e histórico
    useEffect(() => {
        carregarAdicionais();
        carregarHistorico();
    }, []);

    const carregarAdicionais = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/adicionais/disponiveis', {
                headers: { 'Authorization': token }
            });

            if (response.ok) {
                const data = await response.json();
                setItens(data.adicionais || []);
            } else {
                // Fallback com dados mock
                setItens([]);
            }
        } catch (error) {
            console.error('Erro ao carregar adicionais:', error);
            setItens([]);
        }
    };

    const carregarHistorico = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/adicionais/historico', {
            headers: { 'Authorization': token }
        });

        if (response.ok) {
            const data = await response.json();
            setHistorico(data.historico || []);
        } else {
            // Fallback com dados mock
            setHistorico([]);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    } finally {
        setCarregando(false);
    }
};

const comprar = async (adicionalId) => {
    if (!confirm(`Confirmar compra de ${itens.find(i => i.id === adicionalId)?.nome}?`)) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/adicionais/comprar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ adicionalId })
        });

        const data = await response.json();

        if (response.ok) {
            // Abrir link de pagamento ou redirecionar
            if (data.paymentUrl) {
                window.open(data.paymentUrl, '_blank');
            } else {
                alert('Pagamento processado! Recarregando...');
                await carregarAdicionais();
                await carregarHistorico();
            }
        } else {
            throw new Error(data.error || 'Erro no pagamento');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
};

const ativar = async (adicionalId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/adicionais/${adicionalId}/ativar`, {
            method: 'POST',
            headers: { 'Authorization': token }
        });

        if (response.ok) {
            alert('Adicional ativado com sucesso!');
            await carregarAdicionais();
        } else {
            throw new Error('Erro ao ativar adicional');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
    }
};

const mostrarUpgrade = (mensagem) => {
    alert(`🔒 ${mensagem}. Entre em contato para adquirir: comercial@getnexo.com.br`);
};

const verAR = async (produtoId) => {
    if (!trialMode && !nexoChave.ar) {
        mostrarUpgrade('Ative AR por R$ 97');
        return;
    }

    // Simular abertura do AR viewer
    alert(`🎨 Abrindo visualização AR do produto ${produtoId}`);
    // Em produção, isso abriria o AR viewer
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
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <h2 className="text-2xl font-black">Adicionais & Upgrades</h2>
        </div>

        {/* Grid de itens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {itens.map(item => (
                <div key={item.id} className={`p-6 rounded-xl border-2 ${item.ativo ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-900'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <div className="flex items-center gap-2 mb-3">
                        {item.ativo && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <h3 className="font-bold text-lg">{item.nome}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{item.descricao}</p>
                    <p className="text-3xl font-black text-white mb-1">{item.preco}</p>
                    <p className="text-xs text-gray-500 mb-4">{item.beneficio}</p>
                    {item.ativo ? (
                        <button className="w-full py-2 bg-gray-800 text-white border border-gray-700 rounded text-sm hover:bg-gray-700 transition">
                            Ativo ✓
                        </button>
                    ) : item.comprado ? (
                        <button onClick={() => ativar(item.id)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition">
                            Ativar
                        </button>
                    ) : (
                        <button onClick={() => comprar(item.id)} className="w-full py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-bold rounded hover:from-cyan-400 hover:to-green-400 transition">
                            Comprar
                        </button>
                    )}
                </div>
            ))}
        </div>

        {/* Histórico */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold">Compras Anteriores</h3>
            </div>
            <table className="w-full">
                <thead className="text-left text-gray-400 text-sm">
                    <tr><th>Item</th><th>Data</th><th>Valor</th><th>Status</th><th>Ação</th></tr>
                </thead>
                <tbody>
                    {historico.map(h => (
                        <tr key={h.id} className="border-t border-gray-800 text-sm">
                            <td className="py-3">{h.item}</td>
                            <td>{h.data}</td>
                            <td className="font-bold">{h.valor}</td>
                            <td>
                                <span className={`px-2 py-1 rounded text-xs ${h.status === 'ativo' ? 'bg-green-900 text-green-400' :
                                    h.status === 'pendente' ? 'bg-orange-900 text-orange-400' :
                                        h.status === 'cancelado' ? 'bg-red-900 text-red-400' :
                                            'bg-gray-900 text-gray-400'
                                    }`}>
                                    {h.status}
                                </span>
                            </td>
                            <td>
                                {h.status === 'pendente' && (
                                    <button
                                        onClick={() => window.open(h.paymentUrl, '_blank')}
                                        className="text-xs text-cyan-400 hover:underline"
                                    >
                                        Pagar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {historico.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma compra realizada ainda.</p>
                </div>
            )}
        </div>

        {/* CTA para vendas */}
        <div className="mt-8 bg-gradient-to-r from-purple-900 to-blue-900 p-8 rounded-xl text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Precisa de algo personalizado?</h3>
            </div>
            <p className="text-gray-300 mb-6">Entre em contato para soluções sob medida para seu negócio.</p>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de falar sobre soluções personalizadas', '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    WhatsApp
                </button>
                <button
                    onClick={() => window.open('mailto:comercial@getnexo.com.br?subject=Soluções Personalizadas', '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                </button>
            </div>
        </div>
    </div>
);
}