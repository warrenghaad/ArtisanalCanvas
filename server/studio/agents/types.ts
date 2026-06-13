import type { PrimitiveManifest, Critique } from "@shared/schema";

// Output of the Studio Director: the framed brief the rest of the crew works from.
export interface DirectorPlan {
  subject: string;
  learningGoal: string;
  level: number;
  skillFamily: string;
  style: string;
  outputs: string[];
  // What kind of material this run produces.
  material: "practice" | "reference" | "critique" | "canon";
}

// Output of the Curriculum Mapper: where this sits on the learning progression.
export interface CurriculumPlacement {
  level: number;
  skillFamily: string;
  prerequisites: string[];
  nextStep: string;
  relatedConcepts: string[];
}

// A single image prompt the Prompt Architect emits, tied to one output purpose.
export interface ImagePromptSpec {
  purpose: string;
  prompt: string;
}

// A practice exercise card produced for every run.
export interface PracticeCard {
  title: string;
  goal: string;
  steps: string[];
  checkpoints: string[];
}

export type { PrimitiveManifest, Critique };
