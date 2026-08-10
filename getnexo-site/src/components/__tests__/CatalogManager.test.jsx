import React from 'react';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CatalogManager from '../CatalogManager';

// Mock fetch
global.fetch = jest.fn();

// Mock alert
global.alert = jest.fn();

const mockProducts = [
    { id: 1, name: 'Produto Teste 1', price: 100.00, image_url: 'http://example.com/img1.jpg' },
    { id: 2, name: 'Produto Teste 2', price: 200.00, image_url: 'http://example.com/img2.jpg' }
];

describe('CatalogManager Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue({ products: mockProducts })
        });
    });

    test('renders products from API', async () => {
        await act(async () => {
            render(<CatalogManager />);
        });

        await waitFor(() => {
            expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
            expect(screen.getByText('Produto Teste 2')).toBeInTheDocument();
        });
    });

    test('updates target phone input', async () => {
        await act(async () => {
            render(<CatalogManager />);
        });

        const phoneInput = screen.getByPlaceholderText('5511999999999');
        fireEvent.change(phoneInput, { target: { value: '5511988887777' } });

        expect(phoneInput.value).toBe('5511988887777');
    });

    test('adds product to cart', async () => {
         await act(async () => {
            render(<CatalogManager />);
        });

        await waitFor(() => {
            expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
        });

        // Click the first "Adicionar" button
        const addButtons = screen.getAllByText('+ Adicionar');
        fireEvent.click(addButtons[0]);

        // Find the cart section
        const cartHeader = screen.getByText('🛒 Novo Pedido');
        const cartContainer = cartHeader.closest('.glass-panel'); // Assuming structure

        // Verify item is in cart
        // We can look for the text "Produto Teste 1" inside the cart container
        // Note: "Produto Teste 1" is also in the main grid, so we must scope the search.
        const cartProduct = within(cartContainer).getByText('Produto Teste 1');
        expect(cartProduct).toBeInTheDocument();

        // Verify total
        // Total should be 100.00. The structure is <span>Total:</span> <span class="text-neon-green">R$ 100.00</span>
        const totalLabel = within(cartContainer).getByText('Total:');
        const totalValue = totalLabel.nextSibling;
        expect(totalValue).toHaveTextContent('R$ 100.00');
    });
});
