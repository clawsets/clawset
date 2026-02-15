# 🦞🛠️ clawset

Presets that give your lobster superpowers.

**clawset** is a CLI that installs and configures [OpenClaw](https://docs.openclaw.ai) presets with a single command. Each preset bundles an agent workspace, required skills, secrets, and a cron schedule into a one-liner setup.

## Usage

```bash
# Install a preset (interactive — prompts for agent name)
clawset install autopm

# Shorthand — same as above
clawset autopm

# Skip the prompt with --name
clawset install autopm --name my-pm-agent

# Preview what will happen
clawset install autopm --dry-run

# List all presets and their install status
clawset list

# Delete an installed agent and its data
clawset delete autopm
```

## How it works

When you run `clawset install <preset>`, the CLI:

1. Validates the environment (OpenClaw installed, gateway reachable)
2. Creates an OpenClaw agent named `clawset-<preset>` (or your chosen name)
3. Copies preset workspace files (AGENTS.md, IDENTITY.md, etc.) into the agent workspace
4. Checks that required skills (e.g. GitHub, Slack) are configured
5. Prompts for any required secrets (e.g. `GITHUB_TOKEN`)
6. Sets up a cron schedule if the preset defines one
7. Opens the model selector

## Presets

Presets live in the `presets/` directory. Each preset is a folder containing:

- `spec.ts` — preset metadata (name, description, required skills/secrets, cron)
- `*.md` — workspace template files copied into the agent workspace

### autopm

Autonomous project manager that triages issues, assigns tasks, and generates standups.

| | |
|---|---|
| **Skills** | github, slack |
| **Secrets** | GITHUB_TOKEN |
| **Schedule** | Weekdays at 9am (`0 9 * * 1-5`) |

## Creating a preset

1. Create a new folder under `presets/`, e.g. `presets/mypreset/`
2. Add a `spec.ts`:

```typescript
import type { ClawPreset } from "../../packages/clawset/src/types.js";

export const mypresetPreset: ClawPreset = {
  name: "mypreset",
  description: "What this preset does",
  requiredSkills: ["github"],
  requiredSecrets: ["MY_TOKEN"],
  cron: "0 * * * *", // optional
};
```

3. Add workspace template files (`.md` files) to the same folder
4. Run `pnpm build` — the preset is auto-discovered and registered


## Links

- [ClawSets](https://clawsets.ai)
- [OpenClaw docs](https://docs.openclaw.ai)

## License

MIT
