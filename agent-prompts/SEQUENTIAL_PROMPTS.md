# Sequential Coding-Agent Prompts

## How to use this file

For each agent session, paste the Global Preamble followed by exactly one numbered Story Prompt. Do not ask one session to implement multiple stories. The story details and acceptance criteria live in `docs/BACKLOG.md`; the prompt below adds implementation boundaries and completion evidence.

## Global Preamble — paste before every story

```text
You are implementing one story in the Personalized Audio Platform repository.

Before editing, read AGENTS.md, PRODUCT_CONSTITUTION.md, docs/CANONICAL_VISION.md, docs/MASTER_SPEC.md, docs/ARCHITECTURE.md, docs/DECISION_LOG.md, and the complete active story in docs/BACKLOG.md. Inspect the current repository and git diff. Treat existing user changes as intentional. If the active story conflicts with a higher-priority document, stop and report the exact conflict.

Implement only the active story and the smallest supporting changes required. Do not pre-build later stories, introduce unapproved vendors, collapse the staged generation pipeline, or expose server secrets. Keep domain logic free of framework/provider dependencies, validate external/model output, make expensive work idempotent, and preserve artifact lineage.

Write tests for success, boundary, and important failure paths. Run the narrow tests first, then the repository’s required lint, typecheck, test, and build commands that are available. Fix failures caused by your work. Update documentation, examples, configuration, and migrations when behavior changes. Do not mark the backlog checkbox complete; the owner does that after review.

Finish with: outcome; files changed; tests/checks and exact results; acceptance-criteria evidence; migrations/manual steps; risks/compromises; and whether the next story is unblocked. Never claim completion if acceptance criteria, tests, migrations, or production paths are placeholders.
```

## M0 — Foundation

### PA-001 prompt — Scaffold the monorepo

```text
Implement PA-001. Create the exact monorepo boundaries in docs/ARCHITECTURE.md using pnpm workspaces and Turborepo. Touch only root tooling/config, apps/web, apps/worker, shared-package skeletons, and setup documentation. Add minimal health/example entrypoints, strict TypeScript project references or equivalent, and smoke tests proving package imports flow inward. Do not add database, auth, provider, or product behavior. Verify a clean frozen install plus root lint, format check, typecheck, test, and both production builds.
```

### PA-002 prompt — Automated quality gates

```text
Implement PA-002. Add GitHub Actions and local scripts for the gates named in the story, using the existing package manager and task graph. Limit changes to CI, root scripts/config, and tiny temporary/removed proof fixtures. Include dependency caching keyed safely, PR concurrency, least-privilege workflow permissions, and readable failures. Do not add deployment. Prove each class of check is actually invoked and document branch-protection settings the owner must enable.
```

### PA-003 prompt — Typed configuration and secrets

```text
Implement PA-003. Build the config package with runtime validation and separate public/web/worker schemas. Touch config, app bootstraps, env examples, ignore/scan configuration, and tests. Use explicit allowlists for client exports; never spread process.env. Add redacted error rendering and test that sentinel secrets cannot enter browser bundles/config serialization. No real credentials or provider calls.
```

### PA-004 prompt — PostgreSQL and migrations

```text
Implement PA-004. Add Prisma/PostgreSQL, Docker Compose for local development, initial tables listed in the story, migration/seed/test workflows, and CI database support. Touch packages/db, compose/config, scripts, and documentation; make only minimal app health integration. Choose indexes and foreign-key behavior deliberately and generate no sample private content. Verify migrate-from-empty, rollback strategy documentation, and repository integration tests.
```

### PA-005 prompt — Domain and state machine

```text
Implement PA-005 entirely in packages/domain plus tests and necessary contract exports. Model branded IDs, settings, episode/stage states, failure categories, artifact refs, and legal transitions as pure code. Make illegal transitions impossible or explicit domain errors; cover every transition table row and retry/cancel/delete edge. Do not import database/framework/provider/config packages or persist anything.
```

### PA-006 prompt — Repositories and unit of work

