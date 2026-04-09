## 2024-05-22 - Divs as Buttons
**Learning:** Interactive list items (like contacts in chat) were implemented as `div`s with `onClick`, lacking keyboard accessibility and semantic meaning.
**Action:** Always refactor such items to `<button type="button">` with `w-full text-left` to maintain layout while gaining native accessibility (focus, enter/space activation).

## 2024-05-22 - Missing Test Environment
**Learning:** The project had `jest` configured but missing `jsdom` environment and babel presets, preventing tests from running.
**Action:** Ensure `@babel/preset-env`, `@babel/preset-react` and `jest-environment-jsdom` are installed and configured when working in this repo.
