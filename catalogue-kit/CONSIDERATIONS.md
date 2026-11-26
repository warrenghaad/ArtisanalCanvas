# Considerations: building a catalogue a non-developer can trust and use

This document holds the thinking behind the catalogue: how its content is researched, ordered, summarized, illustrated, laid out, and reported to the owner. It applies to all three tiers:

1. **Template**: the eTextbook-style reading template (combined Figma file + Storybook).
2. **Functionality catalogue**: the template specialized to catalogue what an app does.
3. **App catalogue**: tier 2 applied to one app (first: ArtisanalCanvas).

Every consideration carries a label:

- **[Owner decides]**: product intent, meaning, naming, priorities. Agents propose; the owner chooses.
- **[Default]**: the recommended rule. Agents follow it unless the owner changes it.
- **[Open]**: not yet settled; needs a decision before the stage that depends on it.

Owner decisions are recorded in the app's `catalogue/decisions.json`. Defaults are changed the same way.

---

## 1. Relaying content to the owner

The owner is not a developer. The catalogue's value collapses if the owner can't tell what is true, what is hoped for, and what needs their decision.

### 1.1 How agents report

- **[Default] Summary first, detail on request.** Open with what changed and what it means, in two or three sentences, then the details.
- **[Default] Show, don't describe.** Every claim about what something looks like or does comes with a screenshot or a link to the exact place.
- **[Default] Three kinds of statement, never blended:**
  - *"I saw…"*: observed (ran it, or traced it end to end)
  - *"The design / document says…"*: stated intent
  - *"I suggest…"*: an idea
- **[Default] Status in words, with an icon, never color alone:** Working · Partly working · Broken · Not built · Not checked yet.
- **[Default] Say what you didn't look at.** Every report ends with what was not inspected and why ("no access to X", "ran out of scope").
- **[Default] Questions are few and decidable.** At most three questions per report. Each one is about intent or a tradeoff, gives a recommendation, and says what happens under each answer. No questions about things an agent can check itself.
- **[Default] No invented precision.** No percentages, scores, or "90% done" unless a counted, sourced number backs them.

### 1.2 The checkpoint report (same shape every time)

1. **What this is**: one sentence, plus a link or screenshot.
2. **What I'm confident about**, with evidence links.
3. **What's uncertain or unseen.**
4. **Decisions needed** (at most 3), each with a recommendation.
5. **What I'll do next if you approve.** Approving a stage never authorizes building.

### 1.3 Plain-language replacements

| Avoid | Say |
|---|---|
| route / endpoint | screen / server action |
| component | building block / piece of the screen |
| schema | data format |
| merge (git) | combine the code histories |
| port a feature | move a feature over by hand |
| repo / branch | project / version of the project |
| deploy | publish |
| regression | something that used to work and now doesn't |
| refactor | reorganize the code without changing what it does |
| state | what the screen is currently remembering |
| Storybook | a workshop page that shows each piece of the screen on its own |

**[Default]** When a technical word is unavoidable, explain it the first time it appears.

### 1.4 Where the owner reads things

- **[Default]** Checkpoint reports go in the conversation, linking to files in GitHub.
- **[Open]** Should reports also be published as readable web pages (for example, a shareable page per checkpoint)? Recommended once the pilot exists.

---

## 2. Researching functionality

### 2.1 What counts as a function

- **[Default]** A function is **something a person can get done**, not a file, screen, or button. "Get AI feedback on a drawing" is a function; "AssessmentPanel" is not.
- **[Default]** One job on two screens is **one function with two surfaces**. One button doing different jobs in different contexts is **several functions**. Record why.
- **[Default]** Background behaviors the person never touches (saving a session, seeding data) are catalogued only if they affect what the person sees. Otherwise they are evidence for another function.
- **[Owner decides]** How fine-grained? Recommended: "a task a student or teacher would name". Finer detail belongs inside the entry.

### 2.2 How to trace a function

