import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactItem } from '../ChatInterface';

// Mock dependencies
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  })),
}));

jest.mock('axios');

describe('ContactItem', () => {
    const mockContact = {
        name: 'Test User',
        phone: '1234567890',
        stage: 'LEAD',
        last_message: { body: 'Hello' }
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
        expect(screen.getByText('LEAD')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('renders as an accessible button', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={true}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('aria-current', 'true');

        // Check for styling classes that indicate focus visibility
        expect(button).toHaveClass('focus:outline-none');
        expect(button).toHaveClass('focus:ring-2');
    });

    it('renders without aria-current when not active', () => {
         render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );
        const button = screen.getByRole('button');
        expect(button).not.toHaveAttribute('aria-current');
    });

    it('handles click events', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledWith(mockContact);
    });
});
