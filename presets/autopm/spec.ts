import type { ClawPreset } from "../../packages/clawset/src/types.js";

export const autopmPreset: ClawPreset = {
  name: "autopm",
  description:
    "Autonomous project manager that triages issues, assigns tasks, and generates standups",
  requiredSkills: ["github", "slack"],
  requiredSecrets: ["GITHUB_TOKEN"],
  cron: "0 9 * * 1-5",
};
