import { critiqueSchema, type Critique, type PrimitiveManifest } from "@shared/schema";
import { chatJSONVision } from "../llm";
import type { GeneratedImageRecord } from "./imageGenerator";

const SYSTEM = `You are the Critique Agent for Line All Richie Studio.
Evaluate the attached generated image(s) for teaching usefulness, not beauty.
Judge what you actually see in the image against the manifest.
Return JSON: {
  "score" (1-5), "critique", "primitivesClear" (bool), "learningGoalVisible" (bool),
  "reusable" (bool), "tooDecorative" (bool), "reusableCells": string[],
  "suggestedCorrectionPrompt", "canonStatus": "raw"|"extracted"|"candidate"|"reviewed"|"canon"|"superseded"|"deprecated"
}.`;

// Critique Agent: judges whether the image teaches the intended skill. It sends
// the actual rendered image(s) to a vision model; if the image bytes can't be
// read (or there's no API key), it stays heuristic and marks basedOnImage=false
// so the Canon Clerk won't promote it on metadata alone.
export async function critiqueAgent(
  manifest: PrimitiveManifest,
  images: GeneratedImageRecord[],
): Promise<Critique> {
  const imagePaths = images
    .filter((i) => i.generated && i.imagePath)
    .map((i) => i.imagePath as string);

  const fallback: Critique = {
    score: imagePaths.length ? 3 : 2,
    critique: imagePaths.length
      ? "Heuristic review (image not inspected by vision): manifest is construction-grounded; verify primitives read clearly in the rendered plate before promoting."
      : "No image was generated (no API key); manifest and prompts are ready for generation.",
    primitivesClear: true,
    learningGoalVisible: true,
    reusable: true,
    tooDecorative: false,
    reusableCells: manifest.reusableCellsToSave,
    suggestedCorrectionPrompt: undefined,
    canonStatus: "candidate",
    basedOnImage: false,
  };

  if (!imagePaths.length) return fallback;

  const { data, sawImage } = await chatJSONVision<unknown>(
    SYSTEM,
    `Manifest: ${JSON.stringify(manifest)}\nJudge the attached image(s) against it.`,
    imagePaths,
  );
  if (!data) return fallback;

  const parsed = critiqueSchema.safeParse(data);
  if (!parsed.success) return fallback;

  // Only trust the LLM's status when it actually saw the image.
  return { ...parsed.data, basedOnImage: sawImage };
}
