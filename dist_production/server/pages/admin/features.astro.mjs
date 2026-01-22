import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Features = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Controle de Funcionalidades - Admin", "data-astro-cid-zsownnn2": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div class="features-container" data-astro-cid-zsownnn2> <!-- Header --> <div class="features-header" data-astro-cid-zsownnn2> <h1 data-astro-cid-zsownnn2>⚙️ Controle de Funcionalidades</h1> <p data-astro-cid-zsownnn2>Gerencie todas as 500+ funções do sistema GetNexo Pro</p> </div> <!-- Stats --> <div class="features-stats" data-astro-cid-zsownnn2> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="total-features" data-astro-cid-zsownnn2>523</div> <div class="stat-label" data-astro-cid-zsownnn2>Total de Funcionalidades</div> </div> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="enabled-features" data-astro-cid-zsownnn2>498</div> <div class="stat-label" data-astro-cid-zsownnn2>Habilitadas</div> </div> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="disabled-features" data-astro-cid-zsownnn2>25</div> <div class="stat-label" data-astro-cid-zsownnn2>Desabilitadas</div> </div> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="maintenance-features" data-astro-cid-zsownnn2>0</div> <div class="stat-label" data-astro-cid-zsownnn2>Em Manutenção</div> </div> </div> <!-- Controls --> <div class="features-controls" data-astro-cid-zsownnn2> <div class="controls-grid" data-astro-cid-zsownnn2> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Buscar Funcionalidade</label> <input type="text" class="search-input" id="feature-search" placeholder="Digite para buscar..." data-astro-cid-zsownnn2> </div> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Categoria</label> <select class="control-select" id="category-filter" data-astro-cid-zsownnn2> <option value="all" selected data-astro-cid-zsownnn2>Todas as categorias</option> <option value="automation" data-astro-cid-zsownnn2>Automação</option> <option value="analytics" data-astro-cid-zsownnn2>Analytics</option> <option value="communication" data-astro-cid-zsownnn2>Comunicação</option> <option value="marketing" data-astro-cid-zsownnn2>Marketing</option> <option value="development" data-astro-cid-zsownnn2>Desenvolvimento</option> <option value="security" data-astro-cid-zsownnn2>Segurança</option> <option value="administration" data-astro-cid-zsownnn2>Administração</option> <option value="integration" data-astro-cid-zsownnn2>Integração</option> </select> </div> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Status</label> <select class="control-select" id="status-filter" data-astro-cid-zsownnn2> <option value="all" selected data-astro-cid-zsownnn2>Todos os status</option> <option value="enabled" data-astro-cid-zsownnn2>Habilitadas</option> <option value="disabled" data-astro-cid-zsownnn2>Desabilitadas</option> <option value="maintenance" data-astro-cid-zsownnn2>Em Manutenção</option> </select> </div> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Ações</label> <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;" data-astro-cid-zsownnn2> <button class="btn btn-success" onclick="enableAllFiltered()" data-astro-cid-zsownnn2>✓ Habilitar Todas</button> <button class="btn btn-danger" onclick="disableAllFiltered()" data-astro-cid-zsownnn2>✗ Desabilitar Todas</button> </div> </div> </div> </div> <!-- Bulk Actions --> <div class="bulk-actions hidden" id="bulk-actions" data-astro-cid-zsownnn2> <div class="selected-info" data-astro-cid-zsownnn2> <span id="selected-count" data-astro-cid-zsownnn2>0</span> funcionalidades selecionadas
</div> <div class="bulk-buttons" data-astro-cid-zsownnn2> <button class="btn btn-success" onclick="bulkEnable()" data-astro-cid-zsownnn2>Habilitar Selecionadas</button> <button class="btn btn-danger" onclick="bulkDisable()" data-astro-cid-zsownnn2>Desabilitar Selecionadas</button> <button class="btn btn-outline" onclick="clearSelection()" data-astro-cid-zsownnn2>Limpar Seleção</button> </div> </div> <!-- Features Grid --> <div class="features-grid" id="features-grid" data-astro-cid-zsownnn2> <!-- Features will be loaded here --> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        let allFeatures = [];
        let filteredFeatures = [];
        let selectedFeatures = new Set();

        // Feature categories with their functionalities
        const featureCategories = {
            automation: {
                name: '🤖 Automação',
                count: 89,
                features: [
                    { id: 'seo-automation', name: 'SEO Automation Pro', desc: 'Otimização automática de SEO com IA avançada', status: 'enabled' },
                    { id: 'workflow-builder', name: 'Workflow Builder', desc: 'Construtor visual de fluxos de trabalho', status: 'enabled' },
                    { id: 'task-scheduler', name: 'Agendador de Tarefas', desc: 'Sistema de agendamento inteligente', status: 'enabled' },
                    { id: 'auto-backup', name: 'Backup Automático', desc: 'Backups automáticos do sistema', status: 'enabled' },
                    { id: 'email-automation', name: 'Automação de Email', desc: 'Campanhas automatizadas de email', status: 'enabled' },
                    { id: 'social-scheduler', name: 'Agendador Social', desc: 'Publicação automática em redes sociais', status: 'disabled' },
                    { id: 'content-generator', name: 'Gerador de Conteúdo', desc: 'IA para criação de conteúdo', status: 'enabled' },
                    { id: 'notification-system', name: 'Sistema de Notificações', desc: 'Notificações inteligentes do sistema', status: 'enabled' }
                ]
            },
            analytics: {
                name: '📊 Analytics',
                count: 67,
                features: [
                    { id: 'advanced-analytics', name: 'Analytics Avançado', desc: 'Relatórios detalhados de performance', status: 'enabled' },
                    { id: 'real-time-dashboard', name: 'Dashboard em Tempo Real', desc: 'Métricas atualizadas em tempo real', status: 'enabled' },
                    { id: 'conversion-tracking', name: 'Rastreamento de Conversão', desc: 'Acompanhamento de conversões', status: 'enabled' },
                    { id: 'user-behavior', name: 'Análise de Comportamento', desc: 'Estudo do comportamento do usuário', status: 'enabled' },
                    { id: 'heatmaps', name: 'Mapas de Calor', desc: 'Visualização de interação do usuário', status: 'disabled' },
                    { id: 'cohort-analysis', name: 'Análise de Coorte', desc: 'Análise segmentada por grupos', status: 'enabled' }
                ]
            },
            communication: {
                name: '💬 Comunicação',
                count: 45,
                features: [
                    { id: 'chatbot-ai', name: 'Chatbot IA', desc: 'Assistente virtual inteligente', status: 'enabled' },
                    { id: 'whatsapp-integration', name: 'Integração WhatsApp', desc: 'Comunicação via WhatsApp Business', status: 'enabled' },
                    { id: 'email-system', name: 'Sistema de Email', desc: 'Gerenciamento completo de emails', status: 'enabled' },
                    { id: 'sms-gateway', name: 'Gateway SMS', desc: 'Envio de mensagens de texto', status: 'disabled' },
                    { id: 'video-calling', name: 'Video Chamadas', desc: 'Sistema de video conferência', status: 'enabled' },
                    { id: 'live-chat', name: 'Chat ao Vivo', desc: 'Atendimento em tempo real', status: 'enabled' }
                ]
            },
            marketing: {
                name: '📢 Marketing',
                count: 78,
                features: [
                    { id: 'campaign-manager', name: 'Gerenciador de Campanhas', desc: 'Plataforma completa de marketing', status: 'enabled' },
                    { id: 'ab-testing', name: 'Testes A/B', desc: 'Otimização através de testes', status: 'enabled' },
                    { id: 'lead-generation', name: 'Geração de Leads', desc: 'Captura automatizada de leads', status: 'enabled' },
                    { id: 'retargeting', name: 'Retargeting', desc: 'Campanhas de remarketing', status: 'disabled' },
                    { id: 'influencer-marketing', name: 'Marketing de Influência', desc: 'Conexão com influenciadores', status: 'enabled' }
                ]
            },
            development: {
                name: '💻 Desenvolvimento',
                count: 92,
                features: [
                    { id: 'code-editor', name: 'Editor de Código', desc: 'Editor integrado para desenvolvimento', status: 'enabled' },
                    { id: 'api-builder', name: 'Construtor de API', desc: 'Criação rápida de APIs', status: 'enabled' },
                    { id: 'database-manager', name: 'Gerenciador de Banco', desc: 'Administração de dados', status: 'enabled' },
                    { id: 'version-control', name: 'Controle de Versão', desc: 'Sistema Git integrado', status: 'enabled' },
                    { id: 'deployment-tools', name: 'Ferramentas de Deploy', desc: 'Implantação automatizada', status: 'enabled' },
                    { id: 'testing-suite', name: 'Suite de Testes', desc: 'Ferramentas completas de QA', status: 'disabled' }
                ]
            },
            security: {
                name: '🔒 Segurança',
                count: 54,
                features: [
                    { id: 'encryption', name: 'Criptografia', desc: 'Proteção de dados avançada', status: 'enabled' },
                    { id: 'firewall', name: 'Firewall', desc: 'Proteção contra ataques', status: 'enabled' },
                    { id: 'two-factor', name: 'Autenticação 2FA', desc: 'Segunda camada de segurança', status: 'enabled' },
                    { id: 'audit-logs', name: 'Logs de Auditoria', desc: 'Rastreamento completo de ações', status: 'enabled' },
                    { id: 'intrusion-detection', name: 'Detecção de Intrusão', desc: 'Monitoramento de segurança', status: 'disabled' }
                ]
            },
            administration: {
                name: '🛡️ Administração',
                count: 41,
                features: [
                    { id: 'user-management', name: 'Gerenciamento de Usuários', desc: 'Controle completo de contas', status: 'enabled' },
                    { id: 'role-permissions', name: 'Papéis e Permissões', desc: 'Sistema de autorização granular', status: 'enabled' },
                    { id: 'system-settings', name: 'Configurações do Sistema', desc: 'Ajustes globais da plataforma', status: 'enabled' },
                    { id: 'backup-restore', name: 'Backup e Restore', desc: 'Recuperação de dados', status: 'enabled' },
                    { id: 'monitoring', name: 'Monitoramento', desc: 'Observabilidade do sistema', status: 'enabled' }
                ]
            },
            integration: {
                name: '🔗 Integração',
                count: 57,
                features: [
                    { id: 'api-gateway', name: 'API Gateway', desc: 'Gerenciamento de APIs externas', status: 'enabled' },
                    { id: 'webhook-system', name: 'Sistema de Webhooks', desc: 'Integração em tempo real', status: 'enabled' },
                    { id: 'oauth-providers', name: 'Provedores OAuth', desc: 'Login social', status: 'enabled' },
                    { id: 'payment-gateways', name: 'Gateways de Pagamento', desc: 'Integração com meios de pagamento', status: 'enabled' },
                    { id: 'crm-integration', name: 'Integração CRM', desc: 'Conexão com sistemas de CRM', status: 'disabled' },
                    { id: 'erp-integration', name: 'Integração ERP', desc: 'Conexão com sistemas ERP', status: 'enabled' }
                ]
            }
        };

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('feature-search').addEventListener('input', debounce(filterFeatures, 300));
            document.getElementById('category-filter').addEventListener('change', filterFeatures);
            document.getElementById('status-filter').addEventListener('change', filterFeatures);

            loadFeatures();
        });

        function loadFeatures() {
            // Flatten features from categories
            allFeatures = [];
            Object.entries(featureCategories).forEach(([categoryId, category]) => {
                category.features.forEach(feature => {
                    allFeatures.push({
                        ...feature,
                        category: categoryId,
                        categoryName: category.name
                    });
                });
            });

            filteredFeatures = [...allFeatures];
            renderFeatures();
            updateStats();
        }

        function renderFeatures() {
            const grid = document.getElementById('features-grid');
            const categoriesToShow = {};

            // Group features by category
            filteredFeatures.forEach(feature => {
                if (!categoriesToShow[feature.category]) {
                    categoriesToShow[feature.category] = {
                        name: feature.categoryName,
                        features: []
                    };
                }
                categoriesToShow[feature.category].features.push(feature);
            });

            grid.innerHTML = Object.entries(categoriesToShow).map(([categoryId, categoryData]) => \`
                <div class="feature-category">
                    <div class="category-header">
                        <h3 class="category-title">\${categoryData.name}</h3>
                        <p class="category-count">\${categoryData.features.length} funcionalidades</p>
                    </div>
                    <div class="feature-list">
                        \${categoryData.features.map(feature => \`
                            <div class="feature-item">
                                <input type="checkbox" style="margin-right: 1rem;" onchange="toggleFeatureSelection('\${feature.id}')">
                                <div class="feature-info">
                                    <div class="feature-name">\${feature.name}</div>
                                    <div class="feature-desc">\${feature.desc}</div>
                                </div>
                                <div class="feature-controls">
                                    <span class="feature-status status-\${feature.status}">
                                        \${getStatusText(feature.status)}
                                    </span>
                                    <label class="switch">
                                        <input type="checkbox" \${feature.status === 'enabled' ? 'checked' : ''} onchange="toggleFeature('\${feature.id}')">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`).join('');
        }

        function updateStats() {
            const enabled = allFeatures.filter(f => f.status === 'enabled').length;
            const disabled = allFeatures.filter(f => f.status === 'disabled').length;
            const maintenance = allFeatures.filter(f => f.status === 'maintenance').length;

            document.getElementById('total-features').textContent = allFeatures.length;
            document.getElementById('enabled-features').textContent = enabled;
            document.getElementById('disabled-features').textContent = disabled;
            document.getElementById('maintenance-features').textContent = maintenance;
        }

        function filterFeatures() {
            const searchTerm = document.getElementById('feature-search').value.toLowerCase();
            const categoryFilter = document.getElementById('category-filter').value;
            const statusFilter = document.getElementById('status-filter').value;

            filteredFeatures = allFeatures.filter(feature => {
                const matchesSearch = feature.name.toLowerCase().includes(searchTerm) ||
                                    feature.desc.toLowerCase().includes(searchTerm);
                const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;
                const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;

                return matchesSearch && matchesCategory && matchesStatus;
            });

            renderFeatures();
        }

        function getStatusText(status) {
            const statuses = {
                'enabled': 'Habilitada',
                'disabled': 'Desabilitada',
                'maintenance': 'Manutenção'
            };
            return statuses[status] || 'Desabilitada';
        }

        function toggleFeature(featureId) {
            const feature = allFeatures.find(f => f.id === featureId);
            if (feature) {
                feature.status = event.target.checked ? 'enabled' : 'disabled';
                updateStats();

                // Show notification
                const statusText = feature.status === 'enabled' ? 'habilitada' : 'desabilitada';
                showNotification(\`Funcionalidade "\${feature.name}" foi \${statusText}\`, 'success');
            }
        }

        function toggleFeatureSelection(featureId) {
            if (selectedFeatures.has(featureId)) {
                selectedFeatures.delete(featureId);
            } else {
                selectedFeatures.add(featureId);
            }
            updateBulkActions();
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');

            selectedCount.textContent = selectedFeatures.size;

            if (selectedFeatures.size > 0) {
                bulkActions.classList.remove('hidden');
            } else {
                bulkActions.classList.add('hidden');
            }
        }

        function bulkEnable() {
            selectedFeatures.forEach(featureId => {
                const feature = allFeatures.find(f => f.id === featureId);
                if (feature) feature.status = 'enabled';
            });
            selectedFeatures.clear();
            updateBulkActions();
            updateStats();
            renderFeatures();
            showNotification(\`\${selectedFeatures.size} funcionalidades habilitadas\`, 'success');
        }

        function bulkDisable() {
            selectedFeatures.forEach(featureId => {
                const feature = allFeatures.find(f => f.id === featureId);
                if (feature) feature.status = 'disabled';
            });
            selectedFeatures.clear();
            updateBulkActions();
            updateStats();
            renderFeatures();
            showNotification(\`\${selectedFeatures.size} funcionalidades desabilitadas\`, 'warning');
        }

        function clearSelection() {
            selectedFeatures.clear();
            updateBulkActions();
            renderFeatures();
        }

        function enableAllFiltered() {
            filteredFeatures.forEach(feature => {
                feature.status = 'enabled';
            });
            updateStats();
            renderFeatures();
            showNotification(\`Todas as funcionalidades filtradas foram habilitadas\`, 'success');
        }

        function disableAllFiltered() {
            filteredFeatures.forEach(feature => {
                feature.status = 'disabled';
            });
            updateStats();
            renderFeatures();
            showNotification(\`Todas as funcionalidades filtradas foram desabilitadas\`, 'warning');
        }

        function showNotification(message, type = 'info') {
            // Simple notification system
            alert(message);
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

        // Initialize
        loadFeatures();
    <\/script> `], ["  ", `<div class="features-container" data-astro-cid-zsownnn2> <!-- Header --> <div class="features-header" data-astro-cid-zsownnn2> <h1 data-astro-cid-zsownnn2>⚙️ Controle de Funcionalidades</h1> <p data-astro-cid-zsownnn2>Gerencie todas as 500+ funções do sistema GetNexo Pro</p> </div> <!-- Stats --> <div class="features-stats" data-astro-cid-zsownnn2> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="total-features" data-astro-cid-zsownnn2>523</div> <div class="stat-label" data-astro-cid-zsownnn2>Total de Funcionalidades</div> </div> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="enabled-features" data-astro-cid-zsownnn2>498</div> <div class="stat-label" data-astro-cid-zsownnn2>Habilitadas</div> </div> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="disabled-features" data-astro-cid-zsownnn2>25</div> <div class="stat-label" data-astro-cid-zsownnn2>Desabilitadas</div> </div> <div class="stat-card" data-astro-cid-zsownnn2> <div class="stat-number" id="maintenance-features" data-astro-cid-zsownnn2>0</div> <div class="stat-label" data-astro-cid-zsownnn2>Em Manutenção</div> </div> </div> <!-- Controls --> <div class="features-controls" data-astro-cid-zsownnn2> <div class="controls-grid" data-astro-cid-zsownnn2> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Buscar Funcionalidade</label> <input type="text" class="search-input" id="feature-search" placeholder="Digite para buscar..." data-astro-cid-zsownnn2> </div> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Categoria</label> <select class="control-select" id="category-filter" data-astro-cid-zsownnn2> <option value="all" selected data-astro-cid-zsownnn2>Todas as categorias</option> <option value="automation" data-astro-cid-zsownnn2>Automação</option> <option value="analytics" data-astro-cid-zsownnn2>Analytics</option> <option value="communication" data-astro-cid-zsownnn2>Comunicação</option> <option value="marketing" data-astro-cid-zsownnn2>Marketing</option> <option value="development" data-astro-cid-zsownnn2>Desenvolvimento</option> <option value="security" data-astro-cid-zsownnn2>Segurança</option> <option value="administration" data-astro-cid-zsownnn2>Administração</option> <option value="integration" data-astro-cid-zsownnn2>Integração</option> </select> </div> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Status</label> <select class="control-select" id="status-filter" data-astro-cid-zsownnn2> <option value="all" selected data-astro-cid-zsownnn2>Todos os status</option> <option value="enabled" data-astro-cid-zsownnn2>Habilitadas</option> <option value="disabled" data-astro-cid-zsownnn2>Desabilitadas</option> <option value="maintenance" data-astro-cid-zsownnn2>Em Manutenção</option> </select> </div> <div class="control-group" data-astro-cid-zsownnn2> <label class="control-label" data-astro-cid-zsownnn2>Ações</label> <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;" data-astro-cid-zsownnn2> <button class="btn btn-success" onclick="enableAllFiltered()" data-astro-cid-zsownnn2>✓ Habilitar Todas</button> <button class="btn btn-danger" onclick="disableAllFiltered()" data-astro-cid-zsownnn2>✗ Desabilitar Todas</button> </div> </div> </div> </div> <!-- Bulk Actions --> <div class="bulk-actions hidden" id="bulk-actions" data-astro-cid-zsownnn2> <div class="selected-info" data-astro-cid-zsownnn2> <span id="selected-count" data-astro-cid-zsownnn2>0</span> funcionalidades selecionadas
</div> <div class="bulk-buttons" data-astro-cid-zsownnn2> <button class="btn btn-success" onclick="bulkEnable()" data-astro-cid-zsownnn2>Habilitar Selecionadas</button> <button class="btn btn-danger" onclick="bulkDisable()" data-astro-cid-zsownnn2>Desabilitar Selecionadas</button> <button class="btn btn-outline" onclick="clearSelection()" data-astro-cid-zsownnn2>Limpar Seleção</button> </div> </div> <!-- Features Grid --> <div class="features-grid" id="features-grid" data-astro-cid-zsownnn2> <!-- Features will be loaded here --> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        let allFeatures = [];
        let filteredFeatures = [];
        let selectedFeatures = new Set();

        // Feature categories with their functionalities
        const featureCategories = {
            automation: {
                name: '🤖 Automação',
                count: 89,
                features: [
                    { id: 'seo-automation', name: 'SEO Automation Pro', desc: 'Otimização automática de SEO com IA avançada', status: 'enabled' },
                    { id: 'workflow-builder', name: 'Workflow Builder', desc: 'Construtor visual de fluxos de trabalho', status: 'enabled' },
                    { id: 'task-scheduler', name: 'Agendador de Tarefas', desc: 'Sistema de agendamento inteligente', status: 'enabled' },
                    { id: 'auto-backup', name: 'Backup Automático', desc: 'Backups automáticos do sistema', status: 'enabled' },
                    { id: 'email-automation', name: 'Automação de Email', desc: 'Campanhas automatizadas de email', status: 'enabled' },
                    { id: 'social-scheduler', name: 'Agendador Social', desc: 'Publicação automática em redes sociais', status: 'disabled' },
                    { id: 'content-generator', name: 'Gerador de Conteúdo', desc: 'IA para criação de conteúdo', status: 'enabled' },
                    { id: 'notification-system', name: 'Sistema de Notificações', desc: 'Notificações inteligentes do sistema', status: 'enabled' }
                ]
            },
            analytics: {
                name: '📊 Analytics',
                count: 67,
                features: [
                    { id: 'advanced-analytics', name: 'Analytics Avançado', desc: 'Relatórios detalhados de performance', status: 'enabled' },
                    { id: 'real-time-dashboard', name: 'Dashboard em Tempo Real', desc: 'Métricas atualizadas em tempo real', status: 'enabled' },
                    { id: 'conversion-tracking', name: 'Rastreamento de Conversão', desc: 'Acompanhamento de conversões', status: 'enabled' },
                    { id: 'user-behavior', name: 'Análise de Comportamento', desc: 'Estudo do comportamento do usuário', status: 'enabled' },
                    { id: 'heatmaps', name: 'Mapas de Calor', desc: 'Visualização de interação do usuário', status: 'disabled' },
                    { id: 'cohort-analysis', name: 'Análise de Coorte', desc: 'Análise segmentada por grupos', status: 'enabled' }
                ]
            },
            communication: {
                name: '💬 Comunicação',
                count: 45,
                features: [
                    { id: 'chatbot-ai', name: 'Chatbot IA', desc: 'Assistente virtual inteligente', status: 'enabled' },
                    { id: 'whatsapp-integration', name: 'Integração WhatsApp', desc: 'Comunicação via WhatsApp Business', status: 'enabled' },
                    { id: 'email-system', name: 'Sistema de Email', desc: 'Gerenciamento completo de emails', status: 'enabled' },
                    { id: 'sms-gateway', name: 'Gateway SMS', desc: 'Envio de mensagens de texto', status: 'disabled' },
                    { id: 'video-calling', name: 'Video Chamadas', desc: 'Sistema de video conferência', status: 'enabled' },
                    { id: 'live-chat', name: 'Chat ao Vivo', desc: 'Atendimento em tempo real', status: 'enabled' }
                ]
            },
            marketing: {
                name: '📢 Marketing',
                count: 78,
                features: [
                    { id: 'campaign-manager', name: 'Gerenciador de Campanhas', desc: 'Plataforma completa de marketing', status: 'enabled' },
                    { id: 'ab-testing', name: 'Testes A/B', desc: 'Otimização através de testes', status: 'enabled' },
                    { id: 'lead-generation', name: 'Geração de Leads', desc: 'Captura automatizada de leads', status: 'enabled' },
                    { id: 'retargeting', name: 'Retargeting', desc: 'Campanhas de remarketing', status: 'disabled' },
                    { id: 'influencer-marketing', name: 'Marketing de Influência', desc: 'Conexão com influenciadores', status: 'enabled' }
                ]
            },
            development: {
                name: '💻 Desenvolvimento',
                count: 92,
                features: [
                    { id: 'code-editor', name: 'Editor de Código', desc: 'Editor integrado para desenvolvimento', status: 'enabled' },
                    { id: 'api-builder', name: 'Construtor de API', desc: 'Criação rápida de APIs', status: 'enabled' },
                    { id: 'database-manager', name: 'Gerenciador de Banco', desc: 'Administração de dados', status: 'enabled' },
                    { id: 'version-control', name: 'Controle de Versão', desc: 'Sistema Git integrado', status: 'enabled' },
                    { id: 'deployment-tools', name: 'Ferramentas de Deploy', desc: 'Implantação automatizada', status: 'enabled' },
                    { id: 'testing-suite', name: 'Suite de Testes', desc: 'Ferramentas completas de QA', status: 'disabled' }
                ]
            },
            security: {
                name: '🔒 Segurança',
                count: 54,
                features: [
                    { id: 'encryption', name: 'Criptografia', desc: 'Proteção de dados avançada', status: 'enabled' },
                    { id: 'firewall', name: 'Firewall', desc: 'Proteção contra ataques', status: 'enabled' },
                    { id: 'two-factor', name: 'Autenticação 2FA', desc: 'Segunda camada de segurança', status: 'enabled' },
                    { id: 'audit-logs', name: 'Logs de Auditoria', desc: 'Rastreamento completo de ações', status: 'enabled' },
                    { id: 'intrusion-detection', name: 'Detecção de Intrusão', desc: 'Monitoramento de segurança', status: 'disabled' }
                ]
            },
            administration: {
                name: '🛡️ Administração',
                count: 41,
                features: [
                    { id: 'user-management', name: 'Gerenciamento de Usuários', desc: 'Controle completo de contas', status: 'enabled' },
                    { id: 'role-permissions', name: 'Papéis e Permissões', desc: 'Sistema de autorização granular', status: 'enabled' },
                    { id: 'system-settings', name: 'Configurações do Sistema', desc: 'Ajustes globais da plataforma', status: 'enabled' },
                    { id: 'backup-restore', name: 'Backup e Restore', desc: 'Recuperação de dados', status: 'enabled' },
                    { id: 'monitoring', name: 'Monitoramento', desc: 'Observabilidade do sistema', status: 'enabled' }
                ]
            },
            integration: {
                name: '🔗 Integração',
                count: 57,
                features: [
                    { id: 'api-gateway', name: 'API Gateway', desc: 'Gerenciamento de APIs externas', status: 'enabled' },
                    { id: 'webhook-system', name: 'Sistema de Webhooks', desc: 'Integração em tempo real', status: 'enabled' },
                    { id: 'oauth-providers', name: 'Provedores OAuth', desc: 'Login social', status: 'enabled' },
                    { id: 'payment-gateways', name: 'Gateways de Pagamento', desc: 'Integração com meios de pagamento', status: 'enabled' },
                    { id: 'crm-integration', name: 'Integração CRM', desc: 'Conexão com sistemas de CRM', status: 'disabled' },
                    { id: 'erp-integration', name: 'Integração ERP', desc: 'Conexão com sistemas ERP', status: 'enabled' }
                ]
            }
        };

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('feature-search').addEventListener('input', debounce(filterFeatures, 300));
            document.getElementById('category-filter').addEventListener('change', filterFeatures);
            document.getElementById('status-filter').addEventListener('change', filterFeatures);

            loadFeatures();
        });

        function loadFeatures() {
            // Flatten features from categories
            allFeatures = [];
            Object.entries(featureCategories).forEach(([categoryId, category]) => {
                category.features.forEach(feature => {
                    allFeatures.push({
                        ...feature,
                        category: categoryId,
                        categoryName: category.name
                    });
                });
            });

            filteredFeatures = [...allFeatures];
            renderFeatures();
            updateStats();
        }

        function renderFeatures() {
            const grid = document.getElementById('features-grid');
            const categoriesToShow = {};

            // Group features by category
            filteredFeatures.forEach(feature => {
                if (!categoriesToShow[feature.category]) {
                    categoriesToShow[feature.category] = {
                        name: feature.categoryName,
                        features: []
                    };
                }
                categoriesToShow[feature.category].features.push(feature);
            });

            grid.innerHTML = Object.entries(categoriesToShow).map(([categoryId, categoryData]) => \\\`
                <div class="feature-category">
                    <div class="category-header">
                        <h3 class="category-title">\\\${categoryData.name}</h3>
                        <p class="category-count">\\\${categoryData.features.length} funcionalidades</p>
                    </div>
                    <div class="feature-list">
                        \\\${categoryData.features.map(feature => \\\`
                            <div class="feature-item">
                                <input type="checkbox" style="margin-right: 1rem;" onchange="toggleFeatureSelection('\\\${feature.id}')">
                                <div class="feature-info">
                                    <div class="feature-name">\\\${feature.name}</div>
                                    <div class="feature-desc">\\\${feature.desc}</div>
                                </div>
                                <div class="feature-controls">
                                    <span class="feature-status status-\\\${feature.status}">
                                        \\\${getStatusText(feature.status)}
                                    </span>
                                    <label class="switch">
                                        <input type="checkbox" \\\${feature.status === 'enabled' ? 'checked' : ''} onchange="toggleFeature('\\\${feature.id}')">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        \\\`).join('')}
                    </div>
                </div>
            \\\`).join('');
        }

        function updateStats() {
            const enabled = allFeatures.filter(f => f.status === 'enabled').length;
            const disabled = allFeatures.filter(f => f.status === 'disabled').length;
            const maintenance = allFeatures.filter(f => f.status === 'maintenance').length;

            document.getElementById('total-features').textContent = allFeatures.length;
            document.getElementById('enabled-features').textContent = enabled;
            document.getElementById('disabled-features').textContent = disabled;
            document.getElementById('maintenance-features').textContent = maintenance;
        }

        function filterFeatures() {
            const searchTerm = document.getElementById('feature-search').value.toLowerCase();
            const categoryFilter = document.getElementById('category-filter').value;
            const statusFilter = document.getElementById('status-filter').value;

            filteredFeatures = allFeatures.filter(feature => {
                const matchesSearch = feature.name.toLowerCase().includes(searchTerm) ||
                                    feature.desc.toLowerCase().includes(searchTerm);
                const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;
                const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;

                return matchesSearch && matchesCategory && matchesStatus;
            });

            renderFeatures();
        }

        function getStatusText(status) {
            const statuses = {
                'enabled': 'Habilitada',
                'disabled': 'Desabilitada',
                'maintenance': 'Manutenção'
            };
            return statuses[status] || 'Desabilitada';
        }

        function toggleFeature(featureId) {
            const feature = allFeatures.find(f => f.id === featureId);
            if (feature) {
                feature.status = event.target.checked ? 'enabled' : 'disabled';
                updateStats();

                // Show notification
                const statusText = feature.status === 'enabled' ? 'habilitada' : 'desabilitada';
                showNotification(\\\`Funcionalidade "\\\${feature.name}" foi \\\${statusText}\\\`, 'success');
            }
        }

        function toggleFeatureSelection(featureId) {
            if (selectedFeatures.has(featureId)) {
                selectedFeatures.delete(featureId);
            } else {
                selectedFeatures.add(featureId);
            }
            updateBulkActions();
        }

        function updateBulkActions() {
            const bulkActions = document.getElementById('bulk-actions');
            const selectedCount = document.getElementById('selected-count');

            selectedCount.textContent = selectedFeatures.size;

            if (selectedFeatures.size > 0) {
                bulkActions.classList.remove('hidden');
            } else {
                bulkActions.classList.add('hidden');
            }
        }

        function bulkEnable() {
            selectedFeatures.forEach(featureId => {
                const feature = allFeatures.find(f => f.id === featureId);
                if (feature) feature.status = 'enabled';
            });
            selectedFeatures.clear();
            updateBulkActions();
            updateStats();
            renderFeatures();
            showNotification(\\\`\\\${selectedFeatures.size} funcionalidades habilitadas\\\`, 'success');
        }

        function bulkDisable() {
            selectedFeatures.forEach(featureId => {
                const feature = allFeatures.find(f => f.id === featureId);
                if (feature) feature.status = 'disabled';
            });
            selectedFeatures.clear();
            updateBulkActions();
            updateStats();
            renderFeatures();
            showNotification(\\\`\\\${selectedFeatures.size} funcionalidades desabilitadas\\\`, 'warning');
        }

        function clearSelection() {
            selectedFeatures.clear();
            updateBulkActions();
            renderFeatures();
        }

        function enableAllFiltered() {
            filteredFeatures.forEach(feature => {
                feature.status = 'enabled';
            });
            updateStats();
            renderFeatures();
            showNotification(\\\`Todas as funcionalidades filtradas foram habilitadas\\\`, 'success');
        }

        function disableAllFiltered() {
            filteredFeatures.forEach(feature => {
                feature.status = 'disabled';
            });
            updateStats();
            renderFeatures();
            showNotification(\\\`Todas as funcionalidades filtradas foram desabilitadas\\\`, 'warning');
        }

        function showNotification(message, type = 'info') {
            // Simple notification system
            alert(message);
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

        // Initialize
        loadFeatures();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/features.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/features.astro";
const $$url = "/admin/features";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Features,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
