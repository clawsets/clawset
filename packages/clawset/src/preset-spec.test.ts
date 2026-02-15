import { describe, it, expect } from "vitest";
import { ClawPresetSchema } from "./types.js";
import { autopmPreset } from "#presets/autopm/spec.js";

describe("autopm preset spec", () => {
  it("passes schema validation", () => {
    const result = ClawPresetSchema.safeParse(autopmPreset);
    expect(result.success).toBe(true);
  });

  it("has the correct name", () => {
    expect(autopmPreset.name).toBe("autopm");
  });

  it("does not include clawset- prefix in name", () => {
    expect(autopmPreset.name).not.toMatch(/^clawset-/);
  });

  it("requires github and slack skills", () => {
    expect(autopmPreset.requiredSkills).toEqual(["github", "slack"]);
  });

  it("requires GITHUB_TOKEN secret", () => {
    expect(autopmPreset.requiredSecrets).toEqual(["GITHUB_TOKEN"]);
  });

  it("has a weekday cron schedule", () => {
    expect(autopmPreset.cron).toBe("0 9 * * 1-5");
  });
});
