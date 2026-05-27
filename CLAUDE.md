# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start

# Run DB migrations (sequential SQL files in db/migrations/)
npm run migrations

# Seed initial data from json/ folder
npm run seeders
```

No test suite is configured (`npm test` exits with error).

Linting is StandardJS with 4-space indent. Run manually with:
```bash
npx standard
```

## Environment Variables

Create a `.env` file at the root (loaded via `process.loadEnvFile()`):

```
PORT=
ENVAIROMENT=          # "produccion" or anything else for dev
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_SCHEMA=
SECRET_JWT_KEY=
FRONT_URL=
MACRO_SECRET=         # Macro/PlusPagos payment gateway
MACRO_COMMERCE_ID=
MACRO_FRASE=
SAMESITE=             # Cookie sameSite policy (default: "none")
```

## Local Database

Docker Compose provides MySQL on port 3307 and phpMyAdmin on port 8080:

```bash
docker compose up -d
```

## Architecture

**Runtime**: Node.js 22, ESM modules (`"type": "module"` throughout — use `import`/`export`, not `require`).

**Standard module layout** (most modules follow this pattern):
```
modules/<Name>/
  <name>.routes.js      # Express Router, applies validateToken + permission checks inline
  <name>.controller.js  # Thin handler functions, calls model methods
  <name>.model.js       # Static class with SQL queries using executeQuery / handleTransaction
```

**Clean Architecture exception — Results module**:
```
modules/Results/
  Domain/               # ResultMatch entity, ResultMatchRepository interface
  Application/
    use-cases/          # One use-case class per operation (execute() method)
    services/           # Factory that wires use-cases to the repository
  Infrastructure/       # ResultMatchRepositoryMysql, routes, Zod schema
```
The Results module uses dependency injection: `app.js` instantiates the repository, creates the service, and passes it to the route factory.

**Database access utilities**:
- `utils/executeQuery.js` — wraps `pool.getConnection()` + `query()` + `release()` for single queries
- `utils/transactions.js` — `handleTransaction(callback)` wraps a callback in begin/commit/rollback with automatic release

Use `executeQuery` for reads and simple writes. Use `handleTransaction` when multiple writes must be atomic (e.g., inscription creation creates couple + inscription + game days in one transaction).

**Input validation**: Zod schemas live in `schemas/` and in `modules/Results/Infrastructure/resultMatchSchema.js`. Validate request bodies with `.safeParse()` in controllers or `.parse()` in routes (ZodError is caught and returned as 400).

**Auth flow**:
1. `POST /auth/login` issues a JWT stored in an `access_token` HTTP-only cookie (4-hour expiry)
2. `middlewares/validateToken.js` verifies the cookie and attaches `req.session.user` (contains `id`, `typeUser`, `email`, `name`, `last_name`, `gender`)
3. `/auth` and `/payments` routes are **public** — all other routes require the token middleware (applied per-router, not globally)

**Role system** (numeric values stored in `typeUser`):
| Role | Value |
|------|-------|
| player | 1 |
| admin | 2 |
| fiscal | 3 |
| largador | 4 |
| superAdmin | 5 |

Use `hasRole(user, ['admin', 'superAdmin'])` from `middlewares/permisions.js` for multi-role checks. Specific helpers `isPlayer`, `isAdmin`, `isFiscal`, `isDropper` also available.

**Payment gateway**: Macro/PlusPagos integration in `modules/Payment/`. Amounts are sent as cents (`amount * 100`). The webhook endpoint `paymentStatus` updates inscription `status_payment` from `PENDING` to `PAID`/failed.

**CORS**: Whitelisted origins in `middlewares/cors.js`. Add new frontend URLs there when deploying new environments.

**DB migrations**: Numbered SQL files in `db/migrations/` run in order by `scripts/init-db.js`. Always add new migrations as the next numbered file.
