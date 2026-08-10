import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ files: [] }),
        ok: true,
    })
);

describe('FileUpload Component', () => {
    beforeEach(() => {
        window.localStorage.setItem('omnichat_token', 'test-token');
        fetch.mockClear();
    });

    test('renders file upload area', () => {
        render(<FileUpload />);
        expect(screen.getByText(/Upload de Arquivos/i)).toBeInTheDocument();
        expect(screen.getByText(/Arraste e solte ou clique para selecionar/i)).toBeInTheDocument();
    });

    test('renders grid view buttons with accessibility attributes', async () => {
        // Mock files response
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    files: [
                        { name: 'test-image.jpg', url: 'http://example.com/test-image.jpg', size: 1024, createdAt: new Date().toISOString() }
                    ]
                }),
                ok: true,
            })
        );

        render(<FileUpload />);

        // Wait for files to load
        await waitFor(() => {
            expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
        });

        // Check for aria-labels on buttons (which are currently missing, so this test might fail or I should write it to expect failure then fix)
        // Since I haven't implemented the fix yet, I expect this to fail if I assert presence of aria-labels.
        // But for TDD, I will write the test to expect the correct behavior.

        const viewButton = screen.getByRole('link', { name: /Visualizar arquivo/i }); // Proposed aria-label
        const deleteButton = screen.getByRole('button', { name: /Deletar arquivo/i }); // Proposed aria-label

        expect(viewButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();

        // Check focus-within class on container (checking class might be brittle, but checking behavior is hard)
        // I'll check if the parent container has the focus-within class
        // const container = viewButton.closest('.group');
        // expect(container).toHaveClass('focus-within:opacity-100');
    });
});
