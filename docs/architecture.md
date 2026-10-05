# Architecture

## Overview

Duunit is a personal job application tracker: users register, log in, and keep a list of the jobs they have applied to (company, position, status, dates, cover letter). It is a single TypeScript repo with a React 19 + Vite + MUI + TanStack Query single-page app and an Express 5 API. Data lives in PostgreSQL through Drizzle ORM, and authentication (email + password sessions) is provided by Better Auth. In production a single Node process serves both the API and the built SPA behind a Caddy reverse proxy.

## System overview (C4 model)

The overview follows the [C4 model](https://c4model.com).

### Level 2: Containers

```mermaid
%%{init: {"c4": {"c4ShapeMargin": 90}}}%%
C4Container
    title Duunit (duunit.site) containers, production

    Person(user, "User", "Job seeker tracking their applications")

    Boundary(duunit, "", "") {
        Container(spa, "Single-page app", "React 19, Vite, MUI, TanStack Query", "Runs in the browser. src/client")
        Container(proxy, "Reverse proxy", "Caddy", "HTTPS, compression. deploy/Caddyfile")
        ContainerDb(db, "Database", "PostgreSQL 18", "users, sessions, accounts, verifications, applications")
        Container(api, "API application", "Node, Express 5, Better Auth, Drizzle", "/api/auth/*, /api/applications, built SPA. src/server")
    }

    Boundary(ext, "", "") {
        System_Ext(gha, "GitHub Actions", "Lint, e2e tests, build image, deploy on release")
        System_Ext(hub, "Docker Hub", "App image: staging, release tag, latest")
    }

    Rel(user, spa, "Uses", "Browser")
    Rel(spa, proxy, "Requests", "HTTPS")
    Rel(proxy, api, "Forwards", "HTTP :3000")
    Rel(api, db, "Reads, writes", "SQL")
    Rel(gha, hub, "Pushes image")
    Rel(gha, api, "Deploys", "SSH, deploy.sh")
    Rel(hub, api, "Image pulled", "compose pull")

    UpdateRelStyle(user, spa, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="10")
    UpdateRelStyle(spa, proxy, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateRelStyle(proxy, api, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="10")
    UpdateRelStyle(api, db, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateRelStyle(gha, hub, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateRelStyle(gha, api, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="-140")
    UpdateRelStyle(hub, api, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="10")
    UpdateElementStyle(gha, $bgColor="#6b7c90", $borderColor="#6b7c90")
    UpdateElementStyle(hub, $bgColor="#6b7c90", $borderColor="#6b7c90")
    UpdateElementStyle(duunit, $fontColor="#6b7c90", $borderColor="#6b7c90")
    UpdateElementStyle(ext, $borderColor="transparent")
    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

The SPA and the API ship in the same Docker image: in production, `src/server/app.ts` serves `dist/client` for every path that isn't under `/api`. They are drawn as separate containers because they run in different places (the browser and Node).

### Level 3: Components of the API application

```mermaid
%%{init: {"c4": {"c4ShapeMargin": 90}}}%%
C4Component
    title API application (src/server) components
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

    ContainerDb(db, "Database", "PostgreSQL")
    Container(spa, "Single-page app", "React", "authClient for auth, apiClient (axios) for data")

    Boundary(api, "", "") {
        Component(dbm, "Drizzle data layer", "db/index.ts, db/schema.ts", "pg Pool, schema, migrations on startup")
        Component(auth, "Better Auth", "util/auth.ts", "/api/auth/*: sign-up, sign-in, sessions, profile")
        Component(mw, "requireAuth", "middleware/authentication.ts", "Resolves session cookie, sets req.user, or 401")
        Component(svc, "applicationService", "services/applicationService.ts", "CRUD, every query scoped by userId")
        Component(ctrl, "applicationController", "routes/applications/", "Validates input with Zod schemas from src/common/types")
        Component(err, "errorHandler", "middleware/errorHandler.ts", "AppError to its status, ZodError to 400, else 500")
    }

    Rel(spa, auth, "Auth calls", "/api/auth/*")
    Rel(spa, mw, "Application CRUD", "/api/applications")
    Rel(mw, auth, "getSession()")
    Rel(auth, dbm, "Drizzle adapter")
    Rel(dbm, db, "SQL", "pg")
    Rel(mw, ctrl, "next()")
    Rel(ctrl, svc, "Calls")
    Rel(svc, dbm, "Queries")
    Rel(ctrl, err, "Thrown errors")

    UpdateRelStyle(spa, auth, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="-70")
    UpdateRelStyle(spa, mw, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="20")
    UpdateRelStyle(mw, auth, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateRelStyle(auth, dbm, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateRelStyle(dbm, db, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="10")
    UpdateRelStyle(mw, ctrl, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="15")
    UpdateRelStyle(ctrl, svc, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateRelStyle(svc, dbm, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetX="10")
    UpdateRelStyle(ctrl, err, $textColor="#6b7c90", $lineColor="#6b7c90", $offsetY="-45")
    UpdateElementStyle(spa, $bgColor="#6b7c90", $borderColor="#6b7c90")
    UpdateElementStyle(db, $bgColor="#6b7c90", $borderColor="#6b7c90")
    UpdateElementStyle(dbm, $bgColor="#2f74c0", $borderColor="#245a96")
    UpdateElementStyle(auth, $bgColor="#2f74c0", $borderColor="#245a96")
    UpdateElementStyle(mw, $bgColor="#2f74c0", $borderColor="#245a96")
    UpdateElementStyle(svc, $bgColor="#2f74c0", $borderColor="#245a96")
    UpdateElementStyle(ctrl, $bgColor="#2f74c0", $borderColor="#245a96")
    UpdateElementStyle(err, $bgColor="#2f74c0", $borderColor="#245a96")
    UpdateElementStyle(api, $fontColor="#6b7c90", $borderColor="#6b7c90")
```

## Key flows

### 1. Register, log in, and authenticated requests

All auth endpoints are provided by Better Auth, not hand-written routes. `app.ts` mounts `toNodeHandler(auth)` at `/api/auth/*splat` _before_ `express.json()`, and `util/auth.ts` configures it with the Drizzle adapter (tables `users`, `sessions`, `accounts`, `verifications`), email + password login, password length limits from `#common/types/common.ts`, and a server-controlled `role` field (`input: false`, default `user`). On the client, `Register.tsx` and `Login.tsx` validate with the shared Zod schemas (`NewUserSchema`, `LoginSchema`) and call `authClient.signUp.email` / `authClient.signIn.email`. Better Auth sets a session cookie. From then on, `AuthRoute.tsx` uses `authClient.useSession()` to guard client routes, and the server's `requireAuth` middleware resolves the session from the cookie on every `/api/applications` request and sets `req.user`.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React pages
    participant AC as authClient (Better Auth React)
    participant API as apiClient (axios)
    participant MW as requireAuth middleware
    participant BA as Better Auth handler /api/auth/*
    participant DB as PostgreSQL

    U->>FE: Submit email + password on Login.tsx or Register.tsx
    FE->>FE: zodResolver(LoginSchema or NewUserSchema)
    alt client-side validation fails
        FE-->>U: Field errors (translated via i18n.ts)
    else valid
        FE->>AC: signIn.email() or signUp.email()
        AC->>BA: POST /api/auth/sign-in/email or /sign-up/email
        BA->>DB: Look up or insert users + accounts, insert sessions
        alt rejected
            BA-->>AC: INVALID_EMAIL_OR_PASSWORD or USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
            AC-->>FE: error
            FE-->>U: Alert with translated message
        else rate limited
            BA-->>AC: 429
            AC-->>FE: error
            FE-->>U: Alert login.errors.tooManyRequests (Login.tsx only)
        else success
            BA-->>AC: 200 + Set-Cookie session token
            AC-->>FE: session data
            FE-->>U: Success snackbar, navigate to /
        end
    end

    Note over U,DB: Route guards: AuthRoute and NavBar call useSession, which sends its own GET /api/auth/get-session

    Note over U,DB: Later, any call to /api/applications
    FE->>API: useApplications() or a mutation hook
    API->>MW: GET /api/applications (session cookie)
    MW->>BA: auth.api.getSession(request headers), in-process
    BA->>DB: Find session by token
    alt no valid session
        MW-->>API: 401 error unauthorized
        API->>API: Interceptor clears query cache
        API-->>U: Full page load of /login
    else valid session
        MW->>MW: req.user = session.user, next()
    end
```

Logout is `signOut()` in `util/authClient.ts`, which calls Better Auth and then clears the whole TanStack Query cache. If a session expires or is revoked while the app is open (for example by `changePassword` with `revokeOtherSessions: true` on another device), the response interceptor in `util/apiClient.ts` catches the 401, clears the query cache and loads `/login`. Profile edits (`Profile.tsx`, `ChangePasswordForm.tsx`) also go straight to Better Auth (`authClient.updateUser`, `authClient.changePassword` with `revokeOtherSessions: true`).

### 2. Create an application and list applications

This is the core feature. `NewApplication.tsx` renders the shared `ApplicationForm`, which validates with `NewApplicationSchema` from `src/common/types/applications.ts` (trims strings, converts empty optional fields to `null`, checks URL and date). On submit, `useCreateApplication` POSTs to `/api/applications`. On the server, `applicationController.ts` re-validates the body with the _same_ schema, and `applicationService.createApplication` inserts the row with the authenticated `userId`. The service maps the DB row through `toApplicationResponse` (`services/utils.ts`), which parses it with `ApplicationResponseSchema`. If a row fails that check, it is a server bug, so the error is logged and the request returns 500 instead of 400. The client then invalidates the `['applications']` query, so `Applications.tsx` refetches `GET /api/applications` and the grid re-renders.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as NewApplication.tsx + ApplicationForm
    participant Q as useCreateApplication (TanStack Query)
    participant API as applicationController.ts
    participant SVC as applicationService.ts
    participant DB as PostgreSQL

    U->>FE: Fill form, click Create
    FE->>FE: zodResolver(NewApplicationSchema)
    FE->>Q: mutateAsync(values)
    Q->>API: POST /api/applications (cookie)
    API->>API: requireAuth (see flow 1)
    API->>API: NewApplicationSchema.parse(req.body)
    alt body invalid
        API-->>Q: 400 validation error + details (z.flattenError, via errorHandler)
        Q-->>FE: throws
        FE-->>U: Alert common.errors.unexpected
    else valid
        API->>SVC: createApplication(req.user.id, application)
        SVC->>DB: INSERT INTO applications ... RETURNING
        DB-->>SVC: row
        SVC->>SVC: toApplicationResponse(row)
        SVC-->>API: ApplicationResponse
        API-->>Q: 201 + JSON
        Q->>Q: invalidateQueries applications
        FE-->>U: Success snackbar, navigate to /applications
        Q->>API: GET /api/applications
        API->>SVC: getApplicationsByUserId(req.user.id)
        SVC->>DB: SELECT from applications WHERE user_id
        DB-->>SVC: rows
        SVC-->>API: ApplicationResponse[]
        API-->>Q: 200 + JSON
    end
```
