import { execa } from "execa";

export async function validateNodeVersion(minMajor = 22): Promise<void> {
  const major = parseInt(process.versions.node.split(".")[0], 10);
  if (major < minMajor) {
    throw new Error(
      `Node.js v${minMajor}+ is required. Current: v${process.versions.node}`
    );
  }
}

export async function validateOpenClawInstalled(): Promise<void> {
  try {
    await execa("openclaw", ["--version"]);
  } catch {
    throw new Error(
      "OpenClaw CLI not found. Install it with: npm install -g openclaw\n" +
        "See: https://docs.openclaw.ai/cli"
    );
  }
}

export async function validateAll(): Promise<void> {
  await validateNodeVersion();
  await validateOpenClawInstalled();
}
