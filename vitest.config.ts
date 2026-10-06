import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    coverage: { include: ['src/**/*.ts'], exclude: ['src/**/*.spec.ts'] },
  },
});
