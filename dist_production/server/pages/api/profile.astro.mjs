import { v as verifyToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const userProfiles = /* @__PURE__ */ new Map();
async function get(req) {
  const cookies = req.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/auth_token=([^;]+)/);
  if (!tokenMatch) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = tokenMatch[1];
  const user = verifyToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const profile = userProfiles.get(user.id) || {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: "",
    preferences: {
      theme: "light",
      notifications: true,
      language: "pt-BR"
    }
  };
  return new Response(JSON.stringify(profile), {
    headers: { "Content-Type": "application/json" }
  });
}
async function post(req) {
  const cookies = req.headers.get("cookie") || "";
  const tokenMatch = cookies.match(/auth_token=([^;]+)/);
  if (!tokenMatch) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = tokenMatch[1];
  const user = verifyToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const updates = await req.json();
    const currentProfile = userProfiles.get(user.id) || {};
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    userProfiles.set(user.id, updatedProfile);
    return new Response(JSON.stringify(updatedProfile), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
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
