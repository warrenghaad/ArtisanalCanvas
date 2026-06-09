import { primitiveManifestSchema, type PrimitiveManifest } from "@shared/schema";
import { chatJSON } from "../llm";
import { decomposeHeuristically } from "./heuristics";
import type { DirectorPlan } from "./types";

const SYSTEM = `You are the Primitive Decomposer for Line All Richie Studio.
Analyze the subject BEFORE any image is generated. Break it into reusable visual components, not a description.
Always prioritize: volume before contour, structure before detail, axis before decoration, reusable cells before one-off images.
Return JSON matching: {
  "subject", "learningGoal", "level" (1-10), "skillFamily",
  "primitives": [{ "name", "type", "role", "category": "geometric"|"sacred"|"figure"|"other" }],
  "axes": string[], "planes": string[], "hinges": string[], "rhythmLines": string[],
  "valueColorStructure": string[], "reusableCellsToSave": string[], "imageOutputs": string[]
}.
Every drawing must start from base GEOMETRIC primitives, then aesthetic/SACRED geometry, then FIGURE specifics, then other.`;

// Primitive Decomposer: the heart of the studio. Describes the parts first.
// Heuristic baseline guarantees a complete manifest; LLM output (when present)
// is merged on top so we never lose the geometric foundation.
export async function primitiveDecomposer(plan: DirectorPlan): Promise<PrimitiveManifest> {
  const baseline = decomposeHeuristically(plan);

  const llm = await chatJSON<unknown>(SYSTEM, `Subject: ${plan.subject}\nLearning goal: ${plan.learningGoal}\nLevel: ${plan.level}`);
  if (!llm) return baseline;

  const parsed = primitiveManifestSchema.safeParse(llm);
  if (!parsed.success) return baseline;

  // Merge: keep the LLM's richer reading but guarantee base geometric primitives
  // and the requested image outputs are present.
  const merged: PrimitiveManifest = {
    ...baseline,
    ...parsed.data,
    primitives: dedupeByName([...baseline.primitives.filter((p) => p.category === "geometric"), ...parsed.data.primitives]),
    imageOutputs: parsed.data.imageOutputs.length ? parsed.data.imageOutputs : baseline.imageOutputs,
    reusableCellsToSave: parsed.data.reusableCellsToSave.length
      ? parsed.data.reusableCellsToSave
      : baseline.reusableCellsToSave,
  };
  return merged;
}

function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
