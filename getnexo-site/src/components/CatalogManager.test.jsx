import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogManager from './CatalogManager';

// Mock fetch
global.fetch = jest.fn();
global.alert = jest.fn();

const mockProducts = [
    { id: 1, name: 'Produto Teste', price: 100.0, image_url: 'http://example.com/img.png' }
];

describe('CatalogManager UX Improvements', () => {
    beforeEach(() => {
        fetch.mockClear();
        fetch.mockResolvedValue({
            json: async () => ({ products: mockProducts })
        });
    });

    test('renders product image with accessible alt text', async () => {
        render(<CatalogManager />);

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Produto Teste')).toBeInTheDocument();
        });

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Produto Teste');
    });

    test('phone input has accessible label', async () => {
        render(<CatalogManager />);

        // Use getByLabelText to verify association
        const input = screen.getByLabelText(/Cliente \(WhatsApp\)/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'client-phone');
    });

    test('shows loading state when creating order', async () => {
        render(<CatalogManager />);

        // Load products
        await waitFor(() => screen.getByText('Produto Teste'));

        // Add to cart
        fireEvent.click(screen.getByText('+ Adicionar'));

        // Fill phone
        const input = screen.getByRole('textbox'); // Fallback if label lookup fails initially
        fireEvent.change(input, { target: { value: '5511999999999' } });

        // Mock slow API response
        fetch.mockImplementationOnce(async (url) => {
            if (url.includes('/catalog')) return { json: async () => ({ products: mockProducts }) };
            if (url.includes('/create-order')) {
                await new Promise(r => setTimeout(r, 100)); // Delay
                return { json: async () => ({ success: true }) };
            }
        });

        // Click generate
        const button = screen.getByText(/GERAR PIX/i);
        fireEvent.click(button);

        // Check for loading state immediately after click
        expect(button).toBeDisabled();
        expect(screen.getByText(/Gerando...|Aguarde/i)).toBeInTheDocument();

        // Wait for finish
        await waitFor(() => expect(alert).toHaveBeenCalled());
        expect(button).not.toBeDisabled();
    });

    test('allows removing items from cart', async () => {
        render(<CatalogManager />);
        await waitFor(() => screen.getByText('Produto Teste'));

        // Add to cart twice
        const addBtn = screen.getByText('+ Adicionar');
        fireEvent.click(addBtn);
        fireEvent.click(addBtn);

        expect(screen.getByText('R$ 200.00')).toBeInTheDocument(); // Total

        // Find remove buttons (assuming aria-label="Remover item")
        const removeButtons = screen.getAllByRole('button', { name: /remover/i });
        expect(removeButtons.length).toBe(2);

        // Remove one
        fireEvent.click(removeButtons[0]);

        // Should find multiple "R$ 100.00" (item price and total)
        expect(screen.getAllByText('R$ 100.00').length).toBeGreaterThan(0);

        // Verify cart is length 1
        expect(screen.getAllByText('Produto Teste').length).toBe(2); // 1 in catalog, 1 in cart
    });
});
