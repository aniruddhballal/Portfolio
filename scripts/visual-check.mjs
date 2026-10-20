import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const url = process.env.PORTFOLIO_TEST_URL ?? 'http://localhost:5173/'
const executablePath = process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : undefined
const browser = await chromium.launch({ headless: true, executablePath })
const errors = []
await mkdir('artifacts', { recursive: true })

for (const [name, viewport] of Object.entries({
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
})) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`))
  const response = await page.goto(url, { waitUntil: 'networkidle' })
  if (response?.status() !== 200) throw new Error(`${name}: HTTP ${response?.status()}`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join('artifacts', `revamp2-${name}.png`), fullPage: true })
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  if (horizontalOverflow > 1) errors.push(`${name}: horizontal overflow ${horizontalOverflow}px`)
  if (name === 'desktop') {
    await page.getByRole('button', { name: 'Security', exact: true }).click()
    const count = await page.locator('.project-row').count()
    if (count !== 2) errors.push(`Security filter returned ${count} projects`)
    const first = page.locator('.project-row summary').first()
    await first.focus()
    await page.keyboard.press('Enter')
    if (!(await page.locator('.project-row').first().getAttribute('open') !== null)) errors.push('Project details failed to open by keyboard')
    await page.locator('.creative-tile').first().click()
    if (!(await page.locator('dialog').isVisible())) errors.push('Writing dialog did not open')
    await page.keyboard.press('Escape')
    if (await page.locator('dialog').count()) errors.push('Writing dialog did not close on Escape')
    await page.getByRole('button', { name: 'Annual' }).click()
    if (!(await page.getByText('annual view', { exact: false }).count())) errors.push('Annual Strava view failed')
  }
  if (name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click()
    if (!(await page.getByRole('navigation', { name: 'Mobile navigation' }).isVisible())) errors.push('Mobile menu did not open')
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Practice' }).click()
    if (await page.getByRole('navigation', { name: 'Mobile navigation' }).count()) errors.push('Mobile menu did not close after navigation')
  }
  await page.close()
}

await browser.close()
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log('Desktop, tablet, mobile screenshots and interactions passed.')
}
