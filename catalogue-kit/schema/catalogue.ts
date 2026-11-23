/**
 * Functionality Catalogue — portable data contract (schemaVersion 1).
 *
 * This file is app-agnostic. It depends only on `zod` so it can be copied into
 * any repository. It defines four record types that live as plain JSON files:
 *
 *   catalogue/config.json        -> CatalogueConfig
 *   catalogue/sources.json       -> SourceLedgerItem[]   (what was inspected, and how far)
 *   catalogue/decisions.json     -> Decision[]           (what the owner decided)
 *   catalogue/entries/<id>.json  -> CatalogueEntry       (one function per file)
 *
 * and one bundle shape, `CatalogueManifest`, for import/export between apps.
 *
 * Three ideas are deliberately kept separate and must never be merged:
 *   1. claimType       - observed / source-stated / proposed: what kind of claim is this?
 *   2. applicability   - in-app / incoming / reference-only / idea: where does it live?
 *   3. status.state    - working / partial / broken / not-built / not-verified: does it work?
 * plus a fourth, independent axis:
 *   4. designDecision  - has the owner approved the design/naming? (not the same as "works")
 */
import { z } from "zod";

export const SCHEMA_VERSION = 1 as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a calendar date: YYYY-MM-DD");

/** Stable, human-readable identifier: lowercase words joined by hyphens. */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase-words-with-hyphens");

// ---------------------------------------------------------------------------
// Vocabularies
// ---------------------------------------------------------------------------

/** Does the function work, as far as dated evidence shows? */
export const ImplementationState = z.enum([
  "working", //      exercised end-to-end and produced the expected result
  "partial", //      some of the action/result path works; a named part does not
  "broken", //       built, but exercising it fails
  "not-built", //    no implementation exists in the inspected app source
  "not-verified", // something exists but nobody has exercised it yet (the honest default)
]);

/** What kind of claim the entry makes. */
export const ClaimType = z.enum([
  "observed", //      someone saw it happen (or read the code path end to end)
  "source-stated", // a document, design, comment, or task says it is intended
  "proposed", //      an idea; nobody has stated it as a requirement yet
]);

/** Where the function lives relative to the catalogued app. */
export const Applicability = z.enum([
  "in-app", //         in the app's current main source
  "incoming", //       in another branch/repo being considered for merge
  "reference-only", // in a design or reference file, not in any app source
  "idea", //           not in any source
]);

export const EvidenceKind = z.enum([
  "repo-path", //      a file (optionally a line range) at a commit
  "runtime-check", //  someone ran the app and exercised the behavior
  "test", //           an automated test that exercises the behavior
  "figma-node", //     a Figma file/page/frame/component node
  "screenshot", //     an image captured from the app or a reference
  "document", //       a spec, task, note, or doc stating intent
  "user-statement", // the owner said it (record where/when)
]);

/**
 * How strongly the evidence supports the claim it is attached to.
 * direct    - exercises or shows the behavior itself (runtime check, test, end-to-end code trace)
 * indirect  - shows a part of it (a component exists, an endpoint exists, a button renders)
 * stated    - only says it is intended (doc, design, task, comment)
 */
export const EvidenceStrength = z.enum(["direct", "indirect", "stated"]);

export const DesignDecisionState = z.enum([
  "undecided",
  "proposed",
  "approved",
  "rejected",
  "superseded",
]);

export const LedgerState = z.enum([
  "inspected", //           fully inspected within the stated scope
  "partially-inspected", // sampled; `limitations` must say what was not looked at
  "pending", //             known and in scope, not yet looked at
  "inaccessible", //        in scope but the agent could not open it (missing access, NOT absence)
  "irrelevant", //          looked at and excluded; `reason` required
]);

