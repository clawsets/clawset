import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { ClawPresetSchema, ClawPresetConfigSchema } from "./types.js";

const REQUIRED_TEMPLATES = [
  "IDENTITY.md",
  "SOUL.md",
  "AGENTS.md",
  "BOOTSTRAP.md",
  "HEARTBEAT.md",
  "TOOLS.md",
  "USER.md",
  "MEMORY.md",
];

const presetsDir = path.resolve(import.meta.dirname, "../../../presets");

// Read presets from package.json (npm metadata) + spec.json (clawset config)
function loadPresets() {
  const entries = fs.readdirSync(presetsDir, { withFileTypes: true });
  return entries
    .filter(
      (e) =>
        e.isDirectory() &&
        fs.existsSync(path.join(presetsDir, e.name, "package.json")) &&
        fs.existsSync(path.join(presetsDir, e.name, "src", "spec.json"))
    )
    .map((e) => {
      const pkgPath = path.join(presetsDir, e.name, "package.json");
      const specPath = path.join(presetsDir, e.name, "src", "spec.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
      const shortName = (pkg.name as string).replace("@clawset/", "");
      return {
        name: shortName,
        version: pkg.version,
        description: pkg.description,
        skills: spec.skills,
        configure: spec.configure,
        cron: spec.cron,
      };
    });
}

const presets = loadPresets();

describe("preset specs", () => {
  it("discovers at least one preset", () => {
    expect(presets.length).toBeGreaterThan(0);
  });

  describe.each(presets)("$name", (preset) => {
    it("passes schema validation", () => {
      const result = ClawPresetSchema.safeParse(preset);
      expect(result.success).toBe(true);
    });

    it("passes config schema validation", () => {
      const specPath = path.join(presetsDir, preset.name, "src", "spec.json");
      const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
      const result = ClawPresetConfigSchema.safeParse(spec);
      expect(result.success).toBe(true);
    });

    it("does not include clawset- prefix in name", () => {
      expect(preset.name).not.toMatch(/^clawset-/);
    });

    it("has a non-empty description", () => {
      expect(preset.description.length).toBeGreaterThan(0);
    });

    it("requires at least one skill", () => {
      expect(preset.skills.length).toBeGreaterThan(0);
    });

    it("has a version matching semver format", () => {
      expect(preset.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("has a valid cron expression if set", () => {
      if (preset.cron) {
        const parts = preset.cron.split(" ");
        expect(parts.length).toBe(5);
      }
    });

    it.each(REQUIRED_TEMPLATES)("has template file src/%s", (filename) => {
      const filePath = path.join(presetsDir, preset.name, "src", filename);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