```text
Implement PA-006. Define repository/unit-of-work ports in the application layer and Prisma adapters in packages/db. Map persistence records to domain objects explicitly. Implement atomic episode+job creation, owner scoping, optimistic concurrency where mutable state requires it, cursor pagination, and rollback tests. Do not add HTTP routes or queue leasing yet. Run PostgreSQL integration tests from a clean database.
```

### PA-007 prompt — Authentication and authorization

```text
Implement PA-007 using the repository’s chosen auth approach and record any new architectural decision. Touch web auth/session routes, middleware/helpers, database auth models if required, and authorization tests. Centralize require-user and owned-resource checks; never trust client user IDs. Add two-user adversarial integration coverage for every currently exposed resource operation. Document callback/provider setup without including secrets.
```

### PA-008 prompt — Application shell

```text
Implement PA-008 in apps/web and packages/ui. Build the responsive authenticated shell, navigation, tokens, primitives, loading/empty/error boundaries, reduced-motion handling, and theme behavior. Future routes may appear only as clearly disabled/feature-flagged navigation. Avoid final brand decisions and generated artwork. Add component/accessibility tests and Playwright keyboard/mobile shell smoke coverage.
```

## M1 — Prompt and script studio

### PA-009 prompt — Creation contracts and defaults

```text
Implement PA-009 in packages/contracts, domain/application logic, and tests. Encode every creation field and precedence rule from the Master Spec, preserving raw and resolved input with provenance. Define helpful user-safe validation errors and hard limits. Do not call a model or build UI. Use table-driven tests for every preset, auto value, custom duration, conflicting option, normalization, and precedence case.
```

### PA-010 prompt — Creation studio UI

```text
Implement PA-010 against the PA-009 contract. Build a prompt-first creation route with progressive disclosure, accessible controls, local/authenticated draft preservation, validation summary, and truthful feature flags. Touch web/UI and API draft persistence only; do not implement AI generation. Include responsive and keyboard tests plus Playwright cases for prompt-only submission, advanced controls, refresh recovery, and validation preservation.
```

### PA-011 prompt — Model gateway and prompt registry

```text
Implement PA-011. Define the structured TextGenerator port, versioned prompt registry, OpenAI Responses adapter, call metadata/usage records, retry classification, strict schema parsing, and deterministic fake. Keep SDK imports in packages/ai. Never expose raw reasoning or secrets and default logs to content-free metadata. Add contract tests for success, refusal, invalid schema, timeout, rate-limit, provider error, and fake determinism. Real calls must be opt-in and budget-capped.
```

### PA-012 prompt — Intent Interpreter

```text
Implement PA-012. Define ContentBrief v1 schema/domain validation, its versioned prompt, use case, persistence version record, and golden fixtures. Explicit user choices must be copied exactly or a validation conflict returned; model assumptions require labels. Include research signals but do not perform research. Evaluate vague, detailed, conflicting, current, high-stakes, beginner, expert, and entertainment requests. Store no chain-of-thought.
```

### PA-013 prompt — Preflight and confirmation

```text
Implement PA-013 across application use cases and web UI. Show a concise editable preflight derived from accepted ContentBrief values, including assumptions, runtime, research behavior, and a clearly labeled estimate band. Add idempotent confirmation that transactionally creates one episode/job placeholder. Do not start the durable worker pipeline before PA-014. Test double submit, retry, edit/re-interpret, skipped confirmation, ownership, and budget/policy blocks.
```

### PA-014 prompt — Durable PostgreSQL queue

```text
Implement PA-014 behind the JobQueue port. Touch queue/db/worker packages, migrations, operational docs, and integration tests. Implement transactional enqueue compatibility, SKIP-LOCKED-style leasing, opaque lease tokens, heartbeat/expiry, priority, delayed availability, jittered backoff, max attempts, cancellation, per-user/global concurrency, and graceful worker shutdown. Use fake time where useful and prove two workers cannot accept the same lease.
```

### PA-015 prompt — Workflow orchestrator

