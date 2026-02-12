import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key];
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('FileUpload Component', () => {
    beforeEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    test('renders uploaded files and checks for accessibility labels', async () => {
        // Setup mock data
        const mockFiles = [
            {
                name: 'test-image.jpg',
                url: 'https://example.com/test-image.jpg',
                size: 1024 * 1024, // 1MB
                createdAt: new Date().toISOString()
            }
        ];

        // Mock fetch response for GET /api/upload
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ files: mockFiles })
        });

        // Set token
        window.localStorage.setItem('omnichat_token', 'fake-token');

        render(<FileUpload />);

        // Wait for files to be loaded
        await waitFor(() => {
            expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
        });

        // Check for accessibility labels
        const viewButton = screen.getByLabelText('Visualizar arquivo test-image.jpg');
        const deleteButton = screen.getByLabelText('Deletar arquivo test-image.jpg');

        expect(viewButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();

        // Check for title attribute
        expect(viewButton).toHaveAttribute('title', 'Visualizar arquivo test-image.jpg');
        expect(deleteButton).toHaveAttribute('title', 'Deletar arquivo test-image.jpg');
    });
});
