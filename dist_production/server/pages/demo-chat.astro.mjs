import { f as createComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$DemoChat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<div class="chat-container h-screen bg-void-black p-4 flex flex-col"> <h1 class="text-neon-blue text-2xl font-jetbrains text-center">Demo GetNexo – IA Multimídia</h1> <div class="chat-box flex-1 overflow-y-auto border border-neon-blue rounded p-4 mb-4 space-y-2" id="chat-messages"> <!-- Mensagem inicial --> <div class="flex justify-start"> <div class="bg-neon-blue/20 border border-neon-blue/50 rounded-2xl px-4 py-3 max-w-md"> <p class="text-white text-sm">🚀 <strong>Olá! Bem-vindo ao Chat IA do GetNexo!</strong></p> <p class="text-gray-300 text-xs mt-2">Eu sou um assistente inteligente capaz de:</p> <ul class="text-xs text-neon-blue mt-1 space-y-1"> <li>• 💬 Conversar naturalmente sobre produtos</li> <li>• 🔍 Buscar itens em catálogo JSON</li> <li>• 🛒 Mostrar cards interativos com preços</li> <li>• 🔄 Exibir visualizações 360° dos produtos</li> <li>• 🎤 Responder por voz</li> </ul> <p class="text-cyber-gold text-xs mt-2 font-medium">💡 Teste comigo! Experimente:</p> <div class="flex flex-wrap gap-1 mt-2"> <button onclick="preencherMensagem('Quero um tênis branco')" class="bg-matrix-green/20 hover:bg-matrix-green/30 text-matrix-green text-xs px-2 py-1 rounded border border-matrix-green/30">Quero um tênis branco</button> <button onclick="preencherMensagem('Tem algum carro preto?')" class="bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs px-2 py-1 rounded border border-cyber-gold/30">Tem carro preto?</button> <button onclick="preencherMensagem('Procurando um PC gamer')" class="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-xs px-2 py-1 rounded border border-neon-blue/30">PC gamer barato</button> </div> </div> </div> </div> <script>
    // Browser API constants and global functions moved here
    window.produtosData = {};
    window.mensagens = [];

    // Preencher mensagem automaticamente
    window.preencherMensagem = function(texto) {
      document.getElementById('chat-input').value = texto;
      window.sendMessage();
    };

    window.handleKeyPress = function(event) {
      if (event.key === 'Enter') {
        window.sendMessage();
      }
    };
  <\/script> <div class="input-bar flex gap-2"> <input id="chat-input" type="text" placeholder="Pergunte qualquer coisa..." class="flex-1 bg-void-black border border-neon-blue text-white rounded p-2" onkeydown="handleKeyPress(event)"> <button onclick="sendMessage()" class="bg-cyber-gold text-black px-4 py-2 rounded">Enviar</button> <button onclick="iniciarVoz()" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">🎤 Voz</button> </div> </div>`])), maybeRenderHead());
}, "/home/lele/usenexo/getnexo-site/src/pages/demo-chat.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/demo-chat.astro";
const $$url = "/demo-chat";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DemoChat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
