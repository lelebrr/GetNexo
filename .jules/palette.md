## 2024-05-23 - Keyboard Accessibility in Hover Overlays
**Learning:** Hover-only overlay actions (like "View" and "Delete" buttons on grid items) are inaccessible to keyboard users unless they become visible on focus.
**Action:** Always add `group-focus-within:opacity-100` (or `focus-within:opacity-100`) alongside `group-hover:opacity-100` to ensures actions are revealed when tabbing into the container.
