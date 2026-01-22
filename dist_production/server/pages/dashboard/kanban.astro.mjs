import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { renderers } from "../../renderers.mjs";
const OrderBuilder = ({ onSendOrder, onClose }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  useEffect(() => {
    fetch("https://api.getnexo.com.br/catalog").then((res) => res.json()).then((data) => setProducts(data.products || []));
  }, []);
  const addToCart = (p) => {
    setCart([...cart, p]);
  };
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  const handleGenerate = () => {
    const orderText = `🛒 *PEDIDO PREPARADO PELA LOJA*

${cart.map((p) => `- ${p.name}: R$${p.price.toFixed(2)}`).join("\n")}

💰 *TOTAL: R$${total.toFixed(2)}*

👉 *PAGUE AQUI:* https://pix.gateway.com/${Date.now()}

Confirme o pagamento enviando o comprovante!`;
    onSendOrder(orderText);
  };
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-white flex items-center gap-2", children: [
        "🛍️ Venda Assistida ",
        /* @__PURE__ */ jsx("span", { className: "text-xs bg-neon-blue text-black px-2 rounded", children: "Beta" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-white", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-1/2 border-r border-gray-800 p-4 overflow-y-auto custom-scrollbar", children: [
        /* @__PURE__ */ jsx("input", { placeholder: "Buscar produtos...", className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white mb-4" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: products.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 bg-gray-800/50 p-2 rounded hover:bg-gray-800 transition-colors", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-xl", children: "📦" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-200 text-sm", children: p.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-neon-green text-xs font-mono", children: [
              "R$ ",
              p.price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => addToCart(p), className: "bg-neon-blue text-black w-8 h-8 rounded-full font-bold hover:scale-110 transition-transform", children: "+" })
        ] }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-1/2 p-4 flex flex-col bg-black/20", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-gray-400 text-xs font-bold uppercase mb-4", children: [
          "Carrinho Atual (",
          cart.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto space-y-2 mb-4", children: [
          cart.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-gray-600 mt-10 italic", children: "Carrinho vazio" }),
          cart.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm border-b border-gray-800 pb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: item.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
                "R$",
                item.price
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => removeFromCart(idx), className: "text-red-500 hover:text-red-400", children: "×" })
            ] })
          ] }, idx))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-700 pt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xl font-bold text-white mb-4", children: [
            /* @__PURE__ */ jsx("span", { children: "Total:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-neon-green", children: [
              "R$ ",
              total.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleGenerate,
              disabled: cart.length === 0,
              className: "w-full bg-gradient-to-r from-neon-blue to-green-400 text-black font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all",
              children: "✅ Gerar Pedido & Link"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};
const API_URL$7 = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8080" : "https://api.getnexo.com.br";
const MeetingScheduler = ({ contact, onClose, onScheduled }) => {
  const [summary, setSummary] = useState(`Reunião com ${contact.name || contact.phone}`);
  const [description, setDescription] = useState("Conversa sobre GetNexo");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!date || !time) return alert("Selecione data e hora");
    setLoading(true);
    try {
      const startTime = /* @__PURE__ */ new Date(`${date}T${time}:00`);
      const endTime = new Date(startTime.getTime() + duration * 6e4);
      const res = await axios.post(`${API_URL$7}/api/integrations/calendar/schedule`, {
        summary,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        attendees: [contact.email].filter(Boolean)
      });
      if (res.data.ok) {
        alert("Reunião agendada com sucesso!");
        onScheduled(`📅 Reunião Agendada: ${summary}
Data: ${date} às ${time}
Link: ${res.data.link}`);
        onClose();
      }
    } catch (err) {
      alert("Falha ao agendar. Verifique as configurações do Google Calendar no Admin Panel.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-zoom-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-800 flex justify-between items-center bg-black/20", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { children: "📅" }),
        " Agendar Reunião"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-white transition-colors text-2xl", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSchedule, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "Assunto" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: summary,
            onChange: (e) => setSummary(e.target.value),
            className: "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "Data" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: date,
              onChange: (e) => setDate(e.target.value),
              className: "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue color-scheme-dark"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "Hora" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "time",
              value: time,
              onChange: (e) => setTime(e.target.value),
              className: "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue color-scheme-dark"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "Duração (minutos)" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: duration,
            onChange: (e) => setDuration(Number(e.target.value)),
            className: "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue",
            children: [
              /* @__PURE__ */ jsx("option", { value: 15, children: "15 minutos" }),
              /* @__PURE__ */ jsx("option", { value: 30, children: "30 minutos" }),
              /* @__PURE__ */ jsx("option", { value: 45, children: "45 minutos" }),
              /* @__PURE__ */ jsx("option", { value: 60, children: "1 hora" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: `w-full py-4 rounded-xl font-bold text-black transition-all transform active:scale-95 ${loading ? "bg-gray-700" : "bg-neon-blue hover:bg-white shadow-[0_0_20px_rgba(0,212,255,0.3)]"}`,
          children: loading ? "AGENDANDO..." : "CONFIRMAR AGENDAMENTO"
        }
      ) })
    ] })
  ] }) });
};
const API_URL$6 = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8080" : "https://api.getnexo.com.br";
const socket = io(API_URL$6);
const ChatInterface = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNote, setIsNote] = useState(false);
  const [macros, setMacros] = useState([]);
  const [showMacros, setShowMacros] = useState(false);
  const [showCsat, setShowCsat] = useState(false);
  const [inboxTab, setInboxTab] = useState("all");
  const [agents, setAgents] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [showOrderBuilder, setShowOrderBuilder] = useState(false);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  JSON.parse(localStorage.getItem("omnichat_user") || "{}");
  const messagesEndRef = useRef(null);
  useEffect(() => {
    fetchContacts();
    fetchMacros();
    fetchAgents();
    socket.on("new-message", handleNewMessage);
    socket.on("ticket:update", (data) => {
      if (activeContactRef.current && activeContactRef.current.phone === data.phone) {
        fetchTicket(data.phone);
      }
      fetchContacts();
    });
    socket.on("contact:new", fetchContacts);
    socket.on("contact-updated", fetchContacts);
    return () => {
      socket.off("new-message");
      socket.off("contact:new");
      socket.off("contact-updated");
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL$6}/contacts`);
      setContacts(res.data);
      setLoading(false);
    } catch (err) {
    }
  };
  const fetchMacros = async () => {
    try {
      const res = await axios.get(`${API_URL$6}/macros`);
      setMacros(res.data);
    } catch (e) {
    }
  };
  const fetchAgents = async () => {
    try {
      const res = await axios.get(`${API_URL$6}/users`);
      setAgents(res.data);
    } catch (e) {
    }
  };
  const fetchTicket = async (phone) => {
    try {
      const res = await axios.get(`${API_URL$6}/ticket/${phone}`);
      setTicket(res.data);
    } catch (e) {
      setTicket(null);
    }
  };
  const handleAssign = async (agentId) => {
    if (!activeContact) return;
    await axios.post(`${API_URL$6}/ticket/assign`, { phone: activeContact.phone, agent_id: agentId });
    fetchTicket(activeContact.phone);
  };
  const handleResolve = async () => {
    if (!activeContact) return;
    await axios.post(`${API_URL$6}/ticket/resolve`, { phone: activeContact.phone });
    setTicket({ ...ticket, status: "resolved" });
  };
  const activeContactRef = useRef(activeContact);
  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);
  const handleNewMessage = (msg) => {
    if (activeContactRef.current && activeContactRef.current.phone === msg.phone) {
      setMessages((prev) => [...prev, msg]);
    }
    fetchContacts();
  };
  const selectContact = async (contact) => {
    setActiveContact(contact);
    fetchTicket(contact.phone);
    try {
      const res = await axios.get(`${API_URL$6}/messages?phone=${contact.phone}`);
      setMessages(res.data);
    } catch (err) {
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeContact) return;
    try {
      const endpoint = `${API_URL$6}/send`;
      await axios.post(endpoint, {
        phone: activeContact.phone,
        body: input,
        type: isNote ? "note" : "text"
      });
      setInput("");
      setIsNote(false);
      setShowMacros(false);
    } catch (err) {
      alert("Failed to send");
    }
  };
  const handleDragStart = (e, contact) => {
    e.dataTransfer.setData("contactPhone", contact.phone);
  };
  const suggestAI = async () => {
    if (!activeContact) return;
    setAiSuggesting(true);
    try {
      const res = await axios.post(`${API_URL$6}/api/ai/suggest`, {
        history: messages,
        currentMessage: messages[messages.length - 1]?.body,
        context: activeContact.name || activeContact.phone
      });
      if (res.data.suggestion) {
        setInput(res.data.suggestion);
      }
    } catch (e) {
      alert("Erro ao gerar sugestão da IA.");
    } finally {
      setAiSuggesting(false);
    }
  };
  const handleRate = async (nota) => {
    try {
      await axios.post(`${API_URL$6}/csat`, { phone: activeContact.phone, nota });
      alert("Obrigado pela avaliação!");
      setShowCsat(false);
    } catch (e) {
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[80vh] gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col glass-panel rounded-2xl border border-gray-800 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-10 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1 bg-gray-900 p-1 rounded-lg", children: [
          /* @__PURE__ */ jsx("button", { className: "flex-1 bg-gray-800 text-white text-xs py-1 rounded shadow text-center", children: "WhatsApp" }),
          /* @__PURE__ */ jsx("button", { className: "flex-1 text-gray-500 hover:text-white text-xs py-1 text-center", children: "Instagram" }),
          /* @__PURE__ */ jsx("button", { className: "flex-1 text-gray-500 hover:text-white text-xs py-1 text-center", children: "Messenger" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-400 border-b border-gray-800 pb-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setInboxTab("mine"), className: `${inboxTab === "mine" ? "text-neon-blue font-bold border-b-2 border-neon-blue" : "hover:text-white"}`, children: "Meus" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setInboxTab("all"), className: `${inboxTab === "all" ? "text-white font-bold border-b-2 border-white" : "hover:text-white"}`, children: "Todos" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setInboxTab("resolved"), className: `${inboxTab === "resolved" ? "text-green-500 font-bold border-b-2 border-green-500" : "hover:text-white"}`, children: "Resolvidos" })
        ] }),
        /* @__PURE__ */ jsx("input", { placeholder: "Buscar...", className: "w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-neon-blue" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 mt-10", children: "Carregando..." }) : contacts.map((c) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => selectContact(c),
          draggable: true,
          onDragStart: (e) => handleDragStart(e, c),
          className: `p-3 rounded-xl cursor-pointer transition-all border ${activeContact?.id === c.id ? "bg-neon-blue/10 border-neon-blue" : "bg-transparent border-transparent hover:bg-gray-800"} flex items-center gap-3 group`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-gray-600", children: c.name ? c.name[0].toUpperCase() : "#" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-200 truncate group-hover:text-white transition-colors", children: c.name || c.phone }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 bg-gray-900 px-1 rounded uppercase tracking-wider", children: c.stage || "NEW" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 truncate", children: c.last_message?.body || "Inicie a conversa..." })
            ] })
          ]
        },
        c.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col glass-panel rounded-2xl border border-gray-800 overflow-hidden relative", children: activeContact ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-800 bg-black/40 backdrop-blur-md flex justify-between items-center z-10", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-xl text-white flex items-center gap-2", children: [
            activeContact.name || activeContact.phone,
            ticket?.status === "resolved" && /* @__PURE__ */ jsx("span", { className: "text-xs bg-green-900 text-green-300 px-2 rounded-full border border-green-700", children: "RESOLVIDO" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs flex gap-3 text-gray-400", children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "bg-transparent border-none outline-none cursor-pointer hover:text-neon-blue transition-colors",
                value: ticket?.assigned_to || "",
                onChange: (e) => handleAssign(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "👤 Atribuir a..." }),
                  agents.map((a) => /* @__PURE__ */ jsx("option", { value: a.id, children: a.email }, a.id))
                ]
              }
            ),
            ticket?.status !== "resolved" && /* @__PURE__ */ jsx("button", { onClick: handleResolve, className: "hover:text-green-400", children: "✅ Resolver" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 relative", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setShowOrderBuilder(true), className: "text-xs bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-black px-3 py-1 rounded border border-neon-blue transition-colors font-bold", children: "🛍️ Venda Assistida" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowMeetingScheduler(true), className: "text-xs bg-purple-900/20 text-purple-400 hover:bg-purple-800 hover:text-white px-3 py-1 rounded border border-purple-800 transition-colors font-bold", children: "📅 Agendar Reunião" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowCsat(!showCsat), className: "text-xs bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-1 rounded border border-gray-600 transition-colors", children: "⭐ CSAT" }),
          showCsat && /* @__PURE__ */ jsxs("div", { className: "absolute top-10 right-0 w-64 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl z-50", children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-3 text-sm font-bold text-center", children: "Nota de 1 a 5:" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2 justify-center", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx("button", { onClick: () => handleRate(n), className: "w-8 h-8 rounded-full bg-gray-800 hover:bg-neon-blue hover:text-black text-white font-bold transition-colors border border-gray-600 hover:border-neon-blue", children: n }, n)) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-dots-pattern", children: [
        messages.map((m, i) => /* @__PURE__ */ jsx("div", { className: `flex ${m.from_me ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxs("div", { className: `max-w-[70%] p-4 rounded-2xl shadow-lg backdrop-blur-sm border ${m.type === "note" ? "bg-yellow-900/40 border-yellow-600 text-yellow-100" : m.from_me ? "bg-neon-blue/20 border-neon-blue/30 text-white rounded-tr-none" : "bg-gray-800/80 border-gray-700 text-gray-200 rounded-tl-none"}`, children: [
          m.type === "note" && /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase font-bold text-yellow-500 mb-1 flex items-center gap-1", children: "🔒 Nota Interna" }),
          /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap leading-relaxed text-sm", children: m.body }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-50 mt-2 block text-right", children: (/* @__PURE__ */ new Date()).toLocaleTimeString().slice(0, 5) })
        ] }) }, i)),
        /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `p-4 border-t border-gray-800 ${isNote ? "bg-yellow-900/20" : "bg-black/40"} relative transition-all duration-300`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 px-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsNote(!isNote),
              className: `text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${isNote ? "bg-yellow-500 text-black border-yellow-500" : "text-gray-400 border-gray-700 hover:border-gray-500"}`,
              children: "🔒 NOTA INTERNA"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowMacros(!showMacros),
              className: "text-[10px] font-bold px-3 py-1 rounded-full text-neon-blue border border-gray-700 hover:border-neon-blue transition-all",
              children: "⚡ RESPOSTA RÁPIDA"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: suggestAI,
              disabled: aiSuggesting,
              className: `text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${aiSuggesting ? "bg-gray-700 text-gray-500 border-gray-600" : "bg-purple-900/20 text-purple-400 border-purple-800 hover:bg-purple-800 hover:text-white"}`,
              children: [
                "🤖 ",
                aiSuggesting ? "GERANDO..." : "IA SUGERIR"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: sendMessage, className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: `w-full bg-gray-900/50 border p-4 pr-12 rounded-2xl text-white outline-none transition-all ${isNote ? "border-yellow-600 focus:shadow-[0_0_15px_rgba(234,179,8,0.2)]" : "border-gray-800 focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.1)]"}`,
                placeholder: isNote ? "Escreva uma nota interna (invisível para o cliente)..." : "Digite sua mensagem...",
                value: input,
                onChange: (e) => setInput(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 flex gap-2", children: [
              /* @__PURE__ */ jsx("button", { type: "button", className: "text-gray-500 hover:text-white transition-colors", children: "📎" }),
              /* @__PURE__ */ jsx("button", { type: "button", className: "text-gray-500 hover:text-white transition-colors", children: "😊" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: `px-8 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center gap-2 ${isNote ? "bg-yellow-600 text-black hover:bg-yellow-500 shadow-[0_4px_15px_rgba(234,179,8,0.3)]" : "bg-neon-blue text-black hover:bg-white shadow-[0_4px_15px_rgba(0,212,255,0.3)]"}`,
              children: [
                isNote ? "SALVAR" : "ENVIAR",
                /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🚀" })
              ]
            }
          )
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-gray-600 bg-dots-pattern", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-6 animate-pulse shadow-2xl", children: /* @__PURE__ */ jsx("span", { className: "text-5xl", children: "💬" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-400 mb-2", children: "Central de Atendimento" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-60", children: "Selecione uma conversa para começar a vender" })
    ] }) }),
    activeContact && showRightSidebar && /* @__PURE__ */ jsxs("div", { className: "w-1/4 flex flex-col glass-panel rounded-2xl border border-gray-800 animate-slide-in-right", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-800 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-300", children: "Detalhes do Lead" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowRightSidebar(false), className: "text-gray-500 hover:text-white", children: "✕" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col items-center border-b border-gray-800", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-[0_0_20px_rgba(0,212,255,0.4)]", children: activeContact.name ? activeContact.name[0].toUpperCase() : "?" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white text-center", children: activeContact.name || "Sem Nome" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: activeContact.phone })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 flex-1 overflow-y-auto space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2", children: "Tags" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-neon-blue/10 text-neon-blue text-[10px] px-2 py-1 rounded border border-neon-blue/20", children: "🔥 Lead Quente" }),
            /* @__PURE__ */ jsx("span", { className: "bg-purple-900/20 text-purple-400 text-[10px] px-2 py-1 rounded border border-purple-800", children: "🤖 IA Ativa" }),
            /* @__PURE__ */ jsx("button", { className: "text-[10px] text-gray-500 border border-dashed border-gray-700 px-2 py-1 rounded hover:border-gray-500", children: "+ Add" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2", children: "Histórico de Pedidos" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 italic p-4 bg-black/20 rounded-xl border border-gray-800 text-center", children: "Nenhum pedido encontrado." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2", children: "Notas Rápidas" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 outline-none focus:border-neon-blue min-h-[100px]",
              placeholder: "Anotações sobre este cliente..."
            }
          )
        ] })
      ] })
    ] }),
    showOrderBuilder && /* @__PURE__ */ jsx(
      OrderBuilder,
      {
        onClose: () => setShowOrderBuilder(false),
        onSendOrder: (text) => {
          setInput(text);
          setShowOrderBuilder(false);
        }
      }
    ),
    showMeetingScheduler && /* @__PURE__ */ jsx(
      MeetingScheduler,
      {
        contact: activeContact,
        onClose: () => setShowMeetingScheduler(false),
        onScheduled: (text) => {
          setInput(text);
          setShowMeetingScheduler(false);
        }
      }
    )
  ] });
};
const API_URL$5 = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8080" : "https://api.getnexo.com.br";
const STAGES = {
  "lead": { label: "Novo Lead", color: "text-cyan-400", bg: "bg-cyan-500/10", gradient: "from-cyan-500 to-blue-600", icon: "✨" },
  "qualified": { label: "Qualificado", color: "text-purple-400", bg: "bg-purple-500/10", gradient: "from-purple-500 to-pink-500", icon: "🎯" },
  "proposal": { label: "Em Negociação", color: "text-orange-400", bg: "bg-orange-500/10", gradient: "from-orange-500 to-red-500", icon: "🔥" },
  "closed": { label: "Venda Fechada", color: "text-green-400", bg: "bg-green-500/10", gradient: "from-green-500 to-emerald-600", icon: "🏆" }
};
const getLeadScore = (contact) => {
  const score = Math.floor(Math.random() * 100);
  if (score > 80) return { label: "Quente", color: "text-red-500", icon: "🔥", bg: "bg-red-500/10" };
  if (score > 40) return { label: "Morno", color: "text-yellow-500", icon: "☀️", bg: "bg-yellow-500/10" };
  return { label: "Frio", color: "text-blue-500", icon: "❄️", bg: "bg-blue-500/10" };
};
const getAvatarColor = (name) => {
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
const KanbanBoard = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState({});
  const [insightLoading, setInsightLoading] = useState(null);
  useEffect(() => {
    fetchContacts();
  }, []);
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL$5}/contacts`);
      const processed = (res.data || []).map((c) => ({
        ...c,
        funnel_stage: c.funnel_stage || "lead"
      }));
      setContacts(processed);
    } catch (error) {
      setContacts([
        { id: "1", name: "João Silva", phone: "5511999999999", funnel_stage: "lead", value: 1500, last_message: { body: "Tenho interesse no plano Enterprise" } },
        { id: "2", name: "Maria Santos", phone: "5511888888888", funnel_stage: "qualified", value: 3200, last_message: { body: "Podemos agendar uma call?" } },
        { id: "3", name: "Carlos Oliveira", phone: "5511777777777", funnel_stage: "proposal", value: 5e3, last_message: { body: "Aguardando contrato." } }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleDragStart = (e, id) => {
    setDraggedId(id);
  };
  const handleDrop = async (e, stage) => {
    e.preventDefault();
    if (!draggedId) return;
    setContacts((prev) => prev.map((c) => c.id === draggedId ? { ...c, funnel_stage: stage } : c));
    await axios.post(`${API_URL$5}/update-stage`, { phone: draggedId, stage });
    setDraggedId(null);
  };
  const handleDragOver = (e) => e.preventDefault();
  const toggleAIInsight = async (contactId, phone, name) => {
    if (insightLoading === contactId) return;
    if (aiInsights[contactId]) {
      setAiInsights((prev) => {
        const n = { ...prev };
        delete n[contactId];
        return n;
      });
      return;
    }
    setInsightLoading(contactId);
    try {
      const res = await axios.post(`${API_URL$5}/api/ai/lead-insight`, { phone, name });
      setAiInsights((prev) => ({ ...prev, [contactId]: res.data.insight }));
    } catch (e) {
      alert("Erro ao gerar insight.");
    } finally {
      setInsightLoading(null);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex h-full gap-6 overflow-x-auto pb-4 p-6", children: Object.entries(STAGES).map(([stageId, stage]) => {
    const columnContacts = contacts.filter((c) => (c.funnel_stage || "lead") === stageId);
    const totalValue = columnContacts.reduce((acc, c) => acc + (c.value || 0), 0);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "min-w-[320px] w-[320px] flex flex-col rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm",
        onDragOver: handleDragOver,
        onDrop: (e) => handleDrop(e, stageId),
        children: [
          /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-t-2xl border-b border-gray-800 bg-gradient-to-r ${stage.gradient} bg-opacity-10`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
              /* @__PURE__ */ jsxs("h3", { className: `font-bold text-sm ${stage.color} flex items-center gap-2`, children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: stage.icon }),
                " ",
                stage.label
              ] }),
              /* @__PURE__ */ jsx("span", { className: "bg-black/30 px-2 py-1 rounded-full text-xs font-mono text-gray-400", children: columnContacts.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-500 font-mono tracking-wider", children: [
              "POTENCIAL: R$ ",
              totalValue.toLocaleString("pt-BR")
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3", children: columnContacts.map((contact) => {
            const score = getLeadScore();
            const hasInsight = aiInsights[contact.id];
            return /* @__PURE__ */ jsxs(
              "div",
              {
                draggable: true,
                onDragStart: (e) => handleDragStart(e, contact.id),
                className: "group relative bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-move hover:border-gray-600 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full ${getAvatarColor(contact.name || "?")} flex items-center justify-center text-white font-bold shadow-lg`, children: (contact.name?.[0] || "?").toUpperCase() }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-white text-sm truncate", children: contact.name || contact.phone }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                        /* @__PURE__ */ jsxs("span", { className: `text-[10px] px-2 py-0.5 rounded border ${score.color} ${score.bg} border-${score.color}/20 flex items-center gap-1`, children: [
                          score.icon,
                          " ",
                          score.label
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-500", children: "2h atrás" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200", children: [
                    /* @__PURE__ */ jsx("button", { onClick: () => onSelectContact && onSelectContact(contact), className: "flex-1 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 py-1 rounded text-xs font-bold transition-colors", children: "💬 Chat" }),
                    /* @__PURE__ */ jsx("button", { className: "flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 py-1 rounded text-xs font-bold transition-colors", children: "📞 Ligar" })
                  ] }),
                  hasInsight && /* @__PURE__ */ jsxs("div", { className: "mb-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg animate-fade-in", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-purple-400", children: "🧠 NEXO AI INSIGHT" }),
                      /* @__PURE__ */ jsx("button", { onClick: () => toggleAIInsight(contact.id), className: "text-[10px] text-gray-500 hover:text-white", children: "✕" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-300 leading-relaxed italic", children: [
                      '"',
                      hasInsight,
                      '"'
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-gray-800", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => toggleAIInsight(contact.id, contact.phone, contact.name),
                        className: `text-[10px] flex items-center gap-1 transition-colors ${hasInsight ? "text-purple-400" : "text-gray-500 hover:text-purple-400"}`,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: insightLoading === contact.id ? "animate-spin" : "", children: insightLoading === contact.id ? "⏳" : "✨" }),
                          insightLoading === contact.id ? "Analizando..." : hasInsight ? "Ver Insight" : "Gerar Insight"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "flex -space-x-2", children: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full bg-gray-700 border border-gray-900" }) })
                  ] })
                ]
              },
              contact.id
            );
          }) })
        ]
      },
      stageId
    );
  }) });
};
const API_URL$4 = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8080" : "https://api.getnexo.com.br";
const BroadcastManager = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    stage: "all",
    lastMessage: "all",
    tags: []
  });
  useEffect(() => {
    fetchContacts();
    fetchCampaigns();
    fetchTemplates();
  }, []);
  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/contacts");
      setContacts(res.data || []);
    } catch (e) {
    }
  };
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("/api/campaigns");
      setCampaigns(res.data || []);
    } catch (e) {
    }
  };
  const fetchTemplates = async () => {
    setTemplates([
      { id: 1, name: "Boas Vindas", content: "Olá {nome}! Bem-vindo ao nosso atendimento! Como posso ajudar você hoje?" },
      { id: 2, name: "Promoção Especial", content: "🎉 Promoção especial! Aproveite 30% de desconto em todos os produtos por tempo limitado!" },
      { id: 3, name: "Lembrete de Agendamento", content: "Olá {nome}, lembrete do seu agendamento amanhã às {hora}. Estamos ansiosos para atendê-lo!" }
    ]);
  };
  const toggleSelect = (phone) => {
    if (selectedPhones.includes(phone)) {
      setSelectedPhones((prev) => prev.filter((p) => p !== phone));
    } else {
      setSelectedPhones((prev) => [...prev, phone]);
    }
  };
  const selectAll = () => setSelectedPhones(contacts.map((c) => c.phone));
  const selectNone = () => setSelectedPhones([]);
  const handleSend = async () => {
    if (!name || !template || selectedPhones.length === 0) {
      alert("Preencha o nome, mensagem e selecione contatos.");
      return;
    }
    if (!confirm(`Enviar para ${selectedPhones.length} contatos?`)) return;
    try {
      const res = await fetch(`${API_URL$4}/campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, template, phones: selectedPhones })
      });
      const data = await res.json();
      if (data.ok) {
        alert(`🚀 Disparo iniciado para ${data.queued} números!`);
        setName("");
        setTemplate("");
        setSelectedPhones([]);
      } else {
        alert("Erro: " + data.error);
      }
    } catch (e) {
      alert("Erro de conexão");
    }
  };
  const filteredContacts = contacts.filter((c) => {
    if (filters.stage !== "all" && c.stage !== filters.stage) return false;
    return true;
  });
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-xl border border-gray-800", children: [
      { id: "create", icon: "📝", label: "Criar Campanha" },
      { id: "history", icon: "📊", label: "Histórico" },
      { id: "templates", icon: "📋", label: "Templates" },
      { id: "analytics", icon: "📈", label: "Analytics" }
    ].map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-neon-blue text-black" : "text-gray-400 hover:bg-gray-800"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "mr-2", children: tab.icon }),
          tab.label
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden", children: [
      activeTab === "create" && /* @__PURE__ */ jsxs("div", { className: "flex gap-6 h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-800", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-neon-blue mb-4", children: "📢 Nova Campanha" }),
            /* @__PURE__ */ jsx("label", { className: "text-gray-400 text-sm", children: "Nome da Campanha" }),
            /* @__PURE__ */ jsx("input", { className: "w-full bg-black/40 border border-gray-700 p-2 rounded text-white mb-4 outline-none focus:border-neon-blue", value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Aviso Importante" }),
            /* @__PURE__ */ jsx("label", { className: "text-gray-400 text-sm", children: "Mensagem" }),
            /* @__PURE__ */ jsx("textarea", { className: "w-full h-32 bg-black/40 border border-gray-700 p-2 rounded text-white mb-4 outline-none focus:border-neon-blue resize-none", value: template, onChange: (e) => setTemplate(e.target.value), placeholder: "Olá!..." }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mb-4", children: [
              "Selecionados: ",
              /* @__PURE__ */ jsx("span", { className: "text-neon-green font-bold", children: selectedPhones.length })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: handleSend, disabled: loading, className: "w-full bg-neon-green text-black font-bold p-3 rounded hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all disabled:opacity-50", children: loading ? "ENVIANDO..." : "🚀 INICIAR DISPARO" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-800", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-white font-bold mb-3", children: "📋 Templates Rápidos" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: templates.slice(0, 3).map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setTemplate(t.content), className: "w-full text-left p-2 bg-gray-800/50 rounded hover:bg-gray-700 transition-colors text-sm text-gray-300", children: t.name }, t.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 glass-panel p-4 rounded-xl border border-gray-800 flex flex-col h-full overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "👥 Selecionar Público" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("select", { value: filters.stage, onChange: (e) => setFilters({ ...filters, stage: e.target.value }), className: "text-xs bg-gray-700 px-2 py-1 rounded outline-none", children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
                /* @__PURE__ */ jsx("option", { value: "lead", children: "Leads" }),
                /* @__PURE__ */ jsx("option", { value: "cliente", children: "Clientes" }),
                /* @__PURE__ */ jsx("option", { value: "inativo", children: "Inativos" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: selectAll, className: "text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors", children: "Todos" }),
              /* @__PURE__ */ jsx("button", { onClick: selectNone, className: "text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors", children: "Nenhum" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2", children: filteredContacts.map((c) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => toggleSelect(c.phone),
              className: `p-3 rounded cursor-pointer border transition-all hover:shadow-lg ${selectedPhones.includes(c.phone) ? "bg-neon-blue/20 border-neon-blue shadow-neon-blue/20" : "bg-gray-900 border-gray-800 hover:border-gray-600"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-white truncate", children: c.name || "Desconhecido" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400", children: c.phone }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1 uppercase", children: c.stage }),
                c.lastMessage && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 mt-1", children: [
                  "Última msg: ",
                  new Date(c.lastMessage).toLocaleDateString("pt-BR")
                ] })
              ]
            },
            c.id
          )) })
        ] })
      ] }),
      activeTab === "history" && /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 h-full overflow-y-auto", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-6", children: "📊 Histórico de Campanhas" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: campaigns.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-500 py-12", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4 opacity-50", children: "📭" }),
          /* @__PURE__ */ jsx("p", { children: "Nenhuma campanha enviada ainda" })
        ] }) : campaigns.map((campaign) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-900/50 p-4 rounded-lg border border-gray-800", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-white font-bold", children: campaign.name }),
            /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs ${campaign.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`, children: campaign.status })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-2", children: campaign.message }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Enviados: ",
              campaign.sent
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Entregues: ",
              campaign.delivered
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Data: ",
              new Date(campaign.createdAt).toLocaleDateString("pt-BR")
            ] })
          ] })
        ] }, campaign.id)) })
      ] }),
      activeTab === "templates" && /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 h-full overflow-y-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: "📋 Templates de Mensagem" }),
          /* @__PURE__ */ jsx("button", { className: "bg-neon-blue text-black px-4 py-2 rounded font-bold hover:bg-neon-green transition-colors", children: "+ Novo Template" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: templates.map((template2) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-900/50 p-4 rounded-lg border border-gray-800", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-white font-bold mb-2", children: template2.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-4", children: template2.content }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setTemplate(template2.content), className: "bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors", children: "Usar" }),
            /* @__PURE__ */ jsx("button", { className: "bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500 transition-colors", children: "Excluir" })
          ] })
        ] }, template2.id)) })
      ] }),
      activeTab === "analytics" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 h-full overflow-y-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "📤" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neon-blue", children: "2.847" }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Mensagens Enviadas" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "✅" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neon-green", children: "94.2%" }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Taxa de Entrega" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "👁️" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-yellow-500", children: "23.1%" }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Taxa de Abertura" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-white font-bold mb-4", children: "📈 Performance por Hora" }),
          /* @__PURE__ */ jsx("div", { className: "h-64 bg-gray-900/50 rounded flex items-end justify-center gap-2 p-4", children: [45, 67, 89, 72, 91, 54, 38, 76, 83, 65, 42, 58].map((height, i) => /* @__PURE__ */ jsx("div", { className: "flex-1 bg-neon-blue rounded-t", style: { height: `${height}%` } }, i)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-2 px-4", children: [
            /* @__PURE__ */ jsx("span", { children: "06h" }),
            /* @__PURE__ */ jsx("span", { children: "18h" })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const API_URL$3 = "https://api.getnexo.com.br";
const CatalogManager = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [targetPhone, setTargetPhone] = useState("");
  useEffect(() => {
    fetchCatalog();
  }, []);
  const fetchCatalog = async () => {
    const res = await fetch(`${API_URL$3}/catalog`);
    const data = await res.json();
    setProducts(data.products || []);
  };
  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  const createOrder = async () => {
    if (!targetPhone || cart.length === 0) return alert("Selecione produtos e informe o telefone do cliente");
    await fetch(`${API_URL$3}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: targetPhone,
        product_ids: cart.map((p) => p.id),
        pix_key: "loja@getnexo.com.br"
      })
    });
    alert("Pedido Criado! Link de PIX enviado para o cliente.");
    setCart([]);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-6 h-[75vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-neon-blue mb-4", children: "🏪 Catálogo de Produtos" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: products.length === 0 ? /* @__PURE__ */ jsx("div", { className: "col-span-3 text-gray-500", children: "Nenhum produto cadastrado. (Use o terminal para inserir: `INSERT INTO products...`)" }) : products.map((p) => /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-800 flex flex-col items-center text-center hover:border-gray-600 transition-colors", children: [
        /* @__PURE__ */ jsx("img", { src: p.image_url || "https://placehold.co/150x150/1e293b/64748b?text=Produto", className: "w-24 h-24 object-cover rounded mb-3 bg-gray-900" }),
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-white", children: p.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-neon-green font-bold text-lg", children: [
          "R$ ",
          p.price.toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => addToCart(p), className: "mt-3 bg-gray-800 hover:bg-neon-blue hover:text-black text-gray-300 px-4 py-2 rounded text-sm font-bold w-full transition-colors", children: "+ Adicionar" })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 glass-panel p-6 rounded-xl border border-gray-800 flex flex-col", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-6", children: "🛒 Novo Pedido" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "text-gray-400 text-sm", children: "Cliente (WhatsApp)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full bg-black/40 border border-gray-700 p-3 rounded text-white focus:border-neon-green outline-none",
            placeholder: "5511999999999",
            value: targetPhone,
            onChange: (e) => setTargetPhone(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto mb-4 space-y-2 border-t border-b border-gray-800 py-2", children: [
        cart.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: item.name }),
          /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
            "R$ ",
            item.price.toFixed(2)
          ] })
        ] }, i)),
        cart.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-gray-600 italic", children: "Carrinho vazio" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xl font-bold text-white mb-6", children: [
        /* @__PURE__ */ jsx("span", { children: "Total:" }),
        /* @__PURE__ */ jsxs("span", { className: "text-neon-green", children: [
          "R$ ",
          cart.reduce((acc, item) => acc + item.price, 0).toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: createOrder, className: "bg-neon-green text-black font-bold p-4 rounded text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,157,0.3)]", children: "GERAR PIX 💸" })
    ] })
  ] });
};
const API_URL$2 = "https://api.getnexo.com.br";
const AbandonedCartWidget = () => {
  const [carts, setCarts] = useState([]);
  useEffect(() => {
    fetchCarts();
    const interval = setInterval(fetchCarts, 3e4);
    return () => clearInterval(interval);
  }, []);
  const fetchCarts = async () => {
    try {
      const res = await fetch(`${API_URL$2}/abandoned`);
      const data = await res.json();
      setCarts(data.abandoned || []);
    } catch (e) {
    }
  };
  const sendRecovery = async (phone) => {
    const msg = "Ei! Vi que você esqueceu itens no carrinho. Quer ajuda para finalizar com 5% de desconto?";
    if (!confirm(`Enviar recuperação para ${phone}?`)) return;
    await fetch(`${API_URL$2}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body: msg })
    });
    alert("Mensagem de recuperação enviada!");
  };
  if (carts.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-4 right-4 bg-gray-900 border border-red-500 rounded-xl p-4 shadow-2xl w-80 z-50 animate-pulse-slow", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
      /* @__PURE__ */ jsxs("h4", { className: "text-red-400 font-bold flex items-center gap-2", children: [
        "🛒 Carrinhos Abandonados",
        /* @__PURE__ */ jsx("span", { className: "bg-red-500 text-white text-xs px-2 rounded-full", children: carts.length })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setCarts([]), className: "text-gray-500 hover:text-white", children: "x" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-h-40 overflow-y-auto space-y-2", children: carts.map((cart) => /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-2 rounded border border-gray-800 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-300 font-mono", children: cart.phone.slice(-4) }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs", children: new Date(cart.created_at).toLocaleTimeString() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-green-500 font-bold", children: [
        "R$ ",
        cart.total.toFixed(2)
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => sendRecovery(cart.phone),
          className: "mt-1 w-full bg-red-500/20 text-red-400 border border-red-500/50 rounded py-1 text-xs hover:bg-red-500 hover:text-white transition-all",
          children: "Recuperar Venda 💸"
        }
      )
    ] }, cart.id)) })
  ] });
};
const API_URL$1 = "https://api.getnexo.com.br";
const AI_PROVIDERS = [
  { id: "deepseek", name: "DeepSeek AI", icon: "🧠", color: "#00D4FF", models: ["deepseek-chat", "deepseek-coder"], defaultKey: "" },
  { id: "openai", name: "OpenAI", icon: "🤖", color: "#10A37F", models: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"], defaultKey: "" },
  { id: "anthropic", name: "Anthropic Claude", icon: "🎭", color: "#CC785C", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"], defaultKey: "" },
  { id: "gemini", name: "Google Gemini", icon: "✨", color: "#4285F4", models: ["gemini-pro", "gemini-pro-vision"], defaultKey: "" },
  { id: "groq", name: "Groq", icon: "⚡", color: "#F55036", models: ["mixtral-8x7b", "llama2-70b"], defaultKey: "" }
];
const AiSettings = () => {
  const [activeTab, setActiveTab] = useState("providers");
  const [context, setContext] = useState("");
  const [saved, setSaved] = useState(false);
  const [providers, setProviders] = useState(
    AI_PROVIDERS.reduce((acc, p) => ({
      ...acc,
      [p.id]: {
        enabled: p.id === "deepseek",
        apiKey: p.defaultKey,
        model: p.models[0],
        tokensUsed: 0,
        tokensLimit: 1e5,
        purpose: p.id === "deepseek" ? "chat" : "backup"
      }
    }), {})
  );
  const [globalUsage, setGlobalUsage] = useState({ totalTokens: 0, totalCost: 0, requestsToday: 0 });
  const [tokenLimits, setTokenLimits] = useState({
    perMessage: 4096,
    perConversation: 16e3,
    daily: 5e5,
    monthly: 1e7
  });
  useEffect(() => {
    fetchContext();
    fetchUsage();
  }, []);
  const fetchUsage = async () => {
    try {
      const res = await fetch(`${API_URL$1}/ai-usage`);
      const data = await res.json();
      setGlobalUsage({
        totalTokens: data.tokens_used || 0,
        totalCost: data.cost || 0,
        requestsToday: data.requests || 0
      });
    } catch (e) {
    }
  };
  const fetchContext = async () => {
    try {
      const res = await fetch(`${API_URL$1}/ai-context`);
      const data = await res.json();
      setContext(data.content || "");
    } catch (e) {
    }
  };
  const handleSaveProvider = async (providerId) => {
    const providerConfig = providers[providerId];
    await fetch(`${API_URL$1}/ai-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: providerId,
        api_key: providerConfig.apiKey,
        model: providerConfig.model,
        enabled: providerConfig.enabled,
        purpose: providerConfig.purpose,
        context
      })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
    fetchUsage();
  };
  const updateProvider = (id, field, value) => {
    setProviders((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };
  const tabs = [
    { id: "providers", label: "🔌 Provedores", icon: "🔌" },
    { id: "usage", label: "📊 Uso & Custos", icon: "📊" },
    { id: "limits", label: "⚙️ Limites", icon: "⚙️" },
    { id: "training", label: "🎓 Treinamento", icon: "🎓" }
  ];
  return /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-2xl border border-blue-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-4xl", children: "🤖" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-white", children: "Central de IA" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Gerencie todos os provedores de IA em um só lugar" })
        ] })
      ] }),
      saved && /* @__PURE__ */ jsx("div", { className: "bg-green-500/20 border border-green-500/50 px-6 py-3 rounded-xl animate-pulse", children: /* @__PURE__ */ jsx("span", { className: "text-green-400 font-bold", children: "✅ Configuração salva!" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-700/50", children: [
        /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Tokens Usados (Hoje)" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: globalUsage.totalTokens.toLocaleString() }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-neon-blue", children: "↗ DeepSeek AI ativo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-700/50", children: [
        /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Custo Estimado" }),
        /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-400", children: [
          "R$ ",
          (globalUsage.totalCost || 0).toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Este mês" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-700/50", children: [
        /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Requisições Hoje" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: globalUsage.requestsToday }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Média: 2.3k tokens/req" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-4 rounded-xl border border-gray-700/50", children: [
        /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Provedores Ativos" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-neon-blue", children: Object.values(providers).filter((p) => p.enabled).length }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
          "de ",
          AI_PROVIDERS.length,
          " disponíveis"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-6", children: tabs.map((tab) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `px-5 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? "bg-neon-blue text-black" : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}`,
        children: tab.label
      },
      tab.id
    )) }),
    activeTab === "providers" && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: AI_PROVIDERS.map((provider) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `glass-panel p-6 rounded-2xl border transition-all ${providers[provider.id].enabled ? "border-green-500/50 bg-green-500/5" : "border-gray-700/50"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
                  style: { backgroundColor: `${provider.color}20` },
                  children: provider.icon
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-white flex items-center gap-2", children: [
                  provider.name,
                  provider.id === "deepseek" && /* @__PURE__ */ jsx("span", { className: "text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full", children: "RECOMENDADO" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: provider.models.join(" • ") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: providers[provider.id].enabled,
                  onChange: (e) => updateProvider(provider.id, "enabled", e.target.checked),
                  className: "sr-only peer"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500" })
            ] })
          ] }),
          providers[provider.id].enabled && /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Chave da API" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: providers[provider.id].apiKey,
                  onChange: (e) => updateProvider(provider.id, "apiKey", e.target.value),
                  className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue",
                  placeholder: provider.defaultKey || "sk-..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Modelo" }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: providers[provider.id].model,
                  onChange: (e) => updateProvider(provider.id, "model", e.target.value),
                  className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue",
                  children: provider.models.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Uso Principal" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: providers[provider.id].purpose,
                  onChange: (e) => updateProvider(provider.id, "purpose", e.target.value),
                  className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "chat", children: "💬 Chat Principal" }),
                    /* @__PURE__ */ jsx("option", { value: "backup", children: "🔄 Fallback/Backup" }),
                    /* @__PURE__ */ jsx("option", { value: "analysis", children: "📊 Análise de Dados" }),
                    /* @__PURE__ */ jsx("option", { value: "code", children: "💻 Geração de Código" }),
                    /* @__PURE__ */ jsx("option", { value: "voice", children: "🎤 Transcrição/Voz" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Limite de Tokens" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: providers[provider.id].tokensLimit,
                  onChange: (e) => updateProvider(provider.id, "tokensLimit", parseInt(e.target.value)),
                  className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white outline-none focus:border-neon-blue"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 flex justify-end", children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleSaveProvider(provider.id),
                className: "bg-neon-blue hover:bg-neon-green text-black font-bold px-6 py-2 rounded-lg transition-all",
                children: [
                  "💾 Salvar ",
                  provider.name
                ]
              }
            ) })
          ] })
        ]
      },
      provider.id
    )) }),
    activeTab === "usage" && /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-2xl border border-gray-700/50", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-6", children: "📊 Consumo por Provedor" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: AI_PROVIDERS.filter((p) => providers[p.id].enabled).map((provider) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-800/50 p-4 rounded-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-white font-bold", children: [
            provider.icon,
            " ",
            provider.name
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-gray-400 text-sm", children: [
            providers[provider.id].tokensUsed.toLocaleString(),
            " / ",
            providers[provider.id].tokensLimit.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full rounded-full transition-all",
            style: {
              width: `${providers[provider.id].tokensUsed / providers[provider.id].tokensLimit * 100}%`,
              backgroundColor: provider.color
            }
          }
        ) })
      ] }, provider.id)) })
    ] }),
    activeTab === "limits" && /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-2xl border border-gray-700/50", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-6", children: "⚙️ Configuração de Limites" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Tokens por Mensagem" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: tokenLimits.perMessage,
              onChange: (e) => setTokenLimits({ ...tokenLimits, perMessage: parseInt(e.target.value) }),
              className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Limite máximo por resposta da IA" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Tokens por Conversa" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: tokenLimits.perConversation,
              onChange: (e) => setTokenLimits({ ...tokenLimits, perConversation: parseInt(e.target.value) }),
              className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Limite de contexto por chat" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Limite Diário" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: tokenLimits.daily,
              onChange: (e) => setTokenLimits({ ...tokenLimits, daily: parseInt(e.target.value) }),
              className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Máximo de tokens por dia" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-400 text-sm mb-2", children: "Limite Mensal" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: tokenLimits.monthly,
              onChange: (e) => setTokenLimits({ ...tokenLimits, monthly: parseInt(e.target.value) }),
              className: "w-full bg-black/40 border border-gray-600 p-3 rounded-lg text-white"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Orçamento mensal de tokens" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx("button", { className: "bg-neon-blue text-black font-bold px-6 py-3 rounded-lg", children: "Salvar Limites" }) })
    ] }),
    activeTab === "training" && /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-2xl border border-gray-700/50", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "🎓 Treinamento do Agente" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-6", children: "Adicione informações sobre sua empresa para personalizar as respostas da IA." }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "w-full h-64 bg-black/40 border border-gray-600 p-4 rounded-xl text-white font-mono text-sm leading-relaxed focus:border-neon-blue outline-none resize-none",
          placeholder: "Ex: A GetNexo é uma empresa de software... Nosso horário de atendimento é das 9h às 18h... Produtos: OmniChat, ZapFlow...",
          value: context,
          onChange: (e) => setContext(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-sm", children: [
          context.length,
          " caracteres"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSaveProvider("deepseek"),
            className: "bg-neon-blue hover:bg-neon-green text-black font-bold px-8 py-3 rounded-lg transition-all",
            children: "💾 Salvar Treinamento"
          }
        )
      ] })
    ] })
  ] }) });
};
const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [subSection, setSubSection] = useState("");
  const [stats, setStats] = useState({ storage: "0 MB", apiCalls: 0 });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("https://api.getnexo.com.br/dashboard-stats").then((res) => res.json()).then((data) => setStats(data));
  }, []);
  const MenuItem = ({ icon, label, id, subs = [] }) => /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => {
          setActiveSection(id);
          setSubSection("");
        },
        className: `flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${activeSection === id ? "bg-neon-blue/20 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg", children: icon }),
          /* @__PURE__ */ jsx("span", { children: label }),
          subs.length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs", children: "▼" })
        ]
      }
    ),
    activeSection === id && subs.length > 0 && /* @__PURE__ */ jsx("div", { className: "ml-9 border-l border-gray-700 pl-4 space-y-2 mt-1", children: subs.map((s) => /* @__PURE__ */ jsx(
      "div",
      {
        onClick: (e) => {
          e.stopPropagation();
          setSubSection(s.id);
        },
        className: `text-sm cursor-pointer hover:text-white ${subSection === s.id ? "text-neon-blue" : "text-gray-500"}`,
        children: s.label
      },
      s.id
    )) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[80vh] bg-black/40 rounded-2xl border border-gray-800 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-64 bg-gray-900/50 p-4 border-r border-gray-800 flex flex-col overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider", children: "Central de Administração" }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "🏠", label: "Página inicial", id: "home" }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "🏢", label: "Conta", id: "account", subs: [
        { id: "usage", label: "Uso e Cobrança" },
        { id: "security", label: "Segurança" },
        { id: "api", label: "API" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "👥", label: "Pessoas", id: "people", subs: [
        { id: "team", label: "Equipe" },
        { id: "groups", label: "Grupos" },
        { id: "end-users", label: "Usuários Finais" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "⇄", label: "Canais", id: "channels", subs: [
        { id: "messaging", label: "Mensagens (WhatsApp)" },
        { id: "email", label: "Email" },
        { id: "web", label: "Web Widget" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "✨", label: "IA", id: "ai_admin", subs: [
        { id: "ai_agents", label: "Agentes de IA" },
        { id: "ai_copilot", label: "Copiloto do administrador" },
        { id: "ai_triage", label: "Triagem inteligente" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "🖥️", label: "Espaços de trabalho", id: "workspaces", subs: [
        { id: "agent_tools", label: "Ferramentas de agente" },
        { id: "macros_admin", label: "Macros" },
        { id: "views", label: "Visualizações" },
        { id: "agent_interface", label: "Interface do agente" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "📦", label: "Objetos e regras", id: "objects", subs: [
        { id: "tickets", label: "Tickets" },
        { id: "routing", label: "Encaminhamento omnichannel" },
        { id: "triggers", label: "Gatilhos" },
        { id: "automations", label: "Automações" },
        { id: "slas", label: "Contratos de nível de serviço (SLA)" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "📈", label: "Marketing & Analytics", id: "marketing", subs: [
        { id: "retargeting", label: "Retargeting" },
        { id: "ads", label: "Click-to-WhatsApp Ads" },
        { id: "clicks", label: "Rastreamento de Cliques" },
        { id: "csat", label: "Relatório CSAT" }
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { icon: "🔌", label: "Aplicativos e integrações", id: "apps" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 p-8 overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 border-b border-gray-800 pb-4", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-white", children: [
          activeSection === "home" && "Central de Administração",
          activeSection === "account" && "Conta",
          activeSection === "people" && "Gerenciar Pessoas",
          activeSection === "channels" && "Canais de Atendimento"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 mt-2", children: "Gerencie as configurações da sua conta OmniChat." })
      ] }),
      activeSection === "home" && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-2", children: "Bem-vindo, Admin" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Aqui está o resumo da sua operação hoje." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs text-gray-500 uppercase font-bold tracking-wider mb-2", children: "Tickets Abertos" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: stats.open_tickets || 0 }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-green-500 mt-1", children: "● Em atendimento" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs text-gray-500 uppercase font-bold tracking-wider mb-2", children: "CSAT (Satisfação)" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: stats.csat ? Number(stats.csat).toFixed(1) : "0.0" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Média geral" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs text-gray-500 uppercase font-bold tracking-wider mb-2", children: "Vendas Totais" }),
            /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-neon-green", children: [
              "R$ ",
              stats.sales ? Number(stats.sales).toFixed(2) : "0.00"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Via PIX/Chat" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs text-gray-500 uppercase font-bold tracking-wider mb-2", children: "Total Tickets" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: stats.tickets || 0 }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Histórico completo" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-neon-blue font-bold mb-4", children: "Uso do Armazenamento" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-400 mb-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "Dados de tickets" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    stats.storage,
                    " / 500 MB"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-neon-blue w-[10%]" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-400 mb-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "Arquivos" }),
                  /* @__PURE__ */ jsx("span", { children: "12 MB / 10 GB" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-purple-500 w-[1%]" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-neon-green font-bold mb-4", children: "Uso da API (últimos 7 dias)" }),
            /* @__PURE__ */ jsx("div", { className: "text-4xl font-mono text-white mb-2", children: stats.apiCalls }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Requisições processadas com sucesso." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded", children: "0% Erros 429" }),
              /* @__PURE__ */ jsx("span", { className: "bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded", children: "Status Operacional" })
            ] })
          ] })
        ] })
      ] }),
      activeSection === "channels" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#25D366] p-3 rounded-lg", children: /* @__PURE__ */ jsx("span", { className: "text-2xl text-black font-bold", children: "W" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-white text-lg", children: "WhatsApp Primário (Porta 3000)" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Instância Evolution API 1" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => window.open("https://evolution.getnexo.com.br", "_blank"), className: "border border-gray-600 hover:border-white text-white px-4 py-2 rounded transition-colors", children: "Configurar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#25D366] p-3 rounded-lg", children: /* @__PURE__ */ jsx("span", { className: "text-2xl text-black font-bold", children: "W2" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-white text-lg", children: "WhatsApp Secundário (Porta 3001)" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Instância Evolution API 2 (Revenda/Suporte)" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => window.open("https://evolution.getnexo.com.br", "_blank"), className: "border border-gray-600 hover:border-white text-white px-4 py-2 rounded transition-colors", children: "Configurar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl opacity-50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-500 p-3 rounded-lg", children: /* @__PURE__ */ jsx("span", { className: "text-2xl text-white font-bold", children: "F" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-white text-lg", children: "Facebook Messenger" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Em breve (Roadmap v2.0)" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { className: "cursor-not-allowed border border-gray-700 text-gray-500 px-4 py-2 rounded", children: "Indisponível" })
        ] })
      ] }),
      activeSection === "ai_admin" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Agentes de IA" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Automatize conversas e resolva tickets instantaneamente." }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 bg-black/40 p-4 rounded border border-gray-700", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: true, readOnly: true, className: "w-5 h-5 accent-neon-blue" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-200", children: "Ativar respostas generativas (GPT-4)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Triagem Inteligente" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "Classificar automaticamente intenção e sentimento." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-gray-800 px-3 py-1 rounded text-xs", children: "Intenção" }),
            /* @__PURE__ */ jsx("span", { className: "bg-gray-800 px-3 py-1 rounded text-xs", children: "Idioma" }),
            /* @__PURE__ */ jsx("span", { className: "bg-gray-800 px-3 py-1 rounded text-xs", children: "Sentimento" })
          ] })
        ] })
      ] }),
      activeSection === "marketing" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        subSection === "retargeting" && /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Retargeting Automático" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Re-enviar mensagem para usuários que não leram a campanha anterior (últimos 7 dias)." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: async () => {
                const res = await fetch("https://api.getnexo.com.br/retarget", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campaign_id: "1" }) });
                const data = await res.json();
                alert(`Campanha de Retargeting enviada! ${data.unread} contatos impactados.`);
              },
              className: "bg-orange-500 text-white font-bold px-6 py-3 rounded hover:bg-orange-600 transition-colors",
              children: "📢 Disparar Retargeting Agora"
            }
          )
        ] }),
        subSection === "ads" && /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Gerador de Link (Ads)" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Gerar link para anúncios Click-to-WhatsApp." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 max-w-md", children: [
            /* @__PURE__ */ jsx("input", { id: "ad-phone", placeholder: "Número (ex: 5511999999999)", className: "bg-black/40 border border-gray-700 p-3 rounded text-white" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: async () => {
                  const phone = document.getElementById("ad-phone").value;
                  const res = await fetch(`https://api.getnexo.com.br/ad-link?phone=${phone}`);
                  const data = await res.json();
                  document.getElementById("generated-link").value = data.link;
                },
                className: "bg-neon-blue text-black font-bold px-4 py-2 rounded",
                children: "🔗 Gerar Link"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "bg-black p-3 rounded border border-gray-800", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Seu Link:" }),
              /* @__PURE__ */ jsx("input", { id: "generated-link", readOnly: true, className: "w-full bg-transparent text-green-400 font-mono text-sm focus:outline-none", placeholder: "..." })
            ] })
          ] })
        ] }),
        subSection === "clicks" && /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Relatório de Cliques (CTAs)" }),
          /* @__PURE__ */ jsx("div", { id: "clicks-report", className: "space-y-2 mt-4", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse text-gray-500", children: "Carregando dados..." }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: async () => {
                const res = await fetch("https://api.getnexo.com.br/clicks");
                const data = await res.json();
                const container = document.getElementById("clicks-report");
                if (data.length === 0) {
                  container.innerHTML = '<div class="text-gray-500">Nenhum clique registrado ainda.</div>';
                  return;
                }
                container.innerHTML = data.map((c) => `
                                            <div class="flex justify-between items-center bg-gray-800/50 p-3 rounded border border-gray-700">
                                                <span class="text-neon-blue font-mono">${c.cta_id}</span>
                                                <span class="text-gray-400 text-sm">${new Date(c.timestamp).toLocaleString()}</span>
                                            </div>
                                        `).join("");
              },
              className: "mt-4 text-sm text-neon-blue underline cursor-pointer",
              children: "↻ Atualizar Relatório"
            }
          )
        ] }),
        subSection === "csat" && /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-6 rounded-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Relatório CSAT" }),
          /* @__PURE__ */ jsx("div", { id: "csat-summary", className: "text-4xl font-bold text-white mb-4", children: "- / 5.0" }),
          /* @__PURE__ */ jsx("div", { id: "csat-list", className: "space-y-2 max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse text-gray-500", children: "Carregando..." }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: async () => {
                const res = await fetch("https://api.getnexo.com.br/csat-report");
                const data = await res.json();
                const avg = data.reduce((s, a) => s + a.nota, 0) / (data.length || 1);
                document.getElementById("csat-summary").innerText = list = `${avg.toFixed(1)} / 5.0`;
                document.getElementById("csat-list").innerHTML = data.map((c) => `
                                            <div class="flex justify-between items-center bg-gray-800/50 p-2 rounded">
                                                <span class="text-gray-300">${c.phone}</span>
                                                <span class="text-yellow-400 font-bold">★ ${c.nota}</span>
                                            </div>
                                        `).join("");
              },
              className: "mt-4 text-sm text-neon-blue underline cursor-pointer",
              children: "↻ Atualizar Dados"
            }
          )
        ] }),
        activeSection === "marketing" && !subSection && /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-500 mt-20", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-400", children: "Marketing & Analytics" }),
          /* @__PURE__ */ jsx("p", { children: "Selecione uma ferramenta no menu lateral." })
        ] })
      ] }),
      (activeSection === "workspaces" || activeSection === "objects") && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 p-4 rounded-xl hover:border-gray-600 cursor-pointer transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-800 rounded mb-3" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-800 rounded w-3/4 mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-800 rounded w-1/2" })
      ] }, i)) }),
      activeSection === "people" && /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-800 text-gray-400 text-sm", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Nome / Email" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Função" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Ultimo Login" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "text-gray-300", children: [
            /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-800 hover:bg-gray-800/50", children: [
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("strong", { children: "Admin" }),
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "admin@getnexo.local" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "bg-neon-blue/20 text-neon-blue px-2 py-1 rounded text-xs font-bold", children: "Administrador" }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: "Agora" }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "text-green-500", children: "● Ativo" }) })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-800/50", children: [
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("strong", { children: "Suporte N1" }),
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "suporte@getnexo.local" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs", children: "Agente" }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: "Há 2 dias" }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "text-yellow-500", children: "● Ausente" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-gray-800", children: /* @__PURE__ */ jsx("button", { className: "bg-neon-blue text-black font-bold px-4 py-2 rounded hover:opacity-90", children: "Adicionar Membro" }) })
      ] })
    ] })
  ] });
};
const FlowBuilder = () => {
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    fetchFlows();
  }, []);
  const fetchFlows = async () => {
    try {
      const res = await fetch("https://api.getnexo.com.br/flows");
      const data = await res.json();
      setFlows(data);
    } catch (e) {
    }
  };
  const handleSave = async () => {
    if (!selectedFlow) return;
    const method = selectedFlow.id === "new" ? "POST" : "PUT";
    const url = selectedFlow.id === "new" ? "https://api.getnexo.com.br/flows" : `https://api.getnexo.com.br/flows/${selectedFlow.id}`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selectedFlow, nodes })
    });
    alert("Fluxo Salvo!");
    fetchFlows();
  };
  const addNode = (type) => {
    const nodeConfigs = {
      message: { content: "", placeholder: "Digite a mensagem..." },
      question: { content: "", placeholder: "Digite a pergunta...", variable: "@resposta" },
      condition: { content: "", condition: "Igual a", value: "" },
      action: { content: "", action: "enviar_email", params: {} },
      webhook: { content: "", url: "", method: "POST" },
      ai_response: { content: "", prompt: "Responda de forma amigável", model: "gemini" },
      delay: { content: "", delay: 5 },
      trigger: { content: 'Quando o cliente enviar: "Olá"' }
    };
    const config = nodeConfigs[type] || { content: "" };
    const newNode = {
      id: Date.now(),
      type,
      ...config,
      position: { x: 50 + nodes.length * 20, y: 50 + nodes.length * 20 }
    };
    setNodes([...nodes, newNode]);
  };
  const updateNode = (id, field, value) => {
    setNodes(nodes.map((n) => n.id === id ? { ...n, [field]: value } : n));
  };
  const deleteNode = (id) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[80vh] bg-black/40 rounded-2xl border border-gray-800 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-64 bg-gray-900/50 border-r border-gray-700 p-4 flex flex-col", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSelectedFlow({ id: "new", name: "Novo Fluxo" });
            setNodes([]);
          },
          className: "bg-neon-blue text-black font-bold py-3 rounded mb-6 hover:bg-neon-green transition-colors",
          children: "+ Novo Fluxo"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: flows.map((f) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => {
            setSelectedFlow(f);
            setNodes([{ id: 1, type: "trigger", content: "Início", position: { x: 50, y: 50 } }]);
          },
          className: `p-3 rounded cursor-pointer ${selectedFlow?.id === f.id ? "bg-gray-800 text-white border border-gray-600" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`,
          children: [
            f.name,
            /* @__PURE__ */ jsxs("span", { className: `block text-[10px] mt-1 ${f.active ? "text-green-500" : "text-gray-600"}`, children: [
              "● ",
              f.active ? "Ativo" : "Inativo"
            ] })
          ]
        },
        f.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 relative bg-dots-pattern overflow-hidden", children: selectedFlow ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 z-10 bg-black/60 backdrop-blur p-2 rounded border border-gray-700 flex gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-white font-bold px-2 py-1 items-center flex", children: selectedFlow.name }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-gray-600 mx-1" }),
        /* @__PURE__ */ jsx("button", { onClick: () => addNode("message"), className: "text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors", children: "💬 Mensagem" }),
        /* @__PURE__ */ jsx("button", { onClick: () => addNode("question"), className: "text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors", children: "❓ Pergunta" }),
        /* @__PURE__ */ jsx("button", { onClick: () => addNode("condition"), className: "text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors", children: "🔀 Condição" }),
        /* @__PURE__ */ jsx("button", { onClick: () => addNode("action"), className: "text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors", children: "⚡ Ação" }),
        /* @__PURE__ */ jsx("button", { onClick: () => addNode("ai_response"), className: "text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors", children: "🤖 IA" }),
        /* @__PURE__ */ jsx("button", { onClick: () => addNode("webhook"), className: "text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors", children: "🔗 Webhook" }),
        /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "bg-green-600 text-white text-xs px-4 py-1 rounded font-bold hover:bg-green-500 ml-4", children: "SALVAR FLUXO" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full h-full p-20 overflow-auto", children: [
        /* @__PURE__ */ jsx("svg", { className: "absolute top-0 left-0 w-full h-full pointer-events-none opacity-30", children: nodes.map((n, i) => i < nodes.length - 1 && /* @__PURE__ */ jsx("line", { x1: 150, y1: 100 * (i + 1), x2: 150, y2: 100 * (i + 2), stroke: "#00d4ff", strokeWidth: "2" }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 items-center", children: [
          nodes.map((node, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `w-80 bg-gray-900 border-2 rounded-xl p-4 shadow-2xl relative group ${node.type === "condition" ? "border-orange-500/50" : node.type === "trigger" ? "border-green-500/50" : "border-neon-blue/30"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-xs font-bold uppercase ${node.type === "condition" ? "text-orange-400" : "text-neon-blue"}`, children: node.type }),
                  node.type !== "trigger" && /* @__PURE__ */ jsx("button", { onClick: () => deleteNode(node.id), className: "text-red-500 hover:text-red-400", children: "×" })
                ] }),
                node.type === "message" && /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white resize-none h-20 outline-none focus:border-neon-blue",
                    placeholder: node.placeholder || "Digite a mensagem...",
                    value: node.content || "",
                    onChange: (e) => updateNode(node.id, "content", e.target.value)
                  }
                ),
                node.type === "question" && /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white mb-2 outline-none focus:border-neon-blue",
                      placeholder: node.placeholder || "Digite a pergunta...",
                      value: node.content || "",
                      onChange: (e) => updateNode(node.id, "content", e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                    "Salvar resposta em: ",
                    /* @__PURE__ */ jsx("span", { className: "text-yellow-500", children: node.variable || "@resposta" })
                  ] })
                ] }),
                node.type === "condition" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("select", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", children: [
                    /* @__PURE__ */ jsx("option", { children: "Campo igual a" }),
                    /* @__PURE__ */ jsx("option", { children: "Campo contém" }),
                    /* @__PURE__ */ jsx("option", { children: "Campo maior que" }),
                    /* @__PURE__ */ jsx("option", { children: "Campo menor que" })
                  ] }),
                  /* @__PURE__ */ jsx("input", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", placeholder: "Valor para comparar..." }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-green-900/20 p-2 rounded border border-green-900/50 text-xs text-green-400 text-center", children: "✅ Verdadeiro" }),
                    /* @__PURE__ */ jsx("div", { className: "flex-1 bg-red-900/20 p-2 rounded border border-red-900/50 text-xs text-red-400 text-center", children: "❌ Falso" })
                  ] })
                ] }),
                node.type === "action" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("select", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", value: node.action || "enviar_email", onChange: (e) => updateNode(node.id, "action", e.target.value), children: [
                    /* @__PURE__ */ jsx("option", { value: "enviar_email", children: "📧 Enviar Email" }),
                    /* @__PURE__ */ jsx("option", { value: "criar_tarefa", children: "📝 Criar Tarefa" }),
                    /* @__PURE__ */ jsx("option", { value: "atualizar_crm", children: "🏢 Atualizar CRM" }),
                    /* @__PURE__ */ jsx("option", { value: "enviar_webhook", children: "🔗 Enviar Webhook" })
                  ] }),
                  node.action === "enviar_email" && /* @__PURE__ */ jsx("input", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", placeholder: "destinatario@email.com" })
                ] }),
                node.type === "ai_response" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("select", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", value: node.model || "deepseek", onChange: (e) => updateNode(node.id, "model", e.target.value), children: [
                    /* @__PURE__ */ jsx("option", { value: "deepseek", children: "🧠 DeepSeek AI (Recomendado)" }),
                    /* @__PURE__ */ jsx("option", { value: "openai", children: "🤖 OpenAI GPT-4" }),
                    /* @__PURE__ */ jsx("option", { value: "claude", children: "🎭 Claude AI" }),
                    /* @__PURE__ */ jsx("option", { value: "gemini", children: "✨ Google Gemini" })
                  ] }),
                  /* @__PURE__ */ jsx("textarea", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white resize-none h-16 outline-none focus:border-neon-blue", placeholder: "Instruções para a IA...", value: node.prompt || "", onChange: (e) => updateNode(node.id, "prompt", e.target.value) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx("button", { className: "flex-1 text-xs bg-purple-900/30 text-purple-300 py-1 rounded border border-purple-800/50 hover:bg-purple-900/50", children: "📋 Usar Contexto" }),
                    /* @__PURE__ */ jsx("button", { className: "flex-1 text-xs bg-blue-900/30 text-blue-300 py-1 rounded border border-blue-800/50 hover:bg-blue-900/50", children: "🧪 Testar" })
                  ] })
                ] }),
                node.type === "webhook" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("input", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", placeholder: "https://api.exemplo.com/webhook", value: node.url || "", onChange: (e) => updateNode(node.id, "url", e.target.value) }),
                  /* @__PURE__ */ jsxs("select", { className: "w-full bg-black/50 border border-gray-700 rounded p-2 text-sm text-white outline-none focus:border-neon-blue", value: node.method || "POST", onChange: (e) => updateNode(node.id, "method", e.target.value), children: [
                    /* @__PURE__ */ jsx("option", { value: "POST", children: "POST" }),
                    /* @__PURE__ */ jsx("option", { value: "GET", children: "GET" }),
                    /* @__PURE__ */ jsx("option", { value: "PUT", children: "PUT" })
                  ] })
                ] }),
                node.type === "delay" && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "⏱️" }),
                  /* @__PURE__ */ jsx("input", { type: "number", min: "1", max: "60", className: "bg-black/50 border border-gray-700 rounded p-2 text-center text-white outline-none focus:border-neon-blue", value: node.delay || 5, onChange: (e) => updateNode(node.id, "delay", e.target.value) }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "minutos" })
                ] }),
                node.type === "trigger" && /* @__PURE__ */ jsxs("div", { className: "text-center text-gray-400 text-sm py-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: "🎯" }),
                  "Quando o cliente enviar: ",
                  /* @__PURE__ */ jsx("br", {}),
                  " ",
                  /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
                    '"',
                    node.content || "Olá",
                    '"'
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-500 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) })
              ]
            },
            node.id
          )),
          /* @__PURE__ */ jsx("div", { className: "text-gray-600 text-sm mt-4 animate-pulse", children: "↓ Arraste elementos para conectar" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4 opacity-20", children: "☊" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: "Flow Builder v2" }),
      /* @__PURE__ */ jsx("p", { children: "Selecione ou crie um fluxo para começar a editar." })
    ] }) })
  ] });
};
const ResellerPanel = () => {
  const [referralLink, setReferralLink] = useState("https://getnexo.com.br/r/leandro123");
  const [stats, setStats] = useState({
    commissions: 1450,
    active_clients: 12,
    clicks: 342,
    conversion_rate: 3.5
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    loadAffiliateData();
  }, []);
  const loadAffiliateData = async () => {
    try {
      const response = await axios.get("/api/affiliate/stats");
      if (response.data) {
        setStats(response.data.stats);
        setWithdrawals(response.data.withdrawals || []);
        setMaterials(response.data.materials || []);
      }
    } catch (err) {
    }
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      alert("Erro ao copiar link");
    }
  };
  const handleWithdraw = async () => {
    if (stats.commissions < 100) {
      alert("Valor mínimo para saque: R$ 100,00");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/affiliate/withdraw", { amount: stats.commissions });
      alert("Solicitação de saque enviada! Você será notificado quando for processada.");
      loadAffiliateData();
    } catch (err) {
      alert("Erro ao solicitar saque");
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-8 max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-black px-2 py-1 rounded mb-2 inline-block", children: "PARCEIRO GOLD" }),
            /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black text-white italic tracking-tight mb-2", children: "PAINEL DE AFILIADO" }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-400 max-w-lg", children: [
              "Você está entre os top 5% parceiros. Continue indicando para desbloquear o ",
              /* @__PURE__ */ jsx("span", { className: "text-neon-blue font-bold", children: "Plano Black" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 font-bold uppercase mb-1", children: "Próximo Nível" }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-white mb-2", children: [
              "85",
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "/100 Vendas" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-gray-500 mb-1 font-mono", children: [
            /* @__PURE__ */ jsx("span", { children: "Level 3" }),
            /* @__PURE__ */ jsx("span", { children: "Level 4 (Black)" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 w-[85%] shadow-[0_0_15px_rgba(255,165,0,0.5)]" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -right-10 -top-10 w-64 h-64 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 relative overflow-hidden group hover:border-neon-green/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 p-2 bg-neon-green/10 rounded-lg text-neon-green text-xl md:text-2xl group-hover:scale-110 transition-transform", children: "💰" }),
        /* @__PURE__ */ jsx("h3", { className: "text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2", children: "Comissões Totais" }),
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-black text-white", children: [
          "R$ ",
          stats.commissions.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-neon-green mt-1 font-bold", children: "+R$ 350,00 esta semana" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 relative overflow-hidden group hover:border-neon-blue/50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 p-2 bg-neon-blue/10 rounded-lg text-neon-blue text-xl md:text-2xl group-hover:scale-110 transition-transform", children: "👥" }),
        /* @__PURE__ */ jsx("h3", { className: "text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2", children: "Clientes Ativos" }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-white", children: stats.active_clients }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mt-1", children: "Churn rate: 0.5% (Baixo)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 p-2 bg-purple-500/10 rounded-lg text-purple-400 text-xl md:text-2xl", children: "⚡" }),
        /* @__PURE__ */ jsx("h3", { className: "text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2", children: "Cliques (Link)" }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-white", children: stats.clicks }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mt-1", children: "CTR médio: 3.5%" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `glass-panel p-6 rounded-xl border border-gray-800 bg-neon-green/5 flex flex-col justify-center items-center cursor-pointer hover:bg-neon-green/10 transition-colors border-dashed border-2 ${stats.commissions >= 100 ? "border-neon-green/30" : "border-gray-600/30 opacity-50"}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl mb-1", children: "💸" }),
        /* @__PURE__ */ jsxs("span", { className: "text-neon-green font-bold text-sm", children: [
          "SACAR R$ ",
          stats.commissions.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        ] }),
        stats.commissions < 100 && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 mt-1", children: "Mín. R$ 100,00" }),
        stats.commissions >= 100 && /* @__PURE__ */ jsx("button", { onClick: handleWithdraw, disabled: loading, className: "mt-2 bg-neon-green text-black font-bold text-xs px-3 py-1 rounded hover:shadow-[0_0_10px_rgba(0,255,157,0.4)] transition-all", children: loading ? "..." : "SOLICITAR" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900 via-gray-900 to-black relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-purple-500" }),
        /* @__PURE__ */ jsx("h3", { className: "text-white font-bold mb-1 text-lg", children: "Seu Link Mágico" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mb-6 leading-relaxed", children: "Envie este link. O cookie dura 90 dias. A comissão cai na hora." }),
        /* @__PURE__ */ jsxs("div", { className: "bg-black border border-gray-700 rounded-lg p-3 mb-4 flex gap-2 items-center shadow-inner relative group", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: referralLink,
              readOnly: true,
              className: "bg-transparent text-neon-blue text-sm w-full outline-none font-mono tracking-tighter"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute right-2 bg-neon-blue/20 text-neon-blue text-[10px] px-2 py-1 rounded hidden group-hover:block animate-fade-in", children: "Copiar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("button", { onClick: copyLink, className: "flex-1 bg-neon-blue text-black font-black py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all transform hover:-translate-y-1", children: copied ? "✓ COPIADO!" : "COPIAR LINK" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => alert("QR Code gerado! Baixe ou compartilhe."),
              className: "bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 border border-gray-700",
              title: "Gerar QR Code",
              children: "📱"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg text-center mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto bg-gray-100 rounded flex items-center justify-center text-4xl", children: "📲" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Clique 📱 para gerar QR Code" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-gray-800", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-gray-500 uppercase mb-3", children: "Materiais de Venda" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("button", { className: "bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded border border-gray-700 transition-all hover:border-neon-blue/50 hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]", children: "📱 Stories IG" }),
            /* @__PURE__ */ jsx("button", { className: "bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded border border-gray-700 transition-all hover:border-neon-green/50 hover:shadow-[0_0_10px_rgba(0,255,157,0.2)]", children: "💬 Copy WhatsApp" }),
            /* @__PURE__ */ jsx("button", { className: "bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded border border-gray-700 transition-all hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(147,51,234,0.2)]", children: "📧 Email Template" }),
            /* @__PURE__ */ jsx("button", { className: "bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded border border-gray-700 transition-all hover:border-yellow-500/50 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]", children: "🎯 Scripts de Venda" })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-gray-500 uppercase mb-3", children: "Tutoriais em Vídeo" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ jsxs("button", { className: "w-full bg-red-900/30 hover:bg-red-900/50 text-white text-xs py-2 px-3 rounded border border-red-500/30 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "▶️" }),
              " Como vender GetNexo em 5 min"
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "w-full bg-red-900/30 hover:bg-red-900/50 text-white text-xs py-2 px-3 rounded border border-red-500/30 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "▶️" }),
              " Objeções e Como Quebrar"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-gray-500 uppercase mb-3", children: "Templates Prontos" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gray-800/50 p-3 rounded text-xs text-gray-300 relative group", children: [
              /* @__PURE__ */ jsx("p", { className: "line-clamp-2", children: '"Oi! Você vende pelo WhatsApp? Descobri uma ferramenta que..."' }),
              /* @__PURE__ */ jsx("button", { className: "absolute right-2 top-2 text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity", children: "📋" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gray-800/50 p-3 rounded text-xs text-gray-300 relative group", children: [
              /* @__PURE__ */ jsx("p", { className: "line-clamp-2", children: '"Cara, tô usando essa IA no WhatsApp da loja e as vendas..."' }),
              /* @__PURE__ */ jsx("button", { className: "absolute right-2 top-2 text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity", children: "📋" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-gray-800", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-gray-500 uppercase mb-2", children: "Ferramentas" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx("button", { className: "flex-1 bg-gradient-to-r from-neon-blue to-purple-500 text-black font-bold text-xs py-2 rounded hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all", children: "📊 Dashboard Completo" }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 glass-panel p-0 rounded-xl border border-gray-800 overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-white", children: "Últimas Conversões" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 bg-black/40 px-2 py-1 rounded", children: "Tempo Real" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto flex-1", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-400", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-black/40 text-gray-500 text-xs uppercase font-bold tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Cliente" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Plano" }),
            /* @__PURE__ */ jsx("th", { className: "p-4", children: "Data" }),
            /* @__PURE__ */ jsx("th", { className: "p-4 text-right", children: "Sua Parte" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-800/50", children: [
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-800/30 transition-colors group", children: [
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-white group-hover:text-neon-blue transition-colors", children: "Padaria Central" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px]", children: "padariacentral.com.br" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase", children: "Enterprise" }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: "12 Jan" }),
              /* @__PURE__ */ jsx("td", { className: "p-4 text-neon-green font-mono font-bold text-right", children: "+ R$ 150,00" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-800/30 transition-colors group", children: [
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-white group-hover:text-neon-blue transition-colors", children: "Oficina do Zé" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px]", children: "automecanica.com.br" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase", children: "Pro" }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: "10 Jan" }),
              /* @__PURE__ */ jsx("td", { className: "p-4 text-neon-green font-mono font-bold text-right", children: "+ R$ 89,00" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-800/30 transition-colors group", children: [
              /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-white", children: "Clinica Sorriso" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px]", children: "clinicasorriso.com.br" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase", children: "Pro" }) }),
              /* @__PURE__ */ jsx("td", { className: "p-4", children: "08 Jan" }),
              /* @__PURE__ */ jsx("td", { className: "p-4 text-neon-green font-mono font-bold text-right", children: "+ R$ 89,00" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-gray-800 bg-gray-900/30 text-center", children: /* @__PURE__ */ jsxs("button", { className: "text-xs text-gray-500 hover:text-white transition-colors", children: [
          "Ver todos os ",
          stats.active_clients,
          " clientes"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 glass-panel p-6 rounded-xl border border-gray-800", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-white font-bold mb-4 text-lg flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { children: "💰" }),
        " Histórico de Saques"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-gray-800/30 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-white font-bold text-sm", children: "R$ 850,00" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400", children: "PIX - Processado" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "15 Jan 2026" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400 text-xs font-bold", children: "✅ Pago" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-gray-800/30 rounded-lg", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-white font-bold text-sm", children: "R$ 600,00" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400", children: "PIX - Processado" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "01 Jan 2026" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-400 text-xs font-bold", children: "✅ Pago" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-gray-800 text-center", children: /* @__PURE__ */ jsx("button", { className: "text-xs text-gray-500 hover:text-neon-blue transition-colors", children: "Ver histórico completo" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 bg-gradient-to-br from-blue-900/20 to-purple-900/20", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-white font-bold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { children: "🚀" }),
          " Dicas de Performance"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "text-sm text-gray-300 space-y-2", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neon-blue mt-1", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: "Compartilhe em grupos relevantes do seu nicho" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neon-blue mt-1", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: "Use os materiais prontos para converter mais" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-neon-green mt-1", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: "Meta atual: +R$ 500/mês para subir de nível" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800 bg-gradient-to-br from-green-900/20 to-yellow-900/20", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-white font-bold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { children: "🏆" }),
          " Seu Ranking"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-black text-neon-green mb-2", children: "#7" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Entre 1.247 afiliados" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 bg-gray-800 rounded-full h-2", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-neon-green to-yellow-500 h-2 rounded-full w-[65%]" }) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Próximo: #5 (+R$ 200/mês)" })
        ] })
      ] })
    ] })
  ] });
};
const API_URL = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8080" : "https://api.getnexo.com.br";
const ReportsPanel = () => {
  const [stats, setStats] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [csat, setCsat] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/dashboard-stats`).then((r) => r.json()).then(setStats).catch(() => setStats({ sales: 0, open_tickets: 0, csat: null }));
    fetch(`${API_URL}/clicks`).then((r) => r.json()).then(setClicks).catch(() => setClicks([]));
    fetch(`${API_URL}/csat-report`).then((r) => r.json()).then(setCsat).catch(() => setCsat([]));
  }, []);
  if (!stats) return /* @__PURE__ */ jsx("div", { className: "text-white p-10", children: "Carregando Analytics..." });
  const maxSales = 1e4;
  const salesPercent = stats.sales / maxSales * 100;
  return /* @__PURE__ */ jsxs("div", { className: "p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-8", children: "Relatórios & Insights" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-400 text-xs font-bold uppercase", children: "Receita Total" }),
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-neon-green mt-2", children: [
          "R$ ",
          stats.sales?.toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "+12% vs mês anterior" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-400 text-xs font-bold uppercase", children: "CSAT Médio" }),
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-yellow-500 mt-2", children: [
          stats.csat?.toFixed(1),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "/ 5.0" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-400 text-xs font-bold uppercase", children: "Tickets Resolvidos" }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-neon-blue mt-2", children: stats.tickets - stats.open_tickets })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-400 text-xs font-bold uppercase", children: "Cliques em Links" }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white mt-2", children: clicks.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-white font-bold mb-6", children: "Performance de Vendas" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-400 mb-1", children: [
              /* @__PURE__ */ jsx("span", { children: "Meta Mensal" }),
              /* @__PURE__ */ jsxs("span", { children: [
                salesPercent.toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-neon-blue to-neon-green", style: { width: `${Math.min(salesPercent, 100)}%` } }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center bg-black/40 p-3 rounded", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Hoje" }),
              /* @__PURE__ */ jsx("div", { className: "text-white font-bold", children: "R$ 0,00" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center bg-black/40 p-3 rounded", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Ontem" }),
              /* @__PURE__ */ jsx("div", { className: "text-white font-bold", children: "R$ 0,00" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center bg-black/40 p-3 rounded", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Esta Semana" }),
              /* @__PURE__ */ jsxs("div", { className: "text-white font-bold", children: [
                "R$ ",
                stats.sales?.toFixed(2)
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6 rounded-xl border border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-white font-bold mb-4", children: "Últimos Cliques (Ads/Links)" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-y-auto max-h-60 custom-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-gray-400", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-700", children: [
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "ID Campanha" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Horário" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-800", children: [
            clicks.map((cl, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-800/50", children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 text-neon-blue font-mono", children: cl.cta_id }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-right text-gray-500", children: new Date(cl.timestamp).toLocaleTimeString() })
            ] }, i)),
            clicks.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "2", className: "text-center py-4 text-gray-600", children: "Nenhum dado recente." }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
};
if (typeof window !== "undefined") {
  const token = localStorage.getItem("omnichat_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}
const OmniChatApp = ({ initialTab = "chat" }) => {
  const [tab, setTab] = useState(initialTab);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("omnichat_token")) {
      window.location.href = "/admin/login";
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("omnichat_token");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };
  const tabs = [
    { id: "chat", icon: "💬", label: "Chat", color: "bg-[#00d4ff]" },
    { id: "flows", icon: "⚡", label: "Flows", color: "bg-orange-500" },
    { id: "kanban", icon: "📊", label: "Kanban", color: "bg-[#00ff9d]" },
    { id: "broadcast", icon: "📢", label: "Disparos", color: "bg-purple-500" },
    { id: "store", icon: "🏪", label: "Loja", color: "bg-yellow-500" },
    { id: "ai", icon: "🤖", label: "IA", color: "bg-cyan-500" },
    { id: "reports", icon: "📈", label: "Relatórios", color: "bg-emerald-500" },
    { id: "revenda", icon: "💰", label: "Revenda", color: "bg-pink-500" },
    { id: "admin", icon: "⚙️", label: "Admin", color: "bg-gray-700" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full bg-transparent text-gray-200 omnichat-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-black/20 backdrop-blur-sm border-b border-gray-800 p-2 flex justify-between items-center mb-4 rounded-xl mx-4 mt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 overflow-x-auto no-scrollbar", children: tabs.map((t) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTab(t.id);
          },
          className: `omnichat-tab-button px-3 py-2 rounded-lg font-bold transition-all text-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${tab === t.id ? `${t.color} text-black shadow-lg` : "text-gray-400 hover:bg-gray-800"}`,
          children: [
            /* @__PURE__ */ jsx("span", { children: t.icon }),
            " ",
            t.label
          ]
        },
        t.id
      )) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          className: "text-gray-400 hover:text-red-400 text-xs px-2",
          children: "Sair"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-[70vh] flex-1", children: [
      tab === "chat" && /* @__PURE__ */ jsx(ChatInterface, {}),
      tab === "flows" && /* @__PURE__ */ jsx(FlowBuilder, {}),
      tab === "kanban" && /* @__PURE__ */ jsx(KanbanBoard, {}),
      tab === "broadcast" && /* @__PURE__ */ jsx(BroadcastManager, {}),
      tab === "store" && /* @__PURE__ */ jsx(CatalogManager, {}),
      tab === "ai" && /* @__PURE__ */ jsx(AiSettings, {}),
      tab === "reports" && /* @__PURE__ */ jsx(ReportsPanel, {}),
      tab === "revenda" && /* @__PURE__ */ jsx(ResellerPanel, {}),
      tab === "admin" && /* @__PURE__ */ jsx(AdminPanel, {})
    ] }),
    /* @__PURE__ */ jsx(AbandonedCartWidget, {})
  ] });
};
const $$Kanban = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Kanban CRM | OmniNexo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="glass-panel" style="padding:1.5rem; height: calc(100vh - 150px); overflow:hidden;"> ${renderComponent($$result2, "OmniChatApp", OmniChatApp, { "client:idle": true, "initialTab": "kanban", "client:component-hydration": "idle", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/OmniChatApp.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/kanban.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/kanban.astro";
const $$url = "/dashboard/kanban";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Kanban,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
