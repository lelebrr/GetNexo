import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock child components
jest.mock('../OrderBuilder', () => () => <div data-testid="OrderBuilder" />);
jest.mock('../MeetingScheduler', () => () => <div data-testid="MeetingScheduler" />);

// Mock socket.io BEFORE importing ChatInterface
// Note: We cannot refer to variables outside the factory because of hoisting.
jest.mock('socket.io-client', () => ({
    io: jest.fn(() => ({
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    }))
}));

// Mock axios
jest.mock('axios');

// Import component AFTER mocking
import ChatInterface from '../ChatInterface';

describe('ChatInterface', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default axios mock for contacts
        axios.get.mockImplementation((url) => {
            if (url.includes('/contacts')) {
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Alice', phone: '123456789', last_message: { body: 'Hello' } },
                        { id: 2, name: 'Bob', phone: '987654321', last_message: { body: 'Hi' } }
                    ]
                });
            }
            if (url.includes('/macros')) return Promise.resolve({ data: [] });
            if (url.includes('/users')) return Promise.resolve({ data: [] });
            return Promise.resolve({ data: {} });
        });
    });

    test('renders contact list as accessible buttons', async () => {
        render(<ChatInterface />);

        // Wait for contacts to load
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
        });

        // Check if Alice is rendered as a button (accessible via keyboard)
        // This assertion will FAIL if the element is a div
        const aliceButton = screen.getByRole('button', { name: /Alice/i });
        expect(aliceButton).toBeInTheDocument();

        // Verify accessible attributes
        expect(aliceButton).toHaveAttribute('type', 'button');
    });
});
