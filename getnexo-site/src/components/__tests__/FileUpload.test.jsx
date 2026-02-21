import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ files: [] }),
    ok: true,
  })
);

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
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('omnichat_token', 'fake-token');
  });

  test('renders upload area with correct accessibility attributes', () => {
    render(<FileUpload />);
    const uploadArea = screen.getByLabelText(/Área de upload de arquivos/i);
    expect(uploadArea).toBeInTheDocument();
    expect(uploadArea).toHaveAttribute('role', 'button');
    expect(uploadArea).toHaveAttribute('tabIndex', '0');
  });

  test('renders uploaded files in grid view with accessible actions', async () => {
    const mockFiles = [
      { name: 'test-image.jpg', url: 'http://example.com/test-image.jpg', size: 1024, createdAt: new Date().toISOString() }
    ];

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ files: mockFiles }),
        ok: true,
      })
    );

    render(<FileUpload />);

    // Wait for files to load
    await waitFor(() => {
      expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    });

    // Check for "View" and "Delete" actions by ARIA label
    const viewButton = screen.getByLabelText('Visualizar arquivo');
    const deleteButton = screen.getByLabelText('Deletar arquivo');

    expect(viewButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Verify link attributes
    expect(viewButton.closest('a')).toHaveAttribute('href', 'http://example.com/test-image.jpg');
    expect(viewButton.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('shows and hides clear search button', () => {
    render(<FileUpload />);

    const searchInput = screen.getByLabelText('Buscar arquivos');

    // Type in search
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByLabelText('Limpar busca');
    expect(clearButton).toBeInTheDocument();

    // Click clear
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByLabelText('Limpar busca')).not.toBeInTheDocument();
  });
});
