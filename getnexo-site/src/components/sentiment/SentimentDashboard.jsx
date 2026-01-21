import React, { useState, useEffect } from 'react';
import useSentimentAnalysis from '../../hooks/useSentimentAnalysis';
import SentimentIndicator from '../SentimentIndicator';

/**
 * Componente SentimentDashboard
 * Dashboard completo de métricas de sentimento por agente/produto
 */
const SentimentDashboard = () => {
    const {
        getDashboardMetrics,
        getMetricsByAgent,
        getMetricsByProduct,
        getSentimentTrend,
        getTimeSeriesData,
        loading,
        error
    } = useSentimentAnalysis();

    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('30d');
    const [department, setDepartment] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [agentData, setAgentData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [trendData, setTrendData] = useState(null);
    const [timeSeriesData, setTimeSeriesData] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, [timeRange, department]);

    const loadDashboardData = async () => {
        try {
            const filters = {
                startDate: getStartDate(timeRange),
                endDate: new Date().toISOString(),
                department: department || undefined
            };

            const [dashboard, agents, products, trend, timeSeries] = await Promise.all([
                getDashboardMetrics(filters),
                getMetricsByAgent(filters),
                getMetricsByProduct(filters),
                getSentimentTrend(filters),
                getTimeSeriesData(filters)
            ]);

            setDashboardData(dashboard);
            setAgentData(agents);
            setProductData(products);
            setTrendData(trend);
            setTimeSeriesData(timeSeries);
        } catch (err) {
            console.error('Erro ao carregar dados do dashboard:', err);
        }
    };

    const getStartDate = (range) => {
        const now = new Date();
        switch (range) {
            case '7d': now.setDate(now.getDate() - 7); break;
            case '30d': now.setDate(now.getDate() - 30); break;
            case '90d': now.setDate(now.getDate() - 90); break;
            case '1y': now.setFullYear(now.getFullYear() - 1); break;
            default: now.setDate(now.getDate() - 30);
        }
        return now.toISOString();
    };

    const MetricCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const SentimentChart = ({ data, title }) => {
        if (!data) return null;

        const sentimentColors = {
            very_negative: '#ef4444',
            negative: '#f97316',
            neutral: '#eab308',
            positive: '#22c55e',
            very_positive: '#10b981'
        };

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="space-y-3">
                    {Object.entries(data).map(([sentiment, count]) => (
                        sentiment !== '_id' && count > 0 && (
                            <div key={sentiment} className="flex items-center justify-between">
                                <span className="text-sm capitalize">
                                    {sentiment.replace('_', ' ')}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${(count / Object.values(data).filter(v => typeof v === 'number').reduce((a, b) => a + b, 0)) * 100}%`,
                                                backgroundColor: sentimentColors[sentiment] || '#6b7280'
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        );
    };

    const AgentTable = ({ data }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Performance por Agente</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Médio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alertas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recompensas</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((agent, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-medium text-blue-600">
                                                {agent.agentName?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {agent.agentName || 'Não identificado'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {agent.agentEmail || ''}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {agent.total || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SentimentIndicator
                                        score={Math.round(agent.avgScore * 10) / 10}
                                        showBadge={true}
                                        size="small"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(agent.alertsTriggered || 0) > 0
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {agent.alertsTriggered || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(agent.rewardsGiven || 0) > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {agent.rewardsGiven || 0}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const TrendChart = ({ data }) => {
        if (!data || !data.length) return null;

        const maxValue = Math.max(...data.map(d => d.total));
        const chartHeight = 200;

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Tendência de Sentimentos</h3>
                <div className="space-y-2">
                    {['improved', 'stable', 'deteriorated'].map(status => {
                        const count = data.filter(d => d[status]).length;
                        const percentage = data.length > 0 ? (count / data.length) * 100 : 0;

                        return (
                            <div key={status} className="flex items-center justify-between">
                                <span className="text-sm capitalize">
                                    {status === 'improved' ? 'Melhorou' :
                                        status === 'deteriorated' ? 'Piorou' : 'Estável'}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: status === 'improved' ? '#22c55e' :
                                                    status === 'deteriorated' ? '#ef4444' : '#eab308'
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-12 text-right">
                                        {count} ({percentage.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Erro ao carregar dados
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                            {error}
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={loadDashboardData}
                                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Sentimentos</h1>
                        <p className="text-gray-600">Análise de sentimentos dos clientes por agente e produto</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                            <option value="1y">Último ano</option>
                        </select>

                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="">Todos os departamentos</option>
                            <option value="suporte">Suporte</option>
                            <option value="vendas">Vendas</option>
                            <option value="tecnico">Técnico</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: '📊' },
                            { id: 'agents', label: 'Por Agente', icon: '👥' },
                            { id: 'products', label: 'Por Produto', icon: '📦' },
                            { id: 'trends', label: 'Tendências', icon: '📈' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && dashboardData && (
                <div className="space-y-6">
                    {/* Métricas principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total de Análises"
                            value={dashboardData.total || 0}
                            icon="📝"
                            color="blue"
                        />
                        <MetricCard
                            title="Score Médio"
                            value={(dashboardData.avgScore || 0).toFixed(1)}
                            subtitle="/10"
                            icon={<SentimentIndicator score={dashboardData.avgScore || 5} size="small" />}
                            color="green"
                        />
                        <MetricCard
                            title="Alertas Disparados"
                            value={dashboardData.alertsTriggered || 0}
                            icon="🚨"
                            color="red"
                        />
                        <MetricCard
                            title="Recompensas Dadas"
                            value={dashboardData.rewardsGiven || 0}
                            icon="🎉"
                            color="yellow"
                        />
                    </div>

                    {/* Distribuição de sentimentos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SentimentChart
                            data={{
                                very_negative: dashboardData.veryNegative || 0,
                                negative: dashboardData.negative || 0,
                                neutral: dashboardData.neutral || 0,
                                positive: dashboardData.positive || 0,
                                very_positive: dashboardData.veryPositive || 0
                            }}
                            title="Distribuição de Sentimentos"
                        />

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Resumo de Alertas</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Escalações</span>
                                    <span className="font-semibold text-red-600">{dashboardData.escalations || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Avisos</span>
                                    <span className="font-semibold text-orange-600">{dashboardData.warnings || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Recompensas</span>
                                    <span className="font-semibold text-green-600">{dashboardData.rewardsGiven || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'agents' && (
                <AgentTable data={agentData} />
            )}

            {activeTab === 'products' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance por Produto</h3>
                    <div className="text-center py-8 text-gray-500">
                        Dados por produto serão exibidos aqui quando disponíveis.
                    </div>
                </div>
            )}

            {activeTab === 'trends' && trendData && (
                <div className="space-y-6">
                    <TrendChart data={trendData} />

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Estatísticas de Melhoria</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {trendData.improvedTickets || 0}
                                </div>
                                <div className="text-sm text-gray-600">Tickets Melhoraram</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {trendData.stableTickets || 0}
                                </div>
                                <div className="text-sm text-gray-600">Tickets Estáveis</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {trendData.deterioratedTickets || 0}
                                </div>
                                <div className="text-sm text-gray-600">Tickets Pioraram</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SentimentDashboard;
