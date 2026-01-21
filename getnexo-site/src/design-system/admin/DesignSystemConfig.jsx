/**
 * Design System - Admin Configuration Panel
 * Configuração via Admin do Design System completo
 * WCAG 2.2 AA+ compliant
 */

import React, { useState, useEffect } from 'react';
import { useTheme, useThemeConfig } from '../theme/ThemeContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { ToastProvider, useToast } from '../components/Toast';
import { SkipLinks, useSkipLinks } from '../components/SkipLinks';
import { motionGuidelines } from '../motion/motion-guidelines';

// Color preview component
const ColorPreview = ({ name, color, isDarkMode = false }) => {
    const { computedTheme } = useTheme();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: computedTheme.spacing.space[3],
                padding: computedTheme.spacing.space[3],
                borderRadius: computedTheme.borderRadius,
                background: isDarkMode ? computedTheme.colors.background.tertiary : computedTheme.colors.background.primary,
                border: `1px solid ${computedTheme.colors.border.light}`,
            }}
        >
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: computedTheme.borderRadius,
                    background: color,
                    border: `1px solid ${computedTheme.colors.border.light}`,
                }}
                aria-label={`Preview da cor ${name}`}
            />
            <div>
                <div style={{ fontWeight: computedTheme.typography.fontWeight.medium }}>
                    {name}
                </div>
                <div style={{ fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }}>
                    {color}
                </div>
            </div>
        </div>
    );
};

// Theme preview component
const ThemePreview = ({ theme, isDarkMode }) => {
    const { computedTheme } = useTheme();

    return (
        <Card
            variant="outlined"
            size="medium"
            title={`Preview ${isDarkMode ? 'Dark' : 'Light'} Mode`}
            description="Visualização do tema atual"
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: computedTheme.spacing.space[3] }}>
                <ColorPreview name="Primary" color={theme.primaryColor[600]} isDarkMode={isDarkMode} />
                <ColorPreview name="Secondary" color={theme.secondaryColor[600]} isDarkMode={isDarkMode} />
                <ColorPreview name="Accent" color={theme.accentColor[600]} isDarkMode={isDarkMode} />
                <ColorPreview name="Success" color={theme.colors.success[600]} isDarkMode={isDarkMode} />
                <ColorPreview name="Warning" color={theme.colors.warning[600]} isDarkMode={isDarkMode} />
                <ColorPreview name="Error" color={theme.colors.error[600]} isDarkMode={isDarkMode} />
            </div>
        </Card>
    );
};

// Component preview component
const ComponentPreview = () => {
    const { computedTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { addToast } = useToast();

    const handleShowToast = () => {
        addToast('Toast de sucesso!', { type: 'success' });
    };

    const handleShowError = () => {
        addToast('Erro ao processar!', { type: 'error' });
    };

    const handleLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <Card
            variant="outlined"
            size="medium"
            title="Preview de Componentes"
            description="Teste os componentes do Design System"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[4] }}>
                {/* Buttons */}
                <div style={{ display: 'flex', gap: computedTheme.spacing.space[2], flexWrap: 'wrap' }}>
                    <Button variant="primary" size="medium">
                        Primário
                    </Button>
                    <Button variant="secondary" size="medium">
                        Secundário
                    </Button>
                    <Button variant="accent" size="medium">
                        Acento
                    </Button>
                    <Button variant="outline" size="medium">
                        Outline
                    </Button>
                    <Button variant="ghost" size="medium">
                        Ghost
                    </Button>
                    <Button variant="danger" size="medium">
                        Perigo
                    </Button>
                    <Button variant="success" size="medium">
                        Sucesso
                    </Button>
                </div>

                {/* Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[3] }}>
                    <Input
                        label="Input Padrão"
                        placeholder="Digite algo..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Input com Erro"
                        placeholder="Digite algo..."
                        error="Este campo é obrigatório"
                        fullWidth
                    />
                    <Input
                        label="Input com Sucesso"
                        placeholder="Digite algo..."
                        success="Campo válido!"
                        fullWidth
                    />
                    <Input
                        label="Input com Aviso"
                        placeholder="Digite algo..."
                        warning="Atenção ao preencher"
                        fullWidth
                    />
                </div>

                {/* Loading */}
                {isLoading && (
                    <Loading
                        text="Carregando..."
                        variant="spinner"
                        color="primary"
                    />
                )}

                {/* Toast Actions */}
                <div style={{ display: 'flex', gap: computedTheme.spacing.space[2], flexWrap: 'wrap' }}>
                    <Button variant="success" size="small" onClick={handleShowToast}>
                        Mostrar Toast Sucesso
                    </Button>
                    <Button variant="danger" size="small" onClick={handleShowError}>
                        Mostrar Toast Erro
                    </Button>
                    <Button variant="primary" size="small" onClick={handleLoading}>
                        Simular Loading
                    </Button>
                </div>

                {/* Card Variants */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: computedTheme.spacing.space[3] }}>
                    <Card variant="elevated" size="small" title="Elevated" description="Card com sombra" />
                    <Card variant="outlined" size="small" title="Outlined" description="Card com borda" />
                    <Card variant="filled" size="small" title="Filled" description="Card preenchido" />
                    <Card variant="ghost" size="small" title="Ghost" description="Card fantasma" />
                </div>
            </div>
        </Card>
    );
};

