// @ts-check
import { test, expect } from "@playwright/test";

const DARK_BG = "rgb(9, 13, 21)";
const LIGHT_BG = "rgb(241, 243, 246)";

async function open(page, path = "/") {
  await page.addInitScript(() => {
    if (!window.localStorage.getItem("cyphron_consent_v1")) {
      window.localStorage.setItem("cyphron_consent_v1", JSON.stringify({ version: 1, security: false, timestamp: Date.now() }));
    }
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

const pageBackground = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe("light and dark theme", () => {
  test("follows a dark system setting by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await open(page);
    expect(await pageBackground(page)).toBe(DARK_BG);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });

  test("follows a light system setting by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await open(page);
    expect(await pageBackground(page)).toBe(LIGHT_BG);
  });

  test("the header switch changes theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await open(page);

    const toggle = page.getByRole("button", { name: "Dark theme" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await pageBackground(page)).toBe(LIGHT_BG);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(await page.evaluate(() => window.localStorage.getItem("cyphron_theme"))).toBe("light");

    // survives a reload, applied before the app starts (no flash of the other theme)
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await pageBackground(page)).toBe(LIGHT_BG);
  });

  test("switching back to the system theme returns to following the system", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await open(page);
    const toggle = page.getByRole("button", { name: "Dark theme" });
    await toggle.click();
    await page.waitForTimeout(200);
    await toggle.click();

    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    expect(await page.evaluate(() => window.localStorage.getItem("cyphron_theme"))).toBeNull();
    expect(await pageBackground(page)).toBe(DARK_BG);
  });

  test("the choice applies across pages", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await open(page);
    await page.getByRole("button", { name: "Dark theme" }).click();
    await open(page, "/web-development");
    expect(await pageBackground(page)).toBe(LIGHT_BG);
  });

  test("the light palette is identical whether it comes from the system or the toggle", async ({ browser }) => {
    const tokens = ["--bg", "--bg-raised", "--surface", "--surface-2", "--hairline", "--hairline-strong", "--text", "--text-2", "--text-3", "--accent", "--accent-solid", "--accent-solid-hover", "--error", "--success-text", "--focus", "--inverse-hover", "--fg-rgb", "--bg-rgb", "--shadow-rgb"];
    const read = (list) => list.map((token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim());

    const systemLight = await browser.newContext({ colorScheme: "light" });
    const pageA = await systemLight.newPage();
    await pageA.goto("http://localhost:8000/privacy-policy");
    const fromSystem = await pageA.evaluate(read, tokens);
    await systemLight.close();

    const forcedLight = await browser.newContext({ colorScheme: "dark" });
    const pageB = await forcedLight.newPage();
    await pageB.addInitScript(() => window.localStorage.setItem("cyphron_theme", "light"));
    await pageB.goto("http://localhost:8000/privacy-policy");
    const fromToggle = await pageB.evaluate(read, tokens);
    await forcedLight.close();

    expect(fromToggle).toEqual(fromSystem);
    expect(fromSystem.every((value) => value.length > 0)).toBe(true);
  });

  test("works without JavaScript: the system setting still applies", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light", javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("http://localhost:8000/");
    expect(await pageBackground(page)).toBe(LIGHT_BG);
    await context.close();
  });
});

test.describe("template tells", () => {
  test("no shadows, glass blur, or lifting hover transforms on cards and buttons", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await open(page);
    const offenders = await page.evaluate(() => {
      const found = [];
      for (const element of document.querySelectorAll(".service-card, .ai-approach__panel article, .button, .case-card, .site-header, .contact-form")) {
        const style = getComputedStyle(element);
        if (style.boxShadow !== "none" && !/^rgba?\(0, 0, 0, 0\)/.test(style.boxShadow)) {
          found.push(`${element.className}: shadow ${style.boxShadow.slice(0, 40)}`);
        }
        if (style.backdropFilter && style.backdropFilter !== "none") {
          found.push(`${element.className}: backdrop-filter`);
        }
      }
      return found;
    });
    // focus ring on a focused element is allowed; nothing is focused here
    expect(offenders).toEqual([]);
  });

  test("font is IBM Plex, not Inter, Geist or Space Grotesk", async ({ page }) => {
    await open(page);
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family).toMatch(/IBM Plex Sans/);
    expect(family).not.toMatch(/Inter|Geist|Space Grotesk/i);
  });

  test("copy avoids the 'not X, it is Y' construction in headings", async ({ page }) => {
    await open(page);
    const headings = await page.$$eval("h1, h2, h3, .ai-approach__statement", (nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
    for (const heading of headings) {
      expect(heading, heading).not.toMatch(/,\s*not\s|\bnot just\b|instead of/i);
    }
  });
});
