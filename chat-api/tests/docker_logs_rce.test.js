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

describe('Docker Logs Route Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('SECURITY CHECK: should reject malicious tail input', async () => {
    const validName = 'my-container_1';
    const maliciousTail = '--help';

    const res = await request(app)
      .get(`/api/docker/logs/${validName}?tail=${maliciousTail}`)

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Parâmetro tail inválido');
    expect(child_process.execFile).not.toHaveBeenCalled();
  });

  it('FUNCTIONALITY CHECK: should allow valid numeric tail', async () => {
    const validName = 'my-container_1';
    const validTail = '50';

    const res = await request(app)
      .get(`/api/docker/logs/${validName}?tail=${validTail}`)

    expect(res.status).toBe(200);
    expect(child_process.execFile).toHaveBeenCalled();
    const calls = child_process.execFile.mock.calls;
    expect(calls[0][1]).toEqual(['logs', '--tail', validTail, validName]);
  });

  it('FUNCTIONALITY CHECK: should allow "all" tail', async () => {
    const validName = 'my-container_1';
    const validTail = 'all';

    const res = await request(app)
      .get(`/api/docker/logs/${validName}?tail=${validTail}`)

    expect(res.status).toBe(200);
    expect(child_process.execFile).toHaveBeenCalled();
    const calls = child_process.execFile.mock.calls;
    expect(calls[0][1]).toEqual(['logs', '--tail', validTail, validName]);
  });
});
