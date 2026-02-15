import { describe, it, expect } from "vitest";
import { ClawPresetSchema } from "./types.js";

describe("ClawPresetSchema", () => {
  const validPreset = {
    name: "autopm",
    description: "Autonomous project manager",
    requiredSkills: ["github", "slack"],
    requiredSecrets: ["GITHUB_TOKEN"],
    cron: "0 9 * * 1-5",
  };

  it("accepts a valid preset with all fields", () => {
    const result = ClawPresetSchema.safeParse(validPreset);
    expect(result.success).toBe(true);
  });

  it("accepts a preset without cron (optional)", () => {
    const { name, description, requiredSkills, requiredSecrets } = validPreset;
    const result = ClawPresetSchema.safeParse({
      name,
      description,
      requiredSkills,
      requiredSecrets,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a preset with empty requiredSecrets", () => {
    const result = ClawPresetSchema.safeParse({
      ...validPreset,
      requiredSecrets: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a preset with empty name", () => {
    const result = ClawPresetSchema.safeParse({ ...validPreset, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a preset with empty requiredSkills", () => {
    const result = ClawPresetSchema.safeParse({
      ...validPreset,
      requiredSkills: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a preset missing required fields", () => {
    const result = ClawPresetSchema.safeParse({ name: "test" });
    expect(result.success).toBe(false);
  });
});
