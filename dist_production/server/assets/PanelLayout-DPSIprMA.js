import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, o as renderSlot, n as renderHead } from "./astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                           */
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://getnexo.com.br");
const $$PanelLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PanelLayout;
  const { title } = Astro2.props;
  const nonce = Astro2.locals.nonce;
  return renderTemplate(_a || (_a = __template(['<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', ' | GetNexo</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">', '</head> <body> <aside class="sidebar"> <div class="logo-area">Get<span>Nexo</span></div> <nav class="nav-links"> <a href="/meu-painel" class="nav-link">📊 Dashboard</a> <a href="/meu-painel/dominios" class="nav-link">🌐 Domínios</a> <a href="/meu-painel/plugin" class="nav-link">🧩 Meu Plugin</a> <a href="/meu-painel/teste" class="nav-link">⚡ Teste Ativo</a> <div style="flex:1"></div> <a href="/meu-painel/faturar" class="nav-link" style="color: #f59e0b;">⭐ Assinar Pro</a> <a href="/meu-painel/config" class="nav-link">⚙️ Ajustes</a> </nav> </aside> <div class="main-content"> <header class="top-header"> <div class="timer-badge">⏳ Faltam 3d 12h 05m para o fim do teste</div> <div class="user-menu"> <button class="btn-logout" onclick="logout()">Sair</button> <div class="avatar">U</div> <span style="font-size: 0.9rem;">Olá, Usuário</span> </div> </header> <div class="content-area"> ', " </div> </div> <script", ">\n    // Just simple active state based on URL\n    const currentPath = window.location.pathname;\n    document.querySelectorAll('.nav-link').forEach(link => {\n        if (link.getAttribute('href') === currentPath) {\n            link.classList.add('active');\n        }\n    });\n\n    function logout() {\n        if(confirm('Sair do painel?')) {\n            localStorage.removeItem('token');\n            window.location.href = '/login';\n        }\n    }\n\n    // Auth Guard\n    if (!localStorage.getItem('token')) {\n        window.location.href = '/login';\n    }\n<\/script> </body> </html>"])), title, renderHead(), renderSlot($$result, $$slots["default"]), addAttribute(nonce, "nonce"));
}, "/home/lele/usenexo/getnexo-site/src/layouts/PanelLayout.astro", void 0);
export {
  $$PanelLayout as $
};
