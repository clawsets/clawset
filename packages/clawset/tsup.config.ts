import { defineConfig } from "tsup";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  esbuildOptions(options) {
    options.alias = {
      "#presets": path.resolve(import.meta.dirname, "../../presets"),
    };
  },
});
