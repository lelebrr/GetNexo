import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Produtos = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Produtos | Admin GetNexo", "data-astro-cid-lz3lldbl": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<nav style="background:#0f172a; padding:1rem 5%; display:flex; gap:1rem; border-bottom:1px solid #1e293b; flex-wrap:wrap;" data-astro-cid-lz3lldbl> <a href="/admin" class="nav-link" data-astro-cid-lz3lldbl>📊 Dashboard</a> <a href="/admin/cupons" class="nav-link" data-astro-cid-lz3lldbl>🎟️ Cupons</a> <a href="/admin/produtos" class="nav-link active" data-astro-cid-lz3lldbl>🛍️ Produtos</a> <a href="/admin/relatorio" class="nav-link" data-astro-cid-lz3lldbl>📈 Relatórios</a> <a href="/criar-bot" class="nav-link" data-astro-cid-lz3lldbl>🤖 Criar Bot</a> </nav> <div class="page-container" data-astro-cid-lz3lldbl> <header class="page-header" data-astro-cid-lz3lldbl> <h1 data-astro-cid-lz3lldbl>🛍️ Produtos</h1> <button id="btn-new" class="btn-primary" data-astro-cid-lz3lldbl>+ Novo Produto</button> </header> <!-- Modal --> <div id="modal" class="modal" style="display:none;" data-astro-cid-lz3lldbl> <div class="modal-content" data-astro-cid-lz3lldbl> <h2 id="modal-title" data-astro-cid-lz3lldbl>Novo Produto</h2> <form id="form-product" data-astro-cid-lz3lldbl> <input type="hidden" name="id" id="product-id" data-astro-cid-lz3lldbl> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Nome do Produto *</label> <input type="text" name="name" id="product-name" placeholder="Ex: Camiseta Neon" required data-astro-cid-lz3lldbl> </div> <div class="field-row" data-astro-cid-lz3lldbl> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Preço (R$) *</label> <input type="number" name="price" id="product-price" placeholder="99.90" step="0.01" required data-astro-cid-lz3lldbl> </div> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Estoque</label> <input type="number" name="stock" id="product-stock" placeholder="10" value="10" data-astro-cid-lz3lldbl> </div> </div> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>URL da Imagem</label> <input type="url" name="image_url" id="product-image" placeholder="https://..." data-astro-cid-lz3lldbl> </div> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Descrição</label> <textarea name="description" id="product-desc" rows="3" placeholder="Descrição do produto..." data-astro-cid-lz3lldbl></textarea> </div> <div class="modal-actions" data-astro-cid-lz3lldbl> <button type="button" id="btn-cancel" class="btn-secondary" data-astro-cid-lz3lldbl>Cancelar</button> <button type="submit" class="btn-primary" data-astro-cid-lz3lldbl>Salvar</button> </div> </form> </div> </div> <!-- Products Grid --> <div id="products-grid" class="products-grid" data-astro-cid-lz3lldbl> <p style="color:#64748b; text-align:center; grid-column:1/-1; padding:4rem;" data-astro-cid-lz3lldbl>Carregando...</p> </div> </div> <script>
    const API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://api.getnexo.com.br';
    
    const modal = document.getElementById('modal');
    const form = document.getElementById('form-product');
    const grid = document.getElementById('products-grid');
    
    async function loadProducts() {
      try {
        const res = await fetch(\`\${API_URL}/api/products\`);
        const products = await res.json();
        
        if (products.length === 0) {
          grid.innerHTML = '<p style="color:#64748b; text-align:center; grid-column:1/-1; padding:4rem;">Nenhum produto cadastrado</p>';
          return;
        }
        
        grid.innerHTML = products.map(p => \`
          <div class="product-card" data-id="\${p.id}">
            <img src="\${p.image_url || 'https://placehold.co/200x200/1e293b/64748b?text=Sem+Imagem'}" alt="\${p.name}" class="product-image" />
            <div class="product-info">
              <h3>\${p.name}</h3>
              <p class="product-price">R$ \${p.price.toFixed(2)}</p>
              <p class="product-stock">Estoque: \${p.stock || 0}</p>
            </div>
            <div class="product-actions">
              <button onclick="editProduct(\${p.id})" class="btn-icon" title="Editar">✏️</button>
              <button onclick="deleteProduct(\${p.id})" class="btn-icon" title="Excluir">🗑️</button>
            </div>
          </div>
        \`).join('');
      } catch (e) {
        console.error('Error:', e);
        grid.innerHTML = '<p style="color:#f87171; text-align:center; grid-column:1/-1;">Erro ao carregar produtos</p>';
      }
    }
    
    // Open modal for new product
    document.getElementById('btn-new').onclick = () => {
      form.reset();
      document.getElementById('product-id').value = '';
      document.getElementById('modal-title').textContent = 'Novo Produto';
      modal.style.display = 'flex';
    };
    
    // Close modal
    document.getElementById('btn-cancel').onclick = () => {
      modal.style.display = 'none';
    };
    
    // Edit product
    window.editProduct = async (id) => {
      try {
        const res = await fetch(\`\${API_URL}/api/products\`);
        const products = await res.json();
        const product = products.find(p => p.id === id);
        
        if (!product) return alert('Produto não encontrado');
        
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-image').value = product.image_url || '';
        document.getElementById('product-desc').value = product.description || '';
        
        document.getElementById('modal-title').textContent = 'Editar Produto';
        modal.style.display = 'flex';
      } catch (e) {
        console.error('Error:', e);
      }
    };
    
    // Delete product
    window.deleteProduct = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este produto?')) return;
      
      try {
        await fetch(\`\${API_URL}/api/products/\${id}\`, { method: 'DELETE' });
        loadProducts();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro ao excluir produto');
      }
    };
    
    // Submit form
    form.onsubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const id = data.get('id');
      
      const payload = {
        name: data.get('name'),
        price: parseFloat(data.get('price')),
        stock: parseInt(data.get('stock')) || 0,
        image_url: data.get('image_url') || null,
        description: data.get('description') || null
      };
      
      try {
        const url = id ? \`\${API_URL}/api/products/\${id}\` : \`\${API_URL}/api/products\`;
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error('Failed');
        
        modal.style.display = 'none';
        loadProducts();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro ao salvar produto');
      }
    };
    
    loadProducts();
  <\/script> `], ["  ", `<nav style="background:#0f172a; padding:1rem 5%; display:flex; gap:1rem; border-bottom:1px solid #1e293b; flex-wrap:wrap;" data-astro-cid-lz3lldbl> <a href="/admin" class="nav-link" data-astro-cid-lz3lldbl>📊 Dashboard</a> <a href="/admin/cupons" class="nav-link" data-astro-cid-lz3lldbl>🎟️ Cupons</a> <a href="/admin/produtos" class="nav-link active" data-astro-cid-lz3lldbl>🛍️ Produtos</a> <a href="/admin/relatorio" class="nav-link" data-astro-cid-lz3lldbl>📈 Relatórios</a> <a href="/criar-bot" class="nav-link" data-astro-cid-lz3lldbl>🤖 Criar Bot</a> </nav> <div class="page-container" data-astro-cid-lz3lldbl> <header class="page-header" data-astro-cid-lz3lldbl> <h1 data-astro-cid-lz3lldbl>🛍️ Produtos</h1> <button id="btn-new" class="btn-primary" data-astro-cid-lz3lldbl>+ Novo Produto</button> </header> <!-- Modal --> <div id="modal" class="modal" style="display:none;" data-astro-cid-lz3lldbl> <div class="modal-content" data-astro-cid-lz3lldbl> <h2 id="modal-title" data-astro-cid-lz3lldbl>Novo Produto</h2> <form id="form-product" data-astro-cid-lz3lldbl> <input type="hidden" name="id" id="product-id" data-astro-cid-lz3lldbl> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Nome do Produto *</label> <input type="text" name="name" id="product-name" placeholder="Ex: Camiseta Neon" required data-astro-cid-lz3lldbl> </div> <div class="field-row" data-astro-cid-lz3lldbl> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Preço (R$) *</label> <input type="number" name="price" id="product-price" placeholder="99.90" step="0.01" required data-astro-cid-lz3lldbl> </div> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Estoque</label> <input type="number" name="stock" id="product-stock" placeholder="10" value="10" data-astro-cid-lz3lldbl> </div> </div> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>URL da Imagem</label> <input type="url" name="image_url" id="product-image" placeholder="https://..." data-astro-cid-lz3lldbl> </div> <div class="field" data-astro-cid-lz3lldbl> <label data-astro-cid-lz3lldbl>Descrição</label> <textarea name="description" id="product-desc" rows="3" placeholder="Descrição do produto..." data-astro-cid-lz3lldbl></textarea> </div> <div class="modal-actions" data-astro-cid-lz3lldbl> <button type="button" id="btn-cancel" class="btn-secondary" data-astro-cid-lz3lldbl>Cancelar</button> <button type="submit" class="btn-primary" data-astro-cid-lz3lldbl>Salvar</button> </div> </form> </div> </div> <!-- Products Grid --> <div id="products-grid" class="products-grid" data-astro-cid-lz3lldbl> <p style="color:#64748b; text-align:center; grid-column:1/-1; padding:4rem;" data-astro-cid-lz3lldbl>Carregando...</p> </div> </div> <script>
    const API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://api.getnexo.com.br';
    
    const modal = document.getElementById('modal');
    const form = document.getElementById('form-product');
    const grid = document.getElementById('products-grid');
    
    async function loadProducts() {
      try {
        const res = await fetch(\\\`\\\${API_URL}/api/products\\\`);
        const products = await res.json();
        
        if (products.length === 0) {
          grid.innerHTML = '<p style="color:#64748b; text-align:center; grid-column:1/-1; padding:4rem;">Nenhum produto cadastrado</p>';
          return;
        }
        
        grid.innerHTML = products.map(p => \\\`
          <div class="product-card" data-id="\\\${p.id}">
            <img src="\\\${p.image_url || 'https://placehold.co/200x200/1e293b/64748b?text=Sem+Imagem'}" alt="\\\${p.name}" class="product-image" />
            <div class="product-info">
              <h3>\\\${p.name}</h3>
              <p class="product-price">R$ \\\${p.price.toFixed(2)}</p>
              <p class="product-stock">Estoque: \\\${p.stock || 0}</p>
            </div>
            <div class="product-actions">
              <button onclick="editProduct(\\\${p.id})" class="btn-icon" title="Editar">✏️</button>
              <button onclick="deleteProduct(\\\${p.id})" class="btn-icon" title="Excluir">🗑️</button>
            </div>
          </div>
        \\\`).join('');
      } catch (e) {
        console.error('Error:', e);
        grid.innerHTML = '<p style="color:#f87171; text-align:center; grid-column:1/-1;">Erro ao carregar produtos</p>';
      }
    }
    
    // Open modal for new product
    document.getElementById('btn-new').onclick = () => {
      form.reset();
      document.getElementById('product-id').value = '';
      document.getElementById('modal-title').textContent = 'Novo Produto';
      modal.style.display = 'flex';
    };
    
    // Close modal
    document.getElementById('btn-cancel').onclick = () => {
      modal.style.display = 'none';
    };
    
    // Edit product
    window.editProduct = async (id) => {
      try {
        const res = await fetch(\\\`\\\${API_URL}/api/products\\\`);
        const products = await res.json();
        const product = products.find(p => p.id === id);
        
        if (!product) return alert('Produto não encontrado');
        
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-image').value = product.image_url || '';
        document.getElementById('product-desc').value = product.description || '';
        
        document.getElementById('modal-title').textContent = 'Editar Produto';
        modal.style.display = 'flex';
      } catch (e) {
        console.error('Error:', e);
      }
    };
    
    // Delete product
    window.deleteProduct = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este produto?')) return;
      
      try {
        await fetch(\\\`\\\${API_URL}/api/products/\\\${id}\\\`, { method: 'DELETE' });
        loadProducts();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro ao excluir produto');
      }
    };
    
    // Submit form
    form.onsubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const id = data.get('id');
      
      const payload = {
        name: data.get('name'),
        price: parseFloat(data.get('price')),
        stock: parseInt(data.get('stock')) || 0,
        image_url: data.get('image_url') || null,
        description: data.get('description') || null
      };
      
      try {
        const url = id ? \\\`\\\${API_URL}/api/products/\\\${id}\\\` : \\\`\\\${API_URL}/api/products\\\`;
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error('Failed');
        
        modal.style.display = 'none';
        loadProducts();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro ao salvar produto');
      }
    };
    
    loadProducts();
  <\/script> `])), maybeRenderHead()) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/produtos.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/produtos.astro";
const $$url = "/admin/produtos";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Produtos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
