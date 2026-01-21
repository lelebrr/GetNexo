// Touch Gestures Handler
class TouchGestures {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.maxSwipeTime = 300;
        this.touchStartTime = 0;
        this.isPinching = false;
        this.initialDistance = 0;
        this.currentScale = 1;

        this.init();
    }

    init() {
        // Only initialize on touch devices
        if (!('ontouchstart' in window)) return;

        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Navigation pages for swipe
        this.pages = [
            { url: '/', name: 'home' },
            { url: '/produtos', name: 'produtos' },
            { url: '/precos', name: 'precos' },
            { url: '/blog', name: 'blog' }
        ];

        this.currentPageIndex = this.pages.findIndex(page => page.url === window.location.pathname);
        if (this.currentPageIndex === -1) this.currentPageIndex = 0;
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();

        // Handle pinch start
        if (e.touches.length === 2) {
            this.isPinching = true;
            this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
        }
    }

    handleTouchMove(e) {
        if (this.isPinching && e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / this.initialDistance;

            // Pinch to zoom on content
            if (scale > 1.2) {
                this.handlePinchIn();
            } else if (scale < 0.8) {
                this.handlePinchOut();
            }
        }
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;

        if (this.isPinching) {
            this.isPinching = false;
            return;
        }

        // Only handle swipe if it's quick enough and not too diagonal
        if (touchDuration > this.maxSwipeTime) return;

        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Prevent diagonal swipes from being too sensitive
        if (absDeltaX < this.minSwipeDistance && absDeltaY < this.minSwipeDistance) return;
        if (absDeltaY > absDeltaX * 0.5) return; // Too vertical

        if (absDeltaX > this.minSwipeDistance) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        }
    }

    handleSwipeLeft() {
        // Navigate to next page
        const nextIndex = Math.min(this.currentPageIndex + 1, this.pages.length - 1);
        if (nextIndex !== this.currentPageIndex) {
            this.navigateToPage(nextIndex);
        }
    }

    handleSwipeRight() {
        // Navigate to previous page
        const prevIndex = Math.max(this.currentPageIndex - 1, 0);
        if (prevIndex !== this.currentPageIndex) {
            this.navigateToPage(prevIndex);
        }
    }

    handlePinchIn() {
        // Zoom in - show more details or open modal
        this.showToast('Zoom ampliado', '🔍');
    }

    handlePinchOut() {
        // Zoom out - minimize or close modal
        this.showToast('Zoom reduzido', '🔍');
    }

    navigateToPage(index) {
        const page = this.pages[index];
        if (page && page.url !== window.location.pathname) {
            // Add navigation animation
            document.body.style.transition = 'transform 0.3s ease';
            document.body.style.transform = 'translateX(20px)';
            document.body.style.opacity = '0.8';

            setTimeout(() => {
                window.location.href = page.url;
            }, 150);

            this.showToast(`Navegando para ${page.name}`, '👆');
        }
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    showToast(message, icon = '👆') {
        // Remove existing toast
        const existingToast = document.querySelector('.gesture-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'gesture-toast glass-panel';
        toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

        toast.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      animation: toastSlideUp 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 212, 255, 0.1);
      border-color: rgba(0, 212, 255, 0.3);
      backdrop-filter: blur(10px);
    `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastFadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes toastSlideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes toastFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize touch gestures
document.addEventListener('DOMContentLoaded', () => {
    new TouchGestures();
});