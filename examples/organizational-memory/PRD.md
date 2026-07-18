---
id: 001
title: Chat-artifact mock → live product (one product, five deployments)
status: in-progress
labels: [ready-for-agent]
created: 2026-07-09
updated: 2026-07-09 (T1–T7 shipped; n8n/Drive ingestion spike added — GenAI Fund track priority)
window: prep Jul 9–10 · sprint Jul 11 09:00 → Jul 12 09:00
---

# Chat-artifact mock → live product

## Problem Statement

The team has a fully-mocked, deterministic UX prototype (the `chat-artifact` workspace) that proves the whole product story — private AI chat → shared artifact → colleague review → an extracted, approved, reusable **Flow** → recall and re-run by teammates — but nothing behind it is real. Every "AI" beat is scripted, every document is a hardcoded string, every persona is a fake switcher, and every permission moment is theater.

The hackathon (judged 24h sprint, Jul 11–12) requires a working product that judges can touch: ask their own questions, upload their own files, switch personas and see real access control, and watch a real agent assemble real artifacts from a real corpus. The same product must be submitted to up to five sponsor tracks (organizational-AI-memory hero, Tasco enterprise knowledge, Shinhan management BI, Phong Vũ self-service BI, aviation maintenance copilot), where per-track differentiation comes from seeded data and demo framing — not from feature differences.

## Solution

Evolve the chat-artifact codebase in place into a live product, ≤5% faked. A single AI agent with a deliberately minimal tool surface (filesystem retrieval over a governed corpus, SQL over a seeded database, artifact creation, semantic search) runs on a standalone Node server that owns the corpus as a **filesystem database** and per-track DuckDB databases. Supabase provides real auth users, membership-derived **search perimeters** enforced by pre-retrieval tool sandboxing with RLS as backstop, and persistence for Flows, versions, comments, and suggestions. The existing scripted demo survives as a permanent **Tour mode** used for the recorded video and onboarding; judges use the live product.

Differentiation across the five problem statements is achieved by one parameterized corpus-generation pipeline producing a seeded corpus/database per track, plus per-track demo scripts and write-ups in each brief's vocabulary. The features are identical everywhere.

## User Stories

### Knowledge worker (Mai — Senior Analyst, Finance)

1. As a knowledge worker, I want to ask a plain-language question in my workspace chat, so that the agent searches only my permitted knowledge and answers with citations.
2. As a knowledge worker, I want to see the agent's tool steps live ("searching Finance space…", "reading treasury export…"), so that I trust how the answer was assembled.
3. As a knowledge worker, I want to ask for a deliverable (deck, document, or spreadsheet) and watch it assemble block-by-block beside my chat, so that my work product and my conversation stay connected but distinct.
4. As a knowledge worker, I want every artifact block to carry "Based on:" chips citing the real source files, so that any figure can be traced to its origin.
5. As a knowledge worker, I want numeric figures in my artifacts computed via SQL over governed data rather than hallucinated, so that my report is verifiably correct.
6. As a knowledge worker, I want to share the artifact (never my chat) with a colleague for comment, so that I get review without exposing my private working conversation.
7. As a knowledge worker, I want a colleague's comment to arrive in my chat as an AI proposal I can apply or dismiss, so that feedback is folded in under my control.
8. As a knowledge worker, I want the AI to pause and ask when two directives conflict, so that a human decides and the resolution is recorded.
9. As a knowledge worker, I want one click to extract my session into a Flow — a readable recipe of steps, tools, and team rules — so that one-off work becomes a durable, reusable asset.
10. As a knowledge worker, I want to send my Flow for approval to a named senior, so that it becomes governed organizational memory rather than a private note.
11. As a flow owner, I want to receive colleagues' suggestions on my approved Flow and fold an accepted suggestion into a new draft version with a visible diff, so that the method improves without losing history.
12. As a flow owner, I want the language of the interface toggleable between Vietnamese and English, so that I can work in my language and demo in the judges'.

### Approver (Duc — Finance Director)

