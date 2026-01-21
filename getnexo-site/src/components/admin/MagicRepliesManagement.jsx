import React, { useState, useEffect } from 'react';

const MagicRepliesManagement = () => {
    const [magicReplies, setMagicReplies] = useState([]);
    const [activeTab, setActiveTab] = useState('list');
    const [selectedReply, setSelectedReply] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [newReply, setNewReply] = useState({
        name: '',
        description: '',
        isActive: true,
        context: {
            keywords: [],
            sentimentThreshold: { min: -0.5, max: 1 },
            customerValue: 'medium',
            erpData: {
                orderValue: { min: 0, max: Infinity },
                lastPurchaseDays: { max: 365 }
            }
        },
        suggestions: [{
            text: '',
            type: 'custom',
            priority: 5,
            mlScore: 0.5,
            erpActions: []
        }],
        erpConfigs: {
            bling: { enabled: false, credentials: {}, mappings: {} },
            vtex: { enabled: false, credentials: {}, mappings: {} },
            tiny: { enabled: false, credentials: {}, mappings: {} }
        }
    });

    useEffect(() => {
        loadMagicReplies();
    }, []);

    const loadMagicReplies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/magic-replies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMagicReplies(data);
            }
        } catch (error) {
            console.error('Erro ao carregar Magic Replies:', error);
            setMessage('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    const saveReply = async () => {
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const method = selectedReply ? 'PUT' : 'POST';
            const url = selectedReply
                ? `/api/admin/magic-replies/${selectedReply._id}`
                : '/api/admin/magic-replies';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedReply || newReply)
            });

            if (response.ok) {
                setMessage('Magic Reply salvo com sucesso!');
                await loadMagicReplies();
                setActiveTab('list');
                setSelectedReply(null);
                resetForm();
            } else {
                setMessage('Erro ao salvar Magic Reply.');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setMessage('Erro de conexão.');
        } finally {
            setSaving(false);
        }
    };

    const deleteReply = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este Magic Reply?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/magic-replies/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMessage('Magic Reply excluído com sucesso!');
                await loadMagicReplies();
            } else {
                setMessage('Erro ao excluir Magic Reply.');
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
            setMessage('Erro de conexão.');
        }
    };

    const resetForm = () => {
        setNewReply({
            name: '',
            description: '',
            isActive: true,
            context: {
                keywords: [],
                sentimentThreshold: { min: -0.5, max: 1 },
                customerValue: 'medium',
                erpData: {
                    orderValue: { min: 0, max: Infinity },
                    lastPurchaseDays: { max: 365 }
                }
            },
            suggestions: [{
                text: '',
                type: 'custom',
                priority: 5,
                mlScore: 0.5,
                erpActions: []
            }],
            erpConfigs: {
                bling: { enabled: false, credentials: {}, mappings: {} },
                vtex: { enabled: false, credentials: {}, mappings: {} },
                tiny: { enabled: false, credentials: {}, mappings: {} }
            }
        });
    };

    const addKeyword = (keyword) => {
        if (keyword && !newReply.context.keywords.includes(keyword)) {
            setNewReply(prev => ({
                ...prev,
                context: {
                    ...prev.context,
                    keywords: [...prev.context.keywords, keyword]
                }
            }));
        }
    };

    const removeKeyword = (keyword) => {
        setNewReply(prev => ({
            ...prev,
            context: {
                ...prev.context,
                keywords: prev.context.keywords.filter(k => k !== keyword)
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Magic Replies</h2>
                <button
                    onClick={() => {
                        setActiveTab('create');
                        setSelectedReply(null);
                        resetForm();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    + Novo Magic Reply
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {activeTab === 'list' && (
                <div className="space-y-4">
                    {magicReplies.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg mb-2">Nenhum Magic Reply configurado</p>
                            <p className="text-sm">Crie seu primeiro Magic Reply para começar</p>
                        </div>
                    ) : (
                        magicReplies.map(reply => (
                            <div key={reply._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="text-lg font-medium text-gray-900">{reply.name}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${reply.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {reply.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{reply.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Keywords: {reply.context.keywords.join(', ') || 'Nenhuma'}</span>
                                            <span>Sugestões: {reply.suggestions.length}</span>
                                            <span>Conversão: {(reply.effectivenessMetrics?.conversionRate * 100 || 0).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedReply(reply);
                                                setNewReply(reply);
                                                setActiveTab('edit');
                                            }}
                                            className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => deleteReply(reply._id)}
                                            className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {(activeTab === 'create' || activeTab === 'edit') && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {activeTab === 'create' ? 'Criar Magic Reply' : 'Editar Magic Reply'}
                        </h3>
                        <button
                            onClick={() => setActiveTab('list')}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            ← Voltar
                        </button>
                    </div>

                    {/* Nome e Descrição */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                            <input
                                type="text"
                                value={newReply.name}
                                onChange={(e) => setNewReply(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Ex: Cliente reclamando de preço"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={newReply.isActive}
                                onChange={(e) => setNewReply(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="rounded"
                            />
                            <label className="text-sm font-medium text-gray-700">Ativo</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                        <textarea
                            value={newReply.description}
                            onChange={(e) => setNewReply(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Descrição do contexto de ativação..."
                        />
                    </div>

                    {/* Contexto */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Contexto de Ativação</h4>

                        {/* Keywords */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Palavras-chave</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {newReply.context.keywords.map((keyword, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center">
                                        {keyword}
                                        <button
                                            onClick={() => removeKeyword(keyword)}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Adicionar palavra-chave..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addKeyword(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="flex-1 px-3 py-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Sentiment e Customer Value */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Limite de Sentimento</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="-1"
                                        max="1"
                                        value={newReply.context.sentimentThreshold.min}
                                        onChange={(e) => setNewReply(prev => ({
                                            ...prev,
                                            context: {
                                                ...prev.context,
                                                sentimentThreshold: {
                                                    ...prev.context.sentimentThreshold,
                                                    min: parseFloat(e.target.value)
                                                }
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border rounded"
                                        placeholder="Mínimo"
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="-1"
                                        max="1"
                                        value={newReply.context.sentimentThreshold.max}
                                        onChange={(e) => setNewReply(prev => ({
                                            ...prev,
                                            context: {
                                                ...prev.context,
                                                sentimentThreshold: {
                                                    ...prev.context.sentimentThreshold,
                                                    max: parseFloat(e.target.value)
                                                }
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border rounded"
                                        placeholder="Máximo"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Cliente</label>
                                <select
                                    value={newReply.context.customerValue}
                                    onChange={(e) => setNewReply(prev => ({
                                        ...prev,
                                        context: {
                                            ...prev.context,
                                            customerValue: e.target.value
                                        }
                                    }))}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="low">Baixo</option>
                                    <option value="medium">Médio</option>
                                    <option value="high">Alto</option>
                                    <option value="vip">VIP</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sugestões */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Sugestões de Resposta</h4>
                        {newReply.suggestions.map((suggestion, index) => (
                            <div key={index} className="mb-4 p-3 bg-white rounded border">
                                <div className="mb-2">
                                    <textarea
                                        value={suggestion.text}
                                        onChange={(e) => {
                                            const updated = [...newReply.suggestions];
                                            updated[index].text = e.target.value;
                                            setNewReply(prev => ({ ...prev, suggestions: updated }));
                                        }}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded"
                                        placeholder="Texto da sugestão..."
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <select
                                        value={suggestion.type}
                                        onChange={(e) => {
                                            const updated = [...newReply.suggestions];
                                            updated[index].type = e.target.value;
                                            setNewReply(prev => ({ ...prev, suggestions: updated }));
                                        }}
                                        className="px-3 py-1 border rounded text-sm"
                                    >
                                        <option value="parcelamento">Parcelamento</option>
                                        <option value="cupom">Cupom</option>
                                        <option value="frete_gratis">Frete Grátis</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={suggestion.priority}
                                        onChange={(e) => {
                                            const updated = [...newReply.suggestions];
                                            updated[index].priority = parseInt(e.target.value);
                                            setNewReply(prev => ({ ...prev, suggestions: updated }));
                                        }}
                                        className="px-3 py-1 border rounded text-sm w-20"
                                        placeholder="Prioridade"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setActiveTab('list')}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={saveReply}
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Salvando...' : 'Salvar Magic Reply'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicRepliesManagement;