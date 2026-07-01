import { useState } from 'react';
import QuickAddDemo, { type MockTx } from './QuickAddDemo';
import { formatCurrency } from './mockData';

export default function App() {
  const [txs, setTxs] = useState<MockTx[]>([]);

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

      <main className="demo-main">
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
      </main>

      <QuickAddDemo onAdd={tx => setTxs(prev => [tx, ...prev])} />
    </div>
  );
}
