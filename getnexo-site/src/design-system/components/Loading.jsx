/**
 * Design System - Loading Component
 * Loading states otimizados com acessibilidade WCAG 2.2 AA+
 */

import React from 'react';
import { useTheme, useMotion } from '../theme/ThemeContext';

export const Loading = ({
    size = 'medium',
    variant = 'spinner',
    color = 'primary',
    text = 'Carregando...',
    fullscreen = false,
    overlay = false,
    ariaLabel = 'Carregando',
    className = '',
    style = {},
}) => {
    const { computedTheme } = useTheme();
    const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();

    // Loading sizes
    const sizes = {
        small: {
            width: '16px',
            height: '16px',
            borderWidth: '2px',
            fontSize: computedTheme.typography.fontSize.sm,
        },
        medium: {
            width: '24px',
            height: '24px',
            borderWidth: '3px',
            fontSize: computedTheme.typography.fontSize.base,
        },
        large: {
            width: '32px',
            height: '32px',
            borderWidth: '4px',
            fontSize: computedTheme.typography.fontSize.lg,
        },
    };

    const currentSize = sizes[size] || sizes.medium;

    // Get color based on variant
    const getColor = () => {
        const colorMap = {
            primary: computedTheme.primaryColor[500] || computedTheme.colors.primary[500],
            secondary: computedTheme.secondaryColor[500] || computedTheme.colors.secondary[500],
            accent: computedTheme.accentColor[500] || computedTheme.colors.accent[500],
            success: computedTheme.colors.success[500],
            warning: computedTheme.colors.warning[500],
            error: computedTheme.colors.error[500],
            neutral: computedTheme.colors.neutral[500],
        };
        return colorMap[color] || colorMap.primary;
    };

    // Spinner variant
    const Spinner = () => (
        <div
            style={{
                width: currentSize.width,
                height: currentSize.height,
                border: `${currentSize.borderWidth} solid ${getColor()}20`,
                borderTop: `${currentSize.borderWidth} solid ${getColor()}`,
                borderRadius: '50%',
                animation: shouldAnimate()
                    ? `spin ${getMotionDuration('slow')} linear infinite`
                    : 'none',
                ...style,
            }}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
        />
    );

    // Dots variant
    const Dots = () => (
        <div
            style={{
                display: 'flex',
                gap: computedTheme.spacing.space[1],
                alignItems: 'center',
                ...style,
            }}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
        >
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    style={{
                        width: currentSize.width,
                        height: currentSize.height,
                        background: getColor(),
                        borderRadius: '50%',
                        animation: shouldAnimate()
                            ? `bounce ${getMotionDuration('slow')} ease-in-out infinite`
                            : 'none',
                        animationDelay: `${index * 0.1}s`,
                    }}
                />
            ))}
        </div>
    );

    // Bars variant
    const Bars = () => (
        <div
            style={{
                display: 'flex',
                gap: computedTheme.spacing.space[1],
                alignItems: 'flex-end',
                height: currentSize.height,
                ...style,
            }}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
        >
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    style={{
                        width: currentSize.width,
                        height: '100%',
                        background: getColor(),
                        borderRadius: '2px',
                        animation: shouldAnimate()
                            ? `wave ${getMotionDuration('slow')} ease-in-out infinite`
                            : 'none',
                        animationDelay: `${index * 0.1}s`,
                    }}
                />
            ))}
        </div>
    );

    // Pulse variant
    const Pulse = () => (
        <div
            style={{
                position: 'relative',
                width: currentSize.width,
                height: currentSize.height,
                ...style,
            }}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
        >
            <span
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: getColor(),
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: shouldAnimate()
                        ? `pulse ${getMotionDuration('slow')} ease-in-out infinite`
                        : 'none',
                }}
            />
            <span
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: getColor(),
                    borderRadius: '50%',
                    opacity: 0.3,
                    animation: shouldAnimate()
                        ? `pulse ${getMotionDuration('slow')} ease-in-out infinite`
                        : 'none',
                    animationDelay: '0.3s',
                }}
            />
        </div>
    );

    // Render variant
    const renderVariant = () => {
        switch (variant) {
            case 'dots':
                return <Dots />;
            case 'bars':
                return <Bars />;
            case 'pulse':
                return <Pulse />;
            case 'spinner':
            default:
                return <Spinner />;
        }
    };

    // Container styles
    const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: computedTheme.spacing.space[3],
        padding: fullscreen ? computedTheme.spacing.space[8] : computedTheme.spacing.space[4],
        ...(fullscreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: computedTheme.colors.background.primary,
            zIndex: computedTheme.spacing.zIndex.max,
        }),
        ...(overlay && {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: computedTheme.colors.overlay.light,
            zIndex: computedTheme.spacing.zIndex.modal,
        }),
    };

    return (
        <div
            style={containerStyles}
            className={className}
            aria-live="polite"
            aria-busy="true"
        >
            {renderVariant()}
            {text && (
                <span
                    style={{
                        fontSize: currentSize.fontSize,
                        color: computedTheme.colors.text.secondary,
                        textAlign: 'center',
                    }}
                >
                    {text}
                </span>
            )}
        </div>
    );
};

// Loading.Skeleton component for skeleton screens
Loading.Skeleton = ({
    count = 3,
    height = '20px',
    width = '100%',
    variant = 'line',
    className = '',
    style = {},
}) => {
    const { computedTheme } = useTheme();
    const { getAnimation } = useMotion();
    const animation = getAnimation('pulse');

    const skeletonStyles = {
        background: computedTheme.colors.background.tertiary,
        borderRadius: computedTheme.borderRadius,
        animation: shouldAnimate()
            ? `${animation.duration} ${animation.timing} infinite`
            : 'none',
        opacity: 0.5,
        ...style,
    };

    const renderSkeleton = () => {
        switch (variant) {
            case 'circle':
                return (
                    <div
                        style={{
                            ...skeletonStyles,
                            width: height,
                            height: height,
                            borderRadius: '50%',
                        }}
                        className={className}
                        aria-label="Loading content"
                    />
                );
            case 'card':
                return (
                    <div
                        style={{
                            ...skeletonStyles,
                            height: height,
                            width: width,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: computedTheme.spacing.space[2],
                        }}
                        className={className}
                        aria-label="Loading content"
                    >
                        <div style={{ ...skeletonStyles, height: '20px', width: '60%' }} />
                        <div style={{ ...skeletonStyles, height: '16px', width: '80%' }} />
                        <div style={{ ...skeletonStyles, height: '16px', width: '90%' }} />
                    </div>
                );
            case 'line':
            default:
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: computedTheme.spacing.space[2],
                        }}
                        aria-label="Loading content"
                    >
                        {Array.from({ length: count }).map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    ...skeletonStyles,
                                    height: height,
                                    width: width,
                                }}
                                className={className}
                            />
                        ))}
                    </div>
                );
        }
    };

    return renderSkeleton();
};

// Loading.FullScreen component for fullscreen loading
Loading.FullScreen = ({ text = 'Carregando...', variant = 'spinner', color = 'primary' }) => {
    return (
        <Loading
            variant={variant}
            color={color}
            text={text}
            fullscreen={true}
            ariaLabel="Carregando conteúdo"
        />
    );
};

// Loading.Overlay component for overlay loading
Loading.Overlay = ({ text = 'Carregando...', variant = 'spinner', color = 'primary' }) => {
    return (
        <Loading
            variant={variant}
            color={color}
            text={text}
            overlay={true}
            ariaLabel="Carregando conteúdo"
        />
    );
};

export default Loading;
