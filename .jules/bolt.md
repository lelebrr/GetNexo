## 2025-02-27 - Frontend Testing & CSP
**Learning:** The application enforces strict CSP which breaks the local dev server (Astro) frontend verification script, making headless browser verification difficult without disabling CSP or modifying the dev environment.
**Action:** Rely on unit tests (jest) for component verification, but be aware that dependencies might be missing.

## 2025-02-27 - Missing Test Dependencies
**Learning:** `getnexo-site` lists `jest` but is missing `jest-environment-jsdom` and babel presets, causing tests to fail out of the box.
**Action:** When running tests, be prepared to temporarily install these dependencies or ask for permission to add them permanently.

## 2025-02-27 - ChatInterface Layout
**Learning:** Hardcoded height (`h-[80vh]`) in `ChatInterface` causes layout overflow when embedded in a flex/grid container with calculated height (`calc(100vh - 280px)`).
**Action:** Use `h-full` to respect the parent container's constraints.
