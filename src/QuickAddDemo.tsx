/**
 * QuickAddDemo — a standalone, visually-faithful reimplementation of the main
 * app's "Quick Add" shortcut wizard. Local state + mock data only; "Confirm"
 * appends to an in-memory list via the onAdd prop. No network, no persistence.
 *
 * Flow (mirrors the real component):
 *   choice  → shortcut grid
 *   payee   → payee chips / free text / skip   (skipped for transfers)
 *   amount  → funding-account chips + large amount input + date pill
 *   preview → tappable summary card + inline description/category → Confirm
 *   success → confirmation, then "Add another" / "Done"
 */
import { useState, type CSSProperties } from 'react';
import { NotebookPen, Check } from 'lucide-react';
import Modal from './Modal';
import {
  SHORTCUTS, CATEGORIES, PAYEES, acctShort, legAccount, todayISO, formatCurrency,
  type Shortcut,
} from './mockData';

export interface MockTx {
  id: number;
  date: string;
  description: string;
  payee: string | null;
  amount: number;
  drName: string;
  crName: string;
  category: string | null;
}

type Step = 'choice' | 'payee' | 'amount' | 'preview' | 'success';

interface Form {
  date: string;
  amount: string;
  payee: string;
  description: string;
  category: string;
  debitId: number | null;
  creditId: number | null;
}

const emptyForm = (): Form => ({
  date: todayISO(), amount: '', payee: '', description: '', category: '',
  debitId: null, creditId: null,
});

const backBtnStyle: CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--primary)', fontSize: 13, marginBottom: 16, padding: 0, display: 'block',
};

let nextTxId = 1;

