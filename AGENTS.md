# Repository Agent Instructions

## Source of truth order

1. `PRODUCT_CONSTITUTION.md`
2. `docs/CANONICAL_VISION.md`
3. `docs/MASTER_SPEC.md`
4. `docs/ARCHITECTURE.md`
5. Active story in `docs/BACKLOG.md`
6. `docs/DECISION_LOG.md`

If instructions conflict, stop and explain the conflict. Do not silently choose.

## Working rules

- Implement one story at a time.
- Begin by inspecting the repository, current branch, active story, and related tests.
- Keep domain logic independent of Next.js, database, queue, storage, and model SDKs.
- Validate all model outputs with the shared runtime schema and domain invariants.
- Treat prompts as versioned application code with tests.
- Make expensive operations idempotent and record provider request identifiers when available.
- Keep API keys and privileged operations server-side.
- Never log raw secrets. Avoid logging full user prompts/scripts by default.
- Add tests at the lowest useful layer and at least one failure-path test for external boundaries.
- Do not introduce a new vendor or architectural pattern without recording an ADR.
- Do not mark a story complete until its acceptance criteria and completion gate are satisfied.

## Required handoff

At the end of each story, report:

1. outcome;
2. files changed;
3. tests/checks run and exact result;
4. acceptance-criteria evidence;
5. migrations or manual setup required;
6. risks, compromises, or follow-up work;
7. whether the next story is unblocked.

