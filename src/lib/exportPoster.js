import { selection } from './selection'
import { buildFontEmbedCSS } from './fontEmbed'

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()))

const isSafari = typeof navigator !== 'undefined'
  && /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)

/** Strip editor-only chrome (selection toolbars etc.) from the export clone. */
const exportFilter = (node) => !(node instanceof HTMLElement && node.dataset?.exportIgnore === 'true')

export function slugify(name) {
  return (name || 'postakit')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .slice(0, 60) || 'postakit'
}

async function prepare(node) {
  if (!node) throw new Error('Nothing to export')
  selection.clear()
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  await document.fonts.ready
  // Let React flush the deselect before we clone the DOM.
  await nextFrame()
  await nextFrame()
}

async function render(fn, node, opts) {
  const [lib, fontEmbedCSS] = await Promise.all([import('html-to-image'), buildFontEmbedCSS(node)])
  const impl = fn === 'jpeg' ? lib.toJpeg : lib.toPng
  const options = { cacheBust: false, filter: exportFilter, fontEmbedCSS, ...opts }
  // Safari sometimes drops images/fonts on the first pass — render twice.
  if (isSafari) await impl(node, options).catch(() => null)
  return impl(node, options)
}

function download(href, filename) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const EXPORT_TIMEOUT = 60_000

/** Export the poster node. Rejects (rather than hanging) after 60s. */
export function exportPoster(node, format, opts) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Export timed out — check your connection and try again.')), EXPORT_TIMEOUT)
  })
  return Promise.race([runExport(node, format, opts), timeout]).finally(() => clearTimeout(timer))
}

async function runExport(node, format, { name, pixelRatio } = {}) {
  await prepare(node)
  const base = `${slugify(name)}-${new Date().toISOString().slice(0, 10)}`
  const bg = getComputedStyle(node).backgroundColor || '#0d0d0d'

  if (format === 'png') {
    const url = await render('png', node, { pixelRatio: pixelRatio ?? 2 })
    download(url, `${base}.png`)
    return
  }

  if (format === 'jpg') {
    const url = await render('jpeg', node, { pixelRatio: pixelRatio ?? 2, quality: 0.92, backgroundColor: bg })
    download(url, `${base}.jpg`)
    return
  }

  if (format === 'pdf') {
    const [{ jsPDF }, url] = await Promise.all([
      import('jspdf'),
      render('png', node, { pixelRatio: pixelRatio ?? 3 }),
    ])
    const w = node.offsetWidth
    const h = node.offsetHeight
    const portrait = h >= w
    const pdf = new jsPDF({ orientation: portrait ? 'portrait' : 'landscape', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    // Fit inside the page with a small margin, preserving aspect ratio.
    const margin = 6
    const scale = Math.min((pageW - margin * 2) / w, (pageH - margin * 2) / h)
    const dw = w * scale
    const dh = h * scale
    const [r = 13, g = 13, b = 13] = (bg.match(/\d+(\.\d+)?/g) || []).map(Number)
    pdf.setFillColor(r, g, b)
    pdf.rect(0, 0, pageW, pageH, 'F')
    pdf.addImage(url, 'PNG', (pageW - dw) / 2, (pageH - dh) / 2, dw, dh)
    pdf.save(`${base}.pdf`)
    return
  }

  throw new Error(`Unknown export format: ${format}`)
}
