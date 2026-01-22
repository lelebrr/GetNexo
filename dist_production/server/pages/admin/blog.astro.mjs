import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
/* empty css                                  */
import { renderers } from "../../renderers.mjs";
const $$Blog = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Blog Management", "data-astro-cid-ugtyk2hi": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="blog-header" data-astro-cid-ugtyk2hi> <div class="search-bar" data-astro-cid-ugtyk2hi> <input type="text" placeholder="Buscar posts..." data-astro-cid-ugtyk2hi> </div> <a href="/admin/blog/edit" class="btn-glow" data-astro-cid-ugtyk2hi>Criar Novo Post</a> </div> <div class="cyber-card blog-list" data-astro-cid-ugtyk2hi> <table data-astro-cid-ugtyk2hi> <thead data-astro-cid-ugtyk2hi> <tr data-astro-cid-ugtyk2hi> <th data-astro-cid-ugtyk2hi>Título</th> <th data-astro-cid-ugtyk2hi>Idioma</th> <th data-astro-cid-ugtyk2hi>Status</th> <th data-astro-cid-ugtyk2hi>Data</th> <th data-astro-cid-ugtyk2hi>Ações</th> </tr> </thead> <tbody data-astro-cid-ugtyk2hi> <tr data-astro-cid-ugtyk2hi> <td class="primary" data-astro-cid-ugtyk2hi>A Revolução da IA no WhatsApp</td> <td data-astro-cid-ugtyk2hi><span class="flag" data-astro-cid-ugtyk2hi>🇧🇷 PT</span></td> <td data-astro-cid-ugtyk2hi><span class="status published" data-astro-cid-ugtyk2hi>Publicado</span></td> <td data-astro-cid-ugtyk2hi>21/01/2026</td> <td data-astro-cid-ugtyk2hi> <div class="actions" data-astro-cid-ugtyk2hi> <a href="/admin/blog/edit" title="Editar" style="text-decoration:none;" data-astro-cid-ugtyk2hi>✏️</a> <button title="Excluir" class="delete" data-astro-cid-ugtyk2hi>🗑️</button> </div> </td> </tr> <tr data-astro-cid-ugtyk2hi> <td class="primary" data-astro-cid-ugtyk2hi>The Future of Customer Support</td> <td data-astro-cid-ugtyk2hi><span class="flag" data-astro-cid-ugtyk2hi>🇺🇸 EN</span></td> <td data-astro-cid-ugtyk2hi><span class="status draft" data-astro-cid-ugtyk2hi>Rascunho</span></td> <td data-astro-cid-ugtyk2hi>20/01/2026</td> <td data-astro-cid-ugtyk2hi> <div class="actions" data-astro-cid-ugtyk2hi> <a href="/admin/blog/edit" title="Editar" style="text-decoration:none;" data-astro-cid-ugtyk2hi>✏️</a> <button title="Excluir" class="delete" data-astro-cid-ugtyk2hi>🗑️</button> </div> </td> </tr> </tbody> </table> </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/blog.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/blog.astro";
const $$url = "/admin/blog";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
