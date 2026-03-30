## 2024-03-30 - Accessible Close Buttons
**Learning:** Using 'x' characters for close buttons limits screen reader understanding and provides poor visual scaling.
**Action:** Always use the Unicode '✕' (U+2715) character, combine it with `aria-label`, and ensure `focus-visible` styles are set for keyboard users.