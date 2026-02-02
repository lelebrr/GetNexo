import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../OrderBuilder', () => () => <div data-testid="order-builder">OrderBuilder</div>);
jest.mock('../MeetingScheduler', () => () => <div data-testid="meeting-scheduler">MeetingScheduler</div>);

// Fix for socket.io-client mock hoisting issue
// We define the mock factory to return a structured object directly
jest.mock('socket.io-client', () => {
    return {
        io: jest.fn(() => ({
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        }))
    };
});

import ChatInterface from '../ChatInterface';

describe('ChatInterface', () => {
    beforeEach(() => {
        // Setup default mocks
        axios.get.mockResolvedValue({ data: [] });
        jest.clearAllMocks();

        localStorage.setItem('omnichat_user', JSON.stringify({ id: 1, name: 'Test User' }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        // Delay resolution to catch loading state
        let resolveContacts;
        const contactsPromise = new Promise(r => resolveContacts = r);
        axios.get.mockReturnValue(contactsPromise);

        render(<ChatInterface />);
        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        // Resolve to clean up
        resolveContacts({ data: [] });
        await waitFor(() => expect(screen.queryByText('Carregando...')).not.toBeInTheDocument());
    });

    it('renders empty state (currently empty) when no contacts returned', async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(<ChatInterface />);

        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
        });

        // Current behavior: if empty, it shows nothing in the list container.
        const contactItems = screen.queryAllByText(/NEW/);
        expect(contactItems).toHaveLength(0);

        // We expect this to be present now
        expect(screen.getByText('Nenhum contato encontrado.')).toBeInTheDocument();
    });

    it('renders contacts when returned', async () => {
        const mockContacts = [
            { id: 1, name: 'Alice', phone: '123', stage: 'NEW', last_message: { body: 'Hi' } }
        ];
        axios.get.mockResolvedValue({ data: mockContacts });

        render(<ChatInterface />);

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
        });
    });

    it('renders accessible elements', () => {
        // Prevent useEffect from resolving immediately to check loading state
        let resolve;
        axios.get.mockReturnValue(new Promise(r => resolve = r));

        render(<ChatInterface />);

        // Check for tablist
        expect(screen.getByRole('tablist', { name: /Filtros da caixa de entrada/i })).toBeInTheDocument();

        // Check for tabs
        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(3);
        // Default state is 'all' ('Todos')
        expect(tabs[1]).toHaveTextContent('Todos');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'false');

        // Check loading state aria-live
        const loading = screen.getByText('Carregando...');
        expect(loading).toHaveAttribute('aria-live', 'polite');

        // Clean up promise
        resolve({ data: [] });
    });
});
