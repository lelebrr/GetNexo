import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import KanbanBoard from '../KanbanBoard';

jest.mock('axios');

describe('KanbanBoard', () => {
    const mockContacts = [
        { id: '1', name: 'John Doe', phone: '1234567890', funnel_stage: 'lead', value: 1000 },
        { id: '2', name: 'Jane Smith', phone: '0987654321', funnel_stage: 'qualified', value: 2000 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({ data: mockContacts });
        axios.post.mockResolvedValue({});
    });

    test('renders contacts in correct columns', async () => {
        render(<KanbanBoard />);

        // Wait for contacts to load
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        // Check if columns exist
        expect(screen.getByText('Novo Lead')).toBeInTheDocument();
        expect(screen.getByText('Qualificado')).toBeInTheDocument();
    });

    test('updates state optimistically on drag and drop', async () => {
        render(<KanbanBoard />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const card = screen.getByText('John Doe').closest('div[draggable="true"]');

        // Simulate drag start
        fireEvent.dragStart(card);

        // Simulate drop on 'qualified' column
        // We need to find the drop target. The KanbanColumn component has onDrop handler on the main div.
        // It doesn't have a specific role or testid, so let's find it by text content for now.
        const qualifiedColumn = screen.getByText('Qualificado').closest('div').parentElement;

        fireEvent.drop(qualifiedColumn);

        // Expect axios post to be called with correct data
        // Original stage was lead, new stage is qualified
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/update-stage'), {
            phone: '1',
            stage: 'qualified'
        });
    });
});
