/**
 * Design System - Theme Context
 * Sistema de temas dark/light mode configurável via Admin
 * WCAG 2.2 AA+ compliant
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';

// Theme configuration interface
export const ThemeConfig = {
    mode: 'light', // 'light' | 'dark' | 'auto'
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

// Theme context
const ThemeContext = createContext({
    theme: ThemeConfig,
    setTheme: () => { },
    toggleTheme: () => { },
    getThemeValue: () => { },
    isDarkMode: false,
});

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
        motionIntensity: theme.motionIntensity,
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
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

// Hook to get computed theme values
export const useComputedTheme = () => {
    const { computedTheme } = useTheme();
    return computedTheme;
};

// Hook for motion preferences
export const useMotion = () => {
    const { computedTheme } = useTheme();

    const getMotionDuration = (duration = 'DEFAULT') => {
        if (!computedTheme.motionEnabled) return '0ms';
        return computedTheme.spacing.transition.duration[duration] ||
            computedTheme.spacing.transition.duration.DEFAULT;
    };

    const getMotionTiming = (timing = 'ease') => {
        return computedTheme.spacing.transition.timing[timing] ||
            computedTheme.spacing.transition.timing.ease;
    };

    const getAnimation = (name) => {
        if (!computedTheme.motionEnabled) return { keyframes: {}, duration: '0ms', timing: 'linear' };
        return computedTheme.spacing.animation[name] || computedTheme.spacing.animation.fadeIn;
    };

    const shouldAnimate = () => {
        return computedTheme.motionEnabled && !computedTheme.reducedMotion;
    };

    return {
        getMotionDuration,
        getMotionTiming,
        getAnimation,
        shouldAnimate,
        intensity: computedTheme.motionIntensity,
        enabled: computedTheme.motionEnabled,
    };
};

// Hook for accessibility
export const useAccessibility = () => {
    const { computedTheme } = useTheme();

    const getFocusStyles = () => ({
        outline: computedTheme.focusVisible ? `2px solid ${computedTheme.colors.focus.ring}` : 'none',
        outlineOffset: computedTheme.focusVisible ? '2px' : '0',
        boxShadow: computedTheme.focusVisible
            ? `0 0 0 4px ${computedTheme.colors.focus.ring}20`
            : 'none',
    });

    const getReducedMotion = () => {
        return computedTheme.reducedMotion || !computedTheme.motionEnabled;
    };

    const getHighContrast = () => {
        return computedTheme.highContrast;
    };

    const getSkipLinkStyles = () => ({
        position: 'absolute',
        top: '-100%',
        left: '0',
        padding: computedTheme.spacing.space[4],
        background: computedTheme.colors.primary[600],
        color: computedTheme.colors.text.inverse,
        zIndex: computedTheme.spacing.zIndex.max,
        textDecoration: 'none',
        borderRadius: computedTheme.borderRadius,
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
