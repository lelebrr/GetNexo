import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock fetch globally
global.fetch = jest.fn();

describe('FileUpload Component Accessibility', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Storage.prototype.getItem = jest.fn(() => 'mock-token');

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                files: [
                    {
                        name: 'image.png',
                        url: 'http://example.com/image.png',
                        size: 1024 * 1024,
                        createdAt: new Date().toISOString()
                    }
                ]
            })
        });
    });

    test('grid view items have accessible names and focus visibility', async () => {
        render(<FileUpload />);

        await waitFor(() => {
            expect(screen.getByText('image.png')).toBeInTheDocument();
        });

        // The following assertions are expected to fail before the fix

        // 1. Check for accessible names on "Ver" (View) link
        // Currently it has no text (only emoji) and no aria-label
        const viewLink = screen.queryByRole('link', { name: /ver image.png/i });
        // We use queryByRole to check existence without throwing immediately if we want to assert explicitly
        // But getByRole is better if we expect it to be there.
        // Since we expect it to FAIL, let's use getByRole inside a try-catch or just let it fail the test runner.

        // For the purpose of the plan, I will use getByRole so the test fails if it's missing.
        expect(screen.getByRole('link', { name: /ver image.png/i })).toBeInTheDocument();

        // 2. Check for accessible names on "Deletar" (Delete) button
        expect(screen.getByRole('button', { name: /deletar image.png/i })).toBeInTheDocument();

        // 3. Check for focus visibility class on the overlay
        const link = screen.getByRole('link', { name: /ver image.png/i });
        const overlay = link.closest('div.absolute');
        expect(overlay).toHaveClass('group-focus-within:opacity-100');
    });

    test('list view items have accessible names', async () => {
        render(<FileUpload />);

        await waitFor(() => {
            expect(screen.getByText('image.png')).toBeInTheDocument();
        });

        // Switch to list view
        const listViewButton = screen.getByRole('button', { name: /visualização em lista/i });
        fireEvent.click(listViewButton);

        // Check for accessible names in list view
        expect(screen.getByRole('link', { name: /ver image.png/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /deletar image.png/i })).toBeInTheDocument();
    });
});
