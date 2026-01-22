import { h as findUserByEmail, i as createUser, g as generateToken } from "../../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../../renderers.mjs";
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, name, whatsapp, cpf_cnpj, website, platform, segment, company } = body;
    if (!email || !password || !name || !whatsapp || !cpf_cnpj || !website || !platform || !segment) {
      return new Response(JSON.stringify({ success: false, error: "Campos obrigatórios ausentes" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existing = findUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ success: false, error: "E-mail já cadastrado" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await createUser({
      email,
      password,
      name,
      whatsapp,
      cpf_cnpj,
      website,
      platform,
      segment,
      company
    });
    const token = generateToken(user);
    return new Response(JSON.stringify({
      success: true,
      user,
      token
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
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
