import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const BASE_URL = process.env.VISUAL_CHECK_URL ?? "http://localhost:3000";
const OUT_DIR = "./screenshots";

const PAGES = [
  { path: "/", name: "home" },
  { path: "/clasament", name: "clasament" },
  { path: "/regulamente", name: "regulamente" },
  { path: "/magazin", name: "magazin" },
  { path: "/cont", name: "cont" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();

// Chrome's fullPage screenshot mode composites position:fixed/sticky elements
// once per scroll tile, producing ghosting/duplication artifacts. Instead we
// measure the real document height and set the viewport to match, so the
// page renders in a single frame with no scrolling involved.
for (const viewport of VIEWPORTS) {
  for (const target of PAGES) {
    await page.setViewport(viewport);
    await page.goto(`${BASE_URL}${target.path}`, { waitUntil: "networkidle0" });
    const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewport({ ...viewport, height: fullHeight });
    // Let staggered CSS entrance animations finish before capturing, so
    // late-delayed items aren't caught mid-fade (opacity: 0).
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const file = `${OUT_DIR}/${target.name}-${viewport.name}.png`;
    await page.screenshot({ path: file });
    console.log(`saved ${file}`);
  }
}

await browser.close();
