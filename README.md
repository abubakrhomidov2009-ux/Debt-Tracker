# Ledger — Debt Tracker (web)

A React + TypeScript frontend for the `Debt_back` API
(https://github.com/Amsurur/Debt_back), built to match its OpenAPI spec
(Auth, Users, Folders, Contacts, Debts, Payments, Dashboard).

## Stack

- **React 19 + TypeScript**, built with **Vite**
- **Jotai** for state — auth session, theme, and cached folders/contacts/
  debts/dashboard data
- **React Router** for routing and route guards
- **Tailwind CSS v4** with a custom "Ledger" design system (see
  `src/index.css` — `@theme` block)
- Plain `fetch` API client (`src/api/client.ts`) with automatic
  access-token refresh on 401

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your Debt_back server
npm run dev
```

By default `VITE_API_URL` is `http://localhost:4000`, matching your
Swagger UI at `http://localhost:4000/docs/`. Change it in `.env` if your
API runs elsewhere.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck (`tsc -b`) and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## Project structure

```
src/
  api/          one file per resource (auth, users, folders, contacts, debts, dashboard)
                + client.ts, the shared fetch wrapper
  store/        Jotai atoms: auth.ts, theme.ts, data.ts
  components/   shared UI: Button, Field (Input/Textarea/Select), Modal,
                AmountText, StatusBadge, Avatar, AppShell, RouteGuards…
  pages/        one file per screen (Login, Register, Dashboard, Folders,
                Contacts, ContactDetail, Debts, DebtForm, DebtDetail, Profile)
  types/        TypeScript interfaces mirroring the backend's OpenAPI schemas
```

## Notes on the design

The palette and type system are documented as CSS custom properties at the
top of `src/index.css`. Money is always shown in a monospace, tabular-nums
face so amounts line up like a real ledger column; green means "they owe
me", brick red means "I owe them". The Dashboard's two-column summary card
is the app's signature visual — a nod to a physical accounting ledger
page.

## Next steps

- A React Native version of the same screens, sharing the `api/` and
  `types/` folders, would be the natural next step for mobile.
- Wire up real-time balance refresh (e.g. refetch `dashboardAtom` after
  any debt/payment mutation) if you want the dashboard to update without
  a manual revisit.
