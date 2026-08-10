const app = require('./server'); // Change from { app } to app since module.exports = app
const request = require('supertest');
const db = require('./db');

async function run() {
  const login = await request(app).post('/api/login').send({ email: 'admin@test.com', password: 'test123' });
  const token = login.body.token;

  // Since db setup seems a bit wonky outside the normal lifecycle, let's use the API to create the ticket
  const ticketRes = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
          customer_name: 'John',
          customer_phone: '123'
      });

  const ticketId = ticketRes.body.id || 1;

  const res2 = await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
          'status': 'closed',
          'subject = ?; DELETE FROM tickets; --': 'dummy' // Malicious key
      });

  console.log('Update 2 Status Code:', res2.status);
  console.log('Update 2 Response:', res2.body);

  if (res2.status !== 500 && !res2.body.error) {
     console.log('Fix successful! Malicious key ignored.');
  } else {
     console.log('SQL Injection may still be possible or error happened:', res2.body.error);
  }
}

run().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
