/**
 * Hardcoded mock data for the Quick Add demo. No API, no persistence — everything
 * here is static and drives the standalone wizard UI. Mirrors the SHAPE of the real
 * app's shortcut model (each quick shortcut = a debit leg + a credit leg, each
 * either a fixed account or a set of choosable "funding" accounts), plus the
 * "Full journal entry" fallback which opens the full single-page form instead.
 */

export interface Account {
  id: number;
  name: string;
  abbr: string;
}

/** One side (debit or credit) of a quick shortcut: fixed account or funding chips. */
export type Leg =
  | { kind: 'fixed'; account: Account }
  | { kind: 'chips'; label: string; accounts: Account[] };

/** A one-tap quick-entry shortcut (runs the payee → amount → preview wizard). */
export interface QuickShortcut {
  id: number;
  icon: string;
  name: string;
  slug: string;
  type: 'quick';
  /** Transfers skip the payee step (payee is meaningless account→account). */
  hasPayee: boolean;
  debit: Leg;
  credit: Leg;
}

/** The fallback/expanded option — opens the full journal-entry form. */
export interface FullShortcut {
  id: number;
  icon: string;
  name: string;
  slug: string;
  type: 'full';
}

export type Shortcut = QuickShortcut | FullShortcut;

// ── Accounts ────────────────────────────────────────────────────────────────
const CHEQUING:  Account = { id: 1, name: 'Chequing', abbr: 'CHQ' };
const SAVINGS:   Account = { id: 2, name: 'Savings', abbr: 'SAV' };
const CARD:      Account = { id: 3, name: 'Credit Card', abbr: 'VISA' };
const CASH:      Account = { id: 4, name: 'Cash', abbr: 'CASH' };
const DINING:    Account = { id: 11, name: 'Dining Out', abbr: 'DINE' };
const GROCERIES: Account = { id: 12, name: 'Groceries', abbr: 'GROC' };
const TRANSIT:   Account = { id: 13, name: 'Transit', abbr: 'TRAN' };
const ENTERTAIN: Account = { id: 14, name: 'Entertainment', abbr: 'ENT' };
const SALARY:    Account = { id: 20, name: 'Salary', abbr: 'SAL' };

/** All accounts — used by the "Full journal entry" form's account pickers. */
export const ACCOUNTS: Account[] = [
  CHEQUING, SAVINGS, CARD, CASH, DINING, GROCERIES, TRANSIT, ENTERTAIN, SALARY,
];

// ── Shortcuts (the Quick Add grid) — mirrors the real app's list ────────────
export const SHORTCUTS: Shortcut[] = [
  {
    id: 1, icon: '🍽️', name: 'Meal alone', slug: 'meal-alone', type: 'quick', hasPayee: true,
    debit: { kind: 'fixed', account: DINING },
    credit: { kind: 'chips', label: 'Paid from', accounts: [CHEQUING, CARD, CASH] },
  },
  {
    id: 2, icon: '🛒', name: 'Grocery', slug: 'grocery', type: 'quick', hasPayee: true,
    debit: { kind: 'fixed', account: GROCERIES },
    credit: { kind: 'chips', label: 'Paid from', accounts: [CHEQUING, CARD] },
  },
  {
    id: 3, icon: '🚇', name: 'Public transit', slug: 'public-transit', type: 'quick', hasPayee: true,
    debit: { kind: 'fixed', account: TRANSIT },
    credit: { kind: 'chips', label: 'Paid from', accounts: [CHEQUING, CARD, CASH] },
  },
  {
    id: 4, icon: '🔄', name: 'Transfer', slug: 'transfer', type: 'quick', hasPayee: false,
    debit: { kind: 'chips', label: 'To', accounts: [SAVINGS, CARD, CHEQUING] },
    credit: { kind: 'chips', label: 'From', accounts: [CHEQUING, SAVINGS] },
  },
  {
    id: 5, icon: '💰', name: 'Salary', slug: 'salary', type: 'quick', hasPayee: true,
    debit: { kind: 'chips', label: 'Deposit to', accounts: [CHEQUING, SAVINGS] },
    credit: { kind: 'fixed', account: SALARY },
  },
  {
    id: 6, icon: '❤️', name: 'Dating', slug: 'dating', type: 'quick', hasPayee: true,
    debit: { kind: 'fixed', account: ENTERTAIN },
    credit: { kind: 'chips', label: 'Paid from', accounts: [CHEQUING, CARD] },
  },
  {
    id: 7, icon: '🥤', name: 'Refreshments', slug: 'refreshments', type: 'quick', hasPayee: true,
    debit: { kind: 'fixed', account: DINING },
    credit: { kind: 'chips', label: 'Paid from', accounts: [CHEQUING, CASH, CARD] },
  },
  {
    id: 8, icon: '📝', name: 'Full journal entry', slug: 'full-journal-entry', type: 'full',
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

/** Resolve the concrete account for a quick-shortcut leg given the picked chip id. */
export function legAccount(leg: Leg, pickedId: number | null): Account | null {
  if (leg.kind === 'fixed') return leg.account;
  return leg.accounts.find(a => a.id === pickedId) ?? leg.accounts[0] ?? null;
}

export const accountById = (id: number | null): Account | null =>
  id == null ? null : (ACCOUNTS.find(a => a.id === id) ?? null);

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);
