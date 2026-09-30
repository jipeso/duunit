# Duunit

Job application tracker. Express 5 + Drizzle/Postgres backend, React 19 + Vite + MUI + TanStack Query frontend, Better Auth. Node runs `.ts` natively (no build step for server).

## Commands

- `npm start` — dev env in Docker (app :5000 + Postgres). Add `-- --build` after dependency/Docker changes.
- `npm run lint` — `tsc --build` + ESLint. Run before finishing any change.
- `npm test` — rebuilds CI containers (app :3000) and runs Playwright e2e (`tests/`).
- `npx drizzle-kit generate` — create a migration after editing `src/server/db/schema.ts` (needs `DATABASE_URL`). Migrations apply automatically on server start.

## Layout

- `src/server` — `routes/<feature>/*Controller.ts` (Express routers) → `services/` (DB access) → `db/schema.ts`
- `src/client` — `pages/<Page>/` (with `index.ts` re-export), `hooks/` (React Query), `util/apiClient.ts` (axios, base `/api`)
- `src/common/types` — Zod schemas + types shared by client and server
- `public/locales/{en,fi,sv}/translation.json` — i18n; add keys to all three

## Conventions

- Import aliases: `#common/*`, `#server/*`, `#client/*`. Server imports use explicit `.ts` extensions.
- Validate request bodies with Zod schemas from `#common/types`; `ZodError` → 400 and `AppError(msg, status)` are handled centrally in `middleware/errorHandler.ts`. Don't add try/catch in routes.
- Protected routes use `requireAuth`; the user is on `req.user`.
- Prettier: no semicolons, single quotes (incl. JSX), `arrowParens: avoid`.
- `/test/reset` (dev/test only) wipes the DB for e2e tests.