```text
Implement PA-015 in application/worker/domain layers. Build the explicit stage state machine, prerequisite checks, immutable StageAttempt lifecycle, accepted-artifact pointers, canonical input hashing, cancellation/budget gates, and resume logic. Use fake stage handlers; do not implement later actual planner/writer/render behavior. Test crash after external success, stale lease recovery, duplicate delivery, changed upstream hash, fatal block, retryable failure, and cancellation.
```

### PA-016 prompt — Content Planner

```text
Implement PA-016. Add EpisodePlan v1 schema, prompt, application stage handler, artifact persistence, deterministic validation, and golden fixtures for all four MVP formats and length/depth extremes. Allocate exact section seconds/words with tolerances and stable IDs. Accept an optional empty research slot for future use, but do not implement web research. Reject incoherent totals, empty/duplicate sections, missing transitions, and unknown upstream refs.
```

### PA-017 prompt — Audio-native Script Writer

```text
Implement PA-017. Add AudioScript v1, versioned writer prompt, handler, persistence, and fixtures. Represent the script as semantic spoken segments—not one blob—and encode auditory-writing requirements from the Constitution. For MVP use a single speaker while preserving speaker IDs. Validate segment/section refs, word/runtime budgets, empty text, visual-only phrasing markers, and stable ordering. Demonstrate format/tone/depth/prior-knowledge differences in eval fixtures.
```

### PA-018 prompt — Editorial review

```text
Implement PA-018. Add deterministic prechecks, EditorialReview v1, editor prompt, revised immutable ScriptVersion, render-approval gate, and findings UI/API representation. Score intent, structure, auditory clarity, pacing, runtime, repetition, safety, and factual-risk signals; true grounded fact checking comes in M3. Never overwrite the writer version. Test fatal vs blocking vs advisory findings, invalid revisions, runtime repair, and traceable original/revised lineage.
```

### PA-019 prompt — Voice Director

```text
Implement PA-019. Define provider-neutral VoicePlan v1, voice aliases, global/per-segment direction, speed, pronunciation entries, pause policy, prompt/handler, hashes, and tests. Explicit user pronunciations win. Reject or safely neutralize real-person imitation and unsupported delivery instructions. Do not call speech APIs. Keep provider voice IDs only in adapter configuration mappings, not domain artifacts.
```

### PA-020 prompt — Status, cancellation, and retry UI

```text
Implement PA-020. Add authenticated SSE from durable episode/job state, polling fallback, reconnect cursor/heartbeat, real progress derivation, and UI controls for cancel/retry. Touch web/application/queue integration and tests, not later audio functionality. Do not fake incremental percentages. Cover disconnect/reconnect, missed events, terminal state, duplicate commands, unauthorized subscription, cancelled lease, retry from checkpoint, and user-safe error categories.
```

## M2 — Audio MVP and premium player

### PA-021 prompt — Semantic speech chunking

```text
Implement PA-021 as pure audio/domain logic. Convert each approved semantic script segment into one stable RenderUnit below configured provider safety limits so its actual duration can drive synchronized transcript timing. Preserve IDs, ordering, direction, pronunciations, and planned pauses. Do not group segments unless a tested alignment capability can recover reliable per-segment timing. Never silently truncate or split blindly; return an explicit rewrite requirement for oversized units. Add property/table tests for Unicode, abbreviations, punctuation, exact boundaries, speaker changes, and hash stability.
```

### PA-022 prompt — Speech adapter

```text
Implement PA-022 behind SpeechRenderer. Add the OpenAI Audio speech adapter using current configured model/voice/instructions/speed and lossless output, plus timeouts, response validation, provider metadata, categorized failures, and deterministic WAV fake. Keep SDK code isolated and content out of default logs. Do not assemble files. Contract-test fakes and adapter parsing; provide an opt-in, budget-capped real smoke command and cite the current official API behavior in adapter docs.
```

### PA-023 prompt — Object storage

```text
Implement PA-023 behind ObjectStore with filesystem-development and S3-compatible adapters. Add safe owner-scoped opaque keys, atomic writes, metadata/head, short-lived range-capable signed reads, and bounded prefix deletion. Do not expose credentials or internal object keys to clients. Run one shared contract suite against both adapters (S3 via emulator), including traversal, collision, missing object, expired URL, partial write, and deletion isolation.
```

