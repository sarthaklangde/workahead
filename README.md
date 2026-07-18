# Workahead

Workahead is the local review layer between a developer's product context and a coding agent.

It turns a PRD and repository context into a readable plan, connected tickets, and a visible
execution record. It works alongside Codex and Claude Code; it does not replace either one.

```text
prd.md + repository context
            ↓
       readable plan
            ↓
   tickets and decisions
            ↓
   agent execution + proof
```

## Repository layout

```text
apps/web/                   Next.js site and product surface
cli/                        CLI boundary (coming next)
packages/core/              Session and semantic model (coming next)
skills/workahead/           Agent instructions
docs/                       Workahead product documentation
examples/                   Sanitized PRD inputs
```

## Run the site

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` is the product site.
- `/demo` is the current product walkthrough using the organizational-memory PRD.

## The local artifact format

Workahead sessions live inside the project being worked on:

```text
.workahead/session-uuid/
├── index.html
├── session.md
├── source/
├── plan/
├── tickets/
└── execution/
```

Markdown remains the durable source. HTML is the review surface. No database or cloud service is
required for the core loop.

## Status

The site and product surface are being shaped first in `apps/web/`. The CLI, parser, renderer, and
agent bridge will be built behind the boundaries reserved in `cli/` and `packages/core/`.

## Application workspace

The web app is intentionally isolated from the repository root:

```text
apps/web/
├── src/app/                  Next.js routes and UI
├── public/                   Static assets
├── package.json              Web app dependencies and scripts
├── next.config.ts            Next.js configuration
├── postcss.config.mjs        Tailwind/PostCSS configuration
├── tsconfig.json             Web app TypeScript configuration
└── AGENTS.md                 Next.js-specific agent instructions
```

Run web commands from `apps/web/`. The repository root is reserved for product documentation,
examples, skills, the CLI, and shared packages.
