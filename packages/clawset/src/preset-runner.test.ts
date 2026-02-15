import { describe, it, expect, beforeEach } from "vitest";
import type { ClawPreset } from "./types.js";
import {
  registerPreset,
  getPreset,
  qualifiedName,
  listPresets,
} from "./preset-runner.js";

const testPreset: ClawPreset = {
  name: "autopm",
  version: "1.0.0",
  description: "Autonomous project manager",
  skills: ["github", "slack"],
  cron: "0 9 * * 1-5",
};

const testPreset2: ClawPreset = {
  name: "devbot",
  version: "1.0.0",
  description: "Developer assistant",
  skills: ["github"],
};

describe("preset registry", () => {
  beforeEach(() => {
    // Re-register to ensure clean state (registry is module-level)
    registerPreset(testPreset);
    registerPreset(testPreset2);
  });

  it("registers and retrieves a preset by name", () => {
    const found = getPreset("autopm");
    expect(found).toBeDefined();
    expect(found!.name).toBe("autopm");
    expect(found!.description).toBe("Autonomous project manager");
  });

  it("returns undefined for unknown preset", () => {
    expect(getPreset("nonexistent")).toBeUndefined();
  });

  it("lists all registered presets", () => {
    const all = listPresets();
    const names = all.map((p) => p.name);
    expect(names).toContain("autopm");
    expect(names).toContain("devbot");
  });

  it("overwrites preset on re-register with same name", () => {
    const updated: ClawPreset = {
      ...testPreset,
      description: "Updated description",
    };
    registerPreset(updated);
    expect(getPreset("autopm")!.description).toBe("Updated description");
  });
});

describe("qualifiedName", () => {
  it("prepends clawset- prefix to preset name", () => {
    expect(qualifiedName(testPreset)).toBe("clawset-autopm");
  });

  it("works for presets without cron", () => {
    expect(qualifiedName(testPreset2)).toBe("clawset-devbot");
  });
});
