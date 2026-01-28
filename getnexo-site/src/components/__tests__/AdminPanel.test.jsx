
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminPanel from '../AdminPanel';
import '@testing-library/jest-dom';

// Mocking fetch for stats
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            open_tickets: 10,
            csat: 4.5,
            sales: 1000.5,
            tickets: 50,
            storage: '100 MB',
            apiCalls: 500
        }),
    })
);

describe('AdminPanel', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders AdminPanel and switches sections', async () => {
        render(<AdminPanel />);

        // Check if initial section (Home) is rendered
        expect(screen.getByText('Central de Administração')).toBeInTheDocument();

        // Switch to Channels
        const channelsBtn = screen.getByRole('button', { name: /Canais/i });
        fireEvent.click(channelsBtn);
        expect(screen.getByText('Canais de Atendimento')).toBeInTheDocument();

        // Switch to Marketing
        const marketingBtn = screen.getByRole('button', { name: /Marketing & Analytics/i });
        fireEvent.click(marketingBtn);
        expect(screen.getByText('Marketing & Analytics')).toBeInTheDocument();
    });

    test('Marketing tools display data without direct DOM manipulation', async () => {
        // This is more of a smoke test to ensure clicking doesn't crash
        render(<AdminPanel />);

        const marketingBtn = screen.getByRole('button', { name: /Marketing & Analytics/i });
        fireEvent.click(marketingBtn);

        // Click Retargeting sub-menu (if visible)
        const retargetBtn = screen.getByText('Retargeting');
        fireEvent.click(retargetBtn);
        expect(screen.getByText('Retargeting Automático')).toBeInTheDocument();
    });
});
