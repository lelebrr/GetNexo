/**
 * Design System - Tokens de Tipografia
 * WCAG 2.2 AA+ compliant
 */

export const typography = {
    // Font Families
    fontFamily: {
        sans: [
            'Inter',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
        ],
        mono: [
            'JetBrains Mono',
            'Fira Code',
            'Consolas',
            'Monaco',
            'Courier New',
            'monospace',
        ],
        display: [
            'Poppins',
            'Inter',
            'system-ui',
            'sans-serif',
        ],
    },

    // Font Sizes (rem units)
    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
        '7xl': '4.5rem',   // 72px
    },

    // Font Weights
    fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },

    // Line Heights
    lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },

    // Letter Spacing
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },

    // Text Transform
    textTransform: {
        none: 'none',
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
    },

    // Text Decoration
    textDecoration: {
        none: 'none',
        underline: 'underline',
        overline: 'overline',
        lineThrough: 'line-through',
    },

    // Text Align
    textAlign: {
        left: 'left',
        center: 'center',
        right: 'right',
        justify: 'justify',
    },

    // Text Overflow
    textOverflow: {
        ellipsis: 'ellipsis',
        clip: 'clip',
    },

    // White Space
    whiteSpace: {
        normal: 'normal',
        nowrap: 'nowrap',
        pre: 'pre',
        preWrap: 'pre-wrap',
        preLine: 'pre-line',
    },

    // Word Break
    wordBreak: {
        normal: 'normal',
        breakAll: 'break-all',
        keepAll: 'keep-all',
        breakWord: 'break-word',
    },

    // Typography Scale (Mobile First)
    scale: {
        mobile: {
            h1: {
                fontSize: '2.25rem',
                lineHeight: '1.2',
                fontWeight: '700',
                letterSpacing: '-0.025em',
            },
            h2: {
                fontSize: '1.875rem',
                lineHeight: '1.3',
                fontWeight: '600',
                letterSpacing: '-0.025em',
            },
            h3: {
                fontSize: '1.5rem',
                lineHeight: '1.4',
                fontWeight: '600',
                letterSpacing: '-0.025em',
            },
            h4: {
                fontSize: '1.25rem',
                lineHeight: '1.4',
                fontWeight: '600',
                letterSpacing: '0',
            },
            h5: {
                fontSize: '1.125rem',
                lineHeight: '1.5',
                fontWeight: '600',
                letterSpacing: '0',
            },
            h6: {
                fontSize: '1rem',
                lineHeight: '1.5',
                fontWeight: '600',
                letterSpacing: '0',
            },
            body: {
                fontSize: '1rem',
                lineHeight: '1.6',
                fontWeight: '400',
                letterSpacing: '0',
            },
            bodySmall: {
                fontSize: '0.875rem',
                lineHeight: '1.6',
                fontWeight: '400',
                letterSpacing: '0',
            },
            caption: {
                fontSize: '0.75rem',
                lineHeight: '1.5',
                fontWeight: '400',
                letterSpacing: '0',
            },
        },
        desktop: {
            h1: {
                fontSize: '3rem',
                lineHeight: '1.1',
                fontWeight: '700',
                letterSpacing: '-0.025em',
            },
            h2: {
                fontSize: '2.25rem',
                lineHeight: '1.2',
                fontWeight: '700',
                letterSpacing: '-0.025em',
            },
            h3: {
                fontSize: '1.875rem',
                lineHeight: '1.3',
                fontWeight: '600',
                letterSpacing: '-0.025em',
            },
            h4: {
                fontSize: '1.5rem',
                lineHeight: '1.4',
                fontWeight: '600',
                letterSpacing: '0',
            },
            h5: {
                fontSize: '1.25rem',
                lineHeight: '1.4',
                fontWeight: '600',
                letterSpacing: '0',
            },
            h6: {
                fontSize: '1.125rem',
                lineHeight: '1.5',
                fontWeight: '600',
                letterSpacing: '0',
            },
            body: {
                fontSize: '1.125rem',
                lineHeight: '1.7',
                fontWeight: '400',
                letterSpacing: '0',
            },
            bodySmall: {
                fontSize: '1rem',
                lineHeight: '1.6',
                fontWeight: '400',
                letterSpacing: '0',
            },
            caption: {
                fontSize: '0.875rem',
                lineHeight: '1.5',
                fontWeight: '400',
                letterSpacing: '0',
            },
        },
    },
};

// Helper functions
export const getTypography = (element, device = 'mobile') => {
    return typography.scale[device][element] || typography.scale.mobile[element];
};

export const getFontFamily = (type = 'sans') => {
    return typography.fontFamily[type].join(', ');
};
