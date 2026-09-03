# Ordered Feature and Story Backlog

This file replaces Jira. Work top to bottom. A story is complete only when every acceptance criterion is demonstrated and its prompt’s completion gate passes.

Status legend: `[ ]` not started · `[~]` active · `[x]` complete · `[!]` blocked

## Feature F0 — Repository and engineering foundation

### [ ] PA-001 — Scaffold the monorepo

**Goal:** Create the pnpm/Turborepo TypeScript structure defined in the architecture.  
**Depends on:** none.

**Acceptance criteria**

- Web and worker apps start with documented commands; shared packages compile under strict TypeScript.
- Root lint, format, typecheck, test, and build commands work from a clean install.
- No business logic or provider integration is fabricated; architecture boundaries and path aliases are enforced.

### [ ] PA-002 — Establish automated quality gates

**Goal:** Add local and GitHub Actions checks that protect `main`.  
**Depends on:** PA-001.

**Acceptance criteria**

- CI runs frozen install, lint, format check, typecheck, unit tests, and production builds.
- Pull-request concurrency cancels stale runs; caches never bypass correctness.
- A deliberately failing fixture proves each major gate blocks before it is removed.

### [ ] PA-003 — Add typed configuration and secret hygiene

**Goal:** Centralize environment parsing and prevent client/server secret confusion.  
**Depends on:** PA-001.

**Acceptance criteria**

- Typed configuration fails fast with useful messages and separates public, web-server, and worker-only values.
- `.env.example` contains names and safe explanations but no real values; secret scanning is enabled.
- Tests prove server-only secrets cannot enter the client configuration/export path.

### [ ] PA-004 — Create PostgreSQL schema and migration workflow

**Goal:** Establish Prisma/PostgreSQL, initial ownership entities, and repeatable migrations.  
**Depends on:** PA-003.

**Acceptance criteria**

- Local PostgreSQL starts with Docker Compose and migrations work from an empty database.
- Initial User, CreationRequest, Episode, GenerationJob, StageAttempt, and AuditEvent models have IDs, timestamps, ownership, and indexes.
- CI validates schema and runs repository integration tests against PostgreSQL.

### [ ] PA-005 — Define domain primitives and episode state machine

**Goal:** Make state, formats, settings, transitions, failures, and invariants framework-independent.  
**Depends on:** PA-001.

**Acceptance criteria**

- Domain types cover request settings, episode states, stage states, errors, and artifact references.
- Only legal transitions succeed; terminal, retry, cancel, and delete behavior have exhaustive unit tests.
- Domain package imports no framework, database, provider, queue, or environment package.

### [ ] PA-006 — Implement repositories and transactional unit of work

**Goal:** Add persistence ports and Prisma adapters without leaking ORM models into use cases.  
**Depends on:** PA-004, PA-005.

**Acceptance criteria**

- Repository interfaces support creation requests, episodes, jobs, attempts, and audit events.
- Episode creation and job enqueue record commit atomically in one transaction boundary.
- Integration tests cover ownership scoping, optimistic conflicts, rollback, and pagination.

### [ ] PA-007 — Add authentication and authorization

**Goal:** Provide secure user sessions and consistent resource ownership checks.  
**Depends on:** PA-004, PA-006.

**Acceptance criteria**

- User can sign in/out using the selected private-alpha provider; protected routes reject anonymous access.
- Every episode/request query and mutation is scoped to the authenticated owner.
- Authorization integration tests prove one user cannot enumerate, read, mutate, stream, sign, or delete another user’s resource.

### [ ] PA-008 — Build application shell and design foundation

**Goal:** Create the responsive visual system, navigation, loading/error states, and accessible primitives.  
**Depends on:** PA-001, PA-007.

**Acceptance criteria**

- Authenticated shell supports Create, Library, Playlists, Series, and Settings destinations with future items feature-flagged.
- Tokens and primitives provide consistent typography, color, spacing, focus, reduced motion, and dark/light behavior.
- Core shell passes keyboard navigation and automated accessibility smoke checks at mobile and desktop widths.

## Feature F1 — Prompt-first creation

### [ ] PA-009 — Define creation request contracts and defaults

**Goal:** Implement runtime schemas and deterministic resolution of explicit settings, preferences, and defaults.  
**Depends on:** PA-003, PA-005.

**Acceptance criteria**

