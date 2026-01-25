/**
 * Design System - Theme Context
 * Sistema de temas dark/light mode configurável via Admin
 * WCAG 2.2 AA+ compliant
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';

console.log('🛡️ Nexus ThemeContext Initializing...');

// Theme configuration interface
export const ThemeConfig = {
    mode: 'dark', // 'light' | 'dark' | 'auto'
    primaryColor: 'primary',
    secondaryColor: 'secondary',
    accentColor: 'accent',
    borderRadius: 'DEFAULT',
    fontFamily: 'sans',
    fontSize: 'base',
    motionEnabled: true,
    motionIntensity: 'medium', // 'low' | 'medium' | 'high'
    focusVisible: true,
    reducedMotion: false,
    highContrast: false,
    customTheme: {},
};

const defaultComputedTheme = {
    colors: colors.dark,
    typography: typography,
    spacing: spacing,
    mode: 'dark',
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    borderRadius: spacing.borderRadius.DEFAULT,
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    motionEnabled: true,
    motionIntensity: 'medium',
    focusVisible: true,
    highContrast: false,
    customTheme: {},
};

// Theme context
export const ThemeContext = createContext({
    theme: ThemeConfig,
    setTheme: () => { },
    toggleTheme: () => { },
    getThemeValue: () => { },
    isDarkMode: true,
    computedTheme: defaultComputedTheme
});

// Helper function to get safe computed theme
const getSafeComputedTheme = (computedTheme) => {
    return computedTheme || defaultComputedTheme;
};

// Theme provider component
export const ThemeProvider = ({ children, initialTheme = ThemeConfig }) => {
    const [theme, setTheme] = useState(() => {
        // Load from localStorage or use initial theme
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('design-system-theme');
            if (saved) {
                try {
                    return { ...ThemeConfig, ...JSON.parse(saved) };
                } catch (e) {
                    return initialTheme;
                }
            }
        }
        return initialTheme;
    });

    // Detect system preference
    useEffect(() => {
        if (theme.mode === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                setTheme(prev => ({ ...prev, isDarkMode: e.matches }));
            };

            handleChange(mediaQuery);
            mediaQuery.addEventListener('change', handleChange);

            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme.mode]);

    // Save to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('design-system-theme', JSON.stringify(theme));
        }
    }, [theme]);

    // Toggle theme
    const toggleTheme = () => {
        setTheme(prev => ({
            ...prev,
            mode: prev.mode === 'light' ? 'dark' : 'light',
            isDarkMode: prev.mode === 'light',
        }));
    };

    // Get theme value with fallback
    const getThemeValue = (path, defaultValue = null) => {
        const keys = path.split('.');
        let value = theme;

        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }

        return value;
    };

    // Check if dark mode
    const isDarkMode = theme.mode === 'dark' ||
        (theme.mode === 'auto' && theme.isDarkMode);

    // Get computed theme values
    const computedTheme = {
        colors: isDarkMode ? colors.dark : colors,
        typography: typography,
        spacing: spacing,
        mode: isDarkMode ? 'dark' : 'light',
        primaryColor: colors[theme.primaryColor] || colors.primary,
        secondaryColor: colors[theme.secondaryColor] || colors.secondary,
        accentColor: colors[theme.accentColor] || colors.accent,
        borderRadius: spacing.borderRadius[theme.borderRadius] || spacing.borderRadius.DEFAULT,
        fontFamily: typography.fontFamily[theme.fontFamily] || typography.fontFamily.sans,
        fontSize: typography.fontSize[theme.fontSize] || typography.fontSize.base,
        motionEnabled: theme.motionEnabled && !theme.reducedMotion,
        motionIntensity: theme.motionIntensity || 'medium',
        focusVisible: theme.focusVisible,
        highContrast: theme.highContrast,
        customTheme: theme.customTheme,
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
                getThemeValue,
                isDarkMode,
                computedTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// Hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        console.warn('❌ useTheme used outside ThemeProvider. Falling back to default values.');
        return {
            theme: ThemeConfig,
            setTheme: () => { },
            toggleTheme: () => { },
            getThemeValue: () => { },
            isDarkMode: true,
            computedTheme: defaultComputedTheme
        };
    }
    return context;
};

// Hook to get computed theme values
export const useComputedTheme = () => {
    const context = useTheme();
    return context.computedTheme || defaultComputedTheme;
};

// Hook for motion preferences
export const useMotion = () => {
    const context = useTheme();
    const computedTheme = context.computedTheme || defaultComputedTheme;

    const safeComputedTheme = computedTheme || {
        motionEnabled: true,
        motionIntensity: 'medium',
        reducedMotion: false,
        spacing: {
            transition: {
                duration: { DEFAULT: '200ms', fast: '150ms', fastest: '75ms', slow: '300ms', slower: '500ms', slowest: '700ms' },
                timing: { ease: 'cubic-bezier(0.4, 0, 0.2, 1)', easeIn: 'cubic-bezier(0.4, 0, 1, 1)', easeOut: 'cubic-bezier(0, 0, 0.2, 1)', easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', linear: 'linear' },
            },
            animation: {
                fadeIn: { keyframes: { from: { opacity: 0 }, to: { opacity: 1 } }, duration: '200ms', timing: 'ease-out' },
                fadeOut: { keyframes: { from: { opacity: 1 }, to: { opacity: 0 } }, duration: '200ms', timing: 'ease-in' },
                slideIn: { keyframes: { from: { transform: 'translateY(-10px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } }, duration: '300ms', timing: 'ease-out' },
                slideOut: { keyframes: { from: { transform: 'translateY(0)', opacity: 1 }, to: { transform: 'translateY(-10px)', opacity: 0 } }, duration: '200ms', timing: 'ease-in' },
                scaleIn: { keyframes: { from: { transform: 'scale(0.95)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } }, duration: '200ms', timing: 'ease-out' },
                scaleOut: { keyframes: { from: { transform: 'scale(1)', opacity: 1 }, to: { transform: 'scale(0.95)', opacity: 0 } }, duration: '150ms', timing: 'ease-in' },
                shake: { keyframes: { '0%, 100%': { transform: 'translateX(0)' }, '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' }, '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' } }, duration: '400ms', timing: 'ease-in-out' },
                pulse: { keyframes: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } }, duration: '2000ms', timing: 'ease-in-out' },
                bounce: { keyframes: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-25%)' } }, duration: '1000ms', timing: 'cubic-bezier(0.280, 0.840, 0.420, 1)' },
            },
        },
    };

    const getMotionDuration = (duration = 'DEFAULT') => {
        if (!safeComputedTheme.motionEnabled) return '0ms';
        return safeComputedTheme.spacing?.transition?.duration?.[duration] ||
            safeComputedTheme.spacing?.transition?.duration?.DEFAULT || '200ms';
    };

    const getMotionTiming = (timing = 'ease') => {
        return safeComputedTheme.spacing?.transition?.timing?.[timing] ||
            safeComputedTheme.spacing?.transition?.timing?.ease || 'ease';
    };

    const getAnimation = (name) => {
        if (!safeComputedTheme.motionEnabled) return { keyframes: {}, duration: '0ms', timing: 'linear' };
        return safeComputedTheme.spacing?.animation?.[name] || safeComputedTheme.spacing?.animation?.fadeIn || { keyframes: {}, duration: '0ms', timing: 'linear' };
    };

    const shouldAnimate = () => {
        return !!safeComputedTheme.motionEnabled && !safeComputedTheme.reducedMotion;
    };

    return {
        getMotionDuration,
        getMotionTiming,
        getAnimation,
        shouldAnimate,
        intensity: safeComputedTheme.motionIntensity,
        enabled: safeComputedTheme.motionEnabled,
    };
};

// Hook for accessibility
export const useAccessibility = () => {
    const context = useTheme();
    const computedTheme = context.computedTheme || defaultComputedTheme;

    const getFocusStyles = () => ({
        outline: computedTheme.focusVisible ? `2px solid ${computedTheme.colors?.focus?.ring || '#00f7ff'}` : 'none',
        outlineOffset: computedTheme.focusVisible ? '2px' : '0',
        boxShadow: computedTheme.focusVisible
            ? `0 0 0 4px ${computedTheme.colors?.focus?.ring || '#00f7ff'}20`
            : 'none',
    });

    const getReducedMotion = () => {
        return !!computedTheme.reducedMotion || !computedTheme.motionEnabled;
    };

    const getHighContrast = () => {
        return !!computedTheme.highContrast;
    };

    const getSkipLinkStyles = () => ({
        position: 'absolute',
        top: '-100%',
        left: '0',
        padding: computedTheme.spacing?.space?.[4] || '1rem',
        background: computedTheme.colors?.primary?.[600] || '#00f7ff',
        color: computedTheme.colors?.text?.inverse || '#000',
        zIndex: computedTheme.spacing?.zIndex?.max || 9999,
        textDecoration: 'none',
        borderRadius: computedTheme.borderRadius || '4px',
        '&:focus': {
            top: '0',
            outline: '2px solid #fff',
            outlineOffset: '2px',
        },
    });

    return {
        getFocusStyles,
        getReducedMotion,
        getHighContrast,
        getSkipLinkStyles,
    };
};

// Theme configuration hook for Admin
export const useThemeConfig = () => {
    const { theme, setTheme } = useTheme();

    const updateTheme = (updates) => {
        setTheme(prev => ({ ...prev, ...updates }));
    };

    const resetTheme = () => {
        setTheme(ThemeConfig);
    };

    const exportTheme = () => {
        return JSON.stringify(theme, null, 2);
    };

    const importTheme = (config) => {
        try {
            const parsed = typeof config === 'string' ? JSON.parse(config) : config;
            setTheme({ ...ThemeConfig, ...parsed });
            return true;
        } catch (e) {
            console.error('Invalid theme configuration:', e);
            return false;
        }
    };

    const validateTheme = (config) => {
        const required = ['mode', 'primaryColor', 'secondaryColor', 'accentColor'];
        const missing = required.filter(key => !config[key]);
        return {
            valid: missing.length === 0,
            missing,
            errors: missing.map(key => `Missing required field: ${key}`),
        };
    };

    return {
        theme,
        updateTheme,
        resetTheme,
        exportTheme,
        importTheme,
        validateTheme,
    };
};

export default {
    ThemeProvider,
    ThemeContext,
    useTheme,
    useComputedTheme,
    useMotion,
    useAccessibility,
    useThemeConfig,
};
