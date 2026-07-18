"use client";

import { useMemo, useState } from "react";

type View = "overview" | "prd" | "tickets" | "execution";
type TicketStatus = "done" | "in_progress" | "ready" | "blocked";

type Ticket = {
  id: string;
  title: string;
  group: string;
  status: TicketStatus;
  summary: string;
  files: string[];
  dependsOn: string[];
  unlocks: string[];
  acceptance: string[];
  evidence: string;
  context: string;
};

const tickets: Ticket[] = [
  {
    id: "WA-01",
    title: "Enforce the search perimeter before retrieval",
    group: "governance",
    status: "done",
    summary: "Make sure every search starts inside the user’s permitted view.",
    files: ["server/src/lib/perimeter.ts", "server/src/tools/search_files.ts"],
    dependsOn: [],
    unlocks: ["WA-02", "WA-03"],
    acceptance: ["Out-of-perimeter files never enter the candidate set", "Search tools receive the resolved user view", "RLS mirrors the same access predicate"],
    evidence: "Done · perimeter smoke test passing",
    context: "The repository makes this a hard boundary: access is enforced before retrieval, never by filtering results afterwards.",
  },
  {
    id: "WA-02",
    title: "Build the numeric spine for exact answers",
    group: "data",
    status: "in_progress",
    summary: "Turn governed business data into a reliable SQL surface for figures and reports.",
    files: ["server/src/lib/spine.ts", "server/src/cli/build-spine.ts", "server/supabase/migrations/"],
    dependsOn: ["WA-01"],
    unlocks: ["WA-03", "WA-05"],
    acceptance: ["Numeric questions resolve through SQL", "The spine is generated from governed corpus data", "A seeded smoke test proves the access boundary"],
    evidence: "In progress · schema inspection pending",
    context: "The PRD separates narrative retrieval from exact figures. The next agent receives the perimeter decision from WA-01.",
  },
  {
    id: "WA-03",
    title: "Create cited report and deck artifacts",
    group: "artifacts",
    status: "ready",
    summary: "Let the agent assemble useful reports with real source citations and visible provenance.",
    files: ["server/src/tools/create_artifact.ts", "chat-artifact/src/components/artifact/"],
    dependsOn: ["WA-01", "WA-02"],
    unlocks: ["WA-05"],
    acceptance: ["Artifacts carry source citations", "Reports and decks use the governed corpus", "The UI shows the artifact and its evidence"],
    evidence: "Ready · waiting for the spine contract",
    context: "The artifact surface is downstream of both narrative access and exact numeric answers. Workahead keeps that dependency visible.",
  },
  {
    id: "WA-04",
    title: "Extract reusable approved Flows",
    group: "flows",
    status: "blocked",
    summary: "Turn a successful tool-use sequence into a versioned, human-approved recipe.",
    files: ["server/src/lib/flows.ts", "server/src/agent/agent.ts", "flows/"],
    dependsOn: ["WA-01"],
    unlocks: ["WA-05"],
    acceptance: ["A Flow preserves the reasoning behind its steps", "The agent matches Flows by judgment", "A human approves before reuse"],
    evidence: "Blocked · approval policy needs a decision",
    context: "The PRD deliberately avoids an embedding index and template engine. The open question is how much approval history the first version needs.",
  },
  {
    id: "WA-05",
    title: "Connect the live chat to the agent trace",
    group: "experience",
    status: "ready",
    summary: "Show the agent’s tools, decisions, and generated artifacts without losing the conversation.",
    files: ["chat-artifact/src/pages/LiveChat.tsx", "chat-artifact/src/components/live/", "server/src/server/"],
    dependsOn: ["WA-02", "WA-03", "WA-04"],
    unlocks: [],
    acceptance: ["Tool calls are visible in the chat", "Generated artifacts can be opened and inspected", "A Flow proposal can be reviewed before reuse"],
    evidence: "Ready · inherits decisions from three tickets",
    context: "This is the user-facing proof of the whole system: chat, governed search, exact answers, artifacts, and reusable work all meet in one trace.",
  },
];

const statusLabels: Record<TicketStatus, string> = {
  done: "done",
  in_progress: "in progress",
  ready: "ready",
  blocked: "blocked",
};

function StatusDot({ status }: { status: TicketStatus }) {
  return <span className={`demo-status-dot demo-status-${status}`} aria-label={statusLabels[status]} />;
}

