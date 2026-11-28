# Replit task 3: pilot, three real ArtisanalCanvas entries

**Only after** task 2 is approved by the owner. Ends at **Checkpoint A**.

---

## Goal

Write three honest catalogue entries for ArtisanalCanvas to test whether the method works before the full catalogue is written:

1. **A function that works**, shown by actually using it in the running app (suggested: "Get AI feedback on a drawing" from the Academy).
2. **A function that exists but is unverified or incomplete** (suggested: eTextbook progress, which shows a random number at `client/src/pages/etextbook-explorer.tsx:169`).
3. **A design-only function** from the Figma eTextbook file, or an incoming one from `warrenghaad` (suggested: the geometry scene save/restore).

These are suggestions. If a suggestion turns out to be the wrong kind, pick another and say why.

## Use these skills

- `catalogue-kit/skills/functionality-evidence-audit/SKILL.md` for researching each function
- `catalogue-kit/skills/catalogue-editorial/SKILL.md` for writing each entry

## Steps

1. For each function, trace screen → action → data/server → result, recording file, lines, and commit for each link.
2. Run the app and try the function (except the design-only one). Take screenshots with sample data, saved under `catalogue/screens/`, named `<entry-id>-<YYYY-MM-DD>.png`.
3. Write the three files in `catalogue/entries/`. Status comes from evidence only. "Working" needs a run or a full trace.
4. Update `catalogue/sources.json` for everything you inspected (state, date, scope, limitations).
5. Put questions only the owner can answer into each entry's `openQuestions`.
6. View the three entries in the task 2 Storybook loader pointed at `catalogue/`, and screenshot the reading pages.
7. Run the validator, build, and check.

## Not allowed

Changing any app code to make a function work. If it's broken, record it as broken with the error.

## Checkpoint A: report to the owner

Use the checkpoint format in `catalogue-kit/CONSIDERATIONS.md` §1.2:

1. The three reading-page screenshots
2. For each: the status, the evidence behind it, and how sure you are
3. What you couldn't check
4. Up to three questions (for example "Is this the right level of detail?", "Are these titles in your words?")
5. The proposed next step (the remaining entries), which waits for the owner's approval

Push to `replit/catalogue-pilot`. Claude will review the entries against the skills before the owner decides.
