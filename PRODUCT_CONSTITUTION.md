# Product Constitution

This file contains non-negotiable product and engineering principles. If a story, shortcut, agent suggestion, or implementation conflicts with this Constitution, the Constitution wins unless the owner deliberately amends it and records the reason in `docs/DECISION_LOG.md`.

## Product identity

1. **This is a personalized media-production system, not a text-to-speech wrapper.**
2. **Anything a person wants to know should be transformable into something worth listening to.**
3. The output should feel created specifically for the listener, not like a generic answer being read aloud.
4. The listening experience should feel like consuming premium media, not inspecting an AI artifact.

## Creation experience

5. Free-form prompting is always the primary creation interface.
6. Optional controls enhance intent; they never become a form the user must complete.
7. A request as simple as “Explain black holes to me” must work well with intelligent defaults.
8. Power users may specify format, duration, depth, tone, focus, prior knowledge, inclusions, exclusions, perspectives, examples, analogies, recaps, or quizzes.
9. Product language describes listener outcomes, not model or API mechanics.

## Content quality

10. Audio is written for listening, not copied from ordinary prose.
11. Long-form content is planned before it is written.
12. Spoken scripts use cadence, transitions, auditory signposting, manageable sentence length, useful repetition, pronunciation guidance, pacing, and narrative movement.
13. Research and script composition remain separate stages when factual grounding or current information matters.
14. A factual claim must not be presented as researched unless its source evidence is retained.
15. Runtime, depth, and promised format are measurable requirements, not suggestions.
16. Editorial review checks clarity, structure, repetition, pacing, factual support, safety, and target duration before paid audio rendering begins.

## System design

17. AI components have narrow, explicit responsibilities and versioned input/output contracts. There is no giant do-everything prompt.
18. The application owns authoritative state, stage transitions, retries, permissions, budgets, and validation.
19. Model output is untrusted input until schema validation and domain validation pass.
20. External providers are behind replaceable ports; provider-specific details do not leak into the domain model.
21. Every expensive stage is idempotent, observable, resumable, and safe to retry.
22. The visible episode is traceable to its content brief, outline, research packet, script version, voice plan, render manifest, and generation configuration.
23. Default model names, limits, and prices are configuration—not facts embedded throughout the codebase.

## User trust

24. AI-generated voices are clearly disclosed.
25. The user can see when research was used, inspect sources, correct pronunciation, regenerate a failed section, and delete their content.
26. Personalization must be explainable, editable, and reversible.
27. Private prompts, scripts, listening history, and generated audio are not used or exposed beyond the service behavior the user chose.
28. Secrets remain server-side. Logs redact prompts and personally sensitive content by default.
29. The application must not imitate a real person’s voice without the rights, consent, and safeguards required by policy and law.

## Scope discipline

30. The MVP does five things exceptionally well: natural-language creation, lightweight customization, audio-native script generation, excellent spoken audio, and a polished listening experience.
31. MVP formats are Rundown, Deep Dive, Lecture, and single-host Podcast.
32. Research, multi-speaker production, series, deep personalization, discovery, and recurring programming are preserved in the architecture and backlog but do not block the MVP.
33. Every new capability must strengthen the central idea of personalized audio created specifically for the listener.