export const RelationKind = z.enum([
  "depends-on",
  "feeds",
  "same-function-different-surface",
  "variant-of",
  "replaces",
  "conflicts-with",
  "related",
]);

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const Evidence = z.object({
  id: slug,
  kind: EvidenceKind,
  /** Path, URL, Figma node URL, image path, or "conversation YYYY-MM-DD" for user statements. */
  locator: z.string().min(1),
  /** Git commit (short or full) the locator was read at. Required for repo-path evidence. */
  commit: z.string().optional(),
  /** Optional line range for repo-path evidence, e.g. "120-164". */
  lines: z.string().optional(),
  /** Branch or source name, e.g. "main", "warrenghaad". */
  sourceRef: z.string().optional(),
  checkedOn: isoDate,
  checkedBy: z.string().min(1),
  /** One sentence: what this evidence shows. */
  shows: z.string().min(1),
  strength: EvidenceStrength,
  limitations: z.string().optional(),
});
export type Evidence = z.infer<typeof Evidence>;

export const Status = z.object({
  state: ImplementationState,
  asOf: isoDate,
  reviewer: z.string().min(1),
  /** Ids of entries in this entry's `evidence` array that support the state. */
  evidenceIds: z.array(slug),
  /** Plain-language note: what works, what does not, what was not checked. */
  note: z.string().min(1),
});

export const Caption = z.object({
  /** "[Surface] lets [user] [action] to produce [result]. [Limitation.]" */
  text: z.string().min(1),
  /** Path or URL of the image the caption describes, if any. */
  imageRef: z.string().optional(),
  /** Where the image came from: "app screenshot <date>", "Figma node …", "illustration". */
  imageOrigin: z.string().optional(),
});

export const HistoryItem = z.object({
  date: isoDate,
  by: z.string().min(1),
  change: z.string().min(1),
});

export const CatalogueEntry = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    id: slug,
    /** Everyday-language name, e.g. "Get AI feedback on a drawing". */
    title: z.string().min(1),
    /** What the person is trying to get done, in their words. */
    userGoal: z.string().min(1),
    audience: z.array(z.string().min(1)).min(1),
    claimType: ClaimType,
    applicability: Applicability,
    description: z.string().min(1),
    inputs: z.array(z.string()),
    actions: z.array(z.string()),
    outputs: z.array(z.string()),
    /** Screens, routes, viewers, Figma frames where it appears. */
    surfaces: z.array(z.string()),
    related: z.array(z.object({ id: slug, relation: RelationKind, note: z.string().optional() })),
    status: Status,
    evidence: z.array(Evidence),
    caption: Caption,
    designDecision: DesignDecisionState,
    openQuestions: z.array(z.string()),
    /** Provisional grouping. An editorial hypothesis, never a navigation contract. */
    chapter: z.string().optional(),
    /** True for worked examples / illustrations that are not real catalogue facts. */
    illustrative: z.boolean().optional(),
    history: z.array(HistoryItem).min(1),
  })
  .superRefine((e, ctx) => {
    const ids = new Set(e.evidence.map((x) => x.id));
    for (const id of e.status.evidenceIds) {
      if (!ids.has(id)) {
        ctx.addIssue({ code: "custom", path: ["status", "evidenceIds"], message: `Unknown evidence id "${id}"` });
      }
    }
    const supporting = e.evidence.filter((x) => e.status.evidenceIds.includes(x.id));
    const s = e.status.state;

    if (s !== "not-verified" && supporting.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: `State "${s}" needs at least one supporting evidence id; use "not-verified" when nothing was checked.`,
      });
    }
    if ((s === "working" || s === "broken") && !supporting.some((x) => x.strength === "direct")) {
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: `State "${s}" needs direct evidence (a runtime check, test, or end-to-end trace). A design, filename, button, document, or successful build alone is not enough.`,
      });
    }
    if ((e.applicability === "reference-only" || e.applicability === "idea") && !["not-built", "not-verified"].includes(s)) {
      ctx.addIssue({
        code: "custom",
        path: ["status", "state"],
        message: `A ${e.applicability} entry has no implementation to judge; use "not-built" (or "not-verified").`,
      });
    }
    if (e.applicability === "idea" && e.claimType !== "proposed") {
      ctx.addIssue({ code: "custom", path: ["claimType"], message: `An idea must have claimType "proposed".` });
    }
    for (const [i, ev] of e.evidence.entries()) {
      if (ev.kind === "repo-path" && !ev.commit) {
        ctx.addIssue({ code: "custom", path: ["evidence", i, "commit"], message: "repo-path evidence must record the commit it was read at." });
      }
    }
  });
