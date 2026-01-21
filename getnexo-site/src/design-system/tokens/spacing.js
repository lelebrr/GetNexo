/**
 * Design System - Tokens de Espaçamento
 * WCAG 2.2 AA+ compliant
 */

export const spacing = {
    // Base unit (8px)
    base: 8,

    // Spacing scale (rem units)
    space: {
        0: '0',
        0.5: '0.125rem',  // 2px
        1: '0.25rem',     // 4px
        1.5: '0.375rem',  // 6px
        2: '0.5rem',      // 8px
        2.5: '0.625rem',  // 10px
        3: '0.75rem',     // 12px
        3.5: '0.875rem',  // 14px
        4: '1rem',        // 16px
        5: '1.25rem',     // 20px
        6: '1.5rem',      // 24px
        7: '1.75rem',     // 28px
        8: '2rem',        // 32px
        9: '2.25rem',     // 36px
        10: '2.5rem',     // 40px
        11: '2.75rem',    // 44px
        12: '3rem',       // 48px
        14: '3.5rem',     // 56px
        16: '4rem',       // 64px
        20: '5rem',       // 80px
        24: '6rem',       // 96px
        28: '7rem',       // 112px
        32: '8rem',       // 128px
        36: '9rem',       // 144px
        40: '10rem',      // 160px
        44: '11rem',      // 176px
        48: '12rem',      // 192px
        52: '13rem',      // 208px
        56: '14rem',      // 224px
        60: '15rem',      // 240px
        64: '16rem',      // 256px
        72: '18rem',      // 288px
        80: '20rem',      // 320px
        96: '24rem',      // 384px,
    },

    // Layout spacing
    layout: {
        container: {
            mobile: '1rem',
            tablet: '1.5rem',
            desktop: '2rem',
            wide: '3rem',
        },
        section: {
            mobile: '3rem',
            desktop: '5rem',
        },
        grid: {
            gap: {
                mobile: '1rem',
                tablet: '1.5rem',
                desktop: '2rem',
            },
            column: {
                mobile: '1rem',
                tablet: '1.5rem',
                desktop: '2rem',
            },
        },
    },

    // Component spacing
    component: {
        button: {
            padding: {
                x: '1rem',
                y: '0.75rem',
            },
            gap: '0.5rem',
        },
        input: {
            padding: {
                x: '0.875rem',
                y: '0.625rem',
            },
        },
        card: {
            padding: {
                mobile: '1.25rem',
                desktop: '1.5rem',
            },
            gap: '1rem',
        },
        modal: {
            padding: {
                mobile: '1.5rem',
                desktop: '2rem',
            },
        },
        drawer: {
            padding: {
                mobile: '1rem',
                desktop: '1.5rem',
            },
        },
    },

    // Z-index scale
    zIndex: {
        hide: -1,
        auto: 'auto',
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        toast: 1080,
        notification: 1090,
        overlay: 1100,
        max: 9999,
    },

    // Border radius
    borderRadius: {
        none: '0',
        sm: '0.125rem',   // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
        full: '9999px',
    },

    // Border width
    borderWidth: {
        0: '0',
        DEFAULT: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
    },

    // Shadow
    shadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
    },

    // Dark mode shadows
    shadowDark: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        none: 'none',
    },

    // Opacity
    opacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        25: '0.25',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        75: '0.75',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1',
    },

    // Transition
    transition: {
        duration: {
            fastest: '75ms',
            fast: '150ms',
            DEFAULT: '200ms',
            slow: '300ms',
            slower: '500ms',
            slowest: '700ms',
        },
        timing: {
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            linear: 'linear',
        },
        property: {
            all: 'all',
            opacity: 'opacity',
            transform: 'transform',
            color: 'color',
            background: 'background',
            border: 'border',
            shadow: 'box-shadow',
        },
    },

    // Animation
    animation: {
        fadeIn: {
            keyframes: {
                from: { opacity: 0 },
                to: { opacity: 1 },
            },
            duration: '200ms',
            timing: 'ease-out',
        },
        fadeOut: {
            keyframes: {
                from: { opacity: 1 },
                to: { opacity: 0 },
            },
            duration: '200ms',
            timing: 'ease-in',
        },
        slideIn: {
            keyframes: {
                from: { transform: 'translateY(-10px)', opacity: 0 },
                to: { transform: 'translateY(0)', opacity: 1 },
            },
            duration: '300ms',
            timing: 'ease-out',
        },
        slideOut: {
            keyframes: {
                from: { transform: 'translateY(0)', opacity: 1 },
                to: { transform: 'translateY(-10px)', opacity: 0 },
            },
            duration: '200ms',
            timing: 'ease-in',
        },
        scaleIn: {
            keyframes: {
                from: { transform: 'scale(0.95)', opacity: 0 },
                to: { transform: 'scale(1)', opacity: 1 },
            },
            duration: '200ms',
            timing: 'ease-out',
        },
        scaleOut: {
            keyframes: {
                from: { transform: 'scale(1)', opacity: 1 },
                to: { transform: 'scale(0.95)', opacity: 0 },
            },
            duration: '150ms',
            timing: 'ease-in',
        },
        shake: {
            keyframes: {
                '0%, 100%': { transform: 'translateX(0)' },
                '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
                '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
            },
            duration: '400ms',
            timing: 'ease-in-out',
        },
        pulse: {
            keyframes: {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
            },
            duration: '2000ms',
            timing: 'ease-in-out',
        },
        bounce: {
            keyframes: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-25%)' },
            },
            duration: '1000ms',
            timing: 'cubic-bezier(0.280, 0.840, 0.420, 1)',
        },
    },
};

// Helper functions
export const getSpacing = (value) => {
    return spacing.space[value] || spacing.space[4];
};

export const getZIndex = (layer) => {
    return spacing.zIndex[layer] || spacing.zIndex.base;
};

export const getBorderRadius = (size = 'DEFAULT') => {
    return spacing.borderRadius[size] || spacing.borderRadius.DEFAULT;
};

export const getShadow = (size = 'DEFAULT', theme = 'light') => {
    const shadows = theme === 'dark' ? spacing.shadowDark : spacing.shadow;
    return shadows[size] || shadows.DEFAULT;
};

export const getOpacity = (value) => {
    return spacing.opacity[value] || spacing.opacity[100];
};

export const getTransition = (type = 'duration', key = 'DEFAULT') => {
    return spacing.transition[type][key] || spacing.transition[type].DEFAULT;
};

export const getAnimation = (name) => {
    return spacing.animation[name] || spacing.animation.fadeIn;
};
