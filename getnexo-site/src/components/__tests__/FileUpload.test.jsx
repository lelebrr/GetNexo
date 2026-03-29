import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('FileUpload Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('omnichat_token', 'fake-token');
  });

  test('renders upload area', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ files: [] }),
    });

    render(<FileUpload />);

    expect(screen.getByText(/Upload de Arquivos/i)).toBeInTheDocument();
    expect(screen.getByText(/Arraste e solte ou clique para selecionar/i)).toBeInTheDocument();
  });

  test('renders uploaded files and checks accessibility of actions', async () => {
    const mockFiles = [
      { name: 'image1.jpg', url: 'http://example.com/image1.jpg', size: 1024, createdAt: new Date().toISOString() },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => ({ files: mockFiles }),
    });

    render(<FileUpload />);

    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('image1.jpg')).toBeInTheDocument();
    });

    // In Grid View (default)
    // The buttons should be present.
    // We want to verify they have accessible names.

    // We can try to find them by their expected accessible names.
    // If this fails, it means the fix is needed.
    const viewLink = screen.getByLabelText(/Ver arquivo image1.jpg/i);
    const deleteButton = screen.getByLabelText(/Deletar arquivo image1.jpg/i);

    expect(viewLink).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Check visibility logic (focus-within) is handled by CSS,
    // testing CSS classes is one way to verify.
    // The overlay container should have group-focus-within:opacity-100
    // We can find the overlay by navigating up from the button
    const overlay = deleteButton.parentElement;
    expect(overlay).toHaveClass('group-focus-within:opacity-100');
  });
});
