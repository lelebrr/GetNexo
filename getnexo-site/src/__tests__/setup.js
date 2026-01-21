// Setup file for Jest tests in Astro/React
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock crypto for WebAuthn
Object.defineProperty(window, 'crypto', {
    value: {
        getRandomValues: jest.fn().mockReturnValue(new Uint8Array(32)),
        subtle: {
            digest: jest.fn(),
            generateKey: jest.fn(),
            importKey: jest.fn(),
            encrypt: jest.fn(),
            decrypt: jest.fn(),
            sign: jest.fn(),
            verify: jest.fn(),
        },
    },
});

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1,
}));

// Cleanup after each test
afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
});