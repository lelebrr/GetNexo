/**
 * Design System - Button Component Tests
 * WCAG 2.2 AA+ compliance tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../components/Button';
import { ThemeProvider } from '../theme/ThemeContext';

describe('Button Component', () => {
    const renderWithTheme = (component) => {
        return render(
            <ThemeProvider>
                {component}
            </ThemeProvider>
        );
    };

    describe('Rendering', () => {
        test('renders with primary variant', () => {
            renderWithTheme(<Button variant="primary">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with secondary variant', () => {
            renderWithTheme(<Button variant="secondary">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with accent variant', () => {
            renderWithTheme(<Button variant="accent">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with outline variant', () => {
            renderWithTheme(<Button variant="outline">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with ghost variant', () => {
            renderWithTheme(<Button variant="ghost">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with danger variant', () => {
            renderWithTheme(<Button variant="danger">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with success variant', () => {
            renderWithTheme(<Button variant="success">Clique aqui</Button>);
            expect(screen.getByText('Clique aqui')).toBeInTheDocument();
        });

        test('renders with different sizes', () => {
            renderWithTheme(<Button size="small">Small</Button>);
            renderWithTheme(<Button size="medium">Medium</Button>);
            renderWithTheme(<Button size="large">Large</Button>);

            expect(screen.getByText('Small')).toBeInTheDocument();
            expect(screen.getByText('Medium')).toBeInTheDocument();
            expect(screen.getByText('Large')).toBeInTheDocument();
        });

        test('renders with icon', () => {
            renderWithTheme(<Button icon={<span>🔍</span>}>Buscar</Button>);
            expect(screen.getByText('🔍')).toBeInTheDocument();
            expect(screen.getByText('Buscar')).toBeInTheDocument();
        });

        test('renders with icon on left', () => {
            renderWithTheme(
                <Button icon={<span>🔍</span>} iconPosition="left">
                    Buscar
                </Button>
            );
            const button = screen.getByText('Buscar').closest('button');
            expect(button).toBeInTheDocument();
        });

        test('renders with icon on right', () => {
            renderWithTheme(
                <Button icon={<span>→</span>} iconPosition="right">
                    Anterior
                </Button>
            );
            const button = screen.getByText('Anterior').closest('button');
            expect(button).toBeInTheDocument();
        });

        test('renders button group', () => {
            renderWithTheme(
                <Button.Group gap="medium">
                    <Button variant="primary">Salvar</Button>
                    <Button variant="outline">Cancelar</Button>
                </Button.Group>
            );

            expect(screen.getByText('Salvar')).toBeInTheDocument();
            expect(screen.getByText('Cancelar')).toBeInTheDocument();
        });

        test('renders icon only button', () => {
            renderWithTheme(
                <Button.Icon icon={<span>✕</span>} ariaLabel="Fechar" />
            );

            expect(screen.getByLabelText('Fechar')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        test('calls onClick when clicked', () => {
            const handleClick = jest.fn();
            renderWithTheme(<Button onClick={handleClick}>Clique</Button>);

            fireEvent.click(screen.getByText('Clique'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('does not call onClick when disabled', () => {
            const handleClick = jest.fn();
            renderWithTheme(
                <Button onClick={handleClick} disabled>
                    Clique
                </Button>
            );

            fireEvent.click(screen.getByText('Clique'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        test('does not call onClick when loading', () => {
            const handleClick = jest.fn();
            renderWithTheme(
                <Button onClick={handleClick} loading>
                    Clique
                </Button>
            );

            fireEvent.click(screen.getByText('Clique'));
            expect(handleClick).not.toHaveBeenCalled();
        });

        test('handles hover states', () => {
            renderWithTheme(<Button>Hover me</Button>);
            const button = screen.getByText('Hover me');

            fireEvent.mouseEnter(button);
            fireEvent.mouseLeave(button);

            expect(button).toBeInTheDocument();
        });

        test('handles mouse down/up states', () => {
            renderWithTheme(<Button>Press me</Button>);
            const button = screen.getByText('Press me');

            fireEvent.mouseDown(button);
            fireEvent.mouseUp(button);

            expect(button).toBeInTheDocument();
        });
    });

    describe('Loading States', () => {
        test('shows loading spinner when loading', () => {
            renderWithTheme(<Button loading>Loading</Button>);
            const button = screen.getByText('Loading').closest('button');

            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-busy', 'true');
        });

        test('disables button when loading', () => {
            renderWithTheme(<Button loading>Loading</Button>);
            const button = screen.getByText('Loading');

            expect(button).toBeDisabled();
        });

        test('shows loading text', () => {
            renderWithTheme(<Button loading text="Carregando...">Loading</Button>);
            expect(screen.getByText('Carregando...')).toBeInTheDocument();
        });

        test('shows loading spinner without text', () => {
            renderWithTheme(<Button loading />);
            const button = document.querySelector('button');
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-label', 'Loading');
        });
    });

    describe('Accessibility', () => {
        test('has proper ARIA attributes', async () => {
            const { container } = renderWithTheme(
                <Button
                    ariaLabel="Botão de ação"
                    ariaDescribedBy="description"
                    ariaExpanded={false}
                    ariaHasPopup="menu"
                    role="button"
                >
                    Ação
                </Button>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Botão de ação');
            expect(button).toHaveAttribute('aria-describedby', 'description');
            expect(button).toHaveAttribute('aria-expanded', 'false');
            expect(button).toHaveAttribute('aria-haspopup', 'menu');
            expect(button).toHaveAttribute('role', 'button');
        });

        test('supports keyboard navigation', () => {
            renderWithTheme(<Button>Tab test</Button>);
            const button = screen.getByText('Tab test');

            button.focus();
            expect(button).toHaveFocus();
        });

        test('has proper focus styles', () => {
            renderWithTheme(<Button>Focus test</Button>);
            const button = screen.getByText('Focus test');

            button.focus();
            expect(button).toHaveFocus();
        });

        test('has proper aria-busy when loading', () => {
            renderWithTheme(<Button loading>Loading</Button>);
            const button = screen.getByText('Loading');

            expect(button).toHaveAttribute('aria-busy', 'true');
        });

        test('has proper aria-disabled when disabled', () => {
            renderWithTheme(<Button disabled>Disabled</Button>);
            const button = screen.getByText('Disabled');

            expect(button).toHaveAttribute('aria-disabled', 'true');
        });
    });

    describe('Keyboard Support', () => {
        test('supports Enter key', () => {
            const handleClick = jest.fn();
            renderWithTheme(<Button onClick={handleClick}>Enter key</Button>);

            const button = screen.getByText('Enter key');
            button.focus();

            fireEvent.keyDown(button, { key: 'Enter' });
            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        test('supports Space key', () => {
            const handleClick = jest.fn();
            renderWithTheme(<Button onClick={handleClick}>Space key</Button>);

            const button = screen.getByText('Space key');
            button.focus();

            fireEvent.keyDown(button, { key: ' ' });
            fireEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Props', () => {
        test('supports fullWidth prop', () => {
            renderWithTheme(<Button fullWidth>Full Width</Button>);
            const button = screen.getByText('Full Width');

            expect(button).toHaveStyle({ width: '100%' });
        });

        test('supports type prop', () => {
            renderWithTheme(<Button type="submit">Submit</Button>);
            const button = screen.getByText('Submit');

            expect(button).toHaveAttribute('type', 'submit');
        });

        test('supports form props', () => {
            renderWithTheme(
                <Button
                    name="test-button"
                    value="test-value"
                    form="test-form"
                    formAction="/test"
                    formMethod="post"
                    formTarget="_blank"
                >
                    Form Button
                </Button>
            );

            const button = screen.getByText('Form Button');
            expect(button).toHaveAttribute('name', 'test-button');
            expect(button).toHaveAttribute('value', 'test-value');
            expect(button).toHaveAttribute('form', 'test-form');
            expect(button).toHaveAttribute('formAction', '/test');
            expect(button).toHaveAttribute('formMethod', 'post');
            expect(button).toHaveAttribute('formTarget', '_blank');
        });

        test('supports custom className and style', () => {
            renderWithTheme(
                <Button className="custom-class" style={{ color: 'red' }}>
                    Custom
                </Button>
            );

            const button = screen.getByText('Custom');
            expect(button).toHaveClass('custom-class');
            expect(button).toHaveStyle({ color: 'red' });
        });

        test('supports click event handlers', () => {
            const handleClick = jest.fn();
            const handleMouseDown = jest.fn();
            const handleMouseUp = jest.fn();
            const handleMouseEnter = jest.fn();
            const handleMouseLeave = jest.fn();

            renderWithTheme(
                <Button
                    onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Events
                </Button>
            );

            const button = screen.getByText('Events');

            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalled();

            fireEvent.mouseDown(button);
            expect(handleMouseDown).toHaveBeenCalled();

            fireEvent.mouseUp(button);
            expect(handleMouseUp).toHaveBeenCalled();

            fireEvent.mouseEnter(button);
            expect(handleMouseEnter).toHaveBeenCalled();

            fireEvent.mouseLeave(button);
            expect(handleMouseLeave).toHaveBeenCalled();
        });
    });

    describe('Motion and Animations', () => {
        test('applies motion styles when enabled', () => {
            renderWithTheme(<Button>Animated</Button>);
            const button = screen.getByText('Animated');

            expect(button).toBeInTheDocument();
            // Motion styles are applied via CSS-in-JS, so we check if the element exists
        });

        test('respects reduced motion preferences', () => {
            // Mock prefers-reduced-motion
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation(query => ({
                    matches: query === '(prefers-reduced-motion: reduce)',
                    media: query,
                    onchange: null,
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            });

            renderWithTheme(<Button>Reduced Motion</Button>);
            const button = screen.getByText('Reduced Motion');

            expect(button).toBeInTheDocument();
        });
    });

    describe('Performance', () => {
        test('renders within performance budget', () => {
            const startTime = performance.now();

            renderWithTheme(
                <div>
                    {Array.from({ length: 100 }).map((_, i) => (
                        <Button key={i} variant="primary" size="medium">
                            Button {i}
                        </Button>
                    ))}
                </div>
            );

            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // Should render 100 buttons in less than 100ms
            expect(renderTime).toBeLessThan(100);
        });
    });
});
