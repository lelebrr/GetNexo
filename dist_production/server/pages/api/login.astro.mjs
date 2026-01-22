import { k as authenticateUser, g as generateToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const POST = async ({ request }) => {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email e senha são obrigatórios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const user = await authenticateUser(email, password);
  if (!user) {
    return new Response(JSON.stringify({ error: "Credenciais inválidas" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = generateToken(user);
  return new Response(JSON.stringify({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
