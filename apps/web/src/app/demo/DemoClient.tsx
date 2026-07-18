"use client";

import { useEffect, useMemo, useState } from "react";

type NodeStatus = "done" | "working" | "ready" | "blocked" | "review";
type NodeType = "product" | "capability" | "feature" | "requirement" | "decision" | "ticket" | "evidence" | "execution";

type TicketDetail = {
  wave: number;
  files: string[];
  dependsOn: string[];
  unlocks: string[];
  acceptance: string[];
  evidence: string;
};

type SemanticNode = {
  id: string;
  title: string;
  type: NodeType;
  summary: string;
  status?: NodeStatus;
  source?: string;
  context?: string;
  ticket?: TicketDetail;
  children?: SemanticNode[];
};

const ticketNodes: SemanticNode[] = [
  {
    id: "wa-01",
    title: "Enforce the search perimeter before retrieval",
    type: "ticket",
    summary: "Resolve the caller's permitted view before any source enters retrieval.",
    status: "done",
    source: "plan/tickets/WA-01.md",
    context: "Access is enforced before retrieval. Results are never filtered after the model has seen them.",
    ticket: {
      wave: 1,
      files: ["server/src/lib/perimeter.ts", "server/src/tools/search_files.ts"],
      dependsOn: [],
      unlocks: ["WA-02", "WA-03"],
      acceptance: ["Exclude out-of-perimeter candidates", "Resolve a user view for every search", "Mirror the predicate in RLS"],
      evidence: "Perimeter smoke test passing, 12 checks",
    },
  },
  {
    id: "wa-02",
    title: "Build the numeric spine for exact answers",
    type: "ticket",
    summary: "Expose governed business data through a reliable SQL surface.",
    status: "working",
    source: "plan/tickets/WA-02.md",
    context: "Narrative retrieval and exact figures use separate paths. This ticket inherits the perimeter contract from WA-01.",
    ticket: {
      wave: 2,
      files: ["server/src/lib/spine.ts", "server/src/cli/build-spine.ts", "server/supabase/migrations/"],
      dependsOn: ["WA-01"],
      unlocks: ["WA-03", "WA-05"],
      acceptance: ["Route numeric questions through SQL", "Generate the spine from governed data", "Prove access with a seeded smoke test"],
      evidence: "Schema inspection pending",
    },
  },
  {
    id: "wa-03",
    title: "Create cited report and deck artifacts",
    type: "ticket",
    summary: "Generate useful artifacts with visible citations and provenance.",
    status: "ready",
    source: "plan/tickets/WA-03.md",
    context: "Artifact generation depends on governed narrative access and verified numeric answers.",
    ticket: {
      wave: 3,
      files: ["server/src/tools/create_artifact.ts", "chat-artifact/src/components/artifact/"],
      dependsOn: ["WA-01", "WA-02"],
      unlocks: ["WA-05"],
      acceptance: ["Carry source citations into artifacts", "Use the governed corpus", "Expose artifacts and their evidence"],
      evidence: "Waiting for the spine contract",
    },
  },
  {
    id: "wa-04",
    title: "Extract reusable approved Flows",
    type: "ticket",
    summary: "Turn successful tool use into a versioned, approved recipe.",
    status: "blocked",
    source: "plan/tickets/WA-04.md",
    context: "The first version needs a clear rule for what a human approves before a Flow can run again.",
    ticket: {
      wave: 2,
      files: ["server/src/lib/flows.ts", "server/src/agent/agent.ts", "flows/"],
      dependsOn: ["WA-01"],
      unlocks: ["WA-05"],
      acceptance: ["Preserve reasoning behind each step", "Match Flows by agent judgment", "Require human approval before reuse"],
      evidence: "Approval policy needs a decision",
    },
  },
  {
    id: "wa-05",
    title: "Connect live chat to the agent trace",
    type: "ticket",
    summary: "Keep tools, decisions, and generated artifacts visible beside chat.",
    status: "ready",
    source: "plan/tickets/WA-05.md",
    context: "This is where governed search, exact answers, artifacts, and reusable work meet in one trace.",
    ticket: {
      wave: 4,
      files: ["chat-artifact/src/pages/LiveChat.tsx", "chat-artifact/src/components/live/", "server/src/server/"],
      dependsOn: ["WA-02", "WA-03", "WA-04"],
      unlocks: [],
      acceptance: ["Show tool calls in chat", "Open and inspect generated artifacts", "Review Flow proposals before reuse"],
      evidence: "Inherits decisions from three tickets",
    },
  },
];

type TicketSeed = {
  id: string;
  title: string;
  summary: string;
  status: NodeStatus;
  wave: number;
  dependsOn?: string[];
  unlocks?: string[];
  files: string[];
  acceptance: string[];
  evidence: string;
  context: string;
};

