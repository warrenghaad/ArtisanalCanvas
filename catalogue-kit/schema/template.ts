/**
 * Tier 1 — Reading template content format (schemaVersion 1).
 *
 * The eTextbook / card-stack template renders ANY collection of items with
 * this shape. It knows nothing about functionality, status, or a specific app.
 * Tier 2 (catalogue.ts) maps its richer entries onto these items for display.
 *
 * Depends only on `zod`, so it can be copied into any repository.
 */
import { z } from "zod";

export const TEMPLATE_SCHEMA_VERSION = 1 as const;

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase-words-with-hyphens");

export const Media = z.object({
  src: z.string().min(1),
  /** One sentence describing what the image shows. Required. */
  alt: z.string().min(1),
  /** Visible origin label, e.g. "App screenshot, 2026-11-26" or "Figma design: Library page". */
  origin: z.string().min(1),
  kind: z.enum(["screenshot", "design", "diagram", "photo", "illustration"]),
  aspect: z.enum(["4:3", "16:10", "9:19.5", "1:1", "free"]).default("free"),
});
export type Media = z.infer<typeof Media>;

/** A small labelled marker shown on cards and pages (tier 2 uses it for status). */
export const Badge = z.object({
  label: z.string().min(1),
  /** Icon name from the host's icon set (e.g. lucide). Badges are never color-only. */
  icon: z.string().min(1),
  tone: z.enum(["neutral", "positive", "caution", "negative", "info"]),
});
export type Badge = z.infer<typeof Badge>;

export const Section = z.object({
  heading: z.string().min(1),
  /** Plain text or Markdown. */
  body: z.string(),
  /** Collapsed by default (e.g. evidence, history). */
  collapsed: z.boolean().default(false),
});

export const TemplateItem = z.object({
  id: slug,
  title: z.string().min(1),
  /** One line, shown on cards. */
  summary: z.string().min(1),
  media: Media.optional(),
  /** Shown under the media. Required when media is present. */
  caption: z.string().optional(),
  badges: z.array(Badge).default([]),
  sections: z.array(Section).default([]),
  /** Filterable facets, e.g. { audience: ["student"], area: ["drawing"] }. */
  facets: z.record(z.array(z.string())).default({}),
  links: z.array(z.object({ label: z.string(), href: z.string(), itemId: slug.optional() })).default([]),
  /** True for sample content; the template must visibly label it. */
  sample: z.boolean().default(false),
}).refine((i) => !i.media || !!i.caption, { message: "An item with media needs a caption.", path: ["caption"] });
export type TemplateItem = z.infer<typeof TemplateItem>;

export const Chapter = z.object({
  id: slug,
  title: z.string().min(1),
  /** The goal of the chapter in one or two sentences. */
  intro: z.string().min(1),
  /** Item ids in reading order. Each item has exactly one home chapter. */
  itemIds: z.array(slug),
  /** Cross-links to related chapters instead of duplicated items. */
  relatedChapterIds: z.array(slug).default([]),
});
export type Chapter = z.infer<typeof Chapter>;

export const Collection = z
  .object({
    schemaVersion: z.literal(TEMPLATE_SCHEMA_VERSION),
    id: slug,
    title: z.string().min(1),
    intro: z.string().min(1),
    /** Shown on the overview, e.g. "Reviewed 2026-11-26". */
    asOf: z.string().optional(),
    /** Legend for the badges used in this collection. */
    legend: z.array(Badge.extend({ meaning: z.string() })).default([]),
    chapters: z.array(Chapter),
    items: z.array(TemplateItem),
  })
  .superRefine((c, ctx) => {
    const ids = new Set(c.items.map((i) => i.id));
    const homes = new Map<string, string>();
    for (const ch of c.chapters) {
      for (const id of ch.itemIds) {
        if (!ids.has(id)) ctx.addIssue({ code: "custom", path: ["chapters"], message: `Chapter ${ch.id} lists unknown item "${id}"` });
        if (homes.has(id)) ctx.addIssue({ code: "custom", path: ["chapters"], message: `Item "${id}" is in two chapters (${homes.get(id)}, ${ch.id}); use a cross-link instead` });
        homes.set(id, ch.id);
      }
    }
  });
export type Collection = z.infer<typeof Collection>;
