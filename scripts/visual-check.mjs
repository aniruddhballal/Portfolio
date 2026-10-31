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
  await page.locator(".experience-list").scrollIntoViewIfNeeded();
  await page
    .locator(".experience-logo")
    .evaluateAll((logos) => Promise.all(logos.map((logo) => logo.decode())));
  await page.locator(".experience-list").screenshot({
    path: path.join("artifacts", `experience-${name}.png`),
    style: ".site-header, .skip-link { visibility: hidden; }",
  });
  await page.locator(".strava-wrap").screenshot({
    path: path.join("artifacts", `revamp2-${name}-endurance.png`),
    style: ".site-header, .skip-link { visibility: hidden; }",
  });
  for (const [selector, section] of [
    [".project-archive", "projects"],
    [".collaboration-work", "collaborations"],
  ]) {
    await page.locator(selector).screenshot({
      path: path.join("artifacts", `projects-${name}-${section}.png`),
      style: ".site-header, .skip-link { visibility: hidden; }",
    });
  }
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
  const jobs = await page.locator(".experience-item").evaluateAll((items) =>
    items.map((item) => {
      const heading = item.querySelector("h4");
      const role = item.querySelector(".experience-role");
      const logo = item.querySelector("img");
      return {
        organisation: heading.textContent,
        roles: [...item.querySelectorAll(".experience-stint")].map((stint) => ({
          role: stint.querySelector(".experience-role").textContent,
          period: stint.querySelector(".experience-period").textContent,
        })),
        headingSize: parseFloat(getComputedStyle(heading).fontSize),
        roleSize: parseFloat(getComputedStyle(role).fontSize),
        logoLoaded: logo.complete && logo.naturalWidth > 0,
        logoBesideName:
          logo.getBoundingClientRect().right <=
          heading.getBoundingClientRect().left,
      };
    }),
  );
  if (
    JSON.stringify(jobs.map((job) => job.organisation)) !==
    JSON.stringify(["Indiassetz", "Qwixpert Consulting", "IISc, Bengaluru"])
  )
    errors.push(`${name}: work history organisations changed`);
  if (
    JSON.stringify(jobs[0]?.roles) !==
    JSON.stringify([
      { role: "Assistant Software Engineer", period: "Mar - Oct 2026" },
      { role: "Frontend Web Dev Intern", period: "Jun - Jul 2025" },
    ])
  )
    errors.push(
      `${name}: Indiassetz should group both stints with separate dates`,
    );
  if (jobs.reduce((count, job) => count + job.roles.length, 0) !== 4)
    errors.push(`${name}: work history should retain all four roles`);
  for (const job of jobs) {
    if (job.headingSize <= job.roleSize)
      errors.push(
        `${name}: ${job.organisation} should be more prominent than the role`,
      );
    if (!job.logoLoaded || !job.logoBesideName)
      errors.push(
        `${name}: ${job.organisation} logo failed to load or sit beside its name`,
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

  const personalRows = page.locator(".personal-project-list .project-row");
  const collaborationRows = page.locator(
    ".collaboration-project-list .project-row",
  );
  const selectedNames = [
    ...(await page.locator(".feature-copy h3").allTextContents()).map((text) =>
      text.trim().replace(/\.$/, ""),
    ),
    ...(await personalRows
      .locator(".project-row-main strong")
      .allTextContents()),
  ];
  const expectedNames = [
    "Sunalyse",
    "SatLies",
    "Queen's Gambit 2.0",
    "mp3fy",
    "kNupdate",
    "dedgram",
    "LOANlo",
    "VenPay",
    "Credex",
  ];
  if (JSON.stringify(selectedNames) !== JSON.stringify(expectedNames))
    errors.push(
      `${name}: incorrect personal project selection or order: ${selectedNames.join(", ")}`,
    );
  const collaborationNames = await collaborationRows
    .locator(".project-row-main strong")
    .allTextContents();
  if (
    JSON.stringify(collaborationNames) !==
    JSON.stringify([
      "Bheeshma",
      "Project Gudi",
      "Sankalpa For Change",
      "Nikhil Lab Site",
    ])
  )
    errors.push(
      `${name}: incorrect collaborations: ${collaborationNames.join(", ")}`,
    );

  // Inspect the expanded content too: source links and technology tags must fit.
  for (const row of await page.locator(".project-row").all()) {
    await row.locator("summary").click();
  }
  for (const project of ["mp3fy", "kNupdate"]) {
    const row = personalRows.filter({
      has: page.getByText(project, { exact: true }),
    });
    const download = row.getByRole("link", {
      name: `Download APK: ${project}`,
      exact: true,
    });
    if (
      (await download.getAttribute("href")) !==
      `https://raw.githubusercontent.com/aniruddhballal/${project}/main/${project}.apk`
    )
      errors.push(`${name}: incorrect Android download for ${project}`);
  }
  const credex = personalRows.filter({
    has: page.getByText("Credex", { exact: true }),
  });
  if (
    (await credex.getByRole("link").count()) !== 1 ||
    (await credex.getByRole("link").getAttribute("href")) !==
      "https://github.com/aniruddhballal/Credex"
  )
    errors.push(
      `${name}: Credex should expose its source without an invented live demo`,
    );
  for (const project of [
    "Bheeshma",
    "Sankalpa For Change",
    "Nikhil Lab Site",
  ]) {
    const row = collaborationRows.filter({
      has: page.getByText(project, { exact: true }),
    });
    if ((await row.getByRole("link", { name: /^Source code:/ }).count()) !== 0)
      errors.push(`${name}: private ${project} source must not be linked`);
  }
  const sources = await page
    .locator("#work a[aria-label^='Source code:']")
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")).sort(),
    );
  const expectedSources = [
    "sunalyse",
    "SatLies",
    "queens-gambit-2.0",
    "mp3fy",
    "kNupdate",
    "dedgram",
    "LOANlo",
    "VenPay",
    "Credex",
    "project-gudi",
  ]
    .map((repo) => `https://github.com/aniruddhballal/${repo}`)
    .sort();
  if (JSON.stringify(sources) !== JSON.stringify(expectedSources))
    errors.push(`${name}: incorrect public project source links`);
  const expandedOverflow = await page
    .locator("#work")
    .evaluate((section) =>
      [...section.querySelectorAll("*")].some(
        (element) => element.scrollWidth > element.clientWidth + 1,
      ),
    );
  if (expandedOverflow)
    errors.push(`${name}: expanded project content overflows`);
  await personalRows
    .filter({ has: page.getByText("mp3fy", { exact: true }) })
    .screenshot({
      path: path.join("artifacts", `projects-${name}-mp3fy-detail.png`),
      style: ".site-header, .skip-link { visibility: hidden; }",
    });
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
    for (const [filter, expected] of [
      ["Independent tools", 3],
      ["Finance", 3],
      ["Security", 1],
      ["All", 7],
    ]) {
      await page.getByRole("button", { name: filter, exact: true }).click();
      const count = await personalRows.count();
      if (count !== expected)
        errors.push(
          `${filter} filter returned ${count} projects instead of ${expected}`,
        );
      if ((await collaborationRows.count()) !== 4)
        errors.push(`${filter} filter hid collaborations`);
      if (
        (await page.locator(".results-count").textContent()) !==
        `Showing ${expected} of 7 projects`
      )
        errors.push(`${filter} filter has an incorrect results announcement`);
    }
    await page.getByRole("button", { name: "Security", exact: true }).click();
    const first = personalRows.locator("summary").first();
    await first.focus();
    await page.keyboard.press("Enter");
    if ((await personalRows.first().getAttribute("open")) === null)
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
