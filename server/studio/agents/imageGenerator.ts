import { generateImage, type GeneratedImageResult } from "../openaiImages";
import type { ImagePromptSpec } from "./types";

export interface GeneratedImageRecord extends GeneratedImageResult {
  purpose: string;
}

// Image Generator: calls OpenAI image generation for each prompt spec and
// returns metadata (image path is null when no API key / generation failed).
export async function imageGenerator(
  specs: ImagePromptSpec[],
  enabled = true,
): Promise<GeneratedImageRecord[]> {
  if (!enabled) {
    return specs.map((s) => ({
      purpose: s.purpose,
      prompt: s.prompt,
      imagePath: null,
      model: "gpt-image-1",
      generated: false,
    }));
  }
  const results: GeneratedImageRecord[] = [];
  for (const spec of specs) {
    const result = await generateImage(spec.prompt);
    results.push({ ...result, purpose: spec.purpose });
  }
  return results;
}
