import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const distDirectory = resolve(__dirname, '../dist');
const hasBuild = existsSync(resolve(distDirectory, 'index.cjs'));

// Runs only after `bun run build`; CI builds before testing.
describe.skipIf(!hasBuild)('built package', () => {
  it('loads through CommonJS and exposes the API', () => {
    const require = createRequire(import.meta.url);
    const built = require(resolve(distDirectory, 'index.cjs')) as Record<
      string,
      unknown
    >;

    expect(typeof built.renderToCanvas).toBe('function');
    expect(typeof built.createDefaultDocument).toBe('function');
  });

  it('loads through ESM and exposes the API', async () => {
    const built = (await import(resolve(distDirectory, 'index.js'))) as Record<
      string,
      unknown
    >;

    expect(typeof built.renderToCanvas).toBe('function');
    expect(typeof built.parseImportedDocument).toBe('function');
  });
});
