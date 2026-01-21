/**
 * Design System - Exemplo de Integração em Componentes Existentes
 * Exemplo prático de como integrar o Design System em TicketForm
 */

import React, { useState } from 'react';
import {
    Card,
    Input,
    Button,
    Loading,
    ToastProvider,
    useToast,
    useTheme,
} from '../index';

// Exemplo 1: TicketForm com Design System
export const TicketFormWithDesignSystem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: 'support',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const { computedTheme } = useTheme();

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Título é obrigatório';
        if (!formData.description) newErrors.description = 'Descrição é obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            // Simular criação de ticket
            await new Promise(resolve => setTimeout(resolve, 2000));

            addToast('Ticket criado com sucesso!', {
                type: 'success',
                duration: 3000,
            });

            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                category: 'support',
            });
        } catch (error) {
            addToast('Erro ao criar ticket!', {
                type: 'error',
                duration: 5000,
                action: {
                    label: 'Tentar novamente',
                    onClick: handleSubmit,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Card
            variant="elevated"
            size="large"
            title="Novo Ticket"
            description="Crie um novo ticket de suporte"
        >
            <form onSubmit={handleSubmit}>
                <Input
                    label="Título"
                    placeholder="Digite o título do ticket"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    required
                    ariaRequired={true}
                    fullWidth
                />

                <Input
                    label="Descrição"
                    placeholder="Descreva o problema"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    multiline
                    rows={4}
                    required
                    ariaRequired={true}
                    fullWidth
                />

                <Input
                    label="Prioridade"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    fullWidth
                />

                <Input
                    label="Categoria"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    fullWidth
                />

                {loading ? (
                    <Loading variant="spinner" text="Criando ticket..." />
                ) : (
                    <Button
                        variant="primary"
                        size="large"
                        type="submit"
                        fullWidth
                        ariaLabel="Criar ticket"
                    >
                        Criar Ticket
                    </Button>
                )}
            </form>
        </Card>
    );
};

// Exemplo 2: TicketList com Design System
export const TicketListWithDesignSystem = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const loadTickets = () => {
        setLoading(true);
        setTimeout(() => {
            setTickets([
                { id: 1, title: 'Problema no login', priority: 'high', status: 'open' },
                { id: 2, title: 'Erro 404', priority: 'medium', status: 'in_progress' },
                { id: 3, title: 'Performance lenta', priority: 'low', status: 'closed' },
            ]);
            setLoading(false);
            addToast('Tickets carregados!', { type: 'success' });
        }, 1500);
    };

    const updateTicketStatus = (id, status) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, status } : ticket
        ));
        addToast('Status atualizado!', { type: 'info' });
    };

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Lista de Tickets"
            description="Gerencie seus tickets de suporte"
        >
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <Button variant="primary" size="small" onClick={loadTickets}>
                    Carregar Tickets
                </Button>
            </div>

            {loading ? (
                <Loading variant="dots" text="Carregando tickets..." />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tickets.length === 0 ? (
                        <div style={{ color: '#71717a', textAlign: 'center', padding: '2rem' }}>
                            Nenhum ticket encontrado. Clique em "Carregar Tickets".
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <Card
                                key={ticket.id}
                                variant="outlined"
                                size="small"
                                title={ticket.title}
                                description={`Prioridade: ${ticket.priority} | Status: ${ticket.status}`}
                                footer={
                                    <>
                                        <Button
                                            variant="success"
                                            size="small"
                                            onClick={() => updateTicketStatus(ticket.id, 'closed')}
                                        >
                                            Fechar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                                        >
                                            Em Progresso
                                        </Button>
                                    </>
                                }
                            />
                        ))
                    )}
                </div>
            )}
        </Card>
    );
};

// Exemplo 3: Dashboard com Design System
export const DashboardWithDesignSystem = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setStats([
                { title: 'Tickets Abertos', value: '24', change: '+12%', positive: true },
                { title: 'Em Progresso', value: '8', change: '-2%', positive: false },
                { title: 'Fechados Hoje', value: '15', change: '+8%', positive: true },
                { title: 'SLA Médio', value: '2.3h', change: '+5%', positive: true },
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    if (loading) {
        return (
            <Loading
                variant="spinner"
                text="Carregando dashboard..."
                fullscreen={false}
            />
        );
    }

    return (
        <Card.Group columns={4} gap="medium">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    variant="elevated"
                    size="medium"
                    title={stat.title}
                    description={stat.value}
                >
                    <div style={{
                        color: stat.positive ? '#22c55e' : '#ef4444',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                    }}>
                        {stat.change}
                    </div>
                </Card>
            ))}
        </Card.Group>
    );
};

