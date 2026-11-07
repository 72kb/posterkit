# Architecture

Postakit is a static, client-only React app. There is no backend: posters, photos and settings live in the browser (IndexedDB), and exports are rendered from the live DOM.

```
src/
├── main.jsx, App.jsx        # entry + route switch (lazy-loaded pages, page transitions)
├── router.js                # ~50-line hash router (works on GitHub Pages)
├── config.js                # app name, version, repo URL
├── pages/
│   ├── Landing.jsx          # marketing page with live poster showcase
│   ├── NewProject.jsx       # choose format → template/example → creates a project
│   ├── Projects.jsx         # local library: rename, duplicate, delete, import
│   └── Editor.jsx           # loads a project into a poster store
├── store/
│   ├── posterStore.js       # createPosterStore(): document + actions + undo history
│   ├── PosterContext.jsx    # <PosterProvider store interactive>
│   ├── contexts.js
│   └── usePoster.js         # usePoster(selector), useCanvasMode()
├── components/
│   ├── canvas/              # THE POSTER — everything here is exported
│   ├── editor/              # editor shell, stage, header, rail, tabs
│   ├── poster/PosterPreview # live, read-only, auto-scaling poster render
│   ├── ui/                  # design-system primitives (Button, Modal, Popover…)
│   ├── layout/, brand/
├── hooks/                   # autosave, export, shortcuts, photo upload, sizing
└── lib/
    ├── db.js                # IndexedDB wrapper (projects + photos stores)
    ├── projects.js          # CRUD, duplicate, project file import/export
    ├── photos.js            # downscale uploads, store blobs, object-URL cache
    ├── exportPoster.js      # PNG / JPG / PDF pipeline
    ├── fontEmbed.js         # embeds only the font subsets a poster uses
    ├── fonts.js             # Google Fonts catalogue + loaders
    ├── templates.js         # editorial templates
    ├── magTemplates.js      # magazine templates
    ├── showcase.js          # art-directed example posters
    ├── starters.js          # create projects from templates/examples, STYLE_KEYS
    └── samplePhotos.js      # procedurally painted sample photos
```

## The poster document & stores

A poster is a flat object, `DEFAULT_DOC` in `store/posterStore.js`. `createPosterStore(doc)` wraps it in an isolated Zustand store with actions and an undo/redo history:

- `set(patch)` records an undo step. Rapid changes to the same keys within 450 ms (slider drags, typing) are coalesced into one step.
- `replace(patch)` updates without history (loading, resolving photo URLs).
- `revision` increments on every document change. Autosave subscribes to it.

Every poster on screen has its **own store**: the editor, each template card, each library thumbnail, each landing-page showcase. Canvas components read from the nearest `<PosterProvider>` via `usePoster()`, so the same `PosterCanvas` renders everywhere. `interactive={false}` (the default) makes `EditableText` render plain, non-editable text.

## Persistence

- `projects` store: `{ id, name, createdAt, updatedAt, doc }`
- `photos` store: `{ id, projectId, blob }`, indexed by project for cascading deletes

The doc stores a `photoId`; `photoUrl` is a runtime object URL and is never persisted. Uploads are downscaled to a 3200 px long edge (`lib/photos.js`). `useAutosave` writes the doc 700 ms after the last change and flushes on `pagehide` / tab hide.

## Canvas rules

- Fixed pixel sizes: portrait 700×980, landscape 1060×700 (`lib/dimensions.js`). The stage scales the poster with a CSS transform and sets `--canvas-scale` so the selection toolbar can counter-scale.
- Canvas components use inline styles only, because they're cloned by html-to-image.
- `PhotoBackdrop` is the shared photo → tint → gradients → vignette → grain stack. The photo is an `<img object-fit: cover>`, so any aspect ratio fills the frame.
- Editor-only UI inside the poster (selection toolbars) carries `data-export-ignore="true"` and is filtered out of exports.
- Empty text renders as nothing, exactly like the export. Clearing a hideable element hides it instead.

## Export pipeline (`lib/exportPoster.js`)

1. Clear the selection, blur, await `document.fonts.ready`, wait two frames.
2. Build `@font-face` CSS for only the families and unicode subsets present on the poster (`lib/fontEmbed.js`), with font files cached as data URLs across exports.
3. Run html-to-image (`toPng` / `toJpeg`) with the export filter. Safari renders twice to work around a first-pass image bug.
4. PDF: render at 3× (or higher) and fit onto A4 preserving aspect ratio, padding with the poster background colour.
5. Every export is wrapped in a 60 s timeout so the UI can never hang.

Google Fonts stylesheets are loaded with `crossorigin="anonymous"` so their rules are readable for embedding.

## Routing

`#/` landing · `#/new` (deep links: `?format=`, `?template=`, `?example=`) · `#/projects` · `#/editor/:id`

Hash routing plus `base: './'` means the build can be served from any sub-path without rewrites.

## Testing

`e2e/*.spec.js` (Playwright) cover creation, upload, inline editing, undo/redo, templates preserving text, hide/undo, all export formats (asserting no editor chrome), autosave and reload, magazine and annotated formats, the project library, project-file round-trips and the mobile layout.
