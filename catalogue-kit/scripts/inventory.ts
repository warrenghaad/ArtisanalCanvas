/**
 * Functionality Catalogue — structural inventory (portable).
 *
 * Reads any git ref WITHOUT checking it out and lists the raw places where
 * functionality can live: client routes, server endpoints, database tables,
 * pages, environment variables, external AI/data services, and where docs sit.
 * Every item carries file + line, and the whole report carries the commit SHA.
 *
 * This is a SOURCE MAP, not a catalogue. A route or endpoint existing is
 * "indirect" evidence at best; it never proves a function works.
 *
 * Usage (from the repo root):
 *   npx tsx catalogue-kit/scripts/inventory.ts <ref> [--out file.json]
 *   npx tsx catalogue-kit/scripts/inventory.ts --compare a.json b.json [--out report.md]
 *   npx tsx catalogue-kit/scripts/inventory.ts --changed <old.json> <ref>   # files changed since an inventory
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

type Hit = { value: string; file: string; line: number; detail?: string };
export type Inventory = {
  inventoryVersion: 1;
  ref: string;
  commit: string;
  commitDate: string;
  generatedAt: string;
  totals: { files: number; codeFiles: number; docFiles: number };
  areas: Record<string, number>;
  clientRoutes: Hit[];
  serverEndpoints: Hit[];
  dbTables: Hit[];
  pages: Hit[];
  envVars: Hit[];
  externalServices: Hit[];
  agentInstructionFiles: string[];
  docs: Record<string, number>;
};

const git = (...args: string[]) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 512 });

const IGNORE = /(^|\/)(node_modules|dist|build|\.git|attached_assets|coverage)(\/|$)|\.min\.js$|package-lock\.json$/;
const CODE = /\.(tsx?|jsx?|mjs|cjs|py|go|rb|vue|svelte)$/;
const DOC = /\.(md|mdx|txt)$/i;
const AGENT_FILES = /(^|\/)(AGENTS\.md|CLAUDE\.md|replit\.md|GEMINI\.md|\.cursorrules|copilot-instructions\.md|SKILL\.md)$|(^|\/)\.(codex|agents|claude|cursor)\//;

const PATTERNS: { key: keyof Inventory; re: RegExp; detail?: (m: RegExpExecArray) => string }[] = [
  // React Router / wouter / generic `path:` route configs
  { key: "clientRoutes", re: /<Route\b[^>]*\bpath=\{?["'`]([^"'`]+)["'`]/g },
  { key: "clientRoutes", re: /\bpath:\s*["'`](\/[^"'`]*)["'`]/g },
  // Express / Hono / Fastify style: app.get("/x"), router.post('/y'), studioRouter.put(`/z`)
  {
    key: "serverEndpoints",
    re: /\b([A-Za-z_$][\w$]*)\.(get|post|put|patch|delete|all)\(\s*["'`]([^"'`]+)["'`]/g,
    detail: (m) => m[2].toUpperCase(),
  },
  // Drizzle tables
  { key: "dbTables", re: /\b(?:pgTable|sqliteTable|mysqlTable)\(\s*["'`]([^"'`]+)["'`]/g },
  // Env vars
  { key: "envVars", re: /\bprocess\.env\.([A-Z][A-Z0-9_]+)/g },
  { key: "envVars", re: /\bimport\.meta\.env\.([A-Z][A-Z0-9_]+)/g },
  // External AI / data services (by import)
  {
    key: "externalServices",
    re: /from\s+["'`](openai|@anthropic-ai\/sdk|@google\/genai|@google\/generative-ai|@supabase\/supabase-js|@neondatabase\/serverless|firebase[^"'`]*|replicate|stripe|@aws-sdk\/[^"'`]+)["'`]/g,
  },
];

function valueOf(key: keyof Inventory, m: RegExpExecArray): string {
  if (key === "serverEndpoints") return m[3];
  return m[1];
}

export function buildInventory(ref: string): Inventory {
  const commit = git("rev-parse", ref).trim();
  const commitDate = git("show", "-s", "--format=%cI", commit).trim();
  const files = git("ls-tree", "-r", "--name-only", commit).split("\n").filter(Boolean);
  const kept = files.filter((f) => !IGNORE.test(f));

  const inv: Inventory = {
    inventoryVersion: 1,
    ref,
    commit,
    commitDate,
    generatedAt: new Date().toISOString(),
    totals: { files: files.length, codeFiles: 0, docFiles: 0 },
    areas: {},
    clientRoutes: [],
    serverEndpoints: [],
    dbTables: [],
    pages: [],
    envVars: [],
    externalServices: [],
    agentInstructionFiles: [],
    docs: {},
  };

  for (const f of files) {
    const parts = f.split("/");
    const area = parts.length > 2 ? `${parts[0]}/${parts[1]}` : parts[0];
    inv.areas[area] = (inv.areas[area] ?? 0) + 1;
    if (AGENT_FILES.test(f)) inv.agentInstructionFiles.push(f);
  }

  for (const f of kept) {
    if (DOC.test(f)) {
      inv.totals.docFiles++;
      const top = f.includes("/") ? f.split("/")[0] : "(root)";
      inv.docs[top] = (inv.docs[top] ?? 0) + 1;
      continue;
    }
    if (!CODE.test(f)) continue;
    inv.totals.codeFiles++;
    if (/(^|\/)pages\/[^/]+\.(tsx|jsx|vue|svelte)$/.test(f)) inv.pages.push({ value: f.split("/").pop()!, file: f, line: 1 });

    let text: string;
    try {
      text = git("show", `${commit}:${f}`);
    } catch {
      continue;
    }
    if (text.length > 2_000_000) continue;
    const lineStarts = [0];
    for (let i = 0; i < text.length; i++) if (text[i] === "\n") lineStarts.push(i + 1);
    const lineAt = (idx: number) => {
      let lo = 0, hi = lineStarts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lineStarts[mid] <= idx) lo = mid; else hi = mid - 1;
      }
      return lo + 1;
    };
    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = p.re.exec(text))) {
        const value = valueOf(p.key, m);
        if (p.key === "serverEndpoints" && !value.startsWith("/")) continue;
        (inv[p.key] as Hit[]).push({ value, file: f, line: lineAt(m.index), detail: p.detail?.(m) });
      }
    }
  }
  // De-duplicate env vars and services to first occurrence per file
  for (const k of ["envVars", "externalServices"] as const) {
    const seen = new Set<string>();
    inv[k] = inv[k].filter((h) => {
      const key = `${h.value}@${h.file}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  return inv;
}

function uniq(hits: Hit[], withDetail = false) {
  return new Set(hits.map((h) => (withDetail && h.detail ? `${h.detail} ${h.value}` : h.value)));
}

export function compareInventories(a: Inventory, b: Inventory): string {
  const out: string[] = [];
  const short = (s: string) => s.slice(0, 7);
  out.push(`# Inventory comparison: \`${a.ref}\` vs \`${b.ref}\``);
  out.push("");
  out.push(`- **${a.ref}** at \`${short(a.commit)}\` (${a.commitDate.slice(0, 10)}): ${a.totals.files} files, ${a.totals.codeFiles} code, ${a.totals.docFiles} docs`);
  out.push(`- **${b.ref}** at \`${short(b.commit)}\` (${b.commitDate.slice(0, 10)}): ${b.totals.files} files, ${b.totals.codeFiles} code, ${b.totals.docFiles} docs`);
  out.push("");
  out.push("This is a structural source map produced by `catalogue-kit/scripts/inventory.ts`. A route, endpoint, or table existing is *indirect* evidence only. It does not show that a function works, and names that match may still behave differently.");
  out.push("");
  const section = (title: string, key: "clientRoutes" | "serverEndpoints" | "dbTables" | "pages" | "envVars" | "externalServices", withDetail = false) => {
    const A = uniq(a[key], withDetail), B = uniq(b[key], withDetail);
    const onlyA = [...A].filter((x) => !B.has(x)).sort();
    const onlyB = [...B].filter((x) => !A.has(x)).sort();
    const both = [...A].filter((x) => B.has(x)).sort();
    out.push(`## ${title}`);
    out.push("");
    out.push(`| | count | items |`);
    out.push(`|---|---|---|`);
    const fmt = (xs: string[]) => (xs.length ? xs.map((x) => `\`${x}\``).join(", ") : "—");
    out.push(`| only in ${a.ref} | ${onlyA.length} | ${fmt(onlyA)} |`);
    out.push(`| only in ${b.ref} | ${onlyB.length} | ${fmt(onlyB)} |`);
    out.push(`| in both | ${both.length} | ${fmt(both)} |`);
    out.push("");
  };
  section("Client routes (screens)", "clientRoutes");
  section("Pages (files under `pages/`)", "pages");
  section("Server endpoints", "serverEndpoints", true);
  section("Database tables", "dbTables");
  section("External services (by import)", "externalServices");
  section("Environment variables", "envVars");
  out.push("## Agent instruction files");
  out.push("");
  out.push(`- ${a.ref}: ${a.agentInstructionFiles.length ? a.agentInstructionFiles.map((x) => `\`${x}\``).join(", ") : "none"}`);
  out.push(`- ${b.ref}: ${b.agentInstructionFiles.length ? b.agentInstructionFiles.map((x) => `\`${x}\``).join(", ") : "none"}`);
  out.push("");
  return out.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outPath = outIdx >= 0 ? args[outIdx + 1] : undefined;
  const rest = outIdx >= 0 ? args.filter((_, i) => i !== outIdx && i !== outIdx + 1) : args;
  const write = (content: string) => {
    if (!outPath) return void process.stdout.write(content + "\n");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content + "\n");
    console.error(`wrote ${outPath}`);
  };

  if (rest[0] === "--compare") {
    const [fa, fb] = rest.slice(1);
    if (!fa || !fb) throw new Error("--compare needs two inventory JSON files");
    write(compareInventories(JSON.parse(readFileSync(fa, "utf8")), JSON.parse(readFileSync(fb, "utf8"))));
    return;
  }
  if (rest[0] === "--changed") {
    const [old, ref = "HEAD"] = rest.slice(1);
    if (!old) throw new Error("--changed needs an inventory JSON file");
    const prev: Inventory = JSON.parse(readFileSync(old, "utf8"));
    const changed = git("diff", "--name-only", prev.commit, ref).split("\n").filter(Boolean);
    write(JSON.stringify({ since: prev.commit, ref, changedFiles: changed }, null, 2));
    return;
  }
  const ref = rest[0];
  if (!ref) {
    console.error("usage: inventory.ts <ref> [--out file.json] | --compare a.json b.json | --changed old.json [ref]");
    process.exit(2);
  }
  write(JSON.stringify(buildInventory(ref), null, 2));
}

if (process.argv[1] && /inventory\.ts$/.test(process.argv[1])) main();
