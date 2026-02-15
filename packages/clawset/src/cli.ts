import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { theme } from "./ui/theme.js";
import {
  getPreset,
  qualifiedName,
  listPresets,
  runPreset,
  upgradePreset,
} from "./preset-runner.js";
import * as openclaw from "./openclaw/client.js";
import { removeSchedule } from "./openclaw/scheduler.js";
import { promptAgentName, confirmUpgrade, confirmDelete } from "./ui/prompt.js";

import pkg from "../package.json" with { type: "json" };

// Side-effect import: auto-discovers and registers all presets at build time
import "./generated/preset-registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveTemplateDir(folderName: string): string {
  return path.resolve(__dirname, "presets", folderName);
}

const VERSION = pkg.version;

function bannerLine(): string {
  const title = "\uD83E\uDD9E\uD83D\uDEE0\uFE0F clawset";
  return (
    `${theme.heading(title)} ${theme.info(VERSION)} ${theme.muted("\u2014")} ` +
    theme.accentDim("Presets that give your lobster superpowers.")
  );
}

function themeHelp(raw: string): string {
  return raw
    .replace(
      /^(Usage:)( .+)$/m,
      (_m, label, rest) => theme.heading(label) + theme.muted(rest)
    )
    .replace(/^(Commands:)$/m, (_m, label) => theme.heading(label))
    .replace(/^(Options:)$/m, (_m, label) => theme.heading(label))
    .replace(
      /^( {2})(\S.+?)( {2,})(.+)$/gm,
      (_m, indent, term, gap, desc) =>
        `${indent}${theme.command(term)}${gap}${theme.muted(desc)}`
    )
    .replace(/^( {30,}\S.+)$/gm, (_m, line) => theme.muted(line))
    .replace(/^([A-Z][^:\n].+)$/gm, (_m, desc) => theme.accentDim(desc));
}

const KNOWN_SUBCOMMANDS = ["install", "list", "delete", "help"];

export function createProgram(): Command {
  // Argv rewriting: if the first arg after node+script is not a known
  // subcommand, treat it as a shorthand for `install <preset>`
  const args = process.argv.slice(2);
  if (
    args.length > 0 &&
    !args[0].startsWith("-") &&
    !KNOWN_SUBCOMMANDS.includes(args[0])
  ) {
    process.argv.splice(2, 0, "install");
  }

  const program = new Command();

  program
    .name("clawset")
    .description("Install and configure OpenClaw presets with a single command")
    .version(VERSION)
    .configureOutput({
      writeOut: (str) => process.stdout.write(themeHelp(str)),
      writeErr: (str) => process.stderr.write(themeHelp(str)),
    })
    .addHelpText("beforeAll", () => `\n${bannerLine()}\n`)
    .hook("preAction", () => {
      console.log(`\n${bannerLine()}\n`);
    });

  // --- install ---
  program
    .command("install <preset>")
    .description("Install a preset (use the short name, e.g. autopm)")
    .option("--dry-run", "Show what would be done without making changes")
    .option("--name <agentName>", "Agent name (skips interactive prompt)")
    .action(
      async (
        presetArg: string,
        options: { dryRun?: boolean; name?: string }
      ) => {
        const preset = getPreset(presetArg);
        if (!preset) {
          console.error(
            theme.error(`Unknown preset: "${presetArg}"\n`) +
              theme.muted('Run "clawset list" to see available presets.')
          );
          process.exit(1);
        }

        const defaultName = qualifiedName(preset);
        const agentName = options.name ?? (await promptAgentName(defaultName));

        if (options.dryRun) {
          console.log(
            theme.heading("  Dry run \u2014 no changes will be made.\n")
          );
          console.log(
            `  ${theme.muted("Preset:")}      ${theme.command(qualifiedName(preset))}`
          );
          console.log(
            `  ${theme.muted("Agent name:")}  ${theme.info(agentName)}`
          );
          console.log(
            `  ${theme.muted("Template:")}    ${theme.muted(resolveTemplateDir(preset.name))}`
          );
          console.log(
            `  ${theme.muted("Skills:")}      ${theme.accent(preset.requiredSkills.join(", "))}`
          );
          console.log(
            `  ${theme.muted("Secrets:")}     ${theme.accent(preset.requiredSecrets.join(", "))}`
          );
          if (preset.cron) {
            console.log(
              `  ${theme.muted("Schedule:")}    ${theme.accent(preset.cron)}`
            );
          }
          console.log();
          return;
        }

        // Check if already installed
        const wsPath = openclaw.agentWorkspacePath(agentName);
        let installed = false;
        try {
          await fs.access(wsPath);
          installed = true;
        } catch {
          // not installed
        }

        if (installed) {
          const shouldUpgrade = await confirmUpgrade(agentName);
          if (!shouldUpgrade) {
            console.log(theme.muted("\n  Cancelled.\n"));
            return;
          }
          await upgradePreset(preset, agentName, resolveTemplateDir);
          return;
        }

        await runPreset(preset, agentName, resolveTemplateDir);
      }
    );

  // --- list ---
  program
    .command("list")
    .description("List all available presets")
    .action(async () => {
      const presets = listPresets();
      console.log(theme.heading("  Available presets\n"));
      for (const p of presets) {
        const qName = qualifiedName(p);
        const wsPath = openclaw.agentWorkspacePath(qName);
        let installed = false;
        try {
          await fs.access(wsPath);
          installed = true;
        } catch {
          // not installed
        }
        const marker = installed
          ? theme.success("\u2714")
          : theme.muted("\u2022");
        const status = installed ? " " + theme.success("(installed)") : "";
        console.log(`  ${marker} ${theme.command(p.name)}${status}`);
        console.log(theme.muted(`    ${p.description}`));
        console.log(
          `    ${theme.muted("Skills:")} ${theme.accent(p.requiredSkills.join(", "))}`
        );
        console.log(
          `    ${theme.muted("Secrets:")} ${theme.accent(p.requiredSecrets.join(", "))}`
        );
        if (p.cron) {
          console.log(
            `    ${theme.muted("Schedule:")} ${theme.accent(p.cron)}`
          );
        }
        console.log();
      }
    });

  // --- delete ---
  program
    .command("delete <name>")
    .description("Delete an installed agent (accepts short or full name)")
    .action(async (nameArg: string) => {
      // Accept either short name or full prefixed name
      const agentName = nameArg.startsWith("clawset-")
        ? nameArg
        : `clawset-${nameArg}`;

      const confirmed = await confirmDelete(agentName);
      if (!confirmed) {
        console.log(theme.muted("\n  Cancelled.\n"));
        return;
      }

      console.log();

      // 1. Remove cron job
      process.stdout.write(theme.info("  Removing schedule..."));
      try {
        await removeSchedule(agentName);
        console.log(theme.success(" done"));
      } catch {
        console.log(theme.warn(" skipped"));
      }

      // 2. Remove agent
      process.stdout.write(theme.info("  Removing agent..."));
      try {
        await openclaw.removeAgent(agentName);
        console.log(theme.success(" done"));
      } catch {
        console.log(theme.warn(" skipped"));
      }

      // 3. Remove workspace directory
      const wsPath = openclaw.agentWorkspacePath(agentName);
      process.stdout.write(theme.info("  Removing workspace..."));
      try {
        await fs.rm(wsPath, { recursive: true, force: true });
        console.log(theme.success(" done"));
      } catch {
        console.log(theme.warn(" skipped"));
      }

      console.log(theme.success(`\n  Agent "${agentName}" deleted.\n`));
    });

  return program;
}
