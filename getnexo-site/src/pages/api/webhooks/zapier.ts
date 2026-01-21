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
    console.log('Processing new user from Zapier:', data);
    // TODO: Create user in system, send welcome email, etc.
}

async function processNewOrderWebhook(data: any) {
    console.log('Processing new order from Zapier:', data);
    // TODO: Create order, update inventory, send notifications
}

async function processPaymentWebhook(data: any) {
    console.log('Processing payment from Zapier:', data);
    // TODO: Update payment status, trigger fulfillment
}

async function processGenericWebhook(data: any) {
    console.log('Processing generic webhook from Zapier:', data);
    // TODO: Log or process generic data
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