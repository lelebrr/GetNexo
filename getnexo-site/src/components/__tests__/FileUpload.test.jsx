import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ files: [] }),
    ok: true,
  })
);

describe('FileUpload Component', () => {
  beforeEach(() => {
    window.localStorage.setItem('omnichat_token', 'fake-token');
    fetch.mockClear();
  });

  test('renders upload area', async () => {
    await act(async () => {
      render(<FileUpload />);
    });
    expect(screen.getByText(/Upload de Arquivos/i)).toBeInTheDocument();
    expect(screen.getByText(/Arraste e solte ou clique para selecionar/i)).toBeInTheDocument();
  });

  test('search input exists', async () => {
    await act(async () => {
      render(<FileUpload />);
    });
    expect(screen.getByPlaceholderText(/Buscar arquivos.../i)).toBeInTheDocument();
  });

  test('clears search input when clear button is clicked', async () => {
    await act(async () => {
      render(<FileUpload />);
    });

    const searchInput = screen.getByPlaceholderText(/Buscar arquivos.../i);

    // Type into search input
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput.value).toBe('test');

    // Find clear button
    const clearButton = screen.getByLabelText('Limpar busca');
    expect(clearButton).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearButton);

    // Assert input is empty
    expect(searchInput.value).toBe('');

    // Assert clear button is gone
    expect(screen.queryByLabelText('Limpar busca')).not.toBeInTheDocument();
  });
});
