// @ts-check
import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/web-development",
  "/mobile-app-development",
  "/ai-automation",
  "/cloud-engineering",
  "/ui-ux-design",
  "/data-products",
  "/case-orbitcart",
  "/case-leaselens",
  "/case-flowdesk",
  "/case-medsync",
  "/case-finsight",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/cookie-policy",
  "/accessibility",
  "/privacy-request",
];

const AXE_PATH = "node_modules/axe-core/axe.min.js";

/** Pretend the visitor already declined cookies so the notice does not cover the page. */
async function declineCookies(page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("cyphron_consent_v1", JSON.stringify({ version: 1, security: false, timestamp: Date.now() }));
  });
}


/** Open a page and wait until it has finished starting up (the static HTML is replaced by the live app). */
async function visit(page, url) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

test.describe("every page", () => {
  for (const file of PAGES) {
    test(`${file} loads with one h1 and no console errors`, async ({ page }) => {
      const errors = [];
      page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
      page.on("pageerror", (error) => errors.push(String(error)));
      await declineCookies(page);

      const response = await page.goto(file);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/CyphronTech/);
      await page.waitForTimeout(600);
      expect(errors).toEqual([]);
    });

    for (const scheme of ["dark", "light"]) {
    test(`${file} has no axe accessibility violations (${scheme} theme)`, async ({ page }) => {
      // Measure the settled page: contrast checked mid-fade would give false results.
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
      await declineCookies(page);
      await page.goto(file);
      await page.waitForTimeout(800);
      await page.addScriptTag({ path: AXE_PATH });

      const violations = await page.evaluate(async () => {
        // @ts-ignore axe is injected above
        const result = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
        return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
      });
      expect(violations).toEqual([]);
    });
    }

    test(`${file} does not scroll sideways`, async ({ page }) => {
      await declineCookies(page);
      await page.goto(file);
      await page.waitForTimeout(600);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("cookie consent", () => {
  test("first visit shows a notice; declining hides it and loads nothing from other sites", async ({ page }) => {
    const external = [];
    page.on("request", (request) => {
      const url = request.url();
      if (!url.startsWith("http://localhost:8000") && !url.startsWith("data:")) {
        external.push(url);
      }
    });

    await visit(page, "/");
    const notice = page.getByRole("region", { name: "Cookie choices" });
    await expect(notice).toBeVisible();
    await expect(notice.getByRole("button", { name: "Decline" })).toBeVisible();
    await expect(notice.getByRole("button", { name: "Accept" })).toBeVisible();

    await notice.getByRole("button", { name: "Decline" }).click();
    await expect(notice).toBeHidden();
    await page.waitForTimeout(500);
    expect(external).toEqual([]);

    const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem("cyphron_consent_v1") || "null"));
    expect(stored?.security).toBe(false);
  });

  test("footer link reopens the notice", async ({ page }) => {
    await declineCookies(page);
    await visit(page, "/");
    await page.getByRole("button", { name: "Cookie settings" }).click();
    await expect(page.getByRole("region", { name: "Cookie choices" })).toBeVisible();
  });
});

test.describe("contact form", () => {
  test("empty submit shows inline, screen-reader-linked errors", async ({ page }) => {
    await declineCookies(page);
    await visit(page, "/");
    const form = page.locator("[data-contact-form]");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(form.locator(".field-error")).toHaveCount(5);
    const nameInput = form.locator("input[name=name]");
    await expect(nameInput).toHaveAttribute("aria-invalid", "true");
    await expect(nameInput).toBeFocused();
    const describedBy = await nameInput.getAttribute("aria-describedby");
    await expect(page.locator(`#${describedBy}`)).toContainText("Enter your name");
  });

  test("after declining cookies the form offers an opt-in box and does not send without it", async ({ page }) => {
    const external = [];
    page.on("request", (request) => {
      const url = request.url();
      if (!url.startsWith("http://localhost:8000") && !url.startsWith("data:")) {
        external.push(url);
      }
    });
    await declineCookies(page);
    await visit(page, "/");

    const form = page.locator("[data-contact-form]");
    await expect(form.locator("input[name=security]")).not.toBeChecked();
    await form.locator("input[name=name]").fill("Test Person");
    await form.locator("input[name=email]").fill("test@example.com");
    await form.locator("select[name=project]").selectOption("Mobile app");
    await form.locator("textarea[name=brief]").fill("Testing the form");
    await form.locator("input[name=consent]").check();
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(form.locator("[data-form-status]")).toContainText("tick the spam protection box");
    await expect(form.getByRole("link", { name: "Open email draft" })).toBeVisible();
    expect(external).toEqual([]);
  });
});

test.describe("keyboard and motion", () => {
  test("the skip link is the first thing keyboard users reach", async ({ page }) => {
    await declineCookies(page);
    await visit(page, "/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("scroll reveals and smooth scrolling are off for reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.localStorage.setItem("cyphron_consent_v1", JSON.stringify({ version: 1, security: false, timestamp: Date.now() }));
    });
    await page.goto("http://localhost:8000/");
    await page.waitForTimeout(1000);
    await expect(page.locator("[data-reveal]")).toHaveCount(0);
    await expect(page.locator("html.lenis")).toHaveCount(0);
    await context.close();
  });

  test("desktop nav marks the section in view", async ({ page, isMobile }) => {
    test.skip(isMobile, "the menu is collapsed on phones");
    await declineCookies(page);
    await visit(page, "/");
    await page.waitForTimeout(800);
    await page.evaluate(() => document.getElementById("faq")?.scrollIntoView({ behavior: "instant", block: "start" }));
    await expect(page.locator('.nav-menu a[href="#faq"]')).toHaveAttribute("aria-current", "location");
  });

  test("Escape closes the mobile menu and returns focus to the button", async ({ page, isMobile }) => {
    test.skip(!isMobile, "only phones show the menu button");
    await declineCookies(page);
    await visit(page, "/");
    const toggle = page.locator(".nav-toggle");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });
});

test.describe("content rules", () => {
  test("no em or en dashes appear in visible text", async ({ page }) => {
    await declineCookies(page);
    for (const file of ["/", "/privacy-policy", "/terms-of-service", "/web-development", "/case-finsight"]) {
      await page.goto(file);
      const text = await page.locator("body").innerText();
      expect(text, `${file} contains an em or en dash`).not.toMatch(/[–—]/);
    }
  });

  test("hero headline fits on two lines on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop layout only");
    await declineCookies(page);
    await visit(page, "/");
    const lines = await page.locator("#hero-title").evaluate((element) => {
      const style = getComputedStyle(element);
      return Math.round(element.getBoundingClientRect().height / parseFloat(style.lineHeight));
    });
    expect(lines).toBeLessThanOrEqual(2);
  });
});

