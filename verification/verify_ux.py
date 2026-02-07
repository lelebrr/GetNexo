from playwright.sync_api import sync_playwright
import json

def run(playwright):
    # Launch with security disabled to bypass CSP
    browser = playwright.chromium.launch(
        headless=True,
        args=["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"]
    )
    context = browser.new_context(
        bypass_csp=True
    )
    page = context.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

    # Set local storage before navigation
    page.add_init_script("localStorage.setItem('omnichat_token', 'mock-token');")

    # Intercept API call to provide mock data
    mock_data = {
        "files": [
            {"name": "test-image.jpg", "url": "https://via.placeholder.com/150", "size": 1024, "createdAt": "2024-01-01"},
            {"name": "test-doc.pdf", "url": "https://example.com/doc.pdf", "size": 2048, "createdAt": "2024-01-02"}
        ]
    }
    page.route("**/api/upload", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps(mock_data)
    ))

    try:
        # Navigate to the test page
        print("Navigating to test page...")
        page.goto("http://localhost:4322/palette-test")

        # Wait for the component to load and fetch data
        print("Waiting for gallery...")
        page.wait_for_selector("text=Galeria de Mídia", timeout=10000)

        # Focus on the first action button ("Visualizar test-image.jpg")
        print("Focusing on view button...")
        view_button = page.get_by_label("Visualizar test-image.jpg")
        view_button.focus()

        # Wait for transition (opacity-100)
        page.wait_for_timeout(500)

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification_ux.png")
        print("Screenshot saved to verification_ux.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