const synthesizedTicketSeeds: TicketSeed[] = [
  { id: "WA-01", title: "Build the governed filesystem corpus", summary: "Load source rows into readable department and classification paths with greppable metadata.", status: "done", wave: 1, unlocks: ["WA-02", "WA-04", "WA-17", "WA-21"], files: ["server/src/lib/corpus.ts", "server/src/cli/load.ts", "server/corpus/"], acceptance: ["Loader creates the governed path layout", "Every document retains identity and classification metadata"], evidence: "140 corpus files loaded; hit@5 88.4% in the T1 report", context: "The filesystem is both the human-readable database and the substrate for permission-scoped agent views." },
  { id: "WA-02", title: "Establish retrieval and evaluation baselines", summary: "Score retrieval, permission denial, latency, and citation quality from a repeatable evaluation set.", status: "done", wave: 2, dependsOn: ["WA-01"], unlocks: ["WA-04", "WA-20", "WA-30"], files: ["server/src/cli/eval.ts", "server/evals/", "server/src/tools/search_files.ts"], acceptance: ["Every run writes a timestamped report", "Reports expose ranking quality and permission leaks"], evidence: "Deny 12/12; MRR and worst-first pending cases recorded", context: "The PRD explicitly requires tool and routing choices to be made from observable evaluation results." },
  { id: "WA-03", title: "Create Supabase identity and governance schema", summary: "Seed real users and persist profiles, documents, Flows, versions, comments, suggestions, and runs behind RLS.", status: "done", wave: 1, unlocks: ["WA-04", "WA-05", "WA-11", "WA-13", "WA-26"], files: ["supabase/migrations/20260709105329_init_live_schema.sql", "src/lib/supabase.ts", "scripts/seed-supabase.ts"], acceptance: ["Schema supports the complete Flow lifecycle", "Seeded users resolve through real auth sessions", "RLS is enabled on governed tables"], evidence: "35 auth users, 35 profiles, 140 documents; db:smoke 5/5 PASS", context: "Supabase is structural app state and a backstop. The agent corpus and compute remain on the standalone server." },
  { id: "WA-04", title: "Enforce perimeter-scoped agent tools", summary: "Materialize the caller's permitted filesystem view and run restricted tools only inside it.", status: "done", wave: 2, dependsOn: ["WA-01", "WA-02", "WA-03"], unlocks: ["WA-05", "WA-09", "WA-10"], files: ["server/src/lib/perimeter.ts", "server/src/agent/agent.ts", "server/src/tools/exec.ts"], acceptance: ["Unauthorized paths do not exist in the agent view", "Shell escapes and disallowed operators are rejected", "Every tool resolves permissions internally"], evidence: "Agent eval improved from 52/58 to about 69/70; Deny 12/12", context: "This implements ADR-0001: enforce access before retrieval, never by filtering model-visible results." },
  { id: "WA-05", title: "Ship the authenticated streaming agent API", summary: "Verify Supabase JWTs and stream a bounded multi-step agent response from the standalone server.", status: "done", wave: 3, dependsOn: ["WA-03", "WA-04"], unlocks: ["WA-06", "WA-09"], files: ["server/src/server/index.ts", "server/src/server/auth.ts", "server/src/agent/agent.ts"], acceptance: ["POST /api/chat rejects invalid identity", "A valid caller receives a continuous streamed response", "The final step always produces user-visible text"], evidence: "Live sign-in to cited streamed answer verified in Playwright", context: "The server owns the agent loop because it requires mutable disk, governed views, and native DuckDB." },
  { id: "WA-06", title: "Connect live chat and visible tool traces", summary: "Replace the scripted answer path with real useChat streaming while keeping tool activity inspectable.", status: "done", wave: 4, dependsOn: ["WA-05"], unlocks: ["WA-07", "WA-10", "WA-25"], files: ["chat-artifact/src/pages/LiveChat.tsx", "chat-artifact/src/components/live/"], acceptance: ["A user can sign in and ask an arbitrary question", "Tool calls and citations remain visible beside the answer"], evidence: "Headless browser verified sign-in, restricted exec, and streamed citations", context: "The live route was deliberately introduced beside Tour mode so deterministic presentation behavior did not regress." },
  { id: "WA-07", title: "Render cited artifact blocks beside chat", summary: "Expose a typed create_artifact tool and render deck, document, or spreadsheet blocks with source chips.", status: "done", wave: 4, dependsOn: ["WA-05", "WA-06"], unlocks: ["WA-15", "WA-25"], files: ["server/src/tools/create_artifact.ts", "chat-artifact/src/components/LiveArtifactPane.tsx", "chat-artifact/src/components/SlideCard.tsx"], acceptance: ["Artifact blocks render from typed tool input", "Every block can show its real source identifiers", "Chat remains distinct from the shareable artifact"], evidence: "Two-slide Q2 cash deck rendered with DOC042 and DOC052 citations", context: "The PRD treats the artifact as durable work product and the chat as private working context." },
  { id: "WA-08", title: "Generate the governed numeric spine", summary: "Convert trusted workbooks into classified Parquet tables with a readable schema manifest.", status: "done", wave: 2, dependsOn: ["WA-01"], unlocks: ["WA-09", "WA-21"], files: ["server/src/cli/build-spine.ts", "server/src/lib/spine.ts", "server/spine/tasco/"], acceptance: ["Raw and derived workbook sheets become queryable tables", "Every table carries department and classification metadata"], evidence: "26 tables plus _schema.json generated from two source workbooks", context: "Exact figures use a governed relational surface rather than narrative document retrieval." },
  { id: "WA-09", title: "Execute perimeter-safe SQL for exact answers", summary: "Load only allowed tables per request, disable external access, and expose read-only SQL to the agent.", status: "done", wave: 3, dependsOn: ["WA-04", "WA-05", "WA-08"], unlocks: ["WA-22", "WA-23"], files: ["server/src/lib/spine.ts", "server/src/agent/agent.ts"], acceptance: ["Only SELECT statements execute", "External file access is disabled", "Computed answers reconcile exactly with source formulas"], evidence: "3.48M revenue, 64.00% margin, and burn figures matched spine_checks.json", context: "This is the natural-language-to-SQL path used by management BI and numeric artifact claims." },
  { id: "WA-10", title: "Guarantee visible access denials", summary: "Turn out-of-perimeter questions into explicit denial responses without leaks or silent step exhaustion.", status: "done", wave: 4, dependsOn: ["WA-04", "WA-05", "WA-06"], unlocks: ["WA-25", "WA-30"], files: ["server/src/agent/agent.ts", "chat-artifact/src/pages/LiveChat.tsx"], acceptance: ["Denied turns always end with visible text", "Answered turns are not falsely styled as denial", "No unauthorized source content appears"], evidence: "Live persona tests verified denied, answered, and forced-final-step cases", context: "The UI uses ACCESS when available and the established SOURCES:none signal as a reliable fallback." },
  { id: "WA-11", title: "Persist and extract approved reusable Flows", summary: "Create readable Flow recipes and materialize approved versions into a separate governed filesystem projection.", status: "done", wave: 3, dependsOn: ["WA-03", "WA-07"], unlocks: ["WA-12", "WA-13", "WA-14"], files: ["server/src/lib/flows.ts", "server/src/agent/agent.ts", "server/flows/"], acceptance: ["A session can become a readable versioned Flow", "Approved Flow files survive corpus reloads", "Perimeters govern Flow discovery"], evidence: "Quarterly Cash Position Review persisted and hidden completely from another department", context: "Supabase is the durable source of truth; the Flow file is an agent-readable projection." },
  { id: "WA-12", title: "Recall, rerun, and attribute Flow usage", summary: "Let a fresh session discover an approved Flow, adapt it to current data, and record the version used.", status: "done", wave: 5, dependsOn: ["WA-04", "WA-09", "WA-11"], unlocks: ["WA-27"], files: ["server/src/lib/views.ts", "server/src/lib/flows.ts", "server/src/agent/agent.ts"], acceptance: ["A paraphrased task can discover a relevant Flow", "The rerun uses current governed data", "Usage records cite the Flow version"], evidence: "Fresh-session rerun matched exact figures and recorded FLOW_USED", context: "Recall is deliberately judgment-based, like an agent Skill, rather than a rigid template match." },
  { id: "WA-13", title: "Implement Flow collaboration and resealing", summary: "Support step comments, suggestions, team-rule capture, version diffs, and named re-approval.", status: "done", wave: 6, dependsOn: ["WA-03", "WA-11"], unlocks: ["WA-16", "WA-27", "WA-28"], files: ["server/src/server/flows.ts", "supabase/migrations/", "chat-artifact/src/components/flow/"], acceptance: ["Accepted suggestions create a visible draft version", "Approval names the sealer and exact version", "Captured team rules affect future runs"], evidence: "Suggest, fold, capture, reseal cycle verified through v3 and a live chat run", context: "This delivers the PRD's governance ceremony rather than approving an opaque prompt." },
  { id: "WA-14", title: "Use EARS triggers and the full tool roster", summary: "Describe Flow recall conditions consistently and let the live agent choose among every validated tool.", status: "done", wave: 6, dependsOn: ["WA-04", "WA-11", "WA-13"], unlocks: ["WA-20", "WA-25"], files: ["server/src/lib/flows.ts", "server/src/agent/agent.ts"], acceptance: ["New Flow triggers use WHEN and SHALL phrasing", "Live chat offers exec, search, SQL, artifact, and Flow tools"], evidence: "Fresh Flow used EARS phrasing; one turn independently selected four tool types", context: "This aligns Flow discovery with the agent ecosystem's own trigger conventions." },
  { id: "WA-15", title: "Share artifacts and fold block comments into chat", summary: "Share only the artifact, collect block-level review, and return comments as proposals the owner controls.", status: "ready", wave: 5, dependsOn: ["WA-03", "WA-07"], unlocks: ["WA-16", "WA-28"], files: ["chat-artifact/src/components/artifact/", "server/src/server/comments.ts"], acceptance: ["Shared links never reveal the private chat", "Comments target a stable artifact block", "The owner can apply or dismiss an AI proposal"], evidence: "Not yet verified on the live route", context: "The scripted prototype validates this UX, but the live artifact collaboration path is not evidenced as shipped." },
  { id: "WA-16", title: "Resolve conflicting directives with recorded decisions", summary: "Pause when artifact comments, Flow rules, or user instructions conflict and preserve the human resolution.", status: "ready", wave: 6, dependsOn: ["WA-13", "WA-15"], unlocks: ["WA-25"], files: ["server/src/agent/agent.ts", "server/src/server/decisions.ts", "chat-artifact/src/components/"], acceptance: ["Conflicts stop automatic application", "The human sees both directives and affected work", "The resolution is attached to future context"], evidence: "Specified by user story 8; no live verification recorded", context: "A conflict is a human decision point, not an invitation for the model to silently choose." },
  { id: "WA-17", title: "Build the governed knowledge browser", summary: "Browse permitted documents and Flows, open citations, and show locked cards without leaking hidden content.", status: "ready", wave: 4, dependsOn: ["WA-01", "WA-03", "WA-04"], unlocks: ["WA-18", "WA-20"], files: ["chat-artifact/src/pages/KnowledgeBase.tsx", "chat-artifact/src/pages/FlowLibrary.tsx", "server/src/server/knowledge.ts"], acceptance: ["Every citation opens a readable permitted source", "Out-of-perimeter records expose no content", "Locked treatment is consistent across documents and Flows"], evidence: "Locked-card language exists in Tour surfaces; live browse route not evidenced", context: "Search answers are trustworthy only when a user can inspect the governed source behind each citation." },
  { id: "WA-18", title: "Add manual upload with governed write-through", summary: "Store an uploaded file, choose its governed location, mirror it into the corpus, and make it immediately searchable.", status: "ready", wave: 5, dependsOn: ["WA-17"], unlocks: ["WA-19", "WA-20", "WA-21"], files: ["server/src/server/uploads.ts", "server/src/lib/ingest.ts", "chat-artifact/src/components/upload/"], acceptance: ["A user selects department and classification", "The stored file appears in the filesystem corpus", "A fresh question can cite the new document"], evidence: "T9 scope defined; no shipped implementation evidence", context: "This is the fallback ingestion path and the judge-facing proof that retrieval is live rather than seeded theater." },
  { id: "WA-19", title: "Receive Google Drive files through n8n", summary: "Accept a narrow authenticated webhook from a Drive-watch workflow and reuse the governed write-through path.", status: "blocked", wave: 6, dependsOn: ["WA-18"], unlocks: ["WA-21"], files: ["server/src/server/ingest-webhook.ts", "server/src/lib/ingest.ts", "n8n workflow (external)"], acceptance: ["Webhook calls authenticate and deduplicate files", "Received files use the same governance placement as manual upload", "A Drive drop becomes searchable without UI upload"], evidence: "Design and ownership documented; external n8n workflow and receiver not built", context: "Blocked on the owner-managed n8n account, Drive OAuth, and workflow contract. It is explicitly time-boxed and cuttable." },
  { id: "WA-20", title: "Add semantic search and upload indexing", summary: "Cover the semantic retrieval tail while preserving the same pre-retrieval access perimeter.", status: "ready", wave: 6, dependsOn: ["WA-02", "WA-14", "WA-17", "WA-18"], unlocks: ["WA-21", "WA-24"], files: ["server/src/tools/search_semantic.ts", "server/src/lib/indexing.ts"], acceptance: ["Semantic candidates are filtered before ranking", "Uploads enter the index through the write-through hook", "Evaluation improves the documented semantic tail"], evidence: "T10 is planned and treated as a replaceable dependency", context: "This complements the strong exact retrieval baseline; it does not replace the greppable corpus or permission-shaped views." },
  { id: "WA-21", title: "Generate validated corpora for every track", summary: "Build a parameterized spine-first pipeline with manifests, Vietnamese documents, and repeatable validation.", status: "ready", wave: 6, dependsOn: ["WA-01", "WA-08", "WA-18"], unlocks: ["WA-22", "WA-23", "WA-24", "WA-30"], files: ["data/pipeline/", "data/tracks/", "scripts/generate-corpus.ts"], acceptance: ["One config produces corpus and numeric spine together", "Validation catches ID, perimeter, formula, and boilerplate errors", "A source freeze can reconstruct the output"], evidence: "T11 plan and validation contract exist; scale pipeline not recorded as shipped", context: "Per-track differentiation is data and framing only. Product features must remain identical." },
  { id: "WA-22", title: "Package the Tasco and hero deployment", summary: "Complete the Finance hero slice, permission checklist, evaluation script, and organizational-memory framing.", status: "working", wave: 7, dependsOn: ["WA-09", "WA-10", "WA-21"], unlocks: ["WA-30"], files: ["data/tracks/tasco/", "tracks/founder-mode/", "demo-scripts/tasco.md"], acceptance: ["Tasco answers 10+ governed Q&A cases", "Five permission cases visibly pass", "The hero demo proves search, exact figures, artifacts, and Flow reuse"], evidence: "Tasco corpus and core eval exist; final pipeline packaging remains", context: "The hero and Tasco share one corpus, with vocabulary and demo framing adapted to each judging track." },
  { id: "WA-23", title: "Package the Shinhan management-BI deployment", summary: "Seed banking metrics and policy context for visible, auditable chat-to-SQL management questions.", status: "ready", wave: 7, dependsOn: ["WA-09", "WA-21"], unlocks: ["WA-30"], files: ["data/tracks/shinhan/", "demo-scripts/shinhan.md"], acceptance: ["Branch metrics reconcile with the seeded spine", "The generated SQL is visible", "Policy documents cite correctly"], evidence: "Committed track; implementation evidence not recorded", context: "Shinhan is intentionally a seeded database plus a small policy corpus, not a copy of the Tasco document set." },
  { id: "WA-24", title: "Prepare optional retail and aviation tracks", summary: "Configure Phong Vu retail BI and citation-heavy aviation maintenance data without changing product features.", status: "review", wave: 7, dependsOn: ["WA-07", "WA-09", "WA-20", "WA-21"], unlocks: ["WA-30"], files: ["data/tracks/phong-vu/", "data/tracks/aviation/", "demo-scripts/"], acceptance: ["Retail uses the same governed SQL path", "Aviation answers cite manual paragraphs", "Track inclusion follows the published cut order"], evidence: "Both tracks are opportunistic and may be cut", context: "The KickOff rubric determines whether these deployments earn enough value to justify sprint time." },
  { id: "WA-25", title: "Integrate Tour mode and live mode through one context", summary: "Swap scripted internals for live state without regressing the deterministic walkthrough and spotlight choreography.", status: "working", wave: 6, dependsOn: ["WA-06", "WA-07", "WA-10", "WA-12", "WA-14", "WA-16"], unlocks: ["WA-28", "WA-30"], files: ["chat-artifact/src/context/DemoContext.tsx", "chat-artifact/src/pages/", "chat-artifact/walk.mjs"], acceptance: ["Tour mode remains deterministic", "Live mode uses the same surface action contract", "A presenter can switch modes without state leakage"], evidence: "Standalone live route exists; full context swap is not recorded as complete", context: "The prototype's 37-beat walkthrough is the UX contract for the live product." },
  { id: "WA-26", title: "Add one-click real persona switching", summary: "Create frictionless seeded sign-in while keeping real Supabase sessions and perimeter differences underneath.", status: "ready", wave: 5, dependsOn: ["WA-03", "WA-06"], unlocks: ["WA-25", "WA-29", "WA-30"], files: ["chat-artifact/src/components/PersonaSwitcher.tsx", "chat-artifact/src/lib/auth.ts"], acceptance: ["Every seeded persona starts a real session", "Switching users clears prior private state", "Permission differences are immediately observable"], evidence: "Seeded users exist; one-click live presenter flow not recorded", context: "The demo removes login friction without faking identity or access control." },
  { id: "WA-27", title: "Expose organizational capability analytics", summary: "Show Flow reuse, contributors, departments, gaps, versions, and churn from persisted data.", status: "ready", wave: 7, dependsOn: ["WA-12", "WA-13"], unlocks: ["WA-30"], files: ["chat-artifact/src/pages/Analytics.tsx", "server/src/server/analytics.ts"], acceptance: ["Metrics come from real Flow, version, and run data", "Leaders can identify capability gaps and active contributors"], evidence: "T12 scope defined; analytics route not recorded as shipped", context: "This is the leadership proof that approved methods accumulate as organizational capability rather than isolated chats." },
  { id: "WA-28", title: "Ship Vietnamese, English, and responsive approval", summary: "Localize live and Tour surfaces, default appropriately by environment, and make governance usable at phone width.", status: "ready", wave: 7, dependsOn: ["WA-13", "WA-15", "WA-25"], unlocks: ["WA-30"], files: ["chat-artifact/src/i18n/", "chat-artifact/src/components/approval/", "chat-artifact/src/styles/"], acceptance: ["VI and EN toggle without losing state", "Judging defaults to Vietnamese and development to English", "Approval and diffs work at phone width"], evidence: "Prototype patterns exist; live integration and responsive proof remain", context: "This combines the remaining presentation-layer T12 work while preserving one product across tracks." },
  { id: "WA-29", title: "Harden authentication and production runtime", summary: "Protect service-role boundaries, session transitions, uploads, and the VM deployment configuration.", status: "ready", wave: 8, dependsOn: ["WA-05", "WA-18", "WA-26"], unlocks: ["WA-30"], files: ["server/src/server/auth.ts", "server/src/server/", "deploy/"], acceptance: ["Service-role credentials never reach the client", "Session and upload failures are handled visibly", "The judging VM restarts cleanly with durable data"], evidence: "Core JWT verification exists; T12 hardening and deployment proof remain", context: "The standalone VM is both the judging runtime and the enterprise data-control story." },
  { id: "WA-30", title: "Run final evaluation, walkthrough, and submission gates", summary: "Prove live behavior, preserve Tour choreography, package committed tracks, and record remaining risks before judging.", status: "working", wave: 8, dependsOn: ["WA-02", "WA-10", "WA-21", "WA-22", "WA-23", "WA-25", "WA-26", "WA-28", "WA-29"], files: ["server/evals/", "chat-artifact/walk.mjs", "submission/"], acceptance: ["Live eval passes citations, permissions, and numeric reconciliation", "Tour walkthrough captures all required beats", "Track write-ups and video match the same product truth"], evidence: "Tool eval and 37-beat prior-art walkthrough exist; final integrated gate remains", context: "This is the last dependency wave. It should report residual uncertainty rather than polishing over failed cases." },
];

