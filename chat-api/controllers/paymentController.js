const MercadoPago = require('mercadopago');
const Stripe = require('stripe');

// Initialize SDKs with dummy keys if env not set
const mp = new MercadoPago.MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'TEST-00000000-0000-0000-0000-000000000000',
  options: { timeout: 5000 }
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_000000000000000000000000000000');

// Mercado Pago
exports.createMercadoPagoPreference = async (req, res) => {
  try {
    const { items, payer } = req.body;
    const preference = await new MercadoPago.Preference(mp).create({
      body: {
        items: items || [{ title: 'Produto Teste', unit_price: 100, quantity: 1 }],
        payer: payer || { email: 'test@user.com' },
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/failure`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pending`
        },
        auto_return: 'approved'
      }
    });
    res.json({ id: preference.id, init_point: preference.init_point });
  } catch (error) {
    console.error('MercadoPago Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.handleMercadoPagoWebhook = async (req, res) => {
  // Validate and process webhook
  console.log('MercadoPago Webhook:', req.body);
  res.status(200).send('OK');
};

// Stripe
exports.createStripeSession = async (req, res) => {
  try {
    const { items } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items?.map(item => ({
        price_data: {
          currency: 'brl',
          product_data: { name: item.title },
          unit_amount: item.unit_price * 100, // cents
        },
        quantity: item.quantity,
      })) || [{
        price_data: {
          currency: 'brl',
          product_data: { name: 'Produto Teste' },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
    console.log('Stripe Webhook:', event.type);
    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
