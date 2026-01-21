/**
 * Design System - Input Component
 * Componente reutilizável com acessibilidade WCAG 2.2 AA+
 * Micro-interações e validação graciosa
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTheme, useMotion, useAccessibility } from '../theme/ThemeContext';

export const Input = ({
    type = 'text',
    value = '',
    defaultValue,
    placeholder = '',
    label,
    name,
    id,
    required = false,
    disabled = false,
    readOnly = false,
    error = '',
    success = '',
    warning = '',
    helperText = '',
    size = 'medium',
    variant = 'outlined',
    fullWidth = false,
    multiline = false,
    rows = 3,
    maxLength,
    minLength,
    pattern,
    autoComplete,
    autoFocus = false,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    ariaLabel,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
    ariaDisabled,
    icon,
    iconPosition = 'left',
    suffix,
    prefix,
    className = '',
    style = {},
    ...props
}) => {
    const { computedTheme } = useTheme();
    const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
    const { getFocusStyles } = useAccessibility();

    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');
    const inputRef = useRef(null);

    // Sync internal value with external value
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    // Input variants
    const variants = {
        outlined: {
            background: computedTheme.colors.background.primary,
            border: `1px solid ${computedTheme.colors.border.DEFAULT}`,
            hover: computedTheme.colors.border.dark,
            focus: computedTheme.primaryColor[500] || computedTheme.colors.primary[500],
            error: computedTheme.colors.error[500],
            success: computedTheme.colors.success[500],
            warning: computedTheme.colors.warning[500],
            disabled: computedTheme.colors.background.tertiary,
            disabledText: computedTheme.colors.text.disabled,
        },
        filled: {
            background: computedTheme.colors.background.tertiary,
            border: `1px solid ${computedTheme.colors.border.light}`,
            hover: computedTheme.colors.background.secondary,
            focus: computedTheme.primaryColor[500] || computedTheme.colors.primary[500],
            error: computedTheme.colors.error[500],
            success: computedTheme.colors.success[500],
            warning: computedTheme.colors.warning[500],
            disabled: computedTheme.colors.background.tertiary,
            disabledText: computedTheme.colors.text.disabled,
        },
        ghost: {
            background: 'transparent',
            border: `1px solid transparent`,
            hover: computedTheme.colors.background.tertiary,
            focus: computedTheme.primaryColor[500] || computedTheme.colors.primary[500],
            error: computedTheme.colors.error[500],
            success: computedTheme.colors.success[500],
            warning: computedTheme.colors.warning[500],
            disabled: 'transparent',
            disabledText: computedTheme.colors.text.disabled,
        },
    };

    // Input sizes
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

    const currentVariant = variants[variant] || variants.outlined;
    const currentSize = sizes[size] || sizes.medium;

    // Event handlers
    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        if (onChange) onChange(e);
    };

    const handleMouseEnter = () => {
        if (!disabled) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // Calculate input styles
    const getInputStyles = () => {
        const baseStyles = {
            width: fullWidth ? '100%' : 'auto',
            padding: currentSize.padding,
            fontSize: currentSize.fontSize,
            minHeight: currentSize.minHeight,
            fontFamily: computedTheme.fontFamily.join(', '),
            fontWeight: computedTheme.typography.fontWeight.normal,
            borderRadius: computedTheme.borderRadius,
            border: currentVariant.border,
            background: currentVariant.background,
            color: computedTheme.colors.text.primary,
            outline: 'none',
            transition: shouldAnimate()
                ? `all ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
                : 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
            ...style,
        };

        // Hover state
        if (isHovered && !disabled && !readOnly) {
            baseStyles.borderColor = currentVariant.hover;
        }

        // Focus state
        if (isFocused && !disabled && !readOnly) {
            baseStyles.borderColor = currentVariant.focus;
            baseStyles.boxShadow = `0 0 0 3px ${currentVariant.focus}20`;
        }

        // Error state
        if (error && !disabled) {
            baseStyles.borderColor = currentVariant.error;
            if (isFocused) {
                baseStyles.boxShadow = `0 0 0 3px ${currentVariant.error}20`;
            }
        }

        // Success state
        if (success && !disabled) {
            baseStyles.borderColor = currentVariant.success;
            if (isFocused) {
                baseStyles.boxShadow = `0 0 0 3px ${currentVariant.success}20`;
            }
        }

        // Warning state
        if (warning && !disabled) {
            baseStyles.borderColor = currentVariant.warning;
            if (isFocused) {
                baseStyles.boxShadow = `0 0 0 3px ${currentVariant.warning}20`;
            }
        }

        // Read-only state
        if (readOnly) {
            baseStyles.background = computedTheme.colors.background.tertiary;
            baseStyles.cursor = 'default';
        }

        return baseStyles;
    };

    // Calculate label styles
    const getLabelStyles = () => {
        return {
            display: 'block',
            marginBottom: computedTheme.spacing.space[2],
            fontSize: currentSize.fontSize,
            fontWeight: computedTheme.typography.fontWeight.medium,
            color: computedTheme.colors.text.primary,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
        };
    };

    // Calculate helper text styles
    const getHelperTextStyles = () => {
        const color = error
            ? computedTheme.colors.error[600]
            : success
                ? computedTheme.colors.success[600]
                : warning
                    ? computedTheme.colors.warning[600]
                    : computedTheme.colors.text.secondary;

        return {
            display: 'block',
            marginTop: computedTheme.spacing.space[2],
            fontSize: computedTheme.typography.fontSize.sm,
            color: color,
            opacity: disabled ? 0.6 : 1,
        };
    };

    // Calculate character count styles
    const getCharCountStyles = () => {
        const isOverLimit = maxLength && internalValue.length > maxLength;

        return {
            display: 'block',
            marginTop: computedTheme.spacing.space[2],
            fontSize: computedTheme.typography.fontSize.sm,
            color: isOverLimit
                ? computedTheme.colors.error[600]
                : computedTheme.colors.text.tertiary,
            textAlign: 'right',
        };
    };

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
                    color: computedTheme.colors.text.tertiary,
                    marginRight: iconPosition === 'left' ? computedTheme.spacing.space[2] : 0,
                    marginLeft: iconPosition === 'right' ? computedTheme.spacing.space[2] : 0,
                }}
                aria-hidden="true"
            >
                {icon}
            </span>
        );
    };

    // Prefix/Suffix component
    const Prefix = () => {
        if (!prefix) return null;

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: `0 ${computedTheme.spacing.space[2]}`,
                    fontSize: currentSize.fontSize,
                    color: computedTheme.colors.text.tertiary,
                    background: computedTheme.colors.background.tertiary,
                    borderRight: `1px solid ${computedTheme.colors.border.DEFAULT}`,
                    borderRadius: `${computedTheme.borderRadius} 0 0 ${computedTheme.borderRadius}`,
                }}
            >
                {prefix}
            </span>
        );
    };

    const Suffix = () => {
        if (!suffix) return null;

        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: `0 ${computedTheme.spacing.space[2]}`,
                    fontSize: currentSize.fontSize,
                    color: computedTheme.colors.text.tertiary,
                    background: computedTheme.colors.background.tertiary,
                    borderLeft: `1px solid ${computedTheme.colors.border.DEFAULT}`,
                    borderRadius: `0 ${computedTheme.borderRadius} ${computedTheme.borderRadius} 0`,
                }}
            >
                {suffix}
            </span>
        );
    };

    // ARIA attributes
    const ariaAttributes = {
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': ariaInvalid || !!error,
        'aria-required': ariaRequired || required,
        'aria-disabled': ariaDisabled || disabled,
        'aria-readonly': readOnly,
    };

    // Remove undefined attributes
    Object.keys(ariaAttributes).forEach(key => {
        if (ariaAttributes[key] === undefined || ariaAttributes[key] === null) {
            delete ariaAttributes[key];
        }
    });

    // Input element
    const inputElement = multiline ? (
        <textarea
            ref={inputRef}
            name={name}
            id={id}
            value={internalValue}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            rows={rows}
            maxLength={maxLength}
            minLength={minLength}
            autoFocus={autoFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            style={getInputStyles()}
            className={className}
            {...ariaAttributes}
            {...props}
        />
    ) : (
        <input
            ref={inputRef}
            type={type}
            name={name}
            id={id}
            value={internalValue}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            style={getInputStyles()}
            className={className}
            {...ariaAttributes}
            {...props}
        />
    );

    return (
        <div
            style={{
                width: fullWidth ? '100%' : 'auto',
                opacity: disabled ? 0.6 : 1,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {label && (
                <label
                    htmlFor={id}
                    style={getLabelStyles()}
                >
                    {label}
                    {required && <span style={{ color: computedTheme.colors.error[600] }}> *</span>}
                </label>
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    background: currentVariant.background,
                    borderRadius: computedTheme.borderRadius,
                    border: currentVariant.border,
                    ...(isFocused && !disabled && !readOnly && {
                        borderColor: currentVariant.focus,
                        boxShadow: `0 0 0 3px ${currentVariant.focus}20`,
                    }),
                    ...(error && !disabled && {
                        borderColor: currentVariant.error,
                        ...(isFocused && {
                            boxShadow: `0 0 0 3px ${currentVariant.error}20`,
                        }),
                    }),
                    ...(success && !disabled && {
                        borderColor: currentVariant.success,
                        ...(isFocused && {
                            boxShadow: `0 0 0 3px ${currentVariant.success}20`,
                        }),
                    }),
                    ...(warning && !disabled && {
                        borderColor: currentVariant.warning,
                        ...(isFocused && {
                            boxShadow: `0 0 0 3px ${currentVariant.warning}20`,
                        }),
                    }),
                }}
            >
                {iconPosition === 'left' && <Icon />}
                {prefix && <Prefix />}
                {inputElement}
                {suffix && <Suffix />}
                {iconPosition === 'right' && <Icon />}
            </div>

            {helperText && (
                <span style={getHelperTextStyles()}>{helperText}</span>
            )}

            {error && (
                <span style={getHelperTextStyles()}>{error}</span>
            )}

            {success && (
                <span style={getHelperTextStyles()}>{success}</span>
            )}

            {warning && (
                <span style={getHelperTextStyles()}>{warning}</span>
            )}

            {maxLength && (
                <span style={getCharCountStyles()}>
                    {internalValue.length} / {maxLength}
                </span>
            )}
        </div>
    );
};

// Input.Group component for input groups
Input.Group = ({ children, gap = 'medium', className = '', style = {} }) => {
    const { computedTheme } = useTheme();

    const gapSizes = {
        small: computedTheme.spacing.space[1],
        medium: computedTheme.spacing.space[2],
        large: computedTheme.spacing.space[3],
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: gapSizes[gap] || gapSizes.medium,
                alignItems: 'flex-start',
                ...style,
            }}
            className={className}
            role="group"
            aria-label="Input group"
        >
            {children}
        </div>
    );
};

// Input.Search component for search inputs
Input.Search = ({ onSearch, ...props }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(e.target.value);
        }
        if (props.onKeyDown) props.onKeyDown(e);
    };

    return (
        <Input
            {...props}
            type="search"
            onKeyDown={handleKeyDown}
            ariaLabel={props.ariaLabel || 'Search input'}
        />
    );
};

// Input.Password component for password inputs
Input.Password = ({ showToggle = true, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Input
            {...props}
            type={showPassword ? 'text' : 'password'}
            suffix={
                showToggle ? (
                    <button
                        type="button"
                        onClick={togglePassword}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            color: 'inherit',
                        }}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? '👁️' : '🔒'}
                    </button>
                ) : undefined
            }
        />
    );
};

export default Input;
