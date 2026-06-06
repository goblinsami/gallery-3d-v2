import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        element: resolve(__dirname, "src/elements/ScrollixGalleryElement.ts"),
        index: resolve(__dirname, "src/index.ts"),
        playground: resolve(__dirname, "src/playground/GalleryPlaygroundElement.ts"),
      },
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    sourcemap: true,
  },
});
