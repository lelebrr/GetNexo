import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
const $$Educacao = createComponent(($$result, $$props, $$slots) => {
  const title = "Atendimento WhatsApp para Escolas e Cursos | GetNexo";
  const description = "Automatize matrículas e secretaria escolar no WhatsApp. Tire dúvidas de alunos, envie boletos de mensalidade e comunicados importantes em massa.";
  const keywords = "crm educacional whatsapp, automação escola whatsapp, bot secretaria escolar, retenção alunos whatsapp, cobrança mensalidade whatsapp";
  const stats = [
    { value: "+30%", label: "Matrículas", desc: "Conversão na captação de alunos" },
    { value: "-40%", label: "Inadimplência", desc: "Com cobrança automática" },
    { value: "S.A.C.", label: "Automático", desc: "Secretaria disponível 24h" },
    { value: "Massa", label: "Avisos", desc: "Comunicados para todos pais/alunos" }
  ];
  const painPoints = [
    {
      icon: "🎓",
      title: "Pico de Matrículas",
      desc: "No início do ano, sua equipe enlouquece. O GetNexo escala infinitamente, atendendo 1.000 pais simultaneamente sem fila de espera."
    },
    {
      icon: "💸",
      title: "Mensalidade Atrasada",
      desc: "Cobrar é chato. Deixe o robô fazer isso. Ele envia o lembrete amigável e depois a cobrança um dia após o vencimento com o PIX atualizado."
    },
    {
      icon: "📣",
      title: "Comunicados que Ninguém Lê",
      desc: "O bilhete na agenda ou e-mail se perde. O WhatsApp é lido por todas as famílias. Garanta que avisos de provas e reuniões sejam vistos."
    }
  ];
  const features = [
    {
      title: "Portal do Aluno no Chat",
      desc: "O aluno digita 'notas' e recebe o boletim. Digita 'financeiro' e recebe o boleto. Sem precisar logar em sistemas lentos.",
      icon: "🏫"
    },
    {
      title: "Nutrição de Leads",
      desc: "Para escolas de cursos/idiomas: O lead baixou a ementa? O bot envia dicas gratuitas por 3 dias antes de ofertar a matrícula.",
      icon: "🌱"
    },
    {
      title: "Suporte Pedagógico",
      desc: "Use a IA treinada com seu material didático para tirar dúvidas simples dos alunos sobre datas de entrega ou conteúdo programático.",
      icon: "📚"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-vrxfrqvj": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-vrxfrqvj> <div class="hero-content" data-astro-cid-vrxfrqvj> <div class="badge" data-astro-cid-vrxfrqvj>Para Escolas, Faculdades e Cursos</div> <h1 data-astro-cid-vrxfrqvj>Engaje alunos e otimize sua <span class="text-gradient" data-astro-cid-vrxfrqvj>Gestão Escolar</span></h1> <p class="hero-text" data-astro-cid-vrxfrqvj>
Da captação de novos alunos à retenção e cobrança. Centralize toda a comunicação da sua instituição de ensino no WhatsApp.
</p> <div class="hero-btns" data-astro-cid-vrxfrqvj> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-vrxfrqvj>Falar com Especialista</a> <a href="/demo" class="btn-outline" data-astro-cid-vrxfrqvj>Ver Secretaria Digital</a> </div> </div> <div class="hero-stats" data-astro-cid-vrxfrqvj> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-vrxfrqvj> <span class="stat-val" data-astro-cid-vrxfrqvj>${s.value}</span> <span class="stat-lbl" data-astro-cid-vrxfrqvj>${s.label}</span> <span class="stat-dsc" data-astro-cid-vrxfrqvj>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-vrxfrqvj> <h2 data-astro-cid-vrxfrqvj>A Secretaria do Futuro é no <span class="text-gradient" data-astro-cid-vrxfrqvj>WhatsApp</span></h2> <p data-astro-cid-vrxfrqvj>
A nova geração de alunos e pais exige comunicação instantânea. Eles não querem ligar, mandar e-mail ou ir presencialmente na secretaria para pedir um boleto.
      Eles querem resolver tudo na palma da mão.
</p> <p data-astro-cid-vrxfrqvj>
O **GetNexo Educação** conecta-se ao seu sistema de gestão acadêmica e transforma o WhatsApp em um hub de serviços. 
      Isso libera sua equipe pedagógica para focar no que importa: a educação.
</p> </section> <section class="pain-section" data-astro-cid-vrxfrqvj> <h2 data-astro-cid-vrxfrqvj>Desafios da Gestão Educacional</h2> <div class="pain-grid" data-astro-cid-vrxfrqvj> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-vrxfrqvj> <span class="pain-icon" data-astro-cid-vrxfrqvj>${p.icon}</span> <h3 data-astro-cid-vrxfrqvj>${p.title}</h3> <p data-astro-cid-vrxfrqvj>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-vrxfrqvj> <h2 data-astro-cid-vrxfrqvj>Recursos Acadêmicos</h2> <div class="feat-grid" data-astro-cid-vrxfrqvj> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-vrxfrqvj> <div class="feat-header" data-astro-cid-vrxfrqvj> <span class="feat-icon" data-astro-cid-vrxfrqvj>${f.icon}</span> <h3 data-astro-cid-vrxfrqvj>${f.title}</h3> </div> <p data-astro-cid-vrxfrqvj>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-vrxfrqvj> <article data-astro-cid-vrxfrqvj> <h3 data-astro-cid-vrxfrqvj>Venda de Cursos Online e Infoprodutos</h3> <p data-astro-cid-vrxfrqvj>
Para lançadores e donos de cursos online, o GetNexo é uma máquina de vendas. 
        Recupere checkouts da Hotmart/Eduzz/Kiwify, faça onboarding automático de novos alunos (boas-vindas + link de acesso) e crie grupos de suporte onde a IA modera e responde dúvidas.
</p> <h3 data-astro-cid-vrxfrqvj>Redução da Inadimplência com IA</h3> <p data-astro-cid-vrxfrqvj>
Nossa "IA Cobradora" é educada mas firme. Ela negocia datas, oferece parcelamentos pré-aprovados e envia o código PIX.
        Resultados reais mostram recuperação de até 40% das mensalidades atrasadas no primeiro mês de uso, sem desgaste humano.
</p> </article> </section> <section class="final-cta" data-astro-cid-vrxfrqvj> <div class="cta-box glass-panel" data-astro-cid-vrxfrqvj> <h2 data-astro-cid-vrxfrqvj>Escale sua Instituição</h2> <p data-astro-cid-vrxfrqvj>Menos burocracia, mais educação. Transforme sua comunicação hoje.</p> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-vrxfrqvj>Começar Agora</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/educacao.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/educacao.astro";
const $$url = "/segmentos/educacao";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Educacao,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
