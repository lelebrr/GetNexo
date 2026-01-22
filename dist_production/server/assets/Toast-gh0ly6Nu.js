import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useRef } from "react";
import { u as useTheme, b as useMotion } from "./Card-Dsq8OXHI.js";
const Loading = ({
  size = "medium",
  variant = "spinner",
  color = "primary",
  text = "Carregando...",
  fullscreen = false,
  overlay = false,
  ariaLabel = "Carregando",
  className = "",
  style = {}
}) => {
  const { computedTheme } = useTheme();
  const { getMotionDuration, shouldAnimate: shouldAnimate2 } = useMotion();
  const sizes = {
    small: {
      width: "16px",
      height: "16px",
      borderWidth: "2px",
      fontSize: computedTheme.typography.fontSize.sm
    },
    medium: {
      width: "24px",
      height: "24px",
      borderWidth: "3px",
      fontSize: computedTheme.typography.fontSize.base
    },
    large: {
      width: "32px",
      height: "32px",
      borderWidth: "4px",
      fontSize: computedTheme.typography.fontSize.lg
    }
  };
  const currentSize = sizes[size] || sizes.medium;
  const getColor = () => {
    const colorMap = {
      primary: computedTheme.primaryColor[500] || computedTheme.colors.primary[500],
      secondary: computedTheme.secondaryColor[500] || computedTheme.colors.secondary[500],
      accent: computedTheme.accentColor[500] || computedTheme.colors.accent[500],
      success: computedTheme.colors.success[500],
      warning: computedTheme.colors.warning[500],
      error: computedTheme.colors.error[500],
      neutral: computedTheme.colors.neutral[500]
    };
    return colorMap[color] || colorMap.primary;
  };
  const Spinner = () => /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        width: currentSize.width,
        height: currentSize.height,
        border: `${currentSize.borderWidth} solid ${getColor()}20`,
        borderTop: `${currentSize.borderWidth} solid ${getColor()}`,
        borderRadius: "50%",
        animation: shouldAnimate2() ? `spin ${getMotionDuration("slow")} linear infinite` : "none",
        ...style
      },
      role: "status",
      "aria-label": ariaLabel,
      "aria-live": "polite"
    }
  );
  const Dots = () => /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "flex",
        gap: computedTheme.spacing.space[1],
        alignItems: "center",
        ...style
      },
      role: "status",
      "aria-label": ariaLabel,
      "aria-live": "polite",
      children: [0, 1, 2].map((index) => /* @__PURE__ */ jsx(
        "span",
        {
          style: {
            width: currentSize.width,
            height: currentSize.height,
            background: getColor(),
            borderRadius: "50%",
            animation: shouldAnimate2() ? `bounce ${getMotionDuration("slow")} ease-in-out infinite` : "none",
            animationDelay: `${index * 0.1}s`
          }
        },
        index
      ))
    }
  );
  const Bars = () => /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "flex",
        gap: computedTheme.spacing.space[1],
        alignItems: "flex-end",
        height: currentSize.height,
        ...style
      },
      role: "status",
      "aria-label": ariaLabel,
      "aria-live": "polite",
      children: [0, 1, 2].map((index) => /* @__PURE__ */ jsx(
        "span",
        {
          style: {
            width: currentSize.width,
            height: "100%",
            background: getColor(),
            borderRadius: "2px",
            animation: shouldAnimate2() ? `wave ${getMotionDuration("slow")} ease-in-out infinite` : "none",
            animationDelay: `${index * 0.1}s`
          }
        },
        index
      ))
    }
  );
  const Pulse = () => /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        position: "relative",
        width: currentSize.width,
        height: currentSize.height,
        ...style
      },
      role: "status",
      "aria-label": ariaLabel,
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: getColor(),
              borderRadius: "50%",
              opacity: 0.6,
              animation: shouldAnimate2() ? `pulse ${getMotionDuration("slow")} ease-in-out infinite` : "none"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: getColor(),
              borderRadius: "50%",
              opacity: 0.3,
              animation: shouldAnimate2() ? `pulse ${getMotionDuration("slow")} ease-in-out infinite` : "none",
              animationDelay: "0.3s"
            }
          }
        )
      ]
    }
  );
  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return /* @__PURE__ */ jsx(Dots, {});
      case "bars":
        return /* @__PURE__ */ jsx(Bars, {});
      case "pulse":
        return /* @__PURE__ */ jsx(Pulse, {});
      case "spinner":
      default:
        return /* @__PURE__ */ jsx(Spinner, {});
    }
  };
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: computedTheme.spacing.space[3],
    padding: fullscreen ? computedTheme.spacing.space[8] : computedTheme.spacing.space[4],
    ...fullscreen && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: computedTheme.colors.background.primary,
      zIndex: computedTheme.spacing.zIndex.max
    },
    ...overlay && {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: computedTheme.colors.overlay.light,
      zIndex: computedTheme.spacing.zIndex.modal
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: containerStyles,
      className,
      "aria-live": "polite",
      "aria-busy": "true",
      children: [
        renderVariant(),
        text && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontSize: currentSize.fontSize,
              color: computedTheme.colors.text.secondary,
              textAlign: "center"
            },
            children: text
          }
        )
      ]
    }
  );
};
Loading.Skeleton = ({
  count = 3,
  height = "20px",
  width = "100%",
  variant = "line",
  className = "",
  style = {}
}) => {
  const { computedTheme } = useTheme();
  const { getAnimation } = useMotion();
  const animation = getAnimation("pulse");
  const skeletonStyles = {
    background: computedTheme.colors.background.tertiary,
    borderRadius: computedTheme.borderRadius,
    animation: shouldAnimate() ? `${animation.duration} ${animation.timing} infinite` : "none",
    opacity: 0.5,
    ...style
  };
  const renderSkeleton = () => {
    switch (variant) {
      case "circle":
        return /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              ...skeletonStyles,
              width: height,
              height,
              borderRadius: "50%"
            },
            className,
            "aria-label": "Loading content"
          }
        );
      case "card":
        return /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              ...skeletonStyles,
              height,
              width,
              display: "flex",
              flexDirection: "column",
              gap: computedTheme.spacing.space[2]
            },
            className,
            "aria-label": "Loading content",
            children: [
              /* @__PURE__ */ jsx("div", { style: { ...skeletonStyles, height: "20px", width: "60%" } }),
              /* @__PURE__ */ jsx("div", { style: { ...skeletonStyles, height: "16px", width: "80%" } }),
              /* @__PURE__ */ jsx("div", { style: { ...skeletonStyles, height: "16px", width: "90%" } })
            ]
          }
        );
      case "line":
      default:
        return /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: computedTheme.spacing.space[2]
            },
            "aria-label": "Loading content",
            children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  ...skeletonStyles,
                  height,
                  width
                },
                className
              },
              index
            ))
          }
        );
    }
  };
  return renderSkeleton();
};
Loading.FullScreen = ({ text = "Carregando...", variant = "spinner", color = "primary" }) => {
  return /* @__PURE__ */ jsx(
    Loading,
    {
      variant,
      color,
      text,
      fullscreen: true,
      ariaLabel: "Carregando conteúdo"
    }
  );
};
Loading.Overlay = ({ text = "Carregando...", variant = "spinner", color = "primary" }) => {
  return /* @__PURE__ */ jsx(
    Loading,
    {
      variant,
      color,
      text,
      overlay: true,
      ariaLabel: "Carregando conteúdo"
    }
  );
};
const ToastContext = React.createContext();
const ToastProvider = ({ children, position = "top-right", duration = 5e3 }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);
  const addToast = (message, options = {}) => {
    const id = ++toastIdRef.current;
    const toast = {
      id,
      message,
      type: options.type || "info",
      duration: options.duration || duration,
      position: options.position || position,
      onClose: options.onClose,
      action: options.action,
      icon: options.icon
    };
    setToasts((prev) => [...prev, toast]);
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
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: { addToast, removeToast, clearToasts, toasts }, children: [
    children,
    /* @__PURE__ */ jsx(ToastContainer, { toasts, onRemove: removeToast })
  ] });
};
const ToastContainer = ({ toasts, onRemove }) => {
  const { computedTheme } = useTheme();
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || "top-right";
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {});
  const positions = {
    "top-left": { top: "1rem", left: "1rem" },
    "top-right": { top: "1rem", right: "1rem" },
    "top-center": { top: "1rem", left: "50%", transform: "translateX(-50%)" },
    "bottom-left": { bottom: "1rem", left: "1rem" },
    "bottom-right": { bottom: "1rem", right: "1rem" },
    "bottom-center": { bottom: "1rem", left: "50%", transform: "translateX(-50%)" }
  };
  return /* @__PURE__ */ jsx(Fragment, { children: Object.entries(groupedToasts).map(([position, toastList]) => /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "fixed",
        zIndex: computedTheme.spacing.zIndex.toast,
        display: "flex",
        flexDirection: "column",
        gap: computedTheme.spacing.space[2],
        pointerEvents: "none",
        ...positions[position]
      },
      role: "region",
      "aria-label": `Notificações ${position}`,
      children: toastList.map((toast) => /* @__PURE__ */ jsx(ToastItem, { toast, onRemove }, toast.id))
    },
    position
  )) });
};
const ToastItem = ({ toast, onRemove }) => {
  const { computedTheme } = useTheme();
  const { getMotionDuration, getMotionTiming, shouldAnimate: shouldAnimate2 } = useMotion();
  const [isExiting, setIsExiting] = useState(false);
  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, shouldAnimate2() ? 200 : 0);
  };
  const types = {
    success: {
      background: computedTheme.colors.success[50],
      border: computedTheme.colors.success[500],
      color: computedTheme.colors.success[900],
      icon: toast.icon || "✓"
    },
    error: {
      background: computedTheme.colors.error[50],
      border: computedTheme.colors.error[500],
      color: computedTheme.colors.error[900],
      icon: toast.icon || "✕"
    },
    warning: {
      background: computedTheme.colors.warning[50],
      border: computedTheme.colors.warning[500],
      color: computedTheme.colors.warning[900],
      icon: toast.icon || "⚠"
    },
    info: {
      background: computedTheme.colors.info[50],
      border: computedTheme.colors.info[500],
      color: computedTheme.colors.info[900],
      icon: toast.icon || "ℹ"
    }
  };
  const currentType = types[toast.type] || types.info;
  const animationStyles = shouldAnimate2() ? {
    animation: isExiting ? `slideOut ${getMotionDuration("fast")} ${getMotionTiming("ease")}` : `slideIn ${getMotionDuration("fast")} ${getMotionTiming("ease")}`
  } : {};
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: computedTheme.spacing.space[3],
        padding: computedTheme.spacing.space[4],
        background: currentType.background,
        borderLeft: `4px solid ${currentType.border}`,
        borderRadius: computedTheme.borderRadius,
        boxShadow: computedTheme.spacing.shadow.lg,
        maxWidth: "400px",
        pointerEvents: "auto",
        ...animationStyles
      },
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true",
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontSize: computedTheme.typography.fontSize.lg,
              fontWeight: computedTheme.typography.fontWeight.bold,
              color: currentType.color,
              flexShrink: 0
            },
            "aria-hidden": "true",
            children: currentType.icon
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                fontSize: computedTheme.typography.fontSize.base,
                fontWeight: computedTheme.typography.fontWeight.medium,
                color: currentType.color,
                marginBottom: toast.action ? computedTheme.spacing.space[2] : 0
              },
              children: toast.message
            }
          ),
          toast.action && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                toast.action.onClick();
                handleRemove();
              },
              style: {
                background: currentType.border,
                color: computedTheme.colors.text.inverse,
                border: "none",
                padding: `${computedTheme.spacing.space[1]} ${computedTheme.spacing.space[3]}`,
                borderRadius: computedTheme.borderRadius,
                cursor: "pointer",
                fontSize: computedTheme.typography.fontSize.sm,
                fontWeight: computedTheme.typography.fontWeight.medium
              },
              "aria-label": toast.action.label,
              children: toast.action.label
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleRemove,
            style: {
              background: "transparent",
              border: "none",
              color: currentType.color,
              cursor: "pointer",
              padding: computedTheme.spacing.space[1],
              fontSize: computedTheme.typography.fontSize.lg,
              lineHeight: 1,
              opacity: 0.7,
              transition: shouldAnimate2() ? `opacity ${getMotionDuration("fast")} ${getMotionTiming("ease")}` : "none"
            },
            onMouseEnter: (e) => {
              e.target.style.opacity = "1";
            },
            onMouseLeave: (e) => {
              e.target.style.opacity = "0.7";
            },
            "aria-label": "Fechar notificação",
            children: "×"
          }
        )
      ]
    }
  );
};
const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
const Toast = {
  success: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast(message, { ...options, type: "success" });
  },
  error: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast(message, { ...options, type: "error" });
  },
  warning: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast(message, { ...options, type: "warning" });
  },
  info: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast(message, { ...options, type: "info" });
  }
};
export {
  Loading as L,
  ToastProvider as T,
  Toast as a,
  useToast as u
};
