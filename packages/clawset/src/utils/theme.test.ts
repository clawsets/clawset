import { describe, it, expect } from "vitest";
import { theme } from "./theme.js";

describe("theme", () => {
  it("exports all expected color functions", () => {
    const keys = Object.keys(theme);
    expect(keys).toContain("accent");
    expect(keys).toContain("accentBright");
    expect(keys).toContain("accentDim");
    expect(keys).toContain("info");
    expect(keys).toContain("success");
    expect(keys).toContain("warn");
    expect(keys).toContain("error");
    expect(keys).toContain("muted");
    expect(keys).toContain("heading");
    expect(keys).toContain("command");
  });

  it("each function returns a string containing the input", () => {
    for (const [, fn] of Object.entries(theme)) {
      const result = fn("hello");
      expect(result).toContain("hello");
    }
  });
});
