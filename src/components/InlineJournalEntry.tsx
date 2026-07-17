import { useState } from 'react';
import { Plus, X, RotateCcw } from 'lucide-react';
import { ACCOUNTS, CATEGORIES, accountById, acctShort, todayISO, formatCurrency } from '../mockData';

/**
 * InlineJournalEntry — a self-contained, CAD-only multi-line journal-entry form
 * embedded directly on the "How it works" page. Visitors edit the lines and watch
 * the debits/credits balance live; "Save Entry" (enabled only when the entry is
 * balanced and valid) renders a saved-entry card below.
 *
 * 100% client-side mock state — nothing is persisted or sent anywhere, and it is
 * fully resettable (Start over). Deliberately does NOT reproduce the private app's
 * multi-currency machinery (exchange rate / accounted amount): this demo is CAD-only,
 * so a debit and a credit line simply have to agree. Reuses the shared form/table/
 * theme classes rather than inventing new structure.
 */

type Side = 'debit' | 'credit';

interface Line {
  key: number;
  accountId: number | null;
  side: Side;
  amount: string;
}

interface SavedEntry {
  date: string;
  description: string;
  category: string;
  payee: string;
  notes: string;
  lines: { account: string; side: Side; amount: number }[];
  total: number;
}

const cents = (n: number) => Math.round(n * 100);
const parseAmt = (s: string) => {
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

let nextLineKey = 1;
const seedLines = (): Line[] => [
  { key: nextLineKey++, accountId: 12, side: 'debit', amount: '50.00' },  // Groceries
  { key: nextLineKey++, accountId: 3, side: 'credit', amount: '50.00' },  // Credit Card
];

const seedHeader = () => ({
  date: todayISO(),
  description: 'Weekly groceries',
  category: 'Groceries',
  payee: 'Loblaws',
  notes: '',
});

export default function InlineJournalEntry() {
  const [header, setHeader] = useState(seedHeader);
  const [lines, setLines] = useState<Line[]>(seedLines);
  const [saved, setSaved] = useState<SavedEntry | null>(null);

  const setField = (k: keyof ReturnType<typeof seedHeader>, v: string) =>
    setHeader(h => ({ ...h, [k]: v }));

  const patchLine = (key: number, patch: Partial<Line>) =>
    setLines(ls => ls.map(l => (l.key === key ? { ...l, ...patch } : l)));

  const addLine = () =>
    setLines(ls => [...ls, { key: nextLineKey++, accountId: null, side: 'debit', amount: '' }]);

  const removeLine = (key: number) =>
    setLines(ls => (ls.length > 2 ? ls.filter(l => l.key !== key) : ls));

  const totalDebits = lines.filter(l => l.side === 'debit').reduce((s, l) => s + parseAmt(l.amount), 0);
  const totalCredits = lines.filter(l => l.side === 'credit').reduce((s, l) => s + parseAmt(l.amount), 0);
  const variance = totalDebits - totalCredits;

  const everyLineComplete = lines.every(l => l.accountId != null && parseAmt(l.amount) > 0);
  const hasBothSides =
    lines.some(l => l.side === 'debit' && parseAmt(l.amount) > 0) &&
    lines.some(l => l.side === 'credit' && parseAmt(l.amount) > 0);
  const balanced = everyLineComplete && hasBothSides && totalDebits > 0 && cents(variance) === 0;
  const canSave = balanced && header.description.trim() !== '';

  function save() {
    if (!canSave) return;
    setSaved({
      date: header.date,
      description: header.description.trim(),
      category: header.category,
      payee: header.payee.trim(),
      notes: header.notes.trim(),
      lines: lines.map(l => ({
        account: acctShort(accountById(l.accountId)),
        side: l.side,
        amount: parseAmt(l.amount),
      })),
      total: totalDebits,
    });
  }

  function reset() {
    nextLineKey = 1;
    setHeader(seedHeader());
    setLines(seedLines());
    setSaved(null);
  }

  return (
    <div className="ije">
      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div className="ije-card">
        <div className="ije-card-head">
          <span className="ije-card-title">New journal entry</span>
          <span className="ije-card-hint">CAD · mock data, nothing is saved</span>
        </div>

        <div className="ije-body">
          {/* Header fields */}
          <div className="ije-header-grid">
            <div className="form-group ije-col-span">
              <label className="form-label" htmlFor="ije-desc">Description *</label>
              <input id="ije-desc" type="text" className="form-control" placeholder="What was this for?"
                value={header.description} onChange={e => setField('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ije-date">Date</label>
              <input id="ije-date" type="date" className="form-control"
                value={header.date} onChange={e => setField('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ije-cat">Category</label>
              <select id="ije-cat" className="form-control"
                value={header.category} onChange={e => setField('category', e.target.value)}>
                <option value="">— None —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ije-payee">Payee</label>
              <input id="ije-payee" type="text" className="form-control" placeholder="(optional)"
                value={header.payee} onChange={e => setField('payee', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ije-notes">Notes</label>
              <input id="ije-notes" type="text" className="form-control" placeholder="(optional)"
                value={header.notes} onChange={e => setField('notes', e.target.value)} />
            </div>
          </div>

          {/* Lines */}
          <div className="ije-lines">
            <div className="ije-lines-head">
              <span>Account</span>
              <span>Dr / Cr</span>
              <span className="ije-amt-head">Amount</span>
              <span aria-hidden="true" />
            </div>

            {lines.map(l => (
              <div className="ije-line" key={l.key}>
                <div className="ije-cell-acct">
                  <label className="ije-sr-only" htmlFor={`ije-acct-${l.key}`}>Account</label>
                  <select id={`ije-acct-${l.key}`} className="form-control"
                    value={l.accountId ?? ''}
                    onChange={e => patchLine(l.key, { accountId: e.target.value ? Number(e.target.value) : null })}>
                    <option value="">— Select account —</option>
                    {ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>

                <div className="ije-cell-side">
                  <div className="ije-dc" role="group" aria-label="Debit or credit">
                    <button type="button"
                      className={`ije-dc-btn${l.side === 'debit' ? ' active-dr' : ''}`}
                      aria-pressed={l.side === 'debit'}
                      onClick={() => patchLine(l.key, { side: 'debit' })}>Dr</button>
                    <button type="button"
                      className={`ije-dc-btn${l.side === 'credit' ? ' active-cr' : ''}`}
                      aria-pressed={l.side === 'credit'}
                      onClick={() => patchLine(l.key, { side: 'credit' })}>Cr</button>
                  </div>
                </div>

                <div className="ije-cell-amt">
                  <label className="ije-sr-only" htmlFor={`ije-amt-${l.key}`}>Amount (CAD)</label>
                  <input id={`ije-amt-${l.key}`} type="number" inputMode="decimal" min="0.01" step="0.01"
                    className="form-control ije-amt-input" placeholder="0.00"
                    value={l.amount} onChange={e => patchLine(l.key, { amount: e.target.value })} />
                </div>

                <div className="ije-cell-rm">
                  <button type="button" className="ije-rm-btn" aria-label="Remove line"
                    onClick={() => removeLine(l.key)} disabled={lines.length <= 2}>
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-secondary btn-sm ije-add" onClick={addLine}>
              <Plus size={14} aria-hidden="true" /> Add line
            </button>
          </div>

          {/* Live balance footer */}
          <div className="ije-foot">
            <div className="ije-totals">
              <span>Debits <strong>{formatCurrency(totalDebits)}</strong></span>
              <span>Credits <strong>{formatCurrency(totalCredits)}</strong></span>
              <span>Variance <strong>{formatCurrency(Math.abs(variance))}</strong></span>
            </div>
            <span className={`ije-balance-pill${balanced ? ' is-balanced' : ''}`}>
              {balanced ? '✓ Balanced' : '✕ Not balanced'}
            </span>
          </div>

          {/* Actions */}
          <div className="ije-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              <RotateCcw size={14} aria-hidden="true" /> Start over
            </button>
            <button type="button" className="btn btn-primary" onClick={save} disabled={!canSave}>
              Save Entry
            </button>
          </div>
        </div>
      </div>

      {/* ── Saved-entry card (mirrors the worked-example ledger styling) ───── */}
      {saved && (
        <div className="je-card ije-saved" role="status" aria-live="polite">
          <div className="je-card-head">
            <span className="je-card-eyebrow">Saved entry</span>
            <p className="je-card-txn">{saved.description}</p>
            <p className="ije-saved-meta">
              {saved.date}
              {saved.category ? ` · ${saved.category}` : ''}
              {saved.payee ? ` · ${saved.payee}` : ''}
              {saved.notes ? ` · ${saved.notes}` : ''}
            </p>
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
              {saved.lines.map((l, i) => (
                <tr key={i}>
                  <td><span className="je-acct">{l.account}</span></td>
                  <td className={`je-amt${l.side === 'debit' ? '' : ' je-amt--empty'}`}>
                    {l.side === 'debit' ? formatCurrency(l.amount) : '—'}
                  </td>
                  <td className={`je-amt${l.side === 'credit' ? '' : ' je-amt--empty'}`}>
                    {l.side === 'credit' ? formatCurrency(l.amount) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="je-foot">
            <span>Debits {formatCurrency(saved.total)} &nbsp;=&nbsp; Credits {formatCurrency(saved.total)}</span>
            <span className="je-foot-ok">✓ Balanced</span>
          </div>
        </div>
      )}
    </div>
  );
}
