export default {
    preset: null,
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.(js|jsx|ts|tsx)', '**/?(*.)+(spec|test).(js|jsx|ts|tsx)'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'astro'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                ['@babel/preset-react', { runtime: 'automatic' }]
            ]
        }]
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@layouts/(.*)$': '<rootDir>/src/layouts/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
    testTimeout: 10000,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    transformIgnorePatterns: [
        '/node_modules/(?!(@testing-library|lucide-react)/)'
    ]
};