# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in
this repository.

## Project Overview

`@richardmcquiston01/material-colors-grid` is a framework-free TypeScript
library, published to npm, that lays out and renders a grid of color swatches
onto an HTML canvas. It was extracted from
[material-colors-grid-generator](https://github.com/RichardMcQuiston01/material-colors-grid-generator)
(a SvelteKit app, live demo at
<https://material-colors-grid-generator.vercel.app/>), which is meant to consume
this package.

- **Language**: TypeScript (strict), ESM source, ESM + CJS builds with bundled
  types via `tsup`.
- **Package manager**: `bun` (CI also uses `npm` for publishing only).
- **Runtime dependencies**: none. Keep it that way.
- **Rendering**: browser-only (`HTMLCanvasElement`). Everything else runs in
  Node.js 20+.
- **License**: Apache-2.0 (the generator app is MIT).

## Development Commands

```bash
bun install
bun run lint            # prettier --check + eslint
bun run typecheck       # tsc --noEmit
bun run test            # vitest run
bun run build           # tsup -> dist/ (ESM, CJS, .d.ts)
bun run check:package   # publint + are-the-types-wrong (needs a build)
bun run format          # prettier --write
```

### Workflow

1. Make changes on a feature branch cut from `dev`.
2. Typecheck, then write or update tests for the change.
3. Run lint, typecheck, build, and tests before committing.
4. Open a PR into `dev` (draft). CI runs lint, typecheck, build, test, and
   `check:package` on Node 20 and 22.

## Code Style

- Formatting is governed by `.prettierrc.json`: 2-space indent, single quotes,
  semicolons, trailing commas everywhere, 80-column width, LF line endings.
  Run `bun run format`.
- Follow the Google TypeScript Style Guide. Use explicit types on variables and
  function signatures; use descriptive `camelCase` names.
- Functions that can fail return a result object (`{ ok: true, ... }` or
  `{ ok: false, error }`) that the caller checks, rather than throwing. Error
  messages must be descriptive enough to troubleshoot (say what failed and
  why). Catch errors where possible and continue or exit gracefully.
- Markdown follows the
  [Google Markdown Style Guide](https://google.github.io/styleguide/docguide/style.html).

## Architecture

All source is in `src/`; `src/index.ts` is the public API barrel. Anything not
exported there is internal. When changing exports, update
`test/public-api.spec.ts`.

| Module                         | Responsibility                                                           |
| ------------------------------ | ------------------------------------------------------------------------ |
| `types`                        | Domain types: `Category`, `SubCategory`, `Color`, `StyleConfig`, etc.    |
| `defaults`, `factories`        | `createDefaultDocument`, `createCategory`/`SubCategory`/`Color`          |
| `normalize`                    | Fills missing fields of older/partial documents with defaults            |
| `validate`                     | Runtime type guards for untrusted input (hex colors, category tree, doc) |
| `ordering`, `render-model`     | Alphabetical categories, dark-to-light colors; flattens to sections      |
| `layout`, `units`, `watermark` | Pure layout engine: card/header boxes, band heights, watermark rect      |
| `color`, `contrast`            | Hex parsing, WCAG contrast, readable "auto" card text color              |
| `renderer`                     | `drawDocument(ctx, doc, ...)` paints a layout onto a 2D context          |
| `canvas`                       | `renderToCanvas`, `canvasToBlob`, `canvasToDataUrl` result-returning API |
| `import-export`, `persistence` | JSON export/import and (de)serialization helpers                         |

Rendering order: categories alphabetical, sub-categories alphabetical, colors
dark (`#000000`) to light (`#ffffff`), cards wrap at `cardsPerRow`. A sole
"Default" category prints no header. Persist only user-authored data; the
render model and layout are always derived.

### Testing notes

- Tests run in Vitest's `node` environment; there is no DOM. Canvas code is
  tested with hand-rolled fake contexts/canvases (see `src/canvas.spec.ts`,
  `src/renderer.spec.ts`).
- `test/built-package.spec.ts` loads `dist/` through ESM and CJS and is skipped
  when `dist/` is missing. CI builds before testing so it runs there.

### Tooling notes

- `tsup.config.ts` sets `ignoreDeprecations: '6.0'` for the dts build because
  tsup injects the deprecated `baseUrl` option under TypeScript 6.
- `package.json` `exports` has separate `types` for `import` and `require`
  (`.d.ts` / `.d.cts`); `check:package` verifies this. Keep it passing.

## Branching and Releases

- Work on feature branches off `dev`; merge back to `dev` once tested.
- To release: on `dev`, bump `version` in `package.json` and date the entry in
  `CHANGELOG.md`; merge `dev` into `main`.
- Publish by pushing a tag matching the version on `main`
  (`git tag vX.Y.Z && git push origin vX.Y.Z`) or by creating a GitHub Release
  with that tag. `.github/workflows/publish.yml` then verifies the tag matches
  `package.json`, the tagged commit is on `main`, and the version is not
  already on npm; runs lint, typecheck, build, tests, and `check:package`;
  publishes with provenance; and creates a GitHub Release unless one already
  exists for the tag.
- Publishing uses the `NPM_TOKEN` repository secret for the
  `@richardmcquiston01` scope.
- Never publish, tag, or merge to `main` without the owner's explicit go-ahead.

## Documentation

- `README.md`: overview, demo link, install pointer, donate block, license.
  Keep the Buy Me a Coffee block, License, and Copyright sections.
- `GETTING_STARTED.md`: prerequisites, installation, usage, and examples. Type
  check any code snippets you change against `src/index.ts`.
- `CHANGELOG.md`: add an entry per release. `ROADMAP.md`: planned work.
