# Workahead product thesis

## The core idea

AI can expand the search space and perform the work. Workahead compresses the result into
human-scale decisions before, during, and after execution.

This is the reason Workahead exists. Autonomous agents can search more files, compare more
possibilities, run more experiments, and execute more implementation work than a person can. But a
human still has to decide whether the plan is correct, whether the trade-offs are acceptable, and
whether the result matches the intended product.

The human bottleneck is not the ability to generate more work. It is the ability to understand the
work that is about to happen and the work that already happened.

Workahead is the interface between human intent and agent execution:

```text
messy repository + conversation + existing skills/tools
                    ↓
          context discovery and synthesis
                    ↓
       human-scale semantic PRD and decisions
                    ↓
             tickets and execution plan
                    ↓
                agent execution
                    ↓
     condensed evidence, discoveries, and new context
                    ↺
```

## What the demo must prove

The first demo should prove three things:

1. **Comprehensive context can become digestible.** AI can inspect a messy repository and surface
   the relevant information for a feature without forcing the human to read every file or agent
   transcript.
2. **The human can make decisions before implementation.** The synthesized PRD is a navigable,
   semantic HTML artifact. The user can explore it by hierarchy, answer blockers, choose between
   alternatives, annotate blocks, and sign off on the plan.
3. **Execution remains interruptible and legible.** Agents can work autonomously after sign-off,
   while Workahead records compact progress, screenshots or other proof, changed assumptions,
   blockers, and new context. The user can stop execution when something looks wrong and resume
   from the updated frontier.

## Workahead is a toolbox, not a replacement agent

Workahead must not replace Codex, Claude Code, or the user's existing agent workflow.

Users may already have:

- carefully tuned prompts and slash commands;
- skills and plugins;
- MCP servers and connectors;
- preferred ticket formats;
- repository-specific `AGENTS.md`, `CLAUDE.md`, and scripts;
- a trusted way of starting a goal or execution loop.

Workahead should preserve that investment. It owns the review surface and the local artifact loop,
not the user's model provider, agent runtime, plugin roster, or prompt philosophy.

The integration boundary should therefore be:

```text
Workahead creates and maintains a reviewable local artifact
                    ↓
human reviews or annotates the artifact
                    ↓
Workahead prepares a visible instruction/change set
                    ↓
Codex or Claude Code executes it in the user's existing environment
                    ↓
Workahead ingests the resulting files, evidence, and discoveries
```

Workahead may provide sensible defaults for the demo, including automatic ticket generation, but
those defaults must be visible, editable, and replaceable. They must not become a hidden prompt
layer that pretends to know the user's installed skills, MCPs, plugins, or execution conventions.

## Human review is not a temporary concession

Autonomous execution and human review are not opposites. The value of autonomy is that agents can
do more work between meaningful human decisions.

Workahead should optimize the spacing between those decisions:

- broad context gathering can be autonomous;
- synthesis can be autonomous;
- blocker discovery can be autonomous;
- human decisions should be presented as quick, rich inputs;
- execution can be autonomous after the plan is approved;
- proof and new context should be compressed for the next human decision.

The product should never assume that the human wants to read everything. It should make it easy to
go deeper only where a decision, risk, blocker, or unexpected change warrants attention.
