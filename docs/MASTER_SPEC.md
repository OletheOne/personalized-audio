# Master Product Specification

## 1. Product statement

Turn nearly any natural-language request into personalized audio worth listening to.

The system behaves like an editorial and production team: it interprets intent, designs the program, optionally researches it, writes for the ear, edits and verifies the script, directs the performance, renders the audio, and delivers it through a premium listening experience.

## 2. Product goals

### MVP goals

- A blank-state user can request an episode with one sentence and no settings.
- Optional format, duration, depth, tone, and advanced controls meaningfully change the result.
- Every generated script is structured and written for auditory comprehension.
- An approved script becomes reliable, downloadable audio through a retryable job.
- The finished episode has a title, summary, chapters, synchronized transcript, artwork treatment, duration, generation status, and clear AI-voice disclosure.
- A failure explains what happened, preserves completed work, and can resume without repaying for successful stages.

### Platform goals

- Ground claims in current/reliable sources when requested or required.
- Support one host, host + expert, two hosts, debate, and interview productions.
- Let users branch, shorten, deepen, challenge, quiz, or continue an episode.
- Build ordered series and courses with retained learning context and progress.
- Learn explicit and inferred preferences under user control.
- Generate discovery content and recurring personal programs without repetition.

### Non-goals for MVP

- Live radio or fully realtime generation.
- Voice cloning or celebrity imitation.
- Public creator marketplace, social feed, ads, or monetization.
- Native iOS/Android apps; the web app must nevertheless be responsive and installable later.
- Fully autonomous publishing without a budget, schedule, and user-owned configuration.

## 3. Primary jobs to be done

1. **Learn:** “Teach me a subject at my level in the time I have.”
2. **Understand:** “Give me the background and competing perspectives I need.”
3. **Prepare:** “Give me a briefing before a meeting, book, trip, or event.”
4. **Review:** “Help me retain material with recaps and quizzes.”
5. **Explore:** “Choose something fascinating that fits my interests and mood.”
6. **Follow:** “Keep me updated on selected topics without repeating old information.”
7. **Enjoy:** “Turn an idea into a compelling documentary, story, or conversational show.”

## 4. Product vocabulary

| Term | Meaning |
| --- | --- |
| Creation request | User prompt plus optional controls and inherited preferences |
| Content brief | Structured interpretation of goal, audience, format, scope, constraints, and research need |
| Research packet | Sources, extracted claims, dates, contradictions, confidence, and citation mapping |
| Episode plan | Ordered sections with purpose, target time, key points, and narrative transitions |
| Script | Versioned, audio-native spoken content represented as semantic segments |
| Voice plan | Speakers, assigned voices, delivery instructions, pronunciation entries, and pauses |
| Render manifest | Ordered mapping of script segments to chunk inputs, provider responses, files, durations, and checksums |
| Episode | User-facing aggregate containing status, metadata, script, audio, chapters, and lineage |
| Learning context | Compact facts about what this user has already heard, learned, skipped, or requested in a topic/series |
| Program | A recurring rule that generates episodes on a schedule |

## 5. Creation request contract

### Required

- `prompt`: 1–10,000 characters of free-form user intent.

### Optional core controls

- `format`: `rundown | deep_dive | lecture | podcast | auto`
- `targetMinutes`: `5 | 10 | 20 | 30 | 45 | 60 | custom`
- `depth`: `eli5 | beginner | intermediate | advanced | expert | auto`
- `tone`: one or more of `straightforward | conversational | entertaining | academic | dramatic | funny | calm | story_driven | auto`

### Optional advanced controls

- prior knowledge;
- specific questions;
- focus areas;
- exclusions;
- examples on/off;
- analogies on/off;
- opposing perspectives on/off;
- recap on/off;
- quiz on/off;
- pronunciation entries;
- pace preference;
- current/reliable sources setting: `auto | required | off`;
- custom duration and custom style instructions.

Defaults are resolved in this order: explicit request → saved user preference → intelligent format default → system default. The stored request retains both raw inputs and resolved values.

## 6. Format behavior

| Format | Listening promise | Default structure |
| --- | --- | --- |
| Rundown | Fast orientation without feeling shallow | hook → essentials → why it matters → recap |
| Deep Dive | Connected explanation with causes, nuance, examples, and consequences | hook → foundation → thematic/chronological sections → synthesis → recap |
| Lecture | Deliberate teaching with definitions, progressive concepts, and checkpoints | objectives → foundation → modules → examples → recap |
| Podcast (MVP) | Conversational single-host presentation | cold open → setup → conversational sections → takeaway |
| Story | Narrative immersion | scene/hook → characters/context → rising action → resolution/reflection |
| Documentary | Evidence-led narrative | cold open → context → evidence/voices → interpretation → conclusion |
| Briefing | Timely, prioritized, source-grounded update | headlines → key developments → implications → watch list |
| Study session | Retrieval and reinforcement | objectives → teach → examples → recall prompts → recap/quiz |
| Debate | Good-faith opposing cases | framing → strongest case A → strongest case B → rebuttals → synthesis |
| Interview | Question-led exploration | guest framing → progressive questions → challenges → closing takeaway |

