import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, firefox } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const url = process.env.PORTFOLIO_TEST_URL ?? "http://localhost:5173/";
await mkdir("artifacts", { recursive: true });

async function checkFit(page, label) {
  const layout = await page.locator(".artwork-dialog").evaluate((dialog) => {
    const body = dialog.querySelector(".dialog-body");
    const stage = dialog.querySelector(".artwork-stage");
    const image = stage.querySelector("img");
    const caption = dialog.querySelector("figcaption");
    const bounds = dialog.getBoundingClientRect();
    const frame = stage.getBoundingClientRect();
    const style = getComputedStyle(image);
    const ratio = image.naturalWidth / image.naturalHeight;
    const paintedHeight = Math.min(frame.height, frame.width / ratio);
    const paintedWidth = paintedHeight * ratio;
    return {
      inViewport: bounds.top >= 0 && bounds.bottom <= innerHeight + 1,
      noScroll: [dialog, body, dialog.querySelector("figure")].every(
        (element) =>
          element.scrollHeight <= element.clientHeight + 1 &&
          element.scrollWidth <= element.clientWidth + 1,
      ),
      centered:
        Math.abs(
          frame.left + frame.width / 2 - (bounds.left + bounds.width / 2),
        ) < 1,
      contained:
        style.objectFit === "contain" && style.objectPosition === "50% 50%",
      hasImage: image.naturalWidth > 0 && image.naturalHeight > 0,
      hasRoom: frame.height > 70 && frame.width > 100,
      captionBelowImage: frame.bottom <= caption.getBoundingClientRect().top,
      captionInDialog: caption.getBoundingClientRect().bottom <= bounds.bottom,
      frameMatchesImage: Math.abs(frame.width / frame.height - ratio) < 0.01,
      usesViewport:
        paintedWidth >= innerWidth - 52 || paintedHeight >= innerHeight - 144,
      compactHeader:
        dialog.querySelector(".dialog-header").getBoundingClientRect().height <=
        85,
    };
  });
  for (const [check, passed] of Object.entries(layout))
    assert.ok(passed, `${label}: ${check}`);
}

for (const [engine, browserType] of Object.entries({ chromium, firefox })) {
  const browser = await browserType.launch({
    headless: true,
    ...(engine === "chromium" && process.platform === "win32"
      ? {
          executablePath:
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        }
      : {}),
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 914 },
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Hold the full image back to reproduce a slow connection, with thumbnails intact.
    let releaseImage;
    const gate = new Promise((resolve) => (releaseImage = resolve));
    const delayedImage = async (route) => {
      await gate;
      await route.continue();
    };
    await page.route("**/creative/*.jpg", delayedImage);
    await page.locator(".art-tile").first().click();
    await page
      .getByRole("status")
      .filter({ hasText: "Loading artwork" })
      .waitFor();
    const before = await page.locator("dialog").boundingBox();
    assert.equal(await page.locator("dialog img").isVisible(), false);
    await page.screenshot({ path: `artifacts/artwork-${engine}-loading.png` });
    const loadingAccessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      loadingAccessibility.violations.map((entry) => entry.id),
      [],
    );
    releaseImage();
    await page.locator("dialog img.is-ready").waitFor();
    const after = await page.locator("dialog").boundingBox();
    for (const dimension of ["x", "y", "width", "height"])
      assert.ok(
        Math.abs(before[dimension] - after[dimension]) < 1,
        `${engine}: loading shifted ${dimension}`,
      );
    await page.unroute("**/creative/*.jpg", delayedImage);
    const readyAccessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      readyAccessibility.violations.map((entry) => entry.id),
      [],
    );
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "detached" });
    assert.ok(
      await page
        .locator(".art-tile")
        .first()
        .evaluate((element) => element === document.activeElement),
    );

    for (const [name, viewport] of Object.entries({
      desktop: { width: 1920, height: 914 },
      laptop: { width: 1280, height: 720 },
      tablet: { width: 820, height: 1180 },
      mobile: { width: 390, height: 844 },
      compact: { width: 320, height: 720 },
      landscape: { width: 844, height: 390 },
    })) {
      await page.setViewportSize(viewport);
      for (
        let index = 0;
        index < (await page.locator(".art-tile").count());
        index++
      ) {
        await page.locator(".art-tile").nth(index).click();
        await page.locator("dialog img.is-ready").waitFor();
        await checkFit(page, `${engine}/${name}/artwork ${index + 1}`);
        if (index === 1 || index === 5)
          await page.screenshot({
            path: `artifacts/artwork-${engine}-${name}-${index + 1}.png`,
          });
        await page.keyboard.press("Escape");
        await page.locator("dialog").waitFor({ state: "detached" });
      }
      // Writing must still wrap and scroll within the shared dialog shell.
      await page.locator(".creative-tile").first().click();
      const writingFits = await page.locator("dialog").evaluate((dialog) => {
        const body = dialog.querySelector(".dialog-body");
        const bounds = dialog.getBoundingClientRect();
        return (
          bounds.top >= 0 &&
          bounds.bottom <= innerHeight + 1 &&
          body.scrollWidth <= body.clientWidth + 1
        );
      });
      assert.ok(writingFits, `${engine}/${name}: writing overflow`);
      await page.keyboard.press("Escape");
      await page.locator("dialog").waitFor({ state: "detached" });
    }

    // A failed request should explain the problem and recover without reopening.
    const failurePage = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await failurePage.goto(url, { waitUntil: "networkidle" });
    const failImage = (route) =>
      route.fulfill({ status: 503, body: "Unavailable" });
    await failurePage.route("**/creative/*.jpg", failImage);
    await failurePage.locator(".art-tile").first().click();
    await failurePage
      .getByRole("alert")
      .filter({ hasText: "couldn’t load" })
      .waitFor();
    await failurePage.screenshot({
      path: `artifacts/artwork-${engine}-error.png`,
    });
    await failurePage.unroute("**/creative/*.jpg", failImage);
    await failurePage.getByRole("button", { name: "Try again" }).click();
    await failurePage.locator("dialog img.is-ready").waitFor();
    await checkFit(failurePage, `${engine}/retry`);
    await failurePage.close();
    assert.deepEqual(pageErrors, []);
    console.log(
      `${engine}: all six artworks fit at six viewport sizes; loading, retry, accessibility, focus, and writing checks passed.`,
    );
  } finally {
    await browser.close();
  }
}