test.describe("responsive layouts", () => {
  for (const width of [320, 375, 768, 1024]) {
    for (const path of ["/", "/web-development", "/case-medsync", "/privacy-policy", "/privacy-request", "/ui-ux-design"]) {
      test(`${path} at ${width}px: no sideways scroll, readable text, tappable controls`, async ({ page }) => {
        await declineCookies(page);
        await page.setViewportSize({ width, height: 800 });
        await visit(page, path);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, "sideways scroll").toBeLessThanOrEqual(0);

        const problems = await page.evaluate(() => {
          const found = [];
          // body-size text must stay at least 14px
          for (const node of document.querySelectorAll("p, li, label")) {
            const size = parseFloat(getComputedStyle(node).fontSize);
            if (size < 13.5 && node.textContent.trim().length > 40 && node.getBoundingClientRect().width > 0) {
              found.push(`small text (${size}px): ${node.textContent.trim().slice(0, 40)}`);
            }
          }
          // buttons and links used as controls need at least 24x24 CSS px (WCAG 2.2 target size)
          for (const node of document.querySelectorAll("button, .button, input, select, summary, .nav-menu a")) {
            const box = node.getBoundingClientRect();
            if (box.width > 0 && (box.width < 24 || box.height < 24) && getComputedStyle(node).visibility !== "hidden" && node.type !== "checkbox") {
              found.push(`tiny target ${Math.round(box.width)}x${Math.round(box.height)}: ${(node.textContent || node.name || "").trim().slice(0, 30)}`);
            }
          }
          return found;
        });
        expect(problems).toEqual([]);
      });
    }
  }
});
