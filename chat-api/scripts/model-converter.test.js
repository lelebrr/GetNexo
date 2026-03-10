const { execFile } = require('child_process');
const { convertGlbToUsdz } = require('./model-converter');

jest.mock('child_process', () => ({
    execFile: jest.fn((cmd, args, cb) => {
        cb(null, 'Success', '');
    })
}));

describe('model-converter.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('convertGlbToUsdz should call execFile securely with separated args', async () => {
        const glbPath = 'input.glb';
        const usdzPath = 'output.usdz';

        await convertGlbToUsdz(glbPath, usdzPath);

        expect(execFile).toHaveBeenCalled();
        const callArgs = execFile.mock.calls[0];

        // Ensure command is an npx variant
        expect(callArgs[0]).toMatch(/^npx(\.cmd)?$/);

        // Ensure arguments are passed as array to execFile
        expect(callArgs[1]).toEqual(['gltf-to-usdz', glbPath, usdzPath]);
    });
});
