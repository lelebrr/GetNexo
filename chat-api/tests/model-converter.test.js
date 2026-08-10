const { convertGlbToUsdz } = require('../scripts/model-converter');
const child_process = require('child_process');

jest.mock('child_process', () => ({
  exec: jest.fn((cmd, cb) => cb(null, 'mock-stdout', '')),
  execFile: jest.fn((cmd, args, cb) => cb(null, 'mock-stdout', ''))
}));

describe('Model Converter Security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('SECURITY CHECK: should not use exec', async () => {
    const glbPath = 'test.glb; cat /etc/passwd';
    const usdzPath = 'test.usdz';

    await convertGlbToUsdz(glbPath, usdzPath);

    expect(child_process.exec).not.toHaveBeenCalled();
    expect(child_process.execFile).toHaveBeenCalled();
  });
});
