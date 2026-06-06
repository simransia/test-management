# Preproute — Test Management Application

A test management application for creating tests, adding questions, and publishing them.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- shadcn/ui (base-nova)
- Axios, Zustand, react-hook-form, Zod

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | Staging URL in `.env.example` |
| `VITE_APP_TITLE` | Application title | `Preproute` |

## API & Test Credentials

- **API:** `https://admin-moderator-backend-staging.up.railway.app/api`
- **User ID:** `vedant-admin`
- **Password:** `vedant123`

## Current Progress

- [x] **Page 1 — Login** — JWT auth, form validation, protected routes
- [ ] Page 2 — Dashboard / Test List
- [ ] Page 3 — Create/Edit Test
- [ ] Page 4 — Add Questions
- [ ] Page 5 — Preview & Publish

## Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # ESLint
pnpm preview  # Preview production build
```