export default function DemoClient() {
  const [view, setView] = useState<View>("overview");
  const [selectedId, setSelectedId] = useState("WA-02");
  const [executionStarted, setExecutionStarted] = useState(false);

  const selected = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0],
    [selectedId],
  );

  const openTicket = (id: string) => {
    setSelectedId(id);
    setView("tickets");
  };

  return (
    <main className="demo-shell">
      <header className="demo-topbar">
        <a className="demo-brand" href="/" aria-label="Back to Workahead home">
          <span className="wordmark-mark" aria-hidden="true">W/</span>
          <span>workahead</span>
        </a>
        <div className="demo-breadcrumb"><span>workspace</span><span>/</span><strong>organizational-memory-ssl</strong></div>
        <nav className="product-nav" aria-label="Workspace navigation">
          <button className={view === "overview" || view === "prd" ? "is-active" : ""} onClick={() => setView("overview")}>Plan</button>
          <button className={view === "tickets" ? "is-active" : ""} onClick={() => setView("tickets")}>Tickets <b>5</b></button>
          <button className={view === "execution" ? "is-active" : ""} onClick={() => setView("execution")}>Execution</button>
        </nav>
        <div className="demo-account-menu"><span><i /> reviewing</span><button aria-label="Workspace menu">•••</button></div>
      </header>

      <section className="demo-reading-page" aria-label="Workahead plan">
        <div className="demo-reading-crumbs"><span>workspace</span><span>›</span><strong>organizational-memory-ssl</strong><span>›</span><strong>.workahead / session-019f6f8c</strong><span>›</span><strong>plan</strong></div>
        <div className="demo-reading-head">
          <div>
            <span className="demo-kicker">PROJECT PLAN · UPDATED 2 MINUTES AGO</span>
            <h1>Organizational Memory</h1>
            <p>Plan generated from <code>examples/organizational-memory/PRD.md</code>. Review the scope, decisions, and tickets before sending this session to an agent.</p>
          </div>
          <div className="demo-reading-actions">
            <button className="demo-ghost-button">Add a note</button>
            <button className={`demo-run-button ${executionStarted ? "is-running" : ""}`} onClick={() => { setExecutionStarted(true); setView("execution"); }}>
              <span>{executionStarted ? "Agent is working" : "Send to execution"}</span><span>→</span>
            </button>
          </div>
        </div>

        {view === "overview" && <PlanOverview onSelect={openTicket} />}
        {view === "prd" && <SemanticDetail ticket={selected} onSelect={openTicket} />}
        {view === "tickets" && <TicketRail onSelect={openTicket} selectedId={selected.id} />}
        {view === "execution" && <ExecutionSurface executionStarted={executionStarted} onSelect={openTicket} />}

        <div className="demo-reading-foot"><span>source · examples/organizational-memory/PRD.md</span><span>5 tickets · 1 blocker · 3 decisions</span></div>
      </section>
    </main>
  );
}

function PlanOverview({ onSelect }: { onSelect: (id: string) => void }) {
  return <div className="demo-plan-overview">
    <div className="demo-plan-summary"><span className="demo-kicker">PRODUCT GOAL · FROM PRD</span><h2>One chat for governed company knowledge.</h2><p>Answer questions from the right documents, calculate exact numbers, create useful artifacts, and preserve the work as a reusable Flow.</p><div className="demo-stat-row"><div><strong>7</strong><span>features found</span></div><div><strong>41</strong><span>user stories</span></div><div><strong>3</strong><span>open decisions</span></div></div></div>
    <div className="demo-plan-section-label"><span className="demo-kicker">FEATURES FOUND IN THE PRD</span><span>Click any feature to inspect its tickets</span></div>
    <div className="demo-semantic-sections">
      <button onClick={() => onSelect("WA-01")}><span>01</span><div><small>GOVERNED KNOWLEDGE</small><strong>Search only what the user can access</strong><p>Perimeter · corpus · search tools</p></div><b>WA-01 ↗</b></button>
      <button onClick={() => onSelect("WA-02")}><span>02</span><div><small>EXACT ANSWERS</small><strong>Use SQL when the answer is a number</strong><p>Numeric spine · views · RLS</p></div><b>WA-02 ↗</b></button>
      <button onClick={() => onSelect("WA-03")}><span>03</span><div><small>USEFUL OUTPUT</small><strong>Create reports and decks with citations</strong><p>Artifacts · evidence · provenance</p></div><b>WA-03 ↗</b></button>
      <button onClick={() => onSelect("WA-04")}><span>04</span><div><small>REUSABLE WORK</small><strong>Turn a good session into a Flow</strong><p>Versioned · approved · discoverable</p></div><b>WA-04 ↗</b></button>
    </div>
    <div className="demo-open-decision"><span className="demo-note-pin">!</span><div><small>OPEN DECISION · BLOCKS WA-04</small><strong>What needs human approval before a Flow can run again?</strong><p>This question came from the PRD and must be answered before execution.</p></div><button onClick={() => onSelect("WA-04")}>Open decision →</button></div>
  </div>;
}

