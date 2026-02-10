from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(bypass_csp=True)
    page = context.new_page()

    # Enable console logging
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
    page.on("requestfailed", lambda req: print(f"REQUEST FAILED: {req.url} {req.failure}"))

    # Mock the API response
    def handle_route(route):
        print(f"Intercepted: {route.request.url}")
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"files": [{"name": "test-image.png", "url": "https://via.placeholder.com/150", "size": 1024, "createdAt": "2024-05-23T00:00:00.000Z"}]}'
        )

    page.route("**/api/upload", handle_route)

    # Mock localStorage token
    # We must do this before navigation
    page.add_init_script("localStorage.setItem('omnichat_token', 'mock-token');")

    print("Navigating...")
    page.goto("http://localhost:4321/palette-verify")

    # Wait for the file to appear
    print("Waiting for selector...")
    try:
        page.wait_for_selector("text=test-image.png", timeout=5000)
    except Exception as e:
        print(f"Timeout waiting for selector: {e}")
        page.screenshot(path="verification/debug_timeout.png")
        # Print body
        # print(page.content()) # Too verbose
        raise e

    # Locate the View button and focus on it to trigger group-focus-within
    view_button = page.get_by_label("Visualizar test-image.png")
    view_button.focus()

    # Wait a bit for transition
    page.wait_for_timeout(500)

    # Take screenshot
    page.screenshot(path="verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