Follow the chain and record each link with file, lines, and commit:

**screen** (where it starts) → **action** (what the person does) → **data/server** (what runs, what is read or written) → **result** (what the person sees afterwards).

- **[Default]** A gap anywhere in the chain means the status can't be *Working*.
- **[Default]** Run it when possible. Running it, or a test that exercises it, is the strongest evidence. Note preconditions (needs an API key, seeded data, login).

### 2.3 Hollow screens

Attractive screens can imply features that don't exist. **[Default]** Look for and record as limitations, never as facts:

- placeholder or hard-coded numbers;
- randomized progress (ArtisanalCanvas already has one at `client/src/pages/etextbook-explorer.tsx:169`, `Math.random() * 100`);
- buttons with no handler, or handlers that only show a toast;
- lists that are always the same sample data;
- server actions that return canned responses when a key is missing.

### 2.4 Sources and their weight

| Source | Shows | Strength |
|---|---|---|
| Running the app / a test | the behavior itself | direct |
| End-to-end code trace with no gaps | the behavior, by reading | direct |
| A screen, button, server action, or table existing | a part exists | indirect |
| Figma design, task, doc, comment | intent only | stated |
| The owner saying so | intent (or a report of an observation) | stated, with date and place |

- **[Default] Missing access is not absence.** "Couldn't open it" is recorded as *inaccessible*, never as "doesn't exist".
- **[Default] A sample is not complete.** Partially read sources say what was skipped.
- **[Default] Other versions of the project are evidence only about themselves.** Code on another branch is *incoming*, not *in the app*.
- **[Default] Figma coverage means every page,** down to relevant frames, components, variants, and interactions, with a row per page in the source ledger.

### 2.5 When sources disagree

**[Default]** Keep both, label their kinds, and raise an open question. Never quietly pick one.

---

## 3. Order

- **[Default] Start where a newcomer starts.** First chapter = what a new user meets first. Then follow the journey.
- **[Default] Then prerequisites:** a function that needs another comes after it.
- **[Default] Then frequency:** everyday functions before occasional ones.
- **[Default] One home per function.** Each function lives in exactly one chapter; other chapters link to it rather than repeat it.
- **[Default] Chapters are grouped by what the person is trying to do,** not by code area or screen.
- **[Default] Always show one alternative ordering** with its tradeoff (for example "by screen" for maintainers vs "by goal" for learners).
- **[Owner decides]** The chapters, their names, and their order (Checkpoint B).
- **[Default] Chapters are for reading the catalogue only.** They never define the app's own navigation or workspaces. In ArtisanalCanvas specifically, they never stand in for the Prism structure.
- **[Open]** Should "in the app", "incoming", and "design only" functions share chapters (with labels), or have separate sections? Recommended: share chapters with clear labels, so the owner sees the whole intended capability in one place.

---

## 4. Summaries

Five levels, each with a fixed job:

| Level | Where | Must contain | Must not |
|---|---|---|---|
| Caption | under an image | *"[Surface] lets [who] [do what] to get [result]. [Limitation.]"* | promise, praise, or describe what isn't in the image |
| Card | card stack, carousel, lists | title, one-line summary, status word + icon, image | detail or evidence |
| Reading page | one function | purpose, how it works (action → result), status with date, limitations, related functions, evidence (expandable), open questions | unlabelled ideas |
| Chapter overview | chapter opener | the goal in 1–2 sentences, the functions in order, links to related chapters | counts that look like progress |
| Catalogue overview | front page | purpose, review date, what was inspected (from the source ledger), status legend, chapters | percentages or "completion" not backed by counted records |

- **[Default]** Overview counts are only ever plain tallies of records ("12 functions checked, 5 not checked yet"), never a progress bar.
- **[Owner decides]** The tone of titles and summaries (plain and direct is recommended).

---

## 5. Imaging

