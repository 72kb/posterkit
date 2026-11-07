import { TEMPLATES } from './templates'
import { MAG_TEMPLATES } from './magTemplates'

const tpl = (id) => TEMPLATES.find((t) => t.id === id)?.template ?? {}
const mag = (id) => MAG_TEMPLATES.find((t) => t.id === id)?.template ?? {}

/**
 * Fully-art-directed sample posters used on the landing page and as
 * starting points ("Start from an example").
 * `photo` names a procedural scene from samplePhotos.js.
 */
export const SHOWCASE = [
  {
    id: 'car-park-drift',
    name: 'Car Park Drift',
    photo: 'dusk',
    doc: {
      ...tpl('dark-editorial'),
      photoPosition: '50% 60%',
      eventLabel: 'Car Park Drift · Lagos',
      aliasPill: '72kb',
      showAliasPill: true,
      subjectTitle: 'BMW E30 316i',
      subjectTitleAccentWord: '316i',
      captionText: '99% street, 1% circuit.\nRiding into the golden hour after burning the square to the ground.',
      detailRows: [
        { id: '1', label: 'Vehicle', value: 'BMW E30 316i · 1982–1994' },
        { id: '2', label: 'Event', value: 'Car Park Drift' },
        { id: '3', label: 'Location', value: 'Tafawa Balewa Square, Lagos' },
        { id: '4', label: 'Date', value: '18 April 2026 · Golden Hour' },
      ],
      nameStamp: '72KB',
      tagline: 'When the tyres let go · so does everything else',
      tracklist: 'Tyre smoke · Concrete · Sunset · Lagos energy\nStadium brutalism · Red wheels on white',
      photoCredit: 'Photograph by 72kb',
      photoLocation: 'Lagos, Nigeria (2026)',
    },
  },
  {
    id: 'couture',
    name: 'Maison',
    photo: 'coast',
    doc: { ...mag('couture'), magSubjectName: 'Ada Okafor', magMainLine: 'THE QUIET\nLUXURY ISSUE' },
  },
  {
    id: 'last-light',
    name: 'Last Light',
    photo: 'dunes',
    doc: {
      ...tpl('golden-hour'),
      portraitStyle: 'transparent',
      eventLabel: 'Golden Hour · Dusk Session',
      aliasPill: 'GH',
      showAliasPill: true,
      subjectTitle: 'LAST LIGHT',
      subjectTitleAccentWord: 'LIGHT',
      captionText: 'Everything turns amber at 6pm.\nChase the light before it disappears.',
      detailRows: [
        { id: '1', label: 'Time', value: '18:42 · Dusk' },
        { id: '2', label: 'Location', value: 'The Dunes' },
        { id: '3', label: 'Film', value: 'Portra 400' },
      ],
      nameStamp: 'GOLDEN',
      tagline: 'before the sun sets · after everything else',
      tracklist: 'Amber · Dust · Warmth · Long shadows · Silence',
      photoCredit: 'Photograph at golden hour',
      photoLocation: 'Somewhere warm, 2026',
    },
  },
  {
    id: 'circuit',
    name: 'Circuit',
    photo: 'neon',
    doc: { ...mag('circuit') },
  },
  {
    id: 'field-notes',
    name: 'Field Notes',
    photo: 'forest',
    doc: {
      posterStyle: 'annotated',
      bgColor: '#0d1a10',
      vignetteIntensity: 0.5,
      vignetteDirection: 'edges',
      grainOpacity: 0.06,
      annotationFont: 'Caveat',
      annotationColor: '#fdf6e3',
      annotations: [
        { id: 'a1', text: 'first frost →', x: 28, y: 22, fontSize: 26 },
        { id: 'a2', text: 'the old trail\nstarts here', x: 70, y: 46, fontSize: 22 },
        { id: 'a3', text: '06:12 am', x: 24, y: 80, fontSize: 20 },
        { id: 'a4', text: '✶ pine + smoke', x: 72, y: 86, fontSize: 18 },
      ],
    },
  },
  {
    id: 'night-shift',
    name: 'Night Shift',
    photo: 'city',
    doc: {
      ...tpl('neon-drift'),
      eventLabel: 'Night Shift · Vol. 03',
      subjectTitle: 'AFTER HOURS',
      subjectTitleAccentWord: 'HOURS',
      captionText: 'The city hums in a different key after midnight.',
      detailRows: [
        { id: '1', label: 'Set', value: 'Rooftop · 02:00' },
        { id: '2', label: 'Lineup', value: 'Eight artists' },
      ],
      nameStamp: 'NOCTURNE',
      tagline: 'the city never really sleeps',
      tracklist: 'Sodium light · Wet asphalt · Bass through walls',
      photoCredit: 'Photograph by Postakit',
      photoLocation: 'Downtown, 2026',
    },
  },
  {
    id: 'capital',
    name: 'Capital',
    photo: 'city',
    doc: { ...mag('capital') },
  },
  {
    id: 'still',
    name: 'Still',
    photo: 'coast',
    doc: {
      ...tpl('minimal-white'),
      eventLabel: 'Series · Volume I',
      subjectTitle: 'UNTITLED',
      captionText: 'Silence is the canvas.\nEverything else is noise.',
      detailRows: [
        { id: '1', label: 'Medium', value: 'Digital photography' },
        { id: '2', label: 'Year', value: '2026' },
      ],
      nameStamp: 'STUDIO',
      tagline: 'less · is · more',
      tracklist: 'White · Negative space · Clean lines · Restraint',
      photoCredit: 'Photograph by Studio',
    },
  },
]
