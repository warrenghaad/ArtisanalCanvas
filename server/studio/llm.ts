import OpenAI from "openai";
import { promises as fs } from "fs";
import path from "path";

// Shared LLM access for studio agents. The whole swarm is designed to degrade
// gracefully: when no OPENAI_API_KEY is configured, agents fall back to
// deterministic heuristics so the pipeline still produces a complete, useful
// primitive manifest / lesson without any network calls.

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not
// change this unless explicitly requested by the user
export const STUDIO_TEXT_MODEL = "gpt-5";

const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR;
export const llmAvailable = Boolean(apiKey);

const client = apiKey ? new OpenAI({ apiKey }) : null;

// Ask the model for a JSON object. Returns null on any failure so callers can
// fall back to heuristics rather than throwing the whole request away.
export async function chatJSON<T = Record<string, unknown>>(
  system: string,
  user: string,
): Promise<T | null> {
  if (!client) return null;
  try {
    const response = await client.chat.completions.create({
      model: STUDIO_TEXT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      // GPT-5 on Chat Completions uses max_completion_tokens; max_tokens is rejected.
      max_completion_tokens: 1500,
    });
    const content = response.choices[0]?.message?.content;
    return content ? (JSON.parse(content) as T) : null;
  } catch (error) {
    console.error("[studio] LLM call failed, falling back to heuristics:", error);
    return null;
  }
}

// Vision variant: sends one or more local image files alongside the prompt so
// the model can actually evaluate rendered output (used by the Critique Agent).
// Returns { data, sawImage } — sawImage is true only when at least one image was
// successfully read and sent, so callers can refuse to promote metadata-only
// critiques. Returns data:null on any failure so callers fall back to heuristics.
export async function chatJSONVision<T = Record<string, unknown>>(
  system: string,
  user: string,
  imagePaths: string[],
): Promise<{ data: T | null; sawImage: boolean }> {
  if (!client) return { data: null, sawImage: false };

  const imageParts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
  for (const rel of imagePaths) {
    try {
      const abs = path.isAbsolute(rel) ? rel : path.resolve(process.cwd(), rel);
      const b64 = (await fs.readFile(abs)).toString("base64");
      imageParts.push({ type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } });
    } catch (error) {
      console.error(`[studio] could not read image for critique (${rel}):`, error);
    }
  }

  const sawImage = imageParts.length > 0;
  try {
    const response = await client.chat.completions.create({
      model: STUDIO_TEXT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: [{ type: "text", text: user }, ...imageParts] },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1500,
    });
    const content = response.choices[0]?.message?.content;
    return { data: content ? (JSON.parse(content) as T) : null, sawImage };
  } catch (error) {
    console.error("[studio] vision LLM call failed, falling back to heuristics:", error);
    return { data: null, sawImage: false };
  }
}
