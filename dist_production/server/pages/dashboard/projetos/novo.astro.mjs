import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                      */
import { renderers } from "../../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Novo Projeto - GetNexo Pro", "data-astro-cid-xmiomamf": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1200px; margin: 0 auto;" data-astro-cid-xmiomamf> <!-- Header --> <div class="new-project-header" data-astro-cid-xmiomamf> <h1 data-astro-cid-xmiomamf>🚀 Criar Novo Projeto</h1> <p data-astro-cid-xmiomamf>Inicie seu projeto do zero ou use um template pré-configurado</p> </div> <!-- Tabs --> <div class="tabs" data-astro-cid-xmiomamf> <div class="tab active" onclick="showTab('template')" data-astro-cid-xmiomamf>Usar Template</div> <div class="tab" onclick="showTab('custom')" data-astro-cid-xmiomamf>Projeto Personalizado</div> </div> <form class="project-form" id="project-form" data-astro-cid-xmiomamf> <!-- Template Tab --> <div class="tab-content active" id="template-tab" data-astro-cid-xmiomamf> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>📋 Escolha um Template</h3> <div class="template-cards" id="template-cards" data-astro-cid-xmiomamf> <!-- Templates will be loaded here --> </div> </div> </div> <!-- Custom Project Tab --> <div class="tab-content" id="custom-tab" data-astro-cid-xmiomamf> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>📝 Informações Básicas</h3> <div class="form-grid" data-astro-cid-xmiomamf> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Nome do Projeto <span class="required" data-astro-cid-xmiomamf>*</span></label> <input type="text" class="form-input" id="project-name" required data-astro-cid-xmiomamf> <div class="help-text" data-astro-cid-xmiomamf>Escolha um nome descritivo para seu projeto</div> </div> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Categoria</label> <select class="form-select" id="project-category" data-astro-cid-xmiomamf> <option value="web" data-astro-cid-xmiomamf>Web</option> <option value="mobile" data-astro-cid-xmiomamf>Mobile</option> <option value="desktop" data-astro-cid-xmiomamf>Desktop</option> <option value="api" data-astro-cid-xmiomamf>API</option> <option value="other" data-astro-cid-xmiomamf>Outro</option> </select> </div> </div> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Descrição <span class="required" data-astro-cid-xmiomamf>*</span></label> <textarea class="form-textarea" id="project-description" placeholder="Descreva seu projeto..." required data-astro-cid-xmiomamf></textarea> <div class="help-text" data-astro-cid-xmiomamf>Forneça uma descrição detalhada do que o projeto irá fazer</div> </div> </div> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>⚙️ Configurações Técnicas</h3> <div class="form-grid" data-astro-cid-xmiomamf> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Tecnologia Principal</label> <select class="form-select" id="project-tech" data-astro-cid-xmiomamf> <option value="react" data-astro-cid-xmiomamf>React</option> <option value="vue" data-astro-cid-xmiomamf>Vue.js</option> <option value="angular" data-astro-cid-xmiomamf>Angular</option> <option value="node" data-astro-cid-xmiomamf>Node.js</option> <option value="python" data-astro-cid-xmiomamf>Python</option> <option value="php" data-astro-cid-xmiomamf>PHP</option> <option value="other" data-astro-cid-xmiomamf>Outro</option> </select> </div> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Prazo Estimado</label> <select class="form-select" id="project-deadline" data-astro-cid-xmiomamf> <option value="1-week" data-astro-cid-xmiomamf>1 semana</option> <option value="2-weeks" data-astro-cid-xmiomamf>2 semanas</option> <option value="1-month" selected data-astro-cid-xmiomamf>1 mês</option> <option value="3-months" data-astro-cid-xmiomamf>3 meses</option> <option value="6-months" data-astro-cid-xmiomamf>6 meses</option> </select> </div> </div> </div> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>🎯 Funcionalidades</h3> <div class="features-grid" data-astro-cid-xmiomamf> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="auth" data-astro-cid-xmiomamf> Autenticação de usuários
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="dashboard" data-astro-cid-xmiomamf> Dashboard administrativo
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="api" data-astro-cid-xmiomamf> API REST
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="database" data-astro-cid-xmiomamf> Banco de dados
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="notifications" data-astro-cid-xmiomamf> Notificações
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="analytics" data-astro-cid-xmiomamf> Analytics
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="payments" data-astro-cid-xmiomamf> Pagamentos
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="mobile" data-astro-cid-xmiomamf> Responsivo para mobile
</label> </div> </div> </div> <!-- Form Actions --> <div class="form-actions" data-astro-cid-xmiomamf> <a href="/dashboard/projetos" class="btn btn-outline" data-astro-cid-xmiomamf>Cancelar</a> <button type="submit" class="btn btn-primary" data-astro-cid-xmiomamf>Criar Projeto</button> </div> </form> </div> <script>
        let selectedTemplate = null;

        async function loadTemplates() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/project-templates\`, {
                    headers: { 'Authorization': token }
                });
                const templates = await res.json();
                renderTemplates(templates);
            } catch (e) {
                console.error('Error loading templates, using mock data', e);
                loadMockTemplates();
            }
        }

        function renderTemplates(templates) {
            const container = document.getElementById('template-cards');

            container.innerHTML = templates.map(template => \`
                <div class="template-card" onclick="selectTemplate('\${template.id}')">
                    <div class="template-header">
                        <div class="template-icon">\${template.icon}</div>
                        <div class="template-title">\${template.name}</div>
                    </div>
                    <div class="template-desc">\${template.description}</div>
                </div>
            \`).join('');
        }

        function loadMockTemplates() {
            const mockTemplates = [
                {
                    id: 'ecommerce',
                    name: 'E-commerce',
                    description: 'Loja online completa com catálogo, carrinho e pagamentos',
                    icon: '🛍️'
                },
                {
                    id: 'blog',
                    name: 'Blog',
                    description: 'Plataforma de blogging com CMS integrado',
                    icon: '📝'
                },
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    description: 'Painel administrativo com gráficos e métricas',
                    icon: '📊'
                },
                {
                    id: 'landing',
                    name: 'Landing Page',
                    description: 'Página de captura otimizada para conversões',
                    icon: '🎯'
                },
                {
                    id: 'api',
                    name: 'API Backend',
                    description: 'API RESTful com autenticação e documentação',
                    icon: '🔌'
                },
                {
                    id: 'mobile',
                    name: 'App Mobile',
                    description: 'Aplicativo híbrido React Native',
                    icon: '📱'
                }
            ];

            renderTemplates(mockTemplates);
        }

        function showTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        }

        function selectTemplate(templateId) {
            selectedTemplate = templateId;

            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });

            event.currentTarget.classList.add('selected');
        }

        document.getElementById('project-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const currentTab = document.querySelector('.tab.active').textContent.includes('Template') ? 'template' : 'custom';

            let projectData;

            if (currentTab === 'template') {
                if (!selectedTemplate) {
                    alert('Por favor, selecione um template.');
                    return;
                }
                projectData = { templateId: selectedTemplate };
            } else {
                const name = document.getElementById('project-name').value;
                const description = document.getElementById('project-description').value;
                const category = document.getElementById('project-category').value;
                const tech = document.getElementById('project-tech').value;
                const deadline = document.getElementById('project-deadline').value;

                if (!name || !description) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }

                const features = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value);

                projectData = {
                    name,
                    description,
                    category,
                    tech,
                    deadline,
                    features
                };
            }

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/projects\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(projectData)
                });

                if (res.ok) {
                    alert('Projeto criado com sucesso!');
                    window.location.href = '/dashboard/projetos';
                } else {
                    throw new Error('Erro ao criar projeto');
                }
            } catch (error) {
                console.error('Error creating project:', error);
                alert('Erro ao criar projeto. Tente novamente.');
            }
        });

        // Initialize
        loadTemplates();
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1200px; margin: 0 auto;" data-astro-cid-xmiomamf> <!-- Header --> <div class="new-project-header" data-astro-cid-xmiomamf> <h1 data-astro-cid-xmiomamf>🚀 Criar Novo Projeto</h1> <p data-astro-cid-xmiomamf>Inicie seu projeto do zero ou use um template pré-configurado</p> </div> <!-- Tabs --> <div class="tabs" data-astro-cid-xmiomamf> <div class="tab active" onclick="showTab('template')" data-astro-cid-xmiomamf>Usar Template</div> <div class="tab" onclick="showTab('custom')" data-astro-cid-xmiomamf>Projeto Personalizado</div> </div> <form class="project-form" id="project-form" data-astro-cid-xmiomamf> <!-- Template Tab --> <div class="tab-content active" id="template-tab" data-astro-cid-xmiomamf> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>📋 Escolha um Template</h3> <div class="template-cards" id="template-cards" data-astro-cid-xmiomamf> <!-- Templates will be loaded here --> </div> </div> </div> <!-- Custom Project Tab --> <div class="tab-content" id="custom-tab" data-astro-cid-xmiomamf> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>📝 Informações Básicas</h3> <div class="form-grid" data-astro-cid-xmiomamf> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Nome do Projeto <span class="required" data-astro-cid-xmiomamf>*</span></label> <input type="text" class="form-input" id="project-name" required data-astro-cid-xmiomamf> <div class="help-text" data-astro-cid-xmiomamf>Escolha um nome descritivo para seu projeto</div> </div> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Categoria</label> <select class="form-select" id="project-category" data-astro-cid-xmiomamf> <option value="web" data-astro-cid-xmiomamf>Web</option> <option value="mobile" data-astro-cid-xmiomamf>Mobile</option> <option value="desktop" data-astro-cid-xmiomamf>Desktop</option> <option value="api" data-astro-cid-xmiomamf>API</option> <option value="other" data-astro-cid-xmiomamf>Outro</option> </select> </div> </div> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Descrição <span class="required" data-astro-cid-xmiomamf>*</span></label> <textarea class="form-textarea" id="project-description" placeholder="Descreva seu projeto..." required data-astro-cid-xmiomamf></textarea> <div class="help-text" data-astro-cid-xmiomamf>Forneça uma descrição detalhada do que o projeto irá fazer</div> </div> </div> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>⚙️ Configurações Técnicas</h3> <div class="form-grid" data-astro-cid-xmiomamf> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Tecnologia Principal</label> <select class="form-select" id="project-tech" data-astro-cid-xmiomamf> <option value="react" data-astro-cid-xmiomamf>React</option> <option value="vue" data-astro-cid-xmiomamf>Vue.js</option> <option value="angular" data-astro-cid-xmiomamf>Angular</option> <option value="node" data-astro-cid-xmiomamf>Node.js</option> <option value="python" data-astro-cid-xmiomamf>Python</option> <option value="php" data-astro-cid-xmiomamf>PHP</option> <option value="other" data-astro-cid-xmiomamf>Outro</option> </select> </div> <div class="form-group" data-astro-cid-xmiomamf> <label class="form-label" data-astro-cid-xmiomamf>Prazo Estimado</label> <select class="form-select" id="project-deadline" data-astro-cid-xmiomamf> <option value="1-week" data-astro-cid-xmiomamf>1 semana</option> <option value="2-weeks" data-astro-cid-xmiomamf>2 semanas</option> <option value="1-month" selected data-astro-cid-xmiomamf>1 mês</option> <option value="3-months" data-astro-cid-xmiomamf>3 meses</option> <option value="6-months" data-astro-cid-xmiomamf>6 meses</option> </select> </div> </div> </div> <div class="form-section" data-astro-cid-xmiomamf> <h3 data-astro-cid-xmiomamf>🎯 Funcionalidades</h3> <div class="features-grid" data-astro-cid-xmiomamf> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="auth" data-astro-cid-xmiomamf> Autenticação de usuários
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="dashboard" data-astro-cid-xmiomamf> Dashboard administrativo
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="api" data-astro-cid-xmiomamf> API REST
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="database" data-astro-cid-xmiomamf> Banco de dados
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="notifications" data-astro-cid-xmiomamf> Notificações
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="analytics" data-astro-cid-xmiomamf> Analytics
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="payments" data-astro-cid-xmiomamf> Pagamentos
</label> <label class="feature-item" data-astro-cid-xmiomamf> <input type="checkbox" name="features" value="mobile" data-astro-cid-xmiomamf> Responsivo para mobile
</label> </div> </div> </div> <!-- Form Actions --> <div class="form-actions" data-astro-cid-xmiomamf> <a href="/dashboard/projetos" class="btn btn-outline" data-astro-cid-xmiomamf>Cancelar</a> <button type="submit" class="btn btn-primary" data-astro-cid-xmiomamf>Criar Projeto</button> </div> </form> </div> <script>
        let selectedTemplate = null;

        async function loadTemplates() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/project-templates\\\`, {
                    headers: { 'Authorization': token }
                });
                const templates = await res.json();
                renderTemplates(templates);
            } catch (e) {
                console.error('Error loading templates, using mock data', e);
                loadMockTemplates();
            }
        }

        function renderTemplates(templates) {
            const container = document.getElementById('template-cards');

            container.innerHTML = templates.map(template => \\\`
                <div class="template-card" onclick="selectTemplate('\\\${template.id}')">
                    <div class="template-header">
                        <div class="template-icon">\\\${template.icon}</div>
                        <div class="template-title">\\\${template.name}</div>
                    </div>
                    <div class="template-desc">\\\${template.description}</div>
                </div>
            \\\`).join('');
        }

        function loadMockTemplates() {
            const mockTemplates = [
                {
                    id: 'ecommerce',
                    name: 'E-commerce',
                    description: 'Loja online completa com catálogo, carrinho e pagamentos',
                    icon: '🛍️'
                },
                {
                    id: 'blog',
                    name: 'Blog',
                    description: 'Plataforma de blogging com CMS integrado',
                    icon: '📝'
                },
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    description: 'Painel administrativo com gráficos e métricas',
                    icon: '📊'
                },
                {
                    id: 'landing',
                    name: 'Landing Page',
                    description: 'Página de captura otimizada para conversões',
                    icon: '🎯'
                },
                {
                    id: 'api',
                    name: 'API Backend',
                    description: 'API RESTful com autenticação e documentação',
                    icon: '🔌'
                },
                {
                    id: 'mobile',
                    name: 'App Mobile',
                    description: 'Aplicativo híbrido React Native',
                    icon: '📱'
                }
            ];

            renderTemplates(mockTemplates);
        }

        function showTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            event.target.classList.add('active');
            document.getElementById(tab + '-tab').classList.add('active');
        }

        function selectTemplate(templateId) {
            selectedTemplate = templateId;

            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });

            event.currentTarget.classList.add('selected');
        }

        document.getElementById('project-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const currentTab = document.querySelector('.tab.active').textContent.includes('Template') ? 'template' : 'custom';

            let projectData;

            if (currentTab === 'template') {
                if (!selectedTemplate) {
                    alert('Por favor, selecione um template.');
                    return;
                }
                projectData = { templateId: selectedTemplate };
            } else {
                const name = document.getElementById('project-name').value;
                const description = document.getElementById('project-description').value;
                const category = document.getElementById('project-category').value;
                const tech = document.getElementById('project-tech').value;
                const deadline = document.getElementById('project-deadline').value;

                if (!name || !description) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }

                const features = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value);

                projectData = {
                    name,
                    description,
                    category,
                    tech,
                    deadline,
                    features
                };
            }

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/projects\\\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(projectData)
                });

                if (res.ok) {
                    alert('Projeto criado com sucesso!');
                    window.location.href = '/dashboard/projetos';
                } else {
                    throw new Error('Erro ao criar projeto');
                }
            } catch (error) {
                console.error('Error creating project:', error);
                alert('Erro ao criar projeto. Tente novamente.');
            }
        });

        // Initialize
        loadTemplates();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/projetos/novo/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/projetos/novo/index.astro";
const $$url = "/dashboard/projetos/novo";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
