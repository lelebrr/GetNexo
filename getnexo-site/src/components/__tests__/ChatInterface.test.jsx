import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock socket.io-client before importing the component
jest.mock('socket.io-client', () => ({
    io: jest.fn(() => ({
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    })),
}));

// Mock axios
jest.mock('axios');

import { ContactItem } from '../ChatInterface';

describe('ContactItem', () => {
    const mockContact = {
        id: 1,
        name: 'Test User',
        phone: '123456789',
        last_message: { body: 'Hello' },
        stage: 'lead'
    };
    const mockOnClick = jest.fn();
    const mockOnDragStart = jest.fn();

    it('renders contact information correctly', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('lead')).toBeInTheDocument();
    });

    it('should be an accessible button', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledWith(mockContact);
    });
});