### PA-024 prompt — Render manifest and idempotency

```text
Implement PA-024 in domain/application/db/worker/audio. Persist immutable manifest versions and chunk attempts with exact input hash, config, order, object/checksum/duration, validation state, and accepted result. Integrate chunk rendering so duplicates converge and retries skip accepted identical chunks. No final assembly yet. Test concurrent delivery, crash after upload/before commit, changed one segment/voice, corrupt stored object, and provider failure.
```

### PA-025 prompt — FFmpeg assembly

```text
Implement PA-025 in packages/audio and worker integration. Wrap ffmpeg/ffprobe through injectable process interfaces, validate startup availability, insert planned silence, normalize conservatively, concatenate lossless chunks, encode a seekable MP3, and validate final media. Never concatenate MP3 bytes. Generate test tones/silence mechanically and test ordering, actual duration tolerance, corrupt input, process timeout, cleanup, and reproducible metadata. Document required binaries.
```

### PA-026 prompt — Chapters, transcript timing, waveform

```text
Implement PA-026. Derive monotonic chapter/segment timing from accepted actual chunk durations, build compact waveform peaks, persist Chapter/TranscriptSegment/MediaAsset records, and atomically publish required artifacts with `ready`. Touch media/application/db/worker APIs and tests. Reject out-of-bounds/overlapping timing and missing refs. Prove consumers never observe a ready episode with missing final audio or metadata.
```

### PA-027 prompt — Authorized playback URLs

```text
Implement PA-027. Add owner-authorized playback/download use cases and routes that validate episode readiness and sign only the episode’s accepted media asset for a short TTL. Support byte ranges through the chosen storage path and safe URL refresh. Do not proxy entire long files through memory. Test cross-user access, guessed IDs/keys, not-ready/deleted episodes, expiry, refresh, content disposition, and configured download disablement.
```

### PA-028 prompt — End-to-end audio pipeline

```text
Implement PA-028 by wiring existing stages into the worker and completing fake-provider E2E coverage. Avoid redesigning components unless integration exposes a documented defect. Add one budget-capped real-provider smoke harness for 5-minute Rundown, Deep Dive, Lecture, and single-host Podcast; keep it opt-in. Prove idempotent submit, observable stages, selective failed-chunk retry, ready publication, playable bytes, cancellation, and deletion. Write the Audio MVP operations runbook.
```

### PA-029 prompt — Episode library

```text
Implement PA-029 in web/application/db. Add owner-scoped cursor pagination, indexed text search, status/format filters, sorting, favorites, state-aware cards/actions, and empty/loading/error states. Avoid fetching transcripts/audio with list results. Add query-performance assertions or explain plans for expected indexes plus component/route/Playwright tests for large pagination, live job updates, failures, and cross-user isolation.
```

### PA-030 prompt — Premium player

```text
Implement PA-030 in web/UI against PA-027 media access. Build a polished accessible player with play/pause, ±15s, seek, speed, volume, chapter navigation, keyboard shortcuts, Media Session integration, responsive layout, and playback-URL refresh that preserves position. Display AI-voice disclosure before/at first play. Test media events with fakes and use Playwright for mobile/desktop controls, expiry recovery, load failure, and reduced motion.
```

### PA-031 prompt — Synchronized transcript and chapters

```text
Implement PA-031 using PA-026 metadata. Add active segment/chapter calculation, optional follow-scroll, click-to-seek, transcript search/highlights, virtualized rendering for long scripts, and accessible speaker/chapter semantics. Avoid announcing every time update to screen readers. Test timing boundaries, manual scroll disabling follow mode, keyboard seeking, search, large transcripts, missing timing, and mobile layout.
```

### PA-032 prompt — Playback progress

