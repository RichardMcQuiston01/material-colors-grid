# Changelog

## 0.2.0 - 2026-10-06

Ports the hardening made to the generator app's in-repo core into the
package.

- Added runtime validation: `isHexColor`, `isColor`, `isSubCategory`,
  `isCategory`, and `isProjectDocument`. `parseImportedDocument` and
  `deserializeDocument` now deeply validate the category tree, so a malformed
  entry (for example a `null` category or a bad hex value) is rejected or falls
  back to defaults instead of reaching the renderer.
- `normalizeDocument` now accepts the looser `DocumentInput` type (deeply
  partial `style`, unvalidated `categories`) and drops structurally invalid
  categories. Added the `DocumentInput` and `DeepPartial` types.
- Behavior changes:
  - `hexToRgb` accepts 3- or 6-digit hex with or without `#` and throws a
    `TypeError` on anything else. Ordering and contrast treat a malformed hex
    as black instead of producing skewed values.
  - `computeLayout` grows the canvas height when the content plus the footer
    band would overflow `style.height`, so cards are no longer clipped and the
    footer no longer draws over them.
  - `cardsPerRow` is floored to a positive integer.

## 0.1.1 - 2026-10-06

- Release workflow: skip creating the GitHub Release when one already exists
  for the tag, so publishing no longer ends with a failed step. No changes to
  the published library code.

## 0.1.0 - 2026-10-06

- Initial release, extracted from Material Colors Grid Generator: document
  model, ordering, layout, canvas renderer, JSON import/export, and
  serialization helpers.
- Added `renderToCanvas`, `canvasToBlob`, and `canvasToDataUrl` helpers.