function SemanticDetail({ ticket, onSelect }: { ticket: Ticket; onSelect: (id: string) => void }) {
  return <div className="demo-semantic-detail">
    <div className="demo-detail-main"><span className="demo-kicker">FEATURE / {ticket.group.toUpperCase()}</span><h2>{ticket.title}</h2><p className="demo-detail-lead">{ticket.summary}</p><div className="demo-detail-block"><span className="demo-kicker">WHY THIS EXISTS</span><p>{ticket.context}</p></div><div className="demo-detail-block"><span className="demo-kicker">ACCEPTANCE</span>{ticket.acceptance.map((item) => <p className="demo-check-row" key={item}><span>✓</span>{item}</p>)}</div></div>
    <aside className="demo-detail-aside"><div className="demo-detail-status"><StatusDot status={ticket.status} /><strong>{statusLabels[ticket.status]}</strong><span>{ticket.id}</span></div><div className="demo-detail-block"><span className="demo-kicker">TOUCHES THESE FILES</span>{ticket.files.map((file) => <code key={file}>{file}</code>)}</div><div className="demo-detail-block"><span className="demo-kicker">CONNECTED TO</span>{ticket.dependsOn.map((id) => <button key={id} onClick={() => onSelect(id)}>← depends on {id}</button>)}{ticket.unlocks.map((id) => <button key={id} onClick={() => onSelect(id)}>→ unlocks {id}</button>)}</div><div className="demo-detail-proof"><span className="demo-kicker">LATEST PROOF</span><p>{ticket.evidence}</p></div></aside>
  </div>;
}

function TicketRail({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string }) {
  return <div className="demo-ticket-rail"><div className="demo-ticket-rail-head"><div><span className="demo-kicker">THE WORK, IN ORDER</span><h2>Tickets connected to the reason they exist.</h2></div><span>5 tickets · 1 blocked</span></div>{tickets.map((ticket, index) => <button key={ticket.id} className={`demo-ticket-card ${selectedId === ticket.id ? "is-selected" : ""}`} onClick={() => onSelect(ticket.id)}><span className="demo-ticket-number">0{index + 1}</span><StatusDot status={ticket.status} /><div><small>{ticket.id} · {ticket.group}</small><strong>{ticket.title}</strong><p>{ticket.summary}</p></div><div className="demo-ticket-card-meta"><span>{ticket.files.length} files</span><span>{ticket.dependsOn.length ? `after ${ticket.dependsOn.join(", ")}` : "first"}</span><b>↗</b></div></button>)}</div>;
}

