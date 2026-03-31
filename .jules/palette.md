## 2024-05-23 - Accessible Overlay Actions
**Learning:** Using `opacity-0 group-hover:opacity-100` for overlay actions (like delete/edit buttons on cards) makes them inaccessible to keyboard users as they cannot hover.
**Action:** Always include `group-focus-within:opacity-100` (and `focus-within:opacity-100` on the container) alongside hover styles to ensure keyboard users can reveal and interact with these controls when tabbing into them.