- **[Default] Every image says where it came from**, visibly: "App screenshot, 2026-11-26", "Figma design: Library page", or "Diagram".
- **[Default] Image kinds, in order of preference:**
  1. App screenshot of a real state (the function in use, not an empty screen)
  2. Figma frame export (for design-only items; labelled as design)
  3. Simple flow diagram (screen → action → result), when a still image can't show the behavior
- **[Default] Never present an AI-generated image as the app or as a design.** ArtisanalCanvas also has a standing rule against AI images in the cube workspace (`.agents/memory/cube-contract.md` in the Replit project).
- **[Default] Consistent framing:** fixed aspect ratios per surface (proposed: cards 4:3, reading page 16:10, mobile screenshots 9:19.5 shown in a phone frame). Crop to the part that matters; don't shrink a whole page into a thumbnail.
- **[Default] Screenshots use sample data, never real student data or private uploads.**
- **[Default] Alt text** describes what the image shows in one sentence, not what the function promises.
- **[Default] No image?** Show a neutral "No image yet" placeholder with the reason, never a decorative stand-in.
- **[Default] Dated and re-shot on change:** when a function's evidence is rechecked, its screenshot is re-taken; the old one stays in the history.
- **[Open]** Light or dark backgrounds for screenshots (match the app? match the template?).

---

## 6. Layout

### 6.1 Page types (tier 1 template)

| Page | Purpose |
|---|---|
| Overview / contents | where am I, what's here, reading order; search and filters without replacing the order |
| Chapter opener | the goal and its items |
| Reading page | one item, read top to bottom |
| Stack review | one item at a time, with the remaining count, previous/next |
| Carousel | compare related items side by side |
| Review summary | open questions and what changed since last time |

### 6.2 Where ideas come from

- **[Default]** Library browsing, contents, chapters, and detail pages come from the **Figma eTextbook** file.
- **[Default]** One-at-a-time review and the swipe/stack motion come from the **Card Stack** design.
- **[Default]** Their sample content is never kept. Only layout and interaction are reused, and the source ledger records which frame each idea came from.

### 6.3 Rules every page follows

- **[Default] Mobile reading order:** title → image + caption → purpose → how it works → status and limitations → related → evidence → questions.
- **[Default] Every action has a keyboard path and a single-tap path.** Swipes and drags are optional extras, never the only way.
- **[Default] Status is never color alone.** Word + icon + color.
- **[Default] No hover-only information.**
- **[Default] Touch targets at least 44×44 px.**
- **[Default] Motion respects "reduce motion".** The stack animates only when motion is allowed.
- **[Default] Screen reader position announcements** in stack and carousel ("3 of 8").

### 6.4 What tier 2 and tier 3 add

- Tier 2 adds status badges, the evidence drawer, review history, and filters by status/applicability, reusing tier-1 slots (see `catalogue-kit/README.md`, "How a catalogue entry maps onto a template item").
- Tier 3 adds only content and a link back to the real screen in the app.

### 6.5 Decisions for the owner

- **[Owner decides]** Whether the catalogue opens on the contents page or on the stack review (recommended: contents, so the reading order is the default).
- **[Owner decides]** Whether reviewers can change statuses in the catalogue itself, or only agents (recommended: agents write, the owner approves, until sign-in exists).
- **[Open]** Where the catalogue lives in ArtisanalCanvas: its own screen, a dock viewer in the future studio, or both. Decide after Checkpoint C.

---

## 7. Process risks to watch

- **Building before understanding.** Storybook and the template are tier 1 only; no app wiring until Checkpoint C.
- **Agents grading their own work.** Claude reviews Replit's output against written acceptance criteria; only the owner approves.
- **Two sources of truth.** Catalogue records live in GitHub (`catalogue/`), never only in a tool's private memory or task list.
- **Stale catalogue.** Every repeat review starts with the changed-files check (`OPERATING_MODEL.md` §7).
- **Scope creep into Prism.** The catalogue informs Prism's eventual design; it does not define it.
