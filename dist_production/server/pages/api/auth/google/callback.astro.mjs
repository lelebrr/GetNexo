import { c as exchangeGoogleCode, g as generateToken } from "../../../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../../../renderers.mjs";
async function get(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (error) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/?error=${error}`
      }
    });
  }
  if (!code) {
    return new Response(JSON.stringify({ error: "No authorization code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const user = await exchangeGoogleCode(code);
    const token = generateToken(user);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/?token=${token}`,
        "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
      }
    });
  } catch (err) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/?error=oauth_failed`
      }
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
