import React, { useState, useEffect } from 'react';
import { Card } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Select, Badge, Table, Modal, Tabs, Alert, Progress, Tag } from '../design-system/components/AdminExtras';

const DataAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisType, setAnalysisType] = useState('summary');
    const [predictionInput, setPredictionInput] = useState({ age: 30, income: 4000 });
    const [isDemo, setIsDemo] = useState(false);

    // Dados de exemplo (Demo Data) para fallbacks
    const demoData = {
        summary: {
            type: 'summary',
            summary: { totalUsers: 1420, averageAge: 29, averageIncome: 5400, totalPurchases: 890 },
            insights: 'Estatísticas baseadas na atividade consolidada dos últimos 30 dias.'
        },
        clustering: {
            type: 'clustering',
            clusters: [
                { id: 1, age: 24, income: 3200, purchases: 12, cluster: 0 },
                { id: 2, age: 35, income: 8500, purchases: 45, cluster: 1 },
                { id: 3, age: 29, income: 4100, purchases: 18, cluster: 0 },
                { id: 4, age: 42, income: 12000, purchases: 62, cluster: 2 }
            ],
            insights: 'Segmentação identificou 3 grupos principais: Exploradores, Enthusiasts e VIPs.'
        },
        trends: {
            type: 'trends',
            trends: [
                { category: 'tech', averagePurchases: 24.5, trend: 1.2, count: 450 },
                { category: 'fashion', averagePurchases: 18.2, trend: 0.8, count: 320 },
                { category: 'home', averagePurchases: 32.1, trend: -0.4, count: 180 }
            ],
            insights: 'Crescimento acentuado no setor Tech impulsionado por novas integrações.'
        },
        prediction: {
            type: 'prediction',
            prediction: 156, // LTV estimado
            insights: 'Cliente com alto potencial de longo prazo (High Value Profile).'
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [analysisType]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        setIsDemo(false);

        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({ type: analysisType });

            if (analysisType === 'prediction') {
                params.append('age', predictionInput.age.toString());
                params.append('income', predictionInput.income.toString());
            }

            // Using fetch directly as in original, but could use apiRequest lib
            const response = await fetch(`/api/analytics?${params}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            } else {
                throw new Error('API unavailable');
            }
        } catch (err) {
            console.warn('[Performance] API unreachable or unauthorized. Falling back to Demo Data.');
            setAnalytics(demoData[analysisType] || demoData.summary);
            setIsDemo(true);
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
            <div className="flex flex-col items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest">Calculando Métricas...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">System Performance & Analytics</h1>

            {isDemo && (
                <Alert variant="warning">
                    <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        <strong>MODO DEMONSTRAÇÃO ATIVO</strong>
                    </div>
                    <p className="text-sm mt-1">O servidor de análise está offline ou você não está autenticado. Mostrando dados de simulação.</p>
                </Alert>
            )}

            <div className="mb-8 mt-6">
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4">
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Inteligência de Análise</label>
                    <div className="max-w-xs">
                        <Select
                            value={analysisType}
                            onChange={setAnalysisType}
                            options={[
                                { value: 'summary', label: 'Resumo de Operações' },
                                { value: 'clustering', label: 'Clustering Neural' },
                                { value: 'trends', label: 'Tendências de Mercado' },
                                { value: 'prediction', label: 'Predição de LTV' }
                            ]}
                        />
                    </div>
                </Card>
            </div>

            {analytics && (
                <div className="animate-fade-in space-y-6">
                    {/* Summary View */}
                    {analytics.type === 'summary' && analytics.summary && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 text-center">
                                <span className="block text-xs font-bold text-gray-500 uppercase">Total Users</span>
                                <span className="text-3xl font-black text-white font-mono">{analytics.summary.totalUsers}</span>
                            </Card>
                            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 text-center">
                                <span className="block text-xs font-bold text-gray-500 uppercase">Avg Age</span>
                                <span className="text-3xl font-black text-white font-mono">{analytics.summary.averageAge}y</span>
                            </Card>
                            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 text-center">
                                <span className="block text-xs font-bold text-gray-500 uppercase">Avg Income</span>
                                <span className="text-3xl font-black text-white font-mono">R$ {analytics.summary.averageIncome}</span>
                            </Card>
                            <Card style={{ background: '#111827', borderColor: 'rgba(0, 247, 255, 0.4)' }} className="p-6 text-center shadow-[0_0_15px_rgba(0,247,255,0.1)]">
                                <span className="block text-xs font-bold text-cyan-500 uppercase">Total Revenue</span>
                                <span className="text-3xl font-black text-cyan-400 font-mono">{analytics.summary.totalPurchases} pts</span>
                            </Card>
                        </div>
                    )}

                    {/* Clustering View */}
                    {analytics.type === 'clustering' && analytics.clusters && (
                        <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="overflow-hidden">
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="text-gray-400 uppercase text-xs">ID</th>
                                        <th className="text-gray-400 uppercase text-xs">Idade</th>
                                        <th className="text-gray-400 uppercase text-xs">Renda</th>
                                        <th className="text-gray-400 uppercase text-xs">Compras</th>
                                        <th className="text-gray-400 uppercase text-xs">Neural Cluster</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.clusters.map((user, index) => (
                                        <tr key={index} className="border-b border-gray-800">
                                            <td className="py-3 font-mono text-sm text-gray-300">#{user.id}</td>
                                            <td className="py-3 text-white">{user.age}</td>
                                            <td className="py-3 text-white">R$ {user.income}</td>
                                            <td className="py-3 text-white">{user.purchases}</td>
                                            <td className="py-3">
                                                <Badge variant={user.cluster === 0 ? 'info' : user.cluster === 1 ? 'success' : 'warning'}>
                                                    Node {user.cluster}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    )}

                    {/* Trends View */}
                    {analytics.type === 'trends' && analytics.trends && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {analytics.trends.map((trend, index) => (
                                <Card key={index} style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-xs font-bold uppercase text-yellow-500">{trend.category}</span>
                                        <span className={`text-xs font-bold font-mono ${trend.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {trend.trend > 0 ? '↗' : '↘'} {Math.abs(trend.trend)}%
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Ticket Médio</span>
                                            <span className="font-bold text-white">{trend.averagePurchases}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Base Ativa</span>
                                            <span className="font-bold text-white">{trend.count}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Prediction View */}
                    {analytics.type === 'prediction' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Parâmetros de Simulação</h3>
                                <form onSubmit={handlePredictionSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Idade Alvo</label>
                                        <Input
                                            type="number"
                                            value={predictionInput.age}
                                            onChange={(e) => setPredictionInput({ ...predictionInput, age: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Renda Mensal (R$)</label>
                                        <Input
                                            type="number"
                                            value={predictionInput.income}
                                            onChange={(e) => setPredictionInput({ ...predictionInput, income: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <Button type="submit" variant="primary" fullWidth>Calcular Predição</Button>
                                </form>
                            </Card>

                            {analytics.prediction && (
                                <Card style={{ background: '#111827', borderColor: 'rgba(0, 247, 255, 0.4)' }} className="p-6 flex flex-col justify-center items-center text-center shadow-[0_0_20px_rgba(0,247,255,0.1)]">
                                    <span className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-2">LTV Estimado</span>
                                    <span className="text-5xl font-black text-cyan-400 font-mono mb-4">{analytics.prediction} Compras</span>
                                    <p className="text-xs text-gray-400 px-4">{analytics.insights}</p>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* AI Insights Footer */}
                    <div className="mt-8 border-l-2 border-cyan-500 pl-6 py-2 bg-cyan-900/10 rounded-r-lg">
                        <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Ara AI Intelligence</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{analytics.insights}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataAnalytics;