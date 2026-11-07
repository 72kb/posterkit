# Architecture

## Stack Decision

### React + Vite
**Why React:** The poster is a live-preview UI — every edit (font change, color tweak, text update) needs to re-render the canvas instantly. React's component model maps cleanly onto the canvas anatomy: each zone is a discrete component that reads from a central store and rerenders only when its slice changes.

**Why Vite:** Fast HMR, zero config for our needs, handles image imports natively.

### Tailwind CSS
All UI styling stays in utility classes — no CSS files to maintain. The canvas itself uses inline styles driven by the store (font names, hex colors, and dynamic sizing can't be expressed as static Tailwind classes). Editor panels, buttons, and controls use Tailwind normally.

### Zustand (state management)
Single flat store holding the entire canvas config. Simple, no boilerplate, works perfectly with React. Every editor control writes to the store; every canvas component reads from it.

### html-to-image
Converts the live DOM canvas element to PNG or JPG blob. Correct choice over canvas-based approaches because our canvas is pure HTML/CSS. Handles fonts, background images, gradients, and overlays correctly.

**Alternative:** `dom-to-image-more` (better-maintained fork) — use if html-to-image has rendering issues.

### jsPDF
Takes PNG output from html-to-image and places it on an A4 page. We do not use jsPDF's HTML renderer — always go PNG → PDF for pixel-perfect output.

### react-colorful
Lightweight color picker (2.8kb). Used for accent color, palette dots, tint, annotation color.

### @dnd-kit/sortable
Drag-to-reorder for the detail grid rows in the editor panel.

### color-thief-browser
Auto palette extraction from uploaded photo (v1.1 feature — library installed, not yet wired to UI).

---

## Folder Structure

```
posterkit/
├── public/
│   └── fonts/                  # Self-hosted font files (optional)
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Root layout: canvas panel + editor sidebar
│   │
│   ├── store/
│   │   └── posterStore.js      # Zustand store — single source of truth
│   │
│   ├── components/
│   │   ├── canvas/             # Everything that gets exported
│   │   │   ├── PosterCanvas.jsx        # Editorial mode: portrait or landscape
│   │   │   ├── TopBar.jsx              # Palette dots + event label + alias pill
│   │   │   ├── PhotoArea.jsx           # Background image + tint + vignette layers
│   │   │   ├── MidCaption.jsx          # Subject title + caption (portrait only)
│   │   │   ├── DetailGrid.jsx          # Label/value rows
│   │   │   ├── BottomFooter.jsx        # Name stamp + tagline + tracklist + credit
│   │   │   ├── EditableText.jsx        # Inline edit: styled display / contentEditable on click
│   │   │   │
│   │   │   ├── MagazineCanvas.jsx      # Magazine mode: routes to sub-layout by magLayout
│   │   │   ├── MagStandardLayout.jsx   # Generic / TIME / Nat Geo / Rolling Stone
│   │   │   ├── MagForbesLayout.jsx     # Forbes Africa + The Times (ticker, spine, pull quote)
│   │   │   ├── MagVogueLayout.jsx      # Vogue (cover star, names strip)
│   │   │   ├── MagWiredLayout.jsx      # Wired (dark tech, big accent headline)
│   │   │   ├── NewspaperColumns.jsx    # SVG column-rule overlay (The Times template)
│   │   │   │
│   │   │   ├── AnnotatedCanvas.jsx     # Annotated mode: photo + overlays + floating labels
│   │   │   └── FloatingAnnotations.jsx # Draggable handwriting-style text annotations
│   │   │
│   │   ├── editor/             # Right-side editor panel
│   │   │   ├── EditorPanel.jsx         # Tab container (tabs change by posterStyle)
│   │   │   ├── ImportPanel.jsx         # AI JSON import modal
│   │   │   ├── tabs/
│   │   │   │   ├── TemplatesTab.jsx    # Editorial visual templates (10 cards)
│   │   │   │   ├── MagTemplatesTab.jsx # Magazine templates (8 cards)
│   │   │   │   ├── PhotoTab.jsx        # Upload, position, scale; AI import button
│   │   │   │   ├── LayoutTab.jsx       # Portrait/landscape + photo height
│   │   │   │   ├── TextTab.jsx         # All editorial text fields
│   │   │   │   ├── MagCoverTab.jsx     # All magazine text fields (layout-aware)
│   │   │   │   ├── LabelsTab.jsx       # Annotated mode: annotation controls
│   │   │   │   ├── DesignTab.jsx       # Colors, fonts, overlays, presets
│   │   │   │   ├── DetailsTab.jsx      # Detail rows (sortable)
│   │   │   │   └── ExportTab.jsx       # PNG / JPG / PDF export
│   │   │   └── controls/
│   │   │       ├── ColorPicker.jsx     # Wraps react-colorful
│   │   │       ├── FontPicker.jsx      # Dropdown of available fonts
│   │   │       ├── PaletteDotEditor.jsx # Up to 6 dots, click to edit color
│   │   │       ├── SliderControl.jsx   # Reusable labeled range slider
│   │   │       └── TextInput.jsx       # Reusable labeled text input
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Tabs.jsx
│   │       └── Toggle.jsx
│   │
│   ├── hooks/
│   │   ├── useExport.js        # PNG/JPG/PDF export logic
│   │   └── useImageUpload.js   # File input + object URL management
│   │
│   ├── lib/
│   │   ├── fonts.js            # DISPLAY_FONTS + BODY_FONTS arrays, loadFont()
│   │   ├── presets.js          # 3 built-in editorial design presets
│   │   ├── templates.js        # 10 editorial visual templates
│   │   ├── magTemplates.js     # 8 magazine cover templates + MAG_TEMPLATES array
│   │   └── importSchema.js     # parseImport(): AI JSON → flat store patch
│   │
│   └── styles/
│       └── index.css           # Tailwind base + .poster-editable hover/focus styles
│
├── posterkit-schema.json       # Blank AI agent schema (give to AI with photo)
├── posterkit-import.example.json  # Filled example (BMW E30 / Red Bull shoot)
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## State Shape (Zustand store)

```js
{
  // ── Mode ──────────────────────────────────────────────
  posterStyle: 'editorial',       // 'editorial' | 'magazine' | 'annotated'

  // ── Layout (editorial) ────────────────────────────────
  orientation: 'portrait',        // 'portrait' | 'landscape'
  bgColor: '#0d0d0d',

  // ── Photo ─────────────────────────────────────────────
  photoUrl: null,                  // object URL from file upload
  photoPosition: 'center 50%',    // CSS background-position
  photoScale: 100,                 // CSS background-size %
  photoHeightPercent: 72,          // editorial portrait: photo's % of canvas height

  // ── Overlays (shared across all modes) ────────────────
  vignetteIntensity: 0.75,
  vignetteDirection: 'bottom',    // 'bottom' | 'top' | 'edges' | 'left' | 'right'
  grainOpacity: 0.04,
  tintColor: '#000000',
  tintOpacity: 0.0,

  // ── Palette dots (editorial) ──────────────────────────
  paletteDots: ['#333333', '#555555', '#888888', '#BBBBBB', '#FFFFFF'],

  // ── Typography (shared) ───────────────────────────────
  displayFont: 'Bebas Neue',
  bodyFont: 'DM Sans',
  accentColor: '#FFFFFF',

  // ── Editorial top bar ─────────────────────────────────
  eventLabel: 'Your Event · Location',
  aliasPill: '',
  showAliasPill: false,

  // ── Editorial mid caption (portrait) ──────────────────
  subjectTitle: 'Your Title Here',
  subjectTitleAccentWord: '',     // word to color in accent
  captionText: 'Add a caption to describe this moment.',

  // ── Detail grid (editorial) ───────────────────────────
  showDetailGrid: true,
  detailRows: [
    { id: '1', label: 'Label', value: 'Value' },
    { id: '2', label: 'Label', value: 'Value' },
  ],

  // ── Editorial bottom ──────────────────────────────────
  nameStamp: 'NAME',
  tagline: 'your tagline goes here',
  tracklist: '',
  photoCredit: 'Photograph by',
  photoLocation: '',
  showPhotoCredit: true,
  showDivider: true,
  dividerOpacity: 0.25,

  // ── Annotated mode ────────────────────────────────────
  annotationFont: 'Caveat',
  annotationColor: '#ffffff',
  annotations: [
    // { id, text, x, y, fontSize }   — x/y are % of canvas dimensions
  ],

  // ── Magazine mode ─────────────────────────────────────
  magLayout: 'standard',          // 'standard' | 'forbes' | 'vogue' | 'wired'
  magTemplateId: '',              // e.g. 'the-times', 'vogue' — drives template-specific behaviors

  // Shared magazine fields
  magTitle: 'THE MAGAZINE',       // masthead / publication name
  magIssue: 'Volume 01 · April 2026',
  magMainLine: 'Cover Story',     // main headline (display font, large)
  magMainSub: 'Subtitle text.',   // deck / subtitle

  // Cover lines (standard + vogue layouts)
  magCoverLines: [
    { id, label: 'EXCLUSIVE', text: 'Story headline' },
  ],

  // Forbes layout fields
  magTickerLines: '...',          // top scrolling ticker text
  magSpineText: 'MAGAZINE',       // vertical spine label
  magSubjectName: 'SUBJECT NAME',
  magSubjectRole: 'Title, Role',  // multi-line
  magPullQuote: '"A quote."',     // display font, italic
  magPlusLine: '',                // "PLUS" accent line (Forbes)
  magFinePrint: '',               // bottom fine-print strip (Forbes/Vogue)

  // The Times overlay
  magColumnOpacity: 0.07,         // newspaper column rule opacity
}
```

---

## Canvas Mode Routing

`App.jsx` renders one of three canvases based on `posterStyle`:

```jsx
// PosterCanvas.jsx covers editorial mode (portrait + landscape sub-layouts)
// MagazineCanvas.jsx routes to MagStandardLayout / MagForbesLayout / MagVogueLayout / MagWiredLayout
// AnnotatedCanvas.jsx renders photo + FloatingAnnotations

{posterStyle === 'magazine'  && <MagazineCanvas ref={posterRef} />}
{posterStyle === 'annotated' && <AnnotatedCanvas ref={posterRef} />}
{posterStyle === 'editorial' && <PosterCanvas ref={posterRef} />}
```

---

## Export Pipeline

```
User clicks Export
       │
       ▼
document.activeElement.blur()   ← avoid capturing focus ring
       │
       ▼
await document.fonts.ready      ← ensure fonts are rendered
       │
       ▼
html-to-image.toPng(posterRef.current, { pixelRatio: 2 })
       │
       ├─── PNG → trigger download directly
       │
       ├─── JPG → toJpeg() with quality: 0.92 → trigger download
       │
       └─── PDF → toPng at 3x → jsPDF A4 page → addImage() → save()
```

---

## Font Loading Strategy

Default pair (Bebas Neue + DM Sans) loaded via `@import` in CSS. When user switches font, dynamically inject a `<link>` tag into `<head>` before applying to the store. Avoids bundling all fonts and keeps initial load fast.

---

## Key Technical Constraints

**html-to-image and CORS:** Background images from object URLs (local file uploads) work fine. Remote URLs will fail CORS. Always use `URL.createObjectURL()` — never remote URLs.

**Font rendering in export:** html-to-image inlines fonts automatically if they are loaded at export time. Always wait for `document.fonts.ready`.

**Poster dimensions:** Fixed pixel dimensions (700×980 portrait, 1060×700 landscape, same for magazine). On small screens, scale down visually with CSS `transform: scale()` on a wrapper — never change the actual element dimensions.

**Poster ref:** The ref must be on the exact pixel-dimensioned div, not the scaling wrapper.

**PDF dimensions:** A4 portrait = 210×297mm, A4 landscape = 297×210mm. Stretch image to fill full page (no margins).

**Detail grid max rows:** 6 — enforced in the store action.

**localStorage presets:** Key `posterkit_presets`. Value: JSON array of `{ name, config }`. Always parse with try/catch.