```text
Implement PA-032 across domain/application/db/web. Persist throttled position, playback rate, last-played time, media version, and completion; flush on meaningful lifecycle events without write storms. Resolve concurrent devices with a documented monotonic timestamp/version rule. Test near-end replay, stale media version, offline queue/reconnect, competing updates, anonymous behavior if supported, and library progress rendering.
```

### PA-033 prompt — Episode management

```text
Implement PA-033. Add owner-authorized rename, cancel, retry, regenerate-as-new-lineage, configured export/download, and asynchronous delete that revokes future access and removes dependent objects safely. Use confirmations and clear intermediate states. Never overwrite accepted artifact history. Test double delete, delete during render/playback, expired signed URLs, partial storage failure/retry, lineage, disabled export, and ownership.
```

### PA-034 prompt — Feedback and quality signals

```text
Implement PA-034. Add private episode feedback with overall rating, structured reasons, optional comment, transcript-segment link, and exact artifact/prompt/model versions. Build an unobtrusive player/page UI and a development/owner summary that aggregates without exposing other users’ text. Add abuse/length limits and authorization. Test edits, duplicate submissions, deleted episode references, segment validity, aggregation, and content-redacted telemetry.
```

## M3 — Grounded research

### PA-035 prompt — Research decision policy

```text
Implement PA-035 as deterministic domain/application policy plus fixtures. Resolve `off|auto|required` using user choice and explicit current, high-stakes, disputed, quote/source, and factual-risk signals from ContentBrief. Produce a public-safe explanation and mandatory limitation/block where appropriate. Do not search the web. Test ambiguous dates, historical topics, medical/legal/financial content, fiction, personal advice, “latest/yesterday,” and attempted suppression.
```

### PA-036 prompt — Web research adapter

```text
Implement PA-036 behind ResearchProvider using the OpenAI Responses API `web_search` tool. Capture genuine tool-returned source metadata, retrieval/as-of times, limits, usage, and provider IDs. Treat all page/source content as untrusted data, isolate it from instructions, and block unsafe server fetch destinations. Do not yet synthesize final claims. Add fakes and tests for invented URLs, prompt injection, tool limit, timeout, no results, duplicate URLs, and opt-in budget-capped smoke use.
```

### PA-037 prompt — Research Packet and evidence graph

```text
Implement PA-037. Define ResearchPacket v1 plus Source/Evidence/Claim mappings, canonicalization, uncertainty/conflict/gap representation, synthesis prompt, persistence, and validation. Preserve exact provenance from PA-036; a model may reference source IDs but never manufacture a source record. Test conflicting sources, stale/missing dates, duplicate canonical URLs, unsupported requested claim, inaccessible source, partial results, and claim confidence boundaries.
```

### PA-038 prompt — Ground the pipeline

```text
Implement PA-038 by extending planner/writer/editor inputs and schemas to use ResearchPacket claim IDs. Add evidence-coverage validators, date/as-of language rules, analysis-vs-fact markers, and editorial overstatement/drift findings. Keep non-research episodes backward compatible. Update prompt fixtures/evals rather than rewriting unrelated pipeline code. Test unknown IDs, missing required evidence, contradictory evidence, current facts without dates, and valid uncertainty language.
```

### PA-039 prompt — Sources and accuracy UI

```text
Implement PA-039. Add an episode sources panel showing research status/as-of, retained canonical source links, publication/retrieval dates, and relevant claim/segment context with safe external links. Add factual-issue feedback tied to a valid segment/claim. Do not expose scraped content beyond allowed summaries. Test no-research, partial/conflicted research, long source lists, unsafe URL schemes, cross-user access, deleted sources, and mobile/accessibility behavior.
```

### PA-040 prompt — Current briefing

```text
Implement PA-040 as a new grounded format using existing stages. Extend contracts/UI for timezone, coverage window, freshness and as-of; add format-specific planning/writing/editor prompts and dedupe within one briefing. Separate developments, context, implications, uncertainty, and watch list. Require research. Test stale stories, duplicate syndication, evolving stories, unsupported breaking language, empty news window, timezone boundary, and source-link integrity.
```

## M4 — Multi-speaker production

### PA-041 prompt — Dialogue contracts

