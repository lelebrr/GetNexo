import { e as createAstro, f as createComponent, h as addAttribute, n as renderHead, o as renderSlot, l as renderScript, r as renderTemplate } from "./astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                           */
const $$Astro = createAstro("https://getnexo.com.br");
const $$ResellerLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ResellerLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="pt-BR" data-astro-cid-43htlsps> <head><meta charset="UTF-8"><meta name="description" content="Dashboard do Revendedor GetNexo - Gerencie seus clientes e maximize seus lucros"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"><!-- Styles -->${renderHead()}</head> <body data-astro-cid-43htlsps> <!-- Navigation --> <nav class="reseller-nav" data-astro-cid-43htlsps> <div class="nav-brand" data-astro-cid-43htlsps> <button class="mobile-menu-btn" onclick="toggleSidebar()" data-astro-cid-43htlsps>☰</button> <img src="/assets/scarcity_engine.js" alt="GetNexo" style="display: none;" data-astro-cid-43htlsps> <span data-astro-cid-43htlsps>🏪 GetNexo Revendas</span> </div> <div class="nav-links" data-astro-cid-43htlsps> <a href="/revenda/dash" class="nav-link active" data-astro-cid-43htlsps>Dashboard</a> <a href="/revenda/clientes" class="nav-link" data-astro-cid-43htlsps>Clientes</a> <a href="/revenda/comissoes" class="nav-link" data-astro-cid-43htlsps>Comissões</a> <a href="/revenda/marketing" class="nav-link" data-astro-cid-43htlsps>Marketing</a> </div> <div class="user-menu" data-astro-cid-43htlsps> <div style="position: relative;" data-astro-cid-43htlsps> <span class="notification-badge" data-astro-cid-43htlsps>3</span> <span style="font-size: 1.2rem; cursor: pointer;" data-astro-cid-43htlsps>🔔</span> </div> <img src="https://ui-avatars.com/api/?name=Revendedor&background=00ff9d&color=000" alt="Avatar" class="user-avatar" onclick="toggleUserMenu()" data-astro-cid-43htlsps> <div id="user-dropdown" class="user-dropdown" data-astro-cid-43htlsps> <div class="dropdown-item" onclick="logout()" data-astro-cid-43htlsps> <span data-astro-cid-43htlsps>🚪</span> Sair
</div> </div> </div> </nav> <!-- Sidebar --> <aside class="reseller-sidebar" id="sidebar" data-astro-cid-43htlsps> <!-- Overview --> <div class="sidebar-section" data-astro-cid-43htlsps> <div class="sidebar-title" data-astro-cid-43htlsps>Visão Geral</div> <a href="/revenda/dash" class="sidebar-link active" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>📊</span>
Dashboard
</a> <a href="/revenda/analytics" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>📈</span>
Analytics
</a> <a href="/revenda/relatorios" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>📋</span>
Relatórios
</a> </div> <!-- Client Management --> <div class="sidebar-section" data-astro-cid-43htlsps> <div class="sidebar-title" data-astro-cid-43htlsps>Clientes</div> <a href="/revenda/clientes" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>👥</span>
Todos os Clientes
</a> <a href="/revenda/clientes/novo" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>➕</span>
Novo Cliente
</a> <a href="/revenda/clientes/ativos" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>✅</span>
Clientes Ativos
</a> <a href="/revenda/clientes/inativos" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>⏸️</span>
Inativos
</a> </div> <!-- Commissions --> <div class="sidebar-section" data-astro-cid-43htlsps> <div class="sidebar-title" data-astro-cid-43htlsps>Financeiro</div> <a href="/revenda/comissoes" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>💰</span>
Comissões
</a> <a href="/revenda/pagamentos" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>💳</span>
Pagamentos
</a> <a href="/revenda/extratos" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>📄</span>
Extratos
</a> </div> <!-- Marketing Tools --> <div class="sidebar-section" data-astro-cid-43htlsps> <div class="sidebar-title" data-astro-cid-43htlsps>Marketing</div> <a href="/revenda/marketing/links" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>🔗</span>
Links de Indicação
</a> <a href="/revenda/marketing/materiais" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>🎨</span>
Materiais
</a> <a href="/revenda/marketing/landing" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>📄</span>
Landing Pages
</a> </div> <!-- Support --> <div class="sidebar-section" data-astro-cid-43htlsps> <div class="sidebar-title" data-astro-cid-43htlsps>Suporte</div> <a href="/revenda/suporte" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>🆘</span>
Central de Ajuda
</a> <a href="/revenda/contato" class="sidebar-link" data-astro-cid-43htlsps> <span class="sidebar-icon" data-astro-cid-43htlsps>📞</span>
Contato
</a> </div> </aside> <!-- Main Content --> <main class="main-content" data-astro-cid-43htlsps> ${renderSlot($$result, $$slots["default"])} </main> <!-- Scripts --> ${renderScript($$result, "/home/lele/usenexo/getnexo-site/src/layouts/ResellerLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/lele/usenexo/getnexo-site/src/layouts/ResellerLayout.astro", void 0);
export {
  $$ResellerLayout as $
};
