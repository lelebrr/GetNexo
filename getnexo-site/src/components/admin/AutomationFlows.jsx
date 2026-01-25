import React, { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Select, Badge, Table, Modal, Tabs, Alert, Progress, Tag } from '../../design-system/components/AdminExtras';
import { apiRequest } from '../../lib/api';

const AutomationFlows = ({ initialTab = 'flows' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [flows, setFlows] = useState([]);
    const [triggers, setTriggers] = useState([]);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Tenta carregar dados das APIs
            const [flowsRes, triggersRes, actionsRes] = await Promise.all([
                apiRequest('/api/automations/flows'),
                apiRequest('/api/automations/triggers'),
                apiRequest('/api/automations/actions')
            ]);

            setFlows(flowsRes?.data || flowsRes || []);
            setTriggers(triggersRes?.data || triggersRes || []);
            setActions(actionsRes?.data || actionsRes || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Não foi possível carregar os dados. As APIs podem não estar disponíveis.');

            // Dados de exemplo para demonstração
            setFlows([
                {
                    id: 1,
                    name: 'Boas-vindas ao cliente',
                    description: 'Envia mensagem de boas-vindas quando uma nova conversa é iniciada',
                    trigger: 'new_conversation',
                    actions: ['send_message', 'add_tag'],
                    is_active: true,
                    executions_count: 245,
                    success_rate: 98.5,
                    created_at: '2024-01-01'
                },
                {
                    id: 2,
                    name: 'Pagamento confirmado',
                    description: 'Adiciona tag VIP e notifica equipe quando PIX é confirmado',
                    trigger: 'pix_confirmed',
                    actions: ['add_tag', 'notify_slack'],
                    is_active: true,
                    executions_count: 89,
                    success_rate: 100,
                    created_at: '2024-01-02'
                },
                {
                    id: 3,
                    name: 'Carrinho abandonado',
                    description: 'Envia lembrete quando carrinho é abandonado',
                    trigger: 'cart_abandoned',
                    actions: ['send_message'],
                    is_active: false,
                    executions_count: 0,
                    success_rate: 0,
                    created_at: '2024-01-03'
                }
            ]);

            setTriggers([
                { id: 'new_conversation', name: 'Nova Conversa', description: 'Quando uma nova conversa é iniciada' },
                { id: 'tag_added', name: 'Tag Adicionada', description: 'Quando uma tag é adicionada ao contato' },
                { id: 'pix_confirmed', name: 'PIX Confirmado', description: 'Quando um pagamento PIX é confirmado' },
                { id: 'cart_abandoned', name: 'Carrinho Abandonado', description: 'Quando um carrinho é abandonado' }
            ]);

            setActions([
                { id: 'send_message', name: 'Enviar Mensagem', description: 'Envia uma mensagem para o contato' },
                { id: 'add_tag', name: 'Adicionar Tag', description: 'Adiciona uma tag ao contato' },
                { id: 'move_funnel', name: 'Mover no Funil', description: 'Move o contato para outro estágio do funil' },
                { id: 'notify_slack', name: 'Notificar Slack', description: 'Envia notificação para o Slack' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredFlows = flows.filter(flow => {
        const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flow.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || (selectedStatus === 'active' ? flow.is_active : !flow.is_active);
        return matchesSearch && matchesStatus;
    });

    const handleCreateFlow = async (flowData) => {
        try {
            const result = await apiRequest('/api/automations/flows', 'POST', flowData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating flow:', error);
        }
    };

    const handleUpdateFlow = async (flowData) => {
        try {
            const result = await apiRequest(`/api/automations/flows/${selectedItem.id}`, 'PUT', flowData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating flow:', error);
        }
    };

    const handleDeleteFlow = async (flowId) => {
        if (!confirm('Tem certeza que deseja excluir este fluxo?')) return;

        try {
            const result = await apiRequest(`/api/automations/flows/${flowId}`, 'DELETE');
            if (result.success) {
                await loadData();
            }
        } catch (error) {
            console.error('Error deleting flow:', error);
        }
    };

    const handleTestFlow = async (flowId) => {
        setLoading(true);
        try {
            const result = await apiRequest(`/api/automations/flows/${flowId}/test`, 'POST');
            if (result.success) {
                alert('Fluxo testado com sucesso!');
            }
        } catch (error) {
            console.error('Error testing flow:', error);
            alert('Erro ao testar fluxo');
        } finally {
            setLoading(false);
        }
    };

    const renderFlowsTab = () => (
        <div className="space-y-6">
            {/* Filters and Search */}
            <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Buscar fluxos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={[
                                { value: '', label: 'Todos os status' },
                                { value: 'active', label: 'Ativos' },
                                { value: 'inactive', label: 'Inativos' }
                            ]}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setModalType('flow');
                            setSelectedItem(null);
                            setShowModal(true);
                        }}
                        variant="primary"
                    >
                        Novo Fluxo
                    </Button>
                </div>
            </Card>

            {/* Flows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlows.map(flow => (
                    <Card key={flow.id} style={{ background: '#111827', borderColor: '#1f2937' }}>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-white">{flow.name}</h3>
                            <Badge variant={flow.is_active ? 'success' : 'secondary'}>
                                {flow.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{flow.description}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Trigger:</span>
                                <Tag variant="secondary">{flow.trigger.replace('_', ' ')}</Tag>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Ações:</span>
                                <span className="text-white text-sm">{flow.actions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Execuções:</span>
                                <span className="text-white text-sm">{flow.executions_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Taxa de sucesso:</span>
                                <span className="text-green-400 text-sm">{flow.success_rate}%</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setModalType('flow');
                                    setSelectedItem(flow);
                                    setShowModal(true);
                                }}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleTestFlow(flow.id)}
                                disabled={loading}
                            >
                                Testar
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteFlow(flow.id)}
                            >
                                Excluir
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredFlows.length === 0 && (
                <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                    <div className="text-center py-8">
                        <p className="text-gray-400">Nenhum fluxo encontrado</p>
                    </div>
                </Card>
            )}
        </div>
    );

    const renderTriggersTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {triggers.map(trigger => (
                    <Card key={trigger.id} style={{ background: '#111827', borderColor: '#1f2937' }}>
                        <h3 className="text-lg font-semibold mb-2 text-white">{trigger.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{trigger.description}</p>
                        <Tag variant="primary">{trigger.id}</Tag>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderActionsTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {actions.map(action => (
                    <Card key={action.id} style={{ background: '#111827', borderColor: '#1f2937' }}>
                        <h3 className="text-lg font-semibold mb-2 text-white">{action.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                        <Tag variant="secondary">{action.id}</Tag>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderModal = () => {
        if (!showModal) return null;

        const isEdit = !!selectedItem;

        return (
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`${isEdit ? 'Editar' : 'Criar'} Fluxo de Automação`}
            >
                <FlowForm
                    initialData={selectedItem}
                    triggers={triggers}
                    actions={actions}
                    onSubmit={isEdit ? handleUpdateFlow : handleCreateFlow}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Automations & Flows</h1>
                <p className="text-gray-400 mt-2">
                    Crie fluxos automatizados tipo Zapier para otimizar seus processos
                </p>
            </div>

            {error && (
                <Alert variant="warning" className="mb-6">
                    <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                        Mostrando dados de exemplo para demonstração.
                    </p>
                </Alert>
            )}

            <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'flows', label: 'Fluxos', content: renderFlowsTab() },
                    { id: 'triggers', label: 'Triggers', content: renderTriggersTab() },
                    { id: 'actions', label: 'Ações', content: renderActionsTab() }
                ]}
            />

            {renderModal()}
        </div>
    );
};

// Form component
const FlowForm = ({ initialData, triggers, actions, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        description: '',
        trigger: '',
        actions: [],
        conditions: [],
        is_active: true
    });

    const [selectedActions, setSelectedActions] = useState(initialData?.actions || []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, actions: selectedActions });
    };

    const addAction = (actionId) => {
        if (!selectedActions.includes(actionId)) {
            setSelectedActions([...selectedActions, actionId]);
        }
    };

    const removeAction = (actionId) => {
        setSelectedActions(selectedActions.filter(id => id !== actionId));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome do Fluxo</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Trigger</label>
                    <Select
                        value={formData.trigger}
                        onChange={(value) => setFormData({ ...formData, trigger: value })}
                        options={triggers.map(trigger => ({ value: trigger.id, label: trigger.name }))}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            {/* Actions Selection */}
            <div>
                <label className="block text-sm font-medium mb-3">Ações</label>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="mb-3">
                        <p className="text-gray-400 text-sm mb-2">Ações selecionadas:</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedActions.map(actionId => {
                                const action = actions.find(a => a.id === actionId);
                                return (
                                    <Tag key={actionId} variant="primary" className="cursor-pointer" onClick={() => removeAction(actionId)}>
                                        {action?.name} ×
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm mb-2">Adicionar ação:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {actions.filter(action => !selectedActions.includes(action.id)).map(action => (
                                <Button
                                    key={action.id}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addAction(action.id)}
                                >
                                    {action.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditions (placeholder for future expansion) */}
            <div>
                <label className="block text-sm font-medium mb-1">Condições (opcional)</label>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Condições avançadas serão implementadas em breve</p>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="flow_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="flow_active" className="text-sm">Fluxo Ativo</label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Atualizar' : 'Criar'} Fluxo
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default AutomationFlows;