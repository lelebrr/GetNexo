/**
 * Design System - Skip Links Component
 * Acessibilidade WCAG 2.2 AA+ - Skip Links para navegação por teclado
 */

import React, { useState, useEffect } from 'react';
import { useTheme, useAccessibility } from '../theme/ThemeContext';

// Skip links configuration
const DEFAULT_SKIP_LINKS = [
    {
        id: 'skip-to-content',
        label: 'Ir para o conteúdo principal',
        target: '#main-content',
    },
    {
        id: 'skip-to-navigation',
        label: 'Ir para a navegação principal',
        target: '#main-navigation',
    },
    {
        id: 'skip-to-search',
        label: 'Ir para a busca',
        target: '#search',
    },
    {
        id: 'skip-to-footer',
        label: 'Ir para o rodapé',
        target: '#footer',
    },
];

// Skip link item component
const SkipLinkItem = ({ id, label, target, onClose }) => {
    const { computedTheme } = useTheme();
    const { getSkipLinkStyles } = useAccessibility();
    const [isVisible, setIsVisible] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        const element = document.querySelector(target);

        if (element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Remove tabindex after focus
            setTimeout(() => {
                element.removeAttribute('tabindex');
            }, 100);
        }

        if (onClose) onClose();
    };

    const handleFocus = () => {
        setIsVisible(true);
    };

    const handleBlur = () => {
        setIsVisible(false);
    };

    return (
        <a
            href={target}
            id={id}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
                ...getSkipLinkStyles(),
                ...(isVisible && {
                    top: '0',
                }),
            }}
            aria-label={label}
        >
            {label}
        </a>
    );
};

// Skip links container
export const SkipLinks = ({ links = DEFAULT_SKIP_LINKS, className = '', style = {} }) => {
    const { computedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                zIndex: computedTheme.spacing.zIndex.max,
                pointerEvents: 'none',
                ...style,
            }}
            className={className}
            aria-hidden="false"
        >
            {links.map((link) => (
                <SkipLinkItem
                    key={link.id}
                    id={link.id}
                    label={link.label}
                    target={link.target}
                />
            ))}
        </div>
    );
};

// Skip links hook
export const useSkipLinks = () => {
    const [links, setLinks] = useState(DEFAULT_SKIP_LINKS);

    const addLink = (link) => {
        setLinks((prev) => [...prev, link]);
    };

    const removeLink = (id) => {
        setLinks((prev) => prev.filter((link) => link.id !== id));
    };

    const updateLink = (id, updates) => {
        setLinks((prev) =>
            prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
        );
    };

    const clearLinks = () => {
        setLinks([]);
    };

    return {
        links,
        addLink,
        removeLink,
        updateLink,
        clearLinks,
        SkipLinks: ({ className, style }) => (
            <SkipLinks links={links} className={className} style={style} />
        ),
    };
};

// Focus trap hook for modals and dialogs
export const useFocusTrap = (ref, isActive = true) => {
    const [previousFocus, setPreviousFocus] = useState(null);

    useEffect(() => {
        if (!isActive || !ref.current) return;

        const element = ref.current;
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Store previous focus
        setPreviousFocus(document.activeElement);

        // Focus first element
        if (firstElement) {
            firstElement.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            } else if (e.key === 'Escape') {
                // Close on escape
                if (element.getAttribute('role') === 'dialog') {
                    const closeBtn = element.querySelector('[aria-label*="Fechar"], [aria-label*="Close"]');
                    if (closeBtn) closeBtn.click();
                }
            }
        };

        element.addEventListener('keydown', handleKeyDown);

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
            // Restore previous focus
            if (previousFocus) {
                previousFocus.focus();
            }
        };
    }, [isActive, ref, previousFocus]);

    return { previousFocus };
};

