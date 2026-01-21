import React, { useState, useEffect } from 'react';
import { useTickets } from '../../hooks/useTickets';

export default function TicketForm({ ticket, onClose, onSuccess }) {
    const { createTicket, updateTicket } = useTickets();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
        category: '',
        tags: [],
        attachments: [],
    });
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        if (ticket) {
            setFormData({
                title: ticket.title || '',
                description: ticket.description || '',
                priority: ticket.priority || 'medium',
                status: ticket.status || 'open',
                category: ticket.category || '',
                tags: ticket.tags || [],
                attachments: ticket.attachments || [],
            });
        }
        fetchTemplates();
    }, [ticket]);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/ticket-templates`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setTemplates(data);
            }
        } catch (err) {
            console.error('Erro ao carregar templates:', err);
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setFormData({
                ...formData,
                title: template.title,
                description: template.description,
                priority: template.priority,
                category: template.category,
                tags: template.tags || [],
            });
            setSelectedTemplate(templateId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let result;
            if (ticket) {
                result = await updateTicket(ticket.id, formData);
            } else {
                result = await createTicket(formData);
            }

            onSuccess?.(result);
            onClose();
        } catch (err) {
            console.error('Erro ao salvar ticket:', err);
            // Mostrar erro para o usuário
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTag = (tagName) => {
        if (tagName && !formData.tags.find(t => t.name === tagName)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, { name: tagName, id: Date.now() }] // ID temporário
            }));
        }
    };

    const removeTag = (tagId) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t.id !== tagId)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {ticket ? 'Editar Ticket' : 'Criar Novo Ticket'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                            aria-label="Fechar"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Templates */}
                    {!ticket && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Usar Template (opcional)
                            </label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => handleTemplateSelect(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecionar template...</option>
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Título */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Digite o título do ticket"
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição *
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Descreva o problema ou solicitação em detalhes"
                        />
                    </div>

                    {/* Campos em grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Prioridade */}
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Prioridade
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="open">Aberto</option>
                                <option value="pending">Pendente</option>
                                <option value="resolved">Resolvido</option>
                                <option value="closed">Fechado</option>
                            </select>
                        </div>

                        {/* Categoria */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Categoria
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecionar categoria...</option>
                                <option value="technical">Técnico</option>
                                <option value="billing">Faturamento</option>
                                <option value="feature">Nova funcionalidade</option>
                                <option value="bug">Bug</option>
                                <option value="support">Suporte geral</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="space-y-2">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Adicionar tag..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTag(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            const input = e.target.previousElementSibling;
                                            addTag(input.value);
                                            input.value = '';
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        +
                                    </button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag.id)}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                    aria-label={`Remover tag ${tag.name}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Anexos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Anexos
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📎</div>
                                <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        setFormData(prev => ({
                                            ...prev,
                                            attachments: [...prev.attachments, ...files]
                                        }));
                                    }}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-block px-4 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700"
                                >
                                    Selecionar Arquivos
                                </label>
                            </div>
                        </div>
                        {formData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium text-gray-700">Arquivos selecionados:</h4>
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    attachments: prev.attachments.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label={`Remover ${file.name}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim() || !formData.description.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            )}
                            {ticket ? 'Atualizar Ticket' : 'Criar Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}