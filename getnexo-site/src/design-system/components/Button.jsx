/**
 * Design System - Button Component
 * Componente reutilizável com acessibilidade WCAG 2.2 AA+
 * Micro-interações e loading states otimizados
 */

import React, { useState, useEffect } from 'react';
import { useTheme, useMotion, useAccessibility } from '../theme/ThemeContext';

export const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon = null,
    iconPosition = 'left',
    type = 'button',
    onClick,
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaHasPopup,
    role,
    className = '',
    style = {},
    ...props
}) => {
    const { computedTheme } = useTheme();
    const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
    const { getFocusStyles } = useAccessibility();

    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Button variants
    const variants = {
        primary: {
            background: computedTheme.primaryColor[600] || computedTheme.colors.primary[600],
            color: computedTheme.colors.text.inverse,
            border: 'none',
            hover: computedTheme.primaryColor[700] || computedTheme.colors.primary[700],
            active: computedTheme.primaryColor[800] || computedTheme.colors.primary[800],
            disabled: computedTheme.colors.neutral[300],
            disabledText: computedTheme.colors.text.disabled,
        },
        secondary: {
            background: computedTheme.secondaryColor[600] || computedTheme.colors.secondary[600],
            color: computedTheme.colors.text.inverse,
            border: 'none',
            hover: computedTheme.secondaryColor[700] || computedTheme.colors.secondary[700],
            active: computedTheme.secondaryColor[800] || computedTheme.colors.secondary[800],
            disabled: computedTheme.colors.neutral[300],
            disabledText: computedTheme.colors.text.disabled,
        },
        accent: {
            background: computedTheme.accentColor[600] || computedTheme.colors.accent[600],
            color: computedTheme.colors.text.inverse,
            border: 'none',
            hover: computedTheme.accentColor[700] || computedTheme.colors.accent[700],
            active: computedTheme.accentColor[800] || computedTheme.colors.accent[800],
            disabled: computedTheme.colors.neutral[300],
            disabledText: computedTheme.colors.text.disabled,
        },
        outline: {
            background: 'transparent',
            color: computedTheme.colors.text.primary,
            border: `2px solid ${computedTheme.colors.border.DEFAULT}`,
            hover: computedTheme.colors.background.tertiary,
            active: computedTheme.colors.background.secondary,
            disabled: computedTheme.colors.background.tertiary,
            disabledText: computedTheme.colors.text.disabled,
        },
        ghost: {
            background: 'transparent',
            color: computedTheme.colors.text.primary,
            border: 'none',
            hover: computedTheme.colors.background.tertiary,
            active: computedTheme.colors.background.secondary,
            disabled: 'transparent',
            disabledText: computedTheme.colors.text.disabled,
        },
        danger: {
            background: computedTheme.colors.error[600],
            color: computedTheme.colors.text.inverse,
            border: 'none',
            hover: computedTheme.colors.error[700],
            active: computedTheme.colors.error[800],
            disabled: computedTheme.colors.neutral[300],
            disabledText: computedTheme.colors.text.disabled,
        },
        success: {
            background: computedTheme.colors.success[600],
            color: computedTheme.colors.text.inverse,
            border: 'none',
            hover: computedTheme.colors.success[700],
            active: computedTheme.colors.success[800],
            disabled: computedTheme.colors.neutral[300],
            disabledText: computedTheme.colors.text.disabled,
        },
    };

    // Button sizes
    const sizes = {
        small: {
            padding: `${computedTheme.spacing.space[2]} ${computedTheme.spacing.space[3]}`,
            fontSize: computedTheme.typography.fontSize.sm,
            minHeight: '32px',
            gap: computedTheme.spacing.space[1],
        },
        medium: {
            padding: `${computedTheme.spacing.space[3]} ${computedTheme.spacing.space[4]}`,
            fontSize: computedTheme.typography.fontSize.base,
            minHeight: '40px',
            gap: computedTheme.spacing.space[2],
        },
        large: {
            padding: `${computedTheme.spacing.space[4]} ${computedTheme.spacing.space[5]}`,
            fontSize: computedTheme.typography.fontSize.lg,
            minHeight: '48px',
            gap: computedTheme.spacing.space[2],
        },
    };

    const currentVariant = variants[variant] || variants.primary;
    const currentSize = sizes[size] || sizes.medium;

    // Event handlers
    const handleMouseDown = () => {
        if (!disabled && !loading) {
            setIsPressed(true);
        }
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleMouseEnter = () => {
        if (!disabled && !loading) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPressed(false);
    };

    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        if (onClick) {
            onClick(e);
        }
    };

    // Calculate dynamic styles
    const getButtonStyles = () => {
        const baseStyles = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: currentSize.gap,
            padding: currentSize.padding,
            fontSize: currentSize.fontSize,
            minHeight: currentSize.minHeight,
            fontFamily: computedTheme.fontFamily.join(', '),
            fontWeight: computedTheme.typography.fontWeight.semibold,
            borderRadius: computedTheme.borderRadius,
            border: currentVariant.border,
            background: currentVariant.background,
            color: currentVariant.color,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: shouldAnimate()
                ? `all ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
                : 'none',
            position: 'relative',
            overflow: 'hidden',
            width: fullWidth ? '100%' : 'auto',
            ...style,
        };

        // Hover state
        if (isHovered && !disabled && !loading) {
            baseStyles.background = currentVariant.hover;
            baseStyles.transform = shouldAnimate() ? 'translateY(-1px)' : 'none';
            baseStyles.boxShadow = computedTheme.spacing.shadow.md;
        }

        // Active/Pressed state
        if (isPressed && !disabled && !loading) {
            baseStyles.background = currentVariant.active;
            baseStyles.transform = shouldAnimate() ? 'translateY(0)' : 'none';
            baseStyles.boxShadow = computedTheme.spacing.shadow.sm;
        }

        // Focus styles
        baseStyles['&:focus-visible'] = getFocusStyles();

        // Loading state
        if (loading) {
            baseStyles.opacity = 0.8;
            baseStyles.cursor = 'wait';
        }

        return baseStyles;
    };

    // Loading spinner
    const LoadingSpinner = () => (
        <span
            style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: `2px solid ${currentVariant.color}40`,
                borderTop: `2px solid ${currentVariant.color}`,
                borderRadius: '50%',
                animation: shouldAnimate()
                    ? `spin ${getMotionDuration('fast')} linear infinite`
                    : 'none',
            }}
            aria-hidden="true"
        />
    );

    // Icon component
    const Icon = () => {
        if (!icon) return null;

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                }}
                aria-hidden="true"
            >
                {icon}
            </span>
        );
    };

    // ARIA attributes
    const ariaAttributes = {
        'aria-label': ariaLabel || (typeof children === 'string' ? children : undefined),
        'aria-describedby': ariaDescribedBy,
        'aria-expanded': ariaExpanded,
        'aria-haspopup': ariaHasPopup,
        'aria-busy': loading,
        'aria-disabled': disabled,
        role: role || (type === 'button' ? 'button' : undefined),
    };

    // Remove undefined attributes
    Object.keys(ariaAttributes).forEach(key => {
        if (ariaAttributes[key] === undefined || ariaAttributes[key] === null) {
            delete ariaAttributes[key];
        }
    });

    return (
        <button
            type={type}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={disabled || loading}
            style={getButtonStyles()}
            className={className}
            {...ariaAttributes}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {!loading && iconPosition === 'left' && <Icon />}
            {children}
            {!loading && iconPosition === 'right' && <Icon />}
        </button>
    );
};

// Button.Group component for button groups
Button.Group = ({ children, gap = 'medium', className = '', style = {} }) => {
    const { computedTheme } = useTheme();

    const gapSizes = {
        small: computedTheme.spacing.space[1],
        medium: computedTheme.spacing.space[2],
        large: computedTheme.spacing.space[3],
    };

    return (
        <div
            style={{
                display: 'inline-flex',
                gap: gapSizes[gap] || gapSizes.medium,
                alignItems: 'center',
                ...style,
            }}
            className={className}
            role="group"
            aria-label="Button group"
        >
            {children}
        </div>
    );
};

// Button.Icon component for icon-only buttons
Button.Icon = ({ icon, ...props }) => {
    return (
        <Button
            {...props}
            icon={icon}
            ariaLabel={props.ariaLabel || 'Icon button'}
            style={{
                padding: props.size === 'small' ? '8px' : props.size === 'large' ? '16px' : '12px',
                minWidth: props.size === 'small' ? '32px' : props.size === 'large' ? '48px' : '40px',
                ...props.style,
            }}
        />
    );
};

export default Button;
