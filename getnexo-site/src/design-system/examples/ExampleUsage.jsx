/**
 * Design System - Exemplos de Uso
 * Exemplos práticos de como usar o Design System
 */

import React, { useState } from 'react';
import {
    ThemeProvider,
    Button,
    Input,
    Card,
    Loading,
    ToastProvider,
    useToast,
    SkipLinks,
    useTheme,
    useMotion,
    designSystemUtils,
} from '../index';

// Exemplo 1: Formulário Completo
export const CompleteFormExample = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Nome é obrigatório';
        if (!formData.email) newErrors.email = 'Email é obrigatório';
        if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.message) newErrors.message = 'Mensagem é obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 2000));

            addToast('Formulário enviado com sucesso!', {
                type: 'success',
                duration: 3000,
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            addToast('Erro ao enviar formulário!', {
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
            title="Formulário de Contato"
            description="Preencha o formulário abaixo para entrar em contato"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                    label="Nome Completo"
                    placeholder="Digite seu nome"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    required
                    ariaRequired={true}
                />

                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    required
                    ariaRequired={true}
                />

                <Input
                    label="Telefone"
                    placeholder="(XX) XXXXX-XXXX"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    required
                    ariaRequired={true}
                />

                <Input
                    label="Mensagem"
                    placeholder="Digite sua mensagem"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    error={errors.message}
                    multiline
                    rows={4}
                    required
                    ariaRequired={true}
                />

                {loading ? (
                    <Loading
                        variant="spinner"
                        text="Enviando..."
                        color="primary"
                    />
                ) : (
                    <Button
                        variant="primary"
                        size="large"
                        onClick={handleSubmit}
                        fullWidth
                        ariaLabel="Enviar formulário"
                    >
                        Enviar Mensagem
                    </Button>
                )}
            </div>
        </Card>
    );
};

// Exemplo 2: Dashboard com Cards
export const DashboardExample = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    React.useEffect(() => {
        setTimeout(() => {
            setData([
                { title: 'Usuários', value: '1,234', change: '+12%', positive: true },
                { title: 'Vendas', value: 'R$ 45.678', change: '+8%', positive: true },
                { title: 'Pedidos', value: '892', change: '-2%', positive: false },
                { title: 'Receita', value: 'R$ 123.456', change: '+15%', positive: true },
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
            {data.map((item, index) => (
                <Card
                    key={index}
                    variant="elevated"
                    size="medium"
                    title={item.title}
                    description={item.value}
                >
                    <div style={{
                        color: item.positive ? '#22c55e' : '#ef4444',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                    }}>
                        {item.change}
                    </div>
                </Card>
            ))}
        </Card.Group>
    );
};

// Exemplo 3: Modal com Focus Trap
export const ModalExample = () => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = React.useRef(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    if (!isOpen) {
        return (
            <Button variant="primary" onClick={openModal}>
                Abrir Modal
            </Button>
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
                ref={modalRef}
                variant="elevated"
                size="medium"
                title="Confirmar Ação"
                description="Tem certeza que deseja realizar esta ação?"
                footer={
                    <>
                        <Button variant="danger" size="small" onClick={closeModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" size="small" onClick={() => {
                            console.log('Confirmado!');
                            closeModal();
                        }}>
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

// Exemplo 4: Lista com Loading e Toast
export const ListExample = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const loadItems = () => {
        setLoading(true);
        setTimeout(() => {
            setItems([
                { id: 1, name: 'Item 1', status: 'ativo' },
                { id: 2, name: 'Item 2', status: 'inativo' },
                { id: 3, name: 'Item 3', status: 'ativo' },
            ]);
            setLoading(false);
            addToast('Itens carregados com sucesso!', { type: 'success' });
        }, 1500);
    };

    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            name: `Novo Item ${items.length + 1}`,
            status: 'ativo',
        };
        setItems([...items, newItem]);
        addToast('Item adicionado!', { type: 'success' });
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
        addToast('Item removido!', { type: 'warning' });
    };

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Lista de Itens"
            description="Gerencie sua lista de itens"
        >
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <Button variant="primary" size="small" onClick={loadItems}>
                    Carregar Itens
                </Button>
                <Button variant="accent" size="small" onClick={addItem}>
                    Adicionar Item
                </Button>
            </div>

            {loading ? (
                <Loading variant="dots" text="Carregando itens..." />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.length === 0 ? (
                        <div style={{ color: '#71717a', textAlign: 'center', padding: '2rem' }}>
                            Nenhum item encontrado. Clique em "Carregar Itens".
                        </div>
                    ) : (
                        items.map(item => (
                            <Card
                                key={item.id}
                                variant="outlined"
                                size="small"
                                title={item.name}
                                description={`Status: ${item.status}`}
                                footer={
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        Remover
                                    </Button>
                                }
                            />
                        ))
                    )}
                </div>
            )}
        </Card>
    );
};

// Exemplo 5: Autenticação
export const AuthExample = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleLogin = async () => {
        if (!email || !password) {
            addToast('Preencha todos os campos!', { type: 'error' });
            return;
        }

        setLoading(true);

        try {
            // Simular login
            await new Promise(resolve => setTimeout(resolve, 2000));

            addToast('Login realizado com sucesso!', { type: 'success' });
            setEmail('');
            setPassword('');
        } catch (error) {
            addToast('Erro ao fazer login!', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Login"
            description="Faça login para acessar o sistema"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    ariaRequired={true}
                />

                <Input.Password
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    ariaRequired={true}
                />

                {loading ? (
                    <Loading variant="spinner" text="Autenticando..." />
                ) : (
                    <Button
                        variant="primary"
                        size="large"
                        onClick={handleLogin}
                        fullWidth
                        ariaLabel="Fazer login"
                    >
                        Entrar
                    </Button>
                )}
            </div>
        </Card>
    );
};

// Exemplo 6: Configuração de Tema
export const ThemeExample = () => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { updateTheme } = designSystemUtils;
    const { addToast } = useToast();

    const handleToggleTheme = () => {
        toggleTheme();
        addToast(`Tema ${isDarkMode ? 'claro' : 'escuro'} ativado!`, { type: 'info' });
    };

    const handleUpdatePrimaryColor = (color) => {
        updateTheme({ primaryColor: color });
        addToast('Cor primária atualizada!', { type: 'success' });
    };

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Configuração de Tema"
            description="Personalize a aparência do sistema"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button
                        variant={isDarkMode ? 'primary' : 'outline'}
                        size="medium"
                        onClick={handleToggleTheme}
                        ariaLabel={isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
                    >
                        {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
                    </Button>
                    <span style={{ fontSize: '0.875rem', color: '#71717a' }}>
                        Modo atual: {isDarkMode ? 'Escuro' : 'Claro'}
                    </span>
                </div>

                <div>
                    <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                        Cor Primária:
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleUpdatePrimaryColor('primary')}
                        >
                            Azul
                        </Button>
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => handleUpdatePrimaryColor('secondary')}
                        >
                            Roxo
                        </Button>
                        <Button
                            variant="accent"
                            size="small"
                            onClick={() => handleUpdatePrimaryColor('accent')}
                        >
                            Verde
                        </Button>
                    </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#71717a' }}>
                    <strong>Configuração Atual:</strong>
                    <pre style={{ marginTop: '0.5rem', background: '#f4f4f5', padding: '0.5rem', borderRadius: '4px' }}>
                        {JSON.stringify(theme, null, 2)}
                    </pre>
                </div>
            </div>
        </Card>
    );
};

// Exemplo 7: Lista com Acessibilidade
export const AccessibleListExample = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Item 1', selected: false },
        { id: 2, name: 'Item 2', selected: false },
        { id: 3, name: 'Item 3', selected: false },
    ]);

    const toggleItem = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Lista Acessível"
            description="Lista com suporte completo a acessibilidade"
        >
            <div role="list" aria-label="Lista de itens">
                {items.map(item => (
                    <div
                        key={item.id}
                        role="listitem"
                        aria-selected={item.selected}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            borderBottom: '1px solid #e4e4e7',
                            background: item.selected ? '#f0fdf4' : 'transparent',
                        }}
                    >
                        <span>{item.name}</span>
                        <Button
                            variant={item.selected ? 'success' : 'outline'}
                            size="small"
                            onClick={() => toggleItem(item.id)}
                            ariaLabel={item.selected ? `Desmarcar ${item.name}` : `Marcar ${item.name}`}
                            ariaPressed={item.selected}
                        >
                            {item.selected ? '✓' : '○'}
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// Exemplo 8: Formulário com Validação em Tempo Real
export const RealTimeValidationExample = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email é obrigatório';
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';
    };

    const validatePassword = (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    };

    const isValid = !errors.email && !errors.password && email && password;

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Formulário com Validação em Tempo Real"
            description="Validação instantânea dos campos"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={handleEmailChange}
                    error={errors.email}
                    success={!errors.email && email ? 'Email válido!' : ''}
                    type="email"
                    required
                    ariaRequired={true}
                    ariaInvalid={!!errors.email}
                />

                <Input.Password
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={handlePasswordChange}
                    error={errors.password}
                    success={!errors.password && password ? 'Senha válida!' : ''}
                    required
                    ariaRequired={true}
                    ariaInvalid={!!errors.password}
                />

                <Button
                    variant={isValid ? 'primary' : 'outline'}
                    size="medium"
                    disabled={!isValid}
                    ariaDisabled={!isValid}
                >
                    {isValid ? 'Enviar' : 'Preencha os campos'}
                </Button>
            </div>
        </Card>
    );
};

