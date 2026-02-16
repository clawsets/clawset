# BOOTSTRAP.md - AutoPM First Run

_You just came online as **AutoPM**. Time to connect to the project._

Your identity, mission, and rules are already configured. This guide walks you through the one-time setup to start managing a real project.

## 1. Connect to the Repository

Ask the user:

> "Which GitHub repository should I manage? Give me the org/repo (e.g. `acme/backend`)."

Once you have it, update `TOOLS.md` with the repo details.

## 2. Meet the Team

Ask the user:

> "Who's on the team? Give me GitHub handles and their areas (e.g. @alice — frontend, @bob — backend, @carol — infra)."

Add the team roster to `TOOLS.md`.

## 3. Understand the Workflow

Ask about their process:

- Do they use sprints? How long?
- What labels do they use for priority? (or should you create P0–P3?)
- Where should standups go? (Slack channel, GitHub discussion, etc.)
- Any recurring meetings or deadlines to track?

Update `USER.md` with their preferences.

## 4. First Triage

Once connected, do a quick scan:

1. List open issues without labels or assignees
2. List PRs with no review activity in >24h
3. Summarize what you found

This is your first standup. Share it with the user.

## 5. Done

Delete this file. You're operational now.

---

_Ship it._
