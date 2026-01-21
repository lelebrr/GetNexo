import React from 'react';

const DataExport = () => {
    const handleExport = async (type, format) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Usuário não autenticado.');
            return;
        }

        try {
            const response = await fetch(`/api/export?type=${type}&format=${format}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${type}_report.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Erro ao exportar dados.');
            }
        } catch (error) {
            console.error('Erro na exportação:', error);
            alert('Erro de conexão.');
        }
    };

    return (
        <div className="data-export-container p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Exportação de Dados e Relatórios</h3>

            <div className="space-y-4">
                {[
                    { type: 'users', name: 'Usuários', description: 'Lista de usuários cadastrados' },
                    { type: 'analytics', name: 'Analytics', description: 'Dados de análise e métricas' },
                    { type: 'files', name: 'Arquivos', description: 'Lista de arquivos enviados' }
                ].map((item) => (
                    <div key={item.type} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport(item.type, 'json')}
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                            >
                                Exportar JSON
                            </button>
                            <button
                                onClick={() => handleExport(item.type, 'csv')}
                                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                            >
                                Exportar CSV
                            </button>
                            <button
                                onClick={() => handleExport(item.type, 'html')}
                                className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                            >
                                Relatório HTML
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Sobre Exportação</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>JSON:</strong> Formato estruturado para integração com outros sistemas</li>
                    <li>• <strong>CSV:</strong> Formato tabular compatível com Excel e planilhas</li>
                    <li>• <strong>HTML:</strong> Relatório formatado para visualização direta</li>
                </ul>
            </div>
        </div>
    );
};

export default DataExport;