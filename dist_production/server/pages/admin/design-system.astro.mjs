import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useTheme, a as useThemeConfig, C as Card } from "../../assets/Card-Dsq8OXHI.js";
import { B as Button, I as Input } from "../../assets/Input-WBWOzuho.js";
import { T as ToastProvider, u as useToast, L as Loading } from "../../assets/Toast-gh0ly6Nu.js";
import { u as useSkipLinks } from "../../assets/SkipLinks-CkCTahpm.js";
/* empty css                                           */
import { renderers } from "../../renderers.mjs";
const motionDurations = {
  instant: 0,
  fastest: 75,
  fast: 150,
  default: 200,
  slow: 300,
  slower: 500,
  slowest: 700
};
const motionGuidelines = {
  durations: motionDurations
};
const ColorPreview = ({ name, color, isDarkMode = false }) => {
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: computedTheme.spacing.space[3],
        padding: computedTheme.spacing.space[3],
        borderRadius: computedTheme.borderRadius,
        background: isDarkMode ? computedTheme.colors.background.tertiary : computedTheme.colors.background.primary,
        border: `1px solid ${computedTheme.colors.border.light}`
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "40px",
              height: "40px",
              borderRadius: computedTheme.borderRadius,
              background: color,
              border: `1px solid ${computedTheme.colors.border.light}`
            },
            "aria-label": `Preview da cor ${name}`
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: computedTheme.typography.fontWeight.medium }, children: name }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }, children: color })
        ] })
      ]
    }
  );
};
const ThemePreview = ({ theme, isDarkMode }) => {
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: `Preview ${isDarkMode ? "Dark" : "Light"} Mode`,
      description: "Visualização do tema atual",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: computedTheme.spacing.space[3] }, children: [
        /* @__PURE__ */ jsx(ColorPreview, { name: "Primary", color: theme.primaryColor[600], isDarkMode }),
        /* @__PURE__ */ jsx(ColorPreview, { name: "Secondary", color: theme.secondaryColor[600], isDarkMode }),
        /* @__PURE__ */ jsx(ColorPreview, { name: "Accent", color: theme.accentColor[600], isDarkMode }),
        /* @__PURE__ */ jsx(ColorPreview, { name: "Success", color: theme.colors.success[600], isDarkMode }),
        /* @__PURE__ */ jsx(ColorPreview, { name: "Warning", color: theme.colors.warning[600], isDarkMode }),
        /* @__PURE__ */ jsx(ColorPreview, { name: "Error", color: theme.colors.error[600], isDarkMode })
      ] })
    }
  );
};
const ComponentPreview = () => {
  const { computedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { addToast } = useToast();
  const handleShowToast = () => {
    addToast("Toast de sucesso!", { type: "success" });
  };
  const handleShowError = () => {
    addToast("Erro ao processar!", { type: "error" });
  };
  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2e3);
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: "Preview de Componentes",
      description: "Teste os componentes do Design System",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[4] }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: computedTheme.spacing.space[2], flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(Button, { variant: "primary", size: "medium", children: "Primário" }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "medium", children: "Secundário" }),
          /* @__PURE__ */ jsx(Button, { variant: "accent", size: "medium", children: "Acento" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "medium", children: "Outline" }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "medium", children: "Ghost" }),
          /* @__PURE__ */ jsx(Button, { variant: "danger", size: "medium", children: "Perigo" }),
          /* @__PURE__ */ jsx(Button, { variant: "success", size: "medium", children: "Sucesso" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[3] }, children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Input Padrão",
              placeholder: "Digite algo...",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              fullWidth: true
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Input com Erro",
              placeholder: "Digite algo...",
              error: "Este campo é obrigatório",
              fullWidth: true
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Input com Sucesso",
              placeholder: "Digite algo...",
              success: "Campo válido!",
              fullWidth: true
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              label: "Input com Aviso",
              placeholder: "Digite algo...",
              warning: "Atenção ao preencher",
              fullWidth: true
            }
          )
        ] }),
        isLoading && /* @__PURE__ */ jsx(
          Loading,
          {
            text: "Carregando...",
            variant: "spinner",
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: computedTheme.spacing.space[2], flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(Button, { variant: "success", size: "small", onClick: handleShowToast, children: "Mostrar Toast Sucesso" }),
          /* @__PURE__ */ jsx(Button, { variant: "danger", size: "small", onClick: handleShowError, children: "Mostrar Toast Erro" }),
          /* @__PURE__ */ jsx(Button, { variant: "primary", size: "small", onClick: handleLoading, children: "Simular Loading" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: computedTheme.spacing.space[3] }, children: [
          /* @__PURE__ */ jsx(Card, { variant: "elevated", size: "small", title: "Elevated", description: "Card com sombra" }),
          /* @__PURE__ */ jsx(Card, { variant: "outlined", size: "small", title: "Outlined", description: "Card com borda" }),
          /* @__PURE__ */ jsx(Card, { variant: "filled", size: "small", title: "Filled", description: "Card preenchido" }),
          /* @__PURE__ */ jsx(Card, { variant: "ghost", size: "small", title: "Ghost", description: "Card fantasma" })
        ] })
      ] })
    }
  );
};
const AccessibilityPreview = () => {
  const { computedTheme } = useTheme();
  const { SkipLinks: SkipLinksComponent } = useSkipLinks();
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: "Preview de Acessibilidade",
      description: "Teste os recursos de acessibilidade",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[4] }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { style: { marginBottom: computedTheme.spacing.space[2] }, children: "Skip Links (Pressione Tab para ver)" }),
          /* @__PURE__ */ jsx(SkipLinksComponent, {})
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { style: { marginBottom: computedTheme.spacing.space[2] }, children: "Indicadores de Foco" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: computedTheme.spacing.space[2] }, children: [
            /* @__PURE__ */ jsx(Button, { variant: "primary", size: "small", children: "Botão com Foco" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "Input com Foco", size: "small" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { style: { marginBottom: computedTheme.spacing.space[2] }, children: "ARIA Labels" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: computedTheme.spacing.space[2] }, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "primary",
                size: "small",
                ariaLabel: "Botão de ação principal",
                children: "Ação"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "secondary",
                size: "small",
                ariaLabel: "Botão de ação secundária",
                children: "Ação Secundária"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { style: { marginBottom: computedTheme.spacing.space[2] }, children: "Preferência de Redução de Movimento" }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }, children: "O sistema respeita a preferência de redução de movimento do usuário." })
        ] })
      ] })
    }
  );
};
const MotionPreview = () => {
  const { computedTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1e3);
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "outlined",
      size: "medium",
      title: "Preview de Motion Design",
      description: "Teste as animações e micro-interações",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[4] }, children: [
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: computedTheme.spacing.space[2], flexWrap: "wrap" }, children: /* @__PURE__ */ jsx(Button, { variant: "primary", size: "small", onClick: startAnimation, children: "Testar Animação" }) }),
        isAnimating && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "100px",
              height: "100px",
              background: computedTheme.primaryColor[500],
              borderRadius: computedTheme.borderRadius,
              animation: "scaleIn 300ms ease-out"
            },
            "aria-label": "Elemento animado"
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { style: { marginBottom: computedTheme.spacing.space[2] }, children: "Diretrizes de Motion" }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }, children: [
            /* @__PURE__ */ jsx("strong", { children: "Durações:" }),
            " ",
            Object.entries(motionGuidelines.durations).map(([key, value]) => /* @__PURE__ */ jsxs("span", { style: { marginRight: computedTheme.spacing.space[2] }, children: [
              key,
              ": ",
              value,
              "ms"
            ] }, key))
          ] })
        ] })
      ] })
    }
  );
};
const DesignSystemConfig = () => {
  const { theme, setTheme, toggleTheme, isDarkMode } = useTheme();
  const {
    updateTheme,
    resetTheme,
    exportTheme,
    importTheme,
    validateTheme
  } = useThemeConfig();
  const { addToast } = useToast();
  const [config, setConfig] = useState(theme);
  const [importedConfig, setImportedConfig] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setConfig(theme);
  }, [theme]);
  const handleUpdateConfig = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    updateTheme({ [field]: value });
    addToast(`Configuração ${field} atualizada!`, { type: "success" });
  };
  const handleReset = () => {
    setIsLoading(true);
    resetTheme();
    setTimeout(() => {
      setIsLoading(false);
      addToast("Configuração resetada!", { type: "success" });
    }, 500);
  };
  const handleExport = () => {
    const exported = exportTheme();
    navigator.clipboard.writeText(exported);
    addToast("Configuração copiada para o clipboard!", { type: "success" });
  };
  const handleImport = () => {
    const validation = validateTheme(JSON.parse(importedConfig));
    if (validation.valid) {
      importTheme(importedConfig);
      addToast("Configuração importada com sucesso!", { type: "success" });
      setImportedConfig("");
    } else {
      addToast(`Erro: ${validation.errors.join(", ")}`, { type: "error" });
    }
  };
  const handleToggleTheme = () => {
    toggleTheme();
    addToast(`Tema ${isDarkMode ? "claro" : "escuro"} ativado!`, { type: "info" });
  };
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsx("div", { style: { padding: computedTheme.spacing.space[6] }, children: /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "large",
      title: "Design System - Configuração via Admin",
      description: "Configure o Design System completo do sistema",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[6] }, children: [
        /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "medium",
            title: "Tema",
            description: "Alterne entre modo claro e escuro",
            children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: computedTheme.spacing.space[3], alignItems: "center" }, children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: isDarkMode ? "primary" : "outline",
                  size: "medium",
                  onClick: handleToggleTheme,
                  ariaLabel: isDarkMode ? "Ativar tema claro" : "Ativar tema escuro",
                  children: isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"
                }
              ),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: computedTheme.typography.fontSize.sm, color: computedTheme.colors.text.secondary }, children: [
                "Modo atual: ",
                isDarkMode ? "Escuro" : "Claro"
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "medium",
            title: "Configuração do Tema",
            description: "Personalize as cores e estilos",
            children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: computedTheme.spacing.space[3] }, children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Cor Primária",
                  value: config.primaryColor,
                  onChange: (e) => handleUpdateConfig("primaryColor", e.target.value),
                  placeholder: "primary"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Cor Secundária",
                  value: config.secondaryColor,
                  onChange: (e) => handleUpdateConfig("secondaryColor", e.target.value),
                  placeholder: "secondary"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Cor de Acento",
                  value: config.accentColor,
                  onChange: (e) => handleUpdateConfig("accentColor", e.target.value),
                  placeholder: "accent"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Borda Arredondada",
                  value: config.borderRadius,
                  onChange: (e) => handleUpdateConfig("borderRadius", e.target.value),
                  placeholder: "DEFAULT"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Fonte",
                  value: config.fontFamily,
                  onChange: (e) => handleUpdateConfig("fontFamily", e.target.value),
                  placeholder: "sans"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Tamanho da Fonte",
                  value: config.fontSize,
                  onChange: (e) => handleUpdateConfig("fontSize", e.target.value),
                  placeholder: "base"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "medium",
            title: "Configuração de Motion",
            description: "Controle as animações e micro-interações",
            children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: computedTheme.spacing.space[3] }, children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Intensidade do Motion",
                  value: config.motionIntensity,
                  onChange: (e) => handleUpdateConfig("motionIntensity", e.target.value),
                  placeholder: "medium"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Motion Habilitado",
                  value: config.motionEnabled ? "true" : "false",
                  onChange: (e) => handleUpdateConfig("motionEnabled", e.target.value === "true"),
                  placeholder: "true"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Redução de Movimento",
                  value: config.reducedMotion ? "true" : "false",
                  onChange: (e) => handleUpdateConfig("reducedMotion", e.target.value === "true"),
                  placeholder: "false"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Alto Contraste",
                  value: config.highContrast ? "true" : "false",
                  onChange: (e) => handleUpdateConfig("highContrast", e.target.value === "true"),
                  placeholder: "false"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "medium",
            title: "Configuração de Acessibilidade",
            description: "Controle os recursos de acessibilidade",
            children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: computedTheme.spacing.space[3] }, children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Indicadores de Foco",
                  value: config.focusVisible ? "true" : "false",
                  onChange: (e) => handleUpdateConfig("focusVisible", e.target.value === "true"),
                  placeholder: "true"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Skip Links",
                  value: config.skipLinks ? "true" : "false",
                  onChange: (e) => handleUpdateConfig("skipLinks", e.target.value === "true"),
                  placeholder: "true"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "medium",
            title: "Importar/Exportar Configuração",
            description: "Gerencie a configuração do Design System",
            children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[3] }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: computedTheme.spacing.space[2] }, children: [
                /* @__PURE__ */ jsx(Button, { variant: "primary", size: "medium", onClick: handleExport, children: "Exportar Configuração" }),
                /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "medium", onClick: handleReset, children: "Resetar Configuração" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Importar Configuração (JSON)",
                  value: importedConfig,
                  onChange: (e) => setImportedConfig(e.target.value),
                  placeholder: '{"mode": "dark", "primaryColor": "primary"}',
                  multiline: true,
                  rows: 4,
                  fullWidth: true
                }
              ),
              /* @__PURE__ */ jsx(Button, { variant: "accent", size: "medium", onClick: handleImport, disabled: !importedConfig, children: "Importar Configuração" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(ThemePreview, { theme: computedTheme, isDarkMode }),
        /* @__PURE__ */ jsx(ComponentPreview, {}),
        /* @__PURE__ */ jsx(AccessibilityPreview, {}),
        /* @__PURE__ */ jsx(MotionPreview, {}),
        /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "medium",
            title: "Configuração Atual",
            description: "Visualização da configuração atual",
            children: /* @__PURE__ */ jsx(
              "pre",
              {
                style: {
                  background: computedTheme.colors.background.tertiary,
                  padding: computedTheme.spacing.space[4],
                  borderRadius: computedTheme.borderRadius,
                  overflow: "auto",
                  fontSize: computedTheme.typography.fontSize.sm,
                  fontFamily: computedTheme.typography.fontFamily.mono.join(", ")
                },
                children: JSON.stringify(theme, null, 2)
              }
            )
          }
        ),
        isLoading && /* @__PURE__ */ jsx(
          Loading,
          {
            text: "Processando...",
            variant: "spinner",
            color: "primary",
            fullscreen: false
          }
        )
      ] })
    }
  ) });
};
const DesignSystemConfigWithProviders = () => {
  return /* @__PURE__ */ jsx(ToastProvider, { position: "top-right", duration: 3e3, children: /* @__PURE__ */ jsx(DesignSystemConfig, {}) });
};
const $$DesignSystem = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Design System - Configuração", "data-astro-cid-2cmetihm": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="design-system-admin" data-astro-cid-2cmetihm> ${renderComponent($$result2, "DesignSystemConfigWithProviders", DesignSystemConfigWithProviders, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/design-system/admin/DesignSystemConfig", "client:component-export": "DesignSystemConfigWithProviders", "data-astro-cid-2cmetihm": true })} </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/design-system.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/design-system.astro";
const $$url = "/admin/design-system";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DesignSystem,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
