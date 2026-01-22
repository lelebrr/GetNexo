import { f as createComponent, k as renderComponent, r as renderTemplate } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card } from "../../assets/Card-Dsq8OXHI.js";
import { B as Button, I as Input } from "../../assets/Input-WBWOzuho.js";
import "../../assets/Toast-gh0ly6Nu.js";
import { renderers } from "../../renderers.mjs";
const Select = ({ value, onChange, options, required }) => /* @__PURE__ */ jsx(
  "select",
  {
    value,
    onChange: (e) => onChange(e.target.value),
    required,
    className: "w-full p-2 border rounded bg-white text-black",
    children: options.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
  }
);
const Badge = ({ children, variant = "info" }) => {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800"
  };
  return /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${variants[variant] || variants.info}`, children });
};
const Table = ({ children }) => /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "w-full text-left border-collapse", children }) });
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg max-w-lg w-full text-black", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4 border-bottom pb-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: title }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-2xl", children: "×" })
    ] }),
    children
  ] }) });
};
const Tabs = ({ activeTab, onTabChange, tabs }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("div", { className: "flex border-b mb-4", children: tabs.map((tab) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onTabChange(tab.id),
      className: `px-4 py-2 ${activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`,
      children: tab.label
    },
    tab.id
  )) }),
  /* @__PURE__ */ jsx("div", { children: tabs.find((tab) => tab.id === activeTab)?.content })
] });
const Progress = ({ value, className }) => /* @__PURE__ */ jsx("div", { className: `h-2 bg-gray-200 rounded overflow-hidden ${className}`, children: /* @__PURE__ */ jsx("div", { className: "h-full bg-blue-500", style: { width: `${value}%` } }) });
const Tag = ({ children, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800"
  };
  return /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-xs ${variants[variant] || variants.primary}`, children });
};
const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...token ? { "Authorization": `Bearer ${token}` } : {}
      }
    };
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro na requisição API");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
const BehavioralTaggingDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [clusteringStats, setClusteringStats] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [behavioralTags, setBehavioralTags] = useState([]);
  const [behaviorRules, setBehaviorRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, clustersRes, tagsRes, rulesRes] = await Promise.all([
        apiRequest("/api/clustering/stats"),
        apiRequest("/api/clustering/clusters"),
        apiRequest("/api/clustering/behavioral-tags"),
        apiRequest("/api/clustering/behavior-rules")
      ]);
      setClusteringStats(statsRes.data);
      setClusters(clustersRes.data);
      setBehavioralTags(tagsRes.data);
      setBehaviorRules(rulesRes.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleRunClustering = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("/api/clustering/run", "POST");
      if (result.success) {
        await loadData();
        alert("Clustering executado com sucesso!");
      }
    } catch (error) {
      alert("Erro ao executar clustering");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateTag = async (tagData) => {
    try {
      const result = await apiRequest("/api/clustering/behavioral-tags", "POST", tagData);
      if (result.success) {
        await loadData();
        setShowModal(false);
      }
    } catch (error) {
    }
  };
  const handleCreateRule = async (ruleData) => {
    try {
      const result = await apiRequest("/api/clustering/behavior-rules", "POST", ruleData);
      if (result.success) {
        await loadData();
        setShowModal(false);
      }
    } catch (error) {
    }
  };
  const handleApplyTags = async () => {
    const userIds = prompt("Digite os IDs dos usuários separados por vírgula:");
    if (!userIds) return;
    setLoading(true);
    try {
      const result = await apiRequest("/api/clustering/apply-tags", "POST", {
        userIds: userIds.split(",").map((id) => id.trim())
      });
      if (result.success) {
        alert(`${result.data.totalTagsApplied} tags aplicadas para ${result.data.processedUsers} usuários`);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const renderOverviewTab = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: clusteringStats?.profilesCount || 0 }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Usuários Analisados" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: clusters.length }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Clusters Ativos" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-600", children: behavioralTags.length }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Tags Comportamentais" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-600", children: behaviorRules.length }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Regras de Comportamento" })
      ] }) })
    ] }),
    clusteringStats && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Último Clustering" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Clusters" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: clusteringStats.clusters })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Silhouette Score" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: clusteringStats.silhouetteScore?.toFixed(3) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Iterações" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: clusteringStats.iterations })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Status" }),
          /* @__PURE__ */ jsx(Badge, { variant: clusteringStats.converged ? "success" : "warning", children: clusteringStats.converged ? "Convergido" : "Não Convergido" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Ações" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleRunClustering,
            disabled: loading,
            variant: "primary",
            children: loading ? "Executando..." : "Executar Clustering"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => {
              setModalType("tag");
              setShowModal(true);
            },
            variant: "secondary",
            children: "Criar Tag Comportamental"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => {
              setModalType("rule");
              setShowModal(true);
            },
            variant: "secondary",
            children: "Criar Regra"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleApplyTags,
            variant: "outline",
            children: "Aplicar Tags"
          }
        )
      ] })
    ] })
  ] });
  const renderClustersTab = () => /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: clusters.map((cluster) => /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-2", children: [
      "Cluster ",
      cluster.cluster_id
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Usuários:" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: cluster.user_count })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Engajamento Médio:" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          cluster.avg_engagement,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Conversão:" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          cluster.avg_conversion_prob,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Churn Risk:" }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          cluster.avg_churn_risk,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: () => {
          setActiveTab("cluster-detail");
          setSelectedItem(cluster);
        },
        children: "Ver Detalhes"
      }
    ) })
  ] }, cluster.cluster_id)) }) });
  const renderTagsTab = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Tags Comportamentais" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            setModalType("tag");
            setSelectedItem(null);
            setShowModal(true);
          },
          variant: "primary",
          children: "Nova Tag"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Nome" }),
        /* @__PURE__ */ jsx("th", { children: "Categoria" }),
        /* @__PURE__ */ jsx("th", { children: "Confiança" }),
        /* @__PURE__ */ jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsx("th", { children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: behavioralTags.map((tag) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "font-medium", children: tag.name }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Tag, { variant: "secondary", children: tag.category }) }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Progress, { value: tag.confidence_score, className: "w-16" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
            tag.confidence_score,
            "%"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Badge, { variant: tag.is_active ? "success" : "secondary", children: tag.is_active ? "Ativo" : "Inativo" }) }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setModalType("tag");
                setSelectedItem(tag);
                setShowModal(true);
              },
              children: "Editar"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "danger",
              size: "sm",
              onClick: async () => {
                if (confirm("Tem certeza que deseja excluir esta tag?")) {
                  await apiRequest(`/api/clustering/behavioral-tags/${tag.id}`, "DELETE");
                  await loadData();
                }
              },
              children: "Excluir"
            }
          )
        ] }) })
      ] }, tag.id)) })
    ] })
  ] });
  const renderRulesTab = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Regras de Comportamento" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            setModalType("rule");
            setSelectedItem(null);
            setShowModal(true);
          },
          variant: "primary",
          children: "Nova Regra"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Nome" }),
        /* @__PURE__ */ jsx("th", { children: "Prioridade" }),
        /* @__PURE__ */ jsx("th", { children: "Threshold" }),
        /* @__PURE__ */ jsx("th", { children: "Aplicações" }),
        /* @__PURE__ */ jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsx("th", { children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: behaviorRules.map((rule) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "font-medium", children: rule.name }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Badge, { variant: rule.priority === 1 ? "danger" : rule.priority === 2 ? "warning" : "secondary", children: rule.priority === 1 ? "Alta" : rule.priority === 2 ? "Média" : "Baixa" }) }),
        /* @__PURE__ */ jsxs("td", { children: [
          rule.confidence_threshold,
          "%"
        ] }),
        /* @__PURE__ */ jsx("td", { children: rule.applications_count }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Badge, { variant: rule.is_active ? "success" : "secondary", children: rule.is_active ? "Ativo" : "Inativo" }) }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setModalType("rule");
                setSelectedItem(rule);
                setShowModal(true);
              },
              children: "Editar"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "danger",
              size: "sm",
              onClick: async () => {
                if (confirm("Tem certeza que deseja excluir esta regra?")) {
                  await apiRequest(`/api/clustering/behavior-rules/${rule.id}`, "DELETE");
                  await loadData();
                }
              },
              children: "Excluir"
            }
          )
        ] }) })
      ] }, rule.id)) })
    ] })
  ] });
  const renderModal = () => {
    if (!showModal) return null;
    const isEdit = !!selectedItem;
    return /* @__PURE__ */ jsx(
      Modal,
      {
        isOpen: showModal,
        onClose: () => setShowModal(false),
        title: `${isEdit ? "Editar" : "Criar"} ${modalType === "tag" ? "Tag Comportamental" : "Regra de Comportamento"}`,
        children: modalType === "tag" ? /* @__PURE__ */ jsx(
          TagForm,
          {
            initialData: selectedItem,
            onSubmit: handleCreateTag,
            onCancel: () => setShowModal(false)
          }
        ) : /* @__PURE__ */ jsx(
          RuleForm,
          {
            initialData: selectedItem,
            onSubmit: handleCreateRule,
            onCancel: () => setShowModal(false)
          }
        )
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Behavioral Tagging System" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: "Sistema completo de tagging comportamental e clustering de usuários" })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        activeTab,
        onTabChange: setActiveTab,
        tabs: [
          { id: "overview", label: "Visão Geral", content: renderOverviewTab() },
          { id: "clusters", label: "Clusters", content: renderClustersTab() },
          { id: "tags", label: "Tags Comportamentais", content: renderTagsTab() },
          { id: "rules", label: "Regras", content: renderRulesTab() }
        ]
      }
    ),
    renderModal()
  ] });
};
const TagForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    category: "",
    rules: [],
    confidence_score: 50,
    is_active: true
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Nome da Tag" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          value: formData.name,
          onChange: (e) => setFormData({ ...formData, name: e.target.value }),
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Categoria" }),
      /* @__PURE__ */ jsx(
        Select,
        {
          value: formData.category,
          onChange: (value) => setFormData({ ...formData, category: value }),
          options: [
            { value: "engagement", label: "Engajamento" },
            { value: "conversion", label: "Conversão" },
            { value: "retention", label: "Retenção" },
            { value: "loyalty", label: "Lealdade" }
          ],
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Score de Confiança (%)" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "number",
          min: "0",
          max: "100",
          value: formData.confidence_score,
          onChange: (e) => setFormData({ ...formData, confidence_score: parseInt(e.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          id: "is_active",
          checked: formData.is_active,
          onChange: (e) => setFormData({ ...formData, is_active: e.target.checked }),
          className: "mr-2"
        }
      ),
      /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "text-sm", children: "Tag Ativa" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-4", children: [
      /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "primary", children: [
        initialData ? "Atualizar" : "Criar",
        " Tag"
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "secondary", onClick: onCancel, children: "Cancelar" })
    ] })
  ] });
};
const RuleForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    tag_name: "",
    tag_category: "",
    priority: 1,
    conditions: [],
    tag_config: {},
    confidence_threshold: 50,
    expiration_days: null,
    max_applications: null,
    cooldown_hours: 24,
    is_active: true
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Nome da Regra" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          value: formData.name,
          onChange: (e) => setFormData({ ...formData, name: e.target.value }),
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Descrição" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          value: formData.description,
          onChange: (e) => setFormData({ ...formData, description: e.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Tag Nome" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: formData.tag_name,
            onChange: (e) => setFormData({ ...formData, tag_name: e.target.value }),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Tag Categoria" }),
        /* @__PURE__ */ jsx(
          Select,
          {
            value: formData.tag_category,
            onChange: (value) => setFormData({ ...formData, tag_category: value }),
            options: [
              { value: "engagement", label: "Engajamento" },
              { value: "conversion", label: "Conversão" },
              { value: "retention", label: "Retenção" },
              { value: "loyalty", label: "Lealdade" }
            ],
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Prioridade" }),
        /* @__PURE__ */ jsx(
          Select,
          {
            value: formData.priority.toString(),
            onChange: (value) => setFormData({ ...formData, priority: parseInt(value) }),
            options: [
              { value: "1", label: "Alta" },
              { value: "2", label: "Média" },
              { value: "3", label: "Baixa" }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Threshold (%)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: "0",
            max: "100",
            value: formData.confidence_threshold,
            onChange: (e) => setFormData({ ...formData, confidence_threshold: parseInt(e.target.value) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Cooldown (horas)" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "number",
            min: "0",
            value: formData.cooldown_hours,
            onChange: (e) => setFormData({ ...formData, cooldown_hours: parseInt(e.target.value) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          id: "rule_active",
          checked: formData.is_active,
          onChange: (e) => setFormData({ ...formData, is_active: e.target.checked }),
          className: "mr-2"
        }
      ),
      /* @__PURE__ */ jsx("label", { htmlFor: "rule_active", className: "text-sm", children: "Regra Ativa" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-4", children: [
      /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "primary", children: [
        initialData ? "Atualizar" : "Criar",
        " Regra"
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "secondary", onClick: onCancel, children: "Cancelar" })
    ] })
  ] });
};
const $$BehavioralTagging = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Sistema de Behavioral Tagging" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BehavioralTaggingDashboard", BehavioralTaggingDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/BehavioralTaggingDashboard.jsx", "client:component-export": "default" })} ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/behavioral-tagging.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/behavioral-tagging.astro";
const $$url = "/admin/behavioral-tagging";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$BehavioralTagging,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
