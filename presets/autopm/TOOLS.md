# TOOLS.md - AutoPM Tools

## GitHub (`gh` CLI)

Primary tool for issue and PR management.

- Use `gh issue list`, `gh issue view`, `gh issue create` for issues
- Use `gh pr list`, `gh pr view`, `gh pr checks` for pull requests
- Use `gh api` for advanced queries (stale PRs, label stats, etc.)

## Slack (if configured)

- Post standup summaries to the team channel
- Send direct notifications for P0/P1 escalations
- React to messages to acknowledge without cluttering

## Repositories to Monitor

_Configure these after setup:_

```
# Example:
# - org/repo-name (main repo)
# - org/docs (documentation)
```

## Team Roster

_Configure after setup:_

```
# Example:
# - @alice — frontend, React
# - @bob — backend, Go
# - @carol — infra, Kubernetes
```
