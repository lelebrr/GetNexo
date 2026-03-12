## 2024-03-12 - [Accessibility] Consistent Close Buttons

**Learning:** Missing ARIA labels and focus states on icon-only close buttons (✕) makes them invisible to screen readers and difficult to navigate via keyboard.
**Action:** Always add `aria-label="Fechar"` and focus styles (e.g., `focus-visible:ring-2 focus-visible:outline-none rounded`) to close buttons.
