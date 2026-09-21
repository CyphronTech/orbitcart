// @ts-check
// SEO, structure and link-health checks. Run with: npm test
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const SITE = "https://cyphrontech.com";

/** Public URL paths of every indexable page (clean URLs). */
const PATHS = [
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

async function declineCookies(page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("cyphron_consent_v1", JSON.stringify({ version: 1, security: false, timestamp: Date.now() }));
  });
}

test.describe("metadata on every page", () => {
  for (const path of PATHS) {
    test(`${path}: title, description, canonical, social tags, schema`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const html = await response.text();

      const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
      const description = html.match(/<meta name="description" content="(.*?)"/)?.[1] ?? "";
      const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1];

      expect(title.length, "title length").toBeGreaterThan(15);
      expect(title.length, `title too long: ${title}`).toBeLessThanOrEqual(60);
      expect(description.length, "description too short").toBeGreaterThanOrEqual(100);
      expect(description.length, "description too long").toBeLessThanOrEqual(165);
      expect(canonical).toBe(path === "/" ? `${SITE}/` : `${SITE}${path}`);
      expect(html, "indexable pages must not carry noindex").not.toMatch(/noindex/i);
      expect(html).toMatch(/<meta property="og:title"/);
      expect(html).toMatch(/<meta property="og:image" content="https:\/\/cyphrontech\.com\/assets\/og-image\.jpg"/);
      expect(html).toMatch(/<meta name="twitter:card" content="summary_large_image"/);
      expect(html.match(/<h1[\s>]/g)?.length, "exactly one h1 in the served HTML").toBe(1);

      const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];
      expect(blocks.length, "structured data present").toBeGreaterThan(0);
      for (const block of blocks) {
        const data = JSON.parse(block[1].replace(/\\u003c/g, "<"));
        expect(data["@context"]).toBe("https://schema.org");
        expect(Array.isArray(data["@graph"])).toBe(true);
      }
    });
  }

  test("titles and descriptions are unique", async ({ request }) => {
    const titles = new Set();
    const descriptions = new Set();
    for (const path of PATHS) {
      const html = await (await request.get(path)).text();
      titles.add(html.match(/<title>(.*?)<\/title>/)?.[1]);
      descriptions.add(html.match(/<meta name="description" content="(.*?)"/)?.[1]);
    }
    expect(titles.size).toBe(PATHS.length);
    expect(descriptions.size).toBe(PATHS.length);
  });

  test("home page schema includes Organization, WebSite and FAQPage", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1].replace(/\\u003c/g, "<") ?? "{}");
    const types = data["@graph"].map((/** @type {any} */ node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "WebPage", "FAQPage"]));
  });
});

test.describe("crawl files", () => {
  test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toMatch(/User-agent: \*/);
    expect(body).toMatch(/Allow: \//);
    expect(body).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    expect(body).not.toMatch(/Disallow: \/\s*$/m);
  });

  test("sitemap.xml lists every page once, with clean https URLs", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    const urls = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(urls.length).toBe(PATHS.length);
    expect(new Set(urls).size).toBe(urls.length);
    for (const path of PATHS) {
      expect(urls).toContain(path === "/" ? `${SITE}/` : `${SITE}${path}`);
    }
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toMatch(/\.html|\?|[A-Z]|\/$(?<!^https:\/\/cyphrontech\.com\/)/);
    }
  });

  test("llms.txt describes the site and links to real pages", async ({ request }) => {
    const body = await (await request.get("/llms.txt")).text();
    expect(body.startsWith("# CyphronTech")).toBe(true);
    for (const path of PATHS.filter((entry) => entry !== "/")) {
      expect(body).toContain(`${SITE}${path}`);
    }
  });

  test("the 404 page returns 404 and is not indexable", async ({ request }) => {
    const response = await request.get("/this-page-does-not-exist");
    expect(response.status()).toBe(404);
    const html = await response.text();
    expect(html).toMatch(/<meta name="robots" content="noindex">/);
    expect(html).toMatch(/Page not found/);
  });
});

test.describe("clean URLs", () => {
  test("old .html addresses redirect permanently to the clean address", async ({ request }) => {
    for (const path of PATHS.filter((entry) => entry !== "/")) {
      const response = await request.get(`${path}.html`, { maxRedirects: 0 });
      expect(response.status(), `${path}.html`).toBe(301);
      expect(response.headers()["location"]).toBe(path);
    }
    const home = await request.get("/index.html", { maxRedirects: 0 });
    expect(home.status()).toBe(301);
    expect(home.headers()["location"]).toBe("/");
  });

  test("slugs are lowercase, hyphenated, short and free of extensions", async () => {
    for (const path of PATHS) {
      expect(path).toMatch(/^\/[a-z0-9-]*$/);
      expect(path.length).toBeLessThanOrEqual(30);
    }
  });
});

