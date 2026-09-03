# Canonical Product Vision

> **Preservation rule:** The vision below is preserved as the canonical product definition. Do not shorten, paraphrase, or replace it with “prompt → script → TTS.” Later specifications clarify implementation, but they do not override the ideas here.

Yes. This can be turned into a very coherent product: essentially a **personalized, on-demand audio-content generator** where the user describes what they want to hear rather than searching for an existing podcast or video.

The important distinction is that the product should **not just send the user's raw prompt to text-to-speech**. The application should act like an editorial/production layer that understands the user's intent, researches or reasons about the subject when necessary, writes a script specifically for listening, and then renders that script as high-quality spoken audio.

## Core product concept

A user could type something as open-ended as:

> “Teach me about the Roman emperor Hadrian. I know almost nothing about him. Make it interesting enough to listen to while driving, but I want to actually understand why he mattered.”

The application transforms that into something more like:

**Format:** Educational rundown  
**Length:** ~20 minutes  
**Knowledge level:** Beginner  
**Tone:** Conversational / engaging  
**Depth:** Moderate  
**Narration:** Single narrator  
**Goal:** Learn and retain  
**Structure:** Hook → background → major events → personality → legacy → recap

Then the system writes an audio-native script and sends that through the voice-generation layer.

The user never has to know how to engineer the prompt.

## The primary user experience

The home screen should be extremely simple.

### “What do you want to listen to?”

A large free-form prompt box:

**Create something about...**

> “Explain exactly how nuclear power plants work, starting from the uranium and ending with electricity coming out of the wall.”

Underneath it, there could be a row of optional controls.

**Format**

- Quick Rundown
- Deep Dive
- Lecture
- Podcast
- Story
- Debate
- Documentary
- News-style briefing
- Study session
- Bedtime / relaxing explanation
- Custom

**Length**

- 5 min
- 10 min
- 20 min
- 30 min
- 45 min
- 1 hour
- Custom

**Depth**

- ELI5
- Beginner
- Intermediate
- Advanced
- Expert

**Style**

- Straightforward
- Conversational
- Entertaining
- Academic
- Dramatic
- Funny
- Calm
- Story-driven

And then an **Advanced** area for people who care about precision.

Things like:

- What do you already know?
- What specifically do you want answered?
- Anything to avoid?
- Include examples?
- Include analogies?
- Include opposing perspectives?
- Include a recap?
- Include quiz questions?
- Assume I know ___
- Spend extra time on ___
- Skip ___

None of those should be required.

The free-form prompt remains the center of the product.

## Where this becomes much more powerful

I wouldn't make this merely:

**Prompt → script → audio.**

I'd design the generation pipeline more like this:

**User Intent → Content Plan → Research → Audio Script → Editorial Pass → Voice Render**

### 1. Intent Interpreter

The first model determines what the person actually wants.

For:

> “Tell me everything I should know about the Mongol Empire before I start reading a book about it.”

It might internally derive:

- Goal: foundational understanding
- User expertise: beginner
- Format: structured overview
- Important concepts: geography, Temujin, unification, military system, expansion, successor khanates, administration, trade, legacy
- Desired listening style: approachable
- Likely duration: 25 minutes
- Need current research: low
- Need citations/fact verification: yes

That becomes a structured **Content Brief**.

### 2. Content Planner

Another step designs the actual episode before writing it.

For example:

**Opening — 90 seconds**

Why the Mongols matter and the misconception that they were simply raiders.

**Part I — The World Before Genghis Khan — 4 min**

The steppe, tribes, geography, political conditions.

**Part II — Temujin — 5 min**

Childhood, alliances, rise.

**Part III — Why the Mongols Were So Effective — 6 min**

Organization, horses, intelligence, communications, military doctrine.

…and so on.

That dramatically improves long-form generation because the model isn't improvising a 40-minute script from beginning to end.

### 3. Research / knowledge layer

For subjects requiring factual accuracy or current information, the application could research before writing.

So someone could say:

> “Give me a 15-minute morning briefing on everything important that happened in AI yesterday.”

Or:

> “Explain the current situation between China and Taiwan. Give me the historical context necessary to understand today's situation.”

The research layer collects and synthesizes the source material first.

The script writer therefore receives **verified source material**, not merely a topic.

### 4. Audio Script Writer

This is one of the most important parts of the entire product.

You don't want normal prose.

Written text:

> “There are three primary factors that contributed to the collapse. First…”

Spoken content can instead say:

> “So why did it collapse? There wasn't one reason. There were really three forces working together. And the first one is probably the most important…”

You want the model explicitly optimizing for:

- cadence
- breath
- transitions
- sentence length
- repetition where useful
- auditory comprehension
- verbal signposting
- avoiding giant lists
- avoiding excessive parentheticals
- pronunciation
- storytelling
- pacing
- intentional pauses
- rhetorical questions
- reminders of things discussed earlier

That alone could make the experience noticeably better than simply having ChatGPT read an answer aloud.

## Podcasts become especially interesting

The user could choose:

**Podcast**

And then:

### One host

One narrator explaining the subject conversationally.

### Host + Expert

One person asks questions while another teaches.

### Two Hosts

More casual discussion with differing perspectives.

### Debate

Two speakers argue opposing positions, with a moderator optionally summarizing.

### Interview

A fictionalized interviewer/expert format.

The application generates speaker-separated dialogue:

**Alex:**  
So before we get into quantum entanglement, I think we need to clear something up...

**Maya:**  
Yeah, because the way it's usually described makes it sound almost supernatural.

And the voice engine assigns different voices to the participants.

That would make the generated material feel much more like an actual show.

## One killer feature: “Make me something to listen to”

Eventually I would add a mode where the user barely has to prompt it at all.

For example:

**I have:** `35 minutes`

