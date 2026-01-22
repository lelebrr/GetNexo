import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                          */
import { renderers } from "../../renderers.mjs";
const $$Imobiliarias = createComponent(($$result, $$props, $$slots) => {
  const title = "CRM Imobiliário no WhatsApp: Captação e Agendamento Automático | GetNexo";
  const description = "Qualifique leads imobiliários instantaneamente no WhatsApp. Agendamento automático de visitas, envio de fichas de imóveis e distribuição para corretores.";
  const keywords = "crm imobiliaria whatsapp, automação imoveis whatsapp, bot corretor, agendamento visitas whatsapp, qualificação leads imobiliarios";
  const stats = [
    { value: "< 1min", label: "Resposta", desc: "Atendimento imediato ao lead" },
    { value: "24/7", label: "Plantão", desc: "Capta leads fora do horário" },
    { value: "+40%", label: "Visitas", desc: "Aumento no agendamento real" },
    { value: "Auto", label: "Distribuição", desc: "Rotação entre corretores" }
  ];
  const painPoints = [
    {
      icon: "🏠",
      title: "Lead do Portal",
      desc: "O lead clica no VivaReal/Zap e espera ser atendido. Se você demora 1h, o concorrente já ligou. O GetNexo atende em segundos."
    },
    {
      icon: "🔑",
      title: "No-Show na Visita",
      desc: "O corretor vai até o imóvel e o cliente não aparece. Nosso sistema confirma a visita 2h antes e exige confirmação, poupando tempo e combustível."
    },
    {
      icon: "🤷",
      title: "Lead Frio/Curioso",
      desc: "Pare de gastar tempo com quem não tem potencial de compra. A IA faz a pré-qualificação (Valor, Financiamento, Permuta) antes de passar pro corretor."
    }
  ];
  const features = [
    {
      title: "Envio de Fichas PDF",
      desc: "O cliente pede 'fotos do apartamento' e o bot envia o book em PDF ou link do site com galeria, instantaneamente.",
      icon: "📸"
    },
    {
      title: "Roleta de Corretores",
      desc: "Distribuição justa de leads. Round-robin (um pra cada) ou por especialidade (Aluguel vai pra equipe A, Venda pra equipe B).",
      icon: "🤝"
    },
    {
      title: "Reativação de Base",
      desc: "Tem 5.000 leads parados no CRM? O GetNexo manda mensagem pra todos: 'Ainda busca imóvel na região X? Entrou uma oportunidade!'.",
      icon: "🔊"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-esz3soit": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-esz3soit> <div class="hero-content" data-astro-cid-esz3soit> <div class="badge" data-astro-cid-esz3soit>Para Imobiliárias e Corretores</div> <h1 data-astro-cid-esz3soit>Venda mais imóveis com <span class="text-gradient" data-astro-cid-esz3soit>Atendimento Veloz</span></h1> <p class="hero-text" data-astro-cid-esz3soit>
O mercado imobiliário não perdoa lentidão. Automatize a qualificação de leads, agende visitas e garanta que seu corretor só fale com quem quer comprar.
</p> <div class="hero-btns" data-astro-cid-esz3soit> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-esz3soit>Modernizar Imobiliária</a> <a href="/demo" class="btn-outline" data-astro-cid-esz3soit>Ver Demo Corretor</a> </div> </div> <div class="hero-stats" data-astro-cid-esz3soit> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-esz3soit> <span class="stat-val" data-astro-cid-esz3soit>${s.value}</span> <span class="stat-lbl" data-astro-cid-esz3soit>${s.label}</span> <span class="stat-dsc" data-astro-cid-esz3soit>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-esz3soit> <h2 data-astro-cid-esz3soit>Agilidade é o diferencial no <span class="text-gradient" data-astro-cid-esz3soit>Mercado Imobiliário</span></h2> <p data-astro-cid-esz3soit>
Estudos mostram que <strong data-astro-cid-esz3soit>78% das vendas vão para a imobiliária que responde primeiro</strong>. 
      Em um mercado onde o mesmo imóvel está listado em 5 imobiliárias diferentes, o atendimento é a única vantagem competitiva real que você tem.
</p> <p data-astro-cid-esz3soit>
O **GetNexo** integra diretamente com seus portais e site. Quando o lead cai no CRM, o WhatsApp dele apita com uma saudação personalizada.
      Isso cria um efeito "Uau" e bloqueia a concorrência.
</p> </section> <section class="pain-section" data-astro-cid-esz3soit> <h2 data-astro-cid-esz3soit>Dores do Gestor Imobiliário</h2> <div class="pain-grid" data-astro-cid-esz3soit> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-esz3soit> <span class="pain-icon" data-astro-cid-esz3soit>${p.icon}</span> <h3 data-astro-cid-esz3soit>${p.title}</h3> <p data-astro-cid-esz3soit>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-esz3soit> <h2 data-astro-cid-esz3soit>Ferramentas do Corretor Digital</h2> <div class="feat-grid" data-astro-cid-esz3soit> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-esz3soit> <div class="feat-header" data-astro-cid-esz3soit> <span class="feat-icon" data-astro-cid-esz3soit>${f.icon}</span> <h3 data-astro-cid-esz3soit>${f.title}</h3> </div> <p data-astro-cid-esz3soit>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-esz3soit> <article data-astro-cid-esz3soit> <h3 data-astro-cid-esz3soit>Qualificação com Inteligência Artificial</h3> <p data-astro-cid-esz3soit>
Esqueça os scripts robóticos. Nossa IA conversa naturalmente para extrair informações cruciais:
<br data-astro-cid-esz3soit>
- <em data-astro-cid-esz3soit>"Qual sua faixa de preço?"</em> <br data-astro-cid-esz3soit>
- <em data-astro-cid-esz3soit>"Quantos quartos precisa?"</em> <br data-astro-cid-esz3soit>
- <em data-astro-cid-esz3soit>"Pretende financiar ou pagar à vista?"</em> <br data-astro-cid-esz3soit>
Ao final, ela classifica o lead como "Quente", "Morno" ou "Frio" e notifica o corretor ideal.
</p> <h3 data-astro-cid-esz3soit>Gestão de Equipe e Performance</h3> <p data-astro-cid-esz3soit>
Como gestor, você tem um dashboard completo (Kanban) vendo todas as conversas. 
        Saiba se o corretor está respondendo rápido, se está seguindo o script de vendas e qual a taxa de conversão de visita para venda de cada membro da equipe.
</p> </article> </section> <section class="final-cta" data-astro-cid-esz3soit> <div class="cta-box glass-panel" data-astro-cid-esz3soit> <h2 data-astro-cid-esz3soit>Transforme Leads em Chaves na Mão</h2> <p data-astro-cid-esz3soit>Não perca mais nenhuma venda por demora no atendimento.</p> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-esz3soit>Iniciar Teste Grátis</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/imobiliarias.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/imobiliarias.astro";
const $$url = "/segmentos/imobiliarias";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Imobiliarias,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
