import { describe, it, expect, beforeEach, vi } from "vitest";
import { createProgram } from "./cli.js";

// Mock the generated registry to avoid side-effect imports
vi.mock("./generated/preset-registry.js", () => ({}));

// Mock openclaw to avoid shelling out
vi.mock("./utils/openclaw.js", () => ({
  agentWorkspacePath: (name: string) => `/mock/.openclaw/workspace-${name}`,
  addAgent: vi.fn(),
  setupWorkspace: vi.fn(),
  removeAgent: vi.fn(),
  removeCronJob: vi.fn(),
  selectModel: vi.fn(),
  launchTui: vi.fn(),
}));

// Mock prompt to avoid stdin
vi.mock("./utils/prompt.js", () => ({
  promptAgentName: vi.fn((defaultName: string) => defaultName),
  confirmUpgrade: vi.fn(() => false),
  confirmDelete: vi.fn(() => false),
  confirmLaunch: vi.fn(() => false),
}));

// Mock scheduler
vi.mock("./utils/scheduler.js", () => ({
  setupSchedule: vi.fn(),
  removeSchedule: vi.fn(),
}));

// Mock validator
vi.mock("./utils/validator.js", () => ({
  validateAll: vi.fn(),
}));

// Mock skills
vi.mock("./utils/skills.js", () => ({
  checkSkills: vi.fn(),
}));

// Mock secrets
vi.mock("./utils/secrets.js", () => ({
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
    expect(program.version()).toBe("0.1.0");
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
