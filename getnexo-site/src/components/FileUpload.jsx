import React, { useState, useEffect } from 'react';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all'); // all, image, video, document
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid, list

    // Carregar arquivos existentes
    useEffect(() => {
        fetchFiles();
    }, []);

    // Filtrar arquivos
    useEffect(() => {
        let filtered = uploadedFiles;

        // Filtro por tipo
        if (filter !== 'all') {
            if (filter === 'image') {
                filtered = filtered.filter(file => file.url.match(/\.(jpeg|jpg|png|gif|webp)$/i));
            } else if (filter === 'video') {
                filtered = filtered.filter(file => file.url.match(/\.(mp4|avi|mov)$/i));
            } else if (filter === 'document') {
                filtered = filtered.filter(file => file.url.match(/\.(pdf|doc|docx|txt)$/i));
            }
        }

        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(file =>
                file.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFiles(filtered);
    }, [uploadedFiles, filter, searchTerm]);

    const fetchFiles = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/upload', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.files) {
                setUploadedFiles(data.files);
            }
        } catch (error) {
            console.error('Erro ao carregar arquivos:', error);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Verificar tamanho (máx 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setMessage('Arquivo muito grande. Máximo 10MB.');
                return;
            }
            setSelectedFile(file);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Usuário não autenticado.');
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Arquivo enviado com sucesso!');
                setSelectedFile(null);
                fetchFiles(); // Recarregar lista
            } else {
                setMessage(data.error || 'Erro ao enviar arquivo.');
            }
        } catch (error) {
            setMessage('Erro de conexão.');
            console.error('Erro no upload:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileName) => {
        // Implementar delete se necessário
        setMessage('Função de deletar não implementada ainda.');
    };

    return (
        <div className="file-upload-container p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Upload de Arquivos</h3>

            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {selectedFile && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600">Arquivo selecionado: {selectedFile.name}</p>
                    <p className="text-sm text-gray-600">Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {uploading ? 'Enviando...' : 'Enviar Arquivo'}
            </button>

            {message && (
                <p className={`mt-4 text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}

            <div className="mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h4 className="text-lg font-semibold">Galeria de Mídia</h4>
                    <div className="flex flex-wrap gap-2">
                        <input
                            type="text"
                            placeholder="Buscar arquivos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-1 border rounded text-sm"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-1 border rounded text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value="image">Imagens</option>
                            <option value="video">Vídeos</option>
                            <option value="document">Documentos</option>
                        </select>
                        <div className="flex border rounded">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                            >
                                Lista
                            </button>
                        </div>
                    </div>
                </div>
                {uploadedFiles.length === 0 ? (
                    <p className="text-gray-500">Nenhum arquivo enviado ainda.</p>
                ) : filteredFiles.length === 0 ? (
                    <p className="text-gray-500">Nenhum arquivo encontrado com os filtros aplicados.</p>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-2"
                    }>
                        {filteredFiles.map((file, index) => (
                            viewMode === 'grid' ? (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="mb-2">
                                        {file.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                        ) : file.url.match(/\.(mp4|avi|mov)$/i) ? (
                                            <video
                                                src={file.url}
                                                className="w-full h-32 object-cover rounded"
                                                controls
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                                                <span className="text-gray-500">📄</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <div className="mt-2 flex space-x-2">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 text-sm"
                                        >
                                            Ver
                                        </a>
                                        <button
                                            onClick={() => handleDelete(file.name)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} className="border rounded-lg p-4 flex items-center space-x-4">
                                    <div className="w-16 h-16 flex-shrink-0">
                                        {file.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : file.url.match(/\.(mp4|avi|mov)$/i) ? (
                                            <video
                                                src={file.url}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                <span className="text-gray-500">📄</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 border rounded"
                                        >
                                            Ver
                                        </a>
                                        <button
                                            onClick={() => handleDelete(file.name)}
                                            className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border rounded"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;