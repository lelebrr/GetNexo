## 2024-03-02 - Ensure close buttons are accessible
**Learning:** Close buttons often lack aria-labels and use inconsistent symbols ('x', '×', '✕', '&times;'). This causes issues for screen reader users and inconsistency in UI.
**Action:** Use '✕' (U+2715) for visual consistency and always add an `aria-label` (e.g., `aria-label="Fechar"`) for accessibility.
