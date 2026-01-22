import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                  */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Contato = createComponent(async ($$result, $$props, $$slots) => {
  const title = "Contato GetNexo | Suporte, Privacidade e Solicitações LGPD";
  const description = "Entre em contato com a GetNexo. Suporte técnico, solicitações de direitos ARCO (LGPD), DPO, dúvidas sobre privacidade e dados pessoais.";
  const keywords = "contato getnexo, suporte whatsapp api, direitos lgpd, dpo getnexo, privacidade dados, solicitar exclusao dados, suporte tecnico";
  return renderTemplate(_a || (_a = __template(["", `  <script>
  // Form handling for LGPD requests
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lgpd-request-form');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.document || !data.request_type || !data.description) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        // Email validation
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(data.email.toString())) {
          alert('Por favor, insira um e-mail válido.');
          return;
        }

        // Document validation (basic)
        const docRegex = /^(\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2})$/;
        if (!docRegex.test(data.document.toString().replace(/\\s/g, ''))) {
          alert('Por favor, insira um CPF ou CNPJ válido.');
          return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
          // Send to backend (you would implement this)
          const response = await fetch('/api/lgpd-request', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
              timestamp: new Date().toISOString(),
              ip: '127.0.0.1'
            })
          });

          if (response.ok) {
            alert('Solicitação enviada com sucesso! Você receberá confirmação por e-mail em até 24 horas.');
            form.reset();
          } else {
            throw new Error('Erro ao enviar solicitação');
          }
        } catch (error) {
          console.error('Error submitting LGPD request:', error);
          alert('Erro ao enviar solicitação. Tente novamente ou entre em contato diretamente via e-mail.');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('requester-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        const target = e.target;
        let value = target.value.replace(/\\D/g, '');
        if (value.length <= 11) {
          value = value.replace(/(\\d{2})(\\d{5})(\\d{4})/, '($1) $2-$3');
          target.value = value;
        }
      });
    }

    // Document formatting
    const docInput = document.getElementById('requester-doc');
    if (docInput) {
      docInput.addEventListener('input', (e) => {
        const target = e.target;
        let value = target.value.replace(/\\D/g, '');
        if (value.length <= 11) {
          // CPF
          value = value.replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{2})/, '$1.$2.$3-$4');
        } else {
          // CNPJ
          value = value.replace(/(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})/, '$1.$2.$3/$4-$5');
        }
        target.value = value;
      });
    }
  });
<\/script>`], ["", `  <script>
  // Form handling for LGPD requests
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lgpd-request-form');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.document || !data.request_type || !data.description) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        // Email validation
        const emailRegex = /^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/;
        if (!emailRegex.test(data.email.toString())) {
          alert('Por favor, insira um e-mail válido.');
          return;
        }

        // Document validation (basic)
        const docRegex = /^(\\\\d{3}\\\\.\\\\d{3}\\\\.\\\\d{3}-\\\\d{2}|\\\\d{2}\\\\.\\\\d{3}\\\\.\\\\d{3}\\\\/\\\\d{4}-\\\\d{2})$/;
        if (!docRegex.test(data.document.toString().replace(/\\\\s/g, ''))) {
          alert('Por favor, insira um CPF ou CNPJ válido.');
          return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
          // Send to backend (you would implement this)
          const response = await fetch('/api/lgpd-request', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
              timestamp: new Date().toISOString(),
              ip: '127.0.0.1'
            })
          });

          if (response.ok) {
            alert('Solicitação enviada com sucesso! Você receberá confirmação por e-mail em até 24 horas.');
            form.reset();
          } else {
            throw new Error('Erro ao enviar solicitação');
          }
        } catch (error) {
          console.error('Error submitting LGPD request:', error);
          alert('Erro ao enviar solicitação. Tente novamente ou entre em contato diretamente via e-mail.');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('requester-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        const target = e.target;
        let value = target.value.replace(/\\\\D/g, '');
        if (value.length <= 11) {
          value = value.replace(/(\\\\d{2})(\\\\d{5})(\\\\d{4})/, '($1) $2-$3');
          target.value = value;
        }
      });
    }

    // Document formatting
    const docInput = document.getElementById('requester-doc');
    if (docInput) {
      docInput.addEventListener('input', (e) => {
        const target = e.target;
        let value = target.value.replace(/\\\\D/g, '');
        if (value.length <= 11) {
          // CPF
          value = value.replace(/(\\\\d{3})(\\\\d{3})(\\\\d{3})(\\\\d{2})/, '$1.$2.$3-$4');
        } else {
          // CNPJ
          value = value.replace(/(\\\\d{2})(\\\\d{3})(\\\\d{3})(\\\\d{4})(\\\\d{2})/, '$1.$2.$3/$4-$5');
        }
        target.value = value;
      });
    }
  });
<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-7iakxibs": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="contact-hero" data-astro-cid-7iakxibs> <div class="hero-badge" data-astro-cid-7iakxibs>Contato</div> <h1 class="text-gradient" data-astro-cid-7iakxibs>Fale Conosco</h1> <p data-astro-cid-7iakxibs>Suporte técnico, solicitações de direitos ARCO (LGPD) e atendimento personalizado.</p> </section> <section class="contact-content" data-astro-cid-7iakxibs> <div class="contact-grid" data-astro-cid-7iakxibs> <!-- Suporte Geral --> <div class="contact-card" data-astro-cid-7iakxibs> <div class="card-header" data-astro-cid-7iakxibs> <div class="card-icon" data-astro-cid-7iakxibs>💬</div> <h3 data-astro-cid-7iakxibs>Suporte Geral</h3> </div> <div class="card-body" data-astro-cid-7iakxibs> <p data-astro-cid-7iakxibs>Dúvidas sobre instalação, configuração ou uso da plataforma.</p> <div class="contact-methods" data-astro-cid-7iakxibs> <a href="https://wa.me/5511999999999?text=Olá%20GetNexo!%20Preciso%20de%20ajuda..." target="_blank" class="contact-link whatsapp" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>📱</span> WhatsApp
</a> <a href="mailto:suporte@getnexo.com.br" class="contact-link email" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>📧</span> suporte@getnexo.com.br
</a> </div> </div> </div> <!-- Privacidade e LGPD --> <div class="contact-card featured" data-astro-cid-7iakxibs> <div class="card-header" data-astro-cid-7iakxibs> <div class="card-icon" data-astro-cid-7iakxibs>🔒</div> <h3 data-astro-cid-7iakxibs>Privacidade & LGPD</h3> </div> <div class="card-body" data-astro-cid-7iakxibs> <p data-astro-cid-7iakxibs>Solicitações de direitos ARCO, dúvidas sobre proteção de dados e DPO.</p> <div class="contact-methods" data-astro-cid-7iakxibs> <a href="mailto:dpo@getnexo.com.br" class="contact-link email" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>🛡️</span> dpo@getnexo.com.br
</a> <a href="mailto:privacidade@getnexo.com.br" class="contact-link email" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>📋</span> privacidade@getnexo.com.br
</a> </div> <div class="lgpd-notice" data-astro-cid-7iakxibs> <p data-astro-cid-7iakxibs><strong data-astro-cid-7iakxibs>Dados do Controlador:</strong></p> <p data-astro-cid-7iakxibs>GetNexo Tecnologia Ltda.<br data-astro-cid-7iakxibs>CNPJ: 45.678.901/0001-23<br data-astro-cid-7iakxibs>Encarregado: Leandro Brandão</p> </div> </div> </div> <!-- Vendas e Parcerias --> <div class="contact-card" data-astro-cid-7iakxibs> <div class="card-header" data-astro-cid-7iakxibs> <div class="card-icon" data-astro-cid-7iakxibs>🚀</div> <h3 data-astro-cid-7iakxibs>Vendas & Parcerias</h3> </div> <div class="card-body" data-astro-cid-7iakxibs> <p data-astro-cid-7iakxibs>Demonstrações, propostas comerciais e programa de revenda.</p> <div class="contact-methods" data-astro-cid-7iakxibs> <a href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20GetNexo..." target="_blank" class="contact-link whatsapp" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>📱</span> WhatsApp Vendas
</a> <a href="mailto:vendas@getnexo.com.br" class="contact-link email" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>📧</span> vendas@getnexo.com.br
</a> </div> </div> </div> <!-- Jurídico --> <div class="contact-card" data-astro-cid-7iakxibs> <div class="card-header" data-astro-cid-7iakxibs> <div class="card-icon" data-astro-cid-7iakxibs>⚖️</div> <h3 data-astro-cid-7iakxibs>Assuntos Jurídicos</h3> </div> <div class="card-body" data-astro-cid-7iakxibs> <p data-astro-cid-7iakxibs>Contratos, compliance e questões legais.</p> <div class="contact-methods" data-astro-cid-7iakxibs> <a href="mailto:juridico@getnexo.com.br" class="contact-link email" data-astro-cid-7iakxibs> <span data-astro-cid-7iakxibs>📜</span> juridico@getnexo.com.br
</a> </div> </div> </div> </div> <!-- Formulário de Solicitação LGPD --> <div class="lgpd-form-section" data-astro-cid-7iakxibs> <div class="glass-panel lgpd-form-wrap" data-astro-cid-7iakxibs> <h2 data-astro-cid-7iakxibs>Solicitação de Direitos ARCO (LGPD)</h2> <p data-astro-cid-7iakxibs>Utilize este formulário para exercer seus direitos sob a Lei Geral de Proteção de Dados:</p> <form id="lgpd-request-form" class="lgpd-form" data-astro-cid-7iakxibs> <div class="form-row" data-astro-cid-7iakxibs> <div class="form-group" data-astro-cid-7iakxibs> <label for="requester-name" data-astro-cid-7iakxibs>Nome Completo *</label> <input type="text" id="requester-name" name="name" required placeholder="Seu nome completo" data-astro-cid-7iakxibs> </div> <div class="form-group" data-astro-cid-7iakxibs> <label for="requester-email" data-astro-cid-7iakxibs>E-mail *</label> <input type="email" id="requester-email" name="email" required placeholder="seu@email.com" data-astro-cid-7iakxibs> </div> </div> <div class="form-row" data-astro-cid-7iakxibs> <div class="form-group" data-astro-cid-7iakxibs> <label for="requester-doc" data-astro-cid-7iakxibs>CPF/CNPJ *</label> <input type="text" id="requester-doc" name="document" required placeholder="000.000.000-00 ou 00.000.000/0000-00" data-astro-cid-7iakxibs> </div> <div class="form-group" data-astro-cid-7iakxibs> <label for="requester-phone" data-astro-cid-7iakxibs>Telefone (WhatsApp)</label> <input type="tel" id="requester-phone" name="phone" placeholder="(11) 99999-9999" data-astro-cid-7iakxibs> </div> </div> <div class="form-group" data-astro-cid-7iakxibs> <label for="request-type" data-astro-cid-7iakxibs>Tipo de Solicitação *</label> <select id="request-type" name="request_type" required data-astro-cid-7iakxibs> <option value="" data-astro-cid-7iakxibs>Selecione o direito que deseja exercer</option> <option value="confirmacao" data-astro-cid-7iakxibs>Confirmação de tratamento de dados</option> <option value="acesso" data-astro-cid-7iakxibs>Acesso aos dados pessoais</option> <option value="correcao" data-astro-cid-7iakxibs>Correção de dados incompletos/inexatos</option> <option value="anonimizacao" data-astro-cid-7iakxibs>Anonimização de dados</option> <option value="portabilidade" data-astro-cid-7iakxibs>Portabilidade dos dados</option> <option value="eliminacao" data-astro-cid-7iakxibs>Eliminação dos dados</option> <option value="informacao" data-astro-cid-7iakxibs>Informação sobre compartilhamento</option> <option value="oposicao" data-astro-cid-7iakxibs>Oposição ao tratamento</option> <option value="revocacao" data-astro-cid-7iakxibs>Revogação de consentimento</option> <option value="outro" data-astro-cid-7iakxibs>Outro (especificar abaixo)</option> </select> </div> <div class="form-group" data-astro-cid-7iakxibs> <label for="request-description" data-astro-cid-7iakxibs>Descrição da Solicitação *</label> <textarea id="request-description" name="description" required rows="4" placeholder="Descreva detalhadamente sua solicitação. Inclua informações que nos ajudem a identificar seus dados (período aproximado de uso, serviços utilizados, etc.)" data-astro-cid-7iakxibs></textarea> </div> <div class="form-group" data-astro-cid-7iakxibs> <label for="request-evidence" data-astro-cid-7iakxibs>Evidências/Comprovação (Opcional)</label> <input type="file" id="request-evidence" name="evidence" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" data-astro-cid-7iakxibs> <small data-astro-cid-7iakxibs>Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 5MB)</small> </div> <div class="form-consent" data-astro-cid-7iakxibs> <input type="checkbox" id="lgpd-consent" name="consent" required data-astro-cid-7iakxibs> <label for="lgpd-consent" data-astro-cid-7iakxibs>
Declaro que as informações fornecidas são verdadeiras e que estou ciente de que a solicitação será processada conforme a LGPD. *
</label> </div> <div class="form-actions" data-astro-cid-7iakxibs> <button type="submit" class="btn-primary" data-astro-cid-7iakxibs>Enviar Solicitação</button> <button type="reset" class="btn-secondary" data-astro-cid-7iakxibs>Limpar Formulário</button> </div> </form> <div class="lgpd-info" data-astro-cid-7iakxibs> <h3 data-astro-cid-7iakxibs>ℹ️ Sobre os Direitos ARCO</h3> <p data-astro-cid-7iakxibs>Os direitos ARCO (Acesso, Retificação, Cancelamento e Oposição) estão previstos no Art. 18 da LGPD. Processaremos sua solicitação em até 15 dias úteis, prorrogável por mais 15 dias quando necessário.</p> <p data-astro-cid-7iakxibs><strong data-astro-cid-7iakxibs>Resposta garantida:</strong> Você receberá confirmação de recebimento em até 24 horas e resposta final no prazo legal.</p> </div> </div> </div> <!-- Horários de Atendimento --> <div class="support-hours" data-astro-cid-7iakxibs> <h2 data-astro-cid-7iakxibs>Horários de Atendimento</h2> <div class="hours-grid" data-astro-cid-7iakxibs> <div class="hours-item" data-astro-cid-7iakxibs> <h4 data-astro-cid-7iakxibs>Suporte Técnico</h4> <p data-astro-cid-7iakxibs>Segunda a Sexta: 9h às 18h<br data-astro-cid-7iakxibs>Sábado: 9h às 12h</p> </div> <div class="hours-item" data-astro-cid-7iakxibs> <h4 data-astro-cid-7iakxibs>Privacidade & LGPD</h4> <p data-astro-cid-7iakxibs>Segunda a Sexta: 9h às 18h<br data-astro-cid-7iakxibs>Resposta em até 24h</p> </div> <div class="hours-item" data-astro-cid-7iakxibs> <h4 data-astro-cid-7iakxibs>Emergências</h4> <p data-astro-cid-7iakxibs>24/7 para questões críticas<br data-astro-cid-7iakxibs>WhatsApp: +55 11 99999-9999</p> </div> </div> </div> </section> ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/contato.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/contato.astro";
const $$url = "/contato";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Contato,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
