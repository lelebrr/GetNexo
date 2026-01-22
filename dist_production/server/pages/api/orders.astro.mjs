import { v as verifyToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const orders = [
  { id: 1, userId: 1, products: [{ id: 1, quantity: 2 }], total: 199.98, status: "pending" },
  { id: 2, userId: 2, products: [{ id: 2, quantity: 1 }], total: 149.99, status: "shipped" }
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
  const userOrders = decoded.role === "admin" ? orders : orders.filter((order) => order.userId === decoded.id);
  return new Response(JSON.stringify(userOrders), {
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
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { products } = await request.json();
  if (!products || !Array.isArray(products)) {
    return new Response(JSON.stringify({ error: "Produtos são obrigatórios" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrder = {
    id: orders.length + 1,
    userId: decoded.id,
    products,
    total,
    status: "pending"
  };
  orders.push(newOrder);
  return new Response(JSON.stringify(newOrder), {
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
