/**
 * 🌌 PARALLAX HERO EFFECT
 * Adds depth to the main banner
 */

document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const layers = document.querySelectorAll('.parallax-layer');

    layers.forEach(layer => {
        const speed = layer.getAttribute('data-speed') || 0.05;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;

        layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });

    // Subtle tilt for the main hero text
    const title = hero.querySelector('h1');
    if (title) {
        const tiltX = (0.5 - mouseY) * 10;
        const tiltY = (mouseX - 0.5) * 10;
        title.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
});
