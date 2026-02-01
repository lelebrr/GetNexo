
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from '../ChatInterface';
import axios from 'axios';
import { io } from 'socket.io-client';

// Mock dependencies
jest.mock('axios');
jest.mock('socket.io-client', () => ({
    io: jest.fn(() => ({
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    })),
}));

jest.mock('../OrderBuilder', () => () => <div data-testid="order-builder">OrderBuilder</div>);
jest.mock('../MeetingScheduler', () => () => <div data-testid="meeting-scheduler">MeetingScheduler</div>);

describe('ChatInterface', () => {
    beforeEach(() => {
        // Clear mocks if needed, though the socket mock is static in this setup
        axios.get.mockResolvedValue({ data: [] });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(<ChatInterface />);
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    test('renders contacts from API', async () => {
        const mockContacts = [
            { id: 1, name: 'Alice', phone: '1234567890', stage: 'LEAD', last_message: { body: 'Hello' } },
            { id: 2, name: 'Bob', phone: '0987654321', stage: 'CUSTOMER', last_message: { body: 'Hi' } }
        ];
        axios.get.mockImplementation((url) => {
            if (url.includes('/contacts')) return Promise.resolve({ data: mockContacts });
            return Promise.resolve({ data: [] });
        });

        render(<ChatInterface />);

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });
});
