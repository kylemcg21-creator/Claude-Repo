import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.{js,jsx}'],
    exclude: ['**/node_modules/**', '**/server/**'],
    setupFiles: ['./vitest.setup.js'],
  },
});
