import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                             */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$CalculadoraRoi = createComponent(($$result, $$props, $$slots) => {
  const title = "Calculadora de ROI Automação WhatsApp | Simule seu Lucro - GetNexo";
  const description = "Descubra quanto dinheiro sua empresa está deixando na mesa. Calcule o ROI da automação de vendas no WhatsApp e a economia com a API Oficial GetNexo.";
  const keywords = "calculadora roi whatsapp, roi automacao vendas, calculo lucro whatsapp, economia api whatsapp, simulador vendas ia";
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // DOM Elements
  const inputs = {
    leads: document.getElementById('leads'),
    ticket: document.getElementById('ticket'),
    conversion: document.getElementById('conversion'),
    cost: document.getElementById('cost')
  };

  const outputs = {
    currentRevenue: document.getElementById('current-revenue'),
    projectedRevenue: document.getElementById('projected-revenue'),
    gainHours: document.getElementById('gain-hours'),
    gainRecovery: document.getElementById('gain-recovery'),
    gainSavings: document.getElementById('gain-savings'),
    annualProfit: document.getElementById('annual-profit')
  };

  const calcBtn = document.getElementById('calc-btn');

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  function calculate() {
    // Get values
    const leads = parseInt(inputs.leads.value) || 0;
    const ticket = parseFloat(inputs.ticket.value) || 0;
    const conversion = parseFloat(inputs.conversion.value) || 0; 
    const currentCost = parseFloat(inputs.cost.value) || 0;

    // Current State
    // Conversion rate is percentage (e.g. 5)
    // Sales = Leads * (Conversion/100)
    // Revenue = Sales * Ticket
    const currentSales = leads * (conversion / 100);
    const currentRevenue = currentSales * ticket;

    // Projected State with GetNexo
    // 1. Availability Gain (24/7): +20% conversion typically
    // 2. Response Speed Gain (Instant): +15% conversion
    // Total Conservative Conversion Lift: +35% relative to current base
    const optimizedConversion = conversion * 1.35; 
    const projectedRevenueBase = (leads * (optimizedConversion / 100)) * ticket;

    // 3. Recovery Gain
    // Assume 30% of NON-converted leads are actually "abandoned carts/interests"
    // And we recover 15% of those
    const nonConverted = leads - currentSales;
    const recoveredSales = nonConverted * 0.30 * 0.15; 
    const recoveryRevenue = recoveredSales * ticket;

    // 4. Operational Savings (GetNexo costs R$97 vs R$2500 team/tools)
    // If cost < 97, savings is negative (investment), but usually cost is high
    const newCost = 97; 
    const savings = Math.max(0, currentCost - newCost);

    const totalProjectedRevenue = projectedRevenueBase + recoveryRevenue;
    const monthlyGain = (totalProjectedRevenue - currentRevenue) + savings;
    const annualGain = monthlyGain * 12;

    // Update UI
    outputs.currentRevenue.innerText = formatCurrency(currentRevenue);
    outputs.projectedRevenue.innerText = formatCurrency(totalProjectedRevenue);
    
    outputs.gainHours.innerText = "+ " + formatCurrency(projectedRevenueBase - currentRevenue);
    outputs.gainRecovery.innerText = "+ " + formatCurrency(recoveryRevenue);
    outputs.gainSavings.innerText = "+ " + formatCurrency(savings);
    outputs.annualProfit.innerText = formatCurrency(annualGain);
  }

  // Event Listeners
  calcBtn.addEventListener('click', calculate);
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', calculate);
  });

  // Initial Run
  calculate();
