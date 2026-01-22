import { a as generateState, d as getGoogleAuthUrl } from "../../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../../renderers.mjs";
async function get(req) {
  const url = new URL(req.url);
  url.searchParams.get("redirect") || "/";
  const state = generateState();
  const authUrl = getGoogleAuthUrl(state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`
    }
  });
}
async function post(req) {
  const { redirect } = await req.json();
  const state = generateState();
  const authUrl = getGoogleAuthUrl(state);
  return new Response(JSON.stringify({ authUrl }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`
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
