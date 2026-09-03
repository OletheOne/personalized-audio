# Personalized Audio Platform

Start with [`START_HERE.md`](START_HERE.md).

This repository is a pnpm/Turborepo TypeScript monorepo. Story PA-001 created the app and package boundaries from `docs/ARCHITECTURE.md`. Product behavior, database, auth, and providers are intentionally absent until later stories.

## Prerequisites

- Node.js 22.12 or newer
- pnpm 9.12 or newer via Corepack (`corepack enable`)

## Commands

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm quality
```

`pnpm quality` runs lint, format check, typecheck, unit tests, and production builds in the same order as GitHub Actions. Pull requests must pass the **Quality gates** check. Branch-protection settings the owner must enable are in [`docs/CI.md`](docs/CI.md).

Run the health entrypoints:

```bash
pnpm --filter @pa/web dev
pnpm --filter @pa/worker dev
```

`pnpm dev` starts both. After a production build:

```bash
pnpm --filter @pa/web start
pnpm --filter @pa/worker start
```

- Web: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- Worker: [http://localhost:3001/health](http://localhost:3001/health)

Override the worker port with `WORKER_HEALTH_PORT` if needed.

## Workspace layout

```text
apps/web          Next.js UI and HTTP adapters
apps/worker       background worker process
packages/domain   entities and invariants
packages/contracts  Zod schemas and versioned contracts
packages/application  use cases and ports
packages/config   typed environment loading (skeleton)
packages/db       persistence adapters (skeleton)
packages/ai       prompt registry and model adapters (skeleton)
packages/audio    rendering and assembly (skeleton)
packages/storage  object-store adapters (skeleton)
packages/queue    job-queue adapters (skeleton)
packages/observability  logging and redaction (skeleton)
packages/ui       shared components
packages/testkit  fixtures and workspace-graph guards
```

Dependencies point inward: `UI/adapters → application → domain/contracts`. Import workspace code with `@pa/*` package names, not relative paths into other packages.
