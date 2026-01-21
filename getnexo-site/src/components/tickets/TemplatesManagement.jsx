import React, { useState, useEffect } from 'react';

export default function TemplatesManagement({ onSelectTemplate }) {
    const [templates, setTemplates] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        title: '',
        description: '',
        priority: 'medium',
        category: ''
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

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

    const handleCreateTemplate = async () => {
        if (!newTemplate.name || !newTemplate.title) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/ticket-templates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTemplate),
            });

            if (!response.ok) throw new Error('Erro ao criar template');

            setShowCreateForm(false);
            setNewTemplate({ name: '', title: '', description: '', priority: 'medium', category: '' });
            fetchTemplates();
        } catch (err) {
            console.error('Erro ao criar template:', err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Templates de Tickets</h4>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    {showCreateForm ? 'Cancelar' : '+ Novo Template'}
                </button>
            </div>

            {showCreateForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-3">Criar Novo Template</h5>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nome do template"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Título padrão"
                            value={newTemplate.title}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <textarea
                            placeholder="Descrição padrão"
                            value={newTemplate.description}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <div className="flex gap-3">
                            <select
                                value={newTemplate.priority}
                                onChange={(e) => setNewTemplate(prev => ({ ...prev, priority: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                            <button
                                onClick={handleCreateTemplate}
                                disabled={!newTemplate.name || !newTemplate.title}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => onSelectTemplate?.(template)}>
                        <h5 className="font-medium text-gray-900">{template.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{template.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${template.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                    template.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                        template.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                }`}>
                                {template.priority}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}