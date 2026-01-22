import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { u as useTheme, b as useMotion, c as useAccessibility } from "./Card_Dsq8OXHI.mjs";
const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = "left",
  type = "button",
  onClick,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaHasPopup,
  role,
  className = "",
  style = {},
  ...props
}) => {
  const { computedTheme } = useTheme();
  const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
  const { getFocusStyles } = useAccessibility();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const variants = {
    primary: {
      background: computedTheme.primaryColor[600] || computedTheme.colors.primary[600],
      color: computedTheme.colors.text.inverse,
      border: "none",
      hover: computedTheme.primaryColor[700] || computedTheme.colors.primary[700],
      active: computedTheme.primaryColor[800] || computedTheme.colors.primary[800],
      disabled: computedTheme.colors.neutral[300],
      disabledText: computedTheme.colors.text.disabled
    },
    secondary: {
      background: computedTheme.secondaryColor[600] || computedTheme.colors.secondary[600],
      color: computedTheme.colors.text.inverse,
      border: "none",
      hover: computedTheme.secondaryColor[700] || computedTheme.colors.secondary[700],
      active: computedTheme.secondaryColor[800] || computedTheme.colors.secondary[800],
      disabled: computedTheme.colors.neutral[300],
      disabledText: computedTheme.colors.text.disabled
    },
    accent: {
      background: computedTheme.accentColor[600] || computedTheme.colors.accent[600],
      color: computedTheme.colors.text.inverse,
      border: "none",
      hover: computedTheme.accentColor[700] || computedTheme.colors.accent[700],
      active: computedTheme.accentColor[800] || computedTheme.colors.accent[800],
      disabled: computedTheme.colors.neutral[300],
      disabledText: computedTheme.colors.text.disabled
    },
    outline: {
      background: "transparent",
      color: computedTheme.colors.text.primary,
      border: `2px solid ${computedTheme.colors.border.DEFAULT}`,
      hover: computedTheme.colors.background.tertiary,
      active: computedTheme.colors.background.secondary,
      disabled: computedTheme.colors.background.tertiary,
      disabledText: computedTheme.colors.text.disabled
    },
    ghost: {
      background: "transparent",
      color: computedTheme.colors.text.primary,
      border: "none",
      hover: computedTheme.colors.background.tertiary,
      active: computedTheme.colors.background.secondary,
      disabled: "transparent",
      disabledText: computedTheme.colors.text.disabled
    },
    danger: {
      background: computedTheme.colors.error[600],
      color: computedTheme.colors.text.inverse,
      border: "none",
      hover: computedTheme.colors.error[700],
      active: computedTheme.colors.error[800],
      disabled: computedTheme.colors.neutral[300],
      disabledText: computedTheme.colors.text.disabled
    },
    success: {
      background: computedTheme.colors.success[600],
      color: computedTheme.colors.text.inverse,
      border: "none",
      hover: computedTheme.colors.success[700],
      active: computedTheme.colors.success[800],
      disabled: computedTheme.colors.neutral[300],
      disabledText: computedTheme.colors.text.disabled
    }
  };
  const sizes = {
    small: {
      padding: `${computedTheme.spacing.space[2]} ${computedTheme.spacing.space[3]}`,
      fontSize: computedTheme.typography.fontSize.sm,
      minHeight: "32px",
      gap: computedTheme.spacing.space[1]
    },
    medium: {
      padding: `${computedTheme.spacing.space[3]} ${computedTheme.spacing.space[4]}`,
      fontSize: computedTheme.typography.fontSize.base,
      minHeight: "40px",
      gap: computedTheme.spacing.space[2]
    },
    large: {
      padding: `${computedTheme.spacing.space[4]} ${computedTheme.spacing.space[5]}`,
      fontSize: computedTheme.typography.fontSize.lg,
      minHeight: "48px",
      gap: computedTheme.spacing.space[2]
    }
  };
  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.medium;
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
  const getButtonStyles = () => {
    const baseStyles = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: currentSize.gap,
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      minHeight: currentSize.minHeight,
      fontFamily: computedTheme.fontFamily.join(", "),
      fontWeight: computedTheme.typography.fontWeight.semibold,
      borderRadius: computedTheme.borderRadius,
      border: currentVariant.border,
      background: currentVariant.background,
      color: currentVariant.color,
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: shouldAnimate() ? `all ${getMotionDuration("fast")} ${getMotionTiming("ease")}` : "none",
      position: "relative",
      overflow: "hidden",
      width: fullWidth ? "100%" : "auto",
      ...style
    };
    if (isHovered && !disabled && !loading) {
      baseStyles.background = currentVariant.hover;
      baseStyles.transform = shouldAnimate() ? "translateY(-1px)" : "none";
      baseStyles.boxShadow = computedTheme.spacing.shadow.md;
    }
    if (isPressed && !disabled && !loading) {
      baseStyles.background = currentVariant.active;
      baseStyles.transform = shouldAnimate() ? "translateY(0)" : "none";
      baseStyles.boxShadow = computedTheme.spacing.shadow.sm;
    }
    baseStyles["&:focus-visible"] = getFocusStyles();
    if (loading) {
      baseStyles.opacity = 0.8;
      baseStyles.cursor = "wait";
    }
    return baseStyles;
  };
  const LoadingSpinner = () => /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        display: "inline-block",
        width: "16px",
        height: "16px",
        border: `2px solid ${currentVariant.color}40`,
        borderTop: `2px solid ${currentVariant.color}`,
        borderRadius: "50%",
        animation: shouldAnimate() ? `spin ${getMotionDuration("fast")} linear infinite` : "none"
      },
      "aria-hidden": "true"
    }
  );
  const Icon = () => {
    if (!icon) return null;
    return /* @__PURE__ */ jsx(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px"
        },
        "aria-hidden": "true",
        children: icon
      }
    );
  };
  const ariaAttributes = {
    "aria-label": ariaLabel || (typeof children === "string" ? children : void 0),
    "aria-describedby": ariaDescribedBy,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHasPopup,
    "aria-busy": loading,
    "aria-disabled": disabled,
    role: role || (type === "button" ? "button" : void 0)
  };
  Object.keys(ariaAttributes).forEach((key) => {
    if (ariaAttributes[key] === void 0 || ariaAttributes[key] === null) {
      delete ariaAttributes[key];
    }
  });
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type,
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      disabled: disabled || loading,
      style: getButtonStyles(),
      className,
      ...ariaAttributes,
      ...props,
      children: [
        loading && /* @__PURE__ */ jsx(LoadingSpinner, {}),
        !loading && iconPosition === "left" && /* @__PURE__ */ jsx(Icon, {}),
        children,
        !loading && iconPosition === "right" && /* @__PURE__ */ jsx(Icon, {})
      ]
    }
  );
};
Button.Group = ({ children, gap = "medium", className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  const gapSizes = {
    small: computedTheme.spacing.space[1],
    medium: computedTheme.spacing.space[2],
    large: computedTheme.spacing.space[3]
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "inline-flex",
        gap: gapSizes[gap] || gapSizes.medium,
        alignItems: "center",
        ...style
      },
      className,
      role: "group",
      "aria-label": "Button group",
      children
    }
  );
};
Button.Icon = ({ icon, ...props }) => {
  return /* @__PURE__ */ jsx(
    Button,
    {
      ...props,
      icon,
      ariaLabel: props.ariaLabel || "Icon button",
      style: {
        padding: props.size === "small" ? "8px" : props.size === "large" ? "16px" : "12px",
        minWidth: props.size === "small" ? "32px" : props.size === "large" ? "48px" : "40px",
        ...props.style
      }
    }
  );
};
const Input = ({
  type = "text",
  value = "",
  defaultValue,
  placeholder = "",
  label,
  name,
  id,
  required = false,
  disabled = false,
  readOnly = false,
  error = "",
  success = "",
  warning = "",
  helperText = "",
  size = "medium",
  variant = "outlined",
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
  iconPosition = "left",
  suffix,
  prefix,
  className = "",
  style = {},
  ...props
}) => {
  const { computedTheme } = useTheme();
  const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
  useAccessibility();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || "");
  const inputRef = useRef(null);
  useEffect(() => {
    if (value !== void 0) {
      setInternalValue(value);
    }
  }, [value]);
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
      disabledText: computedTheme.colors.text.disabled
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
      disabledText: computedTheme.colors.text.disabled
    },
    ghost: {
      background: "transparent",
      border: `1px solid transparent`,
      hover: computedTheme.colors.background.tertiary,
      focus: computedTheme.primaryColor[500] || computedTheme.colors.primary[500],
      error: computedTheme.colors.error[500],
      success: computedTheme.colors.success[500],
      warning: computedTheme.colors.warning[500],
      disabled: "transparent",
      disabledText: computedTheme.colors.text.disabled
    }
  };
  const sizes = {
    small: {
      padding: `${computedTheme.spacing.space[2]} ${computedTheme.spacing.space[3]}`,
      fontSize: computedTheme.typography.fontSize.sm,
      minHeight: "32px",
      gap: computedTheme.spacing.space[1]
    },
    medium: {
      padding: `${computedTheme.spacing.space[3]} ${computedTheme.spacing.space[4]}`,
      fontSize: computedTheme.typography.fontSize.base,
      minHeight: "40px",
      gap: computedTheme.spacing.space[2]
    },
    large: {
      padding: `${computedTheme.spacing.space[4]} ${computedTheme.spacing.space[5]}`,
      fontSize: computedTheme.typography.fontSize.lg,
      minHeight: "48px",
      gap: computedTheme.spacing.space[2]
    }
  };
  const currentVariant = variants[variant] || variants.outlined;
  const currentSize = sizes[size] || sizes.medium;
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
  const getInputStyles = () => {
    const baseStyles = {
      width: fullWidth ? "100%" : "auto",
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      minHeight: currentSize.minHeight,
      fontFamily: computedTheme.fontFamily.join(", "),
      fontWeight: computedTheme.typography.fontWeight.normal,
      borderRadius: computedTheme.borderRadius,
      border: currentVariant.border,
      background: currentVariant.background,
      color: computedTheme.colors.text.primary,
      outline: "none",
      transition: shouldAnimate() ? `all ${getMotionDuration("fast")} ${getMotionTiming("ease")}` : "none",
      cursor: disabled ? "not-allowed" : "text",
      opacity: disabled ? 0.6 : 1,
      ...style
    };
    if (isHovered && !disabled && !readOnly) {
      baseStyles.borderColor = currentVariant.hover;
    }
    if (isFocused && !disabled && !readOnly) {
      baseStyles.borderColor = currentVariant.focus;
      baseStyles.boxShadow = `0 0 0 3px ${currentVariant.focus}20`;
    }
    if (error && !disabled) {
      baseStyles.borderColor = currentVariant.error;
      if (isFocused) {
        baseStyles.boxShadow = `0 0 0 3px ${currentVariant.error}20`;
      }
    }
    if (success && !disabled) {
      baseStyles.borderColor = currentVariant.success;
      if (isFocused) {
        baseStyles.boxShadow = `0 0 0 3px ${currentVariant.success}20`;
      }
    }
    if (warning && !disabled) {
      baseStyles.borderColor = currentVariant.warning;
      if (isFocused) {
        baseStyles.boxShadow = `0 0 0 3px ${currentVariant.warning}20`;
      }
    }
    if (readOnly) {
      baseStyles.background = computedTheme.colors.background.tertiary;
      baseStyles.cursor = "default";
    }
    return baseStyles;
  };
  const getLabelStyles = () => {
    return {
      display: "block",
      marginBottom: computedTheme.spacing.space[2],
      fontSize: currentSize.fontSize,
      fontWeight: computedTheme.typography.fontWeight.medium,
      color: computedTheme.colors.text.primary,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1
    };
  };
  const getHelperTextStyles = () => {
    const color = error ? computedTheme.colors.error[600] : success ? computedTheme.colors.success[600] : warning ? computedTheme.colors.warning[600] : computedTheme.colors.text.secondary;
    return {
      display: "block",
      marginTop: computedTheme.spacing.space[2],
      fontSize: computedTheme.typography.fontSize.sm,
      color,
      opacity: disabled ? 0.6 : 1
    };
  };
  const getCharCountStyles = () => {
    const isOverLimit = maxLength && internalValue.length > maxLength;
    return {
      display: "block",
      marginTop: computedTheme.spacing.space[2],
      fontSize: computedTheme.typography.fontSize.sm,
      color: isOverLimit ? computedTheme.colors.error[600] : computedTheme.colors.text.tertiary,
      textAlign: "right"
    };
  };
  const Icon = () => {
    if (!icon) return null;
    return /* @__PURE__ */ jsx(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px",
          color: computedTheme.colors.text.tertiary,
          marginRight: iconPosition === "left" ? computedTheme.spacing.space[2] : 0,
          marginLeft: iconPosition === "right" ? computedTheme.spacing.space[2] : 0
        },
        "aria-hidden": "true",
        children: icon
      }
    );
  };
  const Prefix = () => {
    if (!prefix) return null;
    return /* @__PURE__ */ jsx(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          padding: `0 ${computedTheme.spacing.space[2]}`,
          fontSize: currentSize.fontSize,
          color: computedTheme.colors.text.tertiary,
          background: computedTheme.colors.background.tertiary,
          borderRight: `1px solid ${computedTheme.colors.border.DEFAULT}`,
          borderRadius: `${computedTheme.borderRadius} 0 0 ${computedTheme.borderRadius}`
        },
        children: prefix
      }
    );
  };
  const Suffix = () => {
    if (!suffix) return null;
    return /* @__PURE__ */ jsx(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          padding: `0 ${computedTheme.spacing.space[2]}`,
          fontSize: currentSize.fontSize,
          color: computedTheme.colors.text.tertiary,
          background: computedTheme.colors.background.tertiary,
          borderLeft: `1px solid ${computedTheme.colors.border.DEFAULT}`,
          borderRadius: `0 ${computedTheme.borderRadius} ${computedTheme.borderRadius} 0`
        },
        children: suffix
      }
    );
  };
  const ariaAttributes = {
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid || !!error,
    "aria-required": ariaRequired || required,
    "aria-disabled": ariaDisabled || disabled,
    "aria-readonly": readOnly
  };
  Object.keys(ariaAttributes).forEach((key) => {
    if (ariaAttributes[key] === void 0 || ariaAttributes[key] === null) {
      delete ariaAttributes[key];
    }
  });
  const inputElement = multiline ? /* @__PURE__ */ jsx(
    "textarea",
    {
      ref: inputRef,
      name,
      id,
      value: internalValue,
      defaultValue,
      placeholder,
      required,
      disabled,
      readOnly,
      rows,
      maxLength,
      minLength,
      autoFocus,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown,
      style: getInputStyles(),
      className,
      ...ariaAttributes,
      ...props
    }
  ) : /* @__PURE__ */ jsx(
    "input",
    {
      ref: inputRef,
      type,
      name,
      id,
      value: internalValue,
      defaultValue,
      placeholder,
      required,
      disabled,
      readOnly,
      maxLength,
      minLength,
      pattern,
      autoComplete,
      autoFocus,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown,
      style: getInputStyles(),
      className,
      ...ariaAttributes,
      ...props
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.6 : 1
      },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: [
        label && /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: id,
            style: getLabelStyles(),
            children: [
              label,
              required && /* @__PURE__ */ jsx("span", { style: { color: computedTheme.colors.error[600] }, children: " *" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: currentVariant.background,
              borderRadius: computedTheme.borderRadius,
              border: currentVariant.border,
              ...isFocused && !disabled && !readOnly && {
                borderColor: currentVariant.focus,
                boxShadow: `0 0 0 3px ${currentVariant.focus}20`
              },
              ...error && !disabled && {
                borderColor: currentVariant.error,
                ...isFocused && {
                  boxShadow: `0 0 0 3px ${currentVariant.error}20`
                }
              },
              ...success && !disabled && {
                borderColor: currentVariant.success,
                ...isFocused && {
                  boxShadow: `0 0 0 3px ${currentVariant.success}20`
                }
              },
              ...warning && !disabled && {
                borderColor: currentVariant.warning,
                ...isFocused && {
                  boxShadow: `0 0 0 3px ${currentVariant.warning}20`
                }
              }
            },
            children: [
              iconPosition === "left" && /* @__PURE__ */ jsx(Icon, {}),
              prefix && /* @__PURE__ */ jsx(Prefix, {}),
              inputElement,
              suffix && /* @__PURE__ */ jsx(Suffix, {}),
              iconPosition === "right" && /* @__PURE__ */ jsx(Icon, {})
            ]
          }
        ),
        helperText && /* @__PURE__ */ jsx("span", { style: getHelperTextStyles(), children: helperText }),
        error && /* @__PURE__ */ jsx("span", { style: getHelperTextStyles(), children: error }),
        success && /* @__PURE__ */ jsx("span", { style: getHelperTextStyles(), children: success }),
        warning && /* @__PURE__ */ jsx("span", { style: getHelperTextStyles(), children: warning }),
        maxLength && /* @__PURE__ */ jsxs("span", { style: getCharCountStyles(), children: [
          internalValue.length,
          " / ",
          maxLength
        ] })
      ]
    }
  );
};
Input.Group = ({ children, gap = "medium", className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  const gapSizes = {
    small: computedTheme.spacing.space[1],
    medium: computedTheme.spacing.space[2],
    large: computedTheme.spacing.space[3]
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "flex",
        gap: gapSizes[gap] || gapSizes.medium,
        alignItems: "flex-start",
        ...style
      },
      className,
      role: "group",
      "aria-label": "Input group",
      children
    }
  );
};
Input.Search = ({ onSearch, ...props }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.target.value);
    }
    if (props.onKeyDown) props.onKeyDown(e);
  };
  return /* @__PURE__ */ jsx(
    Input,
    {
      ...props,
      type: "search",
      onKeyDown: handleKeyDown,
      ariaLabel: props.ariaLabel || "Search input"
    }
  );
};
Input.Password = ({ showToggle = true, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return /* @__PURE__ */ jsx(
    Input,
    {
      ...props,
      type: showPassword ? "text" : "password",
      suffix: showToggle ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: togglePassword,
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            color: "inherit"
          },
          "aria-label": showPassword ? "Hide password" : "Show password",
          children: showPassword ? "👁️" : "🔒"
        }
      ) : void 0
    }
  );
};
export {
  Button as B,
  Input as I
};
