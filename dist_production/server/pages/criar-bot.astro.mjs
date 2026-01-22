import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                    */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$CriarBot = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Criar Plugin GetNexo – Instale em qualquer site", "data-astro-cid-b6zjrpuk": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(['  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"> ', `<div class="page-wrapper" data-astro-cid-b6zjrpuk> <!-- AUTH GATE SECTION --> <div id="auth-gate" class="auth-gate hidden" data-astro-cid-b6zjrpuk> <div class="auth-card glass-panel reveal" data-astro-cid-b6zjrpuk> <div class="auth-header" data-astro-cid-b6zjrpuk> <div class="auth-logo" data-astro-cid-b6zjrpuk>N</div> <h1 data-astro-cid-b6zjrpuk>Comece sua Jornada</h1> <p data-astro-cid-b6zjrpuk>Você precisa estar logado para configurar seu plugin e acessar o suporte prioritário.</p> </div> <div id="auth-choice" class="auth-choice" data-astro-cid-b6zjrpuk> <button class="btn-auth-primary" onclick="showAuthMode('register')" data-astro-cid-b6zjrpuk>Criar Conta Grátis</button> <button class="btn-auth-secondary" onclick="showAuthMode('login')" data-astro-cid-b6zjrpuk>Já tenho conta (Entrar)</button> <div class="auth-divider" data-astro-cid-b6zjrpuk><span data-astro-cid-b6zjrpuk>ou continue com</span></div> <div class="social-auth" data-astro-cid-b6zjrpuk> <button class="social-btn" onclick="loginWithGoogle()" data-astro-cid-b6zjrpuk>Google</button> <button class="social-btn" onclick="loginWithGitHub()" data-astro-cid-b6zjrpuk>GitHub</button> </div> </div> <!-- LOGIN FORM --> <form id="login-form" class="auth-form hidden" data-astro-cid-b6zjrpuk> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>E-mail</label> <input type="email" name="email" required placeholder="seu@email.com" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Senha</label> <input type="password" name="password" required placeholder="••••••••" data-astro-cid-b6zjrpuk> </div> <button type="submit" class="btn-next" data-astro-cid-b6zjrpuk>Entrar →</button> <p class="auth-switch" data-astro-cid-b6zjrpuk>Ainda não tem conta? <a href="#" onclick="showAuthMode('register')" data-astro-cid-b6zjrpuk>Cadastre-se</a></p> </form> <!-- REGISTER FORM --> <form id="register-form" class="auth-form hidden" data-astro-cid-b6zjrpuk> <div class="form-grid" data-astro-cid-b6zjrpuk> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Seu Nome Completo *</label> <input type="text" name="name" id="reg-name" required placeholder="João da Silva" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>E-mail Corporativo/Real *</label> <input type="email" name="email" id="reg-email" required placeholder="joao@empresa.com" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Crie uma Senha *</label> <input type="password" name="password" id="reg-password" required placeholder="Mínimo 8 caracteres" minlength="8" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Tipo de Pessoa *</label> <select name="person_type" id="reg-person-type" required onchange="togglePersonFields()" data-astro-cid-b6zjrpuk> <option value="" data-astro-cid-b6zjrpuk>Selecione...</option> <option value="pf" data-astro-cid-b6zjrpuk>Pessoa Física</option> <option value="pj" data-astro-cid-b6zjrpuk>Pessoa Jurídica</option> </select> </div> <div class="field" id="cpf-field" style="display: none;" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>CPF *</label> <input type="text" name="cpf" id="reg-cpf" placeholder="000.000.000-00" data-astro-cid-b6zjrpuk> </div> <div class="field" id="cnpj-field" style="display: none;" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>CNPJ *</label> <input type="text" name="cnpj" id="reg-cnpj" placeholder="00.000.000/0000-00" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Nome da Empresa (Opcional)</label> <input type="text" name="company" placeholder="Minha Empresa Ltda" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Seu Site Principal *</label> <input type="url" name="website" id="reg-site" required placeholder="https://seusite.com.br" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>WhatsApp Corporativo *</label> <input type="tel" name="whatsapp" id="reg-whatsapp" required data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Segmento de Atuação *</label> <select name="segment" required data-astro-cid-b6zjrpuk> <option value="" data-astro-cid-b6zjrpuk>Selecione...</option> <option value="ecommerce" data-astro-cid-b6zjrpuk>E-commerce / Varejo</option> <option value="servicos" data-astro-cid-b6zjrpuk>Serviços / Consultoria</option> <option value="saude" data-astro-cid-b6zjrpuk>Saúde / Bem-estar</option> <option value="infoproducts" data-astro-cid-b6zjrpuk>Infoprodutos / Educação</option> <option value="outros" data-astro-cid-b6zjrpuk>Outros</option> </select> </div> </div> <div class="auth-checks" data-astro-cid-b6zjrpuk> <label class="checkbox-container" data-astro-cid-b6zjrpuk> <input type="checkbox" required checked data-astro-cid-b6zjrpuk> <span class="checkmark" data-astro-cid-b6zjrpuk></span>
Aceito os <a href="/termos" data-astro-cid-b6zjrpuk>Termos de Uso</a> e <a href="/privacidade" data-astro-cid-b6zjrpuk>Privacidade</a> </label> </div> <div id="reg-error" class="error-msg" data-astro-cid-b6zjrpuk></div> <button type="submit" class="btn-next" id="btn-submit-register" data-astro-cid-b6zjrpuk>Criar Minha Conta →</button> <p class="auth-switch" data-astro-cid-b6zjrpuk>Já tem conta? <a href="#" onclick="showAuthMode('login')" data-astro-cid-b6zjrpuk>Fazer Login</a></p> </form> <!-- OTP VERIFICATION --> <div id="otp-section" class="auth-form hidden" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>Validar WhatsApp</h2> <p data-astro-cid-b6zjrpuk>Enviamos um código de 6 dígitos para o seu WhatsApp. Digite abaixo para ativar sua conta.</p> <div class="otp-input-container" data-astro-cid-b6zjrpuk> <input type="text" id="otp-code" maxlength="6" placeholder="000000" data-astro-cid-b6zjrpuk> </div> <div id="otp-error" class="error-msg" data-astro-cid-b6zjrpuk></div> <button class="btn-next" onclick="verifyOTP()" data-astro-cid-b6zjrpuk>Validar Código ✅</button> <p class="resend-text" data-astro-cid-b6zjrpuk>Não recebeu? <a href="#" onclick="resendOTP()" data-astro-cid-b6zjrpuk>Reenviar em <span id="otp-timer" data-astro-cid-b6zjrpuk>30</span>s</a></p> </div> </div> </div> <!-- WIZARD SECTION (Only visible if logged in) --> <div id="wizard-section" class="wizard-container hidden" data-astro-cid-b6zjrpuk> <header class="wizard-header" data-astro-cid-b6zjrpuk> <h1 data-astro-cid-b6zjrpuk>Criar Plugin</h1> <p data-astro-cid-b6zjrpuk>Dashboard: <span id="user-display-name" data-astro-cid-b6zjrpuk>Carregando...</span></p> <div class="all-required-notice" data-astro-cid-b6zjrpuk>Configuração Finalizada com Sucesso</div> </header> <!-- Step Indicators --> <div class="step-indicators" data-astro-cid-b6zjrpuk> <div class="step-item active" data-step="1" data-astro-cid-b6zjrpuk> <span class="step-number" data-astro-cid-b6zjrpuk>1</span> <span class="step-label" data-astro-cid-b6zjrpuk>Personalização</span> </div> <div class="step-line" data-astro-cid-b6zjrpuk></div> <div class="step-item" data-step="2" data-astro-cid-b6zjrpuk> <span class="step-number" data-astro-cid-b6zjrpuk>2</span> <span class="step-label" data-astro-cid-b6zjrpuk>Visual</span> </div> <div class="step-line" data-astro-cid-b6zjrpuk></div> <div class="step-item" data-step="3" data-astro-cid-b6zjrpuk> <span class="step-number" data-astro-cid-b6zjrpuk>3</span> <span class="step-label" data-astro-cid-b6zjrpuk>Código</span> </div> </div> <!-- Wizard Step 1: Config (Simplified since we have user data) --> <div class="step-content" id="step1" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>🎨 Configure seu Bot</h2> <form id="wizard-form" class="wizard-form" data-astro-cid-b6zjrpuk> <div class="form-grid" data-astro-cid-b6zjrpuk> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Nome do Assistente *</label> <input type="text" id="bot-name" placeholder="Ex: Nexus Vendas" required data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Site para o Widget *</label> <input type="url" id="bot-site" placeholder="https://seusite.com.br" required data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Tom de Voz</label> <select id="bot-tone" data-astro-cid-b6zjrpuk> <option value="formal" data-astro-cid-b6zjrpuk>Formal e Profissional</option> <option value="casual" selected data-astro-cid-b6zjrpuk>Casual e Amigável</option> <option value="urgencia" data-astro-cid-b6zjrpuk>Focado em Urgência/Vendas</option> </select> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Emoji de Destaque</label> <input type="text" id="bot-emoji" value="🤖" placeholder="Escolha um emoji" data-astro-cid-b6zjrpuk> </div> </div> <button type="submit" class="btn-next" data-astro-cid-b6zjrpuk>Gerar Visual Prévio →</button> </form> </div> <!-- Wizard Step 2: Preview --> <div class="step-content hidden" id="step2" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>✨ Preview do Estilo</h2> <div class="preview-area glass-panel" data-astro-cid-b6zjrpuk> <div class="mock-widget" data-astro-cid-b6zjrpuk> <div class="mock-header" data-astro-cid-b6zjrpuk> <span id="preview-emoji" data-astro-cid-b6zjrpuk>🤖</span> <strong id="preview-name" data-astro-cid-b6zjrpuk>Nexus Bot</strong> </div> <div class="mock-body" data-astro-cid-b6zjrpuk> <div class="mock-msg" data-astro-cid-b6zjrpuk>Olá! Como posso ajudar você hoje?</div> </div> </div> <div class="theme-choices" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Tema de Cor:</label> <div class="theme-dots" data-astro-cid-b6zjrpuk> <div class="dot active" style="background:#00d4ff;" onclick="setTheme('neon')" data-astro-cid-b6zjrpuk></div> <div class="dot" style="background:#00ff9d;" onclick="setTheme('matrix')" data-astro-cid-b6zjrpuk></div> <div class="dot" style="background:#f43f5e;" onclick="setTheme('sunset')" data-astro-cid-b6zjrpuk></div> </div> </div> </div> <div class="step-actions" data-astro-cid-b6zjrpuk> <button class="btn-back" onclick="goToStep(1)" data-astro-cid-b6zjrpuk>← Editar</button> <button class="btn-next" onclick="generateFinalCode()" id="btn-final-step" data-astro-cid-b6zjrpuk>Obter Código do Plugin →</button> </div> </div> <!-- Wizard Step 3: Result --> <div class="step-content hidden" id="step3" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>🚀 Tudo Pronto!</h2> <p data-astro-cid-b6zjrpuk>Instale o código abaixo na tag <code data-astro-cid-b6zjrpuk>&lt;head&gt;</code> ou antes do fechamento de <code data-astro-cid-b6zjrpuk>&lt;/body&gt;</code> do seu site.</p> <div class="code-box" data-astro-cid-b6zjrpuk> <code id="widget-code" data-astro-cid-b6zjrpuk>Carregando código...</code> <button onclick="copiarCodigo()" class="btn-copy" data-astro-cid-b6zjrpuk>Copiar</button> </div> <div class="wizard-footer" data-astro-cid-b6zjrpuk> <a href="/dashboard" class="btn-next" data-astro-cid-b6zjrpuk>Acessar Meu Painel →</a> </div> </div> </div> </div>  <script>
    // State Management
    let currentUser = null;
    let itiReg = null;
    let registrationData = {};
    let selectedTheme = 'neon';

    const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          currentUser = data.user;
          showWizard();
        } else {
          showAuthGate();
        }
      } catch (e) {
        showAuthGate();
      }
    }

    function showAuthGate() {
      document.getElementById('auth-gate').classList.remove('hidden');
      document.getElementById('wizard-section').classList.add('hidden');
      initTelInput();
      initMasks();
    }

    function showWizard() {
      document.getElementById('auth-gate').classList.add('hidden');
      document.getElementById('wizard-section').classList.remove('hidden');
      document.getElementById('user-display-name').textContent = currentUser.name || currentUser.email;
      
      // Auto-pre-fill bot site if available from registration
      if (registrationData.website) {
        document.getElementById('bot-site').value = registrationData.website;
      }
    }

    function showAuthMode(mode) {
      document.getElementById('auth-choice').classList.add('hidden');
      document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
      
      if (mode === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
      } else if (mode === 'register') {
        document.getElementById('register-form').classList.remove('hidden');
      }
    }

    // Auth Actions
    function loginWithGoogle() { window.location.href = '/api/auth/google'; }
    function loginWithGitHub() { window.location.href = '/api/auth/github'; }

    // Forms
    document.getElementById('login-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (resData.user) {
          currentUser = resData.user;
          // Store token in cookie (handled by API mostly, but just in case)
          showWizard();
        } else {
          alert('Erro de login: ' + (resData.error || 'Credenciais inválidas'));
        }
      } catch (e) { alert('Erro ao conectar ao servidor'); }
    }

    document.getElementById('register-form').onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-register');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      // Validate WhatsApp
      if (!itiReg.isValidNumber()) {
        document.getElementById('reg-error').textContent = '❌ WhatsApp inválido. Digite ddd + número.';
        btn.disabled = false;
        btn.textContent = 'Criar Minha Conta →';
        return;
      }
      data.whatsapp = itiReg.getNumber();

      registrationData = data;

      try {
        const res = await fetch(\`\${API_URL}/api/trial/register\`, { // Reusing trial logic for OTP
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (resData.ok) {
          showOTP();
        } else {
          document.getElementById('reg-error').textContent = '❌ ' + (resData.error || 'Erro no cadastro');
        }
      } catch (e) { alert('Erro ao registrar'); }
      finally {
        btn.disabled = false;
        btn.textContent = 'Criar Minha Conta →';
      }
    }

    function showOTP() {
      document.getElementById('register-form').classList.add('hidden');
      document.getElementById('otp-section').classList.remove('hidden');
      startOTPTimer();
    }

    async function verifyOTP() {
      const code = document.getElementById('otp-code').value;
      const errorEl = document.getElementById('otp-error');
      errorEl.textContent = '';

      try {
        const res = await fetch(\`\${API_URL}/api/trial/verify\`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ whatsapp: registrationData.whatsapp, code })
        });
        const data = await res.json();
        if (data.ok) {
          // Success! Now create the real account in our system
          completeFullRegistration();
        } else {
          errorEl.textContent = '❌ Código incorreto ou expirado.';
        }
      } catch (e) { errorEl.textContent = 'Erro de rede'; }
    }

    async function completeFullRegistration() {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(registrationData)
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          showWizard();
        } else {
          alert('Erro ao finalizar conta: ' + data.error);
        }
      } catch (e) { alert('Falha crítica no sistema de registro.'); }
    }

    // Wizard Logic
    function goToStep(step) {
      document.querySelectorAll('.step-item').forEach((el, i) => {
        if (i + 1 <= step) el.classList.add('active');
        else el.classList.remove('active');
      });
      document.querySelectorAll('.step-content').forEach((el, i) => {
        if (i + 1 === step) el.classList.remove('hidden');
        else el.classList.add('hidden');
      });
    }

    document.getElementById('wizard-form').onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('bot-name').value;
      const emoji = document.getElementById('bot-emoji').value;
      
      document.getElementById('preview-name').textContent = name;
      document.getElementById('preview-emoji').textContent = emoji;
      
      goToStep(2);
    }

    function generateFinalCode() {
      const botId = 'bot_' + Math.random().toString(36).substr(2, 9); // In production this comes from user record/project
      const scriptUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080/widget.js'
        : '/widget.js';
      
      const code = \`<script src="\${scriptUrl}" data-bot="\${botId}" data-theme="\${selectedTheme}"><\\/script>\`;
      document.getElementById('widget-code').textContent = code;
      goToStep(3);
    }

    // Helpers
    function updateCountryCode() {
      const countrySelect = document.getElementById('reg-country');
      const display = document.getElementById('country-code-display');
      if (countrySelect && display) {
        display.textContent = countrySelect.value;
      }
    }

    function togglePersonFields() {
      const personType = document.getElementById('reg-person-type').value;
      const cpfField = document.getElementById('cpf-field');
      const cnpjField = document.getElementById('cnpj-field');
      const cpfInput = document.getElementById('reg-cpf');
      const cnpjInput = document.getElementById('reg-cnpj');

      if (personType === 'pf') {
        cpfField.style.display = 'block';
        cnpjField.style.display = 'none';
        cpfInput.required = true;
        cnpjInput.required = false;
      } else if (personType === 'pj') {
        cpfField.style.display = 'none';
        cnpjField.style.display = 'block';
        cpfInput.required = false;
        cnpjInput.required = true;
      } else {
        cpfField.style.display = 'none';
        cnpjField.style.display = 'none';
        cpfInput.required = false;
        cnpjInput.required = false;
      }
    }

    function initMasks() {
      // CPF mask
      const cpfInput = document.getElementById('reg-cpf');
      if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
           let v = e.target.value.replace(/\\D/g, "");
           if (v.length > 11) v = v.slice(0, 11);
           v = v.replace(/(\\d{3})(\\d)/, "$1.$2");
           v = v.replace(/(\\d{3})(\\d)/, "$1.$2");
           v = v.replace(/(\\d{3})(\\d{1,2})$/, "$1-$2");
           e.target.value = v;
        });
      }

      // CNPJ mask
      const cnpjInput = document.getElementById('reg-cnpj');
      if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
           let v = e.target.value.replace(/\\D/g, "");
           if (v.length > 14) v = v.slice(0, 14);
           v = v.replace(/^(\\d{2})(\\d)/, "$1.$2");
           v = v.replace(/^(\\d{2})\\.(\\d{3})(\\d)/, "$1.$2.$3");
           v = v.replace(/\\.(\\d{3})(\\d)/, ".$1/$2");
           v = v.replace(/(\\d{4})(\\d)/, "$1-$2");
           e.target.value = v;
        });
      }
    }

    function startOTPTimer() {
      let timeLeft = 30;
      const timerEl = document.getElementById('otp-timer');
      const interval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) clearInterval(interval);
      }, 1000);
    }

    function setTheme(theme) {
      selectedTheme = theme;
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      event.target.classList.add('active');
    }

    window.copiarCodigo = function() {
      const code = document.getElementById('widget-code').textContent;
      navigator.clipboard.writeText(code).then(() => alert('✅ Código copiado!'));
    }

    // Start
    checkAuth();
  <\/script> `], ['  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"> ', `<div class="page-wrapper" data-astro-cid-b6zjrpuk> <!-- AUTH GATE SECTION --> <div id="auth-gate" class="auth-gate hidden" data-astro-cid-b6zjrpuk> <div class="auth-card glass-panel reveal" data-astro-cid-b6zjrpuk> <div class="auth-header" data-astro-cid-b6zjrpuk> <div class="auth-logo" data-astro-cid-b6zjrpuk>N</div> <h1 data-astro-cid-b6zjrpuk>Comece sua Jornada</h1> <p data-astro-cid-b6zjrpuk>Você precisa estar logado para configurar seu plugin e acessar o suporte prioritário.</p> </div> <div id="auth-choice" class="auth-choice" data-astro-cid-b6zjrpuk> <button class="btn-auth-primary" onclick="showAuthMode('register')" data-astro-cid-b6zjrpuk>Criar Conta Grátis</button> <button class="btn-auth-secondary" onclick="showAuthMode('login')" data-astro-cid-b6zjrpuk>Já tenho conta (Entrar)</button> <div class="auth-divider" data-astro-cid-b6zjrpuk><span data-astro-cid-b6zjrpuk>ou continue com</span></div> <div class="social-auth" data-astro-cid-b6zjrpuk> <button class="social-btn" onclick="loginWithGoogle()" data-astro-cid-b6zjrpuk>Google</button> <button class="social-btn" onclick="loginWithGitHub()" data-astro-cid-b6zjrpuk>GitHub</button> </div> </div> <!-- LOGIN FORM --> <form id="login-form" class="auth-form hidden" data-astro-cid-b6zjrpuk> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>E-mail</label> <input type="email" name="email" required placeholder="seu@email.com" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Senha</label> <input type="password" name="password" required placeholder="••••••••" data-astro-cid-b6zjrpuk> </div> <button type="submit" class="btn-next" data-astro-cid-b6zjrpuk>Entrar →</button> <p class="auth-switch" data-astro-cid-b6zjrpuk>Ainda não tem conta? <a href="#" onclick="showAuthMode('register')" data-astro-cid-b6zjrpuk>Cadastre-se</a></p> </form> <!-- REGISTER FORM --> <form id="register-form" class="auth-form hidden" data-astro-cid-b6zjrpuk> <div class="form-grid" data-astro-cid-b6zjrpuk> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Seu Nome Completo *</label> <input type="text" name="name" id="reg-name" required placeholder="João da Silva" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>E-mail Corporativo/Real *</label> <input type="email" name="email" id="reg-email" required placeholder="joao@empresa.com" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Crie uma Senha *</label> <input type="password" name="password" id="reg-password" required placeholder="Mínimo 8 caracteres" minlength="8" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Tipo de Pessoa *</label> <select name="person_type" id="reg-person-type" required onchange="togglePersonFields()" data-astro-cid-b6zjrpuk> <option value="" data-astro-cid-b6zjrpuk>Selecione...</option> <option value="pf" data-astro-cid-b6zjrpuk>Pessoa Física</option> <option value="pj" data-astro-cid-b6zjrpuk>Pessoa Jurídica</option> </select> </div> <div class="field" id="cpf-field" style="display: none;" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>CPF *</label> <input type="text" name="cpf" id="reg-cpf" placeholder="000.000.000-00" data-astro-cid-b6zjrpuk> </div> <div class="field" id="cnpj-field" style="display: none;" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>CNPJ *</label> <input type="text" name="cnpj" id="reg-cnpj" placeholder="00.000.000/0000-00" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Nome da Empresa (Opcional)</label> <input type="text" name="company" placeholder="Minha Empresa Ltda" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Seu Site Principal *</label> <input type="url" name="website" id="reg-site" required placeholder="https://seusite.com.br" data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>WhatsApp Corporativo *</label> <input type="tel" name="whatsapp" id="reg-whatsapp" required data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Segmento de Atuação *</label> <select name="segment" required data-astro-cid-b6zjrpuk> <option value="" data-astro-cid-b6zjrpuk>Selecione...</option> <option value="ecommerce" data-astro-cid-b6zjrpuk>E-commerce / Varejo</option> <option value="servicos" data-astro-cid-b6zjrpuk>Serviços / Consultoria</option> <option value="saude" data-astro-cid-b6zjrpuk>Saúde / Bem-estar</option> <option value="infoproducts" data-astro-cid-b6zjrpuk>Infoprodutos / Educação</option> <option value="outros" data-astro-cid-b6zjrpuk>Outros</option> </select> </div> </div> <div class="auth-checks" data-astro-cid-b6zjrpuk> <label class="checkbox-container" data-astro-cid-b6zjrpuk> <input type="checkbox" required checked data-astro-cid-b6zjrpuk> <span class="checkmark" data-astro-cid-b6zjrpuk></span>
Aceito os <a href="/termos" data-astro-cid-b6zjrpuk>Termos de Uso</a> e <a href="/privacidade" data-astro-cid-b6zjrpuk>Privacidade</a> </label> </div> <div id="reg-error" class="error-msg" data-astro-cid-b6zjrpuk></div> <button type="submit" class="btn-next" id="btn-submit-register" data-astro-cid-b6zjrpuk>Criar Minha Conta →</button> <p class="auth-switch" data-astro-cid-b6zjrpuk>Já tem conta? <a href="#" onclick="showAuthMode('login')" data-astro-cid-b6zjrpuk>Fazer Login</a></p> </form> <!-- OTP VERIFICATION --> <div id="otp-section" class="auth-form hidden" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>Validar WhatsApp</h2> <p data-astro-cid-b6zjrpuk>Enviamos um código de 6 dígitos para o seu WhatsApp. Digite abaixo para ativar sua conta.</p> <div class="otp-input-container" data-astro-cid-b6zjrpuk> <input type="text" id="otp-code" maxlength="6" placeholder="000000" data-astro-cid-b6zjrpuk> </div> <div id="otp-error" class="error-msg" data-astro-cid-b6zjrpuk></div> <button class="btn-next" onclick="verifyOTP()" data-astro-cid-b6zjrpuk>Validar Código ✅</button> <p class="resend-text" data-astro-cid-b6zjrpuk>Não recebeu? <a href="#" onclick="resendOTP()" data-astro-cid-b6zjrpuk>Reenviar em <span id="otp-timer" data-astro-cid-b6zjrpuk>30</span>s</a></p> </div> </div> </div> <!-- WIZARD SECTION (Only visible if logged in) --> <div id="wizard-section" class="wizard-container hidden" data-astro-cid-b6zjrpuk> <header class="wizard-header" data-astro-cid-b6zjrpuk> <h1 data-astro-cid-b6zjrpuk>Criar Plugin</h1> <p data-astro-cid-b6zjrpuk>Dashboard: <span id="user-display-name" data-astro-cid-b6zjrpuk>Carregando...</span></p> <div class="all-required-notice" data-astro-cid-b6zjrpuk>Configuração Finalizada com Sucesso</div> </header> <!-- Step Indicators --> <div class="step-indicators" data-astro-cid-b6zjrpuk> <div class="step-item active" data-step="1" data-astro-cid-b6zjrpuk> <span class="step-number" data-astro-cid-b6zjrpuk>1</span> <span class="step-label" data-astro-cid-b6zjrpuk>Personalização</span> </div> <div class="step-line" data-astro-cid-b6zjrpuk></div> <div class="step-item" data-step="2" data-astro-cid-b6zjrpuk> <span class="step-number" data-astro-cid-b6zjrpuk>2</span> <span class="step-label" data-astro-cid-b6zjrpuk>Visual</span> </div> <div class="step-line" data-astro-cid-b6zjrpuk></div> <div class="step-item" data-step="3" data-astro-cid-b6zjrpuk> <span class="step-number" data-astro-cid-b6zjrpuk>3</span> <span class="step-label" data-astro-cid-b6zjrpuk>Código</span> </div> </div> <!-- Wizard Step 1: Config (Simplified since we have user data) --> <div class="step-content" id="step1" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>🎨 Configure seu Bot</h2> <form id="wizard-form" class="wizard-form" data-astro-cid-b6zjrpuk> <div class="form-grid" data-astro-cid-b6zjrpuk> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Nome do Assistente *</label> <input type="text" id="bot-name" placeholder="Ex: Nexus Vendas" required data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Site para o Widget *</label> <input type="url" id="bot-site" placeholder="https://seusite.com.br" required data-astro-cid-b6zjrpuk> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Tom de Voz</label> <select id="bot-tone" data-astro-cid-b6zjrpuk> <option value="formal" data-astro-cid-b6zjrpuk>Formal e Profissional</option> <option value="casual" selected data-astro-cid-b6zjrpuk>Casual e Amigável</option> <option value="urgencia" data-astro-cid-b6zjrpuk>Focado em Urgência/Vendas</option> </select> </div> <div class="field" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Emoji de Destaque</label> <input type="text" id="bot-emoji" value="🤖" placeholder="Escolha um emoji" data-astro-cid-b6zjrpuk> </div> </div> <button type="submit" class="btn-next" data-astro-cid-b6zjrpuk>Gerar Visual Prévio →</button> </form> </div> <!-- Wizard Step 2: Preview --> <div class="step-content hidden" id="step2" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>✨ Preview do Estilo</h2> <div class="preview-area glass-panel" data-astro-cid-b6zjrpuk> <div class="mock-widget" data-astro-cid-b6zjrpuk> <div class="mock-header" data-astro-cid-b6zjrpuk> <span id="preview-emoji" data-astro-cid-b6zjrpuk>🤖</span> <strong id="preview-name" data-astro-cid-b6zjrpuk>Nexus Bot</strong> </div> <div class="mock-body" data-astro-cid-b6zjrpuk> <div class="mock-msg" data-astro-cid-b6zjrpuk>Olá! Como posso ajudar você hoje?</div> </div> </div> <div class="theme-choices" data-astro-cid-b6zjrpuk> <label data-astro-cid-b6zjrpuk>Tema de Cor:</label> <div class="theme-dots" data-astro-cid-b6zjrpuk> <div class="dot active" style="background:#00d4ff;" onclick="setTheme('neon')" data-astro-cid-b6zjrpuk></div> <div class="dot" style="background:#00ff9d;" onclick="setTheme('matrix')" data-astro-cid-b6zjrpuk></div> <div class="dot" style="background:#f43f5e;" onclick="setTheme('sunset')" data-astro-cid-b6zjrpuk></div> </div> </div> </div> <div class="step-actions" data-astro-cid-b6zjrpuk> <button class="btn-back" onclick="goToStep(1)" data-astro-cid-b6zjrpuk>← Editar</button> <button class="btn-next" onclick="generateFinalCode()" id="btn-final-step" data-astro-cid-b6zjrpuk>Obter Código do Plugin →</button> </div> </div> <!-- Wizard Step 3: Result --> <div class="step-content hidden" id="step3" data-astro-cid-b6zjrpuk> <h2 data-astro-cid-b6zjrpuk>🚀 Tudo Pronto!</h2> <p data-astro-cid-b6zjrpuk>Instale o código abaixo na tag <code data-astro-cid-b6zjrpuk>&lt;head&gt;</code> ou antes do fechamento de <code data-astro-cid-b6zjrpuk>&lt;/body&gt;</code> do seu site.</p> <div class="code-box" data-astro-cid-b6zjrpuk> <code id="widget-code" data-astro-cid-b6zjrpuk>Carregando código...</code> <button onclick="copiarCodigo()" class="btn-copy" data-astro-cid-b6zjrpuk>Copiar</button> </div> <div class="wizard-footer" data-astro-cid-b6zjrpuk> <a href="/dashboard" class="btn-next" data-astro-cid-b6zjrpuk>Acessar Meu Painel →</a> </div> </div> </div> </div>  <script>
    // State Management
    let currentUser = null;
    let itiReg = null;
    let registrationData = {};
    let selectedTheme = 'neon';

    const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          currentUser = data.user;
          showWizard();
        } else {
          showAuthGate();
        }
      } catch (e) {
        showAuthGate();
      }
    }

    function showAuthGate() {
      document.getElementById('auth-gate').classList.remove('hidden');
      document.getElementById('wizard-section').classList.add('hidden');
      initTelInput();
      initMasks();
    }

    function showWizard() {
      document.getElementById('auth-gate').classList.add('hidden');
      document.getElementById('wizard-section').classList.remove('hidden');
      document.getElementById('user-display-name').textContent = currentUser.name || currentUser.email;
      
      // Auto-pre-fill bot site if available from registration
      if (registrationData.website) {
        document.getElementById('bot-site').value = registrationData.website;
      }
    }

    function showAuthMode(mode) {
      document.getElementById('auth-choice').classList.add('hidden');
      document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
      
      if (mode === 'login') {
        document.getElementById('login-form').classList.remove('hidden');
      } else if (mode === 'register') {
        document.getElementById('register-form').classList.remove('hidden');
      }
    }

    // Auth Actions
    function loginWithGoogle() { window.location.href = '/api/auth/google'; }
    function loginWithGitHub() { window.location.href = '/api/auth/github'; }

    // Forms
    document.getElementById('login-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (resData.user) {
          currentUser = resData.user;
          // Store token in cookie (handled by API mostly, but just in case)
          showWizard();
        } else {
          alert('Erro de login: ' + (resData.error || 'Credenciais inválidas'));
        }
      } catch (e) { alert('Erro ao conectar ao servidor'); }
    }

    document.getElementById('register-form').onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-register');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      
      // Validate WhatsApp
      if (!itiReg.isValidNumber()) {
        document.getElementById('reg-error').textContent = '❌ WhatsApp inválido. Digite ddd + número.';
        btn.disabled = false;
        btn.textContent = 'Criar Minha Conta →';
        return;
      }
      data.whatsapp = itiReg.getNumber();

      registrationData = data;

      try {
        const res = await fetch(\\\`\\\${API_URL}/api/trial/register\\\`, { // Reusing trial logic for OTP
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (resData.ok) {
          showOTP();
        } else {
          document.getElementById('reg-error').textContent = '❌ ' + (resData.error || 'Erro no cadastro');
        }
      } catch (e) { alert('Erro ao registrar'); }
      finally {
        btn.disabled = false;
        btn.textContent = 'Criar Minha Conta →';
      }
    }

    function showOTP() {
      document.getElementById('register-form').classList.add('hidden');
      document.getElementById('otp-section').classList.remove('hidden');
      startOTPTimer();
    }

    async function verifyOTP() {
      const code = document.getElementById('otp-code').value;
      const errorEl = document.getElementById('otp-error');
      errorEl.textContent = '';

      try {
        const res = await fetch(\\\`\\\${API_URL}/api/trial/verify\\\`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ whatsapp: registrationData.whatsapp, code })
        });
        const data = await res.json();
        if (data.ok) {
          // Success! Now create the real account in our system
          completeFullRegistration();
        } else {
          errorEl.textContent = '❌ Código incorreto ou expirado.';
        }
      } catch (e) { errorEl.textContent = 'Erro de rede'; }
    }

    async function completeFullRegistration() {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(registrationData)
        });
        const data = await res.json();
        if (data.success) {
          currentUser = data.user;
          showWizard();
        } else {
          alert('Erro ao finalizar conta: ' + data.error);
        }
      } catch (e) { alert('Falha crítica no sistema de registro.'); }
    }

    // Wizard Logic
    function goToStep(step) {
      document.querySelectorAll('.step-item').forEach((el, i) => {
        if (i + 1 <= step) el.classList.add('active');
        else el.classList.remove('active');
      });
      document.querySelectorAll('.step-content').forEach((el, i) => {
        if (i + 1 === step) el.classList.remove('hidden');
        else el.classList.add('hidden');
      });
    }

    document.getElementById('wizard-form').onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('bot-name').value;
      const emoji = document.getElementById('bot-emoji').value;
      
      document.getElementById('preview-name').textContent = name;
      document.getElementById('preview-emoji').textContent = emoji;
      
      goToStep(2);
    }

    function generateFinalCode() {
      const botId = 'bot_' + Math.random().toString(36).substr(2, 9); // In production this comes from user record/project
      const scriptUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8080/widget.js'
        : '/widget.js';
      
      const code = \\\`<script src="\\\${scriptUrl}" data-bot="\\\${botId}" data-theme="\\\${selectedTheme}"><\\\\/script>\\\`;
      document.getElementById('widget-code').textContent = code;
      goToStep(3);
    }

    // Helpers
    function updateCountryCode() {
      const countrySelect = document.getElementById('reg-country');
      const display = document.getElementById('country-code-display');
      if (countrySelect && display) {
        display.textContent = countrySelect.value;
      }
    }

    function togglePersonFields() {
      const personType = document.getElementById('reg-person-type').value;
      const cpfField = document.getElementById('cpf-field');
      const cnpjField = document.getElementById('cnpj-field');
      const cpfInput = document.getElementById('reg-cpf');
      const cnpjInput = document.getElementById('reg-cnpj');

      if (personType === 'pf') {
        cpfField.style.display = 'block';
        cnpjField.style.display = 'none';
        cpfInput.required = true;
        cnpjInput.required = false;
      } else if (personType === 'pj') {
        cpfField.style.display = 'none';
        cnpjField.style.display = 'block';
        cpfInput.required = false;
        cnpjInput.required = true;
      } else {
        cpfField.style.display = 'none';
        cnpjField.style.display = 'none';
        cpfInput.required = false;
        cnpjInput.required = false;
      }
    }

    function initMasks() {
      // CPF mask
      const cpfInput = document.getElementById('reg-cpf');
      if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
           let v = e.target.value.replace(/\\\\D/g, "");
           if (v.length > 11) v = v.slice(0, 11);
           v = v.replace(/(\\\\d{3})(\\\\d)/, "$1.$2");
           v = v.replace(/(\\\\d{3})(\\\\d)/, "$1.$2");
           v = v.replace(/(\\\\d{3})(\\\\d{1,2})$/, "$1-$2");
           e.target.value = v;
        });
      }

      // CNPJ mask
      const cnpjInput = document.getElementById('reg-cnpj');
      if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
           let v = e.target.value.replace(/\\\\D/g, "");
           if (v.length > 14) v = v.slice(0, 14);
           v = v.replace(/^(\\\\d{2})(\\\\d)/, "$1.$2");
           v = v.replace(/^(\\\\d{2})\\\\.(\\\\d{3})(\\\\d)/, "$1.$2.$3");
           v = v.replace(/\\\\.(\\\\d{3})(\\\\d)/, ".$1/$2");
           v = v.replace(/(\\\\d{4})(\\\\d)/, "$1-$2");
           e.target.value = v;
        });
      }
    }

    function startOTPTimer() {
      let timeLeft = 30;
      const timerEl = document.getElementById('otp-timer');
      const interval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) clearInterval(interval);
      }, 1000);
    }

    function setTheme(theme) {
      selectedTheme = theme;
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      event.target.classList.add('active');
    }

    window.copiarCodigo = function() {
      const code = document.getElementById('widget-code').textContent;
      navigator.clipboard.writeText(code).then(() => alert('✅ Código copiado!'));
    }

    // Start
    checkAuth();
  <\/script> `])), maybeRenderHead()) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/criar-bot.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/criar-bot.astro";
const $$url = "/criar-bot";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$CriarBot,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
