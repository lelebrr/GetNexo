import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
const API_URL = "http://localhost:3001";
function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    period: "all",
    search: "",
    agent: "all",
    tags: []
  });
  const [ws, setWs] = useState(null);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const socket = new WebSocket(`${API_URL.replace("http", "ws")}/tickets/ws`);
    socket.onopen = () => {
      setWs(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ticket_update") {
        setNotifications((prev) => [data, ...prev]);
        setTickets((prev) => prev.map(
          (ticket) => ticket.id === data.ticketId ? { ...ticket, ...data.updates } : ticket
        ));
      }
    };
    socket.onclose = () => {
      setWs(null);
    };
    socket.onerror = (error2) => {
    };
    return () => {
      socket.close();
    };
  }, []);
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all" && value !== "" && (!Array.isArray(value) || value.length > 0)) {
          if (Array.isArray(value)) {
            queryParams.set(key, value.join(","));
          } else {
            queryParams.set(key, value);
          }
        }
      });
      const url = `${API_URL}/api/tickets${queryParams.toString() ? `?${queryParams}` : ""}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Erro ao carregar tickets");
      const data = await response.json();
      setTickets(data.tickets || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  const createTicket = useCallback(async (ticketData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticketData)
      });
      if (!response.ok) throw new Error("Erro ao criar ticket");
      const newTicket = await response.json();
      setTickets((prev) => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  const updateTicket = useCallback(async (ticketId, updates) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error("Erro ao atualizar ticket");
      const updatedTicket = await response.json();
      setTickets((prev) => prev.map(
        (ticket) => ticket.id === ticketId ? updatedTicket : ticket
      ));
      return updatedTicket;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  const deleteTicket = useCallback(async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Erro ao deletar ticket");
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  const addTag = useCallback(async (ticketId, tagId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}/tags`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tagId })
      });
      if (!response.ok) throw new Error("Erro ao adicionar tag");
      const result = await response.json();
      setTickets((prev) => prev.map(
        (ticket) => ticket.id === ticketId ? { ...ticket, tags: [...ticket.tags || [], result.tag] } : ticket
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  const removeTag = useCallback(async (ticketId, tagId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Erro ao remover tag");
      setTickets((prev) => prev.map(
        (ticket) => ticket.id === ticketId ? { ...ticket, tags: ticket.tags.filter((tag) => tag.id !== tagId) } : ticket
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  const transferTicket = useCallback(async (ticketId, agentId) => {
    return updateTicket(ticketId, { assignedAgent: agentId, transferHistory: true });
  }, [updateTicket]);
  const pauseSLA = useCallback(async (ticketId, reason, duration) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}/sla-pause`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason, duration })
      });
      if (!response.ok) throw new Error("Erro ao pausar SLA");
      const result = await response.json();
      setTickets((prev) => prev.map(
        (ticket) => ticket.id === ticketId ? { ...ticket, slaPaused: true, slaPauseHistory: [...ticket.slaPauseHistory || [], result] } : ticket
      ));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);
  return {
    tickets,
    loading,
    error,
    filters,
    setFilters,
    notifications,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    addTag,
    removeTag,
    transferTicket,
    pauseSLA
  };
}
function TicketList() {
  const { tickets, loading, error, filters, setFilters, fetchTickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, setFilters]);
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };
  const toggleTicketSelection = (ticketId) => {
    setSelectedTickets(
      (prev) => prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    );
  };
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || colors.open;
  };
  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      urgent: "text-red-600"
    };
    return colors[priority] || colors.medium;
  };
  const getStatusText = (status) => {
    const texts = {
      open: "Aberto",
      pending: "Pendente",
      resolved: "Resolvido",
      closed: "Fechado"
    };
    return texts[status] || "Aberto";
  };
  const getPriorityText = (priority) => {
    const texts = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      urgent: "Urgente"
    };
    return texts[priority] || "Média";
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }),
      /* @__PURE__ */ jsx("span", { className: "ml-3 text-gray-600", children: "Carregando tickets..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-red-600", children: "⚠️" }),
        /* @__PURE__ */ jsx("p", { className: "ml-2 text-red-800", children: error })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchTickets,
          className: "mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
          children: "Tentar novamente"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Filtros" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "search", className: "block text-sm font-medium text-gray-700 mb-1", children: "Buscar" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "search",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Título ou descrição...",
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "aria-label": "Buscar tickets"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "status-filter", className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "status-filter",
              value: filters.status,
              onChange: (e) => handleFilterChange("status", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "aria-label": "Filtrar por status",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos os status" }),
                /* @__PURE__ */ jsx("option", { value: "open", children: "Aberto" }),
                /* @__PURE__ */ jsx("option", { value: "pending", children: "Pendente" }),
                /* @__PURE__ */ jsx("option", { value: "resolved", children: "Resolvido" }),
                /* @__PURE__ */ jsx("option", { value: "closed", children: "Fechado" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "priority-filter", className: "block text-sm font-medium text-gray-700 mb-1", children: "Prioridade" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "priority-filter",
              value: filters.priority,
              onChange: (e) => handleFilterChange("priority", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "aria-label": "Filtrar por prioridade",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todas as prioridades" }),
                /* @__PURE__ */ jsx("option", { value: "low", children: "Baixa" }),
                /* @__PURE__ */ jsx("option", { value: "medium", children: "Média" }),
                /* @__PURE__ */ jsx("option", { value: "high", children: "Alta" }),
                /* @__PURE__ */ jsx("option", { value: "urgent", children: "Urgente" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "period-filter", className: "block text-sm font-medium text-gray-700 mb-1", children: "Período" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "period-filter",
              value: filters.period,
              onChange: (e) => handleFilterChange("period", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "aria-label": "Filtrar por período",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todo período" }),
                /* @__PURE__ */ jsx("option", { value: "week", children: "Esta semana" }),
                /* @__PURE__ */ jsx("option", { value: "month", children: "Este mês" }),
                /* @__PURE__ */ jsx("option", { value: "quarter", children: "Este trimestre" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [
      /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: [
          "Tickets (",
          tickets.length,
          ")"
        ] }),
        selectedTickets.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
            selectedTickets.length,
            " selecionado(s)"
          ] }),
          /* @__PURE__ */ jsx("button", { className: "px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700", children: "Ações em lote" })
        ] })
      ] }) }),
      tickets.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🎫" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Nenhum ticket encontrado" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: filters.search || filters.status !== "all" || filters.priority !== "all" ? "Tente ajustar os filtros para ver mais resultados." : "Seus tickets aparecerão aqui quando criados." }),
        /* @__PURE__ */ jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Criar primeiro ticket" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200", children: tickets.map((ticket) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "p-6 hover:bg-gray-50 transition-colors cursor-pointer",
          onClick: () => window.location.href = `/dashboard/suporte/tickets/${ticket.id}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: selectedTickets.includes(ticket.id),
                onChange: (e) => {
                  e.stopPropagation();
                  toggleTicketSelection(ticket.id);
                },
                className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                "aria-label": `Selecionar ticket ${ticket.title}`
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl", children: ticket.icon || "🎫" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-gray-900 truncate", children: ticket.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-1 line-clamp-2", children: ticket.description })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 ml-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`, children: getStatusText(ticket.status) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between text-sm text-gray-500", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "ID: #",
                    ticket.id
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `font-medium ${getPriorityColor(ticket.priority)}`, children: getPriorityText(ticket.priority) }),
                  ticket.assignedAgent && /* @__PURE__ */ jsxs("span", { children: [
                    "👤 ",
                    ticket.assignedAgent.name
                  ] }),
                  ticket.tags && ticket.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex space-x-1", children: [
                    ticket.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
                        children: tag.name
                      },
                      tag.id
                    )),
                    ticket.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                      "+",
                      ticket.tags.length - 3
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Atualizado: ",
                    new Date(ticket.updatedAt).toLocaleDateString("pt-BR")
                  ] }),
                  ticket.slaPaused && /* @__PURE__ */ jsx("span", { className: "text-orange-600 font-medium", children: "⏸️ SLA pausado" })
                ] })
              ] })
            ] })
          ] })
        },
        ticket.id
      )) })
    ] })
  ] });
}
export {
  TicketList as T,
  useTickets as u
};
