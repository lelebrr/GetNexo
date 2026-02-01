# Palette's UX/Accessibility Journal

## 2024-05-23 - Chat Interface Accessibility
**Learning:** Using `div` with `onClick` for interactive list items creates significant accessibility barriers for keyboard users.
**Action:** Always use `<button type="button">` for interactive items. For selection lists, use `aria-current="true"` (if it represents the current view/item) instead of `aria-selected` (which is for `role="option"` or `role="tab"`).

## 2024-05-23 - Tablist Pattern
**Learning:** Filter buttons that switch views often act as tabs.
**Action:** Use `role="tablist"` for the container and `role="tab"` for the buttons, with `aria-selected` to indicate the active tab. This provides better semantics than just `aria-pressed` (which implies a toggle state).
