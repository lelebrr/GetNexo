import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock socket.io-client BEFORE importing the component
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  })),
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Import the component after mocking
import { ContactItem } from '../ChatInterface';

describe('ContactItem', () => {
  const mockContact = {
    id: 1,
    name: 'John Doe',
    phone: '1234567890',
    stage: 'Lead',
    last_message: { body: 'Hello' }
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
    expect(button).toHaveAttribute('type', 'button');
  });

  it('displays contact information correctly', () => {
    render(
      <ContactItem
        contact={mockContact}
        isActive={false}
        onClick={mockOnClick}
        onDragStart={mockOnDragStart}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Lead')).toBeInTheDocument();
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

  it('has aria-current="true" when active', () => {
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

  it('does not have aria-current when inactive', () => {
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
});
