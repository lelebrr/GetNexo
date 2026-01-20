// i18n Engine with AI Fallback
// Usage: <span data-i18n="welcome_message">Bem-vindo</span>

const I18N_API = 'https://n8n.getnexo.com.br/webhook/i18n'; // n8n Workflow
const DEFAULT_LANG = 'pt-BR';
let currentLang = navigator.language || DEFAULT_LANG;

if (!['pt-BR', 'en-US', 'es-ES'].includes(currentLang)) {
    currentLang = 'en-US'; // Fallback
}

console.log(`🌍 Detected Language: ${currentLang}`);

// In-Memory Cache (Simple PWA Cache)
const translations = {
    'pt-BR': {
        'welcome': 'Bem-vindo ao Use Nexo',
        'support': 'Suporte',
        'freight': 'Frete'
    },
    'en-US': {
        'welcome': 'Welcome to Use Nexo',
        'support': 'Support',
        'freight': 'Shipping'
    },
    'es-ES': {
        'welcome': 'Bienvenido a Use Nexo',
        'support': 'Soporte',
        'freight': 'Flete'
    }
};

async function translate(key, fallbackText) {
    // 1. Check Local Cache
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }

    // 2. Check Browser Storage (IndexedDB/LocalStorage)
    const stored = localStorage.getItem(`i18n_${currentLang}_${key}`);
    if (stored) return stored;

    // 3. Ask AI (via n8n)
    try {
        console.log(`🤖 Asking AI to translate: ${fallbackText} -> ${currentLang}`);
        const response = await fetch(I18N_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, lang: currentLang, fallback: fallbackText })
        });
        const data = await response.json();

        if (data.translation) {
            // Save to Local Storage for offline use
            localStorage.setItem(`i18n_${currentLang}_${key}`, data.translation);
            return data.translation;
        }
    } catch (e) {
        console.error("Translation Failed", e);
    }

    return fallbackText; // Ultimate Fallback
}

async function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    for (const el of elements) {
        const key = el.getAttribute('data-i18n');
        const fallback = el.innerText;
        el.innerText = '...'; // Loading state
        el.innerText = await translate(key, fallback);
    }
}

document.addEventListener('DOMContentLoaded', applyTranslations);
