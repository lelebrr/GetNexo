import { renderers } from "../../renderers.mjs";
async function post(req) {
  try {
    const { message, context = [] } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const messages = [
      {
        role: "system",
        content: "Você é GetNexo AI, um assistente inteligente para o GetNexo SaaS Platform. Você ajuda usuários com questões sobre automação, IA, business intelligence, e todas as funcionalidades da plataforma. Seja útil, amigável e preciso."
      },
      ...context.slice(-10),
      // Last 10 messages for context
      {
        role: "user",
        content: message
      }
    ];
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.BASE_URL || "http://localhost:4321",
        "X-Title": "GetNexo SaaS Platform"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta",
        messages,
        max_tokens: 1e3,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
    return new Response(JSON.stringify({
      response: aiResponse,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  post
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
