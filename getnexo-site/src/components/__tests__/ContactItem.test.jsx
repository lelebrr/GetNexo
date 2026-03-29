import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock socket.io-client
jest.mock('socket.io-client', () => {
    return {
        io: jest.fn(() => ({
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        })),
    };
});

// Import the component (assuming I export it)
import { ContactItem } from '../ChatInterface';

describe('ContactItem', () => {
    const mockContact = {
        name: 'John Doe',
        phone: '123456789',
        last_message: { body: 'Hello' },
        stage: 'NEW'
    };
    const mockOnClick = jest.fn();
    const mockOnDragStart = jest.fn();

    it('renders as a button', () => {
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
    });

    it('displays contact name and last message', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledWith(mockContact);
    });

    it('has aria-selected="true" when active', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={true}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );
        expect(screen.getByRole('button')).toHaveAttribute('aria-selected', 'true');
    });

    it('has aria-selected="false" when not active', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );
        // Note: aria-selected="false" might not be strictly present if false, or might be "false" string.
        // Usually boolean attribute renders as string "false" or "true".
        expect(screen.getByRole('button')).toHaveAttribute('aria-selected', 'false');
    });
});
