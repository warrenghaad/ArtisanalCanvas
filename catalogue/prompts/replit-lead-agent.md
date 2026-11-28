# Replit standing instructions: catalogue work

Paste this into Replit once, at the start of catalogue work. Then paste one task file at a time.

---

You are working on the ArtisanalCanvas functionality catalogue. The planning, specifications, rules, and skills were written for you in the GitHub repository. **Follow them; do not write your own versions.** If something in them is wrong or unworkable, stop and say so in plain words.

**First, pull the latest from GitHub** so you have `catalogue/` and `catalogue-kit/`. They arrive on the branch `claude/intelligent-galileo-hcl231` (draft pull request #6) until the owner merges it.

**Read, in this order, before any task:**

1. `catalogue/README.md`: the brief, who does what, order of work
2. `catalogue/decisions.json`: owner decisions; these override older instructions, including `AGENTS.md`, `replit.md`, `docs/CODEX_SWARM_DIRECTIONS.md`, your own memory, and your earlier tasks
3. `catalogue/RECONCILIATION.md`: which older instructions are paused or under review
4. `catalogue-kit/CONSIDERATIONS.md`: how to research, order, summarize, illustrate, lay out, and report
5. `catalogue-kit/OPERATING_MODEL.md`: stages, checkpoints, evidence rules
6. The task file the owner pastes, and the skill it names in `catalogue-kit/skills/`

**Earlier tasks.** Task #12, "Portable Functionality Catalogue", and "Catalogue This App's Functionality" stay paused. The task files in `catalogue/prompts/` replace them, pending the owner's confirmation (`decisions.json` → `replace-task-12`).

**Always:**

- Do only the pasted task. Stop where it says to stop. Finishing a task never authorizes the next one.
- Never change existing app screens, routes, the app shell, database schemas, or stored user data unless the task explicitly allows it.
- Never merge, rebase, or rewrite the `warrenghaad` branch.
- Never build Prism or use its workspace grid.
- Never present AI-generated images as the app or as a design. Screenshots use sample data only.
- Facts go in `catalogue/` files and get pushed to GitHub. Your memory may hold a one-line pointer to a file, nothing more.
- You may *propose* decisions (`"state": "proposed"`, `"decidedBy": "replit"`); only the owner approves.
- Before reporting, run:
  ```
  npx tsx catalogue-kit/scripts/validate.ts catalogue
  npm run build
  npm run check
  ```
  `npm run check` currently has 7 errors that predate this work; report whether you added any.
- Push your work to GitHub on a branch named for the task (for example `replit/catalogue-template`) so Claude can review it.

**Report back to the owner in this shape, in everyday words:**

1. What I did, in two or three sentences, with screenshots.
2. What I'm confident about, and why.
3. What I didn't do or couldn't check, and why.
4. Up to three questions for the owner, each with my recommendation.
5. The branch name and the validator, build, and check results.

Explain any technical word the first time you use it.
