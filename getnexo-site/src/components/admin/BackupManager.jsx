import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';

const BackupManager = () => {
    const [backups, setBackups] = useState([
        { id: 1, name: 'Snapshot Semanal', size: '256MB', date: '2026-01-20 03:00:00', status: 'ready' },
        { id: 2, name: 'Pre-Update v1.3', size: '248MB', date: '2026-01-18 15:30:12', status: 'ready' },
        { id: 3, name: 'Backup Inicial', size: '120MB', date: '2026-01-01 00:00:00', status: 'ready' }
    ]);

    const [creating, setCreating] = useState(false);

    const handleCreateBackup = () => {
        setCreating(true);
        setTimeout(() => {
            const newBackup = {
                id: Date.now(),
                name: `Manual Snapshot ${new Date().toLocaleTimeString()}`,
                size: '258MB',
                date: new Date().toLocaleString(),
                status: 'ready'
            };
            setBackups([newBackup, ...backups]);
            setCreating(false);
            alert('Backup criado com sucesso!');
        }, 2000);
    };

    const handleRestore = (backup) => {
        if (confirm(`ATENÇÃO: Restaurar o backup '${backup.name}' irá substituir todos os dados atuais. Deseja continuar?`)) {
            alert('Iniciando restauração... O sistema irá reiniciar em breve.');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">💾 Backup Registry</h1>
                    <p className="text-gray-400">Gerencie snapshots de segurança e pontos de restauração.</p>
                </div>
                <Button
                    onClick={handleCreateBackup}
                    disabled={creating}
                    className="bg-[#ffc400] hover:bg-yellow-400 text-black font-bold flex items-center gap-2"
                >
                    {creating ? (
                        <>
                            <span className="animate-spin">⏳</span> Criando...
                        </>
                    ) : (
                        <>
                            <span>➕</span> Novo Backup
                        </>
                    )}
                </Button>
            </header>

            {/* Storage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 text-center">
                    <span className="text-4xl block mb-2">📦</span>
                    <h3 className="text-gray-400 text-xs uppercase font-bold">Total Backups</h3>
                    <span className="text-2xl font-bold text-white">{backups.length}</span>
                </Card>
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 text-center">
                    <span className="text-4xl block mb-2">💾</span>
                    <h3 className="text-gray-400 text-xs uppercase font-bold">Espaço Usado</h3>
                    <span className="text-2xl font-bold text-white">~624 MB</span>
                </Card>
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6 text-center">
                    <span className="text-4xl block mb-2">🔄</span>
                    <h3 className="text-gray-400 text-xs uppercase font-bold">Próximo Automático</h3>
                    <span className="text-2xl font-bold text-white text-sm mt-1">Hoje 03:00</span>
                </Card>
            </div>

            {/* Backup List */}
            <div className="space-y-4">
                {backups.map(backup => (
                    <Card key={backup.id} style={{ background: '#111827', borderColor: '#1f2937' }} className="p-4 hover:border-cyan-500 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-cyan-900/20 text-cyan-400 flex items-center justify-center text-xl">
                                📦
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{backup.name}</h3>
                                <p className="text-xs text-gray-500 font-mono">
                                    {backup.date} • <span className="text-gray-400">{backup.size}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-green-500 uppercase px-2 py-1 bg-green-900/20 rounded">
                                {backup.status}
                            </span>
                            <div className="flex gap-2 transition-opacity">
                                <Button size="sm" variant="secondary">Download</Button>
                                <Button size="sm" onClick={() => handleRestore(backup)} className="bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white">
                                    Restaurar
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BackupManager;