Post-MVP formats must reuse the same content-brief and segment contracts rather than fork the entire pipeline.

## 7. Runtime budget

Estimate spoken duration using format/tone-specific words per minute, not one global number. Store the chosen WPM assumption. The planner allocates seconds per section; the editor enforces a final word-budget range. A script passes when expected runtime is within ±10% of target for episodes up to 30 minutes and ±7.5% for longer episodes. The final displayed duration comes from FFprobe, never an estimate.

## 8. Generation workflow

1. **Validate and moderate request.** Reject malformed or disallowed work before costly generation.
2. **Resolve preferences.** Merge explicit settings and transparent user defaults.
3. **Interpret intent.** Produce a schema-valid Content Brief.
4. **Decide research.** Use deterministic rules plus the brief. Time-sensitive, high-stakes, disputed, quote-seeking, or explicitly sourced topics require research.
5. **Research when enabled.** Gather sources and build a claim-level packet. Preserve provenance.
6. **Plan.** Allocate the episode’s narrative arc, sections, key points, and time budget.
7. **Write.** Generate semantic spoken segments grounded only as required by the packet and plan.
8. **Edit/fact-check.** Return findings and a revised script. Block rendering on fatal findings.
9. **Direct voice.** Assign speaker/voice/delivery/pronunciation metadata.
10. **Chunk and render.** Create provider-safe semantic chunks, render idempotently, and retry only failed chunks.
11. **Assemble.** Normalize, concatenate, encode, inspect, create chapter times/waveform, and upload.
12. **Publish to the library.** Atomically mark the episode playable after required artifacts exist.

At each step, the application—not a model—validates state transitions, schemas, ownership, budgets, and retry rules.

## 9. Episode state model

Canonical states:

`draft → queued → interpreting → researching? → planning → scripting → editing → directing → rendering → assembling → ready`

Terminal/side states:

- `failed`: retryable or permanent error with last successful checkpoint;
- `cancelled`: user cancellation; no new work may begin;
- `blocked`: policy, budget, or editorial finding requires user action;
- `deleting`: objects and dependent records are being removed.

Progress is derived from completed stages and chunk counts. A status message must describe the real stage, not simulate progress.

## 10. Functional requirements

### Creation

- Prompt-first responsive creation surface.
- Core settings visible without overwhelming the page; advanced settings collapsed.
- Autosave draft request locally and server-side when authenticated.
- Preflight summary shows interpreted choices, runtime estimate, research behavior, and estimated cost band before generation when cost is meaningful.
- A submitted request creates exactly one episode/job despite double-clicks or network retries.

### Generation status

- Live status via server-sent events with polling fallback.
- Stage, progress, non-sensitive status text, cancellation, and retry.
- Partial script/outline preview only when it is stable and clearly labeled.
- Permanent errors give a next action; retryable errors preserve checkpoints.

### Episode library

- Search, filter, sort, favorite/save, playlist membership, and generation status.
- Cards show title, format, duration, topic, created date, progress, and artwork treatment.
- Empty state returns the user to creation with example prompts.

### Player

- Play/pause, ±15 seconds, seek, playback speed, volume, chapter navigation, duration, elapsed/remaining time.
- Media Session API metadata and controls where supported.
- Resume position across devices for signed-in users.
- Background playback, keyboard control, responsive mobile layout, and accessible labels/focus.
- Short-lived signed audio URL refresh without losing playback position.
- Clear disclosure that the narration is AI-generated.

### Transcript and chapters

- Segment-level timed transcript highlighting the current segment.
- Clicking transcript text seeks playback.
- Chapter list seeks and reflects the active chapter.
- Search within transcript.
- User-selectable copy/download subject to policy.

### Recovery and editing

- Retry from the last valid checkpoint.
- Regenerate a selected speech chunk after pronunciation correction.
- Re-run script generation as a new version without overwriting prior lineage.
- Cancel queued/in-progress generation cooperatively.
- Delete an episode and all owned audio artifacts.

## 11. Research requirements

- Research is `off`, `auto`, or `required`; UI describes each choice.
- Current claims record an `asOf` time.
- A source record retains canonical URL, title, publisher/domain, published date when known, retrieved time, and relevant excerpt/summary.
- Claims reference one or more source IDs. Citations displayed to the user come from retained tool results, not model-invented URLs.
- The research synthesis identifies disagreements, stale evidence, and unsupported requested claims.
- Source-grounded scripts are checked so factual claims either map to evidence or are explicitly framed as analysis/uncertainty.
- The episode page includes a sources panel and research date.

## 12. Multi-speaker requirements