function ExecutionSurface({ executionStarted, onSelect }: { executionStarted: boolean; onSelect: (id: string) => void }) {
  return <div className="demo-execution-surface"><div className={`demo-execution-intro ${executionStarted ? "is-live" : ""}`}><div><span className="demo-kicker">EXECUTION / LIVE CONTEXT</span><h2>{executionStarted ? "The agent is working from the approved plan." : "The plan is ready to run."}</h2><p>{executionStarted ? "Each ticket leaves behind evidence for the next ticket. You can stop the run and change the plan at any time." : "Send the plan to Codex or Claude Code when the ticket boundaries and open decisions make sense."}</p></div><strong>{executionStarted ? "1 / 5" : "0 / 5"}<small>tickets attempted</small></strong></div><div className="demo-execution-columns"><div className="demo-execution-feed"><span className="demo-kicker">ACTIVITY</span><button onClick={() => onSelect("WA-01")}><b>✓</b><div><strong>WA-01 completed</strong><small>Perimeter smoke test passing</small></div><em>done</em></button><button className="is-current" onClick={() => onSelect("WA-02")}><b>→</b><div><strong>{executionStarted ? "WA-02 in progress" : "WA-02 is next"}</strong><small>{executionStarted ? "Agent is building the numeric spine" : "Ready after WA-01"}</small></div><em>{executionStarted ? "working" : "ready"}</em></button><button className="is-blocked" onClick={() => onSelect("WA-04")}><b>!</b><div><strong>WA-04 is blocked</strong><small>Approval policy needs your decision</small></div><em>blocked</em></button></div><div className="demo-execution-context"><span className="demo-kicker">WHAT THE NEXT AGENT RECEIVES</span><h3>Context, not a blank chat.</h3><p>Completed tickets pass forward decisions, changed files, evidence, and new risks. The next agent starts with the latest truth.</p><code>server/src/lib/perimeter.ts</code><code>12 checks passing</code><code>decision inherited from WA-01</code></div></div></div>;
}

function OverviewGraph({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string }) {
  return (
    <div className="demo-overview">
      <div className="demo-overview-meta"><span>5 work units</span><span>→ 2 decisions waiting</span><span>→ 1 branch blocked</span></div>
      <div className="demo-graph-canvas">
        <div className="demo-graph-line line-one" /><div className="demo-graph-line line-two" /><div className="demo-graph-line line-three" />
        <button className="demo-graph-root" onClick={() => onSelect("WA-01")}><span className="demo-node-type">PRD / outcome</span><strong>Todo app people trust across devices</strong><small>5 tickets · 3 product areas</small></button>
        {tickets.map((ticket, index) => <button key={ticket.id} className={`demo-graph-node node-${index + 1} ${selectedId === ticket.id ? "is-selected" : ""}`} onClick={() => onSelect(ticket.id)}><span><StatusDot status={ticket.status} />{ticket.id}</span><strong>{ticket.title}</strong><small>{ticket.files.length} files · {ticket.group}</small></button>)}
        <div className="demo-graph-note"><span className="demo-note-pin">!</span><div><strong>Open decision</strong><p>How should task notes merge during sync?</p><button onClick={() => onSelect("WA-04")}>See affected tickets →</button></div></div>
      </div>
      <div className="demo-legend"><span><i className="legend-done" /> completed context</span><span><i className="legend-active" /> current work</span><span><i className="legend-blocked" /> blocker</span><span><i className="legend-line" /> dependency</span></div>
    </div>
  );
}

function PrdSurface({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="demo-prd-surface">
      <aside className="demo-prd-outline" aria-label="PRD outline">
        <span className="demo-kicker">DOCUMENT</span>
        <button className="is-active">Overview <b>1</b></button>
        <button>Problem <b>2</b></button>
        <button>Outcome <b>3</b></button>
        <button>Scope <b>4</b></button>
        <button>Open decisions <b>2</b></button>
        <button>Linked work <b>5</b></button>
        <div className="demo-prd-outline-source"><span className="demo-kicker">SOURCE</span><code>docs/PRD.md</code><small>Imported 14 min ago</small></div>
      </aside>
      <article className="demo-prd-document">
        <header className="demo-prd-document-head">
          <div><span className="demo-kicker">PRD-001 / VERSION 3</span><h3>Todo list with sync + notifications</h3><p>Draft · last edited 14 minutes ago by Sarthak</p></div>
          <span className="demo-document-count">12 decisions · 5 linked tickets</span>
        </header>
        <section className="demo-prd-block"><h4>Problem</h4><p>People capture tasks in one place, then lose trust when the list is stale on another device or reminders arrive without context. The product must make the small loop—capture, complete, recover—feel dependable before it grows into a system of record.</p></section>
        <section className="demo-prd-block"><h4>Outcome</h4><p>A focused todo list that works offline, syncs changes across devices, and lets people control when reminders happen. Completion should be reversible, attributable, and visible everywhere.</p></section>
        <div className="demo-prd-columns">
          <section className="demo-prd-block"><h4>In scope</h4><ul><li>Task capture, completion, undo, and due dates</li><li>Per-user notification preferences</li><li>Offline queue and cross-device sync</li></ul></section>
          <section className="demo-prd-block"><h4>Out of scope</h4><ul><li>Shared team lists and assignments</li><li>Recurring tasks and calendar integration</li><li>Push notification infrastructure</li></ul></section>
        </div>
        <section className="demo-prd-decision"><div><span className="demo-kicker">NEEDS DECISION · BLOCKS WA-04</span><h4>How should task notes merge?</h4><p>The PRD says “no lost edits” but does not define whether notes merge per field or per record when two devices edit offline.</p></div><div className="demo-prd-decision-actions"><button onClick={() => onSelect("WA-04")}>Open affected ticket <b>WA-04 ↗</b></button><button onClick={() => onSelect("WA-02")}>Add a decision comment <b>+</b></button></div></section>
        <section className="demo-prd-linked"><div className="demo-prd-linked-head"><h4>Linked work</h4><span>5 tickets · dependency order</span></div><button onClick={() => onSelect("WA-01")}><span>WA-01</span><strong>Task domain and local store</strong><small>done · establishes the adapter boundary</small></button><button onClick={() => onSelect("WA-02")}><span>WA-02</span><strong>Task list and completion flow</strong><small>in progress · core experience</small></button><button onClick={() => onSelect("WA-03")}><span>WA-03</span><strong>Notification preferences</strong><small>ready · requires explicit opt-in</small></button></section>
      </article>
    </div>
  );
}

