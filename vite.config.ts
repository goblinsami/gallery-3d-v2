import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        element: resolve(__dirname, "src/elements/ScrollixGalleryElement.ts"),
        framer: resolve(__dirname, "src/framer/ScrollixGalleryFramer.tsx"),
        index: resolve(__dirname, "src/index.ts"),
        playground: resolve(__dirname, "src/playground/GalleryPlaygroundElement.ts"),
      },
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["framer", "react"],
    },
    sourcemap: true,
  },
});
