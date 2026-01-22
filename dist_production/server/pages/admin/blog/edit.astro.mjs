import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../../assets/AdminLayout-htIlQTkN.js";
/* empty css                                     */
import { renderers } from "../../../renderers.mjs";
const $$Edit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Post Editor", "data-astro-cid-rqdi3l56": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="editor-header" data-astro-cid-rqdi3l56> <a href="/admin/blog" class="back-link" data-astro-cid-rqdi3l56>← Voltar para Lista</a> <div class="header-btns" data-astro-cid-rqdi3l56> <button class="btn-outline" data-astro-cid-rqdi3l56>Salvar Rascunho</button> <button class="btn-glow" data-astro-cid-rqdi3l56>Publicar Post</button> </div> </div> <div class="editor-grid" data-astro-cid-rqdi3l56> <!-- Main Content Area --> <div class="main-editor" data-astro-cid-rqdi3l56> <div class="cyber-card" data-astro-cid-rqdi3l56> <div class="input-field" data-astro-cid-rqdi3l56> <label data-astro-cid-rqdi3l56>Título do Post</label> <input type="text" placeholder="Ex: Como a IA revoluciona o atendimento..." class="title-input" data-astro-cid-rqdi3l56> </div> <div class="input-field" data-astro-cid-rqdi3l56> <label data-astro-cid-rqdi3l56>Conteúdo (Markdown)</label> <textarea placeholder="Escreva seu conteúdo aqui..." class="content-textarea" data-astro-cid-rqdi3l56></textarea> </div> </div> </div> <!-- Sidebar Options --> <div class="editor-sidebar" data-astro-cid-rqdi3l56> <div class="cyber-card" data-astro-cid-rqdi3l56> <h3 data-astro-cid-rqdi3l56>Metadados</h3> <div class="input-field" data-astro-cid-rqdi3l56> <label data-astro-cid-rqdi3l56>Idioma</label> <select data-astro-cid-rqdi3l56> <option value="pt" data-astro-cid-rqdi3l56>Português (BR)</option> <option value="en" data-astro-cid-rqdi3l56>English (US)</option> <option value="es" data-astro-cid-rqdi3l56>Español</option> <option value="fr" data-astro-cid-rqdi3l56>Français</option> </select> </div> <div class="input-field" data-astro-cid-rqdi3l56> <label data-astro-cid-rqdi3l56>Slug (URL)</label> <input type="text" placeholder="ex: como-ia-revoluciona" data-astro-cid-rqdi3l56> </div> <div class="input-field" data-astro-cid-rqdi3l56> <label data-astro-cid-rqdi3l56>Categorias</label> <div class="tag-cloud" data-astro-cid-rqdi3l56> <span class="tag" data-astro-cid-rqdi3l56>IA</span> <span class="tag" data-astro-cid-rqdi3l56>Vendas</span> <span class="tag" data-astro-cid-rqdi3l56>WhatsApp</span> <span class="tag add" data-astro-cid-rqdi3l56>+ add</span> </div> </div> </div> <div class="cyber-card image-uploader" data-astro-cid-rqdi3l56> <h3 data-astro-cid-rqdi3l56>Imagem de Capa</h3> <div class="drop-zone" data-astro-cid-rqdi3l56> <span class="icon" data-astro-cid-rqdi3l56>🖼️</span> <p data-astro-cid-rqdi3l56>Click or drag image to upload</p> </div> </div> </div> </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/blog/edit.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/blog/edit.astro";
const $$url = "/admin/blog/edit";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
