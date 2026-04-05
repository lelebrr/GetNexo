
## 2025-04-05 - Standardize Close Buttons and Form Labels
**Learning:** Found that custom modal close buttons were using the non-standard '✕' character without `aria-label` or focus states, and form labels were visually styled but not programmatically linked to inputs using `htmlFor` and `id`, making forms difficult to use with screen readers.
**Action:** Always use the standard '✖' (U+2716) for close buttons, ensuring they include `aria-label="Fechar"` and `focus-visible:ring-2 focus-visible:outline-none rounded` for keyboard users. Always link React `<label>` elements to their inputs using `htmlFor` and `id`.
