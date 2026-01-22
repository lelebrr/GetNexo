import fs from "fs";
import path from "path";
import { renderers } from "../../../renderers.mjs";
async function POST({ request }) {
  try {
    const body = await request.json();
    const configPath = path.join(process.cwd(), "public", "data", "feriados-config.json");
    if (!body.config || !body.config.feriados) {
      return new Response(JSON.stringify({
        error: "Configuração inválida"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    fs.writeFileSync(configPath, JSON.stringify(body, null, 2), "utf8");
    return new Response(JSON.stringify({
      success: true,
      message: "Configuração salva com sucesso"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Erro interno do servidor"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
