/**
 * Design System - Motion Design Guidelines
 * Micro-interações sutis e animações acessíveis
 * WCAG 2.2 AA+ compliant
 */

import { spacing } from '../tokens/spacing';

// Motion principles
export const motionPrinciples = {
    purposeful: 'Todas as animações devem ter um propósito claro e funcional',
    subtle: 'Animações devem ser sutis e não distrair o usuário',
    performant: 'Animações devem ser otimizadas para performance (60fps)',
    accessible: 'Animações devem respeitar preferências de redução de movimento',
    consistent: 'Animações devem seguir padrões consistentes em todo o sistema',
};

// Motion durations (em milissegundos)
export const motionDurations = {
    instant: 0,
    fastest: 75,
    fast: 150,
    default: 200,
    slow: 300,
    slower: 500,
    slowest: 700,
};

// Motion easings (curvas de animação)
export const motionEasings = {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// Motion intensities
export const motionIntensities = {
    low: {
        duration: motionDurations.fast,
        scale: 1.02,
        translate: 2,
        opacity: 0.1,
    },
    medium: {
        duration: motionDurations.default,
        scale: 1.05,
        translate: 4,
        opacity: 0.2,
    },
    high: {
        duration: motionDurations.slow,
        scale: 1.1,
        translate: 8,
        opacity: 0.3,
    },
};

// Micro-interactions patterns
export const microInteractions = {
    // Button interactions
    button: {
        hover: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        active: {
            duration: motionDurations.fastest,
            easing: motionEasings.easeIn,
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        focus: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            outline: '2px solid currentColor',
            outlineOffset: '2px',
        },
        disabled: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            opacity: 0.6,
            cursor: 'not-allowed',
        },
    },

    // Input interactions
    input: {
        focus: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            borderColor: 'currentColor',
            boxShadow: '0 0 0 3px currentColor',
        },
        error: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            borderColor: 'currentColor',
            animation: 'shake',
        },
        success: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            borderColor: 'currentColor',
        },
    },

    // Card interactions
    card: {
        hover: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
        active: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            transform: 'translateY(0)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        focus: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            outline: '2px solid currentColor',
            outlineOffset: '2px',
        },
    },

    // Modal interactions
    modal: {
        enter: {
            duration: motionDurations.slow,
            easing: motionEasings.easeOut,
            opacity: 0,
            scale: 0.95,
        },
        exit: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0,
            scale: 0.95,
        },
        backdrop: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: 0,
        },
    },

    // Drawer interactions
    drawer: {
        enter: {
            duration: motionDurations.slow,
            easing: motionEasings.easeOut,
            translateX: '-100%',
        },
        exit: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            translateX: '-100%',
        },
    },

    // Tooltip interactions
    tooltip: {
        enter: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            opacity: 0,
            translateY: 4,
        },
        exit: {
            duration: motionDurations.fastest,
            easing: motionEasings.easeIn,
            opacity: 0,
            translateY: 4,
        },
    },

    // Dropdown interactions
    dropdown: {
        enter: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: 0,
            translateY: -8,
        },
        exit: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0,
            translateY: -8,
        },
    },

    // Toast interactions
    toast: {
        enter: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: 0,
            translateX: 24,
        },
        exit: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0,
            translateX: 24,
        },
    },

    // Loading interactions
    loading: {
        spinner: {
            duration: motionDurations.slowest,
            easing: motionEasings.linear,
            rotation: '360deg',
        },
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.5, 1, 0.5],
        },
        bounce: {
            duration: motionDurations.slow,
            easing: motionEasings.bounce,
            translateY: [-25, 0],
        },
    },

    // List interactions
    list: {
        item: {
            enter: {
                duration: motionDurations.default,
                easing: motionEasings.easeOut,
                opacity: 0,
                translateX: -16,
            },
            exit: {
                duration: motionDurations.fast,
                easing: motionEasings.easeIn,
                opacity: 0,
                translateX: 16,
            },
        },
        reorder: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: 1.02,
            zIndex: 1000,
        },
    },

    // Progress interactions
    progress: {
        fill: {
            duration: motionDurations.slow,
            easing: motionEasings.easeOut,
            scaleX: [0, 1],
        },
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.5, 1, 0.5],
        },
    },

    // Badge interactions
    badge: {
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            scale: [1, 1.1, 1],
        },
        bounce: {
            duration: motionDurations.slow,
            easing: motionEasings.bounce,
            scale: [1, 1.2, 1],
        },
    },

    // Icon interactions
    icon: {
        spin: {
            duration: motionDurations.slow,
            easing: motionEasings.linear,
            rotation: '360deg',
        },
        bounce: {
            duration: motionDurations.slow,
            easing: motionEasings.bounce,
            translateY: [-4, 0],
        },
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            scale: [1, 1.1, 1],
        },
    },

    // Notification interactions
    notification: {
        enter: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: 0,
            translateY: -16,
        },
        exit: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0,
            translateY: -16,
        },
    },

    // Skeleton interactions
    skeleton: {
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.3, 0.6, 0.3],
        },
    },

    // Drag interactions
    drag: {
        start: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            scale: 1.05,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        end: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: 1,
            boxShadow: 'none',
        },
    },

    // Scroll interactions
    scroll: {
        reveal: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: 0,
            translateY: 24,
        },
        hide: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0,
            translateY: -24,
        },
    },

    // Focus interactions
    focus: {
        ring: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            boxShadow: '0 0 0 3px currentColor',
        },
        outline: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            outline: '2px solid currentColor',
            outlineOffset: '2px',
        },
    },

    // Selection interactions
    selection: {
        check: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [0, 1.2, 1],
        },
        uncheck: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.8, 0],
        },
    },

    // Toggle interactions
    toggle: {
        on: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            translateX: 16,
        },
        off: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            translateX: 0,
        },
    },

    // Accordion interactions
    accordion: {
        open: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            height: 'auto',
            opacity: 1,
        },
        close: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            height: 0,
            opacity: 0,
        },
    },

    // Tab interactions
    tab: {
        activate: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: 1,
            translateY: 0,
        },
        deactivate: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0,
            translateY: 4,
        },
    },

    // Pagination interactions
    pagination: {
        pageChange: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            translateX: [16, 0],
        },
    },

    // Filter interactions
    filter: {
        apply: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            scale: [0.95, 1],
        },
        clear: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: [1, 0],
            scale: [1, 0.95],
        },
    },

    // Sort interactions
    sort: {
        ascending: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            rotate: '0deg',
        },
        descending: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            rotate: '180deg',
        },
    },

    // Filter chip interactions
    chip: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [0, 1],
            opacity: [0, 1],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0],
            opacity: [1, 0],
        },
    },

    // Search interactions
    search: {
        focus: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.02, 1],
        },
        clear: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: [1, 0],
            scale: [1, 0.8],
        },
    },

    // Filter interactions
    filterChip: {
        active: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.05, 1],
        },
        inactive: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.95, 1],
        },
    },

    // Rating interactions
    rating: {
        hover: {
            duration: motionDurations.fast,
            easing: motionEasings.easeOut,
            scale: [1, 1.2, 1],
        },
        select: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.3, 1],
        },
    },

    // Progress bar interactions
    progressBar: {
        fill: {
            duration: motionDurations.slow,
            easing: motionEasings.easeOut,
            scaleX: [0, 1],
        },
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.5, 1, 0.5],
        },
    },

    // Slider interactions
    slider: {
        thumb: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.2, 1],
        },
        track: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scaleX: [0, 1],
        },
    },

    // Upload interactions
    upload: {
        start: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            translateY: [-8, 0],
        },
        complete: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.1, 1],
        },
        error: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            shake: true,
        },
    },

    // Download interactions
    download: {
        start: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            translateY: [8, 0],
        },
        complete: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.1, 1],
        },
    },

    // Copy interactions
    copy: {
        success: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.2, 1],
        },
    },

    // Share interactions
    share: {
        open: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            scale: [0.9, 1],
        },
        close: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: [1, 0],
            scale: [1, 0.9],
        },
    },

    // Bookmark interactions
    bookmark: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.3, 1],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.7, 0],
        },
    },

    // Like interactions
    like: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.3, 1],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.7, 0],
        },
    },

    // Follow interactions
    follow: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.1, 1],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.9, 1],
        },
    },

    // Subscribe interactions
    subscribe: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.1, 1],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.9, 1],
        },
    },

    // Notification interactions
    notificationBadge: {
        appear: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [0, 1.2, 1],
        },
        disappear: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0, 0],
        },
    },

    // Status interactions
    status: {
        online: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.5, 1, 0.5],
        },
        offline: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: 0.5,
        },
    },

    // Typing indicator interactions
    typing: {
        dot: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.3, 1, 0.3],
        },
    },

    // Loading skeleton interactions
    loadingSkeleton: {
        pulse: {
            duration: motionDurations.slow,
            easing: motionEasings.easeInOut,
            opacity: [0.3, 0.6, 0.3],
        },
    },

    // Progress indicator interactions
    progressIndicator: {
        complete: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.2, 1],
        },
        error: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            shake: true,
        },
    },

    // Step indicator interactions
    stepIndicator: {
        complete: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.2, 1],
        },
        active: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.1, 1],
        },
    },

    // Timeline interactions
    timeline: {
        item: {
            enter: {
                duration: motionDurations.default,
                easing: motionEasings.easeOut,
                opacity: 0,
                translateX: -16,
            },
            exit: {
                duration: motionDurations.fast,
                easing: motionEasings.easeIn,
                opacity: 0,
                translateX: 16,
            },
        },
    },

    // Activity feed interactions
    activityFeed: {
        item: {
            enter: {
                duration: motionDurations.default,
                easing: motionEasings.easeOut,
                opacity: 0,
                translateY: 16,
            },
            exit: {
                duration: motionDurations.fast,
                easing: motionEasings.easeIn,
                opacity: 0,
                translateY: -16,
            },
        },
    },

    // Comment interactions
    comment: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            translateY: [8, 0],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            opacity: [1, 0],
            translateY: [0, -8],
        },
    },

    // Reaction interactions
    reaction: {
        add: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.3, 1],
        },
        remove: {
            duration: motionDurations.fast,
            easing: motionEasings.easeIn,
            scale: [1, 0.7, 0],
        },
    },

    // Poll interactions
    poll: {
        vote: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.1, 1],
        },
        result: {
            duration: motionDurations.slow,
            easing: motionEasings.easeOut,
            scaleX: [0, 1],
        },
    },

    // Quiz interactions
    quiz: {
        answer: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.05, 1],
        },
        correct: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            scale: [1, 1.2, 1],
        },
        incorrect: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            shake: true,
        },
    },

    // Game interactions
    game: {
        start: {
            duration: motionDurations.default,
            easing: motionEasings.easeOut,
            opacity: [0, 1],
            scale: [0.9, 1],
        },
        end: {
            duration: motionDurations.default,
            easing: motionEasings.easeIn,
            opacity: [1, 0],
            scale: [1, 0.9],
        },
    },

    // Animation keyframes
    keyframes: {
        spin: {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
        },
        pulse: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
        },
        bounce: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-25%)' },
        },
        shake: {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        wave: {
            '0%, 100%': { transform: 'scaleY(0.5)' },
            '50%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
        fadeOut: {
            from: { opacity: 1 },
            to: { opacity: 0 },
        },
        slideIn: {
            from: { transform: 'translateY(-10px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
        },
        slideOut: {
            from: { transform: 'translateY(0)', opacity: 1 },
            to: { transform: 'translateY(-10px)', opacity: 0 },
        },
        scaleIn: {
            from: { transform: 'scale(0.95)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
        },
        scaleOut: {
            from: { transform: 'scale(1)', opacity: 1 },
            to: { transform: 'scale(0.95)', opacity: 0 },
        },
    },
};

// Motion preferences hook
export const useMotionPreferences = () => {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setReducedMotion(mediaQuery.matches);

            const handleChange = (e) => {
                setReducedMotion(e.matches);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    return { reducedMotion };
};

// Motion utility functions
export const motionUtils = {
    // Check if motion should be applied
    shouldAnimate: (reducedMotion) => !reducedMotion,

    // Get animation duration based on preferences
    getDuration: (duration, reducedMotion) => {
        if (reducedMotion) return 0;
        return motionDurations[duration] || motionDurations.default;
    },

    // Get easing based on preferences
    getEasing: (easing, reducedMotion) => {
        if (reducedMotion) return motionEasings.linear;
        return motionEasings[easing] || motionEasings.ease;
    },

    // Create animation style
    createAnimation: (name, duration, easing, reducedMotion) => {
        if (reducedMotion) return 'none';
        return `${motionUtils.getDuration(duration, reducedMotion)}ms ${motionUtils.getEasing(easing, reducedMotion)}`;
    },

    // Create transform style
    createTransform: (transform, intensity = 'medium') => {
        const intensityValues = motionIntensities[intensity] || motionIntensities.medium;
        return transform.replace(/translateX\(([^)]+)\)/g, `translateX(${intensityValues.translate}px)`);
    },

    // Create opacity style
    createOpacity: (opacity, intensity = 'medium') => {
        const intensityValues = motionIntensities[intensity] || motionIntensities.medium;
        return opacity.replace(/opacity\(([^)]+)\)/g, `opacity(${intensityValues.opacity})`);
    },

    // Create scale style
    createScale: (scale, intensity = 'medium') => {
        const intensityValues = motionIntensities[intensity] || motionIntensities.medium;
        return scale.replace(/scale\(([^)]+)\)/g, `scale(${intensityValues.scale})`);
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

    // Create keyframes
    createKeyframes: (keyframes) => {
        return Object.entries(keyframes).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    },

    // Create animation name
    createAnimationName: (name) => {
        return `animation-${name}`;
    },

    // Create animation CSS
    createAnimationCSS: (name, keyframes, duration, easing) => {
        return `
      @keyframes ${name} {
        ${Object.entries(keyframes).map(([key, value]) => {
            const styles = Object.entries(value).map(([prop, val]) => `${prop}: ${val};`).join(' ');
            return `${key} { ${styles} }`;
        }).join(' ')}
      }
      
      .${name} {
        animation: ${duration}ms ${easing} infinite;
      }
    `;
    },

    // Create motion config
    createMotionConfig: (config) => {
        return {
            duration: config.duration || motionDurations.default,
            easing: config.easing || motionEasings.easeOut,
            transform: config.transform || 'none',
            opacity: config.opacity || 1,
            scale: config.scale || 1,
            delay: config.delay || 0,
            repeat: config.repeat || 1,
            direction: config.direction || 'normal',
            fillMode: config.fillMode || 'forwards',
        };
    },

    // Create motion style string
    createMotionStyleString: (config) => {
        const { duration, easing, transform, opacity, scale, delay, repeat, direction, fillMode } = config;

        return `
      animation: ${duration}ms ${easing} ${repeat} ${direction} ${fillMode};
      ${transform ? `transform: ${transform};` : ''}
      ${opacity !== undefined ? `opacity: ${opacity};` : ''}
      ${scale !== undefined ? `scale: ${scale};` : ''}
      ${delay ? `animation-delay: ${delay}ms;` : ''}
    `;
    },

    // Create motion hook
    createMotionHook: (config) => {
        const [isAnimating, setIsAnimating] = useState(false);
        const [isComplete, setIsComplete] = useState(false);

        useEffect(() => {
            if (config.autoStart) {
                setIsAnimating(true);
                const timer = setTimeout(() => {
                    setIsAnimating(false);
                    setIsComplete(true);
                }, config.duration || motionDurations.default);
                return () => clearTimeout(timer);
            }
        }, [config.autoStart, config.duration]);

        const start = () => {
            setIsAnimating(true);
            setIsComplete(false);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setIsComplete(true);
            }, config.duration || motionDurations.default);
            return () => clearTimeout(timer);
        };

        const reset = () => {
            setIsAnimating(false);
            setIsComplete(false);
        };

        return { isAnimating, isComplete, start, reset };
    },
};

