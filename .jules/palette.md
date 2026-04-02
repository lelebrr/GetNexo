## 2024-04-02 - [Playwright verification blocked by CSP]
**Learning:** Testing Astro components dynamically in Playwright using the Astro dev server may fail because the application enforces a strict Content Security Policy (CSP).
**Action:** Validate visual UI changes in Astro by constructing standalone HTML wrappers and loading them directly using the `file://` protocol in Playwright tests.
