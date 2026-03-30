const request = require('supertest');
const express = require('express');

const mockDb = {
    prepare: jest.fn()
};
jest.mock('../db', () => mockDb);

const supportRoutes = require('../routes/support');

const app = express();
app.use(express.json());

// Mock auth middleware for the route directly inside app
app.use((req, res, next) => {
    req.user = { id: 'admin-user', role: 'admin' };
    next();
});

app.use('/', supportRoutes);

describe('Support Ticket Export Security', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('SECURITY CHECK: should escape HTML entities in ticket export', async () => {
        const mockTicket = {
            id: '123',
            title: '<script>alert("title XSS")</script>',
            description: '<script>alert("description XSS")</script>',
            client_id: '<script>alert("client_id XSS")</script>',
            status: 'open',
            priority: 1,
            created_at: '2023-01-01',
            attachments: '[]'
        };
        const mockMessages = [
            {
                ticket_id: '123',
                sender: '<script>alert("sender XSS")</script>',
                message: '<script>alert("message XSS")</script>',
                created_at: '2023-01-02',
                attachment: '[]'
            }
        ];

        mockDb.prepare.mockImplementation((query) => {
            if (query.includes('FROM support_tickets')) {
                return { get: () => mockTicket, all: () => [mockTicket] };
            }
            if (query.includes('FROM ticket_messages')) {
                return { all: () => mockMessages };
            }
            return { get: () => ({}), all: () => [] };
        });

        const res = await request(app).get('/tickets/123/export');

        expect(res.status).toBe(200);
        expect(res.text).not.toContain('<script>alert("title XSS")</script>');
        expect(res.text).not.toContain('<script>alert("description XSS")</script>');
        expect(res.text).not.toContain('<script>alert("client_id XSS")</script>');
        expect(res.text).not.toContain('<script>alert("sender XSS")</script>');
        expect(res.text).not.toContain('<script>alert("message XSS")</script>');

        expect(res.text).toContain('&lt;script&gt;alert(&quot;title XSS&quot;)&lt;/script&gt;');
        expect(res.text).toContain('&lt;script&gt;alert(&quot;description XSS&quot;)&lt;/script&gt;');
        expect(res.text).toContain('&lt;script&gt;alert(&quot;message XSS&quot;)&lt;/script&gt;');
    });
});