- Schema covers the full core and advanced request contract in the Master Spec.
- Normalization preserves raw prompt/input and records resolved settings plus their source.
- Boundary, invalid combination, custom duration, and default precedence tests pass.

### [ ] PA-010 — Build the creation studio UI

**Goal:** Make free-form prompting primary while offering optional controls without friction.  
**Depends on:** PA-008, PA-009.

**Acceptance criteria**

- Large prompt input, four MVP formats, duration, depth, tone, source setting, and collapsible advanced controls are responsive and accessible.
- A user can submit only a prompt; drafts survive refresh and validation errors preserve input.
- UI copy speaks in listener outcomes, and post-MVP controls are not falsely presented as available.

### [ ] PA-011 — Create the model gateway and prompt registry

**Goal:** Add the OpenAI Responses adapter, structured-generation port, prompt versioning, and deterministic fake.  
**Depends on:** PA-003, PA-009.

**Acceptance criteria**

- Provider adapter uses server-side configuration, request timeouts, IDs, usage capture, and Structured Outputs.
- Prompt modules expose stage/version/schema metadata; attempt records retain configuration and input/output hashes.
- Fake adapter supports success, schema failure, timeout, rate limit, refusal, and retry tests without network calls.

### [ ] PA-012 — Implement Intent Interpreter

**Goal:** Turn a creation request into a validated Content Brief.  
**Depends on:** PA-011.

**Acceptance criteria**

- ContentBrief v1 schema covers audience, goal, format, depth, tone, runtime, constraints, questions, and research signals.
- Interpreter never silently discards explicit inputs and marks assumptions separately.
- Golden fixtures cover vague, precise, conflicting, beginner/expert, and sensitive/current requests.

### [ ] PA-013 — Build request preflight and confirmation

**Goal:** Show the interpreted request, research behavior, runtime, and cost band before expensive work when appropriate.  
**Depends on:** PA-010, PA-012.

**Acceptance criteria**

- Preflight presents editable choices and assumptions without exposing internal prompts or chain-of-thought.
- Confirmation creates one episode despite repeat clicks/network retries.
- User may skip confirmation under a saved preference while budget/policy blocks remain enforced.

## Feature F2 — Script-production pipeline

### [ ] PA-014 — Implement durable PostgreSQL job queue

**Goal:** Add leases, heartbeats, retries, scheduling, cancellation, and idempotent enqueue.  
**Depends on:** PA-006.

**Acceptance criteria**

- Multiple workers cannot lease the same job; stale leases recover safely.
- Backoff, max attempts, permanent failures, cancellation, priority, and per-user concurrency are tested.
- Worker shutdown releases or safely expires work without corrupting the episode.

### [ ] PA-015 — Implement workflow orchestrator and checkpoints

**Goal:** Advance episodes through versioned stages using accepted artifacts and input hashes.  
**Depends on:** PA-005, PA-011, PA-014.

**Acceptance criteria**

- Orchestrator enforces prerequisites and state transitions and records immutable stage attempts.
- Retry resumes at the first invalid/missing stage; unchanged accepted outputs are reused.
- Cancellation, schema failures, provider failures, and fatal editorial blocks result in correct states and audit events.

### [ ] PA-016 — Implement Content Planner

**Goal:** Convert brief (and later research) into a timed narrative plan.  
**Depends on:** PA-012, PA-015.

**Acceptance criteria**

- EpisodePlan v1 includes hook, ordered sections, purpose, target seconds/words, key points, transitions, and chapters.
- Total allocation respects target runtime and format-specific structure.
- Validators reject missing references, duplicate IDs, incoherent totals, and empty sections.

### [ ] PA-017 — Implement audio-native Script Writer

**Goal:** Generate semantic spoken segments from the accepted plan.  
**Depends on:** PA-016.

**Acceptance criteria**

- AudioScript v1 stores stable segment IDs, section/speaker, spoken text, pauses, pronunciation hints, claim IDs, and expected time.
- Prompt explicitly optimizes for cadence, auditory signposting, sentence length, useful repetition, transitions, and no visual-only references.
- Golden fixtures show meaningful differences across format, tone, depth, and prior knowledge.

### [ ] PA-018 — Implement editorial and factual review

**Goal:** Score and revise scripts before audio spend.  
**Depends on:** PA-017.

**Acceptance criteria**

