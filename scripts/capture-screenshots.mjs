import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const screenshotDir = path.join(projectRoot, "public", "screenshots");
const baseUrl = process.env.HADI_BASE_URL ?? "http://127.0.0.1:3000";

const browser = await chromium.launch({ headless: true });

const capture = async (page, relativePath, fileName, waitForSelector) => {
  await page.goto(`${baseUrl}${relativePath}`, { waitUntil: "networkidle" });
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { timeout: 15000 });
  }
  await page.screenshot({
    path: path.join(screenshotDir, fileName),
    fullPage: true
  });
};

try {
  const publicPage = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await capture(publicPage, "/auth/login", "login-page.png", "h1");
  await capture(publicPage, "/products", "products-page.png", "h2");
  await capture(publicPage, "/products/orbit-speaker-1-electronics", "product-detail-page.png", "h1");
  await publicPage.close();

  const shopperContext = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const shopperPage = await shopperContext.newPage();
  await shopperPage.goto(`${baseUrl}/auth/login`, { waitUntil: "networkidle" });
  await shopperPage.getByLabel("Email").fill("sara@hadi.demo");
  await shopperPage.getByLabel("Password").fill("123456");
  await shopperPage.getByRole("button", { name: /continue/i }).click();
  await shopperPage.waitForURL("**/dashboard", { timeout: 15000 });
  await shopperPage.waitForLoadState("networkidle");
  await shopperPage.screenshot({
    path: path.join(screenshotDir, "user-dashboard.png"),
    fullPage: true
  });
  await shopperContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const adminPage = await adminContext.newPage();
  await adminPage.goto(`${baseUrl}/auth/login`, { waitUntil: "networkidle" });
  await adminPage.getByLabel("Email").fill("admin@hadi.demo");
  await adminPage.getByLabel("Password").fill("123456");
  await adminPage.getByRole("button", { name: /continue/i }).click();
  await adminPage.waitForURL("**/admin", { timeout: 15000 });
  await adminPage.waitForLoadState("networkidle");
  await adminPage.screenshot({
    path: path.join(screenshotDir, "admin-dashboard.png"),
    fullPage: true
  });
  await adminContext.close();

  console.log("Screenshots generated in public/screenshots");
} finally {
  await browser.close();
}
