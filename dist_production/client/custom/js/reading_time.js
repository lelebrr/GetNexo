/**
 * ⏱️ READING TIME CALCULATOR
 * Estimates reading time for blog posts
 */

function calculateReadingTime() {
    const article = document.querySelector('article');
    if (!article) return;

    const text = article.innerText;
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);

    const timeElement = document.createElement('div');
    timeElement.className = 'reading-time';
    timeElement.innerHTML = `⏱️ ${time} min leitura`;
    timeElement.style.cssText = `
        color: #666;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        opacity: 0.8;
    `;

    const header = article.querySelector('header');
    if (header) {
        header.appendChild(timeElement);
    }
}

document.addEventListener('DOMContentLoaded', calculateReadingTime);
