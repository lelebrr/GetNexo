import React, { useState, useEffect } from 'react';

export default function HRFeedback({ ticketId }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newFeedback, setNewFeedback] = useState({
        type: 'positive',
        comments: '',
        rating: 5
    });

    useEffect(() => {
        fetchFeedbacks();
    }, [ticketId]);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/hr-feedback`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data);
            }
        } catch (err) {
            console.error('Erro ao carregar feedbacks RH:', err);
        }
    };

    const handleCreateFeedback = async () => {
        if (!newFeedback.comments.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/hr-feedback`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFeedback),
            });

            if (!response.ok) throw new Error('Erro ao criar feedback');

            setShowCreateForm(false);
            setNewFeedback({ type: 'positive', comments: '', rating: 5 });
            fetchFeedbacks();
        } catch (err) {
            console.error('Erro ao criar feedback:', err);
        }
    };

    const getFeedbackIcon = (type) => {
        return type === 'positive' ? '👍' : type === 'negative' ? '👎' : '🤔';
    };

    const getFeedbackColor = (type) => {
        return type === 'positive' ? 'bg-green-100 text-green-800' :
            type === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Feedback de RH</h4>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    {showCreateForm ? 'Cancelar' : '+ Novo Feedback'}
                </button>
            </div>

            {showCreateForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-3">Adicionar Feedback de RH</h5>
                    <div className="space-y-3">
                        <select
                            value={newFeedback.type}
                            onChange={(e) => setNewFeedback(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="positive">Positivo</option>
                            <option value="neutral">Neutro</option>
                            <option value="negative">Negativo</option>
                        </select>
                        <textarea
                            placeholder="Comentários sobre o atendimento..."
                            value={newFeedback.comments}
                            onChange={(e) => setNewFeedback(prev => ({ ...prev, comments: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Avaliação:</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={newFeedback.rating}
                                onChange={(e) => setNewFeedback(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                className="flex-1"
                            />
                            <span className="text-sm font-medium">{newFeedback.rating}/5</span>
                        </div>
                        <button
                            onClick={handleCreateFeedback}
                            disabled={!newFeedback.comments.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            Adicionar Feedback
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="text-2xl">{getFeedbackIcon(feedback.type)}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeedbackColor(feedback.type)}`}>
                                        {feedback.type === 'positive' ? 'Positivo' :
                                            feedback.type === 'negative' ? 'Negativo' : 'Neutro'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ⭐ {feedback.rating}/5
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <p className="text-gray-700">{feedback.comments}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Por: {feedback.createdBy?.name || 'RH'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}