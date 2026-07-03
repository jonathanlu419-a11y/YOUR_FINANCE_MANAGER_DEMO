import { Link } from 'react-router-dom';
import { List, Scale, ShieldCheck, Zap, FileSpreadsheet, ArrowRight, type LucideIcon } from 'lucide-react';
import Reveal from '../components/Reveal';

/**
 * Site front door ("/"). Its ONE job is to land the core differentiator before
 * the visitor touches a feature demo: this app tracks real account balances, not
 * just a list of categorized expenses — so a forgotten or mis-entered transaction
 * makes the numbers stop matching, and you catch it. No privacy/sync messaging
 * here (that belongs to Quick Add); this page is purely the balance/error-catch
 * claim. Explains, doesn't demo — the interactive demos live on the feature pages.
 */

function Point({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="feature">
      <div className="feature-icon"><Icon size={22} aria-hidden="true" /></div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-body">{body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <Reveal>
          <span className="hero-eyebrow">The difference</span>
          <h1 className="hero-title">Forget to log something?<br /> Your balance will catch it.</h1>
          <p className="hero-sub">
            Most budget apps only know what you type in. This one also tracks the real
            balance of every account you own — so the moment you forget an expense or fat-finger
            an amount, the numbers stop matching and you know something’s missing.
          </p>
        </Reveal>
      </section>

      {/* ── The differentiator ───────────────────────────────────────────── */}
      <section className="features">
        <Reveal>
          <p className="features-intro">
            A plain expense list can’t check itself. This one can — because every transaction
            has to land in two places at once, and those two places have to agree.
          </p>
        </Reveal>
        <div className="features-grid">
          <Reveal delay={0}>
            <Point
              icon={List}
              title="A list just trusts you"
              body="Most finance apps are a running list: you type an expense, it gets a category, done. Forget one — or enter it wrong — and the app has no way of knowing. There’s nothing for that number to be checked against."
            />
          </Reveal>
          <Reveal delay={90}>
            <Point
              icon={Scale}
              title="This app tracks balances too"
              body="Alongside your categories, it tracks the actual balance of every account — checking, credit card, cash. Every transaction updates a category and an account balance at the same time, so nothing floats free."
            />
          </Reveal>
          <Reveal delay={180}>
            <Point
              icon={ShieldCheck}
              title="So mistakes can’t hide"
              body="Now you can hold the app’s balance for an account against your real bank or card balance. If they don’t match, something was missed or mis-entered — and you find out today, not months later over a pile of receipts."
            />
          </Reveal>
        </div>
      </section>

      {/* ── Before / after (static, explanatory) ─────────────────────────── */}
      <section className="home-section">
        <Reveal>
          <h2 className="home-h2">The same forgotten dinner, two apps</h2>
          <p className="home-section-sub">
            You spent $40 on dinner and forgot to log it. Here’s what each app sees afterward.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <div className="home-compare">
            {/* Typical app — blind to the miss */}
            <div className="compare-card compare-card--muted">
              <span className="compare-label">Typical budget app</span>
              <ul className="compare-rows">
                <li className="compare-row">
                  <span>Groceries</span>
                  <span className="compare-row-amt amt-neg">−$85.00</span>
                </li>
                <li className="compare-row">
                  <span>Transit</span>
                  <span className="compare-row-amt amt-neg">−$12.50</span>
                </li>
                <li className="compare-row">
                  <span>Coffee</span>
                  <span className="compare-row-amt amt-neg">−$5.25</span>
                </li>
                <li className="compare-row compare-row--sep">
                  <span style={{ color: 'var(--text-3)' }}>Dinner</span>
                  <span className="compare-row-amt" style={{ color: 'var(--text-3)' }}>— not logged —</span>
                </li>
              </ul>
              <p className="compare-verdict">
                Everything looks fine. The list has no idea a $40 dinner is missing — there’s
                nothing for it to compare against.
              </p>
            </div>

            {/* This app — the balance disagrees */}
            <div className="compare-card compare-card--accent">
              <span className="compare-label">This app</span>
              <ul className="compare-rows">
                <li className="compare-row">
                  <span>Checking — app balance</span>
                  <span className="compare-row-amt">$2,000.00</span>
                </li>
                <li className="compare-row">
                  <span>Checking — your bank says</span>
                  <span className="compare-row-amt">$1,960.00</span>
                </li>
                <li className="compare-row compare-row--sep compare-row--flag">
                  <span>Off by</span>
                  <span className="compare-row-amt">$40.00 ⚠</span>
                </li>
              </ul>
              <p className="compare-verdict">
                The balances don’t match. Something was spent that never got logged — go find
                the missing $40 now, while you still remember it.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="home-aside">
            If you’re curious: this is the same double-entry method real accountants and
            businesses use. You never have to think about it — you just get the safety net.
          </p>
        </Reveal>
      </section>

      {/* ── Bridge to the feature showcases ──────────────────────────────── */}
      <section className="home-section">
        <Reveal>
          <h2 className="home-h2">See it in action</h2>
          <p className="home-section-sub">
            Each feature below is a live, self-contained demo you can click through.
          </p>
        </Reveal>

        <div className="home-showcases">
          <Reveal delay={0}>
            <Link className="showcase-card" to="/quick-add">
              <div className="showcase-card-icon"><Zap size={20} aria-hidden="true" /></div>
              <h3 className="showcase-card-title">Quick Add</h3>
              <p className="showcase-card-body">
                Add a transaction in one tap — a balanced entry every time, without the form.
              </p>
              <span className="showcase-card-cta">Try the demo <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          </Reveal>

          <Reveal delay={90}>
            <Link className="showcase-card" to="/csv-import">
              <div className="showcase-card-icon"><FileSpreadsheet size={20} aria-hidden="true" /></div>
              <h3 className="showcase-card-title">
                CSV Import <span className="coming-soon-tag">Coming soon</span>
              </h3>
              <p className="showcase-card-body">
                Turn a bank or brokerage export into a balanced ledger — no row-by-row retyping.
              </p>
              <span className="showcase-card-cta">See what’s coming <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
