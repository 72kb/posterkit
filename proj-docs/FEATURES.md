# Feature Spec

> Features are driven by real-world inspiration — things seen in actual magazines, posters, editorial photography, and gallery walls — then adapted for the tool. Not hypothetical Canva-style feature lists.

---

## Mode Selection

The app has three canvas modes, selectable before or after uploading a photo. Switching modes preserves the photo and shared settings (overlays, fonts, colors).

| Mode | `posterStyle` value | Canvas |
|---|---|---|
| Editorial Poster | `editorial` | `PosterCanvas` → portrait or landscape layout |
| Magazine Cover | `magazine` | `MagazineCanvas` → sub-layout from `magLayout` |
| Annotated Photo | `annotated` | `AnnotatedCanvas` + `FloatingAnnotations` |

---

## MVP Features (All Implemented)

### F01 · Photo Upload
- Drag-and-drop or click-to-upload
- Accepted formats: JPG, PNG, WEBP
- Stored as object URL, no server upload
- Photo position control: X/Y sliders to pan within the frame
- Photo scale slider (zoom in/out within frame)

---

### F02 · Layout Selection (Editorial mode)
- Toggle between **Portrait** (700×980) and **Landscape** (1060×700)
- Switching layout preserves all text and settings
- Portrait: photo occupies top ~70%, info panel below
- Landscape: photo fills full background, content overlaid left/right columns

---

### F03 · Palette Dots
- 5 dots displayed at top of poster
- Each dot is clickable → opens color picker
- Add dot (up to 6) / remove dot (min 3)

---

### F04 · Accent Color
- Single accent color used for: event label, name stamp, detail labels, subject title accent word, magazine cover lines
- Default: white (blank state); preset-driven thereafter
- Full color picker + preset swatches

---

### F05 · Typography
- **Display font** — used for name stamp, subject title, magazine masthead. Default: Bebas Neue
- **Body font** — used for all other text. Default: DM Sans
- Font picker dropdown with live preview
- Available display fonts: Bebas Neue, Anton, Big Shoulders Display, Staatliches, Black Han Sans, Playfair Display, Bodoni Moda, Barlow Condensed, Abril Fatface, Libre Baskerville, EB Garamond, UnifrakturMaguntia
- Available body fonts: DM Sans, Outfit, Syne, Space Grotesk, Epilogue, Cormorant Garamond, EB Garamond
- Fonts lazy-loaded via Google Fonts (dynamic `<link>` injection on selection)

---

### F06 · Event Label (Editorial top bar)
- Editable text field
- Letter spacing via CSS

---

### F07 · Alias Pill (Editorial top bar, portrait)
- Editable short label
- Toggle: show/hide

---

### F08 · Subject Title (Portrait only)
- Large display-font title
- Option to set one word as accent color
- Inline editing directly on canvas

---

### F09 · Caption Text
- Multi-line italic body text below subject title
- Editable textarea in editor panel

---

### F10 · Detail Grid
- 2-column grid of label/value pairs
- Add row / remove row (max 6 rows)
- Drag-to-reorder via @dnd-kit/sortable
- Each label displays in accent color
- Toggle entire grid: show/hide

---

### F11 · Name Stamp
- Large display-font text at bottom
- Editable content

---

### F12 · Tagline
- Small uppercase text below name stamp
- Editable

---

### F13 · Tracklist / Tags
- Fine-print text row (inspired by the Frank Ocean Blonde tracklist aesthetic)
- Freeform textarea
- Very low opacity

---

### F14 · Photo Credit
- "Photograph by X" + "Location (Year)"
- Editable fields
- Toggle: show/hide

---

### F15 · Vignette
- Intensity slider (0 = off, 1 = heavy)
- Direction: bottom, top, edges, left, right

---

### F16 · Grain Overlay
- Opacity slider (0 = off)
- SVG feTurbulence pattern, overlay blend mode

---

### F17 · Photo Tint
- Overlay color + opacity slider
- Presets: Golden Hour, Cool Blue, Noir, None

---

