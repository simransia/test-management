# React App

A production-ready React application built with industry-standard architecture.

## Tech Stack

- **React 19** — Latest React with concurrent features
- **TypeScript 6** — Strict mode with path aliases
- **Tailwind CSS v4** — CSS-first configuration with oklch colors
- **Vite 8** — Lightning-fast builds and HMR
- **React Router v7** — Type-safe routing with lazy loading
- **pnpm** — Fast, disk-efficient package manager
- **ESLint** — Code linting with React-specific rules

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── layout/       # Layout components (Header, Footer, RootLayout)
│   ├── ui/           # Reusable primitives (Button, Container, Spinner)
│   └── error-boundary.tsx
├── config/           # App configuration & env vars
├── hooks/            # Custom React hooks
├── lib/              # Utility functions & HTTP client
├── pages/            # Page components (route-level)
│   ├── home/
│   ├── about/
│   └── not-found/
├── types/            # Shared TypeScript types
├── router.tsx        # Route definitions
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles & Tailwind config
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_APP_TITLE` | Application title | `React App` |

## Architecture Decisions

- **Barrel exports** — Each module has an `index.ts` for clean imports (`@/components` instead of `@/components/ui/button`)
- **Path aliases** — `@/` maps to `src/` for absolute imports
- **Lazy routes** — Pages are code-split automatically via `lazy()` in the router
- **CSS-first Tailwind** — Theme tokens defined in `index.css` using `@theme` (no JS config file)
- **oklch colors** — Perceptually uniform color space for consistent, vibrant palette
