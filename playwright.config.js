// @ts-check
import { defineConfig, devices } from "@playwright/test";

// Regression tests for the site. Run with:  npm test
// A static server on port 8000 is started automatically (or reused if already running).
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:8000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://localhost:8000/",
    reuseExistingServer: true,
  },
});
