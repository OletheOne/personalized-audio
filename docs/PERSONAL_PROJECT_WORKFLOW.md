# Personal Project and Agent Workflow

## Repository as the project manager

You do not need Jira. Use four layers:

1. `docs/BACKLOG.md` — permanent ordered plan and status.
2. GitHub Issue — optional short-lived discussion/evidence for the active story.
3. Story branch and pull request — reviewable implementation record.
4. Git tag/release — milestone snapshot.

GitHub Projects can provide a board later if desired, but it must mirror the backlog rather than become a second source of truth.

## One-time repository setup

From the new repository root:

```bash
git init
git add .
git commit -m "docs: add personalized audio build pack"
git branch -M main
git remote add origin <your-private-repository-url>
git push -u origin main
```

Then enable branch protection after PA-002:

- require a pull request before merge;
- require the CI status checks added by PA-002;
- require branches to be up to date before merge;
- block force pushes and deletion of `main`;
- allow you to self-approve if GitHub’s personal-repository rules require it, but still read the diff.

## Story loop

### 1. Select

Choose the first unchecked story whose dependencies are complete. Read its backlog entry and corresponding prompt.

### 2. Branch

```bash
git switch main
git pull --ff-only
git switch -c story/pa-001-scaffold-monorepo
```

Use the real story number/name in later branches.

### 3. Start the coding agent

Paste the Global Preamble from `agent-prompts/SEQUENTIAL_PROMPTS.md`, then the one story prompt. Let the agent inspect and implement. Do not paste prompts for future stories “for context”; the repository already supplies that context.

### 4. Review

Before accepting:

- inspect `git status` and `git diff`;
- confirm no unrelated files, secrets, generated binaries, or lockfile churn appeared;
- compare every acceptance criterion with concrete code/test evidence;
- run the targeted tests yourself when the change is risky;
- ask the agent to address specific failures within the same story;
- reject placeholders such as TODO production adapters when the story promised working behavior.

Useful review commands:

```bash
git status --short
git diff --stat main...HEAD
git diff main...HEAD
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use only commands that exist at the current story; PA-001 creates them.

### 5. Record completion

Change the active story marker from `[ ]` to `[x]`. Add a decision-log entry only for a durable architectural/product decision. Commit:

```bash
git add .
git commit -m "feat(PA-001): scaffold the monorepo"
git push -u origin HEAD
```

Open a pull request, review its complete diff and CI, then squash or merge. Return to `main`, pull, and delete the local story branch.

### 6. Milestone release

At each milestone boundary:

- run all CI and relevant evals;
- follow the milestone’s user journey manually;
- update release notes with shipped/deferred scope;
- tag the commit, for example `m2-audio-mvp.1`;
- create the next milestone branch only from that accepted baseline.

## Agent choice

Use one primary implementation agent per story. A second model is most useful as a read-only reviewer for security-sensitive, migration-heavy, concurrency, or media-processing stories. Do not let two write agents edit the same branch simultaneously.

Suggested high-scrutiny stories:

- PA-006/007: data ownership and authorization;
- PA-014/015: leases, retries, orchestration;
- PA-022–PA-027: paid rendering, storage, media access;
- PA-035–PA-038: source integrity and prompt injection;
- PA-044: multi-voice assembly;
- PA-056/057: scheduling and freshness/dedupe;
- PA-059/062/064: spend, privacy deletion, operations.

## When an agent wants to deviate

Ask it to state:

1. the exact constraint making the planned design unsuitable;
2. the smallest alternative;
3. effects on the Constitution, future stories, data migration, cost, and testing;
4. whether an ADR is required.

Accept a deviation only after recording it. Never let convenience silently turn the product into one prompt, one response, and one speech call.

## Recovering from a bad story attempt

If changes are uncommitted, preserve anything valuable in a patch or temporary branch before discarding work. If already committed, prefer a normal revert commit or a corrective story over rewriting shared history. Never expose or reuse a leaked key; revoke it immediately and follow the incident runbook once PA-064 exists.

