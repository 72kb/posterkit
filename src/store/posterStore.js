import { createStore } from 'zustand/vanilla'
import { uid } from '../lib/uid'

/**
 * The poster "document" — everything that describes a single poster.
 * Anything in here is persisted with a project and tracked by undo/redo.
 */
export const DEFAULT_DOC = {
  // Format
  posterStyle: 'editorial', // 'editorial' | 'magazine' | 'annotated'

  // Layout
  orientation: 'portrait',
  bgColor: '#0d0d0d',

  // Photo — `photoId` is persisted, `photoUrl` is a runtime object URL
  photoId: null,
  photoUrl: null,
  photoPosition: '50% 50%',
  photoScale: 100,
  photoHeightPercent: 72,

  // Overlays
  vignetteIntensity: 0.75,
  vignetteDirection: 'bottom',
  grainOpacity: 0.04,
  tintColor: '#000000',
  tintOpacity: 0.0,

  // Palette dots
  paletteDots: ['#333333', '#555555', '#888888', '#BBBBBB', '#FFFFFF'],

  // Typography
  displayFont: 'Bebas Neue',
  bodyFont: 'DM Sans',
  accentColor: '#FFFFFF',
  textColor: '#ffffff',

  // Top bar
  eventLabel: 'Your Event · Location',
  aliasPill: '',
  showAliasPill: false,
  showEventLabel: true,

  // Mid caption (portrait)
  subjectTitle: 'Your Title Here',
  subjectTitleAccentWord: '',
  captionText: 'Add a caption to describe this moment.',
  showCaption: true,
  showSubjectTitle: true,

  // Detail grid
  showDetailGrid: true,
  detailRows: [
    { id: '1', label: 'Label', value: 'Value' },
    { id: '2', label: 'Label', value: 'Value' },
  ],

  // Bottom
  showNameStamp: true,
  nameStamp: 'NAME',
  tagline: 'your tagline goes here',
  showTagline: true,
  tracklist: '',
  showTracklist: true,
  photoCredit: 'Photograph by',
  photoLocation: '',
  showPhotoCredit: true,
  showPhotoLocation: true,

  // Divider
  showDivider: true,
  dividerOpacity: 0.25,

  // Portrait style
  portraitStyle: 'standard', // 'standard' | 'transparent' | 'compact'
  compactPosition: 'bottom-left',

  // Annotated format
  annotationFont: 'Caveat',
  annotationColor: '#ffffff',
  annotations: [],

  // Magazine cover format
  magLayout: 'standard', // 'standard' | 'capital' | 'couture' | 'circuit'
  magTitle: 'THE MAGAZINE',
  magIssue: 'Volume 01 · April 2026',
  magMainLine: 'Cover Story',
  magMainSub: 'A brief description of the main feature story goes here.',
  magCoverLines: [
    { id: '1', label: 'EXCLUSIVE', text: 'First secondary story headline' },
    { id: '2', label: 'INSIDE', text: 'Second secondary story headline' },
    { id: '3', label: '', text: 'Plus: one more thing inside' },
  ],
  magTemplateId: '',
  magColumnOpacity: 0.07,
  magTickerLines: 'Cover Story One · Cover Story Two · Cover Story Three',
  magSpineText: 'MAGAZINE',
  magSubjectName: 'SUBJECT NAME',
  magSubjectRole: 'Title, Role\nPosition',
  magPullQuote: '"A quote from\nthe subject."',
  magPlusLine: '',
  magFinePrint: '',
}

export const DOC_KEYS = Object.keys(DEFAULT_DOC)

/** Fields that are never persisted (runtime only). */
const RUNTIME_KEYS = new Set(['photoUrl'])

export const MAX_DETAIL_ROWS = 6
export const MAX_COVER_LINES = 5
export const MAX_PALETTE_DOTS = 6
export const MIN_PALETTE_DOTS = 3

const HISTORY_LIMIT = 100
const COALESCE_MS = 450

/** Pick only known document keys from an object. */
export function pickDoc(obj) {
  const out = {}
  for (const k of DOC_KEYS) if (obj[k] !== undefined) out[k] = obj[k]
  return out
}

/** Serialisable copy of a doc (strips runtime-only fields). */
export function serializeDoc(state) {
  const out = {}
  for (const k of DOC_KEYS) if (!RUNTIME_KEYS.has(k)) out[k] = state[k]
  return out
}

/**
 * Normalise legacy / partial docs so older saves keep working.
 */
export function normalizeDoc(doc = {}) {
  const d = { ...DEFAULT_DOC, ...pickDoc(doc) }
  const legacyLayouts = { forbes: 'capital', vogue: 'couture', wired: 'circuit' }
  if (legacyLayouts[d.magLayout]) d.magLayout = legacyLayouts[d.magLayout]
  if (d.magTemplateId === 'the-times') d.magTemplateId = 'broadsheet'
  if (!['editorial', 'magazine', 'annotated'].includes(d.posterStyle)) d.posterStyle = 'editorial'
  return d
}

