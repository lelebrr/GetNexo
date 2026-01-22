let i={};async function f(){try{i=await(await fetch("/demo/produtos.json")).json();let o=0;Object.values(i).forEach(e=>{o+=e.length}),document.getElementById("product-count").textContent=o}catch{}}function v(t){const o=t.toLowerCase().split(" ");let e=null,a=0;for(const[n,d]of Object.entries(i))d.forEach((l,g)=>{let r=0;const b=l.nome.toLowerCase(),h=JSON.stringify(l).toLowerCase();o.forEach(u=>{b.includes(u)&&(r+=3),h.includes(u)&&(r+=1)}),r>a&&(a=r,e={categoria:n,index:g,produto:l})});return e}function x(t){document.getElementById("chat-input").value=t,c()}async function c(){const t=document.getElementById("chat-input"),o=t.value.trim();o&&(s(o,"user"),t.value="",s("🤖 Analisando sua solicitação com IA...","bot"),setTimeout(()=>{const e=v(o);if(e){const{produto:a,categoria:n}=e;let d=`🎯 **Produto encontrado na categoria "${n.toUpperCase()}"!**

**${a.nome}**
${a.cor?`🎨 Cor: ${a.cor}`:""}
${a.tamanho?`📏 Tamanho: ${a.tamanho}`:""}
${a.cpu?`🖥️ CPU: ${a.cpu}`:""}
${a.ram?`💾 RAM: ${a.ram}GB`:""}
${a.quartos!==void 0?`🏠 Quartos: ${a.quartos}`:""}
${a.area?`📐 Área: ${a.area}m²`:""}

💰 **Preço: R$ ${a.preco.toLocaleString("pt-BR")}**

✨ **Funcionalidades demonstradas:**
• 🔍 Busca inteligente por palavras-chave
• 📊 Exibição de dados estruturados do JSON
• 🎨 Interface responsiva com design cyberpunk
${a[360]?"• 🔄 Suporte a visualização 360°":""}`;m(),s(d,"bot"),setTimeout(()=>{s(`💡 **Como funciona:**
1. 📝 Você digitou: "${o}"
2. 🧠 IA analisou e encontrou match em: ${n}
3. 📄 Dados carregados do arquivo JSON local
4. 🎯 Produto exibido com todas as informações

Quer testar outras categorias? Tente "apartamento", "celular", ou "pizza"! 🍕`,"bot")},500),setTimeout(()=>{p(n,e.index)},2e3)}else m(),s(`🤔 Não encontrei produtos específicos para "${o}".

**📚 Categorias disponíveis no JSON:**
• 🏠 Imóveis (apartamento, casa, cobertura)
• 🚗 Carros (Cruze, Onix, HR-V, Corolla)
• 🔧 Peças Auto (filtros, pastilhas, óleo)
• 💻 Computadores (PC gamer, notebook, SSD)
• 📱 Celulares (iPhone, Galaxy, Redmi)
• 👟 Moda (tênis, camisetas, jaquetas)

**🎯 Dicas para testar:**
• Seja específico: "tênis branco" ou "carro preto"
• Use sinônimos: "apartamento" = "apê"
• Pergunte por características: "PC gamer barato"

Tente uma dessas opções acima! 🚀`,"bot")},1200))}function s(t,o){const e=document.getElementById("chat-messages"),a=document.createElement("div");a.className=`flex ${o==="user"?"justify-end":"justify-start"}`;const n=o==="user"?"bg-cyber-gold text-black":"bg-neon-blue/20 border border-neon-blue/50 text-white";a.innerHTML=`
        <div class="${n} rounded-2xl px-4 py-3 max-w-xs">
          <p class="text-sm whitespace-pre-line">${t}</p>
        </div>
      `,e.appendChild(a),e.scrollTop=e.scrollHeight}function m(){const o=document.getElementById("chat-messages").lastElementChild;o&&o.remove()}function $(t){t.key==="Enter"&&c()}function p(t,o){const e=i[t][o],a=`
        <img src="${e.imagem}" alt="${e.nome}" class="w-full h-48 object-cover rounded-lg mb-4" />
        <h4 class="text-xl text-cyber-gold font-jetbrains mb-2">${e.nome}</h4>
        <div class="text-sm text-gray-300 mb-4">
          ${e.cor?`<p>Cor: ${e.cor}</p>`:""}
          ${e.tamanho?`<p>Tamanho: ${e.tamanho}</p>`:""}
          ${e.cpu?`<p>CPU: ${e.cpu}</p>`:""}
          ${e.ram?`<p>RAM: ${e.ram}GB</p>`:""}
          ${e.quartos!==void 0?`<p>Quartos: ${e.quartos}</p>`:""}
          ${e.area?`<p>Área: ${e.area}m²</p>`:""}
        </div>
        <p class="text-2xl text-matrix-green font-bold mb-4">R$ ${e.preco.toLocaleString("pt-BR")}</p>
        <div class="flex space-x-2">
          ${e[360]?`<button onclick="abrir360('${e[360]}')" class="bg-neon-blue hover:bg-cyan-500 text-black px-4 py-2 rounded font-medium cursor-pointer">Girar 360°</button>`:""}
          <button onclick="alert('Produto adicionado ao carrinho!')" class="bg-cyber-gold hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium cursor-pointer">Comprar Agora</button>
        </div>
      `;document.getElementById("product-content").innerHTML=a,document.getElementById("product-modal").classList.remove("hidden")}function y(){document.getElementById("product-modal").classList.add("hidden")}window.abrir360=function(t){document.getElementById("product-modal").classList.add("hidden"),document.getElementById("360-modal").classList.remove("hidden");const o=document.getElementById("pannellum-viewer");o.innerHTML=`
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="text-6xl mb-4">🔄</div>
            <h3 class="text-2xl text-cyber-gold font-jetbrains mb-2">Visualização 360°</h3>
            <p class="text-neon-blue mb-4">Em uma implementação real, aqui seria integrada a biblioteca Pannellum para visualização 360° do produto.</p>
            <p class="text-gray-400 text-sm">Caminho: ${t}</p>
            <button onclick="fechar360()" class="mt-4 bg-matrix-green text-black px-6 py-2 rounded font-medium">Fechar</button>
          </div>
        </div>
      `};function w(){document.getElementById("360-modal").classList.add("hidden")}window.iniciarVozChat=function(){const t=document.getElementById("voice-chat-btn");if(!("webkitSpeechRecognition"in window)){alert("Seu navegador não suporta reconhecimento de voz. Tente Chrome, Edge ou Safari.");return}const o=new webkitSpeechRecognition;o.lang="pt-BR",o.continuous=!1,o.interimResults=!1,t.textContent="🎤 Ouvindo...",t.classList.add("bg-red-600","animate-pulse"),o.onresult=e=>{const a=e.results[0][0].transcript,n=document.getElementById("chat-input");n&&(n.value=a),t.textContent="🎤 Voz",t.classList.remove("bg-red-600","animate-pulse"),c(),s(`🎤 Você disse: "${a}"`,"user")},o.onerror=e=>{t.textContent="🎤 Voz",t.classList.remove("bg-red-600","animate-pulse"),e.error==="not-allowed"?alert("Permissão para microfone negada. Permita o acesso ao microfone nas configurações do navegador."):alert(`Erro no reconhecimento de voz: ${e.error}`)},o.onend=()=>{t.textContent="🎤 Voz",t.classList.remove("bg-red-600","animate-pulse")};try{o.start()}catch{alert("Erro ao iniciar reconhecimento de voz. Tente novamente."),t.textContent="🎤 Voz",t.classList.remove("bg-red-600","animate-pulse")}};f();window.sendMessage=c;window.handleKeyPress=$;window.mostrarProduto=p;window.fecharModal=y;window.fechar360=w;window.preencherMensagem=x;window.iniciarVozChat=iniciarVozChat;
