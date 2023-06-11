import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "./",
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./assets",
          dest: "./",
        },
      ],
    }),
  ],
});
