# Manual Setup Guide

Only perform a section when its corresponding story is active. Never paste secrets into an agent chat, issue, commit, screenshot, or client-side environment variable.

## Before PA-001 — Local tools

Install:

- Git
- Node.js current LTS
- Corepack/pnpm
- Docker Desktop (for local PostgreSQL and optional object-storage emulator)
- FFmpeg and FFprobe
- A code editor and at least one coding agent

Confirm each executable is available from the terminal. Create a new private GitHub repository, clone it, copy this build pack into its root, and make the baseline commit.

After PA-001, from the repository root:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm quality
pnpm --filter @pa/web dev
pnpm --filter @pa/worker dev
```

`pnpm quality` is the local equivalent of the GitHub Actions quality gates. After PA-002, enable the branch-protection settings in `docs/CI.md` so `main` cannot merge without the **Quality gates** check.

Web health: `http://localhost:3000/api/health`. Worker health: `http://localhost:3001/health`.

Recommended branch flow for a solo project:

1. Keep `main` releasable.
2. Create `story/pa-NNN-short-name` from current `main`.
3. Give one story prompt to one agent.
4. Review and test the diff locally.
5. Merge through a pull request, even when self-reviewing, so the story has a durable record.
6. Delete the branch and begin the next story from updated `main`.

## Before PA-003 — Environment files

Create `.env.local` from the committed `.env.example`. Use development-only values. Ensure all real `.env*` files are ignored by Git.

## Before PA-004 — PostgreSQL

For local development, use the repository Docker Compose service. For hosted environments, create separate development/staging and production databases. Copy connection strings only into the relevant secret manager.

## Before PA-007 — Authentication

Create credentials for the chosen login method only after the application supplies the exact callback URLs. For a private alpha, email magic links or a single OAuth provider are sufficient. Add the local and deployed callback URLs in the provider console.

## Before PA-011 — OpenAI project

1. Create a dedicated OpenAI API project for this application.
2. Create a restricted project API key; do not use a personal all-purpose key.
3. Set project budget notifications and a conservative monthly limit.
4. Put the key in server/worker secrets as `OPENAI_API_KEY`.
5. Configure generation and speech model aliases through environment variables rather than hardcoding them.
6. Review the current OpenAI usage and safety policies before public release.

The product must visibly disclose that generated voices are AI-generated. The official speech documentation requires this disclosure.

## Before PA-018 — FFmpeg

Verify the production worker image contains `ffmpeg` and `ffprobe`. The worker must fail its startup health check if either is unavailable. Local and production versions should be pinned close enough to produce comparable duration and encoding results.

## Before PA-019 — Object storage

Create a private bucket in an S3-compatible service. Configure:

- blocked public access;
- server-side encryption;
- CORS limited to the application origins when direct signed downloads are used;
- lifecycle deletion for abandoned temporary chunks;
- durable retention for completed episodes;
- separate credentials with only the permissions the worker needs.

Set endpoint, region, bucket, access key, and secret in server-side secrets. Never expose bucket credentials to the browser. The server should issue short-lived signed URLs.

## Before PA-029 — Web research

No separate search vendor is required for the default implementation. Enable research through the Responses API web-search tool. Confirm the selected model and project have access. Preserve returned source URLs and titles; do not invent citations from model prose.

## Before PA-051 — Recurring programs

Configure a scheduler that invokes the worker’s due-program scan at least every five minutes. The PostgreSQL job table remains authoritative, so duplicate scheduler invocations must be harmless.

## Before PA-055 — Observability

Create a Sentry project or another error-monitoring destination and an OpenTelemetry-compatible telemetry destination. Store DSNs/tokens as secrets. Enable source maps for production builds without making source bundles public.

## Before PA-059 — Deployment

Deploy two independently scalable processes:

- **Web:** Next.js application serving UI and short request/response endpoints.
- **Worker:** long-running Node process with FFmpeg, queue polling, generation, rendering, and assembly.

Provision PostgreSQL and private object storage. Configure health checks, secrets, resource limits, backups, and log retention. Do not run long episode generation inside a short-lived serverless request.

## Pre-release owner checklist

- [ ] Privacy policy and terms match actual data handling.
- [ ] AI-voice disclosure appears before playback and in episode metadata.
- [ ] Account and episode deletion work end to end, including stored objects.
- [ ] Rate limits and per-user budgets are enabled.
- [ ] Abuse reporting and content moderation behavior are documented.
- [ ] No production key exists in Git history or client bundles.
- [ ] Database backups and restore procedure have been tested.
- [ ] At least one full 5-, 20-, and 45-minute episode has passed the release eval suite.
- [ ] Mobile playback, seeking, background audio, and interrupted-network recovery have been tested on real devices.

