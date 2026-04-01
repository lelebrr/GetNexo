module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!jest.config.js',
        '!**/integrations/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testTimeout: 10000,
    verbose: true,
    transformIgnorePatterns: [
        'node_modules/(?!(@anthropic-ai|otplib)/)'
    ],
    moduleNameMapper: {
        '^google-spreadsheet$': '<rootDir>/tests/mocks/google-spreadsheet.js',
        '^googleapis$': '<rootDir>/tests/mocks/googleapis.js',
        '^better-sqlite3$': '<rootDir>/tests/mocks/better-sqlite3.js',
        '^bcryptjs$': '<rootDir>/tests/mocks/bcryptjs.js'
    }
};