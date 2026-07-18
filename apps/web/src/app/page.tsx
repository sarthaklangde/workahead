const X_URL = "https://x.com/sarthaklangde";

function AccessLink({ className = "access-link" }: { className?: string }) {
  return (
    <a className={className} href={X_URL} target="_blank" rel="noreferrer">
      <span>Show me your feature</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function DemoLink({ className = "access-link" }: { className?: string }) {
  return (
    <a className={className} href="/demo">
      <span>See how it works</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function Home() {
  return (
    <main id="top">
      <section className="hero-shell">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Workahead home">
            <span className="wordmark-mark" aria-hidden="true">
              W/
            </span>
            <span>workahead</span>
          </a>

          <a className="nav-link" href="#workflow">
            How it works
          </a>
          <a className="nav-link" href="/demo">
            See the demo ↗
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">For developers who use Codex or Claude Code</p>
            <h1>See what your agent will change. Before it changes anything.</h1>
            <p className="hero-deck">
              Give your agent a PRD. Get a clear plan you can read, change, and send back to Codex or Claude Code.
            </p>
            <DemoLink />
          </div>

          <div className="workbench" aria-label="Example Workahead workflow">
            <div className="prompt-line">
              <span className="prompt-symbol" aria-hidden="true">
                $
              </span>
              <code>workahead open ./docs/prd.md</code>
            </div>

            <div className="workbench-output">
              <p className="output-muted">Reading your PRD and repository context...</p>
              <p>
                <span className="output-check">✓</span> 7 parts found
              </p>
              <p>
                <span className="output-check">✓</span> 41 stories turned into 12 tickets
              </p>
              <p>
                <span className="output-check">✓</span> 3 choices need your answer
              </p>
            </div>

            <div className="work-units">
              <div>
                <span>WA-01</span>
              <p>Find the right repository context</p>
                <small>7 stories · 2 tickets</small>
              </div>
              <div>
                <span>WA-02</span>
              <p>Review the plan before it runs</p>
              <small>1 choice · 3 tickets</small>
              </div>
              <div>
                <span>WA-03</span>
              <p>Track every change as it happens</p>
              <small>now working: ticket 2</small>
              </div>
            </div>

            <p className="workbench-foot">
              You stay in control. Your agents do the work.
            </p>
          </div>
        </div>
      </section>

      <section id="workflow" className="workflow-section" aria-labelledby="workflow-title">
        <div className="workflow-heading">
          <p>How Workahead works</p>
          <h2 id="workflow-title">Three steps. No context dump.</h2>
        </div>

        <ol className="workflow-steps">
          <li>
            <code>01 / find</code>
            <h3>Find what matters</h3>
            <p>Workahead reads the repository, old docs, and your PRD. You see the parts that matter for this feature.</p>
          </li>
          <li>
            <code>02 / review</code>
            <h3>See the plan</h3>
            <p>Your long Markdown file becomes a clear page. Click a feature to see its stories, files, decisions, and tickets.</p>
          </li>
          <li>
            <code>03 / run</code>
            <h3>Send it to your agent</h3>
            <p>Leave a note on any part of the plan. See what it changes. Then let Codex or Claude Code run the tickets.</p>
          </li>
        </ol>
      </section>

      <section className="product-surfaces-section" aria-labelledby="surfaces-title">
        <div className="surfaces-heading">
          <p className="example-label">How Workahead works</p>
          <h2 id="surfaces-title">Four views. One clear run.</h2>
          <p>
            Start with the messy PRD. End with a run you understand. Each view answers one simple
            question before your agent moves on.
          </p>
        </div>

        <div className="product-surfaces-grid">
          <article className="product-surface product-surface-wide">
            <div className="surface-caption">
              <span>01 / synthesis</span>
              <strong>Turn the PRD into a plan</strong>
            </div>
            <div className="surface-window synthesis-window">
              <div className="surface-window-bar">
                <span className="surface-window-path">workahead / todo-app / overview</span>
                <span className="surface-status">ready for review</span>
              </div>
              <div className="synthesis-body">
                <div className="synthesis-summary">
                  <span className="surface-label">What are we building?</span>
                  <h3>Make a task system people can trust.</h3>
                  <p>Capture tasks, keep the next action clear, and recover when work gets noisy.</p>
                  <div className="surface-meta-row">
                    <span>41 stories</span>
                    <span>7 decisions</span>
                    <span>12 work units</span>
                  </div>
                </div>
                <div className="synthesis-index">
                  <button type="button" className="surface-index-row is-selected">
                    <span>01</span><strong>Capture and organize</strong><em>8</em>
                  </button>
                  <button type="button" className="surface-index-row">
                    <span>02</span><strong>Reminders and attention</strong><em>6</em>
                  </button>
                  <button type="button" className="surface-index-row">
                    <span>03</span><strong>Offline recovery</strong><em>5</em>
                  </button>
                  <button type="button" className="surface-index-row">
                    <span>04</span><strong>Delivery and proof</strong><em>4</em>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="product-surface">
            <div className="surface-caption">
              <span>02 / drill down</span>
              <strong>Open any part of the plan</strong>
            </div>
            <div className="surface-window drill-window">
              <div className="surface-window-bar">
                <span className="surface-window-path">overview / offline recovery</span>
                <span className="surface-back">← overview</span>
              </div>
              <div className="drill-content">
                <span className="surface-label">Feature / 03</span>
                <h3>Offline edits should not disappear.</h3>
                <p>When a task changes without a connection, save it now and sort out the sync later.</p>
                <div className="drill-links">
                  <div><span>needs</span><strong>Task identity</strong></div>
                  <div><span>creates</span><strong>WA-07 · sync boundary</strong></div>
                  <div><span>uses</span><strong>currentarchitecture.md</strong></div>
                </div>
              </div>
              <div className="surface-source">source · prd.md#offline-recovery</div>
            </div>
          </article>

          <article className="product-surface">
            <div className="surface-caption">
              <span>03 / steer</span>
              <strong>Change the plan without losing the links</strong>
            </div>
            <div className="surface-window queue-window">
              <div className="surface-window-bar">
                <span className="surface-window-path">WA-07 / sync boundary</span>
                <span className="queue-count">2 queued</span>
              </div>
              <div className="queue-content">
                <div className="queue-block">
                  <span className="surface-label">Your note</span>
                  <p>Do not add a background sync service yet. Keep the adapter, but sync when the app opens.</p>
                  <div className="queue-author"><span className="surface-avatar">SL</span> Sarthak · just now</div>
                </div>
                <div className="queue-impact">
                  <span className="surface-label">This changes</span>
                  <div><span>↳</span> WA-07 · sync boundary</div>
                  <div><span>↳</span> WA-11 · app boot recovery</div>
                  <button type="button">Send to agent ↗</button>
                </div>
              </div>
            </div>
          </article>

          <article className="product-surface product-surface-wide">
            <div className="surface-caption">
              <span>04 / execution</span>
              <strong>Watch the work and check the proof</strong>
            </div>
            <div className="surface-window execution-window">
              <div className="surface-window-bar">
                <span className="surface-window-path">execution / current run</span>
                <span className="execution-live"><i /> agent working</span>
              </div>
              <div className="execution-grid">
                <div className="execution-tickets">
                  <div className="execution-ticket is-done"><span>✓</span><strong>WA-01</strong><p>Define task identity</p><em>done</em></div>
                  <div className="execution-ticket is-active"><span>→</span><strong>WA-07</strong><p>Build the sync boundary</p><em>working</em></div>
                  <div className="execution-ticket"><span>○</span><strong>WA-11</strong><p>Recover when the app opens</p><em>waiting for WA-07</em></div>
                </div>
                <div className="execution-proof">
                  <span className="surface-label">What happened?</span>
                  <h3>12 tests passing</h3>
                  <p>The adapter stayed intact. The ticket includes the changed files and a screenshot of the result.</p>
                  <div className="proof-files"><code>src/sync/adapter.ts</code><code>tests/sync.test.ts</code></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="example-section example-section-copy-only" aria-labelledby="example-title">
        <div className="example-copy">
          <p className="example-label">The thing you get</p>
          <h2 id="example-title">Know what your agent will touch before it starts.</h2>
          <p className="example-intro">
            Give Codex or Claude Code a long PRD and a slash goal. Workahead shows you the plan first,
            then keeps a clear record of what changed, what passed, and what needs your attention.
          </p>

          <div className="example-groups">
            <div>
              <code>source/</code>
              <p>Keep your original PRD and repository context intact.</p>
            </div>
            <div>
              <code>semantic/</code>
              <p>See the whole plan, then open only the feature or decision you need.</p>
            </div>
            <div>
              <code>proof/</code>
              <p>See changed files, screenshots, discoveries, and blockers without reading every transcript.</p>
            </div>
          </div>
        </div>

      </section>

      <section className="ask-section" aria-labelledby="ask-title">
        <div>
          <p>Private design partner access</p>
          <h2 id="ask-title">Know what your agent is doing.</h2>
        </div>
        <div className="ask-copy">
          <p>
            Bring the next feature you plan to build. See the plan before you press
            the button that starts the run.
          </p>
          <AccessLink className="access-link access-link-light" />
        </div>
      </section>

      <footer>
        <a className="wordmark" href="#top" aria-label="Workahead home">
          <span className="wordmark-mark" aria-hidden="true">
            W/
          </span>
          <span>workahead</span>
        </a>
        <div className="footer-links">
          <a href={X_URL} target="_blank" rel="noreferrer">
            x.com/sarthaklangde
          </a>
          <a href="mailto:hello@sarthaklangde.com">hello@sarthaklangde.com</a>
        </div>
      </footer>
    </main>
  );
}
