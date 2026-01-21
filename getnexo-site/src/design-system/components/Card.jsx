/**
 * Design System - Card Component
 * Componente reutilizável com acessibilidade WCAG 2.2 AA+
 * Micro-interações e estados hover/focus
 */

import React, { useState } from 'react';
import { useTheme, useMotion, useAccessibility } from '../theme/ThemeContext';

export const Card = ({
    children,
    variant = 'elevated',
    size = 'medium',
    hoverable = false,
    clickable = false,
    disabled = false,
    elevation = 'md',
    header,
    footer,
    title,
    description,
    icon,
    actions,
    onClick,
    ariaLabel,
    ariaDescribedBy,
    role,
    className = '',
    style = {},
    ...props
}) => {
    const { computedTheme } = useTheme();
    const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
    const { getFocusStyles } = useAccessibility();

    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Card variants
    const variants = {
        elevated: {
            background: computedTheme.colors.background.primary,
            border: 'none',
            shadow: computedTheme.spacing.shadow.md,
            shadowDark: computedTheme.spacing.shadowDark.md,
        },
        outlined: {
            background: computedTheme.colors.background.primary,
            border: `1px solid ${computedTheme.colors.border.DEFAULT}`,
            shadow: 'none',
            shadowDark: 'none',
        },
        filled: {
            background: computedTheme.colors.background.tertiary,
            border: 'none',
            shadow: 'none',
            shadowDark: 'none',
        },
        ghost: {
            background: 'transparent',
            border: `1px dashed ${computedTheme.colors.border.DEFAULT}`,
            shadow: 'none',
            shadowDark: 'none',
        },
    };

    // Card sizes
    const sizes = {
        small: {
            padding: computedTheme.spacing.space[4],
            gap: computedTheme.spacing.space[3],
            borderRadius: computedTheme.borderRadius,
        },
        medium: {
            padding: computedTheme.spacing.space[6],
            gap: computedTheme.spacing.space[4],
            borderRadius: computedTheme.borderRadius,
        },
        large: {
            padding: computedTheme.spacing.space[8],
            gap: computedTheme.spacing.space[5],
            borderRadius: computedTheme.borderRadius,
        },
    };

    // Elevation levels
    const elevations = {
        sm: computedTheme.spacing.shadow.sm,
        md: computedTheme.spacing.shadow.md,
        lg: computedTheme.spacing.shadow.lg,
        xl: computedTheme.spacing.shadow.xl,
        '2xl': computedTheme.spacing.shadow['2xl'],
    };

    const currentVariant = variants[variant] || variants.elevated;
    const currentSize = sizes[size] || sizes.medium;
    const currentElevation = elevations[elevation] || elevations.md;

    // Event handlers
    const handleMouseEnter = () => {
        if (!disabled && hoverable) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPressed(false);
    };

    const handleMouseDown = () => {
        if (!disabled && clickable) {
            setIsPressed(true);
        }
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        if (clickable && onClick) {
            onClick(e);
        }
    };

    // Calculate card styles
    const getCardStyles = () => {
        const baseStyles = {
            display: 'flex',
            flexDirection: 'column',
            gap: currentSize.gap,
            padding: currentSize.padding,
            borderRadius: currentSize.borderRadius,
            background: currentVariant.background,
            border: currentVariant.border,
            transition: shouldAnimate()
                ? `all ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
                : 'none',
            cursor: disabled ? 'not-allowed' : clickable ? 'pointer' : 'default',
            opacity: disabled ? 0.6 : 1,
            ...style,
        };

        // Hover state
        if (isHovered && !disabled && hoverable) {
            baseStyles.transform = shouldAnimate() ? 'translateY(-2px)' : 'none';
            baseStyles.boxShadow = computedTheme.isDarkMode
                ? currentVariant.shadowDark
                : currentVariant.shadow;
        }

        // Active/Pressed state
        if (isPressed && !disabled && clickable) {
            baseStyles.transform = shouldAnimate() ? 'translateY(0)' : 'none';
            baseStyles.boxShadow = computedTheme.spacing.shadow.sm;
        }

        // Focus styles
        if (clickable) {
            baseStyles['&:focus-visible'] = getFocusStyles();
        }

        // Elevated variant shadow
        if (variant === 'elevated' && !isHovered) {
            baseStyles.boxShadow = computedTheme.isDarkMode
                ? currentVariant.shadowDark
                : currentVariant.shadow;
        }

        return baseStyles;
    };

    // Header styles
    const getHeaderStyles = () => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: computedTheme.spacing.space[4],
        paddingBottom: computedTheme.spacing.space[4],
        borderBottom: `1px solid ${computedTheme.colors.border.light}`,
    });

    // Title styles
    const getTitleStyles = () => ({
        fontSize: computedTheme.typography.fontSize.lg,
        fontWeight: computedTheme.typography.fontWeight.semibold,
        color: computedTheme.colors.text.primary,
        margin: 0,
    });

    // Description styles
    const getDescriptionStyles = () => ({
        fontSize: computedTheme.typography.fontSize.sm,
        color: computedTheme.colors.text.secondary,
        margin: 0,
    });

    // Footer styles
    const getFooterStyles = () => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: computedTheme.spacing.space[2],
        paddingTop: computedTheme.spacing.space[4],
        borderTop: `1px solid ${computedTheme.colors.border.light}`,
    });

    // Icon component
    const Icon = () => {
        if (!icon) return null;

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    color: computedTheme.colors.text.secondary,
                }}
                aria-hidden="true"
            >
                {icon}
            </span>
        );
    };

    // ARIA attributes
    const ariaAttributes = {
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-disabled': disabled,
        role: role || (clickable ? 'button' : 'article'),
    };

    // Remove undefined attributes
    Object.keys(ariaAttributes).forEach(key => {
        if (ariaAttributes[key] === undefined || ariaAttributes[key] === null) {
            delete ariaAttributes[key];
        }
    });

    return (
        <div
            style={getCardStyles()}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            tabIndex={clickable && !disabled ? 0 : undefined}
            {...ariaAttributes}
            {...props}
        >
            {header || (title || description || icon) ? (
                <div style={getHeaderStyles()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: computedTheme.spacing.space[3] }}>
                        <Icon />
                        <div>
                            {title && <h3 style={getTitleStyles()}>{title}</h3>}
                            {description && <p style={getDescriptionStyles()}>{description}</p>}
                        </div>
                    </div>
                    {actions}
                </div>
            ) : null}

            <div style={{ display: 'flex', flexDirection: 'column', gap: currentSize.gap }}>
                {children}
            </div>

            {footer && (
                <div style={getFooterStyles()}>
                    {footer}
                </div>
            )}
        </div>
    );
};

// Card.Group component for card grids
Card.Group = ({ children, columns = 1, gap = 'medium', className = '', style = {} }) => {
    const { computedTheme } = useTheme();

    const gapSizes = {
        small: computedTheme.spacing.space[2],
        medium: computedTheme.spacing.space[4],
        large: computedTheme.spacing.space[6],
    };

    const columnSizes = {
        1: '1fr',
        2: 'repeat(2, 1fr)',
        3: 'repeat(3, 1fr)',
        4: 'repeat(4, 1fr)',
    };

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: columnSizes[columns] || columnSizes[1],
                gap: gapSizes[gap] || gapSizes.medium,
                ...style,
            }}
            className={className}
            role="list"
            aria-label="Card group"
        >
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, { role: 'listitem', 'aria-posinset': index + 1, 'aria-setsize': React.Children.count(children) })
            )}
        </div>
    );
};

// Card.Skeleton component for loading states
Card.Skeleton = ({ size = 'medium', className = '', style = {} }) => {
    const { computedTheme } = useTheme();
    const { getAnimation } = useMotion();

    const sizes = {
        small: {
            padding: computedTheme.spacing.space[4],
            height: '120px',
        },
        medium: {
            padding: computedTheme.spacing.space[6],
            height: '180px',
        },
        large: {
            padding: computedTheme.spacing.space[8],
            height: '240px',
        },
    };

    const currentSize = sizes[size] || sizes.medium;

    const skeletonAnimation = getAnimation('pulse');

    return (
        <div
            style={{
                padding: currentSize.padding,
                borderRadius: computedTheme.borderRadius,
                background: computedTheme.colors.background.tertiary,
                height: currentSize.height,
                animation: shouldAnimate()
                    ? `${skeletonAnimation.duration} ${skeletonAnimation.timing} infinite`
                    : 'none',
                opacity: 0.5,
                ...style,
            }}
            className={className}
            aria-busy="true"
            aria-label="Loading content"
        />
    );
};

// Card.Error component for error states
Card.Error = ({ title, message, onRetry, className = '', style = {} }) => {
    const { computedTheme } = useTheme();

    return (
        <Card
            variant="outlined"
            size="medium"
            title={title || 'Erro'}
            description={message}
            icon={<span style={{ color: computedTheme.colors.error[600] }}>⚠️</span>}
            footer={
                onRetry ? (
                    <button
                        type="button"
                        onClick={onRetry}
                        style={{
                            background: computedTheme.colors.error[600],
                            color: computedTheme.colors.text.inverse,
                            border: 'none',
                            padding: `${computedTheme.spacing.space[2]} ${computedTheme.spacing.space[4]}`,
                            borderRadius: computedTheme.borderRadius,
                            cursor: 'pointer',
                            fontWeight: computedTheme.typography.fontWeight.semibold,
                        }}
                        aria-label="Tentar novamente"
                    >
                        Tentar novamente
                    </button>
                ) : null
            }
            className={className}
            style={{
                borderColor: computedTheme.colors.error[500],
                background: computedTheme.colors.error[50],
                ...style,
            }}
            aria-live="assertive"
        />
    );
};

// Card.Success component for success states
Card.Success = ({ title, message, className = '', style = {} }) => {
    const { computedTheme } = useTheme();

    return (
        <Card
            variant="outlined"
            size="medium"
            title={title || 'Sucesso'}
            description={message}
            icon={<span style={{ color: computedTheme.colors.success[600] }}>✓</span>}
            className={className}
            style={{
                borderColor: computedTheme.colors.success[500],
                background: computedTheme.colors.success[50],
                ...style,
            }}
            aria-live="polite"
        />
    );
};

// Card.Warning component for warning states
Card.Warning = ({ title, message, className = '', style = {} }) => {
    const { computedTheme } = useTheme();

    return (
        <Card
            variant="outlined"
            size="medium"
            title={title || 'Atenção'}
            description={message}
            icon={<span style={{ color: computedTheme.colors.warning[600] }}>⚠</span>}
            className={className}
            style={{
                borderColor: computedTheme.colors.warning[500],
                background: computedTheme.colors.warning[50],
                ...style,
            }}
            aria-live="polite"
        />
    );
};

export default Card;
