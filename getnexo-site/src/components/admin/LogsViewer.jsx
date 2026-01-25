import React, { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';

const LogsViewer = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Simulating log fetch
        const mockLogs = [
            { id: 1, ts: new Date().toISOString(), level: 'INFO', msg: 'Kernel Nexus v1.4.0 nuclear initialized.' },
            { id: 2, ts: new Date(Date.now() - 50000).toISOString(), level: 'WARN', msg: 'Potential memory leak in Sentinel Node #4.' },
            { id: 3, ts: new Date(Date.now() - 120000).toISOString(), level: 'SECURE', msg: 'Authorization bypass attempt blocked from 182.xx.xx.xx.' },
            { id: 4, ts: new Date(Date.now() - 300000).toISOString(), level: 'ERROR', msg: 'Failed to sync with WhatsApp API endpoint.' },
            { id: 5, ts: new Date(Date.now() - 600000).toISOString(), level: 'INFO', msg: 'Ara generative engine standby.' },
            { id: 6, ts: new Date(Date.now() - 900000).toISOString(), level: 'INFO', msg: 'System backup completed successfully.' },
        ];
        setLogs(mockLogs);
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesType = filter === 'ALL' || log.level === filter;
        const matchesSearch = log.msg.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getLevelColor = (level) => {
        switch (level) {
            case 'INFO': return 'text-cyan-400 bg-cyan-900/20';
            case 'WARN': return 'text-yellow-400 bg-yellow-900/20';
            case 'ERROR': return 'text-red-400 bg-red-900/20';
            case 'SECURE': return 'text-purple-400 bg-purple-900/20';
            default: return 'text-gray-400';
        }
    };

    const handleClearLogs = () => {
        if (confirm('Tem certeza que deseja limpar todos os logs?')) {
            setLogs([]);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">📋 System Logs Archive</h1>
                    <p className="text-gray-400">Monitoramento detalhado de eventos do sistema.</p>
                </div>
                <Button onClick={handleClearLogs} variant="secondary" className="border-red-500 text-red-500 hover:bg-red-900/20">
                    🗑️ Limpar Logs
                </Button>
            </header>

            <Card className="p-0 border border-gray-800 bg-[#050505] overflow-hidden flex flex-col h-[600px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center bg-gray-900/50">
                    <div className="flex gap-2">
                        {['ALL', 'INFO', 'WARN', 'ERROR', 'SECURE'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${filter === type
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar nos logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-1 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                        />
                    </div>
                </div>

                {/* Log Stream */}
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 custom-scrollbar">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map(log => (
                            <div key={log.id} className="flex gap-3 hover:bg-gray-900/50 p-1 rounded transition-colors group">
                                <span className="text-gray-500 w-20 shrink-0">[{new Date(log.ts).toLocaleTimeString()}]</span>
                                <span className={`px-1 rounded w-16 text-center text-[10px] font-bold shrink-0 ${getLevelColor(log.level)}`}>
                                    {log.level}
                                </span>
                                <span className="text-gray-300 group-hover:text-white transition-colors break-all">
                                    {log.msg}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-600 mt-20">Nenhum log encontrado para os filtros selecionados.</div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="p-2 border-t border-gray-800 bg-gray-900 text-[10px] text-gray-500 flex justify-between px-4">
                    <span>Total Events: {logs.length}</span>
                    <span>Showing: {filteredLogs.length}</span>
                    <span className="text-green-500">● LIVE MONITORING</span>
                </div>
            </Card>
        </div>
    );
};

export default LogsViewer;
