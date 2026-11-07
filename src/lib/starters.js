import { TEMPLATES } from './templates'
import { MAG_TEMPLATES } from './magTemplates'
import { SHOWCASE } from './showcase'
import { createProject } from './projects'
import { getSampleBlob } from './samplePhotos'

/**
 * Keys a template is allowed to change when applied to an existing poster.
 * Everything else (text, photo, framing, orientation) belongs to the user.
 */
export const STYLE_KEYS = [
  'posterStyle', 'bgColor', 'vignetteIntensity', 'vignetteDirection', 'grainOpacity',
  'tintColor', 'tintOpacity', 'paletteDots', 'displayFont', 'bodyFont', 'accentColor',
  'textColor', 'dividerOpacity', 'magLayout', 'magTemplateId', 'magColumnOpacity',
  'annotationFont', 'annotationColor',
]

export function styleOnly(template) {
  const out = {}
  for (const k of STYLE_KEYS) if (template[k] !== undefined) out[k] = template[k]
  return out
}

/** Which procedural scene best shows off each template. */
export const TEMPLATE_SCENES = {
  'dark-editorial': 'dusk', 'minimal-white': 'coast', 'golden-hour': 'dunes', 'neon-drift': 'neon',
  'film-stock': 'dunes', blueprint: 'city', sakura: 'dusk', jungle: 'forest', chrome: 'city', 'sunset-city': 'city',
  capital: 'city', broadsheet: 'coast', couture: 'coast', circuit: 'neon', chronicle: 'dusk',
  expedition: 'forest', amplified: 'dusk', quarterly: 'city',
}

/** Friendly demo copy so template previews don't read "YOUR TITLE HERE". */
export const DEMO_CONTENT = {
  eventLabel: 'Summer Sessions · Lisbon',
  subjectTitle: 'GOLDEN HOUR',
  subjectTitleAccentWord: 'HOUR',
  captionText: 'The last light of the day, caught on the way home.',
  detailRows: [
    { id: '1', label: 'Place', value: 'Miradouro, Lisbon' },
    { id: '2', label: 'Date', value: '21 June 2026' },
  ],
  nameStamp: 'SOLSTICE',
  tagline: 'long days · short nights',
  tracklist: 'Warm light · Tiled roofs · Salt air · Slow evenings',
  photoCredit: 'Photograph by you',
  photoLocation: 'Lisbon (2026)',
}

export const FORMATS = [
  { id: 'editorial', name: 'Editorial poster', blurb: 'Gallery-wall anatomy: palette dots, headline, details grid and a big name stamp.' },
  { id: 'magazine', name: 'Magazine cover', blurb: 'Full-bleed photo with masthead, cover lines and pull quotes in four layouts.' },
  { id: 'annotated', name: 'Annotated print', blurb: 'Your photo with draggable handwritten notes — field journal style.' },
]

export function templateById(id) {
  return TEMPLATES.find((t) => t.id === id) || MAG_TEMPLATES.find((t) => t.id === id) || null
}

/** Preview doc for a template card. */
export function templatePreviewDoc(t) {
  const isMag = t.template.posterStyle === 'magazine'
  // Editorial templates carry placeholder copy — swap in demo copy for the preview.
  return isMag ? { ...t.template } : { ...t.template, ...DEMO_CONTENT }
}

/**
 * Create a new project from an example, a template, or a blank format.
 * Returns the created project.
 */
export async function startProject({ exampleId, templateId, format = 'editorial', photoBlob = null } = {}) {
  if (exampleId) {
    const ex = SHOWCASE.find((e) => e.id === exampleId)
    if (ex) {
      return createProject({ name: ex.name, doc: ex.doc, photoBlob: photoBlob || await getSampleBlob(ex.photo) })
    }
  }
  if (templateId) {
    const t = templateById(templateId)
    if (t) {
      const isMag = t.template.posterStyle === 'magazine'
      const doc = isMag ? { ...t.template } : { posterStyle: 'editorial', ...t.template }
      return createProject({
        name: `${t.name} poster`,
        doc,
        photoBlob: photoBlob || await getSampleBlob(TEMPLATE_SCENES[t.id] || 'dusk'),
      })
    }
  }
  const blank = {
    editorial: { posterStyle: 'editorial' },
    magazine: { posterStyle: 'magazine' },
    annotated: {
      posterStyle: 'annotated',
      annotations: [{ id: 'a1', text: 'write something here', x: 50, y: 40, fontSize: 24 }],
    },
  }[format] || { posterStyle: 'editorial' }
  return createProject({
    name: 'Untitled poster',
    doc: blank,
    photoBlob: photoBlob || await getSampleBlob(format === 'magazine' ? 'coast' : format === 'annotated' ? 'forest' : 'dusk'),
  })
}