### F18 · Export
- **PNG** — 2× pixel ratio, lossless
- **JPG** — 2× pixel ratio, 92% quality
- **PDF** — 3× pixel ratio, A4 portrait or landscape, print-ready
- Export button shows loading state during render
- Always waits for `document.fonts.ready` before capture
- Blurs active element before capture to avoid focus ring in output

---

### F19 · Presets
- 3 built-in design presets (editorial mode): Red Bull, Minimal, Golden Hour
- 10 visual editorial templates (dark editorial, minimal white, golden hour, neon drift, Kodak film, blueprint, sakura, jungle, chrome, sunset city)
- User can save current config as custom preset (stored in localStorage)
- Load / delete custom presets

---

### F20 · Divider Line (Editorial)
- Thin horizontal rule between sections
- Toggle: show/hide
- Opacity control

---

## Post-MVP Features (Implemented)

### F21 · Magazine Cover Mode
Inspired by real magazine covers — TIME, Forbes, Vogue, Wired, The Economist, Rolling Stone, Nat Geo, The New York Times.

**Sub-layouts (`magLayout`):**

| Value | Inspired by | Key elements |
|---|---|---|
| `standard` | Generic magazine / TIME / Rolling Stone / Nat Geo | Masthead top-left, vignette, cover lines bottom |
| `forbes` | Forbes Africa / broadsheet covers | Ticker strip, left spine, pull quote right, huge headline bottom-left, fine print strip. Also handles The Times (with `NewspaperColumns` overlay) |
| `vogue` | Vogue (British/US) | Cover star name left-italic, bold fashion masthead, cover lines, names strip bottom |
| `wired` | Wired | Dark techy, huge colored headline, subject block right, subtitle below |

**8 magazine templates:**
- **Forbes** — Playfair Display / EB Garamond, red accent, Forbes Africa fields
- **The Times** — UnifrakturMaguntia / Libre Baskerville, newspaper column overlay
- **TIME** — Abril Fatface / EB Garamond, red border, classic news layout
- **Vogue** — Bodoni Moda / Cormorant Garamond, white accent, fashion cover
- **Nat Geo** — Bebas Neue / Space Grotesk, yellow accent, heavy vignette
- **Rolling Stone** — Abril Fatface / Outfit, orange accent, music editorial
- **Wired** — Barlow Condensed / Space Grotesk, purple accent, tech cover
- **The Economist** — Libre Baskerville / EB Garamond, red accent, serif finance

**Magazine-specific fields:**
- `magTitle` — publication name (masthead)
- `magIssue` — issue date/volume line
- `magMainLine` — cover story headline (large, display font)
- `magMainSub` — subtitle / deck
- `magCoverLines[]` — label + text pairs (e.g. "EXCLUSIVE · Story headline")
- `magTickerLines` — top ticker strip text (Forbes layout)
- `magSpineText` — vertical spine label (Forbes/Vogue layouts)
- `magSubjectName` — cover subject name
- `magSubjectRole` — title / roles (multi-line)
- `magPullQuote` — pull quote (display font, italic)
- `magPlusLine` — "PLUS" line accent (Forbes)
- `magFinePrint` — bottom fine-print strip (Forbes/Vogue)
- `magColumnOpacity` — newspaper column overlay opacity (The Times)

---

### F22 · Annotated Photo Mode
Inspired by editorial photography with handwritten margin notes — the kind seen in photobooks and fashion editorial spreads.

- Full-bleed photo with vignette, tint, and grain overlays (same controls as editorial mode)
- Draggable floating text labels positioned anywhere on the photo (% coordinates, mouse drag to reposition)
- Each annotation: text content (inline editable), position (x/y %), font size
- Annotation font: handwriting-style (default: Caveat)
- Annotation color: configurable
- Add / remove annotations via editor panel

---

## v1.1 Ideas (Not Yet Built)

- **Auto palette extraction** — color-thief reads uploaded image and populates palette dots
- **Multi-photo mode** — switch between photos within same poster config
- **Template gallery** — start from a pre-built poster instead of blank
- **Undo/redo** — Zustand middleware for history
- **Mobile editor** — responsive layout, editor panel becomes bottom drawer

---

## Out of Scope (v1)

- Cloud storage / user accounts
- Sharing / social export
- Video / animated posters
- Team collaboration