function makeTicket(seed: TicketSeed): SemanticNode {
  const number = Number(seed.id.split("-")[1]);
  const provenance = number <= 14
    ? "examples/organizational-memory/PRD.md#further-notes"
    : number <= 16
      ? "examples/organizational-memory/PRD.md#user-stories-6-8-13"
      : number <= 20
        ? "examples/organizational-memory/PRD.md#knowledge-base-ingestion"
        : number <= 24
          ? "examples/organizational-memory/PRD.md#track-specific-deployments"
          : number <= 26
            ? "examples/organizational-memory/PRD.md#demo-presenter"
            : number === 27
              ? "examples/organizational-memory/PRD.md#user-stories-23-29"
              : number === 28
                ? "examples/organizational-memory/PRD.md#user-stories-12-18-41"
                : number === 29
                  ? "examples/organizational-memory/PRD.md#runtime-platform"
                  : "examples/organizational-memory/PRD.md#testing-decisions";
  return {
    id: seed.id.toLowerCase(), title: seed.title, type: "ticket", summary: seed.summary,
    status: seed.status, source: provenance, context: seed.context,
    ticket: { wave: seed.wave, files: seed.files, dependsOn: seed.dependsOn ?? [], unlocks: seed.unlocks ?? [], acceptance: seed.acceptance, evidence: seed.evidence },
  };
}

