import OpenAI from "openai";
import { saveGeneratedImage } from "./assetStore";

// Image generation service. Uses OpenAI's gpt-image-1 model and saves the
// result to the local asset store. When no API key is present it returns a
// placeholder record (no image file) so the swarm can still complete end to end.

const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR;
export const imagesAvailable = Boolean(apiKey);

const client = apiKey ? new OpenAI({ apiKey }) : null;

export const STUDIO_IMAGE_MODEL = "gpt-image-1";

export interface GeneratedImageResult {
  prompt: string;
  imagePath: string | null;
  model: string;
  generated: boolean;
  error?: string;
}

export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1536x1024" | "1024x1536" = "1024x1024",
): Promise<GeneratedImageResult> {
  if (!client) {
    return { prompt, imagePath: null, model: STUDIO_IMAGE_MODEL, generated: false };
  }
  try {
    const result = await client.images.generate({
      model: STUDIO_IMAGE_MODEL,
      prompt,
      size,
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return {
        prompt,
        imagePath: null,
        model: STUDIO_IMAGE_MODEL,
        generated: false,
        error: "No image data returned",
      };
    }
    const imagePath = await saveGeneratedImage(b64);
    return { prompt, imagePath, model: STUDIO_IMAGE_MODEL, generated: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[studio] image generation failed:", message);
    return { prompt, imagePath: null, model: STUDIO_IMAGE_MODEL, generated: false, error: message };
  }
}
