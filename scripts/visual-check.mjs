import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const url = process.env.PORTFOLIO_TEST_URL ?? "http://localhost:5173/";
const executablePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    : undefined;
const browser = await chromium.launch({ headless: true, executablePath });
const errors = [];
await mkdir("artifacts", { recursive: true });

for (const [name, viewport] of Object.entries({
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
  compact: { width: 320, height: 720 },
})) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (response?.status() !== 200)
    throw new Error(`${name}: HTTP ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".art-grid").scrollIntoViewIfNeeded();
  await page
    .locator(".art-grid img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode())),
    );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .locator(".hero-section")
    .screenshot({ path: path.join("artifacts", `revamp2-${name}-hero.png`) });
  await page.locator(".feature-solar").screenshot({
    path: path.join("artifacts", `revamp2-${name}-case-study.png`),
  });
  await page.locator(".strava-wrap").screenshot({
    path: path.join("artifacts", `revamp2-${name}-endurance.png`),
    style: ".site-header, .skip-link { visibility: hidden; }",
  });
  await page.screenshot({
    path: path.join("artifacts", `revamp2-${name}.png`),
    fullPage: true,
  });
  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (horizontalOverflow > 1) {
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll("*")]
        .filter(
          (element) => element.getBoundingClientRect().right > innerWidth + 1,
        )
        .slice(0, 12)
        .map(
          (element) =>
            `${element.tagName.toLowerCase()}.${element.className?.toString().slice(0, 60)} ${Math.round(element.getBoundingClientRect().right)}`,
        ),
    );
    const widths = await page.evaluate(() =>
      [
        ".site-width",
        ".strava-wrap",
        ".strava-stats",
        ".endurance-overview",
        ".endurance-records",
      ].map((selector) => {
        const element = document.querySelector(selector);
        return `${selector}=${element?.getBoundingClientRect().width}/${element?.scrollWidth}`;
      }),
    );
    errors.push(
      `${name}: horizontal overflow ${horizontalOverflow}px: ${widths.join(" ")}; ${offenders.join(", ")}`,
    );
  }
  const endurance = page.getByRole("region", { name: "Going the distance." });
  if ((await endurance.locator("button, select, table, details").count()) !== 0)
    errors.push(
      `${name}: the endurance feature still exposes archive controls`,
    );
  const bests = endurance.locator(".endurance-records dl > div");
  if ((await bests.count()) !== 3)
    errors.push(`${name}: expected three selected running bests`);
  for (const [label, time] of [
    ["5K", "20:44"],
    ["10K", "46:02"],
    ["Half marathon", "1:57:42"],
  ]) {
    const best = bests.filter({ has: page.getByText(label, { exact: true }) });
    if ((await best.locator("dd").textContent()) !== time)
      errors.push(`${name}: incorrect ${label} best`);
  }
  if (
    !(await endurance
      .getByText("In a single run.", { exact: true })
      .isVisible())
  )
    errors.push(`${name}: the endurance milestone is missing`);
  const featureOverflow = await endurance.evaluate((section) =>
    [...section.querySelectorAll("*")].some(
      (element) => element.scrollWidth > element.clientWidth + 1,
    ),
  );
  if (featureOverflow)
    errors.push(`${name}: endurance content requires horizontal scrolling`);
  if (name !== "tablet") {
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    for (const violation of accessibility.violations) {
      errors.push(
        `${name}: ${violation.id} (${violation.nodes.length} nodes): ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
      );
    }
  }
  if (name === "desktop") {
    for (const asset of ["/resume.pdf", "/favicon.svg"]) {
      const assetResponse = await page.request.get(
        new URL(asset, url).toString(),
      );
      if (assetResponse.status() !== 200)
        errors.push(
          `Internal asset ${asset} returned ${assetResponse.status()}`,
        );
    }
    await page.getByRole("button", { name: "Security", exact: true }).click();
    const count = await page.locator(".project-row").count();
    if (count !== 2) errors.push(`Security filter returned ${count} projects`);
    const first = page.locator(".project-row summary").first();
    await first.focus();
    await page.keyboard.press("Enter");
    if (
      (await page.locator(".project-row").first().getAttribute("open")) === null
    )
      errors.push("Project details failed to open by keyboard");
    await page.locator(".creative-tile").first().click();
    await page.locator("dialog").waitFor({ state: "visible" });
    const dialogAccessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    for (const violation of dialogAccessibility.violations)
      errors.push(
        `Writing dialog: ${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
      );
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "detached" });
    await page.locator(".art-tile").first().click();
    await page.locator("dialog img").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "detached" });
  }
  if (name === "mobile") {
    await page.getByRole("button", { name: "Open menu" }).click();
    if (
      !(await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .isVisible())
    )
      errors.push("Mobile menu did not open");
    const menuAccessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    for (const violation of menuAccessibility.violations)
      errors.push(`Mobile menu: ${violation.id}`);
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Practice" })
      .click();
    if (
      await page.getByRole("navigation", { name: "Mobile navigation" }).count()
    )
      errors.push("Mobile menu did not close after navigation");
  }
  await context.close();
}

const reducedMotionContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const reducedMotionPage = await reducedMotionContext.newPage();
await reducedMotionPage.goto(url);
if (
  (await reducedMotionPage.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  )) !== "auto"
)
  errors.push("Reduced motion did not disable smooth scrolling");
await reducedMotionContext.close();

await browser.close();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    "Desktop, tablet, mobile, compact, accessibility, and interaction checks passed.",
  );
}
