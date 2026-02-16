<p align="center">
  <a href="https://clawsets.ai">
    <img src="https://clawsets.ai/clawsets-logo.png" alt="Clawset" width="200" />
  </a>
</p>

# [Clawset](https://clawsets.ai)

Presets that give your lobster superpowers. Install and configure OpenClaw presets with a single command.

Explore the [available presets](https://clawsets.ai).

## Quick start

```bash
npx clawset issue-triage
```

This fetches the preset from npm, creates an OpenClaw agent, sets up the workspace, installs required skills, configures scheduling, and launches the TUI — all in one step.

## Commands

### Install a preset

```bash
npx clawset <preset>
```

Options:

- `--dry-run` — Show what would be done without making changes
- `--name <agentName>` — Agent name (skips interactive prompt)

The short form also works — `npx clawset <preset>` is equivalent to `npx clawset install <preset>`.

### List available presets

```bash
npx clawset list
```

Queries the npm registry for all `@clawset/*` packages and shows their skills and schedule.

### Delete an agent

```bash
npx clawset delete <name>
```

Removes the agent's schedule, OpenClaw registration, and workspace directory.

Browse all presets at [clawsets.ai](https://clawsets.ai).

## License

MIT
