import React, { useState } from 'react';

export default function Attachments({ ticketId, attachments = [], onUpdate }) {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (files) => {
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/attachments`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Erro ao fazer upload');

            onUpdate?.();
        } catch (err) {
            console.error('Erro no upload:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (attachmentId, filename) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/attachments/${attachmentId}/download`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error('Erro no download:', err);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Anexos</h4>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                    type="file"
                    multiple
                    className="hidden"
                    id="attachment-upload"
                    onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label htmlFor="attachment-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📎</div>
                    <p className="text-gray-600">
                        {uploading ? 'Enviando...' : 'Clique para selecionar arquivos ou arraste aqui'}
                    </p>
                </label>
            </div>

            {attachments.length > 0 && (
                <div className="space-y-2">
                    {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">📄</div>
                                <div>
                                    <p className="font-medium text-gray-900">{attachment.filename}</p>
                                    <p className="text-sm text-gray-500">
                                        {attachment.size} • {new Date(attachment.uploadedAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(attachment.id, attachment.filename)}
                                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}