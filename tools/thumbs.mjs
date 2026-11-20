// Makes the platform screenshots in public/thumbs from the live screens.
//   npm run build && npx vite preview --port 4191 --host 127.0.0.1
//   node tools/thumbs.mjs http://127.0.0.1:4191/
// Needs Playwright and Chrome. Each screen is shot at full size, then scaled
// in the browser and saved as WebP, so nothing else needs installing.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch {
  pw = require(execSync("npm root -g").toString().trim() + "/playwright");
}

const base = process.argv[2] ?? "http://127.0.0.1:4191/";
const reg = readFileSync(
  new URL("../src/showcase/platform/registry.ts", import.meta.url),
  "utf8",
);
const slugs = [...reg.matchAll(/^\s+"?([a-z0-9-]+)"?: [AG]\(/gm)].map(
  (m) => m[1],
);
const out = new URL("../public/thumbs/", import.meta.url);
mkdirSync(out, { recursive: true });

const browser = await pw.chromium.launch({
  executablePath: process.env.CHROME ?? "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1400, height: 960 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

async function save(png, width, file) {
  const data = await page.evaluate(
    async ({ b64, width }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = width;
      c.height = Math.round((img.height * width) / img.width);
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL("image/webp", 0.86).split(",")[1];
    },
    { b64: png.toString("base64"), width },
  );
  writeFileSync(new URL(file, out), Buffer.from(data, "base64"));
}

for (const slug of slugs) {
  await page.goto(base + "#/shot/" + slug);
  await page.waitForSelector("#shot .pv", { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const png = await (await page.$("#shot")).screenshot();
  await save(png, 720, `${slug}.webp`);
  if (slug === "timesheet-inbox") await save(png, 1280, "hero-avolon.webp");
  if (slug === "front-desk") await save(png, 1280, "hero-glo.webp");
  process.stdout.write(".");
}
await browser.close();
console.log(
  `\n${slugs.length} screens${errors.length ? ", errors: " + errors.join(" | ") : ", no errors"}`,
);
