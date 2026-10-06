# @richardmcquiston01/material-colors-grid

- Author: Richard McQuiston
- Website: https://richardmcquiston.com/

## Overview

A framework-free TypeScript library that lays out and renders a grid of color
swatches onto an HTML canvas. It is intended for product listings that show the
available colors (for example filament colors grouped by material such as PLA
and PETG), and powers the
[Material Colors Grid Generator](https://github.com/RichardMcQuiston01/material-colors-grid-generator)
app.

- Categories are ordered alphabetically, then sub-categories, then colors from
  dark to light.
- Cards wrap after a configurable number of cards per row.
- Configurable canvas size, fonts, card border and background, header and footer
  bands, and a corner watermark.
- Zero runtime dependencies; ESM and CommonJS builds with bundled types.

## Getting Started

### Prerequisites

- Node.js 20 or newer for tooling. Rendering requires a browser canvas
  (`HTMLCanvasElement`).

### Installation

```bash
bun add @richardmcquiston01/material-colors-grid
# or: npm install @richardmcquiston01/material-colors-grid
```

### Usage

```ts
import {
  createCategory,
  createColor,
  createDefaultDocument,
  renderToCanvas,
  canvasToBlob,
} from '@richardmcquiston01/material-colors-grid';

const document = createDefaultDocument();
const pla = createCategory('PLA');
pla.colors.push(createColor('Forest', '#1b5e20'), createColor('Snow', '#fff'));
document.categories = [pla];

const canvas = window.document.querySelector('canvas')!;
const rendered = renderToCanvas(canvas, document);
if (!rendered.ok) {
  console.error(rendered.error);
} else {
  const png = await canvasToBlob(canvas);
  if (png.ok) {
    // Download or upload png.blob.
  }
}
```

Functions return result objects (`{ ok: true, ... }` or
`{ ok: false, error }`) rather than throwing, so callers should check `ok`.

### Examples

- `parseImportedDocument(json)` and `documentToJson(doc)` back up or share a
  document as JSON.
- `serializeDocument` / `deserializeDocument` persist a document, for example
  in `localStorage` under `STORAGE_KEY`.
- `buildRenderModel` and `computeLayout` expose the ordering and layout engine
  without drawing.

## Development

```bash
bun install
bun run lint
bun run typecheck
bun run test
bun run build
bun run check:package   # publint + are-the-types-wrong
```

### Branching and releases

- Work on feature branches cut from `dev`; merge back to `dev` once tested.
- When `dev` is ready to ship, bump `version` in `package.json`, update
  `CHANGELOG.md`, and merge `dev` into `main`.
- Pushing to `main` runs the Publish workflow, which publishes to npm (with
  provenance) if that version is not yet released and tags `vX.Y.Z`. It needs
  the `NPM_TOKEN` repository secret.

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## License

Apache 2

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
