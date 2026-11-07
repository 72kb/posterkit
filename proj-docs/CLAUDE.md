# CLAUDE.md — PosterKit Build Instructions

This file is the source of truth for Claude Code when working on PosterKit. Read this fully before touching any code.

---

## Project Summary

PosterKit is a browser-based editorial image editor with three canvas modes:

| Mode | `posterStyle` | Description |
|---|---|---|
| Editorial Poster | `editorial` | Structured poster anatomy — palette dots, event label, photo, caption, detail grid, name stamp, tracklist |
| Magazine Cover | `magazine` | Full-bleed photo with magazine typography — masthead, cover lines, pull quotes, tickers |
| Annotated Photo | `annotated` | Photo canvas with draggable handwriting-style floating text labels |

The design aesthetic is editorial/gallery-wall — dark backgrounds, sparse typography, fine-print tracklists, large display-font name stamps. Features are inspired by real-world references: magazine covers, editorial photography, gallery walls, photobooks.

All design decisions, component names, state shape, and export pipeline are documented in:
- `ARCHITECTURE.md` — stack, folder structure, full state shape, export pipeline
- `FEATURES.md` — full feature list with IDs and implementation notes
- `BUILD_LOG.md` — what's been built, bugs fixed, current file map

---

## Tech Stack

```
React 18 + Vite
Tailwind CSS v3
Zustand (state)
html-to-image (PNG/JPG export)
jsPDF (PDF export)
react-colorful (color pickers)
@dnd-kit/sortable (drag-to-reorder detail rows)
color-thief-browser (installed, not yet wired to UI)
```

---

## App Layout

```
┌──────────────────────────────────────────────────────────┐
│  Header: PosterKit logo + Export PNG button              │
├─────────────────────────────┬────────────────────────────┤
│                             │                            │
│   CANVAS                    │   EDITOR PANEL             │
│   (live preview)            │   (tabbed controls)        │
│                             │                            │
│   Fixed pixel dimensions    │   Tabs change by mode:     │
│   scaled to fit viewport    │   Editorial: Templates /   │
│   via CSS transform         │   Photo / Layout / Text /  │
│                             │   Design / Details / Export│
│                             │   Magazine: MagTemplates / │
│                             │   Photo / Cover / Design / │
│                             │   Export                   │
│                             │   Annotated: Photo /       │
│                             │   Labels / Design / Export │
└─────────────────────────────┴────────────────────────────┘
```

- Canvas is LEFT, editor is RIGHT
- Canvas never scrolls — it scales with CSS transform to fit available height
- Editor panel scrolls vertically within its column

---

## Canvas Mode Routing

The store's `posterStyle` field controls which canvas renders. The export hook works the same regardless of mode — it targets `posterRef.current` which points to whichever canvas is active.

```jsx
{posterStyle === 'editorial'  && <PosterCanvas ref={posterRef} />}
{posterStyle === 'magazine'   && <MagazineCanvas ref={posterRef} />}
{posterStyle === 'annotated'  && <AnnotatedCanvas ref={posterRef} />}
```

`MagazineCanvas` itself routes to sub-layouts by `magLayout`:

```jsx
if (magLayout === 'forbes') return <MagForbesLayout />
if (magLayout === 'vogue')  return <MagVogueLayout />
if (magLayout === 'wired')  return <MagWiredLayout />
return <MagStandardLayout />  // default
```

---

## Styling Rules

**Canvas components (exported output):**
- All text colors use hardcoded hex or rgba — NO Tailwind classes inside canvas components
- Use inline `style={{}}` props on all canvas elements, driven by store values
- Font families: always include fallback — `'Bebas Neue', Impact, sans-serif`
- This ensures html-to-image serialization captures styles correctly

**Editor UI (sidebar, controls, tabs):**
- Use Tailwind normally

---

## Editorial Canvas Dimensions

- Portrait: 700×980px
- Landscape: 1060×700px

