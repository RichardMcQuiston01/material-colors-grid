# @richardmcquiston01/material-colors-grid

- Author: Richard McQuiston
- Website: https://richardmcquiston.com/

**[Live demo →](https://material-colors-grid-generator.vercel.app/)**

## Overview

A framework-free TypeScript library that lays out and renders a grid of color
swatches onto an HTML canvas. It is intended for product listings that show the
available colors (for example filament colors grouped by material such as PLA
and PETG), and powers the
[Material Colors Grid Generator](https://github.com/RichardMcQuiston01/material-colors-grid-generator)
app, which you can try in the [live demo](https://material-colors-grid-generator.vercel.app/).

- Categories are ordered alphabetically, then sub-categories, then colors from
  dark to light.
- Cards wrap after a configurable number of cards per row.
- Configurable canvas size, fonts, card border and background, header and footer
  bands, and a corner watermark.
- JSON import/export and serialization helpers.
- Zero runtime dependencies; ESM and CommonJS builds with bundled types.

## Getting Started

```bash
bun add @richardmcquiston01/material-colors-grid
# or: npm install @richardmcquiston01/material-colors-grid
```

See [GETTING_STARTED.md](./GETTING_STARTED.md) for prerequisites,
installation, usage, and examples.

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
- Publish by pushing a tag that matches the version on `main`, for example
  `git tag v0.1.0 && git push origin v0.1.0` (or create a GitHub Release with
  that tag). The Publish workflow checks that the tag matches `package.json`,
  that the tagged commit is on `main`, and that the version is not already on
  npm; then it lints, tests, builds, publishes to npm with provenance, and
  creates a GitHub Release. It needs the `NPM_TOKEN` repository secret.

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## License

Apache 2

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
