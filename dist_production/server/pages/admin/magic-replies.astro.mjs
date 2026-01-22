import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
/* empty css                                           */
import { renderers } from "../../renderers.mjs";
const MagicRepliesManagement = () => {
  const [magicReplies, setMagicReplies] = useState([]);
  const [activeTab, setActiveTab] = useState("list");
  const [selectedReply, setSelectedReply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newReply, setNewReply] = useState({
    name: "",
    description: "",
    isActive: true,
    context: {
      keywords: [],
      sentimentThreshold: { min: -0.5, max: 1 },
      customerValue: "medium",
      erpData: {
        orderValue: { min: 0, max: Infinity },
        lastPurchaseDays: { max: 365 }
      }
    },
    suggestions: [{
      text: "",
      type: "custom",
      priority: 5,
      mlScore: 0.5,
      erpActions: []
    }],
    erpConfigs: {
      bling: { enabled: false, credentials: {}, mappings: {} },
      vtex: { enabled: false, credentials: {}, mappings: {} },
      tiny: { enabled: false, credentials: {}, mappings: {} }
    }
  });
  useEffect(() => {
    loadMagicReplies();
  }, []);
  const loadMagicReplies = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/magic-replies", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMagicReplies(data);
      }
    } catch (error) {
      setMessage("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };
  const saveReply = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const method = selectedReply ? "PUT" : "POST";
      const url = selectedReply ? `/api/admin/magic-replies/${selectedReply._id}` : "/api/admin/magic-replies";
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedReply || newReply)
      });
      if (response.ok) {
        setMessage("Magic Reply salvo com sucesso!");
        await loadMagicReplies();
        setActiveTab("list");
        setSelectedReply(null);
        resetForm();
      } else {
        setMessage("Erro ao salvar Magic Reply.");
      }
    } catch (error) {
      setMessage("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };
  const deleteReply = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este Magic Reply?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/magic-replies/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage("Magic Reply excluído com sucesso!");
        await loadMagicReplies();
      } else {
        setMessage("Erro ao excluir Magic Reply.");
      }
    } catch (error) {
      setMessage("Erro de conexão.");
    }
  };
  const resetForm = () => {
    setNewReply({
      name: "",
      description: "",
      isActive: true,
      context: {
        keywords: [],
        sentimentThreshold: { min: -0.5, max: 1 },
        customerValue: "medium",
        erpData: {
          orderValue: { min: 0, max: Infinity },
          lastPurchaseDays: { max: 365 }
        }
      },
      suggestions: [{
        text: "",
        type: "custom",
        priority: 5,
        mlScore: 0.5,
        erpActions: []
      }],
      erpConfigs: {
        bling: { enabled: false, credentials: {}, mappings: {} },
        vtex: { enabled: false, credentials: {}, mappings: {} },
        tiny: { enabled: false, credentials: {}, mappings: {} }
      }
    });
  };
  const addKeyword = (keyword) => {
    if (keyword && !newReply.context.keywords.includes(keyword)) {
      setNewReply((prev) => ({
        ...prev,
        context: {
          ...prev.context,
          keywords: [...prev.context.keywords, keyword]
        }
      }));
    }
  };
  const removeKeyword = (keyword) => {
    setNewReply((prev) => ({
      ...prev,
      context: {
        ...prev.context,
        keywords: prev.context.keywords.filter((k) => k !== keyword)
      }
    }));
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Magic Replies" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setActiveTab("create");
            setSelectedReply(null);
            resetForm();
          },
          className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",
          children: "+ Novo Magic Reply"
        }
      )
    ] }),
    message && /* @__PURE__ */ jsx("div", { className: `mb-4 p-3 rounded ${message.includes("Erro") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`, children: message }),
    activeTab === "list" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: magicReplies.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-gray-500", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg mb-2", children: "Nenhum Magic Reply configurado" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Crie seu primeiro Magic Reply para começar" })
    ] }) : magicReplies.map((reply) => /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: reply.name }),
          /* @__PURE__ */ jsx("span", { className: `px-2 py-1 text-xs rounded-full ${reply.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: reply.isActive ? "Ativo" : "Inativo" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-2", children: reply.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Keywords: ",
            reply.context.keywords.join(", ") || "Nenhuma"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Sugestões: ",
            reply.suggestions.length
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Conversão: ",
            (reply.effectivenessMetrics?.conversionRate * 100 || 0).toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSelectedReply(reply);
              setNewReply(reply);
              setActiveTab("edit");
            },
            className: "px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50",
            children: "Editar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => deleteReply(reply._id),
            className: "px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50",
            children: "Excluir"
          }
        )
      ] })
    ] }) }, reply._id)) }),
    (activeTab === "create" || activeTab === "edit") && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800", children: activeTab === "create" ? "Criar Magic Reply" : "Editar Magic Reply" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("list"),
            className: "px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50",
            children: "← Voltar"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: newReply.name,
              onChange: (e) => setNewReply((prev) => ({ ...prev, name: e.target.value })),
              className: "w-full px-3 py-2 border rounded",
              placeholder: "Ex: Cliente reclamando de preço"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: newReply.isActive,
              onChange: (e) => setNewReply((prev) => ({ ...prev, isActive: e.target.checked })),
              className: "rounded"
            }
          ),
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-700", children: "Ativo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descrição" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: newReply.description,
            onChange: (e) => setNewReply((prev) => ({ ...prev, description: e.target.value })),
            rows: 3,
            className: "w-full px-3 py-2 border rounded",
            placeholder: "Descrição do contexto de ativação..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-700 mb-4", children: "Contexto de Ativação" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Palavras-chave" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: newReply.context.keywords.map((keyword, index) => /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center", children: [
            keyword,
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeKeyword(keyword),
                className: "ml-2 text-blue-500 hover:text-blue-700",
                children: "×"
              }
            )
          ] }, index)) }),
          /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Adicionar palavra-chave...",
              onKeyPress: (e) => {
                if (e.key === "Enter") {
                  addKeyword(e.target.value);
                  e.target.value = "";
                }
              },
              className: "flex-1 px-3 py-2 border rounded"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Limite de Sentimento" }),
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  min: "-1",
                  max: "1",
                  value: newReply.context.sentimentThreshold.min,
                  onChange: (e) => setNewReply((prev) => ({
                    ...prev,
                    context: {
                      ...prev.context,
                      sentimentThreshold: {
                        ...prev.context.sentimentThreshold,
                        min: parseFloat(e.target.value)
                      }
                    }
                  })),
                  className: "w-full px-3 py-2 border rounded",
                  placeholder: "Mínimo"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.1",
                  min: "-1",
                  max: "1",
                  value: newReply.context.sentimentThreshold.max,
                  onChange: (e) => setNewReply((prev) => ({
                    ...prev,
                    context: {
                      ...prev.context,
                      sentimentThreshold: {
                        ...prev.context.sentimentThreshold,
                        max: parseFloat(e.target.value)
                      }
                    }
                  })),
                  className: "w-full px-3 py-2 border rounded",
                  placeholder: "Máximo"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Valor do Cliente" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: newReply.context.customerValue,
                onChange: (e) => setNewReply((prev) => ({
                  ...prev,
                  context: {
                    ...prev.context,
                    customerValue: e.target.value
                  }
                })),
                className: "w-full px-3 py-2 border rounded",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "low", children: "Baixo" }),
                  /* @__PURE__ */ jsx("option", { value: "medium", children: "Médio" }),
                  /* @__PURE__ */ jsx("option", { value: "high", children: "Alto" }),
                  /* @__PURE__ */ jsx("option", { value: "vip", children: "VIP" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-700 mb-4", children: "Sugestões de Resposta" }),
        newReply.suggestions.map((suggestion, index) => /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-white rounded border", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsx(
            "textarea",
            {
              value: suggestion.text,
              onChange: (e) => {
                const updated = [...newReply.suggestions];
                updated[index].text = e.target.value;
                setNewReply((prev) => ({ ...prev, suggestions: updated }));
              },
              rows: 3,
              className: "w-full px-3 py-2 border rounded",
              placeholder: "Texto da sugestão..."
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: suggestion.type,
                onChange: (e) => {
                  const updated = [...newReply.suggestions];
                  updated[index].type = e.target.value;
                  setNewReply((prev) => ({ ...prev, suggestions: updated }));
                },
                className: "px-3 py-1 border rounded text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "parcelamento", children: "Parcelamento" }),
                  /* @__PURE__ */ jsx("option", { value: "cupom", children: "Cupom" }),
                  /* @__PURE__ */ jsx("option", { value: "frete_gratis", children: "Frete Grátis" }),
                  /* @__PURE__ */ jsx("option", { value: "custom", children: "Personalizado" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                max: "10",
                value: suggestion.priority,
                onChange: (e) => {
                  const updated = [...newReply.suggestions];
                  updated[index].priority = parseInt(e.target.value);
                  setNewReply((prev) => ({ ...prev, suggestions: updated }));
                },
                className: "px-3 py-1 border rounded text-sm w-20",
                placeholder: "Prioridade"
              }
            )
          ] })
        ] }, index))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("list"),
            className: "px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: saveReply,
            disabled: saving,
            className: "px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50",
            children: saving ? "Salvando..." : "Salvar Magic Reply"
          }
        )
      ] })
    ] })
  ] });
};
const $$MagicReplies = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Magic Replies - Configuração", "data-astro-cid-ibnucjxy": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="magic-replies-page" data-astro-cid-ibnucjxy> <div class="page-header" data-astro-cid-ibnucjxy> <h1 data-astro-cid-ibnucjxy>Magic Replies</h1> <p class="page-description" data-astro-cid-ibnucjxy>
Configure respostas automáticas inteligentes baseadas em contexto e dados do ERP
</p> </div> ${renderComponent($$result2, "MagicRepliesManagement", MagicRepliesManagement, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/MagicRepliesManagement.jsx", "client:component-export": "default", "data-astro-cid-ibnucjxy": true })} </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/magic-replies.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/magic-replies.astro";
const $$url = "/admin/magic-replies";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$MagicReplies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
