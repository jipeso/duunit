# Duunit

Job application tracker. Express 5 + Drizzle/Postgres backend, React 19 + Vite + MUI + TanStack Query frontend, Better Auth. Node runs `.ts` natively (no build step for server).

## Commands

- `npm start` — dev env in Docker. Add `-- --build` after dependency/Docker changes.
- `npm run lint` — typecheck + ESLint (includes Prettier). Run before finishing any change.
- `npm test` — Playwright e2e against CI containers.

## Conventions

- Shared Zod schemas and types live in `src/common/types`; validate request bodies with them.
- Errors are handled centrally in `src/server/middleware/errorHandler.ts` (`ZodError` → 400, `AppError(msg, status)`). Don't add try/catch in routes.