```text
Implement PA-041 by evolving AudioScript/VoicePlan schemas and migrations to represent speakers and turns while reading all existing single-speaker artifacts. Add turn purpose and stable speaker IDs without provider voice IDs. Update validators, serializers, fixtures, and migration tests. Do not write dialogue or render multi-voice yet. Reject unknown speakers, empty/filler turns, excessive fragmentation, bad ordering, and lost claim/chapter references.
```

### PA-042 prompt — Production planner and casting

```text
Implement PA-042. Add production-mode planning/casting contracts and stage behavior for host+expert, two hosts, debate/moderator, and interview, with single host still default. Define participant role/purpose/style and map voice aliases without implying real participation. Add a previewable/editable cast plan and consent/policy checks. Test invalid role counts, duplicate voices, real-person impersonation, unbalanced debate roles, and backward compatibility.
```

### PA-043 prompt — Dialogue writer and editor

```text
Implement PA-043. Add versioned dialogue writer/editor prompts and evals. Every turn must have an instructional/narrative function; detect alternating monologues, agreement filler, repetition, fake quotations, caricature, and unequal good-faith debate. Preserve evidence claim IDs and runtime budgets. Test all production modes on technical and narrative topics, adversarial bias, short/long turns, participant consistency, and editorial repair lineage.
```

### PA-044 prompt — Multi-voice rendering

```text
Implement PA-044 by extending RenderUnit, hashes, manifests, speech dispatch, pause assembly, and transcript timing for speaker changes. Reuse all single-speaker behavior. Ensure each turn uses its cast voice/direction and can rerender independently. Test rapid alternation, same voice invalid configuration, pause boundaries, one-turn failure/retry, one-cast-change invalidation, duration/timing monotonicity, and deterministic fakes with distinguishable waveforms.
```

### PA-045 prompt — Multi-speaker UX

```text
Implement PA-045. Add progressively disclosed production-mode/cast controls, voice previews where safely available, and accessible speaker presentation in preflight, status, player, chapters, and transcript. Include clear AI and fictionalized-participant disclosure. Keep prompt-only/single-host path visually simplest. Test keyboard/mobile flows, unavailable voices, mode changes resetting invalid cast, transcript color-independent identification, and older episodes.
```

## M5 — Follow-ups, learning, and series

### PA-046 prompt — Lineage and follow-ups

```text
Implement PA-046. Add EpisodeLineage and follow-up commands for go deeper, shorten, alternate perspective, and continue, accepting selected segments plus custom instruction. Build a compact authoritative context packet from accepted parent artifacts/research/feedback; do not rely on conversational response chaining. Create a new episode every time. Test ownership, deleted parents, cyclic lineage prevention, idempotency, selected segment validity, source inheritance/freshness, and UI lineage navigation.
```

### PA-047 prompt — Ask about this

```text
Implement PA-047 text-first. Add owner-scoped episode Q&A using accepted transcript, summary, and research evidence, with versioned conversation records and retention/limits. Answers must distinguish episode content, cited evidence, uncertainty, and new analysis; no mutation of episode truth. Place a future realtime adapter boundary but do not build voice unless trivial and feature-flagged. Test injection, unsupported question, source citation, deletion, cross-user access, and budget/rate limits.
```

### PA-048 prompt — Recaps and quizzes

```text
Implement PA-048 from accepted objectives/script/evidence. Add versioned recap/quiz contracts, multiple-choice and short-answer support, explanations, concept IDs, attempts, and accessible responsive UI. Do not present quiz results as formal assessment. Test grounded answer keys, ambiguous questions, retries, partial completion, deleted episode, scoring, keyboard/screen-reader behavior, and protection against model-generated invalid answer indices.
```

### PA-049 prompt — Topic learning context

```text
Implement PA-049. Define compact topic-scoped LearningContext versions and transparent update rules from completed episodes, explicit user statements, feedback, and quizzes. Separate observed events from summarized assumptions; allow inspect/edit/delete/disable. Feed only relevant accepted context into future briefs. Test topic separation, contradictory evidence, stale confidence, context compaction, deletion propagation, personalization disabled, and no cross-user leakage.
```

