import { test, expect } from '@playwright/test'
import { createFromTemplate, openTab, waitSaved } from './helpers'

test.describe('project library', () => {
  test('empty state, then rename / duplicate / delete', async ({ page }) => {
    await page.goto('#/projects')
    await expect(page.getByText('Nothing pinned up yet')).toBeVisible()

    await createFromTemplate(page, 'Golden Hour')
    await waitSaved(page)
    await page.goto('#/projects')
    await expect(page.getByText('Golden Hour poster')).toBeVisible()

    // Rename
    await page.getByRole('button', { name: 'Actions for Golden Hour poster' }).click()
    await page.getByRole('button', { name: 'Rename' }).click()
    await page.getByRole('dialog').getByLabel('Poster name').fill('Dusk study')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Dusk study', { exact: true })).toBeVisible()

    // Duplicate
    await page.getByRole('button', { name: 'Actions for Dusk study' }).click()
    await page.getByRole('button', { name: 'Duplicate' }).click()
    await expect(page.getByText('Dusk study copy')).toBeVisible()

    // Delete (with confirmation)
    await page.getByRole('button', { name: 'Actions for Dusk study copy' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByRole('dialog', { name: 'Delete this poster?' })).toBeVisible()
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByText('Dusk study copy')).toHaveCount(0)
    await expect(page.getByText('Dusk study', { exact: true })).toBeVisible()
  })

  test('project file round-trip', async ({ page }) => {
    await createFromTemplate(page, 'Chrome')
    await openTab(page, 'Text')
    await page.locator('input[value="NAME"]').fill('ROUNDTRIP')
    await waitSaved(page)
    await openTab(page, 'Export')
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Download \.postakit\.json/ }).click(),
    ])
    const path = test.info().outputPath('project.postakit.json')
    await download.saveAs(path)

    await page.goto('#/projects')
    await page.getByTestId('import-input').setInputFiles(path)
    await page.waitForURL(/#\/editor\//)
    await expect(page.getByTestId('stage').locator('.poster-root').getByText('ROUNDTRIP', { exact: true })).toBeVisible()
  })

  test('unknown editor id redirects to the library', async ({ page }) => {
    await page.goto('#/editor/does-not-exist')
    await expect(page).toHaveURL(/#\/projects/)
    await expect(page.getByText('Poster not found')).toBeVisible()
  })
})