// Accessibility preview component
const AccessibilityPreview = () => {
    const { computedTheme } = useTheme();
    const { SkipLinks: SkipLinksComponent } = useSkipLinks();

    return (
        <Card
            variant="outlined"
            size="medium"
            title="Preview de Acessibilidade"
            description="Teste os recursos de acessibilidade"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[4] }}>
                {/* Skip Links */}
                <div>
                    <h4 style={{ marginBottom: computedTheme.spacing.space[2] }}>
                        Skip Links (Pressione Tab para ver)
                    </h4>
                    <SkipLinksComponent />
                </div>

                {/* Focus Indicators */}
                <div>
                    <h4 style={{ marginBottom: computedTheme.spacing.space[2] }}>
                        Indicadores de Foco
                    </h4>
                    <div style={{ display: 'flex', gap: computedTheme.spacing.space[2] }}>
                        <Button variant="primary" size="small">
                            Botão com Foco
                        </Button>
                        <Input placeholder="Input com Foco" size="small" />
                    </div>
                </div>

                {/* ARIA Labels */}
                <div>
                    <h4 style={{ marginBottom: computedTheme.spacing.space[2] }}>
                        ARIA Labels
                    </h4>
                    <div style={{ display: 'flex', gap: computedTheme.spacing.space[2] }}>
                        <Button
                            variant="primary"
                            size="small"
                            ariaLabel="Botão de ação principal"
                        >
                            Ação
                        </Button>
                        <Button
                            variant="secondary"
                            size="small"
                            ariaLabel="Botão de ação secundária"
                        >
                            Ação Secundária
                        </Button>
                    </div>
                </div>

                {/* Reduced Motion */}
                <div>
                    <h4 style={{ marginBottom: computedTheme.spacing.space[2] }}>
                        Preferência de Redução de Movimento
                    </h4>
                    <div style={{ fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }}>
                        O sistema respeita a preferência de redução de movimento do usuário.
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Motion preview component
const MotionPreview = () => {
    const { computedTheme } = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);

    const startAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
    };

    return (
        <Card
            variant="outlined"
            size="medium"
            title="Preview de Motion Design"
            description="Teste as animações e micro-interações"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[4] }}>
                {/* Animation Buttons */}
                <div style={{ display: 'flex', gap: computedTheme.spacing.space[2], flexWrap: 'wrap' }}>
                    <Button variant="primary" size="small" onClick={startAnimation}>
                        Testar Animação
                    </Button>
                </div>

                {/* Animated Box */}
                {isAnimating && (
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            background: computedTheme.primaryColor[500],
                            borderRadius: computedTheme.borderRadius,
                            animation: 'scaleIn 300ms ease-out',
                        }}
                        aria-label="Elemento animado"
                    />
                )}

                {/* Motion Guidelines */}
                <div>
                    <h4 style={{ marginBottom: computedTheme.spacing.space[2] }}>
                        Diretrizes de Motion
                    </h4>
                    <div style={{ fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }}>
                        <strong>Durações:</strong> {Object.entries(motionGuidelines.durations).map(([key, value]) => (
                            <span key={key} style={{ marginRight: computedTheme.spacing.space[2] }}>
                                {key}: {value}ms
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Main configuration component
export const DesignSystemConfig = () => {
    const { theme, setTheme, toggleTheme, isDarkMode } = useTheme();
    const {
        updateTheme,
        resetTheme,
        exportTheme,
        importTheme,
        validateTheme
    } = useThemeConfig();
    const { addToast } = useToast();

    const [config, setConfig] = useState(theme);
    const [importedConfig, setImportedConfig] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setConfig(theme);
    }, [theme]);

    const handleUpdateConfig = (field, value) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        updateTheme({ [field]: value });
        addToast(`Configuração ${field} atualizada!`, { type: 'success' });
    };

    const handleReset = () => {
        setIsLoading(true);
        resetTheme();
        setTimeout(() => {
            setIsLoading(false);
            addToast('Configuração resetada!', { type: 'success' });
        }, 500);
    };

    const handleExport = () => {
        const exported = exportTheme();
        navigator.clipboard.writeText(exported);
        addToast('Configuração copiada para o clipboard!', { type: 'success' });
    };

    const handleImport = () => {
        const validation = validateTheme(JSON.parse(importedConfig));
        if (validation.valid) {
            importTheme(importedConfig);
            addToast('Configuração importada com sucesso!', { type: 'success' });
            setImportedConfig('');
        } else {
            addToast(`Erro: ${validation.errors.join(', ')}`, { type: 'error' });
        }
    };

    const handleToggleTheme = () => {
        toggleTheme();
        addToast(`Tema ${isDarkMode ? 'claro' : 'escuro'} ativado!`, { type: 'info' });
    };

    const { computedTheme } = useTheme();

    return (
        <div style={{ padding: computedTheme.spacing.space[6] }}>
            <Card
                variant="elevated"
                size="large"
                title="Design System - Configuração via Admin"
                description="Configure o Design System completo do sistema"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[6] }}>
                    {/* Theme Toggle */}
                    <Card
                        variant="outlined"
                        size="medium"
                        title="Tema"
                        description="Alterne entre modo claro e escuro"
                    >
                        <div style={{ display: 'flex', gap: computedTheme.spacing.space[3], alignItems: 'center' }}>
                            <Button
                                variant={isDarkMode ? 'primary' : 'outline'}
                                size="medium"
                                onClick={handleToggleTheme}
                                ariaLabel={isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
                            >
                                {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
                            </Button>
                            <span style={{ fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }}>
                                Modo atual: {isDarkMode ? 'Escuro' : 'Claro'}
                            </span>
                        </div>
                    </Card>

                    {/* Theme Configuration */}
                    <Card
                        variant="outlined"
                        size="medium"
                        title="Configuração do Tema"
                        description="Personalize as cores e estilos"
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: computedTheme.spacing.space[3] }}>
                            <Input
                                label="Cor Primária"
                                value={config.primaryColor}
                                onChange={(e) => handleUpdateConfig('primaryColor', e.target.value)}
                                placeholder="primary"
                            />
                            <Input
                                label="Cor Secundária"
                                value={config.secondaryColor}
                                onChange={(e) => handleUpdateConfig('secondaryColor', e.target.value)}
                                placeholder="secondary"
                            />
                            <Input
                                label="Cor de Acento"
                                value={config.accentColor}
                                onChange={(e) => handleUpdateConfig('accentColor', e.target.value)}
                                placeholder="accent"
                            />
                            <Input
                                label="Borda Arredondada"
                                value={config.borderRadius}
                                onChange={(e) => handleUpdateConfig('borderRadius', e.target.value)}
                                placeholder="DEFAULT"
                            />
                            <Input
                                label="Fonte"
                                value={config.fontFamily}
                                onChange={(e) => handleUpdateConfig('fontFamily', e.target.value)}
                                placeholder="sans"
                            />
                            <Input
                                label="Tamanho da Fonte"
                                value={config.fontSize}
                                onChange={(e) => handleUpdateConfig('fontSize', e.target.value)}
                                placeholder="base"
                            />
                        </div>
                    </Card>

                    {/* Motion Configuration */}
                    <Card
                        variant="outlined"
                        size="medium"
                        title="Configuração de Motion"
                        description="Controle as animações e micro-interações"
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: computedTheme.spacing.space[3] }}>
                            <Input
                                label="Intensidade do Motion"
                                value={config.motionIntensity}
                                onChange={(e) => handleUpdateConfig('motionIntensity', e.target.value)}
                                placeholder="medium"
                            />
                            <Input
                                label="Motion Habilitado"
                                value={config.motionEnabled ? 'true' : 'false'}
                                onChange={(e) => handleUpdateConfig('motionEnabled', e.target.value === 'true')}
                                placeholder="true"
                            />
                            <Input
                                label="Redução de Movimento"
                                value={config.reducedMotion ? 'true' : 'false'}
                                onChange={(e) => handleUpdateConfig('reducedMotion', e.target.value === 'true')}
                                placeholder="false"
                            />
                            <Input
                                label="Alto Contraste"
                                value={config.highContrast ? 'true' : 'false'}
                                onChange={(e) => handleUpdateConfig('highContrast', e.target.value === 'true')}
                                placeholder="false"
                            />
                        </div>
                    </Card>

                    {/* Accessibility Configuration */}
                    <Card
                        variant="outlined"
                        size="medium"
                        title="Configuração de Acessibilidade"
                        description="Controle os recursos de acessibilidade"
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: computedTheme.spacing.space[3] }}>
                            <Input
                                label="Indicadores de Foco"
                                value={config.focusVisible ? 'true' : 'false'}
                                onChange={(e) => handleUpdateConfig('focusVisible', e.target.value === 'true')}
                                placeholder="true"
                            />
                            <Input
                                label="Skip Links"
                                value={config.skipLinks ? 'true' : 'false'}
                                onChange={(e) => handleUpdateConfig('skipLinks', e.target.value === 'true')}
                                placeholder="true"
                            />
                        </div>
                    </Card>

                    {/* Import/Export */}
                    <Card
                        variant="outlined"
                        size="medium"
                        title="Importar/Exportar Configuração"
                        description="Gerencie a configuração do Design System"
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: computedTheme.spacing.space[3] }}>
                            <div style={{ display: 'flex', gap: computedTheme.spacing.space[2] }}>
                                <Button variant="primary" size="medium" onClick={handleExport}>
                                    Exportar Configuração
                                </Button>
                                <Button variant="secondary" size="medium" onClick={handleReset}>
                                    Resetar Configuração
                                </Button>
                            </div>

                            <Input
                                label="Importar Configuração (JSON)"
                                value={importedConfig}
                                onChange={(e) => setImportedConfig(e.target.value)}
                                placeholder='{"mode": "dark", "primaryColor": "primary"}'
                                multiline
                                rows={4}
                                fullWidth
                            />

                            <Button variant="accent" size="medium" onClick={handleImport} disabled={!importedConfig}>
                                Importar Configuração
                            </Button>
                        </div>
                    </Card>

                    {/* Previews */}
                    <ThemePreview theme={computedTheme} isDarkMode={isDarkMode} />
                    <ComponentPreview />
                    <AccessibilityPreview />
                    <MotionPreview />

                    {/* Current Configuration */}
                    <Card
                        variant="outlined"
                        size="medium"
                        title="Configuração Atual"
                        description="Visualização da configuração atual"
                    >
                        <pre
                            style={{
                                background: computedTheme.colors.background.tertiary,
                                padding: computedTheme.spacing.space[4],
                                borderRadius: computedTheme.borderRadius,
                                overflow: 'auto',
                                fontSize: computedTheme.typography.fontSize.sm,
                                fontFamily: computedTheme.typography.fontFamily.mono.join(', '),
                            }}
                        >
                            {JSON.stringify(theme, null, 2)}
                        </pre>
                    </Card>

                    {/* Loading State */}
                    {isLoading && (
                        <Loading
                            text="Processando..."
                            variant="spinner"
                            color="primary"
                            fullscreen={false}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

// Wrapper component with Toast Provider
export const DesignSystemConfigWithProviders = () => {
    return (
        <ToastProvider position="top-right" duration={3000}>
            <DesignSystemConfig />
        </ToastProvider>
    );
};

export default DesignSystemConfigWithProviders;
