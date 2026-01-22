import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card } from "../../assets/Card-Dsq8OXHI.js";
/* empty css                                            */
import { renderers } from "../../renderers.mjs";
const GameAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");
  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3e4);
    return () => clearInterval(interval);
  }, [selectedGame, timeRange]);
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `${"http://localhost:3001"}/api/games/analytics/dashboard`;
      const params = new URLSearchParams({
        gameType: selectedGame,
        timeRange
      });
      url += `?${params.toString()}`;
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  };
  const formatPercentage = (num) => {
    return (num || 0).toFixed(1) + "%";
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { children: "Carregando dados de analytics..." });
  }
  const { summary, games, realtime } = analytics;
  return /* @__PURE__ */ jsxs("div", { style: { padding: "20px", maxWidth: "1400px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }, children: "📊 Analytics dos Minigames" }),
        /* @__PURE__ */ jsx("p", { style: { color: "#6b7280" }, children: "Métricas em tempo real dos jogos interativos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedGame,
            onChange: (e) => setSelectedGame(e.target.value),
            style: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" },
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "Todos os Jogos" }),
              /* @__PURE__ */ jsx("option", { value: "roleta", children: "🎰 Roleta" }),
              /* @__PURE__ */ jsx("option", { value: "raspadinha", children: "🧽 Raspadinha" }),
              /* @__PURE__ */ jsx("option", { value: "caca_preco", children: "💰 Caça-Preço" }),
              /* @__PURE__ */ jsx("option", { value: "quiz", children: "📚 Quiz" }),
              /* @__PURE__ */ jsx("option", { value: "monte_kit", children: "🎁 Monte Kit" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: timeRange,
            onChange: (e) => setTimeRange(e.target.value),
            style: { padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" },
            children: [
              /* @__PURE__ */ jsx("option", { value: "1h", children: "Última Hora" }),
              /* @__PURE__ */ jsx("option", { value: "24h", children: "Últimas 24h" }),
              /* @__PURE__ */ jsx("option", { value: "7d", children: "Últimos 7 dias" }),
              /* @__PURE__ */ jsx("option", { value: "30d", children: "Últimos 30 dias" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxs(Card, { style: { padding: "20px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "48px", marginBottom: "8px" }, children: "🎮" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }, children: formatNumber(summary?.totalSessions || 0) }),
        /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Sessões Totais" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { style: { padding: "20px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "48px", marginBottom: "8px" }, children: "🏆" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }, children: formatNumber(summary?.totalPoints || 0) }),
        /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Pontos Distribuídos" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { style: { padding: "20px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "48px", marginBottom: "8px" }, children: "📈" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }, children: formatPercentage(summary?.completionRate || 0) }),
        /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Taxa de Conclusão" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { style: { padding: "20px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "48px", marginBottom: "8px" }, children: "💰" }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: "28px", fontWeight: "bold", marginBottom: "4px" }, children: [
          "R$ ",
          formatNumber(summary?.revenue || 0)
        ] }),
        /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Receita Gerada" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }, children: "⚡ Tempo Real" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
        /* @__PURE__ */ jsxs(Card, { style: { padding: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "24px", fontWeight: "bold", color: "#10b981" }, children: realtime?.activeSessions || 0 }),
          /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Sessões Ativas" })
        ] }),
        /* @__PURE__ */ jsxs(Card, { style: { padding: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }, children: realtime?.gamesPerMinute || 0 }),
          /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Jogos/Minuto" })
        ] }),
        /* @__PURE__ */ jsxs(Card, { style: { padding: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }, children: formatTime(realtime?.avgSessionDuration || 0) }),
          /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Tempo Médio" })
        ] }),
        /* @__PURE__ */ jsxs(Card, { style: { padding: "16px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "24px", fontWeight: "bold", color: "#ef4444" }, children: formatNumber(realtime?.pointsLastHour || 0) }),
          /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "14px" }, children: "Pontos (última hora)" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }, children: "🎯 Performance por Jogo" }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }, children: games?.map((game) => /* @__PURE__ */ jsxs(Card, { style: { padding: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
          /* @__PURE__ */ jsxs("h3", { style: { fontSize: "18px", fontWeight: "bold" }, children: [
            getGameEmoji(game.gameType),
            " ",
            getGameName(game.gameType)
          ] }),
          /* @__PURE__ */ jsx("span", { style: {
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            background: game.isActive ? "#10b981" : "#6b7280",
            color: "white"
          }, children: game.isActive ? "Ativo" : "Inativo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "20px", fontWeight: "bold" }, children: formatNumber(game.totalSessions) }),
            /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "12px" }, children: "Sessões" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "20px", fontWeight: "bold" }, children: formatPercentage(game.completionRate) }),
            /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "12px" }, children: "Conclusão" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "20px", fontWeight: "bold" }, children: formatNumber(game.totalPoints) }),
            /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "12px" }, children: "Pontos" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "20px", fontWeight: "bold" }, children: formatTime(game.avgDuration) }),
            /* @__PURE__ */ jsx("div", { style: { color: "#6b7280", fontSize: "12px" }, children: "Tempo Médio" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "4px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#6b7280" }, children: "Engajamento" }),
            /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#6b7280" }, children: [
              game.engagementScore?.toFixed(1),
              "/100"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "8px", background: "#e5e7eb", borderRadius: "4px" }, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: `${Math.min(game.engagementScore || 0, 100)}%`,
                height: "100%",
                background: getEngagementColor(game.engagementScore || 0),
                borderRadius: "4px",
                transition: "width 0.3s ease"
              }
            }
          ) })
        ] })
      ] }, game.gameType)) })
    ] }),
    analytics.insights && analytics.insights.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }, children: "💡 Insights Automáticos" }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }, children: analytics.insights.map((insight, index) => /* @__PURE__ */ jsxs(Card, { style: {
        padding: "16px",
        borderLeft: `4px solid ${getInsightColor(insight.type)}`
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: "8px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "18px", marginRight: "8px" }, children: getInsightIcon(insight.type) }),
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold" }, children: insight.title })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", fontSize: "14px", marginBottom: "8px" }, children: insight.description }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: "12px", color: "#9ca3af" }, children: [
          "Recomendação: ",
          insight.recommendation
        ] })
      ] }, index)) })
    ] })
  ] });
};
const getGameEmoji = (gameType) => {
  const emojis = {
    roleta: "🎰",
    raspadinha: "🧽",
    caca_preco: "💰",
    quiz: "📚",
    monte_kit: "🎁"
  };
  return emojis[gameType] || "🎮";
};
const getGameName = (gameType) => {
  const names = {
    roleta: "Roleta Virtual",
    raspadinha: "Raspadinha",
    caca_preco: "Caça-Preço",
    quiz: "Quiz",
    monte_kit: "Monte seu Kit"
  };
  return names[gameType] || gameType;
};
const getEngagementColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};
const getInsightColor = (type) => {
  const colors = {
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
    danger: "#ef4444"
  };
  return colors[type] || "#6b7280";
};
const getInsightIcon = (type) => {
  const icons = {
    success: "✅",
    warning: "⚠️",
    info: "ℹ️",
    danger: "🚨"
  };
  return icons[type] || "💡";
};
const $$GameAnalytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Analytics dos Minigames", "data-astro-cid-oa6xudjh": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="game-analytics" data-astro-cid-oa6xudjh> ${renderComponent($$result2, "GameAnalyticsDashboard", GameAnalyticsDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/analytics/GameAnalyticsDashboard.jsx", "client:component-export": "default", "data-astro-cid-oa6xudjh": true })} </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/game-analytics.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/game-analytics.astro";
const $$url = "/admin/game-analytics";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$GameAnalytics,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
