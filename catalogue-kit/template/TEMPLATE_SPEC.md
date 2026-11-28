# Tier 1 template: specification

A reusable eTextbook-style reading template. It shows any **collection → chapters → items** as a contents page, chapter openers, reading pages, a one-at-a-time card stack, and a carousel. It knows nothing about functionality catalogues or any specific app.

- **Design source:** one combined Figma file ("Catalogue Template"), built from the owner's Figma eTextbook file and the Card Stack design. Originals are left untouched.
- **Built form:** React components + Storybook stories, in this repo.
- **Content format:** `catalogue-kit/schema/template.ts` (`Collection`, `Chapter`, `TemplateItem`).
- **Builder:** Replit. **Reviewer:** Claude, against §8. **Approver:** the owner.
- Read `catalogue-kit/CONSIDERATIONS.md` §5–6 first; this spec follows it.

---

## 1. Where it lives and its boundaries

```
client/src/catalogue-template/
  components/      CollectionOverview, ChapterOpener, ItemReadingPage, ItemCard,
                   StackReview, ItemCarousel, ReviewSummary, BadgeChip, MediaFrame,
                   SearchAndFilters
  stories/         one *.stories.tsx per component, with the states in §6
  sample/          sample-collection.json (neutral, labelled "Sample")
  index.ts         public exports
  README.md        how to use it in another repo
```

- Self-contained: imports only React, the repo's existing `@/components/ui/*` building blocks (card, carousel, badge, button, tabs, collapsible, input), `lucide-react`, `framer-motion` (already installed), and `catalogue-kit/schema/template.ts`.
- **No app routes, no changes to `client/src/App.tsx`, no Prism, no dock wiring.** The template is seen only in Storybook until the owner approves wiring it into the app.
- Storybook is dev-only tooling: add it as `devDependencies` with the Vite + React builder and `npm run storybook` / `npm run build-storybook` scripts. It must not change `npm run dev` or `npm run build`.

## 2. Importing the sources

### 2.1 Combined Figma file (Claude prepares it)

Frames, desktop (1440 wide) and mobile (390 wide) for each:

| Frame | From |
|---|---|
| Overview / contents | Figma eTextbook (library page) |
| Chapter opener | Figma eTextbook |
| Reading page | Figma eTextbook (detail page) |
| Card | both; card face from eTextbook, proportions from Card Stack |
| Stack review | Card Stack |
| Carousel | Figma eTextbook (library row) + Card Stack card |
| Review summary | new (simple list) |
| States: long title, no image, empty chapter, sample label | new variants |

Every frame has a link that Storybook stories embed.

### 2.2 Card Stack project (Replit imports it)

1. Unzip `attached_assets/Card_Stack_(Community)_2_….zip` **into a scratch folder outside `client/`**.
2. **Before copying anything, check its license**, and list its dependencies. Record both in `client/src/catalogue-template/SOURCES.md`.
3. Take only the stack behavior (ordering, swipe/advance, motion). Rewrite it to use the template's `TemplateItem` and the repo's building blocks. Do not add a second UI library or animation library if `framer-motion` can do it.
4. Leave out its sample content and branding.

### 2.3 Source record

`client/src/catalogue-template/SOURCES.md` lists, per component: the Figma frame link it follows, which Card Stack parts were reused, adapted, or left out, and why.

## 3. Content model (from `template.ts`)

- **Collection**: title, intro, as-of date, badge legend, chapters, items.
- **Chapter**: title, intro (the goal), item ids in reading order, related chapters. Each item has exactly one home chapter.
- **Item** slots: title, one-line summary, media (src, alt, origin label, kind, aspect), caption (required with media), badges (label + icon + tone), sections (heading, body, collapsed?), facets (for filters), links, sample flag.

Components take these shapes as props. **No field names from tier 2** (no "status", "evidence"). Tier 2 maps onto these slots through `catalogue-kit/schema/adapter.ts`.

## 4. Page types and behavior

| Page | Shows | Interaction |
|---|---|---|
| **Overview** | title, intro, as-of, legend, chapters in order with item counts (plain tallies), search, facet filters | search/filter narrows a results list; clearing restores the reading order |
| **Chapter opener** | goal, items as cards in order, related chapters | open item; next/previous chapter |
| **Reading page** | see §5 order | previous/next item in reading order; expand/collapse sections; back to chapter |
| **Card** | media (cropped to aspect), title, summary, badges | whole card opens the item |
| **Stack review** | one card at a time, "3 of 8", previous/next buttons | buttons, ← → keys, optional swipe; "open" goes to the reading page and back to the same position |
| **Carousel** | related items side by side | buttons, ← → keys; keeps the selected item and active filters |
| **Review summary** | items with a chosen facet (e.g. open questions), changed-since list | open item |

## 5. Reading page order (all screen sizes)

1. Title + badges
2. Media in a frame with its visible origin label, then the caption
3. Sections, in the order given; collapsed ones show their heading with an expand control
4. Links (related items)
5. Previous / next

Mobile: single column in the same order.

## 6. Required Storybook stories

For every component: **Default**, **Long text** (title 90+ characters, summary 200+), **No image**, **Many badges**, **Mobile (390px)**, **Sample label visible**. Plus:

- Overview: empty collection; one chapter; search with no results.
- Stack review: first item, last item, single item, reduced motion.
- Carousel: 1 item, 12 items.
- Reading page: all sections collapsed; very long body.

Each story embeds its Figma frame through the designs add-on.

## 7. Rules (from CONSIDERATIONS §5–6)

- Every action has a keyboard path and a single-tap path; swipe and drag are optional extras.
- Badges are word + icon + color, never color alone.
- No hover-only information. Touch targets ≥ 44×44 px.
- `prefers-reduced-motion` disables stack animation.
- Screen readers hear position in stack and carousel ("3 of 8") and section expand state.
- Media always shows its origin label; missing media shows "No image yet" with no decorative stand-in.
- Sample content shows a visible "Sample" label.
- No randomized or invented numbers anywhere.

## 8. Acceptance (what Claude checks, then the owner approves)

1. `npm run build-storybook` succeeds; `npm run dev` and `npm run build` are unchanged and still pass.
2. Every story in §6 exists and renders without console errors.
3. Screenshots of every page type at 1440 and 390 wide, compared side by side with the Figma frames.
4. A keyboard-only walk-through of overview → chapter → reading page → stack → carousel, without a mouse.
5. `SOURCES.md` lists the Card Stack license and what was reused, adapted, or left out.
6. `git diff` touches only `client/src/catalogue-template/`, `.storybook/`, `package.json`/`package-lock.json`, and the sample file. No app routes or existing pages changed.
7. The sample collection passes `Collection.parse` from `catalogue-kit/schema/template.ts`.
