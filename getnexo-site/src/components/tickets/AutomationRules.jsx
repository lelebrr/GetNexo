import React, { useState, useEffect } from 'react';

export default function AutomationRules({ ticketId }) {
    const [rules, setRules] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newRule, setNewRule] = useState({
        name: '',
        trigger: 'status_change',
        condition: '',
        action: 'assign_agent',
        active: true
    });

    useEffect(() => {
        fetchRules();
    }, [ticketId]);

    const fetchRules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/automation-rules?ticketId=${ticketId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setRules(data);
            }
        } catch (err) {
            console.error('Erro ao carregar regras de automação:', err);
        }
    };

    const handleCreateRule = async () => {
        if (!newRule.name || !newRule.condition) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/automation-rules`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newRule, ticketId }),
            });

            if (!response.ok) throw new Error('Erro ao criar regra');

            setShowCreateForm(false);
            setNewRule({ name: '', trigger: 'status_change', condition: '', action: 'assign_agent', active: true });
            fetchRules();
        } catch (err) {
            console.error('Erro ao criar regra:', err);
        }
    };

    const toggleRuleStatus = async (ruleId, active) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/automation-rules/${ruleId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active }),
            });
            fetchRules();
        } catch (err) {
            console.error('Erro ao atualizar regra:', err);
        }
    };

    const getTriggerText = (trigger) => {
        const triggers = {
            status_change: 'Mudança de Status',
            priority_change: 'Mudança de Prioridade',
            assignment: 'Atribuição',
            comment_added: 'Comentário Adicionado',
            time_elapsed: 'Tempo Decorrido',
        };
        return triggers[trigger] || trigger;
    };

    const getActionText = (action) => {
        const actions = {
            assign_agent: 'Atribuir Agente',
            change_priority: 'Alterar Prioridade',
            send_notification: 'Enviar Notificação',
            create_subticket: 'Criar Sub-ticket',
            close_ticket: 'Fechar Ticket',
        };
        return actions[action] || action;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Regras de Automação</h4>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    {showCreateForm ? 'Cancelar' : '+ Nova Regra'}
                </button>
            </div>

            {showCreateForm && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-3">Criar Nova Regra de Automação</h5>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nome da regra"
                            value={newRule.name}
                            onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={newRule.trigger}
                                onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="status_change">Mudança de Status</option>
                                <option value="priority_change">Mudança de Prioridade</option>
                                <option value="assignment">Atribuição</option>
                                <option value="comment_added">Comentário Adicionado</option>
                                <option value="time_elapsed">Tempo Decorrido</option>
                            </select>
                            <select
                                value={newRule.action}
                                onChange={(e) => setNewRule(prev => ({ ...prev, action: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="assign_agent">Atribuir Agente</option>
                                <option value="change_priority">Alterar Prioridade</option>
                                <option value="send_notification">Enviar Notificação</option>
                                <option value="create_subticket">Criar Sub-ticket</option>
                                <option value="close_ticket">Fechar Ticket</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Condição (ex: status == 'open')"
                            value={newRule.condition}
                            onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <div className="flex items-center gap-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newRule.active}
                                    onChange={(e) => setNewRule(prev => ({ ...prev, active: e.target.checked }))}
                                    className="mr-2"
                                />
                                Ativa
                            </label>
                            <button
                                onClick={handleCreateRule}
                                disabled={!newRule.name || !newRule.condition}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                Criar Regra
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {rules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{rule.name}</h5>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span>🔔 {getTriggerText(rule.trigger)}</span>
                                    <span>⚡ {getActionText(rule.action)}</span>
                                    <span>📝 {rule.condition}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rule.active}
                                        onChange={(e) => toggleRuleStatus(rule.id, e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{rule.active ? 'Ativa' : 'Inativa'}</span>
                                </label>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {rules.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhuma regra de automação criada.</p>
            )}
        </div>
    );
}