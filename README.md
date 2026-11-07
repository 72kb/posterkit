<div align="center">

<img src="public/favicon.svg" width="72" alt="Postakit logo" />

# Postakit

**Posters with an editorial eye.**

A free, open-source poster studio that runs entirely in your browser.
Turn photos into gallery-wall posters, magazine covers and annotated prints —
no account, no uploads, no tracking.

[**Open Postakit →**](https://72kb.github.io/postakit/) · [Report a bug](../../issues/new?template=bug_report.md) · [Request a feature](../../issues/new?template=feature_request.md)

</div>

---

## Features

- **Three formats.** Editorial posters (portrait or landscape), magazine covers with four distinct layouts, and annotated prints with draggable handwritten labels.
- **18 templates** that restyle colour, type and texture in one click without touching your text or photo.
- **Edit in place.** Click any text on the poster to rewrite it; everything is also editable from the side panel.
- **Film finishing.** Tint, vignette, grain, palette dots, 20+ Google Fonts.
- **Undo / redo** with full history and keyboard shortcuts (press <kbd>?</kbd> in the editor).
- **Autosaving library.** Posters and photos are stored locally in IndexedDB. Download a `.postakit.json` project file to back up or move a poster between devices.
- **High-resolution export.** PNG, JPG (1×–4×) and print-ready A4 PDF. Only the fonts your poster actually uses get embedded.
- **Works on phones.** A responsive editor with a bottom-sheet panel.
- **AI-ready.** Hand an assistant [`postakit-schema.json`](public/postakit-schema.json) plus your photo, then paste the JSON it returns under *Export → AI preset*.
- **Private by design.** Everything happens on your device. Photos never leave the browser.

## Quick start

```bash
git clone https://github.com/72kb/postakit.git
cd postakit
npm install
npm run dev        # http://localhost:5173
```

| Script            | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                     |
| `npm run build`   | Production build into `dist/`                 |
| `npm run preview` | Serve the production build locally            |
| `npm run lint`    | ESLint                                        |
| `npm test`        | Playwright end-to-end tests (desktop + mobile)|
| `npm run check`   | Lint, build and test — what CI runs           |

> First time running tests? `npx playwright install chromium` (or have Google Chrome installed locally).

## Deploying

Postakit is a static site. It uses hash-based routing and a relative `base`, so it works from any path with no server rewrites.

- **GitHub Pages:** push to `main` and the included workflow (`.github/workflows/deploy.yml`) builds and publishes the site. In your repo, go to **Settings → Pages → Source: GitHub Actions** first.
- **Anywhere else** (Netlify, Vercel, Cloudflare Pages, S3, nginx): run `npm run build` and serve the `dist/` folder.

Set `VITE_REPO_URL` at build time if you fork the project, so the GitHub links point at your repo.

## Tech stack

React 19 · Vite · Tailwind CSS 3 · Zustand · Motion · html-to-image · jsPDF · dnd-kit · lucide icons · Playwright

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how everything fits together, including how to add your own templates.

## Contributing

Contributions are very welcome, whether that's new templates, layouts, fonts, bug fixes or translations. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). Template names and sample copy are original and not affiliated with any publication. The sample photos are generated procedurally in the browser.
