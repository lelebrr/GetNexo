import { renderers } from "../../../renderers.mjs";
const POST = async (context) => {
  const { request } = context;
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload;
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      payload = Object.fromEntries(formData);
    } else {
      payload = await request.text();
    }
    const triggerType = request.headers.get("X-Zapier-Trigger") || "generic";
    switch (triggerType) {
      case "new_user":
        await processNewUserWebhook(payload);
        break;
      case "new_order":
        await processNewOrderWebhook(payload);
        break;
      case "payment_received":
        await processPaymentWebhook(payload);
        break;
      default:
        await processGenericWebhook(payload);
    }
    return new Response(JSON.stringify({
      status: "success",
      processed: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      message: "Processing failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function processNewUserWebhook(data) {
}
async function processNewOrderWebhook(data) {
}
async function processPaymentWebhook(data) {
}
async function processGenericWebhook(data) {
}
const GET = async (context) => {
  return new Response(JSON.stringify({
    message: "Zapier webhook endpoint - use POST to send data",
    supported_triggers: ["new_user", "new_order", "payment_received", "generic"]
  }), {
    status: 200,
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
