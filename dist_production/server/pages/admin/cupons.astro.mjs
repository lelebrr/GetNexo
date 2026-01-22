import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
/* empty css                                    */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Cupons = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Cupons de Desconto | Admin GetNexo", "data-astro-cid-rqnejl6p": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="cupons-page" data-astro-cid-rqnejl6p> <header class="page-header" data-astro-cid-rqnejl6p> <h1 data-astro-cid-rqnejl6p>🎟️ Cupons de Desconto</h1> <button id="btn-new" class="btn-primary" data-astro-cid-rqnejl6p>+ Novo Cupom</button> </header> <!-- Create/Edit Form Modal --> <div id="modal" class="modal" style="display:none;" data-astro-cid-rqnejl6p> <div class="modal-content" data-astro-cid-rqnejl6p> <h2 id="modal-title" data-astro-cid-rqnejl6p>Novo Cupom</h2> <form id="form-coupon" data-astro-cid-rqnejl6p> <input type="hidden" name="id" id="coupon-id" data-astro-cid-rqnejl6p> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Código do Cupom *</label> <input type="text" name="code" id="coupon-code" placeholder="Ex: DESCONTO10" required data-astro-cid-rqnejl6p> </div> <div class="field-row" data-astro-cid-rqnejl6p> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Tipo de Desconto</label> <select name="discount_type" id="coupon-type" data-astro-cid-rqnejl6p> <option value="percentage" data-astro-cid-rqnejl6p>Porcentagem (%)</option> <option value="fixed" data-astro-cid-rqnejl6p>Valor Fixo (R$)</option> </select> </div> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Valor do Desconto *</label> <input type="number" name="discount_value" id="coupon-value" placeholder="10" step="0.01" required data-astro-cid-rqnejl6p> </div> </div> <div class="field-row" data-astro-cid-rqnejl6p> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Pedido Mínimo (R$)</label> <input type="number" name="min_order_value" id="coupon-min" placeholder="0" step="0.01" value="0" data-astro-cid-rqnejl6p> </div> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Máximo de Usos (0 = ilimitado)</label> <input type="number" name="max_uses" id="coupon-max" placeholder="0" value="0" data-astro-cid-rqnejl6p> </div> </div> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Data de Expiração</label> <input type="date" name="expires_at" id="coupon-expires" data-astro-cid-rqnejl6p> </div> <div class="field checkbox-field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p> <input type="checkbox" name="active" id="coupon-active" checked data-astro-cid-rqnejl6p>
Cupom Ativo
</label> </div> <div class="modal-actions" data-astro-cid-rqnejl6p> <button type="button" id="btn-cancel" class="btn-secondary" data-astro-cid-rqnejl6p>Cancelar</button> <button type="submit" class="btn-primary" data-astro-cid-rqnejl6p>Salvar</button> </div> </form> </div> </div> <!-- Coupons Table --> <div class="table-container" data-astro-cid-rqnejl6p> <table id="coupons-table" data-astro-cid-rqnejl6p> <thead data-astro-cid-rqnejl6p> <tr data-astro-cid-rqnejl6p> <th data-astro-cid-rqnejl6p>Código</th> <th data-astro-cid-rqnejl6p>Desconto</th> <th data-astro-cid-rqnejl6p>Mín. Pedido</th> <th data-astro-cid-rqnejl6p>Usos</th> <th data-astro-cid-rqnejl6p>Expira</th> <th data-astro-cid-rqnejl6p>Status</th> <th data-astro-cid-rqnejl6p>Ações</th> </tr> </thead> <tbody id="coupons-body" data-astro-cid-rqnejl6p> <tr data-astro-cid-rqnejl6p><td colspan="7" style="text-align:center; color:#64748b;" data-astro-cid-rqnejl6p>Carregando...</td></tr> </tbody> </table> </div> </div> <script>
    const API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://api.getnexo.com.br';
    
    const modal = document.getElementById('modal');
    const form = document.getElementById('form-coupon');
    const tbody = document.getElementById('coupons-body');
    
    // Load coupons
    async function loadCoupons() {
      try {
        const res = await fetch(\`\${API_URL}/api/coupons\`);
        const coupons = await res.json();
        
        if (coupons.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">Nenhum cupom cadastrado</td></tr>';
          return;
        }
        
        tbody.innerHTML = coupons.map(c => \`
          <tr data-id="\${c.id}">
            <td><code class="coupon-code">\${c.code}</code></td>
            <td>\${c.discount_type === 'percentage' ? c.discount_value + '%' : 'R$ ' + c.discount_value.toFixed(2)}</td>
            <td>R$ \${c.min_order_value.toFixed(2)}</td>
            <td>\${c.uses_count}\${c.max_uses > 0 ? ' / ' + c.max_uses : ''}</td>
            <td>\${c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : '—'}</td>
            <td><span class="status \${c.active ? 'active' : 'inactive'}">\${c.active ? 'Ativo' : 'Inativo'}</span></td>
            <td class="actions">
              <button onclick="editCoupon(\${c.id})" class="btn-icon" title="Editar">✏️</button>
              <button onclick="deleteCoupon(\${c.id})" class="btn-icon" title="Excluir">🗑️</button>
            </td>
          </tr>
        \`).join('');
      } catch (e) {
        console.error('Error loading coupons:', e);
        tbody.innerHTML = '<tr><td colspan="7" style="color:red;">Erro ao carregar cupons</td></tr>';
      }
    }
    
    // Open modal for new coupon
    document.getElementById('btn-new').onclick = () => {
      form.reset();
      document.getElementById('coupon-id').value = '';
      document.getElementById('modal-title').textContent = 'Novo Cupom';
      document.getElementById('coupon-active').checked = true;
      modal.style.display = 'flex';
    };
    
    // Close modal
    document.getElementById('btn-cancel').onclick = () => {
      modal.style.display = 'none';
    };
    
    // Edit coupon
    window.editCoupon = async (id) => {
      try {
        const res = await fetch(\`\${API_URL}/api/coupons\`);
        const coupons = await res.json();
        const coupon = coupons.find(c => c.id === id);
        
        if (!coupon) return alert('Cupom não encontrado');
        
        document.getElementById('coupon-id').value = coupon.id;
        document.getElementById('coupon-code').value = coupon.code;
        document.getElementById('coupon-type').value = coupon.discount_type;
        document.getElementById('coupon-value').value = coupon.discount_value;
        document.getElementById('coupon-min').value = coupon.min_order_value;
        document.getElementById('coupon-max').value = coupon.max_uses;
        document.getElementById('coupon-expires').value = coupon.expires_at ? coupon.expires_at.split('T')[0] : '';
        document.getElementById('coupon-active').checked = coupon.active;
        
        document.getElementById('modal-title').textContent = 'Editar Cupom';
        modal.style.display = 'flex';
      } catch (e) {
        console.error('Error:', e);
      }
    };
    
    // Delete coupon
    window.deleteCoupon = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
      
      try {
        await fetch(\`\${API_URL}/api/coupons/\${id}\`, { method: 'DELETE' });
        loadCoupons();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro ao excluir cupom');
      }
    };
    
    // Submit form (create or update)
    form.onsubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const id = data.get('id');
      
      const payload = {
        code: data.get('code'),
        discount_type: data.get('discount_type'),
        discount_value: parseFloat(data.get('discount_value')),
        min_order_value: parseFloat(data.get('min_order_value')) || 0,
        max_uses: parseInt(data.get('max_uses')) || 0,
        expires_at: data.get('expires_at') || null,
        active: document.getElementById('coupon-active').checked
      };
      
      try {
        const url = id ? \`\${API_URL}/api/coupons/\${id}\` : \`\${API_URL}/api/coupons\`;
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed');
        }
        
        modal.style.display = 'none';
        loadCoupons();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro: ' + e.message);
      }
    };
    
    // Initial load
    loadCoupons();
  <\/script> `], [" ", `<div class="cupons-page" data-astro-cid-rqnejl6p> <header class="page-header" data-astro-cid-rqnejl6p> <h1 data-astro-cid-rqnejl6p>🎟️ Cupons de Desconto</h1> <button id="btn-new" class="btn-primary" data-astro-cid-rqnejl6p>+ Novo Cupom</button> </header> <!-- Create/Edit Form Modal --> <div id="modal" class="modal" style="display:none;" data-astro-cid-rqnejl6p> <div class="modal-content" data-astro-cid-rqnejl6p> <h2 id="modal-title" data-astro-cid-rqnejl6p>Novo Cupom</h2> <form id="form-coupon" data-astro-cid-rqnejl6p> <input type="hidden" name="id" id="coupon-id" data-astro-cid-rqnejl6p> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Código do Cupom *</label> <input type="text" name="code" id="coupon-code" placeholder="Ex: DESCONTO10" required data-astro-cid-rqnejl6p> </div> <div class="field-row" data-astro-cid-rqnejl6p> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Tipo de Desconto</label> <select name="discount_type" id="coupon-type" data-astro-cid-rqnejl6p> <option value="percentage" data-astro-cid-rqnejl6p>Porcentagem (%)</option> <option value="fixed" data-astro-cid-rqnejl6p>Valor Fixo (R$)</option> </select> </div> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Valor do Desconto *</label> <input type="number" name="discount_value" id="coupon-value" placeholder="10" step="0.01" required data-astro-cid-rqnejl6p> </div> </div> <div class="field-row" data-astro-cid-rqnejl6p> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Pedido Mínimo (R$)</label> <input type="number" name="min_order_value" id="coupon-min" placeholder="0" step="0.01" value="0" data-astro-cid-rqnejl6p> </div> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Máximo de Usos (0 = ilimitado)</label> <input type="number" name="max_uses" id="coupon-max" placeholder="0" value="0" data-astro-cid-rqnejl6p> </div> </div> <div class="field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p>Data de Expiração</label> <input type="date" name="expires_at" id="coupon-expires" data-astro-cid-rqnejl6p> </div> <div class="field checkbox-field" data-astro-cid-rqnejl6p> <label data-astro-cid-rqnejl6p> <input type="checkbox" name="active" id="coupon-active" checked data-astro-cid-rqnejl6p>
Cupom Ativo
</label> </div> <div class="modal-actions" data-astro-cid-rqnejl6p> <button type="button" id="btn-cancel" class="btn-secondary" data-astro-cid-rqnejl6p>Cancelar</button> <button type="submit" class="btn-primary" data-astro-cid-rqnejl6p>Salvar</button> </div> </form> </div> </div> <!-- Coupons Table --> <div class="table-container" data-astro-cid-rqnejl6p> <table id="coupons-table" data-astro-cid-rqnejl6p> <thead data-astro-cid-rqnejl6p> <tr data-astro-cid-rqnejl6p> <th data-astro-cid-rqnejl6p>Código</th> <th data-astro-cid-rqnejl6p>Desconto</th> <th data-astro-cid-rqnejl6p>Mín. Pedido</th> <th data-astro-cid-rqnejl6p>Usos</th> <th data-astro-cid-rqnejl6p>Expira</th> <th data-astro-cid-rqnejl6p>Status</th> <th data-astro-cid-rqnejl6p>Ações</th> </tr> </thead> <tbody id="coupons-body" data-astro-cid-rqnejl6p> <tr data-astro-cid-rqnejl6p><td colspan="7" style="text-align:center; color:#64748b;" data-astro-cid-rqnejl6p>Carregando...</td></tr> </tbody> </table> </div> </div> <script>
    const API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080' 
      : 'https://api.getnexo.com.br';
    
    const modal = document.getElementById('modal');
    const form = document.getElementById('form-coupon');
    const tbody = document.getElementById('coupons-body');
    
    // Load coupons
    async function loadCoupons() {
      try {
        const res = await fetch(\\\`\\\${API_URL}/api/coupons\\\`);
        const coupons = await res.json();
        
        if (coupons.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">Nenhum cupom cadastrado</td></tr>';
          return;
        }
        
        tbody.innerHTML = coupons.map(c => \\\`
          <tr data-id="\\\${c.id}">
            <td><code class="coupon-code">\\\${c.code}</code></td>
            <td>\\\${c.discount_type === 'percentage' ? c.discount_value + '%' : 'R$ ' + c.discount_value.toFixed(2)}</td>
            <td>R$ \\\${c.min_order_value.toFixed(2)}</td>
            <td>\\\${c.uses_count}\\\${c.max_uses > 0 ? ' / ' + c.max_uses : ''}</td>
            <td>\\\${c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : '—'}</td>
            <td><span class="status \\\${c.active ? 'active' : 'inactive'}">\\\${c.active ? 'Ativo' : 'Inativo'}</span></td>
            <td class="actions">
              <button onclick="editCoupon(\\\${c.id})" class="btn-icon" title="Editar">✏️</button>
              <button onclick="deleteCoupon(\\\${c.id})" class="btn-icon" title="Excluir">🗑️</button>
            </td>
          </tr>
        \\\`).join('');
      } catch (e) {
        console.error('Error loading coupons:', e);
        tbody.innerHTML = '<tr><td colspan="7" style="color:red;">Erro ao carregar cupons</td></tr>';
      }
    }
    
    // Open modal for new coupon
    document.getElementById('btn-new').onclick = () => {
      form.reset();
      document.getElementById('coupon-id').value = '';
      document.getElementById('modal-title').textContent = 'Novo Cupom';
      document.getElementById('coupon-active').checked = true;
      modal.style.display = 'flex';
    };
    
    // Close modal
    document.getElementById('btn-cancel').onclick = () => {
      modal.style.display = 'none';
    };
    
    // Edit coupon
    window.editCoupon = async (id) => {
      try {
        const res = await fetch(\\\`\\\${API_URL}/api/coupons\\\`);
        const coupons = await res.json();
        const coupon = coupons.find(c => c.id === id);
        
        if (!coupon) return alert('Cupom não encontrado');
        
        document.getElementById('coupon-id').value = coupon.id;
        document.getElementById('coupon-code').value = coupon.code;
        document.getElementById('coupon-type').value = coupon.discount_type;
        document.getElementById('coupon-value').value = coupon.discount_value;
        document.getElementById('coupon-min').value = coupon.min_order_value;
        document.getElementById('coupon-max').value = coupon.max_uses;
        document.getElementById('coupon-expires').value = coupon.expires_at ? coupon.expires_at.split('T')[0] : '';
        document.getElementById('coupon-active').checked = coupon.active;
        
        document.getElementById('modal-title').textContent = 'Editar Cupom';
        modal.style.display = 'flex';
      } catch (e) {
        console.error('Error:', e);
      }
    };
    
    // Delete coupon
    window.deleteCoupon = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este cupom?')) return;
      
      try {
        await fetch(\\\`\\\${API_URL}/api/coupons/\\\${id}\\\`, { method: 'DELETE' });
        loadCoupons();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro ao excluir cupom');
      }
    };
    
    // Submit form (create or update)
    form.onsubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const id = data.get('id');
      
      const payload = {
        code: data.get('code'),
        discount_type: data.get('discount_type'),
        discount_value: parseFloat(data.get('discount_value')),
        min_order_value: parseFloat(data.get('min_order_value')) || 0,
        max_uses: parseInt(data.get('max_uses')) || 0,
        expires_at: data.get('expires_at') || null,
        active: document.getElementById('coupon-active').checked
      };
      
      try {
        const url = id ? \\\`\\\${API_URL}/api/coupons/\\\${id}\\\` : \\\`\\\${API_URL}/api/coupons\\\`;
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed');
        }
        
        modal.style.display = 'none';
        loadCoupons();
      } catch (e) {
        console.error('Error:', e);
        alert('Erro: ' + e.message);
      }
    };
    
    // Initial load
    loadCoupons();
  <\/script> `])), maybeRenderHead()) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/cupons.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/cupons.astro";
const $$url = "/admin/cupons";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Cupons,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
