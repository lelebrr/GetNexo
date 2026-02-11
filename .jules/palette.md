# Palette's Journal

## 2024-05-24 - Accessible Grid Item Actions
**Learning:** Using `group-hover:opacity-100` on overlay actions in grid items makes them inaccessible to keyboard users. `group-focus-within:opacity-100` solves this by revealing actions when focused.
**Action:** always pair `group-hover` visibility with `group-focus-within` for interactive overlays.
