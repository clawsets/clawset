import { execa } from "execa";
import chalk from "chalk";
import { confirmHubInstall } from "../ui/prompt.js";

interface SkillInfo {
  name: string;
  eligible: boolean;
  missing: {
    bins: string[];
    anyBins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
}

interface HubInspectResult {
  found: true;
  slug: string;
  summary: string;
}

interface HubNotFound {
  found: false;
}

export interface SkillCheckResult {
  skill: string;
  found: boolean;
  eligible: boolean;
  missing?: string[];
  missingEnv: string[];
}

async function checkSkill(skill: string): Promise<SkillCheckResult> {
  try {
    const result = await execa("openclaw", ["skills", "info", skill, "--json"]);
    const info: SkillInfo = JSON.parse(result.stdout);
    const missing = [
      ...info.missing.bins.map((b) => `bin: ${b}`),
      ...info.missing.anyBins.map((b) => `bin (any): ${b}`),
      ...info.missing.env.map((e) => `env: ${e}`),
      ...info.missing.config.map((c) => `config: ${c}`),
      ...info.missing.os.map((o) => `os: ${o}`),
    ];
    return {
      skill,
      found: true,
      eligible: info.eligible,
      missing,
      missingEnv: info.missing.env,
    };
  } catch {
    return {
      skill,
      found: false,
      eligible: false,
      missing: ["skill not found"],
      missingEnv: [],
    };
  }
}

export async function inspectHubSkill(
  skill: string
): Promise<HubInspectResult | HubNotFound> {
  try {
    const result = await execa("clawhub", ["inspect", skill, "--json"]);
    const data = JSON.parse(result.stdout);
    return { found: true, slug: data.slug, summary: data.summary };
  } catch {
    return { found: false };
  }
}

export async function installHubSkill(skill: string): Promise<void> {
  await execa("clawhub", ["install", skill]);
}

async function resolveSkill(skill: string): Promise<SkillCheckResult> {
  const local = await checkSkill(skill);
  if (local.found) return local;

  const hub = await inspectHubSkill(skill);
  if (!hub.found) return local;

  const accepted = await confirmHubInstall(skill, hub.summary);
  if (!accepted) return local;

  await installHubSkill(skill);
  return checkSkill(skill);
}

export async function checkSkills(
  skills: string[],
  onProgress?: (skill: string, index: number, total: number) => void
): Promise<SkillCheckResult[]> {
  const results: SkillCheckResult[] = [];

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    onProgress?.(skill, i, skills.length);
    const result = await resolveSkill(skill);
    results.push(result);

    if (!result.found) {
      console.log(chalk.red(`\n    ${skill} — not found`));
    } else if (result.eligible) {
      console.log(chalk.green(`\n    ${skill} — ready`));
    } else {
      console.log(
        chalk.yellow(
          `\n    ${skill} — not ready (missing: ${result.missing?.join(", ")})`
        )
      );
    }
  }

  return results;
}
