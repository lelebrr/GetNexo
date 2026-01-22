import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../../assets/ClientLayout-Cg0S0bz6.js";
import { u as useTickets, T as TicketList } from "../../../assets/TicketList-C_RCWgbE.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
/* empty css                                      */
import { renderers } from "../../../renderers.mjs";
function TicketForm({ ticket, onClose, onSuccess }) {
  const { createTicket, updateTicket } = useTickets();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    category: "",
    tags: [],
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "medium",
        status: ticket.status || "open",
        category: ticket.category || "",
        tags: ticket.tags || [],
        attachments: ticket.attachments || []
      });
    }
    fetchTemplates();
  }, [ticket]);
  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${"http://localhost:3001"}/api/ticket-templates`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (err) {
    }
  };
  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        title: template.title,
        description: template.description,
        priority: template.priority,
        category: template.category,
        tags: template.tags || []
      });
      setSelectedTemplate(templateId);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (ticket) {
        result = await updateTicket(ticket.id, formData);
      } else {
        result = await createTicket(formData);
      }
      onSuccess?.(result);
      onClose();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const addTag = (tagName) => {
    if (tagName && !formData.tags.find((t) => t.name === tagName)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, { name: tagName, id: Date.now() }]
        // ID temporário
      }));
    }
  };
  const removeTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t.id !== tagId)
    }));
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: ticket ? "Editar Ticket" : "Criar Novo Ticket" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-400 hover:text-gray-600 text-2xl",
          "aria-label": "Fechar",
          children: "×"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [
      !ticket && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Usar Template (opcional)" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedTemplate,
            onChange: (e) => handleTemplateSelect(e.target.value),
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Selecionar template..." }),
              templates.map((template) => /* @__PURE__ */ jsx("option", { value: template.id, children: template.name }, template.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Título *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "title",
            value: formData.title,
            onChange: (e) => handleInputChange("title", e.target.value),
            required: true,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            placeholder: "Digite o título do ticket"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-2", children: "Descrição *" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "description",
            value: formData.description,
            onChange: (e) => handleInputChange("description", e.target.value),
            required: true,
            rows: 4,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            placeholder: "Descreva o problema ou solicitação em detalhes"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700 mb-2", children: "Prioridade" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "priority",
              value: formData.priority,
              onChange: (e) => handleInputChange("priority", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "low", children: "Baixa" }),
                /* @__PURE__ */ jsx("option", { value: "medium", children: "Média" }),
                /* @__PURE__ */ jsx("option", { value: "high", children: "Alta" }),
                /* @__PURE__ */ jsx("option", { value: "urgent", children: "Urgente" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "status",
              value: formData.status,
              onChange: (e) => handleInputChange("status", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "open", children: "Aberto" }),
                /* @__PURE__ */ jsx("option", { value: "pending", children: "Pendente" }),
                /* @__PURE__ */ jsx("option", { value: "resolved", children: "Resolvido" }),
                /* @__PURE__ */ jsx("option", { value: "closed", children: "Fechado" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700 mb-2", children: "Categoria" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "category",
              value: formData.category,
              onChange: (e) => handleInputChange("category", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecionar categoria..." }),
                /* @__PURE__ */ jsx("option", { value: "technical", children: "Técnico" }),
                /* @__PURE__ */ jsx("option", { value: "billing", children: "Faturamento" }),
                /* @__PURE__ */ jsx("option", { value: "feature", children: "Nova funcionalidade" }),
                /* @__PURE__ */ jsx("option", { value: "bug", children: "Bug" }),
                /* @__PURE__ */ jsx("option", { value: "support", children: "Suporte geral" }),
                /* @__PURE__ */ jsx("option", { value: "other", children: "Outro" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Adicionar tag...",
                  onKeyPress: (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.target.value);
                      e.target.value = "";
                    }
                  },
                  className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    const input = e.target.previousElementSibling;
                    addTag(input.value);
                    input.value = "";
                  },
                  className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
                  children: "+"
                }
              )
            ] }),
            formData.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formData.tags.map((tag) => /* @__PURE__ */ jsxs(
              "span",
              {
                className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800",
                children: [
                  tag.name,
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeTag(tag.id),
                      className: "ml-2 text-blue-600 hover:text-blue-800",
                      "aria-label": `Remover tag ${tag.name}`,
                      children: "×"
                    }
                  )
                ]
              },
              tag.id
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Anexos" }),
        /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: "📎" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-2", children: "Arraste arquivos aqui ou clique para selecionar" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              multiple: true,
              className: "hidden",
              id: "file-upload",
              onChange: (e) => {
                const files = Array.from(e.target.files);
                setFormData((prev) => ({
                  ...prev,
                  attachments: [...prev.attachments, ...files]
                }));
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: "file-upload",
              className: "inline-block px-4 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700",
              children: "Selecionar Arquivos"
            }
          )
        ] }) }),
        formData.attachments.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-700", children: "Arquivos selecionados:" }),
          formData.attachments.map((file, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: file.name }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setFormData((prev) => ({
                    ...prev,
                    attachments: prev.attachments.filter((_, i) => i !== index)
                  }));
                },
                className: "text-red-600 hover:text-red-800",
                "aria-label": `Remover ${file.name}`,
                children: "×"
              }
            )
          ] }, index))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3 pt-6 border-t border-gray-200", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50",
            disabled: loading,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: loading || !formData.title.trim() || !formData.description.trim(),
            className: "px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center",
            children: [
              loading && /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }),
              ticket ? "Atualizar Ticket" : "Criar Ticket"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Tickets de Suporte - GetNexo Pro", "data-astro-cid-ojqxkxki": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50" data-astro-cid-ojqxkxki> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-ojqxkxki>  <div class="text-center mb-12" data-astro-cid-ojqxkxki> <div class="inline-block p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-100" data-astro-cid-ojqxkxki> <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4" data-astro-cid-ojqxkxki>
🎫 Sistema de Tickets
</h1> <p class="text-gray-600 text-lg max-w-2xl mx-auto" data-astro-cid-ojqxkxki>
Gerencie todos os seus tickets de suporte com ferramentas avançadas de organização,
                        automação e acompanhamento em tempo real.
</p> </div> </div>  <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-astro-cid-ojqxkxki> <div data-astro-cid-ojqxkxki> <h2 class="text-2xl font-bold text-gray-900" data-astro-cid-ojqxkxki>Tickets de Suporte</h2> <p class="text-gray-600 mt-1" data-astro-cid-ojqxkxki>Acompanhe e resolva suas solicitações</p> </div> <div class="flex gap-3" data-astro-cid-ojqxkxki> <button id="create-ticket-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium" data-astro-cid-ojqxkxki> <span data-astro-cid-ojqxkxki>➕</span>
Novo Ticket
</button> <button class="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium" data-astro-cid-ojqxkxki> <span data-astro-cid-ojqxkxki>📊</span>
Relatórios
</button> </div> </div>  ${renderComponent($$result2, "TicketList", TicketList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/tickets/TicketList.jsx", "client:component-export": "default", "data-astro-cid-ojqxkxki": true })}  <div id="ticket-modal" class="hidden" data-astro-cid-ojqxkxki> ${renderComponent($$result2, "TicketForm", TicketForm, { "client:load": true, "onClose": (() => {
    document.getElementById("ticket-modal").classList.add("hidden");
  }), "onSuccess": ((ticket) => {
    window.location.reload();
  }), "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/tickets/TicketForm.jsx", "client:component-export": "default", "data-astro-cid-ojqxkxki": true })} </div> </div> </div> ${renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte/tickets/index.astro?astro&type=script&index=0&lang.ts")}  ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte/tickets/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte/tickets/index.astro";
const $$url = "/dashboard/suporte/tickets";
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
