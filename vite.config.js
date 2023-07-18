/// <reference types="vitest" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import { loadenv } from "js_utils/node/loadenv";

//https:vitejs.dev/config/
export default defineConfig({
  define: {
    __STATIC_ENV__: loadenv(".", {}),
  },
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: true,
    emptyOutDir: true,
    copyPublicDir: true,
    minify: false,
    lib: {
      entry: {
        index: "./src/index.js",
      },
      name: "afmachine",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["node:fs"],
    },
  },
  test: {
    // ...
    include: [
      ...configDefaults.include,
      "tests.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    globals: true,
    environment: "node",
    testTimeout: 5000, // 5 seconds
  },
});
