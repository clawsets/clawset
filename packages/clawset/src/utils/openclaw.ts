import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { execa } from "execa";

export function agentWorkspacePath(name: string): string {
  return path.join(os.homedir(), ".openclaw", `workspace-${name}`);
}

export async function addAgent(name: string): Promise<void> {
  try {
    await execa("openclaw", [
      "agents",
      "add",
      name,
      "--non-interactive",
      "--workspace",
      agentWorkspacePath(name),
    ]);
  } catch (error) {
    const message = (error as Error).message || "";
    if (message.includes("already exists")) {
      return;
    }
    throw error;
  }
}

export async function setConfig(key: string, value: string): Promise<void> {
  await execa("openclaw", ["config", "set", key, value]);
}

export async function setSecret(key: string, value: string): Promise<void> {
  await execa("openclaw", ["config", "set", `secrets.${key}`, value]);
}

export async function setupWorkspace(
  agentName: string,
  templateDir: string
): Promise<void> {
  const workspaceDir = agentWorkspacePath(agentName);
  await fs.mkdir(workspaceDir, { recursive: true });

  const files = await fs.readdir(templateDir);
  for (const file of files) {
    const src = path.join(templateDir, file);
    const dest = path.join(workspaceDir, file);
    await fs.copyFile(src, dest);
  }
}

export async function runAgent(
  agentName: string,
  message: string
): Promise<string> {
  const result = await execa("openclaw", [
    "agent",
    "--agent",
    agentName,
    "-m",
    message,
  ]);
  return result.stdout;
}

export async function addCronJob(
  presetName: string,
  cron: string
): Promise<void> {
  await execa("openclaw", [
    "cron",
    "add",
    "--name",
    presetName,
    "--cron",
    cron,
    "--agent",
    presetName,
    "--message",
    "scheduled run",
  ]);
}

export async function removeAgent(name: string): Promise<void> {
  await execa("openclaw", ["agents", "delete", name, "--force"]);
}

export async function removeCronJob(name: string): Promise<void> {
  await execa("openclaw", ["cron", "rm", name]);
}

export async function launchTui(
  agentName: string,
  message: string
): Promise<void> {
  const sessionKey = `agent:${agentName}:main`;
  await execa(
    "openclaw",
    ["tui", "--session", sessionKey, "--message", message],
    { stdio: "inherit" }
  );
}

export async function selectModel(): Promise<void> {
  await execa("openclaw", ["configure", "--section", "model"], {
    stdio: "inherit",
  });
}
