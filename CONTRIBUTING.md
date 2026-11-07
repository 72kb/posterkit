# Contributing to Postakit

Thanks for helping make Postakit better! This guide covers the essentials.

## Getting set up

```bash
npm install
npm run dev
```

Before opening a pull request, run the same checks CI runs:

```bash
npm run check   # lint + build + Playwright tests
```

## Ground rules

- **Keep it private.** Postakit never sends user photos or poster data to a server. Don't add analytics, remote image URLs or third-party APIs that receive user content.
- **No third-party brands or imagery.** Templates evoke a *genre* (business magazine, fashion cover…), never a specific publication. Don't add real logos, mastheads, trademarks or copyrighted photos. Sample photos are generated in code (`src/lib/samplePhotos.js`).
- **Canvas components use inline styles.** Anything inside `src/components/canvas/` is what gets exported, so use inline `style={{}}` driven by the store (not Tailwind classes), and always include a font fallback.
- **Poster sizes are fixed pixels.** Scale the poster with a CSS transform on a wrapper and never by resizing the poster node, because export depends on exact dimensions.

## Adding a template

Templates are plain objects, a patch over the poster document.

1. Editorial: add an entry to `TEMPLATES` in `src/lib/templates.js`.
   Magazine: add an entry to `MAG_TEMPLATES` in `src/lib/magTemplates.js` and pick a `magLayout` (`standard`, `capital`, `couture` or `circuit`).
2. Give it a `palette` (5 hex colours) for the card swatch.
3. Optionally map it to a sample scene in `TEMPLATE_SCENES` (`src/lib/starters.js`).
4. Fonts must exist in `src/lib/fonts.js`.

When a user applies a template in the editor, only the keys listed in `STYLE_KEYS` (`src/lib/starters.js`) are applied. Their text and photo are never overwritten.

## Adding a field to the poster

1. Add it with a default to `DEFAULT_DOC` in `src/store/posterStore.js`. It's then automatically persisted and undoable.
2. Render it in a canvas component with `<EditableText>`.
3. Expose it in the relevant editor tab under `src/components/editor/tabs/`.
4. If older saved projects need migrating, handle it in `normalizeDoc()`.

## Tests

End-to-end tests live in `e2e/` and use Playwright. Please add or update a test for any user-facing change. Run a single file with `npx playwright test e2e/editor.spec.js`, or use `npm run test:ui` for the interactive runner.

## Commits & PRs

- Keep PRs focused, one feature or fix each.
- Include a screenshot or short clip for visual changes.
- Describe *why* as well as *what*.

## Code of conduct

Be kind, assume good intent, and keep discussions about the work. Harassment of any kind isn't tolerated. Maintainers may remove comments or contributors that don't follow this.
