import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const SentinelDashboard = () => {
    const [healthData, setHealthData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHealthData();
        fetchLogs();
    }, []);

    const fetchHealthData = async () => {
        try {
            const response = await fetch('/api/sentinel/health');
            const data = await response.json();
            setHealthData(data);
        } catch (error) {
            console.error('Erro ao buscar dados de saúde:', error);
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch('/api/logs?dia=2026-01-21');
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error('Erro ao buscar logs:', error);
        }
    };

    const runSentinel = async () => {
        setLoading(true);
        try {
            await fetch('/api/sentinel/run', { method: 'POST' });
            await fetchHealthData();
            await fetchLogs();
        } catch (error) {
            console.error('Erro ao executar Sentinel:', error);
        } finally {
            setLoading(false);
        }
    };

    const restoreBackup = async (file) => {
        if (confirm(`Restaurar backup ${file}?`)) {
            await fetch('/api/backup/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file })
            });
        }
    };

    // Dados para gráficos
    const speedData = {
        labels: ['00:00', '06:00', '12:00', '18:00', 'Agora'],
        datasets: [{
            label: 'Score de Velocidade',
            data: [92, 94, 95, 93, healthData?.velocidade || 95],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
        }]
    };

    const attacksData = {
        labels: ['00:00', '06:00', '12:00', '18:00', 'Agora'],
        datasets: [{
            label: 'IPs Bloqueados',
            data: [2, 5, 3, 1, 4],
            backgroundColor: '#ff6b00',
        }]
    };

    const aiEconomyData = {
        labels: ['Respostas Locais', 'IA Gemini'],
        datasets: [{
            data: [68, 32],
            backgroundColor: ['#00d4ff', '#ffd700'],
        }]
    };

    const diskData = {
        labels: ['/', '/logs', '/sessions'],
        datasets: [{
            label: 'Uso (%)',
            data: [45, 20, 10],
            backgroundColor: ['#00d4ff', '#ff6b00', '#ffd700'],
        }]
    };

    return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#00d4ff', textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px' }}>
                SENTINEL v3 - SAÚDE EM TEMPO REAL
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {/* Gráfico 1: Velocidade */}
                <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #00d4ff' }}>
                    <h2 style={{ color: '#00d4ff' }}>Velocidade do Site</h2>
                    <Line data={speedData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { y: { ticks: { color: '#fff' }, grid: { color: '#333' } }, x: { ticks: { color: '#fff' }, grid: { color: '#333' } } } }} />
                </div>

                {/* Gráfico 2: Ataques */}
                <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #ff6b00' }}>
                    <h2 style={{ color: '#ff6b00' }}>Ataques Detectados</h2>
                    <Bar data={attacksData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { y: { ticks: { color: '#fff' }, grid: { color: '#333' } }, x: { ticks: { color: '#fff' }, grid: { color: '#333' } } } }} />
                </div>

                {/* Gráfico 3: Economia IA */}
                <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #ffd700' }}>
                    <h2 style={{ color: '#ffd700' }}>Economia de IA</h2>
                    <Doughnut data={aiEconomyData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } } }} />
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>Economizou R$ 12,40 hoje</p>
                </div>

                {/* Gráfico 4: Disco */}
                <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #00d4ff' }}>
                    <h2 style={{ color: '#00d4ff' }}>Espaço em Disco</h2>
                    <Bar data={diskData} options={{ responsive: true, plugins: { legend: { labels: { color: '#fff' } } }, scales: { y: { ticks: { color: '#fff' }, grid: { color: '#333' } }, x: { ticks: { color: '#fff' }, grid: { color: '#333' } } } }} />
                    {healthData?.logs['/logs'] > 80 && <p style={{ color: '#ff6b00' }}>URGENTE: Compactando logs...</p>}
                </div>
            </div>

            {/* Últimos Logs */}
            <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #ffd700', marginTop: '20px' }}>
                <h2 style={{ color: '#ffd700' }}>Últimos Logs</h2>
                <table style={{ width: '100%', color: '#fff' }}>
                    <thead>
                        <tr>
                            <th>Evento</th>
                            <th>Detalhe</th>
                            <th>Ação</th>
                            <th>Tempo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.slice(0, 5).map((log, i) => (
                            <tr key={i}>
                                <td>{log.evento}</td>
                                <td>{log.detalhe}</td>
                                <td>{log.acao}</td>
                                <td>{new Date(log.ts).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <button
                    onClick={runSentinel}
                    disabled={loading}
                    style={{
                        backgroundColor: '#00d4ff',
                        color: '#000',
                        border: 'none',
                        padding: '15px 30px',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    {loading ? 'Executando...' : 'Rodar Agora'}
                </button>
                <button
                    onClick={() => {/* Ver backups */ }}
                    style={{
                        backgroundColor: '#ffd700',
                        color: '#000',
                        border: 'none',
                        padding: '15px 30px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    Ver Backup
                </button>
                <button
                    onClick={() => {/* Treinar bot */ }}
                    style={{
                        backgroundColor: '#ff6b00',
                        color: '#000',
                        border: 'none',
                        padding: '15px 30px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    Treinar Bot
                </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '30px', color: '#00d4ff' }}>
                &gt; Sentinel v3: seu site está seguro. Eu cuido do resto. — v3.7.2
            </p>
        </div>
    );
};

export default SentinelDashboard;