import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../assets/AdminLayout-htIlQTkN.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
/* empty css                                */
import { renderers } from "../renderers.mjs";
const SentimentIndicator = ({ score, sentiment, category, confidence, showBadge = true, showTooltip = true, size = "medium" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const getEmoji = () => {
    if (score <= 2) return "😡";
    if (score <= 4) return "😠";
    if (score <= 6) return "😐";
    if (score <= 8) return "😊";
    return "🤩";
  };
  const getColor = () => {
    if (score <= 2) return "#ef4444";
    if (score <= 4) return "#f97316";
    if (score <= 6) return "#eab308";
    if (score <= 8) return "#22c55e";
    return "#10b981";
  };
  const getSize = () => {
    switch (size) {
      case "small":
        return "w-6 h-6 text-sm";
      case "large":
        return "w-12 h-12 text-2xl";
      default:
        return "w-8 h-8 text-lg";
    }
  };
  const getSentimentLevel = () => {
    if (score <= 2) return "Muito Negativo";
    if (score <= 4) return "Negativo";
    if (score <= 6) return "Neutro";
    if (score <= 8) return "Positivo";
    return "Muito Positivo";
  };
  const getCategoryLabel = () => {
    switch (category) {
      case "raiva":
        return "Raiva";
      case "frustracao":
        return "Frustração";
      case "neutro":
        return "Neutro";
      case "satisfacao":
        return "Satisfação";
      case "empolgação":
        return "Empolgação";
      default:
        return "Desconhecido";
    }
  };
  const shouldAlert = () => {
    return score <= 2 || score >= 9;
  };
  return /* @__PURE__ */ jsxs("div", { className: `relative inline-flex items-center ${isVisible ? "animate-fade-in" : "opacity-0"}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `${getSize()} flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110`,
        style: {
          backgroundColor: showBadge ? `${getColor()}15` : "transparent",
          border: showBadge ? `2px solid ${getColor()}` : "none"
        },
        onMouseEnter: () => setShowDetails(true),
        onMouseLeave: () => setShowDetails(false),
        title: showTooltip ? `${getSentimentLevel()} (${score}/10)` : "",
        children: /* @__PURE__ */ jsx("span", { className: "select-none", children: getEmoji() })
      }
    ),
    shouldAlert() && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1", children: /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full animate-pulse ${score <= 2 ? "bg-red-500" : "bg-green-500"}` }) }),
    showTooltip && showDetails && /* @__PURE__ */ jsxs("div", { className: "absolute z-50 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 min-w-max -top-16 left-1/2 transform -translate-x-1/2", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "font-semibold text-center", children: [
          getSentimentLevel(),
          " (",
          score,
          "/10)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-300 text-center", children: [
          "Categoria: ",
          getCategoryLabel()
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 text-center", children: [
          "Confiança: ",
          Math.round(confidence * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-700 rounded-full h-2 mt-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-2 rounded-full transition-all duration-500",
            style: {
              width: `${score * 10}%`,
              backgroundColor: getColor()
            }
          }
        ) })
      ] })
    ] }),
    showBadge && /* @__PURE__ */ jsx(
      "span",
      {
        className: "ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full",
        style: {
          backgroundColor: getColor(),
          color: "white"
        },
        children: score
      }
    )
  ] });
};
SentimentIndicator.propTypes = {
  score: PropTypes.number.isRequired,
  sentiment: PropTypes.string,
  category: PropTypes.string,
  confidence: PropTypes.number,
  showBadge: PropTypes.bool,
  showTooltip: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"])
};
SentimentIndicator.defaultProps = {
  score: 5,
  sentiment: "neutral",
  category: "neutro",
  confidence: 0.8,
  showBadge: true,
  showTooltip: true,
  size: "medium"
};
const LiveConversations = () => {
  const [conversations, setConversations] = useState([
    { id: 1, user: "+55 11 99999-0001", lastMsg: "Gostaria de saber o preço do plano Pro", time: "14:20", score: 8, category: "satisfacao", confidence: 0.92 },
    { id: 2, user: "+55 21 98888-1111", lastMsg: "O bot não está carregando o boleto!", time: "14:22", score: 2, category: "raiva", confidence: 0.98 },
    { id: 3, user: "+55 31 97777-2222", lastMsg: "Muito obrigado pela ajuda!", time: "14:25", score: 10, category: "empolgação", confidence: 0.88 },
    { id: 4, user: "+55 41 96666-3333", lastMsg: "Quanto tempo demora a entrega?", time: "14:28", score: 5, category: "neutro", confidence: 0.75 }
  ]);
  return /* @__PURE__ */ jsxs("div", { className: "conversations-wrapper", children: [
    /* @__PURE__ */ jsxs("div", { className: "conv-header", children: [
      /* @__PURE__ */ jsx("h3", { children: "Live Terminal" }),
      /* @__PURE__ */ jsx("div", { className: "status-badge", children: "4 Online" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "conv-list", children: conversations.map((conv) => /* @__PURE__ */ jsxs("div", { className: "conv-item cyber-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "conv-user", children: [
        /* @__PURE__ */ jsx("span", { className: "user-id", children: conv.user }),
        /* @__PURE__ */ jsx("span", { className: "time", children: conv.time })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "conv-msg", children: /* @__PURE__ */ jsx("p", { children: conv.lastMsg }) }),
      /* @__PURE__ */ jsxs("div", { className: "conv-footer", children: [
        /* @__PURE__ */ jsxs("div", { className: "sentiment-box", children: [
          /* @__PURE__ */ jsx("span", { className: "label", children: "Sentimento IA:" }),
          /* @__PURE__ */ jsx(
            SentimentIndicator,
            {
              score: conv.score,
              category: conv.category,
              confidence: conv.confidence,
              size: "small"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { className: "btn-terminal", children: "Entrar" })
      ] })
    ] }, conv.id)) }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
                .conversations-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .conv-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .conv-header h3 {
                    font-size: 0.9rem;
                    color: #ffc400;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .status-badge {
                    font-size: 0.6rem;
                    background: rgba(0, 247, 255, 0.1);
                    color: #00f7ff;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 800;
                }
                .conv-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .conv-item {
                    padding: 1.2rem !important;
                }
                .conv-user {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                }
                .user-id {
                    font-size: 0.8rem;
                    color: #fff;
                    font-family: 'JetBrains Mono', monospace;
                }
                .time {
                    font-size: 0.7rem;
                    color: #555;
                }
                .conv-msg p {
                    font-size: 0.85rem;
                    color: #aaa;
                    margin: 0;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                }
                .conv-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #1a1a1a;
                    padding-top: 0.8rem;
                }
                .sentiment-box {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .sentiment-box .label {
                    font-size: 0.65rem;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: 800;
                }
                .btn-terminal {
                    background: none;
                    border: 1px solid #333;
                    color: #888;
                    font-size: 0.7rem;
                    padding: 0.3rem 0.8rem;
                    border-radius: 4px;
                    cursor: pointer;
                    text-transform: uppercase;
                    font-weight: 700;
                    transition: 0.3s;
                }
                .btn-terminal:hover {
                    border-color: #00f7ff;
                    color: #00f7ff;
                    box-shadow: 0 0 10px rgba(0, 247, 255, 0.2);
                }
            ` })
  ] });
};
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Operations Hub", "data-astro-cid-u2h3djql": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="hub-grid" data-astro-cid-u2h3djql> <!-- Left: Stats and Commands --> <div class="sidebar-stats" data-astro-cid-u2h3djql> <div class="stats-grid" data-astro-cid-u2h3djql> <div class="cyber-card stat-item" data-astro-cid-u2h3djql> <div class="stat-header" data-astro-cid-u2h3djql> <span class="icon" data-astro-cid-u2h3djql>💬</span> <span class="label" data-astro-cid-u2h3djql>Conversas</span> </div> <div class="value" data-astro-cid-u2h3djql>1,242</div> <div class="trend up" data-astro-cid-u2h3djql>+15%</div> </div> <div class="cyber-card stat-item" data-astro-cid-u2h3djql> <div class="stat-header" data-astro-cid-u2h3djql> <span class="icon" data-astro-cid-u2h3djql>💰</span> <span class="label" data-astro-cid-u2h3djql>Vendas</span> </div> <div class="value" data-astro-cid-u2h3djql>R$ 12k</div> <div class="trend up" data-astro-cid-u2h3djql>+5%</div> </div> </div> <div class="cyber-card commands-box" data-astro-cid-u2h3djql> <h3 data-astro-cid-u2h3djql>Global Commands</h3> <div class="cmd-list" data-astro-cid-u2h3djql> <button class="btn-cmd" data-astro-cid-u2h3djql> <span class="ico" data-astro-cid-u2h3djql>🔄</span> <span class="tit" data-astro-cid-u2h3djql>Atualizar Padrões</span> </button> <button class="btn-cmd" data-astro-cid-u2h3djql> <span class="ico" data-astro-cid-u2h3djql>💾</span> <span class="tit" data-astro-cid-u2h3djql>Ver Backups</span> </button> <button class="btn-cmd" data-astro-cid-u2h3djql> <span class="ico" data-astro-cid-u2h3djql>🧹</span> <span class="tit" data-astro-cid-u2h3djql>Limpar Logs</span> </button> <button class="btn-cmd danger" data-astro-cid-u2h3djql> <span class="ico" data-astro-cid-u2h3djql>🚨</span> <span class="tit" data-astro-cid-u2h3djql>Emergency Reset</span> </button> </div> </div> <div class="cyber-card system-health" data-astro-cid-u2h3djql> <h3 data-astro-cid-u2h3djql>System Health</h3> <div class="health-item" data-astro-cid-u2h3djql> <span data-astro-cid-u2h3djql>API Core</span> <span class="status online" data-astro-cid-u2h3djql>STABLE</span> </div> <div class="health-item" data-astro-cid-u2h3djql> <span data-astro-cid-u2h3djql>Database</span> <span class="status online" data-astro-cid-u2h3djql>CONNECTED</span> </div> <div class="health-item" data-astro-cid-u2h3djql> <span data-astro-cid-u2h3djql>Evolution API</span> <span class="status online" data-astro-cid-u2h3djql>ACTIVE</span> </div> </div> </div> <!-- Right: Live Conversations --> <div class="live-area" data-astro-cid-u2h3djql> <div class="cyber-card" data-astro-cid-u2h3djql> ${renderComponent($$result2, "LiveConversations", LiveConversations, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/LiveConversations", "client:component-export": "default", "data-astro-cid-u2h3djql": true })} </div> </div> </div> ` })}  `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/index.astro";
const $$url = "/admin";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