export type CatalogueEntry = z.infer<typeof CatalogueEntry>;

export const SourceLedgerItem = z
  .object({
    id: slug,
    kind: z.enum(["repo", "branch", "figma-file", "figma-page", "document", "asset", "running-app", "other"]),
    /** Path, branch name, Figma URL, or description. */
    locator: z.string().min(1),
    /** Commit, file version, or date of the copy inspected. */
    revision: z.string().optional(),
    /** What part of the source this row covers. */
    scope: z.string().min(1),
    state: LedgerState,
    reason: z.string().optional(),
    limitations: z.string().optional(),
    inspectedOn: isoDate.optional(),
    inspectedBy: z.string().optional(),
  })
  .superRefine((s, ctx) => {
    if (s.state === "irrelevant" && !s.reason) ctx.addIssue({ code: "custom", path: ["reason"], message: "Say why it was excluded." });
    if (s.state === "inaccessible" && !s.reason) ctx.addIssue({ code: "custom", path: ["reason"], message: "Say what access is missing." });
    if (s.state === "partially-inspected" && !s.limitations) {
      ctx.addIssue({ code: "custom", path: ["limitations"], message: "Say what was not inspected. A sample is never 'complete'." });
    }
    if ((s.state === "inspected" || s.state === "partially-inspected") && (!s.inspectedOn || !s.inspectedBy)) {
      ctx.addIssue({ code: "custom", path: ["inspectedOn"], message: "Record when and by whom it was inspected." });
    }
  });
export type SourceLedgerItem = z.infer<typeof SourceLedgerItem>;

export const Decision = z.object({
  id: slug,
  date: isoDate,
  /** The decision in one plain sentence. */
  statement: z.string().min(1),
  rationale: z.string().optional(),
  alternatives: z.array(z.string()).optional(),
  state: z.enum(["proposed", "approved", "rejected", "superseded"]),
  /** "owner" for the user; agent names may only ever *propose*. */
  decidedBy: z.string().min(1),
  /** Where the decision was made: "conversation 2026-11-23 (Claude Code)", task id, etc. */
  source: z.string().min(1),
  supersedes: slug.optional(),
});
export type Decision = z.infer<typeof Decision>;

export const CatalogueConfig = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  app: z.object({
    name: z.string().min(1),
    summary: z.string().min(1),
    owner: z.string().min(1),
    audience: z.array(z.string()),
  }),
  /** Where catalogue records live, relative to the repo root. */
  paths: z.object({
    entries: z.string(),
    sources: z.string(),
    decisions: z.string(),
    inventory: z.string(),
  }),
  /** Which stage of the operating model the catalogue is in. */
  stage: z.enum([
    "0-setup",
    "1-inventory",
    "2-pilot",
    "A-pilot-review",
    "3-entries",
    "B-editorial-review",
    "4-layout",
    "C-layout-review",
    "5-handoff",
  ]),
  /** Branches or repositories in scope, with a role for each. */
  codeSources: z.array(z.object({ ref: z.string(), role: z.enum(["primary", "incoming", "reference"]), note: z.string().optional() })),
  /** Things agents must not do in this repository, in plain words. */
  constraints: z.array(z.string()),
});
export type CatalogueConfig = z.infer<typeof CatalogueConfig>;

export const CatalogueManifest = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  generatedAt: z.string(),
  config: CatalogueConfig,
  entries: z.array(CatalogueEntry),
  sources: z.array(SourceLedgerItem),
  decisions: z.array(Decision),
});
export type CatalogueManifest = z.infer<typeof CatalogueManifest>;
