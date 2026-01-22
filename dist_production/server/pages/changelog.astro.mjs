import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                    */
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro("https://getnexo.com.br");
const $$Changelog = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Changelog;
  const versions = [
    {
      version: "2.0.0",
      date: "17 Jan 2026",
      type: "major",
      changes: [
        { type: "feat", text: "Site completo com 18+ páginas profissionais" },
        { type: "feat", text: "Página de FAQ com 10 perguntas frequentes" },
        { type: "feat", text: "Página de Preços com tiers Grátis/Pro/Enterprise" },
        { type: "feat", text: "Página de Contato com múltiplos canais" },
        { type: "feat", text: "Página Sobre com história e valores" },
        { type: "feat", text: "Página de Depoimentos com cases de sucesso" },
        { type: "feat", text: "Documentação técnica completa" },
        { type: "feat", text: "SEO agressivo com JSON-LD structured data" },
        { type: "fix", text: "Correção de sintaxe JSON na página de API" },
        { type: "perf", text: "Partículas otimizadas para 8GB RAM" }
      ]
    },
    {
      version: "1.5.0",
      date: "16 Jan 2026",
      type: "minor",
      changes: [
        { type: "feat", text: "Integração completa com Evolution API 2.2.2" },
        { type: "feat", text: "Cloudflare Tunnel configurado para todos os serviços" },
        { type: "feat", text: "Painel Admin com status em tempo real" },
        { type: "fix", text: "Configuração de portas Docker corrigida" },
        { type: "docs", text: "Blog com 8 artigos sobre automação WhatsApp" }
      ]
    },
    {
      version: "1.0.0",
      date: "15 Jan 2026",
      type: "major",
      changes: [
        { type: "feat", text: "Lançamento inicial do GetNexo" },
        { type: "feat", text: "Stack completa: Evolution API + n8n + Chatwoot" },
        { type: "feat", text: "Site Astro com design futurista" },
        { type: "feat", text: "IA Ara para vendas e suporte" },
        { type: "feat", text: "Deploy automatizado via Vercel" }
      ]
    }
  ];
  const typeColors = {
    feat: { bg: "rgba(0,255,157,0.15)", color: "#00ff9d", label: "NOVO" },
    fix: { bg: "rgba(255,77,77,0.15)", color: "#ff6b6b", label: "FIX" },
    perf: { bg: "rgba(0,212,255,0.15)", color: "#00d4ff", label: "PERF" },
    docs: { bg: "rgba(255,193,7,0.15)", color: "#ffc107", label: "DOCS" }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Changelog – Histórico de Versões | GetNexo", "data-astro-cid-bd6alw26": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="changelog-hero" data-astro-cid-bd6alw26> <div class="hero-badge" data-astro-cid-bd6alw26>Build Log</div> <h1 class="text-gradient" data-astro-cid-bd6alw26>Evolução do Produto</h1> <p data-astro-cid-bd6alw26>Acompanhe cada passo da nossa jornada em democratizar a IA Conversacional no Brasil.</p> </section> <section class="changelog-content" data-astro-cid-bd6alw26> ${versions.map((v) => renderTemplate`<article${addAttribute(`version-block glass-panel ${v.type}`, "class")} data-astro-cid-bd6alw26> <div class="version-header" data-astro-cid-bd6alw26> <div class="v-main" data-astro-cid-bd6alw26> <span class="v-tag" data-astro-cid-bd6alw26>v${v.version}</span> <span${addAttribute(`v-badge ${v.type}`, "class")} data-astro-cid-bd6alw26>${v.type.toUpperCase()}</span> </div> <time data-astro-cid-bd6alw26>${v.date}</time> </div> <ul class="changes-list" data-astro-cid-bd6alw26> ${v.changes.map((change) => renderTemplate`<li class="change-item" data-astro-cid-bd6alw26> <span class="ch-type"${addAttribute(`background: ${typeColors[change.type].bg}; color: ${typeColors[change.type].color}; border: 1px solid ${typeColors[change.type].color}33`, "style")} data-astro-cid-bd6alw26> ${typeColors[change.type].label} </span> <span class="ch-text" data-astro-cid-bd6alw26>${change.text}</span> </li>`)} </ul> </article>`)} </section> <section class="changelog-footer" data-astro-cid-bd6alw26> <div class="glass-panel news-card" data-astro-cid-bd6alw26> <h3 data-astro-cid-bd6alw26>Quer ser o primeiro a saber?</h3> <p data-astro-cid-bd6alw26>Receba atualizações técnicas e comerciais direto no seu WhatsApp.</p> <a href="/blog" class="btn-primary-glow" data-astro-cid-bd6alw26>Seguir no Blog →</a> </div> </section>  ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/changelog.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/changelog.astro";
const $$url = "/changelog";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Changelog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