- Review schema reports dimension scores, findings by severity, runtime analysis, revised script, and render decision.
- Deterministic validators run before/after the model review and block invalid references or runtime misses.
- Original and revised script versions remain traceable; fatal findings create `blocked`, not a misleading success.

### [ ] PA-019 — Implement Voice Director

**Goal:** Convert approved scripts into provider-neutral performance instructions.  
**Depends on:** PA-018.

**Acceptance criteria**

- VoicePlan v1 defines speaker aliases, delivery, speed, emotion, pauses, and pronunciation dictionary.
- User pronunciation overrides win and unsafe real-person imitation requests are rejected.
- Same input/config produces a stable render-plan hash.

### [ ] PA-020 — Add status streaming, progress, cancellation, and retry UI

**Goal:** Make real pipeline state understandable and controllable.  
**Depends on:** PA-013, PA-015.

**Acceptance criteria**

- SSE delivers actual stage/chunk progress with authenticated polling fallback and reconnect.
- Cancel and retry are idempotent and their available actions reflect real job state.
- Error copy distinguishes temporary, user-action, budget/policy, and permanent failures without exposing sensitive provider details.

## Feature F3 — Speech rendering and media assembly

### [ ] PA-021 — Implement semantic speech chunking

**Goal:** Create render units within provider limits without damaging speech structure.  
**Depends on:** PA-019.

**Acceptance criteria**

- MVP maps one semantic transcript segment to one render unit under configurable safe limits; future grouping requires reliable per-segment alignment.
- Oversized segments are rejected for rewrite rather than truncated.
- Tests cover punctuation, Unicode, abbreviations, dialogue changes, pauses, exact boundaries, and stable hashes.

### [ ] PA-022 — Implement Speech API adapter

**Goal:** Render lossless chunks with instructions, retries, metadata, and deterministic fakes.  
**Depends on:** PA-003, PA-011, PA-021.

**Acceptance criteria**

- Adapter supports current configured speech model/voice, instructions, speed, format, timeouts, and usage metadata.
- Failures are categorized; retry policy honors provider signals and never logs secret/content by default.
- Fake renderer emits valid deterministic WAV fixtures for end-to-end tests.

### [ ] PA-023 — Implement object storage adapters

**Goal:** Store private chunks/finals locally and in S3-compatible storage.  
**Depends on:** PA-003.

**Acceptance criteria**

- Port supports put, metadata/head, short-lived signed read, and safe owned-prefix deletion.
- Filesystem and S3 adapters pass the same contract suite.
- Keys are unguessable/owner-scoped and browsers never receive storage credentials or internal keys.

### [ ] PA-024 — Implement render manifest and chunk idempotency

**Goal:** Track each render input/output so successful work is safely reusable.  
**Depends on:** PA-021, PA-022, PA-023.

**Acceptance criteria**

- Manifest preserves order, text hash, voice config, attempt, stored object, checksum, duration, and validation result.
- A retry renders only missing/invalid chunks; concurrent duplicates resolve to one accepted result.
- Changed script/voice invalidates only affected chunks and their descendants.

### [ ] PA-025 — Implement FFmpeg assembly and validation

**Goal:** Produce one normalized, seekable final file and trustworthy media metadata.  
**Depends on:** PA-024.

**Acceptance criteria**

- Lossless chunks and planned pauses assemble in manifest order, then encode to final MP3.
- FFprobe validates decodability, duration, streams, sample rate/channels, and non-empty audio.
- Integration tests use generated tones/silence and verify order, duration tolerance, failure cleanup, and no raw MP3 concatenation.

### [ ] PA-026 — Generate chapters, timed transcript, and waveform

**Goal:** Derive navigable metadata from actual audio.  
**Depends on:** PA-025.

**Acceptance criteria**

- Chapter and transcript timing are monotonic, bounded by final duration, and map to stable script IDs.
- Waveform peaks are compact enough for web delivery and reproducible from the final file.
- Metadata and final audio become visible atomically when the episode reaches `ready`.

### [ ] PA-027 — Add media authorization and playback URLs

**Goal:** Serve private audio securely without breaking long playback sessions.  
**Depends on:** PA-007, PA-023, PA-026.

**Acceptance criteria**

- Owner-only endpoint issues short-lived range-compatible playback access.
- URL refresh preserves player position; unauthorized users cannot sign or infer another object.
- Download behavior and content disposition are controlled by configuration/policy.

### [ ] PA-028 — Complete end-to-end Audio MVP pipeline