// Exemplo 4: Formulário de Feedback com Design System
export const FeedbackFormWithDesignSystem = () => {
    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        message: '',
        rating: 5,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const validate = () => {
        const newErrors = {};
        if (!feedback.name) newErrors.name = 'Nome é obrigatório';
        if (!feedback.email) newErrors.email = 'Email é obrigatório';
        if (!feedback.message) newErrors.message = 'Mensagem é obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            addToast('Feedback enviado com sucesso!', {
                type: 'success',
                duration: 3000,
            });

            setFeedback({
                name: '',
                email: '',
                message: '',
                rating: 5,
            });
        } catch (error) {
            addToast('Erro ao enviar feedback!', {
                type: 'error',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFeedback(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Feedback"
            description="Deixe seu feedback sobre o sistema"
        >
            <form onSubmit={handleSubmit}>
                <Input
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={feedback.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    required
                    ariaRequired={true}
                    fullWidth
                />

                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={feedback.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    type="email"
                    required
                    ariaRequired={true}
                    fullWidth
                />

                <Input
                    label="Mensagem"
                    placeholder="Digite sua mensagem"
                    value={feedback.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    error={errors.message}
                    multiline
                    rows={4}
                    required
                    ariaRequired={true}
                    fullWidth
                />

                <Input
                    label="Avaliação (1-5)"
                    type="number"
                    min="1"
                    max="5"
                    value={feedback.rating}
                    onChange={(e) => handleChange('rating', e.target.value)}
                    fullWidth
                />

                {loading ? (
                    <Loading variant="spinner" text="Enviando feedback..." />
                ) : (
                    <Button
                        variant="primary"
                        size="large"
                        type="submit"
                        fullWidth
                        ariaLabel="Enviar feedback"
                    >
                        Enviar Feedback
                    </Button>
                )}
            </form>
        </Card>
    );
};

// Exemplo 5: Modal de Confirmação com Design System
export const ConfirmationModalWithDesignSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [action, setAction] = useState('');
    const { addToast } = useToast();

    const handleConfirm = () => {
        addToast(`${action} realizada com sucesso!`, { type: 'success' });
        setIsOpen(false);
        setAction('');
    };

    const openModal = (actionType) => {
        setAction(actionType);
        setIsOpen(true);
    };

    if (!isOpen) {
        return (
            <Card
                variant="elevated"
                size="medium"
                title="Ações de Ticket"
                description="Selecione uma ação para realizar"
            >
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button variant="primary" size="medium" onClick={() => openModal('Fechar ticket')}>
                        Fechar Ticket
                    </Button>
                    <Button variant="danger" size="medium" onClick={() => openModal('Excluir ticket')}>
                        Excluir Ticket
                    </Button>
                    <Button variant="accent" size="medium" onClick={() => openModal('Reabrir ticket')}>
                        Reabrir Ticket
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <Card
                variant="elevated"
                size="medium"
                title={`Confirmar ${action}`}
                description={`Tem certeza que deseja ${action.toLowerCase()}?`}
                footer={
                    <>
                        <Button variant="outline" size="small" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" size="small" onClick={handleConfirm}>
                            Confirmar
                        </Button>
                    </>
                }
            >
                Esta ação não pode ser desfeita.
            </Card>
        </div>
    );
};

// Exemplo Principal com Todos os Exemplos
export const AllIntegrationExamples = () => {
    const { computedTheme } = useTheme();

    return (
        <div style={{ padding: computedTheme.spacing.space[6] }}>
            <Card
                variant="elevated"
                size="large"
                title="Exemplos de Integração"
                description="Como integrar o Design System em componentes existentes"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[6] }}>
                    <TicketFormWithDesignSystem />
                    <TicketListWithDesignSystem />
                    <DashboardWithDesignSystem />
                    <FeedbackFormWithDesignSystem />
                    <ConfirmationModalWithDesignSystem />
                </div>
            </Card>
        </div>
    );
};

// App principal com todos os providers
export const IntegrationExamplesApp = () => {
    return (
        <ThemeProvider>
            <ToastProvider position="top-right" duration={3000}>
                <AllIntegrationExamples />
            </ToastProvider>
        </ThemeProvider>
    );
};

export default IntegrationExamplesApp;
