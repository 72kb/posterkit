/**
 * Build the @font-face CSS that html-to-image injects into an export.
 *
 * html-to-image's default embeds every unicode-range subset of every used
 * family (Cyrillic, Greek, Vietnamese…) — ~100 font downloads for one poster.
 * We only embed faces whose unicode-range covers characters that actually
 * appear on the poster, so non-Latin text still exports correctly but a
 * typical poster needs a handful of files.
 */

const dataUrlCache = new Map() // font file url -> Promise<dataURL>

const normalizeFamily = (f) => f.trim().replace(/^["']|["']$/g, '').toLowerCase()

function usedFamilies(node) {
  const set = new Set()
  for (const el of [node, ...node.querySelectorAll('*')]) {
    getComputedStyle(el).fontFamily.split(',').forEach((f) => set.add(normalizeFamily(f)))
  }
  return set
}

function usedCodePoints(node) {
  const set = new Set()
  for (const ch of node.textContent || '') set.add(ch.codePointAt(0))
  // Text is often rendered uppercase via CSS — include both cases.
  for (const ch of (node.textContent || '').toUpperCase()) set.add(ch.codePointAt(0))
  return set
}

/** Parse "U+0000-00FF, U+0131, U+4??" into [start, end] ranges. */
function parseUnicodeRange(value) {
  if (!value) return null
  return value.split(',').map((part) => {
    const v = part.trim().replace(/^U\+/i, '')
    if (v.includes('?')) return [parseInt(v.replace(/\?/g, '0'), 16), parseInt(v.replace(/\?/g, 'F'), 16)]
    const [a, b] = v.split('-')
    return [parseInt(a, 16), parseInt(b ?? a, 16)]
  })
}

function rangeCovers(ranges, codePoints) {
  if (!ranges) return true
  for (const cp of codePoints) {
    for (const [a, b] of ranges) if (cp >= a && cp <= b) return true
  }
  return false
}

function toDataUrl(url) {
  if (!dataUrlCache.has(url)) {
    const p = fetch(url, { mode: 'cors' })
      .then((r) => {
        if (!r.ok) throw new Error(`Font fetch failed: ${r.status}`)
        return r.blob()
      })
      .then((blob) => new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => resolve(fr.result)
        fr.onerror = () => reject(fr.error)
        fr.readAsDataURL(blob)
      }))
    p.catch(() => dataUrlCache.delete(url))
    dataUrlCache.set(url, p)
  }
  return dataUrlCache.get(url)
}

function fontFaceRules() {
  const rules = []
  for (const sheet of document.styleSheets) {
    let list
    try {
      list = sheet.cssRules
    } catch {
      continue // stylesheet without CORS access — skip quietly
    }
    for (const rule of list) {
      if (rule.type === CSSRule.FONT_FACE_RULE) rules.push(rule)
    }
  }
  return rules
}

export async function buildFontEmbedCSS(node) {
  const families = usedFamilies(node)
  const codePoints = usedCodePoints(node)
  const rules = fontFaceRules().filter((r) =>
    families.has(normalizeFamily(r.style.getPropertyValue('font-family')))
    && rangeCovers(parseUnicodeRange(r.style.getPropertyValue('unicode-range')), codePoints))

  const seen = new Set()
  const css = await Promise.all(rules.map(async (rule) => {
    let text = rule.cssText
    if (seen.has(text)) return ''
    seen.add(text)
    const urls = [...text.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1])
    for (const url of urls) {
      if (url.startsWith('data:')) continue
      const abs = new URL(url, rule.parentStyleSheet?.href || location.href).href
      try {
        text = text.replace(url, await toDataUrl(abs))
      } catch {
        return '' // skip a face we can't fetch rather than failing the export
      }
    }
    return text
  }))
  return css.filter(Boolean).join('\n')
}
