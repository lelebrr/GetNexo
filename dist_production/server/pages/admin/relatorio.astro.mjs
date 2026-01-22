import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                       */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Relatorio = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Relatório GetNexo", "data-astro-cid-7lzjsypz": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<nav style="background:#0f172a; padding:1rem 5%; display:flex; gap:1rem; border-bottom:1px solid #1e293b; flex-wrap:wrap;" data-astro-cid-7lzjsypz> <a href="/admin" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>📊 Dashboard</a> <a href="/admin/cupons" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>🎟️ Cupons</a> <a href="/admin/produtos" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>🛍️ Produtos</a> <a href="/admin/relatorio" style="color:#00ff9d; text-decoration:none; padding:0.5rem 1rem; background:#00ff9d22; border-radius:8px; font-weight:600;" data-astro-cid-7lzjsypz>📈 Relatórios</a> <a href="/criar-bot" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>🤖 Criar Bot</a> </nav> <div style="background:#0a0e17; min-height:100vh; padding:2rem; color:white;" data-astro-cid-7lzjsypz> <div style="max-width:800px; mx-auto;" data-astro-cid-7lzjsypz> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;" data-astro-cid-7lzjsypz> <h2 style="color:#00ff9d; font-size:2rem; margin:0;" data-astro-cid-7lzjsypz>Relatório Mensal</h2> <button onclick="window.location.href='/admin'" style="background:transparent; border:1px solid #374151; color:#9ca3af; padding:0.5rem 1rem; border-radius:8px; cursor:pointer;" data-astro-cid-7lzjsypz>Voltar</button> </div> <div class="card" data-astro-cid-7lzjsypz> <div id="loading" style="text-align:center; color:#666;" data-astro-cid-7lzjsypz>Carregando dados...</div> <div id="stats" style="display:none;" data-astro-cid-7lzjsypz> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Total Vendas</p> <strong id="val-vendas" style="color:#00ff9d; font-size:1.5rem;" data-astro-cid-7lzjsypz>R$ 0,00</strong> </div> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Pedidos Fechados</p> <strong id="val-pedidos" data-astro-cid-7lzjsypz>0</strong> </div> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Conversas Iniciadas</p> <strong id="val-conversas" data-astro-cid-7lzjsypz>0</strong> </div> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Taxa de Conversão</p> <strong id="val-taxa" style="color:#00d4ff;" data-astro-cid-7lzjsypz>0%</strong> </div> <div class="stat-row" style="border-bottom:none;" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Comissões (Revenda)</p> <strong id="val-comissoes" style="color:#fbbf24;" data-astro-cid-7lzjsypz>R$ 0,00</strong> </div> </div> </div> <div style="margin-top:2rem; text-align:right;" data-astro-cid-7lzjsypz> <button class="btn-cta" onclick="baixarPDF()" data-astro-cid-7lzjsypz>📄 Exportar PDF</button> </div> </div> </div> <script>
    const API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://api.getnexo.com.br';
    
    // Fetch Data on Load
    fetch(\`\${API_URL}/api/relatorio\`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('stats').style.display = 'block';
            
            document.getElementById('val-vendas').innerText = 'R$ ' + data.totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2});
            document.getElementById('val-pedidos').innerText = data.pedidos;
            document.getElementById('val-conversas').innerText = data.conversas;
            
            const taxa = data.conversas > 0 ? ((data.pedidos / data.conversas) * 100).toFixed(1) : 0;
            document.getElementById('val-taxa').innerText = taxa + '%';
            
            // Calc estimated commission (10% of sales for demo)
            const comissao = data.totalVendas * 0.1;
            document.getElementById('val-comissoes').innerText = 'R$ ' + comissao.toLocaleString('pt-BR', {minimumFractionDigits: 2});
            
            window.reportData = { ...data, taxa, comissao };
        })
        .catch(e => {
            document.getElementById('loading').innerText = 'Erro ao carregar relatório.';
        });

    async function baixarPDF() {
      const data = window.reportData || { totalVendas: 0, pedidos: 0, conversas: 0 };

      // Gera PDF (simulado - abrindo nova janela de impressão)
      const win = window.open('', '_blank');
      win.document.write(\`
        <html>
        <head>
            <title>Relatório GetNexo - \${new Date().toLocaleDateString()}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; }
                h1 { color: #000; border-bottom: 2px solid #00ff9d; padding-bottom: 10px; }
                .item { margin-bottom: 20px; font-size: 18px; border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
                .val { font-weight: bold; }
                .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body onload="window.print()">
          <h1>Relatório Mensal GetNexo</h1>
          <div class="item"><span>Total Vendas:</span> <span class="val">R$ \${data.totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
          <div class="item"><span>Pedidos:</span> <span class="val">\${data.pedidos}</span></div>
          <div class="item"><span>Conversas:</span> <span class="val">\${data.conversas}</span></div>
          <div class="item"><span>Taxa de Conversão:</span> <span class="val">\${data.taxa}%</span></div>
          <div class="item"><span>Comissões Pagas:</span> <span class="val">R$ \${data.comissao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
          
          <div class="footer">Gerado em \${new Date().toLocaleString()} por GetNexo Admin</div>
        </body></html>
      \`);
    }
  <\/script> `], ["  ", `<nav style="background:#0f172a; padding:1rem 5%; display:flex; gap:1rem; border-bottom:1px solid #1e293b; flex-wrap:wrap;" data-astro-cid-7lzjsypz> <a href="/admin" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>📊 Dashboard</a> <a href="/admin/cupons" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>🎟️ Cupons</a> <a href="/admin/produtos" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>🛍️ Produtos</a> <a href="/admin/relatorio" style="color:#00ff9d; text-decoration:none; padding:0.5rem 1rem; background:#00ff9d22; border-radius:8px; font-weight:600;" data-astro-cid-7lzjsypz>📈 Relatórios</a> <a href="/criar-bot" style="color:#94a3b8; text-decoration:none; padding:0.5rem 1rem; border-radius:8px;" data-astro-cid-7lzjsypz>🤖 Criar Bot</a> </nav> <div style="background:#0a0e17; min-height:100vh; padding:2rem; color:white;" data-astro-cid-7lzjsypz> <div style="max-width:800px; mx-auto;" data-astro-cid-7lzjsypz> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;" data-astro-cid-7lzjsypz> <h2 style="color:#00ff9d; font-size:2rem; margin:0;" data-astro-cid-7lzjsypz>Relatório Mensal</h2> <button onclick="window.location.href='/admin'" style="background:transparent; border:1px solid #374151; color:#9ca3af; padding:0.5rem 1rem; border-radius:8px; cursor:pointer;" data-astro-cid-7lzjsypz>Voltar</button> </div> <div class="card" data-astro-cid-7lzjsypz> <div id="loading" style="text-align:center; color:#666;" data-astro-cid-7lzjsypz>Carregando dados...</div> <div id="stats" style="display:none;" data-astro-cid-7lzjsypz> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Total Vendas</p> <strong id="val-vendas" style="color:#00ff9d; font-size:1.5rem;" data-astro-cid-7lzjsypz>R$ 0,00</strong> </div> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Pedidos Fechados</p> <strong id="val-pedidos" data-astro-cid-7lzjsypz>0</strong> </div> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Conversas Iniciadas</p> <strong id="val-conversas" data-astro-cid-7lzjsypz>0</strong> </div> <div class="stat-row" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Taxa de Conversão</p> <strong id="val-taxa" style="color:#00d4ff;" data-astro-cid-7lzjsypz>0%</strong> </div> <div class="stat-row" style="border-bottom:none;" data-astro-cid-7lzjsypz> <p data-astro-cid-7lzjsypz>Comissões (Revenda)</p> <strong id="val-comissoes" style="color:#fbbf24;" data-astro-cid-7lzjsypz>R$ 0,00</strong> </div> </div> </div> <div style="margin-top:2rem; text-align:right;" data-astro-cid-7lzjsypz> <button class="btn-cta" onclick="baixarPDF()" data-astro-cid-7lzjsypz>📄 Exportar PDF</button> </div> </div> </div> <script>
    const API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://api.getnexo.com.br';
    
    // Fetch Data on Load
    fetch(\\\`\\\${API_URL}/api/relatorio\\\`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('stats').style.display = 'block';
            
            document.getElementById('val-vendas').innerText = 'R$ ' + data.totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2});
            document.getElementById('val-pedidos').innerText = data.pedidos;
            document.getElementById('val-conversas').innerText = data.conversas;
            
            const taxa = data.conversas > 0 ? ((data.pedidos / data.conversas) * 100).toFixed(1) : 0;
            document.getElementById('val-taxa').innerText = taxa + '%';
            
            // Calc estimated commission (10% of sales for demo)
            const comissao = data.totalVendas * 0.1;
            document.getElementById('val-comissoes').innerText = 'R$ ' + comissao.toLocaleString('pt-BR', {minimumFractionDigits: 2});
            
            window.reportData = { ...data, taxa, comissao };
        })
        .catch(e => {
            document.getElementById('loading').innerText = 'Erro ao carregar relatório.';
        });

    async function baixarPDF() {
      const data = window.reportData || { totalVendas: 0, pedidos: 0, conversas: 0 };

      // Gera PDF (simulado - abrindo nova janela de impressão)
      const win = window.open('', '_blank');
      win.document.write(\\\`
        <html>
        <head>
            <title>Relatório GetNexo - \\\${new Date().toLocaleDateString()}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; }
                h1 { color: #000; border-bottom: 2px solid #00ff9d; padding-bottom: 10px; }
                .item { margin-bottom: 20px; font-size: 18px; border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
                .val { font-weight: bold; }
                .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body onload="window.print()">
          <h1>Relatório Mensal GetNexo</h1>
          <div class="item"><span>Total Vendas:</span> <span class="val">R$ \\\${data.totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
          <div class="item"><span>Pedidos:</span> <span class="val">\\\${data.pedidos}</span></div>
          <div class="item"><span>Conversas:</span> <span class="val">\\\${data.conversas}</span></div>
          <div class="item"><span>Taxa de Conversão:</span> <span class="val">\\\${data.taxa}%</span></div>
          <div class="item"><span>Comissões Pagas:</span> <span class="val">R$ \\\${data.comissao.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
          
          <div class="footer">Gerado em \\\${new Date().toLocaleString()} por GetNexo Admin</div>
        </body></html>
      \\\`);
    }
  <\/script> `])), maybeRenderHead()) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/relatorio.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/relatorio.astro";
const $$url = "/admin/relatorio";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Relatorio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