export default function QuickAddDemo({ onAdd }: { onAdd: (tx: MockTx) => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('choice');
  const [sc, setSc] = useState<Shortcut | null>(null);
  const [form, setForm] = useState<Form>(emptyForm());
  const [payeeOther, setPayeeOther] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const amtNum = parseFloat(form.amount);
  const amtValid = !isNaN(amtNum) && amtNum > 0;

  const drAcct = sc ? legAccount(sc.debit, form.debitId) : null;
  const crAcct = sc ? legAccount(sc.credit, form.creditId) : null;

  function openFab() {
    setForm(emptyForm()); setErrors({}); setPayeeOther(false); setDatePickerOpen(false);
    setSc(null); setStep('choice'); setOpen(true);
  }
  function closeAll() {
    setOpen(false); setStep('choice'); setSc(null); setErrors({});
    setPayeeOther(false); setDatePickerOpen(false);
  }

  function chooseShortcut(shortcut: Shortcut) {
    const f = emptyForm();
    if (shortcut.debit.kind === 'chips') f.debitId = shortcut.debit.accounts[0]?.id ?? null;
    if (shortcut.credit.kind === 'chips') f.creditId = shortcut.credit.accounts[0]?.id ?? null;
    setForm(f);
    setSc(shortcut);
    setPayeeOther(false);
    setErrors({});
    setStep(shortcut.hasPayee ? 'payee' : 'amount');
  }

  function handleConfirm() {
    if (!sc || !drAcct || !crAcct) return;
    const errs: Record<string, string> = {};
    if (!amtValid) errs.amount = 'Enter a valid amount greater than 0';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onAdd({
      id: nextTxId++,
      date: form.date,
      description: form.description.trim(),
      payee: sc.hasPayee ? (form.payee.trim() || null) : null,
      amount: amtNum,
      drName: acctShort(drAcct),
      crName: acctShort(crAcct),
      category: form.category || null,
    });
    setStep('success');
  }

  // ── Chip legs shown on the amount page (a leg with kind 'chips') ────────────
  const chipLegs = sc
    ? ([
        sc.debit.kind === 'chips' ? { side: 'debit' as const, leg: sc.debit } : null,
        sc.credit.kind === 'chips' ? { side: 'credit' as const, leg: sc.credit } : null,
      ].filter(Boolean) as { side: 'debit' | 'credit'; leg: Extract<Shortcut['debit'], { kind: 'chips' }> }[])
    : [];

  const title = sc ? `${sc.icon} ${sc.name}` : 'Quick Add';

  return (
    <>
      {!open && (
        <button className="quick-add-fab" onClick={openFab} aria-label="Quick add transaction">
          <NotebookPen size={26} aria-hidden="true" />
        </button>
      )}

      {/* ── Page 1: choice ─────────────────────────────────────────────────── */}
      <Modal open={open && step === 'choice'} onClose={closeAll} title="Quick Add">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SHORTCUTS.map(s => (
            <button key={s.id} className={`fab-choice-btn fab-choice-${s.slug}`} onClick={() => chooseShortcut(s)}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
          Demo · CAD only · mock data, nothing is saved
        </div>
      </Modal>

      {/* ── Page 2: payee ──────────────────────────────────────────────────── */}
      <Modal open={open && step === 'payee'} onClose={closeAll} title={title}>
        <button style={backBtnStyle} onClick={() => setStep('choice')}>← Back</button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>
            Payee <span style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-3)' }}>(optional)</span>
          </div>

          {!payeeOther ? (
            <div className="qaf-payee-chips">
              {PAYEES.map(p => (
                <button key={p} type="button"
                  className={`qaf-payee-chip${form.payee === p ? ' active' : ''}`}
                  onClick={() => { setForm(f => ({ ...f, payee: p })); setStep('amount'); }}>
                  {p}
                </button>
              ))}
              <button type="button" className="qaf-payee-chip" onClick={() => setPayeeOther(true)}>✏️ Other</button>
            </div>
          ) : (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input type="text" autoFocus className="form-control" placeholder="Enter payee…"
                value={form.payee} onChange={e => setForm(f => ({ ...f, payee: e.target.value }))} />
              <button type="button" onClick={() => setPayeeOther(false)}
                style={{ marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 12, padding: 0 }}>
                ← Show suggestions
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {payeeOther && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep('amount')}>Continue →</button>
            )}
            <button type="button"
              style={{ flex: payeeOther ? '0 0 auto' : 1, padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14 }}
              onClick={() => { setForm(f => ({ ...f, payee: '' })); setStep('amount'); }}>
              Skip
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Page 3: amount ─────────────────────────────────────────────────── */}
      <Modal open={open && step === 'amount'} onClose={closeAll} title={title}>
        <button style={backBtnStyle} onClick={() => setStep(sc?.hasPayee ? 'payee' : 'choice')}>← Back</button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {chipLegs.map(({ side, leg }) => (
            <div key={side}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6 }}>{leg.label}</div>
              <div className="qaf-acct-chips">
                {leg.accounts.map(a => {
                  const picked = side === 'debit' ? form.debitId : form.creditId;
                  return (
                    <button key={a.id} type="button"
                      className={`qaf-acct-chip${picked === a.id ? ' active' : ''}`}
                      onClick={() => setForm(f => (side === 'debit' ? { ...f, debitId: a.id } : { ...f, creditId: a.id }))}>
                      {acctShort(a)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Amount (CAD) *</label>
            <input type="number" inputMode="decimal" autoFocus className="form-control"
              style={{ fontSize: 28, fontWeight: 700, textAlign: 'right', padding: '14px 16px' }}
              min="0.01" step="0.01" placeholder="0.00"
              value={form.amount}
              onChange={e => { setErrors(er => ({ ...er, amount: '' })); setForm(f => ({ ...f, amount: e.target.value })); }} />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>

          <div>
            {datePickerOpen ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input type="date" autoFocus className="form-control" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  onBlur={() => setDatePickerOpen(false)} />
              </div>
            ) : (
              <button type="button" className="qaf-date-pill" onClick={() => setDatePickerOpen(true)}>
                📅 {form.date}
              </button>
            )}
          </div>

          <button className="btn btn-primary" disabled={!amtValid}
            onClick={() => { setErrors({}); setStep('preview'); }}>
            Review →
          </button>
        </div>
      </Modal>

      {/* ── Page 4: preview ────────────────────────────────────────────────── */}
      <Modal open={open && step === 'preview'} onClose={closeAll} title={title}>
        <button style={backBtnStyle} onClick={() => setStep('amount')}>← Back</button>
        <div className="qaf-preview-card">
          <button type="button" className="qaf-preview-row"
            onClick={() => { setDatePickerOpen(true); setStep('amount'); }}>
            <span className="qaf-preview-label">Date</span>
            <span className="qaf-preview-value">{form.date}</span>
            <span className="qaf-preview-caret">›</span>
          </button>

          <div className="qaf-preview-row qaf-preview-row--static">
            <span className="qaf-preview-label">Entry</span>
            <span className="qaf-preview-value" style={{ fontSize: 12 }}>
              Dr <strong>{acctShort(drAcct)}</strong>
              <span style={{ color: 'var(--text-3)', margin: '0 4px' }}>·</span>
              Cr <strong>{acctShort(crAcct)}</strong>
            </span>
          </div>

          <button type="button" className="qaf-preview-row"
            onClick={() => { setDatePickerOpen(false); setStep('amount'); }}>
            <span className="qaf-preview-label">Amount</span>
            <span className="qaf-preview-value" style={{ fontWeight: 700 }}>
              {amtValid ? formatCurrency(amtNum) : <span style={{ color: 'var(--danger)' }}>Enter amount</span>}
            </span>
            <span className="qaf-preview-caret">›</span>
          </button>

          {sc?.hasPayee && (
            <button type="button" className="qaf-preview-row" onClick={() => setStep('payee')}>
              <span className="qaf-preview-label">Payee</span>
              <span className="qaf-preview-value">
                {form.payee || <span style={{ color: 'var(--text-3)' }}>—</span>}
              </span>
              <span className="qaf-preview-caret">›</span>
            </button>
          )}

          <div className="qaf-preview-row qaf-preview-row--static qaf-preview-row--col">
            <span className="qaf-preview-label">Description *</span>
            <input type="text" className="form-control" style={{ fontSize: 13, marginTop: 4 }}
              placeholder="What was this for?"
              value={form.description}
              onChange={e => { setErrors(er => ({ ...er, description: '' })); setForm(f => ({ ...f, description: e.target.value })); }} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="qaf-preview-row qaf-preview-row--static qaf-preview-row--col">
            <span className="qaf-preview-label">Category</span>
            <select className="form-control" style={{ fontSize: 13, marginTop: 4 }}
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">— None —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={closeAll}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={!amtValid || !form.description.trim()}>
            Confirm
          </button>
        </div>
      </Modal>

      {/* ── Page 5: success ────────────────────────────────────────────────── */}
      <Modal open={open && step === 'success'} onClose={closeAll} title={title}>
        <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 14px',
            background: 'var(--success-light)', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={30} aria-hidden="true" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Entry added</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            {form.description.trim()} · {amtValid ? formatCurrency(amtNum) : ''}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={openFab}>Add another</button>
            <button className="btn btn-primary" onClick={closeAll}>Done</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
