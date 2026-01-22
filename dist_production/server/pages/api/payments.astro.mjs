import { v as verifyToken } from "../../assets/auth-bbOfVkaL.js";
import { renderers } from "../../renderers.mjs";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
class StripeConnector {
  constructor(apiKey = STRIPE_SECRET_KEY) {
    this.apiKey = apiKey;
  }
  async createPaymentIntent(amount, currency = "brl") {
    const paymentIntent = {
      id: `pi_mock_${Date.now()}`,
      amount: amount * 100,
      // Stripe uses cents
      currency: currency.toLowerCase(),
      status: "requires_payment_method",
      client_secret: `pi_mock_secret_${Date.now()}`
    };
    return paymentIntent;
  }
  async confirmPayment(paymentIntentId) {
    return {
      id: paymentIntentId,
      status: "succeeded"
    };
  }
  async createCustomer(email, name) {
    return {
      id: `cus_mock_${Date.now()}`,
      email,
      name,
      created: Date.now()
    };
  }
  async getPaymentMethods(customerId) {
    return [
      {
        id: "pm_mock_card",
        type: "card",
        card: {
          brand: "visa",
          last4: "4242"
        }
      }
    ];
  }
  // Methods for integration with AdvancedArchitectureEngine
  initialize(apiKey) {
    this.apiKey = apiKey;
  }
  getStats() {
    return { status: "ready", mode: "test" };
  }
}
const stripe = new StripeConnector();
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
  const { amount, currency } = await request.json();
  if (!amount) {
    return new Response(JSON.stringify({ error: "Valor é obrigatório" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const paymentIntent = await stripe.createPaymentIntent(amount, currency || "brl");
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao processar pagamento" }), {
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
