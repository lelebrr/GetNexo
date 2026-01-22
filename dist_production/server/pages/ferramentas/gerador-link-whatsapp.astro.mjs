import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                                   */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$GeradorLinkWhatsapp = createComponent(($$result, $$props, $$slots) => {
  const title = "Gerador de Link WhatsApp Grátis e Personalizado (2026) | GetNexo";
  const description = "Crie seu link curto de WhatsApp (wa.me) personalizado com mensagem pronta. Gere QR Code grátis para Instagram, Bio e Campanhas. Sem cadastro.";
  const keywords = "gerador link whatsapp, gerar link wa.me, link whatsapp personalizado, criar link whatsapp com mensagem, qr code whatsapp gratis, getnexo ferramentas";
  return renderTemplate(_b || (_b = __template(["", ` <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script> <script>
  const phoneInput = document.getElementById('phone');
  const msgInput = document.getElementById('message');
  const generateBtn = document.getElementById('generate-btn');
  const resultContainer = document.getElementById('result-container');
  const placeholderState = document.getElementById('placeholder-state');
  const finalLinkInput = document.getElementById('final-link');
  const testLinkBtn = document.getElementById('test-link');
  const qrcodeContainer = document.getElementById('qrcode-container');
  const copyBtn = document.getElementById('copy-btn');

  // Format Phone Input
  phoneInput.addEventListener('input', (e) => {
    let x = e.target.value.replace(/\\D/g, '').match(/(\\d{0,2})(\\d{0,5})(\\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  });

  generateBtn.addEventListener('click', () => {
    const rawPhone = phoneInput.value.replace(/\\D/g, '');
    const rawMsg = msgInput.value;
    
    if (rawPhone.length < 10) {
      alert("Por favor, insira um número de telefone válido com DDD.");
      return;
    }

    // Build API Link
    const encodedMsg = encodeURIComponent(rawMsg);
    const link = \`https://wa.me/55\${rawPhone}?text=\${encodedMsg}\`;

    // Update UI
    finalLinkInput.value = link;
    testLinkBtn.href = link;
    
    // Generate QR
    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
      text: link,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });

    // Show Result
    placeholderState.style.display = 'none';
    resultContainer.style.display = 'flex';
  });

  copyBtn.addEventListener('click', () => {
    finalLinkInput.select();
    document.execCommand('copy');
    copyBtn.innerHTML = '✅';
    setTimeout(() => copyBtn.innerHTML = '📋', 2000);
  });
<\/script> `], ["", ` <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script> <script>
  const phoneInput = document.getElementById('phone');
  const msgInput = document.getElementById('message');
  const generateBtn = document.getElementById('generate-btn');
  const resultContainer = document.getElementById('result-container');
  const placeholderState = document.getElementById('placeholder-state');
  const finalLinkInput = document.getElementById('final-link');
  const testLinkBtn = document.getElementById('test-link');
  const qrcodeContainer = document.getElementById('qrcode-container');
  const copyBtn = document.getElementById('copy-btn');

  // Format Phone Input
  phoneInput.addEventListener('input', (e) => {
    let x = e.target.value.replace(/\\\\D/g, '').match(/(\\\\d{0,2})(\\\\d{0,5})(\\\\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  });

  generateBtn.addEventListener('click', () => {
    const rawPhone = phoneInput.value.replace(/\\\\D/g, '');
    const rawMsg = msgInput.value;
    
    if (rawPhone.length < 10) {
      alert("Por favor, insira um número de telefone válido com DDD.");
      return;
    }

    // Build API Link
    const encodedMsg = encodeURIComponent(rawMsg);
    const link = \\\`https://wa.me/55\\\${rawPhone}?text=\\\${encodedMsg}\\\`;

    // Update UI
    finalLinkInput.value = link;
    testLinkBtn.href = link;
    
    // Generate QR
    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
      text: link,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });

    // Show Result
    placeholderState.style.display = 'none';
    resultContainer.style.display = 'flex';
  });

  copyBtn.addEventListener('click', () => {
    finalLinkInput.select();
    document.execCommand('copy');
    copyBtn.innerHTML = '✅';
    setTimeout(() => copyBtn.innerHTML = '📋', 2000);
  });
<\/script> `])), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-cki7leqb": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section class="tool-hero" data-astro-cid-cki7leqb> <div class="container mx-auto px-6 max-w-4xl text-center" data-astro-cid-cki7leqb> <div class="hero-badge" data-astro-cid-cki7leqb>Ferramenta Gratuita</div> <h1 class="text-gradient" data-astro-cid-cki7leqb>Gerador de Link WhatsApp</h1> <p class="text-slate-400 text-xl mt-4 max-w-2xl mx-auto" data-astro-cid-cki7leqb>\nCrie links diretos para seu WhatsApp com mensagem personalizada em segundos. Aumente suas conversões no Instagram e Ads.\n</p> </div> </section> <section class="tool-interface" data-astro-cid-cki7leqb> <div class="container mx-auto px-6 max-w-5xl" data-astro-cid-cki7leqb> <div class="glass-panel tool-card" data-astro-cid-cki7leqb> <div class="grid md:grid-cols-2 gap-12" data-astro-cid-cki7leqb> <!-- Input Form --> <div class="space-y-6" data-astro-cid-cki7leqb> <h3 class="text-2xl font-bold text-white mb-6" data-astro-cid-cki7leqb>1. Configure seu Link</h3> <div class="input-group" data-astro-cid-cki7leqb> <label for="phone" data-astro-cid-cki7leqb>Seu Número de WhatsApp</label> <div class="phone-input" data-astro-cid-cki7leqb> <span class="flag" data-astro-cid-cki7leqb>🇧🇷 +55</span> <input type="tel" id="phone" placeholder="11 99999-9999" class="glass-input" data-astro-cid-cki7leqb> </div> <p class="helper-text" data-astro-cid-cki7leqb>Insira o DDD + Número</p> </div> <div class="input-group" data-astro-cid-cki7leqb> <label for="message" data-astro-cid-cki7leqb>Mensagem Personalizada (Opcional)</label> <textarea id="message" rows="4" placeholder="Ex: Olá! Gostaria de saber mais sobre o Plano Pro." class="glass-input" data-astro-cid-cki7leqb></textarea> <p class="helper-text" data-astro-cid-cki7leqb>Essa mensagem aparecerá pronta para seu cliente enviar.</p> </div> <button id="generate-btn" class="btn-primary-glow w-full" data-astro-cid-cki7leqb>Gerar Link Grátis ✨</button> </div> <!-- Result Preview --> <div class="result-area relative" data-astro-cid-cki7leqb> <div class="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 to-[#00ff9d]/10 blur-3xl z-0 rounded-3xl" data-astro-cid-cki7leqb></div> <div class="relative z-10 glass-panel h-full flex flex-col items-center justify-center text-center p-8 space-y-6" id="result-container" style="display:none;" data-astro-cid-cki7leqb> <h3 class="text-xl font-bold text-white" data-astro-cid-cki7leqb>Seu Link está pronto! 🚀</h3> <div class="link-box" data-astro-cid-cki7leqb> <input type="text" id="final-link" readonly value="https://wa.me/5511999999999" class="glass-input text-center text-sm" data-astro-cid-cki7leqb> <button id="copy-btn" class="copy-icon" data-astro-cid-cki7leqb>📋</button> </div> <div id="qrcode-container" class="bg-white p-4 rounded-xl" data-astro-cid-cki7leqb></div> <div class="flex flex-col gap-3 w-full" data-astro-cid-cki7leqb> <a href="#" target="_blank" id="test-link" class="btn-outline text-sm" data-astro-cid-cki7leqb>Testar Link</a> <button id="download-qr" class="btn-text text-sm text-slate-400 hover:text-white" data-astro-cid-cki7leqb>Baixar QR Code</button> </div> </div> <!-- Placeholder State --> <div class="relative z-10 h-full flex flex-col items-center justify-center text-slate-500" id="placeholder-state" data-astro-cid-cki7leqb> <span class="text-6xl mb-4 opacity-30" data-astro-cid-cki7leqb>📱</span> <p data-astro-cid-cki7leqb>Preencha os dados ao lado para ver seu link aqui.</p> </div> </div> </div> </div> </div> </section>  <section class="seo-content" data-astro-cid-cki7leqb> <div class="container mx-auto px-6 max-w-4xl prose prose-invert prose-lg text-slate-300" data-astro-cid-cki7leqb> <div class="mb-16 border-b border-white/10 pb-10" data-astro-cid-cki7leqb> <h2 class="text-4xl font-black text-white mb-6" data-astro-cid-cki7leqb>O Guia Definitivo do Link WhatsApp (2026)</h2> <p class="lead text-xl text-slate-400" data-astro-cid-cki7leqb>\nTudo o que você precisa saber sobre como criar, personalizar e rastrear links do WhatsApp para vender mais.\n          De estruturas básicas de URL a estratégias avançadas de tráfego pago.\n</p> </div> <div class="grid md:grid-cols-[2fr_1fr] gap-12" data-astro-cid-cki7leqb> <div class="main-content" data-astro-cid-cki7leqb> <h3 class="text-2xl font-bold text-white mb-4" data-astro-cid-cki7leqb>O que é a API wa.me?</h3> <p data-astro-cid-cki7leqb>\nO recurso "Click-to-Chat" do WhatsApp utiliza uma API pública simplificada chamada <code data-astro-cid-cki7leqb>wa.me</code> (antigamente <code data-astro-cid-cki7leqb>api.whatsapp.com</code>).\n            Essa funcionalidade permite iniciar uma conversa sem ter o número salvo na agenda do telefone.\n</p> <p data-astro-cid-cki7leqb>\nPara empresas, isso é crucial. Cada segundo que um cliente gasta salvando seu número é uma oportunidade de desistência.\n            O link elimina essa barreira, funcionando instantaneamente em Android, iOS e WhatsApp Web/Desktop.\n</p> <h3 class="text-2xl font-bold text-white mt-10 mb-4" data-astro-cid-cki7leqb>Anatomia de um Link WhatsApp</h3> <p data-astro-cid-cki7leqb>\nUm link padrão segue a estrutura: <code data-astro-cid-cki7leqb>https://wa.me/&lt;numero&gt;?text=&lt;mensagem&gt;</code>.\n</p> <ul class="list-disc pl-6 space-y-2 mb-6" data-astro-cid-cki7leqb> <li data-astro-cid-cki7leqb><strong data-astro-cid-cki7leqb>Protocolo (https):</strong> Garante que o link abra no navegador ou app de forma segura.</li> <li data-astro-cid-cki7leqb><strong data-astro-cid-cki7leqb>Domínio (wa.me):</strong> O encurtador oficial do WhatsApp.</li> <li data-astro-cid-cki7leqb><strong data-astro-cid-cki7leqb>Número:</strong> Deve incluir o Código do País (DDI) e DDD, sem zeros à esquerda ou caracteres especiais. <br data-astro-cid-cki7leqb>Ex: <code data-astro-cid-cki7leqb>5511999999999</code> (Brasil + SP).</li> <li data-astro-cid-cki7leqb><strong data-astro-cid-cki7leqb>Parâmetro Text:</strong> Onde mora a mágia. A mensagem deve ser "URL Encoded" (os espaços viram <code data-astro-cid-cki7leqb>%20</code>).</li> </ul> <div class="bg-white/5 border border-white/10 p-6 rounded-xl my-8" data-astro-cid-cki7leqb> <h4 class="text-lg font-bold text-[#00ff9d] mb-2" data-astro-cid-cki7leqb>💡 Dica Pro: Formatação na Mensagem</h4> <p class="text-sm" data-astro-cid-cki7leqb>\nVocê pode enviar mensagens já formatadas pelo link!\n<br data-astro-cid-cki7leqb>• Use <code data-astro-cid-cki7leqb>*texto*</code> para <strong data-astro-cid-cki7leqb>negrito</strong>.\n<br data-astro-cid-cki7leqb>• Use <code data-astro-cid-cki7leqb>_texto_</code> para <em data-astro-cid-cki7leqb>itálico</em>.\n<br data-astro-cid-cki7leqb>• Use <code data-astro-cid-cki7leqb>~texto~</code> para <strike data-astro-cid-cki7leqb>riscado</strike>.\n<br data-astro-cid-cki7leqb>• Use <code data-astro-cid-cki7leqb>%0A</code> para pular uma linha.\n</p> </div> <h3 class="text-2xl font-bold text-white mt-10 mb-4" data-astro-cid-cki7leqb>5 Estratégias de Marketing com Links</h3> <h4 class="font-bold text-white text-lg mt-6" data-astro-cid-cki7leqb>1. Link na Bio (Instagram/TikTok)</h4> <p data-astro-cid-cki7leqb>\nA "Bio" é o imóvel mais valioso das suas redes sociais. Em vez de usar links genéricos para a home do site, \n            use um link de WhatsApp com uma mensagem de pré-qualificação:\n<em data-astro-cid-cki7leqb>"Olá, vim pelo Instagram e quero saber sobre a Promoção X"</em>.\n</p> <h4 class="font-bold text-white text-lg mt-6" data-astro-cid-cki7leqb>2. Google Ads e Facebook Ads</h4> <p data-astro-cid-cki7leqb>\nAo criar campanhas de "Clique para WhatsApp", você pode (e deve) usar mensagens diferentes para cada anúncio.\n            Isso permite saber exatamente qual criativo gerou a venda, mesmo sem um CRM complexo.\n</p> <h4 class="font-bold text-white text-lg mt-6" data-astro-cid-cki7leqb>3. QR Codes em Materiais Físicos</h4> <p data-astro-cid-cki7leqb>\nEmbalagens, cardápios e cartões de visita ganham vida com QR Codes que levam para o WhatsApp.\n            Dica: Ofereça algo em troca do scan, como "Escaneie para ganhar 10% de desconto na próxima compra".\n</p> <h4 class="font-bold text-white text-lg mt-6" data-astro-cid-cki7leqb>4. Recuperação de Carrinho (E-mail)</h4> <p data-astro-cid-cki7leqb>\nInclua um botão "Tirar dúvida no WhatsApp" nos seus e-mails de carrinho abandonado.\n            Muitas vezes o cliente só tem uma dúvida simples que impede a compra.\n</p> <h4 class="font-bold text-white text-lg mt-6" data-astro-cid-cki7leqb>5. NFC e Tecnologia de Proximidade</h4> <p data-astro-cid-cki7leqb>\nGrave seu link de WhatsApp em tags NFC e cole em mesas de restaurante ou balcões de loja.\n            O cliente aproxima o celular e abre o chat – o futuro do atendimento phygital.\n</p> <h3 class="text-2xl font-bold text-white mt-12 mb-4" data-astro-cid-cki7leqb>Erros Comuns (Troubleshooting)</h3> <div class="space-y-4" data-astro-cid-cki7leqb> <details class="group bg-white/5 border border-white/5 rounded-xl p-4" data-astro-cid-cki7leqb> <summary class="font-bold cursor-pointer list-none flex justify-between" data-astro-cid-cki7leqb>O link não abre o app, fica no navegador <span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span></summary> <p class="mt-4 text-sm" data-astro-cid-cki7leqb>Isso geralmente acontece em Desktops sem o app instalado. Certifique-se de ter o WhatsApp Web logado ou o app Desktop instalado.</p> </details> <details class="group bg-white/5 border border-white/5 rounded-xl p-4" data-astro-cid-cki7leqb> <summary class="font-bold cursor-pointer list-none flex justify-between" data-astro-cid-cki7leqb>Número inválido (Url não funciona) <span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span></summary> <p class="mt-4 text-sm" data-astro-cid-cki7leqb>Verifique se você colocou: 1. O código do país (55 para Brasil). 2. O DDD (dois dígitos). 3. O nono dígito (se houver). 4. <strong data-astro-cid-cki7leqb>Nenhum</strong> símbolo como +, -, ( ) ou espaços.</p> </details> <details class="group bg-white/5 border border-white/5 rounded-xl p-4" data-astro-cid-cki7leqb> <summary class="font-bold cursor-pointer list-none flex justify-between" data-astro-cid-cki7leqb>A mensagem aparece cortada <span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span></summary> <p class="mt-4 text-sm" data-astro-cid-cki7leqb>Links muito longos podem quebrar em alguns navegadores antigos. Prefira mensagens objetivas ou use um encurtador de URL (bit.ly) sobre o link do WhatsApp se for muito grande.</p> </details> </div> </div> <!-- Sidebar CTA --> <div class="sidebar sticky top-24 h-fit" data-astro-cid-cki7leqb> <div class="glass-panel p-6 rounded-2xl border-white/10 bg-gradient-to-b from-white/5 to-transparent" data-astro-cid-cki7leqb> <h4 class="text-xl font-bold text-white mb-4" data-astro-cid-cki7leqb>Cansado de responder manualmente?</h4> <p class="text-sm mb-6" data-astro-cid-cki7leqb>\nGerar o link é só o começo. O GetNexo atende, qualifica e vende para esses leads 24h por dia usando Inteligência Artificial.\n</p> <ul class="space-y-3 mb-8 text-sm" data-astro-cid-cki7leqb> <li class="flex gap-2" data-astro-cid-cki7leqb><span class="text-[#00ff9d]" data-astro-cid-cki7leqb>✓</span> Atendimento 24/7</li> <li class="flex gap-2" data-astro-cid-cki7leqb><span class="text-[#00ff9d]" data-astro-cid-cki7leqb>✓</span> Sem mensalidade (Self-Hosted)</li> <li class="flex gap-2" data-astro-cid-cki7leqb><span class="text-[#00ff9d]" data-astro-cid-cki7leqb>✓</span> API Oficial Grátis</li> </ul> <a href="/criar-bot" class="block w-full py-3 bg-[#00ff9d] text-black font-bold text-center rounded-lg hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all" data-astro-cid-cki7leqb>\nCriar Bot Grátis\n</a> </div> </div> </div> </div> </section>  <section class="py-12 bg-[#020617] border-t border-white/5" data-astro-cid-cki7leqb> <div class="container mx-auto px-6 max-w-4xl" data-astro-cid-cki7leqb> <h2 class="text-3xl font-bold text-white mb-8 text-center" data-astro-cid-cki7leqb>Perguntas Frequentes</h2> <div class="space-y-4" data-astro-cid-cki7leqb> <details class="group bg-white/5 border border-white/5 rounded-xl p-6 open:bg-white/10 transition-all" data-astro-cid-cki7leqb> <summary class="font-bold text-white cursor-pointer list-none flex justify-between items-center text-lg" data-astro-cid-cki7leqb>\nO Gerador de Link WhatsApp do GetNexo é gratuito?\n<span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span> </summary> <p class="mt-4 text-slate-400" data-astro-cid-cki7leqb>Sim! A ferramenta é 100% gratuita, não exige cadastro e não tem limite de uso. Pode gerar quantos links quiser.</p> </details> <details class="group bg-white/5 border border-white/5 rounded-xl p-6 open:bg-white/10 transition-all" data-astro-cid-cki7leqb> <summary class="font-bold text-white cursor-pointer list-none flex justify-between items-center text-lg" data-astro-cid-cki7leqb>\nO link expira depois de um tempo?\n<span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span> </summary> <p class="mt-4 text-slate-400" data-astro-cid-cki7leqb>Não. O link gerado usa a API oficial do WhatsApp, que é vitalícia. Enquanto seu número de telefone for o mesmo, o link funcionará para sempre.</p> </details> <details class="group bg-white/5 border border-white/5 rounded-xl p-6 open:bg-white/10 transition-all" data-astro-cid-cki7leqb> <summary class="font-bold text-white cursor-pointer list-none flex justify-between items-center text-lg" data-astro-cid-cki7leqb>\nPosso rastrear quem clicou no meu link?\n<span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span> </summary> <p class="mt-4 text-slate-400" data-astro-cid-cki7leqb>Diretamente pelo WhatsApp não. Mas você pode encurtar nosso link usando Bit.ly ou usar parâmetros UTM se estiver anunciando no Facebook/Google Ads para rastrear a origem.</p> </details> <details class="group bg-white/5 border border-white/5 rounded-xl p-6 open:bg-white/10 transition-all" data-astro-cid-cki7leqb> <summary class="font-bold text-white cursor-pointer list-none flex justify-between items-center text-lg" data-astro-cid-cki7leqb>\nFunciona para WhatsApp Business?\n<span class="transition group-open:rotate-180" data-astro-cid-cki7leqb>▼</span> </summary> <p class="mt-4 text-slate-400" data-astro-cid-cki7leqb>Com certeza! Ele funciona tanto para o WhatsApp pessoal quanto para o Business (WA Business). O link abre o aplicativo que estiver instalado no celular do cliente.</p> </details> </div> </div> </section>  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": [{\n      "@type": "Question",\n      "name": "O Gerador de Link WhatsApp do GetNexo é gratuito?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Sim! A ferramenta é 100% gratuita, não exige cadastro e não tem limite de uso. Pode gerar quantos links quiser."\n      }\n    }, {\n      "@type": "Question",\n      "name": "O link expira depois de um tempo?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Não. O link gerado usa a API oficial do WhatsApp, que é vitalícia. Enquanto seu número de telefone for o mesmo, o link funcionará para sempre."\n      }\n    }, {\n      "@type": "Question",\n      "name": "Posso rastrear quem clicou no meu link?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Diretamente pelo WhatsApp não. Mas você pode encurtar nosso link usando Bit.ly ou usar parâmetros UTM se estiver anunciando no Facebook/Google Ads para rastrear a origem."\n      }\n    }, {\n      "@type": "Question",\n      "name": "Funciona para WhatsApp Business?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Com certeza! Ele funciona tanto para o WhatsApp pessoal quanto para o Business (WA Business). O link abre o aplicativo que estiver instalado no celular do cliente."\n      }\n    }]\n  }\n  <\/script> '])), maybeRenderHead()) }));
}, "/home/lele/usenexo/getnexo-site/src/pages/ferramentas/gerador-link-whatsapp.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/ferramentas/gerador-link-whatsapp.astro";
const $$url = "/ferramentas/gerador-link-whatsapp";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$GeradorLinkWhatsapp,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
