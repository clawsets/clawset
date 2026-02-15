import { describe, it, expect } from "vitest";
import { ClawPresetSchema } from "./types.js";

describe("ClawPresetSchema", () => {
  const validPreset = {
    name: "issue-triage",
    version: "0.1.0",
    description: "Autonomous project manager",
    skills: ["github", "slack"],
    cron: "0 9 * * 1-5",
  };

  it("accepts a valid preset with all fields", () => {
    const result = ClawPresetSchema.safeParse(validPreset);
    expect(result.success).toBe(true);
  });

  it("accepts a preset without cron (optional)", () => {
    const { name, version, description, skills } = validPreset;
    const result = ClawPresetSchema.safeParse({
      name,
      version,
      description,
      skills,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a preset with empty name", () => {
    const result = ClawPresetSchema.safeParse({ ...validPreset, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a preset with empty skills", () => {
    const result = ClawPresetSchema.safeParse({
      ...validPreset,
      skills: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a preset missing required fields", () => {
    const result = ClawPresetSchema.safeParse({ name: "test" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid version format", () => {
    expect(
      ClawPresetSchema.safeParse({ ...validPreset, version: "v1" }).success
    ).toBe(false);
    expect(
      ClawPresetSchema.safeParse({ ...validPreset, version: "1.0" }).success
    ).toBe(false);
  });
});
