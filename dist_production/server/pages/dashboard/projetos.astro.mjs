import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Projetos - GetNexo Pro", "data-astro-cid-kdvgwrst": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-kdvgwrst> <!-- Header --> <div class="projects-header" data-astro-cid-kdvgwrst> <h1 data-astro-cid-kdvgwrst>📁 Meus Projetos</h1> <p data-astro-cid-kdvgwrst>Gerencie e acompanhe todos os seus projetos em um só lugar</p> </div> <!-- Filters and Tools --> <div class="filters-tools-section" data-astro-cid-kdvgwrst> <div class="filters-grid" data-astro-cid-kdvgwrst> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Buscar Projetos</label> <input type="text" class="search-input" id="search-input" placeholder="Digite para buscar..." data-astro-cid-kdvgwrst> </div> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Status</label> <select class="filter-select" id="status-filter" data-astro-cid-kdvgwrst> <option value="all" selected data-astro-cid-kdvgwrst>Todos os status</option> <option value="active" data-astro-cid-kdvgwrst>Ativos</option> <option value="paused" data-astro-cid-kdvgwrst>Pausados</option> <option value="completed" data-astro-cid-kdvgwrst>Concluídos</option> </select> </div> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Categoria</label> <select class="filter-select" id="category-filter" data-astro-cid-kdvgwrst> <option value="all" selected data-astro-cid-kdvgwrst>Todas as categorias</option> <option value="web" data-astro-cid-kdvgwrst>Web</option> <option value="mobile" data-astro-cid-kdvgwrst>Mobile</option> <option value="desktop" data-astro-cid-kdvgwrst>Desktop</option> <option value="api" data-astro-cid-kdvgwrst>API</option> </select> </div> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Ordenar por</label> <select class="filter-select" id="sort-filter" data-astro-cid-kdvgwrst> <option value="name" selected data-astro-cid-kdvgwrst>Nome</option> <option value="date" data-astro-cid-kdvgwrst>Data de criação</option> <option value="progress" data-astro-cid-kdvgwrst>Progresso</option> <option value="deadline" data-astro-cid-kdvgwrst>Prazo</option> </select> </div> </div> <div class="tools-row" data-astro-cid-kdvgwrst> <div class="bulk-actions hidden" id="bulk-actions" data-astro-cid-kdvgwrst> <span style="color: #94a3b8; font-size: 0.9rem;" data-astro-cid-kdvgwrst><span id="selected-count" data-astro-cid-kdvgwrst>0</span> selecionados</span> <button class="btn btn-outline" onclick="bulkAction('pause')" data-astro-cid-kdvgwrst>Pausar</button> <button class="btn btn-outline" onclick="bulkAction('delete')" data-astro-cid-kdvgwrst>Excluir</button> </div> <div style="display: flex; align-items: center; gap: 1rem;" data-astro-cid-kdvgwrst> <div class="view-options" data-astro-cid-kdvgwrst> <button class="view-btn active" onclick="setView('grid')" title="Visualização em grade" data-astro-cid-kdvgwrst>⊞</button> <button class="view-btn" onclick="setView('list')" title="Visualização em lista" data-astro-cid-kdvgwrst>☰</button> </div> <div data-astro-cid-kdvgwrst> <h2 style="color: white; margin: 0;" data-astro-cid-kdvgwrst>Projetos Ativos</h2> <p style="color: #94a3b8; margin: 0.5rem 0 0 0;" data-astro-cid-kdvgwrst>Total de projetos: <span id="total-projects" data-astro-cid-kdvgwrst>0</span></p> </div> </div> <div style="display: flex; gap: 1rem;" data-astro-cid-kdvgwrst> <a href="/dashboard/projetos/templates" class="btn btn-outline" data-astro-cid-kdvgwrst>Templates</a> <a href="/dashboard/projetos/novo" class="btn btn-primary" data-astro-cid-kdvgwrst>Novo Projeto</a> </div> </div> </div> <!-- Projects Grid --> <div class="projects-grid" id="projects-grid" data-astro-cid-kdvgwrst> <!-- Projects will be loaded here --> </div> <!-- Projects List (hidden by default) --> <div class="projects-list" id="projects-list" data-astro-cid-kdvgwrst> <!-- Projects list will be loaded here --> </div> <!-- Pagination --> <div class="pagination" id="pagination" data-astro-cid-kdvgwrst> <!-- Pagination will be loaded here --> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        let allProjects = [];
        let filteredProjects = [];
        let currentView = 'grid';
        let currentPage = 1;
        const itemsPerPage = 9;
        let selectedProjects = new Set();

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Search
            document.getElementById('search-input').addEventListener('input', debounce(filterProjects, 300));

            // Filters
            document.getElementById('status-filter').addEventListener('change', filterProjects);
            document.getElementById('category-filter').addEventListener('change', filterProjects);
            document.getElementById('sort-filter').addEventListener('change', sortProjects);

            // Initialize
            loadProjects();
        });

        async function loadProjects() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/projects\`, {
                    headers: { 'Authorization': token }
                });
                allProjects = await res.json();
                filteredProjects = [...allProjects];
                renderProjects();
                renderPagination();
            } catch (e) {
                console.error('Error loading projects, using mock data', e);
                loadMockProjects();
            }
        }

        function renderProjects() {
            const total = document.getElementById('total-projects');
            total.textContent = filteredProjects.length;

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const projectsToShow = filteredProjects.slice(startIndex, endIndex);

            if (currentView === 'grid') {
                renderGridView(projectsToShow);
            } else {
                renderListView(projectsToShow);
            }

            if (filteredProjects.length === 0) {
                const emptyMessage = \`
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <h3>🔍 Nenhum projeto encontrado</h3>
                        <p>Não foram encontrados projetos com os filtros aplicados.</p>
                        <button class="btn btn-outline" onclick="clearFilters()" style="margin-top: 1rem;">Limpar Filtros</button>
                    </div>
                \`;
                document.getElementById('projects-grid').innerHTML = emptyMessage;
                document.getElementById('projects-list').innerHTML = '';
            }
        }

        function renderGridView(projects) {
            const grid = document.getElementById('projects-grid');
            const list = document.getElementById('projects-list');

            grid.style.display = 'grid';
            list.style.display = 'none';

            grid.innerHTML = projects.map(project => \`
                <div class="project-card" onclick="handleCardClick(event, '\${project.id}')">
                    <div class="project-header">
                        <input type="checkbox" class="project-checkbox" onchange="toggleProjectSelection('\${project.id}')" \${selectedProjects.has(project.id) ? 'checked' : ''}>
                        <div class="project-icon">\${project.icon || '📁'}</div>
                        <div class="project-title">\${project.name}</div>
                        <div class="project-status status-\${project.status}">\${getStatusText(project.status)}</div>
                    </div>
                    <div class="project-desc">\${project.description}</div>
                    <div class="project-metrics">
                        <div class="metric">Progresso: <strong>\${project.progress || 0}%</strong></div>
                        <div class="metric">Tarefas: <strong>\${project.tasks || 0}</strong></div>
                        <div class="metric">Prazo: <strong>\${project.deadline || 'N/A'}</strong></div>
                    </div>
                    <div class="project-progress">
                        <div class="progress-bar" style="width: \${project.progress || 0}%"></div>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-outline" onclick="editProject('\${project.id}')">Editar</button>
                        <button class="btn btn-outline" onclick="duplicateProject('\${project.id}')">Duplicar</button>
                    </div>
                </div>
            \`).join('');
        }

        function renderListView(projects) {
            const grid = document.getElementById('projects-grid');
            const list = document.getElementById('projects-list');

            grid.style.display = 'none';
            list.style.display = 'flex';

            list.innerHTML = projects.map(project => \`
                <div class="project-row" onclick="handleCardClick(event, '\${project.id}')">
                    <div class="list-view-grid">
                        <div class="project-row-header">
                            <input type="checkbox" class="project-checkbox" onchange="toggleProjectSelection('\${project.id}')" \${selectedProjects.has(project.id) ? 'checked' : ''}>
                            <div class="project-icon" style="margin-right: 1rem;">\${project.icon || '📁'}</div>
                            <div>
                                <div class="project-title">\${project.name}</div>
                                <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 0.25rem;">\${project.description}</div>
                            </div>
                        </div>
                        <div class="project-status status-\${project.status}">\${getStatusText(project.status)}</div>
                        <div style="color: #94a3b8;">\${project.progress || 0}% concluído</div>
                        <div style="color: #94a3b8;">\${project.deadline || 'N/A'}</div>
                        <div class="project-actions">
                            <button class="btn btn-outline" onclick="editProject('\${project.id}')">✏️</button>
                            <button class="btn btn-outline" onclick="duplicateProject('\${project.id}')">📋</button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function renderPagination() {
            const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
            const pagination = document.getElementById('pagination');

            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }

            let paginationHTML = '';

            // Previous button
            paginationHTML += \`<button class="page-btn" onclick="changePage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''}>‹</button>\`;

            // Page numbers
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += \`<button class="page-btn \${i === currentPage ? 'active' : ''}" onclick="changePage(\${i})">\${i}</button>\`;
            }

            // Next button
            paginationHTML += \`<button class="page-btn" onclick="changePage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''}>›</button>\`;

            pagination.innerHTML = paginationHTML;
        }

        function filterProjects() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const statusFilter = document.getElementById('status-filter').value;
            const categoryFilter = document.getElementById('category-filter').value;

            filteredProjects = allProjects.filter(project => {
                const matchesSearch = project.name.toLowerCase().includes(searchTerm) ||
                                    project.description.toLowerCase().includes(searchTerm);
                const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
                const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

                return matchesSearch && matchesStatus && matchesCategory;
            });

            currentPage = 1;
            sortProjects();
        }

        function sortProjects() {
            const sortBy = document.getElementById('sort-filter').value;

            filteredProjects.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'date':
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                    case 'progress':
                        return (b.progress || 0) - (a.progress || 0);
                    case 'deadline':
                        if (!a.deadline && !b.deadline) return 0;
                        if (!a.deadline) return 1;
                        if (!b.deadline) return -1;
                        return new Date(a.deadline) - new Date(b.deadline);
                    default:
                        return 0;
                }
            });

            renderProjects();
            renderPagination();
        }

        function setView(view) {
            currentView = view;
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            renderProjects();
        }

        function toggleProjectSelection(projectId) {
            if (selectedProjects.has(projectId)) {
                selectedProjects.delete(projectId);
            } else {
                selectedProjects.add(projectId);
            }
            updateBulkActions();
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');

            selectedCount.textContent = selectedProjects.size;

            if (selectedProjects.size > 0) {
                bulkActions.classList.remove('hidden');
            } else {
                bulkActions.classList.add('hidden');
            }
        }

        function bulkAction(action) {
            if (selectedProjects.size === 0) return;

            const confirmMessage = action === 'delete'
                ? \`Tem certeza que deseja excluir \${selectedProjects.size} projeto(s)?\`
                : \`Tem certeza que deseja pausar \${selectedProjects.size} projeto(s)?\`;

            if (confirm(confirmMessage)) {
                alert(\`\${action === 'delete' ? 'Excluídos' : 'Pausados'} com sucesso!\`);
                selectedProjects.clear();
                updateBulkActions();
                loadProjects();
            }
        }

        function changePage(page) {
            currentPage = page;
            renderProjects();
            renderPagination();
        }

        function handleCardClick(event, projectId) {
            // Don't navigate if clicking on checkbox, button, or if multiple selection is active
            if (event.target.type === 'checkbox' ||
                event.target.classList.contains('btn') ||
                selectedProjects.size > 0) {
                return;
            }
            openProject(projectId);
        }

        function clearFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('status-filter').value = 'all';
            document.getElementById('category-filter').value = 'all';
            filterProjects();
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function getStatusText(status) {
            const statuses = {
                'active': 'Ativo',
                'paused': 'Pausado',
                'completed': 'Concluído'
            };
            return statuses[status] || 'Ativo';
        }

        function loadMockProjects() {
            allProjects = [
                {
                    id: '1',
                    name: 'Landing Page E-commerce',
                    description: 'Criação de landing page para novo produto de moda',
                    status: 'active',
                    progress: 65,
                    tasks: 12,
                    deadline: '15 Dez 2026',
                    category: 'web',
                    createdAt: '2026-01-01',
                    icon: '🛍️'
                },
                {
                    id: '2',
                    name: 'App Mobile Restaurante',
                    description: 'Desenvolvimento de app para delivery de comida',
                    status: 'paused',
                    progress: 30,
                    tasks: 8,
                    deadline: '22 Jan 2027',
                    category: 'mobile',
                    createdAt: '2026-01-05',
                    icon: '🍽️'
                },
                {
                    id: '3',
                    name: 'Sistema de Gestão',
                    description: 'Implementação de ERP para empresa de construção',
                    status: 'completed',
                    progress: 100,
                    tasks: 25,
                    deadline: '30 Nov 2026',
                    category: 'web',
                    createdAt: '2026-01-10',
                    icon: '🏗️'
                },
                {
                    id: '4',
                    name: 'API de Pagamentos',
                    description: 'Desenvolvimento de API REST para processamento de pagamentos',
                    status: 'active',
                    progress: 80,
                    tasks: 15,
                    deadline: '10 Fev 2027',
                    category: 'api',
                    createdAt: '2026-01-15',
                    icon: '💳'
                },
                {
                    id: '5',
                    name: 'Aplicativo Desktop',
                    description: 'Software desktop para gestão de projetos',
                    status: 'paused',
                    progress: 45,
                    tasks: 20,
                    deadline: '05 Mar 2027',
                    category: 'desktop',
                    createdAt: '2026-01-20',
                    icon: '💻'
                }
            ];

            filteredProjects = [...allProjects];
            renderProjects();
            renderPagination();
        }

        function openProject(projectId) {
            window.location.href = \`/dashboard/projetos/\${projectId}\`;
        }

        function editProject(projectId) {
            window.location.href = \`/dashboard/projetos/\${projectId}/editar\`;
        }

        function duplicateProject(projectId) {
            const project = allProjects.find(p => p.id === projectId);
            if (project) {
                alert(\`Projeto "\${project.name}" duplicado com sucesso!\`);
                loadProjects();
            }
        }
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-kdvgwrst> <!-- Header --> <div class="projects-header" data-astro-cid-kdvgwrst> <h1 data-astro-cid-kdvgwrst>📁 Meus Projetos</h1> <p data-astro-cid-kdvgwrst>Gerencie e acompanhe todos os seus projetos em um só lugar</p> </div> <!-- Filters and Tools --> <div class="filters-tools-section" data-astro-cid-kdvgwrst> <div class="filters-grid" data-astro-cid-kdvgwrst> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Buscar Projetos</label> <input type="text" class="search-input" id="search-input" placeholder="Digite para buscar..." data-astro-cid-kdvgwrst> </div> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Status</label> <select class="filter-select" id="status-filter" data-astro-cid-kdvgwrst> <option value="all" selected data-astro-cid-kdvgwrst>Todos os status</option> <option value="active" data-astro-cid-kdvgwrst>Ativos</option> <option value="paused" data-astro-cid-kdvgwrst>Pausados</option> <option value="completed" data-astro-cid-kdvgwrst>Concluídos</option> </select> </div> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Categoria</label> <select class="filter-select" id="category-filter" data-astro-cid-kdvgwrst> <option value="all" selected data-astro-cid-kdvgwrst>Todas as categorias</option> <option value="web" data-astro-cid-kdvgwrst>Web</option> <option value="mobile" data-astro-cid-kdvgwrst>Mobile</option> <option value="desktop" data-astro-cid-kdvgwrst>Desktop</option> <option value="api" data-astro-cid-kdvgwrst>API</option> </select> </div> <div class="filter-group" data-astro-cid-kdvgwrst> <label class="filter-label" data-astro-cid-kdvgwrst>Ordenar por</label> <select class="filter-select" id="sort-filter" data-astro-cid-kdvgwrst> <option value="name" selected data-astro-cid-kdvgwrst>Nome</option> <option value="date" data-astro-cid-kdvgwrst>Data de criação</option> <option value="progress" data-astro-cid-kdvgwrst>Progresso</option> <option value="deadline" data-astro-cid-kdvgwrst>Prazo</option> </select> </div> </div> <div class="tools-row" data-astro-cid-kdvgwrst> <div class="bulk-actions hidden" id="bulk-actions" data-astro-cid-kdvgwrst> <span style="color: #94a3b8; font-size: 0.9rem;" data-astro-cid-kdvgwrst><span id="selected-count" data-astro-cid-kdvgwrst>0</span> selecionados</span> <button class="btn btn-outline" onclick="bulkAction('pause')" data-astro-cid-kdvgwrst>Pausar</button> <button class="btn btn-outline" onclick="bulkAction('delete')" data-astro-cid-kdvgwrst>Excluir</button> </div> <div style="display: flex; align-items: center; gap: 1rem;" data-astro-cid-kdvgwrst> <div class="view-options" data-astro-cid-kdvgwrst> <button class="view-btn active" onclick="setView('grid')" title="Visualização em grade" data-astro-cid-kdvgwrst>⊞</button> <button class="view-btn" onclick="setView('list')" title="Visualização em lista" data-astro-cid-kdvgwrst>☰</button> </div> <div data-astro-cid-kdvgwrst> <h2 style="color: white; margin: 0;" data-astro-cid-kdvgwrst>Projetos Ativos</h2> <p style="color: #94a3b8; margin: 0.5rem 0 0 0;" data-astro-cid-kdvgwrst>Total de projetos: <span id="total-projects" data-astro-cid-kdvgwrst>0</span></p> </div> </div> <div style="display: flex; gap: 1rem;" data-astro-cid-kdvgwrst> <a href="/dashboard/projetos/templates" class="btn btn-outline" data-astro-cid-kdvgwrst>Templates</a> <a href="/dashboard/projetos/novo" class="btn btn-primary" data-astro-cid-kdvgwrst>Novo Projeto</a> </div> </div> </div> <!-- Projects Grid --> <div class="projects-grid" id="projects-grid" data-astro-cid-kdvgwrst> <!-- Projects will be loaded here --> </div> <!-- Projects List (hidden by default) --> <div class="projects-list" id="projects-list" data-astro-cid-kdvgwrst> <!-- Projects list will be loaded here --> </div> <!-- Pagination --> <div class="pagination" id="pagination" data-astro-cid-kdvgwrst> <!-- Pagination will be loaded here --> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        let allProjects = [];
        let filteredProjects = [];
        let currentView = 'grid';
        let currentPage = 1;
        const itemsPerPage = 9;
        let selectedProjects = new Set();

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Search
            document.getElementById('search-input').addEventListener('input', debounce(filterProjects, 300));

            // Filters
            document.getElementById('status-filter').addEventListener('change', filterProjects);
            document.getElementById('category-filter').addEventListener('change', filterProjects);
            document.getElementById('sort-filter').addEventListener('change', sortProjects);

            // Initialize
            loadProjects();
        });

        async function loadProjects() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/projects\\\`, {
                    headers: { 'Authorization': token }
                });
                allProjects = await res.json();
                filteredProjects = [...allProjects];
                renderProjects();
                renderPagination();
            } catch (e) {
                console.error('Error loading projects, using mock data', e);
                loadMockProjects();
            }
        }

        function renderProjects() {
            const total = document.getElementById('total-projects');
            total.textContent = filteredProjects.length;

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const projectsToShow = filteredProjects.slice(startIndex, endIndex);

            if (currentView === 'grid') {
                renderGridView(projectsToShow);
            } else {
                renderListView(projectsToShow);
            }

            if (filteredProjects.length === 0) {
                const emptyMessage = \\\`
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <h3>🔍 Nenhum projeto encontrado</h3>
                        <p>Não foram encontrados projetos com os filtros aplicados.</p>
                        <button class="btn btn-outline" onclick="clearFilters()" style="margin-top: 1rem;">Limpar Filtros</button>
                    </div>
                \\\`;
                document.getElementById('projects-grid').innerHTML = emptyMessage;
                document.getElementById('projects-list').innerHTML = '';
            }
        }

        function renderGridView(projects) {
            const grid = document.getElementById('projects-grid');
            const list = document.getElementById('projects-list');

            grid.style.display = 'grid';
            list.style.display = 'none';

            grid.innerHTML = projects.map(project => \\\`
                <div class="project-card" onclick="handleCardClick(event, '\\\${project.id}')">
                    <div class="project-header">
                        <input type="checkbox" class="project-checkbox" onchange="toggleProjectSelection('\\\${project.id}')" \\\${selectedProjects.has(project.id) ? 'checked' : ''}>
                        <div class="project-icon">\\\${project.icon || '📁'}</div>
                        <div class="project-title">\\\${project.name}</div>
                        <div class="project-status status-\\\${project.status}">\\\${getStatusText(project.status)}</div>
                    </div>
                    <div class="project-desc">\\\${project.description}</div>
                    <div class="project-metrics">
                        <div class="metric">Progresso: <strong>\\\${project.progress || 0}%</strong></div>
                        <div class="metric">Tarefas: <strong>\\\${project.tasks || 0}</strong></div>
                        <div class="metric">Prazo: <strong>\\\${project.deadline || 'N/A'}</strong></div>
                    </div>
                    <div class="project-progress">
                        <div class="progress-bar" style="width: \\\${project.progress || 0}%"></div>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-outline" onclick="editProject('\\\${project.id}')">Editar</button>
                        <button class="btn btn-outline" onclick="duplicateProject('\\\${project.id}')">Duplicar</button>
                    </div>
                </div>
            \\\`).join('');
        }

        function renderListView(projects) {
            const grid = document.getElementById('projects-grid');
            const list = document.getElementById('projects-list');

            grid.style.display = 'none';
            list.style.display = 'flex';

            list.innerHTML = projects.map(project => \\\`
                <div class="project-row" onclick="handleCardClick(event, '\\\${project.id}')">
                    <div class="list-view-grid">
                        <div class="project-row-header">
                            <input type="checkbox" class="project-checkbox" onchange="toggleProjectSelection('\\\${project.id}')" \\\${selectedProjects.has(project.id) ? 'checked' : ''}>
                            <div class="project-icon" style="margin-right: 1rem;">\\\${project.icon || '📁'}</div>
                            <div>
                                <div class="project-title">\\\${project.name}</div>
                                <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 0.25rem;">\\\${project.description}</div>
                            </div>
                        </div>
                        <div class="project-status status-\\\${project.status}">\\\${getStatusText(project.status)}</div>
                        <div style="color: #94a3b8;">\\\${project.progress || 0}% concluído</div>
                        <div style="color: #94a3b8;">\\\${project.deadline || 'N/A'}</div>
                        <div class="project-actions">
                            <button class="btn btn-outline" onclick="editProject('\\\${project.id}')">✏️</button>
                            <button class="btn btn-outline" onclick="duplicateProject('\\\${project.id}')">📋</button>
                        </div>
                    </div>
                </div>
            \\\`).join('');
        }

        function renderPagination() {
            const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
            const pagination = document.getElementById('pagination');

            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }

            let paginationHTML = '';

            // Previous button
            paginationHTML += \\\`<button class="page-btn" onclick="changePage(\\\${currentPage - 1})" \\\${currentPage === 1 ? 'disabled' : ''}>‹</button>\\\`;

            // Page numbers
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += \\\`<button class="page-btn \\\${i === currentPage ? 'active' : ''}" onclick="changePage(\\\${i})">\\\${i}</button>\\\`;
            }

            // Next button
            paginationHTML += \\\`<button class="page-btn" onclick="changePage(\\\${currentPage + 1})" \\\${currentPage === totalPages ? 'disabled' : ''}>›</button>\\\`;

            pagination.innerHTML = paginationHTML;
        }

        function filterProjects() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const statusFilter = document.getElementById('status-filter').value;
            const categoryFilter = document.getElementById('category-filter').value;

            filteredProjects = allProjects.filter(project => {
                const matchesSearch = project.name.toLowerCase().includes(searchTerm) ||
                                    project.description.toLowerCase().includes(searchTerm);
                const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
                const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

                return matchesSearch && matchesStatus && matchesCategory;
            });

            currentPage = 1;
            sortProjects();
        }

        function sortProjects() {
            const sortBy = document.getElementById('sort-filter').value;

            filteredProjects.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'date':
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                    case 'progress':
                        return (b.progress || 0) - (a.progress || 0);
                    case 'deadline':
                        if (!a.deadline && !b.deadline) return 0;
                        if (!a.deadline) return 1;
                        if (!b.deadline) return -1;
                        return new Date(a.deadline) - new Date(b.deadline);
                    default:
                        return 0;
                }
            });

            renderProjects();
            renderPagination();
        }

        function setView(view) {
            currentView = view;
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            renderProjects();
        }

        function toggleProjectSelection(projectId) {
            if (selectedProjects.has(projectId)) {
                selectedProjects.delete(projectId);
            } else {
                selectedProjects.add(projectId);
            }
            updateBulkActions();
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');

            selectedCount.textContent = selectedProjects.size;

            if (selectedProjects.size > 0) {
                bulkActions.classList.remove('hidden');
            } else {
                bulkActions.classList.add('hidden');
            }
        }

        function bulkAction(action) {
            if (selectedProjects.size === 0) return;

            const confirmMessage = action === 'delete'
                ? \\\`Tem certeza que deseja excluir \\\${selectedProjects.size} projeto(s)?\\\`
                : \\\`Tem certeza que deseja pausar \\\${selectedProjects.size} projeto(s)?\\\`;

            if (confirm(confirmMessage)) {
                alert(\\\`\\\${action === 'delete' ? 'Excluídos' : 'Pausados'} com sucesso!\\\`);
                selectedProjects.clear();
                updateBulkActions();
                loadProjects();
            }
        }

        function changePage(page) {
            currentPage = page;
            renderProjects();
            renderPagination();
        }

        function handleCardClick(event, projectId) {
            // Don't navigate if clicking on checkbox, button, or if multiple selection is active
            if (event.target.type === 'checkbox' ||
                event.target.classList.contains('btn') ||
                selectedProjects.size > 0) {
                return;
            }
            openProject(projectId);
        }

        function clearFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('status-filter').value = 'all';
            document.getElementById('category-filter').value = 'all';
            filterProjects();
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        function getStatusText(status) {
            const statuses = {
                'active': 'Ativo',
                'paused': 'Pausado',
                'completed': 'Concluído'
            };
            return statuses[status] || 'Ativo';
        }

        function loadMockProjects() {
            allProjects = [
                {
                    id: '1',
                    name: 'Landing Page E-commerce',
                    description: 'Criação de landing page para novo produto de moda',
                    status: 'active',
                    progress: 65,
                    tasks: 12,
                    deadline: '15 Dez 2026',
                    category: 'web',
                    createdAt: '2026-01-01',
                    icon: '🛍️'
                },
                {
                    id: '2',
                    name: 'App Mobile Restaurante',
                    description: 'Desenvolvimento de app para delivery de comida',
                    status: 'paused',
                    progress: 30,
                    tasks: 8,
                    deadline: '22 Jan 2027',
                    category: 'mobile',
                    createdAt: '2026-01-05',
                    icon: '🍽️'
                },
                {
                    id: '3',
                    name: 'Sistema de Gestão',
                    description: 'Implementação de ERP para empresa de construção',
                    status: 'completed',
                    progress: 100,
                    tasks: 25,
                    deadline: '30 Nov 2026',
                    category: 'web',
                    createdAt: '2026-01-10',
                    icon: '🏗️'
                },
                {
                    id: '4',
                    name: 'API de Pagamentos',
                    description: 'Desenvolvimento de API REST para processamento de pagamentos',
                    status: 'active',
                    progress: 80,
                    tasks: 15,
                    deadline: '10 Fev 2027',
                    category: 'api',
                    createdAt: '2026-01-15',
                    icon: '💳'
                },
                {
                    id: '5',
                    name: 'Aplicativo Desktop',
                    description: 'Software desktop para gestão de projetos',
                    status: 'paused',
                    progress: 45,
                    tasks: 20,
                    deadline: '05 Mar 2027',
                    category: 'desktop',
                    createdAt: '2026-01-20',
                    icon: '💻'
                }
            ];

            filteredProjects = [...allProjects];
            renderProjects();
            renderPagination();
        }

        function openProject(projectId) {
            window.location.href = \\\`/dashboard/projetos/\\\${projectId}\\\`;
        }

        function editProject(projectId) {
            window.location.href = \\\`/dashboard/projetos/\\\${projectId}/editar\\\`;
        }

        function duplicateProject(projectId) {
            const project = allProjects.find(p => p.id === projectId);
            if (project) {
                alert(\\\`Projeto "\\\${project.name}" duplicado com sucesso!\\\`);
                loadProjects();
            }
        }
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/projetos/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/projetos/index.astro";
const $$url = "/dashboard/projetos";
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
