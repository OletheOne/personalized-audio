# Decision Log

Record decisions that affect product behavior, architecture, security, cost, or the build sequence. Never silently rewrite history; append a new entry that supersedes the old one.

## ADR-001 — Repository backlog instead of Jira

- **Status:** Accepted
- **Decision:** Use `docs/BACKLOG.md`, sequential agent prompts, Git commits, and optional GitHub Issues/Projects.
- **Why:** This is a personal project and should not depend on paid team project-management software.

## ADR-002 — Controlled chained generation pipeline

- **Status:** Accepted
- **Decision:** The application orchestrates separate intent, planning, optional research, script, editorial, voice-direction, render, and assembly stages. Each stage has a versioned schema.
- **Why:** Long-form quality, auditability, retries, testing, and provider substitution are materially better than one giant prompt.

## ADR-003 — Responses API for text/research; Speech API for durable episodes

- **Status:** Accepted
- **Decision:** Use OpenAI Responses API with Structured Outputs for generation stages and its web-search tool for the grounded research phase. Use the request-based speech endpoint for durable narration. Realtime is reserved for later interactive “ask about this” conversations.
- **Why:** Episodes require stored scripts, deterministic stage boundaries, editable transcripts, chapter metadata, retryable chunks, and downloadable files.

## ADR-004 — Semantic chunk rendering

- **Status:** Accepted
- **Decision:** Split approved scripts into semantic speech segments below provider input limits, render them independently, assemble from lossless intermediate audio, and retain a render manifest.
- **Why:** Long episodes exceed a single speech request and need selective retries, multi-speaker support, and trustworthy chapter timing.

## ADR-005 — Modular TypeScript monorepo

- **Status:** Accepted
- **Decision:** Use a pnpm monorepo with a Next.js web app, a Node background worker, and shared domain/contracts/provider packages.
- **Why:** One language and one repository reduce personal-project overhead while preserving separation between interactive web requests and long-running media jobs.

## ADR-006 — PostgreSQL-backed durable jobs

- **Status:** Accepted
- **Decision:** Use PostgreSQL for product data and a PostgreSQL-backed job queue. Keep a `JobQueue` port so the implementation can move to a hosted orchestrator later.
- **Why:** It minimizes required infrastructure for a personal build while preserving retries, leases, scheduling, and a path to scale.

## ADR-007 — S3-compatible object storage

- **Status:** Accepted
- **Decision:** Store generated audio, intermediate chunks, waveform data, and downloadable artifacts in S3-compatible storage behind an `ObjectStore` port. Use a filesystem adapter for local development.
- **Why:** Database blobs are a poor fit for large audio, and an adapter avoids vendor lock-in.

## ADR-008 — Model aliases are configurable

- **Status:** Accepted
- **Decision:** Environment configuration selects model aliases by task. Prompt and schema versions are stored with every run.
- **Why:** Model availability, cost, and quality change. The product must be upgradeable without domain rewrites.

## Template

### ADR-NNN — Title

- **Status:** Proposed | Accepted | Superseded
- **Decision:**
- **Why:**
- **Consequences:**
- **Supersedes:**