**I'm in the mood to:** `Learn`

**Topics I like:**  
History / Science / Technology

**Surprise me**

The app could produce:

> **How Humans Accidentally Created the Modern World Through Fertilizer**
>
> 32 min · Science / History

Or:

> **The 72 Hours That Nearly Started World War III**
>
> 36 min · History

Now the product isn't merely a tool.

It becomes a **personalized content platform where every piece of content is generated for one person**.

## Another major feature: Follow-up episodes

This could be extremely compelling.

After listening to an episode about Rome:

**What next?**

- Go deeper on Julius Caesar
- Explain how Roman government actually worked
- Life of an ordinary Roman citizen
- Why the Western Empire collapsed
- Give me the opposing view of something from this episode
- Quiz me on what I just learned
- Continue this series

The system retains the **learning context**, not merely the conversation.

So Episode 2 can say:

> “Yesterday, we talked about how Augustus carefully preserved the appearance of the Republic…”

The user starts building their own personalized educational series.

## Series

Users should also be able to say:

> “Create a complete course teaching me astronomy from beginner through college-level concepts.”

The system could generate:

### Astronomy From Zero

1. Where Are We in the Universe?
2. Gravity and Orbits
3. How Stars Work
4. The Life and Death of Stars
5. Galaxies
6. Black Holes
7. Relativity
8. The Big Bang
9. Dark Matter
10. The Biggest Unanswered Questions

Each could be a 30–45 minute episode.

And the system tracks which ones the user has finished.

That's effectively **AI-generated Audible + podcasts + education**.

## Personalization could become a major moat

Over time, the application could learn things like:

**Preferred content length:** ~25 min  
**Preferred style:** conversational but information-dense  
**Doesn't like:** unnecessary introductions  
**Likes:** analogies and historical context  
**Knowledge:** advanced software engineering, beginner physics  
**Learning preference:** understand *why* before memorizing *what*  
**Podcast preference:** two hosts for entertainment, single narrator for technical subjects

Then a user can simply type:

> “Teach me Kubernetes.”

And the application already understands what **“teach me” means for that person**.

## The generation architecture I would use

Conceptually:

```text
USER PROMPT
     │
     ▼
INTENT INTERPRETER
     │
     ├── goal
     ├── audience knowledge
     ├── tone
     ├── depth
     ├── length
     ├── format
     └── constraints
     │
     ▼
RESEARCH / SOURCE GATHERING
     │
     ▼
CONTENT ARCHITECT
     │
     └── episode outline
     │
     ▼
SCRIPT GENERATOR
     │
     └── audio-native script
     │
     ▼
EDITOR / FACT CHECKER
     │
     ├── accuracy
     ├── repetition
     ├── pacing
     ├── clarity
     └── target runtime
     │
     ▼
VOICE DIRECTOR
     │
     ├── speakers
     ├── voice
     ├── pacing
     ├── emotion
     └── pronunciation
     │
     ▼
VOICE API
     │
     ▼
FINAL AUDIO
```

That multi-stage pipeline is important. I would **not** have one giant prompt that tries to perform everything at once.

## The listening interface

The finished result should look like a podcast player.

**Why Rome Really Fell**

`28:14`

▶︎ ━━━━━━━━━━━━

Then:

**Chapters**

00:00 — The question  
02:14 — Rome at its peak  
05:42 — Political instability  
11:08 — Economic problems  
16:51 — The military  
22:05 — The invasions  
26:11 — What actually killed Rome?

And actions:

**Ask about this**  
**Go deeper**  
**Generate follow-up**  
**Shorten this**  
**Make another perspective**  
**Save**  
**Add to playlist**

Possibly allow the transcript to scroll along with the narration.

## I would make the creation screen feel almost like ordering content

Something like:

> **What do you want to hear about?**
>
> `[ Teach me why the Roman Republic collapsed ]`
>
> **Make it a**
>
> `Deep Dive ▼`
>
> **About**
>
> `30 minutes ▼`
>
> **For someone who is**
>
> `Familiar with the basics ▼`
>
> **Tone**
>
> `Conversational ▼`
>
> **Focus**
>
> `[ Politics, Caesar, and the transition to Augustus ]`
>
> **☑ Use current/reliable sources**
>
> **Create Episode**

But if someone doesn't touch any settings, this works perfectly well:

> `Explain black holes to me`

**Create Episode**

The AI makes all of the other decisions intelligently.

That simplicity is critical.

## MVP

I wouldn't try to build everything above initially.

**V1 should do five things exceptionally well:**

1. Accept an unrestricted natural-language request.
2. Allow format + duration + depth + tone customization.
3. Generate an intelligently structured audio-native script.
4. Generate excellent spoken audio.
5. Provide a polished podcast-style listening experience.

For initial formats, I'd launch with:

**Rundown · Deep Dive · Lecture · Podcast**

That's enough to prove the concept.

Then I'd add:

**Research → multi-speaker → series → personalization → follow-up generation → dynamic daily content.**

## The product positioning

I actually wouldn't position it as:

> “AI text-to-speech.”

That's describing the implementation.

Nor even:

> “AI podcast generator.”

That's too narrow.

The much more interesting concept is:

> **Anything you want to know, turned into something worth listening to.**

Or conceptually:

**Spotify gives you music and podcasts other people created.  
Audible gives you books other people wrote.  
This gives you audio created specifically for you.**

And that is what I think the core product should revolve around: **personalized, generated audio knowledge and entertainment**, rather than merely converting prompts into speech.

There is also a natural second phase where users can say things like **“Every weekday, make me a 20-minute commute briefing covering AI, software engineering, the Premier League, and the three biggest world stories, but don't repeat stories I've already heard.”** At that point the product starts becoming a genuinely personalized media platform rather than just a generation tool.

