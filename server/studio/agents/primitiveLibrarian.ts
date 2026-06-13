import type { InsertPrimitiveCell, PrimitiveManifest, Critique } from "@shared/schema";

function slug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

// Primitive Librarian: turns the manifest into reusable primitive-cell records
// ("animation cels") to persist. Each cell carries a reusable prompt fragment,
// construction steps, and reuse cases so it can be recombined later.
export function primitiveLibrarian(
  manifest: PrimitiveManifest,
  critique: Critique,
): InsertPrimitiveCell[] {
  // Names the swarm explicitly flagged as worth saving (slug form).
  const flagged = new Set(
    [...manifest.reusableCellsToSave, ...critique.reusableCells].map(slug),
  );

  const cells: InsertPrimitiveCell[] = manifest.primitives.map((p, i) => {
    const name = slug(p.name);
    const flaggedForReuse = flagged.has(name);
    return {
      name,
      primitiveType: p.type,
      category: p.category,
      description: `${p.role} — derived from "${manifest.subject}".`,
      reusablePrompt: `${p.name} as a ${p.type}: ${p.role}. Use as a reusable building block.`,
      constructionSteps: [
        `Block in the ${p.type} for ${p.name}.`,
        `Align it to the established axis/planes.`,
        `Refine where it meets neighbouring primitives.`,
      ],
      reuseCases: [manifest.skillFamily ?? "primitive_forms", manifest.subject],
      tags: [p.category, manifest.skillFamily ?? "primitive_forms"],
      orderIndex: i,
      // Cells the crew flagged for reuse become candidates; the rest are raw extractions.
      status: flaggedForReuse ? "candidate" : "extracted",
    } satisfies InsertPrimitiveCell;
  });

  return cells;
}
