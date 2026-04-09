import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock socket.io-client before importing the component
jest.mock('socket.io-client', () => {
  return {
    io: jest.fn(() => ({
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    })),
  };
});

// Mock child components to simplify testing
jest.mock('../OrderBuilder', () => () => <div data-testid="order-builder" />);
jest.mock('../MeetingScheduler', () => () => <div data-testid="meeting-scheduler" />);

// Import ContactItem - note: we exported it!
import { ContactItem } from '../ChatInterface';

describe('ContactItem', () => {
    const mockContact = {
        id: '123',
        name: 'Test User',
        phone: '5511999999999',
        stage: 'LEAD',
        last_message: { body: 'Hello' }
    };
    const mockOnClick = jest.fn();
    const mockOnDragStart = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders as a button', () => {
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
        expect(button).toHaveAttribute('type', 'button');
    });

    test('displays contact information', () => {
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

    test('calls onClick when clicked', () => {
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

    test('has aria-current when active', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={true}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-current', 'true');
    });

    test('has correct styling classes', () => {
        render(
            <ContactItem
                contact={mockContact}
                isActive={false}
                onClick={mockOnClick}
                onDragStart={mockOnDragStart}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-full', 'text-left');
    });
});
