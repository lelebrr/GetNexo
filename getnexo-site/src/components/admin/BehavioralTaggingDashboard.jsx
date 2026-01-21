import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge, Table, Modal, Tabs, Alert, Progress, Tag } from '../design-system';
import { apiRequest } from '../../lib/api';

const BehavioralTaggingDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [clusteringStats, setClusteringStats] = useState(null);
    const [clusters, setClusters] = useState([]);
    const [behavioralTags, setBehavioralTags] = useState([]);
    const [behaviorRules, setBehaviorRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, clustersRes, tagsRes, rulesRes] = await Promise.all([
                apiRequest('/api/clustering/stats'),
                apiRequest('/api/clustering/clusters'),
                apiRequest('/api/clustering/behavioral-tags'),
                apiRequest('/api/clustering/behavior-rules')
            ]);

            setClusteringStats(statsRes.data);
            setClusters(clustersRes.data);
            setBehavioralTags(tagsRes.data);
            setBehaviorRules(rulesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRunClustering = async () => {
        setLoading(true);
        try {
            const result = await apiRequest('/api/clustering/run', 'POST');
            if (result.success) {
                await loadData();
                alert('Clustering executado com sucesso!');
            }
        } catch (error) {
            console.error('Error running clustering:', error);
            alert('Erro ao executar clustering');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async (tagData) => {
        try {
            const result = await apiRequest('/api/clustering/behavioral-tags', 'POST', tagData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const handleCreateRule = async (ruleData) => {
        try {
            const result = await apiRequest('/api/clustering/behavior-rules', 'POST', ruleData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating rule:', error);
        }
    };

    const handleApplyTags = async () => {
        const userIds = prompt('Digite os IDs dos usuários separados por vírgula:');
        if (!userIds) return;

        setLoading(true);
        try {
            const result = await apiRequest('/api/clustering/apply-tags', 'POST', {
                userIds: userIds.split(',').map(id => id.trim())
            });
            if (result.success) {
                alert(`${result.data.totalTagsApplied} tags aplicadas para ${result.data.processedUsers} usuários`);
            }
        } catch (error) {
            console.error('Error applying tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {clusteringStats?.profilesCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Usuários Analisados</div>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {clusters.length}
                        </div>
                        <div className="text-sm text-gray-600">Clusters Ativos</div>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {behavioralTags.length}
                        </div>
                        <div className="text-sm text-gray-600">Tags Comportamentais</div>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {behaviorRules.length}
                        </div>
                        <div className="text-sm text-gray-600">Regras de Comportamento</div>
                    </div>
                </Card>
            </div>

            {/* Clustering Status */}
            {clusteringStats && (
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Último Clustering</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-sm text-gray-600">Clusters</div>
                            <div className="font-semibold">{clusteringStats.clusters}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Silhouette Score</div>
                            <div className="font-semibold">{clusteringStats.silhouetteScore?.toFixed(3)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Iterações</div>
                            <div className="font-semibold">{clusteringStats.iterations}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">Status</div>
                            <Badge variant={clusteringStats.converged ? 'success' : 'warning'}>
                                {clusteringStats.converged ? 'Convergido' : 'Não Convergido'}
                            </Badge>
                        </div>
                    </div>
                </Card>
            )}

            {/* Actions */}
            <Card>
                <h3 className="text-lg font-semibold mb-4">Ações</h3>
                <div className="flex gap-4">
                    <Button
                        onClick={handleRunClustering}
                        disabled={loading}
                        variant="primary"
                    >
                        {loading ? 'Executando...' : 'Executar Clustering'}
                    </Button>

                    <Button
                        onClick={() => {
                            setModalType('tag');
                            setShowModal(true);
                        }}
                        variant="secondary"
                    >
                        Criar Tag Comportamental
                    </Button>

                    <Button
                        onClick={() => {
                            setModalType('rule');
                            setShowModal(true);
                        }}
                        variant="secondary"
                    >
                        Criar Regra
                    </Button>

                    <Button
                        onClick={handleApplyTags}
                        variant="outline"
                    >
                        Aplicar Tags
                    </Button>
                </div>
            </Card>
        </div>
    );

    const renderClustersTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusters.map(cluster => (
                    <Card key={cluster.cluster_id}>
                        <h3 className="text-lg font-semibold mb-2">
                            Cluster {cluster.cluster_id}
                        </h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Usuários:</span>
                                <span className="font-medium">{cluster.user_count}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Engajamento Médio:</span>
                                <span className="font-medium">{cluster.avg_engagement}%</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Conversão:</span>
                                <span className="font-medium">{cluster.avg_conversion_prob}%</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Churn Risk:</span>
                                <span className="font-medium">{cluster.avg_churn_risk}%</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Navigate to cluster details
                                    setActiveTab('cluster-detail');
                                    setSelectedItem(cluster);
                                }}
                            >
                                Ver Detalhes
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderTagsTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tags Comportamentais</h3>
                <Button
                    onClick={() => {
                        setModalType('tag');
                        setSelectedItem(null);
                        setShowModal(true);
                    }}
                    variant="primary"
                >
                    Nova Tag
                </Button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Confiança</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {behavioralTags.map(tag => (
                        <tr key={tag.id}>
                            <td className="font-medium">{tag.name}</td>
                            <td>
                                <Tag variant="secondary">{tag.category}</Tag>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <Progress value={tag.confidence_score} className="w-16" />
                                    <span className="text-sm">{tag.confidence_score}%</span>
                                </div>
                            </td>
                            <td>
                                <Badge variant={tag.is_active ? 'success' : 'secondary'}>
                                    {tag.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setModalType('tag');
                                            setSelectedItem(tag);
                                            setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={async () => {
                                            if (confirm('Tem certeza que deseja excluir esta tag?')) {
                                                await apiRequest(`/api/clustering/behavioral-tags/${tag.id}`, 'DELETE');
                                                await loadData();
                                            }
                                        }}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );

    const renderRulesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Regras de Comportamento</h3>
                <Button
                    onClick={() => {
                        setModalType('rule');
                        setSelectedItem(null);
                        setShowModal(true);
                    }}
                    variant="primary"
                >
                    Nova Regra
                </Button>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Prioridade</th>
                        <th>Threshold</th>
                        <th>Aplicações</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {behaviorRules.map(rule => (
                        <tr key={rule.id}>
                            <td className="font-medium">{rule.name}</td>
                            <td>
                                <Badge variant={
                                    rule.priority === 1 ? 'danger' :
                                        rule.priority === 2 ? 'warning' : 'secondary'
                                }>
                                    {rule.priority === 1 ? 'Alta' :
                                        rule.priority === 2 ? 'Média' : 'Baixa'}
                                </Badge>
                            </td>
                            <td>{rule.confidence_threshold}%</td>
                            <td>{rule.applications_count}</td>
                            <td>
                                <Badge variant={rule.is_active ? 'success' : 'secondary'}>
                                    {rule.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setModalType('rule');
                                            setSelectedItem(rule);
                                            setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={async () => {
                                            if (confirm('Tem certeza que deseja excluir esta regra?')) {
                                                await apiRequest(`/api/clustering/behavior-rules/${rule.id}`, 'DELETE');
                                                await loadData();
                                            }
                                        }}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );

    const renderModal = () => {
        if (!showModal) return null;

        const isEdit = !!selectedItem;

        return (
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`${isEdit ? 'Editar' : 'Criar'} ${modalType === 'tag' ? 'Tag Comportamental' : 'Regra de Comportamento'}`}
            >
                {modalType === 'tag' ? (
                    <TagForm
                        initialData={selectedItem}
                        onSubmit={handleCreateTag}
                        onCancel={() => setShowModal(false)}
                    />
                ) : (
                    <RuleForm
                        initialData={selectedItem}
                        onSubmit={handleCreateRule}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </Modal>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Behavioral Tagging System</h1>
                <p className="text-gray-600 mt-2">
                    Sistema completo de tagging comportamental e clustering de usuários
                </p>
            </div>

            <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={[
                    { id: 'overview', label: 'Visão Geral', content: renderOverviewTab() },
                    { id: 'clusters', label: 'Clusters', content: renderClustersTab() },
                    { id: 'tags', label: 'Tags Comportamentais', content: renderTagsTab() },
                    { id: 'rules', label: 'Regras', content: renderRulesTab() }
                ]}
            />

            {renderModal()}
        </div>
    );
};

// Form components
const TagForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        category: '',
        rules: [],
        confidence_score: 50,
        is_active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nome da Tag</label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <Select
                    value={formData.category}
                    onChange={(value) => setFormData({ ...formData, category: value })}
                    options={[
                        { value: 'engagement', label: 'Engajamento' },
                        { value: 'conversion', label: 'Conversão' },
                        { value: 'retention', label: 'Retenção' },
                        { value: 'loyalty', label: 'Lealdade' }
                    ]}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Score de Confiança (%)</label>
                <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.confidence_score}
                    onChange={(e) => setFormData({ ...formData, confidence_score: parseInt(e.target.value) })}
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm">Tag Ativa</label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Atualizar' : 'Criar'} Tag
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

const RuleForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        description: '',
        tag_name: '',
        tag_category: '',
        priority: 1,
        conditions: [],
        tag_config: {},
        confidence_threshold: 50,
        expiration_days: null,
        max_applications: null,
        cooldown_hours: 24,
        is_active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nome da Regra</label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tag Nome</label>
                    <Input
                        value={formData.tag_name}
                        onChange={(e) => setFormData({ ...formData, tag_name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tag Categoria</label>
                    <Select
                        value={formData.tag_category}
                        onChange={(value) => setFormData({ ...formData, tag_category: value })}
                        options={[
                            { value: 'engagement', label: 'Engajamento' },
                            { value: 'conversion', label: 'Conversão' },
                            { value: 'retention', label: 'Retenção' },
                            { value: 'loyalty', label: 'Lealdade' }
                        ]}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Prioridade</label>
                    <Select
                        value={formData.priority.toString()}
                        onChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
                        options={[
                            { value: '1', label: 'Alta' },
                            { value: '2', label: 'Média' },
                            { value: '3', label: 'Baixa' }
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Threshold (%)</label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.confidence_threshold}
                        onChange={(e) => setFormData({ ...formData, confidence_threshold: parseInt(e.target.value) })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Cooldown (horas)</label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.cooldown_hours}
                        onChange={(e) => setFormData({ ...formData, cooldown_hours: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="rule_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="rule_active" className="text-sm">Regra Ativa</label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Atualizar' : 'Criar'} Regra
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default BehavioralTaggingDashboard;