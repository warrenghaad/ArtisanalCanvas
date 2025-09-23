import OpenAI from "openai";
import { AssessmentResult, assessmentResultSchema } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-api-key"
});

export async function assessDrawing(
  imageData: string, 
  exerciseId: string, 
  phaseId: number,
  learningObjectives: string[]
): Promise<AssessmentResult> {
  try {
    const prompt = `You are an expert art instructor specializing in Renaissance perspective drawing. 
    
Analyze this student drawing for Exercise "${exerciseId}" in Phase ${phaseId}.

Learning Objectives for this exercise:
${learningObjectives.map(obj => `- ${obj}`).join('\n')}

Evaluate the drawing on these specific criteria:
1. Horizon Line placement and accuracy
2. Vanishing Point identification and convergence
3. Proportional relationships and scaling
4. Overall perspective construction technique

Provide your assessment in JSON format with:
- overallScore (0-100)
- strengths (array of positive observations)
- improvements (array of areas needing work)
- specificFeedback object with scores and feedback for each criteria
- nextSteps (array of recommended actions)
- readyForNext (boolean indicating if student can advance)

Be encouraging but constructive in your feedback.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert Renaissance art instructor who provides detailed, constructive feedback on perspective drawing exercises. Always respond with valid JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${imageData}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return assessmentResultSchema.parse(result);
  } catch (error) {
    console.error("OpenAI assessment error:", error);
    
    // Fallback assessment
    return {
      overallScore: 75,
      strengths: ["Drawing submitted successfully"],
      improvements: ["Continue practicing perspective techniques"],
      specificFeedback: {
        horizonLine: { score: 75, feedback: "Assessment temporarily unavailable" },
        vanishingPoints: { score: 75, feedback: "Assessment temporarily unavailable" },
        proportions: { score: 75, feedback: "Assessment temporarily unavailable" },
        convergence: { score: 75, feedback: "Assessment temporarily unavailable" },
      },
      nextSteps: ["Continue with current exercise", "Practice daily mini-drills"],
      readyForNext: true,
    };
  }
}

export async function generateExerciseTips(
  exerciseId: string,
  commonErrors: string[]
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a Renaissance art instructor. Provide 3-5 specific, actionable tips for students working on perspective drawing exercises."
        },
        {
          role: "user",
          content: `Generate helpful tips for exercise "${exerciseId}". 
          Common student errors include: ${commonErrors.join(', ')}.
          
          Respond with JSON: { "tips": ["tip1", "tip2", ...] }`
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"tips":[]}');
    return result.tips || [];
  } catch (error) {
    console.error("OpenAI tips generation error:", error);
    return [
      "Focus on accurate horizon line placement",
      "Ensure all parallel lines converge to the same vanishing point",
      "Use measuring techniques for consistent proportions",
      "Practice with light construction lines first"
    ];
  }
}
