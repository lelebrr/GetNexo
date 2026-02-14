## 2026-02-14 - Reveal Actions on Focus
**Learning:** Interactive elements hidden by opacity (like overlay actions on cards) must become visible on keyboard focus, not just hover.
**Action:** Use `group-focus-within:opacity-100` alongside `group-hover:opacity-100` for overlay containers.
