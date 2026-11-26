/**
 * Tier 2 -> Tier 1 adapter.
 *
 * Turns functionality catalogue entries into template items and a template
 * collection, so the catalogue renders with the same eTextbook / card-stack
 * screens as any other collection. Display only: never write back through it.
 */
import type { CatalogueEntry } from "./catalogue";
import {
  TEMPLATE_SCHEMA_VERSION,
  type Badge,
  type Chapter,
  type Collection,
  type TemplateItem,
} from "./template";

/** Status words and icons (lucide names). Never color-only. */
export const STATUS_BADGES: Record<CatalogueEntry["status"]["state"], Badge & { meaning: string }> = {
  working: { label: "Working", icon: "circle-check", tone: "positive", meaning: "Someone ran it, or a test or full trace shows it works." },
  partial: { label: "Partly working", icon: "circle-dashed", tone: "caution", meaning: "Some of it works; the note says which part doesn't." },
  broken: { label: "Broken", icon: "circle-x", tone: "negative", meaning: "It's built, and trying it fails." },
  "not-built": { label: "Not built", icon: "circle-minus", tone: "neutral", meaning: "No version of it exists in the app." },
  "not-verified": { label: "Not checked yet", icon: "circle-help", tone: "info", meaning: "Something exists, but nobody has tried it yet." },
};

export const APPLICABILITY_LABELS: Record<CatalogueEntry["applicability"], string> = {
  "in-app": "In the app",
  incoming: "In another version (incoming)",
  "reference-only": "Design only",
  idea: "Idea",
};

export const CLAIM_LABELS: Record<CatalogueEntry["claimType"], string> = {
  observed: "Seen working or traced",
  "source-stated": "Stated in a design or document",
  proposed: "Suggested idea",
};

const list = (xs: string[]) => (xs.length ? xs.map((x) => `- ${x}`).join("\n") : "_None recorded._");

export function entryToItem(e: CatalogueEntry): TemplateItem {
  const s = STATUS_BADGES[e.status.state];
  const sections = [
    { heading: "What it's for", body: `${e.userGoal}\n\n${e.description}`, collapsed: false },
    {
      heading: "How it works",
      body: `**You give it**\n${list(e.inputs)}\n\n**You do**\n${list(e.actions)}\n\n**You get**\n${list(e.outputs)}\n\n**Where**\n${list(e.surfaces)}`,
      collapsed: false,
    },
    { heading: "Status", body: `${s.label} (as of ${e.status.asOf}, checked by ${e.status.reviewer}). ${e.status.note}`, collapsed: false },
    {
      heading: "Evidence",
      body: e.evidence.length
        ? e.evidence
            .map((ev) => `- **${ev.strength}** · ${ev.kind} · ${ev.checkedOn}: ${ev.shows} (${ev.locator}${ev.commit ? ` @ ${ev.commit.slice(0, 7)}` : ""})${ev.limitations ? ` — ${ev.limitations}` : ""}`)
            .join("\n")
        : "_No evidence recorded yet._",
      collapsed: true,
    },
    { heading: "Open questions", body: list(e.openQuestions), collapsed: e.openQuestions.length === 0 },
    { heading: "History", body: e.history.map((h) => `- ${h.date} · ${h.by}: ${h.change}`).join("\n"), collapsed: true },
  ];
  return {
    id: e.id,
    title: e.title,
    summary: e.summary,
    media: e.caption.imageRef
      ? {
          src: e.caption.imageRef,
          alt: e.caption.alt ?? e.title,
          origin: e.caption.imageOrigin ?? "Unknown origin",
          kind: e.caption.imageKind ?? "illustration",
          aspect: "free",
        }
      : undefined,
    caption: e.caption.text,
    badges: [
      { label: s.label, icon: s.icon, tone: s.tone },
      { label: APPLICABILITY_LABELS[e.applicability], icon: "map-pin", tone: "neutral" },
      { label: CLAIM_LABELS[e.claimType], icon: "quote", tone: "neutral" },
    ] satisfies Badge[],
    sections,
    facets: {
      status: [s.label],
      where: [APPLICABILITY_LABELS[e.applicability]],
      audience: e.audience,
    },
    links: e.related.map((r) => ({ label: `${r.relation}: ${r.id}`, href: `#${r.id}`, itemId: r.id })),
    sample: e.illustrative ?? false,
  };
}

/**
 * Build a template collection. Chapters come from each entry's provisional
 * `chapter`, in the order given (or first appearance); entries without one go
 * to "Not yet grouped".
 */
export function entriesToCollection(
  entries: CatalogueEntry[],
  opts: { id: string; title: string; intro: string; asOf?: string; chapterOrder?: string[] },
): Collection {
  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "chapter";
  const order: string[] = [...(opts.chapterOrder ?? [])];
  for (const e of entries) {
    const c = e.chapter ?? "Not yet grouped";
    if (!order.includes(c)) order.push(c);
  }
  const chapters: Chapter[] = order
    .map((title) => ({
      id: slugify(title),
      title,
      intro: title === "Not yet grouped" ? "Functions not yet placed in a chapter." : `Functions for: ${title}.`,
      itemIds: entries.filter((e) => (e.chapter ?? "Not yet grouped") === title).map((e) => e.id),
      relatedChapterIds: [],
    }))
    .filter((c) => c.itemIds.length > 0);
  return {
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    id: opts.id,
    title: opts.title,
    intro: opts.intro,
    asOf: opts.asOf,
    legend: Object.values(STATUS_BADGES),
    chapters,
    items: entries.map(entryToItem),
  };
}
