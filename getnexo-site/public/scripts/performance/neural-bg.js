// Neural Particle System - Performance Optimized External Script
(function () {
    const canvas = document.getElementById('neural-bg');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function initNeural() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        // Lower density on mobile/small screens
        const densityDivisor = window.innerWidth < 768 ? 25000 : 15000;
        const density = (canvas.width * canvas.height) / densityDivisor;

        for (let i = 0; i < density; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * 0.4 - 0.2,
                color: 'rgba(0, 212, 255, 0.2)'
            });
        }
    }

    function animateNeural() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
            if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

            if (mouse.x) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    p.x -= dx * force * 0.01;
                    p.y -= dy * force * 0.01;
                }
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Limit connections on mobile
            if (window.innerWidth >= 768) {
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(0, 255, 157, ${0.1 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                    }
                }
            }
        });
        requestAnimationFrame(animateNeural);
    }

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNeural();
    });

    initNeural();
    animateNeural();
})();
