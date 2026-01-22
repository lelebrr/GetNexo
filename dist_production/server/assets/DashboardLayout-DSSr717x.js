import { e as createAstro, f as createComponent, h as addAttribute, l as renderScript, r as renderTemplate, o as renderSlot, n as renderHead, k as renderComponent, m as maybeRenderHead } from "./astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                         */
/* empty css                         */
const $$Astro$1 = createAstro("https://getnexo.com.br");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/home/lele/usenexo/getnexo-site/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/lele/usenexo/getnexo-site/node_modules/astro/components/ClientRouter.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://getnexo.com.br");
const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { title = "GetNexo Dashboard" } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  const nonce = Astro2.locals.nonce;
  return renderTemplate(_a || (_a = __template(['<html lang="pt-BR" class="dark"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', `</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">`, '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"></noscript><script', ">\n        if ('serviceWorker' in navigator) {\n            window.addEventListener('load', () => {\n                navigator.serviceWorker.register('/sw.js').catch(() => {});\n            });\n        }\n    <\/script>", "", `</head> <body class="antialiased"> <div id="neural-bg" class="neural-canvas" style="display: none;"></div> <div class="animated-bg" id="old-bg"> <div class="blob blob-1"></div> <div class="blob blob-2"></div> </div> <script>
        (function() {
            const bgType = localStorage.getItem('getnexo-bg-type') || 'blobs';
            const neuralCanvas = document.getElementById('neural-bg');
            const oldBg = document.getElementById('old-bg');
            if (bgType === 'neural') {
                if (neuralCanvas) neuralCanvas.style.display = 'block';
                if (oldBg) oldBg.style.display = 'none';
            } else {
                if (neuralCanvas) neuralCanvas.style.display = 'none';
                if (oldBg) oldBg.style.display = 'block';
            }
        })();
    <\/script> <!-- Header --> <header style="height:var(--header-height); position:fixed; top:0; left:0; right:0; background:rgba(3, 7, 18, 0.95); border-bottom:1px solid rgba(255,255,255,0.05); z-index:50; display:flex; justify-content:space-between; align-items:center; padding:0 1.5rem; backdrop-filter:blur(10px);"> <div style="display:flex; align-items:center; gap:20px;"> <button id="toggle-sidebar" style="background:none; border:none; color:white; cursor:pointer;"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg> </button> <div style="display:flex; align-items:center; gap:10px;"> <div style="width:32px; height:32px; background:linear-gradient(135deg, var(--neon-blue), var(--neon-green)); border-radius:8px; display:flex; align-items:center; justify-content:center;"> <span style="color:black; font-weight:900;">N</span> </div> <h1 style="font-size:1.2rem; font-weight:800; color:white; letter-spacing:-0.5px;">Get<span style="color:var(--neon-green)">Nexo</span></h1> </div> </div> <div style="display:flex; align-items:center; gap:20px;"> <div style="position:relative;"> <button id="notif-trigger" class="icon-btn" style="position:relative; background:none; border:none; color:white; cursor:pointer; font-size:1.2rem; padding:5px; border-radius:8px; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='none'"> <span id="notif-dot" style="position:absolute; top:2px; right:2px; width:8px; height:8px; background:var(--neon-blue); border-radius:50%; display:none;"></span>
🔔
</button> <!-- Notification Tray --> <div id="notif-tray" class="glass-panel" style="position:absolute; top:calc(100% + 15px); right:0; width:300px; padding:15px; z-index:100; display:none; opacity:0; transform:translateY(-10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:10px;"> <h3 style="font-size:0.9rem; font-weight:800; color:white; margin:0;">Notificações</h3> <span style="font-size:0.7rem; color:var(--neon-blue); cursor:pointer;">Limpar tudo</span> </div> <div id="notif-list" style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:10px;"> <div style="padding:10px; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);"> <div style="font-size:0.8rem; font-weight:700; color:white;">Bem-vindo ao GetNexo!</div> <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">Sua conta Pro Plan está ativa e pronta para uso.</div> <div style="font-size:0.6rem; color:#475569; margin-top:5px;">Há 2 minutos</div> </div> </div> </div> </div> <div style="position:relative; border-left:1px solid rgba(255,255,255,0.1); padding-left:20px;"> <div id="user-menu-trigger" style="display:flex; align-items:center; gap:10px; cursor:pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'"> <div style="text-align:right;"> <div style="font-size:0.85rem; font-weight:700; color:white;">Admin</div> <div style="font-size:0.7rem; color:#64748b;">Pro Plan</div> </div> <img src="https://ui-avatars.com/api/?name=Admin&background=00d4ff&color=000" style="width:36px; height:36px; border-radius:50%; border:2px solid rgba(255,255,255,0.1);" alt="Profile"> </div> <!-- Account Dropdown --> <div id="account-dropdown" class="glass-panel" style="position:absolute; top:calc(100% + 15px); right:0; width:220px; padding:10px; z-index:100; display:none; opacity:0; transform:translateY(-10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"> <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05); margin-bottom:5px;"> <div style="font-size:0.9rem; font-weight:700; color:white;">Admin Account</div> <div style="font-size:0.75rem; color:#94a3b8;">admin@getnexo.com.br</div> </div> <a href="/dashboard/perfil" class="dropdown-item"> <span>👤</span> Meu Perfil
</a> <a href="/dashboard/configuracoes" class="dropdown-item"> <span>⚙️</span> Configurações
</a> <a href="/dashboard/faturamento" class="dropdown-item"> <span>💳</span> Faturamento
</a> <div style="height:1px; background:rgba(255,255,255,0.05); margin:5px 0;"></div> <button id="logout-btn" class="dropdown-item" style="width:100%; color:#f87171; text-align:left; border:none; background:none; cursor:pointer; font-family:inherit;"> <span>🚪</span> Sair da Conta
</button> </div> </div> </div> </header>  <script>
        document.addEventListener('DOMContentLoaded', () => {
            // User Menu Toggle
            const userTrigger = document.getElementById('user-menu-trigger');
            const userDropdown = document.getElementById('account-dropdown');
            
            // Notification Toggle
            const notifTrigger = document.getElementById('notif-trigger');
            const notifTray = document.getElementById('notif-tray');

            // Logout Business
            const logoutBtn = document.getElementById('logout-btn');

            if (userTrigger && userDropdown) {
                userTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    notifTray?.classList.remove('show-dropdown');
                    userDropdown.classList.toggle('show-dropdown');
                });
            }

            if (notifTrigger && notifTray) {
                notifTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userDropdown?.classList.remove('show-dropdown');
                    notifTray.classList.toggle('show-dropdown');
                    // Hide dot when opened
                    document.getElementById('notif-dot').style.display = 'none';
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Logging out...');
                    // Clear storage/cookies if needed
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.href = '/login';
                });
            }

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (userDropdown && !userDropdown.contains(e.target) && !userTrigger.contains(e.target)) {
                    userDropdown.classList.remove('show-dropdown');
                }
                if (notifTray && !notifTray.contains(e.target) && !notifTrigger.contains(e.target)) {
                    notifTray.classList.remove('show-dropdown');
                }
            });

            // Simulate a notification after 5s
            setTimeout(() => {
                const dot = document.getElementById('notif-dot');
                if (dot) dot.style.display = 'block';
            }, 5000);
        });
    <\/script> <!-- Sidebar & Content --> <div style="display:flex; margin-top:var(--header-height); min-height:calc(100vh - var(--header-height));"> <aside id="sidebar" class="sidebar-expanded" style="background:#020617; border-right:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; padding:1.5rem 1rem; position:fixed; top:var(--header-height); bottom:0; overflow-y:auto; z-index:40;"> <nav style="display:flex; flex-direction:column; gap:4px;"> <div class="nav-header" style="font-size:0.7rem; font-weight:700; color:#475569; text-transform:uppercase; margin-bottom:8px; padding-left:12px;">Principal</div> <a href="/dashboard"`, '> <span>📊</span> <span class="nav-text">Dashboard</span> </a> <a href="/dashboard/instancias"', '> <span>📱</span> <span class="nav-text">Instâncias</span> </a> <a href="/dashboard/chat"', '> <span>💬</span> <span class="nav-text">Chat Ao Vivo</span> </a> <div class="nav-header" style="font-size:0.7rem; font-weight:700; color:#475569; text-transform:uppercase; margin:16px 0 8px; padding-left:12px;">Ferramentas</div> <a href="/dashboard/flows"', '> <span>⚡</span> <span class="nav-text">Fluxos & IA</span> </a> <a href="/dashboard/loja"', '> <span>🏪</span> <span class="nav-text">Loja & Catálogo</span> </a> <a href="/dashboard/integracoes"', '> <span>🔌</span> <span class="nav-text">Integrações</span> </a> <a href="/dashboard/equipe"', '> <span>👥</span> <span class="nav-text">Equipe</span> </a> <div class="nav-header" style="font-size:0.7rem; font-weight:700; color:#475569; text-transform:uppercase; margin:16px 0 8px; padding-left:12px;">Financeiro</div> <a href="/dashboard/faturamento"', '> <span>💳</span> <span class="nav-text">Faturamento</span> </a> <a href="/dashboard/suporte"', '> <span>🆘</span> <span class="nav-text">Suporte & Logs</span> </a> </nav> <div style="margin-top:auto; padding-top:20px;"> <div class="glass-panel" style="padding:15px; text-align:center;"> <div style="font-size:0.75rem; color:#94a3b8;">Plano Atual</div> <div style="font-weight:800; color:var(--neon-green);">PROFESSIONAL</div> <button style="margin-top:10px; width:100%; font-size:0.75rem; background:rgba(255,255,255,0.1); border:none; padding:6px; color:white; border-radius:6px; cursor:pointer;">Upgrade</button> </div> </div> </aside> <main id="main-content" style="flex:1; padding:2rem; margin-left:260px; transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1); min-width:0;"> ', ' <footer style="margin-top:4rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.05); text-align:center; color:#64748b; font-size:0.85rem;"> <p>GetNexo v2.0 • Feito com ❤️ no Brasil</p> </footer> </main> </div> <!-- Sidebar Logic with Nanostores --> <script', ">\n        import { isSidebarExpanded, toggleSidebar, notificationCount } from '../stores/dashboardStore';\n\n        const sidebar = document.getElementById('sidebar');\n        const main = document.getElementById('main-content');\n        const toggle = document.getElementById('toggle-sidebar');\n        const texts = document.querySelectorAll('.nav-text');\n        const headers = document.querySelectorAll('.nav-header');\n\n        // Reactive Subscription (Islands Architecture)\n        isSidebarExpanded.subscribe(expanded => {\n            if (expanded) {\n                sidebar.classList.remove('sidebar-collapsed');\n                sidebar.classList.add('sidebar-expanded');\n                main.style.marginLeft = '260px';\n                texts.forEach(t => t.style.display = 'inline');\n                headers.forEach(h => h.style.display = 'block');\n            } else {\n                sidebar.classList.remove('sidebar-expanded');\n                sidebar.classList.add('sidebar-collapsed');\n                main.style.marginLeft = '80px';\n                texts.forEach(t => t.style.display = 'none');\n                headers.forEach(h => h.style.display = 'none');\n            }\n        });\n\n        // Event Listeners\n        toggle.onclick = () => toggleSidebar();\n\n        // Notification Badge Sync\n        const badge = document.querySelector('.icon-btn span');\n        if(badge) {\n            notificationCount.subscribe(count => {\n                badge.style.display = count > 0 ? 'block' : 'none';\n                badge.innerText = count > 9 ? '9+' : count;\n            });\n        }\n    <\/script> </body> </html>"])), title, maybeRenderHead(), addAttribute(nonce, "nonce"), renderComponent($$result, "ViewTransitions", $$ClientRouter, {}), renderHead(), addAttribute(`nav-item ${currentPath === "/dashboard" ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/instancias") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/chat") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/flows") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/loja") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/integracoes") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/equipe") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/faturamento") ? "active" : ""}`, "class"), addAttribute(`nav-item ${currentPath.includes("/suporte") ? "active" : ""}`, "class"), renderSlot($$result, $$slots["default"]), addAttribute(nonce, "nonce"));
}, "/home/lele/usenexo/getnexo-site/src/layouts/DashboardLayout.astro", void 0);
export {
  $$DashboardLayout as $
};
