# Continuous Integration and Branch Protection

PA-002 added local and GitHub Actions quality gates that protect the default branch. Later stories extend this workflow; they must not replace these checks.

## Gates

After a frozen lockfile install, every pull request and every push to `main` or `master` runs:

1. `pnpm lint`
2. `pnpm format:check`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`

GitHub Actions invokes each command as its own named step so a failure names the gate in the checks UI. The workflow does not deploy.

Locally, the same sequence is:

```bash
pnpm install --frozen-lockfile
pnpm quality
```

`pnpm quality` is `scripts/run-quality-gates.mjs`. It stops at the first failing gate and prints the exact `pnpm` command to re-run. It is not named `pnpm ci`, because that is a reserved pnpm command.

## Cache and concurrency

- pnpm store caching is keyed on `pnpm-lock.yaml` through `actions/setup-node`.
- `pnpm install --frozen-lockfile` always runs. A cache hit only speeds package download; it cannot skip resolution or accept a different dependency graph.
- `node_modules` and Turborepo `.turbo` outputs are not restored across jobs, so tests and builds cannot be skipped by a stale task cache.
- Pull-request concurrency cancels stale runs of this workflow. Pushes to `main`/`master` are not cancelled.

Workflow permissions are `contents: read` only.

## Proving a gate actually blocks

`pnpm prove:gates` writes a tiny failing fixture for frozen install, lint, format, typecheck, unit tests, and production builds, asserts that the real root command fails, then deletes the fixture and any Next.js generated types it created. This command is for local evidence. It is not part of the GitHub workflow.

## Owner setup: protect the default branch

GitHub does not enable these rules from the workflow file. After this workflow has run at least once, the repository owner must require it before merge.

### Recommended: ruleset (Settings → Rules → Rulesets)

1. Create a ruleset targeting the default branch (`main`, or `master` until it is renamed).
2. Set enforcement to **Active**.
3. Enable **Restrict deletions** and **Block force pushes**.
4. Enable **Require a pull request before merging**.
   - Require at least one approval if the repository has another reviewer; a personal repository may allow the author to merge after reading the diff.
   - Do not dismiss the requirement for administrators unless you need an emergency bypass.
5. Enable **Require status checks to pass**.
   - Require branches to be up to date before merging.
   - Add the check named **Quality gates** (job name in `.github/workflows/ci.yml`). If the UI lists it as `CI / Quality gates`, select that exact name.
6. Do not add deployment environments or extra token permissions for this workflow.

### Classic branch protection (Settings → Branches)

If the repository still uses classic branch protection instead of rulesets:

- Branch name pattern: `main` (also add `master` if it remains the default).
- Require a pull request before merging.
- Require status checks to pass: **Quality gates**.
- Require branches to be up to date before merging.
- Do not allow bypassing the above settings unless you need an emergency admin escape hatch.
- Do not allow force pushes.
- Do not allow deletions.

Confirm in a throwaway pull request that a failing gate is red and that GitHub refuses merge until it is green.

## Later CI additions

`docs/ARCHITECTURE.md` lists additional pull-request gates (PostgreSQL integration tests, migration validation, dependency/secret scanning, Playwright, eval fixtures). Those land in later stories and should be appended to this workflow rather than replacing it.
