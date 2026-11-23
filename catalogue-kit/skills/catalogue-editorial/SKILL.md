---
name: catalogue-editorial
description: Turn audited functionality records into readable catalogue entries, captions, chapters, and a reading order for a non-developer owner. Use when asked to "write the catalogue entries", "name these features", "write captions", "group / order the catalogue", "plan the catalogue chapters", or "write the layout spec". Keeps observed facts, stated intent, and proposed ideas visibly separate and preserves provenance. Does not judge whether code works (that is functionality-evidence-audit) and does not build UI.
version: 0.1.0-draft
---

# Catalogue editorial

Draft v0.1. Test it on the pilot before relying on it broadly.

## Use when

- Writing or revising entries after an evidence pass.
- Proposing chapters, reading order, and cross-links (before Checkpoint B).
- Writing the page-layout specification (stage 4, before Checkpoint C).

## Do not use for

- Deciding status. Keep the auditor's status and evidence unchanged; if you doubt them, raise a question.
- Defining navigation or workspace structures for the app itself. Chapters are an editorial hypothesis for reading the catalogue, not an app taxonomy.
- Visual design or implementation. Hand the approved spec to the host's design/build procedure.

## Inputs

- Audited entry notes or draft entries with evidence
- `catalogue/decisions.json` (approved names and meanings win)
- The app brief `catalogue/README.md`

## Procedure: entries

1. **Title** = what a person gets done, in everyday words. Avoid component names, route names, and jargon. Good: "Get AI feedback on a drawing". Bad: "AssessmentPanel" or "/api/assess".
2. **User goal** = the person's reason, in their words.
3. **Description** = two to four plain sentences: what it is for, what you put in, what you do, what you get.
4. **Inputs / actions / outputs / surfaces** = short lists; surfaces name every place the function appears.
5. **Caption** = *"[Visible surface or function] lets [user] [action] to produce [result]. [Current limitation, if relevant.]"* Describe the actual image or state shown, and set `imageOrigin` (app screenshot with date, Figma node, or illustration). No promises, no adjectives the evidence does not support.
6. **Separate the claim kinds.** Write observed behavior in the present tense ("Saves the drawing"). Write stated intent as intent ("The design proposes…", "The task asks for…"). Write ideas as ideas ("Could…") and mark them `claimType: proposed`, `applicability: idea`.
7. **Open questions** only for what the owner must decide (meaning, intent, priority, naming).
8. **History**: add a line for every edit; never rewrite earlier lines.

### Worked example (illustrative)

Three entries for a neutral sample app live in `catalogue-kit/examples/entries/`: one observed and working, one built but not yet verified, one reference-only design. They are marked `illustrative: true`.

## Procedure: organization (before Checkpoint B)

1. Group by **user goal first** ("practice drawing", "find source material", "review my progress"), not by code area.
2. Each function has **one home chapter**. If it serves others, add cross-links instead of duplicates.
3. Propose a **reading order** with a one-line reason per chapter (for example "starts where a new student starts").
4. Offer **at least one alternative** grouping when the structure is uncertain, with its tradeoff.
5. Label every grouping as provisional. The owner's approval goes into `decisions.json`.

## Procedure: layout specification (stage 4)

Use `catalogue-kit/templates/layout-spec.md` as the outline. Cover the contents/overview page, chapter opener, function reading page, one-at-a-time stack review, carousel comparison, review summary, mobile order, keyboard and single-pointer alternatives, and non-color status cues. Reuse reference designs only where their role is clear, and say which node each idea comes from.

## Outputs

- Entry files in `catalogue/entries/`
- An ordering rationale (chapters, order, cross-links, alternatives)
- A written layout spec
- A terminology list of approved and proposed names

## Stop when

- a name or meaning would need the owner's intent;
- grouping would imply an app navigation structure the owner has not approved;
- Checkpoint B or C is reached.
