import sys
from playwright.sync_api import sync_playwright

def render_and_screenshot(html_content, screenshot_path):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Inject Tailwind to render properly
        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body {{ background-color: #1a1a1a; color: white; padding: 20px; }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """

        page.set_content(full_html)

        # Strip CSP if needed (though not needed for direct set_content)

        # Take screenshot
        page.locator("body").screenshot(path=screenshot_path)
        browser.close()

# ChatModal close button HTML
chat_modal_html = """
<div class="flex justify-between items-center mb-4 border-b border-neon-blue/30 pb-2">
  <h3 class="text-xl font-bold text-white flex items-center gap-2">
    <span class="text-neon-blue text-2xl">⚡</span>
    Vendedora IA
  </h3>
  <button type="button" aria-label="Fechar" id="close-chat-modal-btn" class="text-neon-blue text-3xl hover:text-white focus-visible:ring-2 focus-visible:outline-none rounded">&#x2715;</button>
</div>
"""

try:
    render_and_screenshot(chat_modal_html, "chat_modal_close_btn.png")
    print("Screenshot generated: chat_modal_close_btn.png")
except Exception as e:
    print(f"Error generating screenshot: {e}")
