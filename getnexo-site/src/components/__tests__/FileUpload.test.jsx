import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FileUpload from '../FileUpload';
import '@testing-library/jest-dom';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mock-token'),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      files: [
        { name: 'test-image.png', url: 'http://example.com/test-image.png', size: 1024, createdAt: new Date().toISOString() },
        { name: 'test-doc.pdf', url: 'http://example.com/test-doc.pdf', size: 2048, createdAt: new Date().toISOString() }
      ]
    }),
    ok: true
  })
);

describe('FileUpload Component', () => {
  test('renders files in grid view and has accessible actions', async () => {
    render(<FileUpload />);

    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('test-image.png')).toBeInTheDocument();
    });

    // Check for View and Delete buttons
    const viewButtons = screen.getAllByText('👁️');
    const deleteButtons = screen.getAllByText('🗑️');

    expect(viewButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);

    // Assert that they have aria-labels
    expect(viewButtons[0]).toHaveAttribute('aria-label', 'Visualizar test-image.png');
    expect(deleteButtons[0]).toHaveAttribute('aria-label', 'Excluir test-image.png');

    // Check for focus visibility class on the overlay container
    const overlay = viewButtons[0].closest('div');
    expect(overlay).toHaveClass('group-focus-within:opacity-100');
  });
});
