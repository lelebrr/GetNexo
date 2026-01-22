// Fix for Cloudflare Rocket Loader compatibility - minimal intervention
(function () {
    'use strict';

    // Wait for DOM and ensure we don't interfere with Astro's module preloading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreloadFix);
    } else {
        // Small delay to let Astro's preloading finish first
        setTimeout(initPreloadFix, 50);
    }

    function initPreloadFix() {
        try {
            // Only fix crossorigin for Google Fonts to prevent CORS issues
            const googleFontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]');
            googleFontLinks.forEach(link => {
                if (!link.crossOrigin) {
                    link.crossOrigin = 'anonymous';
                }
            });

            // Fix preload hints for fonts only - don't interfere with JS modules
            const fontPreloads = document.querySelectorAll('link[rel="preload"][as="font"]');
            fontPreloads.forEach(link => {
                if (!link.crossOrigin) {
                    link.crossOrigin = 'anonymous';
                }
            });

            // Ensure Google Fonts scripts have crossorigin if loaded dynamically
            const googleFontScripts = document.querySelectorAll('script[src*="fonts.googleapis.com"]');
            googleFontScripts.forEach(script => {
                if (!script.crossOrigin) {
                    script.crossOrigin = 'anonymous';
                }
            });

            console.log('[Preload Fix] Applied targeted fixes for Google Fonts only');
        } catch (error) {
            console.warn('[Preload Fix] Error applying fixes:', error);
        }
    }
})();