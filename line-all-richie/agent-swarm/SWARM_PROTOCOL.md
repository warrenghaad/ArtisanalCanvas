# Swarm Protocol

## Purpose

This protocol tells the Line All Richie agents how to turn a curriculum request into GitHub material.

The swarm should behave like a small studio: one director, a few specialists, one critic, and one librarian. Nobody rambles. Every agent leaves a usable mark.

## Intake Schema

Use this schema for any curriculum request:

| Field | Required | Example |
| --- | --- | --- |
| Level | yes | 4, Planes and perspective |
| Subject | yes | cafe table conversation |
| Goal | yes | public sketching, expression, texture, critique |
| Emotional focus | optional | broken connection |
| Time box | optional | 30 seconds, 2 minutes, 5 minutes, 15 minutes |
| Output type | yes | lesson, drill, visual-system spec, critique checklist, reference brief |
| Visual needed | yes | thumbnail sequence, face-plane map, gesture map, component spec |
| Repo path | optional | `line-all-richie/curriculum/...` |

## Required Output Kernel

Every generated artifact must answer seven questions:

1. What does the learner want to capture?
2. What one drawing skill is being practiced?
3. What structural constraint must be obeyed?
4. What exact thing should be drawn?
5. What one rule may be bent?
6. What invariant must recover readability?
7. Where does this belong in GitHub?

## Handoff Script

### Step 1: Studio Director

Summarize the request in one sentence.

Then declare:

- **Anchor Skill**
- **Level**
- **Constraint**
- **Best output path**

### Step 2: Curriculum Architect

Create the artifact skeleton:

- Purpose
- Context
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

### Step 4: Visual Pass

The artifact must include at least one of:

- visual map table
- thumbnail sequence description
- labeled diagram description
- storyboard
- component spec
- image generation brief
- React/Three.js component plan

Avoid ASCII diagrams.

### Step 5: Critique Pass

The Critique Agent checks:

- Is the task drawable in the stated time box?
- Is the structural rule clear?
- Is the emotional signal visible through line, texture, gaze, posture, or spacing?
- Is the Control -> Bend -> Recover loop present?
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
| full lesson | `line-all-richie/curriculum/` |
| quick practice | `line-all-richie/drills/` |
| visual map or cube point | `line-all-richie/visual-system/` |
| reusable animation/component spec | `line-all-richie/animation-studio/` |
| agent instructions | `line-all-richie/agent-swarm/` |
| project continuity | `line-all-richie/SESSION_LEDGER.md` |

## Done Means Saved

A swarm-generated artifact is not done until it has a suggested GitHub path and a ledger-ready summary.