Scale to fit viewport using CSS `transform: scale()` on a wrapper. Never change the actual element dimensions — export depends on fixed pixels. The ref must be on the pixel-dimensioned div, not the scaling wrapper.

## Magazine Canvas Dimensions

Same as editorial portrait: 700×980px (magazine covers are portrait format). Scale the same way.

---

## Export Pipeline

```js
// Always do both of these before any html-to-image call:
document.activeElement?.blur()   // avoid capturing focus ring
await document.fonts.ready       // ensure fonts render in export

// PNG
const dataUrl = await toPng(posterRef.current, { pixelRatio: 2 })

// JPG
const dataUrl = await toJpeg(posterRef.current, { pixelRatio: 2, quality: 0.92 })

// PDF
const dataUrl = await toPng(posterRef.current, { pixelRatio: 3 })
const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight)
pdf.save(`posterkit-${Date.now()}.pdf`)
```

---

## Font Loading Strategy

Default fonts (Bebas Neue + DM Sans) loaded via `@import` in `index.css`. When user switches font, dynamically inject a `<link>` tag into `<head>` — `loadFont()` in `lib/fonts.js` handles this. Always inject before updating the store so the font is ready when the canvas rerenders.

---

## State Shape Reference

See `ARCHITECTURE.md` for the full state shape. Key fields:

- `posterStyle` — mode selector: `'editorial' | 'magazine' | 'annotated'`
- `magLayout` — magazine sub-layout: `'standard' | 'forbes' | 'vogue' | 'wired'`
- `magTemplateId` — drives template-specific behaviors (e.g. `'the-times'` enables `NewspaperColumns`)
- `annotations[]` — `{ id, text, x, y, fontSize }` where x/y are % of canvas dimensions

---

## Adding a New Magazine Template

1. Add an entry to `MAG_TEMPLATES` in `src/lib/magTemplates.js`
2. Set `magLayout` to which sub-layout it uses (`standard`, `forbes`, `vogue`, or `wired`)
3. Set all relevant `mag*` fields and shared design fields (`accentColor`, `displayFont`, `bodyFont`, `vignetteIntensity`, `grainOpacity`, `tintColor`, `tintOpacity`)
4. Add a `palette` array (5 hex colors) for the template card swatch display in `MagTemplatesTab`
5. If the template needs a layout-specific behavior, set `magTemplateId` and add the conditional check in the relevant layout component (see how `magTemplateId === 'the-times'` enables `NewspaperColumns`)

---

## Adding a New Editorial Template

Add an entry to the templates array in `src/lib/templates.js`. Each template is a store patch object — any field not set inherits the current store value.

---

## Critical Implementation Notes

**CORS and images:** Always use `URL.createObjectURL(file)`. Never remote URLs — html-to-image will fail.

**Inline editing:** `EditableText` shows styled content normally; on click switches to `contentEditable`. The `displayContent` prop accepts JSX (for accent-word coloring) while the editing state uses plain text.

**Annotation dragging:** `FloatingAnnotations` uses a `moved` ref to distinguish drag vs. click. A `onClickCapture` with `e.stopPropagation()` prevents triggering inline edit when the user finishes a drag.

**Detail grid max rows:** 6 — enforced in the store's `addDetailRow` action.

**Magazine cover lines max:** 5 — enforced in `addMagCoverLine`.

**localStorage presets:** Key `posterkit_presets`. Parse with try/catch.

---

## Definition of Done

- [ ] All three canvas modes render and export correctly
- [ ] All 8 magazine templates load and display correct layout variants
- [ ] All 10 editorial templates load and apply correctly
- [ ] Portrait and landscape editorial layouts both render correctly
- [ ] Annotated mode: annotations can be added, dragged, edited, removed
- [ ] Export PNG, JPG, PDF all work and capture background photo
- [ ] Accent color change updates all accent elements simultaneously
- [ ] Font change updates canvas live
- [ ] No console errors on initial load
- [ ] App runs with `npm run dev` from clean clone
