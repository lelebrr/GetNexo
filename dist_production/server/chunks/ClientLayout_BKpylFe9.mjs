import { e as createAstro, f as createComponent, h as addAttribute, n as renderHead, o as renderSlot, l as renderScript, r as renderTemplate } from "./astro/server_MCYX8tFF.mjs";
import "piccolore";
import "clsx";
/* empty css                            */
const $$Astro = createAstro("https://getnexo.com.br");
const $$ClientLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ClientLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="pt-BR" data-astro-cid-il4zqwvm> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-gray-50 text-gray-900" data-astro-cid-il4zqwvm> <header class="bg-white shadow-sm border-b" data-astro-cid-il4zqwvm> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-il4zqwvm> <div class="flex justify-between items-center py-4" data-astro-cid-il4zqwvm> <div class="flex items-center" data-astro-cid-il4zqwvm> <h1 class="text-2xl font-bold text-gray-900" data-astro-cid-il4zqwvm>Portal do Cliente</h1> </div> <nav class="flex space-x-4" data-astro-cid-il4zqwvm> <a href="/cliente/hub" class="text-gray-600 hover:text-gray-900" data-astro-cid-il4zqwvm>Hub</a> <a href="/cliente/chamados" class="text-gray-600 hover:text-gray-900" data-astro-cid-il4zqwvm>Chamados</a> <a href="/cliente/compras" class="text-gray-600 hover:text-gray-900" data-astro-cid-il4zqwvm>Compras</a> <a href="/cliente/pontos" class="text-gray-600 hover:text-gray-900" data-astro-cid-il4zqwvm>Pontos</a> <button class="text-gray-600 hover:text-gray-900" data-astro-cid-il4zqwvm>Sair</button> </nav> </div> </div> </header> <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" data-astro-cid-il4zqwvm> ${renderSlot($$result, $$slots["default"])} </main> <!-- Ghost Mode Button --> <button id="ghost-support" class="fixed bottom-4 right-4 w-6 h-6 bg-gray-400 rounded opacity-0 transition-opacity duration-300" title="Suporte" data-astro-cid-il4zqwvm>
?
</button>  ${renderScript($$result, "/home/lele/usenexo/getnexo-site/src/layouts/ClientLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/lele/usenexo/getnexo-site/src/layouts/ClientLayout.astro", void 0);
export {
  $$ClientLayout as $
};
