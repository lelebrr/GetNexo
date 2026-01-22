import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { B as Button, I as Input } from "../../assets/Input-WBWOzuho.js";
import { C as Card } from "../../assets/Card-Dsq8OXHI.js";
/* empty css                                       */
import { renderers } from "../../renderers.mjs";
const GameAdmin = () => {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameConfig, setGameConfig] = useState({
    name: "",
    description: "",
    isActive: true,
    games: {
      roleta: {
        enabled: true,
        maxSpinsPerDay: 3,
        pointRange: { min: 10, max: 100 },
        specialPrizeChance: 5,
        // %
        specialPrizePoints: 500
      },
      raspadinha: {
        enabled: true,
        gridSize: "3x3",
        symbols: ["🍒", "🍋", "🍊", "⭐", "💎"],
        winPatterns: ["3x3", "diagonal", "row"],
        prizeMultiplier: 2
      },
      caca_preco: {
        enabled: true,
        productPool: [],
        priceRange: { min: 50, max: 1e3 },
        tolerance: 10,
        // % de tolerância para acerto
        pointMultiplier: 1.5
      },
      quiz: {
        enabled: true,
        questions: [],
        timeLimit: 30,
        // segundos
        hintsEnabled: true,
        categories: ["empresa", "produtos", "geral"]
      },
      monte_kit: {
        enabled: true,
        kits: [],
        winChance: 25,
        // %
        maxSelectionsPerDay: 1
      }
    },
    loyalty: {
      enabled: true,
      pointsPerGame: 10,
      levelThresholds: [
        { level: 1, name: "Bronze", minPoints: 0 },
        { level: 2, name: "Prata", minPoints: 500 },
        { level: 3, name: "Ouro", minPoints: 1500 },
        { level: 4, name: "Platina", minPoints: 3e3 },
        { level: 5, name: "Diamante", minPoints: 5e3 }
      ],
      redemptionOptions: [
        { name: "10% de desconto", points: 200, type: "discount" },
        { name: "Frete grátis", points: 150, type: "shipping" },
        { name: "Produto bônus", points: 300, type: "product" }
      ]
    },
    analytics: {
      trackSessions: true,
      trackEngagement: true,
      trackConversions: true,
      realTimeDashboard: true,
      customReports: []
    },
    settings: {
      targetChannels: ["whatsapp", "facebook", "chat", "widget"],
      dailyLimits: {
        maxSessionsPerUser: 10,
        maxPointsPerDay: 500
      },
      cooldowns: {
        betweenGames: 60,
        // segundos
        dailyReset: "00:00"
      },
      notifications: {
        levelUp: true,
        pointsEarned: true,
        achievements: true
      }
    }
  });
  useEffect(() => {
    fetchConfigs();
  }, []);
  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${"http://localhost:3001"}/api/games/config`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConfigs(data.configs || []);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = selectedConfig ? "PUT" : "POST";
      const url = selectedConfig ? `${"http://localhost:3001"}/api/games/config/${selectedConfig._id}` : `${"http://localhost:3001"}/api/games/config`;
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(gameConfig)
      });
      if (response.ok) {
        fetchConfigs();
        setIsEditing(false);
        setSelectedConfig(null);
        resetForm();
      }
    } catch (err) {
    }
  };
  const handleEdit = (config) => {
    setSelectedConfig(config);
    setGameConfig(config);
    setIsEditing(true);
  };
  const handleDelete = async (configId) => {
    if (!confirm("Tem certeza que deseja excluir esta configuração?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${"http://localhost:3001"}/api/games/config/${configId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchConfigs();
      }
    } catch (err) {
    }
  };
  const resetForm = () => {
    setGameConfig({
      name: "",
      description: "",
      isActive: true,
      games: {
        roleta: { enabled: true, maxSpinsPerDay: 3, pointRange: { min: 10, max: 100 }, specialPrizeChance: 5, specialPrizePoints: 500 },
        raspadinha: { enabled: true, gridSize: "3x3", symbols: ["🍒", "🍋", "🍊", "⭐", "💎"], winPatterns: ["3x3", "diagonal", "row"], prizeMultiplier: 2 },
        caca_preco: { enabled: true, productPool: [], priceRange: { min: 50, max: 1e3 }, tolerance: 10, pointMultiplier: 1.5 },
        quiz: { enabled: true, questions: [], timeLimit: 30, hintsEnabled: true, categories: ["empresa", "produtos", "geral"] },
        monte_kit: { enabled: true, kits: [], winChance: 25, maxSelectionsPerDay: 1 }
      },
      loyalty: {
        enabled: true,
        pointsPerGame: 10,
        levelThresholds: [
          { level: 1, name: "Bronze", minPoints: 0 },
          { level: 2, name: "Prata", minPoints: 500 },
          { level: 3, name: "Ouro", minPoints: 1500 },
          { level: 4, name: "Platina", minPoints: 3e3 },
          { level: 5, name: "Diamante", minPoints: 5e3 }
        ],
        redemptionOptions: [
          { name: "10% de desconto", points: 200, type: "discount" },
          { name: "Frete grátis", points: 150, type: "shipping" },
          { name: "Produto bônus", points: 300, type: "product" }
        ]
      },
      analytics: { trackSessions: true, trackEngagement: true, trackConversions: true, realTimeDashboard: true, customReports: [] },
      settings: {
        targetChannels: ["whatsapp", "facebook", "chat", "widget"],
        dailyLimits: { maxSessionsPerUser: 10, maxPointsPerDay: 500 },
        cooldowns: { betweenGames: 60, dailyReset: "00:00" },
        notifications: { levelUp: true, pointsEarned: true, achievements: true }
      }
    });
  };
  const updateGameConfig = (section, field, value) => {
    setGameConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  const updateNestedGameConfig = (section, subsection, field, value) => {
    setGameConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };
  const updateGameTypeConfig = (gameType, field, value) => {
    setGameConfig((prev) => ({
      ...prev,
      games: {
        ...prev.games,
        [gameType]: {
          ...prev.games[gameType],
          [field]: value
        }
      }
    }));
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { children: "Carregando configurações de jogos..." });
  }
  return /* @__PURE__ */ jsxs("div", { style: { padding: "20px", maxWidth: "1200px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }, children: "🎮 Minigames no Chat" }),
        /* @__PURE__ */ jsx("p", { style: { color: "#6b7280" }, children: "Configure jogos interativos para engajar seus clientes no chat" })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            resetForm();
            setIsEditing(true);
            setSelectedConfig(null);
          },
          style: { background: "#4CAF50", color: "white" },
          children: "+ Nova Configuração"
        }
      )
    ] }),
    !isEditing ? (
      // Lista de configurações
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }, children: configs.map((config) => /* @__PURE__ */ jsxs(Card, { style: { padding: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }, children: config.name }),
            /* @__PURE__ */ jsx("p", { style: { color: "#6b7280", fontSize: "14px" }, children: config.description })
          ] }),
          /* @__PURE__ */ jsx("span", { style: {
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            background: config.isActive ? "#4CAF50" : "#6b7280",
            color: "white"
          }, children: config.isActive ? "Ativo" : "Inativo" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "12px", color: "#6b7280" }, children: [
          config.games.roleta.enabled && /* @__PURE__ */ jsx("span", { children: "🎰 Roleta" }),
          config.games.raspadinha.enabled && /* @__PURE__ */ jsx("span", { children: "🧽 Raspadinha" }),
          config.games.caca_preco.enabled && /* @__PURE__ */ jsx("span", { children: "💰 Caça-Preço" }),
          config.games.quiz.enabled && /* @__PURE__ */ jsx("span", { children: "📚 Quiz" }),
          config.games.monte_kit.enabled && /* @__PURE__ */ jsx("span", { children: "🎁 Monte Kit" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: () => handleEdit(config), children: "Editar" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "danger", onClick: () => handleDelete(config._id), children: "Excluir" })
        ] })
      ] }, config._id)) })
    ) : (
      // Formulário de edição
      /* @__PURE__ */ jsxs("div", { style: { spaceY: "24px" }, children: [
        /* @__PURE__ */ jsxs(Card, { style: { padding: "24px" }, children: [
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }, children: selectedConfig ? "Editar Configuração" : "Nova Configuração" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Nome" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: gameConfig.name,
                  onChange: (e) => setGameConfig((prev) => ({ ...prev, name: e.target.value })),
                  placeholder: "Nome da configuração"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Descrição" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: gameConfig.description,
                  onChange: (e) => setGameConfig((prev) => ({ ...prev, description: e.target.value })),
                  placeholder: "Descrição da configuração"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: "20px" }, children: /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: gameConfig.isActive,
                onChange: (e) => setGameConfig((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { fontWeight: "bold" }, children: "Configuração Ativa" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { style: { padding: "24px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }, children: "🎮 Configuração dos Jogos" }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "🎰 Roleta Virtual" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Habilitado" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: gameConfig.games.roleta.enabled,
                    onChange: (e) => updateGameTypeConfig("roleta", "enabled", e.target.checked)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Giros/Dia" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.roleta.maxSpinsPerDay,
                    onChange: (e) => updateGameTypeConfig("roleta", "maxSpinsPerDay", parseInt(e.target.value))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Pontos Mín" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.roleta.pointRange.min,
                    onChange: (e) => updateNestedGameConfig("games", "roleta", "pointRange", { ...gameConfig.games.roleta.pointRange, min: parseInt(e.target.value) })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Pontos Máx" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.roleta.pointRange.max,
                    onChange: (e) => updateNestedGameConfig("games", "roleta", "pointRange", { ...gameConfig.games.roleta.pointRange, max: parseInt(e.target.value) })
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "🧽 Raspadinha" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Habilitado" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: gameConfig.games.raspadinha.enabled,
                    onChange: (e) => updateGameTypeConfig("raspadinha", "enabled", e.target.checked)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Grade" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: gameConfig.games.raspadinha.gridSize,
                    onChange: (e) => updateGameTypeConfig("raspadinha", "gridSize", e.target.value),
                    style: { width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" },
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "3x3", children: "3x3" }),
                      /* @__PURE__ */ jsx("option", { value: "4x4", children: "4x4" }),
                      /* @__PURE__ */ jsx("option", { value: "5x5", children: "5x5" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Multiplicador" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.raspadinha.prizeMultiplier,
                    onChange: (e) => updateGameTypeConfig("raspadinha", "prizeMultiplier", parseFloat(e.target.value))
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "💰 Caça-Preço" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Habilitado" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: gameConfig.games.caca_preco.enabled,
                    onChange: (e) => updateGameTypeConfig("caca_preco", "enabled", e.target.checked)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Tolerância (%)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.caca_preco.tolerance,
                    onChange: (e) => updateGameTypeConfig("caca_preco", "tolerance", parseInt(e.target.value))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Multiplicador" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    step: "0.1",
                    value: gameConfig.games.caca_preco.pointMultiplier,
                    onChange: (e) => updateGameTypeConfig("caca_preco", "pointMultiplier", parseFloat(e.target.value))
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "📚 Quiz" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Habilitado" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: gameConfig.games.quiz.enabled,
                    onChange: (e) => updateGameTypeConfig("quiz", "enabled", e.target.checked)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Tempo Limite (seg)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.quiz.timeLimit,
                    onChange: (e) => updateGameTypeConfig("quiz", "timeLimit", parseInt(e.target.value))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Dicas" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: gameConfig.games.quiz.hintsEnabled,
                    onChange: (e) => updateGameTypeConfig("quiz", "hintsEnabled", e.target.checked)
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "🎁 Monte seu Kit" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Habilitado" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: gameConfig.games.monte_kit.enabled,
                    onChange: (e) => updateGameTypeConfig("monte_kit", "enabled", e.target.checked)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Chance de Vitória (%)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.monte_kit.winChance,
                    onChange: (e) => updateGameTypeConfig("monte_kit", "winChance", parseInt(e.target.value))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Máx/Dia" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: gameConfig.games.monte_kit.maxSelectionsPerDay,
                    onChange: (e) => updateGameTypeConfig("monte_kit", "maxSelectionsPerDay", parseInt(e.target.value))
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { style: { padding: "24px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }, children: "💎 Sistema de Fidelidade" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Habilitado" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: gameConfig.loyalty.enabled,
                  onChange: (e) => updateGameConfig("loyalty", "enabled", e.target.checked)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Pontos/Jogo" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: gameConfig.loyalty.pointsPerGame,
                  onChange: (e) => updateGameConfig("loyalty", "pointsPerGame", parseInt(e.target.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: "20px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "Níveis" }),
            /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }, children: gameConfig.loyalty.levelThresholds.map((level, index) => /* @__PURE__ */ jsxs("div", { style: { padding: "12px", border: "1px solid #e5e7eb", borderRadius: "6px", textAlign: "center" }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontWeight: "bold", marginBottom: "4px" }, children: level.name }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: "12px", color: "#6b7280" }, children: [
                level.minPoints,
                " pts"
              ] })
            ] }, index)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { style: { padding: "24px" }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }, children: "⚙️ Configurações Gerais" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Máx Sessões/Dia" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: gameConfig.settings.dailyLimits.maxSessionsPerUser,
                  onChange: (e) => updateNestedGameConfig("settings", "dailyLimits", "maxSessionsPerUser", parseInt(e.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Máx Pontos/Dia" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: gameConfig.settings.dailyLimits.maxPointsPerDay,
                  onChange: (e) => updateNestedGameConfig("settings", "dailyLimits", "maxPointsPerDay", parseInt(e.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: "bold", marginBottom: "8px" }, children: "Cooldown (seg)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: gameConfig.settings.cooldowns.betweenGames,
                  onChange: (e) => updateNestedGameConfig("settings", "cooldowns", "betweenGames", parseInt(e.target.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: "20px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "Canais Habilitados" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: ["whatsapp", "facebook", "chat", "widget"].map((channel) => /* @__PURE__ */ jsxs("label", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: gameConfig.settings.targetChannels.includes(channel),
                  onChange: (e) => {
                    const channels = e.target.checked ? [...gameConfig.settings.targetChannels, channel] : gameConfig.settings.targetChannels.filter((c) => c !== channel);
                    updateGameConfig("settings", "targetChannels", channels);
                  }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { textTransform: "capitalize" }, children: channel })
            ] }, channel)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "secondary",
              onClick: () => {
                setIsEditing(false);
                setSelectedConfig(null);
                resetForm();
              },
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxs(Button, { onClick: handleSave, style: { background: "#4CAF50", color: "white" }, children: [
            selectedConfig ? "Atualizar" : "Criar",
            " Configuração"
          ] })
        ] })
      ] })
    )
  ] });
};
const $$Minigames = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Minigames no Chat", "data-astro-cid-5uwo2cnx": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="minigames-admin" data-astro-cid-5uwo2cnx> ${renderComponent($$result2, "GameAdmin", GameAdmin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/admin/GameAdmin.jsx", "client:component-export": "default", "data-astro-cid-5uwo2cnx": true })} </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/minigames.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/minigames.astro";
const $$url = "/admin/minigames";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Minigames,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
