const axios = require('axios');
const qrcode = require('qrcode');
const crypto = require('crypto');

class PaymentService {
    constructor() {
        this.gateways = {
            mercadopago: {
                baseUrl: 'https://api.mercadopago.com',
                headers: {}
            },
            stripe: {
                baseUrl: 'https://api.stripe.com/v1',
                headers: {}
            }
        };

        this.loadGatewayConfigs();
    }

    // Carregar configurações dos gateways
    loadGatewayConfigs() {
        // Mercado Pago
        const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (mpAccessToken) {
            this.gateways.mercadopago.headers = {
                'Authorization': `Bearer ${mpAccessToken}`,
                'Content-Type': 'application/json'
            };
        }

        // Stripe
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (stripeSecretKey) {
            this.gateways.stripe.headers = {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/json'
            };
        }
    }

    // Gerar chave Pix dinâmica
    async generatePixKey(amount, description = 'Pagamento GetNexo', phone = null) {
        try {
            // Simulação de geração de chave Pix (em produção, integrar com PSP)
            const pixKey = crypto.randomBytes(16).toString('hex').toUpperCase();
            const payload = this.generatePixPayload(pixKey, amount, description);

            // Gerar QR Code
            const qrCodeDataURL = await qrcode.toDataURL(payload, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return {
                pixKey,
                qrCode: qrCodeDataURL,
                payload,
                amount,
                description
            };
        } catch (error) {
            console.error('[PAYMENT] Pix generation error:', error);
            throw new Error('Erro ao gerar chave Pix');
        }
    }

    // Gerar payload Pix
    generatePixPayload(pixKey, amount, description) {
        // Formato simplificado do payload Pix
        const merchantAccount = `0014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, '0')}${pixKey}`;
        const transactionAmount = amount.toFixed(2);
        const merchantCategory = '0000';
        const transactionCurrency = '986'; // BRL
        const countryCode = 'BR';
        const merchantName = 'GetNexo';
        const merchantCity = 'SAO PAULO';
        const additionalData = `05${description.length.toString().padStart(2, '0')}${description}`;

        // Calcular CRC16
        const payload = `00020126330014BR.GOV.BCB.PIX01${merchantAccount.length.toString().padStart(2, '0')}${merchantAccount}52040000${merchantCategory}5303${transactionCurrency}540${transactionAmount.length.toString().padStart(2, '0')}${transactionAmount}5802${countryCode}59${merchantName.length.toString().padStart(2, '0')}${merchantName}60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}62${additionalData.length.toString().padStart(2, '0')}${additionalData}6304`;

        const crc = this.calculateCRC16(payload);
        return payload + crc;
    }

    // Calcular CRC16-CCITT
    calculateCRC16(data) {
        const polynomial = 0x1021;
        let crc = 0xFFFF;

        for (let i = 0; i < data.length; i++) {
            crc ^= (data.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
            }
        }

        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    // Criar pagamento via Mercado Pago
    async createMercadoPagoPayment(amount, currency = 'BRL', description = '', metadata = {}) {
        try {
            if (!this.gateways.mercadopago.headers.Authorization) {
                throw new Error('Mercado Pago não configurado');
            }

            const paymentData = {
                transaction_amount: amount,
                description,
                payment_method_id: 'pix',
                payer: {
                    email: metadata.email || 'payer@example.com'
                },
                metadata
            };

            const response = await axios.post(
                `${this.gateways.mercadopago.baseUrl}/v1/payments`,
                paymentData,
                { headers: this.gateways.mercadopago.headers }
            );

            return {
                gateway: 'mercadopago',
                external_id: response.data.id,
                status: response.data.status,
                qr_code: response.data.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: response.data.point_of_interaction?.transaction_data?.qr_code_base64,
                ticket_url: response.data.point_of_interaction?.transaction_data?.ticket_url,
                raw_response: response.data
            };

        } catch (error) {
            console.error('[PAYMENT] Mercado Pago error:', error.response?.data || error.message);
            throw new Error('Erro ao criar pagamento Mercado Pago');
        }
    }

    // Criar pagamento via Stripe
    async createStripePayment(amount, currency = 'brl', description = '', metadata = {}) {
        try {
            if (!this.gateways.stripe.headers.Authorization) {
                throw new Error('Stripe não configurado');
            }

            // Stripe usa centavos para algumas moedas, mas para BRL usa reais
            const stripeAmount = currency.toLowerCase() === 'brl' ? Math.round(amount * 100) : amount;

            const paymentData = {
                amount: stripeAmount,
                currency: currency.toLowerCase(),
                description,
                metadata,
                payment_method_types: ['card', 'pix'] // Suporte a Pix se disponível
            };

            const response = await axios.post(
                `${this.gateways.stripe.baseUrl}/payment_intents`,
                paymentData,
                { headers: this.gateways.stripe.headers }
            );

            return {
                gateway: 'stripe',
                external_id: response.data.id,
                client_secret: response.data.client_secret,
                status: response.data.status,
                amount: response.data.amount,
                currency: response.data.currency,
                raw_response: response.data
            };

        } catch (error) {
            console.error('[PAYMENT] Stripe error:', error.response?.data || error.message);
            throw new Error('Erro ao criar pagamento Stripe');
        }
    }

    // Criar pagamento WhatsApp Pay
    async createWhatsAppPayment(amount, currency = 'BRL', description = '', phone = '', paymentMethod = 'pix') {
        try {
            let paymentResult;

            if (paymentMethod === 'pix') {
                // Usar nossa implementação Pix
                paymentResult = await this.generatePixKey(amount, description, phone);
                paymentResult.gateway = 'pix';
                paymentResult.external_id = paymentResult.pixKey;
            } else if (paymentMethod === 'mercadopago') {
                paymentResult = await this.createMercadoPagoPayment(amount, currency, description);
            } else if (paymentMethod === 'stripe') {
                paymentResult = await this.createStripePayment(amount, currency, description);
            } else {
                throw new Error('Método de pagamento não suportado');
            }

            return {
                ...paymentResult,
                payment_method: paymentMethod,
                amount,
                currency,
                description,
                phone,
                created_at: new Date().toISOString()
            };

        } catch (error) {
            console.error('[PAYMENT] WhatsApp Pay creation error:', error);
            throw error;
        }
    }

    // Verificar status do pagamento
    async checkPaymentStatus(gateway, externalId) {
        try {
            let status, details;

            switch (gateway) {
                case 'mercadopago':
                    const mpResponse = await axios.get(
                        `${this.gateways.mercadopago.baseUrl}/v1/payments/${externalId}`,
                        { headers: this.gateways.mercadopago.headers }
                    );
                    status = mpResponse.data.status;
                    details = mpResponse.data;
                    break;

                case 'stripe':
                    const stripeResponse = await axios.get(
                        `${this.gateways.stripe.baseUrl}/payment_intents/${externalId}`,
                        { headers: this.gateways.stripe.headers }
                    );
                    status = stripeResponse.data.status;
                    details = stripeResponse.data;
                    break;

                case 'pix':
                    // Para Pix, simular verificação (em produção, consultar PSP)
                    status = Math.random() > 0.7 ? 'completed' : 'pending';
                    details = { pix_key: externalId };
                    break;

                default:
                    throw new Error('Gateway não suportado');
            }

            return {
                gateway,
                external_id: externalId,
                status: this.normalizeStatus(status),
                details,
                checked_at: new Date().toISOString()
            };

        } catch (error) {
            console.error('[PAYMENT] Status check error:', error);
            throw new Error('Erro ao verificar status do pagamento');
        }
    }

    // Normalizar status entre diferentes gateways
    normalizeStatus(gatewayStatus) {
        const statusMap = {
            // Mercado Pago
            'approved': 'completed',
            'pending': 'pending',
            'rejected': 'failed',
            'cancelled': 'cancelled',

            // Stripe
            'succeeded': 'completed',
            'processing': 'pending',
            'requires_payment_method': 'failed',
            'canceled': 'cancelled',

            // Pix
            'completed': 'completed',
            'pending': 'pending',
            'failed': 'failed'
        };

        return statusMap[gatewayStatus] || 'unknown';
    }

    // Processar webhook de confirmação
    async processWebhook(gateway, webhookData) {
        try {
            let paymentUpdate = {};

            switch (gateway) {
                case 'mercadopago':
                    paymentUpdate = this.processMercadoPagoWebhook(webhookData);
                    break;

                case 'stripe':
                    paymentUpdate = this.processStripeWebhook(webhookData);
                    break;

                default:
                    throw new Error('Gateway não suportado para webhook');
            }

            return paymentUpdate;

        } catch (error) {
            console.error('[PAYMENT] Webhook processing error:', error);
            throw error;
        }
    }

    processMercadoPagoWebhook(data) {
        return {
            external_id: data.data.id,
            status: this.normalizeStatus(data.data.status),
            gateway: 'mercadopago',
            metadata: {
                webhook_received_at: new Date().toISOString(),
                mp_status: data.data.status,
                mp_status_detail: data.data.status_detail
            }
        };
    }

    processStripeWebhook(data) {
        return {
            external_id: data.data.object.id,
            status: this.normalizeStatus(data.data.object.status),
            gateway: 'stripe',
            metadata: {
                webhook_received_at: new Date().toISOString(),
                stripe_event_type: data.type,
                stripe_status: data.data.object.status
            }
        };
    }

    // Obter taxas de câmbio (simplificado)
    async getExchangeRates() {
        try {
            // Em produção, usar API como fixer.io ou exchangerate-api.com
            const rates = {
                BRL: 1,
                USD: 0.2, // Exemplo: 1 BRL = 0.2 USD
                EUR: 0.18, // Exemplo: 1 BRL = 0.18 EUR
                updated_at: new Date().toISOString()
            };

            return rates;
        } catch (error) {
            console.error('[PAYMENT] Exchange rates error:', error);
            return { BRL: 1, USD: 0.2, EUR: 0.18 };
        }
    }

    // Converter moeda
    convertCurrency(amount, fromCurrency, toCurrency) {
        // Implementação simples - em produção, usar taxas reais
        const rates = {
            'BRL_to_USD': 0.2,
            'BRL_to_EUR': 0.18,
            'USD_to_BRL': 5.0,
            'EUR_to_BRL': 5.5,
            'USD_to_EUR': 0.9,
            'EUR_to_USD': 1.11
        };

        const key = `${fromCurrency}_to_${toCurrency}`;
        const rate = rates[key] || 1;

        return Math.round(amount * rate * 100) / 100;
    }
}

module.exports = new PaymentService();