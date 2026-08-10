## 2025-02-27 - Frontend Testing & CSP
**Learning:** The application enforces strict CSP which breaks the local dev server (Astro) frontend verification script, making headless browser verification difficult without disabling CSP or modifying the dev environment.
**Action:** Rely on unit tests (jest) for component verification, but be aware that dependencies might be missing.

## 2025-02-27 - Missing Test Dependencies
**Learning:** `getnexo-site` lists `jest` but is missing `jest-environment-jsdom` and babel presets, causing tests to fail out of the box.
**Action:** When running tests, be prepared to temporarily install these dependencies or ask for permission to add them permanently.

## 2025-02-27 - ChatInterface Layout
**Learning:** Hardcoded height (`h-[80vh]`) in `ChatInterface` causes layout overflow when embedded in a flex/grid container with calculated height (`calc(100vh - 280px)`).
**Action:** Use `h-full` to respect the parent container's constraints.

## 2025-02-27 - Dual Implementation of Store
**Learning:** The "Store" feature has two implementations: `CatalogManager.jsx` (used inside `OmniChatApp` tabs) and `loja.astro` (used for the sidebar route). Optimizing one does not affect the other.
**Action:** Verify which component is being targeted by checking the navigation context (Tab vs Sidebar).

## 2025-02-27 - Optimizing Drag and Drop
**Learning:** Monolithic components like `KanbanBoard` re-render entirely on drag events if not split. Extracting columns and cards into memoized components is essential for smooth dnd interactions in React.
**Action:** Always memoize drag handlers (`onDragStart`, `onDrop`) and list item components when implementing drag-and-drop.

## 2025-02-28 - Optimizing Multiple COUNT(*) Queries
**Learning:** In analytical endpoints (like `/stats/overview`), executing sequential `COUNT(*)` database queries causes unnecessary latency through multiple table scans and context switching.
**Action:** Always combine them into a single query using conditional aggregation `SUM(CASE WHEN [condition] THEN 1 ELSE 0 END)`. Use fallback logic `|| 0` in JavaScript because `SUM()` returns `NULL` (unlike `COUNT()` returning `0`) on empty tables.

## 2025-02-28 - Optimizing Multiple COUNT(*) Queries Across Tables
**Learning:** When aggregating statistics across multiple tables (like in `/stats` endpoints), executing separate `SELECT COUNT(*)` queries sequentially causes unnecessary database round-trips and context switching.
**Action:** Always combine them into a single query using sub-selects (e.g., `SELECT (SELECT COUNT(*) FROM table1) as t1, (SELECT COUNT(*) FROM table2) as t2`) to fetch all counts in a single database execution.
