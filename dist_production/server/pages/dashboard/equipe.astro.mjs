import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
/* empty css                                    */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Equipe = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Gestão de Equipe | OmniNexo", "data-astro-cid-gl5zvw77": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;" data-astro-cid-gl5zvw77> <div data-astro-cid-gl5zvw77> <h1 style="font-size:2rem; font-weight:800; color:white; margin:0;" data-astro-cid-gl5zvw77>Time & Permissões</h1> <p style="color:#94a3b8; margin:0.5rem 0 0;" data-astro-cid-gl5zvw77>Gerencie o acesso dos seus atendentes e gestores.</p> </div> <button onclick="openInviteModal()" style="background:var(--neon-blue); color:black; font-weight:800; border:none; padding:12px 24px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 0 20px rgba(0,212,255,0.2); transition:0.3s;" data-astro-cid-gl5zvw77> <span data-astro-cid-gl5zvw77>+</span> Convidar Membro
</button> </div>  <div class="glass-panel" style="padding:0; overflow:hidden;" data-astro-cid-gl5zvw77> <table style="width:100%; border-collapse:collapse;" data-astro-cid-gl5zvw77> <thead data-astro-cid-gl5zvw77> <tr style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.05);" data-astro-cid-gl5zvw77> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Usuário</th> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Cargo</th> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Status</th> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Último Acesso</th> <th style="padding:1.5rem; text-align:right;" data-astro-cid-gl5zvw77></th> </tr> </thead> <tbody id="team-list" data-astro-cid-gl5zvw77> <!-- Injected via JS --> </tbody> </table> </div>  <div id="invite-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); backdrop-filter:blur(5px); z-index:1000; display:none; align-items:center; justify-content:center;" data-astro-cid-gl5zvw77> <div class="glass-panel" style="width:450px; padding:2rem; background:#0f172a; border:1px solid #334155; position:relative;" data-astro-cid-gl5zvw77> <button onclick="closeModal()" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#64748b; font-size:1.5rem; cursor:pointer;" data-astro-cid-gl5zvw77>&times;</button> <h2 style="margin:0 0 1.5rem; color:white;" data-astro-cid-gl5zvw77>Convidar Novo Membro</h2> <div style="margin-bottom:1rem;" data-astro-cid-gl5zvw77> <label style="display:block; color:#94a3b8; margin-bottom:0.5rem; font-size:0.9rem;" data-astro-cid-gl5zvw77>E-mail Corporativo</label> <input type="email" id="invite-email" placeholder="nome@empresa.com" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid #334155; padding:10px; color:white; border-radius:8px; outline:none;" data-astro-cid-gl5zvw77> </div> <div style="margin-bottom:1.5rem;" data-astro-cid-gl5zvw77> <label style="display:block; color:#94a3b8; margin-bottom:0.5rem; font-size:0.9rem;" data-astro-cid-gl5zvw77>Função</label> <div style="display:flex; gap:10px;" data-astro-cid-gl5zvw77> <button class="role-btn active" onclick="selectRole('agent', this)" data-astro-cid-gl5zvw77> <div style="font-weight:700;" data-astro-cid-gl5zvw77>Atendente</div> <div style="font-size:0.7rem; opacity:0.7;" data-astro-cid-gl5zvw77>Chat apenas</div> </button> <button class="role-btn" onclick="selectRole('admin', this)" data-astro-cid-gl5zvw77> <div style="font-weight:700;" data-astro-cid-gl5zvw77>Admin</div> <div style="font-size:0.7rem; opacity:0.7;" data-astro-cid-gl5zvw77>Acesso total</div> </button> <button class="role-btn" onclick="selectRole('manager', this)" data-astro-cid-gl5zvw77> <div style="font-weight:700;" data-astro-cid-gl5zvw77>Gerente</div> <div style="font-size:0.7rem; opacity:0.7;" data-astro-cid-gl5zvw77>Relatórios</div> </button> </div> </div> <button onclick="sendInvite()" style="width:100%; padding:12px; background:var(--neon-green); color:black; font-weight:800; border:none; border-radius:8px; cursor:pointer;" data-astro-cid-gl5zvw77>
Enviar Convite 📨
</button> </div> </div>  <script>
        const users = [
            { id: 1, name: 'Leandro (Você)', email: 'admin@getnexo.com', role: 'admin', status: 'online', last: 'Agora' },
            { id: 2, name: 'Mariana Silva', email: 'mari@vendas.com', role: 'manager', status: 'offline', last: 'Há 2h' },
            { id: 3, name: 'João Bot', email: 'joao@atendimento.com', role: 'agent', status: 'busy', last: 'Há 5min' },
        ];

        let selectedRole = 'agent';

        function render() {
            const list = document.getElementById('team-list');
            list.innerHTML = users.map(u => \`
                <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                    <td style="padding:1.5rem;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <img src="https://ui-avatars.com/api/?name=\${u.name}&background=random" style="width:40px; height:40px; border-radius:50%;" />
                            <div>
                                <div style="color:white; font-weight:700;">\${u.name}</div>
                                <div style="color:#64748b; font-size:0.85rem;">\${u.email}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding:1.5rem;">
                        <span class="role-badge role-\${u.role}">\${u.role}</span>
                    </td>
                    <td style="padding:1.5rem;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <div style="width:8px; height:8px; border-radius:50%; background:\${u.status === 'online' ? '#10b981' : u.status === 'busy' ? '#facc15' : '#64748b'};"></div>
                            <span style="color:#94a3b8; font-size:0.85rem; text-transform:capitalize;">\${u.status}</span>
                        </div>
                    </td>
                    <td style="padding:1.5rem; color:#94a3b8; font-size:0.9rem;">\${u.last}</td>
                    <td style="padding:1.5rem; text-align:right;">
                        <button style="background:none; border:none; color:#64748b; cursor:pointer; font-size:1.2rem; margin-right:10px;">✏️</button>
                        <button onclick="removeUser(\${u.id})" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:1.2rem;">🗑️</button>
                    </td>
                </tr>
            \`).join('');
        }

        // Modal Logic
        const modal = document.getElementById('invite-modal');
        window.openInviteModal = () => modal.style.display = 'flex';
        window.closeModal = () => modal.style.display = 'none';

        window.selectRole = (role, btn) => {
            selectedRole = role;
            document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };

        window.sendInvite = () => {
            const email = document.getElementById('invite-email').value;
            if (!email) return alert('Digite um e-mail!');
            
            // Mock API
            alert(\`Convite enviado para \${email} como \${selectedRole.toUpperCase()}!\`);
            users.push({ 
                id: Date.now(), 
                name: email.split('@')[0], 
                email, 
                role: selectedRole, 
                status: 'offline', 
                last: 'Convite Enviado' 
            });
            render();
            closeModal();
            document.getElementById('invite-email').value = '';
        };

        window.removeUser = (id) => {
            if (confirm('Remover usuário?')) {
                const idx = users.findIndex(u => u.id === id);
                if (idx > -1) {
                    users.splice(idx, 1);
                    render();
                }
            }
        };

        render();
    <\/script> `], [" ", `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;" data-astro-cid-gl5zvw77> <div data-astro-cid-gl5zvw77> <h1 style="font-size:2rem; font-weight:800; color:white; margin:0;" data-astro-cid-gl5zvw77>Time & Permissões</h1> <p style="color:#94a3b8; margin:0.5rem 0 0;" data-astro-cid-gl5zvw77>Gerencie o acesso dos seus atendentes e gestores.</p> </div> <button onclick="openInviteModal()" style="background:var(--neon-blue); color:black; font-weight:800; border:none; padding:12px 24px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 0 20px rgba(0,212,255,0.2); transition:0.3s;" data-astro-cid-gl5zvw77> <span data-astro-cid-gl5zvw77>+</span> Convidar Membro
</button> </div>  <div class="glass-panel" style="padding:0; overflow:hidden;" data-astro-cid-gl5zvw77> <table style="width:100%; border-collapse:collapse;" data-astro-cid-gl5zvw77> <thead data-astro-cid-gl5zvw77> <tr style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.05);" data-astro-cid-gl5zvw77> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Usuário</th> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Cargo</th> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Status</th> <th style="padding:1.5rem; text-align:left; color:#64748b; font-size:0.75rem; text-transform:uppercase;" data-astro-cid-gl5zvw77>Último Acesso</th> <th style="padding:1.5rem; text-align:right;" data-astro-cid-gl5zvw77></th> </tr> </thead> <tbody id="team-list" data-astro-cid-gl5zvw77> <!-- Injected via JS --> </tbody> </table> </div>  <div id="invite-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); backdrop-filter:blur(5px); z-index:1000; display:none; align-items:center; justify-content:center;" data-astro-cid-gl5zvw77> <div class="glass-panel" style="width:450px; padding:2rem; background:#0f172a; border:1px solid #334155; position:relative;" data-astro-cid-gl5zvw77> <button onclick="closeModal()" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#64748b; font-size:1.5rem; cursor:pointer;" data-astro-cid-gl5zvw77>&times;</button> <h2 style="margin:0 0 1.5rem; color:white;" data-astro-cid-gl5zvw77>Convidar Novo Membro</h2> <div style="margin-bottom:1rem;" data-astro-cid-gl5zvw77> <label style="display:block; color:#94a3b8; margin-bottom:0.5rem; font-size:0.9rem;" data-astro-cid-gl5zvw77>E-mail Corporativo</label> <input type="email" id="invite-email" placeholder="nome@empresa.com" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid #334155; padding:10px; color:white; border-radius:8px; outline:none;" data-astro-cid-gl5zvw77> </div> <div style="margin-bottom:1.5rem;" data-astro-cid-gl5zvw77> <label style="display:block; color:#94a3b8; margin-bottom:0.5rem; font-size:0.9rem;" data-astro-cid-gl5zvw77>Função</label> <div style="display:flex; gap:10px;" data-astro-cid-gl5zvw77> <button class="role-btn active" onclick="selectRole('agent', this)" data-astro-cid-gl5zvw77> <div style="font-weight:700;" data-astro-cid-gl5zvw77>Atendente</div> <div style="font-size:0.7rem; opacity:0.7;" data-astro-cid-gl5zvw77>Chat apenas</div> </button> <button class="role-btn" onclick="selectRole('admin', this)" data-astro-cid-gl5zvw77> <div style="font-weight:700;" data-astro-cid-gl5zvw77>Admin</div> <div style="font-size:0.7rem; opacity:0.7;" data-astro-cid-gl5zvw77>Acesso total</div> </button> <button class="role-btn" onclick="selectRole('manager', this)" data-astro-cid-gl5zvw77> <div style="font-weight:700;" data-astro-cid-gl5zvw77>Gerente</div> <div style="font-size:0.7rem; opacity:0.7;" data-astro-cid-gl5zvw77>Relatórios</div> </button> </div> </div> <button onclick="sendInvite()" style="width:100%; padding:12px; background:var(--neon-green); color:black; font-weight:800; border:none; border-radius:8px; cursor:pointer;" data-astro-cid-gl5zvw77>
Enviar Convite 📨
</button> </div> </div>  <script>
        const users = [
            { id: 1, name: 'Leandro (Você)', email: 'admin@getnexo.com', role: 'admin', status: 'online', last: 'Agora' },
            { id: 2, name: 'Mariana Silva', email: 'mari@vendas.com', role: 'manager', status: 'offline', last: 'Há 2h' },
            { id: 3, name: 'João Bot', email: 'joao@atendimento.com', role: 'agent', status: 'busy', last: 'Há 5min' },
        ];

        let selectedRole = 'agent';

        function render() {
            const list = document.getElementById('team-list');
            list.innerHTML = users.map(u => \\\`
                <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                    <td style="padding:1.5rem;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <img src="https://ui-avatars.com/api/?name=\\\${u.name}&background=random" style="width:40px; height:40px; border-radius:50%;" />
                            <div>
                                <div style="color:white; font-weight:700;">\\\${u.name}</div>
                                <div style="color:#64748b; font-size:0.85rem;">\\\${u.email}</div>
                            </div>
                        </div>
                    </td>
                    <td style="padding:1.5rem;">
                        <span class="role-badge role-\\\${u.role}">\\\${u.role}</span>
                    </td>
                    <td style="padding:1.5rem;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <div style="width:8px; height:8px; border-radius:50%; background:\\\${u.status === 'online' ? '#10b981' : u.status === 'busy' ? '#facc15' : '#64748b'};"></div>
                            <span style="color:#94a3b8; font-size:0.85rem; text-transform:capitalize;">\\\${u.status}</span>
                        </div>
                    </td>
                    <td style="padding:1.5rem; color:#94a3b8; font-size:0.9rem;">\\\${u.last}</td>
                    <td style="padding:1.5rem; text-align:right;">
                        <button style="background:none; border:none; color:#64748b; cursor:pointer; font-size:1.2rem; margin-right:10px;">✏️</button>
                        <button onclick="removeUser(\\\${u.id})" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:1.2rem;">🗑️</button>
                    </td>
                </tr>
            \\\`).join('');
        }

        // Modal Logic
        const modal = document.getElementById('invite-modal');
        window.openInviteModal = () => modal.style.display = 'flex';
        window.closeModal = () => modal.style.display = 'none';

        window.selectRole = (role, btn) => {
            selectedRole = role;
            document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };

        window.sendInvite = () => {
            const email = document.getElementById('invite-email').value;
            if (!email) return alert('Digite um e-mail!');
            
            // Mock API
            alert(\\\`Convite enviado para \\\${email} como \\\${selectedRole.toUpperCase()}!\\\`);
            users.push({ 
                id: Date.now(), 
                name: email.split('@')[0], 
                email, 
                role: selectedRole, 
                status: 'offline', 
                last: 'Convite Enviado' 
            });
            render();
            closeModal();
            document.getElementById('invite-email').value = '';
        };

        window.removeUser = (id) => {
            if (confirm('Remover usuário?')) {
                const idx = users.findIndex(u => u.id === id);
                if (idx > -1) {
                    users.splice(idx, 1);
                    render();
                }
            }
        };

        render();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/equipe.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/equipe.astro";
const $$url = "/dashboard/equipe";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Equipe,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
