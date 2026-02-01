import type { APIRoute, APIContext } from 'astro';

// Zapier webhook endpoint - accepts any data format
export const POST: APIRoute = async (context: APIContext) => {
    const { request } = context;
    try {
        const contentType = request.headers.get('content-type') || '';

        let payload: any;

        if (contentType.includes('application/json')) {
            payload = await request.json();
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await request.formData();
            payload = Object.fromEntries(formData);
        } else {
            // Handle raw text or other formats
            payload = await request.text();
        }

        console.log('Zapier webhook received:', {
            headers: Object.fromEntries(request.headers),
            payload: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)
        });

        // Process Zapier webhook based on trigger type
        const triggerType = request.headers.get('X-Zapier-Trigger') || 'generic';

        switch (triggerType) {
            case 'new_user':
                await processNewUserWebhook(payload);
                break;
            case 'new_order':
                await processNewOrderWebhook(payload);
                break;
            case 'payment_received':
                await processPaymentWebhook(payload);
                break;
            default:
                await processGenericWebhook(payload);
        }

        // Zapier expects a 200 response
        return new Response(JSON.stringify({
            status: 'success',
            processed: true,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Zapier webhook error:', error);
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Processing failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

async function processNewUserWebhook(data: any) {
    console.log('[Zapier] New user webhook received:', JSON.stringify(data, null, 2));
    // Forward to backend API for user creation
    try {
        const backendUrl = import.meta.env.BACKEND_URL || 'http://backend:3006';
        await fetch(`${backendUrl}/api/webhooks/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'zapier', ...data })
        });
    } catch (e) {
        console.error('[Zapier] Failed to forward new user webhook:', e);
    }
}

async function processNewOrderWebhook(data: any) {
    console.log('[Zapier] New order webhook received:', JSON.stringify(data, null, 2));
    // Forward to backend API for order processing
    try {
        const backendUrl = import.meta.env.BACKEND_URL || 'http://backend:3006';
        await fetch(`${backendUrl}/api/webhooks/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'zapier', ...data })
        });
    } catch (e) {
        console.error('[Zapier] Failed to forward order webhook:', e);
    }
}

async function processPaymentWebhook(data: any) {
    console.log('[Zapier] Payment webhook received:', JSON.stringify(data, null, 2));
    // Forward to backend API for payment processing
    try {
        const backendUrl = import.meta.env.BACKEND_URL || 'http://backend:3006';
        await fetch(`${backendUrl}/api/webhooks/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'zapier', ...data })
        });
    } catch (e) {
        console.error('[Zapier] Failed to forward payment webhook:', e);
    }
}

async function processGenericWebhook(data: any) {
    console.log('[Zapier] Generic webhook data logged:', JSON.stringify(data, null, 2));
    // Store in analytics or forward as needed
}

// Zapier also supports GET for testing
export const GET: APIRoute = async (context: APIContext) => {
    return new Response(JSON.stringify({
        message: 'Zapier webhook endpoint - use POST to send data',
        supported_triggers: ['new_user', 'new_order', 'payment_received', 'generic']
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};