## 2024-05-23 - React Testing Environment Setup
**Learning:** The project uses Jest but was missing `@babel/preset-env`, `@babel/preset-react` and `jest-environment-jsdom` for proper React component testing.
**Action:** Always check `package.json` for testing dependencies and `jest.config.js` for presets. If missing, install them to ensure tests can run. Use `runtime: 'automatic'` in babel config for React 18+.
