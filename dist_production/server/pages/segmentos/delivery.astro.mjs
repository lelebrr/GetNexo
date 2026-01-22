import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
const $$Delivery = createComponent(($$result, $$props, $$slots) => {
  const title = "Delivery Automatizado no WhatsApp: Cardápio e Pedidos com IA | GetNexo";
  const description = "Automatize seu Delivery no WhatsApp. Cardápio digital, pedidos com IA, pagamento PIX automático e envio para cozinha/motoqueiro sem intervenção humana.";
  const keywords = "delivery whatsapp, cardapio digital whatsapp, bot para pizzaria, bot para hamburgueria, automação ifood, pedidos whatsapp";
  const stats = [
    { value: "0%", label: "Erros", desc: "Fim dos erros de anotação" },
    { value: "30s", label: "Pedido", desc: "Tempo médio de compra" },
    { value: "+25%", label: "Ticket", desc: "Com upselling automático" },
    { value: "PIX", label: "Auto", desc: "Confirmação instantânea" }
  ];
  const painPoints = [
    {
      icon: "🍔",
      title: "Sexta-feira à noite",
      desc: "O telefone toca, o WhatsApp apita e você tem que anotar pedidos correndo. O GetNexo atende 100 clientes ao mesmo tempo com calma e precisão."
    },
    {
      icon: "🛵",
      title: "Endereco Errado",
      desc: "Motoqueiro se perdeu porque anotaram a rua errada? O sistema pede a localização do WhatsApp (GPS), garantindo entrega precisa."
    },
    {
      icon: "😫",
      title: "Cliente Indeciso",
      desc: "O cliente pergunta 'quais os sabores?'. O bot envia o cardápio lindo em PDF ou Web, e só processa o pedido quando o cliente decide."
    }
  ];
  const features = [
    {
      title: "Cardápio Digital Nativo",
      desc: "O cliente escolhe os itens direto na conversa com botões e listas. Adicionais (Borda Recheada, Sem Cebola) são solicitados passo-a-passo.",
      icon: "📜"
    },
    {
      title: "Upselling Inteligente",
      desc: "O cliente pediu um lanche? A IA oferece: 'Vai uma Coca gelada por +R$5?' ou 'Que tal uma batata grande?'. Aumente seu ticket médio no piloto automático.",
      icon: "🍟"
    },
    {
      title: "Impressão na Cozinha",
      desc: "O pedido chega formatado (comanda) pronto para imprimir na sua térmica na cozinha. Sem re-digitação.",
      icon: "🖨️"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-3l63psel": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-3l63psel> <div class="hero-content" data-astro-cid-3l63psel> <div class="badge" data-astro-cid-3l63psel>Para Delivery e Restaurantes</div> <h1 data-astro-cid-3l63psel>Seu Delivery no <span class="text-gradient" data-astro-cid-3l63psel>Piloto Automático</span></h1> <p class="hero-text" data-astro-cid-3l63psel>
Atenda centenas de pedidos simultâneos no WhatsApp sem erros. Cardápio digital, pagamentos PIX e impressão automática na cozinha.
</p> <div class="hero-btns" data-astro-cid-3l63psel> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-3l63psel>Digitalizar Meu Delivery</a> <a href="/demo" class="btn-outline" data-astro-cid-3l63psel>Ver Pedido ao Vivo</a> </div> </div> <div class="hero-stats" data-astro-cid-3l63psel> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-3l63psel> <span class="stat-val" data-astro-cid-3l63psel>${s.value}</span> <span class="stat-lbl" data-astro-cid-3l63psel>${s.label}</span> <span class="stat-dsc" data-astro-cid-3l63psel>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-3l63psel> <h2 data-astro-cid-3l63psel>Livre-se das taxas abusivas dos <span class="text-gradient" data-astro-cid-3l63psel>Marketplaces</span></h2> <p data-astro-cid-3l63psel>
Apps de entrega cobram até 30% de comissão. No WhatsApp, o cliente é SEU e a taxa é ZERO. 
      Use o GetNexo para migrar seus clientes fiéis para o canal direto, oferecendo descontos exclusivos com a margem que você economiza.
</p> <p data-astro-cid-3l63psel>
Além de economizar, você constrói uma base de dados (CRM) para enviar promoções em dias fracos:
<em data-astro-cid-3l63psel>"Terça-feira da Pizza Dobrada! Peça pelo nosso Zap."</em> - e lote sua cozinha quando quiser.
</p> </section> <section class="pain-section" data-astro-cid-3l63psel> <h2 data-astro-cid-3l63psel>O Caos da Cozinha</h2> <div class="pain-grid" data-astro-cid-3l63psel> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-3l63psel> <span class="pain-icon" data-astro-cid-3l63psel>${p.icon}</span> <h3 data-astro-cid-3l63psel>${p.title}</h3> <p data-astro-cid-3l63psel>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-3l63psel> <h2 data-astro-cid-3l63psel>Ingredientes do Sucesso</h2> <div class="feat-grid" data-astro-cid-3l63psel> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-3l63psel> <div class="feat-header" data-astro-cid-3l63psel> <span class="feat-icon" data-astro-cid-3l63psel>${f.icon}</span> <h3 data-astro-cid-3l63psel>${f.title}</h3> </div> <p data-astro-cid-3l63psel>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-3l63psel> <article data-astro-cid-3l63psel> <h3 data-astro-cid-3l63psel>Gestão de Motoboys e Roteirização</h3> <p data-astro-cid-3l63psel>
Quando o pedido fica pronto, o sistema pode notificar automaticamente o entregador responsável com o link do Google Maps do cliente.
        Você também pode avisar o cliente: <em data-astro-cid-3l63psel>"Seu lanche saiu para entrega! Acompanhe o motoqueiro aqui."</em> </p> <h3 data-astro-cid-3l63psel>Fidelidade Digital</h3> <p data-astro-cid-3l63psel>
Esqueça o cartãozinho de papel que o cliente perde. O GetNexo gerencia pontos automaticamente.
<em data-astro-cid-3l63psel>"Parabéns! Você completou 10 pedidos. O próximo lanche é por nossa conta!"</em>
O cliente ama e volta sempre.
</p> </article> </section> <section class="final-cta" data-astro-cid-3l63psel> <div class="cta-box glass-panel" data-astro-cid-3l63psel> <h2 data-astro-cid-3l63psel>Venda Mais, Trabalhe Menos</h2> <p data-astro-cid-3l63psel>Deixe o robô atender enquanto você foca na qualidade da comida.</p> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-3l63psel>Testar Agora</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/delivery.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/delivery.astro";
const $$url = "/segmentos/delivery";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Delivery,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
