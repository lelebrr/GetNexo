import { f as createComponent, k as renderComponent, r as renderTemplate } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { renderers } from "../../renderers.mjs";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const SentinelDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchHealthData();
    fetchLogs();
  }, []);
  const fetchHealthData = async () => {
    try {
      const response = await fetch("/api/sentinel/health");
      const data = await response.json();
      setHealthData(data);
    } catch (error) {
    }
  };
  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs?dia=2026-01-21");
      const data = await response.json();
      setLogs(data);
    } catch (error) {
    }
  };
  const runSentinel = async () => {
    setLoading(true);
    try {
      await fetch("/api/sentinel/run", { method: "POST" });
      await fetchHealthData();
      await fetchLogs();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const speedData = {
    labels: ["00:00", "06:00", "12:00", "18:00", "Agora"],
    datasets: [{
      label: "Score de Velocidade",
      data: [92, 94, 95, 93, healthData?.velocidade || 95],
      borderColor: "#00d4ff",
      backgroundColor: "rgba(0, 212, 255, 0.2)"
    }]
  };
  const attacksData = {
    labels: ["00:00", "06:00", "12:00", "18:00", "Agora"],
    datasets: [{
      label: "IPs Bloqueados",
      data: [2, 5, 3, 1, 4],
      backgroundColor: "#ff6b00"
    }]
  };
  const aiEconomyData = {
    labels: ["Respostas Locais", "IA Gemini"],
    datasets: [{
      data: [68, 32],
      backgroundColor: ["#00d4ff", "#ffd700"]
    }]
  };
  const diskData = {
    labels: ["/", "/logs", "/sessions"],
    datasets: [{
      label: "Uso (%)",
      data: [45, 20, 10],
      backgroundColor: ["#00d4ff", "#ff6b00", "#ffd700"]
    }]
  };
  return /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "monospace" }, children: [
    /* @__PURE__ */ jsx("h1", { style: { color: "#00d4ff", textAlign: "center", fontSize: "2.5rem", marginBottom: "30px" }, children: "SENTINEL v3 - SAÚDE EM TEMPO REAL" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #00d4ff" }, children: [
        /* @__PURE__ */ jsx("h2", { style: { color: "#00d4ff" }, children: "Velocidade do Site" }),
        /* @__PURE__ */ jsx(Line, { data: speedData, options: { responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { y: { ticks: { color: "#fff" }, grid: { color: "#333" } }, x: { ticks: { color: "#fff" }, grid: { color: "#333" } } } } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #ff6b00" }, children: [
        /* @__PURE__ */ jsx("h2", { style: { color: "#ff6b00" }, children: "Ataques Detectados" }),
        /* @__PURE__ */ jsx(Bar, { data: attacksData, options: { responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { y: { ticks: { color: "#fff" }, grid: { color: "#333" } }, x: { ticks: { color: "#fff" }, grid: { color: "#333" } } } } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #ffd700" }, children: [
        /* @__PURE__ */ jsx("h2", { style: { color: "#ffd700" }, children: "Economia de IA" }),
        /* @__PURE__ */ jsx(Doughnut, { data: aiEconomyData, options: { responsive: true, plugins: { legend: { labels: { color: "#fff" } } } } }),
        /* @__PURE__ */ jsx("p", { style: { textAlign: "center", marginTop: "10px" }, children: "Economizou R$ 12,40 hoje" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #00d4ff" }, children: [
        /* @__PURE__ */ jsx("h2", { style: { color: "#00d4ff" }, children: "Espaço em Disco" }),
        /* @__PURE__ */ jsx(Bar, { data: diskData, options: { responsive: true, plugins: { legend: { labels: { color: "#fff" } } }, scales: { y: { ticks: { color: "#fff" }, grid: { color: "#333" } }, x: { ticks: { color: "#fff" }, grid: { color: "#333" } } } } }),
        healthData?.logs["/logs"] > 80 && /* @__PURE__ */ jsx("p", { style: { color: "#ff6b00" }, children: "URGENTE: Compactando logs..." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #ffd700", marginTop: "20px" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { color: "#ffd700" }, children: "Últimos Logs" }),
      /* @__PURE__ */ jsxs("table", { style: { width: "100%", color: "#fff" }, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Evento" }),
          /* @__PURE__ */ jsx("th", { children: "Detalhe" }),
          /* @__PURE__ */ jsx("th", { children: "Ação" }),
          /* @__PURE__ */ jsx("th", { children: "Tempo" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: logs.slice(0, 5).map((log, i) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: log.evento }),
          /* @__PURE__ */ jsx("td", { children: log.detalhe }),
          /* @__PURE__ */ jsx("td", { children: log.acao }),
          /* @__PURE__ */ jsx("td", { children: new Date(log.ts).toLocaleTimeString() })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: runSentinel,
          disabled: loading,
          style: {
            backgroundColor: "#00d4ff",
            color: "#000",
            border: "none",
            padding: "15px 30px",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1.2rem"
          },
          children: loading ? "Executando..." : "Rodar Agora"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
          },
          style: {
            backgroundColor: "#ffd700",
            color: "#000",
            border: "none",
            padding: "15px 30px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1.2rem"
          },
          children: "Ver Backup"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
          },
          style: {
            backgroundColor: "#ff6b00",
            color: "#000",
            border: "none",
            padding: "15px 30px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1.2rem"
          },
          children: "Treinar Bot"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { style: { textAlign: "center", marginTop: "30px", color: "#00d4ff" }, children: "> Sentinel v3: seu site está seguro. Eu cuido do resto. — v3.7.2" })
  ] });
};
const $$SentinelDashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel v3 - Saúde em Tempo Real" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SentinelDashboard", SentinelDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/SentinelDashboard.jsx", "client:component-export": "default" })} ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/sentinel-dashboard.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/sentinel-dashboard.astro";
const $$url = "/admin/sentinel-dashboard";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$SentinelDashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
