import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../FileUpload';

// Mock fetch
const mockFiles = [
    {
        name: 'test-image.jpg',
        url: 'http://example.com/test-image.jpg',
        size: 1024 * 1024,
        type: 'image/jpeg',
        createdAt: new Date().toISOString()
    }
];

beforeEach(() => {
    fetch.mockImplementation((url) => {
        if (url === '/api/upload') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ files: mockFiles }),
            });
        }
        return Promise.reject(new Error('not found'));
    });
    localStorage.setItem('omnichat_token', 'fake-token');
});

test('FileUpload has accessible labels and clear search functionality', async () => {
    render(<FileUpload />);

    // Wait for files to load
    await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    });

    // Verify accessible labels for grid actions
    const viewButton = screen.getByLabelText('Visualizar test-image.jpg');
    expect(viewButton).toBeInTheDocument();
    expect(viewButton).toHaveAttribute('href', 'http://example.com/test-image.jpg');
    expect(viewButton).toHaveAttribute('rel', 'noopener noreferrer');

    const deleteButton = screen.getByLabelText('Excluir test-image.jpg');
    expect(deleteButton).toBeInTheDocument();

    // Verify clear search button functionality
    const searchInput = screen.getByPlaceholderText('Buscar arquivos...');

    // Type in search
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput.value).toBe('test');

    // Clear button should appear
    const clearButton = screen.getByLabelText('Limpar busca');
    expect(clearButton).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearButton);

    // Search input should be empty and clear button should disappear
    expect(searchInput.value).toBe('');
    expect(screen.queryByLabelText('Limpar busca')).not.toBeInTheDocument();
});
