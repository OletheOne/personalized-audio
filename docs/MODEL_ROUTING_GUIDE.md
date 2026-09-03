# Model Routing Guide for Cursor, Codex CLI, and Claude Code

## Recommended strategy

Use **Cursor Grok 4.6 as the primary implementation agent for every story**. Spend OpenAI and Anthropic subscription allowance on narrowly scoped planning or review checkpoints where a second model has unusually high leverage.

This is not a compromise-quality strategy. Grok 4.6 is a frontier coding and agentic model. The optimization is to avoid paying three strong models to independently rediscover and implement the same solution. One model builds; a different model challenges the risky parts.

### Default workflow

1. Run the story’s Global Preamble + numbered prompt in Cursor with Grok 4.6.
2. Let Grok inspect, implement, test, and perform its own acceptance-criteria audit.
3. If the routing table marks a premium checkpoint, run the small review prompt in the specified CLI against the diff.
4. Give the review findings—not the entire premium conversation—back to Grok for fixes.
5. Run tests and review the final diff yourself.
6. Commit only after the story passes.

### Why premium models review instead of build

- The implementation pass consumes the most context and output tokens.
- A review can focus on one diff, one story, and a few contracts.
- Cross-provider review reduces correlated blind spots.
- Grok retains the active Cursor context and can fix findings cheaply.
- Premium allowance remains available for the stories where architecture, security, concurrency, research integrity, or media correctness can create expensive future rework.

## Model roles

| Label | Model | Use |
| --- | --- | --- |
| **Grok Build** | Cursor Grok 4.6 | All story implementation, routine debugging, tests, docs, UI, refactors |
| **Sol Review** | `gpt-5.6-sol` in Codex CLI | Security, OpenAI integration, TypeScript correctness, concurrency, privacy, deployment, release review |
| **Opus Plan** | `claude-opus-5` in Claude Code | Difficult domain modeling, state machines, workflow design, long-horizon dependencies, nuanced product logic |
| **Sonnet Review** | `claude-sonnet-5` in Claude Code | Efficient UX, accessibility, schema, migration, and maintainability review |
| **Fable Audit** | `fable` / newest available Fable 5.1 | Optional one-time full-system audit at a major release only |

Use current aliases/picker entries when an exact model ID changes. Never quietly fall back to an older model; note the actual model used in the story handoff.

## Reasoning settings

### Cursor Grok 4.6

- Use **medium** for routine, well-bounded UI, CRUD, docs, and test stories if Cursor exposes effort.
- Use **high** for architecture, persistence, worker, AI, audio, research, and cross-cutting stories.
- Use **xhigh** only after a high-effort attempt fails or for a specific hard diagnosis. It should not be the project default.
- If Cursor does not expose reasoning effort, use its normal Grok 4.6 agent mode and control scope through the story prompt.

### Codex CLI

- Use GPT-5.6 Sol at **medium** for ordinary targeted reviews.
- Use **high** for authentication, queue/orchestration, media authorization, research injection, budgets, privacy deletion, and production operations.
- If allowance is tight, replace an **optional** Sol review with GPT-5.6 Terra at high effort. Keep Sol for the eleven minimum gate groups.
- Do not spend OpenAI allowance on Luna for this project while abundant Grok access already covers high-volume implementation.
- Avoid Max/Ultra for routine reviews. Ultra delegates to additional agents and spends more allowance.
- Keep Fast mode off. It increases speed by consuming substantially more credits and brings little value to asynchronous project work.

### Claude Code

- Use Sonnet 5 for efficient review.
- Use Opus 5 only for the stories explicitly marked **Opus Plan** or **Opus Review**.
- If Opus allowance is constrained, use Sonnet 5 at high effort for optional checkpoints; retain Opus for the minimum gate groups that call for it.
- Use normal speed. Fast mode is unnecessary for this project.
- Use Fable only at PA-065 if it is available and you still have comfortable allowance; otherwise use Opus 5.

## Subscription budget guardrails

Do not plan around a fixed message count. Both Codex and Claude usage vary with context, reasoning, tools, and output.

- Check Codex with `/status` before a premium checkpoint.
- Check Claude Code with `/usage` before a premium checkpoint.
- Preserve at least **35% of each premium allowance** for the final third of the current milestone.
- If either premium pool falls below that reserve, defer all checkpoints labeled optional.
- Never use a premium CLI for routine lint fixes, package installation, formatting, snapshots, or mechanical test updates.
- Start a fresh premium review session for each checkpoint. Long chat history is expensive and can distract the reviewer.
- Do not paste the entire 19,000-word build pack into review prompts. Let the CLI inspect the repository and point it to only the active story, Constitution, relevant architecture section, and diff.

