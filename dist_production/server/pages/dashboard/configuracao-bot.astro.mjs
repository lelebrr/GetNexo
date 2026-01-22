import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
import fs from "fs";
import path from "path";
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro("https://getnexo.com.br");
const $$ConfiguracaoBot = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ConfiguracaoBot;
  const userDomain = "meu-bot-exemplo";
  const SESSIONS_DIR = path.join(process.cwd(), "..", "sessions", "web");
  const caminho = path.join(SESSIONS_DIR, `${userDomain}.json`);
  let ton = "amigo";
  let dadosSessao = { id: userDomain, canal: "site", nome: "Usuário" };
  if (fs.existsSync(caminho)) {
    try {
      const fileContent = fs.readFileSync(caminho, "utf-8");
      dadosSessao = JSON.parse(fileContent);
      ton = dadosSessao.tom || "amigo";
    } catch (e) {
    }
  }
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const novoTom = formData.get("tom");
      if (novoTom) {
        ton = novoTom.toString();
        dadosSessao.tom = ton;
        if (!fs.existsSync(SESSIONS_DIR)) {
          fs.mkdirSync(SESSIONS_DIR, { recursive: true });
        }
        fs.writeFileSync(caminho, JSON.stringify(dadosSessao, null, 2));
        return Astro2.redirect(Astro2.url.pathname + "?saved=true");
      }
    } catch (e) {
    }
  }
  const isSaved = Astro2.url.searchParams.get("saved") === "true";
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Personalidade do Bot - GetNexo" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-8 max-w-4xl mx-auto"> <header class="mb-10"> <h1 class="text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
Personalidade do seu Assistente
</h1> <p class="text-slate-400 text-lg">Defina como seu bot deve interagir com seus clientes.</p> </header> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <!-- Config Card --> <div class="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"> <form method="POST" class="space-y-8"> <div> <label class="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Selecione o Tom de Voz</label> <div class="grid grid-cols-1 gap-4"> ${["amigo", "certinho", "empresarial"].map((t) => renderTemplate`<label${addAttribute(`
                                    relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all
                                    ${ton === t ? "border-cyan-500 bg-cyan-500/10" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"}
                                `, "class")}> <input type="radio" name="tom"${addAttribute(t, "value")}${addAttribute(ton === t, "checked")} class="sr-only" onchange="this.form.submit()"> <div class="flex-1"> <h3${addAttribute(`text-lg font-bold ${ton === t ? "text-cyan-400" : "text-white"}`, "class")}> ${t === "amigo" ? "🤝 Amigável" : t === "certinho" ? "✅ Educado" : "💼 Corporativo"} </h3> <p class="text-sm text-slate-400"> ${t === "amigo" ? 'Fala gira e usa "E aí", ideal para marcas jovens.' : t === "certinho" ? 'Usa "Olá" e linguagem clara, ideal para e-commerce.' : "Linguagem formal e profissional, ideal para B2B."} </p> </div> ${ton === t && renderTemplate`<div class="h-6 w-6 bg-cyan-500 rounded-full flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-900" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg> </div>`} </label>`)} </div> </div> ${isSaved && renderTemplate`<div class="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-center font-bold animate-bounce">
✨ Salvo com sucesso!
</div>`} </form> </div> <!-- Preview Card --> <div class="space-y-6"> <div class="bg-black/40 border border-slate-800 rounded-3xl p-8 h-full flex flex-col"> <h2 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-6">Preview do Chat</h2> <div class="flex-1 space-y-6"> <!-- User message --> <div class="flex gap-4"> <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">C</div> <div class="bg-slate-800/80 rounded-2xl rounded-tl-none p-4 text-slate-200 text-sm max-w-[80%]">
Oi, quero ver aquela bermuda azul que vi mais cedo.
</div> </div> <!-- Bot response --> <div class="flex gap-4 justify-end"> <div class="bg-gradient-to-br from-cyan-600/20 to-emerald-600/20 border border-cyan-500/30 rounded-2xl rounded-tr-none p-4 text-white text-sm max-w-[80%] shadow-lg shadow-cyan-500/5"> <span class="text-cyan-400 text-[10px] font-black uppercase block mb-2 tracking-widest">Nexo Bot</span> ${ton === "amigo" ? "E aí, Leandro! Voltou? A bermuda tá aqui guardada pra você. Tá R$ 89 agora, bora?" : ton === "certinho" ? "Olá, Leandro. Sim, temos a bermuda azul em estoque por R$ 89,00. Gostaria de finalizar o pedido?" : "Prezado Sr. Leandro, confirmamos a disponibilidade da bermuda azul em nosso inventário ao valor de R$ 89,00. Procederemos com o faturamento?"} </div> <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-cyan-500/20">AI</div> </div> </div> <div class="mt-8 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 text-xs text-slate-400 text-center italic">
"O tom de voz altera automaticamente o robô em todos os canais (Site, WhatsApp e Redes Sociais)."
</div> </div> </div> </div> </div> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/configuracao-bot.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/configuracao-bot.astro";
const $$url = "/dashboard/configuracao-bot";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ConfiguracaoBot,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
