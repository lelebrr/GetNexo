## 2025-02-19 - Hidden Actions in Grid Views
**Learning:** Hidden actions (opacity: 0) that only appear on hover are inaccessible to keyboard users unless `focus-within` is used.
**Action:** Always add `focus-within:opacity-100` to container elements that reveal interactive children on hover.