### PA-050 prompt — Series/course planner

```text
Implement PA-050. Add Series and curriculum-plan contracts, planner prompt, persistence, review/edit API/UI, prerequisites, module/episode objectives, duration estimates, and budget preview. Planning must precede generation; never auto-render an entire course without explicit approval. Validate progression, uniqueness, coverage, prerequisites, and totals. Test beginner-to-advanced course, bounded mini-series, edits, reorder, conflicting goals, budget block, and prompt/model versioning.
```

### PA-051 prompt — Series experience

```text
Implement PA-051. Build series page, ordered episode statuses, progress, prerequisites, next action, and on-demand generation using relevant learning context. Preserve completed lineage when curriculum changes through versioning/mapping. Add library/player series navigation. Test locked/unlocked prerequisites, reorder, archived curriculum version, failed episode retry, completion, cross-device progress, deleted episode, and owner isolation.
```

## M6 — Personal media platform

### PA-052 prompt — Preference profiles

```text
Implement PA-052. Store explicit preferences separately from inferred hypotheses; inferred records need evidence refs, confidence, created/last-used times, and expiration/decay rules. Add inspect/edit/disable/reset/export UI and APIs. Never infer sensitive traits and never make one universal knowledge level. Test precedence, conflicting signals, decay, delete/disable, topic-specific knowledge, malicious evidence content, and cross-user isolation.
```

### PA-053 prompt — Applied personalization

```text
Implement PA-053. Integrate eligible preferences into request resolution, ContentBrief, planning, and preflight with per-choice provenance and a user-facing “Why this?” explanation. Explicit request settings always override; add no-personalization baseline. Update eval harness fixtures for personalized vs baseline outcomes without degrading prompt-only simplicity. Test stale/low-confidence inference, conflicting explicit input, disabled profile, explanation accuracy, and reproducibility.
```

### PA-054 prompt — Surprise Me

```text
Implement PA-054. Add discovery input for available time, mood/goal, interests, exclusions, and novelty; generate/rank a small structured topic candidate set before episode creation. Use research/currentness policy and content fingerprints/listening history to avoid repeats. Present topic, promise, fit explanation, runtime, and research expectation for acceptance unless auto-accept is explicitly enabled. Test cold start, overfitting, duplicate topics, exclusions, unsafe topic, no candidates, and idempotent acceptance.
```

### PA-055 prompt — Playlists and queue

```text
Implement PA-055. Add owner-scoped Playlist and ordered PlaylistEpisode data, APIs/UI, drag/keyboard reorder, and a persistent play queue integrated with the player. Only playable owned episodes may be added; handle an episode becoming unavailable. Test concurrent reorder, duplicates policy, delete cascade, queue advance/repeat behavior, cross-device state, large playlist pagination, keyboard/mobile accessibility, and cross-user attacks.
```

### PA-056 prompt — Program domain and scheduler

```text
Implement PA-056. Define Program/ProgramRun scheduling with IANA timezone, recurrence, topic mix, duration, research, freshness, dedupe, per-run/monthly budget, and lifecycle commands. Implement idempotent due scanning behind a Scheduler port and queue normal episode jobs. Do not generate final recurring content logic yet. Test daylight-saving gaps/overlaps, duplicate ticks, edits during due scan, pause/resume/skip/run-now/delete, budget block, and transaction failures.
```

### PA-057 prompt — Recurring briefings

```text
Implement PA-057 by composing current briefing, discovery, personalization, and Program runs. Persist coverage windows, chosen topics/stories, fingerprints, prior-run comparison, and lineage. Distinguish meaningful updates from repetition; never fill gaps with unsupported content. Test no-news windows, partial provider/source failure, same story materially updated, duplicated syndication, user-heard content, missed schedule catch-up, budget cancellation, and truthful reduced briefing.
```

### PA-058 prompt — Program management UI

