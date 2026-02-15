import { createInterface } from "node:readline/promises";
import { theme } from "./theme.js";

export async function promptAgentName(defaultName: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(
      theme.accent("  Agent name ") + theme.muted(`[${defaultName}]: `)
    );
    return answer.trim() || defaultName;
  } finally {
    rl.close();
  }
}

export async function confirmUpgrade(agentName: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(
      theme.accent(`  "${agentName}" is already installed. `) +
        theme.info("Upgrade? ") +
        theme.muted("[y/N]: ")
    );
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
}

export async function confirmDelete(agentName: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(
      theme.warn(`  Delete agent "${agentName}" and all its data? `) +
        theme.muted("[y/N]: ")
    );
    return answer.trim().toLowerCase() === "y";
  } finally {
    rl.close();
  }
}