/**
 * Create an isolated poster store. Each editor session, preview card and
 * landing-page showcase gets its own store so they never interfere.
 *
 * @param {object} initial  partial doc
 * @param {{history?: boolean}} opts
 */
export function createPosterStore(initial = {}, { history = true } = {}) {
  let past = []
  let future = []
  let lastCommit = { keys: '', at: 0 }

  const snapshot = (s) => {
    const snap = {}
    for (const k of DOC_KEYS) snap[k] = s[k]
    return snap
  }

  return createStore((set, get) => {
    /**
     * Apply a doc patch, recording an undo step. Rapid successive changes to
     * the same set of keys (e.g. dragging a slider or typing) are coalesced
     * into a single undo step.
     */
    const commit = (patchOrFn, { coalesce = true } = {}) => {
      const state = get()
      const patch = typeof patchOrFn === 'function' ? patchOrFn(state) : patchOrFn
      if (!patch || patch === state) return
      const keys = Object.keys(patch).filter((k) => patch[k] !== state[k])
      if (keys.length === 0) return

      if (history) {
        const now = Date.now()
        const keySig = keys.sort().join(',')
        const canMerge = coalesce && keySig === lastCommit.keys && now - lastCommit.at < COALESCE_MS
        if (!canMerge) {
          past.push(snapshot(state))
          if (past.length > HISTORY_LIMIT) past.shift()
        }
        future = []
        lastCommit = { keys: keySig, at: now }
      }
      set({ ...patch, canUndo: past.length > 0, canRedo: false, revision: state.revision + 1 })
    }

    return {
      ...normalizeDoc(initial),
      canUndo: false,
      canRedo: false,
      /** Increments on every doc change — handy for autosave subscriptions. */
      revision: 0,

      set: (patch) => commit(patch),

      /** Replace without recording history (loading a project, resolving a photo URL). */
      replace: (patch) => set(patch),

      undo: () => {
        if (!past.length) return
        const prev = past.pop()
        future.push(snapshot(get()))
        lastCommit = { keys: '', at: 0 }
        set({ ...prev, canUndo: past.length > 0, canRedo: true, revision: get().revision + 1 })
      },

      redo: () => {
        if (!future.length) return
        const next = future.pop()
        past.push(snapshot(get()))
        lastCommit = { keys: '', at: 0 }
        set({ ...next, canUndo: true, canRedo: future.length > 0, revision: get().revision + 1 })
      },

      clearHistory: () => {
        past = []
        future = []
        set({ canUndo: false, canRedo: false })
      },

      setPhoto: (photoId, photoUrl) => commit({ photoId, photoUrl }, { coalesce: false }),

      applyTemplate: (template) => commit(template, { coalesce: false }),

      addPaletteDot: () => commit((s) =>
        s.paletteDots.length >= MAX_PALETTE_DOTS ? null : { paletteDots: [...s.paletteDots, '#888888'] },
        { coalesce: false }),

      removePaletteDot: (index) => commit((s) => {
        if (s.paletteDots.length <= MIN_PALETTE_DOTS) return null
        return { paletteDots: s.paletteDots.filter((_, i) => i !== index) }
      }, { coalesce: false }),

      updatePaletteDot: (index, color) => commit((s) => ({
        paletteDots: s.paletteDots.map((c, i) => (i === index ? color : c)),
      })),

      addDetailRow: () => commit((s) =>
        s.detailRows.length >= MAX_DETAIL_ROWS ? null
          : { detailRows: [...s.detailRows, { id: uid(), label: 'Label', value: 'Value' }], showDetailGrid: true },
        { coalesce: false }),

      removeDetailRow: (id) => commit((s) => ({ detailRows: s.detailRows.filter((r) => r.id !== id) }), { coalesce: false }),

      updateDetailRow: (id, field, value) => commit((s) => ({
        detailRows: s.detailRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
      })),

      reorderDetailRows: (rows) => commit({ detailRows: rows }, { coalesce: false }),

      addAnnotation: () => commit((s) => ({
        annotations: [
          ...s.annotations,
          { id: uid(), text: 'label', x: 30 + Math.random() * 40, y: 30 + Math.random() * 40, fontSize: 16 },
        ],
      }), { coalesce: false }),

      removeAnnotation: (id) => commit((s) => ({ annotations: s.annotations.filter((a) => a.id !== id) }), { coalesce: false }),

      updateAnnotation: (id, patch) => commit((s) => ({
        annotations: s.annotations.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      })),

      addMagCoverLine: () => commit((s) =>
        s.magCoverLines.length >= MAX_COVER_LINES ? null
          : { magCoverLines: [...s.magCoverLines, { id: uid(), label: '', text: 'Cover line' }] },
        { coalesce: false }),

      removeMagCoverLine: (id) => commit((s) => ({ magCoverLines: s.magCoverLines.filter((l) => l.id !== id) }), { coalesce: false }),

      updateMagCoverLine: (id, field, value) => commit((s) => ({
        magCoverLines: s.magCoverLines.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      })),
    }
  })
}
