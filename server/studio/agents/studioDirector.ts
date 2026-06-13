import type { SwarmRequest } from "@shared/schema";
import { chatJSON } from "../llm";
import { inferSkillFamily } from "./heuristics";
import type { DirectorPlan } from "./types";

const DEFAULT_OUTPUTS = ["construction_plate", "ghosted_overlay", "finished_reference", "practice_card"];

const SYSTEM = `You are the Studio Director for Line All Richie (LAR) Studio, a primitive-based drawing curriculum.
Given a drawing request, decide the learning goal, drawing level (1-10), subject, skill family, output formats, and whether this is practice, reference, critique, or canon material.
Respond as JSON: { "subject", "learningGoal", "level", "skillFamily", "style", "outputs": string[], "material": "practice"|"reference"|"critique"|"canon" }.`;

// Studio Director: frames the brief everyone else works from.
export async function studioDirector(req: SwarmRequest): Promise<DirectorPlan> {
  const fallback: DirectorPlan = {
    subject: req.subject,
    learningGoal: req.learningGoal ?? `Construct "${req.subject}" from primitive forms`,
    level: req.level ?? 3,
    skillFamily: inferSkillFamily(req.subject),
    style: req.style ?? "atelier worksheet with ghosted primitive overlays",
    outputs: req.outputs?.length ? req.outputs : DEFAULT_OUTPUTS,
    material: "reference",
  };

  const llm = await chatJSON<Partial<DirectorPlan>>(
    SYSTEM,
    `Request: ${JSON.stringify(req)}`,
  );
  if (!llm) return fallback;

  return {
    subject: llm.subject || fallback.subject,
    learningGoal: llm.learningGoal || fallback.learningGoal,
    level: typeof llm.level === "number" ? llm.level : fallback.level,
    skillFamily: llm.skillFamily || fallback.skillFamily,
    style: llm.style || fallback.style,
    outputs: llm.outputs?.length ? llm.outputs : fallback.outputs,
    material: llm.material || fallback.material,
  };
}
