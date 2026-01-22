import "../../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../../renderers.mjs";
const GET = async ({ url }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const baseUrl = process.env.BASE_URL || "http://localhost:4321";
  return Response.redirect(`${baseUrl}/cliente/login?token=${token}`);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