// Focus visible hook
export const useFocusVisible = () => {
    const [isFocusVisible, setIsFocusVisible] = useState(false);

    useEffect(() => {
        const handleMouseDown = () => {
            setIsFocusVisible(false);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                setIsFocusVisible(true);
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return { isFocusVisible };
};

// Focus indicator component
export const FocusIndicator = ({ children, className = '', style = {} }) => {
    const { computedTheme } = useTheme();
    const { isFocusVisible } = useFocusVisible();

    return (
        <div
            style={{
                position: 'relative',
                ...(isFocusVisible && {
                    outline: `2px solid ${computedTheme.colors.focus.ring}`,
                    outlineOffset: '2px',
                    boxShadow: `0 0 0 4px ${computedTheme.colors.focus.ring}20`,
                }),
                ...style,
            }}
            className={className}
        >
            {children}
        </div>
    );
};

// ARIA live region component
export const AriaLiveRegion = ({
    children,
    type = 'polite',
    ariaLabel = 'Notificações',
    className = '',
    style = {},
}) => {
    return (
        <div
            role="status"
            aria-live={type}
            aria-atomic="true"
            aria-label={ariaLabel}
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
                ...style,
            }}
            className={className}
        >
            {children}
        </div>
    );
};

// ARIA announcement hook
export const useAriaAnnouncement = () => {
    const [announcement, setAnnouncement] = useState('');
    const [type, setType] = useState('polite');

    const announce = (message, announcementType = 'polite') => {
        setAnnouncement(message);
        setType(announcementType);

        // Clear after announcement
        setTimeout(() => {
            setAnnouncement('');
        }, 1000);
    };

    const announcePolite = (message) => {
        announce(message, 'polite');
    };

    const announceAssertive = (message) => {
        announce(message, 'assertive');
    };

    return {
        announcement,
        type,
        announce,
        announcePolite,
        announceAssertive,
        AriaLiveRegion: ({ ariaLabel = 'Notificações' }) => (
            <AriaLiveRegion type={type} ariaLabel={ariaLabel}>
                {announcement}
            </AriaLiveRegion>
        ),
    };
};

// Screen reader only text component
export const ScreenReaderOnly = ({ children, className = '', style = {} }) => {
    return (
        <span
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: 0,
                ...style,
            }}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA label component
export const AriaLabel = ({
    children,
    label,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-label={label}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA described by component
export const AriaDescribedBy = ({
    children,
    descriptionId,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-describedby={descriptionId}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA expanded component
export const AriaExpanded = ({
    children,
    expanded = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-expanded={expanded}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA has popup component
export const AriaHasPopup = ({
    children,
    popupType = 'menu',
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-haspopup={popupType}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA controls component
export const AriaControls = ({
    children,
    controls,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-controls={controls}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA current component
export const AriaCurrent = ({
    children,
    current = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-current={current ? 'page' : undefined}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA disabled component
export const AriaDisabled = ({
    children,
    disabled = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-disabled={disabled}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA required component
export const AriaRequired = ({
    children,
    required = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-required={required}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA invalid component
export const AriaInvalid = ({
    children,
    invalid = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-invalid={invalid}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA readonly component
export const AriaReadonly = ({
    children,
    readonly = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-readonly={readonly}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA hidden component
export const AriaHidden = ({
    children,
    hidden = false,
    className = '',
    style = {},
}) => {
    return (
        <span
            aria-hidden={hidden}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA label for component
export const AriaLabelFor = ({
    children,
    htmlFor,
    className = '',
    style = {},
}) => {
    return (
        <label
            htmlFor={htmlFor}
            style={style}
            className={className}
        >
            {children}
        </label>
    );
};

// ARIA role component
export const AriaRole = ({
    children,
    role,
    className = '',
    style = {},
}) => {
    return (
        <span
            role={role}
            style={style}
            className={className}
        >
            {children}
        </span>
    );
};

// ARIA live region hook for announcements
export const useAriaLive = () => {
    const [messages, setMessages] = useState([]);

    const addMessage = (message, type = 'polite') => {
        const id = Date.now();
        setMessages((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        }, 3000);
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return {
        messages,
        addMessage,
        clearMessages,
    };
};

export default SkipLinks;
