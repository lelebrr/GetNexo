# Palette's Journal

## 2025-05-23 - Interactive divs vs Buttons
**Learning:** Found critical pattern where interactive list items (contacts) were `div`s with `onClick`, making them inaccessible to keyboard users.
**Action:** Always use `<button type="button" className="w-full text-left ...">` for list items that trigger actions or selection. Ensure `focus-visible` styles are present for keyboard focus indication.
