import type { PrimitiveManifest } from "@shared/schema";
import { chatJSON } from "../llm";
import type { CurriculumPlacement } from "./types";

// Ordered learning progression (multi-dimensional, not a strict staircase).
const PROGRESSION = [
  "line_quality",
  "primitive_forms",
  "face_expression",
  "public_observation",
  "texture_emotion",
  "color_structure",
  "impossible_forms",
  "narrative_composition",
];

const SYSTEM = `You are the Curriculum Mapper for Line All Richie Studio.
Given a primitive manifest, place the request on the drawing progression.
Return JSON: { "level" (1-10), "skillFamily", "prerequisites": string[], "nextStep", "relatedConcepts": string[] }.`;

export async function curriculumMapper(manifest: PrimitiveManifest): Promise<CurriculumPlacement> {
  const family = manifest.skillFamily ?? "primitive_forms";
  const idx = Math.max(0, PROGRESSION.indexOf(family));

  const fallback: CurriculumPlacement = {
    level: manifest.level,
    skillFamily: family,
    prerequisites: idx > 0 ? [PROGRESSION[idx - 1]] : [],
    nextStep: PROGRESSION[Math.min(PROGRESSION.length - 1, idx + 1)],
    relatedConcepts: PROGRESSION.filter((p) => p !== family).slice(0, 3),
  };

  const llm = await chatJSON<Partial<CurriculumPlacement>>(
    SYSTEM,
    `Manifest: ${JSON.stringify({ subject: manifest.subject, skillFamily: family, level: manifest.level })}`,
  );
  if (!llm) return fallback;

  return {
    level: typeof llm.level === "number" ? llm.level : fallback.level,
    skillFamily: llm.skillFamily || fallback.skillFamily,
    prerequisites: llm.prerequisites?.length ? llm.prerequisites : fallback.prerequisites,
    nextStep: llm.nextStep || fallback.nextStep,
    relatedConcepts: llm.relatedConcepts?.length ? llm.relatedConcepts : fallback.relatedConcepts,
  };
}
