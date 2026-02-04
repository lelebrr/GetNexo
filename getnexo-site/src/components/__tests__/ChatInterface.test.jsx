import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactItem } from '../ChatInterface';
import '@testing-library/jest-dom';

// Mock dependencies because ChatInterface imports them at top level
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

describe('ContactItem', () => {
    const mockContact = {
        id: '1',
        name: 'John Doe',
        phone: '1234567890',
        stage: 'lead',
        last_message: { body: 'Hello' }
    };
    const mockOnClick = jest.fn();
    const mockOnDragStart = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders as a button', () => {
        render(<ContactItem contact={mockContact} isActive={false} onClick={mockOnClick} onDragStart={mockOnDragStart} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
    });

    it('displays contact information', () => {
        render(<ContactItem contact={mockContact} isActive={false} onClick={mockOnClick} onDragStart={mockOnDragStart} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('lead')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('has aria-selected="true" when active', () => {
        render(<ContactItem contact={mockContact} isActive={true} onClick={mockOnClick} onDragStart={mockOnDragStart} />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-selected', 'true');
    });

    it('has aria-selected="false" when inactive', () => {
        render(<ContactItem contact={mockContact} isActive={false} onClick={mockOnClick} onDragStart={mockOnDragStart} />);
        const button = screen.getByRole('button');
        // React renders boolean false as "false" for aria attributes
        expect(button).toHaveAttribute('aria-selected', 'false');
    });

    it('calls onClick when clicked', () => {
        render(<ContactItem contact={mockContact} isActive={false} onClick={mockOnClick} onDragStart={mockOnDragStart} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockOnClick).toHaveBeenCalledWith(mockContact);
    });
});