ticketNodes.splice(0, ticketNodes.length, ...synthesizedTicketSeeds.map(makeTicket));

const rootNode: SemanticNode = {
  id: "organizational-memory",
  title: "Organizational Memory",
  type: "product",
  summary: "One chat for governed company knowledge, exact answers, cited artifacts, and reusable work.",
  status: "review",
  source: "examples/organizational-memory/PRD.md",
  context: "The plan was synthesized from 41 user stories, implementation constraints, testing decisions, and shipped discoveries.",
  children: [
    {
      id: "governed-knowledge",
      title: "Governed knowledge",
      type: "capability",
      summary: "Search only the corpus the current user is permitted to access.",
      status: "done",
      source: "examples/organizational-memory/PRD.md#perimeter-governance",
      context: "The access boundary is a precondition for every downstream retrieval and artifact operation.",
      children: [
        {
          id: "search-perimeter",
          title: "Search perimeter",
          type: "feature",
          summary: "Materialize a per-user view before the agent searches anything.",
          status: "done",
          source: "examples/organizational-memory/PRD.md#user-stories-24-28",
          context: "A caller receives a filesystem view containing only the department and classification roots granted by membership.",
          children: [
            {
              id: "pre-retrieval-enforcement",
              title: "Pre-retrieval enforcement",
              type: "requirement",
              summary: "Unauthorized documents never enter ranking, context, or model input.",
              status: "done",
              source: "docs/ADR-0001.md#pre-retrieval-enforcement",
              context: "The tool is rooted inside an already-resolved view. There is no post-retrieval redaction step.",
              children: [ticketNodes[0]],
            },
            {
              id: "rls-backstop",
              title: "RLS backstop",
              type: "requirement",
              summary: "Mirror the membership predicate at the persistence layer.",
              status: "done",
              source: "examples/organizational-memory/PRD.md#identity-perimeter",
              context: "RLS protects future code paths that might forget to apply the application-level filter.",
              children: [
                { id: "rls-proof", title: "Permission smoke test", type: "evidence", summary: "Five seeded identity and classification checks pass.", status: "done", source: "server/db:smoke" },
              ],
            },
          ],
        },
        {
          id: "governed-corpus",
          title: "Governed corpus",
          type: "feature",
          summary: "Keep human-readable documents in a permission-shaped filesystem database.",
          status: "done",
          source: "examples/organizational-memory/PRD.md#data-corpus",
          children: [
            { id: "corpus-layout", title: "Department and classification layout", type: "requirement", summary: "Paths encode the same boundary used by memberships.", status: "done", source: "server/corpus/" },
            { id: "corpus-metadata", title: "Greppable governance metadata", type: "requirement", summary: "Frontmatter keeps provenance readable to humans and agents.", status: "done", source: "server/corpus/**/*.md" },
          ],
        },
      ],
    },
    {
      id: "exact-answers",
      title: "Exact answers",
      type: "capability",
      summary: "Route numeric questions through governed SQL instead of narrative retrieval.",
      status: "working",
      source: "examples/organizational-memory/PRD.md#user-stories-5-35",
      context: "Figures in an answer or artifact must trace back to governed source formulas.",
      children: [
        {
          id: "numeric-spine",
          title: "Numeric spine",
          type: "feature",
          summary: "Convert governed workbooks into queryable tables with known lineage.",
          status: "working",
          source: "examples/organizational-memory/PRD.md#data-corpus",
          children: [
            { id: "spine-generation", title: "Workbook to Parquet generation", type: "requirement", summary: "Preserve raw and derived sheets as explicit tables.", status: "done", source: "server/src/cli/build-spine.ts" },
            { id: "sql-perimeter", title: "Per-request SQL perimeter", type: "requirement", summary: "Load only tables the caller may query, then disable external access.", status: "working", source: "server/src/lib/spine.ts", children: [ticketNodes[1]] },
          ],
        },
        { id: "numeric-proof", title: "Exact-result verification", type: "evidence", summary: "Computed figures reconcile with the source workbook decimals.", status: "done", source: "spine_checks.json" },
      ],
    },
    {
      id: "cited-artifacts",
      title: "Cited artifacts",
      type: "capability",
      summary: "Build reports and decks whose claims remain traceable to governed sources.",
      status: "ready",
      source: "examples/organizational-memory/PRD.md#user-stories-3-6",
      children: [
        {
          id: "artifact-assembly",
          title: "Artifact assembly",
          type: "feature",
          summary: "Render typed blocks beside the conversation without hiding their evidence.",
          status: "ready",
          source: "examples/organizational-memory/PRD.md#frontend",
          children: [
            { id: "citation-contract", title: "Block-level citation contract", type: "requirement", summary: "Every artifact block exposes the files and calculations it used.", status: "ready", source: "create_artifact schema", children: [ticketNodes[2]] },
          ],
        },
      ],
    },
    {
      id: "reusable-flows",
      title: "Reusable Flows",
      type: "capability",
      summary: "Turn successful work into a versioned method that the team can review and reuse.",
      status: "blocked",
      source: "examples/organizational-memory/PRD.md#user-stories-9-23",
      context: "A Flow stores method, tools, sources, team rules, approval, and version history.",
      children: [
        {
          id: "flow-extraction",
          title: "Flow extraction and recall",
          type: "feature",
          summary: "Extract a readable recipe, discover it by judgment, and rerun it on current data.",
          status: "ready",
          source: "examples/organizational-memory/PRD.md#persistence-model",
          children: [
            { id: "flow-trigger", title: "EARS trigger summary", type: "requirement", summary: "Describe when the assistant should reuse the Flow in agent-readable language.", status: "done", source: "flows/**/*.md" },
            {
              id: "approval-policy",
              title: "Approval policy",
              type: "decision",
              summary: "Decide what a human must seal before a Flow can run again.",
              status: "blocked",
              source: "docs/workahead-prd.md#blocker-questions",
              context: "This decision affects Flow extraction, recall, versioning, and the live trace.",
              children: [
                { id: "approve-recipe", title: "Approve the reusable recipe", type: "decision", summary: "Seal steps, tools, sources, rules, and perimeter once per version.", status: "review", source: "proposed option A" },
                { id: "approve-each-run", title: "Approve every execution", type: "decision", summary: "Require a human gate whenever an approved Flow is recalled.", status: "review", source: "proposed option B" },
                ticketNodes[3],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "live-agent-trace",
      title: "Live agent trace",
      type: "capability",
      summary: "Keep implementation progress, proof, discoveries, and blockers legible while agents work.",
      status: "ready",
      source: "docs/workahead-prd.md#execution-model",
      children: [
        {
          id: "execution-visibility",
          title: "Execution visibility",
          type: "feature",
          summary: "Compress raw agent activity into events that a developer can scan and interrupt.",
          status: "ready",
          source: "docs/workahead-prd.md#execution-model",
          children: [
            { id: "handoff-context", title: "Ticket-to-ticket handoff", type: "requirement", summary: "Pass decisions, files, evidence, and new risks to the next work unit.", status: "ready", source: ".workahead/execution/", children: [ticketNodes[4]] },
          ],
        },
      ],
    },
  ],
};

function ticketsById(...ids: string[]): SemanticNode[] {
  return ids.map((id) => ticketNodes.find((ticket) => ticket.id === id.toLowerCase())).filter((ticket): ticket is SemanticNode => Boolean(ticket));
}

function synthesizedFeature(input: {
  id: string; title: string; summary: string; source: string; status: NodeStatus;
  requirement: string; requirementSummary: string; tickets: string[];
}): SemanticNode {
  return {
    id: input.id, title: input.title, type: "feature", summary: input.summary, status: input.status, source: input.source,
    children: [{ id: `${input.id}-contract`, title: input.requirement, type: "requirement", summary: input.requirementSummary, status: input.status, source: input.source, children: ticketsById(...input.tickets) }],
  };
}

rootNode.summary = "A governed AI workspace that answers from company knowledge, creates cited artifacts, and turns approved work into reusable organizational capability.";
rootNode.context = "Manual synthesis of 41 user stories, architecture decisions, testing constraints, the locked tracer order, and T0-T8 progress evidence into nine capabilities and 30 dependency-aware tickets.";
rootNode.children = [
  {
    id: "governed-knowledge", title: "Governed knowledge and identity", type: "capability", status: "working",
    summary: "Make documents, Flows, search, and agent tools obey the caller's membership-derived perimeter before retrieval.", source: "examples/organizational-memory/PRD.md#perimeter-governance",
    children: [
      synthesizedFeature({ id: "filesystem-corpus", title: "Readable governed corpus", summary: "Store enterprise knowledge in human-readable, permission-shaped filesystem paths.", source: "examples/organizational-memory/PRD.md#data-corpus", status: "done", requirement: "Corpus and retrieval baseline", requirementSummary: "Documents preserve governance metadata and retrieval quality is measured from repeatable eval rows.", tickets: ["WA-01", "WA-02"] }),
      synthesizedFeature({ id: "identity-perimeter", title: "Identity and pre-retrieval perimeter", summary: "Resolve real users to allowed spaces and expose only those spaces to every tool.", source: "examples/organizational-memory/PRD.md#identity-perimeter", status: "done", requirement: "Membership, RLS, and restricted tools", requirementSummary: "Auth, application tools, and persistence enforce the same access predicate without post-retrieval redaction.", tickets: ["WA-03", "WA-04", "WA-10"] }),
      synthesizedFeature({ id: "knowledge-browser", title: "Knowledge browser and locked states", summary: "Let users inspect permitted sources while making denied records visibly and safely locked.", source: "examples/organizational-memory/PRD.md#knowledge-base-ingestion", status: "ready", requirement: "Browsable source provenance", requirementSummary: "Every citation resolves to a readable source and locked cards never reveal hidden content.", tickets: ["WA-17"] }),
    ],
  },
  {
    id: "live-agent", title: "Live agent conversation", type: "capability", status: "done",
    summary: "Run a bounded, authenticated agent that chooses tools, streams answers, and exposes how the answer was assembled.", source: "examples/organizational-memory/PRD.md#agent-tools",
    children: [
      synthesizedFeature({ id: "bounded-agent", title: "Bounded agent and minimal tool surface", summary: "Use one agent loop with empirically selected tools and explicit final-answer guarantees.", source: "examples/organizational-memory/PRD.md#agent-tools", status: "done", requirement: "Permission-scoped tool choice", requirementSummary: "The model chooses among validated tools while each tool resolves the caller's scope internally.", tickets: ["WA-04", "WA-14"] }),
      synthesizedFeature({ id: "streaming-chat", title: "Authenticated streaming chat", summary: "Move arbitrary signed-in questions from the live UI through the standalone server to a cited response.", source: "examples/organizational-memory/PRD.md#user-stories-1-2", status: "done", requirement: "Visible live trace", requirementSummary: "A real Supabase session drives streamed answers and visible tool activity without touching Tour mode state.", tickets: ["WA-05", "WA-06"] }),
    ],
  },
  {
    id: "exact-answers", title: "Exact numeric answers", type: "capability", status: "done",
    summary: "Compute figures through governed SQL over a source-traceable numeric spine instead of hallucinating numbers.", source: "examples/organizational-memory/PRD.md#user-stories-5-35",
    children: [synthesizedFeature({ id: "numeric-spine", title: "Governed numeric spine and SQL", summary: "Generate classified tables from workbooks and query only the tables permitted to the caller.", source: "examples/organizational-memory/PRD.md#data-corpus", status: "done", requirement: "Exact and auditable figures", requirementSummary: "Read-only queries reconcile to source formulas and cannot escape into unapproved external files.", tickets: ["WA-08", "WA-09"] })],
  },
  {
    id: "cited-artifacts", title: "Cited artifacts and human review", type: "capability", status: "ready",
    summary: "Assemble reports beside chat, share only the work product, and fold human feedback back under owner control.", source: "examples/organizational-memory/PRD.md#user-stories-3-8",
    children: [
      synthesizedFeature({ id: "artifact-assembly", title: "Artifact assembly with provenance", summary: "Render typed deck, document, and spreadsheet blocks with source citations.", source: "examples/organizational-memory/PRD.md#user-stories-3-5", status: "done", requirement: "Cited artifact blocks", requirementSummary: "Artifact claims keep visible links to governed documents and exact calculations.", tickets: ["WA-07"] }),
      synthesizedFeature({ id: "artifact-collaboration", title: "Artifact sharing and controlled feedback", summary: "Keep private chat private while reviewers comment on stable artifact blocks.", source: "examples/organizational-memory/PRD.md#user-stories-6-8-13", status: "ready", requirement: "Comment-to-proposal lifecycle", requirementSummary: "Feedback returns as an explicit proposal and conflicts become recorded human decisions.", tickets: ["WA-15", "WA-16"] }),
    ],
  },
  {
    id: "reusable-flows", title: "Reusable Flows and organizational memory", type: "capability", status: "working",
    summary: "Extract successful work into governed methods that can be reviewed, recalled, adapted, versioned, and credited.", source: "examples/organizational-memory/PRD.md#user-stories-9-23",
    children: [
      synthesizedFeature({ id: "flow-extraction", title: "Flow extraction, recall, and rerun", summary: "Turn a session into an approved recipe and rediscover it by agent judgment in a fresh task.", source: "examples/organizational-memory/PRD.md#persistence-model", status: "done", requirement: "Governed reusable method", requirementSummary: "Flow files preserve steps and rules, respect perimeters, rerun on current data, and record usage.", tickets: ["WA-11", "WA-12", "WA-14"] }),
      synthesizedFeature({ id: "flow-governance", title: "Flow governance and evolution", summary: "Comment on methods, capture team rules, diff versions, and reseal changes with accountable approval.", source: "examples/organizational-memory/PRD.md#user-stories-14-18-22-23", status: "done", requirement: "Versioned human accountability", requirementSummary: "Every approved version shows what was sealed, who approved it, and what changed later.", tickets: ["WA-13"] }),
      synthesizedFeature({ id: "capability-analytics", title: "Capability analytics", summary: "Show where approved methods accumulate, who contributes, and where capability gaps remain.", source: "examples/organizational-memory/PRD.md#user-stories-23-29", status: "ready", requirement: "Live organizational-memory metrics", requirementSummary: "Analytics derive from persisted Flows, versions, contributors, and runs rather than seeded presentation data.", tickets: ["WA-27"] }),
    ],
  },
  {
    id: "knowledge-ingestion", title: "Knowledge ingestion and semantic retrieval", type: "capability", status: "blocked",
    summary: "Bring new files into the governed corpus through upload or Drive and cover the semantic retrieval tail.", source: "examples/organizational-memory/PRD.md#knowledge-base-ingestion",
    children: [
      synthesizedFeature({ id: "manual-ingestion", title: "Manual governed upload", summary: "Place a new file into the right governed space and make it immediately searchable.", source: "examples/organizational-memory/PRD.md#user-stories-31-32", status: "ready", requirement: "One governed write-through path", requirementSummary: "Storage, corpus mirroring, and indexing share one placement and validation contract.", tickets: ["WA-18"] }),
      synthesizedFeature({ id: "drive-ingestion", title: "Google Drive ingestion through n8n", summary: "Receive watched Drive files through a narrow webhook instead of building a general connector platform.", source: "examples/organizational-memory/PRD.md#user-story-34", status: "blocked", requirement: "Authenticated ingestion webhook", requirementSummary: "The owner-managed workflow calls the same write-through path and remains explicitly time-boxed.", tickets: ["WA-19"] }),
      synthesizedFeature({ id: "semantic-retrieval", title: "Semantic and cross-lingual retrieval", summary: "Improve meaning-based and Vietnamese query coverage without weakening pre-retrieval governance.", source: "examples/organizational-memory/PRD.md#user-story-33", status: "ready", requirement: "Permission-safe semantic tail", requirementSummary: "Semantic candidates, upload indexing, accent folding, and cross-lingual answers remain measurable in evals.", tickets: ["WA-20"] }),
    ],
  },
  {
    id: "track-platform", title: "Shared data pipeline and track deployments", type: "capability", status: "working",
    summary: "Serve five judging briefs with one product by changing only governed data, numeric spines, scripts, and vocabulary.", source: "examples/organizational-memory/PRD.md#track-specific-deployments",
    children: [
      synthesizedFeature({ id: "corpus-pipeline", title: "Parameterized corpus pipeline", summary: "Generate documents and exact numeric data together, then validate provenance and permissions.", source: "examples/organizational-memory/PRD.md#data-corpus", status: "ready", requirement: "Reconstructable validated track data", requirementSummary: "Every generated track passes source, identity, perimeter, formula, and boilerplate checks.", tickets: ["WA-21"] }),
      synthesizedFeature({ id: "committed-tracks", title: "Committed hero, Tasco, and Shinhan tracks", summary: "Package the mandatory organizational-memory, enterprise-knowledge, and management-BI demonstrations.", source: "examples/organizational-memory/PRD.md#track-specific-deployments", status: "working", requirement: "Committed judging packages", requirementSummary: "Each script demonstrates the same product with correct domain data and verifiable proof.", tickets: ["WA-22", "WA-23"] }),
      synthesizedFeature({ id: "optional-tracks", title: "Optional retail and aviation tracks", summary: "Prepare extra configurations only if they survive the pre-agreed cut order.", source: "examples/organizational-memory/PRD.md#strategy", status: "review", requirement: "No per-track feature forks", requirementSummary: "Phong Vu and aviation reuse identical product paths and are cut before core proof degrades.", tickets: ["WA-24"] }),
    ],
  },
  {
    id: "presenter-experience", title: "Presenter and product experience", type: "capability", status: "working",
    summary: "Preserve the deterministic Tour while making the same surfaces work live, bilingually, responsively, and with real identities.", source: "examples/organizational-memory/PRD.md#demo-presenter",
    children: [
      synthesizedFeature({ id: "tour-live-modes", title: "Tour and live mode integration", summary: "Keep the proven walkthrough choreography while swapping its internals for live state.", source: "examples/organizational-memory/PRD.md#frontend", status: "working", requirement: "One stable surface contract", requirementSummary: "Scripted and live modes share actions and selectors without leaking state between them.", tickets: ["WA-25"] }),
      synthesizedFeature({ id: "presenter-identity", title: "Seeded persona switching", summary: "Make role and perimeter changes effortless to demonstrate while using real auth sessions.", source: "examples/organizational-memory/PRD.md#user-story-40", status: "ready", requirement: "One-click real identity", requirementSummary: "Switching personas clears private state and immediately changes the governed view.", tickets: ["WA-26"] }),
      synthesizedFeature({ id: "local-responsive-ui", title: "Vietnamese, English, and phone approval", summary: "Match judging language needs and let approvers govern Flows from a narrow browser.", source: "examples/organizational-memory/PRD.md#user-stories-12-18-41", status: "ready", requirement: "Bilingual responsive governance", requirementSummary: "Language toggles preserve state and approval remains legible at phone size.", tickets: ["WA-28"] }),
    ],
  },
  {
    id: "quality-delivery", title: "Quality, runtime, and submission proof", type: "capability", status: "working",
    summary: "Harden the real runtime and prove every committed story through observable API, UI, data, and presentation gates.", source: "examples/organizational-memory/PRD.md#testing-decisions",
    children: [
      synthesizedFeature({ id: "runtime-hardening", title: "Authentication and VM hardening", summary: "Protect production boundaries and keep the standalone judging runtime restartable.", source: "examples/organizational-memory/PRD.md#runtime-platform", status: "ready", requirement: "Production-safe enterprise runtime", requirementSummary: "Secrets stay server-side, failures are visible, and durable app state survives restart.", tickets: ["WA-29"] }),
      synthesizedFeature({ id: "submission-gates", title: "Evaluation and walkthrough gates", summary: "Run live evals, preserve the 37-beat Tour, package tracks, and report residual uncertainty.", source: "examples/organizational-memory/PRD.md#testing-decisions", status: "working", requirement: "Judge-observable completion proof", requirementSummary: "Citations, denials, numbers, uploads, reuse, screenshots, and scripts all pass before submission.", tickets: ["WA-02", "WA-30"] }),
    ],
  },
];

const ticketsRoot: SemanticNode = {
  id: "tickets",
  title: "Generated tickets",
  type: "product",
  summary: "Thirty dependency-ordered tracer tickets synthesized from the full PRD and reconciled with T0-T8 progress evidence.",
  status: "review",
  source: ".workahead/session-019f6f8c/tickets/",
  children: ticketNodes,
};

const executionRoot: SemanticNode = {
  id: "execution",
  title: "Execution frontier",
  type: "execution",
  summary: "Compact evidence and handoff context from the approved plan.",
  status: "working",
  source: ".workahead/session-019f6f8c/execution/",
  children: [
    { id: "execution-completed", title: "Validated foundation", type: "evidence", summary: "Fourteen tickets covering T0-T8 have explicit progress-log evidence.", status: "done", source: "examples/organizational-memory/PRD.md#further-notes", children: ticketsById("WA-01", "WA-02", "WA-03", "WA-04", "WA-05", "WA-06", "WA-07", "WA-08", "WA-09", "WA-10", "WA-11", "WA-12", "WA-13", "WA-14") },
    { id: "execution-current", title: "Current active frontier", type: "execution", summary: "Track packaging, Tour/live integration, and final gates can advance from the completed foundation.", status: "working", source: ".workahead/session-019f6f8c/execution/frontier.md", children: ticketsById("WA-22", "WA-25", "WA-30") },
    { id: "execution-blocked", title: "Blocked ingestion branch", type: "decision", summary: "The n8n receiver waits on the external Drive workflow contract and the manual write-through path.", status: "blocked", source: "examples/organizational-memory/PRD.md#mid-session-pivot", children: ticketsById("WA-19") },
    { id: "execution-ready", title: "Ready downstream work", type: "execution", summary: "Review, ingestion, semantic search, data generation, and product hardening are specified but not evidenced complete.", status: "ready", source: ".workahead/session-019f6f8c/tickets/", children: ticketNodes.filter((ticket) => ticket.status === "ready") },
  ],
};

const roots = [rootNode, ticketsRoot, executionRoot];

function flattenNodes(nodes: SemanticNode[], parents: SemanticNode[] = []): { node: SemanticNode; path: SemanticNode[] }[] {
  return nodes.flatMap((node) => {
    const path = [...parents, node];
    return [{ node, path }, ...flattenNodes(node.children ?? [], path)];
  });
}

const repeatedEntries = flattenNodes(roots);
const entryById = new Map<string, { node: SemanticNode; path: SemanticNode[] }>();
repeatedEntries.forEach((entry) => {
  if (!entryById.has(entry.node.id)) entryById.set(entry.node.id, entry);
});
const allEntries = [...entryById.values()];

function Status({ status = "ready" }: { status?: NodeStatus }) {
  return <span className={`wa-status wa-status-${status}`}><i aria-hidden="true" />{status}</span>;
}

export default function DemoClient() {
  const [currentId, setCurrentId] = useState(rootNode.id);
  const [query, setQuery] = useState("");
  const [executionStarted, setExecutionStarted] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [queuedNotes, setQueuedNotes] = useState<{ nodeId: string; text: string }[]>([]);
  const [queueOpen, setQueueOpen] = useState(false);

  const entry = entryById.get(currentId) ?? entryById.get(rootNode.id)!;
  const current = entry.node;
  const path = entry.path;

  useEffect(() => {
    const readLocation = () => {
      const id = new URL(window.location.href).searchParams.get("node");
      if (id && entryById.has(id)) setCurrentId(id);
      else setCurrentId(rootNode.id);
    };
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, []);

  const navigate = (id: string) => {
    const target = entryById.get(id);
    if (!target) return;
    const url = id === rootNode.id ? "/demo" : `/demo?node=${encodeURIComponent(id)}`;
    window.history.pushState({ node: id }, "", url);
    setCurrentId(id);
    setQuery("");
    setNoteOpen(false);
    setQueueOpen(false);
  };

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return allEntries
      .filter(({ node }) => [node.title, node.summary, node.type, node.source ?? ""].some((value) => value.toLowerCase().includes(normalized)))
      .slice(0, 24);
  }, [query]);

  const startExecution = () => {
    setExecutionStarted(true);
    navigate(executionRoot.id);
  };

  const queueNote = () => {
    const text = note.trim();
    if (!text) return;
    setQueuedNotes((items) => [...items, { nodeId: current.id, text }]);
    setNote("");
    setNoteOpen(false);
    setQueueOpen(true);
  };

  return (
    <main className="wa-app">
      <header className="wa-chrome">
        <a className="wa-wordmark" href="/" aria-label="Back to Workahead home"><span aria-hidden="true">W/</span><strong>workahead</strong></a>
        <div className="wa-repo"><span>organizational-memory-ssl</span><b>main</b></div>
        <label className="wa-search"><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="semantic units, files, tickets" aria-label="Search the current Workahead session" /><kbd>⌘K</kbd></label>
        <button className={`wa-queue-button ${queueOpen ? "is-active" : ""}`} type="button" onClick={() => setQueueOpen((open) => !open)}>Change queue <b>{queuedNotes.length}</b></button>
        <button className="wa-run-button" type="button" onClick={startExecution}>{executionStarted ? "Execution active" : "Run approved plan"}</button>
      </header>

      <div className="wa-workspace wa-workspace-recursive">
        <aside className="wa-sidebar" aria-label="Semantic tree">
          <div className="wa-sidebar-title"><span>SESSION TREE</span><button type="button" aria-label="Session menu">•••</button></div>
          <div className="wa-session-id">session-019f6f8c</div>
          <nav className="wa-primary-nav">
            <button className={path[0]?.id === rootNode.id ? "is-active" : ""} onClick={() => navigate(rootNode.id)}><span>plan</span><b>{rootNode.children?.length ?? 0}</b></button>
            <button className={path[0]?.id === ticketsRoot.id ? "is-active" : ""} onClick={() => navigate(ticketsRoot.id)}><span>tickets</span><b>{ticketNodes.length}</b></button>
            <button className={path[0]?.id === executionRoot.id ? "is-active" : ""} onClick={() => navigate(executionRoot.id)}><span>execution</span><b>{executionStarted ? 1 : 0}</b></button>
          </nav>
          <div className="wa-tree wa-recursive-tree">
            <p>CURRENT PATH</p>
            <TreePath path={path} onNavigate={navigate} />
          </div>
          <div className="wa-sidebar-footer"><span>Depth</span><strong>{path.length - 1}</strong><span>Current type</span><code>{current.type}</code><span>Agent access</span><strong>full</strong></div>
        </aside>

        <section className="wa-center wa-recursive-center">
          <div className="wa-tabs" aria-label="Open semantic location">
            {path.slice(-4).map((node) => <button key={node.id} className={node.id === current.id ? "is-active" : ""} onClick={() => navigate(node.id)}>{node.title}</button>)}
            <span>{current.type}</span>
          </div>

          {query.trim() ? (
            <SearchView query={query} results={searchResults} onNavigate={navigate} />
          ) : (
            <SemanticView node={current} path={path} noteOpen={noteOpen} note={note} onNoteChange={setNote} onToggleNote={() => setNoteOpen((open) => !open)} onQueueNote={queueNote} onNavigate={navigate} />
          )}

          <footer className="wa-statusbar"><span>{current.children?.length ?? 0} child blocks</span><span>depth {path.length - 1}</span><span>{queuedNotes.length} queued changes</span><span className="wa-statusbar-path">{current.source ?? "generated context"}</span><span>UTF-8</span></footer>
        </section>
      </div>

      {queueOpen && <ChangeQueue notes={queuedNotes} onClose={() => setQueueOpen(false)} onNavigate={navigate} />}
    </main>
  );
}

function TreePath({ path, onNavigate }: { path: SemanticNode[]; onNavigate: (id: string) => void }) {
  return <div className="wa-path-tree">{path.map((node, index) => <button key={node.id} className={index === path.length - 1 ? "is-current" : ""} style={{ paddingLeft: `${12 + index * 12}px` }} onClick={() => onNavigate(node.id)}><span>{index === path.length - 1 ? "›" : "⌄"}</span><strong>{node.title}</strong><small>{node.children?.length ?? 0}</small></button>)}</div>;
}

function SemanticView({ node, path, noteOpen, note, onNoteChange, onToggleNote, onQueueNote, onNavigate }: {
  node: SemanticNode;
  path: SemanticNode[];
  noteOpen: boolean;
  note: string;
  onNoteChange: (value: string) => void;
  onToggleNote: () => void;
  onQueueNote: () => void;
  onNavigate: (id: string) => void;
}) {
  const children = node.children ?? [];
  const displayedChildren = node.id === ticketsRoot.id
    ? [...children].sort((a, b) => (a.ticket?.wave ?? 0) - (b.ticket?.wave ?? 0) || a.id.localeCompare(b.id))
    : children;
  const parent = path.at(-2);
  return (
    <div className="wa-content wa-semantic-view">
      <nav className="wa-semantic-breadcrumb" aria-label="Semantic breadcrumb">
        {path.map((item, index) => <span key={item.id}><button onClick={() => onNavigate(item.id)}>{item.title}</button>{index < path.length - 1 && <i>/</i>}</span>)}
      </nav>

      <header className="wa-semantic-head">
        <div><div className="wa-node-type">{node.type}</div><h1>{node.title}</h1><p>{node.summary}</p></div>
        <div className="wa-semantic-actions"><Status status={node.status} /><button type="button" onClick={onToggleNote}>{noteOpen ? "Cancel note" : "Add note"}</button></div>
      </header>

      <div className="wa-node-context">
        <div className="wa-node-source"><span>PROVENANCE</span><code>{node.source ?? "generated context"}</code><p>This block is synthesized from this source and inherits context from its parent path.</p></div>
        <div className="wa-node-facts"><span>depth <strong>{path.length - 1}</strong></span><span>child blocks <strong>{children.length}</strong></span><span>parent {parent ? <button onClick={() => onNavigate(parent.id)}>{parent.title}</button> : <strong>session root</strong>}</span></div>
      </div>

      {noteOpen && <div className="wa-inline-note"><label htmlFor="semantic-note">Instruction for this semantic block</label><textarea id="semantic-note" value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Describe what should change and why." autoFocus /><button type="button" disabled={!note.trim()} onClick={onQueueNote}>Add to change queue</button></div>}

      {node.id === rootNode.id && <SynthesisSummary />}
      {node.id === ticketsRoot.id && <TicketExecutionMap tickets={children} onNavigate={onNavigate} />}

      {children.length ? (
        <section className="wa-child-section">
          <div className="wa-section-head"><div><h2>Inside {node.title}</h2><p>Select a block to enter the next level of context.</p></div><span>{children.length} blocks</span></div>
          <div className="wa-child-list">
            {displayedChildren.map((child) => <SemanticBlock key={child.id} node={child} onNavigate={onNavigate} showExecutionOrder={node.id === ticketsRoot.id} />)}
          </div>
        </section>
      ) : (
        <LeafView node={node} path={path} onNavigate={onNavigate} />
      )}

      {node.context && <section className="wa-context-section"><h2>Context inherited at this level</h2><p>{node.context}</p></section>}
    </div>
  );
}

function SynthesisSummary() {
  const count = (status: NodeStatus) => ticketNodes.filter((ticket) => ticket.status === status).length;
  return <section className="wa-synthesis-summary" aria-label="Synthesis summary">
    <div><strong>{rootNode.children?.length ?? 0}</strong><span>capabilities</span></div>
    <div><strong>{ticketNodes.length}</strong><span>tracer tickets</span></div>
    <div><strong>{count("done")}</strong><span>evidenced done</span></div>
    <div><strong>{count("working")}</strong><span>active frontier</span></div>
    <div><strong>{count("blocked")}</strong><span>blocked branch</span></div>
  </section>;
}

function SemanticBlock({ node, onNavigate, showExecutionOrder = false }: { node: SemanticNode; onNavigate: (id: string) => void; showExecutionOrder?: boolean }) {
  return <button className="wa-semantic-block" type="button" onClick={() => onNavigate(node.id)}>
    <div className="wa-block-main">
      <div className="wa-block-meta">{showExecutionOrder && node.ticket && <span className="wa-wave-label">Wave {node.ticket.wave}</span>}<span className="wa-block-type">{node.type}</span><Status status={node.status} /></div>
      <strong>{node.title}</strong>
      <p>{node.summary}</p>
      <div className="wa-block-source"><span>From</span><code>{node.source ?? "generated context"}</code></div>
    </div>
    <div className="wa-block-enter">{showExecutionOrder && node.ticket ? <><span>{node.ticket.dependsOn.length ? `After ${node.ticket.dependsOn.join(" + ")}` : "Starts immediately"}</span><small>{node.ticket.unlocks.length ? `Unlocks ${node.ticket.unlocks.join(" + ")}` : "Final work unit"}</small></> : <span>{node.children?.length ? `${node.children.length} nested block${node.children.length === 1 ? "" : "s"}` : "Deepest level"}</span>}<b>Open ›</b></div>
  </button>;
}

function TicketExecutionMap({ tickets, onNavigate }: { tickets: SemanticNode[]; onNavigate: (id: string) => void }) {
  const waveCount = Math.max(...tickets.map((ticket) => ticket.ticket?.wave ?? 0));
  const waves = Array.from({ length: waveCount }, (_, index) => index + 1).map((wave) => ({ wave, tickets: tickets.filter((ticket) => ticket.ticket?.wave === wave) }));
  const activeIds = tickets.filter((ticket) => ticket.status === "working").map((ticket) => ticket.id.toUpperCase());
  const blockedIds = tickets.filter((ticket) => ticket.status === "blocked").map((ticket) => ticket.id.toUpperCase());
  return <section className="wa-execution-map" aria-label="Ticket execution order">
    <div className="wa-section-head"><div><h2>Execution order</h2><p>Tickets in the same wave can run in parallel after their dependencies clear.</p></div><span>{waveCount} dependency waves</span></div>
    <div className="wa-wave-track">
      {waves.map(({ wave, tickets: waveTickets }, index) => <div className="wa-wave" key={wave}>
        <header><span>Wave {wave}</span><strong>{wave === 1 ? "Start" : wave === waveCount ? "Finish" : "Then"}</strong></header>
        <div>{waveTickets.map((ticket) => <button key={ticket.id} onClick={() => onNavigate(ticket.id)}><span>{ticket.id.toUpperCase()}</span><strong>{ticket.title}</strong><Status status={ticket.status} /></button>)}</div>
        {index < waves.length - 1 && <b className="wa-wave-arrow" aria-hidden="true">›</b>}
      </div>)}
    </div>
    <p className="wa-wave-note"><strong>Current frontier:</strong> {activeIds.join(", ") || "No active tickets"}. {blockedIds.length ? `${blockedIds.join(", ")} remains blocked.` : "No blocked branches."}</p>
  </section>;
}

function LeafView({ node, path, onNavigate }: { node: SemanticNode; path: SemanticNode[]; onNavigate: (id: string) => void }) {
  const siblings = path.at(-2)?.children?.filter((item) => item.id !== node.id) ?? [];
  return <div className="wa-leaf-view">
    <section className="wa-leaf-main">
      <div className="wa-section-head"><div><h2>{node.ticket ? "Ticket contract" : "Semantic record"}</h2><p>This is the deepest available context for the selected branch.</p></div></div>
      <dl className="wa-contract">
        <div><dt>Identity</dt><dd><code>{node.id}</code></dd></div>
        <div><dt>Type</dt><dd>{node.type}</dd></div>
        <div><dt>Provenance</dt><dd><code>{node.source ?? "generated context"}</code></dd></div>
        {node.context && <div><dt>Why</dt><dd>{node.context}</dd></div>}
      </dl>
      {node.ticket && <TicketContract ticket={node.ticket} />}
    </section>
    <aside className="wa-sibling-context"><h2>Sibling context</h2>{siblings.length ? siblings.map((sibling) => <button key={sibling.id} onClick={() => onNavigate(sibling.id)}><span>{sibling.type}</span><strong>{sibling.title}</strong></button>) : <p>No sibling blocks at this level.</p>}</aside>
  </div>;
}

function TicketContract({ ticket }: { ticket: TicketDetail }) {
  return <>
    <section className="wa-leaf-section"><h3>Acceptance</h3>{ticket.acceptance.map((item) => <label key={item}><input type="checkbox" readOnly /><span>{item}</span></label>)}</section>
    <section className="wa-leaf-section"><h3>Affected files</h3>{ticket.files.map((file) => <code key={file}>{file}</code>)}</section>
    <section className="wa-leaf-section wa-leaf-evidence"><h3>Latest evidence</h3><p>{ticket.evidence}</p></section>
    <section className="wa-leaf-relations"><div><span>depends on</span><strong>{ticket.dependsOn.join(", ") || "root"}</strong></div><div><span>unlocks</span><strong>{ticket.unlocks.join(", ") || "none"}</strong></div></section>
  </>;
}

function SearchView({ query, results, onNavigate }: { query: string; results: { node: SemanticNode; path: SemanticNode[] }[]; onNavigate: (id: string) => void }) {
  return <div className="wa-content wa-search-results"><div className="wa-semantic-head"><div><div className="wa-node-type">session search</div><h1>Results for “{query}”</h1><p>Search traverses titles, summaries, types, and provenance across the full semantic tree.</p></div></div><div className="wa-child-list">{results.map(({ node, path }) => <button className="wa-search-result" key={node.id} onClick={() => onNavigate(node.id)}><span>{path.map((item) => item.title).join(" / ")}</span><strong>{node.title}</strong><p>{node.summary}</p></button>)}{!results.length && <div className="wa-empty">No semantic units match this search.</div>}</div></div>;
}

function ChangeQueue({ notes, onClose, onNavigate }: { notes: { nodeId: string; text: string }[]; onClose: () => void; onNavigate: (id: string) => void }) {
  return <div className="wa-queue-backdrop" role="presentation" onMouseDown={onClose}><section className="wa-queue-dialog" role="dialog" aria-modal="true" aria-label="Change queue" onMouseDown={(event) => event.stopPropagation()}><header><div><span>CHANGE QUEUE</span><strong>{notes.length} pending instruction{notes.length === 1 ? "" : "s"}</strong></div><button onClick={onClose}>Close</button></header>{notes.length ? <div className="wa-queue-items">{notes.map((item, index) => { const target = entryById.get(item.nodeId)?.node; return <button key={`${item.nodeId}-${index}`} onClick={() => onNavigate(item.nodeId)}><span><code>{target?.type}</code><b>queued</b></span><strong>{target?.title ?? item.nodeId}</strong><p>{item.text}</p></button>; })}</div> : <div className="wa-queue-empty"><strong>No pending changes</strong><p>Add a note from any semantic level. The queue retains its exact target and path.</p></div>}</section></div>;
}
