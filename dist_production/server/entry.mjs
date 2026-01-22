import { renderers } from "./renderers.mjs";
import { c as createExports, s as serverEntrypointModule } from "./assets/_@astrojs-ssr-adapter-L0bBi7K7.js";
import { manifest } from "./manifest_gBUv_74n.mjs";
const serverIslandMap = /* @__PURE__ */ new Map();
;
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/404.astro.mjs");
const _page2 = () => import("./pages/acessibilidade.astro.mjs");
const _page3 = () => import("./pages/admin/ai-routing.astro.mjs");
const _page4 = () => import("./pages/admin/analytics-config.astro.mjs");
const _page5 = () => import("./pages/admin/auditoria.astro.mjs");
const _page6 = () => import("./pages/admin/auth.astro.mjs");
const _page7 = () => import("./pages/admin/behavioral-tagging.astro.mjs");
const _page8 = () => import("./pages/admin/blog/edit.astro.mjs");
const _page9 = () => import("./pages/admin/blog.astro.mjs");
const _page10 = () => import("./pages/admin/central.astro.mjs");
const _page11 = () => import("./pages/admin/config-ia.astro.mjs");
const _page12 = () => import("./pages/admin/cupons.astro.mjs");
const _page13 = () => import("./pages/admin/customer-portal.astro.mjs");
const _page14 = () => import("./pages/admin/design-system.astro.mjs");
const _page15 = () => import("./pages/admin/docker.astro.mjs");
const _page16 = () => import("./pages/admin/domains.astro.mjs");
const _page17 = () => import("./pages/admin/features.astro.mjs");
const _page18 = () => import("./pages/admin/feriados.astro.mjs");
const _page19 = () => import("./pages/admin/game-analytics.astro.mjs");
const _page20 = () => import("./pages/admin/gamification.astro.mjs");
const _page21 = () => import("./pages/admin/login.astro.mjs");
const _page22 = () => import("./pages/admin/magic-replies.astro.mjs");
const _page23 = () => import("./pages/admin/master-control.astro.mjs");
const _page24 = () => import("./pages/admin/media.astro.mjs");
const _page25 = () => import("./pages/admin/minigames.astro.mjs");
const _page26 = () => import("./pages/admin/ml-ai.astro.mjs");
const _page27 = () => import("./pages/admin/payment-gateways.astro.mjs");
const _page28 = () => import("./pages/admin/produtos.astro.mjs");
const _page29 = () => import("./pages/admin/relatorio.astro.mjs");
const _page30 = () => import("./pages/admin/roles.astro.mjs");
const _page31 = () => import("./pages/admin/sales-templates.astro.mjs");
const _page32 = () => import("./pages/admin/seguranca.astro.mjs");
const _page33 = () => import("./pages/admin/sentinel.astro.mjs");
const _page34 = () => import("./pages/admin/sentinel-dashboard.astro.mjs");
const _page35 = () => import("./pages/admin/settings.astro.mjs");
const _page36 = () => import("./pages/admin/tonalidade/_dominio_.astro.mjs");
const _page37 = () => import("./pages/admin/tracking-config.astro.mjs");
const _page38 = () => import("./pages/admin/usuarios.astro.mjs");
const _page39 = () => import("./pages/admin.astro.mjs");
const _page40 = () => import("./pages/analise-sentimento.astro.mjs");
const _page41 = () => import("./pages/api/admin/save-feriados-config.astro.mjs");
const _page42 = () => import("./pages/api/analytics.astro.mjs");
const _page43 = () => import("./pages/api/auth/github/callback.astro.mjs");
const _page44 = () => import("./pages/api/auth/github.astro.mjs");
const _page45 = () => import("./pages/api/auth/google/callback.astro.mjs");
const _page46 = () => import("./pages/api/auth/google.astro.mjs");
const _page47 = () => import("./pages/api/auth/magic-link.astro.mjs");
const _page48 = () => import("./pages/api/auth/me.astro.mjs");
const _page49 = () => import("./pages/api/auth/qr-link.astro.mjs");
const _page50 = () => import("./pages/api/auth/register.astro.mjs");
const _page51 = () => import("./pages/api/auth/whatsapp-link.astro.mjs");
const _page52 = () => import("./pages/api/backup.astro.mjs");
const _page53 = () => import("./pages/api/chatbot.astro.mjs");
const _page54 = () => import("./pages/api/cliente/timeline.astro.mjs");
const _page55 = () => import("./pages/api/comments.astro.mjs");
const _page56 = () => import("./pages/api/config.astro.mjs");
const _page57 = () => import("./pages/api/export.astro.mjs");
const _page58 = () => import("./pages/api/gamification.astro.mjs");
const _page59 = () => import("./pages/api/graphql.astro.mjs");
const _page60 = () => import("./pages/api/login.astro.mjs");
const _page61 = () => import("./pages/api/metrics.astro.mjs");
const _page62 = () => import("./pages/api/ml.astro.mjs");
const _page63 = () => import("./pages/api/orders.astro.mjs");
const _page64 = () => import("./pages/api/payments.astro.mjs");
const _page65 = () => import("./pages/api/products.astro.mjs");
const _page66 = () => import("./pages/api/profile.astro.mjs");
const _page67 = () => import("./pages/api/recommendations.astro.mjs");
const _page68 = () => import("./pages/api/sentinel-status.astro.mjs");
const _page69 = () => import("./pages/api/stream/dashboard.astro.mjs");
const _page70 = () => import("./pages/api/upload.astro.mjs");
const _page71 = () => import("./pages/api/users.astro.mjs");
const _page72 = () => import("./pages/api/webauthn/authenticate.astro.mjs");
const _page73 = () => import("./pages/api/webauthn/register.astro.mjs");
const _page74 = () => import("./pages/api/webhooks/zapier.astro.mjs");
const _page75 = () => import("./pages/api/webhooks.astro.mjs");
const _page76 = () => import("./pages/api.astro.mjs");
const _page77 = () => import("./pages/ara.astro.mjs");
const _page78 = () => import("./pages/ara-playground.astro.mjs");
const _page79 = () => import("./pages/assistente-vendas.astro.mjs");
const _page80 = () => import("./pages/blog/ads-whatsapp.astro.mjs");
const _page81 = () => import("./pages/blog/analise-sentimento-retencao.astro.mjs");
const _page82 = () => import("./pages/blog/assinaturas-recorrencia-ecommerce.astro.mjs");
const _page83 = () => import("./pages/blog/audio-commerce-busca-voz.astro.mjs");
const _page84 = () => import("./pages/blog/automacao-agendamento-liberais.astro.mjs");
const _page85 = () => import("./pages/blog/black-friday-2026-automacao.astro.mjs");
const _page86 = () => import("./pages/blog/campanhas.astro.mjs");
const _page87 = () => import("./pages/blog/carrinho-abandonado.astro.mjs");
const _page88 = () => import("./pages/blog/casos-sucesso.astro.mjs");
const _page89 = () => import("./pages/blog/chatbot-infoprodutores-escala.astro.mjs");
const _page90 = () => import("./pages/blog/comparacao-blog.astro.mjs");
const _page91 = () => import("./pages/blog/comparativo-getnexo-blip-zenvia.astro.mjs");
const _page92 = () => import("./pages/blog/criando-agentes-vendas-virtuais.astro.mjs");
const _page93 = () => import("./pages/blog/crm-futuro-gpt4.astro.mjs");
const _page94 = () => import("./pages/blog/crm-whatsapp-combo-escala.astro.mjs");
const _page95 = () => import("./pages/blog/custo-api.astro.mjs");
const _page96 = () => import("./pages/blog/custo-atendimento-humano-vs-ia.astro.mjs");
const _page97 = () => import("./pages/blog/dark-mode-conversao.astro.mjs");
const _page98 = () => import("./pages/blog/dashboard-analytics-enterprise.astro.mjs");
const _page99 = () => import("./pages/blog/dobrar-roi-whatsapp-marketing.astro.mjs");
const _page100 = () => import("./pages/blog/estrategias-meta-ads-whatsapp.astro.mjs");
const _page101 = () => import("./pages/blog/faq-completo.astro.mjs");
const _page102 = () => import("./pages/blog/futuro-ecommerce.astro.mjs");
const _page103 = () => import("./pages/blog/gamificacao-vendas-estrategias.astro.mjs");
const _page104 = () => import("./pages/blog/google-ads-whatsapp.astro.mjs");
const _page105 = () => import("./pages/blog/guia-api-oficial-whatsapp-devs.astro.mjs");
const _page106 = () => import("./pages/blog/guia-ia-atendimento-2026.astro.mjs");
const _page107 = () => import("./pages/blog/ia-generativa-atendimento-futuro.astro.mjs");
const _page108 = () => import("./pages/blog/ia-vendeu-8k.astro.mjs");
const _page109 = () => import("./pages/blog/instalacao-video.astro.mjs");
const _page110 = () => import("./pages/blog/integrar-chatgpt-whatsapp.astro.mjs");
const _page111 = () => import("./pages/blog/lancamento.astro.mjs");
const _page112 = () => import("./pages/blog/lead-scoring-ia-qualificacao.astro.mjs");
const _page113 = () => import("./pages/blog/metricas-analytics.astro.mjs");
const _page114 = () => import("./pages/blog/multiplos-numeros.astro.mjs");
const _page115 = () => import("./pages/blog/n8n.astro.mjs");
const _page116 = () => import("./pages/blog/omnichannel-pdv-whatsapp.astro.mjs");
const _page117 = () => import("./pages/blog/otimizacao-atendimento-ia-2026.astro.mjs");
const _page118 = () => import("./pages/blog/pos-venda-proativo-ia.astro.mjs");
const _page119 = () => import("./pages/blog/privacidade-2026.astro.mjs");
const _page120 = () => import("./pages/blog/programa-fidelidade-4-0.astro.mjs");
const _page121 = () => import("./pages/blog/programa-revenda.astro.mjs");
const _page122 = () => import("./pages/blog/recuperacao-carrinho-whatsapp.astro.mjs");
const _page123 = () => import("./pages/blog/recuperar-carrinho.astro.mjs");
const _page124 = () => import("./pages/blog/reduzindo-cpl-qualificacao-ia.astro.mjs");
const _page125 = () => import("./pages/blog/saas-growth-whatsapp-api.astro.mjs");
const _page126 = () => import("./pages/blog/scripts-vendas-whatsapp-gatilhos.astro.mjs");
const _page127 = () => import("./pages/blog/seguranca-lgpd-whatsapp-2026.astro.mjs");
const _page128 = () => import("./pages/blog/seguranca-lgpd-whatsapp-business.astro.mjs");
const _page129 = () => import("./pages/blog/suporte-rapido.astro.mjs");
const _page130 = () => import("./pages/blog/tickets-inteligentes-evolucao.astro.mjs");
const _page131 = () => import("./pages/blog/tunnel.astro.mjs");
const _page132 = () => import("./pages/blog/upsell.astro.mjs");
const _page133 = () => import("./pages/blog/vendas-high-ticket-whatsapp.astro.mjs");
const _page134 = () => import("./pages/blog/vendas-preditivas-ia.astro.mjs");
const _page135 = () => import("./pages/blog/whatsapp-api-vs-web-2026.astro.mjs");
const _page136 = () => import("./pages/blog/whatsapp-automacao-escala.astro.mjs");
const _page137 = () => import("./pages/blog/whatsapp-automação-imobiliaria.astro.mjs");
const _page138 = () => import("./pages/blog/whatsapp-automatizado-guia.astro.mjs");
const _page139 = () => import("./pages/blog/whatsapp-clinicas-saude-lgpd.astro.mjs");
const _page140 = () => import("./pages/blog/whatsapp-flows-automatizados.astro.mjs");
const _page141 = () => import("./pages/blog/wsl.astro.mjs");
const _page142 = () => import("./pages/blog/_slug_.amp.astro.mjs");
const _page143 = () => import("./pages/blog.astro.mjs");
const _page144 = () => import("./pages/buscar.astro.mjs");
const _page145 = () => import("./pages/certificacoes.astro.mjs");
const _page146 = () => import("./pages/changelog.astro.mjs");
const _page147 = () => import("./pages/chat-ia.astro.mjs");
const _page148 = () => import("./pages/chat-ia-24h.astro.mjs");
const _page149 = () => import("./pages/chat-ia-new.astro.mjs");
const _page150 = () => import("./pages/cliente/analytics.astro.mjs");
const _page151 = () => import("./pages/cliente/atendentes/novo.astro.mjs");
const _page152 = () => import("./pages/cliente/atendentes.astro.mjs");
const _page153 = () => import("./pages/cliente/chamados.astro.mjs");
const _page154 = () => import("./pages/cliente/chat.astro.mjs");
const _page155 = () => import("./pages/cliente/configuracoes.astro.mjs");
const _page156 = () => import("./pages/cliente/fidelidade.astro.mjs");
const _page157 = () => import("./pages/cliente/hub.astro.mjs");
const _page158 = () => import("./pages/cliente/login.astro.mjs");
const _page159 = () => import("./pages/como-funciona.astro.mjs");
const _page160 = () => import("./pages/comparacao.astro.mjs");
const _page161 = () => import("./pages/comparativo/_competitor_.astro.mjs");
const _page162 = () => import("./pages/comparativo.astro.mjs");
const _page163 = () => import("./pages/contato.astro.mjs");
const _page164 = () => import("./pages/criar-bot.astro.mjs");
const _page165 = () => import("./pages/dashboard/analytics.astro.mjs");
const _page166 = () => import("./pages/dashboard/atividade.astro.mjs");
const _page167 = () => import("./pages/dashboard/campanhas.astro.mjs");
const _page168 = () => import("./pages/dashboard/campanhas-builder.astro.mjs");
const _page169 = () => import("./pages/dashboard/chat.astro.mjs");
const _page170 = () => import("./pages/dashboard/config.astro.mjs");
const _page171 = () => import("./pages/dashboard/configuracao-bot.astro.mjs");
const _page172 = () => import("./pages/dashboard/configuracoes.astro.mjs");
const _page173 = () => import("./pages/dashboard/ecommerce.astro.mjs");
const _page174 = () => import("./pages/dashboard/equipe.astro.mjs");
const _page175 = () => import("./pages/dashboard/faturamento.astro.mjs");
const _page176 = () => import("./pages/dashboard/faturas.astro.mjs");
const _page177 = () => import("./pages/dashboard/flows.astro.mjs");
const _page178 = () => import("./pages/dashboard/instancias.astro.mjs");
const _page179 = () => import("./pages/dashboard/integracoes.astro.mjs");
const _page180 = () => import("./pages/dashboard/kanban.astro.mjs");
const _page181 = () => import("./pages/dashboard/leads.astro.mjs");
const _page182 = () => import("./pages/dashboard/loja.astro.mjs");
const _page183 = () => import("./pages/dashboard/pedidos.astro.mjs");
const _page184 = () => import("./pages/dashboard/perfil.astro.mjs");
const _page185 = () => import("./pages/dashboard/projetos/novo.astro.mjs");
const _page186 = () => import("./pages/dashboard/projetos/templates.astro.mjs");
const _page187 = () => import("./pages/dashboard/projetos.astro.mjs");
const _page188 = () => import("./pages/dashboard/relatorios.astro.mjs");
const _page189 = () => import("./pages/dashboard/revenda.astro.mjs");
const _page190 = () => import("./pages/dashboard/roles.astro.mjs");
const _page191 = () => import("./pages/dashboard/servicos/historico.astro.mjs");
const _page192 = () => import("./pages/dashboard/servicos/loja.astro.mjs");
const _page193 = () => import("./pages/dashboard/servicos.astro.mjs");
const _page194 = () => import("./pages/dashboard/simulacao.astro.mjs");
const _page195 = () => import("./pages/dashboard/suporte/contato.astro.mjs");
const _page196 = () => import("./pages/dashboard/suporte/tickets.astro.mjs");
const _page197 = () => import("./pages/dashboard/suporte.astro.mjs");
const _page198 = () => import("./pages/dashboard.astro.mjs");
const _page199 = () => import("./pages/demo.astro.mjs");
const _page200 = () => import("./pages/demo-chat.astro.mjs");
const _page201 = () => import("./pages/demo-ia.astro.mjs");
const _page202 = () => import("./pages/depoimentos.astro.mjs");
const _page203 = () => import("./pages/design-system-demo.astro.mjs");
const _page204 = () => import("./pages/documentacao.astro.mjs");
const _page205 = () => import("./pages/documentacao-simple.astro.mjs");
const _page206 = () => import("./pages/en.astro.mjs");
const _page207 = () => import("./pages/es.astro.mjs");
const _page208 = () => import("./pages/faq.astro.mjs");
const _page209 = () => import("./pages/ferramentas/calculadora-roi.astro.mjs");
const _page210 = () => import("./pages/ferramentas/gerador-link-whatsapp.astro.mjs");
const _page211 = () => import("./pages/forge.astro.mjs");
const _page212 = () => import("./pages/fr.astro.mjs");
const _page213 = () => import("./pages/games/_gametype_.astro.mjs");
const _page214 = () => import("./pages/gamificacao-vendas.astro.mjs");
const _page215 = () => import("./pages/glossario/_term_.astro.mjs");
const _page216 = () => import("./pages/glossario.astro.mjs");
const _page217 = () => import("./pages/integracoes/_slug_.astro.mjs");
const _page218 = () => import("./pages/integracoes.astro.mjs");
const _page219 = () => import("./pages/login.astro.mjs");
const _page220 = () => import("./pages/loja.astro.mjs");
const _page221 = () => import("./pages/magic-replies.astro.mjs");
const _page222 = () => import("./pages/magic-replies-gpt4.astro.mjs");
const _page223 = () => import("./pages/melhorias.astro.mjs");
const _page224 = () => import("./pages/meu-painel/dominios.astro.mjs");
const _page225 = () => import("./pages/meu-painel/faturar.astro.mjs");
const _page226 = () => import("./pages/meu-painel.astro.mjs");
const _page227 = () => import("./pages/oferta.astro.mjs");
const _page228 = () => import("./pages/precos.astro.mjs");
const _page229 = () => import("./pages/precos-revenda.astro.mjs");
const _page230 = () => import("./pages/privacidade.astro.mjs");
const _page231 = () => import("./pages/produtos/automacao.astro.mjs");
const _page232 = () => import("./pages/produtos/crm.astro.mjs");
const _page233 = () => import("./pages/produtos/marketing.astro.mjs");
const _page234 = () => import("./pages/produtos/vendas.astro.mjs");
const _page235 = () => import("./pages/produtos.astro.mjs");
const _page236 = () => import("./pages/programa-pontos.astro.mjs");
const _page237 = () => import("./pages/recursos.astro.mjs");
const _page238 = () => import("./pages/revenda/clientes.astro.mjs");
const _page239 = () => import("./pages/revenda/codigos.astro.mjs");
const _page240 = () => import("./pages/revenda/dash.astro.mjs");
const _page241 = () => import("./pages/revenda/equipe.astro.mjs");
const _page242 = () => import("./pages/revenda/gerar.astro.mjs");
const _page243 = () => import("./pages/revenda/material.astro.mjs");
const _page244 = () => import("./pages/revenda.astro.mjs");
const _page245 = () => import("./pages/robots.txt.astro.mjs");
const _page246 = () => import("./pages/rss.xml.astro.mjs");
const _page247 = () => import("./pages/segmentos/agencia-web.astro.mjs");
const _page248 = () => import("./pages/segmentos/clinicas.astro.mjs");
const _page249 = () => import("./pages/segmentos/consultoria.astro.mjs");
const _page250 = () => import("./pages/segmentos/delivery.astro.mjs");
const _page251 = () => import("./pages/segmentos/e-commerce.astro.mjs");
const _page252 = () => import("./pages/segmentos/educacao.astro.mjs");
const _page253 = () => import("./pages/segmentos/imobiliarias.astro.mjs");
const _page254 = () => import("./pages/segmentos/outros.astro.mjs");
const _page255 = () => import("./pages/sistema-tickets.astro.mjs");
const _page256 = () => import("./pages/sitemap-en.xml.astro.mjs");
const _page257 = () => import("./pages/sitemap-es.xml.astro.mjs");
const _page258 = () => import("./pages/sitemap-fr.xml.astro.mjs");
const _page259 = () => import("./pages/sitemap-pt.xml.astro.mjs");
const _page260 = () => import("./pages/sitemap.xml.astro.mjs");
const _page261 = () => import("./pages/sobre.astro.mjs");
const _page262 = () => import("./pages/suporte.astro.mjs");
const _page263 = () => import("./pages/termos.astro.mjs");
const _page264 = () => import("./pages/test.astro.mjs");
const _page265 = () => import("./pages/test-build.astro.mjs");
const _page266 = () => import("./pages/sitemap-_lang_.xml.astro.mjs");
const _page267 = () => import("./pages/_lang_/blog.astro.mjs");
const _page268 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
  ["src/pages/404.astro", _page1],
  ["src/pages/acessibilidade.astro", _page2],
  ["src/pages/admin/ai-routing.astro", _page3],
  ["src/pages/admin/analytics-config.astro", _page4],
  ["src/pages/admin/auditoria.astro", _page5],
  ["src/pages/admin/auth.js", _page6],
  ["src/pages/admin/behavioral-tagging.astro", _page7],
  ["src/pages/admin/blog/edit.astro", _page8],
  ["src/pages/admin/blog.astro", _page9],
  ["src/pages/admin/central.astro", _page10],
  ["src/pages/admin/config-ia.astro", _page11],
  ["src/pages/admin/cupons.astro", _page12],
  ["src/pages/admin/customer-portal.astro", _page13],
  ["src/pages/admin/design-system.astro", _page14],
  ["src/pages/admin/docker.astro", _page15],
  ["src/pages/admin/domains.astro", _page16],
  ["src/pages/admin/features.astro", _page17],
  ["src/pages/admin/feriados.astro", _page18],
  ["src/pages/admin/game-analytics.astro", _page19],
  ["src/pages/admin/gamification.astro", _page20],
  ["src/pages/admin/login.astro", _page21],
  ["src/pages/admin/magic-replies.astro", _page22],
  ["src/pages/admin/master-control.astro", _page23],
  ["src/pages/admin/media.astro", _page24],
  ["src/pages/admin/minigames.astro", _page25],
  ["src/pages/admin/ml-ai.astro", _page26],
  ["src/pages/admin/payment-gateways.astro", _page27],
  ["src/pages/admin/produtos.astro", _page28],
  ["src/pages/admin/relatorio.astro", _page29],
  ["src/pages/admin/roles.astro", _page30],
  ["src/pages/admin/sales-templates.astro", _page31],
  ["src/pages/admin/seguranca.astro", _page32],
  ["src/pages/admin/sentinel.astro", _page33],
  ["src/pages/admin/sentinel-dashboard.astro", _page34],
  ["src/pages/admin/settings.astro", _page35],
  ["src/pages/admin/tonalidade/[dominio].astro", _page36],
  ["src/pages/admin/tracking-config.astro", _page37],
  ["src/pages/admin/usuarios.astro", _page38],
  ["src/pages/admin/index.astro", _page39],
  ["src/pages/analise-sentimento.astro", _page40],
  ["src/pages/api/admin/save-feriados-config.js", _page41],
  ["src/pages/api/analytics.ts", _page42],
  ["src/pages/api/auth/github/callback.js", _page43],
  ["src/pages/api/auth/github.js", _page44],
  ["src/pages/api/auth/google/callback.js", _page45],
  ["src/pages/api/auth/google.js", _page46],
  ["src/pages/api/auth/magic-link.ts", _page47],
  ["src/pages/api/auth/me.js", _page48],
  ["src/pages/api/auth/qr-link.ts", _page49],
  ["src/pages/api/auth/register.ts", _page50],
  ["src/pages/api/auth/whatsapp-link.ts", _page51],
  ["src/pages/api/backup.js", _page52],
  ["src/pages/api/chatbot.js", _page53],
  ["src/pages/api/cliente/timeline.ts", _page54],
  ["src/pages/api/comments.js", _page55],
  ["src/pages/api/config.js", _page56],
  ["src/pages/api/export.ts", _page57],
  ["src/pages/api/gamification.ts", _page58],
  ["src/pages/api/graphql.ts", _page59],
  ["src/pages/api/login.ts", _page60],
  ["src/pages/api/metrics.ts", _page61],
  ["src/pages/api/ml.js", _page62],
  ["src/pages/api/orders.ts", _page63],
  ["src/pages/api/payments.ts", _page64],
  ["src/pages/api/products.ts", _page65],
  ["src/pages/api/profile.js", _page66],
  ["src/pages/api/recommendations.ts", _page67],
  ["src/pages/api/sentinel-status.js", _page68],
  ["src/pages/api/stream/dashboard.ts", _page69],
  ["src/pages/api/upload.ts", _page70],
  ["src/pages/api/users.ts", _page71],
  ["src/pages/api/webauthn/authenticate.js", _page72],
  ["src/pages/api/webauthn/register.js", _page73],
  ["src/pages/api/webhooks/zapier.ts", _page74],
  ["src/pages/api/webhooks.ts", _page75],
  ["src/pages/api.astro", _page76],
  ["src/pages/ara.astro", _page77],
  ["src/pages/ara-playground.astro", _page78],
  ["src/pages/assistente-vendas.astro", _page79],
  ["src/pages/blog/ads-whatsapp.astro", _page80],
  ["src/pages/blog/analise-sentimento-retencao.astro", _page81],
  ["src/pages/blog/assinaturas-recorrencia-ecommerce.astro", _page82],
  ["src/pages/blog/audio-commerce-busca-voz.astro", _page83],
  ["src/pages/blog/automacao-agendamento-liberais.astro", _page84],
  ["src/pages/blog/black-friday-2026-automacao.astro", _page85],
  ["src/pages/blog/campanhas.astro", _page86],
  ["src/pages/blog/carrinho-abandonado.astro", _page87],
  ["src/pages/blog/casos-sucesso.astro", _page88],
  ["src/pages/blog/chatbot-infoprodutores-escala.astro", _page89],
  ["src/pages/blog/comparacao-blog.astro", _page90],
  ["src/pages/blog/comparativo-getnexo-blip-zenvia.astro", _page91],
  ["src/pages/blog/criando-agentes-vendas-virtuais.astro", _page92],
  ["src/pages/blog/crm-futuro-gpt4.astro", _page93],
  ["src/pages/blog/crm-whatsapp-combo-escala.astro", _page94],
  ["src/pages/blog/custo-api.astro", _page95],
  ["src/pages/blog/custo-atendimento-humano-vs-ia.astro", _page96],
  ["src/pages/blog/dark-mode-conversao.astro", _page97],
  ["src/pages/blog/dashboard-analytics-enterprise.astro", _page98],
  ["src/pages/blog/dobrar-roi-whatsapp-marketing.astro", _page99],
  ["src/pages/blog/estrategias-meta-ads-whatsapp.astro", _page100],
  ["src/pages/blog/faq-completo.astro", _page101],
  ["src/pages/blog/futuro-ecommerce.astro", _page102],
  ["src/pages/blog/gamificacao-vendas-estrategias.astro", _page103],
  ["src/pages/blog/google-ads-whatsapp.astro", _page104],
  ["src/pages/blog/guia-api-oficial-whatsapp-devs.astro", _page105],
  ["src/pages/blog/guia-ia-atendimento-2026.astro", _page106],
  ["src/pages/blog/ia-generativa-atendimento-futuro.astro", _page107],
  ["src/pages/blog/ia-vendeu-8k.astro", _page108],
  ["src/pages/blog/instalacao-video.astro", _page109],
  ["src/pages/blog/integrar-chatgpt-whatsapp.astro", _page110],
  ["src/pages/blog/lancamento.astro", _page111],
  ["src/pages/blog/lead-scoring-ia-qualificacao.astro", _page112],
  ["src/pages/blog/metricas-analytics.astro", _page113],
  ["src/pages/blog/multiplos-numeros.astro", _page114],
  ["src/pages/blog/n8n.astro", _page115],
  ["src/pages/blog/omnichannel-pdv-whatsapp.astro", _page116],
  ["src/pages/blog/otimizacao-atendimento-ia-2026.astro", _page117],
  ["src/pages/blog/pos-venda-proativo-ia.astro", _page118],
  ["src/pages/blog/privacidade-2026.astro", _page119],
  ["src/pages/blog/programa-fidelidade-4-0.astro", _page120],
  ["src/pages/blog/programa-revenda.astro", _page121],
  ["src/pages/blog/recuperacao-carrinho-whatsapp.astro", _page122],
  ["src/pages/blog/recuperar-carrinho.astro", _page123],
  ["src/pages/blog/reduzindo-cpl-qualificacao-ia.astro", _page124],
  ["src/pages/blog/saas-growth-whatsapp-api.astro", _page125],
  ["src/pages/blog/scripts-vendas-whatsapp-gatilhos.astro", _page126],
  ["src/pages/blog/seguranca-lgpd-whatsapp-2026.astro", _page127],
  ["src/pages/blog/seguranca-lgpd-whatsapp-business.astro", _page128],
  ["src/pages/blog/suporte-rapido.astro", _page129],
  ["src/pages/blog/tickets-inteligentes-evolucao.astro", _page130],
  ["src/pages/blog/tunnel.astro", _page131],
  ["src/pages/blog/upsell.astro", _page132],
  ["src/pages/blog/vendas-high-ticket-whatsapp.astro", _page133],
  ["src/pages/blog/vendas-preditivas-ia.astro", _page134],
  ["src/pages/blog/whatsapp-api-vs-web-2026.astro", _page135],
  ["src/pages/blog/whatsapp-automacao-escala.astro", _page136],
  ["src/pages/blog/whatsapp-automação-imobiliaria.astro", _page137],
  ["src/pages/blog/whatsapp-automatizado-guia.astro", _page138],
  ["src/pages/blog/whatsapp-clinicas-saude-lgpd.astro", _page139],
  ["src/pages/blog/whatsapp-flows-automatizados.astro", _page140],
  ["src/pages/blog/wsl.astro", _page141],
  ["src/pages/blog/[slug].amp.astro", _page142],
  ["src/pages/blog/index.astro", _page143],
  ["src/pages/buscar.astro", _page144],
  ["src/pages/certificacoes.astro", _page145],
  ["src/pages/changelog.astro", _page146],
  ["src/pages/chat-ia.astro", _page147],
  ["src/pages/chat-ia-24h.astro", _page148],
  ["src/pages/chat-ia-new.astro", _page149],
  ["src/pages/cliente/analytics.astro", _page150],
  ["src/pages/cliente/atendentes/novo.astro", _page151],
  ["src/pages/cliente/atendentes.astro", _page152],
  ["src/pages/cliente/chamados.astro", _page153],
  ["src/pages/cliente/chat.astro", _page154],
  ["src/pages/cliente/configuracoes.astro", _page155],
  ["src/pages/cliente/fidelidade.astro", _page156],
  ["src/pages/cliente/hub.astro", _page157],
  ["src/pages/cliente/login.astro", _page158],
  ["src/pages/como-funciona.astro", _page159],
  ["src/pages/comparacao.astro", _page160],
  ["src/pages/comparativo/[competitor].astro", _page161],
  ["src/pages/comparativo.astro", _page162],
  ["src/pages/contato.astro", _page163],
  ["src/pages/criar-bot.astro", _page164],
  ["src/pages/dashboard/analytics/index.astro", _page165],
  ["src/pages/dashboard/atividade.astro", _page166],
  ["src/pages/dashboard/campanhas.astro", _page167],
  ["src/pages/dashboard/campanhas-builder.astro", _page168],
  ["src/pages/dashboard/chat.astro", _page169],
  ["src/pages/dashboard/config.astro", _page170],
  ["src/pages/dashboard/configuracao-bot.astro", _page171],
  ["src/pages/dashboard/configuracoes.astro", _page172],
  ["src/pages/dashboard/ecommerce.astro", _page173],
  ["src/pages/dashboard/equipe.astro", _page174],
  ["src/pages/dashboard/faturamento.astro", _page175],
  ["src/pages/dashboard/faturas.astro", _page176],
  ["src/pages/dashboard/flows.astro", _page177],
  ["src/pages/dashboard/instancias.astro", _page178],
  ["src/pages/dashboard/integracoes.astro", _page179],
  ["src/pages/dashboard/kanban.astro", _page180],
  ["src/pages/dashboard/leads.astro", _page181],
  ["src/pages/dashboard/loja.astro", _page182],
  ["src/pages/dashboard/pedidos.astro", _page183],
  ["src/pages/dashboard/perfil.astro", _page184],
  ["src/pages/dashboard/projetos/novo/index.astro", _page185],
  ["src/pages/dashboard/projetos/templates/index.astro", _page186],
  ["src/pages/dashboard/projetos/index.astro", _page187],
  ["src/pages/dashboard/relatorios.astro", _page188],
  ["src/pages/dashboard/revenda.astro", _page189],
  ["src/pages/dashboard/roles.astro", _page190],
  ["src/pages/dashboard/servicos/historico/index.astro", _page191],
  ["src/pages/dashboard/servicos/loja/index.astro", _page192],
  ["src/pages/dashboard/servicos/index.astro", _page193],
  ["src/pages/dashboard/simulacao.astro", _page194],
  ["src/pages/dashboard/suporte/contato/index.astro", _page195],
  ["src/pages/dashboard/suporte/tickets/index.astro", _page196],
  ["src/pages/dashboard/suporte.astro", _page197],
  ["src/pages/dashboard/index.astro", _page198],
  ["src/pages/demo.astro", _page199],
  ["src/pages/demo-chat.astro", _page200],
  ["src/pages/demo-ia.astro", _page201],
  ["src/pages/depoimentos.astro", _page202],
  ["src/pages/design-system-demo.astro", _page203],
  ["src/pages/documentacao.astro", _page204],
  ["src/pages/documentacao-simple.astro", _page205],
  ["src/pages/en/index.astro", _page206],
  ["src/pages/es/index.astro", _page207],
  ["src/pages/faq.astro", _page208],
  ["src/pages/ferramentas/calculadora-roi.astro", _page209],
  ["src/pages/ferramentas/gerador-link-whatsapp.astro", _page210],
  ["src/pages/forge.astro", _page211],
  ["src/pages/fr/index.astro", _page212],
  ["src/pages/games/[gameType].astro", _page213],
  ["src/pages/gamificacao-vendas.astro", _page214],
  ["src/pages/glossario/[term].astro", _page215],
  ["src/pages/glossario.astro", _page216],
  ["src/pages/integracoes/[slug].astro", _page217],
  ["src/pages/integracoes.astro", _page218],
  ["src/pages/login.astro", _page219],
  ["src/pages/loja.astro", _page220],
  ["src/pages/magic-replies.astro", _page221],
  ["src/pages/magic-replies-gpt4.astro", _page222],
  ["src/pages/melhorias.astro", _page223],
  ["src/pages/meu-painel/dominios.astro", _page224],
  ["src/pages/meu-painel/faturar.astro", _page225],
  ["src/pages/meu-painel/index.astro", _page226],
  ["src/pages/oferta.astro", _page227],
  ["src/pages/precos.astro", _page228],
  ["src/pages/precos-revenda.astro", _page229],
  ["src/pages/privacidade.astro", _page230],
  ["src/pages/produtos/automacao.astro", _page231],
  ["src/pages/produtos/crm.astro", _page232],
  ["src/pages/produtos/marketing.astro", _page233],
  ["src/pages/produtos/vendas.astro", _page234],
  ["src/pages/produtos/index.astro", _page235],
  ["src/pages/programa-pontos.astro", _page236],
  ["src/pages/recursos.astro", _page237],
  ["src/pages/revenda/clientes.astro", _page238],
  ["src/pages/revenda/codigos.astro", _page239],
  ["src/pages/revenda/dash.astro", _page240],
  ["src/pages/revenda/equipe.astro", _page241],
  ["src/pages/revenda/gerar.astro", _page242],
  ["src/pages/revenda/material.astro", _page243],
  ["src/pages/revenda.astro", _page244],
  ["src/pages/robots.txt.ts", _page245],
  ["src/pages/rss.xml.js", _page246],
  ["src/pages/segmentos/agencia-web.astro", _page247],
  ["src/pages/segmentos/clinicas.astro", _page248],
  ["src/pages/segmentos/consultoria.astro", _page249],
  ["src/pages/segmentos/delivery.astro", _page250],
  ["src/pages/segmentos/e-commerce.astro", _page251],
  ["src/pages/segmentos/educacao.astro", _page252],
  ["src/pages/segmentos/imobiliarias.astro", _page253],
  ["src/pages/segmentos/outros.astro", _page254],
  ["src/pages/sistema-tickets.astro", _page255],
  ["src/pages/sitemap-en.xml.ts", _page256],
  ["src/pages/sitemap-es.xml.ts", _page257],
  ["src/pages/sitemap-fr.xml.ts", _page258],
  ["src/pages/sitemap-pt.xml.ts", _page259],
  ["src/pages/sitemap.xml.ts", _page260],
  ["src/pages/sobre.astro", _page261],
  ["src/pages/suporte.astro", _page262],
  ["src/pages/termos.astro", _page263],
  ["src/pages/test.astro", _page264],
  ["src/pages/test-build.astro", _page265],
  ["src/pages/sitemap-[lang].xml.ts", _page266],
  ["src/pages/[lang]/blog/index.astro", _page267],
  ["src/pages/index.astro", _page268]
]);
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: () => import("./noop-entrypoint.mjs"),
  middleware: () => import("./_astro-internal_middleware.mjs")
});
const _args = {
  "mode": "standalone",
  "server": "file:///home/lele/usenexo/getnexo-site/dist/server/",
  "client": "file:///home/lele/usenexo/getnexo-site/dist/client/",
  "host": false,
  "port": 4321,
  "assets": "_astro",
  "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports["handler"];
const startServer = _exports["startServer"];
const options = _exports["options"];
const _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  handler,
  options,
  pageMap,
  startServer
};
