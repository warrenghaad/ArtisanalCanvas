# Replit task 2: catalogue screens on the template (tier 2)

**Only after** task 1 is approved by the owner.

---

## Goal

Show functionality catalogue records with the tier 1 template, by converting them through `catalogue-kit/schema/adapter.ts`. Add the extra pieces a catalogue needs (status legend, evidence drawer, filters by status and "where it lives") as Storybook stories. Still not wired into the app.

## Inputs

- The approved template in `client/src/catalogue-template/`
- `catalogue-kit/schema/catalogue.ts` and `adapter.ts` (use `entriesToCollection`; don't write a second converter)
- `catalogue-kit/examples/`: the sample catalogue to render
- `catalogue-kit/CONSIDERATIONS.md` §4 (summaries) and §6.4

## Steps

1. Add a small loader in `client/src/catalogue-template/catalogue/` that reads a catalogue folder's records (entries, sources, decisions, config) and builds a template collection with `entriesToCollection`.
2. Stories using `catalogue-kit/examples/`: overview with the status legend and plain tallies (no progress bars); a "Working" reading page; a "Not checked yet" reading page; a "Design only" reading page; the evidence section expanded; filters by status and by where it lives; stack review through all three.
3. Add a "source coverage" block to the overview, taken from the source ledger: counts per state, and the inaccessible sources listed by name. No percentages.
4. If anything in the template must change to fit, change it in the template generically, never with catalogue-specific code inside template components.

## Not allowed

Same as task 1. Also: no editing of statuses in the interface (agents write records; the owner approves).

## Done looks like

- `npx tsx catalogue-kit/scripts/validate.ts catalogue-kit/examples` passes; `npm run build-storybook` and `npm run build` pass; no new `npm run check` errors.
- Every status reads as word + icon, never color alone.
- "Design only" items are never shown as "Broken".
- Screenshots of every story at desktop and mobile.

## Stop and report

Report in the standard shape. Push to `replit/catalogue-screens`.
