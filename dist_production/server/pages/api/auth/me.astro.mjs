import { v as verifyToken } from "../../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../../renderers.mjs";
async function get(req) {
  const cookies = req.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/auth_token=([^;]+)/);
  if (!tokenMatch) {
    return new Response(JSON.stringify({ authenticated: false }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = tokenMatch[1];
  const user = verifyToken(token);
  if (!user) {
    return new Response(JSON.stringify({ authenticated: false }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({
    authenticated: true,
    user
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
async function post(req) {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "auth_token=; Path=/; HttpOnly; Max-Age=0"
    }
  });
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get,
  post
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