<\/script> `])), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-cgk6ul2e": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="tool-hero relative overflow-hidden" data-astro-cid-cgk6ul2e> <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-black z-[-1]" data-astro-cid-cgk6ul2e></div> <div class="container mx-auto px-6 max-w-4xl text-center pt-20 pb-10" data-astro-cid-cgk6ul2e> <div class="hero-badge" data-astro-cid-cgk6ul2e>Simulador Financeiro</div> <h1 class="text-gradient mb-6" data-astro-cid-cgk6ul2e>Calculadora de ROI WhatsApp</h1> <p class="text-slate-400 text-xl max-w-2xl mx-auto" data-astro-cid-cgk6ul2e>
Veja o impacto financeiro real de atender 24/7 e recuperar carrinhos automaticamente.
</p> </div> </section> <section class="tool-interface pb-20" data-astro-cid-cgk6ul2e> <div class="container mx-auto px-6 max-w-6xl" data-astro-cid-cgk6ul2e> <div class="grid lg:grid-cols-3 gap-8" data-astro-cid-cgk6ul2e> <!-- Inputs Panel --> <div class="glass-panel p-8 lg:col-span-1 h-fit sticky top-24" data-astro-cid-cgk6ul2e> <h3 class="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4" data-astro-cid-cgk6ul2e>📊 Seus Dados Atuais</h3> <div class="space-y-5" data-astro-cid-cgk6ul2e> <div class="input-group" data-astro-cid-cgk6ul2e> <label data-astro-cid-cgk6ul2e>Leads/Atendimentos por Mês</label> <div class="input-wrapper" data-astro-cid-cgk6ul2e> <input type="number" id="leads" value="1000" class="glass-input" data-astro-cid-cgk6ul2e> <span class="suffix" data-astro-cid-cgk6ul2e>leads</span> </div> </div> <div class="input-group" data-astro-cid-cgk6ul2e> <label data-astro-cid-cgk6ul2e>Ticket Médio (R$)</label> <div class="input-wrapper" data-astro-cid-cgk6ul2e> <span class="prefix" data-astro-cid-cgk6ul2e>R$</span> <input type="number" id="ticket" value="150" class="glass-input" data-astro-cid-cgk6ul2e> </div> </div> <div class="input-group" data-astro-cid-cgk6ul2e> <label data-astro-cid-cgk6ul2e>Taxa de Conversão Atual (%)</label> <div class="input-wrapper" data-astro-cid-cgk6ul2e> <input type="number" id="conversion" value="5" class="glass-input" data-astro-cid-cgk6ul2e> <span class="suffix" data-astro-cid-cgk6ul2e>%</span> </div> </div> <div class="input-group" data-astro-cid-cgk6ul2e> <label data-astro-cid-cgk6ul2e>Custo Equipe/Ferramentas (Mensal)</label> <div class="input-wrapper" data-astro-cid-cgk6ul2e> <span class="prefix" data-astro-cid-cgk6ul2e>R$</span> <input type="number" id="cost" value="2500" class="glass-input" data-astro-cid-cgk6ul2e> </div> </div> <button id="calc-btn" class="btn-primary-glow w-full mt-4" data-astro-cid-cgk6ul2e>Simular Resultado 🚀</button> </div> </div> <!-- Results Panel --> <div class="lg:col-span-2 space-y-6" data-astro-cid-cgk6ul2e> <!-- Summary Cards --> <div class="grid md:grid-cols-2 gap-4" data-astro-cid-cgk6ul2e> <div class="glass-panel p-6 border-l-4 border-slate-500 bg-slate-900/50" data-astro-cid-cgk6ul2e> <span class="text-slate-400 text-sm font-bold uppercase" data-astro-cid-cgk6ul2e>Cenário Atual</span> <div class="flex items-end gap-2 mt-2" data-astro-cid-cgk6ul2e> <span class="text-3xl font-bold text-white" id="current-revenue" data-astro-cid-cgk6ul2e>R$ 7.500</span> <span class="text-sm text-slate-400 mb-1" data-astro-cid-cgk6ul2e>/mês</span> </div> <p class="text-xs text-slate-500 mt-2" data-astro-cid-cgk6ul2e>Faturamento estimado hoje</p> </div> <div class="glass-panel p-6 border-l-4 border-[#00ff9d] bg-[#00ff9d]/5 relative overflow-hidden" data-astro-cid-cgk6ul2e> <div class="absolute top-0 right-0 p-2 bg-[#00ff9d] text-black text-xs font-bold rounded-bl-xl" data-astro-cid-cgk6ul2e>COM GETNEXO</div> <span class="text-[#00ff9d] text-sm font-bold uppercase" data-astro-cid-cgk6ul2e>Cenário Potencial</span> <div class="flex items-end gap-2 mt-2" data-astro-cid-cgk6ul2e> <span class="text-4xl font-black text-white" id="projected-revenue" data-astro-cid-cgk6ul2e>R$ 18.750</span> <span class="text-sm text-slate-400 mb-1" data-astro-cid-cgk6ul2e>/mês</span> </div> <p class="text-xs text-[#00ff9d] mt-2" data-astro-cid-cgk6ul2e>+150% de aumento estimado</p> </div> </div> <!-- Detailed Breakdown --> <div class="glass-panel p-8" data-astro-cid-cgk6ul2e> <h3 class="text-2xl font-bold text-white mb-6" data-astro-cid-cgk6ul2e>Onde está o dinheiro? 💰</h3> <div class="space-y-6" data-astro-cid-cgk6ul2e> <!-- Item 1 --> <div class="flex items-center gap-4" data-astro-cid-cgk6ul2e> <div class="p-3 rounded-full bg-blue-500/10 text-blue-400 text-xl" data-astro-cid-cgk6ul2e>🌙</div> <div class="flex-1" data-astro-cid-cgk6ul2e> <h4 class="text-white font-bold" data-astro-cid-cgk6ul2e>Vendas Fora do Horário (24/7)</h4> <p class="text-sm text-slate-400" data-astro-cid-cgk6ul2e>Humanos dormem. A IA vende de madrugada e finais de semana.</p> </div> <div class="text-right" data-astro-cid-cgk6ul2e> <span class="block text-xl font-bold text-green-400" id="gain-hours" data-astro-cid-cgk6ul2e>+ R$ 3.200</span> </div> </div> <!-- Item 2 --> <div class="flex items-center gap-4" data-astro-cid-cgk6ul2e> <div class="p-3 rounded-full bg-purple-500/10 text-purple-400 text-xl" data-astro-cid-cgk6ul2e>🛒</div> <div class="flex-1" data-astro-cid-cgk6ul2e> <h4 class="text-white font-bold" data-astro-cid-cgk6ul2e>Recuperação de Carrinhos</h4> <p class="text-sm text-slate-400" data-astro-cid-cgk6ul2e>60% dos carrinhos são abandonados. Recuperamos 30% deles.</p> </div> <div class="text-right" data-astro-cid-cgk6ul2e> <span class="block text-xl font-bold text-green-400" id="gain-recovery" data-astro-cid-cgk6ul2e>+ R$ 5.400</span> </div> </div> <!-- Item 3 --> <div class="flex items-center gap-4" data-astro-cid-cgk6ul2e> <div class="p-3 rounded-full bg-red-500/10 text-red-400 text-xl" data-astro-cid-cgk6ul2e>📉</div> <div class="flex-1" data-astro-cid-cgk6ul2e> <h4 class="text-white font-bold" data-astro-cid-cgk6ul2e>Economia Operacional</h4> <p class="text-sm text-slate-400" data-astro-cid-cgk6ul2e>Redução de custo com ferramentas caras e atendimento manual.</p> </div> <div class="text-right" data-astro-cid-cgk6ul2e> <span class="block text-xl font-bold text-green-400" id="gain-savings" data-astro-cid-cgk6ul2e>+ R$ 2.400</span> </div> </div> <div class="h-px bg-white/10 my-4" data-astro-cid-cgk6ul2e></div> <div class="flex justify-between items-center pt-2" data-astro-cid-cgk6ul2e> <span class="text-lg font-bold text-slate-300" data-astro-cid-cgk6ul2e>Lucro Líquido Adicional / Ano</span> <span class="text-3xl font-black text-[#00ff9d]" id="annual-profit" data-astro-cid-cgk6ul2e>R$ 132.000</span> </div> </div> </div> <!-- CTA --> <div class="bg-gradient-to-r from-[#00d4ff]/20 to-[#00ff9d]/20 border border-[#00d4ff]/30 p-8 rounded-3xl text-center" data-astro-cid-cgk6ul2e> <h3 class="text-2xl font-bold text-white mb-2" data-astro-cid-cgk6ul2e>Pare de perder dinheiro hoje.</h3> <p class="text-slate-300 mb-6" data-astro-cid-cgk6ul2e>Comece agora com o plano gratuito e escale conforme fatura.</p> <div class="flex justify-center gap-4" data-astro-cid-cgk6ul2e> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-cgk6ul2e>Criar Conta Grátis</a> <a href="/agendar-demo" class="btn-outline" data-astro-cid-cgk6ul2e>Falar com Consultor</a> </div> </div> </div> </div> </div> </section>  <section class="py-20 bg-[#0a0f1a] border-t border-white/5" data-astro-cid-cgk6ul2e> <div class="container mx-auto px-6 max-w-4xl prose prose-invert prose-lg text-slate-300" data-astro-cid-cgk6ul2e> <div class="text-center mb-16 not-prose" data-astro-cid-cgk6ul2e> <h2 class="text-3xl md:text-5xl font-black text-white mb-6" data-astro-cid-cgk6ul2e>A Matemática por trás do Lucro</h2> <p class="text-xl text-slate-400" data-astro-cid-cgk6ul2e>
Por que empresas que usam automação valem mais? Entenda os 3 pilares financeiros que o GetNexo otimiza.
</p> </div> <div class="grid md:grid-cols-2 gap-12 items-start" data-astro-cid-cgk6ul2e> <div data-astro-cid-cgk6ul2e> <h3 class="text-white text-2xl font-bold mb-4" data-astro-cid-cgk6ul2e>1. Redução do CAC (Custo de Aquisição)</h3> <p data-astro-cid-cgk6ul2e>
O CAC é quanto você gasta para trazer um cliente. A maioria das empresas queima dinheiro em anúncios (Ads) mas falha na conversão.
</p> <p data-astro-cid-cgk6ul2e>
Ao responder instantaneamente, você aumenta sua taxa de conversão em até <strong data-astro-cid-cgk6ul2e>7x</strong> (segundo a Harvard Business Review). 
            Isso significa que você converte mais clientes com o <em data-astro-cid-cgk6ul2e>mesmo</em> orçamento de marketing, derrubando seu CAC pela metade.
</p> </div> <div class="bg-white/5 p-6 rounded-2xl border border-white/10" data-astro-cid-cgk6ul2e> <div class="text-xs font-mono text-slate-500 mb-2" data-astro-cid-cgk6ul2e>Fórmula do CAC</div> <div class="text-lg font-bold text-white mb-2" data-astro-cid-cgk6ul2e>CAC = (Marketing + Vendas) / Clientes</div> <div class="h-1 bg-gradient-to-r from-red-500 to-green-500 rounded-full w-full" data-astro-cid-cgk6ul2e></div> <div class="flex justify-between text-xs mt-2" data-astro-cid-cgk6ul2e> <span data-astro-cid-cgk6ul2e>Manual (Alto)</span> <span data-astro-cid-cgk6ul2e>Automático (Baixo)</span> </div> </div> </div> <hr class="border-white/10 my-12" data-astro-cid-cgk6ul2e> <div class="grid md:grid-cols-2 gap-12 items-start" data-astro-cid-cgk6ul2e> <div class="bg-white/5 p-6 rounded-2xl border border-white/10 md:order-1 order-2" data-astro-cid-cgk6ul2e> <div class="text-xs font-mono text-slate-500 mb-2" data-astro-cid-cgk6ul2e>Impacto no LTV</div> <div class="text-white font-bold mb-4" data-astro-cid-cgk6ul2e>Recorrência</div> <ul class="space-y-2 text-sm" data-astro-cid-cgk6ul2e> <li class="flex gap-2" data-astro-cid-cgk6ul2e><span data-astro-cid-cgk6ul2e>❌</span> Cliente esquece de comprar</li> <li class="flex gap-2" data-astro-cid-cgk6ul2e><span class="text-[#00ff9d]" data-astro-cid-cgk6ul2e>✅</span> Lembrete automático de reposição</li> </ul> </div> <div class="md:order-2 order-1" data-astro-cid-cgk6ul2e> <h3 class="text-white text-2xl font-bold mb-4" data-astro-cid-cgk6ul2e>2. Aumento do LTV (Lifetime Value)</h3> <p data-astro-cid-cgk6ul2e>
Vender uma vez é bom. Vender para sempre é riqueza. O LTV mede quanto um cliente gasta com você ao longo da vida.
</p> <p data-astro-cid-cgk6ul2e>
O GetNexo atua proativamente enviando ofertas de <em data-astro-cid-cgk6ul2e>Cross-sell</em> (venda cruzada) e lembretes de recompra baseados no comportamento do cliente, 
            garantindo que ele volte sempre sem custo adicional de aquisição.
</p> </div> </div> <hr class="border-white/10 my-12" data-astro-cid-cgk6ul2e> <div data-astro-cid-cgk6ul2e> <h3 class="text-white text-2xl font-bold mb-4 text-center" data-astro-cid-cgk6ul2e>3. A "Hora de Ouro" das Vendas</h3> <p class="lead text-center mb-8" data-astro-cid-cgk6ul2e>
Existe uma janela de <strong data-astro-cid-cgk6ul2e>5 minutos</strong> após o lead demonstrar interesse. 
          Se você demorar mais que isso, a chance de contato cai 900%.
</p> <div class="relative h-48 bg-white/5 rounded-2xl overflow-hidden border border-white/10" data-astro-cid-cgk6ul2e> <!-- Chart Representation --> <div class="absolute bottom-0 left-0 w-full h-full flex items-end px-8 pb-8 gap-4" data-astro-cid-cgk6ul2e> <div class="w-1/4 bg-[#00ff9d] h-[90%] rounded-t-lg relative group" data-astro-cid-cgk6ul2e> <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold" data-astro-cid-cgk6ul2e>5 min</span> </div> <div class="w-1/4 bg-[#00ff9d]/50 h-[30%] rounded-t-lg relative group" data-astro-cid-cgk6ul2e> <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-gray-400 font-bold" data-astro-cid-cgk6ul2e>10 min</span> </div> <div class="w-1/4 bg-[#00ff9d]/20 h-[10%] rounded-t-lg relative group" data-astro-cid-cgk6ul2e> <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-gray-500 font-bold" data-astro-cid-cgk6ul2e>30 min+</span> </div> </div> </div> <p class="text-center text-sm text-slate-500 mt-4" data-astro-cid-cgk6ul2e>Qualidade/Chance do Lead vs Tempo de Resposta</p> </div> </div> </section> ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/ferramentas/calculadora-roi.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/ferramentas/calculadora-roi.astro";
const $$url = "/ferramentas/calculadora-roi";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$CalculadoraRoi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