13. As an approver, I want to review a shared artifact and comment on specific blocks, so that content errors are caught before the deck ships.
14. As an approver, I want to review the Flow's recipe itself — commenting on a step's method, not just the output — so that flawed methods don't get sealed into organizational memory.
15. As an approver, I want to capture a method correction as a permanent team rule during review, so that every future run applies the lesson.
16. As an approver, I want an approval ceremony that names me, lists what I'm sealing (steps, sources, rules, perimeter), and stamps a version, so that AI-law-style human accountability is legible and logged.
17. As an approver, I want re-approval of an amended Flow to show exactly what changed since the sealed version and who drove it, so that resealing is an informed act.
18. As an approver, I want to approve from my phone-sized browser window, so that governance doesn't wait for my desk.

### Reusers (Vy — new hire; Linh — senior peer)

19. As a new employee, I want the workspace to interrupt my typed task with "your team already knows how to do this" when an approved Flow matches, so that I reuse instead of reinventing.
20. As a new employee, I want one click to re-run the recalled Flow over the current quarter's files, so that I produce senior-quality work in my first month.
21. As a senior peer, I want the same Flow to answer a *different* task with an adapted output (board pre-read vs. leadership deck), so that a Flow is a department capability, not a single-task template.
22. As a senior peer, I want to suggest a concrete step change (proposed detail + tool) on an approved Flow, so that my expertise compounds into the team's method.
23. As any team member, I want to see who uses a Flow, its run count, and its version changelog, so that reuse and evolution are visible and credited.

### Perimeter & governance (any user, admin)

24. As a user outside a department, I want the same question that succeeds for a Finance user to return a clean denial for me, so that the **search perimeter** is enforced before retrieval — uncleared data never enters the agent's reach.
25. As a user, I want documents and Flows outside my perimeter to render as locked cards with content hidden, so that the boundary is tangible in every surface.
26. As an executive, I want my perimeter *set* to include all departments' spaces, so that cross-department oversight works without breaking the "grants never cross perimeters" rule (ADR-0001).
27. As an IT/compliance stakeholder, I want the agent, corpus, and compute to run on our own server with data in our own database, so that data control and residency are architectural facts, not promises.
28. As a compliance stakeholder, I want RLS policies mirroring the perimeter join as a backstop, so that a future code path that forgets the filter still cannot leak.
29. As a leader, I want a capability analytics view — Flows by department, reuse counts, contributors, gaps, version churn — computed from real data, so that I can watch organizational capability accumulate (hero brief vision bullet e).

### Knowledge base & ingestion

30. As a user, I want to browse the governed knowledge base and open any document my perimeter allows, so that every citation chip resolves to something I can read.
31. As a user, I want to upload a file and choose where it nests in the knowledge base, so that new knowledge lands in the right governed space.
32. As a judge, I want to hand the team a brand-new file and see it become searchable immediately, so that I know retrieval is real and live.
33. As a user, I want accent-insensitive search ("dien thoai" finds "điện thoại") and cross-lingual answering (English question over Vietnamese corpus), so that the product works the way Vietnamese enterprises actually type and read.
34. As a judge evaluating the organizational-AI-memory hero track, I want to drop a new file into a Google Drive folder and watch it become searchable in the workspace without anyone touching an upload button, so that "connects to your existing scattered systems" is a live demo moment, not a roadmap slide.

### Track-specific deployments

35. As a Shinhan manager, I want to chat for a number ("Q2 NPL ratio by branch?") and get a SQL-computed answer with its query visible, so that management BI is self-service and auditable.
36. As a Tasco field employee, I want plain Q&A over company policies and SOPs with permission-aware answers, so that the enterprise-knowledge brief's checklist (10+ Q&A, 5+ permission cases) is demonstrably covered.
37. As a Phong Vũ analyst, I want self-service BI over retail data via the same chat-to-SQL path, so that the retail brief is served by the identical product with a retail seed.
38. As an aviation maintenance engineer, I want citation-heavy answers over manuals and SOPs, so that safety-critical retrieval is traceable to source paragraphs.

### Demo & presenter

39. As a presenter, I want a Tour mode preserving the fully-scripted deterministic walkthrough (guide pill, spotlights, seeded personas), so that the recorded video is flawless regardless of live-system state.
40. As a presenter, I want to sign in as any seeded persona in one click (real Supabase session underneath), so that the permission story is shown live without login friction.
41. As a presenter, I want the UI to default to Vietnamese at judging and English during development, so that both the demo and the build process work.

## Implementation Decisions

