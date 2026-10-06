# Changelog

## 0.1.1 - 2026-10-06

- Release workflow: skip creating the GitHub Release when one already exists
  for the tag, so publishing no longer ends with a failed step. No changes to
  the published library code.

## 0.1.0 - 2026-10-06

- Initial release, extracted from Material Colors Grid Generator: document
  model, ordering, layout, canvas renderer, JSON import/export, and
  serialization helpers.
- Added `renderToCanvas`, `canvasToBlob`, and `canvasToDataUrl` helpers.
