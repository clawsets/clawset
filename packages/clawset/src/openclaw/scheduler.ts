import { execa } from "execa";
import { theme } from "../ui/theme.js";
import * as openclaw from "./client.js";

const CRONTAB_MARKER = "# clawset-managed";

export async function removeSchedule(agentName: string): Promise<void> {
  try {
    await openclaw.removeCronJob(agentName);
    return;
  } catch {
    // Fall back to system crontab cleanup
  }

  try {
    let existingCrontab = "";
    try {
      const result = await execa("crontab", ["-l"]);
      existingCrontab = result.stdout;
    } catch {
      return; // No crontab to clean
    }

    const filtered = existingCrontab
      .split("\n")
      .filter(
        (line) => !(line.includes(CRONTAB_MARKER) && line.includes(agentName))
      )
      .join("\n");

    await execa("crontab", ["-"], { input: filtered.trim() + "\n" });
  } catch {
    // Best-effort removal
  }
}

export async function setupSchedule(
  presetName: string,
  cron: string
): Promise<void> {
  try {
    await openclaw.addCronJob(presetName, cron);
    return;
  } catch {
    console.log(
      theme.warn(
        "\n    OpenClaw cron not available, falling back to system crontab"
      )
    );
  }

  await setupCrontab(presetName, cron);
}

async function setupCrontab(presetName: string, cron: string): Promise<void> {
  try {
    let existingCrontab = "";
    try {
      const result = await execa("crontab", ["-l"]);
      existingCrontab = result.stdout;
    } catch {
      // No existing crontab
    }

    const job = `${cron} openclaw agent --agent ${presetName} -m "scheduled run" ${CRONTAB_MARKER}`;

    const filtered = existingCrontab
      .split("\n")
      .filter((line) => !line.includes(CRONTAB_MARKER))
      .join("\n");

    const newCrontab = `${filtered}\n${job}\n`.trim() + "\n";

    await execa("crontab", ["-"], { input: newCrontab });
  } catch (error) {
    throw new Error(
      `Failed to configure scheduler. You can manually add this cron job:\n` +
        `  ${cron} openclaw agent --agent ${presetName} -m "scheduled run"\n` +
        `Error: ${(error as Error).message}`
    );
  }
}
