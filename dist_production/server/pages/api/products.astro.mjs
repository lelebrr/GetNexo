import { v as verifyToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const products = [
  { id: 1, name: "Produto 1", price: 99.99, stock: 100, category: "ecommerce" },
  { id: 2, name: "Produto 2", price: 149.99, stock: 50, category: "chat" }
];
const GET = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Token não fornecido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Token não fornecido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "admin") {
    return new Response(JSON.stringify({ error: "Acesso negado" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { name, price, stock, category } = await request.json();
  if (!name || !price) {
    return new Response(JSON.stringify({ error: "Nome e preço são obrigatórios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    stock: stock || 0,
    category: category || "general"
  };
  products.push(newProduct);
  return new Response(JSON.stringify(newProduct), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
