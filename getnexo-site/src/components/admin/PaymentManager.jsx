import { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Select, Badge, Table, Modal, Tabs, Alert, Progress, Tag } from '../../design-system/components/AdminExtras';
import { apiRequest } from '../../lib/api';

const PaymentManager = ({ initialTab = 'pix' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [pixKeys, setPixKeys] = useState([]);
    const [payments, setPayments] = useState([]);
    const [gateways, setGateways] = useState([]);
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
            const [pixRes, paymentsRes, gatewaysRes] = await Promise.all([
                apiRequest('/api/payments/pix-keys'),
                apiRequest('/api/payments/history'),
                apiRequest('/api/payments/gateways')
            ]);

            setPixKeys(pixRes?.data || pixRes || []);
            setPayments(paymentsRes?.data || paymentsRes || []);
            setGateways(gatewaysRes?.data || gatewaysRes || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Não foi possível carregar os dados. As APIs podem não estar disponíveis.');

            // Dados de exemplo para demonstração
            setPixKeys([
                {
                    id: 1,
                    key: 'chave@pix.com',
                    type: 'email',
                    store_id: 1,
                    store_name: 'Loja Principal',
                    is_active: true,
                    total_received: 15420.50,
                    transaction_count: 89,
                    created_at: '2024-01-01'
                },
                {
                    id: 2,
                    key: '11999999999',
                    type: 'phone',
                    store_id: 2,
                    store_name: 'Filial Centro',
                    is_active: true,
                    total_received: 8750.25,
                    transaction_count: 45,
                    created_at: '2024-01-02'
                }
            ]);

            setPayments([
                {
                    id: 1,
                    transaction_id: 'TXN_001',
                    amount: 299.90,
                    status: 'confirmed',
                    pix_key: 'chave@pix.com',
                    customer_name: 'João Silva',
                    customer_phone: '11999999999',
                    store_name: 'Loja Principal',
                    receipt_url: '/receipts/txn_001.pdf',
                    confirmed_at: '2024-01-15T10:30:00Z',
                    reconciled: true
                },
                {
                    id: 2,
                    transaction_id: 'TXN_002',
                    amount: 149.50,
                    status: 'pending',
                    pix_key: '11999999999',
                    customer_name: 'Maria Santos',
                    customer_phone: '11888888888',
                    store_name: 'Filial Centro',
                    receipt_url: null,
                    confirmed_at: null,
                    reconciled: false
                }
            ]);

            setGateways([
                {
                    id: 'mercadopago',
                    name: 'Mercado Pago',
                    is_enabled: true,
                    config: { public_key: 'APP_USR-...', access_token: 'APP_USR-...' },
                    fees: { percentage: 3.99, fixed: 0.49 }
                },
                {
                    id: 'picpay',
                    name: 'PicPay',
                    is_enabled: false,
                    config: {},
                    fees: { percentage: 2.99, fixed: 0.39 }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || payment.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreatePixKey = async (keyData) => {
        try {
            const result = await apiRequest('/api/payments/pix-keys', 'POST', keyData);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error creating PIX key:', error);
        }
    };

    const handleRefund = async (paymentId, amount) => {
        if (!confirm(`Tem certeza que deseja reembolsar R$ ${amount}?`)) return;

        setLoading(true);
        try {
            const result = await apiRequest(`/api/payments/${paymentId}/refund`, 'POST', { amount });
            if (result.success) {
                alert('Reembolso processado com sucesso!');
                await loadData();
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            alert('Erro ao processar reembolso');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRefundQR = async (paymentId) => {
        setLoading(true);
        try {
            const result = await apiRequest(`/api/payments/${paymentId}/refund-qr`, 'POST');
            if (result.success) {
                // Abrir modal ou mostrar QR code
                alert('QR Code de reembolso gerado!');
            }
        } catch (error) {
            console.error('Error generating refund QR:', error);
            alert('Erro ao gerar QR de reembolso');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGateway = async (gatewayId, config) => {
        try {
            const result = await apiRequest(`/api/payments/gateways/${gatewayId}`, 'PUT', config);
            if (result.success) {
                await loadData();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating gateway:', error);
        }
    };

    const renderPixTab = () => (
        <div className="space-y-6">
            {/* PIX Keys */}
            <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Chaves PIX</h3>
                    <Button
                        onClick={() => {
                            setModalType('pix_key');
                            setSelectedItem(null);
                            setShowModal(true);
                        }}
                        variant="primary"
                    >
                        Nova Chave PIX
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pixKeys.map(key => (
                        <Card key={key.id} style={{ background: '#1f2937', borderColor: '#374151' }}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-white font-medium">{key.key}</h4>
                                    <p className="text-gray-400 text-sm">{key.store_name}</p>
                                </div>
                                <Badge variant={key.is_active ? 'success' : 'secondary'}>
                                    {key.is_active ? 'Ativa' : 'Inativa'}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Tipo:</span>
                                    <Tag variant="secondary">{key.type}</Tag>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Total Recebido:</span>
                                    <span className="text-green-400">R$ {key.total_received.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Transações:</span>
                                    <span className="text-white">{key.transaction_count}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderPaymentsTab = () => (
        <div className="space-y-6">
            {/* Filters */}
            <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Buscar pagamentos..."
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
                                { value: 'pending', label: 'Pendente' },
                                { value: 'confirmed', label: 'Confirmado' },
                                { value: 'refunded', label: 'Reembolsado' }
                            ]}
                        />
                    </div>
                </div>
            </Card>

            {/* Payments Table */}
            <Card style={{ background: '#111827', borderColor: '#1f2937' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>ID Transação</th>
                            <th>Cliente</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Loja</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map(payment => (
                            <tr key={payment.id}>
                                <td className="font-medium text-white">{payment.transaction_id}</td>
                                <td>
                                    <div>
                                        <div className="font-medium text-white">{payment.customer_name}</div>
                                        <div className="text-gray-400 text-sm">{payment.customer_phone}</div>
                                    </div>
                                </td>
                                <td className="font-medium text-green-400">R$ {payment.amount.toFixed(2)}</td>
                                <td>
                                    <Badge variant={
                                        payment.status === 'confirmed' ? 'success' :
                                            payment.status === 'pending' ? 'warning' :
                                                payment.status === 'refunded' ? 'danger' : 'secondary'
                                    }>
                                        {payment.status === 'confirmed' ? 'Confirmado' :
                                            payment.status === 'pending' ? 'Pendente' :
                                                payment.status === 'refunded' ? 'Reembolsado' : 'Outro'}
                                    </Badge>
                                </td>
                                <td className="text-gray-400">{payment.store_name}</td>
                                <td className="text-gray-400">
                                    {payment.confirmed_at ? new Date(payment.confirmed_at).toLocaleDateString('pt-BR') : '-'}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {payment.receipt_url && (
                                            <Button variant="outline" size="sm">
                                                <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                                                    Comprovante
                                                </a>
                                            </Button>
                                        )}
                                        {payment.status === 'confirmed' && (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleRefund(payment.id, payment.amount)}
                                                >
                                                    Reembolsar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleGenerateRefundQR(payment.id)}
                                                >
                                                    QR Reembolso
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );

    const renderGatewaysTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gateways.map(gateway => (
                    <Card key={gateway.id} style={{ background: '#111827', borderColor: '#1f2937' }}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-white">{gateway.name}</h3>
                            <Badge variant={gateway.is_enabled ? 'success' : 'secondary'}>
                                {gateway.is_enabled ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Taxa:</span>
                                <span className="text-white">{gateway.fees.percentage}% + R$ {gateway.fees.fixed.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setModalType('gateway');
                                setSelectedItem(gateway);
                                setShowModal(true);
                            }}
                        >
                            Configurar
                        </Button>
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
                title={
                    modalType === 'pix_key' ? `${isEdit ? 'Editar' : 'Criar'} Chave PIX` :
                        modalType === 'gateway' ? `Configurar ${selectedItem?.name}` :
                            'Modal'
                }
            >
                {modalType === 'pix_key' ? (
                    <PixKeyForm
                        initialData={selectedItem}
                        onSubmit={handleCreatePixKey}
                        onCancel={() => setShowModal(false)}
                    />
                ) : modalType === 'gateway' ? (
                    <GatewayForm
                        initialData={selectedItem}
                        onSubmit={handleUpdateGateway}
                        onCancel={() => setShowModal(false)}
                    />
                ) : null}
            </Modal>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Gestão de Pagamentos</h1>
                <p className="text-gray-400 mt-2">
                    Gerencie PIX, histórico de pagamentos, reembolsos e integrações com gateways
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
                    { id: 'pix', label: 'PIX', content: renderPixTab() },
                    { id: 'payments', label: 'Pagamentos', content: renderPaymentsTab() },
                    { id: 'gateways', label: 'Gateways', content: renderGatewaysTab() }
                ]}
            />

            {renderModal()}
        </div>
    );
};

// Form components
const PixKeyForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        key: '',
        type: 'email',
        store_id: 1,
        is_active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Chave PIX</label>
                <Input
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    placeholder="email@exemplo.com ou 11999999999"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Tipo da Chave</label>
                <Select
                    value={formData.type}
                    onChange={(value) => setFormData({ ...formData, type: value })}
                    options={[
                        { value: 'email', label: 'E-mail' },
                        { value: 'phone', label: 'Telefone' },
                        { value: 'cpf', label: 'CPF' },
                        { value: 'cnpj', label: 'CNPJ' },
                        { value: 'random', label: 'Chave Aleatória' }
                    ]}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Loja/Filial</label>
                <Select
                    value={formData.store_id.toString()}
                    onChange={(value) => setFormData({ ...formData, store_id: parseInt(value) })}
                    options={[
                        { value: '1', label: 'Loja Principal' },
                        { value: '2', label: 'Filial Centro' },
                        { value: '3', label: 'Filial Shopping' }
                    ]}
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="pix_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="pix_active" className="text-sm">Chave Ativa</label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Atualizar' : 'Criar'} Chave PIX
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

const GatewayForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        is_enabled: false,
        config: {},
        fees: { percentage: 0, fixed: 0 }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(initialData.id, formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="gateway_enabled"
                    checked={formData.is_enabled}
                    onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="gateway_enabled" className="text-sm">Gateway Ativo</label>
            </div>

            {initialData.id === 'mercadopago' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Public Key</label>
                        <Input
                            value={formData.config.public_key || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: { ...formData.config, public_key: e.target.value }
                            })}
                            placeholder="APP_USR-..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Access Token</label>
                        <Input
                            value={formData.config.access_token || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: { ...formData.config, access_token: e.target.value }
                            })}
                            placeholder="APP_USR-..."
                        />
                    </div>
                </div>
            )}

            {initialData.id === 'picpay' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">API Key</label>
                        <Input
                            value={formData.config.api_key || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: { ...formData.config, api_key: e.target.value }
                            })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Seller Token</label>
                        <Input
                            value={formData.config.seller_token || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: { ...formData.config, seller_token: e.target.value }
                            })}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Taxa Percentual (%)</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.fees.percentage}
                        onChange={(e) => setFormData({
                            ...formData,
                            fees: { ...formData.fees, percentage: parseFloat(e.target.value) }
                        })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Taxa Fixa (R$)</label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.fees.fixed}
                        onChange={(e) => setFormData({
                            ...formData,
                            fees: { ...formData.fees, fixed: parseFloat(e.target.value) }
                        })}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary">
                    Salvar Configuração
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default PaymentManager;