import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/compendium/**/*.test.mjs'],
    environment: 'node',
    testTimeout: 30_000,
  },
});
