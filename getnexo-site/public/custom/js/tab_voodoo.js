
// JetNexo Tab Voodoo
// "We miss you already."
// Manipulates the tab title and favicon when the user switches away.

class TabVoodoo {
    constructor() {
        this.originalTitle = document.title;
        this.messages = [
            "🥺 Come back!",
            "🔥 1 Item Left!",
            "⚠️ Session Expiring...",
            "💰 You forgot this!"
        ];
        this.init();
    }

    init() {
        console.log("👻 [Voodoo] Haunting the tab...");
        document.addEventListener('visibilitychange', () => this.handleVisibility());
    }

    handleVisibility() {
        if (document.hidden) {
            this.startLoop();
        } else {
            this.stopLoop();
        }
    }

    startLoop() {
        let i = 0;
        this.interval = setInterval(() => {
            document.title = this.messages[i % this.messages.length];
            i++;
        }, 1000); // Switch every second
    }

    stopLoop() {
        clearInterval(this.interval);
        document.title = this.originalTitle;
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    new TabVoodoo();
}
