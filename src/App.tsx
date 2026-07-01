import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Zap, Scale, Smartphone } from 'lucide-react';
import QuickAddDemo, { type MockTx } from './QuickAddDemo';
import { formatCurrency } from './mockData';

type View = 'desktop' | 'mobile';

/** Lightweight CSS-only scroll reveal — IntersectionObserver toggles a class once. */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal${shown ? ' reveal-visible' : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

function Feature({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-body">{body}</p>
    </div>
  );
}

/** Shared entries list — rendered inside both the desktop window and mobile frame. */
function TxList({ txs }: { txs: MockTx[] }) {
  return (
    <>
      <div className="demo-list-head">
        <span className="demo-list-title">Entries this session</span>
        <span className="demo-list-count">{txs.length}</span>
      </div>

      {txs.length === 0 ? (
        <div className="demo-empty">
          No entries yet. Hit the <strong>✎</strong> button to add one.
        </div>
      ) : (
        <ul className="demo-list">
          {txs.map(tx => (
            <li key={tx.id} className="demo-row">
              <div className="demo-row-main">
                <span className="demo-row-desc">{tx.description}</span>
                <span className="demo-row-sub">
                  {tx.date}
                  {tx.payee ? ` · ${tx.payee}` : ''}
                  {tx.category ? ` · ${tx.category}` : ''}
                  {` · Dr ${tx.drName} / Cr ${tx.crName}`}
                </span>
              </div>
              <span className="demo-row-amt">{formatCurrency(tx.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Mock bottom nav — only shown in the mobile frame, so the raised FAB reads right. */
function MockBottomNav() {
  const items: [string, string][] = [
    ['🏠', 'Home'], ['📓', 'Entries'], ['⚖️', 'Accounts'], ['📈', 'Invest'], ['⚙️', 'Settings'],
  ];
  return (
    <nav className="mobile-nav" aria-hidden="true">
      {items.map(([icon, label]) => (
        <div className="mobile-nav-item" key={label}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
      ))}
    </nav>
  );
}

export default function App() {
  const [txs, setTxs] = useState<MockTx[]>([]);
  const [view, setView] = useState<View>('desktop');
  const add = (tx: MockTx) => setTxs(prev => [tx, ...prev]);

  return (
    <div className="showcase">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <Reveal>
          <span className="hero-eyebrow">Quick Add</span>
          <h1 className="hero-title">Add an expense at the<br /> speed of thought.</h1>
          <p className="hero-sub">
            This app doesn’t ask for your bank login or sync anything through a third
            party. Every transaction is typed by you, on your own ledger — nothing ever
            leaves your database. Quick Add exists so that keeping your data private
            doesn’t mean giving up speed.
          </p>
        </Reveal>
      </section>

      {/* ── Feature highlights ───────────────────────────────────────────── */}
      <section className="features">
        <Reveal>
          <p className="features-intro">
            Most finance apps make you stop and fill out a form for every transaction.
            Quick Add turns your most common transactions into a single tap — built on a
            real double-entry accounting engine underneath, so speed never costs accuracy.
          </p>
        </Reveal>
        <div className="features-grid">
          <Reveal delay={0}>
            <Feature
              icon={<Zap size={22} aria-hidden="true" />}
              title="One-tap logging"
              body="Save your most frequent transactions as shortcuts. No dropdowns, no re-typing the same entry twice."
            />
          </Reveal>
          <Reveal delay={90}>
            <Feature
              icon={<Scale size={22} aria-hidden="true" />}
              title="Real accounting underneath"
              body="Every quick add still posts a fully balanced journal entry — not a toy tracker with a shortcut bolted on."
            />
          </Reveal>
          <Reveal delay={180}>
            <Feature
              icon={<Smartphone size={22} aria-hidden="true" />}
              title="Same flow, every device"
              body="Identical logic on desktop and mobile, tuned for how you actually reach for your phone."
            />
          </Reveal>
        </div>
      </section>

      {/* ── Interactive "try it" ─────────────────────────────────────────── */}
      <section className="tryit">
        <Reveal>
          <h2 className="tryit-title">Try it yourself</h2>
          <p className="tryit-note">Nothing you do here is saved or sent anywhere.</p>
        </Reveal>

        <Reveal delay={90}>
          <div className="view-toggle" role="tablist" aria-label="Preview device">
            {(['desktop', 'mobile'] as View[]).map(v => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                className={`view-toggle-btn${view === v ? ' active' : ''}`}
                onClick={() => setView(v)}
              >
                {v === 'desktop' ? '🖥️ Desktop' : '📱 Mobile'}
              </button>
            ))}
          </div>

          {/* Staging area — the demo is framed like a product shot, not left loose. */}
          <div className="stage">
            {view === 'desktop' ? (
              <div className="desktop-window">
                <div className="desktop-titlebar">
                  <span className="desktop-dot" style={{ background: '#ff5f57' }} />
                  <span className="desktop-dot" style={{ background: '#febc2e' }} />
                  <span className="desktop-dot" style={{ background: '#28c840' }} />
                  <span className="desktop-titlebar-label">Quick Add</span>
                </div>
                <div className="desktop-screen-body">
                  <TxList txs={txs} />
                </div>
                <QuickAddDemo onAdd={add} />
              </div>
            ) : (
              <div className="mobile-frame">
                <div className="mobile-statusbar">9:41</div>
                <div className="mobile-topbar">Quick Add</div>
                <div className="mobile-scroll">
                  <TxList txs={txs} />
                </div>
                <MockBottomNav />
                <QuickAddDemo onAdd={add} />
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <span>An isolated feature showcase, extracted from a larger project.</span>
        <a href="https://github.com/jonathanlu419-a11y/finance-portfolio-manager"
          target="_blank" rel="noreferrer">
          finance-portfolio-manager →
        </a>
      </footer>
    </div>
  );
}
