import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('FileUpload Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('omnichat_token', 'fake-token');
    global.fetch = jest.fn();
  });

  test('renders file list and checks for accessibility attributes', async () => {
    const mockFiles = [
      {
        name: 'test-image.png',
        url: 'http://example.com/test-image.png',
        size: 1024 * 1024, // 1MB
        createdAt: new Date().toISOString()
      }
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ files: mockFiles })
    });

    render(<FileUpload />);

    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('test-image.png')).toBeInTheDocument();
    });

    // Check Grid View (default)
    const image = screen.getByAltText('test-image.png');
    // The overlay should have the focus-within class for accessibility
    const overlay = image.closest('.group').querySelector('.absolute.inset-0');
    expect(overlay).toHaveClass('group-focus-within:opacity-100');

    // Check ARIA labels on Grid View buttons
    const viewLink = screen.getByRole('link', { name: 'Visualizar test-image.png' });
    const deleteBtn = screen.getByRole('button', { name: 'Deletar test-image.png' });

    expect(viewLink).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();

    // Switch to List View
    const listBtn = screen.getByLabelText('Visualização em Lista');
    fireEvent.click(listBtn);

    // Check List View Delete Button
    const listDeleteBtn = screen.getByRole('button', { name: 'Deletar test-image.png' });
    expect(listDeleteBtn).toBeInTheDocument();
  });
});
