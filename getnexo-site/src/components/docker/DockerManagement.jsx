import React, { useState, useEffect } from 'react';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Card } from '../../design-system/components/Card';

const DockerManagement = ({ initialView }) => {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(initialView || 'overview'); // Use prop if provided
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });

    const [apiError, setApiError] = useState(null);

    // Sync view with URL if needed
    useEffect(() => {
        if (initialView) {
            setView(initialView);
            return;
        }
        const path = window.location.pathname;
        if (path.includes('/clients')) setView('clients');
        else if (path.includes('/auto-scale')) setView('autoscale');
        else if (path.includes('/usage')) setView('usage');
        else if (path.includes('/billing')) setView('billing');
        else if (path.includes('/webhooks')) setView('webhooks');
        else setView('overview');
    }, [initialView]);

    useEffect(() => {
        fetchContainers();
    }, []);

    const fetchContainers = async () => {
        setLoading(true);
        setApiError(null);
        try {
            const token = localStorage.getItem('token');
            // Using relative path to work through Nginx proxy or current host
            const apiUrl = import.meta.env.VITE_API_URL || '';

            const response = await fetch(`${apiUrl}/api/docker/containers`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setContainers(data.containers || []);
            } else {
                setApiError(`Erro ${response.status}: Falha ao carregar containers.`);
            }
        } catch (err) {
            console.error('Erro ao carregar containers:', err);
            setApiError(`Erro de conexão: Não foi possível conectar ao backend Docker. Certifique-se de que o serviço está rodando.`);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (containerName, action) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/docker/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: containerName }),
            });

            if (response.ok) {
                fetchContainers();
                alert(`Ação ${action} executada com sucesso`);
            }
        } catch (err) {
            console.error(`Erro ao executar ${action}:`, err);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'running': return '✅';
            case 'stopped': return '❌';
            case 'scaling': return '🔄';
            case 'error': return '🚨';
            default: return '❓';
        }
    };

    const filteredContainers = containers.filter(container => {
        const matchesSearch = container.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesStatus = filters.status === 'all' || container.status === filters.status;
        return matchesSearch && matchesStatus;
    });

    const runningCount = containers.filter(c => c.status === 'running').length;
    const stoppedCount = containers.filter(c => c.status === 'stopped').length;
    const scalingCount = containers.filter(c => c.status === 'scaling').length;
    const errorCount = containers.filter(c => c.status === 'error').length;

    return (
        <div className="space-y-6 text-gray-100">
            {/* Error Message */}
            {apiError && (
                <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl flex items-center gap-4 text-rose-400">
                    <span className="text-2xl">🚨</span>
                    <div>
                        <p className="font-bold">Problema de Conexão</p>
                        <p className="text-sm opacity-90">{apiError}</p>
                    </div>
                    <Button onClick={fetchContainers} size="sm" variant="outline" className="ml-auto border-rose-500/50 text-rose-400 hover:bg-rose-500/20">Tentar Novamente</Button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {view === 'overview' && 'Métricas Globais'}
                        {view === 'clients' && 'Clientes & Pods'}
                        {view === 'autoscale' && 'Configuração de Auto-Escala'}
                        {view === 'usage' && 'Monitoramento Realtime'}
                        {view === 'billing' && 'Faturamentos Extras'}
                        {view === 'webhooks' && 'Webhooks de Alerta'}
                    </h1>
                    <p className="text-gray-400">Infraestrutura Docker GetNexo</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchContainers} variant="secondary">🔄 Recarregar</Button>
                    <Button onClick={() => window.location.href = '/admin'} variant="outline">🏠 Sair</Button>
                </div>
            </div>

            {/* OVERVIEW SECTION */}
            {view === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-gray-900 border-gray-800 p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase">Containers Ativos</p>
                            <p className="text-3xl font-bold text-emerald-400">{runningCount}</p>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800 p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase">Uso de RAM Total</p>
                            <p className="text-3xl font-bold text-blue-400">~1.2 GB</p>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800 p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase">Avisos de Escala</p>
                            <p className="text-3xl font-bold text-yellow-400">{scalingCount}</p>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800 p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase">Falhas (24h)</p>
                            <p className="text-3xl font-bold text-rose-400">{errorCount}</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-gray-900 border-gray-800 p-6 h-80 flex items-center justify-center">
                            <p className="text-gray-600">[ Gráfico de Carga CPU / RAM coming soon ]</p>
                        </Card>
                        <Card className="bg-gray-900 border-gray-800 p-6 h-80 flex items-center justify-center">
                            <p className="text-gray-600">[ Log Consolidado do Sistema ]</p>
                        </Card>
                    </div>
                </div>
            )}

            {/* CLIENTS TABLE SECTION */}
            {view === 'clients' && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
                        <Input
                            placeholder="Buscar loja ou ID..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="bg-black/50 border-gray-700 text-white"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="bg-gray-800 text-white border-gray-700 px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="running">Rodando</option>
                            <option value="stopped">Parados</option>
                        </select>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-gray-400 border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase text-xs">Instância</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs">Recursos (RAM/CPU)</th>
                                    <th className="px-6 py-4 font-bold uppercase text-xs">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-10 text-center animate-pulse text-gray-600">Sincronizando com Docker Daemon...</td></tr>
                                ) : filteredContainers.length === 0 ? (
                                    <tr><td colSpan="4" className="p-10 text-center text-gray-600">Nenhum container encontrado.</td></tr>
                                ) : (
                                    filteredContainers.map(container => (
                                        <tr key={container.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{container.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">ID: {container.id.substring(0, 12)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${container.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                    ● {container.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                        <div className="bg-blue-500 h-full" style={{ width: '45%' }}></div>
                                                    </div>
                                                    <span className="text-gray-400">{container.memoryUsage || '128MB'} / {container.memoryLimit || '512MB'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => handleAction(container.name, 'restart')}>Restart</Button>
                                                <Button size="sm" variant="outline" onClick={() => setSelectedContainer(container)}>Logs</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* BILLING SECTION */}
            {view === 'billing' && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Relatório de Cobrança Adicional</h3>
                    <p className="text-gray-400 mb-6">Valores calculados com base no uso excedente de 1GB de RAM / mês.</p>
                    <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
                        <p className="text-gray-600 italic">Os dados de faturamento serão processados no fim do ciclo atual (DIA 30).</p>
                    </div>
                </div>
            )}

            {/* AUTO-SCALE SECTION */}
            {view === 'autoscale' && (
                <Card className="bg-gray-900 border-gray-800 p-8 max-w-2xl">
                    <h3 className="text-xl font-bold mb-6">Políticas Globais de Escala</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-bold uppercase">Gatilho de Expansão (CPU %)</label>
                            <div className="flex items-center gap-4">
                                <input type="range" min="50" max="95" defaultValue="80" className="flex-1 accent-blue-500" />
                                <span className="font-mono text-xl text-blue-400">80%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-bold uppercase">Passo de Memória</label>
                            <select className="w-full bg-black border-gray-800 p-3 rounded-xl">
                                <option>128 MB</option>
                                <option selected>512 MB</option>
                                <option>1024 MB</option>
                            </select>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3">Salvar Configurações</Button>
                    </div>
                </Card>
            )}

            {/* Modal de Logs */}
            {selectedContainer && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-[90%] max-w-4xl h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Terminal: {selectedContainer.name}</h3>
                            <button onClick={() => setSelectedContainer(null)} className="text-2xl hover:text-white text-gray-500 focus-visible:ring-2 focus-visible:outline-none rounded" aria-label="Fechar">✕</button>
                        </div>
                        <div className="flex-1 bg-black border border-gray-800 p-4 rounded-xl font-mono text-xs text-blue-400 overflow-y-auto">
                            {/* Fetch logs component or logic should go here. For now we use a small internal component/effect to fetch */}
                            <LogViewer containerName={selectedContainer.name} />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => setSelectedContainer(null)} variant="primary">Fechar Terminal</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for Logs
const LogViewer = ({ containerName }) => {
    const [logs, setLogs] = useState('Conectando ao daemon...');

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || '';
            try {
                const res = await fetch(`${apiUrl}/api/docker/logs/${containerName}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data.logs);
                } else {
                    setLogs('Erro: Falha ao obter logs.');
                }
            } catch (e) {
                setLogs('Erro de conexão: ' + e.message);
            }
        };
        fetchLogs();
    }, [containerName]);

    return <pre className="whitespace-pre-wrap">{logs}</pre>;
};

export default DockerManagement;