## Review prompt templates

### Sol review

```text
Perform a read-only review of the current uncommitted diff for story PA-NNN. Do not edit files.

Read AGENTS.md, PRODUCT_CONSTITUTION.md, the PA-NNN backlog entry, the relevant sections of docs/ARCHITECTURE.md, and the changed files/tests. Review only for: [insert the focus from the routing table].

Identify concrete defects, security/correctness risks, violated acceptance criteria, missing failure tests, and unnecessary scope. Rank findings as critical/high/medium/low. For every finding, cite the file and explain a specific fix. If no material issues exist, say so explicitly. Do not propose unrelated features.
```

### Claude plan

```text
Create a read-only implementation plan for story PA-NNN. Do not edit files.

Read AGENTS.md, PRODUCT_CONSTITUTION.md, the PA-NNN backlog entry, relevant architecture/decision-log sections, and current related code. Resolve the hard design questions before implementation: [insert the focus from the routing table].

Return the recommended design, invariants, failure modes, transaction/concurrency boundaries, file-level change map, tests, migration implications, and decisions that require an ADR. Prefer the smallest design that satisfies the active story and preserves later milestones. Flag any conflict instead of inventing a workaround.
```

### Sonnet review

```text
Perform a read-only review of the current uncommitted diff for story PA-NNN. Do not edit files.

Read the PA-NNN backlog entry, changed files/tests, PRODUCT_CONSTITUTION.md, and only the relevant architecture section. Focus on: [insert the focus from the routing table].

Return a short prioritized list of concrete issues with file references and fixes. Check every acceptance criterion and important failure path. Avoid style preferences and unrelated redesigns.
```

## Story-by-story routing

“None” means Grok implements and self-reviews; you still review the diff and run tests. “Optional” means run only when premium usage is comfortably above the milestone reserve. Bold checkpoints are the highest-value recommendations, but only the gate groups below should be treated as mandatory before a serious public release.

### Minimum premium gate groups

To keep subscription usage realistic, combine related stories and run these **eleven** premium gates across the entire project:

1. **PA-007:** Sol security review of authentication and ownership.
2. **PA-014 + PA-015:** one Opus design review and one Sol concurrency review after both are integrated.
3. **PA-023 + PA-027:** one Sol review of private storage and media authorization.
4. **PA-035–PA-038:** one Opus source/claim design review and one Sol injection/integration review.
5. **PA-044:** one Opus/Sol review of multi-voice idempotency and timing.
6. **PA-047:** one Sol grounding and injection review of episode Q&A.
7. **PA-056 + PA-057:** one Opus review of scheduling, DST, freshness, and dedupe.
8. **PA-059 + PA-060:** one Sol review of atomic spend controls and redacted operations.
9. **PA-061:** one Opus review of evaluation validity and regression gates.
10. **PA-062:** one Sol privacy/deletion review.
11. **PA-064 + PA-065:** one Sol production/release review; add the optional Fable audit only if allowance remains.

Before the private M2 MVP, only gates 1–3 apply. The others do not consume anything until you build their later milestones.