// Exemplo 9: Lista com Skeleton Loading
export const SkeletonExample = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    React.useEffect(() => {
        setTimeout(() => {
            setData([
                { id: 1, title: 'Título 1', description: 'Descrição do item 1' },
                { id: 2, title: 'Título 2', description: 'Descrição do item 2' },
                { id: 3, title: 'Título 3', description: 'Descrição do item 3' },
            ]);
            setLoading(false);
        }, 3000);
    }, []);

    return (
        <Card
            variant="elevated"
            size="medium"
            title="Lista com Skeleton Loading"
            description="Exemplo de loading com skeleton"
        >
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Loading.Skeleton count={3} height="80px" variant="card" />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.map(item => (
                        <Card
                            key={item.id}
                            variant="outlined"
                            size="small"
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

// Exemplo 10: Componente Completo com Todas as Features
export const CompleteExample = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const { addToast } = useToast();

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
            addToast(`Passo ${step + 1} carregado!`, { type: 'info' });
        } else {
            addToast('Formulário completo!', { type: 'success' });
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card
            variant="elevated"
            size="large"
            title="Formulário Multi-Passos"
            description={`Passo ${step} de 3`}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{
                                width: '100%',
                                height: '4px',
                                background: i <= step ? '#3b82f6' : '#e4e4e7',
                                borderRadius: '2px',
                                transition: 'background 0.3s',
                            }}
                            aria-label={`Passo ${i} ${i <= step ? 'completado' : 'pendente'}`}
                        />
                    ))}
                </div>

                {/* Step Content */}
                {step === 1 && (
                    <div>
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome"
                            value={formData.name || ''}
                            onChange={(e) => updateData('name', e.target.value)}
                            fullWidth
                        />
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <Input
                            label="Email"
                            placeholder="Digite seu email"
                            value={formData.email || ''}
                            onChange={(e) => updateData('email', e.target.value)}
                            fullWidth
                        />
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <Input
                            label="Telefone"
                            placeholder="Digite seu telefone"
                            value={formData.phone || ''}
                            onChange={(e) => updateData('phone', e.target.value)}
                            fullWidth
                        />
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                    <Button
                        variant="outline"
                        size="medium"
                        onClick={prevStep}
                        disabled={step === 1}
                        ariaDisabled={step === 1}
                    >
                        Anterior
                    </Button>

                    <Button
                        variant="primary"
                        size="medium"
                        onClick={nextStep}
                    >
                        {step === 3 ? 'Finalizar' : 'Próximo'}
                    </Button>
                </div>

                {/* Data Preview */}
                <Card variant="ghost" size="small" title="Dados Atuais">
                    <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </Card>
            </div>
        </Card>
    );
};

// Exemplo Principal com Todos os Exemplos
export const AllExamples = () => {
    const { computedTheme } = useTheme();

    return (
        <div style={{ padding: computedTheme.spacing.space[6] }}>
            <Card
                variant="elevated"
                size="large"
                title="Design System - Exemplos de Uso"
                description="Coleção de exemplos práticos do Design System"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[6] }}>
                    <CompleteFormExample />
                    <DashboardExample />
                    <ModalExample />
                    <ListExample />
                    <AuthExample />
                    <ThemeExample />
                    <AccessibleListExample />
                    <RealTimeValidationExample />
                    <SkeletonExample />
                    <CompleteExample />
                </div>
            </Card>
        </div>
    );
};

// App principal com todos os providers
export const DesignSystemExamplesApp = () => {
    return (
        <ThemeProvider>
            <ToastProvider position="top-right" duration={3000}>
                <SkipLinks />
                <AllExamples />
            </ToastProvider>
        </ThemeProvider>
    );
};

export default DesignSystemExamplesApp;
