import React, { useState, useEffect } from 'react';

export default function Reminders({ ticketId }) {
    const [reminders, setReminders] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchReminders();
    }, [ticketId]);

    const fetchReminders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/reminders`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setReminders(data);
            }
        } catch (err) {
            console.error('Erro ao carregar lembretes:', err);
        }
    };

    const handleCreateReminder = async () => {
        if (!newReminder.title || !newReminder.dueDate) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tickets/${ticketId}/reminders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReminder),
            });

            if (!response.ok) throw new Error('Erro ao criar lembrete');

            setShowCreateForm(false);
            setNewReminder({ title: '', description: '', dueDate: '', priority: 'medium' });
            fetchReminders();
        } catch (err) {
            console.error('Erro ao criar lembrete:', err);
        }
    };

    const toggleReminderStatus = async (reminderId, completed) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/reminders/${reminderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }),
            });
            fetchReminders();
        } catch (err) {
            console.error('Erro ao atualizar lembrete:', err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Lembretes</h4>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    {showCreateForm ? 'Cancelar' : '+ Novo Lembrete'}
                </button>
            </div>

            {showCreateForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-3">Criar Novo Lembrete</h5>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Título do lembrete"
                            value={newReminder.title}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <textarea
                            placeholder="Descrição"
                            value={newReminder.description}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <div className="flex gap-3">
                            <input
                                type="datetime-local"
                                value={newReminder.dueDate}
                                onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded"
                            />
                            <select
                                value={newReminder.priority}
                                onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                            </select>
                            <button
                                onClick={handleCreateReminder}
                                disabled={!newReminder.title || !newReminder.dueDate}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                            type="checkbox"
                            checked={reminder.completed}
                            onChange={(e) => toggleReminderStatus(reminder.id, e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <div className="flex-1">
                            <h5 className={`font-medium ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {reminder.title}
                            </h5>
                            <p className="text-sm text-gray-600">{reminder.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                    Vence: {new Date(reminder.dueDate).toLocaleString('pt-BR')}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {reminder.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}