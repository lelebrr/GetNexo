
## 2025-02-28 - Missing labels on close buttons across multiple components
**Learning:** Found a recurring accessibility issue where modal and popover close buttons using the '✕' character were completely missing `aria-label` attributes across several components (`TeamManager`, `MeetingScheduler`, `OrderBuilder`, `KanbanBoard`, `DockerManagement`). This makes them invisible or unhelpful to screen readers.
**Action:** Implemented `aria-label="Fechar"` (and context-specific variants like `"Fechar insight"`) on all identified '✕' buttons. In future component development, always ensure icon-only buttons include an `aria-label` or visually hidden text.
