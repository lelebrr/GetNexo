import React, { useState, useEffect } from 'react';

const DataAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisType, setAnalysisType] = useState('summary');
    const [predictionInput, setPredictionInput] = useState({ age: 30, income: 4000 });

    useEffect(() => {
        fetchAnalytics();
    }, [analysisType]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        const params = new URLSearchParams({ type: analysisType });
        if (analysisType === 'prediction') {
            params.append('age', predictionInput.age.toString());
            params.append('income', predictionInput.income.toString());
        }

        try {
            const response = await fetch(`/api/analytics?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setAnalytics(data);
            } else {
                setError(data.error || 'Erro ao carregar análise.');
            }
        } catch (err) {
            setError('Erro de conexão.');
            console.error('Erro ao buscar analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePredictionSubmit = (e) => {
        e.preventDefault();
        fetchAnalytics();
    };

    if (loading) {
        return (
            <div className="analytics-container p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Análise de Dados com IA</h3>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-container p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Análise de Dados com IA</h3>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="analytics-container p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Análise de Dados com IA</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Análise:</label>
                <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                >
                    <option value="summary">Resumo Geral</option>
                    <option value="clustering">Clustering de Usuários</option>
                    <option value="trends">Tendências por Categoria</option>
                    <option value="prediction">Predição de Compras</option>
                </select>
            </div>

            {analytics && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">{analytics.type}</h4>

                    {analytics.type === 'summary' && analytics.summary && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded">
                                <h5 className="font-medium">Total de Usuários</h5>
                                <p className="text-2xl font-bold text-blue-600">{analytics.summary.totalUsers}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded">
                                <h5 className="font-medium">Idade Média</h5>
                                <p className="text-2xl font-bold text-green-600">{analytics.summary.averageAge} anos</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded">
                                <h5 className="font-medium">Renda Média</h5>
                                <p className="text-2xl font-bold text-yellow-600">R$ {analytics.summary.averageIncome}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded">
                                <h5 className="font-medium">Total de Compras</h5>
                                <p className="text-2xl font-bold text-purple-600">{analytics.summary.totalPurchases}</p>
                            </div>
                        </div>
                    )}

                    {analytics.type === 'clustering' && analytics.clusters && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 mb-4">Usuários agrupados por comportamento similar:</p>
                            {analytics.clusters.slice(0, 10).map((user, index) => (
                                <div key={index} className="border rounded p-3 flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">Usuário {user.id}</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            Idade: {user.age}, Renda: R${user.income}, Compras: {user.purchases}
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${user.cluster === 0 ? 'bg-blue-100 text-blue-800' :
                                            user.cluster === 1 ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        Cluster {user.cluster}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {analytics.type === 'trends' && analytics.trends && (
                        <div className="space-y-3">
                            {analytics.trends.map((trend, index) => (
                                <div key={index} className="border rounded p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-medium capitalize">{trend.category}</h5>
                                        <span className={`px-2 py-1 rounded text-xs ${trend.trend > 0 ? 'bg-green-100 text-green-800' :
                                                trend.trend < 0 ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {trend.trend > 0 ? '↑' : trend.trend < 0 ? '↓' : '→'} {Math.abs(trend.trend)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>Média de Compras: <strong>{trend.averagePurchases}</strong></div>
                                        <div>Usuários: <strong>{trend.count}</strong></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {analytics.type === 'prediction' && (
                        <div className="space-y-4">
                            <form onSubmit={handlePredictionSubmit} className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Idade:</label>
                                    <input
                                        type="number"
                                        value={predictionInput.age}
                                        onChange={(e) => setPredictionInput({ ...predictionInput, age: parseInt(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full"
                                        min="18"
                                        max="80"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Renda (R$):</label>
                                    <input
                                        type="number"
                                        value={predictionInput.income}
                                        onChange={(e) => setPredictionInput({ ...predictionInput, income: parseInt(e.target.value) })}
                                        className="border rounded px-3 py-2 w-full"
                                        min="1000"
                                        step="500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    >
                                        Calcular Predição
                                    </button>
                                </div>
                            </form>

                            {analytics.prediction && (
                                <div className="bg-blue-50 p-4 rounded">
                                    <h5 className="font-medium mb-2">Predição de Compras</h5>
                                    <p className="text-lg font-bold text-blue-600">
                                        {analytics.prediction} compras estimadas
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">{analytics.insights}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 p-3 bg-gray-50 rounded">
                        <h6 className="font-medium mb-1">Insights da IA:</h6>
                        <p className="text-sm text-gray-700">{analytics.insights}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataAnalytics;