const request = require('supertest');
const app = require('../server');

describe('Security Vulnerability Remediation', () => {

  it('should REJECT access to customers without authentication (SECURE)', async () => {
    // We expect 401 Unauthorized now
    const res = await request(app)
      .get('/api/crm/customers')
      .expect(401);

    expect(res.body).toHaveProperty('error', 'Token não fornecido');
  });

  it('should REJECT access to tickets without authentication (SECURE)', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .expect(401);

    expect(res.body).toHaveProperty('error', 'Token não fornecido');
  });
});
