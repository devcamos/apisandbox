/**
 * Mobile navigation drawer must scroll on small screens (iPhone Safari bug).
 *
 * The signed-in drawer (Explore → Phases, Algorithms & Practice, Advanced Topics,
 * profile and Sign Out) is taller than a phone screen. It needs a fixed 100dvh
 * height with its own scroll container, and the body scroll lock must not stop it.
 *
 * Session APIs are stubbed so the test needs no database.
 *
 *   npx playwright test tests/mobile-drawer-scroll.spec.ts --project="Mobile Safari"
 *   npx playwright test tests/mobile-drawer-scroll.spec.ts --project=chromium   # CI
 */
import { test, expect, type Page } from "@playwright/test";

// iPhone SE-sized viewport: the smallest common iPhone, so the drawer always overflows.
test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

test.skip(({ browserName }) => browserName === "firefox", "Touch emulation is not supported on Firefox");

const fakeUser = {
  id: "user_drawer_e2e",
  email: "drawer@example.com",
  firstName: "Drawer",
  lastName: "Test",
  avatarUrl: null,
  subscriptionTier: "FREE",
  isDemo: false,
};

async function stubSignedInSession(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("cookie-consent", "accepted");
  });
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ json: { success: true, data: { user: fakeUser } } }),
  );
  await page.route("**/api/subscription/status", (route) =>
    route.fulfill({ json: { tier: "FREE", isExpired: false } }),
  );
  await page.route("**/api/auth/logout", (route) => route.fulfill({ json: { success: true } }));
  await page.route("https://accounts.google.com/**", (route) => route.abort());
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
}

async function openDrawer(page: Page) {
  // /terms is a light public page. The 3D homepage can crash headless WebKit on Linux CI,
  // which has nothing to do with the drawer.
  const me = page.waitForResponse("**/api/auth/me");
  await page.goto("/terms");
  await me;
  const menuButton = page.locator('button[aria-controls="mobile-navigation-menu"]');
  // Retry the tap until React has hydrated and the drawer opens.
  await expect(async () => {
    await menuButton.tap();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 20_000 });
  const drawer = page.getByTestId("mobile-navigation-drawer");
  await expect(drawer.getByRole("link", { name: /Java Track/ })).toBeAttached();
  return { drawer, scroller: page.getByTestId("mobile-navigation-scroll") };
}

function isInViewport(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= window.innerHeight && r.height > 0;
  });
}

test.describe("Mobile navigation drawer scrolling", () => {
  test.beforeEach(async ({ page }) => {
    await stubSignedInSession(page);
  });

  test("drawer is viewport-height and its list scrolls independently", async ({ page }) => {
    const { drawer, scroller } = await openDrawer(page);

    const metrics = await scroller.evaluate((el) => {
      const style = getComputedStyle(el);
      const drawerRect = el.parentElement!.getBoundingClientRect();
      return {
        overflowY: style.overflowY,
        overscroll: style.overscrollBehaviorY,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        drawerBottom: drawerRect.bottom,
        innerHeight: window.innerHeight,
        bodyOverflow: getComputedStyle(document.body).overflow,
      };
    });

    expect(metrics.overflowY).toBe("auto");
    expect(metrics.overscroll).toBe("contain");
    expect(metrics.bodyOverflow).toBe("hidden");
    // Drawer fits the screen instead of running off the bottom of it…
    expect(metrics.drawerBottom).toBeLessThanOrEqual(metrics.innerHeight + 1);
    // …so the content overflows inside the drawer, which is what makes it scrollable.
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

    await scroller.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
    await expect.poll(() => scroller.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    // The page behind the drawer must not move.
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(drawer).toBeVisible();
  });

  test("scroll to the last item (Sign Out) and tap it", async ({ page }) => {
    const { drawer } = await openDrawer(page);
    const signOut = drawer.getByRole("button", { name: "Sign Out" });

    expect(await isInViewport(page, '[data-testid="mobile-navigation-drawer"] button:has-text("Sign Out")')).toBe(false);
    await signOut.scrollIntoViewIfNeeded();
    expect(await isInViewport(page, '[data-testid="mobile-navigation-drawer"] button:has-text("Sign Out")')).toBe(true);

    const logout = page.waitForRequest((req) => req.url().includes("/api/auth/logout") && req.method() === "POST");
    await signOut.tap();
    await logout;
  });

  test("scroll to the last Advanced Topics item (Java Track) and tap it", async ({ page }) => {
    const { drawer } = await openDrawer(page);
    const javaTrack = drawer.getByRole("link", { name: /Java Track/ });

    await javaTrack.scrollIntoViewIfNeeded();
    expect(await isInViewport(page, '[data-testid="mobile-navigation-drawer"] a[href="/docs/java"]')).toBe(true);
    // /docs/java is behind auth middleware, so assert the navigation request rather than the final URL.
    const nav = page.waitForRequest((req) => new URL(req.url()).pathname === "/docs/java");
    await javaTrack.tap();
    await nav;
    // Drawer closes on navigation and the page lock is released.
    await expect(page.getByTestId("mobile-navigation-drawer")).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("a real touch swipe scrolls the drawer, not the page (Chromium touch events)", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Uses Chrome DevTools Protocol touch events");
    const { scroller } = await openDrawer(page);
    const cdp = await page.context().newCDPSession(page);
    const swipeUp = async () => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: 550 }] });
      for (let y = 540; y >= 120; y -= 20) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 180, y }] });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };

    for (let i = 0; i < 4; i += 1) await swipeUp();

    await expect.poll(() => scroller.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});
