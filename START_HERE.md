# Personalized Audio Platform — Agentic Build Pack

This repository pack is the operating system for building the application described in `docs/CANONICAL_VISION.md`.

The product is not a prompt-to-text-to-speech wrapper. It is a personalized media-production system that interprets what a listener wants, plans and researches the content when appropriate, writes specifically for listening, performs editorial and factual checks, directs voices, renders durable audio, and presents it like premium media.

## What replaces Jira

This is a personal project, so the repository itself is the project-management system:

- `docs/BACKLOG.md` is the ordered feature and story backlog.
- `agent-prompts/SEQUENTIAL_PROMPTS.md` contains one implementation prompt per story.
- GitHub Issues are optional execution records, not the source of truth.
- Each story has a status checkbox, dependencies, acceptance criteria, required tests, and a completion gate.
- `docs/DECISION_LOG.md` records decisions that would otherwise disappear into chat history.

Do not start several stories at once. Complete them in numeric order unless a story explicitly says it may run in parallel.

## First-time workflow

1. Read `docs/CANONICAL_VISION.md` without editing it.
2. Read `PRODUCT_CONSTITUTION.md`, `docs/MASTER_SPEC.md`, and `docs/ARCHITECTURE.md`.
3. Complete the accounts and secrets steps in `docs/MANUAL_SETUP.md` only when the current story needs them.
4. Create an empty Git repository and copy this pack into it.
5. Commit the untouched pack as the baseline.
6. Open `agent-prompts/SEQUENTIAL_PROMPTS.md` and give Story PA-001 to a coding agent.
7. Review the agent's diff and evidence. Run the root commands in `README.md` (`pnpm install --frozen-lockfile`, lint, format check, typecheck, test, and both production builds).
8. Mark the story complete in `docs/BACKLOG.md`, update `docs/DECISION_LOG.md` if needed, and commit.
9. Continue to the next unblocked story.

## Agent execution contract

Every coding-agent session starts with the global preamble in `agent-prompts/SEQUENTIAL_PROMPTS.md`, followed by exactly one story prompt. The agent must:

- inspect the current repository before editing;
- preserve the Constitution and canonical vision;
- implement only the active story and its necessary supporting work;
- use ports/adapters at external boundaries;
- write or update tests;
- run targeted checks and report exact results;
- update documentation when behavior, configuration, or architecture changes;
- never claim completion with failing tests, placeholder production paths, or unhandled errors;
- never place API keys in client code, commits, logs, prompts, or test fixtures.

## Milestones

| Milestone | Stories | Result |
| --- | ---: | --- |
| M0 — Foundation | PA-001–PA-008 | Runnable, secure application skeleton |
| M1 — Script Studio | PA-009–PA-020 | Prompt to reviewed, directed audio-native script |
| M2 — Audio MVP | PA-021–PA-034 | End-to-end episode creation and premium player |
| M3 — Grounded Research | PA-035–PA-040 | Current/reliable sources and citations |
| M4 — Multi-speaker | PA-041–PA-045 | Host/expert, two-host, debate, and interview audio |
| M5 — Learning Continuity | PA-046–PA-051 | Follow-ups, series, courses, progress, quizzes |
| M6 — Personal Media | PA-052–PA-058 | Personalization, Surprise Me, playlists, recurring programs |
| M7 — Production Hardening | PA-059–PA-065 | Evals, cost controls, operations, accessibility, release |

The first publicly usable release is M2 (after PA-034). Do not delay it to build the entire long-term platform.

## Definition of done for the whole project

The project fulfills the vision when a user can express nearly any listening request in natural language, optionally guide it with simple controls, receive factual and well-edited audio written for the ear, enjoy it in a polished player, continue or branch the learning journey, and eventually receive personalized and recurring programming without the product becoming complicated to use.
