/**
 * 📊 SCROLL PROGRESS BAR
 * Shows reading progress at top of page
 */

(function () {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00F7FF, #FF0033);
        width: 0%;
        z-index: 99999;
        transition: width 0.1s ease-out;
        box-shadow: 0 0 10px #00F7FF;
    `;
    document.body.appendChild(bar);

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = `${Math.min(100, progress)}%`;
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    console.log('📊 Scroll Progress Active');
})();
