/**
 * Parses a PosterKit AI import JSON (nested schema) into a flat Zustand store patch.
 * Unknown keys and _comment fields are ignored.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export function parseImport(raw) {
  try {
    const json = typeof raw === 'string' ? JSON.parse(raw) : raw
    const patch = {}

    // Layout
    if (json.layout) {
      if (json.layout.orientation) patch.orientation = json.layout.orientation
    }

    // Photo
    if (json.photo) {
      const p = json.photo
      if (p.photoPosition    !== undefined) patch.photoPosition    = p.photoPosition
      if (p.photoScale       !== undefined) patch.photoScale       = Number(p.photoScale)
      if (p.photoHeightPercent !== undefined) patch.photoHeightPercent = Number(p.photoHeightPercent)
    }

    // Palette
    if (json.palette) {
      const p = json.palette
      if (Array.isArray(p.paletteDots) && p.paletteDots.length >= 3) {
        patch.paletteDots = p.paletteDots.filter((c) => isHex(c))
      }
      if (isHex(p.accentColor)) patch.accentColor = p.accentColor
      if (isHex(p.bgColor))     patch.bgColor     = p.bgColor
    }

    // Typography
    if (json.typography) {
      const t = json.typography
      if (t.displayFont) patch.displayFont = t.displayFont
      if (t.bodyFont)    patch.bodyFont    = t.bodyFont
    }

    // Top bar
    if (json.topBar) {
      const t = json.topBar
      if (t.eventLabel     !== undefined) patch.eventLabel     = t.eventLabel
      if (t.aliasPill      !== undefined) patch.aliasPill      = t.aliasPill
      if (t.showAliasPill  !== undefined) patch.showAliasPill  = Boolean(t.showAliasPill)
    }

    // Subject
    if (json.subject) {
      const s = json.subject
      if (s.subjectTitle           !== undefined) patch.subjectTitle           = s.subjectTitle
      if (s.subjectTitleAccentWord !== undefined) patch.subjectTitleAccentWord = s.subjectTitleAccentWord
      if (s.captionText            !== undefined) patch.captionText            = s.captionText
    }

    // Details
    if (json.details) {
      const d = json.details
      if (d.showDetailGrid !== undefined) patch.showDetailGrid = Boolean(d.showDetailGrid)
      if (Array.isArray(d.detailRows)) {
        patch.detailRows = d.detailRows
          .slice(0, 6)
          .map((r, i) => ({
            id: String(r.id ?? Date.now() + i),
            label: String(r.label ?? ''),
            value: String(r.value ?? ''),
          }))
      }
    }

    // Footer
    if (json.footer) {
      const f = json.footer
      if (f.nameStamp       !== undefined) patch.nameStamp       = f.nameStamp
      if (f.tagline         !== undefined) patch.tagline         = f.tagline
      if (f.tracklist       !== undefined) patch.tracklist       = f.tracklist
      if (f.photoCredit     !== undefined) patch.photoCredit     = f.photoCredit
      if (f.photoLocation   !== undefined) patch.photoLocation   = f.photoLocation
      if (f.showPhotoCredit !== undefined) patch.showPhotoCredit = Boolean(f.showPhotoCredit)
    }

    // Overlays
    if (json.overlays) {
      const o = json.overlays
      if (o.vignetteIntensity !== undefined) patch.vignetteIntensity = clamp(Number(o.vignetteIntensity), 0, 1)
      if (o.vignetteDirection)               patch.vignetteDirection = o.vignetteDirection
      if (o.grainOpacity      !== undefined) patch.grainOpacity      = clamp(Number(o.grainOpacity), 0, 0.3)
      if (isHex(o.tintColor))                patch.tintColor         = o.tintColor
      if (o.tintOpacity       !== undefined) patch.tintOpacity       = clamp(Number(o.tintOpacity), 0, 0.5)
    }

    // Divider
    if (json.divider) {
      const d = json.divider
      if (d.showDivider    !== undefined) patch.showDivider    = Boolean(d.showDivider)
      if (d.dividerOpacity !== undefined) patch.dividerOpacity = clamp(Number(d.dividerOpacity), 0, 1)
    }

    if (Object.keys(patch).length === 0) {
      return { ok: false, error: 'No recognisable fields found in the JSON.' }
    }

    return { ok: true, data: patch }
  } catch (e) {
    return { ok: false, error: `Invalid JSON: ${e.message}` }
  }
}

const isHex = (v) => typeof v === 'string' && /^#[0-9A-Fa-f]{3,8}$/.test(v)
const clamp = (v, min, max) => Math.min(max, Math.max(min, isNaN(v) ? min : v))
