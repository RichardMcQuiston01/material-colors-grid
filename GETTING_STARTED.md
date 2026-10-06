# Getting Started

This guide covers installing `@richardmcquiston01/material-colors-grid` and
using it to render a grid of color swatches. To see the output without writing
any code, try the
[live demo](https://material-colors-grid-generator.vercel.app/).

## Prerequisites

- **Rendering** needs a browser with `<canvas>` support (`HTMLCanvasElement`).
  The renderer is browser-only for now.
- **Non-rendering APIs** (document model, ordering, layout, JSON import/export)
  have no DOM dependency and also run in Node.js 20 or newer.
- A bundler or runtime that understands ESM or CommonJS. Type definitions are
  bundled, so TypeScript needs no extra `@types` package.
- [Bun](https://bun.sh) 1.x is only required to develop this package itself.

## Installation

```bash
bun add @richardmcquiston01/material-colors-grid
# or
npm install @richardmcquiston01/material-colors-grid
# or
pnpm add @richardmcquiston01/material-colors-grid
```

## Concepts

- A **document** (`ProjectDocument`) holds a tree of categories and the style
  settings. It is plain JSON-serializable data.
- A **category** may contain colors directly and/or **sub-categories**; a
  **color** has an `id`, a `name`, and a `hex` value.
- Ordering is automatic: categories and sub-categories alphabetically, colors
  dark to light. A sole "Default" category prints no header.
- Functions that can fail return a result object, either `{ ok: true, ... }` or
  `{ ok: false, error }`, instead of throwing. Always check `ok`.

## Usage

### Render a grid to a canvas

```ts
import {
  createCategory,
  createColor,
  createDefaultDocument,
  renderToCanvas,
} from '@richardmcquiston01/material-colors-grid';

const doc = createDefaultDocument();

const pla = createCategory('PLA');
pla.colors.push(
  createColor('Forest', '#1b5e20'),
  createColor('Snow', '#ffffff'),
  createColor('Charcoal', '#222222'),
);
doc.categories = [pla];

const canvas = document.querySelector('canvas');
if (canvas === null) throw new Error('No <canvas> element found on the page.');

const rendered = renderToCanvas(canvas, doc);
if (!rendered.ok) {
  console.error(rendered.error);
}
```

`renderToCanvas` resizes the canvas to the document's configured dimensions
(1440×1280 by default) before drawing. If the cards and footer need more room
than the configured height, the canvas grows taller so nothing is clipped.

### Download as PNG

```ts
import { canvasToBlob } from '@richardmcquiston01/material-colors-grid';

const png = await canvasToBlob(canvas);
if (png.ok) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(png.blob);
  link.download = 'colors.png';
  link.click();
  URL.revokeObjectURL(link.href);
} else {
  console.error(png.error);
}
```

Use `canvasToDataUrl(canvas, 'image/jpeg', 0.9)` when you need a data URL
instead of a `Blob`.

## Examples

### Sub-categories

```ts
import {
  createCategory,
  createColor,
  createSubCategory,
} from '@richardmcquiston01/material-colors-grid';

const petg = createCategory('PETG');
const translucent = createSubCategory('Translucent');
translucent.colors.push(createColor('Ice', '#cfe8ff'));
petg.subCategories.push(translucent);
```

### Change the style

```ts
doc.style.cardsPerRow = 4;
doc.style.cardBackground = '#ffffff';
doc.style.border = { rounded: false, thickness: '0.1rem', color: '#cccccc' };
doc.style.fonts.category = {
  family: 'Georgia',
  color: '#000000',
  size: '1.25rem',
};
// 'auto' draws card text in each swatch's own color when it is readable.
doc.style.fonts.card.color = 'auto';
```

### Header and footer bands

Bands are only drawn when `text` is not empty.

```ts
doc.style.header.text = 'Available colors';
doc.style.header.background = '#1b5e20';
doc.style.header.font.color = '#ffffff';
doc.style.footer.text = 'Prices and availability may vary';
```

### Watermark

Load the image yourself and pass it to `renderToCanvas`; the document stores
the image as a data URL.

```ts
const image = new Image();
image.src = logoDataUrl;
await image.decode();

doc.style.watermark = {
  dataUrl: logoDataUrl,
  position: 'bottom-right',
  scale: 0.15,
  opacity: 0.6,
};

renderToCanvas(canvas, doc, { watermarkImage: image });
```

### Back up and share as JSON

```ts
import {
  documentToJson,
  parseImportedDocument,
} from '@richardmcquiston01/material-colors-grid';

const json = documentToJson(doc);

const imported = parseImportedDocument(json);
if (imported.ok) {
  doc = imported.document; // missing fields are filled with defaults
} else {
  console.error(imported.error);
}
```

### Validate untrusted data

Imported JSON and stored documents are deeply validated, so a malformed entry
is rejected instead of reaching the renderer. The validators are also exported
for your own checks:

```ts
import {
  isHexColor,
  isProjectDocument,
} from '@richardmcquiston01/material-colors-grid';

isHexColor('#1b5e20'); // true
isHexColor('#ffff'); // false: only 3- or 6-digit hex is valid
isProjectDocument({ categories: [null], style: {} }); // false
```

### Persist in localStorage

```ts
import {
  STORAGE_KEY,
  deserializeDocument,
  serializeDocument,
} from '@richardmcquiston01/material-colors-grid';

localStorage.setItem(STORAGE_KEY, serializeDocument(doc));
const restored = deserializeDocument(localStorage.getItem(STORAGE_KEY));
```

`deserializeDocument` falls back to a fresh default document when the stored
value is missing or invalid.

### Layout without drawing

```ts
import {
  buildRenderModel,
  computeLayout,
} from '@richardmcquiston01/material-colors-grid';

const sections = buildRenderModel(doc.categories);
const layout = computeLayout(sections, doc.style);
console.log(layout.width, layout.height, layout.items.length);
```

## Next steps

- Browse the exported types in `dist/index.d.ts` (or your editor's
  IntelliSense) for every style option.
- See the [CHANGELOG](./CHANGELOG.md) for release notes and the
  [ROADMAP](./ROADMAP.md) for planned work.
- Report problems on the
  [issue tracker](https://github.com/RichardMcQuiston01/material-colors-grid/issues).
