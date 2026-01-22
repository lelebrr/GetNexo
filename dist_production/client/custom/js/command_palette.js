/**
 * ⌘ COMMAND PALETTE (Ctrl+K)
 * Quick navigation and actions menu
 */

class CommandPalette {
    constructor() {
        this.isOpen = false;
        this.commands = [
            { name: 'Dashboard', icon: '📊', action: () => window.location.href = '/admin' },
            { name: 'Ara AI Console', icon: '🤖', action: () => window.location.href = '/ara' },
            { name: 'Blog Editor', icon: '📝', action: () => window.location.href = '/admin?tab=content' },
            { name: 'Kira Strategy', icon: '⚔️', action: () => alert('Kira: Em posição de combate.') },
            { name: 'View Logs', icon: '📋', action: () => window.location.href = '/admin?tab=logs' },
            { name: 'Toggle Sounds', icon: '🔊', action: () => window.adminSounds?.toggle() },
            { name: 'Fire Confetti!', icon: '🎉', action: () => window.fireConfetti?.() },
            { name: 'Kill Switch', icon: '💀', action: () => confirm('Ativar Kill Switch?') },
            { name: 'Logout', icon: '🚪', action: () => window.location.href = '/logout' },
        ];

        this.createUI();
        this.bindKeys();
    }

    createUI() {
        const html = `
            <div id="command-palette" style="display:none;">
                <div class="cp-overlay"></div>
                <div class="cp-modal">
                    <input type="text" class="cp-search" placeholder="Type a command..." autofocus>
                    <div class="cp-results"></div>
                    <div class="cp-footer">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>ESC Close</span>
                    </div>
                </div>
            </div>
            <style>
                #command-palette { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; }
                .cp-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); }
                .cp-modal { position: absolute; top: 20%; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px; background: #111; border: 1px solid #00F7FF; border-radius: 12px; overflow: hidden; }
                .cp-search { width: 100%; padding: 1rem; background: #000; border: none; border-bottom: 1px solid #333; color: #fff; font-size: 1.2rem; font-family: 'JetBrains Mono', monospace; outline: none; }
                .cp-results { max-height: 300px; overflow-y: auto; }
                .cp-item { padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: background 0.2s; }
                .cp-item:hover, .cp-item.active { background: #00F7FF22; }
                .cp-item .icon { font-size: 1.2rem; }
                .cp-item .name { color: #fff; }
                .cp-footer { padding: 0.5rem 1rem; background: #000; display: flex; gap: 1rem; font-size: 0.75rem; color: #666; }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        this.palette = document.getElementById('command-palette');
        this.search = this.palette.querySelector('.cp-search');
        this.results = this.palette.querySelector('.cp-results');

        this.search.addEventListener('input', () => this.filter());
        this.palette.querySelector('.cp-overlay').addEventListener('click', () => this.close());
    }

    bindKeys() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            if (e.key === 'Enter' && this.isOpen) {
                const active = this.results.querySelector('.cp-item.active');
                if (active) active.click();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.palette.style.display = 'block';
        this.search.value = '';
        this.search.focus();
        this.render(this.commands);
    }

    close() {
        this.isOpen = false;
        this.palette.style.display = 'none';
    }

    filter() {
        const query = this.search.value.toLowerCase();
        const filtered = this.commands.filter(c => c.name.toLowerCase().includes(query));
        this.render(filtered);
    }

    render(commands) {
        this.results.innerHTML = commands.map((cmd, i) => `
            <div class="cp-item ${i === 0 ? 'active' : ''}" data-index="${i}">
                <span class="icon">${cmd.icon}</span>
                <span class="name">${cmd.name}</span>
            </div>
        `).join('');

        this.results.querySelectorAll('.cp-item').forEach((item, i) => {
            item.addEventListener('click', () => {
                commands[i].action();
                this.close();
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.commandPalette = new CommandPalette();
});

console.log('⌘ Command Palette Ready. Press Ctrl+K to open.');
