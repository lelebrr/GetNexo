/**
 * Design System - Index
 * Exporta todos os componentes, tokens e utilitários do Design System
 */

// Tokens
export { colors, getColor, getContrastColor } from './tokens/colors';
export { typography, getTypography, getFontFamily } from './tokens/typography';
export { spacing, getSpacing, getZIndex, getBorderRadius, getShadow, getOpacity, getTransition, getAnimation } from './tokens/spacing';

// Theme
export {
    ThemeProvider,
    ThemeContext,
    useTheme,
    useComputedTheme,
    useMotion,
    useAccessibility,
    useThemeConfig,
} from './theme/ThemeContext';

// Components - Base
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Card } from './components/Card';

// Components - Feedback
export { Loading } from './components/Loading';
export { Toast, ToastProvider, ToastNotification, useToast } from './components/Toast';

// Components - Accessibility
export {
    SkipLinks,
    useSkipLinks,
    useFocusTrap,
    useFocusVisible,
    FocusIndicator,
    AriaLiveRegion,
    useAriaAnnouncement,
    ScreenReaderOnly,
    AriaLabel,
    AriaDescribedBy,
    AriaExpanded,
    AriaHasPopup,
    AriaControls,
    AriaCurrent,
    AriaDisabled,
    AriaRequired,
    AriaInvalid,
    AriaReadonly,
    AriaHidden,
    AriaLabelFor,
    AriaRole,
    useAriaLive,
} from './components/SkipLinks';

// Motion
export {
    motionGuidelines,
    motionPrinciples,
    motionDurations,
    motionEasings,
    motionIntensities,
    microInteractions,
    useMotionPreferences,
    motionUtils,
} from './motion/motion-guidelines';

// Admin
export {
    DesignSystemConfig,
    DesignSystemConfigWithProviders,
} from './admin/DesignSystemConfig';

// Utility functions
export const designSystemUtils = {
    // Get color with theme support
    getColor: (path, theme = 'light') => {
        const keys = path.split('.');
        let value = theme === 'dark' ? colors.dark : colors;

        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                return null;
            }
        }

        return value;
    },

    // Get spacing value
    getSpacing: (value) => {
        return spacing.space[value] || spacing.space[4];
    },

    // Get typography style
    getTypography: (element, device = 'mobile') => {
        return typography.scale[device][element] || typography.scale.mobile[element];
    },

    // Get border radius
    getBorderRadius: (size = 'DEFAULT') => {
        return spacing.borderRadius[size] || spacing.borderRadius.DEFAULT;
    },

    // Get shadow
    getShadow: (size = 'DEFAULT', theme = 'light') => {
        const shadows = theme === 'dark' ? spacing.shadowDark : spacing.shadow;
        return shadows[size] || shadows.DEFAULT;
    },

    // Get transition
    getTransition: (type = 'duration', key = 'DEFAULT') => {
        return spacing.transition[type][key] || spacing.transition[type].DEFAULT;
    },

    // Get animation
    getAnimation: (name) => {
        return spacing.animation[name] || spacing.animation.fadeIn;
    },

    // Check if motion should be applied
    shouldAnimate: (reducedMotion) => !reducedMotion,

    // Get contrast color
    getContrastColor: (bgColor) => {
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#18181b' : '#fafafa';
    },

    // Create motion style
    createMotionStyle: (motion, intensity = 'medium', reducedMotion = false) => {
        if (reducedMotion) return { animation: 'none' };

        const intensityValues = motionIntensities[intensity] || motionIntensities.medium;
        const duration = motion.duration || intensityValues.duration;
        const easing = motion.easing || motionEasings.easeOut;

        return {
            animation: `${duration}ms ${easing}`,
            transform: motion.transform || 'none',
            opacity: motion.opacity || 1,
            scale: motion.scale || 1,
        };
    },

    // Create focus styles
    createFocusStyles: (color, theme = 'light') => {
        const ringColor = theme === 'dark' ? colors.dark.focus.ring : colors.focus.ring;
        const ringOffset = theme === 'dark' ? colors.dark.background.primary : colors.background.primary;

        return {
            outline: `2px solid ${ringColor}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 4px ${ringColor}20`,
        };
    },

    // Create skip link styles
    createSkipLinkStyles: (theme = 'light') => {
        const colors = theme === 'dark' ? designSystemUtils.getColor('dark') : designSystemUtils.getColor('light');

        return {
            position: 'absolute',
            top: '-100%',
            left: '0',
            padding: designSystemUtils.getSpacing(4),
            background: colors.primary[600],
            color: colors.text.inverse,
            zIndex: spacing.zIndex.max,
            textDecoration: 'none',
            borderRadius: designSystemUtils.getBorderRadius(),
            '&:focus': {
                top: '0',
                outline: '2px solid #fff',
                outlineOffset: '2px',
            },
        };
    },

    // Create ARIA attributes
    createAriaAttributes: (props) => {
        const aria = {};

        if (props.ariaLabel) aria['aria-label'] = props.ariaLabel;
        if (props.ariaDescribedBy) aria['aria-describedby'] = props.ariaDescribedBy;
        if (props.ariaExpanded !== undefined) aria['aria-expanded'] = props.ariaExpanded;
        if (props.ariaHasPopup) aria['aria-haspopup'] = props.ariaHasPopup;
        if (props.ariaInvalid !== undefined) aria['aria-invalid'] = props.ariaInvalid;
        if (props.ariaRequired !== undefined) aria['aria-required'] = props.ariaRequired;
        if (props.ariaDisabled !== undefined) aria['aria-disabled'] = props.ariaDisabled;
        if (props.ariaReadonly !== undefined) aria['aria-readonly'] = props.ariaReadonly;
        if (props.ariaHidden !== undefined) aria['aria-hidden'] = props.ariaHidden;
        if (props.role) aria['role'] = props.role;

        return aria;
    },

    // Validate theme configuration
    validateTheme: (config) => {
        const required = ['mode', 'primaryColor', 'secondaryColor', 'accentColor'];
        const missing = required.filter(key => !config[key]);

        return {
            valid: missing.length === 0,
            missing,
            errors: missing.map(key => `Missing required field: ${key}`),
        };
    },

    // Export theme configuration
    exportTheme: (theme) => {
        return JSON.stringify(theme, null, 2);
    },

    // Import theme configuration
    importTheme: (config) => {
        try {
            const parsed = typeof config === 'string' ? JSON.parse(config) : config;
            return parsed;
        } catch (e) {
            console.error('Invalid theme configuration:', e);
            return null;
        }
    },
};