| Story | Grok effort | Premium checkpoint | Focus |
| --- | --- | --- | --- |
| PA-001 | High | Sonnet Review — optional | Monorepo boundaries, task graph, strict TypeScript |
| PA-002 | Medium | None | CI correctness and caching are straightforward and testable |
| PA-003 | High | **Sol Review — high** | Secret boundaries, client bundle leakage, config failure modes |
| PA-004 | High | Sonnet Review — optional | Schema indexes, migration reproducibility, CI database setup |
| PA-005 | High | **Opus Plan** | Domain primitives, exhaustive episode/stage state machine, illegal transitions |
| PA-006 | High | **Opus Review** | Repository boundaries, transaction atomicity, optimistic conflicts, ownership |
| PA-007 | High | **Sol Review — high** | Authentication, authorization, cross-user enumeration and mutation attacks |
| PA-008 | Medium | Sonnet Review — optional | Accessibility primitives, responsive shell, future feature flags |
| PA-009 | High | None | Contract/default precedence is well covered by table-driven tests |
| PA-010 | Medium | Sonnet Review — optional | Prompt-first simplicity, progressive disclosure, accessibility |
| PA-011 | High | **Sol Review — high** | Current Responses API use, Structured Outputs, refusal/error/usage handling |
| PA-012 | High | Sonnet Review — optional | Explicit-vs-assumed intent, schema completeness, golden cases |
| PA-013 | Medium | None | Preflight/idempotent confirmation can be validated deterministically |
| PA-014 | High | **Opus Plan + Sol Review — high** | Leases, SKIP LOCKED behavior, heartbeats, stale recovery, shutdown races |
| PA-015 | High | **Opus Plan + Sol Review — high** | Workflow invariants, stage hashes, checkpoint reuse, crash consistency |
| PA-016 | High | Sonnet Review — optional | Runtime allocation and format-specific plan quality |
| PA-017 | High | Sonnet Review — optional | Audio-native prompt contract and meaningful format/tone differences |
| PA-018 | High | **Opus Review** | Editorial severity model, immutable revision lineage, blocking rules |
| PA-019 | High | None | Provider-neutral voice plan and deterministic hashes |
| PA-020 | High | Sonnet Review — optional | Truthful progress, SSE reconnect, accessible failure/cancel UI |
| PA-021 | High | None | Pure chunking invariants are strongly testable |
| PA-022 | High | **Sol Review — high** | Current Speech API contract, timeouts, retry categories, binary validation |
| PA-023 | High | **Sol Review — high** | Object-key isolation, traversal, signed URLs, credential exposure |
| PA-024 | High | **Opus Plan** | Render idempotency, concurrent duplicates, crash after upload/before commit |
| PA-025 | High | **Sol Review — high** | FFmpeg safety, process handling, lossless assembly, validation/cleanup |
| PA-026 | High | Sonnet Review — optional | Actual-duration timing, atomic ready publication, waveform payload |
| PA-027 | High | **Sol Review — high** | Owner authorization, range playback, signing only accepted assets |
| PA-028 | High | **Sol Review — medium** | End-to-end failure/retry/cancel/delete behavior and real-provider smoke scope |
| PA-029 | Medium | None | Indexed pagination/filtering and state-aware cards |
| PA-030 | High | **Sonnet Review** | Premium mobile player UX, media events, accessibility, expiry recovery |
| PA-031 | High | **Sonnet Review** | Transcript virtualization, focus/follow behavior, screen-reader noise |
| PA-032 | High | None | Progress conflict rules and write throttling are deterministic |
| PA-033 | High | **Sol Review — high** | Regeneration lineage, destructive deletion, stale signed access |
| PA-034 | Medium | None | Feedback persistence and aggregation |
| PA-035 | High | **Opus Plan** | Research-required policy for current, disputed, and high-stakes content |
| PA-036 | High | **Sol Review — high** | OpenAI web-search provenance, tool limits, prompt injection, unsafe fetching |
| PA-037 | High | **Opus Review** | Claim/evidence/source graph, conflicts, gaps, no invented provenance |
| PA-038 | High | **Sol Review — high** | Evidence enforcement, claim-ID integrity, drift and overstatement checks |
| PA-039 | Medium | Sonnet Review — optional | Sources UI clarity and safe external links |
| PA-040 | High | **Opus Review** | Freshness, dedupe, uncertainty, current-briefing editorial quality |
| PA-041 | High | None | Backward-compatible dialogue schema and migrations |
| PA-042 | High | Sonnet Review — optional | Casting roles, truthful fictionalization, valid mode controls |
| PA-043 | High | **Opus Review** | Natural dialogue, balanced debate, filler/repetition and evidence retention |
| PA-044 | High | **Opus Plan + Sol Review — high** | Multi-voice hashes, selective rerender, pauses, monotonic timing |
| PA-045 | Medium | **Sonnet Review** | Simple single-host default, speaker accessibility, disclosures |
| PA-046 | High | Opus Review — optional | Compact authoritative context, lineage, source freshness |
| PA-047 | High | **Sol Review — high** | Retrieval grounding, injection, citations, conversation ownership/limits |
| PA-048 | High | Sonnet Review — optional | Valid answer keys, learning UX, accessibility |
| PA-049 | High | **Opus Plan** | Topic-scoped learning context, evidence vs inference, deletion propagation |
| PA-050 | High | **Opus Plan** | Curriculum progression, prerequisites, budgeted on-demand generation |
| PA-051 | High | Sonnet Review — optional | Series progress and curriculum-version UX |
| PA-052 | High | **Opus Review** | Explicit vs inferred preferences, sensitive traits, decay and transparency |
| PA-053 | High | Sonnet Review — optional | Precedence and accurate “Why this?” explanations |
| PA-054 | High | **Opus Review** | Discovery quality, novelty, exclusions, avoiding filter bubbles/repetition |
| PA-055 | Medium | None | Playlist ordering and queue behavior are deterministic |
| PA-056 | High | **Opus Plan + Sol Review — high** | Schedules, timezones/DST, idempotent due runs, concurrent budget gates |
| PA-057 | High | **Opus Review** | Story dedupe vs material updates, partial-source honesty, freshness |
| PA-058 | Medium | Sonnet Review — optional | Timezone/budget/schedule clarity and control |
| PA-059 | High | **Sol Review — high** | Atomic reservations, reconciliation, retries, concurrent spend bypass |
| PA-060 | High | **Sol Review — high** | Telemetry redaction, privileged operations, correlation and safe actions |
| PA-061 | High | **Opus Plan + Sol Review — high** | Eval validity, variance, judge bias, regression thresholds, cost control |
| PA-062 | High | **Sol Review — high** | Complete deletion/export, queue races, retained records, signed-object access |
| PA-063 | High | **Sonnet Review** | Accessibility, mobile/background playback, performance and offline recovery |
| PA-064 | High | **Sol Review — high** | Deployment/rollback, migrations, backups, secret/key incidents, health checks |
| PA-065 | High | **Sol Review + optional Fable Audit** | Independent whole-release security/correctness audit and long-horizon vision drift |