test.describe("HTTPS", () => {
  test("no page or file points at an insecure http:// address", async ({ request }) => {
    for (const path of [...PATHS, "/sitemap.xml", "/robots.txt", "/llms.txt"]) {
      const body = await (await request.get(path)).text();
      // the sitemap XML namespace is a required identifier, not a link
      const insecure = [...body.matchAll(/http:\/\/[^\s"'<)]+/g)].map((match) => match[0]).filter((url) => !url.startsWith("http://www.sitemaps.org/schemas/sitemap/"));
      expect(insecure, `${path} has insecure URLs`).toEqual([]);
    }
  });

  test("hosting config enforces HTTPS (HSTS, upgrade-insecure-requests, clean URLs)", async () => {
    const config = JSON.parse(readFileSync("firebase.json", "utf8"));
    const headers = Object.fromEntries(config.hosting.headers[0].headers.map((/** @type {any} */ header) => [header.key, header.value]));
    expect(headers["Strict-Transport-Security"]).toMatch(/max-age=(\d+)/);
    expect(Number(headers["Strict-Transport-Security"].match(/max-age=(\d+)/)?.[1])).toBeGreaterThanOrEqual(31536000);
    expect(headers["Content-Security-Policy"]).toContain("upgrade-insecure-requests");
    expect(config.hosting.cleanUrls).toBe(true);
    expect(config.hosting.rewrites, "no catch-all rewrite (it would hide 404s)").toBeUndefined();
  });
});

test.describe("structure", () => {
  for (const path of PATHS) {
    test(`${path}: headings never skip a level and every image has alt text`, async ({ page }) => {
      await declineCookies(page);
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const headings = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) => nodes.map((node) => Number(node.tagName[1])));
      expect(headings[0]).toBe(1);
      for (let index = 1; index < headings.length; index += 1) {
        expect(headings[index] - headings[index - 1], `heading order: ${headings.join(",")}`).toBeLessThanOrEqual(1);
      }

      const images = await page.$$eval("img", (nodes) =>
        nodes.map((node) => ({ src: node.getAttribute("src"), alt: node.getAttribute("alt"), width: node.getAttribute("width"), height: node.getAttribute("height") })),
      );
      for (const image of images) {
        expect(image.alt, `${image.src} needs an alt attribute (empty for decorative)`).not.toBeNull();
        expect(image.width && image.height, `${image.src} needs width and height`).toBeTruthy();
      }
    });
  }
});

test.describe("internal links", () => {
  test("every internal link and anchor on every page resolves", async ({ page, request }) => {
    const seen = new Map();
    const problems = [];

    for (const path of PATHS) {
      await declineCookies(page);
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const links = await page.$$eval("a[href]", (anchors) => anchors.map((anchor) => anchor.getAttribute("href") || ""));
      for (const href of links) {
        if (/^(mailto:|tel:|https?:)/.test(href)) {
          continue; // external links are not checked here (they can rate-limit bots)
        }
        const [target, hash] = href.split("#");
        const targetPath = target === "" ? path : target;

        if (!seen.has(targetPath)) {
          const response = await request.get(targetPath, { maxRedirects: 0 });
          seen.set(targetPath, response.status());
        }
        if (seen.get(targetPath) !== 200) {
          problems.push(`${path} -> ${href} (HTTP ${seen.get(targetPath)})`);
          continue;
        }
        if (hash) {
          const html = await (await request.get(targetPath)).text();
          if (!new RegExp(`id="${hash}"`).test(html)) {
            problems.push(`${path} -> ${href} (missing anchor #${hash})`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test("service and case pages link to related pages", async ({ page }) => {
    await declineCookies(page);
    await page.goto("/web-development");
    await page.waitForLoadState("networkidle");
    const related = page.getByRole("region", { name: "Related pages" });
    await expect(related.getByRole("link")).not.toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();

    await page.goto("/case-finsight");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("region", { name: "Related pages" }).getByRole("link", { name: /Data Products/ })).toBeVisible();
  });
});

test.describe("source hygiene", () => {
  for (const file of ["styles.css", "src/main.mjs", "src/legal.mjs", "scripts/build.mjs"]) {
    test(`${file} has no stray control characters (a broken escape sequence shows up as a garbled glyph)`, async () => {
      const text = readFileSync(file, "utf8");
      // codes 9, 10 and 13 are tab, newline and carriage return; anything else below 32 is a stray control character
      const stray = [...text].filter((character) => character.charCodeAt(0) < 32 && ![9, 10, 13].includes(character.charCodeAt(0)));
      expect(stray.length).toBe(0);
    });
  }
});
