import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage if not already mocked by setup.js
const localStorageMock = {
    getItem: jest.fn(() => 'fake-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});

const mockFiles = {
    files: [
        {
            name: 'test-image.jpg',
            url: 'http://example.com/test-image.jpg',
            size: 1024 * 1024, // 1MB
            createdAt: new Date().toISOString()
        }
    ]
};

describe('FileUpload Accessibility', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockFiles
        });
    });

    it('renders files and has accessible buttons in grid view', async () => {
        render(<FileUpload />);

        // Wait for file to load
        await waitFor(() => {
            expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
        });

        // Check for accessible View link
        // Expect failure initially as aria-label is missing
        const viewLink = screen.getByRole('link', { name: /visualizar test-image.jpg/i });
        expect(viewLink).toBeInTheDocument();
        expect(viewLink).toHaveAttribute('href', 'http://example.com/test-image.jpg');

        // Check for accessible Delete button
        // Expect failure initially as aria-label is missing
        const deleteButton = screen.getByRole('button', { name: /deletar test-image.jpg/i });
        expect(deleteButton).toBeInTheDocument();

        // Check for keyboard accessibility class on parent container
        // The parent of the link/button should have group-focus-within:opacity-100
        const actionsContainer = viewLink.parentElement;
        expect(actionsContainer).toHaveClass('group-focus-within:opacity-100');
    });
});
