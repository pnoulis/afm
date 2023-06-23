/// <reference types="vitest" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

// https:vitejs.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.MODE": JSON.stringify(process.env.MODE),
    "import.meta.env.BACKEND_URL": JSON.stringify(process.env.BACKEND_URL),
    "import.meta.env.BACKEND_AUTH_USERNAME": JSON.stringify(
      process.env.BACKEND_AUTH_USERNAME
    ),
    "import.meta.env.BACKEND_AUTH_PASSWORD": JSON.stringify(
      process.env.BACKEND_AUTH_PASSWORD
    ),
    "import.meta.env.LOGLEVEL": JSON.stringify(process.env.LOGLEVEL),
  },
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: true,
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: {
        index: "./src/index.js",
      },
      name: "afmachine",
      formats: ["es"],
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
