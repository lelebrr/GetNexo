const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: '/home/jules/verification/videos' }
  });

  // Create an HTML file to test the modals statically
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 p-8">
      <!-- ChatModal -->
      <div class="bg-black p-6 rounded relative mb-8">
        <button id="close-chat-modal-btn" class="text-blue-500 text-3xl hover:text-white focus-visible:ring-2 focus-visible:outline-none rounded" aria-label="Fechar chat">✕</button>
      </div>

      <!-- DemoModal -->
      <div class="bg-black p-6 rounded relative mb-8">
        <button id="close-demo-modal-btn" class="text-white/50 hover:text-white transition-all text-4xl focus-visible:ring-2 focus-visible:outline-none rounded" aria-label="Fechar modal de demonstração">✕</button>
      </div>

      <!-- InteractiveModal -->
      <div class="bg-black p-6 rounded relative mb-8">
        <button id="close-ia-modal-btn" class="text-blue-500 text-3xl hover:text-white focus-visible:ring-2 focus-visible:outline-none rounded" aria-label="Fechar demonstração interativa">✕</button>
      </div>

      <!-- ProductModal -->
      <div class="bg-black p-6 rounded relative mb-8">
        <button id="close-product-modal-ia-btn" class="text-blue-500 text-2xl hover:text-white focus-visible:ring-2 focus-visible:outline-none rounded" aria-label="Fechar produto">✕</button>
      </div>
    </body>
    </html>
  `;

  const testFilePath = path.join(__dirname, 'test_modals.html');
  fs.writeFileSync(testFilePath, htmlContent);

  const page = await context.newPage();
  await page.goto('file://' + testFilePath);

  await page.waitForTimeout(500);

  // Tab through the buttons to show focus state
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/focus_1.png' });

  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/jules/verification/screenshots/focus_2.png' });

  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);

  await page.keyboard.press('Tab');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/home/jules/verification/screenshots/verification.png' });

  await context.close();
  await browser.close();
})();
