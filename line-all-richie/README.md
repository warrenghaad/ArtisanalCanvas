# Line All Richie: Agentic Drawing Curriculum Swarm

Line All Richie is the curriculum-building layer inside ArtisanalCanvas. It turns drawing study into a durable, GitHub-managed studio system.

The swarm is designed for intermediate artists who need structure without losing experimental energy. It builds lessons through many possible progressions: primitive forms, pattern generation, planes, axes, perspective, public observation, facial expression, emotional texture, line quality, critique, revision, historical study, impossible forms, and personal visual language.

## North Star

Create a living drawing curriculum where lessons and studies can move through many routes, for example:

```txt
observation -> decomposition -> construction -> drill -> critique -> revision -> reusable visual system
```

That route is useful, but it is not mandatory. A progression is a chosen path through a family of drawing problems, not the universal order.

## Progression Principle

Line All Richie must support **many progressions**.

- A progression is optional.
- A progression can be entered, paused, repeated, skipped, braided, or inverted.
- A progression should never be treated as required unless the user explicitly asks to follow it.
- A lesson may be `untracked` if no progression has been chosen.

Current seed progression:

| Progression | Status | Purpose |
| --- | --- | --- |
| `primitive-generative-drawing` | seed | Use line, shape, pattern, value, and form to manufacture objects rather than merely decorate them. |

## What This Folder Contains

| Area | Purpose |
| --- | --- |
| `PROJECT_INSTRUCTIONS.md` | Canonical project rules and curriculum principles |
| `SESSION_LEDGER.md` | Running record of decisions, exports, and next actions |
| `agent-swarm/` | Agent roles, handoffs, and review loop |
| `progressions/` | Optional learning paths, each with its own phases and study cards |
| `curriculum/` | Lesson scaffolds and generated curriculum drafts |
| `drills/` | Time-boxed practice exercises |
| `visual-system/` | Learning cube, component specs, visual maps, drawability engine notes |
| `animation-studio/` | Long-term reusable visual component library |

## Swarm Loop

1. Studio Director chooses the next learning move or active progression.
2. Curriculum Architect turns it into a lesson arc or study card.
3. Specialist agents add structure, expression, texture, public-scene practice, critique, and visual references only when needed.
4. GitHub Librarian converts the output into durable Markdown.
5. Critique Agent checks clarity, progression fit, and whether the exercise is drawable.
6. The final artifact is saved under `progressions/`, `curriculum/`, `drills/`, `visual-system/`, or `animation-studio/`.

## Default Lesson Shape

Every substantial lesson should include:

1. Concept
2. Active progression, or `untracked`
3. Visual map, storyboard, labeled diagram, table, or component spec
4. How to draw it
5. Time-boxed drill
6. Control -> Bend -> Recover variation when useful
7. Critique checklist
8. Animation Studio candidate status
9. GitHub export path

## Use the Swarm

Open a GitHub issue using the **Line All Richie Curriculum Swarm Task** template. Fill in the subject, desired progression if any, emotional focus, and desired output. The swarm files tell ChatGPT/Codex/AI collaborators how to generate the curriculum artifact consistently without pretending one progression rules the whole studio.
