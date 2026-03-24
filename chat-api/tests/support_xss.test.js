const request = require('supertest');
const express = require('express');
const supportRouter = require('../routes/support');

// Mock db e authentication
jest.mock('../db', () => ({
    prepare: jest.fn().mockReturnThis(),
    get: jest.fn(),
    all: jest.fn()
}));
const db = require('../db');

const app = express();
app.use((req, res, next) => {
    req.user = { id: 'test_client', role: 'admin' };
    next();
});
app.use(express.json());
app.use('/', supportRouter);

describe('Support Ticket Export XSS', () => {
    it('should escape HTML in exported ticket', async () => {
        db.get.mockReturnValue({
            id: 1,
            title: '<script>alert("XSS")</script>',
            description: '<img src=x onerror=alert("XSS")>',
            client_id: '<b>hacker</b>',
            status: 'open',
            priority: 1,
            created_at: '2023-01-01',
            attachments: '[]'
        });

        db.all.mockReturnValue([{
            id: 1,
            ticket_id: 1,
            sender: 'hacker',
            message: '<svg onload=alert("XSS")>',
            created_at: '2023-01-01',
            attachment: '[]'
        }]);

        const res = await request(app).get('/tickets/1/export');
        expect(res.status).toBe(200);
        expect(res.text).not.toContain('<script>');
        expect(res.text).not.toContain('<img src=x');
        expect(res.text).not.toContain('<b>');
        expect(res.text).not.toContain('<svg');

        expect(res.text).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        expect(res.text).toContain('&lt;img src=x onerror=alert(&quot;XSS&quot;)&gt;');
    });
});