**Goal:** Integrate request through ready episode with robust failure recovery.  
**Depends on:** PA-009–PA-027.

**Acceptance criteria**

- Deterministic fake-provider E2E test creates a prompt-only episode, observes stages, plays final audio, retries a failed chunk, and deletes it.
- Budget-capped real-provider smoke run generates representative 5-minute episodes in all four MVP formats.
- Runbook documents setup, expected time/cost signals, failure diagnosis, and cleanup.

## Feature F4 — Premium listening experience

### [ ] PA-029 — Build episode library

**Goal:** Let users find and manage drafts, active jobs, ready episodes, and failures.  
**Depends on:** PA-008, PA-020, PA-028.

**Acceptance criteria**

- Paginated library supports search, status/format filter, sort, save/favorite, and useful empty/error states.
- Cards display real title, duration/progress, format, creation time, and state-specific action.
- Queries remain owner-scoped and perform within documented database budgets.

### [ ] PA-030 — Build premium episode page and player

**Goal:** Deliver a polished podcast-style experience across desktop and mobile.  
**Depends on:** PA-027, PA-029.

**Acceptance criteria**

- Player supports play/pause, seek, ±15 seconds, speed, volume, chapters, keyboard, and Media Session API where available.
- UI includes title, summary, artwork treatment, duration, disclosure, and resilient loading/expired-URL recovery.
- Mobile background playback and desktop/mobile layouts pass the manual matrix.

### [ ] PA-031 — Add synchronized transcript and chapters UI

**Goal:** Make the episode scannable, searchable, and navigable while listening.  
**Depends on:** PA-026, PA-030.

**Acceptance criteria**

- Active segment/chapter follow audio without forced scroll; user can opt into follow mode.
- Clicking a chapter or transcript segment seeks accurately; transcript search highlights matches.
- Screen readers receive meaningful speaker/chapter structure without noisy time updates.

### [ ] PA-032 — Persist playback progress and completion

**Goal:** Resume listening across sessions/devices.  
**Depends on:** PA-030.

**Acceptance criteria**

- Throttled progress updates persist position, speed, last-played time, and completion.
- Resume logic handles near-end replay, changed media versions, offline interruptions, and concurrent devices.
- Library shows progress without turning every play tick into a database write.

### [ ] PA-033 — Add episode management and export

**Goal:** Rename, regenerate, download (if enabled), cancel, retry, and delete safely.  
**Depends on:** PA-028, PA-030.

**Acceptance criteria**

- Destructive actions require clear confirmation and report background deletion state.
- Regeneration creates lineage/version history rather than overwriting the source episode.
- Delete removes or queues removal of every owned media object and no stale URL remains usable beyond its TTL.

### [ ] PA-034 — Add feedback and quality signals

**Goal:** Capture useful product-quality feedback without interrupting listening.  
**Depends on:** PA-030.

**Acceptance criteria**

- User can rate the episode and select/comment on accuracy, pacing, depth, style, voice, repetition, or technical issues.
- Feedback links to artifact/prompt/model versions and is private.
- Admin/development view summarizes trends without exposing other users’ content.

## Feature F5 — Grounded research

### [ ] PA-035 — Implement research decision policy

**Goal:** Decide when sources are off, optional, or mandatory using explicit and deterministic signals.  
**Depends on:** PA-012.

**Acceptance criteria**

- Policy covers current, high-stakes, disputed, quote/source-seeking, and user-required cases.
- `off` cannot suppress mandatory safety behavior and produces a clear limitation where appropriate.
- Unit/golden tests make decisions explainable and stable.

### [ ] PA-036 — Implement web research adapter and source capture

**Goal:** Use Responses API web search and retain genuine provenance.  
**Depends on:** PA-011, PA-035.

**Acceptance criteria**

- Adapter captures returned source URLs/titles/tool metadata, retrieval time, and `asOf` without accepting invented citations.
- Research content is delimited as untrusted data and prompt-injection fixtures cannot change tools/instructions.
- Limits exist for queries, tool calls, source count, time, and spend.

### [ ] PA-037 — Build Research Packet and claim-evidence graph

**Goal:** Synthesize sources into claims, supporting/conflicting evidence, uncertainty, and gaps.  
**Depends on:** PA-036.

**Acceptance criteria**

