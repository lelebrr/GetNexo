import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
/* empty css                                              */
import { renderers } from "../../renderers.mjs";
const DashboardConfig = () => {
  const [config, setConfig] = useState({
    enabledCharts: {
      ticket_peaks: true,
      channel_distribution: true,
      ai_resolution: true,
      sales: true,
      agent_clicks: true,
      conversion_funnel: true,
      nps: true,
      response_times: true,
      top_complaints: true,
      brazil_heatmap: true,
      queue_abandonment: true
    },
    chartOrder: [
      "ticket_peaks",
      "channel_distribution",
      "ai_resolution",
      "sales",
      "agent_clicks",
      "conversion_funnel",
      "nps",
      "response_times",
      "top_complaints",
      "brazil_heatmap",
      "queue_abandonment"
    ]
  });
  const [activeTab, setActiveTab] = useState("analytics");
  const [whiteLabelConfig, setWhiteLabelConfig] = useState({
    branding: {
      logo: null,
      primaryColor: "#007bff",
      secondaryColor: "#6c757d",
      botName: "Assistente IA",
      customBackground: "",
      customCss: ""
    },
    behavior: {
      activeChannels: {
        whatsapp: true,
        telegram: false,
        instagram: false,
        facebook: false,
        email: true
      },
      terminology: {
        agentLabel: "Atendente",
        botLabel: "Bot",
        chatLabel: "Chat"
      },
      favicon: null
    },
    widget: {
      position: "bottom-right",
      width: 350,
      height: 500,
      animation: true,
      sound: true
    }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const chartLabels = {
    ticket_peaks: "Picos de Tickets por Hora",
    channel_distribution: "Distribuição por Canal",
    ai_resolution: "Taxa de Resolução IA vs Humano",
    sales: "Vendas no Chat",
    agent_clicks: "Cliques de Agentes",
    conversion_funnel: "Funil de Conversão",
    nps: "NPS Semanal",
    response_times: "Tempo Médio de Resposta",
    top_complaints: "Top Reclamações por Produto",
    brazil_heatmap: "Chamados por Região do Brasil",
    queue_abandonment: "Abandono de Fila"
  };
  const handleToggleChart = (chartId) => {
    setConfig((prev) => ({
      ...prev,
      enabledCharts: {
        ...prev.enabledCharts,
        [chartId]: !prev.enabledCharts[chartId]
      }
    }));
  };
  const handleMoveUp = (index) => {
    if (index > 0) {
      const newOrder = [...config.chartOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setConfig((prev) => ({ ...prev, chartOrder: newOrder }));
    }
  };
  const handleMoveDown = (index) => {
    if (index < config.chartOrder.length - 1) {
      const newOrder = [...config.chartOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setConfig((prev) => ({ ...prev, chartOrder: newOrder }));
    }
  };
  const saveConfig = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/config/analytics_dashboard", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        setMessage("Configuração salva com sucesso!");
        setTimeout(() => setMessage(""), 3e3);
      } else {
        setMessage("Erro ao salvar configuração.");
      }
    } catch (error) {
      setMessage("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };
  const resetToDefault = () => {
    setConfig({
      enabledCharts: {
        ticket_peaks: true,
        channel_distribution: true,
        ai_resolution: true,
        sales: true,
        agent_clicks: true,
        conversion_funnel: true,
        nps: true,
        response_times: true,
        top_complaints: true,
        brazil_heatmap: true,
        queue_abandonment: true
      },
      chartOrder: [
        "ticket_peaks",
        "channel_distribution",
        "ai_resolution",
        "sales",
        "agent_clicks",
        "conversion_funnel",
        "nps",
        "response_times",
        "top_complaints",
        "brazil_heatmap",
        "queue_abandonment"
      ]
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Configurações do Sistema" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("analytics"),
          className: `flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "analytics" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
          children: "📊 Analytics"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("branding"),
          className: `flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "branding" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
          children: "🎨 Branding"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("behavior"),
          className: `flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "behavior" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
          children: "⚙️ Comportamento"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("widget"),
          className: `flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "widget" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
          children: "💬 Widget Chat"
        }
      )
    ] }),
    activeTab === "analytics" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Configuração do Dashboard Analytics" }),
        /* @__PURE__ */ jsxs("div", { className: "space-x-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: resetToDefault,
              className: "px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors",
              children: "🔄 Resetar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: saveConfig,
              disabled: saving,
              className: "px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors",
              children: saving ? "Salvando..." : "💾 Salvar Configuração"
            }
          )
        ] })
      ] }),
      message && /* @__PURE__ */ jsx("div", { className: `mb-4 p-3 rounded ${message.includes("Erro") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`, children: message }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-800 mb-3", children: "Ordem dos Gráficos" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: config.chartOrder.map((chartId, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-white rounded border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: config.enabledCharts[chartId],
                  onChange: () => handleToggleChart(chartId),
                  className: "rounded"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: `${config.enabledCharts[chartId] ? "text-gray-900" : "text-gray-400"}`, children: chartLabels[chartId] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-1", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleMoveUp(index),
                  disabled: index === 0,
                  className: "px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30",
                  title: "Mover para cima",
                  children: "↑"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleMoveDown(index),
                  disabled: index === config.chartOrder.length - 1,
                  className: "px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30",
                  title: "Mover para baixo",
                  children: "↓"
                }
              )
            ] })
          ] }, chartId)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-blue-800 mb-2", children: "💡 Dicas de Configuração" }),
          /* @__PURE__ */ jsxs("ul", { className: "text-sm text-blue-700 space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "• Desmarque gráficos que não são relevantes para seu negócio" }),
            /* @__PURE__ */ jsx("li", { children: "• Organize os gráficos mais importantes no topo da lista" }),
            /* @__PURE__ */ jsx("li", { children: '• Clique em "Salvar Configuração" para aplicar as mudanças' }),
            /* @__PURE__ */ jsx("li", { children: "• As mudanças afetam todos os usuários do dashboard" })
          ] })
        ] })
      ] })
    ] }),
    activeTab === "branding" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-6", children: "Configurações de Branding" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Logo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              onChange: (e) => {
                const file = e.target.files[0];
                setWhiteLabelConfig((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, logo: file }
                }));
              },
              className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cor Primária" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: whiteLabelConfig.branding.primaryColor,
                onChange: (e) => setWhiteLabelConfig((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, primaryColor: e.target.value }
                })),
                className: "w-full h-10 border rounded"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cor Secundária" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: whiteLabelConfig.branding.secondaryColor,
                onChange: (e) => setWhiteLabelConfig((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, secondaryColor: e.target.value }
                })),
                className: "w-full h-10 border rounded"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome do Bot" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: whiteLabelConfig.branding.botName,
              onChange: (e) => setWhiteLabelConfig((prev) => ({
                ...prev,
                branding: { ...prev.branding, botName: e.target.value }
              })),
              className: "w-full px-3 py-2 border rounded",
              placeholder: "Ex: Assistente IA"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fundo Personalizado (CSS)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: whiteLabelConfig.branding.customBackground,
              onChange: (e) => setWhiteLabelConfig((prev) => ({
                ...prev,
                branding: { ...prev.branding, customBackground: e.target.value }
              })),
              rows: 4,
              className: "w-full px-3 py-2 border rounded",
              placeholder: "Ex: background: linear-gradient(45deg, #007bff, #6610f2);"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "CSS Personalizado" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: whiteLabelConfig.branding.customCss,
              onChange: (e) => setWhiteLabelConfig((prev) => ({
                ...prev,
                branding: { ...prev.branding, customCss: e.target.value }
              })),
              rows: 6,
              className: "w-full px-3 py-2 border rounded font-mono text-sm",
              placeholder: "CSS personalizado para o widget..."
            }
          )
        ] })
      ] })
    ] }),
    activeTab === "behavior" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-6", children: "Configurações de Comportamento" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-700 mb-3", children: "Canais Ativos" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: Object.entries(whiteLabelConfig.behavior.activeChannels).map(([channel, isActive]) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: isActive,
                onChange: (e) => setWhiteLabelConfig((prev) => ({
                  ...prev,
                  behavior: {
                    ...prev.behavior,
                    activeChannels: {
                      ...prev.behavior.activeChannels,
                      [channel]: e.target.checked
                    }
                  }
                })),
                className: "rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", children: channel })
          ] }, channel)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-700 mb-3", children: "Terminologia Personalizada" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm text-gray-600 mb-1", children: "Rótulo do Atendente" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: whiteLabelConfig.behavior.terminology.agentLabel,
                  onChange: (e) => setWhiteLabelConfig((prev) => ({
                    ...prev,
                    behavior: {
                      ...prev.behavior,
                      terminology: {
                        ...prev.behavior.terminology,
                        agentLabel: e.target.value
                      }
                    }
                  })),
                  className: "w-full px-3 py-2 border rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm text-gray-600 mb-1", children: "Rótulo do Bot" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: whiteLabelConfig.behavior.terminology.botLabel,
                  onChange: (e) => setWhiteLabelConfig((prev) => ({
                    ...prev,
                    behavior: {
                      ...prev.behavior,
                      terminology: {
                        ...prev.behavior.terminology,
                        botLabel: e.target.value
                      }
                    }
                  })),
                  className: "w-full px-3 py-2 border rounded"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm text-gray-600 mb-1", children: "Rótulo do Chat" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: whiteLabelConfig.behavior.terminology.chatLabel,
                  onChange: (e) => setWhiteLabelConfig((prev) => ({
                    ...prev,
                    behavior: {
                      ...prev.behavior,
                      terminology: {
                        ...prev.behavior.terminology,
                        chatLabel: e.target.value
                      }
                    }
                  })),
                  className: "w-full px-3 py-2 border rounded"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Favicon" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              onChange: (e) => {
                const file = e.target.files[0];
                setWhiteLabelConfig((prev) => ({
                  ...prev,
                  behavior: { ...prev.behavior, favicon: file }
                }));
              },
              className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            }
          )
        ] })
      ] })
    ] }),
    activeTab === "widget" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-6", children: "Configurações do Widget de Chat" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Posição do Widget" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: whiteLabelConfig.widget.position,
              onChange: (e) => setWhiteLabelConfig((prev) => ({
                ...prev,
                widget: { ...prev.widget, position: e.target.value }
              })),
              className: "w-full px-3 py-2 border rounded",
              children: [
                /* @__PURE__ */ jsx("option", { value: "bottom-right", children: "Inferior Direito" }),
                /* @__PURE__ */ jsx("option", { value: "bottom-left", children: "Inferior Esquerdo" }),
                /* @__PURE__ */ jsx("option", { value: "top-right", children: "Superior Direito" }),
                /* @__PURE__ */ jsx("option", { value: "top-left", children: "Superior Esquerdo" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Largura (px)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "200",
                max: "800",
                value: whiteLabelConfig.widget.width,
                onChange: (e) => setWhiteLabelConfig((prev) => ({
                  ...prev,
                  widget: { ...prev.widget, width: parseInt(e.target.value) }
                })),
                className: "w-full px-3 py-2 border rounded"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Altura (px)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "300",
                max: "1000",
                value: whiteLabelConfig.widget.height,
                onChange: (e) => setWhiteLabelConfig((prev) => ({
                  ...prev,
                  widget: { ...prev.widget, height: parseInt(e.target.value) }
                })),
                className: "w-full px-3 py-2 border rounded"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-700 mb-3", children: "Opções do Widget" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: whiteLabelConfig.widget.animation,
                  onChange: (e) => setWhiteLabelConfig((prev) => ({
                    ...prev,
                    widget: { ...prev.widget, animation: e.target.checked }
                  })),
                  className: "rounded"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Animação de entrada" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: whiteLabelConfig.widget.sound,
                  onChange: (e) => setWhiteLabelConfig((prev) => ({
                    ...prev,
                    widget: { ...prev.widget, sound: e.target.checked }
                  })),
                  className: "rounded"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Sons de notificação" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const $$AnalyticsConfig = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Configuração do Dashboard Analytics - Admin GetNexo Pro", "data-astro-cid-wlcfy2rb": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50" data-astro-cid-wlcfy2rb> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-wlcfy2rb>  <div class="text-center mb-8" data-astro-cid-wlcfy2rb> <div class="inline-block p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100" data-astro-cid-wlcfy2rb> <h1 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2" data-astro-cid-wlcfy2rb>
⚙️ Configuração do Dashboard
</h1> <p class="text-gray-600 text-sm" data-astro-cid-wlcfy2rb>
Personalize quais gráficos mostrar e em que ordem no dashboard analytics
</p> </div> </div>  ${renderComponent($$result2, "DashboardConfig", DashboardConfig, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/DashboardConfig.jsx", "client:component-export": "default", "data-astro-cid-wlcfy2rb": true })} </div> </div>  ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/analytics-config.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/analytics-config.astro";
const $$url = "/admin/analytics-config";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$AnalyticsConfig,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
