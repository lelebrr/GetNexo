## 2025-02-18 - Making Hover Overlays Accessible
**Learning:** Interactive elements hidden inside `opacity-0 group-hover:opacity-100` containers are inaccessible to keyboard users. Simply adding `focus-within:opacity-100` to the container makes the overlay appear when a user tabs into any child element, preserving the clean UI while ensuring accessibility.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` for overlay actions, and ensure the interactive children have visible focus styles (e.g., `focus:ring`).
