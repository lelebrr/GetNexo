## 2024-05-24 - OS Command Injection in model-converter
**Vulnerability:** OS Command Injection in `chat-api/scripts/model-converter.js` via `child_process.exec`.
**Learning:** `exec` evaluates commands in a shell, allowing attackers to inject arbitrary OS commands if user inputs (`glbPath`, `usdzPath`) are concatenated directly into the command string.
**Prevention:** Always use `child_process.execFile` (or `spawn`) and pass arguments as an array to prevent shell interpretation. For cross-platform compatibility, dynamically resolve binaries like `npx` (`npx.cmd` on Windows, `npx` on Unix).
