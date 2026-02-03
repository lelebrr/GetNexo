## 2026-02-03 - Accessible Overlay Actions
**Learning:** Hover-only overlays (opacity-0 -> hover:opacity-100) are invisible to keyboard users. Even if the buttons inside are focusable, the user cannot see them when tabbing.
**Action:** Always add `group-focus-within:opacity-100` (or similar focus-within logic) to overlay containers to ensure actions become visible when a keyboard user focuses on an element inside them.
