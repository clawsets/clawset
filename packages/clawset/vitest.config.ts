import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "#presets": path.resolve(import.meta.dirname, "../../presets"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
    },
  },
});
