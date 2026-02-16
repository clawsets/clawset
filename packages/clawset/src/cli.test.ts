import { describe, it, expect, beforeEach, vi } from "vitest";
import { createProgram } from "./cli.js";
import pkg from "../package.json" with { type: "json" };

// Mock registry to avoid network calls
vi.mock("./registry.js", () => ({
  fetchPresetManifest: vi.fn(),
  listAvailablePresets: vi.fn(() => []),
}));

// Mock openclaw to avoid shelling out
vi.mock("./openclaw/client.js", () => ({
  agentWorkspacePath: (name: string) => `/mock/.openclaw/workspace-${name}`,
  addAgent: vi.fn(),
  setupWorkspace: vi.fn(),
  removeAgent: vi.fn(),
  removeCronJob: vi.fn(),
  selectModel: vi.fn(),
  launchTui: vi.fn(),
}));

// Mock prompt to avoid stdin
vi.mock("./ui/prompt.js", () => ({
  promptAgentName: vi.fn((defaultName: string) => defaultName),
  confirmUpgrade: vi.fn(() => false),
  confirmDelete: vi.fn(() => false),
  confirmLaunch: vi.fn(() => false),
}));

// Mock scheduler
vi.mock("./openclaw/scheduler.js", () => ({
  setupSchedule: vi.fn(),
  removeSchedule: vi.fn(),
}));

// Mock validator
vi.mock("./openclaw/validator.js", () => ({
  validateAll: vi.fn(),
}));

// Mock skills
vi.mock("./openclaw/skills.js", () => ({
  checkSkills: vi.fn(),
}));

// Mock secrets
vi.mock("./openclaw/secrets.js", () => ({
  setSecrets: vi.fn(),
}));

describe("createProgram", () => {
  beforeEach(() => {
    // Reset argv to avoid interference between tests
    process.argv = ["node", "clawset"];
  });

  it("creates a program with correct name and version", () => {
    const program = createProgram();
    expect(program.name()).toBe("clawset");
    expect(program.version()).toBe(pkg.version);
  });

  it("registers install, list, and delete subcommands", () => {
    const program = createProgram();
    const commandNames = program.commands.map((c) => c.name());
    expect(commandNames).toContain("install");
    expect(commandNames).toContain("list");
    expect(commandNames).toContain("delete");
  });

  it("install command has --dry-run and --name options", () => {
    const program = createProgram();
    const install = program.commands.find((c) => c.name() === "install")!;
    const optionNames = install.options.map((o) => o.long);
    expect(optionNames).toContain("--dry-run");
    expect(optionNames).toContain("--name");
  });
});
