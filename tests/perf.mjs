// Not a test: measures Core Web Vitals on a throttled phone.   npm run perf [path]
// Needs the local server (npm run serve). Numbers are lab estimates, not field data.

import { chromium, devices } from "@playwright/test";

const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/web-development", "/privacy-policy"];
const browser = await chromium.launch();

for (const path of paths) {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  await context.addInitScript(() => localStorage.setItem("cyphron_consent_v1", JSON.stringify({ version: 1, security: false, timestamp: Date.now() })));
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 }); // "Slow 4G"-ish
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0, longTaskMs: 0, lcpNode: "" };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__vitals.lcp = entry.startTime;
        window.__vitals.lcpNode = entry.element ? entry.element.tagName + "." + String(entry.element.className).slice(0, 30) : "";
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__vitals.longTaskMs += Math.max(0, entry.duration - 50);
    }).observe({ type: "longtask", buffered: true });
  });

  let bytes = 0;
  page.on("response", async (response) => {
    const length = Number(response.headers()["content-length"] || 0);
    bytes += length;
  });

  await page.goto(`http://localhost:8000${path}`, { waitUntil: "load" });
  await page.waitForTimeout(3500);
  const fcp = await page.evaluate(() => performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0);
  const v = await page.evaluate(() => window.__vitals);
  console.log(
    `${path.padEnd(20)} FCP ${(fcp / 1000).toFixed(2)}s  LCP ${(v.lcp / 1000).toFixed(2)}s (${v.lcpNode})  CLS ${v.cls.toFixed(3)}  TBT~ ${Math.round(v.longTaskMs)}ms  bytes ${(bytes / 1024).toFixed(0)}KB`,
  );
  await context.close();
}
await browser.close();
