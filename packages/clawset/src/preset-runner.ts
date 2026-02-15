import type { ClawPreset, StepResult } from "./types.js";
import { theme } from "./ui/theme.js";
import { validateAll } from "./openclaw/validator.js";
import * as openclaw from "./openclaw/client.js";
import { checkSkills } from "./openclaw/skills.js";
import { setSecrets } from "./openclaw/secrets.js";
import { removeSchedule, setupSchedule } from "./openclaw/scheduler.js";
import { confirmLaunch } from "./ui/prompt.js";

const START_MESSAGE =
  "Hey! I just came online. Walk me through the initial setup — let's get started.";

const PRESET_PREFIX = "clawset-";

const presets: Record<string, ClawPreset> = {};

export function registerPreset(preset: ClawPreset): void {
  presets[preset.name] = preset;
}

export function getPreset(name: string): ClawPreset | undefined {
  return presets[name];
}

/** Returns the fully-qualified name with `clawset-` prefix. */
export function qualifiedName(preset: ClawPreset): string {
  return `${PRESET_PREFIX}${preset.name}`;
}

export function listPresets(): ClawPreset[] {
  return Object.values(presets);
}

export async function runPreset(
  preset: ClawPreset,
  agentName: string,
  resolveTemplateDir: (folderName: string) => string
): Promise<void> {
  console.log(
    theme.heading(`\n  Installing preset: `) +
      theme.command(qualifiedName(preset)) +
      theme.muted(` (agent: ${agentName})\n`)
  );

  const results: StepResult[] = [];

  const steps: Array<{ label: string; fn: () => Promise<void> }> = [
    {
      label: "Validating environment",
      fn: () => validateAll(),
    },
    {
      label: "Creating agent",
      fn: () => openclaw.addAgent(agentName),
    },
    {
      label: "Setting up workspace",
      fn: async () => {
        const templateDir = resolveTemplateDir(preset.name);
        await openclaw.setupWorkspace(agentName, templateDir);
      },
    },
    {
      label: "Checking skills",
      fn: async () => {
        await checkSkills(preset.requiredSkills);
      },
    },
    {
      label: "Setting secrets",
      fn: () => setSecrets(preset.requiredSecrets),
    },
    {
      label: "Setting up scheduler",
      fn: async () => {
        if (preset.cron) {
          await setupSchedule(agentName, preset.cron);
        }
      },
    },
  ];

  for (const step of steps) {
    process.stdout.write(theme.info(`  ${step.label}...`));
    try {
      await step.fn();
      console.log(theme.success(" done"));
      results.push({ step: step.label, success: true, message: "OK" });
    } catch (error) {
      console.log(theme.error(" failed"));
      const err = error as Error;
      console.error(theme.error(`\n  Error: ${err.message}\n`));
      process.exit(1);
    }
  }

  console.log(theme.info("\n  Select a model for this preset:\n"));
  try {
    await openclaw.selectModel();
    results.push({ step: "Selecting model", success: true, message: "OK" });
  } catch {
    results.push({
      step: "Selecting model",
      success: false,
      message: "skipped",
    });
    console.log(
      theme.warn(
        "\n  Model selection was cancelled or failed. " +
          "You can configure it later with: openclaw configure --section model\n"
      )
    );
  }

  printSummary(preset, agentName, results);
  await promptAndLaunch(agentName);
}

export async function upgradePreset(
  preset: ClawPreset,
  agentName: string,
  resolveTemplateDir: (folderName: string) => string
): Promise<void> {
  console.log(
    theme.heading(`\n  Upgrading preset: `) +
      theme.command(qualifiedName(preset)) +
      theme.muted(` (agent: ${agentName})\n`)
  );

  const results: StepResult[] = [];

  const steps: Array<{ label: string; fn: () => Promise<void> }> = [
    {
      label: "Updating workspace files",
      fn: async () => {
        const templateDir = resolveTemplateDir(preset.name);
        await openclaw.setupWorkspace(agentName, templateDir);
      },
    },
    {
      label: "Checking skills",
      fn: async () => {
        await checkSkills(preset.requiredSkills);
      },
    },
    {
      label: "Checking secrets",
      fn: () => setSecrets(preset.requiredSecrets),
    },
    {
      label: "Updating scheduler",
      fn: async () => {
        if (preset.cron) {
          try {
            await removeSchedule(agentName);
          } catch {
            // no existing schedule to remove
          }
          await setupSchedule(agentName, preset.cron);
        }
      },
    },
  ];

  for (const step of steps) {
    process.stdout.write(theme.info(`  ${step.label}...`));
    try {
      await step.fn();
      console.log(theme.success(" done"));
      results.push({ step: step.label, success: true, message: "OK" });
    } catch (error) {
      console.log(theme.error(" failed"));
      const err = error as Error;
      console.error(theme.error(`\n  Error: ${err.message}\n`));
      process.exit(1);
    }
  }

  const allPassed = results.every((r) => r.success);
  console.log(
    allPassed
      ? theme.success(
          `\n  Preset "${qualifiedName(preset)}" upgraded successfully!\n`
        )
      : theme.warn(
          `\n  Preset "${qualifiedName(preset)}" upgraded with warnings.\n`
        )
  );
  for (const r of results) {
    const icon = r.success ? theme.success("\u2713") : theme.error("\u2717");
    console.log(`  ${icon} ${theme.muted(r.step)}`);
  }
  console.log(
    theme.muted(
      `\n  Run: openclaw agent --agent ${agentName} -m "your prompt here"`
    )
  );
  if (preset.cron) {
    console.log(theme.muted(`  Scheduled: ${preset.cron}`));
  }
  console.log();
  await promptAndLaunch(agentName);
}

async function promptAndLaunch(agentName: string): Promise<void> {
  const shouldLaunch = await confirmLaunch();
  if (!shouldLaunch) return;

  console.log(theme.muted("\n  Launching TUI...\n"));
  try {
    await openclaw.launchTui(agentName, START_MESSAGE);
  } catch {
    // User exited TUI or it failed to connect — not a fatal error
  }
}

function printSummary(
  preset: ClawPreset,
  agentName: string,
  results: StepResult[]
): void {
  const allPassed = results.every((r) => r.success);
  console.log(
    allPassed
      ? theme.success(
          `\n  Preset "${qualifiedName(preset)}" installed successfully!\n`
        )
      : theme.warn(
          `\n  Preset "${qualifiedName(preset)}" installed with warnings.\n`
        )
  );
  for (const r of results) {
    const icon = r.success ? theme.success("\u2713") : theme.error("\u2717");
    console.log(`  ${icon} ${theme.muted(r.step)}`);
  }
  console.log(
    theme.muted(
      `\n  Run: openclaw agent --agent ${agentName} -m "your prompt here"`
    )
  );
  if (preset.cron) {
    console.log(theme.muted(`  Scheduled: ${preset.cron}`));
  }
  console.log();
}
