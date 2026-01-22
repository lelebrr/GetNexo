import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
/* empty css                                            */
import { renderers } from "../../renderers.mjs";
const MasterControl = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [systemStatus, setSystemStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [globalSettings, setGlobalSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    emergencyStop: false
  });
  const systemsConfig = {
    ai_gateway: {
      name: "AI Gateway",
      description: "Roteamento inteligente Multi-LLM",
      icon: "🤖",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        strategy: "balanced",
        timeout: 30,
        retryAttempts: 3
      },
      metrics: {
        requests_today: 1250,
        avg_response_time: "1.2s",
        success_rate: "98.5%"
      }
    },
    weather_sales: {
      name: "Weather Sales",
      description: "Ofertas dinâmicas baseadas no clima",
      icon: "🌤️",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        api_key: "configured",
        update_interval: 1800,
        discount_range: "10-25%"
      },
      metrics: {
        locations_active: 45,
        offers_generated: 892,
        conversion_rate: "12.3%"
      }
    },
    supply_oracle: {
      name: "Supply Oracle",
      description: "Gestão inteligente de estoque",
      icon: "📦",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        safety_stock_days: 7,
        reorder_point: "auto",
        alerts_enabled: true
      },
      metrics: {
        products_tracked: 1250,
        alerts_today: 8,
        stock_accuracy: "97.2%"
      }
    },
    viral_launch: {
      name: "Viral Launch",
      description: "Automação de postagens simultâneas",
      icon: "🚀",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        platforms: ["twitter", "instagram", "linkedin"],
        auto_schedule: true,
        content_templates: 15
      },
      metrics: {
        campaigns_created: 23,
        posts_published: 156,
        engagement_rate: "8.7%"
      }
    },
    lighthouse_guard: {
      name: "Lighthouse Guard",
      description: "CI/CD Quality Gate",
      icon: "🏮",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        min_score: 98,
        block_deploy: true,
        auto_baseline: true
      },
      metrics: {
        checks_today: 12,
        passed_rate: "91.7%",
        avg_score: "96.2"
      }
    },
    neuro_ai_tuner: {
      name: "Neuro AI Tuner",
      description: "Otimização automática de parâmetros IA",
      icon: "🧠",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        models: ["claude-3-opus", "gpt-4", "gemini-pro"],
        auto_tune: true,
        feedback_window: 100
      },
      metrics: {
        optimizations_today: 45,
        avg_improvement: "+8.3%",
        models_tuned: 3
      }
    },
    knowledge_feed: {
      name: "Knowledge Feed",
      description: "Crawler RAG automático",
      icon: "🧠",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        sources: ["techcrunch", "arxiv", "reddit"],
        update_interval: 3600,
        chunk_size: 1e3
      },
      metrics: {
        documents_ingested: 2847,
        sources_active: 8,
        search_requests: 156
      }
    },
    chaos_monkey: {
      name: "Chaos Monkey",
      description: "Testes de resiliência",
      icon: "🐒",
      status: "inactive",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: false,
        dry_run: true,
        safe_hours: "02:00-06:00",
        max_concurrent: 1
      },
      metrics: {
        experiments_run: 12,
        recovery_rate: "95.8%",
        downtime_caused: "0.02%"
      }
    },
    ar_viewer: {
      name: "AR Product Viewer",
      description: "Visualizador de produtos em AR",
      icon: "🪄",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        webxr_required: true,
        fallback_mode: "image_overlay",
        performance_mode: "high"
      },
      metrics: {
        sessions_today: 234,
        avg_session_time: "2m 34s",
        conversion_rate: "4.2%"
      }
    },
    holo_agent: {
      name: "Holo Agent",
      description: "IA holográfica conversacional",
      icon: "🎭",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        voice_enabled: true,
        emotion_detection: true,
        auto_responses: true
      },
      metrics: {
        conversations_today: 89,
        avg_satisfaction: "4.7/5",
        response_accuracy: "94.2%"
      }
    },
    cursor_trail: {
      name: "Cursor Trail",
      description: "Partículas interativas com física",
      icon: "✨",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        particle_count: 80,
        physics_enabled: true,
        color_mode: "neon"
      },
      metrics: {
        particles_active: 80,
        interactions_today: 1250,
        performance_impact: "2.3ms"
      }
    },
    sound_system: {
      name: "Sound Feedback",
      description: "Sistema áudio imersivo 3D",
      icon: "🔊",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        spatial_audio: true,
        voice_synthesis: true,
        master_volume: 0.7
      },
      metrics: {
        sounds_played: 2847,
        audio_sessions: 156,
        avg_load_time: "45ms"
      }
    },
    parallax_hero: {
      name: "Parallax Hero",
      description: "Hero com física de fluidos",
      icon: "🌊",
      status: "active",
      version: "1.0.0",
      lastUpdated: "2024-01-21",
      settings: {
        enabled: true,
        fluid_physics: true,
        particle_density: 3e-4,
        color_scheme: "ocean"
      },
      metrics: {
        fluid_cells: 1024,
        render_fps: 58,
        memory_usage: "12.3MB"
      }
    }
  };
  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 3e4);
    return () => clearInterval(interval);
  }, []);
  const loadSystemStatus = async () => {
    try {
      const response = await fetch("/api/admin/system-status");
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
      } else {
        setSystemStatus(systemsConfig);
      }
    } catch (error) {
      setSystemStatus(systemsConfig);
    }
    setLoading(false);
  };
  const updateSystemSetting = async (systemId, setting, value) => {
    try {
      const response = await fetch(`/api/admin/systems/${systemId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [setting]: value })
      });
      if (response.ok) {
        setSystemStatus((prev) => ({
          ...prev,
          [systemId]: {
            ...prev[systemId],
            settings: {
              ...prev[systemId].settings,
              [setting]: value
            }
          }
        }));
      }
    } catch (error) {
    }
  };
  const toggleSystem = async (systemId) => {
    const currentStatus = systemStatus[systemId]?.settings?.enabled;
    await updateSystemSetting(systemId, "enabled", !currentStatus);
  };
  const emergencyStop = async () => {
    if (confirm("⚠️ ATENÇÃO: Isso irá parar TODOS os sistemas críticos. Continuar?")) {
      try {
        await fetch("/api/admin/emergency-stop", { method: "POST" });
        setGlobalSettings((prev) => ({ ...prev, emergencyStop: true }));
        setTimeout(() => window.location.reload(), 3e3);
      } catch (error) {
      }
    }
  };
  const renderOverview = () => {
    const activeSystems = Object.values(systemStatus).filter((s) => s.status === "active").length;
    const totalSystems = Object.keys(systemStatus).length;
    return /* @__PURE__ */ jsxs("div", { className: "overview-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "overview-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "📊 Status Geral" }),
        /* @__PURE__ */ jsxs("div", { className: "metrics-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ jsxs("span", { className: "value", children: [
              activeSystems,
              "/",
              totalSystems
            ] }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "Sistemas Ativos" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ jsx("span", { className: "value", children: "98.7%" }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "Uptime Global" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "metric", children: [
            /* @__PURE__ */ jsx("span", { className: "value", children: "1.2s" }),
            /* @__PURE__ */ jsx("span", { className: "label", children: "Response Time" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overview-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🚨 Alertas Críticos" }),
        /* @__PURE__ */ jsxs("div", { className: "alerts-list", children: [
          /* @__PURE__ */ jsxs("div", { className: "alert-item warning", children: [
            /* @__PURE__ */ jsx("span", { className: "alert-icon", children: "⚠️" }),
            /* @__PURE__ */ jsx("span", { className: "alert-text", children: "Chaos Monkey está inativo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "alert-item info", children: [
            /* @__PURE__ */ jsx("span", { className: "alert-icon", children: "ℹ️" }),
            /* @__PURE__ */ jsx("span", { className: "alert-text", children: "5 sistemas precisam de atualização" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overview-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🎯 Performance Hoje" }),
        /* @__PURE__ */ jsxs("div", { className: "performance-chart", children: [
          /* @__PURE__ */ jsxs("div", { className: "chart-bar", children: [
            /* @__PURE__ */ jsx("div", { className: "bar-fill", style: { width: "92%" } }),
            /* @__PURE__ */ jsx("span", { className: "bar-label", children: "CPU: 92%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "chart-bar", children: [
            /* @__PURE__ */ jsx("div", { className: "bar-fill", style: { width: "78%" } }),
            /* @__PURE__ */ jsx("span", { className: "bar-label", children: "Memory: 78%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "chart-bar", children: [
            /* @__PURE__ */ jsx("div", { className: "bar-fill", style: { width: "45%" } }),
            /* @__PURE__ */ jsx("span", { className: "bar-label", children: "Storage: 45%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overview-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "🎮 Controles Globais" }),
        /* @__PURE__ */ jsxs("div", { className: "global-controls", children: [
          /* @__PURE__ */ jsxs("label", { className: "control-toggle", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: globalSettings.maintenanceMode,
                onChange: (e) => setGlobalSettings((prev) => ({ ...prev, maintenanceMode: e.target.checked }))
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "toggle-slider" }),
            "Modo Manutenção"
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "control-toggle", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: globalSettings.debugMode,
                onChange: (e) => setGlobalSettings((prev) => ({ ...prev, debugMode: e.target.checked }))
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "toggle-slider" }),
            "Modo Debug"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "emergency-btn",
              onClick: emergencyStop,
              disabled: globalSettings.emergencyStop,
              children: "🚨 PARADA DE EMERGÊNCIA"
            }
          )
        ] })
      ] })
    ] });
  };
  const renderSystems = () => {
    return /* @__PURE__ */ jsx("div", { className: "systems-grid", children: Object.entries(systemStatus).map(([systemId, system]) => /* @__PURE__ */ jsxs("div", { className: `system-card ${system.status}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "system-header", children: [
        /* @__PURE__ */ jsx("div", { className: "system-icon", children: system.icon }),
        /* @__PURE__ */ jsxs("div", { className: "system-info", children: [
          /* @__PURE__ */ jsx("h3", { children: system.name }),
          /* @__PURE__ */ jsx("p", { children: system.description }),
          /* @__PURE__ */ jsx("span", { className: `status-badge ${system.status}`, children: system.status === "active" ? "✅ Ativo" : "❌ Inativo" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "system-toggle", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: system.settings?.enabled || false,
              onChange: () => toggleSystem(systemId)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "toggle-slider" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "system-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "system-settings", children: [
          /* @__PURE__ */ jsx("h4", { children: "⚙️ Configurações" }),
          Object.entries(system.settings || {}).map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "setting-item", children: [
            /* @__PURE__ */ jsx("label", { children: key.replace(/_/g, " ").toUpperCase() }),
            typeof value === "boolean" ? /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: value,
                onChange: (e) => updateSystemSetting(systemId, key, e.target.checked)
              }
            ) : typeof value === "number" ? /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value,
                onChange: (e) => updateSystemSetting(systemId, key, parseFloat(e.target.value))
              }
            ) : /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value,
                onChange: (e) => updateSystemSetting(systemId, key, e.target.value)
              }
            )
          ] }, key))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "system-metrics", children: [
          /* @__PURE__ */ jsx("h4", { children: "📊 Métricas" }),
          Object.entries(system.metrics || {}).map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "metric-item", children: [
            /* @__PURE__ */ jsx("span", { className: "metric-label", children: key.replace(/_/g, " ").toUpperCase() }),
            /* @__PURE__ */ jsx("span", { className: "metric-value", children: value })
          ] }, key))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "system-actions", children: [
          /* @__PURE__ */ jsx("button", { className: "btn-secondary", children: "📝 Editar" }),
          /* @__PURE__ */ jsx("button", { className: "btn-secondary", children: "🔄 Reiniciar" }),
          /* @__PURE__ */ jsx("button", { className: "btn-danger", children: "🗑️ Remover" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "system-footer", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "v",
          system.version
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Atualizado: ",
          system.lastUpdated
        ] })
      ] })
    ] }, systemId)) });
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "loading-container", children: [
      /* @__PURE__ */ jsx("div", { className: "loading-spinner" }),
      /* @__PURE__ */ jsx("p", { children: "Carregando Master Control..." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "master-control", children: [
    /* @__PURE__ */ jsxs("div", { className: "control-tabs", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: activeTab === "overview" ? "active" : "",
          onClick: () => setActiveTab("overview"),
          children: "📊 Visão Geral"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: activeTab === "systems" ? "active" : "",
          onClick: () => setActiveTab("systems"),
          children: "🎛️ Sistemas"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: activeTab === "workflows" ? "active" : "",
          onClick: () => setActiveTab("workflows"),
          children: "⚡ Workflows"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: activeTab === "analytics" ? "active" : "",
          onClick: () => setActiveTab("analytics"),
          children: "📈 Analytics"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: activeTab === "logs" ? "active" : "",
          onClick: () => setActiveTab("logs"),
          children: "📋 Logs"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      activeTab === "overview" && renderOverview(),
      activeTab === "systems" && renderSystems(),
      activeTab === "workflows" && /* @__PURE__ */ jsxs("div", { className: "coming-soon", children: [
        /* @__PURE__ */ jsx("h2", { children: "⚡ Workflows N8n" }),
        /* @__PURE__ */ jsx("p", { children: "Controle de automação avançada em desenvolvimento..." })
      ] }),
      activeTab === "analytics" && /* @__PURE__ */ jsxs("div", { className: "coming-soon", children: [
        /* @__PURE__ */ jsx("h2", { children: "📈 Analytics Avançado" }),
        /* @__PURE__ */ jsx("p", { children: "Dashboard de métricas em desenvolvimento..." })
      ] }),
      activeTab === "logs" && /* @__PURE__ */ jsxs("div", { className: "coming-soon", children: [
        /* @__PURE__ */ jsx("h2", { children: "📋 System Logs" }),
        /* @__PURE__ */ jsx("p", { children: "Visualização de logs em desenvolvimento..." })
      ] })
    ] })
  ] });
};
const $$MasterControl = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Master Control - GetNexo", "data-astro-cid-2s3w4ef5": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="master-control-page" data-astro-cid-2s3w4ef5> <div class="page-header" data-astro-cid-2s3w4ef5> <h1 data-astro-cid-2s3w4ef5>🎛️ Master Control Center</h1> <p data-astro-cid-2s3w4ef5>Controle total de todos os sistemas GetNexo</p> </div> ${renderComponent($$result2, "MasterControl", MasterControl, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/MasterControl.jsx", "client:component-export": "default", "data-astro-cid-2s3w4ef5": true })} </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/master-control.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/master-control.astro";
const $$url = "/admin/master-control";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$MasterControl,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
