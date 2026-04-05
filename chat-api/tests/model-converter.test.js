const child_process = require('child_process');
const { convertGlbToUsdz } = require('../scripts/model-converter');

jest.mock('child_process', () => ({
    execFile: jest.fn((cmd, args, cb) => cb(null, 'Success output', '')),
    exec: jest.fn()
}));

describe('Model Converter Security', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should invoke npx using execFile instead of exec to prevent command injection', async () => {
        const maliciousGlbPath = 'file.glb; echo "Hacked!"';
        const usdzPath = 'output.usdz';

        await convertGlbToUsdz(maliciousGlbPath, usdzPath);

        expect(child_process.exec).not.toHaveBeenCalled();
        expect(child_process.execFile).toHaveBeenCalledTimes(1);

        const callArgs = child_process.execFile.mock.calls[0];

        // Assert executable is npx
        expect(callArgs[0]).toMatch(/^npx(\.cmd)?$/);

        // Assert arguments are passed as an array safely
        expect(Array.isArray(callArgs[1])).toBe(true);
        expect(callArgs[1]).toEqual(['gltf-to-usdz', maliciousGlbPath, usdzPath]);
    });
});
