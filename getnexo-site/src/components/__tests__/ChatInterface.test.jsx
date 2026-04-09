import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ChatInterface from '../ChatInterface';
import axios from 'axios';
import { io } from 'socket.io-client';

// Mocks
jest.mock('axios');
jest.mock('socket.io-client', () => {
    return {
        io: jest.fn(() => ({
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        }))
    };
});
jest.mock('../OrderBuilder', () => () => <div>OrderBuilder</div>);
jest.mock('../MeetingScheduler', () => () => <div>MeetingScheduler</div>);

// Mock window.HTMLElement.prototype.scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('ChatInterface Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mocks
        axios.get.mockResolvedValue({ data: [] });
    });

    test('renders contact list with accessible buttons', async () => {
        // Mock API responses
        const mockContacts = [
            { id: 1, name: 'Alice Smith', phone: '123456789', last_message: { body: 'Hello' }, stage: 'new' },
            { id: 2, name: 'Bob Jones', phone: '987654321', last_message: { body: 'Hi' }, stage: 'lead' },
        ];

        axios.get.mockImplementation((url) => {
            if (url.includes('/contacts')) {
                return Promise.resolve({ data: mockContacts });
            }
            return Promise.resolve({ data: [] });
        });

        render(<ChatInterface />);

        // Wait for contacts to load
        await waitFor(() => {
            expect(screen.getByText('Alice Smith')).toBeInTheDocument();
        });

        // Get the contact items
        // Since we want to assert they are buttons, we look for buttons containing the text
        // If they are divs, this will fail or return null depending on how we query
        const aliceContact = screen.getByText('Alice Smith').closest('button');
        const bobContact = screen.getByText('Bob Jones').closest('button');

        // These expectations should fail currently because they are divs
        expect(aliceContact).toBeInTheDocument();
        expect(aliceContact).toHaveAttribute('type', 'button');

        expect(bobContact).toBeInTheDocument();
        expect(bobContact).toHaveAttribute('type', 'button');
    });
});
