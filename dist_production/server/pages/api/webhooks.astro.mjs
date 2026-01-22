import { renderers } from "../../renderers.mjs";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "webhook_secret_key";
const POST = async ({ request }) => {
  const signature = request.headers.get("X-Webhook-Signature");
  const eventType = request.headers.get("X-Webhook-Event-Type") || "generic";
  if (signature && signature !== WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const payload = await request.json();
    switch (eventType) {
      case "payment.success":
        await handlePaymentSuccess(payload);
        break;
      case "order.created":
        await handleOrderCreated(payload);
        break;
      case "user.subscribed":
        await handleUserSubscribed(payload);
        break;
      case "inventory.updated":
        await handleInventoryUpdated(payload);
        break;
      default:
    }
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function handlePaymentSuccess(payload) {
}
async function handleOrderCreated(payload) {
}
async function handleUserSubscribed(payload) {
}
async function handleInventoryUpdated(payload) {
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
