import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentimentIndicator from '../SentimentIndicator';

// Mock de setTimeout
jest.useFakeTimers();

describe('SentimentIndicator', () => {
    beforeEach(() => {
        jest.clearAllTimers();
    });

    test('renders with positive score', () => {
        render(<SentimentIndicator score={8} />);

        const emoji = screen.getByText('😊');
        expect(emoji).toBeInTheDocument();

        const badge = screen.getByText('8');
        expect(badge).toBeInTheDocument();
    });

    test('renders with negative score', () => {
        render(<SentimentIndicator score={2} />);

        const emoji = screen.getByText('😡');
        expect(emoji).toBeInTheDocument();

        const badge = screen.getByText('2');
        expect(badge).toBeInTheDocument();
    });

    test('renders with neutral score', () => {
        render(<SentimentIndicator score={5} />);

        const emoji = screen.getByText('😐');
        expect(emoji).toBeInTheDocument();

        const badge = screen.getByText('5');
        expect(badge).toBeInTheDocument();
    });

    test('renders with very positive score', () => {
        render(<SentimentIndicator score={9} />);

        const emoji = screen.getByText('🤩');
        expect(emoji).toBeInTheDocument();

        const badge = screen.getByText('9');
        expect(badge).toBeInTheDocument();
    });

    test('shows alert indicator for extreme scores', () => {
        const { container } = render(<SentimentIndicator score={1} />);
        const alertIndicator = container.querySelector('div > div:last-child');
        expect(alertIndicator).toHaveClass('animate-pulse');
    });

    test('hides badge when showBadge is false', () => {
        render(<SentimentIndicator score={8} showBadge={false} />);

        const emoji = screen.getByText('😊');
        expect(emoji).toBeInTheDocument();

        const badge = screen.queryByText('8');
        expect(badge).not.toBeInTheDocument();
    });

    test('shows tooltip on hover when showTooltip is true', () => {
        render(<SentimentIndicator score={8} showTooltip={true} />);

        const container = screen.getByTitle('Positivo (8/10)');
        expect(container).toBeInTheDocument();

        fireEvent.mouseEnter(container);

        // Fast-forward timers to trigger animation
        jest.advanceTimersByTime(100);

        // The detailed tooltip should appear (but we can't easily test the positioning)
        // This is a basic test to ensure no errors occur
        expect(container).toBeInTheDocument();
    });

    test('does not show tooltip when showTooltip is false', () => {
        render(<SentimentIndicator score={8} showTooltip={false} />);

        const container = screen.queryByTitle('Positivo (8/10)');
        expect(container).not.toBeInTheDocument();
    });

    test('renders with small size', () => {
        render(<SentimentIndicator score={8} size="small" />);

        const container = screen.getByText('😊').closest('div');
        expect(container).toHaveClass('w-6', 'h-6', 'text-sm');
    });

    test('renders with medium size', () => {
        render(<SentimentIndicator score={8} size="medium" />);

        const container = screen.getByText('😊').closest('div');
        expect(container).toHaveClass('w-8', 'h-8', 'text-lg');
    });

    test('renders with large size', () => {
        render(<SentimentIndicator score={8} size="large" />);

        const container = screen.getByText('😊').closest('div');
        expect(container).toHaveClass('w-12', 'h-12', 'text-2xl');
    });

    test('uses default props when not provided', () => {
        render(<SentimentIndicator />);

        const emoji = screen.getByText('😐');
        expect(emoji).toBeInTheDocument();

        const badge = screen.getByText('5');
        expect(badge).toBeInTheDocument();
    });

    test('applies correct colors for different scores', () => {
        const { rerender } = render(<SentimentIndicator score={2} />);

        // For score 2 (negative), should have red color
        let container = screen.getByText('😡').closest('div');
        expect(container).toHaveStyle({ backgroundColor: '#ef444415' });

        rerender(<SentimentIndicator score={9} />);
        // For score 9 (very positive), should have green color
        container = screen.getByText('🤩').closest('div');
        expect(container).toHaveStyle({ backgroundColor: '#10b98115' });
    });

    test('handles custom sentiment and category', () => {
        render(
            <SentimentIndicator
                score={7}
                sentiment="positive"
                category="satisfacao"
                confidence={0.85}
            />
        );

        const emoji = screen.getByText('😊');
        expect(emoji).toBeInTheDocument();

        const badge = screen.getByText('7');
        expect(badge).toBeInTheDocument();
    });

    test('has correct accessibility attributes', () => {
        render(<SentimentIndicator score={8} showTooltip={true} />);

        const container = screen.getByTitle('Positivo (8/10)');
        expect(container).toHaveAttribute('title', 'Positivo (8/10)');
    });

    test('animates on mount', () => {
        render(<SentimentIndicator score={8} />);

        const container = screen.getByText('😊').closest('div');
        expect(container).toHaveClass('opacity-0');

        // Fast-forward timers
        jest.advanceTimersByTime(100);

        expect(container).toHaveClass('animate-fade-in');
    });
});
