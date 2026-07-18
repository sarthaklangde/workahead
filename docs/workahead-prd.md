---
id: workahead-demo
title: Workahead semantic PRD and execution demo
status: draft
version: 1
updated: 2026-07-17
source: grilling session with product owner
---

# Workahead semantic PRD and execution demo

## Product thesis

AI can expand the search space and perform the work. Workahead compresses the result into
human-scale decisions before, during, and after execution.

Autonomous agents can inspect more files, compare more possibilities, run more experiments, and
execute more implementation work than a person can. The human bottleneck is understanding what is
about to happen and what already happened. Workahead is the local interface between human intention
and agent execution.

Workahead is a toolbox around Codex and Claude Code, not a replacement for them. It must preserve
the user's existing skills, plugins, MCP servers, slash commands, prompts, repository guidance, and
execution conventions.

## Demo objective

In two to three minutes, demonstrate that a large, messy PRD can become a readable, navigable,
annotatable semantic artifact that lets a developer understand what an agent is going to do without
reading the entire Markdown file or every ticket.

The demo should prove:

1. **Context becomes digestible.** A long PRD with many user stories, assumptions, integrations,
   and constraints can be reorganized into meaningful semantic blocks.
2. **Human intent stays in control.** The user can open a block, understand its context, annotate a
   correction, and queue it without leaving the artifact.
3. **Execution remains legible.** The plan exposes affected tickets, files, expected proof, and
   later discoveries in a form that can be reviewed without reading every agent transcript.

The demo is not trying to prove that Workahead can build a todo app. Developers already believe an
agent can build a feature. The todo app is only a concrete carrier for demonstrating the planning
and review loop.

## Starting material

The demo begins after a grilling and context-synthesis phase. The grilling does not run live in the
two-to-three-minute presentation.

The source PRD should be substantial and intentionally non-generic. It may describe a niche todo
application with 30–50 user stories, unusual integrations, existing-system assumptions, and
non-obvious constraints. The source file remains visible in the filesystem before the HTML surface
opens so the audience sees the transformation:

```text
prd.md
  → semantic overview
  → feature drill-down
  → linked decisions, tickets, and files
  → human annotation
  → visible downstream impact
```

`examples/organizational-memory/PRD.md` is an example of the type of source document Workahead must
make understandable. It contains valid information, but problem statement, solution, user
stories, implementation decisions, architecture, testing, scope, and historical notes are mixed
into one long linear artifact.

## Primary interaction model

The human-facing artifact is HTML, not a Markdown renderer and not a visible knowledge-graph
canvas.

The PRD has hierarchy. That hierarchy becomes a set of semantic blocks. A block is a rich HTML
element with a summary, status, and links to deeper context. The user reads top to bottom and drills
into one block at a time.

```text
semantic overview
  → click a feature, capability, decision, or constraint
  → deeper page inside the same Workahead shell
  → inspect children, relationships, provenance, tickets, and evidence
  → annotate the current block
  → return through breadcrumb or browser history
```

The underlying knowledge graph exists as relationships between semantic units, but it is not
rendered as a network of lines and circles. Relationships are expressed through ordinary links,
breadcrumbs, and compact relationship rows.

Every drill-down page preserves:

- the Workahead shell;
- the current session and Change Queue;
- the annotation interaction;
- the current agent/execution state;
- a stable URL and breadcrumb path.

## First-layer overview

The overview is a synthesized semantic map, not a visual copy of the source Markdown headings.
The number of blocks is not artificially capped. Each block must earn its existence and position by
helping a human understand or decide something.

Top-level ordering follows decision relevance and consequence:

1. what the product is trying to achieve;
2. the user-facing capabilities that deliver that outcome;
3. decisions and blockers that could change the plan;
4. constraints and existing-system dependencies;
5. execution impact and current state;
6. provenance and source material.

Each top-level block uses a compact, predictable summary:

```text
Semantic title
One-sentence outcome.

status · linked tickets · inherited context · blockers
last meaningful change
```

The overview should feel like a high-quality search results page: strong information scent,
predictable scanning, no decorative equal-weight cards, and a clear reason for every block's
position.

## Semantic units

The system is source-agnostic. A semantic unit may come from:

- a `.txt` file;
- a Markdown document;
- a PRD section;
- a ticket;
- generated context;
- an execution note;
- an artifact;
- code-linked evidence.

Users do not navigate by filenames. Files are provenance and working material. The main navigation
is semantic.

Possible semantic types include:

- product outcome;
- capability;
- feature;
- user story;
- requirement;
- decision;
- constraint;
- ticket;
- implementation discovery;
- verification result.

The minimum semantic contract is intentionally small:

- stable identity;
- human-readable title;
- concise generated summary;
- semantic type when confidently known;
- relationships to other units;
- provenance/source references;
- status or confidence when applicable.

All other fields are optional and type-dependent. A decision may have alternatives and rationale. A
ticket may have files and acceptance proof. An execution discovery may have changed assumptions and
evidence. The system must not force every source into one rigid schema.

## Relationships and lineage

The PRD has a primary hierarchy for predictable navigation:

