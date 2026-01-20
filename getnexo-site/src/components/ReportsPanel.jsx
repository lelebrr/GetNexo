import React, { useState, useEffect } from 'react';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const ReportsPanel = () => {
    const [stats, setStats] = useState(null);
    const [clicks, setClicks] = useState([]);
    const [csat, setCsat] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/dashboard-stats`).then(r => r.json()).then(setStats).catch(() => setStats({ sales: 0, open_tickets: 0, csat: null }));
        fetch(`${API_URL}/clicks`).then(r => r.json()).then(setClicks).catch(() => setClicks([]));
        fetch(`${API_URL}/csat-report`).then(r => r.json()).then(setCsat).catch(() => setCsat([]));
    }, []);

    if (!stats) return <div className="text-white p-10">Carregando Analytics...</div>;

    // Simple calculation for charts
    const maxSales = 10000; // Mock max for bar
    const salesPercent = (stats.sales / maxSales) * 100;

    return (
        <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-white mb-8">Relatórios & Insights</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-xs font-bold uppercase">Receita Total</h3>
                    <div className="text-3xl font-bold text-neon-green mt-2">R$ {stats.sales?.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">+12% vs mês anterior</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-xs font-bold uppercase">CSAT Médio</h3>
                    <div className="text-3xl font-bold text-yellow-500 mt-2">{stats.csat?.toFixed(1)} <span className="text-sm">/ 5.0</span></div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-xs font-bold uppercase">Tickets Resolvidos</h3>
                    <div className="text-3xl font-bold text-neon-blue mt-2">{stats.tickets - stats.open_tickets}</div>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-gray-400 text-xs font-bold uppercase">Cliques em Links</h3>
                    <div className="text-3xl font-bold text-white mt-2">{clicks.length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Sales Performance (CSS Bar Chart) */}
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-white font-bold mb-6">Performance de Vendas</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Meta Mensal</span>
                                <span>{salesPercent.toFixed(0)}%</span>
                            </div>
                            <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                                <div className="h-full bg-gradient-to-r from-neon-blue to-neon-green" style={{ width: `${Math.min(salesPercent, 100)}%` }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center bg-black/40 p-3 rounded">
                                <div className="text-xs text-gray-500">Hoje</div>
                                <div className="text-white font-bold">R$ 0,00</div>
                            </div>
                            <div className="text-center bg-black/40 p-3 rounded">
                                <div className="text-xs text-gray-500">Ontem</div>
                                <div className="text-white font-bold">R$ 0,00</div>
                            </div>
                            <div className="text-center bg-black/40 p-3 rounded">
                                <div className="text-xs text-gray-500">Esta Semana</div>
                                <div className="text-white font-bold">R$ {stats.sales?.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Campaign Clicks table */}
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="text-white font-bold mb-4">Últimos Cliques (Ads/Links)</h3>
                    <div className="overflow-y-auto max-h-60 custom-scrollbar">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="pb-2">ID Campanha</th>
                                    <th className="pb-2 text-right">Horário</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {clicks.map((cl, i) => (
                                    <tr key={i} className="hover:bg-gray-800/50">
                                        <td className="py-2 text-neon-blue font-mono">{cl.cta_id}</td>
                                        <td className="py-2 text-right text-gray-500">{new Date(cl.timestamp).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                                {clicks.length === 0 && <tr><td colSpan="2" className="text-center py-4 text-gray-600">Nenhum dado recente.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportsPanel;