- ResearchPacket v1 and relational records preserve claim-to-evidence-to-source mapping.
- Unsupported or conflicting claims are visible and cannot be labeled verified.
- Duplicate/canonicalized sources and inaccessible/stale results are handled explicitly.

### [ ] PA-038 — Ground planning, writing, and editorial review

**Goal:** Make research constrain generation instead of becoming decorative citations.  
**Depends on:** PA-016–PA-018, PA-037.

**Acceptance criteria**

- Plan/script segments cite claim IDs; validators reject unknown IDs and required unsupported claims.
- Editorial review flags evidence drift, overstatement, missing dates, and analysis presented as fact.
- Non-researched general knowledge is clearly distinguishable in the internal artifact model.

### [ ] PA-039 — Build sources and accuracy UI

**Goal:** Let listeners understand when and how an episode was grounded.  
**Depends on:** PA-030, PA-038.

**Acceptance criteria**

- Episode shows research status/date, source list, and claim context without cluttering playback.
- Links use retained canonical URLs and safe external-link behavior.
- User can report a factual issue tied to a transcript segment.

### [ ] PA-040 — Add current briefing format

**Goal:** Generate prioritized, time-bounded, source-grounded news-style audio.  
**Depends on:** PA-035–PA-039.

**Acceptance criteria**

- Brief requests include timezone, coverage window, freshness requirements, and an explicit `asOf`.
- Structure separates developments, context, implications, uncertainty, and watch list.
- Tests prevent stale stories, duplicated developments, and unsupported “breaking” language.

## Feature F6 — Multi-speaker production

### [ ] PA-041 — Extend script contracts for dialogue

**Goal:** Support speaker turns while retaining semantic segments, evidence, chapters, and timing.  
**Depends on:** PA-017, PA-019.

**Acceptance criteria**

- Schemas support speaker roles and turns without breaking single-narrator episodes.
- Validators prevent unknown speakers, empty/filler turns, implausible turn fragmentation, and citation loss.
- Migrations preserve all existing scripts.

### [ ] PA-042 — Implement production-mode planner and casting

**Goal:** Define the conversational function and voice profile of each participant.  
**Depends on:** PA-041.

**Acceptance criteria**

- Modes cover one host, host + expert, two hosts, debate/moderator, and interview.
- Cast roles are fictional/general unless real participation is truthful and allowed; UI never implies a real guest appeared.
- Voice selection prevents duplicate voices and records a user-previewable casting plan.

### [ ] PA-043 — Implement dialogue writer and editor

**Goal:** Produce natural, informative conversation rather than alternating monologues or filler.  
**Depends on:** PA-042.

**Acceptance criteria**

- Turns serve explicit functions such as explain, question, challenge, clarify, synthesize, or transition.
- Editor detects filler agreement loops, repetitive restatement, caricatured opposition, and unbalanced debate.
- Golden evals compare all production modes across technical and narrative topics.

### [ ] PA-044 — Render and assemble multiple voices

**Goal:** Extend chunking/manifests/assembly for speaker changes and conversational pauses.  
**Depends on:** PA-024–PA-026, PA-043.

**Acceptance criteria**

- Each turn receives the correct configured voice/direction; cache hashes include speaker performance configuration.
- Assembly inserts intentional gaps and yields monotonic transcript timing across speaker changes.
- Selective rerender of one speaker turn does not force unaffected turns to rerender.

### [ ] PA-045 — Build multi-speaker controls and playback presentation

**Goal:** Let users choose production mode and understand who is speaking.  
**Depends on:** PA-010, PA-031, PA-044.

**Acceptance criteria**

- Creation controls expose valid mode/voice choices progressively.
- Player/transcript identify speakers accessibly and show AI/fictionalized-participant disclosure.
- Single-host creation remains the simplest default.

## Feature F7 — Follow-ups, learning, and series

### [ ] PA-046 — Implement episode lineage and follow-up actions

**Goal:** Create deep dives, shorter versions, alternate perspectives, and continuations with explicit ancestry.  
**Depends on:** PA-033, PA-038.

**Acceptance criteria**

- Follow-up command stores parent, action, selected segments, and user instruction.
- It passes a compact authoritative context packet rather than relying on opaque chat continuation.
- UI displays lineage and never overwrites the parent episode.

### [ ] PA-047 — Add episode Q&A (“Ask about this”)

**Goal:** Answer questions grounded in the episode, transcript, and source packet.  
**Depends on:** PA-039, PA-046.

