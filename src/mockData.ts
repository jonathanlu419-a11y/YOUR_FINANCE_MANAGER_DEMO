/**
 * Hardcoded mock data for the Quick Add demo. No API, no persistence — everything
 * here is static and drives the standalone wizard UI. Mirrors the SHAPE of the real
 * app's shortcut/account model (a debit leg + a credit leg, each either a fixed
 * account or a set of choosable "funding" accounts) without any real schema.
 */

export interface Account {
  id: number;
  name: string;
  abbr: string;
}

/** One side (debit or credit) of a shortcut: either a fixed account or chips. */
export type Leg =
  | { kind: 'fixed'; account: Account }
  | { kind: 'chips'; label: string; accounts: Account[] };

export interface Shortcut {
  id: number;
  icon: string;
  name: string;
  slug: string;
  /** Transfers skip the payee step (payee is meaningless account→account). */
  hasPayee: boolean;
  debit: Leg;
  credit: Leg;
}

// ── Accounts ────────────────────────────────────────────────────────────────
const CHEQUING: Account = { id: 1, name: 'Chequing', abbr: 'CHQ' };
const SAVINGS:  Account = { id: 2, name: 'Savings', abbr: 'SAV' };
const CARD:     Account = { id: 3, name: 'Credit Card', abbr: 'VISA' };
const GEN_EXP:  Account = { id: 10, name: 'General Expenses', abbr: 'EXP' };
const DINING:   Account = { id: 11, name: 'Dining Out', abbr: 'DINE' };
const SALARY:   Account = { id: 20, name: 'Salary', abbr: 'SAL' };

// ── Shortcuts (the Quick Add grid) ──────────────────────────────────────────
export const SHORTCUTS: Shortcut[] = [
  {
    id: 1, icon: '💸', name: 'Expense', slug: 'expense', hasPayee: true,
    debit: { kind: 'fixed', account: GEN_EXP },
    credit: { kind: 'chips', label: 'Paid from', accounts: [CHEQUING, CARD, SAVINGS] },
  },
  {
    id: 2, icon: '💰', name: 'Income', slug: 'income', hasPayee: true,
    debit: { kind: 'chips', label: 'Deposit to', accounts: [CHEQUING, SAVINGS] },
    credit: { kind: 'fixed', account: SALARY },
  },
  {
    id: 3, icon: '💳', name: 'Card Transaction', slug: 'card-transaction', hasPayee: true,
    debit: { kind: 'fixed', account: DINING },
    credit: { kind: 'fixed', account: CARD },
  },
  {
    id: 4, icon: '🔄', name: 'Transfer', slug: 'transfer', hasPayee: false,
    debit: { kind: 'chips', label: 'To', accounts: [SAVINGS, CARD, CHEQUING] },
    credit: { kind: 'chips', label: 'From', accounts: [CHEQUING, SAVINGS] },
  },
];

// ── Preview category picker + payee suggestion chips ────────────────────────
export const CATEGORIES = [
  'Groceries', 'Dining', 'Transport', 'Utilities', 'Entertainment', 'Rent', 'Salary',
];

export const PAYEES = ['Loblaws', 'Amazon', 'Tim Hortons', 'Uber', 'Rogers', 'Costco'];

// ── Helpers ─────────────────────────────────────────────────────────────────
export const acctShort = (a: Account | null | undefined): string =>
  a ? (a.abbr || a.name) : '—';

/** Resolve the concrete account for a leg given the currently-picked chip id. */
export function legAccount(leg: Leg, pickedId: number | null): Account | null {
  if (leg.kind === 'fixed') return leg.account;
  return leg.accounts.find(a => a.id === pickedId) ?? leg.accounts[0] ?? null;
}

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);
