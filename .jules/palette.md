## 2024-05-22 - Clickable Divs in Chat Interface
**Learning:** Found critical keyboard accessibility issue in `ChatInterface.jsx`. The `ContactItem` component uses a `div` with `onClick` but no keyboard handlers or role, making the primary navigation method inaccessible to keyboard users.
**Action:** Replace `div` with `button` for interactive list items. This provides native keyboard focus and activation without extra JavaScript for key handling.
## 2024-05-15 - [Improving AR/3D User Upload Accessibility]
**Learning:** Upload3D component lacked critical accessibility features: the file input had no label, the submit button missed `aria-label` and `title`, and the dynamic disabled state (when no file is selected) wasn't accurately conveyed to screen readers. Relying only on HTML `disabled` and Tailwind visual classes (`opacity-50`) wasn't enough.
**Action:** Added `sr-only` label for file input, `aria-label` and `title` to button. Enhanced the JS logic to dynamically toggle `aria-disabled="true"` alongside the native `disabled` attribute to properly notify screen readers of the state change when a file is selected or cleared.