function TicketList({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string }) {
  return <div className="demo-ticket-list"><div className="demo-list-toolbar"><span>Showing all 5 tickets</span><button>Filter: all ▾</button><button>Sort: dependency ▾</button></div>{tickets.map((ticket) => <button key={ticket.id} className={`demo-ticket-row ${selectedId === ticket.id ? "is-selected" : ""}`} onClick={() => onSelect(ticket.id)}><span className="demo-row-id"><StatusDot status={ticket.status} />{ticket.id}</span><span className="demo-row-title"><strong>{ticket.title}</strong><small>{ticket.summary}</small></span><span className="demo-row-group">{ticket.group}</span><span className="demo-row-files">{ticket.files.length} files</span><span className="demo-row-arrow">↗</span></button>)}</div>;
}

function ExecutionLedger({ executionStarted, onSelect }: { executionStarted: boolean; onSelect: (id: string) => void }) {
  return <div className="demo-execution"><div className={`demo-execution-banner ${executionStarted ? "is-live" : ""}`}><div><span className="demo-kicker">EXECUTION MODE</span><h3>{executionStarted ? "Agents are working from the approved frontier." : "Ready when you are."}</h3><p>{executionStarted ? "The plan remains editable. New discoveries attach to the ticket that found them." : "The plan is reviewable. Send it to execution when the ticket boundaries and blockers make sense."}</p></div><div className="demo-execution-progress"><strong>{executionStarted ? "1 / 5" : "0 / 5"}</strong><span>tickets attempted</span></div></div><div className="demo-ledger"><div className="demo-ledger-head"><span>ACTIVITY LEDGER</span><span>WHAT THE NEXT AGENT RECEIVES</span></div><button className="demo-ledger-row done" onClick={() => onSelect("WA-01")}><span className="demo-ledger-time">09:42</span><span><strong>WA-01 completed</strong><small>Store contract verified · 12 tests passing</small></span><span className="demo-ledger-context">Task shape + adapter boundary</span></button><button className={`demo-ledger-row ${executionStarted ? "active" : "ready"}`} onClick={() => onSelect("WA-02")}><span className="demo-ledger-time">now</span><span><strong>{executionStarted ? "WA-02 in progress" : "WA-02 next"}</strong><small>{executionStarted ? "Agent is checking keyboard and empty states" : "Ready after WA-01"}</small></span><span className="demo-ledger-context">Previous decision + affected files</span></button><button className="demo-ledger-row blocked" onClick={() => onSelect("WA-04")}><span className="demo-ledger-time">—</span><span><strong>WA-04 blocked</strong><small>Needs conflict policy decision</small></span><span className="demo-ledger-context">Open question carried forward</span></button></div><div className="demo-handoff-card"><span className="demo-kicker">THE HANDOFF IS THE PRODUCT</span><p>Every completed ticket leaves behind decisions, evidence, and changed assumptions. The next agent starts with that context—not a blank chat window.</p></div></div>;
}
