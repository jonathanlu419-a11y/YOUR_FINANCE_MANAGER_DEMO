import { useState } from 'react';
import QuickAddDemo, { type MockTx } from './QuickAddDemo';
import { formatCurrency } from './mockData';

type View = 'desktop' | 'mobile';

/** Shared entries list — rendered in both the desktop and mobile-frame previews. */
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
    <div className="demo-page">
      <header className="demo-header">
        <h1>Quick Add</h1>
        <p>
          An isolated UI/UX demo of the “Quick Add” shortcut flow from my
          finance-portfolio-manager app. Tap the button, bottom-right, to add a mock
          entry — everything lives in local state; nothing is saved or sent anywhere.
        </p>
      </header>

      {/* Desktop / Mobile preview toggle (pure layout state, no routing). */}
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

      {view === 'desktop' ? (
        <>
          <main className="demo-main">
            <TxList txs={txs} />
          </main>
          <QuickAddDemo onAdd={add} />
        </>
      ) : (
        <div className="mobile-frame-wrap">
          {/* The FAB + modal inside .mobile-frame are re-scoped to absolute (see
              index.css) so they render WITHIN the phone frame, like on a real device. */}
          <div className="mobile-frame">
            <div className="mobile-statusbar">9:41</div>
            <div className="mobile-topbar">Quick Add</div>
            <div className="mobile-scroll">
              <TxList txs={txs} />
            </div>
            <MockBottomNav />
            <QuickAddDemo onAdd={add} />
          </div>
          <span className="mobile-frame-caption">Mobile preview · ~390 px · FAB sits above the bottom nav</span>
        </div>
      )}
    </div>
  );
}
