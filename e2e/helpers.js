import { expect } from '@playwright/test'
import zlib from 'node:zlib'

/** Collect console errors / page errors for a test. */
export function trackErrors(page) {
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  return errors
}

/** Create a poster from a template via the New page and land in the editor. */
export async function createFromTemplate(page, name = 'Dark Editorial') {
  await page.goto('#/new')
  await page.getByRole('button', { name: new RegExp(name) }).first().click()
  await page.waitForURL(/#\/editor\//)
  await expect(canvas(page)).toBeVisible()
}

export function canvas(page) {
  return page.getByTestId('stage').locator('.poster-root')
}

export async function openTab(page, label) {
  await page.getByRole('navigation', { name: 'Editor tools' }).getByRole('button', { name: label, exact: true }).click()
}

export async function waitSaved(page) {
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
}

/** A small valid PNG (solid colour) generated without a canvas. */
export function makePng(width = 64, height = 48, rgb = [200, 80, 40]) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc = (buf) => {
    let c = 0xffffffff
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type), data])
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td))
    return Buffer.concat([len, td, c])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: width }, () => rgb).flat())])
  const raw = Buffer.concat(Array.from({ length: height }, () => row))
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
