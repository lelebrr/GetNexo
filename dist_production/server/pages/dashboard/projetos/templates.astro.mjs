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
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Templates - GetNexo Pro", "data-astro-cid-lvhrifha": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-lvhrifha> <!-- Header --> <div class="templates-header" data-astro-cid-lvhrifha> <h1 data-astro-cid-lvhrifha>📋 Templates de Projetos</h1> <p data-astro-cid-lvhrifha>Escolha um template pré-configurado para acelerar o desenvolvimento</p> </div> <!-- Filters --> <div class="filters-section" data-astro-cid-lvhrifha> <div class="filters-grid" data-astro-cid-lvhrifha> <div class="filter-group" data-astro-cid-lvhrifha> <label class="filter-label" data-astro-cid-lvhrifha>Categoria</label> <select class="filter-select" id="category-filter" data-astro-cid-lvhrifha> <option value="all" selected data-astro-cid-lvhrifha>Todas as categorias</option> <option value="web" data-astro-cid-lvhrifha>Web</option> <option value="mobile" data-astro-cid-lvhrifha>Mobile</option> <option value="ecommerce" data-astro-cid-lvhrifha>E-commerce</option> <option value="dashboard" data-astro-cid-lvhrifha>Dashboard</option> <option value="api" data-astro-cid-lvhrifha>API</option> </select> </div> <div class="filter-group" data-astro-cid-lvhrifha> <label class="filter-label" data-astro-cid-lvhrifha>Tecnologia</label> <select class="filter-select" id="tech-filter" data-astro-cid-lvhrifha> <option value="all" selected data-astro-cid-lvhrifha>Todas as tecnologias</option> <option value="react" data-astro-cid-lvhrifha>React</option> <option value="vue" data-astro-cid-lvhrifha>Vue.js</option> <option value="angular" data-astro-cid-lvhrifha>Angular</option> <option value="node" data-astro-cid-lvhrifha>Node.js</option> <option value="python" data-astro-cid-lvhrifha>Python</option> </select> </div> <div class="filter-group" data-astro-cid-lvhrifha> <button class="btn btn-primary" onclick="applyFilters()" data-astro-cid-lvhrifha>Aplicar Filtros</button> </div> </div> </div> <!-- Templates Grid --> <div class="templates-grid" id="templates-grid" data-astro-cid-lvhrifha> <!-- Templates will be loaded here --> </div> </div> <script>
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
            const grid = document.getElementById('templates-grid');

            if (templates.length === 0) {
                grid.innerHTML = \`
                    <div class="empty-state">
                        <h3>🚀 Novos templates em breve</h3>
                        <p>Estamos trabalhando em mais templates para você.</p>
                        <a href="/dashboard/projetos/novo" class="btn btn-primary" style="margin-top: 1rem;">Criar Projeto Personalizado</a>
                    </div>
                \`;
                return;
            }

            grid.innerHTML = templates.map(template => \`
                <div class="template-card">
                    <div class="template-header">
                        <div class="template-icon">\${template.icon}</div>
                        <div class="template-title">\${template.name}</div>
                    </div>
                    <div class="template-meta">
                        <div class="meta-item">⭐ \${template.rating || 4.5}</div>
                        <div class="meta-item">📦 \${template.installs || 0} instalações</div>
                        <div class="meta-item">⏱️ \${template.setupTime || '5 min'}</div>
                    </div>
                    <div class="template-desc">\${template.description}</div>
                    <div class="template-features">
                        \${template.features.map(feature => \`<span class="feature-tag">\${feature}</span>\`).join('')}
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-outline" onclick="previewTemplate('\${template.id}')">Prévia</button>
                        <button class="btn btn-primary" onclick="useTemplate('\${template.id}')">Usar Template</button>
                    </div>
                </div>
            \`).join('');
        }

        function loadMockTemplates() {
            const mockTemplates = [
                {
                    id: 'ecommerce-react',
                    name: 'E-commerce React',
                    description: 'Loja online completa com React, Stripe e painel administrativo',
                    icon: '🛍️',
                    rating: 4.8,
                    installs: 1250,
                    setupTime: '10 min',
                    features: ['React', 'Stripe', 'Admin Panel', 'Responsive']
                },
                {
                    id: 'blog-nextjs',
                    name: 'Blog Next.js',
                    description: 'Plataforma de blogging moderna com Next.js e MDX',
                    icon: '📝',
                    rating: 4.6,
                    installs: 890,
                    setupTime: '8 min',
                    features: ['Next.js', 'MDX', 'SEO', 'Dark Mode']
                },
                {
                    id: 'dashboard-vue',
                    name: 'Dashboard Vue.js',
                    description: 'Painel administrativo com Vue.js, Chart.js e autenticação',
                    icon: '📊',
                    rating: 4.7,
                    installs: 756,
                    setupTime: '12 min',
                    features: ['Vue.js', 'Chart.js', 'Auth', 'API']
                },
                {
                    id: 'api-node',
                    name: 'API REST Node.js',
                    description: 'API backend robusta com Express, JWT e documentação',
                    icon: '🔌',
                    rating: 4.9,
                    installs: 2100,
                    setupTime: '15 min',
                    features: ['Express', 'JWT', 'Swagger', 'PostgreSQL']
                },
                {
                    id: 'landing-tailwind',
                    name: 'Landing Page',
                    description: 'Página de captura otimizada com Tailwind CSS',
                    icon: '🎯',
                    rating: 4.5,
                    installs: 1450,
                    setupTime: '5 min',
                    features: ['Tailwind', 'Responsive', 'SEO', 'Fast']
                },
                {
                    id: 'mobile-react-native',
                    name: 'App Mobile React Native',
                    description: 'Aplicativo móvel cross-platform com React Native',
                    icon: '📱',
                    rating: 4.4,
                    installs: 634,
                    setupTime: '20 min',
                    features: ['React Native', 'Expo', 'iOS', 'Android']
                }
            ];

            renderTemplates(mockTemplates);
        }

        function previewTemplate(templateId) {
            window.open(\`/templates/\${templateId}/preview\`, '_blank');
        }

        function useTemplate(templateId) {
            window.location.href = \`/dashboard/projetos/novo?template=\${templateId}\`;
        }

        function applyFilters() {
            const category = document.getElementById('category-filter').value;
            const tech = document.getElementById('tech-filter').value;

            console.log('Aplicando filtros:', { category, tech });
            // Reload templates with filters
            loadTemplates();
        }

        // Initialize
        loadTemplates();
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-lvhrifha> <!-- Header --> <div class="templates-header" data-astro-cid-lvhrifha> <h1 data-astro-cid-lvhrifha>📋 Templates de Projetos</h1> <p data-astro-cid-lvhrifha>Escolha um template pré-configurado para acelerar o desenvolvimento</p> </div> <!-- Filters --> <div class="filters-section" data-astro-cid-lvhrifha> <div class="filters-grid" data-astro-cid-lvhrifha> <div class="filter-group" data-astro-cid-lvhrifha> <label class="filter-label" data-astro-cid-lvhrifha>Categoria</label> <select class="filter-select" id="category-filter" data-astro-cid-lvhrifha> <option value="all" selected data-astro-cid-lvhrifha>Todas as categorias</option> <option value="web" data-astro-cid-lvhrifha>Web</option> <option value="mobile" data-astro-cid-lvhrifha>Mobile</option> <option value="ecommerce" data-astro-cid-lvhrifha>E-commerce</option> <option value="dashboard" data-astro-cid-lvhrifha>Dashboard</option> <option value="api" data-astro-cid-lvhrifha>API</option> </select> </div> <div class="filter-group" data-astro-cid-lvhrifha> <label class="filter-label" data-astro-cid-lvhrifha>Tecnologia</label> <select class="filter-select" id="tech-filter" data-astro-cid-lvhrifha> <option value="all" selected data-astro-cid-lvhrifha>Todas as tecnologias</option> <option value="react" data-astro-cid-lvhrifha>React</option> <option value="vue" data-astro-cid-lvhrifha>Vue.js</option> <option value="angular" data-astro-cid-lvhrifha>Angular</option> <option value="node" data-astro-cid-lvhrifha>Node.js</option> <option value="python" data-astro-cid-lvhrifha>Python</option> </select> </div> <div class="filter-group" data-astro-cid-lvhrifha> <button class="btn btn-primary" onclick="applyFilters()" data-astro-cid-lvhrifha>Aplicar Filtros</button> </div> </div> </div> <!-- Templates Grid --> <div class="templates-grid" id="templates-grid" data-astro-cid-lvhrifha> <!-- Templates will be loaded here --> </div> </div> <script>
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
            const grid = document.getElementById('templates-grid');

            if (templates.length === 0) {
                grid.innerHTML = \\\`
                    <div class="empty-state">
                        <h3>🚀 Novos templates em breve</h3>
                        <p>Estamos trabalhando em mais templates para você.</p>
                        <a href="/dashboard/projetos/novo" class="btn btn-primary" style="margin-top: 1rem;">Criar Projeto Personalizado</a>
                    </div>
                \\\`;
                return;
            }

            grid.innerHTML = templates.map(template => \\\`
                <div class="template-card">
                    <div class="template-header">
                        <div class="template-icon">\\\${template.icon}</div>
                        <div class="template-title">\\\${template.name}</div>
                    </div>
                    <div class="template-meta">
                        <div class="meta-item">⭐ \\\${template.rating || 4.5}</div>
                        <div class="meta-item">📦 \\\${template.installs || 0} instalações</div>
                        <div class="meta-item">⏱️ \\\${template.setupTime || '5 min'}</div>
                    </div>
                    <div class="template-desc">\\\${template.description}</div>
                    <div class="template-features">
                        \\\${template.features.map(feature => \\\`<span class="feature-tag">\\\${feature}</span>\\\`).join('')}
                    </div>
                    <div class="template-actions">
                        <button class="btn btn-outline" onclick="previewTemplate('\\\${template.id}')">Prévia</button>
                        <button class="btn btn-primary" onclick="useTemplate('\\\${template.id}')">Usar Template</button>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadMockTemplates() {
            const mockTemplates = [
                {
                    id: 'ecommerce-react',
                    name: 'E-commerce React',
                    description: 'Loja online completa com React, Stripe e painel administrativo',
                    icon: '🛍️',
                    rating: 4.8,
                    installs: 1250,
                    setupTime: '10 min',
                    features: ['React', 'Stripe', 'Admin Panel', 'Responsive']
                },
                {
                    id: 'blog-nextjs',
                    name: 'Blog Next.js',
                    description: 'Plataforma de blogging moderna com Next.js e MDX',
                    icon: '📝',
                    rating: 4.6,
                    installs: 890,
                    setupTime: '8 min',
                    features: ['Next.js', 'MDX', 'SEO', 'Dark Mode']
                },
                {
                    id: 'dashboard-vue',
                    name: 'Dashboard Vue.js',
                    description: 'Painel administrativo com Vue.js, Chart.js e autenticação',
                    icon: '📊',
                    rating: 4.7,
                    installs: 756,
                    setupTime: '12 min',
                    features: ['Vue.js', 'Chart.js', 'Auth', 'API']
                },
                {
                    id: 'api-node',
                    name: 'API REST Node.js',
                    description: 'API backend robusta com Express, JWT e documentação',
                    icon: '🔌',
                    rating: 4.9,
                    installs: 2100,
                    setupTime: '15 min',
                    features: ['Express', 'JWT', 'Swagger', 'PostgreSQL']
                },
                {
                    id: 'landing-tailwind',
                    name: 'Landing Page',
                    description: 'Página de captura otimizada com Tailwind CSS',
                    icon: '🎯',
                    rating: 4.5,
                    installs: 1450,
                    setupTime: '5 min',
                    features: ['Tailwind', 'Responsive', 'SEO', 'Fast']
                },
                {
                    id: 'mobile-react-native',
                    name: 'App Mobile React Native',
                    description: 'Aplicativo móvel cross-platform com React Native',
                    icon: '📱',
                    rating: 4.4,
                    installs: 634,
                    setupTime: '20 min',
                    features: ['React Native', 'Expo', 'iOS', 'Android']
                }
            ];

            renderTemplates(mockTemplates);
        }

        function previewTemplate(templateId) {
            window.open(\\\`/templates/\\\${templateId}/preview\\\`, '_blank');
        }

        function useTemplate(templateId) {
            window.location.href = \\\`/dashboard/projetos/novo?template=\\\${templateId}\\\`;
        }

        function applyFilters() {
            const category = document.getElementById('category-filter').value;
            const tech = document.getElementById('tech-filter').value;

            console.log('Aplicando filtros:', { category, tech });
            // Reload templates with filters
            loadTemplates();
        }

        // Initialize
        loadTemplates();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/projetos/templates/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/projetos/templates/index.astro";
const $$url = "/dashboard/projetos/templates";
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
