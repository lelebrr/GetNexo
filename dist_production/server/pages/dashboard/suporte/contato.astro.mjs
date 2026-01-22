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
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Contato e Suporte - GetNexo Pro", "data-astro-cid-qk5a4ix4": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1000px; margin: 0 auto;" data-astro-cid-qk5a4ix4> <!-- Header --> <div class="contact-header" data-astro-cid-qk5a4ix4> <h1 data-astro-cid-qk5a4ix4>📞 Contato e Suporte</h1> <p data-astro-cid-qk5a4ix4>Precisa de ajuda? Entre em contato conosco</p> </div> <!-- Contact Info --> <div class="contact-info" data-astro-cid-qk5a4ix4> <h4 data-astro-cid-qk5a4ix4>💬 Canais de Atendimento</h4> <div class="contact-methods" data-astro-cid-qk5a4ix4> <div class="contact-method" data-astro-cid-qk5a4ix4> <div class="contact-method-icon" data-astro-cid-qk5a4ix4>💬</div> <div class="contact-method-content" data-astro-cid-qk5a4ix4> <h5 data-astro-cid-qk5a4ix4>Chat Online</h5> <p data-astro-cid-qk5a4ix4>Atendimento instantâneo 24/7</p> </div> </div> <div class="contact-method" data-astro-cid-qk5a4ix4> <div class="contact-method-icon" data-astro-cid-qk5a4ix4>📧</div> <div class="contact-method-content" data-astro-cid-qk5a4ix4> <h5 data-astro-cid-qk5a4ix4>Email</h5> <p data-astro-cid-qk5a4ix4>Resposta em até 2h úteis</p> </div> </div> <div class="contact-method" data-astro-cid-qk5a4ix4> <div class="contact-method-icon" data-astro-cid-qk5a4ix4>📱</div> <div class="contact-method-content" data-astro-cid-qk5a4ix4> <h5 data-astro-cid-qk5a4ix4>WhatsApp</h5> <p data-astro-cid-qk5a4ix4>Atendimento prioritário</p> </div> </div> </div> </div> <!-- Contact Form --> <form class="contact-form" id="contact-form" data-astro-cid-qk5a4ix4> <!-- Basic Information --> <div class="form-section" data-astro-cid-qk5a4ix4> <h3 data-astro-cid-qk5a4ix4>👤 Informações Básicas</h3> <div class="form-grid" data-astro-cid-qk5a4ix4> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Nome <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <input type="text" class="form-input" id="contact-name" required data-astro-cid-qk5a4ix4> <div class="help-text" data-astro-cid-qk5a4ix4>Seu nome completo</div> </div> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Email <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <input type="email" class="form-input" id="contact-email" required data-astro-cid-qk5a4ix4> <div class="help-text" data-astro-cid-qk5a4ix4>Email para resposta</div> </div> </div> </div> <!-- Issue Details --> <div class="form-section" data-astro-cid-qk5a4ix4> <h3 data-astro-cid-qk5a4ix4>🎯 Detalhes do Problema</h3> <div class="form-grid" data-astro-cid-qk5a4ix4> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Assunto <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <input type="text" class="form-input" id="contact-subject" placeholder="Breve descrição do problema" required data-astro-cid-qk5a4ix4> </div> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Categoria</label> <select class="form-select" id="contact-category" data-astro-cid-qk5a4ix4> <option value="technical" data-astro-cid-qk5a4ix4>Problema Técnico</option> <option value="billing" data-astro-cid-qk5a4ix4>Faturamento</option> <option value="feature" data-astro-cid-qk5a4ix4>Nova Funcionalidade</option> <option value="account" data-astro-cid-qk5a4ix4>Conta</option> <option value="other" data-astro-cid-qk5a4ix4>Outro</option> </select> </div> </div> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Descrição <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <textarea class="form-textarea" id="contact-description" placeholder="Descreva detalhadamente o seu problema ou dúvida..." required data-astro-cid-qk5a4ix4></textarea> <div class="help-text" data-astro-cid-qk5a4ix4>Quanto mais detalhes você fornecer, mais rápido conseguimos ajudar</div> </div> </div> <!-- File Upload --> <div class="form-section" data-astro-cid-qk5a4ix4> <h3 data-astro-cid-qk5a4ix4>📎 Anexos (Opcional)</h3> <div class="file-upload" onclick="document.getElementById('file-input').click()" data-astro-cid-qk5a4ix4> <span class="file-upload-icon" data-astro-cid-qk5a4ix4>📎</span> <p class="file-upload-text" data-astro-cid-qk5a4ix4>Clique para anexar arquivos</p> <p class="file-upload-subtext" data-astro-cid-qk5a4ix4>PNG, JPG, PDF, DOC até 10MB cada</p> </div> <input type="file" id="file-input" multiple style="display: none;" onchange="handleFileUpload()" data-astro-cid-qk5a4ix4> <div class="uploaded-files" id="uploaded-files" data-astro-cid-qk5a4ix4></div> </div> <!-- Form Actions --> <div class="form-actions" data-astro-cid-qk5a4ix4> <a href="/dashboard/suporte/tickets" class="btn btn-outline" data-astro-cid-qk5a4ix4>Ver Meus Tickets</a> <button type="submit" class="btn btn-primary" data-astro-cid-qk5a4ix4>Enviar Mensagem</button> </div> </form> </div> <script>
        let uploadedFiles = [];

        document.getElementById('contact-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const category = document.getElementById('contact-category').value;
            const description = document.getElementById('contact-description').value;

            if (!name || !email || !subject || !description) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const contactData = {
                name,
                email,
                subject,
                category,
                description,
                attachments: uploadedFiles
            };

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/support/contact\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(contactData)
                });

                if (res.ok) {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    window.location.href = '/dashboard/suporte/tickets';
                } else {
                    throw new Error('Erro ao enviar mensagem');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            }
        });

        function handleFileUpload() {
            const files = document.getElementById('file-input').files;
            const uploadedFilesDiv = document.getElementById('uploaded-files');

            for (let file of files) {
                if (file.size > 10 * 1024 * 1024) { // 10MB
                    alert(\`Arquivo \${file.name} é muito grande. Máximo 10MB.\`);
                    continue;
                }

                uploadedFiles.push(file);
                const fileDiv = document.createElement('div');
                fileDiv.className = 'uploaded-file';
                fileDiv.innerHTML = \`
                    <span class="uploaded-file-name">\${file.name}</span>
                    <span class="uploaded-file-remove" onclick="removeFile('\${file.name}')">✕</span>
                \`;
                uploadedFilesDiv.appendChild(fileDiv);
            }
        }

        function removeFile(fileName) {
            uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
            const uploadedFilesDiv = document.getElementById('uploaded-files');
            uploadedFilesDiv.innerHTML = uploadedFiles.map(file => \`
                <div class="uploaded-file">
                    <span class="uploaded-file-name">\${file.name}</span>
                    <span class="uploaded-file-remove" onclick="removeFile('\${file.name}')">✕</span>
                </div>
            \`).join('');
        }
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1000px; margin: 0 auto;" data-astro-cid-qk5a4ix4> <!-- Header --> <div class="contact-header" data-astro-cid-qk5a4ix4> <h1 data-astro-cid-qk5a4ix4>📞 Contato e Suporte</h1> <p data-astro-cid-qk5a4ix4>Precisa de ajuda? Entre em contato conosco</p> </div> <!-- Contact Info --> <div class="contact-info" data-astro-cid-qk5a4ix4> <h4 data-astro-cid-qk5a4ix4>💬 Canais de Atendimento</h4> <div class="contact-methods" data-astro-cid-qk5a4ix4> <div class="contact-method" data-astro-cid-qk5a4ix4> <div class="contact-method-icon" data-astro-cid-qk5a4ix4>💬</div> <div class="contact-method-content" data-astro-cid-qk5a4ix4> <h5 data-astro-cid-qk5a4ix4>Chat Online</h5> <p data-astro-cid-qk5a4ix4>Atendimento instantâneo 24/7</p> </div> </div> <div class="contact-method" data-astro-cid-qk5a4ix4> <div class="contact-method-icon" data-astro-cid-qk5a4ix4>📧</div> <div class="contact-method-content" data-astro-cid-qk5a4ix4> <h5 data-astro-cid-qk5a4ix4>Email</h5> <p data-astro-cid-qk5a4ix4>Resposta em até 2h úteis</p> </div> </div> <div class="contact-method" data-astro-cid-qk5a4ix4> <div class="contact-method-icon" data-astro-cid-qk5a4ix4>📱</div> <div class="contact-method-content" data-astro-cid-qk5a4ix4> <h5 data-astro-cid-qk5a4ix4>WhatsApp</h5> <p data-astro-cid-qk5a4ix4>Atendimento prioritário</p> </div> </div> </div> </div> <!-- Contact Form --> <form class="contact-form" id="contact-form" data-astro-cid-qk5a4ix4> <!-- Basic Information --> <div class="form-section" data-astro-cid-qk5a4ix4> <h3 data-astro-cid-qk5a4ix4>👤 Informações Básicas</h3> <div class="form-grid" data-astro-cid-qk5a4ix4> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Nome <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <input type="text" class="form-input" id="contact-name" required data-astro-cid-qk5a4ix4> <div class="help-text" data-astro-cid-qk5a4ix4>Seu nome completo</div> </div> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Email <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <input type="email" class="form-input" id="contact-email" required data-astro-cid-qk5a4ix4> <div class="help-text" data-astro-cid-qk5a4ix4>Email para resposta</div> </div> </div> </div> <!-- Issue Details --> <div class="form-section" data-astro-cid-qk5a4ix4> <h3 data-astro-cid-qk5a4ix4>🎯 Detalhes do Problema</h3> <div class="form-grid" data-astro-cid-qk5a4ix4> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Assunto <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <input type="text" class="form-input" id="contact-subject" placeholder="Breve descrição do problema" required data-astro-cid-qk5a4ix4> </div> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Categoria</label> <select class="form-select" id="contact-category" data-astro-cid-qk5a4ix4> <option value="technical" data-astro-cid-qk5a4ix4>Problema Técnico</option> <option value="billing" data-astro-cid-qk5a4ix4>Faturamento</option> <option value="feature" data-astro-cid-qk5a4ix4>Nova Funcionalidade</option> <option value="account" data-astro-cid-qk5a4ix4>Conta</option> <option value="other" data-astro-cid-qk5a4ix4>Outro</option> </select> </div> </div> <div class="form-group" data-astro-cid-qk5a4ix4> <label class="form-label" data-astro-cid-qk5a4ix4>Descrição <span class="required" data-astro-cid-qk5a4ix4>*</span></label> <textarea class="form-textarea" id="contact-description" placeholder="Descreva detalhadamente o seu problema ou dúvida..." required data-astro-cid-qk5a4ix4></textarea> <div class="help-text" data-astro-cid-qk5a4ix4>Quanto mais detalhes você fornecer, mais rápido conseguimos ajudar</div> </div> </div> <!-- File Upload --> <div class="form-section" data-astro-cid-qk5a4ix4> <h3 data-astro-cid-qk5a4ix4>📎 Anexos (Opcional)</h3> <div class="file-upload" onclick="document.getElementById('file-input').click()" data-astro-cid-qk5a4ix4> <span class="file-upload-icon" data-astro-cid-qk5a4ix4>📎</span> <p class="file-upload-text" data-astro-cid-qk5a4ix4>Clique para anexar arquivos</p> <p class="file-upload-subtext" data-astro-cid-qk5a4ix4>PNG, JPG, PDF, DOC até 10MB cada</p> </div> <input type="file" id="file-input" multiple style="display: none;" onchange="handleFileUpload()" data-astro-cid-qk5a4ix4> <div class="uploaded-files" id="uploaded-files" data-astro-cid-qk5a4ix4></div> </div> <!-- Form Actions --> <div class="form-actions" data-astro-cid-qk5a4ix4> <a href="/dashboard/suporte/tickets" class="btn btn-outline" data-astro-cid-qk5a4ix4>Ver Meus Tickets</a> <button type="submit" class="btn btn-primary" data-astro-cid-qk5a4ix4>Enviar Mensagem</button> </div> </form> </div> <script>
        let uploadedFiles = [];

        document.getElementById('contact-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const category = document.getElementById('contact-category').value;
            const description = document.getElementById('contact-description').value;

            if (!name || !email || !subject || !description) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const contactData = {
                name,
                email,
                subject,
                category,
                description,
                attachments: uploadedFiles
            };

            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/support/contact\\\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(contactData)
                });

                if (res.ok) {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    window.location.href = '/dashboard/suporte/tickets';
                } else {
                    throw new Error('Erro ao enviar mensagem');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            }
        });

        function handleFileUpload() {
            const files = document.getElementById('file-input').files;
            const uploadedFilesDiv = document.getElementById('uploaded-files');

            for (let file of files) {
                if (file.size > 10 * 1024 * 1024) { // 10MB
                    alert(\\\`Arquivo \\\${file.name} é muito grande. Máximo 10MB.\\\`);
                    continue;
                }

                uploadedFiles.push(file);
                const fileDiv = document.createElement('div');
                fileDiv.className = 'uploaded-file';
                fileDiv.innerHTML = \\\`
                    <span class="uploaded-file-name">\\\${file.name}</span>
                    <span class="uploaded-file-remove" onclick="removeFile('\\\${file.name}')">✕</span>
                \\\`;
                uploadedFilesDiv.appendChild(fileDiv);
            }
        }

        function removeFile(fileName) {
            uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
            const uploadedFilesDiv = document.getElementById('uploaded-files');
            uploadedFilesDiv.innerHTML = uploadedFiles.map(file => \\\`
                <div class="uploaded-file">
                    <span class="uploaded-file-name">\\\${file.name}</span>
                    <span class="uploaded-file-remove" onclick="removeFile('\\\${file.name}')">✕</span>
                </div>
            \\\`).join('');
        }
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte/contato/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte/contato/index.astro";
const $$url = "/dashboard/suporte/contato";
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
