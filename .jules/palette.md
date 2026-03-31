## 2024-05-23 - Accessibility of Hidden Grid Actions
**Learning:** In grid views with hover-only actions, keyboard users are completely blocked from accessing those actions unless the container becomes visible on focus.
**Action:** Always add `focus-within:opacity-100` (or equivalent) to the overlay container so that tabbing into the hidden buttons reveals the overlay. Also ensure the hidden buttons have `focus:outline-none` and `focus:ring` styles to indicate focus position clearly.
