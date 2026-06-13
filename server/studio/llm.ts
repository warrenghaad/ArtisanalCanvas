import OpenAI from "openai";

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
      max_tokens: 1500,
    });
    const content = response.choices[0]?.message?.content;
    return content ? (JSON.parse(content) as T) : null;
  } catch (error) {
    console.error("[studio] LLM call failed, falling back to heuristics:", error);
    return null;
  }
}
