import { test, expect } from '@playwright/test'

test('mobile editor uses a bottom tab bar and sheet', async ({ page }) => {
  await page.goto('#/new')
  await page.getByRole('button', { name: /Dark Editorial/ }).first().click()
  await page.waitForURL(/#\/editor\//)
  const poster = page.getByTestId('stage').locator('.poster-root')
  await expect(poster).toBeVisible()

  // Poster fits within the viewport width
  const vw = page.viewportSize().width
  const box = await poster.boundingBox()
  expect(box.width).toBeLessThanOrEqual(vw)

  const bar = page.getByRole('navigation', { name: 'Editor tools' })
  await expect(bar).toBeVisible()
  await bar.getByRole('button', { name: 'Style' }).click()
  await expect(page.getByRole('heading', { name: 'Style' })).toBeVisible()
  await page.getByRole('button', { name: 'Close panel' }).click()
  await expect(page.getByRole('heading', { name: 'Style' })).toHaveCount(0)

  // No horizontal page scroll
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})

test('landing has no horizontal overflow on phones', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(800)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})
