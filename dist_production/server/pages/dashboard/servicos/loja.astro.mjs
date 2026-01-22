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
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Loja de Serviços - GetNexo Pro", "data-astro-cid-wfscarpc": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-wfscarpc> <!-- Header --> <div class="store-header" data-astro-cid-wfscarpc> <h1 data-astro-cid-wfscarpc>🛒 Loja de Serviços</h1> <p data-astro-cid-wfscarpc>Descubra e adquira serviços para impulsionar seus projetos</p> </div> <!-- Search --> <div class="search-section" data-astro-cid-wfscarpc> <input type="text" class="search-input" placeholder="Buscar serviços..." id="search-input" onkeyup="filterServices()" data-astro-cid-wfscarpc> </div> <!-- Categories --> <div class="categories-section" data-astro-cid-wfscarpc> <h2 style="color: white; margin: 0 0 1rem 0; font-size: 1.2rem;" data-astro-cid-wfscarpc>📂 Categorias</h2> <div class="categories-grid" data-astro-cid-wfscarpc> <div class="category-card active" onclick="filterByCategory('all')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>🌟</span> <div class="category-title" data-astro-cid-wfscarpc>Todos</div> <div class="category-desc" data-astro-cid-wfscarpc>Todos os serviços</div> </div> <div class="category-card" onclick="filterByCategory('marketing')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>📢</span> <div class="category-title" data-astro-cid-wfscarpc>Marketing</div> <div class="category-desc" data-astro-cid-wfscarpc>Automação e growth</div> </div> <div class="category-card" onclick="filterByCategory('development')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>💻</span> <div class="category-title" data-astro-cid-wfscarpc>Desenvolvimento</div> <div class="category-desc" data-astro-cid-wfscarpc>APIs e integrações</div> </div> <div class="category-card" onclick="filterByCategory('analytics')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>📊</span> <div class="category-title" data-astro-cid-wfscarpc>Analytics</div> <div class="category-desc" data-astro-cid-wfscarpc>Dados e relatórios</div> </div> <div class="category-card" onclick="filterByCategory('communication')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>💬</span> <div class="category-title" data-astro-cid-wfscarpc>Comunicação</div> <div class="category-desc" data-astro-cid-wfscarpc>Chat e messaging</div> </div> <div class="category-card" onclick="filterByCategory('automation')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>🤖</span> <div class="category-title" data-astro-cid-wfscarpc>Automação</div> <div class="category-desc" data-astro-cid-wfscarpc>Workflows inteligentes</div> </div> </div> </div> <!-- Services Grid --> <div class="services-grid" id="services-grid" data-astro-cid-wfscarpc> <!-- Services will be loaded here --> </div> </div> <script>
        let allServices = [];
        let currentCategory = 'all';

        async function loadServices() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/services/store\`, {
                    headers: { 'Authorization': token }
                });
                const services = await res.json();
                allServices = services;
                renderServices(services);
            } catch (e) {
                console.error('Error loading services, using mock data', e);
                loadMockServices();
            }
        }

        function renderServices(services) {
            const grid = document.getElementById('services-grid');

            if (services.length === 0) {
                grid.innerHTML = \`
                    <div class="empty-state">
                        <h3>🔍 Nenhum serviço encontrado</h3>
                        <p>Tente ajustar os filtros de busca.</p>
                    </div>
                \`;
                return;
            }

            grid.innerHTML = services.map(service => \`
                <div class="service-card \${service.popular ? 'popular' : ''}">
                    \${service.popular ? '<div class="popular-badge">Popular</div>' : ''}
                    <div class="service-header">
                        <div class="service-icon">\${service.icon}</div>
                        <div class="service-title">\${service.name}</div>
                        <div class="service-price">R$ \${service.price}</div>
                    </div>
                    <div class="service-desc">\${service.description}</div>
                    <div class="service-rating">
                        <div class="stars">\${'⭐'.repeat(Math.floor(service.rating))}</div>
                        <div class="rating-text">\${service.rating} (\${service.reviews} avaliações)</div>
                    </div>
                    <div class="service-features">
                        \${service.features.map(feature => \`<span class="feature-tag">\${feature}</span>\`).join('')}
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-outline" onclick="viewServiceDetails('\${service.id}')">Detalhes</button>
                        <button class="btn btn-primary" onclick="purchaseService('\${service.id}')">Adquirir</button>
                    </div>
                </div>
            \`).join('');
        }

        function loadMockServices() {
            const mockServices = [
                {
                    id: 'seo-automation',
                    name: 'SEO Automation Pro',
                    description: 'Otimização automática de SEO para seus sites com IA avançada',
                    price: 99,
                    rating: 4.8,
                    reviews: 234,
                    category: 'marketing',
                    icon: '🔍',
                    popular: true,
                    features: ['IA Avançada', 'Relatórios', '24/7', 'Suporte']
                },
                {
                    id: 'chatbot-ai',
                    name: 'Chatbot IA Plus',
                    description: 'Assistente virtual inteligente para atendimento ao cliente',
                    price: 149,
                    rating: 4.6,
                    reviews: 189,
                    category: 'communication',
                    icon: '🤖',
                    features: ['IA Conversacional', 'Multi-idiomas', 'Integração WhatsApp', 'Analytics']
                },
                {
                    id: 'analytics-pro',
                    name: 'Analytics Pro',
                    description: 'Relatórios avançados de analytics com dashboards customizáveis',
                    price: 79,
                    rating: 4.7,
                    reviews: 312,
                    category: 'analytics',
                    icon: '📊',
                    features: ['Dashboards', 'Real-time', 'Export', 'API']
                },
                {
                    id: 'api-gateway',
                    name: 'API Gateway Premium',
                    description: 'Gateway de API com rate limiting, caching e segurança',
                    price: 199,
                    rating: 4.9,
                    reviews: 156,
                    category: 'development',
                    icon: '🔌',
                    features: ['Rate Limiting', 'Caching', 'Security', 'Monitoring']
                },
                {
                    id: 'workflow-automation',
                    name: 'Workflow Automation',
                    description: 'Automatização de processos empresariais com workflows visuais',
                    price: 129,
                    rating: 4.5,
                    reviews: 98,
                    category: 'automation',
                    icon: '⚙️',
                    features: ['Visual Builder', 'Integrações', 'Triggers', 'Templates']
                },
                {
                    id: 'email-marketing',
                    name: 'Email Marketing Pro',
                    description: 'Campanhas de email automatizadas com segmentação avançada',
                    price: 89,
                    rating: 4.4,
                    reviews: 267,
                    category: 'marketing',
                    icon: '📧',
                    features: ['Templates', 'Segmentação', 'A/B Testing', 'Automation']
                }
            ];

            allServices = mockServices;
            renderServices(mockServices);
        }

        function filterByCategory(category) {
            currentCategory = category;

            // Update active category
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
            event.currentTarget.classList.add('active');

            applyFilters();
        }

        function filterServices() {
            applyFilters();
        }

        function applyFilters() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();

            let filtered = allServices;

            // Filter by category
            if (currentCategory !== 'all') {
                filtered = filtered.filter(service => service.category === currentCategory);
            }

            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(service =>
                    service.name.toLowerCase().includes(searchTerm) ||
                    service.description.toLowerCase().includes(searchTerm) ||
                    service.features.some(feature => feature.toLowerCase().includes(searchTerm))
                );
            }

            renderServices(filtered);
        }

        function viewServiceDetails(serviceId) {
            window.location.href = \`/dashboard/servicos/loja/\${serviceId}\`;
        }

        function purchaseService(serviceId) {
            if (confirm('Deseja adquirir este serviço?')) {
                alert('Serviço adquirido com sucesso! Você será redirecionado para configuração.');
                window.location.href = '/dashboard/servicos';
            }
        }

        // Initialize
        loadServices();
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-wfscarpc> <!-- Header --> <div class="store-header" data-astro-cid-wfscarpc> <h1 data-astro-cid-wfscarpc>🛒 Loja de Serviços</h1> <p data-astro-cid-wfscarpc>Descubra e adquira serviços para impulsionar seus projetos</p> </div> <!-- Search --> <div class="search-section" data-astro-cid-wfscarpc> <input type="text" class="search-input" placeholder="Buscar serviços..." id="search-input" onkeyup="filterServices()" data-astro-cid-wfscarpc> </div> <!-- Categories --> <div class="categories-section" data-astro-cid-wfscarpc> <h2 style="color: white; margin: 0 0 1rem 0; font-size: 1.2rem;" data-astro-cid-wfscarpc>📂 Categorias</h2> <div class="categories-grid" data-astro-cid-wfscarpc> <div class="category-card active" onclick="filterByCategory('all')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>🌟</span> <div class="category-title" data-astro-cid-wfscarpc>Todos</div> <div class="category-desc" data-astro-cid-wfscarpc>Todos os serviços</div> </div> <div class="category-card" onclick="filterByCategory('marketing')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>📢</span> <div class="category-title" data-astro-cid-wfscarpc>Marketing</div> <div class="category-desc" data-astro-cid-wfscarpc>Automação e growth</div> </div> <div class="category-card" onclick="filterByCategory('development')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>💻</span> <div class="category-title" data-astro-cid-wfscarpc>Desenvolvimento</div> <div class="category-desc" data-astro-cid-wfscarpc>APIs e integrações</div> </div> <div class="category-card" onclick="filterByCategory('analytics')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>📊</span> <div class="category-title" data-astro-cid-wfscarpc>Analytics</div> <div class="category-desc" data-astro-cid-wfscarpc>Dados e relatórios</div> </div> <div class="category-card" onclick="filterByCategory('communication')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>💬</span> <div class="category-title" data-astro-cid-wfscarpc>Comunicação</div> <div class="category-desc" data-astro-cid-wfscarpc>Chat e messaging</div> </div> <div class="category-card" onclick="filterByCategory('automation')" data-astro-cid-wfscarpc> <span class="category-icon" data-astro-cid-wfscarpc>🤖</span> <div class="category-title" data-astro-cid-wfscarpc>Automação</div> <div class="category-desc" data-astro-cid-wfscarpc>Workflows inteligentes</div> </div> </div> </div> <!-- Services Grid --> <div class="services-grid" id="services-grid" data-astro-cid-wfscarpc> <!-- Services will be loaded here --> </div> </div> <script>
        let allServices = [];
        let currentCategory = 'all';

        async function loadServices() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/services/store\\\`, {
                    headers: { 'Authorization': token }
                });
                const services = await res.json();
                allServices = services;
                renderServices(services);
            } catch (e) {
                console.error('Error loading services, using mock data', e);
                loadMockServices();
            }
        }

        function renderServices(services) {
            const grid = document.getElementById('services-grid');

            if (services.length === 0) {
                grid.innerHTML = \\\`
                    <div class="empty-state">
                        <h3>🔍 Nenhum serviço encontrado</h3>
                        <p>Tente ajustar os filtros de busca.</p>
                    </div>
                \\\`;
                return;
            }

            grid.innerHTML = services.map(service => \\\`
                <div class="service-card \\\${service.popular ? 'popular' : ''}">
                    \\\${service.popular ? '<div class="popular-badge">Popular</div>' : ''}
                    <div class="service-header">
                        <div class="service-icon">\\\${service.icon}</div>
                        <div class="service-title">\\\${service.name}</div>
                        <div class="service-price">R$ \\\${service.price}</div>
                    </div>
                    <div class="service-desc">\\\${service.description}</div>
                    <div class="service-rating">
                        <div class="stars">\\\${'⭐'.repeat(Math.floor(service.rating))}</div>
                        <div class="rating-text">\\\${service.rating} (\\\${service.reviews} avaliações)</div>
                    </div>
                    <div class="service-features">
                        \\\${service.features.map(feature => \\\`<span class="feature-tag">\\\${feature}</span>\\\`).join('')}
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-outline" onclick="viewServiceDetails('\\\${service.id}')">Detalhes</button>
                        <button class="btn btn-primary" onclick="purchaseService('\\\${service.id}')">Adquirir</button>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadMockServices() {
            const mockServices = [
                {
                    id: 'seo-automation',
                    name: 'SEO Automation Pro',
                    description: 'Otimização automática de SEO para seus sites com IA avançada',
                    price: 99,
                    rating: 4.8,
                    reviews: 234,
                    category: 'marketing',
                    icon: '🔍',
                    popular: true,
                    features: ['IA Avançada', 'Relatórios', '24/7', 'Suporte']
                },
                {
                    id: 'chatbot-ai',
                    name: 'Chatbot IA Plus',
                    description: 'Assistente virtual inteligente para atendimento ao cliente',
                    price: 149,
                    rating: 4.6,
                    reviews: 189,
                    category: 'communication',
                    icon: '🤖',
                    features: ['IA Conversacional', 'Multi-idiomas', 'Integração WhatsApp', 'Analytics']
                },
                {
                    id: 'analytics-pro',
                    name: 'Analytics Pro',
                    description: 'Relatórios avançados de analytics com dashboards customizáveis',
                    price: 79,
                    rating: 4.7,
                    reviews: 312,
                    category: 'analytics',
                    icon: '📊',
                    features: ['Dashboards', 'Real-time', 'Export', 'API']
                },
                {
                    id: 'api-gateway',
                    name: 'API Gateway Premium',
                    description: 'Gateway de API com rate limiting, caching e segurança',
                    price: 199,
                    rating: 4.9,
                    reviews: 156,
                    category: 'development',
                    icon: '🔌',
                    features: ['Rate Limiting', 'Caching', 'Security', 'Monitoring']
                },
                {
                    id: 'workflow-automation',
                    name: 'Workflow Automation',
                    description: 'Automatização de processos empresariais com workflows visuais',
                    price: 129,
                    rating: 4.5,
                    reviews: 98,
                    category: 'automation',
                    icon: '⚙️',
                    features: ['Visual Builder', 'Integrações', 'Triggers', 'Templates']
                },
                {
                    id: 'email-marketing',
                    name: 'Email Marketing Pro',
                    description: 'Campanhas de email automatizadas com segmentação avançada',
                    price: 89,
                    rating: 4.4,
                    reviews: 267,
                    category: 'marketing',
                    icon: '📧',
                    features: ['Templates', 'Segmentação', 'A/B Testing', 'Automation']
                }
            ];

            allServices = mockServices;
            renderServices(mockServices);
        }

        function filterByCategory(category) {
            currentCategory = category;

            // Update active category
            document.querySelectorAll('.category-card').forEach(card => {
                card.classList.remove('active');
            });
            event.currentTarget.classList.add('active');

            applyFilters();
        }

        function filterServices() {
            applyFilters();
        }

        function applyFilters() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();

            let filtered = allServices;

            // Filter by category
            if (currentCategory !== 'all') {
                filtered = filtered.filter(service => service.category === currentCategory);
            }

            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(service =>
                    service.name.toLowerCase().includes(searchTerm) ||
                    service.description.toLowerCase().includes(searchTerm) ||
                    service.features.some(feature => feature.toLowerCase().includes(searchTerm))
                );
            }

            renderServices(filtered);
        }

        function viewServiceDetails(serviceId) {
            window.location.href = \\\`/dashboard/servicos/loja/\\\${serviceId}\\\`;
        }

        function purchaseService(serviceId) {
            if (confirm('Deseja adquirir este serviço?')) {
                alert('Serviço adquirido com sucesso! Você será redirecionado para configuração.');
                window.location.href = '/dashboard/servicos';
            }
        }

        // Initialize
        loadServices();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/loja/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/loja/index.astro";
const $$url = "/dashboard/servicos/loja";
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
