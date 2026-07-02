import type { PrimitiveManifest } from "@shared/schema";
import type { DirectorPlan, ImagePromptSpec } from "./types";

// Per-output framing so each image teaches something specific.
const PURPOSE_FRAMING: Record<string, string> = {
  construction_plate: "Construction plate: show the primitive block-in only, clean line, numbered build order.",
  ghosted_overlay: "Ghosted primitive overlay: the finished form with translucent primitive solids visible underneath.",
  finished_reference: "Finished reference: rendered form with form shadows, but construction still readable.",
  practice_card: "Practice worksheet card: empty practice boxes beside a small worked example.",
  expression_sheet: "Expression breakdown sheet: the same construction driving several expressions.",
  cel_sheet: "Animation cel sheet: the reusable component isolated, labelled, on a neutral field.",
};

// Prompt Architect: converts a primitive manifest into educational image prompts.
// Deterministic so it always emits construction-grounded prompts (never vague art).
export function promptArchitect(manifest: PrimitiveManifest, plan: DirectorPlan): ImagePromptSpec[] {
  const primitiveList = manifest.primitives
    .map((p) => `${p.name} (${p.type}, ${p.role})`)
    .join("; ");
  const axes = manifest.axes.join(", ");
  const planes = manifest.planes.join(", ");
  const valueColor = manifest.valueColorStructure.join(", ");

  const base =
    `Educational drawing asset for an atelier curriculum. Subject: ${manifest.subject}. ` +
    `Learning goal: ${manifest.learningGoal} (level ${manifest.level}, ${manifest.skillFamily}). ` +
    `Build strictly from these primitive forms: ${primitiveList}. ` +
    `Respect axes: ${axes}. Planes: ${planes}. Value/color logic: ${valueColor}. ` +
    `Style: ${plan.style}. Volume before contour, structure before detail. ` +
    `Monochrome construction lines with clear, deliberate line weight. The image must teach the construction, not decorate.`;

  return manifest.imageOutputs.map((purpose) => ({
    purpose,
    prompt: `${base} ${PURPOSE_FRAMING[purpose] ?? `Output format: ${purpose}.`}`,
  }));
}
