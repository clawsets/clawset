import { describe, it, expect } from "vitest";
import type { ClawPreset } from "./types.js";
import { qualifiedName } from "./preset-runner.js";

const testPreset: ClawPreset = {
  name: "issue-triage",
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

describe("qualifiedName", () => {
  it("prepends clawset- prefix to preset name", () => {
    expect(qualifiedName(testPreset)).toBe("clawset-issue-triage");
  });

  it("works for presets without cron", () => {
    expect(qualifiedName(testPreset2)).toBe("clawset-devbot");
  });
});
