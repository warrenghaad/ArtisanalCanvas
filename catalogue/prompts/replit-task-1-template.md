# Replit task 1: build the tier 1 template (components + Storybook)

**Before pasting:** Claude has built the combined Figma template file and added its link below.

Combined Figma template file: `{{FIGMA_TEMPLATE_URL}}`

---

## Goal

Build the reusable eTextbook reading template as React components with Storybook stories, following `catalogue-kit/template/TEMPLATE_SPEC.md` exactly. It shows any collection of chapters and items. It must know **nothing** about functionality catalogues or ArtisanalCanvas.

## Inputs

- `catalogue-kit/template/TEMPLATE_SPEC.md`: the specification (authoritative)
- `catalogue-kit/schema/template.ts`: the content format components take as props
- `catalogue-kit/CONSIDERATIONS.md` §5 (imaging) and §6 (layout)
- The combined Figma template file above
- `attached_assets/Card_Stack_(Community)_2_1795405724345.zip`

## Steps

1. Unzip the Card Stack into a scratch folder outside `client/`. **Check its license and list its dependencies before copying anything.** If the license doesn't allow reuse, stop and tell the owner.
2. Add Storybook as dev-only tooling (Vite + React builder, the designs add-on for Figma embeds). Add `storybook` and `build-storybook` scripts. Don't change `dev`, `build`, or `start`.
3. Build the components listed in TEMPLATE_SPEC §1 under `client/src/catalogue-template/`. Use the repo's existing building blocks (`@/components/ui/*`, `lucide-react`, `framer-motion`). Take only the stack behavior from the Card Stack, rewritten for these components.
4. Write `sample/sample-collection.json`: neutral content (not ArtisanalCanvas, not functionality), every item marked `"sample": true`. Use a few real photos or simple diagrams, not AI-generated images. Check that it passes `Collection.parse`.
5. Write every story listed in TEMPLATE_SPEC §6, each embedding its Figma frame.
6. Write `client/src/catalogue-template/SOURCES.md` (spec §2.3) and `README.md`.

## Not allowed

- Changing `client/src/App.tsx`, any existing page, any route, the server, or the database
- Wiring the template into the app
- Field names from tier 2 (status, evidence) inside the template
- A second UI or animation library if the existing ones can do the job

## Done looks like (Claude will check each)

TEMPLATE_SPEC §8, items 1–7, all true.

## Stop and report

Stop when the stories are done. Report using the shape in your standing instructions, plus:

- screenshots of each page type at desktop (1440 wide) and mobile (390 wide), each beside its Figma frame;
- the Card Stack license and what you reused, adapted, or left out;
- anything in the spec you couldn't follow, and why.

Push to `replit/catalogue-template`.
