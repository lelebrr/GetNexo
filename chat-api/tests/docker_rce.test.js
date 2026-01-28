const request = require('supertest');
const express = require('express');
const child_process = require('child_process');

// Mock child_process
jest.mock('child_process', () => ({
  exec: jest.fn(),
  execFile: jest.fn((file, args, opts, cb) => {
    const callback = typeof opts === 'function' ? opts : cb;
    callback(null, 'mock-stdout', '');
  })
}));

// Mock auth middleware
jest.mock('../middleware/auth', () => (req, res, next) => next());

// Load the router
const dockerRoutes = require('../routes/docker');

const app = express();
app.use(express.json());
app.use('/api/docker', dockerRoutes);

describe('Docker Routes Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('SECURITY CHECK: should reject malicious input via validation', async () => {
    const maliciousName = 'validname; cat /etc/passwd';

    const res = await request(app)
      .post('/api/docker/stop')
      .send({ name: maliciousName });

    // Should return 400 Bad Request
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Nome do container inválido/);

    // Should NOT call exec or execFile
    expect(child_process.exec).not.toHaveBeenCalled();
    expect(child_process.execFile).not.toHaveBeenCalled();
  });

  it('FUNCTIONALITY CHECK: should allow valid input', async () => {
    const validName = 'my-container_1';

    const res = await request(app)
      .post('/api/docker/stop')
      .send({ name: validName });

    expect(res.status).toBe(200);
    expect(child_process.execFile).toHaveBeenCalled();

    // Check arguments
    const calls = child_process.execFile.mock.calls;
    expect(calls[0][0]).toContain('docker'); // Binary
    expect(calls[0][1]).toEqual(['stop', validName]); // Args array
  });
});