// Design System constants
export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const DESIGN_SYSTEM_NAME = 'Neuro Design System';
export const DESIGN_SYSTEM_AUTHOR = 'Neuro Team';
export const DESIGN_SYSTEM_LAST_UPDATED = '2026-01-21';

// Design System documentation
export const DESIGN_SYSTEM_DOCUMENTATION = {
    title: 'Neuro Design System',
    version: DESIGN_SYSTEM_VERSION,
    author: DESIGN_SYSTEM_AUTHOR,
    lastUpdated: DESIGN_SYSTEM_LAST_UPDATED,

    description: 'Design System completo com componentes reutilizáveis padronizados, micro-interações sutis, loading states otimizados, error handling gracioso, mobile-first responsive, accessibility WCAG 2.2 AA+, dark/light mode systemico, themes customizáveis, motion design guidelines, focus visible indicators, skip links e ARIA labels completos.',

    sections: [
        {
            title: 'Tokens de Design',
            description: 'Cores, tipografia, espaçamento e bordas',
            components: ['colors', 'typography', 'spacing'],
        },
        {
            title: 'Sistema de Temas',
            description: 'Dark/Light mode e temas customizáveis',
            components: ['ThemeProvider', 'useTheme', 'useThemeConfig'],
        },
        {
            title: 'Componentes Base',
            description: 'Button, Input, Card',
            components: ['Button', 'Input', 'Card'],
        },
        {
            title: 'Componentes de Feedback',
            description: 'Loading, Toast, Error handling',
            components: ['Loading', 'Toast', 'ToastProvider'],
        },
        {
            title: 'Acessibilidade',
            description: 'Skip Links, Focus Indicators, ARIA labels',
            components: ['SkipLinks', 'FocusIndicator', 'AriaLiveRegion'],
        },
        {
            title: 'Motion Design',
            description: 'Micro-interações e animações',
            components: ['motionGuidelines', 'microInteractions', 'useMotionPreferences'],
        },
        {
            title: 'Admin Configuration',
            description: 'Configuração via Admin',
            components: ['DesignSystemConfig'],
        },
    ],

    accessibility: {
        wcag: 'WCAG 2.2 AA+',
        features: [
            'Skip Links para navegação por teclado',
            'Focus visible indicators',
            'ARIA labels completos',
            'Redução de movimento respeitada',
            'Alto contraste opcional',
            'Navegação por teclado',
            'Screen reader support',
        ],
    },

    performance: {
        targets: [
            '60fps em todas as animações',
            'Hardware acceleration',
            'Otimização para mobile-first',
            'Lazy loading de componentes',
        ],
    },

    bestPractices: [
        'Mobile-first responsive design',
        'Micro-interações sutis e não distraídas',
        'Loading states otimizados',
        'Error handling gracioso',
        'Acessibilidade total',
        'Dark/Light mode systemico',
        'Themes customizáveis via Admin',
        'Motion design guidelines',
    ],
};

// Export default
export default {
    ...designSystemUtils,
    version: DESIGN_SYSTEM_VERSION,
    name: DESIGN_SYSTEM_NAME,
    author: DESIGN_SYSTEM_AUTHOR,
    lastUpdated: DESIGN_SYSTEM_LAST_UPDATED,
    documentation: DESIGN_SYSTEM_DOCUMENTATION,
};
