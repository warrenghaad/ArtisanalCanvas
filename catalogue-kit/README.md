# Catalogue kit

A portable kit for building an honest, evidence-backed catalogue of what an app does, presented as a readable eTextbook. It works in three tiers:

| Tier | What | Lives in |
|---|---|---|
| 1. Template | eTextbook reading template: contents, chapters, reading pages, card stack, carousel. Knows only "collections, chapters, items". | `schema/template.ts`, `template/TEMPLATE_SPEC.md`; built in `client/src/catalogue-template/` + Storybook |
| 2. Functionality catalogue | The template specialized for functionality: status, evidence, sources, decisions, review history, and the rules for filling them honestly | `schema/catalogue.ts`, `schema/adapter.ts`, `OPERATING_MODEL.md`, `CONSIDERATIONS.md`, `skills/`, `scripts/` |
| 3. App catalogue | Tier 2 applied to one app: its entries, sources, constraints | the app's `catalogue/` folder |

Nothing in this folder mentions a specific app, so it can be copied into any repo.

## Read first

1. `CONSIDERATIONS.md`: how content is researched, ordered, summarized, illustrated, laid out, and reported to a non-developer owner.
2. `OPERATING_MODEL.md`: stages, checkpoints, roles, evidence rules, records, repeat review.
3. `template/TEMPLATE_SPEC.md`: what the tier 1 template must do.

## Files

```
schema/template.ts     tier 1 content format (Collection, Chapter, TemplateItem)
schema/catalogue.ts    tier 2 records (entries, source ledger, decisions, config, manifest)
schema/adapter.ts      tier 2 entries -> tier 1 items (status words and icons live here)
scripts/inventory.ts   structural source map of any git ref; compare refs; files changed since
scripts/validate.ts    checks records, evidence paths, template mapping; --recheck; --export
skills/                three draft skills: evidence audit, editorial, review coordination
prompts/lead-agent.md  standing prompt for the catalogue lead agent (fill in the {{…}})
templates/layout-spec.md  outline for the stage-4 written layout spec
examples/              illustrative sample catalogue (an invented recipe app)
```

## How a catalogue entry maps onto a template item

| Template item slot | Catalogue entry source |
|---|---|
| `title` | `title` |
| `summary` | `summary` |
| `media` | `caption.imageRef`, `caption.alt`, `caption.imageOrigin`, `caption.imageKind` |
| `caption` | `caption.text` |
| `badges` | status word + icon (`STATUS_BADGES`), where it lives (`applicability`), kind of claim (`claimType`) |
| `sections` | What it's for · How it works · Status · Evidence (collapsed) · Open questions · History (collapsed) |
| `facets` | status, where, audience |
| `links` | `related` |
| `sample` | `illustrative` |
| chapter placement | `chapter` (provisional until the owner approves the order) |

`entriesToCollection()` builds the whole collection. The validator checks the mapping on every run.

## Commands (from the repo root)

```bash
npx tsx catalogue-kit/scripts/validate.ts catalogue
```

```bash
npx tsx catalogue-kit/scripts/validate.ts catalogue --recheck
```

```bash
npx tsx catalogue-kit/scripts/inventory.ts main --out catalogue/inventory/main.json
```

```bash
npx tsx catalogue-kit/scripts/inventory.ts --compare catalogue/inventory/main.json catalogue/inventory/other.json --out catalogue/inventory/compare.md
```

```bash
npx tsx catalogue-kit/scripts/inventory.ts --changed catalogue/inventory/main.json HEAD
```

## Adopting the kit in another repo

1. Copy `catalogue-kit/` into the repo. It needs Node, `zod`, and `tsx`.
2. Create `catalogue/` with `config.json`, `sources.json` (`[]`), `decisions.json` (`[]`), `entries/`, and `inventory/`; copy the shapes from `examples/`.
3. Write `catalogue/README.md`, the app's plain-language brief: scope, sources, constraints, who builds what.
4. Fill in `prompts/lead-agent.md` and give it to the agent doing the work.
5. Run the inventory, then the pilot (three entries), then stop for the owner's review.
6. If the repo uses React, copy the built template (`client/src/catalogue-template/`) once it exists.

## Status

Draft v0.1, written before the pilot. Skills and rules get revised after the first pilot review.