**Strategy**
- One product, five deployments: zero per-track feature differences; per-track seeded corpus + database + demo script + write-up in the brief's vocabulary. Hero + Tasco + Shinhan committed; Phong Vũ + aviation opportunistic; final submission count decided at KickOff when the rubric publishes.
- Everything real, ≤5% faked; the fake budget is spent only on demo-video conveniences. Tour mode (the existing scripted state machine) is retained permanently behind a mode flag alongside the live product.
- The hero corpus and the Tasco corpus are the same corpus: the Tasco augmentation plan's Finance hero slice maps one-to-one onto the mock's demo deck (including the AR-write-off staleness hook). Shinhan is a seeded database plus a handful of policy docs, not a document corpus.

**Agent & tools**
- One agent loop (Vercel AI SDK `streamText` + Anthropic provider, Claude Sonnet default), parallel tool calls, bounded steps, no sub-agents, no planner/reflection.
- **Minimal-tooling principle (amended after Vercel's d0 evidence: one bash-style tool over well-structured files beat a specialized toolset — 3.5× faster, 80%→100% success, 37% fewer tokens).** Every tool takes the caller's **user token** as its scoping input; permission resolution happens inside the tool, never in the caller.
- The retrieval surface is decided **empirically, not by taste**: two configurations run against the eval suite — (A) a single restricted `exec` tool (allowlisted `rg`/`cat`/`ls`/`find`/`head`/`wc`, path-validated) operating over a **per-user perimeter view** (a directory materialized per session containing only the subtrees the user's matrix allows — `ls` makes the perimeter visible), vs (B) `exec` plus the ranked `search_files`. Whichever scores better on success/steps/tokens/latency ships; the loser is deleted.
- Built and validated (T1): `search_files(userToken, query)` — accent-folded BM25 + title-overlap + Vietnamese bigram + coverage scoring over the filesystem database, perimeter-filtered before scoring. Covers documents *and* Flow files, which powers recall.
- Remaining roster: `search_semantic` (vector; pgvector or in-memory; treated as a solved dependency), `run_sql` (agent writes SQL against the track's seeded DuckDB; schema ships in the tool description — this *is* the NL2SQL story), `create_artifact` (typed blocks for deck/document/spreadsheet; one HTML renderer; static export buttons).
- Narrated futures, not built: live warehouse/MCP integrations (beyond the one narrow spike below), real export, vector-at-scale swap.
- **n8n — scoped exception, decided after a live sponsor conversation (see Further Notes for the full grilling record)**: not a general "n8n block-building" platform, but one narrow, time-boxed spike — an n8n workflow watches a Google Drive folder for new/changed files and calls a receiving webhook on this server, which write-throughs into the governed corpus the same way T9's manual upload does. This directly answers the GenAI Fund judge's stated "ingestion from scattered existing systems" framing with something real and live, not just narrated. Explicitly NOT on the never-cut list — T9 (manual upload) is the fallback if the spike runs long.
- Agent prompt handles bilingual query expansion (the agent writes diacritic-correct Vietnamese search terms; accent-folding covers sloppy human input) and answers in the language of the question.

**Runtime & platform**
- Standalone Node/TypeScript server owns the agent loop, the five tool handlers, the corpus directory on local disk, and DuckDB. Deployed on a VM (judging URL) with laptop localhost as mirror/fallback. This doubles as the enterprise "your compute, your data" positioning and the PDPL/data-residency answer.
- Supabase is structural from the first tracer: auth (personas are real seeded users; UI offers one-click "continue as"), Postgres for app state, RLS backstop, Storage for uploads. No Supabase realtime — collaboration is refresh-based by design.
- Vercel account provides AI Gateway as a second billing path to Claude (fallback quota) and optional frontend hosting. The agent server never moves to serverless: it needs a mutable shared disk and native DuckDB.

**Identity & perimeter (ADR-0001 preserved)**
- Perimeter = membership rows: JWT → user → memberships → allowed space roots. Enforcement is pre-retrieval by construction — search tools are rooted only in allowed directories; there is nothing to redact.
- The 4-tier Tasco classification model maps onto perimeter *sets* (spaces), per the glossary's "binary perimeter generalizes" rule; executives hold the all-departments set.
- RLS policies mirror the membership join on all app tables as the backstop.

**Data & corpus**
- The corpus is a **filesystem database**, laid out for both human navigation and permission scoping: `<department>/<classification>/<title-slug>.md` (e.g. `finance/confidential/ma-tran-phe-duyet-tai-chinh.md`), each file carrying a frontmatter header (id, title, department, classification, status, supersedes, period, last_updated, tags) so governance metadata is greppable and readable by the agent. Department short codes are normalized to full names via the departments reference table. This is also the article-recommended substrate: self-describing files with clear naming beat clever retrieval tooling.
- Loader writes twice: CSV rows → the filesystem database (built, T1) and → Supabase rows (documents, profiles; auth users seeded from the dataset's users file — pending, T0).
- One parameterized corpus-generation pipeline (spine-first: Excel raw sheets + live derived formulas; manifest; generated Vietnamese bodies; validation including perimeter and computation checks), with one config per track. Numbers in any rendered artifact must trace to spine formulas; no invented figures.
- Uploads land in Supabase Storage and mirror to the server's corpus directory via one write-through path, so new files are instantly greppable; semantic indexing of uploads follows the same hook.
- The n8n/Google-Drive ingestion spike reuses this exact write-through path — a webhook receiver instead of a UI upload button is the only difference. Same instant-searchability guarantee, same governed placement.
- Flows use a second write-through path with the same shape: `writeFlowFile()` materializes an approved Flow into a filesystem tree kept deliberately separate from the CSV-sourced corpus (see HANDOFF's T7 section for why), merged into per-user views at read time.

**Persistence model**
- Entities: profiles, departments, spaces, memberships, documents, flows, flow versions (immutable snapshots; new data ⇒ new version), blocks/artifacts, block comments, flow step comments, flow suggestions (proposed detail + optional tool; open → accepted), team rules (with provenance), changelog entries (version, text, by-label, sealed-label), runs (version-cited), usage (`usedBy`).
- Flow lifecycle from the prototype: draft → pending → approved; amendment = owner folds an accepted suggestion into a version bump with `prevDetail` retained on the amended step for the visible diff; re-approval seals the changelog entry. Runs keep citing the version they ran under. (This state shape was validated in the mock and carries over as the contract.)

**Frontend**
- Evolve chat-artifact in place. The demo director context is the single seam: its internals swap from scripted reducer+timers to Supabase queries + `useChat`, preserving the actions/selectors interface so surfaces (artifact pane, flow document, extraction overlay, knowledge base, library, spotlight system) are largely untouched.
- i18n: VI⇄EN toggle (port the best-of-three i18n engine from the sibling mock), VI default at judging, EN default in dev. Tour copy gets a VI translation pass.
- Analytics is a real route with live queries (flows by department, runs, contributors, gaps, version churn). Approval surfaces get a responsive pass instead of a dedicated mobile build; the phone beat is shot on a real phone.

**Build order (tracer bullets — locked; status as of Jul 9)**
- **T1 ✅ SHIPPED** (built ahead of T0 — it needed no Supabase): the server package exists inside the mocks workspace as `server/` (a standalone package; monorepo workspace stitching happens when the frontend wires in). `npm run load` builds the filesystem database (140 files); `npm run search` pokes the tool; `npm run eval` scores it. Results: hit@5 88.4%, MRR 0.80, **Deny 12/12 with zero leaks**; the harness auto-detected the P035 dataset bug as an eval-vs-matrix conflict (since fixed upstream).
- T0 Supabase schema + double-writing loader + seeded auth users → **T2 agent loop in terminal (next): restricted `exec` over per-user perimeter views, A/B'd against `exec`+`search_files` on the eval suite; agent-level scoring = cited documents in the final answer, not single-query rank** → T3 server + `useChat` + JWT verification → T4 `create_artifact` streaming into the artifact pane → T5 `run_sql` over the spine → T6 perimeter denial + RLS → T7 extraction → recall → re-run → T8 collaboration CRUD → **T9n n8n/Google-Drive ingestion spike (time-boxed, GenAI Fund judge priority — see Further Notes)** → T9 upload → T10 `search_semantic` → T11 corpus pipeline at scale + track configs → T12 analytics, i18n, responsive approval, auth hardening.
- Each tracer proves exactly one new seam and has a named pass test; T1–T2 run against the provided Tasco dataset with zero UI work.
- Checkpoints: T0–T4 by end Jul 9; T5–T7 by Jul 10 midday; T8–T9 + recorded Tour video by Jul 10 evening; corpus generation overnight; sprint = T10–T12, tracks 2–5, eval rehearsal, write-ups, hour-1 rubric re-cut.
- Pre-agreed cut order: **T9n n8n spike (time-boxed — falls back to T9 manual upload if it runs long)** → track datasets #4–5 → `search_semantic` → live analytics (goes seeded) → i18n breadth. Never cut: perimeter denial, Ask→Assemble, extraction/recall/re-run loop, Tasco checklist, the video.

## Testing Decisions

- **Primary seam: the agent server's HTTP API, driven by the evaluation set.** The Tasco eval questions (provided + augmented; the augmented set is designed to *be* the demo script) run as an automated suite: each question posts as a signed-in persona and asserts (a) expected document ids appear in citations, (b) Allow/Deny matches the permission matrix, (c) computed figures match the numeric spine. This one seam exercises retrieval, tool routing, synthesis, citations, and perimeter together — external behavior only, no implementation details.
- **Secondary dev seam: the tool CLI harness** (T1/T2, built) for fast iteration on search quality and agent routing before the server exists; the same eval rows drive it.
- **Every eval run writes a timestamped report** to the server's `evals/` folder: timing (load/index, per-query avg), hit@1/3/5 and MRR with breakdowns by difficulty and answer type, permission-enforcement results with any leaks, and the full worst-first list of **pending cases** (targets not at rank 1) — the standing work-list for driving MRR to 1.0. Current reading: Easy/Exact ≈ solved (MRR 0.95–0.98); the gap is Multi-document (0.465), which is the agent-decomposition class (T2), plus a semantic tail for T10. Tool-level A/B decisions (exec vs exec+search) are made from these reports, not intuition.
- **UI seam: the existing Playwright walkthrough driver** (prior art: the mock's `walk.mjs`, 37 verified beats with screenshots) — extended to drive Tour mode as the regression test for surfaces, and a live-mode variant for the wired beats (ask, denial, recall, upload).
- **Data pipeline tests: the augmentation plan's validation suite** (source-freeze reconstruction, id integrity, perimeter check per eval row, cross-department guard, computation reconciliation, boilerplate check) runs after every corpus generation.
- A good test here asserts what a judge could observe: the answer cites the right document, the denied user sees nothing, the number equals the spine formula, the uploaded file is findable. Nothing asserts internal tool-call sequences or prompt content.

## Out of Scope

- Supabase realtime / websockets — collaboration updates are refresh-based; a page refresh is the demo.
- Real export (PDF/Word/PPT) — export buttons are static.
- General n8n block-building, live warehouse/SQL-over-production, external MCP servers, filesystem access beyond the governed corpus — narrated as roadmap. (One narrow exception: the Google-Drive-via-n8n ingestion spike — see Agent & tools / Data & corpus / Build order.)
- Sub-agents, planners, reflection loops, rerankers.
- A dedicated mobile app/surface — responsive approval only.
- Cross-department Flow assembly (per the glossary boundary); executive *retrieval* across departments is in scope.
- Building the embedding/chunking pipeline in this workstream — `search_semantic` consumes it as a solved dependency.
- Post-hackathon concerns: billing, tenanting, SSO, VN-resident inference (one roadmap slide).

## Further Notes

- Vocabulary discipline: "organizational AI memory" names the problem (the sponsor's words); "approved reusable Flow" names the mechanism. Never lead with "AI builds workflows."
- The GenAI Fund sponsor for this track (Founder Mode / organizational-ai-memory, `tracks/founder-mode/organizational-ai-memory.md` at the aabw repo root) is an **official judge**, not just a track sponsor — confirmed mid-hackathon. She is also separately evaluating teams for a possible $100-150k seed investment. Her stated product vision (searchable memory layer, context-capture-for-why, role-aware governance/versioning, recall recommendations, capability analytics) maps closely onto what's already built (Flows, perimeter, recall, T12 analytics still queued) — see the EARS/n8n progress-log entry below for the one open gap she flagged live (an ingestion layer) and how it's being addressed.
- Progress log: **Jul 9** — T1 shipped (filesystem database + `search_files(userToken, query)` + eval harness with timestamped reports); tool architecture amended toward minimal tooling (restricted `exec` over perimeter views, A/B'd empirically) after Vercel's d0 results; P035 dataset bug fixed upstream in the eval set. **T2 shipped**: exec-only agent (OpenRouter `deepseek/deepseek-v4-flash`; Gemini free tier exhausted) scored 52/58 → ~69/70 after four fixes (shell-operator rejection with corrective errors, `find -exec` sandbox-escape block, perimeter map injected into the system prompt — hard cases dropped 13–15 steps → 3–5, citation discipline); Deny 12/12 throughout; config B deemed unnecessary, `search_files` demoted to the UI search box. **T0 shipped**: Supabase CLI initialized; schema in `supabase/migrations/20260709105329_init_live_schema.sql` (profiles, documents, flows, flow_versions, flow_runs, comments, suggestions; RLS ON everywhere via one `can_access(dept, classification)` security-definer predicate; rules/changelog as jsonb on flow_versions), applied with `npx supabase db push`; `src/lib/supabase.ts` (admin/anon/per-JWT clients — the JWT client is the T3 path); `npm run seed:supabase` (idempotent: 35 auth users + 35 profiles + 140 documents; demo passwords `user001`-style, derived from employee codes); `npm run db:smoke` is the repeatable RLS proof (U034 Product blind to DOC041, all Restricted, and foreign Confidential; U007 Executive sees the full corpus) — 5/5 PASS.

**T3 shipped**: `agent.ts` refactored to share perimeter/tool setup between the CLI's `generateText` (unchanged) and a new `streamAgentChat` (`streamText`) for the server. Express server (`src/server/index.ts`, `npm run server`, :8787) with JWT-verifying middleware (`src/server/auth.ts` — trusts only the Supabase-verified token, resolves to the same CSV-based perimeter identity) and one protected streaming route, `POST /api/chat`, piping straight into `useChat`. Frontend: a standalone `/live` route (`chat-artifact/src/pages/LiveChat.tsx`) with real Supabase sign-in and `useChat` — deliberately not wired into ChatPane/DemoContext yet, so Tour mode stays untouched; that swap is the next incremental step. Verified end-to-end in a real headless-Chromium session (Playwright): sign-in → question → real `exec` tool call over the perimeter view → streamed answer with citations. Known cosmetic gap: no markdown rendering on `/live` yet.

**T4 shipped**: `create_artifact` tool added to `buildAgentContext` behind an `includeArtifactTool` flag — on for the server path only, so T1/T2's validated eval numbers can't drift. Its zod schema mirrors the frontend's `SlideBlock` model (kind/eyebrow/title/body/chart/sources); `execute()` just confirms, the client renders straight off the parsed tool-call input. Frontend: exported `SlideCard`'s pure `BarChart`/`SlideTable`/`Bullets` renderers (no behavior change) and built a standalone `LiveArtifactPane` (no DemoContext) with a staggered block-reveal animation; `LiveChat` now splits into a chat+artifact two-pane layout whenever a `create_artifact` tool call appears in the thread. Verified live (Playwright): asked for a 2-slide Q2 cash deck as U002 (Finance) — real exec reads, one self-corrected malformed tool call, then a clean deck with real figures and working "Based on:" citation chips (DOC042, DOC052). Known simplification: renders on full tool-input-available, not literal token-by-token partial-JSON reveal — the block-by-block feel is a presentation beat over complete data, not a technical limitation to fix later unless literal live-typing is wanted.

**T5 shipped**: the numeric spine's real source located and confirmed — Excel workbooks with live formulas in the sibling `enterprise-knowledge-tasco` project (`data/_spine/finance_q2_fy26.xlsx`, `departmental_series_fy26.xlsx`), each with a README sheet mapping department → raw/derived sheet pairs. `src/cli/build-spine.ts` (`npm run build:spine`) parses both workbooks and writes one Parquet file per sheet (26 tables) plus a `_schema.json` sidecar to `server/spine/tasco/` (gitignored). `src/lib/spine.ts`'s `SPINE_TABLES` manifest assigns each table a department + classification mirroring the document corpus's own tiers (Executive Office → Restricted, confirmed by the `raw_exec_indicators` sheet's own "Restricted forecast index" column; departmental sheets → Confidential-own-department; Company → Internal), and reuses the same `canAccess()` predicate the filesystem perimeter already uses. Enforcement is real, not prompt-trust: `buildSpineConnection(user)` builds a fresh in-memory DuckDB connection per request that only ever loads the caller's allowed tables, then runs `SET enable_external_access = false` before any agent SQL executes — verified live that a `read_parquet()` escape attempt after lockdown fails outright, and non-SELECT SQL is rejected before reaching DuckDB. `run_sql` tool added to `agent.ts` behind `includeSqlTool` (server-only, same pattern as `includeArtifactTool`, protecting T1/T2's validated eval numbers). Verified end-to-end (curl + Playwright): SQL-computed answers matched the source workbook to the exact decimal (3.48M revenue/64.00% margin; 2.066666666666667 avg burn, matching `spine_checks.json` precisely). `LiveChat.tsx` needed zero frontend changes — the generic tool-call renderer built for T3 already displays `run_sql` queries. One honest non-blocking finding: asked for Executive-only data, the agent correctly found nothing but exhausted its step budget before writing final text (silence, not a leak — same class of gotcha as T2's budget-exhaustion case, just not yet mitigated on the streaming path). Accepted risk: `xlsx`/SheetJS has an unpatched prototype-pollution/ReDoS advisory — fine for parsing our own trusted fixture files, must be revisited before reusing for T9's untrusted-upload path.

**T6 shipped**: RLS backstop was already satisfied by T0 (no new live code path queries Supabase's governed tables yet) — this tracer's real work was the chat-response denial experience story #24 describes. `agent.ts` now asks for a trailing `ACCESS: answered|denied` line (server-only, gated the same way as the artifact/SQL extras — which are now one `AgentExtras` options object rather than three stacked positional booleans). Two honest findings from live testing rather than assumed correctness: (1) the model follows the long-established `SOURCES` convention far more reliably than the new `ACCESS` line — the frontend's denial detection treats `ACCESS` as a confidence booster and falls back to the already-reliable `SOURCES: none` when it's missing, verified with no false positive on answered questions; (2) the very first live denial test surfaced a worse bug than a missing marker — total silence, the agent exhausting its full step budget without writing any text at all, because T3's `streamAgentChat` had deliberately dropped the CLI's forced-synthesis fallback. Fixed with `streamText`'s `prepareStep`: the final step disables every tool and nudges the model to answer now, guaranteeing a visible response every turn, in one continuous stream. `LiveChat.tsx` renders denied messages with a distinct dashed-border/lock-icon treatment, reusing the Tour mock's own `LockIcon` primitive (verified DemoContext-free) and matching the visual language already proven in `KnowledgeBase.tsx`/`FlowLibrary.tsx`'s locked cards — though those browse-time surfaces don't exist live yet (T7/T9). Verified end-to-end with real personas and the real corpus: correct denial + UI treatment for an Executive-only strategy question and a Finance-Confidential SQL question; correct non-denial for an in-perimeter question; and one more honest note — the same strategy question asked twice got different answers, the model sometimes synthesizing from adjacent Product-level vocabulary instead of declining. No leak either way; this is the same class of genuinely-ambiguous-question behavior as the eval's own documented P031 case, not something to overfit prompts to.

**T7 shipped**: extraction → recall → re-run, over a genuinely persisted, genuinely governed Flow. Core insight (owner's framing, confirmed against T1's own spec text): a Flow is discoverable exactly the way a Claude Skill is — frontmatter + a short trigger description, matched by the model's own judgment, no embeddings, no separate retrieval mechanism. `writeFlowFile()` materializes an *approved* Flow into a new `FLOWS_DIR` tree kept deliberately separate from the CSV-sourced `CORPUS_DIR` (which `npm run load` destructively rebuilds every run — Flow files would silently die there); `buildView()` now merges both trees per user and regenerates each `_index.md` from the merged set. Supabase (`flows`/`flow_versions`/`flow_runs`, from T0) is the durable source of truth; the file is a read projection. Scope cut, stated plainly: `create_flow` creates AND approves in one step — the real draft→pending→approved review ceremony is T8's job, not built here. Verified end-to-end with real personas, not fixtures: extracted a "Quarterly Cash Position Review" Flow from a real `run_sql` session (real steps, real attributed team rules) → a **fresh session**, paraphrased task, explicitly discovered and read the Flow file, re-ran its steps against current data, figures matched exactly, correct `FLOW_USED` marker, usage tracked in Supabase → a **different-department user** got zero mentions of the flow anywhere, its own `find`-for-the-directory came back empty (the directory doesn't exist in that view, not just access-denied-after-discovery). One honest, not-swept-under-the-rug finding: recall doesn't fire on every phrasing — 1 of 3 later attempts explicitly discovered the Flow; the other two solved the question directly instead, correctly and without any leak, just without the recall moment. Same class of judgment-dependent behavior as T6's `ACCESS` marker finding, not a bug to chase to 100%.

**Mid-session pivot — EARS notation + n8n/Google Drive ingestion (decided, documented, not yet built)**: two decisions came out of a design conversation after T7, both fully detailed in `mocks/server/HANDOFF.md` (not repeated in full here — read that for exact before/after text and implementation notes). (1) **EARS-style Flow triggers**: rewrite a Flow's "when to use this" trigger using the same "WHEN X, THE system SHALL Y" pattern Claude's own Skills/hooks/plugins use, instead of loose prose — motivated by consistency with the agent ecosystem's own convention, and as a plausible (untested) fix for the recall-reliability finding above. (2) **n8n/Google Drive ingestion spike**: the GenAI Fund "Organizational AI Memory" track — already this project's committed hero track, per the vocabulary-discipline note above, which predates this conversation — is officially judged by a sponsor who, in a live conversation, said she believes the highest-value part of this problem space is a stage-1 ingestion layer unifying scattered enterprise sources (Salesforce, Confluence, ~50-60 types); she showed this same framework to every team in the track, making it an informally-broadcast signal, not private intel. Separately, GenAI Fund is weighing a $100-150k seed investment in the strongest team, with 11 major Vietnamese enterprise groups (VNG, Vin, Nova, Tasco named) watching as judges/prospects. This reopens a decision the spec previously closed (n8n integration was explicitly "narrated as roadmap, not built"). What's now planned, narrowly: an n8n workflow watches a Google Drive folder (n8n's native trigger, no custom polling) and calls a receiving webhook on this server, using the same write-through-into-governed-corpus mechanism already planned for T9's manual upload. Owner is personally handling the n8n account, Drive OAuth, and the workflow itself (outside this codebase) — this agent's scope when picked up is the receiving webhook only. Investigated n8n's MCP server specifically (https://docs.n8n.io/build/ways-of-building-workflows/connect-to-n8n-mcp-server): it's for an AI client to author/discover/run *pre-built n8n workflows*, not a direct pass-through to individual connectors — so a human builds the Drive-watch workflow once in n8n's UI, and our side either receives its webhook call (default, lower-risk) or discovers/triggers it via MCP the same way the agent discovers a Flow file (stretch goal). Explicitly time-boxed and explicitly NOT on the never-cut list — T9 (manual upload) is the fallback if it runs long, and already satisfies the existing judge-facing story #32 on its own. See `mocks/server/HANDOFF.md` for the full grilling record and exact implementation notes.

**T8 shipped, EARS shipped, multi-tool agent choice shipped**: collaboration CRUD (comments,
suggestions, fold-into-new-draft-version with a visible step diff, capture-comment-as-team-rule,
reseal) is real, RLS/service-role-gated, and verified end-to-end via curl against the live
`quarterly-cash-position-review` Flow through a full suggest → accept → fold → capture → reseal
cycle (now v3) — including a live chat turn afterward that actually applied the newly captured
rule. Flow trigger summaries are now EARS-phrased ("WHEN X, THE assistant SHALL Y"), verified on
a freshly extracted Flow. The live `/api/chat` path now always offers the full tool roster
(exec, search_files, run_sql, create_artifact, create_flow) rather than gating search_files to
the eval's config B — verified the model independently chose 4 different tools within one
multi-step turn. Full details in `mocks/server/HANDOFF.md`. Next up: the n8n spike or T9
(manual upload), owner's call. See `mocks/server/HANDOFF.md` for the fresh-session pickup.
- The demo choreography, spotlight system, Tour mode, and the collaboration state machine were validated in the chat-artifact prototype and its screenshot walkthrough; the prototype is the UX contract for the live build.
- Provision today (Jul 9): Anthropic API key with budget headroom, Vercel AI Gateway fallback, the VM, Supabase project.
- Presentation: audio in English, subtitles in Vietnamese, app surface demoed in Vietnamese.
- Commit hygiene during the sprint window: scaffolding pre-sprint is event-legal; keep visible feature commits inside the judged window.
