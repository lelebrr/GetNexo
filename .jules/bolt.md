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

## $(date +%Y-%m-%d) - Optimize SQLite Stats Endpoints
**Learning:** In the `chat-api` backend, which uses `better-sqlite3`, all database operations are synchronous. This means that executing multiple sequential `SELECT COUNT(*)` queries (e.g., in statistics or dashboard endpoints) causes blocking and high overhead, as each query executes sequentially in the main thread without the possibility of `Promise.all` parallelization.
**Action:** Always replace multiple sequential `COUNT(*)` queries against the same table with a single query utilizing conditional aggregation (`SUM(CASE WHEN...)`). This significantly reduces database roundtrips and execution time. When mapping the result to JSON, ensure a fallback `|| 0` is provided because `SUM(...)` over empty subsets in SQLite can return `null`.