```text
Implement PA-058. Build create/edit/preview and run-history UI with user-timezone next-run display, topic mix, duration, research, freshness, dedupe, and budget. Add clear pause/resume/skip/run-now/delete effects and links from runs to episodes. Test DST preview, validation, pending edit, duplicate action, budget/failure/duplicate skip states, mobile/keyboard access, and owner isolation.
```

## M7 — Production hardening and release

### PA-059 prompt — Usage, limits, and budgets

```text
Implement PA-059. Add an append-only UsageLedger with estimate/reservation/actual/adjustment entries for text, research, speech, storage, and jobs; add atomic per-user/global rate/concurrency/spend policies. Reconcile retries and provider usage without double counting. Build user-safe budget status and owner configuration. Test simultaneous reservations, cancellation, partial failure, duplicate callbacks, cached chunks, corrections, month boundary/timezone, provider outage, and auditability.
```

### PA-060 prompt — Observability and operations console

```text
Implement PA-060. Add correlation IDs and OpenTelemetry-compatible traces/metrics plus allowlisted structured logs across HTTP, queue, stages, providers, storage, assembly, and playback. Build an owner-only redacted operations console for job timeline, versions, costs, failure categories, safe cancel/retry. Do not display raw prompts/scripts/sources by default. Add tests that sentinel secrets/private content never reach telemetry and that privileged access is enforced.
```

### PA-061 prompt — Evaluation harness

```text
Implement PA-061. Create a versioned golden dataset and runner for intent, plan, script, research grounding, runtime, auditory style, tone/depth/format, dialogue, safety, and deterministic media checks. Support pinned rubric judges, repeat samples, baseline comparison, cost capture, threshold config, and human-reviewable Markdown/JSON reports. Do not hide variance behind one score. Add CI for cheap changed-stage fixtures and document budgeted full runs.
```

### PA-062 prompt — Privacy, deletion, export, retention

```text
Implement PA-062 across every persisted domain and object. Build understandable account export, staged/idempotent account deletion, cancellation of queued work, object/provider artifact cleanup where possible, context/preference removal, retention jobs, audit completion, and truthful policy templates. Preserve only legally/operationally required minimal records under explicit rules. Test failure/retry, active playback URLs, shared lineage, partial object deletion, queue race, export completeness, and final non-access.
```

### PA-063 prompt — Accessibility, performance, resilience

```text
Implement PA-063. Establish measurable CI budgets and fix core creation/library/player/transcript/series/program flows for keyboard, screen reader, contrast, reduced motion, responsive performance, and slow/offline/reconnect conditions. Use virtualization/pagination where measured. Test expired auth/media URLs, dropped SSE, offline progress, 60-minute transcript/audio, large library, background playback, low-memory mobile behavior, and recovery without losing user input.
```

### PA-064 prompt — Deployment and incident runbooks

```text
Implement PA-064. Add production web/worker container/build definitions, migration release step, health/readiness checks including ffmpeg, environment matrices, safe rollback, backup/restore scripts or provider-agnostic procedures, and runbooks listed in the story. Do not choose paid vendors without owner approval; keep deployment targets configurable. Perform a staging-like local rehearsal, restore a backup, simulate stuck jobs/provider outage, and record exact evidence.
```

### PA-065 prompt — Release rehearsal

```text
Implement PA-065 as verification and only fixes required by failed gates. Start from a clean clone/config, follow START_HERE and MANUAL_SETUP, run the chosen milestone’s full CI/evals, generate and play 5/20/45-minute representative episodes, exercise cancellation/selective retry/delete, and verify budgets, privacy, accessibility, backups, observability, and rollback. Produce versioned release notes and a pass/fail launch report with evidence, limitations, monitoring, rollback triggers, and deferred vision. Do not declare launch-ready with unresolved required failures.
```

## After each accepted story

The owner should:

1. review the diff and handoff evidence;
2. run or spot-check the commands independently;
3. resolve any open owner decision;
4. update the story checkbox in `docs/BACKLOG.md`;
5. append architectural decisions to `docs/DECISION_LOG.md`;
6. commit/merge with the story ID in the message;
7. begin the next unblocked story from updated `main`.
