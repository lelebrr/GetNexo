import React, { useState, useEffect } from 'react';

export default function AgentFolders({ ticketId }) {
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        // Simulação - em produção, buscar da API
        setFolders([
            { id: 1, name: 'Suporte Técnico', count: 25 },
            { id: 2, name: 'Vendas', count: 12 },
            { id: 3, name: 'Financeiro', count: 8 },
            { id: 4, name: 'RH', count: 5 },
        ]);
    };

    const moveToFolder = async (folderId) => {
        // Implementar lógica para mover ticket para pasta
        console.log(`Movendo ticket ${ticketId} para pasta ${folderId}`);
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Pastas de Agentes</h4>
            <div className="grid grid-cols-2 gap-3">
                {folders.map((folder) => (
                    <button
                        key={folder.id}
                        onClick={() => moveToFolder(folder.id)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                        <div className="font-medium text-gray-900">{folder.name}</div>
                        <div className="text-sm text-gray-600">{folder.count} tickets</div>
                    </button>
                ))}
            </div>
        </div>
    );
}