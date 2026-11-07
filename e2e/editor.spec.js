import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { canvas, createFromTemplate, makePng, openTab, trackErrors, waitSaved } from './helpers'

test.describe('editor workflow', () => {
  test('landing renders and CTA opens the new-poster flow', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('editorial eye')
    await page.getByRole('link', { name: 'Start designing' }).click()
    await expect(page).toHaveURL(/#\/new/)
    await expect(page.getByRole('heading', { name: 'What are we making?' })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('create → upload photo → edit text inline → undo/redo', async ({ page }) => {
    const errors = trackErrors(page)
    await createFromTemplate(page)

    // Upload a photo through the Photo tab
    await openTab(page, 'Photo')
    await page.getByTestId('photo-input').setInputFiles({ name: 'shot.png', mimeType: 'image/png', buffer: makePng(320, 240) })
    await expect(canvas(page).locator('img')).toHaveAttribute('src', /^blob:/)

    // Inline edit: click selects, second click edits
    const stamp = canvas(page).locator('.poster-editable').filter({ hasText: /^NAME/ })
    await stamp.click()
    await expect(page.locator('.poster-action-bar')).toBeVisible()
    await stamp.click()
    const editor = canvas(page).locator('[contenteditable]')
    await expect(editor).toBeFocused()
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.type('NOCTURNE')
    await page.keyboard.press('Enter')
    await expect(canvas(page).getByText('NOCTURNE', { exact: true })).toBeVisible()

    // Undo / redo via keyboard
    await page.locator('body').click({ position: { x: 5, y: 300 } })
    await page.keyboard.press('ControlOrMeta+Z')
    await expect(canvas(page).getByText('NAME', { exact: true })).toBeVisible()
    await page.keyboard.press('ControlOrMeta+Shift+Z')
    await expect(canvas(page).getByText('NOCTURNE', { exact: true })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('applying a template keeps the user’s text', async ({ page }) => {
    await createFromTemplate(page)
    await openTab(page, 'Text')
    const stampInput = page.locator('input[value="NAME"]')
    await stampInput.fill('KEEP ME')
    await openTab(page, 'Templates')
    await page.getByRole('button', { name: /Neon Drift/ }).click()
    await expect(canvas(page).getByText('KEEP ME', { exact: true })).toBeVisible()
    // accent colour changed to Neon Drift's cyan
    await expect(canvas(page).getByText('KEEP ME', { exact: true })).toHaveCSS('color', 'rgb(0, 212, 255)')
  })

  test('clearing text hides the element (undoable)', async ({ page }) => {
    await createFromTemplate(page)
    const tagline = canvas(page).getByText('your tagline goes here')
    await tagline.dblclick()
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Enter')
    await expect(canvas(page).getByText('your tagline goes here')).toHaveCount(0)
    await page.keyboard.press('ControlOrMeta+Z')
    await expect(canvas(page).getByText('your tagline goes here')).toBeVisible()

    // Re-show from the panel: the toggle brings back the kept text
    await openTab(page, 'Text')
    await expect(page.locator('input[value="your tagline goes here"]')).toBeVisible()
  })

  test('Delete hides the selected element and undo brings it back', async ({ page }) => {
    await createFromTemplate(page)
    await canvas(page).getByText('your tagline goes here').click()
    await page.keyboard.press('Delete')
    await expect(canvas(page).getByText('your tagline goes here')).toHaveCount(0)
    await page.keyboard.press('ControlOrMeta+Z')
    await expect(canvas(page).getByText('your tagline goes here')).toBeVisible()
  })

  test('exports PNG, JPG and PDF without editor chrome', async ({ page }) => {
    const errors = trackErrors(page)
    await createFromTemplate(page)
    // Leave something selected — export must strip the selection UI
    await canvas(page).getByText('NAME', { exact: true }).click()

    for (const fmt of ['png', 'jpg', 'pdf']) {
      await page.getByRole('button', { name: 'Export' }).first().click()
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('menuitem', { name: new RegExp(fmt, 'i') }).click(),
      ])
      expect(download.suggestedFilename()).toMatch(new RegExp(`\\.${fmt}$`))
      const file = await download.path()
      expect(fs.statSync(file).size).toBeGreaterThan(10_000)
      if (fmt === 'png') await download.saveAs(test.info().outputPath('export.png'))
      await expect(page.getByText(`Exported ${fmt.toUpperCase()}`)).toBeVisible()
    }
    await expect(page.locator('.poster-action-bar')).toHaveCount(0)
    expect(errors.filter((e) => /cssRules|SecurityError/.test(e))).toEqual([])
  })

  test('autosaves and restores after reload (including photo)', async ({ page }) => {
    await createFromTemplate(page)
    await openTab(page, 'Photo')
    await page.getByTestId('photo-input').setInputFiles({ name: 'p.png', mimeType: 'image/png', buffer: makePng(200, 200, [10, 200, 90]) })
    await openTab(page, 'Text')
    await page.locator('input[value="NAME"]').fill('PERSISTED')
    await waitSaved(page)
    await page.reload()
    await expect(canvas(page).getByText('PERSISTED', { exact: true })).toBeVisible()
    await expect(canvas(page).locator('img')).toHaveAttribute('src', /^blob:/)
  })

  test('magazine format: all templates available and restyle works', async ({ page }) => {
    await createFromTemplate(page)
    await page.getByRole('radio', { name: 'Magazine' }).click()
    await openTab(page, 'Templates')
    const cards = page.locator('aside').getByRole('button').filter({ has: page.locator('.poster-root') })
    await expect(cards).toHaveCount(8)
    await page.getByRole('button', { name: /Circuit/ }).click()
    await openTab(page, 'Cover')
    await page.getByLabel('Publication name').fill('SIGNAL')
    await expect(canvas(page).getByText('SIGNAL', { exact: true })).toBeVisible()
  })

  test('annotated format: add and drag a label', async ({ page }) => {
    await createFromTemplate(page)
    await page.getByRole('radio', { name: 'Annotated' }).click()
    await openTab(page, 'Labels')
    await page.getByRole('button', { name: 'Add label' }).click()
    const label = canvas(page).locator('.poster-annotation').last()
    const before = await label.boundingBox()
    await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
    await page.mouse.down()
    await page.mouse.move(before.x + 80, before.y + 60, { steps: 8 })
    await page.mouse.up()
    const after = await label.boundingBox()
    expect(Math.abs(after.x - before.x)).toBeGreaterThan(30)
  })

  test('keyboard shortcuts dialog opens with ?', async ({ page }) => {
    await createFromTemplate(page)
    await page.locator('body').click({ position: { x: 5, y: 300 } })
    await page.keyboard.press('Shift+?')
    await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})
