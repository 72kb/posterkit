const gf = (family) => `https://fonts.googleapis.com/css2?family=${family}&display=swap`

export const DISPLAY_FONTS = [
  { name: 'Bebas Neue', url: gf('Bebas+Neue') },
  { name: 'Anton', url: gf('Anton') },
  { name: 'Barlow Condensed', url: gf('Barlow+Condensed:wght@600;700;800;900') },
  { name: 'Big Shoulders Display', url: gf('Big+Shoulders+Display:wght@700;900') },
  { name: 'Black Han Sans', url: gf('Black+Han+Sans') },
  { name: 'Staatliches', url: gf('Staatliches') },
]

export const SERIF_FONTS = [
  { name: 'Playfair Display', url: gf('Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700') },
  { name: 'Abril Fatface', url: gf('Abril+Fatface') },
  { name: 'Bodoni Moda', url: gf('Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700') },
  { name: 'EB Garamond', url: gf('EB+Garamond:ital,wght@0,400;0,700;1,400') },
  { name: 'Cormorant Garamond', url: gf('Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400') },
  { name: 'Libre Baskerville', url: gf('Libre+Baskerville:ital,wght@0,400;0,700;1,400') },
  { name: 'UnifrakturMaguntia', url: gf('UnifrakturMaguntia') },
]

export const BODY_FONTS = [
  { name: 'DM Sans', url: gf('DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400') },
  { name: 'Inter', url: gf('Inter:wght@300;400;500;600;700') },
  { name: 'Outfit', url: gf('Outfit:wght@300;400;500;700') },
  { name: 'Space Grotesk', url: gf('Space+Grotesk:wght@300;400;500;700') },
  { name: 'Syne', url: gf('Syne:wght@400;500;600;700') },
  { name: 'Epilogue', url: gf('Epilogue:ital,wght@0,300;0,400;0,700;1,300;1,400') },
]

export const HANDWRITING_FONTS = [
  { name: 'Caveat', url: gf('Caveat:wght@400;700') },
  { name: 'Kalam', url: gf('Kalam:wght@300;400') },
  { name: 'Patrick Hand', url: gf('Patrick+Hand') },
  { name: 'Permanent Marker', url: gf('Permanent+Marker') },
]

export const ALL_FONTS = [...DISPLAY_FONTS, ...SERIF_FONTS, ...BODY_FONTS, ...HANDWRITING_FONTS]

/** Font groups offered in the pickers. */
export const HEADLINE_FONT_GROUPS = [
  { label: 'Display', fonts: DISPLAY_FONTS },
  { label: 'Serif', fonts: SERIF_FONTS },
]
export const BODY_FONT_GROUPS = [
  { label: 'Sans', fonts: BODY_FONTS },
  { label: 'Serif', fonts: SERIF_FONTS },
]
export const LABEL_FONT_GROUPS = [
  { label: 'Handwriting', fonts: HANDWRITING_FONTS },
  { label: 'Sans', fonts: BODY_FONTS },
]

const loaded = new Map() // url -> Promise

/**
 * Inject a Google Fonts stylesheet. `crossOrigin` is required so the export
 * pipeline (html-to-image) can read the @font-face rules and embed the fonts.
 */
export function loadFont(url) {
  if (!url) return Promise.resolve()
  if (loaded.has(url)) return loaded.get(url)
  const p = new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.crossOrigin = 'anonymous'
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  })
  loaded.set(url, p)
  return p
}

export function loadFontByName(name) {
  const f = ALL_FONTS.find((x) => x.name === name)
  return f ? loadFont(f.url) : Promise.resolve()
}

/** Make sure every font a poster doc references is loaded (and actually ready). */
export async function ensureDocFonts(doc) {
  const names = [doc.displayFont, doc.bodyFont]
  if (doc.posterStyle === 'annotated') names.push(doc.annotationFont)
  await Promise.all(names.filter(Boolean).map(loadFontByName))
  // Ask the browser to actually fetch the faces we use.
  await Promise.all(
    names.filter(Boolean).map((n) => document.fonts?.load?.(`16px "${n}"`).catch(() => null)),
  )
}

/** Like ensureDocFonts, but never waits longer than `ms` (UI stays snappy on slow networks). */
export function ensureDocFontsQuick(doc, ms = 450) {
  return Promise.race([ensureDocFonts(doc), new Promise((r) => setTimeout(r, ms))])
}