**Acceptance criteria**

- Responses distinguish episode content, sources, and new analysis; citations link to retained evidence.
- Conversation access is owner-scoped and has limits/retention controls.
- Realtime voice may be added behind a port, but text Q&A works first and does not mutate episode truth.

### [ ] PA-048 — Generate recaps and quizzes

**Goal:** Reinforce learning using objectives and covered concepts.  
**Depends on:** PA-046.

**Acceptance criteria**

- Recap and quiz derive from the accepted script/evidence, not unrelated model memory.
- Quiz supports answer, explanation, concept mapping, and retry without claiming formal assessment.
- Accessibility and feedback work on mobile and keyboard.

### [ ] PA-049 — Implement topic learning context

**Goal:** Retain what a user has heard, assumed, skipped, or struggled with across episodes.  
**Depends on:** PA-032, PA-048.

**Acceptance criteria**

- Context is compact, topic-scoped, versioned, inspectable, and editable.
- Completion, feedback, quiz results, and explicit statements update it through transparent rules.
- Deleting history/context removes it from future generation inputs.

### [ ] PA-050 — Build series and course planner

**Goal:** Turn broad learning goals into ordered curricula before episodes are generated.  
**Depends on:** PA-012, PA-049.

**Acceptance criteria**

- Series plan contains promise, audience, modules, prerequisites, episode objectives, estimated durations, and completion criteria.
- User reviews/edits the plan; generation occurs on demand or within an approved budget.
- Validators catch duplicate objectives, missing prerequisites, and incoherent progression.

### [ ] PA-051 — Build series experience and progress

**Goal:** Navigate, continue, and understand progress through a personalized sequence.  
**Depends on:** PA-029, PA-050.

**Acceptance criteria**

- Series page shows ordered episodes, status, progress, prerequisites, next action, and overall completion.
- Later episodes receive compact learning context and may reference earlier material accurately.
- Reordering or editing a curriculum does not corrupt completed episode lineage.

## Feature F8 — Personal media platform

### [ ] PA-052 — Implement transparent preference profiles

**Goal:** Store explicit preferences and cautious, evidence-backed inferences.  
**Depends on:** PA-009, PA-034, PA-049.

**Acceptance criteria**

- Explicit and inferred values are separate; inferred values include confidence/evidence/last-used.
- Users can inspect, edit, disable, reset, and export preferences.
- Explicit per-request choices always win and tests prevent sensitive-trait inference.

### [ ] PA-053 — Apply personalization with explanations

**Goal:** Improve defaults/plans without making creation unpredictable.  
**Depends on:** PA-052.

**Acceptance criteria**

- Resolved settings record which preferences were applied.
- “Why this?” explains material choices in ordinary language.
- A no-personalization mode produces a clean baseline and evaluation compares both modes.

### [ ] PA-054 — Build “Surprise Me” discovery

**Goal:** Propose something compelling for the listener’s available time, mood, and interests.  
**Depends on:** PA-035–PA-040, PA-052–PA-053.

**Acceptance criteria**

- User can provide time, goal/mood, interests, exclusions, and novelty or accept defaults.
- System ranks topic candidates before generation and filters near-duplicates of heard content.
- User sees/accepts the proposed topic and why it fits before expensive rendering unless auto-accept is enabled.

### [ ] PA-055 — Add playlists and queue

**Goal:** Organize generated listening and control what plays next.  
**Depends on:** PA-029–PA-032.

**Acceptance criteria**

- Users create/reorder/delete playlists and add/remove only owned playable episodes.
- Player advances through queue reliably and persists ordering.
- Deleting an episode removes playlist references without corrupting playback.

### [ ] PA-056 — Implement recurring Program domain and scheduler

**Goal:** Define scheduled personalized programs with timezone, freshness, dedupe, and budget rules.  
**Depends on:** PA-014, PA-040, PA-052.

**Acceptance criteria**

- Program stores schedule/timezone, duration, topic mix, research, freshness, duplicate policy, and spend ceiling.
- Due-run creation is idempotent across duplicate scheduler calls and daylight-saving transitions.
- Pause/resume/skip/run-now/delete actions are audited and budget gates block safely.

### [ ] PA-057 — Generate recurring personalized briefings

**Goal:** Create program episodes that are fresh, non-repetitive, and tailored to listening history.  
**Depends on:** PA-054, PA-056.

