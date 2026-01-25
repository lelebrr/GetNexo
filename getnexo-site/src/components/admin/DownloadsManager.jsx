import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';

const DownloadsManager = () => {
    const [downloads, setDownloads] = useState([
        { id: 1, title: 'Whitepaper: O Futuro da IA no Atendimento', filename: 'nexus_whitepaper_2026.pdf', downloads: 1242, date: '2026-01-15' },
        { id: 2, title: 'Ebook: Guia de Automação para E-commerce', filename: 'ebook_automacao_v2.pdf', downloads: 856, date: '2026-01-20' },
        { id: 3, title: 'Checklist: Preparando sua Loja para Black Friday', filename: 'bf_checklist_final.pdf', downloads: 432, date: '2025-11-10' }
    ]);

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja remover este arquivo?')) {
            setDownloads(downloads.filter(d => d.id !== id));
        }
    };

    const handleUpload = () => {
        alert('Simulação: Arquivo enviado com sucesso!');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">📥 Gerenciador de Downloads</h1>
                    <p className="text-gray-400">Gerencie eBooks, PDFs e materiais ricos disponíveis para seus leads.</p>
                </div>
                <Button onClick={handleUpload} className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2">
                    <span>⬆️</span> Novo Upload
                </Button>
            </header>

            {/* Upload Zone */}
            <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-10 border-2 border-dashed border-gray-700 bg-gray-900/30 hover:border-cyan-500 transition-colors cursor-pointer text-center group">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform">📂</span>
                    <div>
                        <h3 className="text-lg font-bold text-gray-300 group-hover:text-cyan-400">Arraste arquivos aqui ou clique para selecionar</h3>
                        <p className="text-sm text-gray-500">Suporta PDF, ZIP, EPUB (Máx 50MB)</p>
                    </div>
                </div>
            </Card>

            {/* Files List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloads.map((file) => (
                    <Card key={file.id} style={{ background: '#111827', borderColor: '#1f2937' }} className="p-0 overflow-hidden border border-gray-800 bg-gray-900 group hover:border-[#ffc400] transition-colors">
                        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <span className="text-2xl">📄</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-bold text-white">{file.downloads}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Downloads</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-white mb-1 truncate" title={file.title}>{file.title}</h3>
                            <p className="text-xs text-gray-400 font-mono mb-4 truncate">{file.filename}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <span className="text-xs text-gray-600">{file.date}</span>
                                <div className="flex gap-2">
                                    <button className="text-cyan-500 hover:text-cyan-400 text-xs font-bold uppercase tracking-wider">Editar</button>
                                    <button onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider">Remover</button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DownloadsManager;
