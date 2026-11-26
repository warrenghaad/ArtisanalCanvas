/**
 * Functionality Catalogue — validator and re-review checker (portable).
 *
 * Usage (from the repo root):
 *   npx tsx catalogue-kit/scripts/validate.ts [catalogueDir=catalogue]
 *   npx tsx catalogue-kit/scripts/validate.ts [catalogueDir] --recheck   # also flag evidence whose files changed
 *   npx tsx catalogue-kit/scripts/validate.ts [catalogueDir] --export out.json
 *
 * Checks:
 *   - every record matches catalogue-kit/schema/catalogue.ts
 *   - entry file names match entry ids; ids are unique
 *   - `related` links point at entries that exist
 *   - repo-path evidence points at a file that exists at the recorded commit
 *   - entries convert into a valid tier-1 template collection (schema/adapter.ts)
 *   - (--recheck) repo-path evidence whose file changed between its commit and HEAD,
 *     so the claim can be marked for re-review. Earlier reviews are never edited by this script.
 *
 * Exit code 1 on any error; warnings do not fail.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import {
  CatalogueConfig,
  CatalogueEntry,
  CatalogueManifest,
  Decision,
  SourceLedgerItem,
  SCHEMA_VERSION,
} from "../schema/catalogue";
import { Collection } from "../schema/template";
import { entriesToCollection } from "../schema/adapter";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const exportIdx = args.indexOf("--export");
const exportPath = exportIdx >= 0 ? args[exportIdx + 1] : undefined;
const dir = args.find((a, i) => !a.startsWith("--") && !(exportIdx >= 0 && i === exportIdx + 1)) ?? "catalogue";

const errors: string[] = [];
const warnings: string[] = [];
const recheck: string[] = [];

function git(...a: string[]): string | null {
  try {
    return execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

function load<T>(file: string, schema: z.ZodType<T>, label: string): T | undefined {
  if (!existsSync(file)) {
    errors.push(`${label}: missing file ${file}`);
    return undefined;
  }
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${label}: not valid JSON (${(e as Error).message})`);
    return undefined;
  }
  const r = schema.safeParse(raw);
  if (!r.success) {
    for (const issue of r.error.issues) errors.push(`${label}: ${issue.path.join(".") || "(root)"} — ${issue.message}`);
    return undefined;
  }
  return r.data;
}

const config = load(join(dir, "config.json"), CatalogueConfig, "config.json");
const p = config?.paths ?? { entries: join(dir, "entries"), sources: join(dir, "sources.json"), decisions: join(dir, "decisions.json"), inventory: join(dir, "inventory") };
const sources = load(p.sources, z.array(SourceLedgerItem), "sources.json") ?? [];
const decisions = load(p.decisions, z.array(Decision), "decisions.json") ?? [];

const entries: CatalogueEntry[] = [];
if (existsSync(p.entries)) {
  for (const f of readdirSync(p.entries).filter((f) => f.endsWith(".json")).sort()) {
    const e = load(join(p.entries, f), CatalogueEntry, `entries/${f}`);
    if (!e) continue;
    if (`${e.id}.json` !== f) errors.push(`entries/${f}: file name must be "${e.id}.json"`);
    entries.push(e);
  }
} else {
  warnings.push(`no entries folder at ${p.entries}`);
}

const dupes = (xs: { id: string }[], label: string) => {
  const seen = new Set<string>();
  for (const x of xs) {
    if (seen.has(x.id)) errors.push(`${label}: duplicate id "${x.id}"`);
    seen.add(x.id);
  }
};
dupes(entries, "entries");
dupes(sources, "sources.json");
dupes(decisions, "decisions.json");

const entryIds = new Set(entries.map((e) => e.id));
const decisionIds = new Set(decisions.map((d) => d.id));
for (const d of decisions) {
  if (d.supersedes && !decisionIds.has(d.supersedes)) errors.push(`decisions.json: ${d.id} supersedes unknown "${d.supersedes}"`);
  if (d.state === "approved" && d.decidedBy !== "owner") errors.push(`decisions.json: ${d.id} is "approved" but decidedBy is "${d.decidedBy}". Only the owner approves; agents propose.`);
}

for (const e of entries) {
  for (const r of e.related) if (!entryIds.has(r.id)) warnings.push(`entries/${e.id}: related id "${r.id}" has no entry yet`);
  if (e.illustrative) warnings.push(`entries/${e.id}: marked illustrative; it is an example, not a catalogue fact`);
  for (const ev of e.evidence) {
    if (ev.kind !== "repo-path" || !ev.commit) continue;
    const exists = git("cat-file", "-e", `${ev.commit}:${ev.locator}`) !== null;
    if (!exists) {
      errors.push(`entries/${e.id}: evidence ${ev.id} — "${ev.locator}" does not exist at commit ${ev.commit} (or the commit is unknown here; fetch the branch)`);
      continue;
    }
    if (flags.has("--recheck")) {
      const changed = git("diff", "--name-only", ev.commit, "HEAD", "--", ev.locator);
      if (changed && changed.trim()) recheck.push(`${e.id}: evidence ${ev.id} (${ev.locator}) changed since ${ev.commit.slice(0, 7)}; re-review status "${e.status.state}"`);
    }
  }
}

// Tier 2 -> tier 1: entries must render as a valid template collection.
if (entries.length && config) {
  const col = Collection.safeParse(
    entriesToCollection(entries, { id: "catalogue", title: config.app.name, intro: config.app.summary }),
  );
  if (!col.success) for (const i of col.error.issues) errors.push(`template mapping: ${i.path.join(".")} — ${i.message}`);
}

const counts = (xs: string[]) => xs.reduce<Record<string, number>>((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});
console.log(`Catalogue at ${dir}`);
console.log(`  stage: ${config?.stage ?? "?"}`);
console.log(`  entries: ${entries.length} ${JSON.stringify(counts(entries.map((e) => e.status.state)))}`);
console.log(`  sources: ${sources.length} ${JSON.stringify(counts(sources.map((s) => s.state)))}`);
console.log(`  decisions: ${decisions.length} ${JSON.stringify(counts(decisions.map((d) => d.state)))}`);
for (const w of warnings) console.log(`  warn: ${w}`);
for (const r of recheck) console.log(`  recheck: ${r}`);
for (const er of errors) console.log(`  ERROR: ${er}`);

if (exportPath && config && errors.length === 0) {
  const manifest = CatalogueManifest.parse({
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    config,
    entries,
    sources,
    decisions,
  });
  writeFileSync(exportPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`  exported manifest to ${exportPath}`);
}

console.log(errors.length ? `FAILED with ${errors.length} error(s)` : "OK");
process.exit(errors.length ? 1 : 0);