// Motion guidelines documentation
export const motionGuidelines = {
    title: 'Motion Design Guidelines',
    version: '1.0.0',
    lastUpdated: '2026-01-21',

    principles: motionPrinciples,

    durations: motionDurations,

    easings: motionEasings,

    intensities: motionIntensities,

    microInteractions: microInteractions,

    accessibility: {
        reducedMotion: 'Respeitar preferência de redução de movimento do usuário',
        focusVisible: 'Animações de foco devem ser claras e visíveis',
        motionSickness: 'Evitar animações que possam causar enjoo',
        seizures: 'Evitar flashes rápidos e repetitivos',
    },

    performance: {
        fps: 'Manter 60fps em todas as animações',
        hardwareAcceleration: 'Usar transform e opacity para animações',
        willChange: 'Usar will-change para animações complexas',
        cleanup: 'Limpar timeouts e event listeners',
    },

    bestPractices: [
        'Use animações sutis e não distraídas',
        'Respeite preferências de redução de movimento',
        'Mantenha animações consistentes em todo o sistema',
        'Teste animações em diferentes dispositivos',
        'Otimize para performance',
        'Forneça alternativas para usuários com deficiência',
    ],

    examples: {
        button: {
            hover: 'translateY(-1px) + box-shadow',
            active: 'translateY(0) + box-shadow',
            focus: 'outline + outline-offset',
        },
        input: {
            focus: 'border-color + box-shadow',
            error: 'border-color + shake animation',
        },
        card: {
            hover: 'translateY(-2px) + box-shadow',
            active: 'translateY(0) + box-shadow',
        },
        modal: {
            enter: 'opacity + scale',
            exit: 'opacity + scale',
        },
        toast: {
            enter: 'opacity + translateX',
            exit: 'opacity + translateX',
        },
    },
};

export default motionGuidelines;
