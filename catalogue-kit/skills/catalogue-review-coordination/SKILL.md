---
name: catalogue-review-coordination
description: Run a functionality catalogue as a staged, owner-reviewed process. Use at the start of any catalogue session, at each checkpoint, when the owner says "where are we", "review this", "what's next", "approve", or "re-review the catalogue", and before handing catalogue results to a build task. Enforces stage boundaries, reconciles specialist passes, records owner decisions, runs repeat reviews, and writes narrowly scoped build handoffs. Never authorizes implementation by itself.
version: 0.1.0-draft
---

# Catalogue review coordination

Draft v0.1. This is the lead agent's procedure. The other two skills are passes it calls.

## Use when

- Opening a catalogue session (read state, say where things stand)
- Reaching a checkpoint (A pilot, B editorial, C layout)
- Re-reviewing after the code or designs changed
- Preparing a handoff to an implementation task

## Procedure: session start

1. Read `catalogue/README.md`, `catalogue/config.json` (stage), `catalogue/decisions.json`, and `catalogue/RECONCILIATION.md` if present.
2. Run `npx tsx catalogue-kit/scripts/validate.ts catalogue` and report the counts in one or two plain sentences.
3. State the current stage, what was done last, and the one next step. Do nothing beyond the current stage.

## Procedure: reconciling instructions (stage 0, and whenever new instructions appear)

1. List every instruction source: project instruction files (`AGENTS.md`, `replit.md`, `CLAUDE.md`), tool-local memory and task files, agent role files, older direction docs.
2. For each instruction that touches scope, naming, structure, or process, compare it with the owner's newest decisions.
3. Record conflicts in a table: source, what it says, what the newer direction says, proposed resolution, and status (proposed or approved).
4. Never silently delete or rewrite an older instruction. Propose the correction; the owner approves.

## Procedure: checkpoint

Show, in this order:

1. **The artifact**, or a link to it.
2. **The evidence** behind each claim, at a glance (status with date and evidence strength).
3. **What is unknown or inaccessible.**
4. **Questions only the owner can answer.** Keep them few, plain, and with your recommendation.
5. **The proposed next step**, and the fact that approving this stage does not authorize building.

Record the owner's answers as decisions (`decidedBy: "owner"`, with `source`) and move `config.stage` forward only on approval.

## Procedure: repeat review

1. `npx tsx catalogue-kit/scripts/inventory.ts --changed catalogue/inventory/<branch>.json <ref>`
2. `npx tsx catalogue-kit/scripts/validate.ts catalogue --recheck`
3. Send only the flagged claims back through the evidence audit. Append evidence and history; never remove earlier reviews or owner decisions.
4. Regenerate and commit the inventory baseline.
5. Report what changed, which statuses moved, and what still needs the owner.

## Procedure: build handoff (stage 5)

Write a handoff that a separate build task can follow without re-deciding anything:

- **Scope**: which entries and which approved layout spec it implements
- **Reuse / adapt / map / leave out**: per existing component or reference
- **Preserve**: existing routes, data, user content, and behaviors that must not change
- **Data contract**: read catalogue records through `catalogue-kit/schema/catalogue.ts`; never fork the format
- **Acceptance**: what the owner will check, on desktop and mobile, with keyboard
- **Not included**: everything else, explicitly

The owner authorizes the build separately.

## Stop when

- any stop condition in `catalogue-kit/OPERATING_MODEL.md` §8 applies;
- a checkpoint is reached;
- a specialist pass returns conflicting findings you cannot resolve from evidence.
