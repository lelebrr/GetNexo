/**
 * Design System - Toast Component
 * Sistema de notificações com acessibilidade WCAG 2.2 AA+
 * Micro-interações e animações sutis
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTheme, useMotion, useAccessibility } from '../theme/ThemeContext';

// Toast context
const ToastContext = React.createContext();

// Toast provider
export const ToastProvider = ({ children, position = 'top-right', duration = 5000 }) => {
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const addToast = (message, options = {}) => {
        const id = ++toastIdRef.current;
        const toast = {
            id,
            message,
            type: options.type || 'info',
            duration: options.duration || duration,
            position: options.position || position,
            onClose: options.onClose,
            action: options.action,
            icon: options.icon,
        };

        setToasts((prev) => [...prev, toast]);

        // Auto dismiss
        if (toast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration);
        }

        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => {
            const toast = prev.find((t) => t.id === id);
            if (toast && toast.onClose) {
                toast.onClose();
            }
            return prev.filter((t) => t.id !== id);
        });
    };

    const clearToasts = () => {
        setToasts([]);
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast, clearToasts, toasts }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

// Toast container
const ToastContainer = ({ toasts, onRemove }) => {
    const { computedTheme } = useTheme();

    // Group toasts by position
    const groupedToasts = toasts.reduce((acc, toast) => {
        const position = toast.position || 'top-right';
        if (!acc[position]) acc[position] = [];
        acc[position].push(toast);
        return acc;
    }, {});

    const positions = {
        'top-left': { top: '1rem', left: '1rem' },
        'top-right': { top: '1rem', right: '1rem' },
        'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
        'bottom-left': { bottom: '1rem', left: '1rem' },
        'bottom-right': { bottom: '1rem', right: '1rem' },
        'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
    };

    return (
        <>
            {Object.entries(groupedToasts).map(([position, toastList]) => (
                <div
                    key={position}
                    style={{
                        position: 'fixed',
                        zIndex: computedTheme.spacing.zIndex.toast,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: computedTheme.spacing.space[2],
                        pointerEvents: 'none',
                        ...positions[position],
                    }}
                    role="region"
                    aria-label={`Notificações ${position}`}
                >
                    {toastList.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
                    ))}
                </div>
            ))}
        </>
    );
};

// Toast item
const ToastItem = ({ toast, onRemove }) => {
    const { computedTheme } = useTheme();
    const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
    const [isExiting, setIsExiting] = useState(false);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, shouldAnimate() ? 200 : 0);
    };

    // Toast types
    const types = {
        success: {
            background: computedTheme.colors.success[50],
            border: computedTheme.colors.success[500],
            color: computedTheme.colors.success[900],
            icon: toast.icon || '✓',
        },
        error: {
            background: computedTheme.colors.error[50],
            border: computedTheme.colors.error[500],
            color: computedTheme.colors.error[900],
            icon: toast.icon || '✕',
        },
        warning: {
            background: computedTheme.colors.warning[50],
            border: computedTheme.colors.warning[500],
            color: computedTheme.colors.warning[900],
            icon: toast.icon || '⚠',
        },
        info: {
            background: computedTheme.colors.info[50],
            border: computedTheme.colors.info[500],
            color: computedTheme.colors.info[900],
            icon: toast.icon || 'ℹ',
        },
    };

    const currentType = types[toast.type] || types.info;

    // Animation styles
    const animationStyles = shouldAnimate() ? {
        animation: isExiting
            ? `slideOut ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
            : `slideIn ${getMotionDuration('fast')} ${getMotionTiming('ease')}`,
    } : {};

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: computedTheme.spacing.space[3],
                padding: computedTheme.spacing.space[4],
                background: currentType.background,
                borderLeft: `4px solid ${currentType.border}`,
                borderRadius: computedTheme.borderRadius,
                boxShadow: computedTheme.spacing.shadow.lg,
                maxWidth: '400px',
                pointerEvents: 'auto',
                ...animationStyles,
            }}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <span
                style={{
                    fontSize: computedTheme.typography.fontSize.lg,
                    fontWeight: computedTheme.typography.fontWeight.bold,
                    color: currentType.color,
                    flexShrink: 0,
                }}
                aria-hidden="true"
            >
                {currentType.icon}
            </span>

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        fontSize: computedTheme.typography.fontSize.base,
                        fontWeight: computedTheme.typography.fontWeight.medium,
                        color: currentType.color,
                        marginBottom: toast.action ? computedTheme.spacing.space[2] : 0,
                    }}
                >
                    {toast.message}
                </div>

                {toast.action && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.action.onClick();
                            handleRemove();
                        }}
                        style={{
                            background: currentType.border,
                            color: computedTheme.colors.text.inverse,
                            border: 'none',
                            padding: `${computedTheme.spacing.space[1]} ${computedTheme.spacing.space[3]}`,
                            borderRadius: computedTheme.borderRadius,
                            cursor: 'pointer',
                            fontSize: computedTheme.typography.fontSize.sm,
                            fontWeight: computedTheme.typography.fontWeight.medium,
                        }}
                        aria-label={toast.action.label}
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            <button
                type="button"
                onClick={handleRemove}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: currentType.color,
                    cursor: 'pointer',
                    padding: computedTheme.spacing.space[1],
                    fontSize: computedTheme.typography.fontSize.lg,
                    lineHeight: 1,
                    opacity: 0.7,
                    transition: shouldAnimate()
                        ? `opacity ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
                        : 'none',
                }}
                onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                    e.target.style.opacity = '0.7';
                }}
                aria-label="Fechar notificação"
            >
                ×
            </button>
        </div>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Toast component (for manual usage)
export const Toast = {
    success: (message, options = {}) => {
        const { addToast } = useToast();
        return addToast(message, { ...options, type: 'success' });
    },
    error: (message, options = {}) => {
        const { addToast } = useToast();
        return addToast(message, { ...options, type: 'error' });
    },
    warning: (message, options = {}) => {
        const { addToast } = useToast();
        return addToast(message, { ...options, type: 'warning' });
    },
    info: (message, options = {}) => {
        const { addToast } = useToast();
        return addToast(message, { ...options, type: 'info' });
    },
};

// Toast notification component for inline usage
export const ToastNotification = ({
    message,
    type = 'info',
    onClose,
    action,
    icon,
    duration = 5000,
    className = '',
    style = {},
}) => {
    const { computedTheme } = useTheme();
    const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!isVisible) return null;

    const types = {
        success: {
            background: computedTheme.colors.success[50],
            border: computedTheme.colors.success[500],
            color: computedTheme.colors.success[900],
            icon: icon || '✓',
        },
        error: {
            background: computedTheme.colors.error[50],
            border: computedTheme.colors.error[500],
            color: computedTheme.colors.error[900],
            icon: icon || '✕',
        },
        warning: {
            background: computedTheme.colors.warning[50],
            border: computedTheme.colors.warning[500],
            color: computedTheme.colors.warning[900],
            icon: icon || '⚠',
        },
        info: {
            background: computedTheme.colors.info[50],
            border: computedTheme.colors.info[500],
            color: computedTheme.colors.info[900],
            icon: icon || 'ℹ',
        },
    };

    const currentType = types[type] || types.info;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: computedTheme.spacing.space[3],
                padding: computedTheme.spacing.space[4],
                background: currentType.background,
                borderLeft: `4px solid ${currentType.border}`,
                borderRadius: computedTheme.borderRadius,
                boxShadow: computedTheme.spacing.shadow.md,
                maxWidth: '400px',
                animation: shouldAnimate()
                    ? `slideIn ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
                    : 'none',
                ...style,
            }}
            className={className}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <span
                style={{
                    fontSize: computedTheme.typography.fontSize.lg,
                    fontWeight: computedTheme.typography.fontWeight.bold,
                    color: currentType.color,
                    flexShrink: 0,
                }}
                aria-hidden="true"
            >
                {currentType.icon}
            </span>

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        fontSize: computedTheme.typography.fontSize.base,
                        fontWeight: computedTheme.typography.fontWeight.medium,
                        color: currentType.color,
                        marginBottom: action ? computedTheme.spacing.space[2] : 0,
                    }}
                >
                    {message}
                </div>

                {action && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                            setIsVisible(false);
                            if (onClose) onClose();
                        }}
                        style={{
                            background: currentType.border,
                            color: computedTheme.colors.text.inverse,
                            border: 'none',
                            padding: `${computedTheme.spacing.space[1]} ${computedTheme.spacing.space[3]}`,
                            borderRadius: computedTheme.borderRadius,
                            cursor: 'pointer',
                            fontSize: computedTheme.typography.fontSize.sm,
                            fontWeight: computedTheme.typography.fontWeight.medium,
                        }}
                        aria-label={action.label}
                    >
                        {action.label}
                    </button>
                )}
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={() => {
                        setIsVisible(false);
                        if (onClose) onClose();
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: currentType.color,
                        cursor: 'pointer',
                        padding: computedTheme.spacing.space[1],
                        fontSize: computedTheme.typography.fontSize.lg,
                        lineHeight: 1,
                        opacity: 0.7,
                        transition: shouldAnimate()
                            ? `opacity ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
                            : 'none',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.opacity = '0.7';
                    }}
                    aria-label="Fechar notificação"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Toast;
