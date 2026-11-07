# CLAUDE.md

Guidance for AI coding assistants working on Postakit. Read `docs/ARCHITECTURE.md` and `CONTRIBUTING.md` first.

- Run `npm run check` (lint + build + Playwright) before calling a change done.
- Canvas components (`src/components/canvas/`) are exported as images: inline styles only, font fallbacks always, never resize the poster node (scale a wrapper).
- Read poster state with `usePoster()` from `src/store/usePoster.js`, never a global store — every preview has its own store.
- New document fields go in `DEFAULT_DOC` (persisted + undoable automatically); migrations go in `normalizeDoc()`.
- Templates apply only `STYLE_KEYS` in the editor — never overwrite user text.
- Never add third-party brand names, logos or copyrighted images; never send user content off-device.
