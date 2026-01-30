const path = require('path');

describe('Security Fix Verification', () => {
    let originalEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
        // Ensure valid secret initially
        process.env.JWT_SECRET = 'test-secret-key-123';

        // Mock db to avoid side effects
        jest.mock('../db', () => ({
            prepare: jest.fn(() => ({
                get: jest.fn(),
                run: jest.fn(),
                all: jest.fn()
            })),
            pragma: jest.fn(),
            transaction: jest.fn(fn => fn),
        }));
    });

    it('should export app function and not start server automatically', () => {
        const app = require('../server');
        expect(typeof app).toBe('function');
        // server is not exported, so we rely on lack of side effects (like logs or port binding)
    });

    it('should fail if JWT_SECRET is missing', () => {
        delete process.env.JWT_SECRET;

        // Mock process.exit and console.error
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('Process exited');
        });
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            require('../server');
        }).toThrow('Process exited');

        expect(mockConsoleError).toHaveBeenCalledWith('FATAL: JWT_SECRET environment variable is not set.');
        expect(mockExit).toHaveBeenCalledWith(1);

        mockExit.mockRestore();
        mockConsoleError.mockRestore();
    });

    it('should start successfully if JWT_SECRET is present', () => {
        process.env.JWT_SECRET = 'valid-secret';

        // Mock console.log to avoid noise
        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

        const app = require('../server');
        expect(typeof app).toBe('function');

        mockConsoleLog.mockRestore();
    });
});
