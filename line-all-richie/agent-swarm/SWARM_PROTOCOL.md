# Swarm Protocol

## Purpose

This protocol tells the Line All Richie agents how to turn a curriculum request into GitHub material.

The swarm should behave like a small studio: one director, a few specialists, one critic, and one librarian. Nobody rambles. Every agent leaves a usable mark.

## Progression Rule

Line All Richie is a progression registry, not a single curriculum ladder.

A progression is one selectable route through a drawing problem family. It is optional unless the user explicitly asks to follow it.

The swarm must support:

- named progressions
- untracked lessons
- braided progressions
- skipped phases
- repeated phases
- newly invented progressions

## Intake Schema

Use this schema for any curriculum request:

| Field | Required | Example |
| --- | --- | --- |
| Active progression | optional | `primitive-generative-drawing`, `public-sketching-fieldbook`, or `untracked` |
| Progression phase | optional | Isolate, Operate, Manufacture, Mutate, Deform |
| Subject | yes | cafe table conversation, vase, face, rose, athlete, chair |
| Goal | yes | public sketching, expression, texture, critique, pattern manufacturing |
| Emotional focus | optional | broken connection, flirtation, vigilance, exhaustion |
| Time box | optional | 30 seconds, 2 minutes, 5 minutes, 15 minutes |
| Output type | yes | lesson, drill, progression card, visual-system spec, critique checklist, reference brief |
| Visual needed | yes | thumbnail sequence, face-plane map, gesture map, component spec, pattern deformation map |
| Repo path | optional | `line-all-richie/progressions/...` or `line-all-richie/curriculum/...` |

## Required Output Kernel

Every generated artifact must answer eight questions:

1. What does the learner want to capture?
2. What progression, if any, is active?
3. What one drawing skill is being practiced?
4. What structural, perceptual, emotional, or generative constraint must be obeyed?
5. What exact thing should be drawn?
6. What one rule may be bent?
7. What invariant must recover readability?
8. Where does this belong in GitHub?

## Handoff Script

### Step 1: Studio Director

Summarize the request in one sentence.

Then declare:

- **Active Progression**: named progression or `untracked`
- **Progression Phase**: if relevant
- **Anchor Skill**
- **Constraint**
- **Best output path**

### Step 2: Curriculum Architect

Create the artifact skeleton:

- Purpose
- Progression Context
- Core Concept
- Visual Map
- Rules
- Exercise
- Critique Checklist
- Running Project Sum

### Step 3: Specialist Passes

Only activate necessary specialists.

| Need | Activate |
| --- | --- |
| primitive construction, objects, head rotation | Form & Volume Coach |
| brows, eyes, mouth, posture, social signal | Expression Analyst |
| emotional line, texture, density, edge behavior | Texture & Emotion Agent |
| public cafe/bar/street/park drawing | Public Sketching Field Agent |
| pressure, speed, rhythm, overlap | Line & Markmaking Coach |
| reusable diagram or interactive lesson | Animation Studio Lead |
| artist/source examples | Visual Reference Curator |
| progression routing or registry update | GitHub Librarian plus Studio Director |

### Step 4: Visual Pass

The artifact must include at least one of:

- visual map table
- thumbnail sequence description
- labeled diagram description
- storyboard
- component spec
- image generation brief
- React/Three.js component plan
- primitive relationship matrix
- pattern deformation map
- progression card

Avoid ASCII diagrams.

### Step 5: Critique Pass

The Critique Agent checks:

- Is the task drawable in the stated time box?
- Is the active progression named correctly, or marked `untracked`?
- Is the structural rule clear?
- Is the emotional signal visible through line, texture, gaze, posture, spacing, or pattern behavior?
- Is the Control -> Bend -> Recover loop present when useful?
- Is there one specific next drill?

### Step 6: GitHub Librarian

The librarian returns:

- suggested filename
- directory path
- summary for `SESSION_LEDGER.md`
- any open questions
- next best action

## File Routing Rules

| Artifact Type | Directory |
| --- | --- |
| progression definition | `line-all-richie/progressions/` |
| full lesson | `line-all-richie/curriculum/` |
| quick practice | `line-all-richie/drills/` |
| visual map or component spec | `line-all-richie/visual-system/` |
| reusable animation/component spec | `line-all-richie/animation-studio/` |
| agent instructions | `line-all-richie/agent-swarm/` |
| project continuity | `line-all-richie/SESSION_LEDGER.md` |

## Done Means Saved

A swarm-generated artifact is not done until it has a suggested GitHub path and a ledger-ready summary.

A progression is not canonized until it has its own file under `line-all-richie/progressions/` and includes a not-required clause.
