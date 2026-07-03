import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Local-first asset storage. Generated images and manifests are written to the
// repo-local ASSET_DIR (default ./assets) so they can be inspected, committed,
// or later synced to GitHub/Notion. Nothing is pushed to an external service
// at generation time.
export const ASSET_DIR = process.env.ASSET_DIR
  ? path.resolve(process.env.ASSET_DIR)
  : path.resolve(process.cwd(), "assets");

export const ASSET_SUBDIRS = {
  generated: path.join(ASSET_DIR, "generated"),
  primitives: path.join(ASSET_DIR, "primitives"),
  references: path.join(ASSET_DIR, "references"),
  manifests: path.join(ASSET_DIR, "manifests"),
} as const;

async function ensureDirs(): Promise<void> {
  await Promise.all(
    Object.values(ASSET_SUBDIRS).map((dir) => fs.mkdir(dir, { recursive: true })),
  );
}

// Persist a base64-encoded PNG to assets/generated and return its relative path.
export async function saveGeneratedImage(base64: string, id = randomUUID()): Promise<string> {
  await ensureDirs();
  const filePath = path.join(ASSET_SUBDIRS.generated, `${id}.png`);
  await fs.writeFile(filePath, Buffer.from(base64, "base64"));
  return path.relative(process.cwd(), filePath);
}

// Persist a JSON manifest alongside the generated image for portability/export.
// A short unique suffix is appended so repeated runs with the same subject never
// overwrite each other's manifest (preserving local export history).
export async function saveManifest(name: string, data: unknown): Promise<string> {
  await ensureDirs();
  const safe = name.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || "manifest";
  const filePath = path.join(ASSET_SUBDIRS.manifests, `${safe}-${randomUUID().slice(0, 8)}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return path.relative(process.cwd(), filePath);
}
