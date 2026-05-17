import { create } from 'zustand'
import { PRESETS } from '../lib/presets'

const defaultState = {
  // Format
  posterStyle: 'editorial', // 'editorial' | 'annotated'

  // Layout
  orientation: 'portrait',
  bgColor: '#0d0d0d',

  // Photo
  photoUrl: null,
  photoPosition: 'center 50%',
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

  // Top bar
  eventLabel: 'Your Event · Location',
  aliasPill: '',
  showAliasPill: false,

  // Mid caption (portrait)
  subjectTitle: 'Your Title Here',
  subjectTitleAccentWord: '',
  captionText: 'Add a caption to describe this moment.',

  // Detail grid
  showDetailGrid: true,
  detailRows: [
    { id: '1', label: 'Label', value: 'Value' },
    { id: '2', label: 'Label', value: 'Value' },
  ],

  // Bottom
  nameStamp: 'NAME',
  tagline: 'your tagline goes here',
  tracklist: '',
  photoCredit: 'Photograph by',
  photoLocation: '',
  showPhotoCredit: true,

  // Divider
  showDivider: true,
  dividerOpacity: 0.25,

  // Annotated format
  annotationFont: 'Caveat',
  annotationColor: '#ffffff',
  annotations: [],

  // Magazine cover format
  magLayout: 'standard', // 'standard' | 'forbes'
  magTitle: 'THE MAGAZINE',
  magIssue: 'Volume 01 · April 2026',
  magMainLine: 'Cover Story',
  magMainSub: 'A brief description of the main feature story goes here.',
  magCoverLines: [
    { id: '1', label: 'EXCLUSIVE', text: 'First secondary story headline' },
    { id: '2', label: 'INSIDE', text: 'Second secondary story headline' },
    { id: '3', label: '', text: 'Plus: one more thing inside' },
  ],
  // Newspaper columns overlay
  magTemplateId: '',
  magColumnOpacity: 0.07,

  // Forbes layout fields
  magTickerLines: 'Cover Story One · Cover Story Two · Cover Story Three',
  magSpineText: 'MAGAZINE',
  magSubjectName: 'SUBJECT NAME',
  magSubjectRole: 'Title, Role\nPosition',
  magPullQuote: '"A quote from\nthe subject."',
  magPlusLine: '',
  magFinePrint: '',
}

const usePosterStore = create((set) => ({
  ...defaultState,

  set: (updates) => set(updates),

  setPhoto: (url) => set({ photoUrl: url }),

  addPaletteDot: () => set((s) => {
    if (s.paletteDots.length >= 6) return s
    return { paletteDots: [...s.paletteDots, '#888888'] }
  }),

  removePaletteDot: (index) => set((s) => {
    if (s.paletteDots.length <= 3) return s
    const dots = [...s.paletteDots]
    dots.splice(index, 1)
    return { paletteDots: dots }
  }),

  updatePaletteDot: (index, color) => set((s) => {
    const dots = [...s.paletteDots]
    dots[index] = color
    return { paletteDots: dots }
  }),

  addDetailRow: () => set((s) => {
    if (s.detailRows.length >= 6) return s
    return {
      detailRows: [...s.detailRows, { id: Date.now().toString(), label: '', value: '' }]
    }
  }),

  removeDetailRow: (id) => set((s) => ({
    detailRows: s.detailRows.filter((r) => r.id !== id)
  })),

  updateDetailRow: (id, field, value) => set((s) => ({
    detailRows: s.detailRows.map((r) => r.id === id ? { ...r, [field]: value } : r)
  })),

  reorderDetailRows: (rows) => set({ detailRows: rows }),

  addAnnotation: () => set((s) => ({
    annotations: [
      ...s.annotations,
      { id: Date.now().toString(), text: 'label', x: 30 + Math.random() * 40, y: 30 + Math.random() * 40, fontSize: 14 },
    ],
  })),

  removeAnnotation: (id) => set((s) => ({
    annotations: s.annotations.filter((a) => a.id !== id),
  })),

  updateAnnotation: (id, patch) => set((s) => ({
    annotations: s.annotations.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  })),

  addMagCoverLine: () => set((s) => {
    if (s.magCoverLines.length >= 5) return s
    return { magCoverLines: [...s.magCoverLines, { id: Date.now().toString(), label: '', text: 'Cover line' }] }
  }),

  removeMagCoverLine: (id) => set((s) => ({
    magCoverLines: s.magCoverLines.filter((l) => l.id !== id),
  })),

  updateMagCoverLine: (id, field, value) => set((s) => ({
    magCoverLines: s.magCoverLines.map((l) => l.id === id ? { ...l, [field]: value } : l),
  })),

  loadPreset: (name) => {
    const preset = PRESETS[name]
    if (preset) set(preset)
  },
}))

export default usePosterStore
