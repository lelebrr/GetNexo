import { e as createAstro, f as createComponent, n as renderHead, k as renderComponent, r as renderTemplate } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { C as Card } from "../../assets/Card-Dsq8OXHI.js";
import { B as Button } from "../../assets/Input-WBWOzuho.js";
import { a as Toast, L as Loading } from "../../assets/Toast-gh0ly6Nu.js";
/* empty css                                        */
import { renderers } from "../../renderers.mjs";
const GameContainer = ({
  gameType,
  userId,
  conversationId,
  onGameComplete,
  onPointsEarned,
  onClose,
  style = {}
}) => {
  const [session, setSession] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  useEffect(() => {
    initializeGame();
  }, [gameType, userId]);
  const initializeGame = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${"http://localhost:3001"}/api/minigames/session/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          gameType,
          channel: "widget",
          conversationId
        })
      });
      if (!response.ok) {
        throw new Error("Falha ao iniciar jogo");
      }
      const data = await response.json();
      setSession(data.session);
      setGameState({
        status: "ready",
        score: 0,
        attempts: 0,
        gameData: {}
      });
    } catch (err) {
      setError(err.message);
      showToastMessage("Erro ao iniciar jogo");
    } finally {
      setLoading(false);
    }
  };
  const playGame = async (action, userInput = null) => {
    if (!session) return;
    try {
      const response = await fetch(`${"http://localhost:3001"}/api/minigames/${gameType}/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          action,
          userInput
        })
      });
      if (!response.ok) {
        throw new Error("Falha ao jogar");
      }
      const data = await response.json();
      setGameState((prev) => ({
        ...prev,
        ...data.result,
        completed: data.completed
      }));
      if (data.pointsEarned > 0) {
        onPointsEarned?.(data.pointsEarned);
        showToastMessage(`+${data.pointsEarned} pontos!`);
      }
      if (data.completed) {
        onGameComplete?.(data.result);
      }
      return data.result;
    } catch (err) {
      setError(err.message);
      showToastMessage("Erro durante o jogo");
      return null;
    }
  };
  const abandonGame = async () => {
    if (!session) return;
    try {
      await fetch(`${"http://localhost:3001"}/api/minigames/session/${session.sessionId}/abandon`, {
        method: "POST"
      });
      onClose?.();
    } catch (err) {
    }
  };
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3e3);
  };
  const renderGameContent = () => {
    if (loading) {
      return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "20px" }, children: [
        /* @__PURE__ */ jsx(Loading, {}),
        /* @__PURE__ */ jsx("p", { children: "Iniciando jogo..." })
      ] });
    }
    if (error) {
      return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "20px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: error }),
        /* @__PURE__ */ jsx(Button, { onClick: initializeGame, children: "Tentar Novamente" })
      ] });
    }
    if (!gameState) {
      return /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: "20px" }, children: /* @__PURE__ */ jsx("p", { children: "Jogo não inicializado" }) });
    }
    switch (gameType) {
      case "roleta":
        return /* @__PURE__ */ jsx(RouletteGame, { gameState, onPlay: playGame, session });
      case "raspadinha":
        return /* @__PURE__ */ jsx(ScratchCardGame, { gameState, onPlay: playGame, session });
      case "caca_preco":
        return /* @__PURE__ */ jsx(PriceGuessGame, { gameState, onPlay: playGame, session });
      case "quiz":
        return /* @__PURE__ */ jsx(QuizGame, { gameState, onPlay: playGame, session });
      case "monte_kit":
        return /* @__PURE__ */ jsx(KitChoiceGame, { gameState, onPlay: playGame, session });
      default:
        return /* @__PURE__ */ jsx("div", { children: "Jogo não suportado" });
    }
  };
  return /* @__PURE__ */ jsxs(Card, { style: {
    position: "relative",
    maxWidth: "400px",
    margin: "10px auto",
    ...style
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
      paddingBottom: "10px",
      borderBottom: "1px solid #eee"
    }, children: [
      /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "18px" }, children: getGameTitle(gameType) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "secondary",
          size: "small",
          onClick: abandonGame,
          style: { fontSize: "12px" },
          children: "✕"
        }
      )
    ] }),
    gameState && /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
      fontSize: "14px",
      color: "#666"
    }, children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Pontuação: ",
        gameState.score || 0
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Tentativas: ",
        gameState.attempts || 0
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { minHeight: "200px" }, children: renderGameContent() }),
    showToast && /* @__PURE__ */ jsx(
      Toast,
      {
        message: toastMessage,
        type: "success",
        onClose: () => setShowToast(false),
        style: {
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1e3
        }
      }
    )
  ] });
};
const RouletteGame = ({ gameState, onPlay }) => {
  const [spinning, setSpinning] = useState(false);
  const handleSpin = async () => {
    setSpinning(true);
    await onPlay("spin");
    setTimeout(() => setSpinning(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      width: "150px",
      height: "150px",
      border: "3px solid #007bff",
      borderRadius: "50%",
      margin: "20px auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      background: spinning ? "#f0f8ff" : "#ffffff",
      transform: spinning ? "rotate(360deg)" : "none",
      transition: "transform 2s ease-out"
    }, children: "🎰" }),
    /* @__PURE__ */ jsx(
      Button,
      {
        onClick: handleSpin,
        disabled: spinning,
        style: { marginTop: "10px" },
        children: spinning ? "Girando..." : "Girar Roleta"
      }
    ),
    gameState.lastSpin !== void 0 && /* @__PURE__ */ jsxs("p", { style: { marginTop: "10px" }, children: [
      "Resultado: ",
      /* @__PURE__ */ jsx("strong", { children: gameState.lastSpin }),
      " pontos!"
    ] })
  ] });
};
const ScratchCardGame = ({ gameState, onPlay }) => {
  const [scratched, setScratched] = useState(false);
  const handleScratch = async () => {
    await onPlay("scratch");
    setScratched(true);
  };
  return /* @__PURE__ */ jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsx("div", { style: {
    width: "200px",
    height: "120px",
    border: "2px solid #28a745",
    borderRadius: "10px",
    margin: "20px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: scratched ? "#f8fff8" : "#e9ecef",
    cursor: scratched ? "default" : "pointer"
  }, onClick: !scratched ? handleScratch : void 0, children: scratched ? /* @__PURE__ */ jsxs("div", { children: [
    gameState.grid?.map((symbol, index) => /* @__PURE__ */ jsx("span", { style: { fontSize: "20px", margin: "2px" }, children: symbol }, index)),
    gameState.winner && /* @__PURE__ */ jsxs("p", { style: { color: "green", marginTop: "10px" }, children: [
      "Você ganhou ",
      gameState.prize,
      " pontos!"
    ] })
  ] }) : /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: "24px" }, children: "🧽" }),
    /* @__PURE__ */ jsx("p", { children: "Clique para raspar!" })
  ] }) }) });
};
const PriceGuessGame = ({ gameState, onPlay }) => {
  const [guess, setGuess] = useState("");
  const handleGuess = async () => {
    await onPlay("guess", guess);
    setGuess("");
  };
  return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("p", { children: "Qual é o preço do produto?" }),
    /* @__PURE__ */ jsx("div", { style: { margin: "20px 0" }, children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        value: guess,
        onChange: (e) => setGuess(e.target.value),
        placeholder: "Digite seu palpite (R$)",
        style: {
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "150px",
          textAlign: "center"
        }
      }
    ) }),
    /* @__PURE__ */ jsx(Button, { onClick: handleGuess, disabled: !guess, children: "Adivinhar" }),
    gameState.lastGuess !== void 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "15px" }, children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Seu palpite: R$ ",
        gameState.lastGuess
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Diferença: ",
        gameState.difference,
        " pontos de diferença"
      ] }),
      gameState.points > 0 && /* @__PURE__ */ jsxs("p", { style: { color: "green" }, children: [
        "Você ganhou ",
        gameState.points,
        " pontos!"
      ] })
    ] })
  ] });
};
const QuizGame = ({ gameState, onPlay }) => {
  const [answer, setAnswer] = useState("");
  const handleAnswer = async () => {
    await onPlay("answer", answer);
    setAnswer("");
  };
  return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("p", { children: "📚 Quiz da GetNexo" }),
    gameState.question ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { style: { margin: "15px 0", fontWeight: "bold" }, children: gameState.question }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: answer,
          onChange: (e) => setAnswer(e.target.value),
          placeholder: "Sua resposta",
          style: {
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "200px",
            marginBottom: "10px"
          }
        }
      ),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx(Button, { onClick: handleAnswer, disabled: !answer, children: "Responder" }),
      gameState.correct !== void 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "15px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { color: gameState.correct ? "green" : "red" }, children: gameState.correct ? "Correto!" : "Incorreto" }),
        gameState.points > 0 && /* @__PURE__ */ jsxs("p", { children: [
          "Você ganhou ",
          gameState.points,
          " pontos!"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsx("p", { children: "Aguardando pergunta..." })
  ] });
};
const KitChoiceGame = ({ gameState, onPlay }) => {
  const kits = [
    { name: "Kit Básico", description: "Para iniciantes", value: 100 },
    { name: "Kit Premium", description: "Recursos avançados", value: 300 },
    { name: "Kit Deluxe", description: "Tudo incluído", value: 500 }
  ];
  const handleChoose = async (choiceIndex) => {
    await onPlay("choose", choiceIndex.toString());
  };
  return /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("p", { children: "🎁 Escolha o melhor kit!" }),
    /* @__PURE__ */ jsx("div", { style: { margin: "15px 0" }, children: kits.map((kit, index) => /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: () => handleChoose(index),
        style: {
          display: "block",
          width: "100%",
          margin: "5px 0",
          padding: "10px"
        },
        variant: "secondary",
        children: [
          /* @__PURE__ */ jsx("strong", { children: kit.name }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("small", { children: kit.description })
        ]
      },
      index
    )) }),
    gameState.won !== void 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "15px" }, children: [
      /* @__PURE__ */ jsx("p", { style: { color: gameState.won ? "green" : "red" }, children: gameState.won ? "Parabéns! Você ganhou!" : "Não foi dessa vez" }),
      gameState.won && /* @__PURE__ */ jsxs("p", { children: [
        "Você ganhou ",
        gameState.kitValue,
        " pontos!"
      ] })
    ] })
  ] });
};
const getGameTitle = (gameType) => {
  const titles = {
    roleta: "🎰 Roleta Virtual",
    raspadinha: "🧽 Raspadinha",
    caca_preco: "💰 Caça-Preço",
    quiz: "📚 Quiz",
    monte_kit: "🎁 Monte seu Kit"
  };
  return titles[gameType] || "Minigame";
};
const $$Astro = createAstro("https://getnexo.com.br");
const $$gameType = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$gameType;
  const { gameType } = Astro2.params;
  const userId = Astro2.url.searchParams.get("userId");
  const conversationId = Astro2.url.searchParams.get("conversationId");
  return renderTemplate`<html lang="pt" data-astro-cid-xbh26325> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Minigame - ${gameType}</title>${renderHead()}</head> <body data-astro-cid-xbh26325> <div id="game-root" data-astro-cid-xbh26325> ${renderComponent($$result, "GameContainer", GameContainer, { "client:load": true, "gameType": gameType, "userId": userId, "conversationId": conversationId, "onClose": (() => {
    window.parent.postMessage({ action: "closeGame" }, "*");
  }), "onPointsEarned": ((points) => {
    window.parent.postMessage({ action: "pointsEarned", points }, "*");
  }), "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/games/GameContainer.jsx", "client:component-export": "default", "data-astro-cid-xbh26325": true })} </div> </body></html>`;
}, "/home/lele/usenexo/getnexo-site/src/pages/games/[gameType].astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/games/[gameType].astro";
const $$url = "/games/[gameType]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$gameType,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
