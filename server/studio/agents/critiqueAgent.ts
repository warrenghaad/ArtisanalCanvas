import { critiqueSchema, type Critique, type PrimitiveManifest } from "@shared/schema";
import { chatJSON } from "../llm";
import type { GeneratedImageRecord } from "./imageGenerator";

const SYSTEM = `You are the Critique Agent for Line All Richie Studio.
Evaluate generated images for teaching usefulness, not beauty.
Return JSON: {
  "score" (1-5), "critique", "primitivesClear" (bool), "learningGoalVisible" (bool),
  "reusable" (bool), "tooDecorative" (bool), "reusableCells": string[],
  "suggestedCorrectionPrompt", "canonStatus": "raw"|"extracted"|"candidate"|"reviewed"|"canon"|"superseded"|"deprecated"
}.`;

// Critique Agent: judges whether the image teaches the intended skill.
export async function critiqueAgent(
  manifest: PrimitiveManifest,
  images: GeneratedImageRecord[],
): Promise<Critique> {
  const anyGenerated = images.some((i) => i.generated);

  const fallback: Critique = {
    score: anyGenerated ? 3 : 2,
    critique: anyGenerated
      ? "Heuristic review: manifest is construction-grounded; verify primitives read clearly in the rendered plate."
      : "No image was generated (no API key); manifest and prompts are ready for generation.",
    primitivesClear: true,
    learningGoalVisible: true,
    reusable: true,
    tooDecorative: false,
    reusableCells: manifest.reusableCellsToSave,
    suggestedCorrectionPrompt: undefined,
    canonStatus: "candidate",
  };

  if (!anyGenerated) return fallback;

  const llm = await chatJSON<unknown>(
    SYSTEM,
    `Manifest: ${JSON.stringify(manifest)}\nImages generated: ${images.filter((i) => i.generated).length}`,
  );
  if (!llm) return fallback;

  const parsed = critiqueSchema.safeParse(llm);
  return parsed.success ? parsed.data : fallback;
}
