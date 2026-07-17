import { Link } from 'react-router-dom';
import { Zap, Sparkles, FileSpreadsheet, ArrowRight, type LucideIcon } from 'lucide-react';
import Reveal from '../components/Reveal';
import InlineJournalEntry from '../components/InlineJournalEntry';

/**
 * Explainer page ("/how-it-works"). Where HomePage sells the *payoff* of
 * double-entry (mistakes can't hide), this page shows the *mechanism*: what a
 * journal entry actually is, one worked example split into its debit/credit
 * lines, and the app features that make entering them painless. Static and
 * explanatory — the interactive demo lives on Quick Add, which the closing CTA
 * links to.
 */

type Feature = { icon: LucideIcon; title: string; body: string; comingSoon?: boolean };

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: 'Quick Add shortcuts',
    body: 'A floating + button turns your most common transactions into a single tap — each one still posts a fully balanced entry, no form required.',
  },
  {
    icon: Sparkles,
    title: 'Smart description autofill',
    body: 'Start typing a description and past entries suggest the accounts for you, so a recurring transaction is entered in seconds.',
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV bulk import',
    body: 'Turn a bank or brokerage export into balanced journal entries in one pass — no row-by-row retyping.',
    comingSoon: true,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* ── Header: what double-entry is ─────────────────────────────────── */}
      <section className="hero">
        <Reveal>
          <span className="hero-eyebrow">How it works</span>
          <h1 className="hero-title">Every entry,<br /> two sides.</h1>
          <p className="hero-sub">
            Double-entry accounting records each transaction in two places at once: one
            account receives the value (a <strong>debit</strong>) and another gives it up
            (a <strong>credit</strong>). The two sides must always be equal — and that
            simple rule is what keeps every balance honest.
          </p>
        </Reveal>
      </section>

      {/* ── Worked example ───────────────────────────────────────────────── */}
      <section className="home-section">
        <Reveal>
          <h2 className="home-h2">One transaction, written out</h2>
          <p className="home-section-sub">
            Say you paid $50 for groceries with your credit card. Here is the exact journal
            entry the app records.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <div className="je-card">
            <div className="je-card-head">
              <span className="je-card-eyebrow">Journal entry</span>
              <p className="je-card-txn">Paid $50 for groceries with credit card</p>
            </div>

            <table className="je-table">
              <thead>
                <tr>
                  <th scope="col">Account</th>
                  <th scope="col" className="je-amt">Debit</th>
                  <th scope="col" className="je-amt">Credit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="je-acct">Groceries</span>
                    <span className="je-nature">Expense</span>
                  </td>
                  <td className="je-amt">$50.00</td>
                  <td className="je-amt je-amt--empty">—</td>
                </tr>
                <tr>
                  <td>
                    <span className="je-acct">Credit Card</span>
                    <span className="je-nature">Liability</span>
                  </td>
                  <td className="je-amt je-amt--empty">—</td>
                  <td className="je-amt">$50.00</td>
                </tr>
              </tbody>
            </table>

            <div className="je-foot">
              <span>Debits $50.00 &nbsp;=&nbsp; Credits $50.00</span>
              <span className="je-foot-ok">✓ In balance</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="home-aside">
            Spending rose in <strong>Groceries</strong> and what you owe rose on your
            <strong> Credit Card</strong> — both recorded from the one $50 event. Because the
            two sides have to match, an entry that doesn’t balance simply can’t be saved.
          </p>
        </Reveal>
      </section>

      {/* ── Features that make it easy day-to-day ────────────────────────── */}
      <section className="home-section">
        <Reveal>
          <h2 className="home-h2">Built to make this effortless</h2>
          <p className="home-section-sub">
            You never have to think in debits and credits — the app handles the balancing.
            A few features keep day-to-day entry fast:
          </p>
        </Reveal>

        <Reveal delay={90}>
          <ul className="hiw-features">
            {FEATURES.map(({ icon: Icon, title, body, comingSoon }) => (
              <li className="hiw-feature" key={title}>
                <span className="hiw-feature-icon"><Icon size={19} aria-hidden="true" /></span>
                <div className="hiw-feature-text">
                  <h3>
                    {title}
                    {comingSoon && <span className="coming-soon-tag">Coming soon</span>}
                  </h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── Try it inline: embedded journal-entry form ───────────────────── */}
      <section className="home-section">
        <Reveal>
          <h2 className="home-h2">See a balanced entry appear</h2>
          <p className="home-section-sub">
            Edit the entry below — the moment your debits equal your credits, it balances and
            you can save it. Nothing is saved or sent anywhere; it’s a local simulation on mock data.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <InlineJournalEntry />
        </Reveal>

        <Reveal delay={120}>
          <p className="hiw-secondary-cta">
            Prefer the one-tap flow?{' '}
            <Link to="/quick-add">
              Open the full Quick Add demo <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </p>
        </Reveal>
      </section>
    </>
  );
}
