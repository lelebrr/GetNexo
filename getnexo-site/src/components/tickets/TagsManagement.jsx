import React, { useState, useEffect } from 'react';
import { useTickets } from '../../hooks/useTickets';

export default function TagsManagement({ ticketId, currentTags = [] }) {
    const { addTag, removeTag } = useTickets();
    const [availableTags, setAvailableTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tags`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const tags = await response.json();
                setAvailableTags(tags);
            }
        } catch (err) {
            console.error('Erro ao carregar tags:', err);
        }
    };

    const handleAddTag = async (tagId) => {
        if (currentTags.find(t => t.id === tagId)) return; // Já tem a tag

        setLoading(true);
        try {
            await addTag(ticketId, tagId);
        } catch (err) {
            console.error('Erro ao adicionar tag:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTag = async (tagId) => {
        setLoading(true);
        try {
            await removeTag(ticketId, tagId);
        } catch (err) {
            console.error('Erro ao remover tag:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tags`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newTagName.trim(), color: '#3b82f6' }),
            });

            if (!response.ok) throw new Error('Erro ao criar tag');

            const newTag = await response.json();
            setAvailableTags(prev => [...prev, newTag]);
            setNewTagName('');
            // Adicionar automaticamente ao ticket
            await handleAddTag(newTag.id);
        } catch (err) {
            console.error('Erro ao criar tag:', err);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Gerenciamento de Tags</h4>

            {/* Tags atuais */}
            {currentTags.length > 0 && (
                <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Tags do Ticket</h5>
                    <div className="flex flex-wrap gap-2">
                        {currentTags.map((tag) => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                                {tag.name}
                                <button
                                    onClick={() => handleRemoveTag(tag.id)}
                                    disabled={loading}
                                    className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                    aria-label={`Remover tag ${tag.name}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Criar nova tag */}
            <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Criar Nova Tag</h5>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Nome da nova tag"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                    />
                    <button
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim() || loading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        Criar
                    </button>
                </div>
            </div>

            {/* Tags disponíveis */}
            <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Tags Disponíveis</h5>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags
                        .filter(tag => !currentTags.find(t => t.id === tag.id))
                        .map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => handleAddTag(tag.id)}
                                disabled={loading}
                                className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                + {tag.name}
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}