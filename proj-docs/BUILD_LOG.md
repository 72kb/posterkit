# PosterKit — Build Log

> Running record of what's been built, what was fixed, and the current state of the app.

---

## What Was Built

PosterKit is a browser-based editorial image editor with three canvas modes.

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Styling (UI) | Tailwind CSS v3 |
| State | Zustand (flat store) |
| Export | html-to-image + jsPDF |
| Color picker | react-colorful |
| Palette extraction | color-thief-browser (installed, not yet wired to UI) |
| Drag-to-reorder | @dnd-kit/sortable |

App lives at: `/Users/apple/Documents/posterkit`

Run with: `npm run dev`

Build passes cleanly: `✓ 266 modules transformed`

---

## Canvas Modes

### Editorial Poster (`posterStyle: 'editorial'`)
The original mode. Portrait (700×980) and landscape (1060×700) layouts.

All 20 original MVP features implemented:
- Photo upload (drag-drop + click), position X/Y sliders, scale slider
- Portrait and landscape canvas layouts
- Inline editing of all text directly on the canvas
- TopBar: palette dots + event label + alias pill
- PhotoArea: background image with tint, vignette, grain overlays
- MidCaption: subject title with per-word accent color, caption text
- DetailGrid: label/value rows, drag-to-reorder, add/remove (max 6)
- BottomFooter: name stamp, tagline, tracklist, photo credit, divider
- Accent color picker
- Palette dots editor (3–6 swatches, click to pick)
- Display font + body font dropdowns (Google Fonts, lazy-loaded)
- Vignette intensity + direction controls
- Grain opacity slider
- Tint color + opacity controls
- 10 editorial visual templates
- 3 built-in design presets
- Export: PNG (2×), JPG (2×), PDF (3×, A4)
- AI import: JSON schema + ImportPanel modal

### Magazine Cover (`posterStyle: 'magazine'`)
Inspired by real magazine covers. Routes to four sub-layouts via `magLayout`.

**Sub-layouts:**
- `MagStandardLayout` — generic masthead-top, vignette, cover lines bottom
- `MagForbesLayout` — ticker strip, left spine, pull quote right, big headline bottom-left, fine print strip; also handles The Times variant (with `NewspaperColumns` overlay)
- `MagVogueLayout` — cover star name left-italic, fashion masthead, cover lines, names strip
- `MagWiredLayout` — dark, huge colored headline, subject block, subtitle

**8 magazine templates** in `lib/magTemplates.js`:
Forbes · The Times · TIME · Vogue · Nat Geo · Rolling Stone · Wired · The Economist

Each template sets: displayFont, bodyFont, accentColor, vignetteIntensity, grainOpacity, tintColor/Opacity, magLayout, magTitle, magIssue, and all layout-specific fields.

### Annotated Photo (`posterStyle: 'annotated'`)
Full-bleed photo with draggable handwriting-style floating text annotations.

- `AnnotatedCanvas`: photo + tint + vignette + grain (same overlay system as editorial)
- `FloatingAnnotations`: renders each annotation as a draggable `position: absolute` element, positioned at x/y % of canvas
- Drag to reposition (mouse down → move → up, tracks moved.current to distinguish drag vs click)
- Each annotation: text (inline editable), x, y (%), fontSize
- Annotation font: Caveat (default) — handwriting aesthetic
- Editor tab (`LabelsTab`): add/remove annotations, font + color controls

---

## Key Files

```
src/
  store/posterStore.js              — Zustand store, all state + actions
  components/
    canvas/
      PosterCanvas.jsx              — Editorial root, portrait/landscape switch
      EditableText.jsx              — Inline editing component
      TopBar.jsx                    — Event label + alias pill
      PhotoArea.jsx                 — Photo background + overlay layers
      MidCaption.jsx                — Subject title + caption
      DetailGrid.jsx                — Label/value detail rows
      BottomFooter.jsx              — Name stamp + tagline + tracklist + credit
      MagazineCanvas.jsx            — Magazine mode router (magLayout → sub-layout)
      MagStandardLayout.jsx         — Standard magazine cover
      MagForbesLayout.jsx           — Forbes / broadsheet layout
      MagVogueLayout.jsx            — Vogue layout
      MagWiredLayout.jsx            — Wired layout
      NewspaperColumns.jsx          — SVG column-rule overlay
      AnnotatedCanvas.jsx           — Annotated mode: photo + overlays
      FloatingAnnotations.jsx       — Draggable floating labels
    editor/
      EditorPanel.jsx               — Tabbed editor sidebar
      ImportPanel.jsx               — AI JSON import modal
      tabs/
        TemplatesTab.jsx            — 10 editorial template cards
        MagTemplatesTab.jsx         — 8 magazine template cards
        PhotoTab.jsx                — Upload, position, scale; AI import
        LayoutTab.jsx               — Portrait/landscape + photo height
        TextTab.jsx                 — Editorial text fields
        MagCoverTab.jsx             — Magazine text fields (layout-aware)
        LabelsTab.jsx               — Annotated mode annotation controls
        DesignTab.jsx               — Colors, fonts, overlays, presets
        DetailsTab.jsx              — Detail rows (sortable)
        ExportTab.jsx               — PNG / JPG / PDF export
  hooks/
    useExport.js                    — Export pipeline
    useImageUpload.js               — File input + drag-drop handler
  lib/
    fonts.js                        — DISPLAY_FONTS + BODY_FONTS arrays, loadFont()
    presets.js                      — 3 built-in editorial presets
    templates.js                    — 10 editorial visual templates
    magTemplates.js                 — 8 magazine templates + MAG_TEMPLATES array
    importSchema.js                 — parseImport(): AI JSON → flat store patch

posterkit-schema.json               — Blank AI agent schema
posterkit-import.example.json       — Filled example (BMW E30 / Red Bull shoot)
```

---

## Bugs Fixed During Build

| Bug | Root Cause | Fix |
|---|---|---|
| CSS `@import` error | Google Fonts `@import` was after `@tailwind` directives | Moved `@import` to top of `index.css` |
| npm peer conflict | vite@8 conflicted with `@vitejs/plugin-react` | Used `--legacy-peer-deps` on install |
| `require()` in ESM | `loadPreset` used `require('../lib/presets')` | Changed to static `import { PRESETS }` at top of file |
| Vite dynamic import warning | Presets was both statically and dynamically imported | Resolved by same static import fix |
| Photo cut off at bottom | Bottom section exceeded 980px canvas — no height budget | Wrapped bottom in `flex: 1, overflow: hidden, minHeight: 0` |
| Landscape inline editing missing | LandscapeLayout used plain `<span>`, not EditableText | Rewrote to use `<TopBar />` + `EditableText` for all text |
| Focus outline in exports | Clicking Export while a field was focused captured the focus ring | Added `document.activeElement.blur()` before every export call |
| Accent word coloring fragile | First attempt used an overlaid `aria-hidden` div — broke layout | Implemented `displayContent` prop on EditableText: styled JSX when display, plain `contentEditable` when editing |

---

## AI Import Workflow

1. Give an AI agent `posterkit-schema.json` alongside a photo
2. Ask it to analyze the photo and fill in the JSON (colors, fonts, text, mood)
3. Copy the output JSON
4. In the app: Photo tab → "✦ Import AI-generated preset" → paste → Apply

The `parseImport()` function validates, clamps, and maps the nested JSON to the flat Zustand store patch — ignoring unknown keys safely.
