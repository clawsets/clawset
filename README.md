# 🦞🛠️ clawset

Presets that give your lobster superpowers.

**clawset** is a CLI that installs and configures [OpenClaw](https://docs.openclaw.ai) presets with a single command. Each preset bundles an agent workspace, required skills, and a cron schedule into a one-liner setup.

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
4. Checks that required skills (e.g. GitHub, Slack) are configured and sets any missing secrets
5. Sets up a cron schedule if the preset defines one
6. Opens the model selector

## Presets

Presets live in the `presets/` directory. Each preset is a folder containing:

- `spec.ts` — preset metadata (name, description, skills, cron)
- `*.md` — workspace template files copied into the agent workspace

### autopm

Autonomous project manager that triages issues, assigns tasks, and generates standups.

| | |
|---|---|
| **Skills** | github, slack |
| **Schedule** | Weekdays at 9am (`0 9 * * 1-5`) |

## Creating a preset

1. Create a new folder under `presets/`, e.g. `presets/mypreset/`
2. Add a `spec.ts`:

```typescript
import type { ClawPreset } from "../../packages/clawset/src/types.js";

export const mypresetPreset: ClawPreset = {
  name: "mypreset",
  description: "What this preset does",
  skills: ["github"],
  cron: "0 * * * *", // optional
};
```

3. Add workspace template files (`.md` files) to the same folder
4. Run `pnpm build` — the preset is auto-discovered and registered


## Versioning & changelogs

Each preset is versioned independently via the `version` field in its `spec.json`. Changelogs are generated with [git-cliff](https://git-cliff.org), scoped to commits that touch the preset's directory.

Tags follow the convention `v<version>-<preset>` (e.g. `v0.1.0-autopm`). git-cliff uses these tags to determine version boundaries — without them, all commits appear under a single version.

**Workflow for releasing a preset:**

1. Tag the current release before making changes:
   ```bash
   git tag v0.1.0-autopm
   ```

2. Commit your changes with [conventional commit](https://www.conventionalcommits.org) messages:
   ```bash
   git add presets/autopm/AGENTS.md
   git commit -m "docs: update agent instructions for autopm"
   ```

3. Bump the version in `presets/<preset>/spec.json` (`patch`, `minor`, or `major` as appropriate):
   ```bash
   git add presets/autopm/spec.json
   git commit -m "chore: bump autopm to 0.2.0"
   ```

4. Generate the changelog:
   ```bash
   pnpm changelog autopm
   ```

5. Commit the updated changelog:
   ```bash
   git add presets/autopm/CHANGELOG.md
   git commit -m "docs: update autopm changelog"
   ```

You can also generate a root-level changelog covering all commits:

```bash
pnpm changelog
```

## Links

- [ClawSets](https://clawsets.ai)
- [OpenClaw docs](https://docs.openclaw.ai)

## License

MIT
