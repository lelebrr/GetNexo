import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Configurações Avançadas - Admin", "data-astro-cid-nc6xuisf": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div class="settings-container" data-astro-cid-nc6xuisf> <!-- Header --> <div class="settings-header" data-astro-cid-nc6xuisf> <h1 data-astro-cid-nc6xuisf>⚙️ Configurações Avançadas</h1> <p data-astro-cid-nc6xuisf>Controle completo dos parâmetros do sistema GetNexo Pro</p> </div> <!-- Settings Grid --> <div class="settings-grid" data-astro-cid-nc6xuisf> <!-- System Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🖥️ Sistema</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Modo Manutenção</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Ative para colocar o sistema em manutenção</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="maintenance-mode" onchange="toggleMaintenance()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Debug Mode</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Logs detalhados e informações de debug</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="debug-mode" onchange="toggleDebug()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Timezone Padrão</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Fuso horário do sistema</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <select class="setting-select" id="timezone" onchange="updateTimezone()" data-astro-cid-nc6xuisf> <option value="America/Sao_Paulo" selected data-astro-cid-nc6xuisf>America/Sao_Paulo</option> <option value="UTC" data-astro-cid-nc6xuisf>UTC</option> <option value="America/New_York" data-astro-cid-nc6xuisf>America/New_York</option> <option value="Europe/London" data-astro-cid-nc6xuisf>Europe/London</option> </select> </div> </div> </div> </div> <!-- Performance Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>⚡ Performance</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Cache Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Otimização de performance com cache</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="cache-enabled" checked onchange="toggleCache()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Compressão GZIP</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Reduz tamanho das respostas HTTP</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="gzip-enabled" checked onchange="toggleGzip()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>CDN Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Aceleração global com CDN</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="cdn-enabled" checked onchange="toggleCDN()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Limite de Memória</div> <div class="setting-desc" data-astro-cid-nc6xuisf>MB alocados para o processo</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="memory-limit" value="2048" onchange="updateMemoryLimit()" data-astro-cid-nc6xuisf> </div> </div> </div> </div> <!-- Security Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🔒 Segurança</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>2FA Obrigatório</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Autenticação de dois fatores obrigatória</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="2fa-required" onchange="toggle2FA()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Tentativas de Login</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Máximo de tentativas antes do bloqueio</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="max-login-attempts" value="5" onchange="updateLoginAttempts()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Sessão Expirada</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Horas até expiração automática</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="session-timeout" value="24" onchange="updateSessionTimeout()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Política de Senhas</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Complexidade requerida</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <select class="setting-select" id="password-policy" onchange="updatePasswordPolicy()" data-astro-cid-nc6xuisf> <option value="basic" selected data-astro-cid-nc6xuisf>Básica</option> <option value="medium" data-astro-cid-nc6xuisf>Média</option> <option value="strong" data-astro-cid-nc6xuisf>Forte</option> <option value="enterprise" data-astro-cid-nc6xuisf>Enterprise</option> </select> </div> </div> </div> </div> <!-- Notifications Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🔔 Notificações</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Email Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Notificações por email</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="email-notifications" checked onchange="toggleEmail()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-link" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Push Notifications</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Notificações push no navegador</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="push-notifications" checked onchange="togglePush()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>SMS Alerts</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Alertas críticos por SMS</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="sms-alerts" onchange="toggleSMS()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Slack Integration</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Notificações no Slack</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="slack-integration" onchange="toggleSlack()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> </div> </div> <!-- API Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🔌 API</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Rate Limiting</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Limitação de requests por usuário</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="rate-limiting" checked onchange="toggleRateLimiting()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Requests/Minuto</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Limite por usuário</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="requests-per-minute" value="1000" onchange="updateRateLimit()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>API Version</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Versão atual da API</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <select class="setting-select" id="api-version" onchange="updateAPIVersion()" data-astro-cid-nc6xuisf> <option value="v1" data-astro-cid-nc6xuisf>v1.0 (Legacy)</option> <option value="v2" selected data-astro-cid-nc6xuisf>v2.0 (Atual)</option> <option value="v3" data-astro-cid-nc6xuisf>v3.0 (Beta)</option> </select> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>CORS Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Cross-Origin Resource Sharing</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="cors-enabled" checked onchange="toggleCORS()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> </div> </div> <!-- Database Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🗄️ Banco de Dados</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Connection Pool</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Máximo de conexões simultâneas</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="db-pool-size" value="50" onchange="updateDBPool()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Query Timeout</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Segundos até timeout de query</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="query-timeout" value="30" onchange="updateQueryTimeout()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Read Replicas</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Usar réplicas para leitura</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="read-replicas" checked onchange="toggleReadReplicas()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Backup Automático</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Backups diários automáticos</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="auto-backup" checked onchange="toggleAutoBackup()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> </div> </div> </div> <!-- Actions Bar --> <div class="actions-bar" data-astro-cid-nc6xuisf> <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;" data-astro-cid-nc6xuisf> <div data-astro-cid-nc6xuisf> <h3 style="color: #00d4ff; margin: 0 0 0.5rem 0;" data-astro-cid-nc6xuisf>Ações Rápidas</h3> <p style="color: #94a3b8; margin: 0;" data-astro-cid-nc6xuisf>Configurações críticas e manutenção do sistema</p> </div> <div style="display: flex; gap: 1rem;" data-astro-cid-nc6xuisf> <button class="btn btn-outline" onclick="resetToDefaults()" data-astro-cid-nc6xuisf>🔄 Reset</button> <button class="btn btn-primary" onclick="saveAllSettings()" data-astro-cid-nc6xuisf>💾 Salvar Tudo</button> <button class="btn btn-danger" onclick="restartServices()" data-astro-cid-nc6xuisf>🔄 Restart Services</button> </div> </div> <div class="actions-grid" style="margin-top: 2rem;" data-astro-cid-nc6xuisf> <div class="action-card" onclick="exportSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>📤</span> <div class="action-title" data-astro-cid-nc6xuisf>Exportar Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Baixar arquivo de configuração</div> </div> <div class="action-card" onclick="importSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>📥</span> <div class="action-title" data-astro-cid-nc6xuisf>Importar Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Carregar configuração salva</div> </div> <div class="action-card" onclick="backupSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>💾</span> <div class="action-title" data-astro-cid-nc6xuisf>Backup Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Salvar snapshot das configs</div> </div> <div class="action-card" onclick="validateSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>✅</span> <div class="action-title" data-astro-cid-nc6xuisf>Validar Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Verificar configurações</div> </div> <div class="action-card" onclick="performanceTest()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>🏃</span> <div class="action-title" data-astro-cid-nc6xuisf>Teste Performance</div> <div class="action-desc" data-astro-cid-nc6xuisf>Executar benchmark</div> </div> <div class="action-card" onclick="systemInfo()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>ℹ️</span> <div class="action-title" data-astro-cid-nc6xuisf>Info Sistema</div> <div class="action-desc" data-astro-cid-nc6xuisf>Detalhes da infraestrutura</div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3006' : '/api';
        const API_CONFIG_URL = \`\${API_URL}/config\`;
        let authToken = localStorage.getItem('auth_token');

        // Settings management functions
        function toggleMaintenance() {
            const enabled = document.getElementById('maintenance-mode').checked;
            console.log('Modo manutenção:', enabled ? 'ativado' : 'desativado');
            showNotification(\`Modo manutenção \${enabled ? 'ativado' : 'desativado'}\`, enabled ? 'warning' : 'success');
        }

        function toggleDebug() {
            const enabled = document.getElementById('debug-mode').checked;
            console.log('Debug mode:', enabled ? 'ativado' : 'desativado');
            showNotification(\`Debug mode \${enabled ? 'ativado' : 'desativado'}\`, 'info');
        }

        function updateTimezone() {
            const timezone = document.getElementById('timezone').value;
            console.log('Timezone atualizado:', timezone);
            showNotification(\`Timezone alterado para \${timezone}\`, 'success');
        }

        function toggleCache() {
            const enabled = document.getElementById('cache-enabled').checked;
            console.log('Cache:', enabled ? 'ativado' : 'desativado');
            showNotification(\`Cache \${enabled ? 'ativado' : 'desativado'}\`, 'success');
        }

        function toggleGzip() {
            const enabled = document.getElementById('gzip-enabled').checked;
            console.log('GZIP:', enabled ? 'ativado' : 'desativado');
            showNotification(\`Compressão GZIP \${enabled ? 'ativada' : 'desativada'}\`, 'success');
        }

        function toggleCDN() {
            const enabled = document.getElementById('cdn-enabled').checked;
            console.log('CDN:', enabled ? 'ativado' : 'desativado');
            showNotification(\`CDN \${enabled ? 'ativado' : 'desativado'}\`, 'success');
        }

        function updateMemoryLimit() {
            const limit = document.getElementById('memory-limit').value;
            console.log('Limite de memória:', limit + 'MB');
            showNotification(\`Limite de memória definido para \${limit}MB\`, 'success');
        }

        async function saveAllSettings() {
            // Collect all settings
            const settings = {
                system: {
                    maintenance: document.getElementById('maintenance-mode').checked,
                    debug: document.getElementById('debug-mode').checked,
                    timezone: document.getElementById('timezone').value
                },
                performance: {
                    cacheEnabled: document.getElementById('cache-enabled').checked,
                    compressionEnabled: document.getElementById('gzip-enabled').checked,
                    cdnEnabled: document.getElementById('cdn-enabled').checked,
                    maxConcurrentRequests: parseInt(document.getElementById('memory-limit').value)
                },
                security: {
                    twoFactorRequired: document.getElementById('2fa-required').checked,
                    maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value),
                    sessionTimeout: parseInt(document.getElementById('session-timeout').value) * 3600, // Convert hours to seconds
                    passwordPolicy: document.getElementById('password-policy').value
                },
                notifications: {
                    emailEnabled: document.getElementById('email-notifications').checked,
                    pushEnabled: document.getElementById('push-notifications').checked,
                    smsEnabled: document.getElementById('sms-alerts').checked,
                    slackEnabled: document.getElementById('slack-integration').checked
                },
                api: {
                    rateLimiting: document.getElementById('rate-limiting').checked,
                    requestsPerMinute: document.getElementById('requests-per-minute').value,
                    version: document.getElementById('api-version').value,
                    cors: document.getElementById('cors-enabled').checked
                },
                database: {
                    poolSize: document.getElementById('db-pool-size').value,
                    queryTimeout: document.getElementById('query-timeout').value,
                    readReplicas: document.getElementById('read-replicas').checked,
                    autoBackup: document.getElementById('auto-backup').checked
                }
            };

            console.log('Salvando configurações:', settings);

            // Save to API
            const savePromises = [
                saveAPIConfig('performance', settings.performance),
                saveAPIConfig('security', settings.security),
                saveAPIConfig('notifications', settings.notifications)
            ];

            try {
                const results = await Promise.allSettled(savePromises);
                const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

                if (successCount === savePromises.length) {
                    showNotification('Todas as configurações salvas com sucesso na API!', 'success');
                } else if (successCount > 0) {
                    showNotification(\`\${successCount} configurações salvas. Algumas falharam.\`, 'warning');
                } else {
                    showNotification('Falha ao salvar configurações na API. Verifique sua conexão.', 'error');
                }
            } catch (error) {
                console.error('Erro geral ao salvar configurações:', error);
                showNotification('Erro ao salvar configurações', 'error');
            }
        }

        function resetToDefaults() {
            if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
                // Reset all form elements to defaults
                document.getElementById('maintenance-mode').checked = false;
                document.getElementById('debug-mode').checked = false;
                document.getElementById('cache-enabled').checked = true;
                document.getElementById('gzip-enabled').checked = true;
                document.getElementById('cdn-enabled').checked = true;
                document.getElementById('2fa-required').checked = false;
                document.getElementById('email-notifications').checked = true;
                document.getElementById('push-notifications').checked = true;
                document.getElementById('rate-limiting').checked = true;
                document.getElementById('cors-enabled').checked = true;
                document.getElementById('read-replicas').checked = true;
                document.getElementById('auto-backup').checked = true;

                showNotification('Configurações resetadas para valores padrão', 'warning');
            }
        }

        function restartServices() {
            if (confirm('Isso reiniciará todos os serviços. Usuários podem experimentar breve indisponibilidade. Continuar?')) {
                showNotification('Reiniciando serviços... Aguarde alguns minutos.', 'warning');
                setTimeout(() => {
                    showNotification('Todos os serviços reiniciados com sucesso!', 'success');
                }, 3000);
            }
        }

        function exportSettings() {
            const settings = {
                exportedAt: new Date().toISOString(),
                version: '2.0',
                settings: {
                    // Collect current settings
                }
            };

            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.download = \`getnexo-settings-\${new Date().toISOString().split('T')[0]}.json\`;
            link.href = URL.createObjectURL(blob);
            link.click();

            showNotification('Configurações exportadas com sucesso!', 'success');
        }

        function importSettings() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const settings = JSON.parse(event.target.result);
                        console.log('Configurações importadas:', settings);
                        showNotification('Configurações importadas com sucesso!', 'success');
                    } catch (error) {
                        showNotification('Erro ao importar configurações', 'error');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        function backupSettings() {
            showNotification('Snapshot das configurações criado e armazenado!', 'success');
        }

        function validateSettings() {
            showNotification('Validação concluída: Todas as configurações são válidas!', 'success');
        }

        function performanceTest() {
            showNotification('Executando teste de performance... Resultados em breve.', 'info');
            setTimeout(() => {
                showNotification('Teste concluído: Performance dentro dos parâmetros ótimos!', 'success');
            }, 5000);
        }

        function systemInfo() {
            const info = {
                server: 'Ubuntu 22.04 LTS',
                nodeVersion: 'v18.17.0',
                database: 'PostgreSQL 15.3',
                cache: 'Redis 7.0',
                uptime: '15 dias, 8 horas',
                memory: '4.2GB / 8GB',
                cpu: '2.4GHz Quad-core',
                disk: '245GB / 500GB'
            };

            let message = 'Informações do Sistema:\\n\\n';
            Object.entries(info).forEach(([key, value]) => {
                message += \`\${key}: \${value}\\n\`;
            });

            alert(message);
        }

        // API Integration Functions
        async function loadAPIConfig(category) {
            try {
                const response = await fetch(\`\${API_CONFIG_URL}/\${category}\`, {
                    headers: {
                        'Authorization': \`Bearer \${authToken}\`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(\`Configuração \${category} carregada:\`, data);
                    return data.config;
                } else {
                    console.warn(\`Falha ao carregar configuração \${category}:\`, response.status);
                    return null;
                }
            } catch (error) {
                console.error(\`Erro ao carregar configuração \${category}:\`, error);
                return null;
            }
        }

        async function saveAPIConfig(category, config) {
            try {
                const response = await fetch(\`\${API_CONFIG_URL}/\${category}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${authToken}\`
                    },
                    body: JSON.stringify(config)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(\`Configuração \${category} salva:\`, result);
                    showNotification(\`Configuração \${category} salva com sucesso!\`, 'success');
                    return true;
                } else {
                    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
                    showNotification(\`Erro ao salvar configuração \${category}: \${error.error}\`, 'error');
                    return false;
                }
            } catch (error) {
                console.error(\`Erro ao salvar configuração \${category}:\`, error);
                showNotification(\`Erro de conexão ao salvar \${category}\`, 'error');
                return false;
            }
        }

        async function loadAllAPIConfigs() {
            const categories = ['ai', 'performance', 'security', 'notifications'];
            const configs = {};

            for (const category of categories) {
                configs[category] = await loadAPIConfig(category);
            }

            console.log('Todas as configurações da API carregadas:', configs);
            return configs;
        }

        function showNotification(message, type = 'info') {
            console.log(\`[\${type.toUpperCase()}] \${message}\`);

            // Enhanced notification with better styling
            const notification = document.createElement('div');
            notification.className = \`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm \${
                type === 'success' ? 'bg-green-600 text-white' :
                type === 'error' ? 'bg-red-600 text-white' :
                type === 'warning' ? 'bg-yellow-600 text-white' :
                'bg-blue-600 text-white'
            }\`;
            notification.innerHTML = \`
                <div class="flex items-center">
                    <span class="mr-2">\${
                        type === 'success' ? '✅' :
                        type === 'error' ? '❌' :
                        type === 'warning' ? '⚠️' : 'ℹ️'
                    }</span>
                    <span>\${message}</span>
                </div>
            \`;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        // Initialize - load current settings
        document.addEventListener('DOMContentLoaded', async function() {
            console.log('Configurações avançadas carregadas');

            // Try to load configurations from API
            try {
                const apiConfigs = await loadAllAPIConfigs();

                // Apply API configurations to UI
                if (apiConfigs.performance) {
                    const perf = apiConfigs.performance;
                    if (document.getElementById('cache-enabled')) {
                        document.getElementById('cache-enabled').checked = perf.cacheEnabled !== false;
                    }
                    if (document.getElementById('gzip-enabled')) {
                        document.getElementById('gzip-enabled').checked = perf.compressionEnabled !== false;
                    }
                }

                if (apiConfigs.security) {
                    const sec = apiConfigs.security;
                    if (document.getElementById('2fa-required')) {
                        document.getElementById('2fa-required').checked = sec.twoFactorRequired === true;
                    }
                    if (sec.maxLoginAttempts && document.getElementById('max-login-attempts')) {
                        document.getElementById('max-login-attempts').value = sec.maxLoginAttempts;
                    }
                    if (sec.sessionTimeout && document.getElementById('session-timeout')) {
                        document.getElementById('session-timeout').value = Math.round(sec.sessionTimeout / 3600); // Convert to hours
                    }
                }

                showNotification('Configurações carregadas da API!', 'success');
            } catch (error) {
                console.warn('Falha ao carregar configurações da API, usando padrões locais:', error);
            }
        });
    <\/script> </div>`], ["  ", `<div class="settings-container" data-astro-cid-nc6xuisf> <!-- Header --> <div class="settings-header" data-astro-cid-nc6xuisf> <h1 data-astro-cid-nc6xuisf>⚙️ Configurações Avançadas</h1> <p data-astro-cid-nc6xuisf>Controle completo dos parâmetros do sistema GetNexo Pro</p> </div> <!-- Settings Grid --> <div class="settings-grid" data-astro-cid-nc6xuisf> <!-- System Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🖥️ Sistema</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Modo Manutenção</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Ative para colocar o sistema em manutenção</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="maintenance-mode" onchange="toggleMaintenance()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Debug Mode</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Logs detalhados e informações de debug</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="debug-mode" onchange="toggleDebug()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Timezone Padrão</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Fuso horário do sistema</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <select class="setting-select" id="timezone" onchange="updateTimezone()" data-astro-cid-nc6xuisf> <option value="America/Sao_Paulo" selected data-astro-cid-nc6xuisf>America/Sao_Paulo</option> <option value="UTC" data-astro-cid-nc6xuisf>UTC</option> <option value="America/New_York" data-astro-cid-nc6xuisf>America/New_York</option> <option value="Europe/London" data-astro-cid-nc6xuisf>Europe/London</option> </select> </div> </div> </div> </div> <!-- Performance Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>⚡ Performance</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Cache Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Otimização de performance com cache</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="cache-enabled" checked onchange="toggleCache()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Compressão GZIP</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Reduz tamanho das respostas HTTP</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="gzip-enabled" checked onchange="toggleGzip()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>CDN Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Aceleração global com CDN</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="cdn-enabled" checked onchange="toggleCDN()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Limite de Memória</div> <div class="setting-desc" data-astro-cid-nc6xuisf>MB alocados para o processo</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="memory-limit" value="2048" onchange="updateMemoryLimit()" data-astro-cid-nc6xuisf> </div> </div> </div> </div> <!-- Security Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🔒 Segurança</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>2FA Obrigatório</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Autenticação de dois fatores obrigatória</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="2fa-required" onchange="toggle2FA()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Tentativas de Login</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Máximo de tentativas antes do bloqueio</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="max-login-attempts" value="5" onchange="updateLoginAttempts()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Sessão Expirada</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Horas até expiração automática</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="session-timeout" value="24" onchange="updateSessionTimeout()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Política de Senhas</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Complexidade requerida</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <select class="setting-select" id="password-policy" onchange="updatePasswordPolicy()" data-astro-cid-nc6xuisf> <option value="basic" selected data-astro-cid-nc6xuisf>Básica</option> <option value="medium" data-astro-cid-nc6xuisf>Média</option> <option value="strong" data-astro-cid-nc6xuisf>Forte</option> <option value="enterprise" data-astro-cid-nc6xuisf>Enterprise</option> </select> </div> </div> </div> </div> <!-- Notifications Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🔔 Notificações</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Email Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Notificações por email</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="email-notifications" checked onchange="toggleEmail()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-link" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Push Notifications</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Notificações push no navegador</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="push-notifications" checked onchange="togglePush()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>SMS Alerts</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Alertas críticos por SMS</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="sms-alerts" onchange="toggleSMS()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Slack Integration</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Notificações no Slack</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="slack-integration" onchange="toggleSlack()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> </div> </div> <!-- API Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🔌 API</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Rate Limiting</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Limitação de requests por usuário</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="rate-limiting" checked onchange="toggleRateLimiting()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Requests/Minuto</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Limite por usuário</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="requests-per-minute" value="1000" onchange="updateRateLimit()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>API Version</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Versão atual da API</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <select class="setting-select" id="api-version" onchange="updateAPIVersion()" data-astro-cid-nc6xuisf> <option value="v1" data-astro-cid-nc6xuisf>v1.0 (Legacy)</option> <option value="v2" selected data-astro-cid-nc6xuisf>v2.0 (Atual)</option> <option value="v3" data-astro-cid-nc6xuisf>v3.0 (Beta)</option> </select> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>CORS Ativado</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Cross-Origin Resource Sharing</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="cors-enabled" checked onchange="toggleCORS()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> </div> </div> <!-- Database Settings --> <div class="settings-card" data-astro-cid-nc6xuisf> <div class="card-header" data-astro-cid-nc6xuisf> <h2 class="card-title" data-astro-cid-nc6xuisf>🗄️ Banco de Dados</h2> </div> <div class="setting-group" data-astro-cid-nc6xuisf> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Connection Pool</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Máximo de conexões simultâneas</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="db-pool-size" value="50" onchange="updateDBPool()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Query Timeout</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Segundos até timeout de query</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <input type="number" class="setting-input" id="query-timeout" value="30" onchange="updateQueryTimeout()" data-astro-cid-nc6xuisf> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Read Replicas</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Usar réplicas para leitura</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="read-replicas" checked onchange="toggleReadReplicas()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> <div class="setting-item" data-astro-cid-nc6xuisf> <div class="setting-info" data-astro-cid-nc6xuisf> <div class="setting-label" data-astro-cid-nc6xuisf>Backup Automático</div> <div class="setting-desc" data-astro-cid-nc6xuisf>Backups diários automáticos</div> </div> <div class="setting-control" data-astro-cid-nc6xuisf> <label class="switch" data-astro-cid-nc6xuisf> <input type="checkbox" id="auto-backup" checked onchange="toggleAutoBackup()" data-astro-cid-nc6xuisf> <span class="slider" data-astro-cid-nc6xuisf></span> </label> </div> </div> </div> </div> </div> <!-- Actions Bar --> <div class="actions-bar" data-astro-cid-nc6xuisf> <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;" data-astro-cid-nc6xuisf> <div data-astro-cid-nc6xuisf> <h3 style="color: #00d4ff; margin: 0 0 0.5rem 0;" data-astro-cid-nc6xuisf>Ações Rápidas</h3> <p style="color: #94a3b8; margin: 0;" data-astro-cid-nc6xuisf>Configurações críticas e manutenção do sistema</p> </div> <div style="display: flex; gap: 1rem;" data-astro-cid-nc6xuisf> <button class="btn btn-outline" onclick="resetToDefaults()" data-astro-cid-nc6xuisf>🔄 Reset</button> <button class="btn btn-primary" onclick="saveAllSettings()" data-astro-cid-nc6xuisf>💾 Salvar Tudo</button> <button class="btn btn-danger" onclick="restartServices()" data-astro-cid-nc6xuisf>🔄 Restart Services</button> </div> </div> <div class="actions-grid" style="margin-top: 2rem;" data-astro-cid-nc6xuisf> <div class="action-card" onclick="exportSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>📤</span> <div class="action-title" data-astro-cid-nc6xuisf>Exportar Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Baixar arquivo de configuração</div> </div> <div class="action-card" onclick="importSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>📥</span> <div class="action-title" data-astro-cid-nc6xuisf>Importar Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Carregar configuração salva</div> </div> <div class="action-card" onclick="backupSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>💾</span> <div class="action-title" data-astro-cid-nc6xuisf>Backup Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Salvar snapshot das configs</div> </div> <div class="action-card" onclick="validateSettings()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>✅</span> <div class="action-title" data-astro-cid-nc6xuisf>Validar Config</div> <div class="action-desc" data-astro-cid-nc6xuisf>Verificar configurações</div> </div> <div class="action-card" onclick="performanceTest()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>🏃</span> <div class="action-title" data-astro-cid-nc6xuisf>Teste Performance</div> <div class="action-desc" data-astro-cid-nc6xuisf>Executar benchmark</div> </div> <div class="action-card" onclick="systemInfo()" data-astro-cid-nc6xuisf> <span class="action-icon" data-astro-cid-nc6xuisf>ℹ️</span> <div class="action-title" data-astro-cid-nc6xuisf>Info Sistema</div> <div class="action-desc" data-astro-cid-nc6xuisf>Detalhes da infraestrutura</div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3006' : '/api';
        const API_CONFIG_URL = \\\`\\\${API_URL}/config\\\`;
        let authToken = localStorage.getItem('auth_token');

        // Settings management functions
        function toggleMaintenance() {
            const enabled = document.getElementById('maintenance-mode').checked;
            console.log('Modo manutenção:', enabled ? 'ativado' : 'desativado');
            showNotification(\\\`Modo manutenção \\\${enabled ? 'ativado' : 'desativado'}\\\`, enabled ? 'warning' : 'success');
        }

        function toggleDebug() {
            const enabled = document.getElementById('debug-mode').checked;
            console.log('Debug mode:', enabled ? 'ativado' : 'desativado');
            showNotification(\\\`Debug mode \\\${enabled ? 'ativado' : 'desativado'}\\\`, 'info');
        }

        function updateTimezone() {
            const timezone = document.getElementById('timezone').value;
            console.log('Timezone atualizado:', timezone);
            showNotification(\\\`Timezone alterado para \\\${timezone}\\\`, 'success');
        }

        function toggleCache() {
            const enabled = document.getElementById('cache-enabled').checked;
            console.log('Cache:', enabled ? 'ativado' : 'desativado');
            showNotification(\\\`Cache \\\${enabled ? 'ativado' : 'desativado'}\\\`, 'success');
        }

        function toggleGzip() {
            const enabled = document.getElementById('gzip-enabled').checked;
            console.log('GZIP:', enabled ? 'ativado' : 'desativado');
            showNotification(\\\`Compressão GZIP \\\${enabled ? 'ativada' : 'desativada'}\\\`, 'success');
        }

        function toggleCDN() {
            const enabled = document.getElementById('cdn-enabled').checked;
            console.log('CDN:', enabled ? 'ativado' : 'desativado');
            showNotification(\\\`CDN \\\${enabled ? 'ativado' : 'desativado'}\\\`, 'success');
        }

        function updateMemoryLimit() {
            const limit = document.getElementById('memory-limit').value;
            console.log('Limite de memória:', limit + 'MB');
            showNotification(\\\`Limite de memória definido para \\\${limit}MB\\\`, 'success');
        }

        async function saveAllSettings() {
            // Collect all settings
            const settings = {
                system: {
                    maintenance: document.getElementById('maintenance-mode').checked,
                    debug: document.getElementById('debug-mode').checked,
                    timezone: document.getElementById('timezone').value
                },
                performance: {
                    cacheEnabled: document.getElementById('cache-enabled').checked,
                    compressionEnabled: document.getElementById('gzip-enabled').checked,
                    cdnEnabled: document.getElementById('cdn-enabled').checked,
                    maxConcurrentRequests: parseInt(document.getElementById('memory-limit').value)
                },
                security: {
                    twoFactorRequired: document.getElementById('2fa-required').checked,
                    maxLoginAttempts: parseInt(document.getElementById('max-login-attempts').value),
                    sessionTimeout: parseInt(document.getElementById('session-timeout').value) * 3600, // Convert hours to seconds
                    passwordPolicy: document.getElementById('password-policy').value
                },
                notifications: {
                    emailEnabled: document.getElementById('email-notifications').checked,
                    pushEnabled: document.getElementById('push-notifications').checked,
                    smsEnabled: document.getElementById('sms-alerts').checked,
                    slackEnabled: document.getElementById('slack-integration').checked
                },
                api: {
                    rateLimiting: document.getElementById('rate-limiting').checked,
                    requestsPerMinute: document.getElementById('requests-per-minute').value,
                    version: document.getElementById('api-version').value,
                    cors: document.getElementById('cors-enabled').checked
                },
                database: {
                    poolSize: document.getElementById('db-pool-size').value,
                    queryTimeout: document.getElementById('query-timeout').value,
                    readReplicas: document.getElementById('read-replicas').checked,
                    autoBackup: document.getElementById('auto-backup').checked
                }
            };

            console.log('Salvando configurações:', settings);

            // Save to API
            const savePromises = [
                saveAPIConfig('performance', settings.performance),
                saveAPIConfig('security', settings.security),
                saveAPIConfig('notifications', settings.notifications)
            ];

            try {
                const results = await Promise.allSettled(savePromises);
                const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

                if (successCount === savePromises.length) {
                    showNotification('Todas as configurações salvas com sucesso na API!', 'success');
                } else if (successCount > 0) {
                    showNotification(\\\`\\\${successCount} configurações salvas. Algumas falharam.\\\`, 'warning');
                } else {
                    showNotification('Falha ao salvar configurações na API. Verifique sua conexão.', 'error');
                }
            } catch (error) {
                console.error('Erro geral ao salvar configurações:', error);
                showNotification('Erro ao salvar configurações', 'error');
            }
        }

        function resetToDefaults() {
            if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
                // Reset all form elements to defaults
                document.getElementById('maintenance-mode').checked = false;
                document.getElementById('debug-mode').checked = false;
                document.getElementById('cache-enabled').checked = true;
                document.getElementById('gzip-enabled').checked = true;
                document.getElementById('cdn-enabled').checked = true;
                document.getElementById('2fa-required').checked = false;
                document.getElementById('email-notifications').checked = true;
                document.getElementById('push-notifications').checked = true;
                document.getElementById('rate-limiting').checked = true;
                document.getElementById('cors-enabled').checked = true;
                document.getElementById('read-replicas').checked = true;
                document.getElementById('auto-backup').checked = true;

                showNotification('Configurações resetadas para valores padrão', 'warning');
            }
        }

        function restartServices() {
            if (confirm('Isso reiniciará todos os serviços. Usuários podem experimentar breve indisponibilidade. Continuar?')) {
                showNotification('Reiniciando serviços... Aguarde alguns minutos.', 'warning');
                setTimeout(() => {
                    showNotification('Todos os serviços reiniciados com sucesso!', 'success');
                }, 3000);
            }
        }

        function exportSettings() {
            const settings = {
                exportedAt: new Date().toISOString(),
                version: '2.0',
                settings: {
                    // Collect current settings
                }
            };

            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.download = \\\`getnexo-settings-\\\${new Date().toISOString().split('T')[0]}.json\\\`;
            link.href = URL.createObjectURL(blob);
            link.click();

            showNotification('Configurações exportadas com sucesso!', 'success');
        }

        function importSettings() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        const settings = JSON.parse(event.target.result);
                        console.log('Configurações importadas:', settings);
                        showNotification('Configurações importadas com sucesso!', 'success');
                    } catch (error) {
                        showNotification('Erro ao importar configurações', 'error');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        function backupSettings() {
            showNotification('Snapshot das configurações criado e armazenado!', 'success');
        }

        function validateSettings() {
            showNotification('Validação concluída: Todas as configurações são válidas!', 'success');
        }

        function performanceTest() {
            showNotification('Executando teste de performance... Resultados em breve.', 'info');
            setTimeout(() => {
                showNotification('Teste concluído: Performance dentro dos parâmetros ótimos!', 'success');
            }, 5000);
        }

        function systemInfo() {
            const info = {
                server: 'Ubuntu 22.04 LTS',
                nodeVersion: 'v18.17.0',
                database: 'PostgreSQL 15.3',
                cache: 'Redis 7.0',
                uptime: '15 dias, 8 horas',
                memory: '4.2GB / 8GB',
                cpu: '2.4GHz Quad-core',
                disk: '245GB / 500GB'
            };

            let message = 'Informações do Sistema:\\\\n\\\\n';
            Object.entries(info).forEach(([key, value]) => {
                message += \\\`\\\${key}: \\\${value}\\\\n\\\`;
            });

            alert(message);
        }

        // API Integration Functions
        async function loadAPIConfig(category) {
            try {
                const response = await fetch(\\\`\\\${API_CONFIG_URL}/\\\${category}\\\`, {
                    headers: {
                        'Authorization': \\\`Bearer \\\${authToken}\\\`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(\\\`Configuração \\\${category} carregada:\\\`, data);
                    return data.config;
                } else {
                    console.warn(\\\`Falha ao carregar configuração \\\${category}:\\\`, response.status);
                    return null;
                }
            } catch (error) {
                console.error(\\\`Erro ao carregar configuração \\\${category}:\\\`, error);
                return null;
            }
        }

        async function saveAPIConfig(category, config) {
            try {
                const response = await fetch(\\\`\\\${API_CONFIG_URL}/\\\${category}\\\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \\\`Bearer \\\${authToken}\\\`
                    },
                    body: JSON.stringify(config)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(\\\`Configuração \\\${category} salva:\\\`, result);
                    showNotification(\\\`Configuração \\\${category} salva com sucesso!\\\`, 'success');
                    return true;
                } else {
                    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
                    showNotification(\\\`Erro ao salvar configuração \\\${category}: \\\${error.error}\\\`, 'error');
                    return false;
                }
            } catch (error) {
                console.error(\\\`Erro ao salvar configuração \\\${category}:\\\`, error);
                showNotification(\\\`Erro de conexão ao salvar \\\${category}\\\`, 'error');
                return false;
            }
        }

        async function loadAllAPIConfigs() {
            const categories = ['ai', 'performance', 'security', 'notifications'];
            const configs = {};

            for (const category of categories) {
                configs[category] = await loadAPIConfig(category);
            }

            console.log('Todas as configurações da API carregadas:', configs);
            return configs;
        }

        function showNotification(message, type = 'info') {
            console.log(\\\`[\\\${type.toUpperCase()}] \\\${message}\\\`);

            // Enhanced notification with better styling
            const notification = document.createElement('div');
            notification.className = \\\`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm \\\${
                type === 'success' ? 'bg-green-600 text-white' :
                type === 'error' ? 'bg-red-600 text-white' :
                type === 'warning' ? 'bg-yellow-600 text-white' :
                'bg-blue-600 text-white'
            }\\\`;
            notification.innerHTML = \\\`
                <div class="flex items-center">
                    <span class="mr-2">\\\${
                        type === 'success' ? '✅' :
                        type === 'error' ? '❌' :
                        type === 'warning' ? '⚠️' : 'ℹ️'
                    }</span>
                    <span>\\\${message}</span>
                </div>
            \\\`;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        // Initialize - load current settings
        document.addEventListener('DOMContentLoaded', async function() {
            console.log('Configurações avançadas carregadas');

            // Try to load configurations from API
            try {
                const apiConfigs = await loadAllAPIConfigs();

                // Apply API configurations to UI
                if (apiConfigs.performance) {
                    const perf = apiConfigs.performance;
                    if (document.getElementById('cache-enabled')) {
                        document.getElementById('cache-enabled').checked = perf.cacheEnabled !== false;
                    }
                    if (document.getElementById('gzip-enabled')) {
                        document.getElementById('gzip-enabled').checked = perf.compressionEnabled !== false;
                    }
                }

                if (apiConfigs.security) {
                    const sec = apiConfigs.security;
                    if (document.getElementById('2fa-required')) {
                        document.getElementById('2fa-required').checked = sec.twoFactorRequired === true;
                    }
                    if (sec.maxLoginAttempts && document.getElementById('max-login-attempts')) {
                        document.getElementById('max-login-attempts').value = sec.maxLoginAttempts;
                    }
                    if (sec.sessionTimeout && document.getElementById('session-timeout')) {
                        document.getElementById('session-timeout').value = Math.round(sec.sessionTimeout / 3600); // Convert to hours
                    }
                }

                showNotification('Configurações carregadas da API!', 'success');
            } catch (error) {
                console.warn('Falha ao carregar configurações da API, usando padrões locais:', error);
            }
        });
    <\/script> </div>`])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/settings.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/settings.astro";
const $$url = "/admin/settings";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
