## 2024-05-22 - Clickable Divs in Chat Interface
**Learning:** Found critical keyboard accessibility issue in `ChatInterface.jsx`. The `ContactItem` component uses a `div` with `onClick` but no keyboard handlers or role, making the primary navigation method inaccessible to keyboard users.
**Action:** Replace `div` with `button` for interactive list items. This provides native keyboard focus and activation without extra JavaScript for key handling.