- Production modes: one host, host + expert, two hosts, debate, interview, and optional moderator.
- Each speaker has a role, conversational purpose, voice assignment, and delivery profile.
- Dialogue should advance understanding; ban filler agreement loops and artificial banter quotas.
- The script schema stores speaker turns separately.
- Rendering preserves distinct voices and controlled pauses without losing chapter continuity.
- Fictionalized expert/interview framing must not falsely imply a real person participated.

## 13. Follow-up and learning requirements

- Episode actions: Ask about this, Go deeper, Generate follow-up, Shorten, Another perspective, Quiz me, Continue series.
- Follow-up requests receive the authoritative parent summary, covered-concept map, user feedback, and selected source context—not the entire raw conversation by default.
- A learning context records concepts introduced, assumed, revisited, understood, or flagged for review.
- Series define an ordered curriculum, prerequisites, episode objectives, and completion state.
- Course generation creates the curriculum first; episodes are generated on demand or within an explicit budget, not all blindly at once.
- Quiz results may update learning context but never masquerade as formal educational assessment.

## 14. Personalization requirements

- Separate explicit preferences from inferred hypotheses.
- Every inferred preference stores evidence, confidence, and last-used time.
- The user can inspect, edit, disable, or erase personalization.
- Explicit request settings always override profiles.
- Knowledge level is topic-specific, not one universal label.
- “Why this?” can explain meaningful personalization applied to an episode.
- Avoid sensitive-trait inference unless the user explicitly supplies it for a necessary experience.

## 15. Discovery and recurring programming

- Surprise Me accepts available time, mood/goal, interests, exclusions, and optional novelty level.
- Candidate topics are proposed and ranked before generation; avoid duplicating heard content.
- A recurring Program stores schedule, timezone, topic mix, duration, research requirements, freshness window, duplicate policy, and budget ceiling.
- Each run creates a normal episode with lineage back to the program.
- Users can pause, resume, skip, run now, or delete a program.
- A program cannot generate when its per-run or monthly budget guard is exceeded.

## 16. Safety, privacy, and trust

- Authentication and ownership checks on every private resource.
- Server-side API keys only.
- Prompt injection in researched pages is treated as untrusted source content and cannot change application instructions or call arbitrary tools.
- Input/output moderation and policy-specific refusal paths.
- Rate limits by user, IP, and expensive operation.
- Cost reservation before queueing and actual usage reconciliation after each provider call.
- Logs use IDs and structured metadata; content fields are redacted by default.
- Signed object URLs are short-lived; storage remains private.
- Account export and deletion are supported before public launch.
- Voice disclosure is visible before first playback and retained in downloaded metadata where feasible.

## 17. Quality requirements and evals

Quality dimensions:

- intent fidelity;
- factual grounding;
- audio-native style;
- structure and narrative coherence;
- auditory comprehension;
- runtime fit;
- repetition balance;
- tone/depth/format adherence;
- pronunciation;
- multi-speaker naturalness;
- safety;
- player reliability.

Maintain a versioned golden set spanning history, science, software, current events, disputed topics, beginner/expert depth, 5/20/45-minute lengths, and adversarial prompts. A prompt/model change cannot ship if it creates a material regression without an explicit recorded decision.

## 18. Success measures

### MVP operational

- ≥95% of valid 5–30 minute jobs reach `ready` without user intervention in staging reliability runs.
- Retry does not duplicate an episode or repay for completed chunks.
- Final duration meets the runtime tolerances above.
- Core Web Vitals and accessibility checks meet the release thresholds defined in tests.

### Product

- creation-start to playable completion rate;
- time to first playable audio;
- episode completion and 7-day replay rates;
- regenerate/cancel/error rates;
- explicit quality rating and reason;
- follow-up creation rate;
- cost per generated and completed listening minute;
- proportion of episodes played long enough to justify rendering.

## 19. Release boundaries

### M2 / MVP

Rundown, Deep Dive, Lecture, and single-host Podcast; optional controls; complete non-research pipeline; durable audio; library; premium player; transcript/chapters; auth; cost and safety basics.

### M3

Research decisioning, web sourcing, claims/citations, fact-checking, sources UI, current briefings.

### M4

Multi-speaker writing, casting, rendering, and quality evaluation.

### M5

Follow-ups, episode Q&A, quizzes, learning context, series/course planning, progress.

### M6

Personalization, Surprise Me, playlists, recurring programs, freshness/deduplication.

### M7

Full eval gates, observability, budgets, accessibility, privacy operations, deployment rehearsal, and release hardening.

## 20. Open product choices

These choices intentionally remain owner decisions and must not be invented by a coding agent:

- product name and visual identity;
- hosting vendors and public domain;
- public pricing/limits;
- whether scripts/audio may be exported;
- default retention periods;
- whether public sharing exists;
- which built-in voices are presented and their user-facing names.

