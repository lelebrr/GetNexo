## 2024-05-22 - Jest Environment Gaps
**Learning:** The project's `getnexo-site` directory has a `jest.config.js` that assumes `jest-environment-jsdom` and `@babel/preset-react` are available, but they were missing from `node_modules` and `package.json` (or devDependencies). Also, `import.meta` in Vite apps breaks Jest without specific mocks.
**Action:** Always check `pnpm test` first. If it fails due to missing environments, install them. For React components, ensure `@babel/preset-react` uses `{ runtime: 'automatic' }` to avoid importing React in every file.
