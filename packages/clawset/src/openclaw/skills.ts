import { execa } from "execa";
import chalk from "chalk";

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

export interface SkillCheckResult {
  skill: string;
  eligible: boolean;
  missing?: string[];
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
    return { skill, eligible: info.eligible, missing };
  } catch {
    return { skill, eligible: false, missing: ["skill not found"] };
  }
}

export async function checkSkills(
  skills: string[],
  onProgress?: (skill: string, index: number, total: number) => void
): Promise<SkillCheckResult[]> {
  const results: SkillCheckResult[] = [];

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    onProgress?.(skill, i, skills.length);
    const result = await checkSkill(skill);
    results.push(result);

    if (result.eligible) {
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
