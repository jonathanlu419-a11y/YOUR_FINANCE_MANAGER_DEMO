# Quick Add — Finance Manager Demo

An **isolated, standalone UI/UX demo** of the "Quick Add" fast-entry shortcut flow
from my personal **finance-portfolio-manager** app. It exists purely to showcase
the interaction design of that one feature, in a repo that can be shared publicly.

> ⚠️ This is a self-contained front-end demo. It uses **hardcoded mock data and
> local component state only** — there is **no backend, no database, no network
> call, and nothing is persisted**. "Confirming" an entry just appends it to an
> in-memory list for the current browser session.

## What it shows

The multi-step Quick Add wizard:

1. **Choose a shortcut** — Expense · Income · Card Transaction · Transfer.
2. **Payee** — pick a suggested payee chip, type your own, or skip (transfers skip
   this step automatically).
3. **Amount** — pick the funding account via chips, enter the amount, set the date.
4. **Review** — a tappable summary card with inline description + category; every
   row jumps back to the relevant step.
5. **Confirm** — a success state; the entry drops into the on-page list.

The styling/theme (dark palette, chips, modal, FAB) is copied from the real app so
the look and feel are faithful, but none of the real app's data model, API layer,
or business logic is included — the shortcut/account shapes here are lightweight
stand-ins reimplemented from scratch for the demo.

## Run it locally

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # type-check + production build
```

Then open the printed local URL and click the floating **✎** button (bottom-right).

## Stack

Vite + React + TypeScript. Single feature, minimal dependencies (`react`,
`react-dom`, `lucide-react`).

## Full app

This demo is extracted from a larger private project. For full context, see the
showcase repo: **finance-portfolio-manager**.
