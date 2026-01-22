/**
 * 🔦 FOCUS MODE
 * Dims everything except the active element
 */

let focusModeActive = false;

function toggleFocusMode() {
    focusModeActive = !focusModeActive;

    if (focusModeActive) {
        const overlay = document.createElement('div');
        overlay.id = 'focus-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 9998;
            pointer-events: none;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(overlay);
        document.body.classList.add('focus-mode');
    } else {
        const overlay = document.getElementById('focus-overlay');
        if (overlay) overlay.remove();
        document.body.classList.remove('focus-mode');
    }
}

// Shortcut: Ctrl+Shift+F
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        toggleFocusMode();
    }
});
