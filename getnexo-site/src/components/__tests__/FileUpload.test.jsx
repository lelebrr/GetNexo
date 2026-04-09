import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = jest.fn();

describe('FileUpload Component', () => {
    beforeEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
        fetch.mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({ files: [] }),
                ok: true,
            })
        );
    });

    test('renders without crashing', () => {
        render(<FileUpload />);
        expect(screen.getByText(/Upload de Arquivos/i)).toBeInTheDocument();
    });

    test('renders files from API in grid view with accessible actions', async () => {
        // Set token so fetchFiles is called
        window.localStorage.setItem('omnichat_token', 'test-token');

        const mockFiles = [
            { name: 'test-image.jpg', url: 'http://example.com/test-image.jpg', size: 1024, createdAt: new Date().toISOString() }
        ];

        fetch.mockImplementation((url) => {
             if (url.includes('/api/upload')) {
                return Promise.resolve({
                    json: () => Promise.resolve({ files: mockFiles }),
                    ok: true,
                });
             }
             return Promise.resolve({ ok: false });
        });

        render(<FileUpload />);

        // Wait for files to load
        await waitFor(() => {
            expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
        });

        // This assertion should fail initially because aria-labels are missing
        const viewButton = screen.getByLabelText(/Visualizar test-image.jpg/i);
        expect(viewButton).toBeInTheDocument();

        const deleteButton = screen.getByLabelText(/Deletar test-image.jpg/i);
        expect(deleteButton).toBeInTheDocument();

        // Check for focus-within class on the container
        const container = viewButton.closest('div');
        expect(container).toHaveClass('focus-within:opacity-100');
    });
});
