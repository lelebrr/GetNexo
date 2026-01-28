const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Mercado Pago
router.post('/mercadopago/create-preference', paymentController.createMercadoPagoPreference);
router.post('/mercadopago/webhook', paymentController.handleMercadoPagoWebhook);

// Stripe
router.post('/stripe/create-session', paymentController.createStripeSession);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;
