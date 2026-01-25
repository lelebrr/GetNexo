/**
 * Design System - Tokens de Cores
 * WCAG 2.2 AA+ compliant
 */

const baseColors = {
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        DEFAULT: '#3b82f6',
    },

    secondary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
        DEFAULT: '#8b5cf6',
    },

    accent: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        DEFAULT: '#10b981',
    },

    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        DEFAULT: '#22c55e',
    },

    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        DEFAULT: '#f59e0b',
    },

    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        DEFAULT: '#ef4444',
    },

    info: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        DEFAULT: '#3b82f6',
    },

    neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        DEFAULT: '#71717a',
    },
};

export const colors = {
    ...baseColors,

    // Light Mode Specifics
    background: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f4f4f5',
        inverse: '#18181b',
    },
    text: {
        primary: '#18181b',
        secondary: '#52525b',
        tertiary: '#71717a',
        inverse: '#ffffff',
        disabled: '#a1a1aa',
    },
    border: {
        light: '#e4e4e7',
        DEFAULT: '#d4d4d8',
        dark: '#a1a1aa',
    },
    focus: {
        ring: baseColors.primary[500],
        ringOffset: '#ffffff',
        ringOffsetDark: '#09090b',
    },
    overlay: {
        light: 'rgba(0, 0, 0, 0.1)',
        medium: 'rgba(0, 0, 0, 0.3)',
        dark: 'rgba(0, 0, 0, 0.5)',
        lightDark: 'rgba(255, 255, 255, 0.1)',
        mediumDark: 'rgba(255, 255, 255, 0.3)',
        darkDark: 'rgba(255, 255, 255, 0.5)',
    },
    gradients: {
        primary: `linear-gradient(135deg, ${baseColors.primary[500]} 0%, ${baseColors.secondary[500]} 100%)`,
        secondary: `linear-gradient(135deg, ${baseColors.secondary[500]} 0%, #ec4899 100%)`,
        accent: `linear-gradient(135deg, ${baseColors.accent[500]} 0%, ${baseColors.primary[500]} 100%)`,
        dark: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    },

    // Dark Mode Colors
    dark: {
        ...baseColors, // Inherit all semantic colors

        background: {
            primary: '#09090b',
            secondary: '#18181b',
            tertiary: '#27272a',
            inverse: '#ffffff',
        },

        text: {
            primary: '#fafafa',
            secondary: '#d4d4d8',
            tertiary: '#a1a1aa',
            inverse: '#18181b',
            disabled: '#52525b',
        },

        border: {
            light: '#27272a',
            DEFAULT: '#3f3f46',
            dark: '#52525b',
        },

        neutral: {
            50: '#18181b',
            100: '#27272a',
            200: '#3f3f46',
            300: '#52525b',
            400: '#71717a',
            500: '#a1a1aa',
            600: '#d4d4d8',
            700: '#e4e4e7',
            800: '#f4f4f5',
            900: '#fafafa',
        },
    },
};

export const getColor = (path, theme = 'light') => {
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
};

export const getContrastColor = (bgColor) => {
    // WCAG 2.1 compliant contrast calculation
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Convert to linear RGB
    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    // Calculate relative luminance
    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

    return luminance > 0.179 ? colors.text.primary : colors.text.inverse;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1, color2) => {
    const lum1 = getRelativeLuminance(color1);
    const lum2 = getRelativeLuminance(color2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
};

// Get relative luminance for a color
export const getRelativeLuminance = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

// Check if contrast meets WCAG AA standards
export const meetsWCAGAA = (bgColor, textColor, isLargeText = false) => {
    const ratio = getContrastRatio(bgColor, textColor);
    const minRatio = isLargeText ? 3 : 4.5; // AA standard
    return ratio >= minRatio;
};

// Check if contrast meets WCAG AAA standards
export const meetsWCAGAAA = (bgColor, textColor, isLargeText = false) => {
    const ratio = getContrastRatio(bgColor, textColor);
    const minRatio = isLargeText ? 4.5 : 7; // AAA standard
    return ratio >= minRatio;
};
