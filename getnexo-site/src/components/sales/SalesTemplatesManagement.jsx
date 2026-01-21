import React, { useState, useEffect } from 'react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Card } from '../design-system/components/Card';
import SalesTemplateBuilder from './SalesTemplateBuilder';

const SalesTemplatesManagement = () => {
    const [templates, setTemplates] = useState([]);
    const [predefinedTemplates, setPredefinedTemplates] = useState([]);
    const [showBuilder, setShowBuilder] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
        fetchPredefinedTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setTemplates(data.templates);
            }
        } catch (err) {
            console.error('Erro ao carregar templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPredefinedTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/predefined`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setPredefinedTemplates(data.templates);
            }
        } catch (err) {
            console.error('Erro ao carregar templates pré-definidos:', err);
        }
    };

    const handleCreateFromPredefined = async (templateType) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/predefined/${templateType}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const newTemplate = await response.json();
                setTemplates(prev => [newTemplate, ...prev]);
                setShowCreateForm(false);
            }
        } catch (err) {
            console.error('Erro ao criar template:', err);
        }
    };

    const handleEditTemplate = (template) => {
        setSelectedTemplate(template);
        setShowBuilder(true);
    };

    const handleSaveTemplate = async (templateData) => {
        try {
            const token = localStorage.getItem('token');
            const method = selectedTemplate ? 'PUT' : 'POST';
            const url = selectedTemplate
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/${selectedTemplate._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateData),
            });

            if (response.ok) {
                fetchTemplates();
                setShowBuilder(false);
                setSelectedTemplate(null);
            }
        } catch (err) {
            console.error('Erro ao salvar template:', err);
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        if (!confirm('Tem certeza que deseja excluir este template?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/${templateId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                setTemplates(prev => prev.filter(t => t._id !== templateId));
            }
        } catch (err) {
            console.error('Erro ao excluir template:', err);
        }
    };

    const handleCloneTemplate = async (templateId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/${templateId}/clone`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const clonedTemplate = await response.json();
                setTemplates(prev => [clonedTemplate, ...prev]);
            }
        } catch (err) {
            console.error('Erro ao clonar template:', err);
        }
    };

    const handleExportTemplate = async (templateId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/${templateId}/export`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `template_${templateId}.json`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Erro ao exportar template:', err);
        }
    };

    const handleExecuteTemplate = async (templateId) => {
        const userId = prompt('Digite o ID do usuário para executar o template:');
        if (!userId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sales-templates/${templateId}/execute`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                alert('Template executado com sucesso!');
            }
        } catch (err) {
            console.error('Erro ao executar template:', err);
        }
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || template.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(templates.map(t => t.category))];

    if (showBuilder) {
        return (
            <SalesTemplateBuilder
                template={selectedTemplate}
                onSave={handleSaveTemplate}
                onCancel={() => {
                    setShowBuilder(false);
                    setSelectedTemplate(null);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Templates de Vendas</h1>
                    <p className="text-gray-600">Gerencie fluxos automatizados de vendas e marketing</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancelar' : '+ Novo Template'}
                    </Button>
                    <Button onClick={() => setShowBuilder(true)}>
                        Criar Personalizado
                    </Button>
                </div>
            </div>

            {/* Formulário de criação rápida */}
            {showCreateForm && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Criar Template Rápido</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {predefinedTemplates.map(template => (
                            <div
                                key={template.id}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                                onClick={() => handleCreateFromPredefined(template.id)}
                            >
                                <div className="text-2xl mb-2">{getCategoryIcon(template.category)}</div>
                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">1-clique para ativar</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Filtros e busca */}
            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <Input
                        placeholder="Buscar templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="">Todas as categorias</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {getCategoryName(category)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Lista de templates */}
            {loading ? (
                <div className="text-center py-8">Carregando templates...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map(template => (
                        <Card key={template._id} className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getCategoryIcon(template.category)}</span>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                                        <p className="text-sm text-gray-600">{getCategoryName(template.category)}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${template.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {template.isActive ? 'Ativo' : 'Inativo'}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">
                                {template.description || 'Sem descrição'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span>Usado {template.usageCount}x</span>
                                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleEditTemplate(template)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleCloneTemplate(template._id)}
                                >
                                    Clonar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleExportTemplate(template._id)}
                                >
                                    Exportar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleExecuteTemplate(template._id)}
                                >
                                    Executar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDeleteTemplate(template._id)}
                                >
                                    Excluir
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {filteredTemplates.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    Nenhum template encontrado. Crie seu primeiro template!
                </div>
            )}
        </div>
    );
};

// Funções auxiliares
const getCategoryIcon = (category) => {
    const icons = {
        'abandoned-cart': '🛒',
        'upsell': '📈',
        'cross-sell': '🔗',
        'win-back': '🔄',
        'welcome': '👋',
        'reactivation': '⚡',
        'custom': '🎨'
    };
    return icons[category] || '📋';
};

const getCategoryName = (category) => {
    const names = {
        'abandoned-cart': 'Carrinho Abandonado',
        'upsell': 'Upsell',
        'cross-sell': 'Cross-sell',
        'win-back': 'Win-back',
        'welcome': 'Boas-vindas',
        'reactivation': 'Reativação',
        'custom': 'Personalizado'
    };
    return names[category] || category;
};

export default SalesTemplatesManagement;