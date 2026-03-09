## 2024-05-24 - Close Button Accessibility Pattern
**Learning:** Many modals, alerts, and overlay components use a generic "✕" character without `aria-label` or focus-visible classes. This makes them functionally invisible to screen readers and difficult to navigate for keyboard users.
**Action:** Always wrap "✕" inside a `<button>` tag that includes an `aria-label` describing what is being closed (e.g., `aria-label="Fechar modal de agendamento"`) and `focus-visible:ring-2 focus-visible:outline-none rounded` utility classes to guarantee keyboard focus indicators.
