import { renderers } from "../../renderers.mjs";
async function login(username, password) {
  if (username === "admin" && password === "nexus2026") {
    const token = btoa(username + ":" + Date.now());
    localStorage.setItem("adminToken", token);
    return { success: true, token };
  }
  return { success: false, error: "Credenciais inválidas" };
}
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
}
function isAuthenticated() {
  return !!localStorage.getItem("adminToken");
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isAuthenticated,
  login,
  logout
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
