---
name: workahead
description: Turn messy product context and PRDs into reviewable HTML plans, connected tickets, and visible agent execution.
---

# Workahead

Use Workahead when a feature spans multiple files, decisions, or agent sessions.

The workflow is:

1. Read the repository context and source PRD.
2. Preserve the source files and create a semantic plan.
3. Break the plan into dependency-aware tickets.
4. Wait for human review before execution.
5. Run bounded tickets and record changed files, evidence, discoveries, and blockers.
6. Update the plan when execution changes the understanding.

Workahead is a local review layer for Codex and Claude Code. Do not replace the user's existing
skills, plugins, MCPs, prompts, or agent workflow.
