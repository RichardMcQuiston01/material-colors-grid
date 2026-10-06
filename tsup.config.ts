import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // tsup injects the deprecated baseUrl option; silence it under TypeScript 6.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
  target: 'es2022',
  treeshake: true,
});