**Acceptance criteria**

- Program run records coverage window, selected stories/topics, content fingerprints, and lineage.
- Dedupe checks prior runs and heard content while allowing material updates to the same story.
- Partial source/provider failure yields an honest reduced briefing or safe failure, never invented filler.

### [ ] PA-058 — Build Program management UI

**Goal:** Let users create and control recurring programming without hidden automation.  
**Depends on:** PA-056, PA-057.

**Acceptance criteria**

- UI previews schedule in user timezone, next run, topic mix, duration, research, and budget.
- Pause, resume, skip, run now, edit, and delete clearly explain effects.
- Run history links to generated episodes and shows failures/duplicates/budget skips.

## Feature F9 — Production hardening and release

### [ ] PA-059 — Add usage ledger, rate limits, and budgets

**Goal:** Prevent unexpected spend and abuse across model, research, speech, and storage.  
**Depends on:** PA-011, PA-014, PA-022.

**Acceptance criteria**

- Estimate/reserve/reconcile ledger records usage by user, episode, stage, provider, and model.
- Atomic per-user/global limits stop concurrent bypass; UI communicates actionable budget states.
- Tests cover duplicate callbacks, retries, cancellations, partial work, and provider usage corrections.

### [ ] PA-060 — Add observability and redacted operations console

**Goal:** Diagnose jobs and quality without exposing private content.  
**Depends on:** all stage implementations.

**Acceptance criteria**

- Correlated logs, traces, and metrics cover request/job/stage/provider/chunk/playback lifecycles.
- Allowlisted structured logging excludes secrets and full prompt/script/source text by default.
- Owner-only operations view supports job timeline, safe retry/cancel, version IDs, costs, and failure category.

### [ ] PA-061 — Build comprehensive evaluation harness

**Goal:** Detect quality regressions across prompts, models, formats, sources, and voices.  
**Depends on:** PA-018, PA-028, PA-038, PA-043.

**Acceptance criteria**

- Versioned golden dataset spans domains, depths, formats, lengths, current/disputed topics, and adversarial inputs.
- Deterministic and rubric-based scores cover every quality dimension in the Master Spec.
- Baseline comparison produces a human-reviewable report and CI blocks material regression under documented thresholds.

### [ ] PA-062 — Complete privacy, deletion, export, and retention

**Goal:** Give users control over prompts, artifacts, personalization, audio, and account data.  
**Depends on:** all persisted feature domains.

**Acceptance criteria**

- User export is complete and understandable; deletion includes DB rows, objects, queued jobs, derived contexts, and provider-side artifacts where applicable.
- Retention/lifecycle jobs are idempotent, observable, and tested against signed URL expiry.
- Privacy/terms templates accurately describe implemented behavior and AI-generated voice disclosure.

### [ ] PA-063 — Finish accessibility, performance, and resilience

**Goal:** Make core creation/listening reliable for real users and devices.  
**Depends on:** all major UI features.

**Acceptance criteria**

- Automated accessibility and performance budgets run in CI; manual keyboard/screen-reader/mobile matrix is documented and completed.
- Slow/offline/reconnecting/expired-session/expired-media cases preserve work and explain recovery.
- Large libraries/transcripts and 60-minute audio meet measured UI/query/memory targets.

### [ ] PA-064 — Create deployment, backup, and incident runbooks

**Goal:** Operate web, worker, database, storage, scheduler, and providers safely.  
**Depends on:** PA-059–PA-063.

**Acceptance criteria**

- Staging/production deployment is repeatable with migrations, health checks, secrets, and rollback.
- Backup/restore and object recovery/retention behavior are tested, not merely documented.
- Runbooks cover stuck jobs, provider outage, queue backlog, cost spike, bad prompt/model rollout, bad migration, and leaked key.

### [ ] PA-065 — Run release rehearsal and launch gate

**Goal:** Prove the complete platform increment is ready for its intended audience.  
**Depends on:** PA-001–PA-064 for the chosen release milestone.

**Acceptance criteria**

- Clean-environment rehearsal follows `START_HERE`, generates and plays 5/20/45-minute episodes, exercises failure/retry/delete, and records evidence.
- Security, privacy, eval, accessibility, reliability, cost, backup, and owner-choice checklists have explicit pass/fail status.
- Release notes list delivered scope, deferred vision, known limitations, monitoring, rollback trigger, and next story.
