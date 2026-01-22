import { jsx, jsxs } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from "react";
const colors = {
  // Core Colors - Brand
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    DEFAULT: "#3b82f6"
  },
  secondary: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    DEFAULT: "#8b5cf6"
  },
  accent: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    DEFAULT: "#10b981"
  },
  // Semantic Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    DEFAULT: "#22c55e"
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    DEFAULT: "#f59e0b"
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    DEFAULT: "#ef4444"
  },
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    DEFAULT: "#3b82f6"
  },
  // Neutral Colors - Light Mode
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    DEFAULT: "#71717a"
  },
  // Light Mode Backgrounds
  background: {
    primary: "#ffffff",
    secondary: "#fafafa",
    tertiary: "#f4f4f5",
    inverse: "#18181b"
  },
  // Light Mode Text
  text: {
    primary: "#18181b",
    secondary: "#52525b",
    tertiary: "#71717a",
    inverse: "#ffffff",
    disabled: "#a1a1aa"
  },
  // Light Mode Borders
  border: {
    light: "#e4e4e7",
    DEFAULT: "#d4d4d8",
    dark: "#a1a1aa"
  },
  // Dark Mode Colors
  dark: {
    background: {
      primary: "#09090b",
      secondary: "#18181b",
      tertiary: "#27272a",
      inverse: "#ffffff"
    },
    text: {
      primary: "#fafafa",
      secondary: "#d4d4d8",
      tertiary: "#a1a1aa",
      inverse: "#18181b",
      disabled: "#52525b"
    },
    border: {
      light: "#27272a",
      DEFAULT: "#3f3f46",
      dark: "#52525b"
    },
    neutral: {
      50: "#18181b",
      100: "#27272a",
      200: "#3f3f46",
      300: "#52525b",
      400: "#71717a",
      500: "#a1a1aa",
      600: "#d4d4d8",
      700: "#e4e4e7",
      800: "#f4f4f5",
      900: "#fafafa"
    }
  },
  // Focus & Accessibility
  focus: {
    ring: "#3b82f6",
    ringOffset: "#ffffff",
    ringOffsetDark: "#09090b"
  },
  // Overlay
  overlay: {
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.3)",
    dark: "rgba(0, 0, 0, 0.5)",
    lightDark: "rgba(255, 255, 255, 0.1)",
    mediumDark: "rgba(255, 255, 255, 0.3)",
    darkDark: "rgba(255, 255, 255, 0.5)"
  },
  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    secondary: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    accent: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    dark: "linear-gradient(135deg, #18181b 0%, #27272a 100%)"
  }
};
const typography = {
  // Font Families
  fontFamily: {
    sans: [
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif"
    ],
    mono: [
      "JetBrains Mono",
      "Fira Code",
      "Consolas",
      "Monaco",
      "Courier New",
      "monospace"
    ],
    display: [
      "Poppins",
      "Inter",
      "system-ui",
      "sans-serif"
    ]
  },
  // Font Sizes (rem units)
  fontSize: {
    xs: "0.75rem",
    // 12px
    sm: "0.875rem",
    // 14px
    base: "1rem",
    // 16px
    lg: "1.125rem",
    // 18px
    xl: "1.25rem",
    // 20px
    "2xl": "1.5rem",
    // 24px
    "3xl": "1.875rem",
    // 30px
    "4xl": "2.25rem",
    // 36px
    "5xl": "3rem",
    // 48px
    "6xl": "3.75rem",
    // 60px
    "7xl": "4.5rem"
    // 72px
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
    black: 900
  },
  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },
  // Letter Spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  // Text Transform
  textTransform: {
    none: "none",
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize"
  },
  // Text Decoration
  textDecoration: {
    none: "none",
    underline: "underline",
    overline: "overline",
    lineThrough: "line-through"
  },
  // Text Align
  textAlign: {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify"
  },
  // Text Overflow
  textOverflow: {
    ellipsis: "ellipsis",
    clip: "clip"
  },
  // White Space
  whiteSpace: {
    normal: "normal",
    nowrap: "nowrap",
    pre: "pre",
    preWrap: "pre-wrap",
    preLine: "pre-line"
  },
  // Word Break
  wordBreak: {
    normal: "normal",
    breakAll: "break-all",
    keepAll: "keep-all",
    breakWord: "break-word"
  },
  // Typography Scale (Mobile First)
  scale: {
    mobile: {
      h1: {
        fontSize: "2.25rem",
        lineHeight: "1.2",
        fontWeight: "700",
        letterSpacing: "-0.025em"
      },
      h2: {
        fontSize: "1.875rem",
        lineHeight: "1.3",
        fontWeight: "600",
        letterSpacing: "-0.025em"
      },
      h3: {
        fontSize: "1.5rem",
        lineHeight: "1.4",
        fontWeight: "600",
        letterSpacing: "-0.025em"
      },
      h4: {
        fontSize: "1.25rem",
        lineHeight: "1.4",
        fontWeight: "600",
        letterSpacing: "0"
      },
      h5: {
        fontSize: "1.125rem",
        lineHeight: "1.5",
        fontWeight: "600",
        letterSpacing: "0"
      },
      h6: {
        fontSize: "1rem",
        lineHeight: "1.5",
        fontWeight: "600",
        letterSpacing: "0"
      },
      body: {
        fontSize: "1rem",
        lineHeight: "1.6",
        fontWeight: "400",
        letterSpacing: "0"
      },
      bodySmall: {
        fontSize: "0.875rem",
        lineHeight: "1.6",
        fontWeight: "400",
        letterSpacing: "0"
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: "1.5",
        fontWeight: "400",
        letterSpacing: "0"
      }
    },
    desktop: {
      h1: {
        fontSize: "3rem",
        lineHeight: "1.1",
        fontWeight: "700",
        letterSpacing: "-0.025em"
      },
      h2: {
        fontSize: "2.25rem",
        lineHeight: "1.2",
        fontWeight: "700",
        letterSpacing: "-0.025em"
      },
      h3: {
        fontSize: "1.875rem",
        lineHeight: "1.3",
        fontWeight: "600",
        letterSpacing: "-0.025em"
      },
      h4: {
        fontSize: "1.5rem",
        lineHeight: "1.4",
        fontWeight: "600",
        letterSpacing: "0"
      },
      h5: {
        fontSize: "1.25rem",
        lineHeight: "1.4",
        fontWeight: "600",
        letterSpacing: "0"
      },
      h6: {
        fontSize: "1.125rem",
        lineHeight: "1.5",
        fontWeight: "600",
        letterSpacing: "0"
      },
      body: {
        fontSize: "1.125rem",
        lineHeight: "1.7",
        fontWeight: "400",
        letterSpacing: "0"
      },
      bodySmall: {
        fontSize: "1rem",
        lineHeight: "1.6",
        fontWeight: "400",
        letterSpacing: "0"
      },
      caption: {
        fontSize: "0.875rem",
        lineHeight: "1.5",
        fontWeight: "400",
        letterSpacing: "0"
      }
    }
  }
};
const spacing = {
  // Base unit (8px)
  base: 8,
  // Spacing scale (rem units)
  space: {
    0: "0",
    0.5: "0.125rem",
    // 2px
    1: "0.25rem",
    // 4px
    1.5: "0.375rem",
    // 6px
    2: "0.5rem",
    // 8px
    2.5: "0.625rem",
    // 10px
    3: "0.75rem",
    // 12px
    3.5: "0.875rem",
    // 14px
    4: "1rem",
    // 16px
    5: "1.25rem",
    // 20px
    6: "1.5rem",
    // 24px
    7: "1.75rem",
    // 28px
    8: "2rem",
    // 32px
    9: "2.25rem",
    // 36px
    10: "2.5rem",
    // 40px
    11: "2.75rem",
    // 44px
    12: "3rem",
    // 48px
    14: "3.5rem",
    // 56px
    16: "4rem",
    // 64px
    20: "5rem",
    // 80px
    24: "6rem",
    // 96px
    28: "7rem",
    // 112px
    32: "8rem",
    // 128px
    36: "9rem",
    // 144px
    40: "10rem",
    // 160px
    44: "11rem",
    // 176px
    48: "12rem",
    // 192px
    52: "13rem",
    // 208px
    56: "14rem",
    // 224px
    60: "15rem",
    // 240px
    64: "16rem",
    // 256px
    72: "18rem",
    // 288px
    80: "20rem",
    // 320px
    96: "24rem"
    // 384px,
  },
  // Layout spacing
  layout: {
    container: {
      mobile: "1rem",
      tablet: "1.5rem",
      desktop: "2rem",
      wide: "3rem"
    },
    section: {
      mobile: "3rem",
      desktop: "5rem"
    },
    grid: {
      gap: {
        mobile: "1rem",
        tablet: "1.5rem",
        desktop: "2rem"
      },
      column: {
        mobile: "1rem",
        tablet: "1.5rem",
        desktop: "2rem"
      }
    }
  },
  // Component spacing
  component: {
    button: {
      padding: {
        x: "1rem",
        y: "0.75rem"
      },
      gap: "0.5rem"
    },
    input: {
      padding: {
        x: "0.875rem",
        y: "0.625rem"
      }
    },
    card: {
      padding: {
        mobile: "1.25rem",
        desktop: "1.5rem"
      },
      gap: "1rem"
    },
    modal: {
      padding: {
        mobile: "1.5rem",
        desktop: "2rem"
      }
    },
    drawer: {
      padding: {
        mobile: "1rem",
        desktop: "1.5rem"
      }
    }
  },
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    dropdown: 1e3,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
    notification: 1090,
    overlay: 1100,
    max: 9999
  },
  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    // 2px
    DEFAULT: "0.25rem",
    // 4px
    md: "0.375rem",
    // 6px
    lg: "0.5rem",
    // 8px
    xl: "0.75rem",
    // 12px
    "2xl": "1rem",
    // 16px
    "3xl": "1.5rem",
    // 24px
    full: "9999px"
  },
  // Border width
  borderWidth: {
    0: "0",
    DEFAULT: "1px",
    2: "2px",
    4: "4px",
    8: "8px"
  },
  // Shadow
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "none"
  },
  // Dark mode shadows
  shadowDark: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
    none: "none"
  },
  // Opacity
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.1",
    20: "0.2",
    25: "0.25",
    30: "0.3",
    40: "0.4",
    50: "0.5",
    60: "0.6",
    70: "0.7",
    75: "0.75",
    80: "0.8",
    90: "0.9",
    95: "0.95",
    100: "1"
  },
  // Transition
  transition: {
    duration: {
      fastest: "75ms",
      fast: "150ms",
      DEFAULT: "200ms",
      slow: "300ms",
      slower: "500ms",
      slowest: "700ms"
    },
    timing: {
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      linear: "linear"
    },
    property: {
      all: "all",
      opacity: "opacity",
      transform: "transform",
      color: "color",
      background: "background",
      border: "border",
      shadow: "box-shadow"
    }
  },
  // Animation
  animation: {
    fadeIn: {
      keyframes: {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      duration: "200ms",
      timing: "ease-out"
    },
    fadeOut: {
      keyframes: {
        from: { opacity: 1 },
        to: { opacity: 0 }
      },
      duration: "200ms",
      timing: "ease-in"
    },
    slideIn: {
      keyframes: {
        from: { transform: "translateY(-10px)", opacity: 0 },
        to: { transform: "translateY(0)", opacity: 1 }
      },
      duration: "300ms",
      timing: "ease-out"
    },
    slideOut: {
      keyframes: {
        from: { transform: "translateY(0)", opacity: 1 },
        to: { transform: "translateY(-10px)", opacity: 0 }
      },
      duration: "200ms",
      timing: "ease-in"
    },
    scaleIn: {
      keyframes: {
        from: { transform: "scale(0.95)", opacity: 0 },
        to: { transform: "scale(1)", opacity: 1 }
      },
      duration: "200ms",
      timing: "ease-out"
    },
    scaleOut: {
      keyframes: {
        from: { transform: "scale(1)", opacity: 1 },
        to: { transform: "scale(0.95)", opacity: 0 }
      },
      duration: "150ms",
      timing: "ease-in"
    },
    shake: {
      keyframes: {
        "0%, 100%": { transform: "translateX(0)" },
        "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
        "20%, 40%, 60%, 80%": { transform: "translateX(2px)" }
      },
      duration: "400ms",
      timing: "ease-in-out"
    },
    pulse: {
      keyframes: {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.5 }
      },
      duration: "2000ms",
      timing: "ease-in-out"
    },
    bounce: {
      keyframes: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-25%)" }
      },
      duration: "1000ms",
      timing: "cubic-bezier(0.280, 0.840, 0.420, 1)"
    }
  }
};
const ThemeConfig = {
  mode: "light",
  // 'light' | 'dark' | 'auto'
  primaryColor: "primary",
  secondaryColor: "secondary",
  accentColor: "accent",
  borderRadius: "DEFAULT",
  fontFamily: "sans",
  fontSize: "base",
  motionEnabled: true,
  motionIntensity: "medium",
  // 'low' | 'medium' | 'high'
  focusVisible: true,
  reducedMotion: false,
  highContrast: false,
  customTheme: {}
};
const ThemeContext = createContext({
  theme: ThemeConfig,
  setTheme: () => {
  },
  toggleTheme: () => {
  },
  getThemeValue: () => {
  },
  isDarkMode: false
});
const ThemeProvider = ({ children, initialTheme = ThemeConfig }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("design-system-theme");
      if (saved) {
        try {
          return { ...ThemeConfig, ...JSON.parse(saved) };
        } catch (e) {
          return initialTheme;
        }
      }
    }
    return initialTheme;
  });
  useEffect(() => {
    if (theme.mode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        setTheme((prev) => ({ ...prev, isDarkMode: e.matches }));
      };
      handleChange(mediaQuery);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme.mode]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("design-system-theme", JSON.stringify(theme));
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
      isDarkMode: prev.mode === "light"
    }));
  };
  const getThemeValue = (path, defaultValue = null) => {
    const keys = path.split(".");
    let value = theme;
    for (const key of keys) {
      if (value && value[key] !== void 0) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    return value;
  };
  const isDarkMode = theme.mode === "dark" || theme.mode === "auto" && theme.isDarkMode;
  const computedTheme = {
    colors: isDarkMode ? colors.dark : colors,
    typography,
    spacing,
    mode: isDarkMode ? "dark" : "light",
    primaryColor: colors[theme.primaryColor] || colors.primary,
    secondaryColor: colors[theme.secondaryColor] || colors.secondary,
    accentColor: colors[theme.accentColor] || colors.accent,
    borderRadius: spacing.borderRadius[theme.borderRadius] || spacing.borderRadius.DEFAULT,
    fontFamily: typography.fontFamily[theme.fontFamily] || typography.fontFamily.sans,
    fontSize: typography.fontSize[theme.fontSize] || typography.fontSize.base,
    motionEnabled: theme.motionEnabled && !theme.reducedMotion,
    motionIntensity: theme.motionIntensity,
    focusVisible: theme.focusVisible,
    highContrast: theme.highContrast,
    customTheme: theme.customTheme
  };
  return /* @__PURE__ */ jsx(
    ThemeContext.Provider,
    {
      value: {
        theme,
        setTheme,
        toggleTheme,
        getThemeValue,
        isDarkMode,
        computedTheme
      },
      children
    }
  );
};
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
const useMotion = () => {
  const { computedTheme } = useTheme();
  const getMotionDuration = (duration = "DEFAULT") => {
    if (!computedTheme.motionEnabled) return "0ms";
    return computedTheme.spacing.transition.duration[duration] || computedTheme.spacing.transition.duration.DEFAULT;
  };
  const getMotionTiming = (timing = "ease") => {
    return computedTheme.spacing.transition.timing[timing] || computedTheme.spacing.transition.timing.ease;
  };
  const getAnimation = (name) => {
    if (!computedTheme.motionEnabled) return { keyframes: {}, duration: "0ms", timing: "linear" };
    return computedTheme.spacing.animation[name] || computedTheme.spacing.animation.fadeIn;
  };
  const shouldAnimate2 = () => {
    return computedTheme.motionEnabled && !computedTheme.reducedMotion;
  };
  return {
    getMotionDuration,
    getMotionTiming,
    getAnimation,
    shouldAnimate: shouldAnimate2,
    intensity: computedTheme.motionIntensity,
    enabled: computedTheme.motionEnabled
  };
};
const useAccessibility = () => {
  const { computedTheme } = useTheme();
  const getFocusStyles = () => ({
    outline: computedTheme.focusVisible ? `2px solid ${computedTheme.colors.focus.ring}` : "none",
    outlineOffset: computedTheme.focusVisible ? "2px" : "0",
    boxShadow: computedTheme.focusVisible ? `0 0 0 4px ${computedTheme.colors.focus.ring}20` : "none"
  });
  const getReducedMotion = () => {
    return computedTheme.reducedMotion || !computedTheme.motionEnabled;
  };
  const getHighContrast = () => {
    return computedTheme.highContrast;
  };
  const getSkipLinkStyles = () => ({
    position: "absolute",
    top: "-100%",
    left: "0",
    padding: computedTheme.spacing.space[4],
    background: computedTheme.colors.primary[600],
    color: computedTheme.colors.text.inverse,
    zIndex: computedTheme.spacing.zIndex.max,
    textDecoration: "none",
    borderRadius: computedTheme.borderRadius,
    "&:focus": {
      top: "0",
      outline: "2px solid #fff",
      outlineOffset: "2px"
    }
  });
  return {
    getFocusStyles,
    getReducedMotion,
    getHighContrast,
    getSkipLinkStyles
  };
};
const useThemeConfig = () => {
  const { theme, setTheme } = useTheme();
  const updateTheme = (updates) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };
  const resetTheme = () => {
    setTheme(ThemeConfig);
  };
  const exportTheme = () => {
    return JSON.stringify(theme, null, 2);
  };
  const importTheme = (config) => {
    try {
      const parsed = typeof config === "string" ? JSON.parse(config) : config;
      setTheme({ ...ThemeConfig, ...parsed });
      return true;
    } catch (e) {
      return false;
    }
  };
  const validateTheme = (config) => {
    const required = ["mode", "primaryColor", "secondaryColor", "accentColor"];
    const missing = required.filter((key) => !config[key]);
    return {
      valid: missing.length === 0,
      missing,
      errors: missing.map((key) => `Missing required field: ${key}`)
    };
  };
  return {
    theme,
    updateTheme,
    resetTheme,
    exportTheme,
    importTheme,
    validateTheme
  };
};
const Card = ({
  children,
  variant = "elevated",
  size = "medium",
  hoverable = false,
  clickable = false,
  disabled = false,
  elevation = "md",
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
  className = "",
  style = {},
  ...props
}) => {
  const { computedTheme } = useTheme();
  const { getMotionDuration, getMotionTiming, shouldAnimate: shouldAnimate2 } = useMotion();
  const { getFocusStyles } = useAccessibility();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const variants = {
    elevated: {
      background: computedTheme.colors.background.primary,
      border: "none",
      shadow: computedTheme.spacing.shadow.md,
      shadowDark: computedTheme.spacing.shadowDark.md
    },
    outlined: {
      background: computedTheme.colors.background.primary,
      border: `1px solid ${computedTheme.colors.border.DEFAULT}`,
      shadow: "none",
      shadowDark: "none"
    },
    filled: {
      background: computedTheme.colors.background.tertiary,
      border: "none",
      shadow: "none",
      shadowDark: "none"
    },
    ghost: {
      background: "transparent",
      border: `1px dashed ${computedTheme.colors.border.DEFAULT}`,
      shadow: "none",
      shadowDark: "none"
    }
  };
  const sizes = {
    small: {
      padding: computedTheme.spacing.space[4],
      gap: computedTheme.spacing.space[3],
      borderRadius: computedTheme.borderRadius
    },
    medium: {
      padding: computedTheme.spacing.space[6],
      gap: computedTheme.spacing.space[4],
      borderRadius: computedTheme.borderRadius
    },
    large: {
      padding: computedTheme.spacing.space[8],
      gap: computedTheme.spacing.space[5],
      borderRadius: computedTheme.borderRadius
    }
  };
  ({
    sm: computedTheme.spacing.shadow.sm,
    md: computedTheme.spacing.shadow.md,
    lg: computedTheme.spacing.shadow.lg,
    xl: computedTheme.spacing.shadow.xl,
    "2xl": computedTheme.spacing.shadow["2xl"]
  });
  const currentVariant = variants[variant] || variants.elevated;
  const currentSize = sizes[size] || sizes.medium;
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
  const getCardStyles = () => {
    const baseStyles = {
      display: "flex",
      flexDirection: "column",
      gap: currentSize.gap,
      padding: currentSize.padding,
      borderRadius: currentSize.borderRadius,
      background: currentVariant.background,
      border: currentVariant.border,
      transition: shouldAnimate2() ? `all ${getMotionDuration("fast")} ${getMotionTiming("ease")}` : "none",
      cursor: disabled ? "not-allowed" : clickable ? "pointer" : "default",
      opacity: disabled ? 0.6 : 1,
      ...style
    };
    if (isHovered && !disabled && hoverable) {
      baseStyles.transform = shouldAnimate2() ? "translateY(-2px)" : "none";
      baseStyles.boxShadow = computedTheme.isDarkMode ? currentVariant.shadowDark : currentVariant.shadow;
    }
    if (isPressed && !disabled && clickable) {
      baseStyles.transform = shouldAnimate2() ? "translateY(0)" : "none";
      baseStyles.boxShadow = computedTheme.spacing.shadow.sm;
    }
    if (clickable) {
      baseStyles["&:focus-visible"] = getFocusStyles();
    }
    if (variant === "elevated" && !isHovered) {
      baseStyles.boxShadow = computedTheme.isDarkMode ? currentVariant.shadowDark : currentVariant.shadow;
    }
    return baseStyles;
  };
  const getHeaderStyles = () => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: computedTheme.spacing.space[4],
    paddingBottom: computedTheme.spacing.space[4],
    borderBottom: `1px solid ${computedTheme.colors.border.light}`
  });
  const getTitleStyles = () => ({
    fontSize: computedTheme.typography.fontSize.lg,
    fontWeight: computedTheme.typography.fontWeight.semibold,
    color: computedTheme.colors.text.primary,
    margin: 0
  });
  const getDescriptionStyles = () => ({
    fontSize: computedTheme.typography.fontSize.sm,
    color: computedTheme.colors.text.secondary,
    margin: 0
  });
  const getFooterStyles = () => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: computedTheme.spacing.space[2],
    paddingTop: computedTheme.spacing.space[4],
    borderTop: `1px solid ${computedTheme.colors.border.light}`
  });
  const Icon = () => {
    if (!icon) return null;
    return /* @__PURE__ */ jsx(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          color: computedTheme.colors.text.secondary
        },
        "aria-hidden": "true",
        children: icon
      }
    );
  };
  const ariaAttributes = {
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-disabled": disabled,
    role: role || (clickable ? "button" : "article")
  };
  Object.keys(ariaAttributes).forEach((key) => {
    if (ariaAttributes[key] === void 0 || ariaAttributes[key] === null) {
      delete ariaAttributes[key];
    }
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: getCardStyles(),
      className,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onClick: handleClick,
      tabIndex: clickable && !disabled ? 0 : void 0,
      ...ariaAttributes,
      ...props,
      children: [
        header || (title || description || icon) ? /* @__PURE__ */ jsxs("div", { style: getHeaderStyles(), children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: computedTheme.spacing.space[3] }, children: [
            /* @__PURE__ */ jsx(Icon, {}),
            /* @__PURE__ */ jsxs("div", { children: [
              title && /* @__PURE__ */ jsx("h3", { style: getTitleStyles(), children: title }),
              description && /* @__PURE__ */ jsx("p", { style: getDescriptionStyles(), children: description })
            ] })
          ] }),
          actions
        ] }) : null,
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: currentSize.gap }, children }),
        footer && /* @__PURE__ */ jsx("div", { style: getFooterStyles(), children: footer })
      ]
    }
  );
};
Card.Group = ({ children, columns = 1, gap = "medium", className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  const gapSizes = {
    small: computedTheme.spacing.space[2],
    medium: computedTheme.spacing.space[4],
    large: computedTheme.spacing.space[6]
  };
  const columnSizes = {
    1: "1fr",
    2: "repeat(2, 1fr)",
    3: "repeat(3, 1fr)",
    4: "repeat(4, 1fr)"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: columnSizes[columns] || columnSizes[1],
        gap: gapSizes[gap] || gapSizes.medium,
        ...style
      },
      className,
      role: "list",
      "aria-label": "Card group",
      children: React.Children.map(
        children,
        (child, index) => React.cloneElement(child, { role: "listitem", "aria-posinset": index + 1, "aria-setsize": React.Children.count(children) })
      )
    }
  );
};
Card.Skeleton = ({ size = "medium", className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  const { getAnimation } = useMotion();
  const sizes = {
    small: {
      padding: computedTheme.spacing.space[4],
      height: "120px"
    },
    medium: {
      padding: computedTheme.spacing.space[6],
      height: "180px"
    },
    large: {
      padding: computedTheme.spacing.space[8],
      height: "240px"
    }
  };
  const currentSize = sizes[size] || sizes.medium;
  const skeletonAnimation = getAnimation("pulse");
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        padding: currentSize.padding,
        borderRadius: computedTheme.borderRadius,
        background: computedTheme.colors.background.tertiary,
        height: currentSize.height,
        animation: shouldAnimate() ? `${skeletonAnimation.duration} ${skeletonAnimation.timing} infinite` : "none",
        opacity: 0.5,
        ...style
      },
      className,
      "aria-busy": "true",
      "aria-label": "Loading content"
    }
  );
};
Card.Error = ({ title, message, onRetry, className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: title || "Erro",
      description: message,
      icon: /* @__PURE__ */ jsx("span", { style: { color: computedTheme.colors.error[600] }, children: "⚠️" }),
      footer: onRetry ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onRetry,
          style: {
            background: computedTheme.colors.error[600],
            color: computedTheme.colors.text.inverse,
            border: "none",
            padding: `${computedTheme.spacing.space[2]} ${computedTheme.spacing.space[4]}`,
            borderRadius: computedTheme.borderRadius,
            cursor: "pointer",
            fontWeight: computedTheme.typography.fontWeight.semibold
          },
          "aria-label": "Tentar novamente",
          children: "Tentar novamente"
        }
      ) : null,
      className,
      style: {
        borderColor: computedTheme.colors.error[500],
        background: computedTheme.colors.error[50],
        ...style
      },
      "aria-live": "assertive"
    }
  );
};
Card.Success = ({ title, message, className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: title || "Sucesso",
      description: message,
      icon: /* @__PURE__ */ jsx("span", { style: { color: computedTheme.colors.success[600] }, children: "✓" }),
      className,
      style: {
        borderColor: computedTheme.colors.success[500],
        background: computedTheme.colors.success[50],
        ...style
      },
      "aria-live": "polite"
    }
  );
};
Card.Warning = ({ title, message, className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: title || "Atenção",
      description: message,
      icon: /* @__PURE__ */ jsx("span", { style: { color: computedTheme.colors.warning[600] }, children: "⚠" }),
      className,
      style: {
        borderColor: computedTheme.colors.warning[500],
        background: computedTheme.colors.warning[50],
        ...style
      },
      "aria-live": "polite"
    }
  );
};
export {
  Card as C,
  ThemeProvider as T,
  useThemeConfig as a,
  useMotion as b,
  useAccessibility as c,
  useTheme as u
};
