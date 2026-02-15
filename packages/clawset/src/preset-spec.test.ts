import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { ClawPresetSchema } from "./types.js";
import { listPresets } from "./preset-runner.js";
import "./generated/preset-registry.js";

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

const presets = listPresets();

describe("preset specs", () => {
  it("discovers at least one preset", () => {
    expect(presets.length).toBeGreaterThan(0);
  });

  describe.each(presets)("$name", (preset) => {
    it("passes schema validation", () => {
      const result = ClawPresetSchema.safeParse(preset);
      expect(result.success).toBe(true);
    });

    it("does not include clawset- prefix in name", () => {
      expect(preset.name).not.toMatch(/^clawset-/);
    });

    it("has a non-empty description", () => {
      expect(preset.description.length).toBeGreaterThan(0);
    });

    it("requires at least one skill", () => {
      expect(preset.requiredSkills.length).toBeGreaterThan(0);
    });

    it("has a valid cron expression if set", () => {
      if (preset.cron) {
        const parts = preset.cron.split(" ");
        expect(parts.length).toBe(5);
      }
    });

    it.each(REQUIRED_TEMPLATES)("has template file %s", (filename) => {
      const filePath = path.join(presetsDir, preset.name, filename);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
