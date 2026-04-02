## 2025-02-18 - Tab Patterns
**Learning:** The application uses `<button>` elements for tab-like navigation (e.g., Inbox Filters) without proper ARIA roles, making it confusing for screen readers.
**Action:** When identifying button groups that function as filters or tabs, convert them to `role="tablist"` with `role="tab"` and `aria-selected` to improve semantics.
