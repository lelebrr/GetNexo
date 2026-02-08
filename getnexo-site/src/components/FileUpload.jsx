import React, { useState, useEffect, useRef } from 'react';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all'); // all, image, video, document
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid, list
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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
        const token = localStorage.getItem('omnichat_token');
        if (!token) return; // Silent fail if not logged in

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
        processFile(file);
    };

    const processFile = (file) => {
        if (file) {
            // Verificar tamanho (máx 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setMessage('Arquivo muito grande. Máximo 10MB.');
                return;
            }
            setSelectedFile(file);
            setMessage('');
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setMessage('');

        const token = localStorage.getItem('omnichat_token');
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
        <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <span className="text-neon-blue">☁️</span> Upload de Arquivos
            </h3>

            {/* Drag and Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current.click()}
                tabIndex={0}
                role="button"
                aria-label="Área de upload de arquivos. Clique ou arraste arquivos aqui."
                className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue ${isDragging
                        ? 'border-neon-blue bg-neon-blue/10 scale-[1.02]'
                        : 'border-gray-700 bg-black/20 hover:border-gray-500 hover:bg-black/40'
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*,.pdf"
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">{selectedFile ? '📄' : '📤'}</span>
                    {selectedFile ? (
                        <div className="text-left">
                            <p className="font-bold text-white text-lg">{selectedFile.name}</p>
                            <p className="text-sm text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-bold text-white text-lg">Arraste e solte ou clique para selecionar</p>
                            <p className="text-sm text-gray-500 mt-1">Imagens, Vídeos ou PDF (Máx 10MB)</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedFile && (
                <div className="mb-6 flex justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                        disabled={uploading}
                        className={`btn-primary-glow px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${uploading ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
                    >
                        {uploading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                🚀 Iniciar Upload
                            </>
                        )}
                    </button>
                </div>
            )}

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-center font-bold ${message.includes('sucesso') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {message}
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 className="text-lg font-bold text-gray-200">Galeria de Mídia</h4>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar arquivos..."
                            aria-label="Buscar arquivos"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-neon-blue outline-none flex-1 md:flex-none"
                        />
                        <select
                            value={filter}
                            aria-label="Filtrar por tipo"
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-neon-blue outline-none"
                        >
                            <option value="all">Todos</option>
                            <option value="image">Imagens</option>
                            <option value="video">Vídeos</option>
                            <option value="document">Documentos</option>
                        </select>
                        <div className="flex bg-black/30 border border-gray-700 rounded-lg p-1">
                            <button
                                aria-label="Visualização em Grade"
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-white'}`}
                            >
                                ▦
                            </button>
                            <button
                                aria-label="Visualização em Lista"
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'list' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-white'}`}
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>

                {uploadedFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                        <span className="text-4xl mb-3 opacity-30">📭</span>
                        <p>Nenhum arquivo enviado ainda.</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                        <span className="text-4xl mb-3 opacity-30">🔍</span>
                        <p>Nenhum arquivo encontrado com os filtros aplicados.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "space-y-2"
                    }>
                        {filteredFiles.map((file, index) => (
                            viewMode === 'grid' ? (
                                <div key={index} className="group bg-black/40 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
                                    <div className="aspect-square bg-gray-900 relative">
                                        {file.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : file.url.match(/\.(mp4|avi|mov)$/i) ? (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                🎬
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                                                📄
                                            </div>
                                        )}
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label={`Visualizar ${file.name}`}
                                                className="p-2 bg-neon-blue text-black rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
                                            >
                                                <span aria-hidden="true">👁️</span>
                                            </a>
                                            <button
                                                onClick={() => handleDelete(file.name)}
                                                aria-label={`Deletar ${file.name}`}
                                                className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
                                            >
                                                <span aria-hidden="true">🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-bold text-gray-300 truncate mb-1" title={file.name}>{file.name}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} className="flex items-center gap-4 p-3 bg-black/20 border border-gray-800 rounded-xl hover:bg-black/40 transition-colors">
                                    <div className="w-10 h-10 rounded bg-gray-900 flex items-center justify-center flex-shrink-0 text-lg border border-gray-700">
                                        {file.url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? '🖼️' : '📄'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-300 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-neon-blue hover:underline px-2 py-1"
                                        >
                                            Ver
                                        </a>
                                        <button
                                            onClick={() => handleDelete(file.name)}
                                            className="text-xs text-red-500 hover:text-red-400 px-2 py-1"
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
