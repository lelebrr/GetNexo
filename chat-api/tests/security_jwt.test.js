const request = require('supertest');

describe('Security: JWT Secret Enforcement', () => {
    let originalEnv;
    let mockExit;
    let mockConsoleError;

    beforeEach(() => {
        originalEnv = { ...process.env };
        mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.resetModules();
    });

    afterEach(() => {
        process.env = originalEnv;
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
        jest.resetModules();
    });

    test('should exit process if JWT_SECRET is missing', () => {
        delete process.env.JWT_SECRET;

        // require server to trigger the top-level check
        try {
            require('../server');
        } catch (e) {
            // Ignore potential errors from partial initialization if process.exit was called
        }

        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('FATAL: JWT_SECRET environment variable is not set'));
    });

    test('should NOT exit process if JWT_SECRET is present', () => {
        process.env.JWT_SECRET = 'valid-test-secret';

        try {
            require('../server');
        } catch (e) {
            // Ignore unrelated errors
        }

        expect(mockExit).not.toHaveBeenCalled();
    });
});
