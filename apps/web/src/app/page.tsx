import type { Metadata } from "next";
import styles from "./landing.module.css";

const GITHUB_URL = "https://github.com/sarthaklangde/workahead";

export const metadata: Metadata = {
  title: "Workahead | See the plan before agents run it",
  description:
    "Turn a PRD and repository context into a reviewable plan, connected tickets, and clear execution proof.",
};

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="W/ workahead home">
          <span aria-hidden="true">W/</span>
          <strong>workahead</strong>
        </a>

        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="/demo">Demo</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <h1 id="hero-title">Know what agents will do.</h1>
          <p>
            Workahead turns a PRD and repository context into a reviewable plan,
            connected tickets, and clear execution proof.
          </p>
          <div className={styles.actions}>
            <a className={styles.primaryAction} href="/demo">
              Open the demo <span aria-hidden="true">→</span>
            </a>
            <a
              className={styles.secondaryAction}
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <a className={styles.productFrame} href="/demo">
          <span className={styles.frameLabel}>Interactive product demo</span>
          <div className={styles.frameViewport} aria-hidden="true">
            <iframe
              src="/demo"
              title="Workahead product demo preview"
              tabIndex={-1}
              loading="eager"
            />
          </div>
        </a>
      </section>

      <section className={styles.explainer} aria-labelledby="explainer-title">
        <div className={styles.explainerIntro}>
          <h2 id="explainer-title">Your agent can do more. You should read less.</h2>
          <p>
            Workahead compresses messy product context and agent activity into the few
            decisions that need you.
          </p>
        </div>

        <div className={styles.sequence}>
          <article>
            <span>01</span>
            <h3>Understand</h3>
            <p>Turn the PRD and repository into a navigable semantic plan.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Decide</h3>
            <p>Review blockers, dependencies, files, and downstream impact.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Run</h3>
            <p>Hand approved tickets to Codex or Claude Code and keep the proof.</p>
          </article>
        </div>
      </section>

      <section className={styles.openSource} aria-labelledby="open-source-title">
        <div>
          <h2 id="open-source-title">Open source. Local first. Bring your own agent.</h2>
          <p>
            Workahead keeps the review artifact in your project and works with the tools
            you already trust.
          </p>
        </div>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="#top" aria-label="W/ back to top">
          <span aria-hidden="true">W/</span>
          <strong>workahead</strong>
        </a>
        <p>Human-scale review for agent work.</p>
      </footer>
    </main>
  );
}
