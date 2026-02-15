import type { ClawPreset } from "../../packages/clawset/src/types.js";

export const compwatchPreset: ClawPreset = {
  name: "compwatch",
  description:
    "Competitive intelligence agent that tracks competitors, surfaces new features, and generates backlog ideas",
  requiredSkills: ["github", "web-browse", "slack"],
  requiredSecrets: ["GITHUB_TOKEN"],
  cron: "0 9 * * 1-5",
};
