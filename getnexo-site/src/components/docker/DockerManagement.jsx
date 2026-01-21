import React, { useState, useEffect } from 'react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Card } from '../design-system/components/Card';

const DockerManagement = () => {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });

    useEffect(() => {
        fetchContainers();
    }, []);

    const fetchContainers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/docker/containers`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setContainers(data.containers);
            }
        } catch (err) {
            console.error('Erro ao carregar containers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (containerName, action) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/docker/${action}`, {
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gerenciamento Docker</h1>
                    <p className="text-gray-600">Controle de containers e auto-escala</p>
                </div>
            </div>

            {/* Visão Geral */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <div>
                            <p className="text-2xl font-bold">{runningCount}</p>
                            <p className="text-sm text-gray-600">Rodando</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">❌</span>
                        <div>
                            <p className="text-2xl font-bold">{stoppedCount}</p>
                            <p className="text-sm text-gray-600">Parados</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔄</span>
                        <div>
                            <p className="text-2xl font-bold">{scalingCount}</p>
                            <p className="text-sm text-gray-600">Escalando</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <p className="text-2xl font-bold">{errorCount}</p>
                            <p className="text-sm text-gray-600">Erros</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 items-center">
                <Input
                    placeholder="Buscar domínio..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="max-w-md"
                />

                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="all">Todos os Status</option>
                    <option value="running">Rodando</option>
                    <option value="stopped">Parados</option>
                    <option value="scaling">Escalando</option>
                    <option value="error">Erros</option>
                </select>

                <Button onClick={() => handleAction('all', 'scale-update')}>
                    Atualizar Limites
                </Button>
            </div>

            {/* Tabela de Containers */}
            {loading ? (
                <div className="text-center py-8">Carregando containers...</div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome (Domínio)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    RAM Usada / Limit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CPU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Uptime
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Logs
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredContainers.map(container => (
                                <tr key={container.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{container.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {getStatusIcon(container.status)} {container.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {container.memoryUsage} / {container.memoryLimit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {container.cpuUsage}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {container.uptime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setSelectedContainer(container)}
                                        >
                                            Ver Logs
                                        </Button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleAction(container.name, 'restart')}
                                        >
                                            Reiniciar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleAction(container.name, 'stop')}
                                        >
                                            Parar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleAction(container.name, 'scale-up')}
                                        >
                                            Escala +
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleAction(container.name, 'delete')}
                                        >
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Logs */}
            {selectedContainer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-3/4 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Logs: {selectedContainer.name}</h3>
                            <Button onClick={() => setSelectedContainer(null)}>✕</Button>
                        </div>
                        <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                            {selectedContainer.logs || 'Carregando logs...'}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DockerManagement;