```text
Product
  → Feature
    → User story
      → Requirement
        → Ticket
```

Semantic units may also have explicit cross-links:

- derived from;
- reuses context from;
- depends on;
- conflicts with;
- unlocks;
- verified by;
- changed by.

The user should be able to see which context produced a unit and what the unit produced downstream.
For example, a Kubernetes deployment architecture unit may be referenced by a new repository's
PRD instead of copied. The reference remains visible, versioned, and forkable when the new
repository needs to diverge.

## Detail-page behavior

Detail pages use a shared navigation shell but not a rigid content template. Content adapts to the
semantic unit and available evidence.

Every detail page should make it easy to answer:

- what is this;
- why does it exist;
- where did it come from;
- what does it contain;
- what does it affect;
- what is uncertain or blocked;
- what should the human decide next.

Relevant children, relationships, source references, linked files, tickets, execution discoveries,
and proof appear only when they exist.

## Human annotation and Change Queue

Every semantic block must be annotatable. Block-level annotation is the MVP; precise text selection
is optional and not required for the first demo.

If the artifact is opened through Lavish, Lavish provides the annotation interaction. Workahead adds
semantic block identity, impact metadata, and visible queue state.

The annotation lifecycle is explicit:

```text
draft
  → queued
  → sent to agent
  → agent working
  → plan impact calculated
  → awaiting review
  → applied / rejected / superseded
```

The Change Queue is part of the Workahead artifact and is never hidden behind a black-box feedback
mechanism. Each queued item shows:

- the target semantic unit;
- the human instruction;
- affected descendants and tickets;
- the exact context sent to the agent;
- current execution state;
- generated changes and evidence;
- the next human decision.

The user can queue a correction and execution begins immediately after queueing. There should not be
an approval gate on every ticket or annotation. The main approval happens before bulk execution;
execution remains interruptible at any time.

## Blocker questions

Blockers discovered during synthesis or review become rich human-input blocks, not hidden terminal
questions. A blocker may support:

- multiple choice;
- free text;
- artifact upload;
- image attachment;
- link to an existing semantic unit;
- defer;
- mark out of scope.

The top level should show how many blockers exist and what they affect. Example:

```text
8 decisions blocking execution
3 affect Sync
2 affect Notifications
1 affects the data model
2 are low-risk assumptions
```

## Execution model

Workahead does not replace Codex or Claude Code. It assumes the user has launched an agent with the
permission scope they want for the current project directory. The interface should make that scope
visible but should not impose a separate sandbox for the demo.

```text
Agent access: full permission
Working directory: <current project directory>
```

Workahead owns the local semantic artifact and handoff context. The user's existing agent owns the
model, skills, plugins, MCPs, slash commands, prompts, and implementation conventions.

For the demo, Workahead may control ticket generation so the end-to-end idea is easy to see. In the
real toolbox, the ticket-generation step must remain replaceable by the user's preferred agent
workflow.

Execution evidence should be compressed into human-scale events and proof:

```text
Agent started
Read 4 relevant context units
Updated semantic unit: Sync behavior
Affected tickets recalculated: WA-04, WA-05
Changed 3 files
Verification passed
Screenshot attached
Awaiting human review
```

The raw Codex or Claude Code transcript may remain available, but it is not the primary review
surface.

## Local artifact model

There is no database, cloud service, or hidden application state in the core demo. The Workahead
session is a temporary local artifact that can be destroyed when the feature is complete.

Each chat is assumed to represent one feature from end to end. A session gets a UUID and an HTML
entry point:

```text
.workahead/<session-uuid>/
  index.html
  context/
  prd/
  tickets/
  execution/
```

`index.html` is the canonical human-facing session entry point and semantic navigation surface.
Markdown and text files remain detailed agent-readable working material. The repository's durable
`docs/` folder is updated deliberately by a ticket when knowledge should outlive the temporary
Workahead session.

## Demo sequence

The 2–3 minute demo should be direct:

1. Show the large source `prd.md` in the filesystem.
2. Explain that it contains the information, but is difficult to inspect and reason about.
3. Open Workahead's `index.html` semantic overview.
4. Show that the top-level blocks are synthesized by meaning and consequence, not raw Markdown
   headings.
5. Drill into one meaningful feature or decision using normal HTML links and breadcrumbs.
6. Show linked user stories, inherited context, affected tickets, files, and expected proof.
7. Annotate the semantic block through the Lavish interaction.
8. Show the annotation in Workahead's visible Change Queue with downstream impact.
9. Queue it for immediate execution and show the plan update/evidence state.

The demo should show, not explain, that Workahead turns a flat PRD into an interface where one human
can understand and steer work performed by many agents.

## Non-goals for this demo

- replacing Codex or Claude Code;
- discovering or reproducing every installed MCP, skill, or plugin;
- building a general-purpose knowledge graph canvas;
- creating a cloud database or hosted collaboration backend;
- enforcing a custom sandbox or permission model;
- perfect text-range annotation;
- proving that a todo app can be implemented;
- showing every ticket or every agent transcript at once.