## Premium checkpoint count

The table intentionally does **not** call a premium model for every story.

- Grok implementation: 65 stories.
- Minimum premium gates: eleven combined checkpoints across the full long-term platform, only three before the private M2 MVP.
- The remaining Sol/Opus/Sonnet entries in the table are optional quality upgrades when allowance is healthy.
- Fable: zero routine use; at most one major-release audit.

If this still consumes premium allowance too quickly, combine adjacent related reviews after both stories are implemented but before merge—for example PA-014 + PA-015, PA-022 + PA-023, PA-035–PA-038, or PA-059 + PA-060. Never combine so many changes that the reviewer cannot reason about them precisely.

## Escalation ladder when Grok struggles

1. Ask Grok to restate the failing invariant and minimize the reproduction.
2. Start a fresh Grok session with only the story, failing output, and relevant files.
3. Ask the appropriate premium model for a **read-only diagnosis**, not a rewrite.
4. Give the diagnosis to Grok to implement.
5. If two Grok repair attempts fail, let Sol or Opus implement only the isolated failing portion, then have Grok integrate and test it.

Do not switch models merely because the first test run failed. Tooling errors, incorrect environment setup, and ordinary type errors rarely justify premium usage.

## Milestone allocation

| Milestone | Premium priority |
| --- | --- |
| M0 Foundation | State machine, repositories, auth/secrets |
| M1 Script Studio | OpenAI gateway, durable queue, workflow/checkpoints, editorial gate |
| M2 Audio MVP | Speech/storage/media authorization, FFmpeg, player/accessibility |
| M3 Research | Research policy, genuine provenance, evidence grounding, injection |
| M4 Multi-speaker | Dialogue quality and multi-voice timing/idempotency |
| M5 Learning | Episode Q&A grounding, learning context, curriculum progression |
| M6 Personal Media | Preference safety, discovery/dedupe, scheduler/DST/budgets |
| M7 Hardening | Spend, privacy, observability, eval validity, deployment, release audit |

## Commands and usage habits

### Codex CLI

Use `/model` to select GPT-5.6 Sol and its reasoning effort. Use `/status` before and after expensive checkpoints. Use the built-in read-only review flow when available. Keep standard speed.

### Claude Code

Use `/model` to choose Sonnet 5 or Opus 5 and `/usage` to check plan consumption. Update Claude Code before expecting the newest models. Use a fresh session for each plan/review checkpoint.

### Cursor

Keep one implementation chat per story. When the context becomes cluttered, have Grok write a short story handoff into the chat, start a new chat, and point it to the branch/diff/tests rather than continuing indefinitely. Let repository docs carry long-term memory.

## Current-source notes

This routing was prepared September 2026 and should be reviewed at each milestone because model availability and subscription accounting change.

- OpenAI’s current model guide describes GPT-5.6 Sol as the strongest option for complex coding, research, and cybersecurity; Terra as the balanced workhorse; and Luna as the low-cost repeatable-work model: <https://developers.openai.com/codex/models>.
- OpenAI documents that usage depends on tokens, model, context, reasoning, and tools; Codex `/status` shows current allowance: <https://developers.openai.com/codex/pricing>.
- OpenAI documents that Fast mode uses higher credit multipliers and that Ultra uses delegation: <https://developers.openai.com/codex/speed>.
- xAI describes Grok 4.6 as a frontier coding/agentic model with configurable reasoning and a 500K-token context window: <https://docs.x.ai/developers/grok-4-6>.
- Anthropic describes Opus 5 for complex agentic coding, Sonnet 5 as the speed/intelligence balance, and Fable 5.1 for demanding long-horizon work: <https://docs.anthropic.com/en/docs/about-claude/models/overview>.
- Anthropic states that Claude Code shares the subscription pool with Claude and offers `/usage` for monitoring: <https://claude.com/pricing> and <https://code.claude.com/docs/en/costs>.
