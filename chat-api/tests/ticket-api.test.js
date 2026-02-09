const request = require('supertest');
const { app, server } = require('../server'); // We'll need to export app from server.js

describe('Ticket API Tests', () => {
    let authToken;
    let testTicketId;
    let testUserId = 1; // Admin user from setup

    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@getnexo.com.br',
                password: 'admin123'
            });

        expect(loginResponse.status).toBe(200);
        authToken = loginResponse.body.token;
    });

    afterAll((done) => {
        if (server) {
            server.close(done);
        } else {
            done();
        }
    });

    describe('POST /api/support/tickets - Create Ticket', () => {
        test('should create a new ticket successfully', async () => {
            const ticketData = {
                title: 'Test Ticket Creation',
                description: 'This is a test ticket for automated testing',
                priority: 'high',
                category: 'bug',
                tags: ['test', 'automation'],
                requester_name: 'Test User',
                requester_email: 'test@example.com'
            };

            const response = await request(app)
                .post('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .send(ticketData);

            expect(response.status).toBe(201);
            expect(response.body.ticketId).toBeDefined();
            testTicketId = response.body.ticketId;
            expect(response.body.isDraft).toBe(false);
        });

        test('should create draft ticket in training mode', async () => {
            // Enable training mode
            await request(app)
                .post('/api/training/toggle')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ enabled: true });

            const ticketData = {
                title: 'Training Mode Ticket',
                description: 'This should be a draft ticket',
                priority: 'medium'
            };

            const response = await request(app)
                .post('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .send(ticketData);

            expect(response.status).toBe(201);
            expect(response.body.isDraft).toBe(true);
            expect(response.body.scenario).toBeDefined();

            // Disable training mode
            await request(app)
                .post('/api/training/toggle')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ enabled: false });
        });

        test('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Missing Description' });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('required');
        });

        test('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/support/tickets')
                .send({
                    title: 'Test Ticket',
                    description: 'Test description'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/support/tickets - List Tickets', () => {
        beforeAll(async () => {
            // Create additional test tickets
            const tickets = [
                {
                    title: 'Urgent Bug Report',
                    description: 'Critical bug affecting users',
                    priority: 'urgent',
                    status: 'open'
                },
                {
                    title: 'Feature Request',
                    description: 'New feature suggestion',
                    priority: 'low',
                    status: 'in_progress'
                }
            ];

            for (const ticket of tickets) {
                await request(app)
                    .post('/api/support/tickets')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(ticket);
            }
        });

        test('should return paginated tickets', async () => {
            const response = await request(app)
                .get('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.tickets).toBeDefined();
            expect(Array.isArray(response.body.tickets)).toBe(true);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.pagination.total).toBeGreaterThan(0);
        });

        test('should filter by status', async () => {
            const response = await request(app)
                .get('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ status: 'open' });

            expect(response.status).toBe(200);
            expect(response.body.tickets.every(ticket => ticket.status === 'open')).toBe(true);
        });

        test('should filter by priority', async () => {
            const response = await request(app)
                .get('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ priority: 'urgent' });

            expect(response.status).toBe(200);
            expect(response.body.tickets.every(ticket => ticket.priority === 'urgent')).toBe(true);
        });

        test('should search by text', async () => {
            const response = await request(app)
                .get('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ search: 'bug' });

            expect(response.status).toBe(200);
            expect(response.body.tickets.length).toBeGreaterThan(0);
            expect(response.body.tickets.some(ticket =>
                ticket.title.toLowerCase().includes('bug') ||
                ticket.description.toLowerCase().includes('bug')
            )).toBe(true);
        });

        test('should sort by created date', async () => {
            const response = await request(app)
                .get('/api/support/tickets')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ sort_by: 'created_at', sort_order: 'desc' });

            expect(response.status).toBe(200);
            const tickets = response.body.tickets;
            for (let i = 1; i < tickets.length; i++) {
                expect(new Date(tickets[i - 1].created_at).getTime())
                    .toBeGreaterThanOrEqual(new Date(tickets[i].created_at).getTime());
            }
        });
    });

    describe('GET /api/support/tickets/:id - Get Single Ticket', () => {
        test('should return ticket details', async () => {
            const response = await request(app)
                .get(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testTicketId);
            expect(response.body.title).toBe('Test Ticket Creation');
            expect(response.body.description).toBe('This is a test ticket for automated testing');
            expect(response.body.checklist).toBeDefined();
            expect(response.body.history).toBeDefined();
        });

        test('should return 404 for non-existent ticket', async () => {
            const response = await request(app)
                .get('/api/support/tickets/NONEXISTENT')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toContain('not found');
        });
    });

    describe('PUT /api/support/tickets/:id - Update Ticket', () => {
        test('should update ticket status', async () => {
            const response = await request(app)
                .put(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'in_progress' });

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('updated');

            // Verify update
            const getResponse = await request(app)
                .get(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.body.status).toBe('in_progress');
        });

        test('should update ticket priority', async () => {
            const response = await request(app)
                .put(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ priority: 'critical' });

            expect(response.status).toBe(200);

            // Verify update
            const getResponse = await request(app)
                .get(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.body.priority).toBe('critical');
        });

        test('should update assignee', async () => {
            const response = await request(app)
                .put(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ assignee_id: 1 });

            expect(response.status).toBe(200);

            // Verify update
            const getResponse = await request(app)
                .get(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.body.assignee_id).toBe(1);
        });
    });

    describe('POST /api/support/tickets/:id/transfer - Transfer Ticket', () => {
        test('should transfer ticket to another agent', async () => {
            // Create another user first
            const newUserPass = require('bcrypt').hashSync('test456', 10);
            const userResult = global.db.prepare('INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)').run('agent@test.com', newUserPass, 3);
            const agentId = userResult.lastInsertRowid;

            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/transfer`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    to_agent_id: agentId,
                    reason: 'Load balancing'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('transferred');
        });
    });

    describe('PUT /api/support/tickets/:id/sla/pause - SLA Management', () => {
        test('should pause SLA', async () => {
            const response = await request(app)
                .put(`/api/support/tickets/${testTicketId}/sla/pause`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    paused: true,
                    reason: 'Waiting for customer response'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('paused');
        });

        test('should resume SLA', async () => {
            const response = await request(app)
                .put(`/api/support/tickets/${testTicketId}/sla/pause`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ paused: false });

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('resumed');
        });
    });

    describe('POST /api/support/tickets/:id/duplicate - Duplicate Ticket', () => {
        test('should create duplicate ticket', async () => {
            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/duplicate`)
                .set('Authorization', `Bearer ${authToken}`)
                .send();

            expect(response.status).toBe(201);
            expect(response.body.ticketId).toBeDefined();
            expect(response.body.ticketId).not.toBe(testTicketId);
        });
    });

    describe('POST /api/support/tickets/:id/tags - Tag Management', () => {
        test('should add tag to ticket', async () => {
            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/tags`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ tag: 'important' });

            expect(response.status).toBe(201);
            expect(response.body.message).toContain('added');
        });

        test('should prevent duplicate tags', async () => {
            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/tags`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ tag: 'important' });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('already exists');
        });
    });

    describe('POST /api/support/tickets/:id/timer/start - Cost Timer', () => {
        test('should start cost timer', async () => {
            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/timer/start`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    hourly_rate: 75,
                    description: 'Complex debugging'
                });

            expect(response.status).toBe(201);
            expect(response.body.timerId).toBeDefined();
        });

        test('should prevent multiple active timers', async () => {
            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/timer/start`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ hourly_rate: 50 });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('already running');
        });
    });

    describe('POST /api/support/tickets/:id/checklist - Checklist Management', () => {
        test('should add checklist item', async () => {
            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/checklist`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Initial diagnosis',
                    description: 'Analyze the root cause',
                    assigned_to: 1
                });

            expect(response.status).toBe(201);
            expect(response.body.itemId).toBeDefined();
        });
    });

    describe('POST /api/support/tickets/:id/reminders - Reminders', () => {
        test('should create ticket reminder', async () => {
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 24);

            const response = await request(app)
                .post(`/api/support/tickets/${testTicketId}/reminders`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Follow up with customer',
                    description: 'Check if issue is resolved',
                    reminder_date: futureDate.toISOString()
                });

            expect(response.status).toBe(201);
            expect(response.body.reminderId).toBeDefined();
        });
    });

    describe('DELETE /api/support/tickets/:id - Delete Ticket', () => {
        test('should soft delete ticket', async () => {
            const response = await request(app)
                .delete(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('deleted');

            // Verify it's marked as cancelled
            const getResponse = await request(app)
                .get(`/api/support/tickets/${testTicketId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(getResponse.body.status).toBe('cancelled');
        });
    });
});