# Implementation Plan - Integrating React Minigames into Chat Widget

This plan outlines the steps to replace the vanilla JavaScript minigame implementations in the Chat Widget with the robust React-based `GameContainer` component.

## 1. Backend Synchronization
*   The current widget being served is likely `chat-api/widget.js`, but the new features are in `getnexo-site/public/widget.js`.
*   **Action**: Sync `chat-api/widget.js` with `getnexo-site/public/widget.js` to ensure the backend serves the latest version with the minigames menu.

## 2. React Environment Setup in Widget
*   Since the widget is a standalone script, it needs to load React and ReactDOM dynamically if they aren't available on the host page.
*   **Action**: Add a loader function in `widget.js` to inject React and ReactDOM from a CDN (e.g., Unpkg).

## 3. Integrating `GameContainer`
*   `GameContainer.jsx` is a React component with several dependencies.
*   **Action**: Create a compiled/UMD version of the `GameContainer` and its dependencies, or use `React.createElement` for a lightweight integration if possible. *Alternatively*, we can create a small "Game App" entry point that mounts to a specific DOM element.
*   **Decision**: For simplicity and reliability, we will use a "mounting" approach where the widget creates a container and a separate script (bundled with React/Game Logic) is loaded to mount the game UI.
*   **Wait**, there is no existing bundler for specifically the widget games. I will implement a "pseudo-component" pattern or use CDN versions of compatible libraries if needed.
*   **Revised Action**: We will modify `widget.js` to:
    1.  Create a mount point in the `createGameModal`.
    2.  Use a global `renderGame` function (to be defined) that mounts the React app.

## 4. Frontend Analytics Integration
*   Ensure `SalesGamificationSystem.jsx` and the new `GameContainer` correctly record analytics.
*   **Action**: Verify `recordImpression`, `recordClick`, and `recordConversion` calls in the relevant components.

## 5. Game Analytics Page
*   The user has `game-analytics.astro` open. I need to ensure this page is functional and displays data from the backend.

## Success Criteria
*   Minigames in the chat widget are rendered using React components.
*   Game sessions are correctly managed and points are awarded/recorded.
*   Analytics are tracked and visible in the admin dashboard.
